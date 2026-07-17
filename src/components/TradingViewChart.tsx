"use client";

import { useEffect, useRef } from "react";

export default function TradingViewChart({
  symbol = "OANDA:XAUUSD",
  height = 650,
}: {
  symbol?: string;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "60",
      timezone: "Asia/Jakarta",
      theme: "dark",
      style: "1",
      locale: "id",
      enable_publishing: false,
      backgroundColor: "rgba(4, 6, 8, 1)",
      gridColor: "rgba(255, 255, 255, 0.06)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-base-black">
      <div className="tradingview-widget-container" style={{ height }} ref={containerRef}>
        <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
}
