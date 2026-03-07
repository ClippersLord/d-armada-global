'use client';
import { useEffect, useRef } from 'react';

export function TradingViewMiniChart({ symbol = 'XAUUSD', width = '100%', height = 220 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol, width, height, locale: 'en',
      dateRange: '1M', colorTheme: 'dark',
      isTransparent: true, autosize: false,
      largeChartUrl: '',
    });
    ref.current.appendChild(script);
  }, [symbol, width, height]);
  return <div ref={ref} />;
}

export function TradingViewTicker() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'OANDA:XAUUSD', title: 'Gold' },
        { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
        { proName: 'TVC:DXY', title: 'DXY' },
        { proName: 'OANDA:EURUSD', title: 'EUR/USD' },
        { proName: 'OANDA:GBPUSD', title: 'GBP/USD' },
        { proName: 'OANDA:USDJPY', title: 'USD/JPY' },
      ],
      showSymbolLogo: false, colorTheme: 'dark',
      isTransparent: true, displayMode: 'compact', locale: 'en',
    });
    ref.current.appendChild(script);
  }, []);
  return <div ref={ref} />;
}

export function TradingViewChart({ symbol = 'OANDA:XAUUSD', height = 400 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true, symbol, interval: 'D',
      timezone: 'Etc/UTC', theme: 'dark',
      style: '1', locale: 'en',
      backgroundColor: 'rgba(10, 18, 18, 1)',
      gridColor: 'rgba(26, 48, 46, 0.3)',
      allow_symbol_change: true,
      hide_volume: true,
      height,
    });
    ref.current.appendChild(script);
  }, [symbol, height]);
  return <div ref={ref} style={{ height }} />;
}
