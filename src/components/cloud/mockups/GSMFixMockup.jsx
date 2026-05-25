import { useState } from "react";
import { MockupHeader } from "./QTraderMockup";

const statusColor = (s) =>
  s === "ready_for_pickup" ? "#00E5A0" :
  s === "released" ? "#71717A" :
  s === "repair_pending" ? "#D4A574" : "#5C7CFA";

export function GSMFixMockup() {
  const [view, setView] = useState("live");
  return (
    <div className="case-mockup">
      <MockupHeader
        title="GSM-FIX · zarządzanie serwisem"
        gain="QR scan → status → SMS klient w 47ms. Hardware × Postgres realtime."
        badges={["QR Automation", "Realtime Postgres", "Hardware Integration"]}
        view={view}
        setView={setView}
      />
      <div className="case-mockup-stage">
        {view === "live" ? <LiveMagazyn /> : <PipelineXRay />}
      </div>
    </div>
  );
}

function LiveMagazyn() {
  const items = [
    { serial: "GSM-2024-001432", model: "iPhone 13 Pro 128GB Graphite", status: "ready_for_pickup", time: "15:42:18" },
    { serial: "GSM-2024-001431", model: "Samsung S23 Ultra 256GB", status: "in_repair", time: "15:40:12" },
    { serial: "GSM-2024-001430", model: "iPhone 14 128GB Midnight", status: "repair_pending", time: "15:38:55" },
    { serial: "GSM-2024-001428", model: "Xiaomi Mi 11 256GB", status: "released", time: "15:41:55" },
    { serial: "GSM-2024-001427", model: "Pixel 7 Pro 128GB", status: "in_repair", time: "15:35:02" },
  ];

  return (
    <div className="saas-mock">
      <header className="saas-mock-header">
        <div>
          <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "13px" }}>MAGAZYN · GSM-FIX</span>
          <span style={{ color: "#A1A1AA", marginLeft: "12px", fontFamily: "'Geist Mono', monospace", fontSize: "11px" }}>47 urządzeń aktywnych</span>
        </div>
        <div className="saas-mock-live">
          <span className="live-dot" aria-hidden="true" />
          <span>KIOSK_03 · ONLINE</span>
        </div>
      </header>
      <div className="saas-mock-body">
        <div className="saas-mock-inventory">
          <div className="saas-mock-inventory-head">
            <span>SERIAL</span><span>MODEL</span><span>STATUS</span><span>TIME</span>
          </div>
          {items.map((it) => (
            <div key={it.serial} className="saas-mock-inventory-row">
              <span style={{ color: "#FFFFFF" }}>{it.serial}</span>
              <span style={{ color: "#A1A1AA", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.model}</span>
              <span style={{ color: statusColor(it.status) }}>{it.status}</span>
              <span style={{ color: "#71717A" }}>{it.time}</span>
            </div>
          ))}
        </div>
        <div className="saas-mock-scanner">
          <div className="saas-mock-scanner-head">
            <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "12px" }}>SKANER QR</span>
            <span className="saas-mock-live">
              <span className="live-dot" aria-hidden="true" />
              <span>ACTIVE</span>
            </span>
          </div>
          <div className="saas-mock-scanner-frame" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="saas-mock-qr">
              {Array.from({ length: 21 }).map((_, ry) =>
                Array.from({ length: 21 }).map((__, rx) => {
                  const isCorner =
                    (rx < 7 && ry < 7) ||
                    (rx > 13 && ry < 7) ||
                    (rx < 7 && ry > 13);
                  const seed = (rx * 31 + ry * 17) % 7;
                  const filled = isCorner
                    ? (rx === 0 || rx === 6 || ry === 0 || ry === 6 ||
                       (rx >= 2 && rx <= 4 && ry >= 2 && ry <= 4))
                    : seed < 3;
                  if (!filled) return null;
                  return <rect key={`${rx}-${ry}`} x={rx * 4.5 + 2} y={ry * 4.5 + 2} width="4" height="4" fill="#FFFFFF" />;
                })
              )}
            </svg>
            <div className="saas-mock-scanner-corner saas-mock-scanner-corner--tl" />
            <div className="saas-mock-scanner-corner saas-mock-scanner-corner--tr" />
            <div className="saas-mock-scanner-corner saas-mock-scanner-corner--bl" />
            <div className="saas-mock-scanner-corner saas-mock-scanner-corner--br" />
            <div className="saas-mock-scanner-line" />
          </div>
          <div className="saas-mock-scanner-recent">
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "9px", letterSpacing: "0.12em" }}>OSTATNIE</div>
            {[
              { time: "15:42:18", serial: "001432", action: "ready_for_pickup" },
              { time: "15:41:55", serial: "001428", action: "released" },
              { time: "15:40:12", serial: "001431", action: "in_repair" },
            ].map((r) => (
              <div key={r.time} className="saas-mock-scanner-recent-row">
                <span style={{ color: "#71717A" }}>{r.time}</span>
                <span style={{ color: "#FFFFFF" }}>{r.serial}</span>
                <span style={{ color: statusColor(r.action) }}>{r.action}</span>
                <span style={{ color: "#00E5A0" }}>✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineXRay() {
  const lines = [
    '< INSERT inventory_items { serial: "GSM-2024-001432", model: "iPhone 13 Pro" }',
    "> UPDATE inventory_items SET status='ready_for_pickup' WHERE serial=$1",
    "> AUDIT log:write { actor: scanner_kiosk_03, qr_decoded: 47ms }",
    "> WEBHOOK notify customer (sms) → +48 600 *** 432",
    "> JOIN customers ON repair_tickets.customer_id ⇒ Nowak J.",
    "> RLS check: firm_id match auth.jwt() ✓",
    "> COMMIT transaction in 12ms",
    "> REALTIME broadcast inventory_change → 4 subscribers",
    "> SCAN_FRAME consumed @ 60fps · qr_engine=zxing-cpp v1.4.0",
    "> THROUGHPUT 247 scans/h · err_rate=0.001%",
  ];
  return (
    <div className="proof-xray-log">
      <div className="proof-xray-log-head">
        <span style={{ color: "#00E5A0" }}>●</span>
        <span>postgres://supabase · inventory_items · realtime</span>
        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.4)" }}>eu-central-1</span>
      </div>
      {lines.map((line, i) => (
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
