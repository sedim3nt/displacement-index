"use client";
import { useState, useRef } from "react";
import { Search, ChevronDown, ArrowRight, TrendingUp, TrendingDown, Minus, CheckCircle } from "lucide-react";
import Link from "next/link";
import { occupations, getDriColor, getDriLabel, getDriGrade, type Occupation } from "@/data/occupations";

// State list
const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

function computePersonalDRI(base: Occupation, yearsExp: number): number {
  // Experience adjustment: more years = more resilience
  const expFactor = yearsExp >= 15 ? -8 : yearsExp >= 10 ? -5 : yearsExp >= 5 ? -2 : 3;
  return Math.max(5, Math.min(99, base.dri + expFactor));
}

function getTimeline(dri: number): string {
  if (dri >= 90) return "High displacement risk in the next 1–2 years";
  if (dri >= 80) return "Significant disruption likely within 2–3 years";
  if (dri >= 70) return "Meaningful automation pressure by 2027";
  if (dri >= 60) return "Structural change in your role by 2028";
  if (dri >= 50) return "AI augmentation will reshape your role by 2029";
  if (dri >= 40) return "Moderate automation exposure through 2030";
  if (dri >= 30) return "Low near-term risk; monitor trends into the 2030s";
  return "Strong human premium — low displacement risk through 2035+";
}

export default function AssessPage() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOcc, setSelectedOcc] = useState<Occupation | null>(null);
  const [years, setYears] = useState(5);
  const [industry, setIndustry] = useState("");
  const [state, setState] = useState("");
  const [result, setResult] = useState<{ dri: number; occ: Occupation } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length >= 2
    ? occupations.filter((o) => o.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  const handleSelect = (occ: Occupation) => {
    setSelectedOcc(occ);
    setQuery(occ.title);
    setIndustry(occ.industry);
    setShowDropdown(false);
  };

  const handleAssess = () => {
    if (!selectedOcc) return;
    const personalDRI = computePersonalDRI(selectedOcc, years);
    setResult({ dri: personalDRI, occ: selectedOcc });
  };

  const grade = result ? getDriGrade(result.dri) : null;
  const gradeColor = result ? getDriColor(result.dri) : "#8B5CF6";

  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px 80px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 12 }}>
            Personal Risk Assessment
          </h1>
          <p style={{ fontSize: 16, color: "#ABABAB", lineHeight: 1.6 }}>
            Enter your role details to receive a personalized Displacement Risk Index score, timeline forecast, and recommended transition paths.
          </p>
        </div>

        {/* Form */}
        <div className="feature-card" style={{ padding: 32, marginBottom: 32 }}>
          {/* Job Title Input */}
          <div style={{ marginBottom: 28, position: "relative" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#ABABAB", marginBottom: 8, letterSpacing: "0.04em" }}>
              JOB TITLE
            </label>
            <div style={{ position: "relative" }}>
              <Search size={16} color="#555" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="e.g. Financial Analyst, Paralegal, Copywriter..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); setSelectedOcc(null); }}
                onFocus={() => setShowDropdown(true)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 40px",
                  background: "#161616",
                  border: "1px solid #333",
                  borderRadius: 10,
                  color: "#FFFFFF",
                  fontSize: 15,
                  outline: "none",
                }}
              />
            </div>
            {showDropdown && filtered.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
                background: "#161616", border: "1px solid #333", borderRadius: 10,
                overflow: "hidden",
              }}>
                {filtered.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => handleSelect(occ)}
                    style={{
                      width: "100%", textAlign: "left", padding: "12px 16px",
                      background: "transparent", border: "none", cursor: "pointer",
                      borderBottom: "1px solid #222", display: "flex", justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#1C1C1C")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#FFF" }}>{occ.title}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{occ.industryLabel}</div>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: getDriColor(occ.dri),
                      background: `${getDriColor(occ.dri)}18`,
                      borderRadius: 6, padding: "2px 8px",
                    }}>
                      DRI {occ.dri}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {selectedOcc && (
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8B5CF6" }}>
                <CheckCircle size={13} />
                <span>{selectedOcc.title} matched — {selectedOcc.automationPct}% task automation estimated</span>
              </div>
            )}
          </div>

          {/* Years of Experience */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#ABABAB", marginBottom: 8, letterSpacing: "0.04em" }}>
              YEARS OF EXPERIENCE — <span style={{ color: "#FFF" }}>{years} year{years !== 1 ? "s" : ""}</span>
            </label>
            <input
              type="range" min={0} max={30} value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#8B5CF6" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "#555" }}>
              <span>0 years</span>
              <span>30 years</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
              {years >= 15 ? "Senior experience provides meaningful displacement buffer (-8 DRI)" :
               years >= 10 ? "Solid experience reduces near-term risk (-5 DRI)" :
               years >= 5 ? "Mid-career experience offers modest protection (-2 DRI)" :
               "Early career roles face highest displacement risk (+3 DRI)"}
            </div>
          </div>

          {/* Industry (auto-filled if role selected) */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#ABABAB", marginBottom: 8, letterSpacing: "0.04em" }}>
              INDUSTRY
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px",
                  background: "#161616", border: "1px solid #333",
                  borderRadius: 10, color: industry ? "#FFF" : "#666",
                  fontSize: 14, appearance: "none", outline: "none",
                }}
              >
                <option value="">Select your industry...</option>
                {Array.from(new Set(occupations.map((o) => o.industry))).map((id) => {
                  const label = occupations.find((o) => o.industry === id)?.industryLabel ?? id;
                  return <option key={id} value={id}>{label}</option>;
                })}
              </select>
              <ChevronDown size={14} color="#555" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* State */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#ABABAB", marginBottom: 8, letterSpacing: "0.04em" }}>
              LOCATION STATE
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px",
                  background: "#161616", border: "1px solid #333",
                  borderRadius: 10, color: state ? "#FFF" : "#666",
                  fontSize: 14, appearance: "none", outline: "none",
                }}
              >
                <option value="">Select your state...</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} color="#555" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          <button
            onClick={handleAssess}
            disabled={!selectedOcc}
            style={{
              width: "100%", padding: "14px",
              background: selectedOcc ? "linear-gradient(135deg, #8B5CF6, #6D28D9)" : "#1C1C1C",
              border: "none", borderRadius: 10,
              color: selectedOcc ? "#FFF" : "#555",
              fontSize: 15, fontWeight: 600, cursor: selectedOcc ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            Generate My Risk Report <ArrowRight size={16} />
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {/* Grade Card */}
            <div className="feature-card" style={{ padding: 32, marginBottom: 24, textAlign: "center" }}>
              <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: "#666", letterSpacing: "0.06em" }}>
                YOUR DISPLACEMENT RISK SCORE
              </div>
              <div style={{
                fontSize: 96, fontWeight: 900, letterSpacing: "-0.06em",
                color: gradeColor, lineHeight: 1,
                filter: `drop-shadow(0 0 32px ${gradeColor}40)`,
              }}>
                {grade}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>
                DRI: <span style={{ color: gradeColor }}>{result.dri}</span>
                <span style={{ fontSize: 14, color: "#555", marginLeft: 4 }}>/100</span>
              </div>
              <div style={{
                marginTop: 8,
                display: "inline-block",
                padding: "4px 14px",
                background: `${gradeColor}18`,
                border: `1px solid ${gradeColor}30`,
                borderRadius: 100,
                fontSize: 13, fontWeight: 600, color: gradeColor,
              }}>
                {getDriLabel(result.dri)} Risk
              </div>
              <p style={{ marginTop: 20, fontSize: 15, color: "#ABABAB", maxWidth: 440, margin: "20px auto 0" }}>
                {result.occ.description}
              </p>
            </div>

            {/* Timeline */}
            <div className="feature-card" style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#666", letterSpacing: "0.06em", marginBottom: 10 }}>
                TIMELINE FORECAST
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#FFF" }}>{getTimeline(result.dri)}</div>
              <div style={{ marginTop: 16, display: "flex", gap: 0, overflow: "hidden", borderRadius: 8 }}>
                {result.occ.history.map((h, i) => (
                  <div key={i} style={{
                    flex: 1, padding: "8px 4px", textAlign: "center",
                    background: i === result.occ.history.length - 1 ? `${getDriColor(h.dri)}20` : "#161616",
                    borderRight: i < result.occ.history.length - 1 ? "1px solid #222" : "none",
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: getDriColor(h.dri) }}>{h.dri}</div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{h.quarter.replace("Q", "Q").replace(" 20", "\n'")}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div className="feature-card" style={{ padding: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#22C55E", letterSpacing: "0.06em", marginBottom: 12 }}>
                  ↑ RISING SKILLS
                </div>
                {result.occ.risingSkills.map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <TrendingUp size={14} color="#22C55E" />
                    <span style={{ fontSize: 14, color: "#ABABAB" }}>{s}</span>
                  </div>
                ))}
              </div>
              <div className="feature-card" style={{ padding: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#EF4444", letterSpacing: "0.06em", marginBottom: 12 }}>
                  ↓ DECLINING SKILLS
                </div>
                {result.occ.decliningSkills.map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <TrendingDown size={14} color="#EF4444" />
                    <span style={{ fontSize: 14, color: "#ABABAB" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transition Paths */}
            <div className="feature-card" style={{ padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#8B5CF6", letterSpacing: "0.06em", marginBottom: 16 }}>
                RECOMMENDED TRANSITION PATHS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {result.occ.transitionPaths.map((path, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", background: "#161616", borderRadius: 10,
                    border: "1px solid #222",
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#8B5CF6", flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#FFF" }}>{path.title}</div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                        {path.overlap}% skill overlap with your current role
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: getDriColor(path.dri) }}>{path.dri}</div>
                      <div style={{ fontSize: 10, color: "#555" }}>DRI</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View Full Profile CTA */}
            <div style={{ textAlign: "center" }}>
              <Link href={`/occupation/${result.occ.slug}`} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 10,
                background: "#161616", border: "1px solid #333",
                color: "#ABABAB", textDecoration: "none",
                fontSize: 14, fontWeight: 500,
              }}>
                View Full {result.occ.title} Profile <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
