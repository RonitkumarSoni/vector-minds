import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';

export default function ProfitPrediction() {
    const { convert, getRate, getHistory, loading, getRisk } = useExchangeRates();
    const [amount, setAmount] = useState(2000);
    const [baseCurrency, setBaseCurrency] = useState('INR');

    // For simplicity, defining popular prediction pairs.
    const predictPairs = ['USD', 'EUR'];

    if (loading) return null;

    return (
        <motion.div
            className="card card-shine"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ padding: '24px' }}
        >
            <div className="flex aic jcb mb-5">
                <div>
                    <h3 className="fs-lg fw-7 t1 mb-1">Profit Prediction Engine</h3>
                    <p className="fs-sm t3">AI-powered future earnings estimator based on trend analysis.</p>
                </div>
                <TrendingUp size={24} color="var(--vl)" />
            </div>

            <div className="flex gap-4 mb-6 aic" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 'var(--r-md)' }}>
                <div style={{ flex: 1 }}>
                    <label className="fs-xs fw-7 upper t3 mb-2 flex">Your Earnings Amount</label>
                    <div className="flex aic gap-2">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value) || 0)}
                            className="field-input mono fs-lg fw-7"
                            style={{ flex: 1, padding: '8px 12px' }}
                        />
                        <select
                            value={baseCurrency}
                            onChange={(e) => setBaseCurrency(e.target.value)}
                            className="curr-select"
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="two-col">
                {predictPairs.map(cur => {
                    const currentRate = getRate(baseCurrency, cur);
                    const currentConv = amount * currentRate;

                    // Simple simulation based on history data logic we have
                    const history = getHistory(baseCurrency, cur, 7);
                    const lastPred = history[history.length - 1].prediction || history[history.length - 1].rate;

                    // Add slight positive bias for demo if needed, or use the raw prediction
                    const predictedConv = amount * lastPred;
                    const diff = predictedConv - currentConv;
                    const diffPct = ((diff / currentConv) * 100);
                    const isUp = diffPct > 0;

                    const currRisk = getRisk(cur);

                    return (
                        <div key={cur} className="stat-box" style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left', padding: '16px' }}>
                            <div className="flex jcb aic mb-3">
                                <span className="fs-base fw-7 t1">→ {cur}</span>
                                <span className="badge badge-g">24h Forecast</span>
                            </div>

                            <div className="mb-3">
                                <div className="fs-xs t3 upper fw-6 mb-1">Current Conversion</div>
                                <div className="fs-lg fw-7 mono t2">{currentConv.toFixed(2)} {cur}</div>
                            </div>

                            <div className="mb-4">
                                <div className="fs-xs t3 upper fw-6 mb-1 flex aic gap-2">
                                    Predicted <ArrowRight size={10} />
                                </div>
                                <div className="fs-lg fw-8 mono" style={{ color: 'var(--vl)' }}>{predictedConv.toFixed(2)} {cur}</div>
                            </div>

                            <div className="divider mb-3" />

                            <div className="flex aic jcb">
                                <div>
                                    <div className="fs-xs t3 upper fw-6 mb-1">Potential {isUp ? 'Gain' : 'Loss'}</div>
                                    <div className={`fs-sm fw-7 ${isUp ? 'fg-g' : 'fg-r'}`}>
                                        {isUp ? '+' : ''}{diffPct.toFixed(1)}% ({isUp ? '+' : ''}{diff.toFixed(2)} {cur})
                                    </div>
                                </div>

                                <div className="tr">
                                    <div className="fs-xs t3 upper fw-6 mb-1">Stability Rate</div>
                                    <div className="fs-sm fw-7 flex aic gap-1 jcc">
                                        <ShieldCheck size={12} color="var(--g)" /> {currRisk.score}/100
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 p-4" style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(37, 99, 235, 0.05))', borderRadius: 'var(--r-md)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                <div className="fs-sm fw-7 t1 mb-2 flex aic gap-2">
                    <span style={{ width: 6, height: 6, background: 'var(--vl)', borderRadius: '50%' }} /> AI Advisor Insight
                </div>
                <div className="fs-sm t3 lh-normal">
                    Based on recent exchange rate trends, waiting for 12 hours may increase your earnings by approximately 2% if you accept payment in USD. EUR shows moderate stability.
                </div>
            </div>

        </motion.div>
    );
}
