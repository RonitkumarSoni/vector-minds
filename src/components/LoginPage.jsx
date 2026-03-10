import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage({ onLogin }) {
    const [mode, setMode] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const handleVerify = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isVerified || verifying) return;
        setVerifying(true);
        setTimeout(() => { setVerifying(false); setIsVerified(true); setError(''); }, 1200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all fields.'); return; }
        if (mode === 'signup' && !name) { setError('Please enter your name.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (!isVerified) { setError('Please complete the human verification check.'); return; }
        setLoading(true);
        try {
            const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
            const body = mode === 'signup'
                ? JSON.stringify({ name, email, password })
                : JSON.stringify({ email, password });
            const backendURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
            const res = await fetch(`${backendURL}${endpoint}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Authentication failed');
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
            <div className="login-glow-v" />
            <div className="login-glow-b" />

            <motion.div
                className="login-split"
                initial={{ opacity: 0, y: 24, scale: .96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 70, damping: 20 }}
                style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column' }}
            >
                {/* ── Brand Logo Header ── */}
                <div style={{ padding: '32px 32px 0', display: 'flex', justifyContent: 'center' }}>
                    <div className="login-brand-logo" style={{ marginBottom: 0 }}>
                        <div style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem' }}>F</div>
                    </div>
                </div>

                {/* ── Right Form Panel ── */}
                <div className="login-form-panel">
                    {/* Toggle tabs */}
                    <div className="login-toggle" style={{ marginBottom: 20 }}>
                        <button className={`login-tab ${mode === 'login' ? 'active' : ''}`}
                            onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
                        <button className={`login-tab ${mode === 'signup' ? 'active' : ''}`}
                            onClick={() => { setMode('signup'); setError(''); }}>Create Account</button>
                    </div>

                    {/* Heading */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, x: mode === 'signup' ? 16 : -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: .18 }}
                            style={{ marginBottom: 18 }}
                        >
                            <h2 className="login-heading" style={{ fontSize: '1.3rem', marginBottom: 4 }}>
                                {mode === 'login' ? 'Welcome back 👋' : 'Join FreelanceX'}
                            </h2>
                            <p className="login-sub" style={{ marginBottom: 0, fontSize: '.8rem' }}>
                                {mode === 'login'
                                    ? 'Sign in to your currency intelligence dashboard'
                                    : 'Start maximizing your global freelance earnings'}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {mode === 'signup' && (
                            <div className="field-group">
                                <label className="field-label">Full Name</label>
                                <input className="field-input" placeholder="Abdul Haque"
                                    value={name} onChange={e => setName(e.target.value)} autoFocus
                                    style={{ padding: '9px 12px', fontSize: '.875rem' }} />
                            </div>
                        )}

                        <div className="field-group">
                            <label className="field-label">Email Address</label>
                            <input className="field-input" type="email" placeholder="you@example.com"
                                value={email} onChange={e => setEmail(e.target.value)}
                                autoFocus={mode === 'login'}
                                style={{ padding: '9px 12px', fontSize: '.875rem' }} />
                        </div>

                        <div className="field-group">
                            <label className="field-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input className="field-input" type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••" value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{ padding: '9px 12px', fontSize: '.875rem', paddingRight: 40 }} />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', display: 'flex' }}>
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Human verify */}
                        <div onClick={handleVerify} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: 'var(--bg2)', border: '1px solid var(--border)',
                            cursor: isVerified ? 'default' : 'pointer', borderRadius: 'var(--r-sm)',
                            padding: '10px 12px', transition: 'all 0.3s'
                        }}
                            onMouseOver={e => { if (!isVerified) e.currentTarget.style.borderColor = 'rgba(124,58,237,.3)'; }}
                            onMouseOut={e => { if (!isVerified) e.currentTarget.style.borderColor = 'var(--border)'; }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 20, height: 20, border: isVerified ? 'none' : '2px solid var(--t4)',
                                    borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: isVerified ? 'var(--gl)' : 'transparent',
                                }}>
                                    {verifying && <span className="login-spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />}
                                    {isVerified && <Check strokeWidth={4} size={12} color="#000" />}
                                </div>
                                <span style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--t2)' }}>Verify you are human</span>
                            </div>
                            <div style={{ opacity: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <ShieldCheck size={17} color="var(--t3)" />
                            </div>
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <button type="submit" className="btn btn-primary"
                            style={{ width: '100%', padding: '11px', fontSize: '.9rem' }} disabled={loading}>
                            {loading
                                ? <span className="login-spinner" />
                                : <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={15} /></>
                            }
                        </button>
                    </form>

                    <div style={{ marginTop: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                            <span style={{ fontSize: '.75rem', color: 'var(--t3)', letterSpacing: '0.05em' }}>OR CONTINUE WITH</span>
                            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="google-login-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        setLoading(true);
                                        setError('');
                                        try {
                                            // Decode JWT on the frontend for instant hackathon auth
                                            const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));

                                            const backendURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
                                            const res = await fetch(`${backendURL}/api/auth/google`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    email: payload.email,
                                                    name: payload.name,
                                                    picture: payload.picture,
                                                }),
                                            });
                                            const data = await res.json();
                                            if (!res.ok) throw new Error(data.message || 'Google Auth failed');
                                            localStorage.setItem('flx_user', JSON.stringify(data));
                                            onLogin(data);
                                        } catch (err) {
                                            setError(err.message || 'Google Auth error');
                                            setLoading(false);
                                        }
                                    }}
                                    onError={() => {
                                        setError('Google Login Failed');
                                    }}
                                    useOneTap
                                    theme="filled_black"
                                    text="continue_with"
                                    size="large"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Switch mode */}
                    <p style={{ textAlign: 'center', fontSize: '.775rem', color: 'var(--t4)', marginTop: 24 }}>
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button style={{ color: 'var(--vl)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 'inherit' }}
                            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
                            {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
