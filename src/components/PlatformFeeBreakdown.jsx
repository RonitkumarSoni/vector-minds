import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

const NODES = [
    { id: 'client', label: 'Client (USD)', x: 10, y: 50, color: 'var(--bl)' },
    { id: 'node1', label: 'Liquidity Pool A', x: 40, y: 20, color: 'var(--gl)' },
    { id: 'node2', label: 'Smart Contract', x: 45, y: 80, color: 'var(--vl)' },
    { id: 'node3', label: 'Arbitration Engine', x: 70, y: 50, color: 'var(--c)' },
    { id: 'freelancer', label: 'You (INR)', x: 90, y: 50, color: 'var(--gl)' },
];

const EDGES = [
    { from: 'client', to: 'node1' },
    { from: 'client', to: 'node2' },
    { from: 'node1', to: 'node3' },
    { from: 'node2', to: 'node3' },
    { from: 'node3', to: 'freelancer' },
];

export default function PlatformFeeBreakdown() {
    const platforms = [
        { name: 'Traditional Platforms', fee: 20, clr: 'var(--rl)', retain: 80, delay: 0 },
        { name: 'International Wire', fee: 4.5, clr: 'var(--al)', retain: 95.5, delay: 0.1 },
        { name: 'FreelanceX AI Route', fee: 0, clr: 'var(--gl)', retain: 100, delay: 0.2 },
    ];

    return (
        <motion.div
            className="card card-shine"
            style={{ padding: 28, height: '100%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex aic jcb mb-5">
                <div>
                    <div className="flex aic gap-3 mb-1">
                        <Network size={18} style={{ color: 'var(--c)' }} />
                        <span className="fw-8 t1 fs-lg">AI Transaction Routing</span>
                    </div>
                    <div className="fs-xs t3">
                        How we achieve a 0% platform fee using decentralized liquidity.
                    </div>
                </div>
                <span className="badge badge-c">Blockchain</span>
            </div>

            <div style={{
                position: 'relative', height: 220,
                background: 'rgba(0,0,0,.25)', borderRadius: 16,
                border: '1px solid rgba(255,255,255,.05)',
                marginBottom: 24, overflow: 'hidden'
            }}>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <defs>
                        <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(37,99,235,0.2)" />
                            <stop offset="50%" stopColor="rgba(6,182,212,0.8)" />
                            <stop offset="100%" stopColor="rgba(5,150,105,0.2)" />
                        </linearGradient>
                    </defs>
                    {EDGES.map((edge, i) => {
                        const start = NODES.find(n => n.id === edge.from);
                        const end = NODES.find(n => n.id === edge.to);
                        return (
                            <g key={i}>
                                <line
                                    x1={`${start.x}%`} y1={`${start.y}%`}
                                    x2={`${end.x}%`} y2={`${end.y}%`}
                                    stroke="rgba(255,255,255,0.05)" strokeWidth="2"
                                    strokeDasharray="4 4"
                                />
                                <motion.line
                                    x1={`${start.x}%`} y1={`${start.y}%`}
                                    x2={`${end.x}%`} y2={`${end.y}%`}
                                    stroke="url(#line-grad)" strokeWidth="3"
                                    initial={{ strokeDashoffset: -100, strokeDasharray: "10 40" }}
                                    animate={{ strokeDashoffset: 100 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: i * 0.2 }}
                                />
                            </g>
                        );
                    })}
                </svg>

                {NODES.map((node, i) => (
                    <motion.div
                        key={node.id}
                        style={{
                            position: 'absolute',
                            left: `${node.x}%`, top: `${node.y}%`,
                            transform: 'translate(-50%, -50%)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            gap: 6,
                            cursor: 'pointer'
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: i * 0.15, stiffness: 120 }}
                        whileHover={{ scale: 1.15 }}
                    >
                        <motion.div style={{
                            width: 14, height: 14, borderRadius: '50%',
                            background: node.color,
                        }}
                            animate={{ boxShadow: [`0 0 10px ${node.color}`, `0 0 25px ${node.color}`, `0 0 10px ${node.color}`] }}
                            transition={{ repeat: Infinity, duration: 2 + i * 0.5, ease: "easeInOut" }}
                        />
                        <div style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--t2)', whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>
                            {node.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div>
                <motion.div
                    style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--t2)', marginBottom: 12 }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                >
                    Earnings Retained (vs Alternatives)
                </motion.div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {platforms.map((p, i) => (
                        <motion.div
                            key={p.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 + i * 0.2 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.7rem', marginBottom: 4, color: 'var(--t3)' }}>
                                <span>{p.name}</span>
                                <span style={{ fontWeight: 700, color: p.clr }}>{p.retain}% Retained</span>
                            </div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,.05)', borderRadius: 3, overflow: 'hidden' }}>
                                <motion.div
                                    style={{ height: '100%', background: p.clr, borderRadius: 3 }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${p.retain}%` }}
                                    transition={{ duration: 1.5, delay: 1.5 + p.delay, ease: "easeOut" }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
