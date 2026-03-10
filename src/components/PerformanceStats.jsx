import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Cpu, RotateCcw } from 'lucide-react';

const TEXTS = [
    "Currency conversion tools are essential for modern freelancers working with international clients. Always negotiate in a stable currency to protect your earnings from unexpected exchange rate volatility.",
    "Freelancing in a global economy requires mastering real-time currency arbitration to ensure consistent earnings. When exchange rates fluctuate, your income can vary significantly across different payment platforms.",
    "Platform analytics help freelancers track performance metrics and optimize earnings strategy. Understanding WPM and accuracy allows professionals to benchmark skills and negotiate better rates globally.",
];

export default function PerformanceStats() {
    const [text] = useState(() => TEXTS[Math.floor(Math.random() * TEXTS.length)]);
    const [typed, setTyped] = useState('');
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [done, setDone] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [acc, setAcc] = useState(100);
    const inputRef = useRef(null);
    const timerRef = useRef(null);

    const finishTest = useCallback((finalTyped) => {
        clearInterval(timerRef.current);
        setDone(true);
        setStarted(false);
        const words = finalTyped.trim().split(/\s+/).filter(Boolean).length;
        const elapsed = 60 - timeLeft || 1;
        const calcWpm = Math.round((words / elapsed) * 60);
        let correct = 0;
        for (let i = 0; i < finalTyped.length; i++) {
            if (finalTyped[i] === text[i]) correct++;
        }
        const calcAcc = finalTyped.length > 0 ? Math.round((correct / finalTyped.length) * 100) : 0;
        setWpm(calcWpm);
        setAcc(calcAcc);
    }, [text, timeLeft]);

    useEffect(() => {
        if (started && !done && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000);
        } else if (timeLeft === 0 && started && !done) {
            finishTest(typed);
        }
        return () => clearInterval(timerRef.current);
    }, [started, timeLeft, done, finishTest, typed]);

    const handleChange = (e) => {
        if (done) return;
        const val = e.target.value;
        if (!started && val.length > 0) setStarted(true);

        if (val.length > text.length) return;

        setTyped(val);

        let ok = 0;
        for (let i = 0; i < val.length; i++) {
            if (val[i] === text[i]) ok++;
        }
        setAcc(val.length > 0 ? Math.round((ok / val.length) * 100) : 100);

        if (val.length === text.length) finishTest(val);
    };

    const reset = () => {
        clearInterval(timerRef.current);
        setTyped(''); setStarted(false); setDone(false);
        setTimeLeft(60); setWpm(0); setAcc(100);
        setTimeout(() => inputRef.current?.focus(), 150);
    };

    const elapsed = 60 - timeLeft;
    const words = typed.trim().split(/\s+/).filter(Boolean).length;
    const liveWpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
    const pct = Math.min(100, Math.round((typed.length / text.length) * 100));

    const wpmColor = liveWpm >= 70 ? 'var(--gl)' : liveWpm >= 45 ? 'var(--al)' : 'var(--t3)';
    const accColor = acc >= 95 ? 'var(--gl)' : acc >= 80 ? 'var(--al)' : 'var(--rl)';

    return (
        <div className="perf-card">
            <div className="perf-topbar" />
            <div className="perf-body">

                <div className="perf-head">
                    <div>
                        <div className="perf-title">
                            <Keyboard size={22} style={{ color: 'var(--c)' }} />
                            Freelancer Performance Tracker
                        </div>
                        <div className="perf-sub">Type the text accurately to verify your skills</div>
                    </div>
                    <div className="flex aic gap-3">
                        <div className={`timer-box ${timeLeft <= 10 && started ? 'urgent' : ''}`}>
                            <div className="timer-label">Time Left</div>
                            <div className="timer-val">{timeLeft}s</div>
                        </div>
                        <button className="btn btn-ghost btn-icon" onClick={reset} title="Reset">
                            <RotateCcw size={15} />
                        </button>
                    </div>
                </div>

                <div className="stats-row mb-4">
                    <div className="stat-box">
                        <div className="stat-box-val" style={{ color: wpmColor }}>
                            {done ? wpm : liveWpm}
                        </div>
                        <div className="stat-box-lbl">WPM</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-val" style={{ color: accColor }}>{acc}%</div>
                        <div className="stat-box-lbl">Accuracy</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-box-val fg-b">{typed.length} / {text.length}</div>
                        <div className="stat-box-lbl">Characters</div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {done ? (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: .95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 60 }}
                        >
                            <div className="results-wrap">
                                <div className="result-badge">
                                    <Cpu size={38} color="white" />
                                </div>
                                <div className="results-title">
                                    Test{' '}
                                    <span style={{ background: 'linear-gradient(135deg,#6ee7b7,#047857)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        Complete
                                    </span>
                                </div>
                                <div className="results-sub">Your performance has been recorded</div>
                                <div className="results-grid">
                                    <div className="result-box">
                                        <div className="result-num" style={{ color: wpm >= 60 ? 'var(--bl)' : 'var(--al)' }}>{wpm}</div>
                                        <div className="result-lbl">Words / Min</div>
                                        <div className="result-grade" style={{ color: wpm >= 80 ? 'var(--gl)' : wpm >= 60 ? 'var(--al)' : 'var(--rl)' }}>
                                            {wpm >= 80 ? '🏆 Expert' : wpm >= 60 ? '✅ Proficient' : wpm >= 40 ? '⚡ Average' : '📚 Beginner'}
                                        </div>
                                    </div>
                                    <div className="result-box">
                                        <div className="result-num" style={{ color: acc >= 95 ? 'var(--gl)' : 'var(--al)' }}>
                                            {acc}<span style={{ fontSize: '1.25rem', color: 'var(--t3)' }}>%</span>
                                        </div>
                                        <div className="result-lbl">Accuracy</div>
                                        <div className="result-grade" style={{ color: acc >= 95 ? 'var(--gl)' : 'var(--al)' }}>
                                            {acc >= 98 ? '🎯 Flawless' : acc >= 95 ? '✅ High Acc.' : acc >= 85 ? '⚡ Good' : '⚠ Needs Work'}
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={reset} style={{ marginTop: 20 }}>
                                    <RotateCcw size={15} /> Try Again
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                            <div style={{
                                padding: '24px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: 'var(--r-md) var(--r-md) 0 0',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderBottom: 'none',
                                fontSize: '1.0625rem',
                                lineHeight: 1.7,
                                color: 'var(--t3)',
                                marginBottom: 0
                            }}>
                                {text.split('').map((ch, i) => {
                                    let cls = '';
                                    if (i < typed.length) cls = typed[i] === ch ? 'tc-ok' : 'tc-bad';
                                    return (
                                        <span key={i} className={cls} style={{
                                            color: cls === 'tc-ok' ? 'var(--g)' : cls === 'tc-bad' ? 'var(--r)' : 'inherit',
                                            background: cls === 'tc-bad' ? 'rgba(225,29,72,0.15)' : 'transparent',
                                            borderRadius: cls === 'tc-bad' ? '2px' : '0'
                                        }}>{ch}</span>
                                    );
                                })}
                            </div>

                            <textarea
                                ref={inputRef}
                                value={typed}
                                onChange={handleChange}
                                placeholder="Start typing here to begin the test..."
                                style={{
                                    width: '100%',
                                    height: '140px',
                                    background: 'rgba(0,0,0,0.4)',
                                    border: '1px solid rgba(124,58,237,0.3)',
                                    borderRadius: '0 0 var(--r-md) var(--r-md)',
                                    padding: '24px',
                                    fontSize: '1.0625rem',
                                    lineHeight: 1.7,
                                    color: 'var(--t1)',
                                    resize: 'none',
                                    outline: 'none',
                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.2sease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'rgba(124,58,237,0.8)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(124,58,237,0.3)'}
                                autoComplete="off" spellCheck="false" autoCorrect="off" autoCapitalize="off"
                            />

                            <div className="prog-row" style={{ marginTop: 20 }}>
                                <span style={{ fontSize: '.75rem', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>{pct}%</span>
                                <div className="prog-bar-wrap">
                                    <div className="prog-bar" style={{ width: `${pct}%` }} />
                                </div>
                                <span style={{ fontSize: '.75rem', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>{text.length - typed.length} left</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
