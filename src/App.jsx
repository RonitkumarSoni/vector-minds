import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, PlayCircle, Globe, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import Navbar from './components/Navbar';
import Background3D from './components/Background3D';
import DashboardCards from './components/DashboardCards';
import CurrencyConverter from './components/CurrencyConverter';
import ArbitrationSuggestions from './components/ArbitrationSuggestions';
import EarningsChart from './components/EarningsChart';
import PerformanceStats from './components/PerformanceStats';
import PredictiveTrend from './components/PredictiveTrend';
import RiskIndicator from './components/RiskIndicator';
import ProfitPrediction from './components/ProfitPrediction';
import EarningsSimulator from './components/EarningsSimulator';
import CurrencyHeatmap from './components/CurrencyHeatmap';
import AIAssistant from './components/AIAssistant';
import PlatformFeeBreakdown from './components/PlatformFeeBreakdown';
import LiveMarketDepth from './components/LiveMarketDepth';
import LiveActivityFeed from './components/LiveActivityFeed';
import LoginPage from './components/LoginPage';
import ProfileModal from './components/ProfileModal';

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: .32, ease: [.4, 0, .2, 1], staggerChildren: .07 } },
  exit: { opacity: 0, y: -8, transition: { duration: .16 } },
};
const child = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

function SH({ bar, title, desc, badge, id }) {
  return (
    <div id={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className={`sec-accent ${bar}`} />
        <div>
          <div className="sec-title">{title}</div>
          {desc && <div className="sec-desc">{desc}</div>}
        </div>
      </div>
      {badge && <span className={`badge ${badge.cls}`}>{badge.text}</span>}
    </div>
  );
}

/* ─── Feature Card (homepage only) ───────── */
function FeatureCard({ icon, title, desc, tab, clr, bg, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.03, boxShadow: `0 12px 30px ${bg.replace('.12)', '.3)')}` }}
      whileTap={{ scale: .96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        background: bg, border: `1px solid ${bg.replace(',.12)', '.28)')}`,
        borderRadius: 'var(--r-xl)', padding: '22px 20px',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        backdropFilter: 'blur(12px)',
      }}
      onClick={onClick}
    >
      <div style={{ marginBottom: 14, display: 'inline-flex', padding: 10, borderRadius: 11, background: bg.replace(',.12)', '.2)') }}>
        {icon}
      </div>
      <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--t1)', marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: '.8125rem', color: 'var(--t3)', lineHeight: 1.6 }}>{desc}</div>
      <div style={{ marginTop: 14, fontSize: '.8125rem', fontWeight: 700, color: clr, display: 'flex', alignItems: 'center', gap: 5 }}>
        Open →
      </div>
    </motion.button>
  );
}

/* ══════════════════════════════════
   DASHBOARD — unique landing content
════════════════════════════════════ */
function Dashboard({ setTab }) {
  return (
    <motion.div variants={fade} initial="hidden" animate="visible" exit="exit">

      {/* Hero — premium split layout */}
      <motion.div variants={child} className="hero-wrap">

        {/* Left: Text */}
        <div className="hero-left">
          <motion.div
            className="hero-chip"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="hero-chip-dot" />
            AI-Powered Currency Arbitration Platform
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            Earn More, <span className="hero-grad-ani">Everywhere.</span>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
          >
            Set your invoices in{' '}
            <span className="hero-kw" style={{ display: 'inline-block' }}>your local currency</span>.
            Let clients pay in theirs.
            Our <span className="hero-kw hero-kw-v" style={{ display: 'inline-block' }}>AI arbitration engine</span>{' '}
            finds the <span className="hero-kw hero-kw-g" style={{ display: 'inline-block' }}>maximum real rate</span>{' '}
            after all platform fees — automatically.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          >
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('dash-stats')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Dashboard <ArrowRight size={16} />
            </motion.button>
            <motion.button
              className="btn btn-ghost"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab('simulator')}
            >
              <PlayCircle size={15} /> Simulate Earnings
            </motion.button>
          </motion.div>

          {/* Quick trust badges */}
          <motion.div
            className="hero-badges"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {['🔒 Bank-level Security', '⚡ 3s Rate Updates', '🌍 100+ Currencies', '🤖 AI Ranked'].map((b, i) => (
              <motion.span
                key={b}
                className="hero-badge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {b}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Right: Live stat cards */}
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 55 }}
        >
          {/* Mini stats */}
          <div className="hero-mini-stats">
            {[
              { val: '100+', lbl: 'Currencies', clr: 'var(--vl)' },
              { val: '0%', lbl: 'Fee', clr: 'var(--gl)' },
              { val: 'AI', lbl: 'Insights', clr: 'var(--al)' },
              { val: '3s', lbl: 'Updates', clr: 'var(--c)' },
            ].map((s, i) => (
              <motion.div
                key={s.lbl}
                className="hero-mini-stat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 80 }}
                whileHover={{ scale: 1.05, borderColor: s.clr }}
              >
                <div className="hero-mini-val" style={{ color: s.clr }}>{s.val}</div>
                <div className="hero-mini-lbl">{s.lbl}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="hero-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
          >
            <div className="hero-panel-head">
              <span className="hero-panel-dot" />
              <span className="hero-panel-title">Live Arbitration Feed</span>
              <span className="badge badge-g" style={{ fontSize: '.55rem', padding: '2px 7px' }}>LIVE</span>
            </div>
            {[
              { flag: '🇺🇸', cur: 'USD', gain: '+4.83%', eff: '$541.28', clr: 'var(--gl)', rank: 1 },
              { flag: '🇪🇺', cur: 'EUR', gain: '+4.18%', eff: '$537.90', clr: 'var(--bl)', rank: 2 },
              { flag: '🇬🇧', cur: 'GBP', gain: '+4.01%', eff: '$536.75', clr: 'var(--vl)', rank: 3 },
              { flag: '🇸🇬', cur: 'SGD', gain: '+3.96%', eff: '$536.41', clr: 'var(--c)', rank: 4 },
            ].map((r, i) => (
              <motion.div
                key={r.cur}
                className="hero-arb-row"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <span className="hero-arb-rank">{r.rank}</span>
                <span style={{ fontSize: '1.1rem' }}>{r.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '.9rem', color: 'var(--t1)' }}>{r.cur}</div>
                  <div style={{ fontSize: '.65rem', color: 'var(--t4)', marginTop: 1 }}>Effective USD</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--t1)', fontFamily: 'var(--mono)' }}>{r.eff}</div>
                  <div style={{ fontSize: '.65rem', fontWeight: 700, color: r.clr }}>{r.gain} vs base</div>
                </div>
              </motion.div>
            ))}
            <div className="hero-panel-foot">
              For <strong>50,000 INR</strong> invoice · Updated live
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={child} id="dash-stats"><DashboardCards /></motion.div>

      {/* Feature nav cards */}
      <motion.div variants={child} style={{ marginBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          <FeatureCard icon={<Globe size={22} color="var(--bl)" />} title="Converter" desc="Multi-currency live conversion with quick amounts" tab="converter" clr="var(--bl)" bg="rgba(37,99,235,.12)" onClick={() => setTab('converter')} />
          <FeatureCard icon={<TrendingUp size={22} color="var(--gl)" />} title="Analytics" desc="Exchange rate charts & AI trend forecasts" tab="analytics" clr="var(--gl)" bg="rgba(5,150,105,.12)" onClick={() => setTab('analytics')} />
          <FeatureCard icon={<PlayCircle size={22} color="var(--c)" />} title="Simulator" desc="Model earnings across 10+ currency scenarios" tab="simulator" clr="var(--c)" bg="rgba(6,182,212,.12)" onClick={() => setTab('simulator')} />
          <FeatureCard icon={<Zap size={22} color="var(--vl)" />} title="Performance" desc="WPM & accuracy typing test for skill verification" tab="performance" clr="var(--vl)" bg="rgba(124,58,237,.12)" onClick={() => setTab('performance')} />
        </div>
      </motion.div>

      {/* Live Activity Feed — full width */}
      <motion.div variants={child} style={{ marginBottom: 44 }} className="ani-slide-up">
        <SH bar="sec-acc-v" title="Global Network Pipeline" desc="Real-time arbitration execution routing from freelance transactions worldwide." badge={{ cls: 'badge-c', text: 'Live Feed' }} />
        <div style={{ height: 340 }}>
          <LiveActivityFeed />
        </div>
      </motion.div>

      {/* Heatmap + Alerts */}
      <motion.div variants={child}>
        <div className="two-col smooth-grid">
          <div className="ani-slide-up">
            <SH bar="sec-acc-c" title="Global Currency Heatmap" desc="Stability & volatility by region" badge={{ cls: 'badge-c', text: 'Live' }} />
            <CurrencyHeatmap />
          </div>
          <div className="ani-slide-up" style={{ animationDelay: '0.1s' }}>
            <SH bar="sec-acc-v" title="Live Market Depth" desc="Real-time USD/INR liquidity and orderbook" badge={{ cls: 'badge-v', text: 'Live' }} />
            <LiveMarketDepth />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════
   CONVERTER — full conversion suite
════════════════════════════════════ */
function ConverterPage() {
  return (
    <motion.div variants={fade} initial="hidden" animate="visible" exit="exit">
      <motion.div variants={child} style={{ marginBottom: 44 }}>
        <SH bar="sec-acc-v" title="Live Currency Converter" desc="Convert across 100+ currencies with real-time data" badge={{ cls: 'badge-v', text: 'Real-Time' }} />
        <CurrencyConverter />
      </motion.div>
      <motion.div variants={child}>
        <SH bar="sec-acc-g" title="Arbitration Optimizer" desc="Best currency ranked by effective USD after platform fees" badge={{ cls: 'badge-g', text: 'AI Ranked' }} />
        <ArbitrationSuggestions fromCurrency="INR" amount={50000} />
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════
   ANALYTICS — charts + risk only
════════════════════════════════════ */
function AnalyticsPage() {
  return (
    <motion.div variants={fade} initial="hidden" animate="visible" exit="exit">

      {/* Two charts side by side */}
      <motion.div variants={child} style={{ marginBottom: 44 }} className="ani-slide-up">
        <SH bar="sec-acc-b" title="Exchange Rate Charts" desc="Historical trends across currency pairs — 24h · 7d · 30d" />
        <div className="two-col smooth-grid">
          <EarningsChart fromCur="INR" toCur="USD" />
          <EarningsChart fromCur="INR" toCur="EUR" />
        </div>
      </motion.div>

      {/* Risk radar and AI Prediction — full width splits */}
      <motion.div variants={child} style={{ marginBottom: 44 }} className="two-col smooth-grid">
        <div className="ani-slide-up">
          <SH bar="sec-acc-g" title="Currency Risk Radar" desc="Volatility scores based on market conditions" badge={{ cls: 'badge-g', text: 'Live' }} />
          <RiskIndicator />
        </div>
        <div className="ani-slide-up" style={{ animationDelay: '0.15s' }}>
          <ProfitPrediction />
        </div>
      </motion.div>

      {/* AI Alerts — full width */}
      <motion.div variants={child}>
        <SH bar="sec-acc-a" title="AI Predictive Alerts" desc="Smart notifications for rate changes before they happen" badge={{ cls: 'badge-a', text: 'AI Model' }} />
        <PredictiveTrend />
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════
   SIMULATOR — earnings modeling only
════════════════════════════════════ */
function SimulatorPage() {
  return (
    <motion.div variants={fade} initial="hidden" animate="visible" exit="exit">

      {/* Simulator tool */}
      <motion.div variants={child} style={{ marginBottom: 44 }}>
        <SH bar="sec-acc-c" title="Earnings Simulator" desc="Enter your invoice amount and see real income across currencies after fees" badge={{ cls: 'badge-c', text: 'Scenario Tool' }} />
        <EarningsSimulator />
      </motion.div>

      {/* Transaction Routing / Fee Breakdown */}
      <motion.div variants={child}>
        <SH bar="sec-acc-g" title="Platform Fee Routing" desc="How our AI engine achieves 0% fees via decentralized routing" badge={{ cls: 'badge-g', text: 'Smart Contract' }} />
        <PlatformFeeBreakdown />
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════
   PERFORMANCE — typing test only
════════════════════════════════════ */
function PerformancePage() {
  return (
    <motion.div variants={fade} initial="hidden" animate="visible" exit="exit">
      <motion.div variants={child}>
        <SH bar="sec-acc-g" title="Freelancer Performance Tracker" desc="Prove your typing speed & accuracy to unlock premium client tiers" badge={{ cls: 'badge-c', text: 'Skill Verification' }} />
        <PerformanceStats />
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════
   ROOT
══════════════════════════════════  */
export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flx_user')); } catch { return null; }
  });
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => { setUser(null); setTab('dashboard'); };
  const handleSave = (u) => setUser(u);

  if (isLoggingIn && !user) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
        <button
          onClick={() => setIsLoggingIn(false)}
          style={{ position: 'absolute', top: 24, left: 24, color: 'white', background: 'rgba(255,255,255,.1)', padding: '8px 16px', borderRadius: 99, zIndex: 10 }}
        >
          ← Back to App
        </button>
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  const pages = {
    dashboard: <Dashboard setTab={setTab} />,
    converter: <ConverterPage />,
    analytics: <AnalyticsPage />,
    simulator: <SimulatorPage />,
    performance: <PerformancePage />,
  };

  return (
    <>
      <Background3D />
      <div className="app">
        <Navbar
          activeTab={tab}
          setActiveTab={setTab}
          user={user}
          onEditProfile={() => setShowProfile(true)}
          onLoginClick={() => setIsLoggingIn(true)}
        />

        <main className="main">
          <div className="container">
            <AnimatePresence mode="wait">
              <div key={tab}>{pages[tab]}</div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            © 2026 <strong>FreelanceX</strong> — Global AI Currency Intelligence. Built for elite freelancers. 🌍
          </div>
        </footer>
      </div>

      {/* AI Assistant */}
      <AIAssistant fromCur={user?.currency || 'INR'} />

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <ProfileModal
            user={user}
            onSave={handleSave}
            onLogout={handleLogout}
            onClose={() => setShowProfile(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
