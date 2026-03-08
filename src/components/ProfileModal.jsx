import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, User, Mail, Globe, Briefcase, Save, LogOut } from 'lucide-react';

export default function ProfileModal({ user, onSave, onLogout, onClose }) {
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [currency, setCurrency] = useState(user.currency || 'INR');
    const [bio, setBio] = useState(user.bio || '');
    const [avatar, setAvatar] = useState(user.avatar || null);
    const [saved, setSaved] = useState(false);
    const fileRef = useRef(null);

    const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'CAD', 'AUD', 'JPY'];

    const handlePhoto = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => setAvatar(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            // Provide token if we have one in the session
            const token = user.token || JSON.parse(localStorage.getItem('flx_user'))?.token;

            const res = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ name, email, currency, bio, avatar })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Profile update failed');

            localStorage.setItem('flx_user', JSON.stringify(data));
            onSave(data);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Backend update failed, falling back to local:", err);
            // Fallback if backend is unreachable 
            const updated = { ...user, name, email, currency, bio, avatar, role: `Freelancer · ${currency} Node` };
            localStorage.setItem('flx_user', JSON.stringify(updated));
            onSave(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={e => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    className="modal-card"
                    initial={{ opacity: 0, y: 30, scale: .96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: .96 }}
                    transition={{ type: 'spring', stiffness: 60, damping: 16 }}
                >
                    {/* Header */}
                    <div className="modal-head">
                        <div>
                            <div className="fw-8 t1 fs-lg">Edit Profile</div>
                            <div className="fs-xs t3 mt-2">Manage your account settings</div>
                        </div>
                        <button className="icon-btn" onClick={onClose}><X size={15} /></button>
                    </div>

                    <div className="modal-body">
                        {/* Avatar upload */}
                        <div className="profile-edit-avatar">
                            <div className="profile-edit-img-wrap" onClick={() => fileRef.current?.click()}>
                                {avatar
                                    ? <img src={avatar} alt="avatar" className="profile-edit-img" />
                                    : (
                                        <div className="profile-edit-placeholder">
                                            <User size={32} color="var(--t3)" />
                                        </div>
                                    )
                                }
                                <div className="profile-edit-overlay">
                                    <Camera size={20} color="white" />
                                    <span>Change Photo</span>
                                </div>
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handlePhoto}
                            />
                            <div style={{ textAlign: 'center' }}>
                                <div className="fw-7 t1 fs-base">{name || 'Your Name'}</div>
                                <div className="fs-xs t3 mt-2">{email}</div>
                            </div>
                        </div>

                        {/* Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="field-group">
                                <label className="field-label">
                                    <User size={12} /> Full Name
                                </label>
                                <input
                                    className="field-input"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className="field-group">
                                <label className="field-label">
                                    <Mail size={12} /> Email Address
                                </label>
                                <input
                                    className="field-input"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="field-group">
                                <label className="field-label">
                                    <Globe size={12} /> Base Currency
                                </label>
                                <select
                                    className="field-input curr-select"
                                    value={currency}
                                    onChange={e => setCurrency(e.target.value)}
                                    style={{ appearance: 'auto' }}
                                >
                                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="field-group">
                                <label className="field-label">
                                    <Briefcase size={12} /> Bio / Skills
                                </label>
                                <textarea
                                    className="field-input"
                                    rows={3}
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    placeholder="Full-stack developer · React, Node.js · Available worldwide"
                                    style={{ resize: 'vertical', minHeight: 80 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-foot">
                        <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--rl)', borderColor: 'rgba(225,29,72,.25)' }}
                            onClick={() => { localStorage.removeItem('flx_user'); onLogout(); }}
                        >
                            <LogOut size={14} /> Sign Out
                        </button>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={handleSave}>
                                {saved ? '✓ Saved!' : <><Save size={14} /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
