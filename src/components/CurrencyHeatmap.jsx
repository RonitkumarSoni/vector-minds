import { motion } from 'framer-motion';
import { useExchangeRates } from '../hooks/useExchangeRates';

/* Currency strength data — strength = inverse of volatility relative to USD */
const HEATMAP_DATA = [
    { cur: 'USD', region: 'N. America', x: 1, y: 1 },
    { cur: 'EUR', region: 'Europe', x: 3, y: 0 },
    { cur: 'GBP', region: 'Europe', x: 4, y: 0 },
    { cur: 'CHF', region: 'Europe', x: 2, y: 0 },
    { cur: 'JPY', region: 'E. Asia', x: 6, y: 0 },
    { cur: 'CNY', region: 'E. Asia', x: 7, y: 1 },
    { cur: 'KRW', region: 'E. Asia', x: 8, y: 0 },
    { cur: 'SGD', region: 'SE. Asia', x: 7, y: 2 },
    { cur: 'THB', region: 'SE. Asia', x: 8, y: 2 },
    { cur: 'INR', region: 'S. Asia', x: 6, y: 3 },
    { cur: 'AED', region: 'Mid. East', x: 5, y: 2 },
    { cur: 'CAD', region: 'N. America', x: 0, y: 1 },
    { cur: 'AUD', region: 'Oceania', x: 8, y: 4 },
    { cur: 'BRL', region: 'S. America', x: 1, y: 4 },
    { cur: 'MXN', region: 'N. America', x: 0, y: 2 },
];

function getStrengthColor(score) {
    if (score < 20) return { bg: 'rgba(5,150,105,.25)', border: 'rgba(5,150,105,.5)', text: 'var(--green-l)' };
    if (score < 45) return { bg: 'rgba(37,99,235,.2)', border: 'rgba(37,99,235,.4)', text: 'var(--blue-l)' };
    if (score < 65) return { bg: 'rgba(217,119,6,.18)', border: 'rgba(217,119,6,.4)', text: 'var(--amber-l)' };
    return { bg: 'rgba(225,29,72,.18)', border: 'rgba(225,29,72,.4)', text: 'var(--rose-l)' };
}

export default function CurrencyHeatmap() {
    const { getRisk, getRate, meta } = useExchangeRates();

    return (
        <div className="card card-shine" style={{ padding: 24 }}>
            <div className="flex aic jcb mb-5">
                <div>
                    <div className="fw-8 t1" style={{ fontSize: '1.125rem', marginBottom: 3 }}>
                        Global Currency Heatmap
                    </div>
                    <div className="fs-xs t3">Currency strength & volatility by region</div>
                </div>
                <div className="flex aic gap-3">
                    <div className="flex aic gap-2">
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(5,150,105,.5)' }} />
                        <span className="fs-xs t3">Stable</span>
                    </div>
                    <div className="flex aic gap-2">
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(37,99,235,.5)' }} />
                        <span className="fs-xs t3">Moderate</span>
                    </div>
                    <div className="flex aic gap-2">
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(225,29,72,.5)' }} />
                        <span className="fs-xs t3">Volatile</span>
                    </div>
                </div>
            </div>

            {/* Grid Heatmap */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 8,
                }}
            >
                {HEATMAP_DATA.map((item, i) => {
                    const { score } = getRisk(item.cur);
                    const rate = getRate('USD', item.cur);
                    const { bg, border, text } = getStrengthColor(score);

                    return (
                        <motion.div
                            key={item.cur}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04, type: 'spring', stiffness: 80 }}
                            whileHover={{ scale: 1.05, zIndex: 10 }}
                            style={{
                                background: bg, border: `1px solid ${border}`,
                                borderRadius: 12, padding: '12px 10px',
                                textAlign: 'center', position: 'relative',
                                cursor: 'default', transition: 'all .2s',
                            }}
                        >
                            <div style={{ fontSize: '1.375rem', marginBottom: 4 }}>{meta[item.cur]?.flag}</div>
                            <div style={{ fontSize: '.875rem', fontWeight: 800, color: text }}>{item.cur}</div>
                            <div style={{ fontSize: '.625rem', color: 'var(--text-4)', marginTop: 2, fontFamily: 'var(--mono)' }}>
                                {score < 20 ? '●●●' : score < 45 ? '●●○' : score < 65 ? '●○○' : '○○○'}
                            </div>
                            <div style={{ fontSize: '.625rem', color: 'var(--text-4)', marginTop: 1 }}>
                                {rate > 1 ? rate.toFixed(1) : rate.toFixed(4)}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div
                style={{
                    marginTop: 16, padding: '10px 14px',
                    background: 'rgba(124,58,237,.07)', border: '1px solid rgba(124,58,237,.18)',
                    borderRadius: 10, fontSize: '.8125rem',
                }}
            >
                <span style={{ color: 'var(--violet-l)', fontWeight: 600 }}>🌍 Global View: </span>
                <span style={{ color: 'var(--text-3)' }}>
                    Dots (●) = stability. Tap any cell to get AI insights about that currency.
                </span>
            </div>
        </div>
    );
}
