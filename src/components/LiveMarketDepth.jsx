import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function LiveMarketDepth() {
    const depthData = [
        { price: 83.45, volB: 120, volA: 10, type: 'bid' },
        { price: 83.48, volB: 340, volA: 50, type: 'bid' },
        { price: 83.50, volB: 500, volA: 120, type: 'bid' },
        { price: 83.52, volB: 800, volA: 300, type: 'bid' },
        { price: 83.55, volB: 1200, volA: 600, type: 'mid' },
        { price: 83.58, volA: 750, volB: 400, type: 'ask' },
        { price: 83.60, volA: 450, volB: 200, type: 'ask' },
        { price: 83.63, volA: 200, volB: 80, type: 'ask' },
        { price: 83.65, volA: 90, volB: 20, type: 'ask' },
    ];

    return (
        <div className="card card-glow" style={{ padding: 24, height: '100%' }}>
            <div className="flex aic jcb mb-5">
                <div>
                    <div className="flex aic gap-3 mb-1">
                        <Activity size={18} style={{ color: 'var(--vl)' }} />
                        <span className="fw-8 t1 fs-lg">Live Market Depth</span>
                    </div>
                    <div className="fs-xs t3">
                        Real-time liquidity across exchange partners (USD/INR)
                    </div>
                </div>
                <span className="badge badge-v" style={{ animation: 'pulse-live 2s infinite' }}>Live Orderbook</span>
            </div>

            <div style={{
                background: 'rgba(0,0,0,.4)',
                borderRadius: 12,
                padding: 16,
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', flexDirection: 'column', gap: 6,
                position: 'relative'
            }}>
                {/* Headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontSize: '.65rem', fontWeight: 800, color: 'var(--t4)', textTransform: 'uppercase', marginBottom: 8 }}>
                    <div style={{ textAlign: 'left' }}>Bid Size</div>
                    <div style={{ textAlign: 'center' }}>Price</div>
                    <div style={{ textAlign: 'right' }}>Ask Size</div>
                </div>

                {/* Rows */}
                {depthData.map((d, i) => (
                    <motion.div
                        key={i}
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontSize: '.8rem', alignItems: 'center', position: 'relative', padding: '2px 0', borderRadius: 4 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.02)' }}
                    >

                        {/* Bid Bar Background */}
                        {d.type === 'bid' && (
                            <motion.div
                                style={{ position: 'absolute', top: 0, bottom: 0, right: '66.6%', background: 'rgba(5, 150, 105, 0.15)', borderRadius: '2px 0 0 2px' }}
                                initial={{ width: 0 }} animate={{ width: `${(d.volB / 1200) * 33.3}%` }} transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
                            />
                        )}

                        <div style={{ color: d.type === 'bid' ? 'var(--gl)' : 'var(--t4)', fontWeight: 600, textAlign: 'left', zIndex: 1, paddingLeft: 4 }}>
                            {d.volB || '-'}
                        </div>

                        <motion.div
                            style={{
                                color: d.type === 'mid' ? 'var(--t1)' : (d.type === 'bid' ? 'var(--gl)' : 'var(--rl)'),
                                fontWeight: d.type === 'mid' ? 800 : 600,
                                fontSize: d.type === 'mid' ? '1rem' : '.8rem',
                                textAlign: 'center', zIndex: 1,
                                background: d.type === 'mid' ? 'rgba(255,255,255,0.05)' : 'transparent',
                                padding: d.type === 'mid' ? '4px 0' : 0,
                                borderRadius: 4,
                                textShadow: d.type === 'mid' ? '0 0 10px rgba(255,255,255,0.3)' : 'none'
                            }}
                            animate={d.type === 'mid' ? { scale: [1, 1.05, 1] } : {}}
                            transition={d.type === 'mid' ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
                        >
                            {d.price.toFixed(2)}
                        </motion.div>

                        {/* Ask Bar Background */}
                        {d.type === 'ask' && (
                            <motion.div
                                style={{ position: 'absolute', top: 0, bottom: 0, left: '66.6%', background: 'rgba(225, 29, 72, 0.15)', borderRadius: '0 2px 2px 0' }}
                                initial={{ width: 0 }} animate={{ width: `${(d.volA / 750) * 33.3}%` }} transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
                            />
                        )}

                        <div style={{ color: d.type === 'ask' ? 'var(--rl)' : 'var(--t4)', fontWeight: 600, textAlign: 'right', zIndex: 1, paddingRight: 4 }}>
                            {d.volA || '-'}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
