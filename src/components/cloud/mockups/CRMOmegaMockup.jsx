import { useState } from "react";
import { MockupHeader } from "./QTraderMockup";

export function CRMOmegaMockup() {
  const [view, setView] = useState("live");
  return (
    <div className="case-mockup">
      <MockupHeader
        title="CRM Omega · Kancelaria Prawna"
        gain="Migracja 47 238 rekordów. Audit trail każdej zmiany. RLS na każdym wierszu."
        badges={["Supabase", "V12 Migration", "Custom Dashboard"]}
        view={view}
        setView={setView}
      />
      <div className="case-mockup-stage">
        {view === "live" ? <LiveCRM /> : <SchemaXRay />}
      </div>
    </div>
  );
}

function LiveCRM() {
  return (
    <div className="crm-app-mock">
      <aside className="crm-app-mock-sidebar">
        <div className="crm-app-mock-brand">
          <div className="crm-app-mock-brand-mark">K</div>
          <div>
            <div style={{ color: "#FFFFFF", fontSize: "12px", fontWeight: 700 }}>Kancelaria</div>
            <div style={{ color: "#71717A", fontSize: "10px" }}>v.12.4</div>
          </div>
        </div>
        <nav className="crm-app-mock-nav">
          {[
            { label: "Pulpit", active: false },
            { label: "Sprawy", active: true, count: 127 },
            { label: "Klienci", active: false, count: 47 },
            { label: "Dokumenty", active: false, count: 1247 },
            { label: "Audyt", active: false },
            { label: "Ustawienia", active: false },
          ].map((it) => (
            <div key={it.label} className="crm-app-mock-nav-item" data-active={it.active ? "true" : "false"}>
              <span>{it.label}</span>
              {it.count && <span style={{ color: "#52525B", fontSize: "10px" }}>{it.count}</span>}
            </div>
          ))}
        </nav>
      </aside>
      <div className="crm-app-mock-main">
        <div className="crm-app-mock-stats">
          {[
            { label: "Aktywne sprawy", value: "127", trend: "+8" },
            { label: "Klienci", value: "47", trend: "+3" },
            { label: "Dokumenty", value: "1,247", trend: "+82" },
          ].map((s) => (
            <div key={s.label} className="crm-app-mock-stat">
              <div style={{ color: "#71717A", fontSize: "10px", letterSpacing: "0.1em" }}>{s.label.toUpperCase()}</div>
              <div style={{ color: "#FFFFFF", fontFamily: "'Geist', sans-serif", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em", marginTop: "6px" }}>{s.value}</div>
              <div style={{ color: "#00E5A0", fontSize: "10px", fontFamily: "'Geist Mono', monospace", marginTop: "2px" }}>{s.trend} ten tydzień</div>
            </div>
          ))}
        </div>
        <div className="crm-app-mock-table">
          <div className="crm-app-mock-table-head">
            <span>ID</span><span>KLIENT</span><span>SPRAWA</span><span>STATUS</span><span>AUDIT</span>
          </div>
          {[
            ["#K-1432", "Acme Sp. z o.o.", "Umowa NDA", "active", "RLS ✓"],
            ["#K-1433", "Kowalski J.", "Spór najmu", "pending", "RLS ✓"],
            ["#K-1434", "Vernex Sp. z o.o.", "Audit IT", "active", "RLS ✓"],
            ["#K-1435", "Lewandowski K.", "Egzekucja", "active", "RLS ✓"],
            ["#K-1436", "Nowak Trading", "Postępowanie", "closed", "RLS ✓"],
          ].map((row, i) => (
            <div key={i} className="crm-app-mock-table-row">
              <span style={{ color: "#71717A" }}>{row[0]}</span>
              <span style={{ color: "#FFFFFF" }}>{row[1]}</span>
              <span style={{ color: "#D4D4D8" }}>{row[2]}</span>
              <span style={{ color: row[3] === "active" ? "#00E5A0" : row[3] === "pending" ? "#D4A574" : "#A1A1AA" }}>{row[3]}</span>
              <span style={{ color: "#00E5A0" }}>{row[4]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SchemaXRay() {
  return (
    <div className="proof-xray-schema">
      <div className="proof-xray-log-head">
        <span style={{ color: "#00E5A0" }}>●</span>
        <span>schema · public.* · Supabase Postgres</span>
        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.4)" }}>v12 migration</span>
      </div>
      <svg viewBox="0 0 700 360" preserveAspectRatio="xMidYMid meet" className="proof-xray-schema-svg">
        <line x1="180" y1="100" x2="280" y2="180" stroke="#00E5A0" strokeWidth="1.2" strokeDasharray="4 4" className="proof-schema-line" />
        <line x1="420" y1="180" x2="520" y2="100" stroke="#00E5A0" strokeWidth="1.2" strokeDasharray="4 4" className="proof-schema-line" style={{ animationDelay: "200ms" }} />
        <line x1="350" y1="240" x2="350" y2="290" stroke="#00E5A0" strokeWidth="1.2" strokeDasharray="4 4" className="proof-schema-line" style={{ animationDelay: "400ms" }} />
        <text x="220" y="135" fontFamily="Geist Mono" fontSize="9" fill="#00E5A0">1:N (klient_id)</text>
        <text x="460" y="135" fontFamily="Geist Mono" fontSize="9" fill="#00E5A0">1:N (sprawa_id)</text>
        <text x="358" y="270" fontFamily="Geist Mono" fontSize="9" fill="#00E5A0">RLS policy</text>
        <g transform="translate(40, 50)">
          <rect width="140" height="100" rx="10" fill="rgba(10,10,15,0.85)" stroke="#FFFFFF" strokeWidth="1" />
          <text x="14" y="22" fontFamily="Geist Mono" fontSize="11" fontWeight="700" fill="#FFFFFF">klienci</text>
          <line x1="0" y1="32" x2="140" y2="32" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text x="14" y="48" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">id</text><text x="100" y="48" fontFamily="Geist Mono" fontSize="9" fill="#71717A">uuid</text>
          <text x="14" y="62" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">nazwa</text><text x="100" y="62" fontFamily="Geist Mono" fontSize="9" fill="#71717A">text</text>
          <text x="14" y="76" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">nip</text><text x="100" y="76" fontFamily="Geist Mono" fontSize="9" fill="#71717A">text</text>
          <text x="14" y="90" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">audit_log</text><text x="100" y="90" fontFamily="Geist Mono" fontSize="9" fill="#71717A">jsonb</text>
        </g>
        <g transform="translate(280, 130)">
          <rect width="140" height="110" rx="10" fill="rgba(10,10,15,0.85)" stroke="#00E5A0" strokeWidth="1.4" />
          <text x="14" y="22" fontFamily="Geist Mono" fontSize="11" fontWeight="700" fill="#00E5A0">sprawy</text>
          <line x1="0" y1="32" x2="140" y2="32" stroke="rgba(0,229,160,0.30)" strokeWidth="1" />
          <text x="14" y="48" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">id</text><text x="100" y="48" fontFamily="Geist Mono" fontSize="9" fill="#71717A">uuid</text>
          <text x="14" y="62" fontFamily="Geist Mono" fontSize="9" fill="#00E5A0">klient_id</text><text x="100" y="62" fontFamily="Geist Mono" fontSize="9" fill="#71717A">FK</text>
          <text x="14" y="76" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">status</text><text x="100" y="76" fontFamily="Geist Mono" fontSize="9" fill="#71717A">enum</text>
          <text x="14" y="90" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">created_at</text><text x="100" y="90" fontFamily="Geist Mono" fontSize="9" fill="#71717A">tstz</text>
          <text x="14" y="104" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">deadline</text><text x="100" y="104" fontFamily="Geist Mono" fontSize="9" fill="#71717A">date</text>
        </g>
        <g transform="translate(520, 50)">
          <rect width="140" height="100" rx="10" fill="rgba(10,10,15,0.85)" stroke="#FFFFFF" strokeWidth="1" />
          <text x="14" y="22" fontFamily="Geist Mono" fontSize="11" fontWeight="700" fill="#FFFFFF">dokumenty</text>
          <line x1="0" y1="32" x2="140" y2="32" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text x="14" y="48" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">id</text><text x="100" y="48" fontFamily="Geist Mono" fontSize="9" fill="#71717A">uuid</text>
          <text x="14" y="62" fontFamily="Geist Mono" fontSize="9" fill="#00E5A0">sprawa_id</text><text x="100" y="62" fontFamily="Geist Mono" fontSize="9" fill="#71717A">FK</text>
          <text x="14" y="76" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">plik_url</text><text x="100" y="76" fontFamily="Geist Mono" fontSize="9" fill="#71717A">text</text>
          <text x="14" y="90" fontFamily="Geist Mono" fontSize="9" fill="#A1A1AA">hash</text><text x="100" y="90" fontFamily="Geist Mono" fontSize="9" fill="#71717A">text</text>
        </g>
        <g transform="translate(260, 290)">
          <rect width="180" height="48" rx="8" fill="rgba(0,229,160,0.08)" stroke="#00E5A0" strokeWidth="1" />
          <text x="14" y="20" fontFamily="Geist Mono" fontSize="10" fontWeight="700" fill="#00E5A0">POLICY · own_firm_only</text>
          <text x="14" y="36" fontFamily="Geist Mono" fontSize="9" fill="rgba(255,255,255,0.65)">firm_id = auth.jwt() → firm_id</text>
        </g>
      </svg>
      <div className="proof-xray-schema-meta">
        <div className="proof-xray-schema-stat">
          <span style={{ color: "#71717A", fontSize: "10px", letterSpacing: "0.12em" }}>MIGRACJA</span>
          <span style={{ color: "#FFFFFF", fontFamily: "'Geist Mono', monospace", fontSize: "13px" }}>47,238 rekordów · 12.4s</span>
        </div>
        <div className="proof-xray-schema-stat">
          <span style={{ color: "#71717A", fontSize: "10px", letterSpacing: "0.12em" }}>POLICIES</span>
          <span style={{ color: "#00E5A0", fontFamily: "'Geist Mono', monospace", fontSize: "13px" }}>14 active · 0 disabled</span>
        </div>
        <div className="proof-xray-schema-stat">
          <span style={{ color: "#71717A", fontSize: "10px", letterSpacing: "0.12em" }}>AUDIT</span>
          <span style={{ color: "#00E5A0", fontFamily: "'Geist Mono', monospace", fontSize: "13px" }}>all_writes · 100% coverage</span>
        </div>
      </div>
    </div>
  );
}
