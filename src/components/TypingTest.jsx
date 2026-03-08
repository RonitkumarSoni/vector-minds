import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, Crosshair, Cpu, RotateCcw } from 'lucide-react';

const TEXT = "In a global economy, arbitration mitigates exchange volatility. A true professional freelancer adapts to shifts using predictive models and flawless execution. Precision is mandatory. Speed is your asset. The algorithm demands perfection.";

export default function TypingTest() {
    const [input, setInput] = useState('');
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [accuracy, setAccuracy] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [completed, setCompleted] = useState(false);
    const inputRef = useRef(null);

    const finishTest = useCallback((finalInput = input) => {
        setStarted(false);
        setCompleted(true);
        let correct = 0;
        for (let i = 0; i < finalInput.length; i++) {
            if (finalInput[i] === TEXT[i]) correct++;
        }
        const timeSpent = 30 - timeLeft;
        const finalWpm = timeSpent > 0 ? Math.round((correct / 5) / (timeSpent / 60)) : 0;
        const finalAccuracy = finalInput.length > 0 ? Math.round((correct / finalInput.length) * 100) : 0;
        setWpm(finalWpm);
        setAccuracy(finalAccuracy);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    useEffect(() => {
        let t;
        if (started && timeLeft > 0) {
            t = setInterval(() => setTimeLeft(p => p - 1), 1000);
        } else if (timeLeft === 0 && started) {
            finishTest(input);
        }
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [started, timeLeft]);

    const handleChange = (e) => {
        if (completed) return;
        const val = e.target.value;
        if (!started && val.length > 0) setStarted(true);
        setInput(val);
        let correct = 0;
        for (let i = 0; i < val.length; i++) { if (val[i] === TEXT[i]) correct++; }
        setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 0);
        if (val.length >= TEXT.length) finishTest(val);
    };

    const reset = () => {
        setInput(''); setStarted(false); setCompleted(false);
        setTimeLeft(30); setWpm(0); setAccuracy(0);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    return (
        <motion.div
            className="typing-wrapper"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="typing-top-bar"></div>
            <div className="typing-inner">
                {/* Header */}
                <div className="typing-header">
                    <div>
                        <div className="typing-title">
                            Cognitive Check
                            <Keyboard size={26} style={{ color: 'var(--c-blue)', animation: 'pulse 2s infinite' }} />
                        </div>
                        <div className="typing-subtitle">Authenticate via Keystroke Dynamics</div>
                    </div>
                    <div className="typing-timer">
                        <span className="typing-timer-label">Time</span>
                        <span className="typing-timer-value">{timeLeft}s</span>
                    </div>
                </div>

                {completed ? (
                    /* ── RESULTS ── */
                    <motion.div
                        className="typing-complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 60 }}
                    >
                        <div className="typing-complete-icon">
                            <Cpu size={48} color="white" />
                        </div>
                        <h2>Identity <span className="text-grad-green">Verified</span></h2>

                        <div className="typing-stats">
                            <div style={{ textAlign: 'center' }}>
                                <div className="typing-stat-label">Reflex Speed</div>
                                <div className="typing-stat-value blue">
                                    {wpm}<span className="typing-stat-unit">WPM</span>
                                </div>
                            </div>
                            <div className="typing-stat-divider"></div>
                            <div style={{ textAlign: 'center' }}>
                                <div className="typing-stat-label">Precision</div>
                                <div className="typing-stat-value green">
                                    {accuracy}<span className="typing-stat-unit">%</span>
                                </div>
                            </div>
                        </div>

                        <button className="retry-btn" onClick={reset}>
                            <RotateCcw size={18} /> Re-Initialize Protocol
                        </button>
                    </motion.div>
                ) : (
                    /* ── TYPING AREA ── */
                    <div>
                        <div className="typing-text-box" onClick={() => inputRef.current?.focus()}>
                            {!started && (
                                <div className="click-overlay">
                                    <span className="click-overlay-badge">Click to Begin Input</span>
                                </div>
                            )}
                            {TEXT.split('').map((char, i) => {
                                let cls = 'char-default';
                                if (i < input.length) cls = input[i] === char ? 'char-correct' : 'char-wrong';
                                const isCursor = i === input.length && started;
                                return (
                                    <span key={i} className={`${cls}${isCursor ? ' char-cursor' : ''}`}>
                                        {char}
                                    </span>
                                );
                            })}
                        </div>

                        <textarea
                            ref={inputRef}
                            className="typing-hidden-input"
                            value={input}
                            onChange={handleChange}
                            disabled={completed}
                            autoComplete="off"
                            spellCheck="false"
                            autoCorrect="off"
                            autoCapitalize="off"
                        />

                        <div className="typing-footer">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-blue)' }}>
                                <Crosshair size={14} /> Data Stream: Active
                            </span>
                            <span>{accuracy}% Accuracy Real-Time</span>
                            <button className="typing-reset" onClick={reset}>↺ Restart</button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
