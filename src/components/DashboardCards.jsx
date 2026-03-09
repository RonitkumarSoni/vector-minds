import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';


export default function DashboardCards({ getHistory }) {
    const inrUsdHist = getHistory ? getHistory('USD', 'INR', 1) : [];
    const latestInrUsd = inrUsdHist.length > 0 ? inrUsdHist[inrUsdHist.length - 1].rate : 83.5;
    const prevInrUsd = inrUsdHist.length > 1 ? inrUsdHist[inrUsdHist.length - 2].rate : 83.4;
    const inrUsdTrend = (((latestInrUsd - prevInrUsd) / prevInrUsd) * 100).toFixed(2);
    const inrUp = latestInrUsd < prevInrUsd;

    const LIVE_CARDS = [
        {
            icon: DollarSign, color: '#38bdf8', iconBg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.05))',
            glow: 'rgba(56, 189, 248, 0.5)',
            value: "₹" + (1008 * latestInrUsd).toLocaleString(undefined, { maximumFractionDigits: 0 }), label: 'Live Total Earnings (1k USD)', change: '+12.4%', up: true,
            changeLabel: 'vs last month',
        },
        {
            icon: TrendingUp, color: '#8b5cf6', iconBg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.05))',
            glow: 'rgba(139, 92, 246, 0.5)',
            value: "₹" + latestInrUsd.toFixed(2), label: 'Live USD → INR Rate', change: (inrUsdTrend > 0 ? '+' : '') + inrUsdTrend + '%', up: inrUp,
            changeLabel: 'last 3 seconds',
        },
        {
            icon: Users, color: '#10b981', iconBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.05))',
            glow: 'rgba(16, 185, 129, 0.5)',
            value: 'Local Net', label: 'API Sync Status', change: '120+', up: true,
            changeLabel: 'active endpoints',
        },
        {
            icon: Zap, color: '#f59e0b', iconBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.05))',
            glow: 'rgba(245, 158, 11, 0.5)',
            value: '< 0.05s', label: 'Arbitration Latency', change: '-2ms', up: true,
            changeLabel: 'optimal path',
        },
    ];

    return (
        <div className="dashboard-cards-grid">
            {LIVE_CARDS.map((c, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    style={{
                        background: 'linear-gradient(160deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 24, padding: 24,
                        boxShadow: '0 15px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                        position: 'relative', overflow: 'hidden', cursor: 'default',
                        display: 'flex', flexDirection: 'column'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, height: 3, width: '100%', background: c.iconBg, boxShadow: "0 0 15px " + c.glow }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                        <div style={{
                            width: 50, height: 50, borderRadius: 14, background: c.iconBg,
                            border: "1px solid " + c.color + "40", display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: "0 0 20px " + c.color + "20"
                        }}>
                            <c.icon size={24} color={c.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {c.label}
                            </div>
                            <div style={{ fontSize: '1.6rem', color: '#f8fafc', fontWeight: 800, fontFamily: 'var(--mono)', lineHeight: 1.2, textShadow: "0 0 20px " + c.color + "40" }}>
                                {c.value}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8,
                        background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: c.up ? '#34d399' : '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>
                            {c.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {c.change}
                        </div>
                        <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>{c.changeLabel}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
