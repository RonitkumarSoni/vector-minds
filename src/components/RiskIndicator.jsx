import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldOff, TrendingUp } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY', 'INR', 'BRL', 'MXN', 'KRW'];

const RISK_CONFIG = {
    LOW: { color: 'var(--green-l)', bg: 'rgba(5,150,105,.1)', border: 'rgba(5,150,105,.25)', icon: ShieldCheck, label: 'Stable' },
    MODERATE: { color: 'var(--amber-l)', bg: 'rgba(217,119,6,.08)', border: 'rgba(217,119,6,.2)', icon: ShieldAlert, label: 'Moderate' },
    HIGH: { color: 'var(--rose-l)', bg: 'rgba(225,29,72,.08)', border: 'rgba(225,29,72,.2)', icon: ShieldOff, label: 'Volatile' },
};

function RiskBar({ score }) {
    const color = score < 20 ? 'var(--green-l)' : score < 50 ? 'var(--amber-l)' : 'var(--rose-l)';
    return (
        <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: [.4, 0, .2, 1] }}
                style={{ height: '100%', background: color, borderRadius: 2 }}
            />
        </div>
    );
}

export default function RiskIndicator() {
    const { getRisk, meta } = useExchangeRates();

    return (
        <div className="card card-shine" style={{ padding: 24 }}>
            <div className="flex aic jcb mb-5">
                <div>
                    <div className="fw-8 t1" style={{ fontSize: '1.125rem', marginBottom: 3 }}>
                        Currency Risk Radar
                    </div>
                    <div className="fs-xs t3">Real-time volatility assessment</div>
                </div>
                <span className="badge badge-v">Live</span>
            </div>

            <div className="risk-grid" style={{ gap: 8 }}>
                {CURRENCIES.map((cur, i) => {
                    const { score, level } = getRisk(cur);
                    const cfg = RISK_CONFIG[level];
                    const Icon = cfg.icon;
                    return (
                        <motion.div
                            key={cur}
                            className="card-flat"
                            style={{ padding: '10px 12px', background: cfg.bg, borderColor: cfg.border }}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex aic jcb mb-1">
                                <div className="flex aic gap-2">
                                    <span style={{ fontSize: '1rem' }}>{meta[cur]?.flag}</span>
                                    <span className="fw-7 t1" style={{ fontSize: '.875rem' }}>{cur}</span>
                                </div>
                                <Icon size={13} color={cfg.color} />
                            </div>
                            <div className="flex aic jcb">
                                <span style={{ fontSize: '.6875rem', color: cfg.color, fontWeight: 700 }}>
                                    {cfg.label}
                                </span>
                                <span style={{ fontSize: '.6875rem', fontFamily: 'var(--mono)', color: 'var(--text-3)' }}>
                                    {score}/100
                                </span>
                            </div>
                            <RiskBar score={score} />
                        </motion.div>
                    );
                })}
            </div>

            <div
                style={{
                    marginTop: 14, padding: '10px 14px',
                    background: 'rgba(37,99,235,.07)', border: '1px solid rgba(37,99,235,.18)',
                    borderRadius: 10, fontSize: '.8125rem', color: 'var(--text-3)',
                }}
            >
                <TrendingUp size={12} style={{ marginRight: 6, color: 'var(--blue-l)', display: 'inline' }} />
                <span style={{ color: 'var(--blue-l)', fontWeight: 600 }}>Stability tip: </span>
                For predictable income, invoice in <strong style={{ color: '#fff' }}>USD, AED or SGD</strong> — the most stable currencies for freelancers.
            </div>
        </div>
    );
}
