import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CARDS = [
    {
        icon: DollarSign, color: '#9f67fa', iconBg: 'rgba(124,58,237,.15)',
        top: 'linear-gradient(90deg,#7c3aed,#6d28d9)',
        value: '₹84,200', label: 'Total Earnings', change: '+12.4%', up: true,
        changeLabel: 'vs last month',
    },
    {
        icon: TrendingUp, color: '#60a5fa', iconBg: 'rgba(37,99,235,.15)',
        top: 'linear-gradient(90deg,#2563eb,#1d4ed8)',
        value: '0.0119', label: 'INR → USD Rate', change: '+0.3%', up: true,
        changeLabel: 'since yesterday',
    },
    {
        icon: Users, color: '#34d399', iconBg: 'rgba(5,150,105,.15)',
        top: 'linear-gradient(90deg,#059669,#047857)',
        value: '24', label: 'Active Projects', change: '+3', up: true,
        changeLabel: 'this week',
    },
    {
        icon: Zap, color: '#fbbf24', iconBg: 'rgba(217,119,6,.15)',
        top: 'linear-gradient(90deg,#d97706,#b45309)',
        value: '68 WPM', label: 'Avg. Typing Speed', change: '-2', up: false,
        changeLabel: 'vs last session',
    },
];

export default function DashboardCards() {
    return (
        <div className="stat-grid">
            {CARDS.map((c, i) => (
                <motion.div
                    key={i}
                    className="stat-card"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.09, duration: 0.45, type: "spring", stiffness: 120 }}
                    whileHover={{ scale: 1.05, y: -8, boxShadow: `0 20px 45px ${c.iconBg}`, borderColor: c.color, backgroundColor: 'rgba(10, 10, 25, 0.9)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    <div className="stat-card-top" style={{ background: c.top, position: 'absolute', top: 0, left: 0, right: 0, height: '3px' }} />
                    <div
                        className="stat-icon"
                        style={{ background: c.iconBg, boxShadow: `0 4px 14px ${c.iconBg}` }}
                    >
                        <c.icon size={20} color={c.color} />
                    </div>
                    <div className="stat-value" style={{ color: '#fff', textShadow: `0 0 16px ${c.iconBg}` }}>{c.value}</div>
                    <div className="stat-label" style={{ fontWeight: '600' }}>{c.label}</div>
                    <div className={`stat-change ${c.up ? 'up' : 'down'}`} style={{ marginTop: '12px' }}>
                        {c.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        <span>{c.change}</span>
                        <span style={{ color: 'var(--text-4)', fontWeight: 400 }}>{c.changeLabel}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
