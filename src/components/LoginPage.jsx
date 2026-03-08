import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin }) {
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all fields.'); return; }
        if (mode === 'signup' && !name) { setError('Please enter your name.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

        setLoading(true);
        try {
            const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
            const body = mode === 'signup'
                ? JSON.stringify({ name, email, password })
                : JSON.stringify({ email, password });

            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            localStorage.setItem('flx_user', JSON.stringify(data));
            onLogin(data);
        } catch (err) {
            setError(err.message || 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">
            {/* Ambient glows */}
            <div className="login-glow-v" />
            <div className="login-glow-b" />

            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 30, scale: .97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 60, damping: 18 }}
            >
                {/* Logo */}
                <div className="login-logo">
                    <div className="brand-logo" style={{ width: 52, height: 52, borderRadius: 16 }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L3 7v10l9 5 9-5V7L12 2Z" fill="url(#lg2)" opacity=".9" />
                            <path d="M12 2L3 7l9 5 9-5L12 2Z" fill="white" opacity=".15" />
                            <path d="M8 10h8M8 13h5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="lg2" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#7c3aed" /><stop offset="1" stopColor="#2563eb" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-.035em', color: 'var(--t1)' }}>
                            Freelance<b style={{ color: 'var(--vl)' }}>X</b>
                        </div>
                        <div style={{ fontSize: '.7rem', color: 'var(--t3)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>
                            Currency Intelligence
                        </div>
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="login-toggle">
                    <button
                        className={`login-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); setError(''); }}
                    >Sign In</button>
                    <button
                        className={`login-tab ${mode === 'signup' ? 'active' : ''}`}
                        onClick={() => { setMode('signup'); setError(''); }}
                    >Create Account</button>
                </div>

                <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: .22 }}
                >
                    <h2 className="login-heading">
                        {mode === 'login' ? 'Welcome back 👋' : 'Join FreelanceX'}
                    </h2>
                    <p className="login-sub">
                        {mode === 'login'
                            ? 'Sign in to your currency intelligence dashboard'
                            : 'Start maximizing your global freelance earnings'}
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {mode === 'signup' && (
                        <div className="field-group">
                            <label className="field-label">Full Name</label>
                            <input
                                className="field-input"
                                placeholder="Abdul Haque"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                            />
                        </div>
                    )}

                    <div className="field-group">
                        <label className="field-label">Email Address</label>
                        <input
                            className="field-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoFocus={mode === 'login'}
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="field-input"
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{ paddingRight: 44 }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(p => !p)}
                                style={{
                                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                    color: 'var(--t3)', display: 'flex', alignItems: 'center',
                                }}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="login-error">{error}</div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 4 }}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="login-spinner" />
                        ) : (
                            <>
                                {mode === 'login' ? 'Sign In' : 'Create Account'}
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="login-or">
                    <div className="login-or-line" />
                    <span>or continue with</span>
                    <div className="login-or-line" />
                </div>

                {/* Social buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                        { name: 'Google', icon: '🔵', click: () => onLogin({ name: 'Abdul Haque', email: 'abdulhaque@gmail.com', avatar: null, role: 'Freelancer · INR Node' }) },
                        { name: 'GitHub', icon: '⚫', click: () => onLogin({ name: 'Abdul Haque', email: 'abdulhaque@github.com', avatar: null, role: 'Freelancer · INR Node' }) },
                    ].map(s => (
                        <button
                            key={s.name}
                            className="social-btn"
                            onClick={s.click}
                        >
                            <span>{s.icon}</span> {s.name}
                        </button>
                    ))}
                </div>

                <p style={{ textAlign: 'center', fontSize: '.8125rem', color: 'var(--t4)', marginTop: 16 }}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        style={{ color: 'var(--vl)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}
                        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                    >
                        {mode === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>

                {/* Feature highlights */}
                <div className="login-features">
                    {['100+ live currencies', 'AI arbitration engine', '0% platform fee'].map(f => (
                        <span key={f} className="login-feat-pill">
                            <Sparkles size={10} /> {f}
                        </span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
