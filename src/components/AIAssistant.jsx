import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistant } from '../hooks/useAIAssistant';
import { Bot, X, Send, Trash2, Sparkles } from 'lucide-react';

const QUICK = [
    "How does 0% fee work?",
    "Best currency to accept?",
    "Compare EUR vs GBP",
    "Is USD risky right now?",
];

// Render markdown-like bold **text**
function MsgText({ text }) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return (
        <span>
            {parts.map((p, i) =>
                i % 2 === 1
                    ? <strong key={i} style={{ color: '#fff', fontWeight: 700 }}>{p}</strong>
                    : <span key={i}>{p}</span>
            )}
        </span>
    );
}

export default function AIAssistant({ fromCur = 'INR' }) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const { messages, typing, sendMessage, clearChat } = useAIAssistant();
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    const handleSend = () => {
        const t = input.trim();
        if (!t || typing) return;
        setInput('');
        sendMessage(t, fromCur);
    };

    return (
        <>
            {/* Floating Trigger */}
            <motion.button
                className="ai-fab"
                onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 300); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={open ? {} : { y: [0, -4, 0] }}
                transition={open ? {} : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
                <AnimatePresence mode="wait">
                    <motion.span
                        key={open ? 'x' : 'ai'}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {open ? <X size={22} /> : <Bot size={22} />}
                    </motion.span>
                </AnimatePresence>
                {!open && <span className="ai-fab-badge">{messages.filter(m => m.role === 'assistant').length}</span>}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="ai-panel"
                        initial={{ opacity: 0, x: 60, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 60, scale: 0.92 }}
                        transition={{ type: 'spring', stiffness: 60, damping: 16 }}
                    >
                        {/* Header */}
                        <div className="ai-head">
                            <div className="ai-head-left">
                                <div className="ai-avatar">
                                    <Sparkles size={16} color="white" />
                                </div>
                                <div>
                                    <div className="ai-head-name">FreelanceX AI</div>
                                    <div className="ai-head-sub">Currency Intelligence · Online</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="icon-btn btn-xs" onClick={clearChat} title="Clear chat">
                                    <Trash2 size={13} />
                                </button>
                                <button className="icon-btn btn-xs" onClick={() => setOpen(false)}>
                                    <X size={13} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="ai-messages">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    className={`ai-msg ${msg.role}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="ai-msg-avatar">
                                            <Bot size={13} />
                                        </div>
                                    )}
                                    <div className={`ai-bubble ${msg.role}`}>
                                        {msg.text.split('\n').map((line, j) => (
                                            <div key={j} className={line === '' ? 'ai-spacer' : ''}>
                                                {line && <MsgText text={line} />}
                                            </div>
                                        ))}
                                        <div className="ai-ts">{msg.ts?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {typing && (
                                <motion.div
                                    className="ai-msg assistant"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="ai-msg-avatar"><Bot size={13} /></div>
                                    <div className="ai-bubble assistant ai-typing">
                                        <span /><span /><span />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Quick Replies */}
                        <div className="ai-quick">
                            {QUICK.map(q => (
                                <button
                                    key={q}
                                    className="ai-quick-btn"
                                    onClick={() => { setInput(''); sendMessage(q, fromCur); }}
                                    disabled={typing}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="ai-input-row">
                            <input
                                ref={inputRef}
                                className="ai-input"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about currencies, earnings, risks…"
                                disabled={typing}
                            />
                            <button
                                className="ai-send"
                                onClick={handleSend}
                                disabled={!input.trim() || typing}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
