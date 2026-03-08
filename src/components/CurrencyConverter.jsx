import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, RefreshCw, CheckCircle } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';

const PAIRS = [
    ['USD', 'INR'], ['EUR', 'USD'], ['GBP', 'INR'],
    ['USD', 'AED'], ['USD', 'JPY'], ['EUR', 'GBP'],
];

export default function CurrencyConverter() {
    const { convert, currencies, loading, lastUpdated } = useExchangeRates();
    const [from, setFrom] = useState('INR');
    const [to, setTo] = useState('USD');
    const [amt, setAmt] = useState(50000);
    const [animDir, setAnimDir] = useState(1);

    const result = convert(amt, from, to);
    const rate = convert(1, from, to);

    const swap = () => {
        setAnimDir(p => -p);
        setFrom(to);
        setTo(from);
    };

    const timeStr = lastUpdated
        ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '…';

    return (
        <div className="conv-layout">

            {/* ── Converter Card ── */}
            <div className="conv-card">
                {/* Header */}
                <div className="conv-head">
                    <div>
                        <div className="conv-title">Currency Converter</div>
                        <div className="conv-meta">
                            <span className="nav-live-dot" style={{ width: 5, height: 5 }} />
                            Updated {timeStr}
                        </div>
                    </div>
                    <span className="badge badge-v">Real-Time</span>
                </div>

                {/* FROM */}
                <div className="conv-body">
                    <div className="conv-lbl-row">
                        <span className="conv-lbl">You Request</span>
                        <select
                            className="curr-select"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                        >
                            {currencies.slice(0, 40).map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <input
                        type="number"
                        className="amount-input"
                        value={amt}
                        min={0}
                        onChange={e => setAmt(Math.max(0, +e.target.value))}
                    />
                </div>

                {/* Swap */}
                <div className="swap-wrap">
                    <button className="swap-btn" onClick={swap}>
                        <ArrowUpDown size={18} />
                    </button>
                </div>

                {/* TO */}
                <div className="conv-body" style={{ paddingBottom: 22 }}>
                    <div className="conv-lbl-row">
                        <span className="conv-lbl" style={{ color: 'var(--c)' }}>Client Pays</span>
                        <select
                            className="curr-select"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                        >
                            {currencies.slice(0, 40).map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="output-box">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${result.toFixed(4)}-${to}`}
                                className="output-value"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.18 }}
                            >
                                {loading ? '—' : result.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </motion.div>
                        </AnimatePresence>
                        <div className="output-meta">{to} · Live Market Rate</div>
                    </div>
                </div>

                <div className="divider" />
                <div className="conv-foot">
                    <span className="rate-tag">
                        1 {from} = {isNaN(rate) ? '—' : rate.toFixed(6)} {to}
                    </span>
                    <span className="fee-tag"><CheckCircle size={13} /> 0% Fee</span>
                </div>
            </div>

            {/* ── Live Rate Ticker ── */}
            <div className="ticker-card">
                <div className="flex aic jcb mb-3">
                    <div>
                        <div className="fw-7 t1 fs-base">Live Rate Ticker</div>
                        <div className="fs-xs t3 mt-2">Auto-refreshes every 3s</div>
                    </div>
                    <RefreshCw size={14} className="t3 spin" />
                </div>
                <div className="rate-grid">
                    {PAIRS.map(([f, t]) => {
                        const v = convert(1, f, t);
                        const up = Math.random() > 0.5;
                        const pct = (Math.random() * 0.08 + 0.01).toFixed(3);
                        return (
                            <div className="rate-item" key={`${f}${t}`}>
                                <div>
                                    <div className="rate-pair">{f}/{t}</div>
                                    <div className={`rate-chg ${up ? 'up' : 'down'}`}>
                                        {up ? '▲' : '▼'} {pct}%
                                    </div>
                                </div>
                                <div className="rate-val">
                                    {v > 10 ? v.toFixed(2) : v.toFixed(4)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick convert strip */}
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[1000, 5000, 10000, 50000].map(a => (
                        <div
                            key={a}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '8px 12px',
                                background: 'rgba(0,0,0,.2)', borderRadius: 8,
                                border: '1px solid rgba(255,255,255,.05)',
                            }}
                        >
                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.8125rem', color: 'var(--t3)' }}>
                                {a.toLocaleString()} {from}
                            </span>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: '.875rem', fontWeight: 700, color: 'var(--t1)' }}>
                                {convert(a, from, to).toLocaleString('en-US', { maximumFractionDigits: 2 })} {to}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: 14, padding: '12px 14px',
                    background: 'rgba(124,58,237,.07)',
                    border: '1px solid rgba(124,58,237,.18)',
                    borderRadius: 10,
                }}>
                    <div className="fs-xs t3 upper mb-2">💡 Pro Tip</div>
                    <div className="fs-sm t2 lh-normal">
                        Lock your invoice rate now. Current {from}/{to} is{' '}
                        <strong style={{ color: 'var(--vl)', fontFamily: 'var(--mono)' }}>
                            {rate.toFixed(5)}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
