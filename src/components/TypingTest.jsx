import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Cpu, RotateCcw } from 'lucide-react';

const TEXT = "In a global economy, arbitration mitigates exchange volatility. A true professional freelancer adapts to shifts using predictive models and flawless execution. Precision is mandatory. Speed is your asset. The algorithm demands perfection.";

export default function TypingTest() {
    const [input, setInput] = useState('');
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [accuracy, setAccuracy] = useState(100);
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
        const timeSpent = 60 - timeLeft;
        const finalWpm = timeSpent > 0 ? Math.round((correct / 5) / (timeSpent / 60)) : 0;
        const finalAccuracy = finalInput.length > 0 ? Math.round((correct / finalInput.length) * 100) : 0;
        setWpm(finalWpm);
        setAccuracy(finalAccuracy);
    }, [timeLeft, input]);

    useEffect(() => {
        let t;
        if (started && timeLeft > 0) {
            t = setInterval(() => setTimeLeft(p => p - 1), 1000);
        } else if (timeLeft === 0 && started) {
            finishTest(input);
        }
        return () => clearInterval(t);
    }, [started, timeLeft, finishTest, input]);

    const handleChange = (e) => {
        if (completed) return;
        const val = e.target.value;
        if (!started && val.length > 0) setStarted(true);
        setInput(val);
        let correct = 0;
        for (let i = 0; i < val.length; i++) { if (val[i] === TEXT[i]) correct++; }

        const currentAccuracy = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
        setAccuracy(currentAccuracy);

        const timeSpent = 60 - timeLeft;
        if (started && timeSpent > 0) {
            const currentWpm = Math.round((correct / 5) / (timeSpent / 60));
            setWpm(currentWpm);
        }

        if (val.length >= TEXT.length) finishTest(val);
    };

    const reset = () => {
        setInput(''); setStarted(false); setCompleted(false);
        setTimeLeft(60); setWpm(0); setAccuracy(100);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const completionPercent = Math.round((input.length / TEXT.length) * 100);

    return (
        <div style={{ maxWidth: 1050, margin: '0 auto', fontFamily: 'var(--sans, sans-serif)', padding: '10px' }}>
            <style>{`
                .t-char { transition: color 0.1s; }
                .t-correct { color: #34d399; text-shadow: 0 0 10px rgba(52, 211, 153, 0.4); }
                .t-wrong { color: #ef4444; background: rgba(239, 68, 68, 0.2); border-radius: 2px; }
                .t-cursor { border-left: 2px solid #38bdf8; animation: blink 1s infinite; padding-left: 2px; }
                @keyframes blink { 50% { border-color: transparent; } }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="typing-test-grid"
                style={{
                    gap: 24, alignItems: 'stretch'
                }}
            >
                <div style={{
                    padding: 32,
                    background: 'linear-gradient(160deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#8b5cf6', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                        Freelancer Performance Tracker
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: 8, lineHeight: 1.2 }}>
                        Prove your typing speed & accuracy <span style={{ color: '#94a3b8' }} className="font-normal">to unlock premium client tiers</span>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, marginTop: 12 }}>
                        <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: 8, borderRadius: 8, color: '#a78bfa' }}><Crosshair size={20} /></div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>Skill Verification</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Type the text accurately to verify your skills</div>
                        </div>
                    </div>

                    <div className="typing-stats-grid" style={{ gap: 16, marginBottom: 16 }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '20px 16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Time Left</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: timeLeft <= 10 ? '#ef4444' : '#38bdf8', fontFamily: 'var(--mono)', lineHeight: 1 }}>
                                {timeLeft}s
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '20px 16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Speed</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--mono)', lineHeight: 1 }}>
                                {wpm} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>WPM</span>
                            </div>
                        </div>
                    </div>

                    <div className="typing-stats-grid" style={{ gap: 16, marginTop: 'auto' }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: accuracy < 95 ? '#f59e0b' : '#34d399', fontFamily: 'var(--mono)', lineHeight: 1, marginBottom: 4 }}>
                                {accuracy}%
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Accuracy</div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--mono)', lineHeight: 1, marginBottom: 4 }}>
                                {input.length} <span style={{ color: '#475569' }}>/ {TEXT.length}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Characters</div>
                        </div>
                    </div>

                </div>

                <div style={{
                    padding: 36,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    cursor: completed ? 'default' : 'text'
                }} onClick={() => inputRef.current?.focus()}>

                    <div style={{
                        flex: 1,
                        fontSize: '1.4rem',
                        lineHeight: 1.8,
                        color: '#475569',
                        fontFamily: 'var(--mono)',
                        outline: 'none',
                        position: 'relative'
                    }}>
                        {!started && !completed && input.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                style={{ position: 'absolute', top: -30, left: 0, color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}
                            >
                                Start typing here to begin the test...
                            </motion.div>
                        )}

                        {TEXT.split('').map((char, i) => {
                            let cls = 't-char';
                            if (i < input.length) {
                                cls += input[i] === char ? ' t-correct' : ' t-wrong';
                            }
                            const isCursor = i === input.length && !completed;
                            return (
                                <span key={i} className={`${cls}${isCursor ? ' t-cursor' : ''}`}>
                                    {char}
                                </span>
                            );
                        })}
                    </div>

                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={handleChange}
                        disabled={completed}
                        autoComplete="off" spellCheck="false" autoCorrect="off" autoCapitalize="off"
                        style={{ position: 'absolute', inset: 0, opacity: 0, resize: 'none', background: 'transparent', color: 'transparent', border: 'none', outline: 'none', cursor: 'text', zIndex: 1 }}
                    />

                    <div style={{ marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, paddingRight: 32 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', width: 40 }}>{completionPercent}%</div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, flex: 1, overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #38bdf8)', width: `${completionPercent}%`, transition: 'width 0.2s', borderRadius: 3 }} />
                            </div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); reset(); }}
                            style={{
                                padding: '10px 20px', background: 'rgba(255,255,255,0.03)', color: '#e2e8f0',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        >
                            <RotateCcw size={16} /> Restart
                        </button>
                    </div>

                    {completed && (
                        <motion.div
                            initial={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(15,23,42,0)' }}
                            animate={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(15,23,42,0.85)' }}
                            style={{ position: 'absolute', inset: 0, borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                                style={{ textAlign: 'center' }}
                            >
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}>
                                    <Cpu size={40} color="white" />
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: 8 }}>Test Complete</h2>
                                <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: '1.1rem' }}>Final Score: {wpm} WPM @ {accuracy}% Accuracy</p>

                                <button
                                    onClick={(e) => { e.stopPropagation(); reset(); }}
                                    style={{
                                        padding: '14px 32px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: 'white',
                                        border: 'none', borderRadius: 16, fontSize: '1rem', fontWeight: 700,
                                        display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)', transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <RotateCcw size={18} /> Take Again
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </motion.div>

        </div>
    );
}
