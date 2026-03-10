import { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, Activity, Clock, Trash2, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { motion, AnimatePresence } from 'framer-motion';

export default function CurrencyConverter() {
    const { convert, currencies, loading, meta, getHistory } = useExchangeRates();
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('INR');
    const [amt, setAmt] = useState('1000');

    const [history, setHistory] = useState([
        { id: 1, from: 'USD', to: 'EUR', amt: 1000, result: 924.50, date: new Date(Date.now() - 3600000) },
        { id: 2, from: 'GBP', to: 'INR', amt: 500, result: 52430.10, date: new Date(Date.now() - 7200000) }
    ]);
    

    const numAmt = amt === '' || isNaN(Number(amt)) ? 0 : Number(amt);
    const result = convert(numAmt, from, to);
    const rate = convert(1, from, to);

    useEffect(() => {
        if (!numAmt || numAmt <= 0) return;
        const timeout = setTimeout(() => {
            setHistory(prev => {
                if (prev.length > 0 && prev[0].from === from && prev[0].to === to && prev[0].amt === numAmt) return prev;
                return [{ id: Date.now(), from, to, amt: numAmt, result, date: new Date() }, ...prev].slice(0, 5);
            });
        }, 1500);
        return () => clearTimeout(timeout);
    }, [from, to, numAmt, result]);

    const swap = () => {
        setFrom(to);
        setTo(from);
    };

    const clearHistory = () => setHistory([]);

    const trendData = useMemo(() => getHistory(from, to, 7), [from, to, getHistory]);
    const minRate = Math.min(...trendData.map(d => d.rate));
    const maxRate = Math.max(...trendData.map(d => d.rate));
    const rateDiff = maxRate - minRate || 1;

    const sparklinePts = trendData.map((d, i) => {
        const x = (i / (trendData.length - 1)) * 100;
        const y = 100 - (((d.rate - minRate) / rateDiff) * 80 + 10);
        return `${x},${y}`;
    }).join(' ');

    const trendUp = trendData[trendData.length - 1]?.rate >= trendData[0]?.rate;
    const trendColor = trendUp ? '#10b981' : '#ef4444';

    return (
        <div style={{ maxWidth: 1150, margin: '0 auto', fontFamily: 'var(--sans, sans-serif)', padding: '10px' }}>
            <style>{`
                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(1000%); opacity: 0; }
                }
                @keyframes glow {
                    0% { text-shadow: 0 0 20px rgba(56,189,248,0.2); }
                    50% { text-shadow: 0 0 40px rgba(56,189,248,0.8), 0 0 10px rgba(56,189,248,0.4); }
                    100% { text-shadow: 0 0 20px rgba(56,189,248,0.2); }
                }
                .c-scroll::-webkit-scrollbar { width: 6px; }
                .c-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; }
                .c-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .c-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                
                .glass-card {
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 41, 59, 0.6) 100%);
                    backdrop-filter: blur(24px);
                    border: 1px solid rgba(139, 92, 246, 0.15);
                    border-radius: 24px;
                    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.1);
                }
                .conv-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); }
                @media(max-width: 900px) {
                    .conv-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="conv-grid" style={{ gap: 24, alignItems: 'stretch' }}>

                <motion.div
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', damping: 20 }}
                    className="glass-card" style={{ padding: 40, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
                >
                    <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
                    <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 20, marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(56,189,248,0.15)' }}>
                                    <RefreshCcw size={22} color="#38bdf8" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.5px' }}>Global Currency Converter</div>
                                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Real-Time Exchange Rates</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'pulse-ring 2s infinite' }} />
                                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>System Live</span>
                            </div>
                        </div>

                        <div className="conv-inputs-wrap" style={{
                            background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 20, padding: 12,
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)', marginBottom: 40
                        }}>
                            <div style={{ flex: 1.2, position: 'relative' }}>
                                <div style={{ position: 'absolute', top: -24, left: 10, fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount</div>
                                <input
                                    type="number" value={amt === 0 ? '' : amt} min={0}
                                    placeholder="0"
                                    onChange={e => setAmt(e.target.value)}
                                    style={{
                                        width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 14, padding: '16px 20px', color: '#fff',
                                        fontSize: '1.4rem', fontWeight: 800, outline: 'none',
                                        transition: 'all 0.2s', fontFamily: 'var(--mono)'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.background = 'rgba(139,92,246,0.05)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                                />
                            </div>

                            <div style={{ flex: 1, position: 'relative', marginTop: '10px' }}>
                                <div style={{ position: 'absolute', top: -24, left: 10, fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>From</div>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={from} onChange={e => setFrom(e.target.value)}
                                        style={{
                                            width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 14, padding: '18px 36px 18px 46px', color: '#fff',
                                            fontSize: '1.2rem', fontWeight: 700, outline: 'none', appearance: 'none', cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.background = 'rgba(139,92,246,0.05)'; }}
                                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                                    >
                                        {currencies.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
                                    </select>
                                    <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '1.3rem' }}>{meta[from]?.flag || '🌐'}</div>
                                    <ArrowUpDown size={14} color="#64748b" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                </div>
                            </div>

                            <button
                                onClick={swap}
                                style={{
                                    width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none',
                                    cursor: 'pointer', color: '#fff', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                                    flexShrink: 0, transition: 'transform 0.3s'
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1) rotate(180deg)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                            >
                                <ArrowUpDown size={22} />
                            </button>

                            <div style={{ flex: 1, position: 'relative', marginTop: '10px' }}>
                                <div style={{ position: 'absolute', top: -24, left: 10, fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>To</div>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={to} onChange={e => setTo(e.target.value)}
                                        style={{
                                            width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 14, padding: '18px 36px 18px 46px', color: '#fff',
                                            fontSize: '1.2rem', fontWeight: 700, outline: 'none', appearance: 'none', cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        onFocus={e => { e.target.style.borderColor = '#8b5cf6'; e.target.style.background = 'rgba(139,92,246,0.05)'; }}
                                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                                    >
                                        {currencies.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
                                    </select>
                                    <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '1.3rem' }}>{meta[to]?.flag || '🌐'}</div>
                                    <ArrowUpDown size={14} color="#64748b" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(56,189,248,0.2)',
                            borderRadius: 24, padding: '30px', textAlign: 'center', marginBottom: 20,
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(56,189,248,0.05), rgba(139,92,246,0.05))', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', width: '200%', height: 2, background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.8), transparent)', top: 0, left: '-100%', animation: 'scanline 3s linear infinite' }} />

                            <div style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600, marginBottom: 4, letterSpacing: '0.5px' }}>
                                {numAmt.toLocaleString()} {from} corresponds exactly to
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${result}-${to}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                    style={{
                                        fontSize: '4.5rem', fontWeight: 900, color: '#f0f9ff',
                                        fontFamily: 'var(--mono)', lineHeight: 1.1, animation: 'glow 3s infinite',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {loading ? '...' : result.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                    <span style={{ fontSize: '2rem', opacity: 0.6, fontWeight: 700, marginLeft: 16 }}>{to}</span>
                                </motion.div>
                            </AnimatePresence>

                            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 12 }}>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 99 }}>
                                    Market Rate: <span style={{ color: '#38bdf8' }}>1 {from} = {rate.toFixed(5)} {to}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', damping: 20, delay: 0.1 }}
                        className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Activity size={16} color="#38bdf8" /> 7-Day Market Trend
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: trendColor, fontSize: '0.85rem', fontWeight: 800, background: trendColor + '20', padding: '6px 12px', borderRadius: 8, border: '1px solid ' + trendColor + '40' }}>
                                {trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                {Math.abs((maxRate - minRate) / minRate * 100).toFixed(2)}%
                            </div>
                        </div>

                        <div style={{ height: 100, width: '100%', position: 'relative' }}>
                            <svg width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                <defs>
                                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={trendColor} stopOpacity="0.4" />
                                        <stop offset="100%" stopColor={trendColor} stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                <polyline points={`${sparklinePts.split(' ')[0].split(',')[0]},100 ${sparklinePts} 100,100`} fill="url(#trendGrad)" />
                                <polyline points={sparklinePts} fill="none" stroke={trendColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 4px 8px ${trendColor}60)` }} />
                            </svg>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: 16, fontWeight: 700, fontFamily: 'var(--mono)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                            <span>Low: {minRate.toFixed(4)}</span>
                            <span>High: {maxRate.toFixed(4)}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', damping: 20, delay: 0.2 }}
                        className="glass-card" style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Clock size={16} color="#f43f5e" /> Action Logs
                            </div>
                            <button onClick={clearHistory} title="Clear History" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600 }}>
                                <Trash2 size={14} /> Clear
                            </button>
                        </div>

                        <div className="c-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto', paddingRight: 6 }}>
                            {history.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569', gap: 16, padding: '40px 0' }}>
                                    <Clock size={48} opacity={0.2} />
                                    <span style={{ fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.5px' }}>Terminal history clear.</span>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {history.map((entry) => (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                                            style={{
                                                padding: '16px', background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16,
                                                display: 'flex', flexDirection: 'column', gap: 10,
                                                transition: 'all 0.2s', cursor: 'pointer'
                                            }}
                                            whileHover={{ background: 'rgba(56,189,248,0.1)', borderColor: 'rgba(56,189,248,0.3)', transform: 'translateX(-4px)' }}
                                            onClick={() => { setFrom(entry.from); setTo(entry.to); setAmt(entry.amt.toString()); }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                                                    {meta[entry.from]?.flag || '🌐'} {entry.from} <ArrowUpDown size={12} color="#64748b" style={{ transform: 'rotate(90deg)' }} /> {meta[entry.to]?.flag || '🌐'} {entry.to}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 6 }}>
                                                    {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: 'var(--mono)' }}>
                                                <div style={{ fontSize: '1.05rem', color: '#94a3b8', fontWeight: 600 }}>{entry.amt.toLocaleString()}</div>
                                                <div style={{ fontSize: '1.3rem', color: '#38bdf8', fontWeight: 800, textShadow: '0 0 10px rgba(56,189,248,0.4)' }}>{entry.result.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
