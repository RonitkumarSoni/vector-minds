import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio } from 'lucide-react';

const TRANSACTIONS = [
    { user: 'S. Patel', from: 'USD', to: 'INR', amount: 4500, saved: 112, time: 'Just now' },
    { user: 'A. Haque', from: 'GBP', to: 'AED', amount: 8200, saved: 240, time: '12s ago' },
    { user: 'M. Chen', from: 'EUR', to: 'SGD', amount: 3100, saved: 85, time: '45s ago' },
    { user: 'J. Smith', from: 'AUD', to: 'USD', amount: 1500, saved: 42, time: '1m ago' },
    { user: 'L. Gomez', from: 'CAD', to: 'MXN', amount: 5600, saved: 180, time: '2m ago' },
    { user: 'D. Kim', from: 'JPY', to: 'KRW', amount: 12000, saved: 320, time: '3m ago' },
    { user: 'P. Dubois', from: 'CHF', to: 'EUR', amount: 9400, saved: 156, time: '5m ago' },
];

export default function LiveActivityFeed() {
    const [items, setItems] = useState(TRANSACTIONS.slice(0, 4));

    useEffect(() => {
        const interval = setInterval(() => {
            setItems((prev) => {
                // Pick a random transaction to add to the top
                const randomTx = TRANSACTIONS[Math.floor(Math.random() * TRANSACTIONS.length)];
                const newTx = { ...randomTx, id: Math.random().toString(), time: 'Just now' };

                // Keep only 4 items
                return [newTx, ...prev.slice(0, 3)].map((item, idx) => ({
                    ...item,
                    // Fake update the times
                    time: idx === 0 ? 'Just now' : idx === 1 ? '12s ago' : idx === 2 ? '45s ago' : '1m ago'
                }));
            });
        }, 4500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card card-glow" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="flex aic jcb mb-5">
                <div>
                    <div className="flex aic gap-3 mb-1">
                        <Radio size={18} style={{ color: 'var(--c)' }} />
                        <span className="fw-8 t1 fs-lg">Live Network Activity</span>
                    </div>
                    <div className="fs-xs t3">
                        Real-time global arbitration routes
                    </div>
                </div>
                <span className="badge badge-c" style={{ animation: 'pulse-live 2s infinite' }}>Broadcasting</span>
            </div>

            <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                <AnimatePresence>
                    {items.map((tx, i) => (
                        <motion.div
                            key={tx.id || tx.user}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: i * 66, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 'var(--r-md)',
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'default'
                            }}
                            whileHover={{ scale: 1.02, x: 5, backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(6,182,212,0.4)', zIndex: 10 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))',
                                    border: '1px solid rgba(6,182,212,0.4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem', fontWeight: 800, color: 'var(--c)'
                                }}>
                                    {tx.user.split(' ')[0][0]}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--t2)' }}>
                                        {tx.from} ➔ {tx.to}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--t4)' }}>{tx.time}</div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--t1)' }}>
                                    ${tx.amount.toLocaleString()}
                                </div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gl)' }}>
                                    +${tx.saved} AI Saved
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
