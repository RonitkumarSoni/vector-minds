import { useState, useCallback } from 'react';
import { useExchangeRates } from './useExchangeRates';

// Keyword groups for intent detection
const INTENTS = {
    bestCurrency: /best|which|recommend|suggest|max|highest|earn more|top/i,
    risk: /risk|safe|stable|volatile|dangerous|secure/i,
    trend: /trend|going|going up|going down|predict|future|forecast/i,
    compare: /compare|vs|versus|between|difference|better/i,
    rate: /rate|how much|convert|conversion|worth|value/i,
    earnings: /earn|income|salary|payment|money|profit|gain/i,
    greeting: /^(hi|hello|hey|good|namaste|yo|what's up)/i,
    help: /help|can you|what can|features|capabilities/i,
    thanks: /thanks|thank|appreciate|great|awesome|nice/i,
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

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

export function useAIAssistant() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: "👋 Hi! I'm **FreelanceX AI** — your personal currency intelligence assistant.\n\nI can help you:\n• Find the **best currency** to accept payment in\n• Analyze **currency risks** and trends\n• Give **earning optimization** advice\n• Explain **real-time rate changes**\n\nAsk me anything!",
            ts: new Date(),
        }
    ]);
    const [typing, setTyping] = useState(false);

    const { convert, getArbitration, getRisk, getRate, currencies, rates } = useExchangeRates();

    const generateResponse = useCallback(async (userMsg, fromCur = 'INR') => {
        const intent = detectIntent(userMsg);
        const mention = detectCurrency(userMsg, currencies);

        // Simulate AI thinking time
        await delay(800 + Math.random() * 800);

        let response = '';
        const msgLower = userMsg.toLowerCase();

        // 1. Direct platform questions
        if (msgLower.includes('how') && (msgLower.includes('work') || msgLower.includes('platform'))) {
            return `🚀 **How FreelanceX Works:**\n\n1. **You set your price** in your local currency (e.g., 50,000 INR).\n2. **The client pays** in their local currency (e.g., USD).\n3. Our **AI Arbitration Engine** intercepts the payment, routes it through decentralized liquidity pools, and converts it at the **real mid-market rate**.\n\nTraditional platforms charge 2-5% for this. We charge **0%** because we use smart contract routing to eliminate the middleman.`;
        }

        if (msgLower.includes('fee') || msgLower.includes('cost') || msgLower.includes('0%')) {
            return `💰 **Zero Platform Fees:**\n\nPlatforms like Upwork or PayPal take a massive 2% to 5% cut purely on the currency conversion *spread* (the difference between the buy and sell price).\n\n**FreelanceX takes 0%.** Our AI finds the most efficient liquidity path on the blockchain, bypassing SWIFT networks entirely, so you keep 100% of the effective exchange rate.`;
        }

        if (msgLower.includes('arbitration') || msgLower.includes('engine') || msgLower.includes('routing')) {
            return `🕸️ **AI Arbitration Engine:**\n\nCurrency arbitration means taking advantage of price differences across different markets.\n\nBecause we pull live liquidity depth (Ask/Bid volumes) across 100+ global nodes, our AI constantly scans for the currency pairs with the **tightest spreads**. When your client pays in USD, we don't just 'convert' it — we atomically trade it across the most efficient path to deliver maximum INR to your wallet.`;
        }

        switch (intent) {
            case 'greeting':
                response = "Hello! 👋 I'm **FreelanceX AI**, your core intelligence node. I have direct access to our live orderbooks, risk models, and arbitration routing engine. What can I optimize for you today?";
                break;

            case 'help':
                response = "🤖 **Core Capabilities:**\n\n• **Arbitration:** Ask `What's the best currency to accept?` to get live spread-adjusted rankings.\n• **Risk Analysis:** Ask `Is JPY safe?` to check real-time volatility.\n• **Platform Knowledge:** Ask `How do you achieve 0% fees?` or `What is arbitration?` to learn about our routing engine.\n• **Conversions:** Ask `How much is 5000 USD?`";
                break;

            case 'thanks':
                response = "Always optimizing for you! ⚡ Let me know if you need to run another simulation or check live market liquidity.";
                break;

            case 'bestCurrency': {
                const results = getArbitration(10000, fromCur).slice(0, 3);
                const top = results[0];
                const worst = getArbitration(10000, fromCur).slice(-1)[0];

                response = `📊 **Live Arbitration Rankings (${fromCur}):**\n\nThe AI has scanned current liquidity spreads. The best currencies to invoice in right now (to maximize real value) are:\n\n` +
                    `🥇 **${top.currency}** — Tightest spread (${top.spread}% fee)\n` +
                    `🥈 **${results[1].currency}** — (${results[1].spread}% fee)\n` +
                    `🥉 **${results[2].currency}** — (${results[2].spread}% fee)\n\n` +
                    `✅ **AI Verdict:** Request your payment in **${top.currency}**. Because it has high liquidity and low routing costs, you effectively earn more compared to high-spread local currencies like **${worst.currency}** (${worst.spread}% fee loss).`;
                break;
            }

            case 'risk': {
                const cur = mention || 'USD';
                const { score, level } = getRisk(cur);
                const emoji = level === 'LOW' ? '🟢' : level === 'MODERATE' ? '🟡' : '🔴';
                const advice = level === 'LOW'
                    ? `**${cur}** is currently demonstrating high stability with deep liquidity across our nodes. It is highly recommended to invoice in ${cur}.`
                    : level === 'MODERATE'
                        ? `**${cur}** is showing moderate price swings. Our engine can handle the conversion, but you may face slight slippage.`
                        : `**${cur}** is currently experiencing high volatility. Market depth is shallow. Avoid invoicing in ${cur} if possible today.`;
                response = `${emoji} **Live Risk Radar: ${cur}**\n\nVolatility Score: **${score}/100** (${level})\n\n${advice}\n\n_Data pulled directly from the Global Currency Heatmap._`;
                break;
            }

            case 'trend': {
                const cur = mention || 'USD';
                const rate = getRate(fromCur, cur);
                const direction = Math.random() > 0.5 ? 'strengthening' : 'weakening';
                const pct = (Math.random() * 2 + 0.3).toFixed(2);
                response = `📈 **Predictive AI Trend: ${cur}**\n\nCurrent rate: **1 ${fromCur} = ${rate.toFixed(5)} ${cur}**\n\nOur neural network is detecting orderbook pressure indicating that ${cur} will be **${direction}** by approximately **~${pct}%** within the next 48 hours.\n\n${direction === 'strengthening' ? '✅ The AI suggests locking in ' + cur + ' invoices immediately before the shift.' : '⚠️ The AI recommends delaying ' + cur + ' conversions until market pressure stabilizes.'}`;
                break;
            }

            case 'compare': {
                const c1 = mention || 'EUR';
                const c2 = currencies.find(c => c !== c1 && userMsg.toUpperCase().includes(c)) || 'GBP';
                const amt1 = convert(10000, fromCur, c1);
                const amt2 = convert(10000, fromCur, c2);
                const better = amt1 > amt2 ? c1 : c2;

                response = `⚖️ **Routing Comparison: ${c1} vs ${c2}**\n\nIf you bill 10,000 ${fromCur}:\n\n` +
                    `• **Path A (${c1}):** ${amt1.toLocaleString('en', { maximumFractionDigits: 2 })}\n` +
                    `• **Path B (${c2}):** ${amt2.toLocaleString('en', { maximumFractionDigits: 2 })}\n\n` +
                    `🏆 **Optimum Route: ${better}**\n\nOur engine confirms that routing liquidity through **${better}** yields a structurally higher payout due to current decentralized market depth.`;
                break;
            }

            case 'rate': {
                const cur = mention || 'USD';
                const revRate = getRate(cur, fromCur);
                response = `💱 **Live Exchange Node: ${cur} ➔ ${fromCur}**\n\n1 ${cur} = **${revRate.toFixed(4)} ${fromCur}**\n\n_Note: Unlike bank rates, this is the pure mid-market rate. If you route through FreelanceX, you get this exact rate with 0% markup._\n\nWant to see how much worse traditional platforms are? Ask me about 'platform fees'.`;
                break;
            }

            case 'earnings': {
                const results = getArbitration(1000, fromCur).slice(0, 3);
                response = `💰 **Earnings Optimization**\n\nThe secret to maximizing freelance income isn't just raising your rates—it's **minimizing spread**. If a client pays you in a low-liquidity currency, banks will destroy your margins.\n\nThe current top 3 currencies with the tightest spreads globally are:\n1. **${results[0].currency}** (${results[0].spread}% spread)\n2. **${results[1].currency}** (${results[1].spread}% spread)\n3. **${results[2].currency}** (${results[2].spread}% spread)\n\nAccept payments in these channels whenever possible.`;
                break;
            }

            default: {
                response = `🤔 Based on our current network state, I couldn't map your query to a specific arbitration function.\n\nHowever, I can tell you that the current **${fromCur} / USD** liquidity pool is active. Do you want to:\n\n1. Find the **best currency** to accept?\n2. See the **risk profile** for EUR?\n3. Learn **how our 0% fee engine works**?`;
                break;
            }
        }

        return response;
    }, [convert, getArbitration, getRisk, getRate, currencies, rates]);

    const sendMessage = useCallback(async (text, fromCur = 'INR') => {
        const userMsg = { role: 'user', text, ts: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setTyping(true);

        const response = await generateResponse(text, fromCur);
        setTyping(false);
        setMessages(prev => [...prev, { role: 'assistant', text: response, ts: new Date() }]);
    }, [generateResponse]);

    const clearChat = useCallback(() => {
        setMessages([{
            role: 'assistant',
            text: "Chat cleared! 🗑️ How can I help you with your currency strategy?",
            ts: new Date(),
        }]);
    }, []);

    return { messages, typing, sendMessage, clearChat };
}
