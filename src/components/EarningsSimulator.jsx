import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';

const SCENARIOS = ['USD', 'EUR', 'GBP', 'AED', 'SGD', 'CAD', 'CHF', 'JPY'];

export default function EarningsSimulator() {
    const [amount, setAmount] = useState(50000);
    const [fromCur, setFromCur] = useState('INR');
    const [open, setOpen] = useState(false);
    const { simulate, currencies } = useExchangeRates();

    const results = simulate(amount, fromCur, SCENARIOS);
    const best = results.reduce((a, b) => a.amount > b.amount ? a : b, results[0] || {});

    const RISK_CLR = { LOW: 'var(--green-l)', MODERATE: 'var(--amber-l)', HIGH: 'var(--rose-l)' };

    return (
        <div className="card card-shine" style={{ overflow: 'hidden' }}>
            <button
                className="sim-toggle"
                onClick={() => setOpen(o => !o)}
                style={{ width: '100%', textAlign: 'left' }}
            >
                <div className="flex aic gap-3">
                    <div className="sim-icon">
                        <Calculator size={18} color="white" />
                    </div>
                    <div>
                        <div className="fw-8 t1" style={{ fontSize: '1rem' }}>Earnings Simulator</div>
                        <div className="fs-xs t3">See how different payment currencies affect your income</div>
                    </div>
                </div>
                <div className="flex aic gap-3">
                    {!open && best?.currency && (
                        <span className="badge badge-g">Best: {best.currency}</span>
                    )}
                    {open ? <ChevronUp size={16} style={{ color: 'var(--text-3)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-3)' }} />}
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [.4, 0, .2, 1] }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '0 24px 24px' }}>
                            <div className="divider" style={{ margin: '0 0 20px' }} />

                            <div className="flex aic gap-4 mb-5" style={{ flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: 160 }}>
                                    <div className="conv-field-lbl mb-2">Your Invoice Amount</div>
                                    <input
                                        type="number"
                                        className="amount-input"
                                        style={{ fontSize: '1.5rem', padding: '12px 16px' }}
                                        value={amount}
                                        min={0}
                                        onChange={e => setAmount(Math.max(0, +e.target.value))}
                                    />
                                </div>
                                <div>
                                    <div className="conv-field-lbl mb-2">Your Currency</div>
                                    <select
                                        className="curr-select"
                                        value={fromCur}
                                        onChange={e => setFromCur(e.target.value)}
                                        style={{ fontSize: '1rem', padding: '11px 36px 11px 14px' }}
                                    >
                                        {currencies.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {results.map((r, i) => {
                                    const isBest = r.currency === best?.currency;
                                    const pct = best?.amount ? ((r.amount / best.amount) * 100).toFixed(0) : 0;

                                    return (
                                        <motion.div
                                            key={r.currency}
                                            className={`arb-row ${isBest ? 'arb-best' : ''}`}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            style={{ padding: '10px 14px' }}
                                        >
                                            <div className="fw-7 t1" style={{ minWidth: 40, fontSize: '.9375rem' }}>
                                                {r.meta?.flag} {r.currency}
                                            </div>
                                            <div className="arb-track">
                                                <motion.div
                                                    className="arb-fill"
                                                    style={{
                                                        background: isBest
                                                            ? 'linear-gradient(90deg,var(--green),var(--cyan))'
                                                            : 'rgba(124,58,237,.5)',
                                                    }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, delay: i * 0.04 }}
                                                />
                                            </div>
                                            <div style={{ textAlign: 'right', minWidth: 100 }}>
                                                <div className="fw-8 t1 mono" style={{ fontSize: '.9375rem' }}>
                                                    {r.amount.toLocaleString('en', { maximumFractionDigits: 0 })}
                                                </div>
                                                <div style={{ fontSize: '.625rem', color: 'var(--text-4)', fontFamily: 'var(--mono)' }}>
                                                    {r.worstCase.toLocaleString('en', { maximumFractionDigits: 0 })} – {r.bestCase.toLocaleString('en', { maximumFractionDigits: 0 })}
                                                </div>
                                            </div>
                                            <div style={{ minWidth: 64, textAlign: 'right', fontSize: '.75rem', fontWeight: 700, color: RISK_CLR[r.risk] }}>
                                                {r.risk}
                                            </div>
                                            {isBest && <span className="arb-chip">Best ✓</span>}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="fs-xs t3 mt-3" style={{ textAlign: 'center' }}>
                                ↕ Range shows worst/best case based on volatility
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
