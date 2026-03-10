import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, User, Mail, Globe, Briefcase, Save, LogOut, Trash2, Upload, Check } from 'lucide-react';

export default function ProfileModal({ user, onSave, onLogout, onClose }) {
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [currency, setCurrency] = useState(user.currency || 'INR');
    const [bio, setBio] = useState(user.bio || '');
    const [avatar, setAvatar] = useState(user.avatar || null);
    const [saved, setSaved] = useState(false);
    const [avatarHovered, setAvatarHovered] = useState(false);
    const [, setShowAvatarMenu] = useState(false);
    const fileRef = useRef(null);

    const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'CAD', 'AUD', 'JPY'];

    const initials = name
        ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'AH';

    const handlePhoto = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => { setAvatar(ev.target.result); setShowAvatarMenu(false); };
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        setAvatar(null);
        setShowAvatarMenu(false);
    };

    const handleSave = async () => {
        try {
            const token = user.token || JSON.parse(localStorage.getItem('flx_user'))?.token;
            const res = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
                body: JSON.stringify({ name, email, currency, bio, avatar })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Profile update failed');
            localStorage.setItem('flx_user', JSON.stringify(data));
            onSave(data);
        } catch {
            const updated = { ...user, name, email, currency, bio, avatar, role: `Freelancer · ${currency} Node` };
            localStorage.setItem('flx_user', JSON.stringify(updated));
            onSave(updated);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2200);
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
                    initial={{ opacity: 0, y: 28, scale: .95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: .96 }}
                    transition={{ type: 'spring', stiffness: 65, damping: 16 }}
                    style={{ maxWidth: 500 }}
                >
                    {/* Header */}
                    <div className="modal-head">
                        <div>
                            <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-.02em' }}>
                                Edit Profile
                            </div>
                            <div style={{ fontSize: '.75rem', color: 'var(--t3)', marginTop: 3 }}>
                                Manage your account settings
                            </div>
                        </div>
                        <button className="icon-btn" onClick={onClose}><X size={15} /></button>
                    </div>

                    <div className="modal-body" style={{ gap: 16 }}>

                        {/* ── Avatar Editor ── */}
                        <div className="prf-avatar-section">
                            {/* Avatar circle */}
                            <div
                                className="prf-avatar-ring"
                                onMouseEnter={() => setAvatarHovered(true)}
                                onMouseLeave={() => setAvatarHovered(false)}
                                onClick={() => setShowAvatarMenu(m => !m)}
                            >
                                {avatar
                                    ? <img src={avatar} alt="avatar" className="prf-avatar-img" />
                                    : (
                                        <div className="prf-avatar-placeholder">
                                            <span className="prf-avatar-initials">{initials}</span>
                                        </div>
                                    )
                                }
                                {/* Hover overlay */}
                                <AnimatePresence>
                                    {avatarHovered && (
                                        <motion.div
                                            className="prf-avatar-overlay"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: .15 }}
                                        >
                                            <Camera size={20} color="white" />
                                            <span>Edit</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {/* Online dot */}
                                <span className="prf-avatar-online" />
                            </div>

                            {/* Name & email below avatar */}
                            <div className="prf-avatar-info">
                                <div style={{ fontSize: '.9375rem', fontWeight: 800, color: 'var(--t1)' }}>
                                    {name || 'Your Name'}
                                </div>
                                <div style={{ fontSize: '.75rem', color: 'var(--t3)', marginTop: 2 }}>{email}</div>
                                <div style={{ fontSize: '.65rem', color: 'var(--vl)', marginTop: 4, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                                    {currency} Node · Freelancer
                                </div>
                            </div>

                            {/* Avatar action buttons */}
                            <div className="prf-avatar-actions">
                                <button className="prf-avatar-btn prf-avatar-btn-upload"
                                    onClick={() => fileRef.current?.click()}>
                                    <Upload size={13} /> Upload Photo
                                </button>
                                {avatar && (
                                    <button className="prf-avatar-btn prf-avatar-btn-remove"
                                        onClick={handleRemovePhoto}>
                                        <Trash2 size={13} /> Remove
                                    </button>
                                )}
                            </div>

                            <input ref={fileRef} type="file" accept="image/*"
                                style={{ display: 'none' }} onChange={handlePhoto} />
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '0 0 2px' }} />

                        {/* ── Form Fields ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="field-group">
                                <label className="field-label"><User size={11} /> Full Name</label>
                                <input className="field-input" value={name}
                                    onChange={e => setName(e.target.value)} placeholder="Your full name"
                                    style={{ padding: '9px 11px', fontSize: '.875rem' }} />
                            </div>
                            <div className="field-group">
                                <label className="field-label"><Globe size={11} /> Base Currency</label>
                                <select className="field-input" value={currency}
                                    onChange={e => setCurrency(e.target.value)}
                                    style={{ appearance: 'auto', padding: '9px 11px', fontSize: '.875rem' }}>
                                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="field-group">
                            <label className="field-label"><Mail size={11} /> Email Address</label>
                            <input className="field-input" type="email" value={email}
                                onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                                style={{ padding: '9px 11px', fontSize: '.875rem' }} />
                        </div>

                        <div className="field-group">
                            <label className="field-label"><Briefcase size={11} /> Bio / Skills</label>
                            <textarea className="field-input" rows={2} value={bio}
                                onChange={e => setBio(e.target.value)}
                                placeholder="Full-stack developer · React, Node.js · Available worldwide"
                                style={{ resize: 'vertical', minHeight: 68, padding: '9px 11px', fontSize: '.875rem' }} />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-foot">
                        <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--rl)', borderColor: 'rgba(225,29,72,.2)', gap: 6 }}
                            onClick={() => { localStorage.removeItem('flx_user'); onLogout(); }}
                        >
                            <LogOut size={13} /> Sign Out
                        </button>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
                            <motion.button
                                className={`btn btn-sm ${saved ? 'btn-saved' : 'btn-primary'}`}
                                onClick={handleSave}
                                whileTap={{ scale: .95 }}
                                animate={saved ? { scale: [1, 1.06, 1] } : {}}
                                transition={{ duration: .3 }}
                            >
                                {saved
                                    ? <><Check size={14} /> Saved!</>
                                    : <><Save size={13} /> Save Changes</>
                                }
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
