import { useState } from 'react';
import { motion } from 'framer-motion';
import { useExchangeRates } from '../hooks/useExchangeRates';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const TABS = [
    { id: '24h', label: '24H', days: 1 },
    { id: '7d', label: '7D', days: 7 },
    { id: '30d', label: '30D', days: 30 },
];

const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="tooltip-box">
            <div className="lbl">{label}</div>
            {payload.map(p => (
                <div key={p.name} className="val" style={{ color: p.color }}>
                    {p.name}: {p.value?.toFixed(6)}
                </div>
            ))}
        </div>
    );
};

export default function EarningsChart({ fromCur = 'INR', toCur = 'USD' }) {
    const [tab, setTab] = useState('7d');
    const { getHistory, convert } = useExchangeRates();

    const days = TABS.find(t => t.id === tab)?.days ?? 7;
    const data = getHistory(fromCur, toCur, days);

    const cur = convert(1, fromCur, toCur);
    const first = data[0]?.rate ?? cur;
    const chg = cur - first;
    const chgPct = ((chg / first) * 100).toFixed(2);
    const isUp = chg >= 0;
    const hi = Math.max(...data.map(d => d.rate));
    const lo = Math.min(...data.map(d => d.rate));

    return (
        <motion.div
            className="card card-shine"
            style={{ padding: 28 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            <div className="flex aic jcb mb-5" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div className="fw-8 t1 fs-lg mb-1">Earnings Fluctuation</div>
                    <div className="fs-xs t3">{fromCur} → {toCur} exchange rate</div>
                </div>
                <div className="chart-tabs">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            className={`chart-tab ${tab === t.id ? 'active' : ''}`}
                            onClick={() => setTab(t.id)}
                        >{t.label}</button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="chart-stats">
                <div className="cstat">
                    <div className="cstat-lbl">Rate Now</div>
                    <div className="cstat-val t1">{cur.toFixed(6)}</div>
                </div>
                <div className="cstat">
                    <div className="cstat-lbl">Change</div>
                    <div className="cstat-val" style={{ color: isUp ? 'var(--green-l)' : 'var(--rose-l)' }}>
                        {isUp ? '+' : ''}{chg.toFixed(6)} ({isUp ? '+' : ''}{chgPct}%)
                    </div>
                </div>
                <div className="cstat">
                    <div className="cstat-lbl">High</div>
                    <div className="cstat-val fg-a">{hi.toFixed(6)}</div>
                </div>
                <div className="cstat">
                    <div className="cstat-lbl">Low</div>
                    <div className="cstat-val t3">{lo.toFixed(6)}</div>
                </div>
            </div>

            {/* Chart */}
            <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="egR" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.45} />
                                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="egP" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
                        <XAxis dataKey="time" stroke="#334155" fontSize={10} tickMargin={8} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                        <YAxis stroke="#334155" fontSize={10} axisLine={false} tickLine={false} domain={['auto', 'auto']} width={70} tickFormatter={v => v.toFixed(4)} />
                        <Tooltip content={<Tip />} />
                        <ReferenceLine y={first} stroke="rgba(251,191,36,.35)" strokeDasharray="4 4" />
                        <Area type="monotone" dataKey="rate" stroke="#7c3aed" strokeWidth={2.5} fill="url(#egR)" name="Rate" dot={false} activeDot={{ r: 5, fill: '#7c3aed', strokeWidth: 0 }} />
                        <Area type="monotone" dataKey="prediction" stroke="#06b6d4" strokeWidth={2} strokeDasharray="6 4" fill="url(#egP)" name="Prediction" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="chart-foot">
                <div className="flex gap-4">
                    <div className="legend-item">
                        <span className="legend-dot" style={{ background: '#7c3aed' }} />
                        <span className="fs-xs t3">Historical</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot" style={{ background: '#06b6d4' }} />
                        <span className="fs-xs t1 fw-6">AI Prediction</span>
                    </div>
                </div>
                <span className="badge badge-a">⚡ Model Active</span>
            </div>
        </motion.div>
    );
}
