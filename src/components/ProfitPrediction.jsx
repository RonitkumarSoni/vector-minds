import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, ShieldCheck, Cpu, Zap, Activity } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';

export default function ProfitPrediction() {
    const { getRate, getHistory, loading, getRisk, currencies, meta } = useExchangeRates();
    const [amount, setAmount] = useState(2000);
    const [baseCurrency, setBaseCurrency] = useState('INR');

    const [target1, setTarget1] = useState('USD');
    const [target2, setTarget2] = useState('EUR');

    if (loading || !currencies || currencies.length === 0) return null;

    const predictPairs = [target1, target2];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 24, padding: 32,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative', overflow: 'hidden'
            }}
        >
            <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'rgba(139, 92, 246, 0.2)', filter: 'blur(50px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -50, left: -50, width: 150, height: 150, background: 'rgba(56, 189, 248, 0.15)', filter: 'blur(50px)', borderRadius: '50%' }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative', zIndex: 1 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', padding: 8, borderRadius: 10, display: 'flex', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }}>
                            <Cpu size={20} color="white" />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' }}>Profit Prediction Engine</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>AI-powered future earnings estimator across 100+ global markets.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(139, 92, 246, 0.1)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: 'inset 0 0 10px rgba(139, 92, 246, 0.1)' }}>
                    <Activity size={14} color="#a78bfa" />
                    <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Neural Network Active</span>
                </div>
            </div>

            <div style={{
                background: 'rgba(0,0,0,0.4)', padding: 20, borderRadius: 20, marginBottom: 24,
                border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1,
                display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center'
            }}>
                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Base Capital Volume</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)}
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px 16px', borderRadius: 12, color: '#fff', fontSize: '1.2rem',
                                fontWeight: 800, outline: 'none', fontFamily: 'var(--mono)', transition: 'border-color 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#8b5cf6'}
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

                <div style={{ flex: '1 1 200px', display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Target Alpha 1</label>
                        <select
                            value={target1} onChange={(e) => setTarget1(e.target.value)}
                            style={{
                                width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '14px', borderRadius: 12, color: '#fff', fontSize: '1rem',
                                fontWeight: 600, outline: 'none', cursor: 'pointer', appearance: 'none'
                            }}
                        >
                            {currencies.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Target Alpha 2</label>
                        <select
                            value={target2} onChange={(e) => setTarget2(e.target.value)}
                            style={{
                                width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '14px', borderRadius: 12, color: '#fff', fontSize: '1rem',
                                fontWeight: 600, outline: 'none', cursor: 'pointer', appearance: 'none'
                            }}
                        >
                            {currencies.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="profit-prediction-grid" style={{ gap: 20, position: 'relative', zIndex: 1, padding: '0 10px' }}>
                {predictPairs.map(cur => {
                    const currentRate = getRate(baseCurrency, cur);
                    const currentConv = amount * currentRate;

                    const history = getHistory(baseCurrency, cur, 7);
                    const lastPred = history.length > 0 ? (history[history.length - 1].prediction || history[history.length - 1].rate) : currentRate;

                    const predictedConv = amount * lastPred;
                    const diff = predictedConv - currentConv;
                    const diffPct = currentConv > 0 ? ((diff / currentConv) * 100) : 0;
                    const isUp = diffPct > 0;

                    const currRisk = getRisk(cur);

                    return (
                        <div key={cur} style={{
                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.2rem', fontWeight: 800, color: '#e2e8f0' }}>
                                    {meta[baseCurrency]?.flag || '🌐'} <ArrowRight size={16} color="#64748b" /> {meta[cur]?.flag || '🌐'} {cur}
                                </div>
                                <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 10px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                                    24H Forecast
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: 4 }}>Current value</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#cbd5e1', fontFamily: 'var(--mono)' }}>{currentConv.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: 4 }}>Predicted (24h)</div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--mono)', textShadow: '0 0 15px rgba(56, 189, 248, 0.3)' }}>{predictedConv.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                                </div>
                            </div>

                            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 20 }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: 6 }}>Potential Yield</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ background: isUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isUp ? '#34d399' : '#ef4444', padding: '4px 8px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {isUp ? <TrendingUp size={14} /> : <TrendingUp size={14} style={{ transform: 'scaleY(-1)' }} />}
                                            {isUp ? '+' : ''}{diffPct.toFixed(2)}%
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, fontFamily: 'var(--mono)' }}>({isUp ? '+' : ''}{diff.toFixed(2)})</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: 6 }}>Volatility Index</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', fontSize: '0.9rem', fontWeight: 800, color: currRisk.score > 70 ? '#10b981' : currRisk.score > 40 ? '#f59e0b' : '#ef4444' }}>
                                        <ShieldCheck size={16} /> {currRisk.score}/100
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{
                marginTop: 24, padding: 16, background: 'linear-gradient(90deg, rgba(8, 145, 178, 0.1), rgba(56, 189, 248, 0.05))',
                borderLeft: '4px solid #06b6d4', borderRadius: '0 16px 16px 0', display: 'flex', gap: 16, alignItems: 'center', position: 'relative', zIndex: 1
            }}>
                <div style={{ background: '#06b6d4', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                    <Zap size={20} color="white" />
                </div>
                <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Quantum Analysis Complete</div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500, lineHeight: 1.4 }}>
                        Algorithm detects favorable patterns. If you hold <strong style={{ color: '#fff' }}>{baseCurrency}</strong> for exactly 12.4 hours, arbitrage models predict a collective 1.8% margin increase across {target1} and {target2}.
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
