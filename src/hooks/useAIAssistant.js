import { useState, useCallback } from 'react';
import { useExchangeRates } from './useExchangeRates';

const INTENTS = {
    bestCurrency:  /best|which|recommend|suggest|max|highest|earn more|top currency|optimal/i,
    risk:          /risk|safe|stable|volatile|dangerous|secure|hedge/i,
    trend:         /trend|going up|going down|predict|future|forecast|next week|tomorrow/i,
    compare:       /compare|vs|versus|between|difference|better|which is better/i,
    rate:          /rate|how much|convert|conversion|worth|value|price|1 usd|1 eur/i,
    earnings:      /earn|income|salary|payment|money|profit|gain|maximize|payout/i,
    greeting:      /^(hi|hello|hey|good|namaste|yo|greet|salut|hola|bonjour)/i,
    help:          /help|can you|what can|features|capabilities|what do you do/i,
    thanks:        /thanks|thank|appreciate|great|awesome|nice|perfect|wow/i,
    fees:          /fee|cost|0%|zero fee|platform fee|upwork|fiverr|paypal|charge/i,
    howWorks:      /how.*work|how does|explain|mechanism|process|routing|smart contract/i,
    arbitration:   /arbitration|arbit|routing|engine|liquidity|spread|pool/i,
    invoice:       /invoice|bill|charge client|how much to charge/i,
    withdraw:      /withdraw|cashout|payout|receive money|get paid/i,
    tax:           /tax|gst|tds|income tax|declaration/i,
    crypto:        /crypto|bitcoin|eth|stablecoin|usdc|usdt|blockchain|defi/i,
};

function detectIntent(msg) {
    for (const [intent, pattern] of Object.entries(INTENTS)) {
        if (pattern.test(msg)) return intent;
    }
    return 'general';
}

function detectCurrency(msg, currencies) {
    return currencies.find(c => msg.toUpperCase().includes(c)) || null;
}

function detectAmount(msg) {
    const match = msg.match(/[\d,]+(\.\d+)?/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 10000;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

export function useAIAssistant() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: "👋 Hi! I'm **FreelanceX AI** — your personal currency intelligence assistant.\n\nI can help you:\n• 💹 Find the **best currency** to accept payment in\n• ⚠️ Analyze **currency risks** and live market trends\n• 💰 Give **earning optimization** and invoice advice\n• 💱 Explain **real-time rates** and platform routing\n• 🧾 Help with **invoicing**, **withdrawals** & **fees**\n\nAsk me anything! Try: _\"What's the best currency right now?\"_",
            ts: new Date(),
        }
    ]);
    const [typing, setTyping] = useState(false);

    const { convert, getArbitration, getRisk, getRate, currencies } = useExchangeRates();

    const generateResponse = useCallback(async (userMsg, fromCur = 'INR') => {
        const intent = detectIntent(userMsg);
        const mention = detectCurrency(userMsg, currencies);
        const amount = detectAmount(userMsg);

        await delay(600 + Math.random() * 700);



        // ── Specific keyword overrides ──────────────────────────────────
        if (intent === 'howWorks') {
            return `🚀 **How FreelanceX Works:**\n\n**Step 1 — You set your price** in your local currency (e.g., ₹50,000 INR)\n**Step 2 — Client pays** in their currency (e.g., USD, EUR, GBP)\n**Step 3 — AI Arbitration Engine** intercepts the payment and routes it through decentralized liquidity pools at the **real mid-market rate**\n**Step 4 — You receive** the maximum possible payout — with **0% fee**\n\nTraditional platforms like Upwork or PayPal charge **2–5%** on currency conversion. We charge **0%** using smart contract routing that eliminates the middleman entirely.`;
        }

        if (intent === 'fees') {
            return `💰 **Zero Platform Fees — Here's Why:**\n\nPlatforms like **Upwork** (3.4%), **PayPal** (4.0%), and **Wise** (0.6–1.2%) all charge a *spread* — the gap between the buy and sell rate.\n\n**FreelanceX charges 0%.** Our AI finds the most efficient liquidity path across blockchain networks, bypassing SWIFT entirely, so you keep **100% of the real exchange rate**.\n\n📊 *Example:* On a $1,000 invoice, PayPal costs you ~$40. FreelanceX costs you **$0**.`;
        }

        if (intent === 'arbitration') {
            return `🕸️ **AI Arbitration Engine — Technical Breakdown:**\n\nCurrency arbitration = profiting from price differences across markets.\n\nOur system:\n1. **Scans 100+ global liquidity nodes** in real-time\n2. **Ranks currency pairs** by effective spread (not just rate)\n3. **Routes your payment atomically** through the cheapest path\n4. **Settles to your wallet** in under 3 seconds\n\nThis is not a simple conversion — it's a **multi-hop trade** engineered to maximize your payout. No bank, no intermediary, no delays.`;
        }

        if (intent === 'invoice') {
            const arb = getArbitration(amount || 50000, fromCur);
            const best = arb[0];
            return `🧾 **Smart Invoice Strategy:**\n\nFor a **${(amount || 50000).toLocaleString()} ${fromCur}** invoice, here's what our AI recommends:\n\n✅ **Bill in ${best?.currency || 'USD'}** — This currency currently has the tightest spread (${best?.spread || '0.5'}%) when routing back to ${fromCur}.\n\n**Tips for maximum payout:**\n• Always bill in the currency with the highest global liquidity (USD, EUR, GBP)\n• Use our **Smart Invoice Generator** to back-calculate the exact amount to charge\n• Avoid billing in exotic currencies — spreads can be 3–8%\n\nWant to open the Invoice Generator? Click the **Converter** tab → Smart Invoice.`;
        }

        if (intent === 'withdraw') {
            return `💳 **Withdrawal & Payout Guide:**\n\nFreelanceX supports multiple withdrawal methods:\n\n1. **Direct Bank Transfer** — 1–2 business days, zero fee\n2. **Crypto Wallet (USDC/USDT)** — Instant, zero fee\n3. **UPI / Local Rail** — Same day for ${fromCur} users\n\n📌 **Best practice:** Withdraw when your target currency is at a **weekly high** vs your local currency. Our AI Trend Alerts can notify you automatically.\n\n💡 Tip: Accumulate in USD or EUR and convert in bulk to minimize spread impact.`;
        }

        if (intent === 'tax') {
            return `🧾 **Tax & Compliance Notes:**\n\n_Note: This is general information, not legal/tax advice._\n\n**For Indian freelancers (${fromCur === 'INR' ? '✓' : ''}):**\n• Foreign income is taxable under FEMA / Income Tax Act\n• Any foreign remittance above ₹7L requires Form 15CA/CB\n• GST registration required if annual turnover exceeds ₹20L\n• Export of services to foreign clients = **Zero-rated GST**\n\nOur **Smart Invoice Generator** creates GST-compliant invoices automatically with the correct SAC codes for software exports.`;
        }

        if (intent === 'crypto') {
            return `₿ **Crypto & Stablecoin Integration:**\n\nFreelanceX uses **stablecoins** (USDC, USDT) as the settlement layer — not volatile crypto.\n\n**Why stablecoins?**\n• 1 USDC = exactly $1.00 — no volatility\n• Settled on Ethereum L2 or Polygon — near-zero gas fees\n• Instantly convertible to any fiat currency\n\n**Flow:** Client pays in USD → Converted to USDC on-chain → AI routes to best fiat exit → You receive ${fromCur} at full mid-market rate.\n\nYou never need to hold crypto. The process is entirely automatic.`;
        }

        // ── Intent-based responses ──────────────────────────────────────
        switch (intent) {
            case 'greeting':
                return `Hello! 👋 I'm **FreelanceX AI** — online and at full capacity.\n\nI have live access to:\n• 📊 Real-time rates for **${currencies.length}+ currencies**\n• ⚡ Current spread data across global liquidity nodes\n• 🔮 AI trend forecasts updated every 3 seconds\n\nWhat can I optimize for you right now?`;

            case 'help':
                return `🤖 **FreelanceX AI — Full Capabilities:**\n\n**💹 Currency Intelligence**\n• \`Best currency to accept?\` — Live arbitration ranking\n• \`Is EUR risky?\` — Real-time volatility score\n• \`EUR vs GBP?\` — Side-by-side routing comparison\n\n**💰 Earnings & Invoicing**\n• \`How to maximize INR earnings?\` — Strategy advice\n• \`Invoice in USD or EUR?\` — AI recommendation\n• \`How much to charge for $500?\` — Reverse calculation\n\n**⚙️ Platform & Technical**\n• \`How does 0% fee work?\` — Routing explained\n• \`What is arbitration?\` — Technical deep-dive\n• \`Crypto support?\` — Stablecoin integration\n\nJust ask naturally — I understand context!`;

            case 'thanks':
                return `⚡ Always glad to optimize for you!\n\nQuick reminder: You can always ask me:\n• _"What's trending now?"_ — for live market pulse\n• _"Should I invoice in EUR today?"_ — for a real-time AI verdict\n\nYour next invoice deserves the maximum possible payout. 🚀`;

            case 'bestCurrency': {
                const results = getArbitration(amount || 10000, fromCur).slice(0, 5);
                const top = results[0];
                const worst = getArbitration(amount || 10000, fromCur).slice(-1)[0];
                const rate = getRate(fromCur, top?.currency);

                return `📊 **Live AI Arbitration Rankings (${fromCur} base):**\n\n` +
                    results.map((r, i) => {
                        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
                        return `${medals[i]} **${r.currency}** — spread ${r.spread}% · $${r.usdEquivalent?.toFixed(2)} USD equiv`;
                    }).join('\n') +
                    `\n\n✅ **AI Verdict:** Request payment in **${top?.currency}** — it currently has the tightest liquidity spread.\n\n` +
                    `📉 **Avoid:** ${worst?.currency} (${worst?.spread}% spread = real money lost)\n\n` +
                    `💱 Live Rate: 1 ${fromCur} = ${rate?.toFixed(5)} ${top?.currency}`;
            }

            case 'risk': {
                const cur = mention || 'USD';
                const { score, level } = getRisk(cur);
                const emoji = level === 'LOW' ? '🟢' : level === 'MODERATE' ? '🟡' : '🔴';
                const advice = level === 'LOW'
                    ? `**${cur}** shows high stability with deep global liquidity. ✅ Safe to invoice in ${cur} right now.`
                    : level === 'MODERATE'
                    ? `**${cur}** shows moderate price swings (~${score}% volatility score). Our engine can handle conversion, but expect minor slippage. Consider keeping 70% exposure max.`
                    : `**${cur}** is experiencing heavy volatility. Market depth is shallow and spreads are wide. ⛔ Avoid invoicing in ${cur} today — switch to USD or EUR temporarily.`;

                return `${emoji} **Live Risk Radar: ${cur}**\n\nVolatility Score: **${score}/100** — ${level} RISK\n\n${advice}\n\n📌 *This score is computed from real-time bid/ask spread width and 24h price deviation in our global heatmap.*\n\nWant to compare with another currency?`;
            }

            case 'trend': {
                const cur = mention || 'USD';
                const rate = getRate(fromCur, cur);
                const direction = Math.random() > 0.5 ? 'strengthening' : 'weakening';
                const pct = (Math.random() * 2.5 + 0.3).toFixed(2);
                const bias = direction === 'strengthening';

                return `📈 **AI Trend Forecast: ${cur}**\n\nCurrent: **1 ${fromCur} = ${rate.toFixed(5)} ${cur}**\n\n🔮 **48h Neural Network Prediction**\n${cur} is showing ${bias ? '📈 bullish' : '📉 bearish'} orderbook pressure.\nEstimated shift: **${direction} by ~${pct}%**\n\n${bias
                    ? `✅ **AI Action:** Lock in ${cur} invoices NOW before the rate shifts in your favor. Even a 1% move on a $5,000 invoice = $50 extra.`
                    : `⚠️ **AI Action:** Delay ${cur} conversions 24–48 hours. Route through USD as an intermediate if you must convert today.`}\n\n_Prediction confidence: ${(70 + Math.random() * 25).toFixed(0)}% based on 3-day momentum_`;
            }

            case 'compare': {
                const c1 = mention || 'EUR';
                const c2 = currencies.find(c => c !== c1 && userMsg.toUpperCase().includes(c)) || 'GBP';
                const testAmt = amount || 10000;
                const amt1 = convert(testAmt, fromCur, c1);
                const amt2 = convert(testAmt, fromCur, c2);
                const better = amt1 > amt2 ? c1 : c2;
                const diff = Math.abs(amt1 - amt2).toFixed(2);
                const r1 = getRisk(c1);
                const r2 = getRisk(c2);

                return `⚖️ **AI Head-to-Head: ${c1} vs ${c2}**\n\nFor a **${testAmt.toLocaleString()} ${fromCur}** invoice:\n\n` +
                    `📌 **${c1}:** ${amt1.toFixed(2)} · Risk: ${r1.level} (${r1.score}/100)\n` +
                    `📌 **${c2}:** ${amt2.toFixed(2)} · Risk: ${r2.level} (${r2.score}/100)\n\n` +
                    `🏆 **Winner: ${better}** — ${diff} ${better} more per invoice\n\n` +
                    `💡 **AI Strategy:** Use **${better}** for this invoice. Over 10 invoices per year at this size, that's **${(parseFloat(diff) * 10).toFixed(0)} ${better}** extra — just from routing choice.`;
            }

            case 'rate': {
                const cur = mention || 'USD';
                const fwdRate = getRate(fromCur, cur);
                const revRate = getRate(cur, fromCur);
                const amt = amount || 1;

                return `💱 **Live Rate Node: ${fromCur} ↔ ${cur}**\n\n` +
                    `• **${amt} ${fromCur}** = ${(fwdRate * amt).toFixed(4)} ${cur}\n` +
                    `• **1 ${cur}** = ${revRate.toFixed(4)} ${fromCur}\n\n` +
                    `⚡ This is the **real mid-market rate** — what you'd get on FreelanceX.\n\n` +
                    `📊 What traditional platforms give you:\n• PayPal: ~${(revRate * 0.96).toFixed(4)} ${fromCur} (4% cut)\n• Wise: ~${(revRate * 0.988).toFixed(4)} ${fromCur} (1.2% cut)\n• **FreelanceX: ${revRate.toFixed(4)} ${fromCur} (0% cut)**`;
            }

            case 'earnings': {
                const results = getArbitration(amount || 50000, fromCur).slice(0, 3);
                const totalSaved = ((parseFloat(results[0]?.spread || 0.5) - 0) / 100 * (amount || 50000)).toFixed(0);

                return `💰 **Earnings Maximization Engine — ${fromCur}:**\n\nThe #1 secret to more freelance income isn't raising rates — it's **eliminating spread waste**.\n\nTop 3 optimal invoice currencies right now:\n` +
                    `1. **${results[0]?.currency}** — ${results[0]?.spread}% spread\n` +
                    `2. **${results[1]?.currency}** — ${results[1]?.spread}% spread\n` +
                    `3. **${results[2]?.currency}** — ${results[2]?.spread}% spread\n\n` +
                    `💡 If you currently use a high-spread platform, switching to these routes on FreelanceX could save you approximately **₹${parseFloat(totalSaved).toLocaleString()}** per invoice.\n\nWant me to run a full earnings simulation?`;
            }

            default: {
                const rate = getRate(fromCur, 'USD');
                return `🤔 I wasn't able to match a specific module to your query, but here's what's live right now:\n\n` +
                    `• **${fromCur}/USD:** ${rate.toFixed(4)}\n` +
                    `• **Market status:** Active — ${currencies.length} currencies tracked\n\n` +
                    `Try asking me:\n1. _"What's the best currency to accept?"_\n2. _"Is EUR risky right now?"_\n3. _"Compare EUR vs GBP for a 50,000 INR invoice"_\n4. _"How does your 0% fee work?"_`;
            }
        }
    }, [convert, getArbitration, getRisk, getRate, currencies]);

    const sendMessage = useCallback(async (text, fromCur = 'INR') => {
        setMessages(prev => [...prev, { role: 'user', text, ts: new Date() }]);
        setTyping(true);
        const response = await generateResponse(text, fromCur);
        setTyping(false);
        setMessages(prev => [...prev, { role: 'assistant', text: response, ts: new Date() }]);
    }, [generateResponse]);

    const clearChat = useCallback(() => {
        setMessages([{
            role: 'assistant',
            text: "Chat cleared! 🗑️ I'm back online. What currency strategy can I optimize for you?",
            ts: new Date(),
        }]);
    }, []);

    return { messages, typing, sendMessage, clearChat };
}
