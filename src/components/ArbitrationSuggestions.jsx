import { motion } from 'framer-motion';
import { Trophy, Info, TrendingDown } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';

const RANK = [
    { bg: 'rgba(251,191,36,.18)', color: '#fbbf24', icon: '🥇' },
    { bg: 'rgba(148,163,184,.12)', color: '#94a3b8', icon: '🥈' },
    { bg: 'rgba(205,127,50,.14)', color: '#cd7f32', icon: '🥉' },
];

const BAR_COLORS = [
    'linear-gradient(90deg,#059669,#06b6d4)',
    'linear-gradient(90deg,#2563eb,#7c3aed)',
    'linear-gradient(90deg,#7c3aed,#ec4899)',
    'linear-gradient(90deg,#d97706,#ef4444)',
    'linear-gradient(90deg,#06b6d4,#2563eb)',
    'linear-gradient(90deg,#8b5cf6,#06b6d4)',
    'linear-gradient(90deg,#059669,#2563eb)',
    'linear-gradient(90deg,#d97706,#7c3aed)',
    'linear-gradient(90deg,#ec4899,#8b5cf6)',
    'linear-gradient(90deg,#06b6d4,#059669)',
];

const FEE_COLOR = (pct) =>
    pct < 1.5 ? 'var(--gl)' : pct < 3 ? 'var(--al)' : 'var(--rl)';

export default function ArbitrationSuggestions({ fromCurrency = 'INR', amount = 50000 }) {
    const { getArbitration } = useExchangeRates();
    const all = getArbitration(amount, fromCurrency);
    const results = all.slice(0, 10);
    const best = results[0];

    if (!best) return null;

    return (
        <motion.div
            className="card card-shine"
            style={{ padding: 28 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            <div className="flex aic jcb mb-5">
                <div>
                    <div className="flex aic gap-3 mb-1">
                        <Trophy size={18} style={{ color: 'var(--al)' }} />
                        <span className="fw-8 t1 fs-lg">Arbitration Optimizer</span>
                    </div>
                    <div className="fs-xs t3">
                        Effective USD after platform fees ·{' '}
                        <strong style={{ color: 'var(--t2)', fontFamily: 'var(--mono)' }}>
                            {amount.toLocaleString()} {fromCurrency}
                        </strong>
                    </div>
                </div>
                <span className="badge badge-g">AI Ranked</span>
            </div>

            {/* Column headers */}
            <div style={{
                display: 'grid', gridTemplateColumns: '32px 90px 1fr 80px 52px 52px',
                gap: 10, padding: '0 4px 8px',
                borderBottom: '1px solid rgba(255,255,255,.06)',
                marginBottom: 8,
            }}>
                <span className="fs-xs t4 upper">#</span>
                <span className="fs-xs t4 upper">Currency</span>
                <span className="fs-xs t4 upper">Efficiency</span>
                <span className="fs-xs t4 upper tr">Eff. USD</span>
                <span className="fs-xs t4 upper tr">Fee</span>
                <span className="fs-xs t4 upper tr">vs Best</span>
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {results.map((item, i) => {
                    const isBest = i === 0;
                    const barPct = best.usdEquivalent > 0
                        ? (item.usdEquivalent / best.usdEquivalent) * 100 : 0;
                    const vsBest = isBest
                        ? null
                        : (((item.usdEquivalent - best.usdEquivalent) / best.usdEquivalent) * 100).toFixed(1);

                    return (
                        <motion.div
                            key={item.currency}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '32px 90px 1fr 80px 52px 52px',
                                gap: 10, alignItems: 'center',
                                padding: '8px 4px',
                                borderRadius: 'var(--r-sm)',
                                background: isBest ? 'rgba(5,150,105,.07)' : 'transparent',
                                border: `1px solid ${isBest ? 'rgba(5,150,105,.2)' : 'transparent'}`,
                                transition: 'all .2s',
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ background: isBest ? 'rgba(5,150,105,.1)' : 'rgba(255,255,255,.03)', x: 2 }}
                        >
                            {/* Rank */}
                            <div style={{
                                width: 24, height: 24, borderRadius: 7,
                                background: i < 3 ? RANK[i].bg : 'rgba(255,255,255,.05)',
                                color: i < 3 ? RANK[i].color : 'var(--t4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: i < 3 ? '.9rem' : '.7rem', fontWeight: 800,
                            }}>
                                {i < 3 ? RANK[i].icon : i + 1}
                            </div>

                            {/* Currency */}
                            <div>
                                <div className="fw-7 t1" style={{ fontSize: '.875rem' }}>
                                    {item.meta?.flag || '🌐'} {item.currency}
                                </div>
                                <div style={{ fontSize: '.6rem', color: 'var(--t4)', marginTop: 1 }}>
                                    {item.meta?.name || item.currency}
                                </div>
                            </div>

                            {/* Bar */}
                            <div style={{ height: 5, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
                                <motion.div
                                    style={{ height: '100%', borderRadius: 3, background: BAR_COLORS[i % BAR_COLORS.length] }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, barPct)}%` }}
                                    transition={{ duration: 0.9, delay: i * 0.04 }}
                                />
                            </div>

                            {/* Effective USD */}
                            <div style={{ textAlign: 'right' }}>
                                <div className="mono fw-8 t1" style={{ fontSize: '.875rem' }}>
                                    ${item.usdEquivalent.toFixed(2)}
                                </div>
                            </div>

                            {/* Fee % */}
                            <div style={{ textAlign: 'right', fontSize: '.75rem', fontWeight: 700, color: FEE_COLOR(item.spreadPct) }}>
                                -{item.spreadPct}%
                            </div>

                            {/* vs Best */}
                            <div style={{ textAlign: 'right', fontSize: '.75rem', fontWeight: 700, fontFamily: 'var(--mono)' }}>
                                {isBest
                                    ? <span style={{ color: 'var(--gl)', fontSize: '.6rem', fontWeight: 800, letterSpacing: '.04em' }}>BEST</span>
                                    : <span style={{ color: 'var(--rl)' }}>{vsBest}%</span>
                                }
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Info footer */}
            <div style={{
                marginTop: 16, padding: '12px 14px',
                background: 'rgba(37,99,235,.07)', border: '1px solid rgba(37,99,235,.18)',
                borderRadius: 10, display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
                <Info size={13} style={{ color: 'var(--bl)', flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: '.8125rem', color: 'var(--t3)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--bl)' }}>Fee column</strong> = platform spread + SWIFT/Wise costs.
                    Accept in <strong style={{ color: 'var(--t1)' }}>{best.currency}</strong> for max effective value ≈{' '}
                    <strong style={{ color: 'var(--gl)' }}>${best.usdEquivalent.toFixed(2)} USD</strong> after fees.
                    {best.spreadPct <= 1 && (
                        <span style={{ color: 'var(--gl)', marginLeft: 6 }}>✓ Lowest fee transfer available.</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
