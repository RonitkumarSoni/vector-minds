import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, Edit3, User } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';

const TABS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'converter', label: 'Converter' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'performance', label: 'Performance' },
];

const TICKER_PAIRS = [
    ['USD', 'INR'], ['EUR', 'USD'], ['GBP', 'USD'], ['USD', 'JPY'],
    ['USD', 'AED'], ['EUR', 'GBP'], ['USD', 'SGD'], ['USD', 'CHF'],
    ['USD', 'INR'], ['GBP', 'INR'], ['EUR', 'INR'], ['USD', 'BRL'],
];

function LiveTicker() {
    const { getRate } = useExchangeRates();
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setOffset(o => o - 1), 28);
        return () => clearInterval(t);
    }, []);

    const items = [...TICKER_PAIRS, ...TICKER_PAIRS];
    const pxOffset = offset % 780;

    return (
        <div className="nav-ticker-wrap">
            <div className="nav-ticker" style={{ transform: `translateX(${pxOffset}px)` }}>
                {items.map(([f, t], i) => {
                    const rate = getRate(f, t);
                    const up = (i + Math.floor(Date.now() / 4000)) % 3 !== 0;
                    return (
                        <span key={i} className="nav-ticker-item">
                            <span className="nav-ticker-pair">{f}/{t}</span>
                            <span className="nav-ticker-val">{rate > 10 ? rate.toFixed(2) : rate.toFixed(4)}</span>
                            <span className={`nav-ticker-chg ${up ? 'up' : 'down'}`}>
                                {up ? '▲' : '▼'}{(Math.random() * 0.06 + 0.01).toFixed(3)}%
                            </span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export default function Navbar({ activeTab, setActiveTab, user, onEditProfile, onLoginClick }) {
    const [profileOpen, setProfileOpen] = useState(false);

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'AH';
    const displayName = user?.name?.split(' ')[0] || 'Profile';

    return (
        <div className="navbar-outer">
            {/* Live rate ticker bar */}
            <div className="nav-topbar">
                <div className="nav-topbar-inner">
                    <span className="nav-topbar-label">
                        <span className="nav-live-dot" style={{ width: 5, height: 5 }} />
                        LIVE
                    </span>
                    <LiveTicker />
                    <span className="nav-topbar-time">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                    </span>
                </div>
            </div>

            {/* Main nav */}
            <motion.nav
                className="navbar"
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 55, damping: 18 }}
            >
                <div className="nav-inner">

                    {/* Logo */}
                    <div className="brand" onClick={() => setActiveTab('dashboard')}>
                        <div className="brand-logo">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L3 7v10l9 5 9-5V7L12 2Z" fill="url(#nl)" opacity=".9" />
                                <path d="M12 2L3 7l9 5 9-5L12 2Z" fill="white" opacity=".12" />
                                <path d="M8 10h8M8 13h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="nl" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#6d28d9" /><stop offset="1" stopColor="#1d4ed8" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="brand-text">
                            <div className="brand-name">Freelance<b>X</b></div>
                            <div className="brand-tagline">Currency Intelligence</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="nav-pills">
                        {TABS.map(t => (
                            <button
                                key={t.id}
                                className={`nav-pill ${activeTab === t.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Right side — Auth / Profile */}
                    <div className="nav-end">
                        <div className="nav-live">
                            <span className="nav-live-dot" />
                            <span className="nav-live-text">Live</span>
                        </div>

                        <button className="icon-btn" title="Notifications">
                            <Bell size={15} />
                            <span className="notif-dot" />
                        </button>

                        {user ? (
                            <div style={{ position: 'relative' }}>
                                <button
                                    className="profile-btn"
                                    onClick={() => setProfileOpen(o => !o)}
                                >
                                    <div className="profile-avatar">
                                        {user?.avatar
                                            ? <img src={user.avatar} alt={initials} />
                                            : (
                                                <div style={{
                                                    width: 28, height: 28, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg,#6d28d9,#2563eb)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '.6875rem', fontWeight: 800, color: '#fff',
                                                }}>{initials}</div>
                                            )
                                        }
                                        <span className="profile-status" />
                                    </div>
                                    <div>
                                        <div className="profile-name">{displayName}</div>
                                        <div className="profile-role">{user?.role || 'Freelancer · INR Node'}</div>
                                    </div>
                                    <ChevronDown size={12} style={{ color: 'var(--t3)' }} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            className="profile-dropdown"
                                            initial={{ opacity: 0, y: -8, scale: .96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: .96 }}
                                            transition={{ duration: .17 }}
                                            onMouseLeave={() => setProfileOpen(false)}
                                        >
                                            {/* Profile info */}
                                            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{
                                                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                                                    background: 'linear-gradient(135deg,#6d28d9,#2563eb)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '.875rem', fontWeight: 800, color: '#fff',
                                                }}>
                                                    {user?.avatar ? <img src={user.avatar} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} alt="" /> : initials}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--t1)' }}>{user?.name || 'User'}</div>
                                                    <div style={{ fontSize: '.6875rem', color: 'var(--t3)' }}>{user?.email}</div>
                                                </div>
                                            </div>
                                            <button className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => { setProfileOpen(false); onEditProfile(); }}>
                                                <Edit3 size={13} /> Edit Profile
                                            </button>
                                            <button className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <User size={13} /> My Dashboard
                                            </button>
                                            <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '4px 0' }} />
                                            <button
                                                className="dropdown-item"
                                                style={{ color: 'var(--rl)', display: 'flex', alignItems: 'center', gap: 8 }}
                                                onClick={() => { localStorage.removeItem('flx_user'); window.location.reload(); }}
                                            >
                                                <span>⎋</span> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button className="btn btn-primary btn-sm" onClick={onLoginClick} style={{ marginLeft: 8 }}>
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </motion.nav>
        </div>
    );
}
