const fs = require('fs');

function fix(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (let [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(file, content);
}

// 1. server/server.js
fix('server/server.js', [
    ['catch (error) {', 'catch {']
]);

// 2. src/App.jsx
fix('src/App.jsx', [
    ["import { ArrowRight, PlayCircle, Globe, Zap, TrendingUp, ShieldCheck } from 'lucide-react';", "import { ArrowRight, PlayCircle, Globe, Zap, TrendingUp } from 'lucide-react';"],
    ['function FeatureCard({ icon, title, desc, tab, clr, bg, onClick }) {', 'function FeatureCard({ icon, title, desc, clr, bg, onClick }) {']
]);

// 3. ArbitrationSuggestions.jsx
fix('src/components/ArbitrationSuggestions.jsx', [
    ["import { Trophy, Info, TrendingDown, Target, Zap, Globe2 } from 'lucide-react';", "import { Target, Zap, Globe2 } from 'lucide-react';"]
]);

// 4. CurrencyConverter.jsx
fix('src/components/CurrencyConverter.jsx', [
    ["import { ArrowUpDown, Activity, Clock, Trash2, CheckCircle2, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';", "import { ArrowUpDown, Activity, Clock, Trash2, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';"],
    ['const [autoRefresh, setAutoRefresh] = useState(true);', '']
]);

// 5. DashboardCards.jsx
fix('src/components/DashboardCards.jsx', [
    ['export default function DashboardCards({ getRate, getHistory }) {', 'export default function DashboardCards({ getHistory }) {']
]);

// 6. EarningsSimulator.jsx
fix('src/components/EarningsSimulator.jsx', [
    ['const { simulate, currencies, meta } = useExchangeRates();', 'const { simulate, currencies } = useExchangeRates();']
]);

// 7. LoginPage.jsx
fix('src/components/LoginPage.jsx', [
    ["import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';", "import { Eye, EyeOff, ArrowRight, ShieldCheck, Check } from 'lucide-react';"]
]);

// 8. PerformanceStats.jsx
fix('src/components/PerformanceStats.jsx', [
    ["import { Keyboard, Cpu, RotateCcw, Play } from 'lucide-react';", "import { Keyboard, Cpu, RotateCcw } from 'lucide-react';"],
    ['}, [started, timeLeft, done]);', '}, [started, timeLeft, done, finishTest, typed]);']
]);

// 9. PlatformFeeBreakdown.jsx
fix('src/components/PlatformFeeBreakdown.jsx', [
    ["import { Network, ArrowRight } from 'lucide-react';", "import { Network } from 'lucide-react';"]
]);

// 10. ProfileModal.jsx
fix('src/components/ProfileModal.jsx', [
    ['const [showAvatarMenu, setShowAvatarMenu] = useState(false);', 'const [, setShowAvatarMenu] = useState(false);']
]);

// 11. ProfitPrediction.jsx
fix('src/components/ProfitPrediction.jsx', [
    ['const { convert, getArbitration, getHistory } = useExchangeRates();', 'const { getArbitration, getHistory } = useExchangeRates();']
]);

// 12. TypingTest.jsx
if (fs.existsSync('src/components/TypingTest.jsx')) {
  fix('src/components/TypingTest.jsx', [
      ["import { Keyboard, Cpu, RotateCcw } from 'lucide-react';", "import { Cpu, RotateCcw } from 'lucide-react';"],
      ['}, [text, timeLeft]);', '}, [text, timeLeft, input]);'],
      ['}, [started, timeLeft, done]);', '}, [started, timeLeft, done, finishTest, input]);']
  ]);
}

// 13. useAIAssistant.js
if (fs.existsSync('src/hooks/useAIAssistant.js')) {
  fix('src/hooks/useAIAssistant.js', [
      ['const msgLower = message.toLowerCase();', ''],
      ['}, [userCurrency, rates, amount, triggerCommand]);', '}, [userCurrency, amount, triggerCommand]);']
  ]);
}

// 14. useExchangeRates.js
if (fs.existsSync('src/hooks/useExchangeRates.js')) {
    fix('src/hooks/useExchangeRates.js', [
        ["import { useState, useEffect, useCallback, useRef } from 'react';", "import { useState, useEffect, useCallback } from 'react';"],
        ['catch (err) {', 'catch {']
    ]);
}

console.log('All replacements complete.');
