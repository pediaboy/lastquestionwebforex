"use client";

import { useEffect, useRef } from "react";

export default function EconomicCalendar({ height = 700 }: { height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      isTransparent: false,
      width: "100%",
      height,
      locale: "id",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,gb,jp,au,ca,cn,id",
    });

    containerRef.current.appendChild(script);
  }, [height]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-base-black">
      <div ref={containerRef} style={{ height }} />
    </div>
  );
}
