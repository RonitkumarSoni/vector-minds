import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRealTimeRates } from '../hooks/useRealTimeRates';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from 'recharts';
import { ArrowUpDown, Activity, TrendingUp, TrendingDown } from 'lucide-react';

export default function CurrencyArbitrator() {
    const [base, setBase] = useState('INR');
    const [target, setTarget] = useState('USD');
    const [amount, setAmount] = useState(50000);
    const [isSwapping, setIsSwapping] = useState(false);

    const { currentRate, historicalData, loading, currencies } = useRealTimeRates(base, target);

    const convertedAmount = currentRate ? (amount * currentRate).toFixed(2) : '---';
    const lastItem = historicalData[historicalData.length - 1];
    const prediction = lastItem?.predictive;
    const delta = prediction ? ((amount * currentRate) - (amount * prediction)).toFixed(2) : '0.00';
    const trend = parseFloat(delta) >= 0 ? 'up' : 'down';

    const handleSwap = () => {
        setIsSwapping(true);
        setTimeout(() => { setBase(target); setTarget(base); setIsSwapping(false); }, 300);
    };

    return (
        <div className="arb-grid">
            {/* ── LEFT: Exchange Card ── */}
            <motion.div
                className="glass exchange-card p-8"
                style={{ minHeight: '520px' }}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="exchange-card-glow"></div>

                {/* Card Header */}
                <div className="exchange-header">
                    <div className="exchange-header-icon">
                        <Activity size={22} />
                    </div>
                    <div>
                        <div className="exchange-title">Active Conversion</div>
                        <div className="live-dot">
                            <span className="live-dot-circle"></span>
                            <span className="live-dot-text">Live Link Active</span>
                        </div>
                    </div>
                </div>

                {/* FROM */}
                <div className="exchange-field" style={{ marginBottom: '1rem' }}>
                    <div className="exchange-field-top">
                        <label className="exchange-field-label">You Request</label>
                        <select
                            className="exchange-currency-select"
                            value={base}
                            onChange={e => setBase(e.target.value)}
                        >
                            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <input
                        type="number"
                        className="exchange-input"
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                    />
                </div>

                {/* SWAP */}
                <div className="swap-row">
                    <button
                        className="swap-btn"
                        onClick={handleSwap}
                        style={isSwapping ? { transform: 'rotate(180deg)' } : {}}
                    >
                        <ArrowUpDown size={20} />
                    </button>
                </div>

                {/* TO */}
                <div className="exchange-field" style={{ marginTop: '1rem' }}>
                    <div className="exchange-field-top">
                        <label className="exchange-field-label blue">Client Pays</label>
                        <select
                            className="exchange-currency-select"
                            value={target}
                            onChange={e => setTarget(e.target.value)}
                        >
                            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="exchange-output">
                        <span className="exchange-output-value">
                            {loading ? '...' : convertedAmount}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="exchange-footer">
                    <span className="exchange-rate-tag">
                        1 {base} = {currentRate ? currentRate.toFixed(4) : '...'} {target}
                    </span>
                    <span className="exchange-fee-tag">
                        <Activity size={13} /> 0% Dynamic Fee
                    </span>
                </div>
            </motion.div>

            {/* ── RIGHT: Analytics Chart ── */}
            <motion.div
                className="glass chart-card p-8"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className="chart-card-glow"></div>

                <div className="chart-header">
                    <div>
                        <div className="chart-title">
                            Volatility Predictor
                            <span className="ai-badge">AI Engine</span>
                        </div>
                        <div className="chart-subtitle">Proprietary forecasting for perfect invoice timing.</div>
                    </div>
                    <div className={`forecast-tag ${trend}`}>
                        {trend === 'up'
                            ? <TrendingUp size={20} style={{ color: 'var(--c-green)' }} />
                            : <TrendingDown size={20} style={{ color: 'var(--c-red)' }} />
                        }
                        <div>
                            <div className="forecast-label">1hr Forecast</div>
                            <div className={`forecast-value ${trend}`}>
                                {trend === 'up' ? '+' : ''}{delta} {target}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historicalData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="cRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="cPred" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="time" stroke="#475569" fontSize={11} tickMargin={8} axisLine={false} tickLine={false} />
                            <YAxis stroke="#475569" fontSize={11} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(5,5,12,0.95)', border: '1px solid rgba(139,92,246,0.3)',
                                    borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
                                }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#cRate)" name="Historical" />
                            <Area type="monotone" dataKey="predictive" stroke="#0ea5e9" strokeWidth={2.5} strokeDasharray="6 4" fill="url(#cPred)" name="AI Prediction" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-legend">
                    <div className="legend-items">
                        <span>
                            <span className="legend-dot purple"></span>
                            <span className="legend-text-muted">Historical</span>
                        </span>
                        <span>
                            <span className="legend-dot blue"></span>
                            <span className="legend-text-bold">AI Prediction</span>
                        </span>
                    </div>
                    <button className="chart-gen-btn">Generate Report →</button>
                </div>
            </motion.div>
        </div>
    );
}
