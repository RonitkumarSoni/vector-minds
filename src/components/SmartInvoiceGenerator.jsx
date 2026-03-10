import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Calculator, AlertCircle, Wallet, Receipt, Zap, ArrowDown } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';

export default function SmartInvoiceGenerator() {
    const { currencies, getRate, meta } = useExchangeRates();
    const [targetAmount, setTargetAmount] = useState(1000);
    const [baseCurrency, setBaseCurrency] = useState('USD');
    const [clientCurrency, setClientCurrency] = useState('EUR');

    const [paymentMethod, setPaymentMethod] = useState('paypal');

    const platforms = {
        paypal: { name: 'PayPal / Stripe', feePct: 4.5, fixedFee: 0.30, time: 'Instant', icon: <Receipt size={18} /> },
        wire: { name: 'Bank Wire (SWIFT)', feePct: 1.5, fixedFee: 25.0, time: '3-5 Days', icon: <Wallet size={18} /> },
        wise: { name: 'Wise / Payoneer', feePct: 0.8, fixedFee: 0, time: '1-2 Days', icon: <Zap size={18} /> },
        crypto: { name: 'Crypto (USDT)', feePct: 0.1, fixedFee: 1.0, time: '5 Secs', icon: <AlertCircle size={18} /> }
    };

    const currentFee = platforms[paymentMethod];

    const requiredBaseAmt = (targetAmount / (1 - (currentFee.feePct / 100))) + currentFee.fixedFee;
    const totalFeesInBase = requiredBaseAmt - targetAmount;

    const rate = getRate(baseCurrency, clientCurrency);
    const invoiceAmountClient = requiredBaseAmt * rate;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
            style={{
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: 24, padding: 32,
                boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative', overflow: 'hidden'
            }}
        >
            <div style={{ position: 'absolute', top: -150, left: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 60%)', filter: 'blur(30px)', zIndex: 0 }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                        <div style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)', padding: 10, borderRadius: 12, display: 'flex', boxShadow: '0 4px 20px rgba(244, 63, 94, 0.4)' }}>
                            <FileText size={22} color="white" />
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' }}>Smart Invoice Generator</h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>Reverse-calculate exactly how much to bill so platform fees never eat into your profits again.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(244, 63, 94, 0.1)', padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(244, 63, 94, 0.3)', boxShadow: 'inset 0 0 15px rgba(244, 63, 94, 0.15)' }}>
                    <Calculator size={16} color="#fb923c" />
                    <span style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Reverse Calculation Active</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, position: 'relative', zIndex: 1, alignItems: 'stretch' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 800, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
                            <span style={{ background: '#f43f5e', color: 'white', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>1</span>
                            Amount Required in Bank
                        </label>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input
                                type="number" value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value) || 0)}
                                style={{
                                    flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '16px 20px', borderRadius: 14, color: '#fff', fontSize: '1.6rem', fontWeight: 900,
                                    outline: 'none', fontFamily: 'var(--mono)', transition: 'all 0.2s', width: '100%'
                                }}
                                onFocus={e => e.target.style.borderColor = '#f43f5e'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                            <select
                                value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}
                                style={{
                                    width: 110, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '16px', borderRadius: 14, color: '#f43f5e', fontSize: '1.2rem', fontWeight: 800,
                                    outline: 'none', cursor: 'pointer', appearance: 'none', textAlign: 'center'
                                }}
                            >
                                {currencies?.map(c => <option key={c} value={c} style={{ background: '#0f172a', color: '#fff' }}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 800, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
                                <span style={{ background: '#f43f5e', color: 'white', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>2</span>
                                Client Payment Currency
                            </label>
                            <select
                                value={clientCurrency} onChange={(e) => setClientCurrency(e.target.value)}
                                style={{
                                    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '16px 20px', borderRadius: 14, color: '#fff', fontSize: '1.1rem', fontWeight: 700,
                                    outline: 'none', cursor: 'pointer', appearance: 'none'
                                }}
                            >
                                {currencies?.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{meta[c]?.flag || '🌐'} {c} - {meta[c]?.name || c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 800, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
                                <span style={{ background: '#f43f5e', color: 'white', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>3</span>
                                Receiving Platform
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                                {Object.entries(platforms).map(([key, data]) => (
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={key}
                                        onClick={() => setPaymentMethod(key)}
                                        style={{
                                            padding: '14px', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                                            background: paymentMethod === key ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(251, 146, 60, 0.2))' : 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${paymentMethod === key ? 'rgba(244, 63, 94, 0.6)' : 'rgba(255,255,255,0.05)'}`,
                                            color: paymentMethod === key ? '#fff' : '#94a3b8',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center'
                                        }}>
                                        <div style={{ color: paymentMethod === key ? '#fb923c' : '#64748b' }}>{data.icon}</div>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{data.name}</div>
                                            {paymentMethod === key && <div style={{ fontSize: '0.65rem', color: '#f43f5e', marginTop: 4, fontWeight: 700 }}>{data.feePct}% + ${data.fixedFee}</div>}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    position: 'relative', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(244, 63, 94, 0.15)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 0 40px rgba(244, 63, 94, 0.05)'
                }}>

                    <div style={{ textAlign: 'center', marginBottom: 20, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Invoice Your Client For:</div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={invoiceAmountClient}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', damping: 20 }}
                                style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8 }}
                            >
                                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#cbd5e1' }}>{meta[clientCurrency]?.flag || ''}</span>
                                <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#f8fafc', fontFamily: 'var(--mono)', textShadow: '0 0 40px rgba(244, 63, 94, 0.5)', lineHeight: 1 }}>
                                    {invoiceAmountClient.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f43f5e', marginTop: 8 }}>{clientCurrency}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: '50%' }}>
                            <ArrowDown size={20} color="#94a3b8" />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><AlertCircle size={14} /> Platform Deduction</span>
                            <span style={{ color: '#ef4444', fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--mono)' }}>-{totalFeesInBase.toFixed(2)} {baseCurrency}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#10b981', fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Final Bank Payout</span>
                            <span style={{ color: '#10b981', fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--mono)', textShadow: '0 0 15px rgba(16, 185, 129, 0.4)' }}>
                                {targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {baseCurrency}
                            </span>
                        </div>
                    </div>

                    <div style={{ marginTop: 20, display: 'flex', alignItems: 'flex-start', gap: 12, background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.1), rgba(244, 63, 94, 0.02))', borderLeft: '4px solid #f43f5e', padding: 16, borderRadius: '0 12px 12px 0' }}>
                        <AlertCircle size={18} color="#f43f5e" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, fontWeight: 500 }}>
                            <strong style={{ color: '#f8fafc' }}>Pro Tip:</strong> By billing your client exactly <strong style={{ color: '#f43f5e' }}>{invoiceAmountClient.toLocaleString('en-US', { maximumFractionDigits: 2 })} {clientCurrency}</strong>, you force the client to absorb the {currentFee.feePct}% platform tax natively, ensuring a strict {"$"}0.00 loss to your target revenue.
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
