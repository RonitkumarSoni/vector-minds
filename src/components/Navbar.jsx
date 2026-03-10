import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, Edit3, User, Menu, X, TrendingUp, TrendingDown, Zap, ShieldCheck, DollarSign, CheckCheck } from 'lucide-react';
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

const INITIAL_NOTIFICATIONS = [
    {
        id: 1, read: false,
        icon: <TrendingUp size={15} />, color: 'var(--gl)', bg: 'rgba(5,150,105,.15)',
        title: 'USD/INR hit 7-day high',
        body: 'Rate reached ₹84.92 — great time to invoice in USD.',
        time: '2m ago',
    },
    {
        id: 2, read: false,
        icon: <Zap size={15} />, color: 'var(--vl)', bg: 'rgba(124,58,237,.15)',
        title: 'AI Arbitration Alert',
        body: 'GBP offers +3.2% better payout than USD for your INR invoice.',
        time: '14m ago',
    },
    {
        id: 3, read: false,
        icon: <DollarSign size={15} />, color: 'var(--al)', bg: 'rgba(217,119,6,.15)',
        title: 'Invoice #47 — Fee optimized',
        body: 'Smart routing saved you $12.40 in platform fees.',
        time: '1h ago',
    },
    {
        id: 4, read: true,
        icon: <ShieldCheck size={15} />, color: 'var(--c)', bg: 'rgba(6,182,212,.12)',
        title: 'Security check passed',
        body: 'Your account passed the latest fraud-detection scan.',
        time: '3h ago',
    },
    {
        id: 5, read: true,
        icon: <TrendingDown size={15} />, color: 'var(--rl)', bg: 'rgba(225,29,72,.12)',
        title: 'EUR/INR dipped -0.8%',
        body: 'EUR weakened slightly. Consider switching invoice currency.',
        time: '5h ago',
    },
];

function LiveTicker() {
    const { getRate } = useExchangeRates();

    const items = [...TICKER_PAIRS, ...TICKER_PAIRS];

    return (
        <div className="nav-ticker-wrap">
            <motion.div
                className="nav-ticker"
                animate={{ x: [0, -780] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 25
                }}
            >
                {items.map(([f, t], i) => {
                    const rate = getRate(f, t);
                    const up = (i % 3) !== 0;
                    const pseudoRandom = ((i * 17) % 6) * 0.01 + 0.01;
                    return (
                        <span key={i} className="nav-ticker-item">
                            <span className="nav-ticker-pair">{f}/{t}</span>
                            <span className="nav-ticker-val">{rate > 10 ? rate.toFixed(2) : rate.toFixed(4)}</span>
                            <span className={`nav-ticker-chg ${up ? 'up' : 'down'}`}>
                                {up ? '▲' : '▼'}{pseudoRandom.toFixed(3)}%
                            </span>
                        </span>
                    );
                })}
            </motion.div>
        </div>
    );
}

// ── Notifications Panel ──────────────────────────────────────────────────────
function NotificationsPanel({ onClose }) {
    const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);
    const unreadCount = notifs.filter(n => !n.read).length;

    const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
    const markOne = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
    const dismiss = (id) => setNotifs(n => n.filter(x => x.id !== id));

    return (
        <motion.div
            className="notif-panel"
            initial={{ opacity: 0, y: -10, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: .97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        >
            {/* Header */}
            <div className="notif-panel-head">
                <div>
                    <div className="notif-panel-title">Notifications</div>
                    {unreadCount > 0 && (
                        <div className="notif-panel-sub">{unreadCount} unread alert{unreadCount > 1 ? 's' : ''}</div>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {unreadCount > 0 && (
                        <button className="notif-mark-all" onClick={markAllRead} title="Mark all as read">
                            <CheckCheck size={14} /> Mark all read
                        </button>
                    )}
                    <button className="notif-close-btn" onClick={onClose}><X size={15} /></button>
                </div>
            </div>

            {/* List */}
            <div className="notif-list">
                <AnimatePresence>
                    {notifs.length === 0 ? (
                        <motion.div
                            className="notif-empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Bell size={28} style={{ opacity: .25, marginBottom: 10 }} />
                            <div>All caught up!</div>
                        </motion.div>
                    ) : notifs.map((n, i) => (
                        <motion.div
                            key={n.id}
                            layout
                            className={`notif-item ${n.read ? 'read' : 'unread'}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                            transition={{ delay: i * 0.04, duration: .22, exit: { duration: .18 } }}
                            onClick={() => markOne(n.id)}
                        >
                            {/* Icon */}
                            <div className="notif-icon" style={{ background: n.bg, color: n.color }}>
                                {n.icon}
                            </div>

                            {/* Content */}
                            <div className="notif-content">
                                <div className="notif-item-title">
                                    {n.title}
                                    {!n.read && <span className="notif-badge-dot" />}
                                </div>
                                <div className="notif-item-body">{n.body}</div>
                                <div className="notif-item-time">{n.time}</div>
                            </div>

                            {/* Dismiss */}
                            <button
                                className="notif-dismiss"
                                onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                                title="Dismiss"
                            >
                                <X size={12} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer */}
            {notifs.length > 0 && (
                <div className="notif-panel-foot">
                    <button className="notif-view-all">View all activity →</button>
                </div>
            )}
        </motion.div>
    );
}

// ── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar({ activeTab, setActiveTab, user, onEditProfile, onLoginClick }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(3);
    const drawerRef = useRef(null);
    const notifRef = useRef(null);

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'AH';
    const displayName = user?.name?.split(' ')[0] || 'Profile';

    // Close mobile menu on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        };
        if (mobileMenuOpen) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [mobileMenuOpen]);

    // Close notif panel on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        if (notifOpen) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [notifOpen]);

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const handleTabClick = (id) => {
        setActiveTab(id);
        setMobileMenuOpen(false);
    };

    const handleBellClick = () => {
        setNotifOpen(o => !o);
        setUnreadCount(0);       // Mark as seen when opened
        setProfileOpen(false);
    };

    return (
        <div className="navbar-outer">
            {/* Topbar ticker */}
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

            {/* Main Navbar */}
            <motion.nav
                className="navbar"
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 55, damping: 18 }}
            >
                <div className="nav-inner">

                    {/* Brand */}
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

                    {/* Desktop Nav Pills */}
                    <div className="nav-pills nav-pills-desktop">
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

                    {/* Right side */}
                    <div className="nav-end">
                        <div className="nav-live nav-live-desktop">
                            <span className="nav-live-dot" />
                            <span className="nav-live-text">Live</span>
                        </div>

                        {/* Bell — with panel */}
                        <div ref={notifRef} style={{ position: 'relative' }} className="nav-bell-desktop">
                            <button
                                className={`icon-btn ${notifOpen ? 'icon-btn-active' : ''}`}
                                title="Notifications"
                                onClick={handleBellClick}
                            >
                                <motion.span
                                    animate={unreadCount > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
                                    transition={{ repeat: Infinity, repeatDelay: 5, duration: .5 }}
                                    style={{ display: 'flex' }}
                                >
                                    <Bell size={15} />
                                </motion.span>
                                <AnimatePresence>
                                    {unreadCount > 0 && (
                                        <motion.span
                                            className="notif-count-badge"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                        >
                                            {unreadCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>

                            <AnimatePresence>
                                {notifOpen && (
                                    <NotificationsPanel onClose={() => setNotifOpen(false)} />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile */}
                        {user ? (
                            <div style={{ position: 'relative' }} className="nav-profile-desktop">
                                <button
                                    className="profile-btn"
                                    onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
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
                                    <ChevronDown size={12} style={{ color: 'var(--t3)', transition: 'transform .2s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
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
                            <button className="btn btn-primary btn-sm nav-signin-desktop" onClick={onLoginClick} style={{ marginLeft: 8 }}>
                                Sign In
                            </button>
                        )}

                        {/* Hamburger — mobile only */}
                        <button
                            className="hamburger-btn"
                            onClick={() => setMobileMenuOpen(o => !o)}
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {mobileMenuOpen
                                    ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: .18 }}>
                                        <X size={20} />
                                    </motion.span>
                                    : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: .18 }}>
                                        <Menu size={20} />
                                    </motion.span>
                                }
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            className="mobile-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: .2 }}
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            ref={drawerRef}
                            className="mobile-drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            <div className="mobile-drawer-header">
                                <div className="brand" onClick={() => handleTabClick('dashboard')}>
                                    <div className="brand-logo">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L3 7v10l9 5 9-5V7L12 2Z" fill="url(#nl2)" opacity=".9" />
                                            <path d="M8 10h8M8 13h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                            <defs>
                                                <linearGradient id="nl2" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#6d28d9" /><stop offset="1" stopColor="#1d4ed8" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="brand-name">Freelance<b>X</b></div>
                                </div>
                                <div className="nav-live">
                                    <span className="nav-live-dot" />
                                    <span className="nav-live-text">Live</span>
                                </div>
                            </div>

                            <nav className="mobile-nav-links">
                                {TABS.map((t, i) => (
                                    <motion.button
                                        key={t.id}
                                        className={`mobile-nav-item ${activeTab === t.id ? 'active' : ''}`}
                                        onClick={() => handleTabClick(t.id)}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                                    >
                                        <span className="mobile-nav-item-dot" />
                                        {t.label}
                                        {activeTab === t.id && (
                                            <motion.span className="mobile-nav-active-bar" layoutId="activeBar" />
                                        )}
                                    </motion.button>
                                ))}
                            </nav>

                            <div className="mobile-drawer-divider" />

                            <div className="mobile-drawer-user">
                                {user ? (
                                    <>
                                        <div className="mobile-user-info">
                                            <div style={{
                                                width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                                                background: 'linear-gradient(135deg,#6d28d9,#2563eb)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1rem', fontWeight: 800, color: '#fff',
                                                boxShadow: '0 0 16px rgba(109,40,217,.4)'
                                            }}>{initials}</div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--t1)' }}>{user?.name || 'User'}</div>
                                                <div style={{ fontSize: '.7rem', color: 'var(--t3)', marginTop: 2 }}>{user?.email}</div>
                                            </div>
                                        </div>
                                        <div className="mobile-user-actions">
                                            <button className="mobile-action-btn" onClick={() => { setMobileMenuOpen(false); onEditProfile(); }}>
                                                <Edit3 size={15} /> Edit Profile
                                            </button>
                                            <button className="mobile-action-btn" style={{ color: 'var(--rl)' }}
                                                onClick={() => { localStorage.removeItem('flx_user'); window.location.reload(); }}>
                                                <span>⎋</span> Sign Out
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}>
                                        Sign In to FreelanceX
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
