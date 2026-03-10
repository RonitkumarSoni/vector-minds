import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://open.er-api.com/v6/latest/USD';

const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY', 'BRL'];

export const useRealTimeRates = (base = 'USD', target = 'INR') => {
  const [rates, setRates] = useState({});
  const [currentRate, setCurrentRate] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        if (mounted && response.data && response.data.rates) {
          const fetchedRates = response.data.rates;
          setRates(fetchedRates);
          
          const baseRate = fetchedRates[base] || 1;
          const targetRate = fetchedRates[target] || 1;
          const exchangeRate = targetRate / baseRate;
          
          setCurrentRate(exchangeRate);
          
          const mockHistory = [];
          let tempRate = exchangeRate;
          for(let i = 24; i >= 0; i--) {
            const change = tempRate * (Math.random() * 0.01 - 0.005); 
            tempRate = tempRate - change;
            mockHistory.push({
              time: `${i}h ago`,
              rate: Number(tempRate.toFixed(4)),
              predictive: i === 0 ? tempRate : null
            });
          }
          mockHistory.push({
            time: 'Next 1h (Pred)',
            rate: null,
            predictive: Number((exchangeRate * (1 + (Math.random() * 0.02 - 0.01))).toFixed(4))
          });
          
          setHistoricalData(mockHistory.reverse());
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching rates:", err);
          setError("Failed to fetch live rates. Using offline simulation.");
          
          const mockRate = base === 'USD' && target === 'INR' ? 83.5 : 1.2;
          setCurrentRate(mockRate);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRates();

    const interval = setInterval(() => {
      setCurrentRate(prev => {
        const fluctuation = prev * (Math.random() * 0.001 - 0.0005);
        return Number((prev + fluctuation).toFixed(4));
      });
    }, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [base, target]);

  return { rates, currentRate, historicalData, loading, error, currencies: POPULAR_CURRENCIES };
};
