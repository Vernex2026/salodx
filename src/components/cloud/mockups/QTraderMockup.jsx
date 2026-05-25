import { useState } from "react";

export function QTraderMockup() {
  const [view, setView] = useState("live");
  return (
    <div className="case-mockup">
      <MockupHeader
        title="QTrader · platforma tradingowa"
        gain="60fps przy 1247 tick/s. Klient widzi cenę zanim konkurencja wciśnie OK."
        badges={["Real-Time Data", "WebSockets", "AI Analysis"]}
        view={view}
        setView={setView}
      />
      <div className="case-mockup-stage">
        {view === "live" ? <LiveBoard /> : <ArchitectureLog />}
      </div>
    </div>
  );
}

function LiveBoard() {
  return (
    <div className="qtrader-mock">
      <div className="qtrader-mock-header">
        <div>
          <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "15px" }}>BTC/USDT</span>
          <span style={{ color: "#00E5A0", marginLeft: "12px", fontFamily: "'Geist Mono', monospace" }}>42,318.50</span>
          <span style={{ color: "#00E5A0", marginLeft: "8px", fontSize: "12px" }}>+2.34%</span>
        </div>
        <div className="qtrader-mock-live">
          <span className="live-dot" aria-hidden="true" />
          <span>MAINNET · LIVE</span>
        </div>
      </div>
      <div className="qtrader-mock-body">
        <div className="qtrader-mock-book">
          <div className="qtrader-mock-book-head">
            <span>BID</span><span>SIZE</span><span>ASK</span><span>SIZE</span>
          </div>
          {[
            [42318.5, 0.234, 42320.1, 0.89],
            [42317.2, 0.567, 42321.4, 1.234],
            [42315.8, 0.089, 42322.7, 0.456],
            [42314.3, 1.234, 42324.0, 0.678],
            [42312.5, 0.345, 42325.2, 0.234],
            [42310.8, 0.789, 42326.5, 1.456],
          ].map((row, i) => (
            <div key={i} className="qtrader-mock-book-row">
              <span style={{ color: "#00E5A0" }}>{row[0].toFixed(2)}</span>
              <span style={{ color: "#A1A1AA" }}>{row[1].toFixed(3)}</span>
              <span style={{ color: "#FF5A7C" }}>{row[2].toFixed(2)}</span>
              <span style={{ color: "#A1A1AA" }}>{row[3].toFixed(3)}</span>
            </div>
          ))}
        </div>
        <div className="qtrader-mock-chart">
          <svg viewBox="0 0 240 160" preserveAspectRatio="none">
            {[0.25, 0.5, 0.75].map((p) => (
              <line key={p} x1="0" y1={p * 160} x2="240" y2={p * 160} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 18 }).map((_, i) => {
              const x = i * 13 + 4;
              const base = 80 + Math.sin(i * 0.6) * 30 + Math.cos(i * 0.3) * 15;
              const open = base + (((i * 7) % 9) - 4) * 1.3;
              const close = base + (((i * 11) % 13) - 6) * 1.2;
              const high = Math.min(open, close) - 5 - ((i * 3) % 6);
              const low = Math.max(open, close) + 5 + ((i * 5) % 7);
              const up = close < open;
              const color = up ? "#00E5A0" : "#FF5A7C";
              return (
                <g key={i}>
                  <line x1={x + 5} y1={high} x2={x + 5} y2={low} stroke={color} strokeWidth="0.8" />
                  <rect x={x + 1} y={Math.min(open, close)} width="8" height={Math.abs(open - close)} fill={color} />
                </g>
              );
            })}
          </svg>
          <div className="qtrader-mock-chart-meta">
            <span style={{ color: "#A1A1AA", fontSize: "11px", fontFamily: "'Geist Mono', monospace" }}>1H · KANDELABRY</span>
            <span style={{ color: "#00E5A0", fontSize: "11px", fontFamily: "'Geist Mono', monospace" }}>60fps @ 1247 tick/s</span>
          </div>
        </div>
      </div>
      <div className="qtrader-mock-footer">
        <div>
          <span style={{ color: "#71717A", fontSize: "11px", letterSpacing: "0.08em" }}>POZYCJA</span>
          <div style={{ color: "#FFFFFF", fontFamily: "'Geist Mono', monospace", fontSize: "13px", marginTop: "4px" }}>LONG 0.234 BTC</div>
        </div>
        <div>
          <span style={{ color: "#71717A", fontSize: "11px", letterSpacing: "0.08em" }}>PnL</span>
          <div style={{ color: "#00E5A0", fontFamily: "'Geist Mono', monospace", fontSize: "13px", marginTop: "4px" }}>+1,247.83 USDT</div>
        </div>
        <div>
          <span style={{ color: "#71717A", fontSize: "11px", letterSpacing: "0.08em" }}>BALANCE</span>
          <div style={{ color: "#FFFFFF", fontFamily: "'Geist Mono', monospace", fontSize: "13px", marginTop: "4px" }}>48,392.16</div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureLog() {
  return (
    <div className="proof-xray-log">
      <div className="proof-xray-log-head">
        <span style={{ color: "#00E5A0" }}>●</span>
        <span>websocket://stream.qtrader.io/v3/orderbook</span>
        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.4)" }}>eu-west-1</span>
      </div>
      {[
        '< SUBSCRIBE { "channel": "orderbook", "pair": "BTCUSDT", "depth": 25 }',
        '> ACK channel=orderbook subscribed=true',
        '> TICK 42318.50 size=0.234 side=bid ts=1746821938.214',
        '> TICK 42320.10 size=0.890 side=ask ts=1746821938.218',
        '> TICK 42317.20 size=0.567 side=bid ts=1746821938.221',
        '> BATCH normalized 142 events in 0.8ms',
        '> FRAME rendered in 16.4ms — 60fps stable',
        '> AGGREGATE 1247 tick/s · drop_rate=0.000%',
        '> AI_SIGNAL momentum=bullish confidence=0.78',
        '> CIRCUIT_BREAKER armed · max_latency=10ms',
      ].map((line, i) => (
        <div key={i} className="proof-xray-log-line" style={{ animationDelay: `${i * 80}ms` }}>
          <span style={{ color: "rgba(255,255,255,0.30)", marginRight: "10px", width: "32px", display: "inline-block", fontSize: "10px" }}>
            {String(i + 1).padStart(3, "0")}
          </span>
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
}

export function MockupHeader({ title, gain, badges, view, setView }) {
  return (
    <div className="case-mockup-head">
      <div>
        <h3 className="case-mockup-title">{title}</h3>
        <p className="case-mockup-gain">{gain}</p>
        <div className="case-mockup-badges">
          {badges.map((b) => <span key={b} className="case-badge">{b}</span>)}
        </div>
      </div>
      <div className="case-mockup-toggle" role="tablist" aria-label="View mode">
        <button
          type="button"
          role="tab"
          aria-selected={view === "live"}
          data-active={view === "live"}
          onClick={() => setView("live")}
        >
          Live UI
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "xray"}
          data-active={view === "xray"}
          onClick={() => setView("xray")}
        >
          X-Ray Architektura
        </button>
      </div>
    </div>
  );
}
