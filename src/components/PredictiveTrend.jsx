import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Bell } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';

const PAIRS = [
    { from: 'INR', to: 'USD', base: 0.012 },
    { from: 'INR', to: 'EUR', base: 0.011 },
    { from: 'INR', to: 'GBP', base: 0.0095 },
    { from: 'INR', to: 'AED', base: 0.044 },
    { from: 'INR', to: 'SGD', base: 0.016 },
];

export default function PredictiveTrend() {
    const { convert } = useExchangeRates();

    const alerts = PAIRS.map(({ from, to, base }) => {
        const rate = convert(1, from, to);
        const diff = ((rate - base) / base) * 100;
        const dir = diff > 0.5 ? 'up' : diff < -0.5 ? 'down' : 'flat';
        const pct = Math.abs(diff).toFixed(2);

        const msgs = {
            up: {
                title: `${from}/${to} Bullish Signal`,
                desc: `Rate is ${pct}% above baseline. Ideal time to invoice — your ${from} earnings convert favorably.`,
            },
            down: {
                title: `${from}/${to} Bearish Warning`,
                desc: `Rate dropped ${pct}% below threshold. Delay invoice or quote in ${to} directly to protect earnings.`,
            },
            flat: {
                title: `${from}/${to} Stable Range`,
                desc: `Rate is within ±0.5% of baseline. Neutral timing — proceed based on your project schedule.`,
            },
        };

        return {
            ...msgs[dir], dir,
            pct: `${dir === 'up' ? '+' : dir === 'down' ? '-' : '~'}${pct}%`,
            time: `${Math.floor(Math.random() * 45) + 1}m ago`,
            pair: `${from}/${to}`,
        };
    });

    const Icons = { up: TrendingUp, down: TrendingDown, flat: Minus };
    const IconColors = { up: 'var(--green-l)', down: 'var(--rose-l)', flat: 'var(--amber-l)' };

    return (
        <motion.div
            className="card card-shine"
            style={{ padding: 28 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
        >
            <div className="flex aic jcb mb-5">
                <div>
                    <div className="fw-8 t1 fs-lg mb-1">Predictive Trend Alerts</div>
                    <div className="fs-xs t3">AI-powered rate change notifications</div>
                </div>
                <div className="flex aic gap-2">
                    <Bell size={14} style={{ color: 'var(--amber-l)' }} />
                    <span className="badge badge-a">{alerts.filter(a => a.dir !== 'flat').length} Active</span>
                </div>
            </div>

            <div className="alert-list">
                {alerts.map((a, i) => {
                    const Icon = Icons[a.dir];
                    return (
                        <motion.div
                            key={i}
                            className={`alert-row ${a.dir}`}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                        >
                            <div className={`alert-icon ${a.dir}`}>
                                <Icon size={18} color={IconColors[a.dir]} />
                            </div>
                            <div className="alert-body">
                                <div className="alert-title">{a.title}</div>
                                <div className="alert-desc">{a.desc}</div>
                                <div className="alert-meta">{a.pair} · {a.time}</div>
                            </div>
                            <div className={`alert-pct ${a.dir}`}>{a.pct}</div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
