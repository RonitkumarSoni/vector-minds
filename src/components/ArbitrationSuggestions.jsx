import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Globe2 } from 'lucide-react';
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
    pct < 1.5 ? '#34d399' : pct < 3 ? '#fbbf24' : '#ef4444';

export default function ArbitrationSuggestions() {
    const { getArbitration, currencies, loading } = useExchangeRates();
    const [amount, setAmount] = useState(50000);
    const [baseCurrency, setBaseCurrency] = useState('INR');

    if (loading || !currencies || currencies.length === 0) return null;

    const all = getArbitration(amount, baseCurrency);
    const results = all;
    const best = results[0];

    if (!best) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 24, padding: 32,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative', overflow: 'hidden'
            }}
        >
            <div style={{ position: 'absolute', top: -100, right: -50, width: 250, height: 250, background: 'rgba(16, 185, 129, 0.1)', filter: 'blur(70px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -50, left: -50, width: 150, height: 150, background: 'rgba(56, 189, 248, 0.1)', filter: 'blur(60px)', borderRadius: '50%' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, position: 'relative', zIndex: 1 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', padding: 8, borderRadius: 10, display: 'flex' }}>
                            <Target size={20} color="white" />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' }}>Arbitration Optimizer</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>Find the absolute best currency to request payment in across 100+ options.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <Globe2 size={14} color="#34d399" />
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Global Scan Active</span>
                </div>
            </div>

            <div style={{
                background: 'rgba(0,0,0,0.4)', padding: 20, borderRadius: 20, marginBottom: 20,
                border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1,
                display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center'
            }}>
                <div style={{ flex: '1 1 250px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Total Invoice Amount</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)}
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px 16px', borderRadius: 12, color: '#fff', fontSize: '1.2rem',
                                fontWeight: 800, outline: 'none', fontFamily: 'var(--mono)', transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#10b981'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <select
                            value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}
                            style={{
                                width: 100, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px', borderRadius: 12, color: '#fff', fontSize: '1.1rem',
                                fontWeight: 700, outline: 'none', cursor: 'pointer', appearance: 'none'
                            }}
                        >
                            {currencies.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="arb-table-header" style={{
                display: 'grid', gridTemplateColumns: 'minmax(30px, auto) minmax(130px, 1fr) 2fr minmax(100px, 1fr) minmax(60px, auto) minmax(60px, auto)',
                gap: 16, padding: '0 12px 12px',
                borderBottom: '1px solid rgba(255,255,255,.08)',
                marginBottom: 12, position: 'relative', zIndex: 1
            }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Rank</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Asset</span>
                <span className="hide-mobile" style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Yield Efficiency</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', textAlign: 'right' }}>Net USD</span>
                <span className="hide-mobile" style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', textAlign: 'right' }}>Tax/Fee</span>
                <span className="hide-mobile" style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', textAlign: 'right' }}>Delta</span>
            </div>

            <div style={{
                display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 1,
                maxHeight: '380px', overflowY: 'auto', paddingRight: '8px',
                scrollbarWidth: 'thin', scrollbarColor: 'rgba(16, 185, 129, 0.4) rgba(0,0,0,0.2)'
            }}>
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
                            className="arb-table-row"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'minmax(30px, auto) minmax(130px, 1fr) 2fr minmax(100px, 1fr) minmax(60px, auto) minmax(60px, auto)',
                                gap: 16, alignItems: 'center',
                                padding: '12px',
                                borderRadius: 16,
                                background: isBest ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isBest ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.03)'}`,
                                transition: 'all .2s',
                                cursor: 'default'
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i * 0.02, 0.5) }}
                            whileHover={{ background: isBest ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,.05)', scale: 1.01 }}
                        >
                            <div style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: i < 3 ? RANK[i].bg : 'rgba(255,255,255,.05)',
                                color: i < 3 ? RANK[i].color : '#94a3b8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: i < 3 ? '1rem' : '0.8rem', fontWeight: 800,
                            }}>
                                {i < 3 ? RANK[i].icon : i + 1}
                            </div>

                            <div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span>{item.meta?.flag || '🌐'}</span> {item.currency}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2, fontWeight: 600 }}>
                                    {item.meta?.name || item.currency}
                                </div>
                            </div>

                            <div className="hide-mobile" style={{ height: 6, background: 'rgba(255,255,255,.04)', borderRadius: 4, overflow: 'hidden' }}>
                                <motion.div
                                    style={{ height: '100%', borderRadius: 4, background: BAR_COLORS[i % BAR_COLORS.length], boxShadow: '0 0 10px rgba(255,255,255,0.2)' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, barPct)}%` }}
                                    transition={{ duration: 0.9, delay: Math.min(i * 0.02, 0.5) }}
                                />
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--mono)', color: isBest ? '#34d399' : '#e2e8f0' }}>
                                    ${item.usdEquivalent.toFixed(2)}
                                </div>
                            </div>

                            <div className="hide-mobile" style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: 800, color: FEE_COLOR(item.spreadPct) }}>
                                -{item.spreadPct}%
                            </div>

                            <div className="hide-mobile" style={{ textAlign: 'right', fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--mono)' }}>
                                {isBest
                                    ? <span style={{ color: '#34d399', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '.05em', background: 'rgba(52, 211, 153, 0.2)', padding: '2px 6px', borderRadius: 6 }}>BEST</span>
                                    : <span style={{ color: '#ef4444' }}>{vsBest}%</span>
                                }
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div style={{
                marginTop: 24, padding: 20, background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.05))',
                borderLeft: '4px solid #10b981', borderRadius: '0 16px 16px 0', display: 'flex', gap: 16, alignItems: 'center', position: 'relative', zIndex: 1
            }}>
                <div style={{ background: '#10b981', minWidth: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>
                    <Zap size={20} color="white" />
                </div>
                <div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500, lineHeight: 1.5 }}>
                        <strong style={{ color: '#f8fafc' }}>Tax/Fee Metric:</strong> Estimates platform spread + SWIFT/Wise costs. If you invoice your client for <strong style={{ color: '#f8fafc' }}>{amount} {baseCurrency}</strong>, you will retain maximum value if they pay in <strong style={{ color: '#34d399', fontSize: '1rem' }}>{best.currency}</strong> (yielding ≈ <strong style={{ color: '#34d399', fontSize: '1rem' }}>${best.usdEquivalent.toFixed(2)} USD</strong> to your bank account).
                        {best.spreadPct <= 1.5 && <div style={{ color: '#34d399', marginTop: 4, fontWeight: 700, fontSize: '0.8rem' }}>✓ Optimal routing path available (Loss &lt; 1.5%).</div>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
