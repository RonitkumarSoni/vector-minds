import { motion } from 'framer-motion';
import { useExchangeRates } from '../hooks/useExchangeRates';

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
        <div className="card card-shine" style={{ padding: '28px 24px', background: 'rgba(5, 5, 20, 0.65)' }}>
            <div className="flex aic jcb mb-5">
                <div className="flex aic gap-3">
                    <div className="flex aic gap-2" style={{ background: 'rgba(5,150,105,.1)', padding: '6px 14px', borderRadius: 99, border: '1px solid rgba(5,150,105,.3)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(5,150,105,.8)', boxShadow: '0 0 10px rgba(5,150,105,1)' }} />
                        <span className="fs-xs t2 fw-7">Stable</span>
                    </div>
                    <div className="flex aic gap-2" style={{ background: 'rgba(37,99,235,.1)', padding: '6px 14px', borderRadius: 99, border: '1px solid rgba(37,99,235,.3)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(37,99,235,.8)', boxShadow: '0 0 10px rgba(37,99,235,1)' }} />
                        <span className="fs-xs t2 fw-7">Moderate</span>
                    </div>
                    <div className="flex aic gap-2" style={{ background: 'rgba(225,29,72,.1)', padding: '6px 14px', borderRadius: 99, border: '1px solid rgba(225,29,72,.3)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(225,29,72,.8)', boxShadow: '0 0 10px rgba(225,29,72,1)' }} />
                        <span className="fs-xs t2 fw-7">Volatile</span>
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 12,
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
                            whileHover={{ scale: 1.1, zIndex: 10, y: -4, boxShadow: `0 15px 30px ${bg.replace('.18)', '.4)').replace('.25)', '.5)').replace('.2)', '.4)')}` }}
                            style={{
                                background: bg, border: `1px solid ${border}`,
                                borderRadius: 16, padding: '16px 12px',
                                textAlign: 'center', position: 'relative',
                                cursor: 'default', transition: 'all .3s',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <div style={{ fontSize: '1.6rem', marginBottom: 8, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>{meta[item.cur]?.flag}</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: text, letterSpacing: '-0.02em' }}>{item.cur}</div>
                            <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,0.6)', marginTop: 4, fontFamily: 'var(--mono)', letterSpacing: '0.15em' }}>
                                {score < 20 ? '●●●' : score < 45 ? '●●○' : score < 65 ? '●○○' : '○○○'}
                            </div>
                            <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#fff', marginTop: 6, opacity: 0.9 }}>
                                {rate > 1 ? rate.toFixed(1) : rate.toFixed(4)}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div
                style={{
                    marginTop: 24, padding: '14px 18px',
                    background: 'rgba(124,58,237,.08)', border: '1px solid rgba(124,58,237,.25)',
                    borderRadius: 14, fontSize: '.85rem', display: 'flex', alignItems: 'center', gap: '8px'
                }}
            >
                <div style={{ background: 'var(--vl)', borderRadius: '50%', width: 6, height: 6, boxShadow: '0 0 10px var(--vl)', animation: 'pulse-live 2s infinite' }} />
                <span>
                    <strong style={{ color: 'var(--vl)', fontWeight: 800 }}>Global Analysis Active: </strong>
                    <span style={{ color: 'var(--t3)' }}>
                        Strength dot indicators reflect real-time USD relativity index metrics for {new Date().toLocaleDateString()}
                    </span>
                </span>
            </div>
        </div>
    );
}
