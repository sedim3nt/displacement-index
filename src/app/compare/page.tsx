"use client";
import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { occupations, getDriColor, getDriGrade } from "@/data/occupations";
import { ArrowRight, Compass, Loader2 } from "lucide-react";

const sorted = [...occupations].sort((a, b) => a.title.localeCompare(b.title));

export default function ComparePage() {
  const [slug1, setSlug1] = useState("");
  const [slug2, setSlug2] = useState("");

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/compare",
  });

  const occ1 = occupations.find((o) => o.slug === slug1);
  const occ2 = occupations.find((o) => o.slug === slug2);

  const handleCompare = () => {
    if (!slug1 || !slug2) return;
    complete("", { body: { slug1, slug2 } });
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 20,
          }}>
            <Compass size={14} color="#8B5CF6" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#8B5CF6", letterSpacing: "0.06em" }}>
              THE CAREER GEOGRAPHER
            </span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 10 }}>
            Compare <span style={{ color: "#8B5CF6" }}>Occupations</span>
          </h1>
          <p style={{ fontSize: 15, color: "#ABABAB", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            Select two occupations to get an AI-powered analysis of displacement resilience, transferable skills, and optimal transition direction.
          </p>
        </div>

        {/* Dropdowns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "end", marginBottom: 32 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
              OCCUPATION A
            </label>
            <select
              value={slug1}
              onChange={(e) => setSlug1(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                background: "#111", border: "1px solid #222", color: "#FFF",
                fontSize: 14, cursor: "pointer", appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
              }}
            >
              <option value="">Select occupation…</option>
              {sorted.map((o) => (
                <option key={o.slug} value={o.slug} disabled={o.slug === slug2}>
                  {o.title} (DRI {o.dri})
                </option>
              ))}
            </select>
          </div>

          <div style={{ paddingBottom: 6 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ArrowRight size={16} color="#8B5CF6" />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
              OCCUPATION B
            </label>
            <select
              value={slug2}
              onChange={(e) => setSlug2(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                background: "#111", border: "1px solid #222", color: "#FFF",
                fontSize: 14, cursor: "pointer", appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
              }}
            >
              <option value="">Select occupation…</option>
              {sorted.map((o) => (
                <option key={o.slug} value={o.slug} disabled={o.slug === slug1}>
                  {o.title} (DRI {o.dri})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compare Button */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button
            onClick={handleCompare}
            disabled={!slug1 || !slug2 || isLoading}
            style={{
              padding: "14px 32px", borderRadius: 10,
              background: slug1 && slug2 ? "linear-gradient(135deg, #8B5CF6, #6D28D9)" : "#222",
              color: slug1 && slug2 ? "#FFF" : "#555",
              border: "none", fontSize: 15, fontWeight: 600,
              cursor: slug1 && slug2 && !isLoading ? "pointer" : "default",
              display: "inline-flex", alignItems: "center", gap: 8,
              opacity: isLoading ? 0.7 : 1,
              letterSpacing: "-0.01em",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                Analyzing…
              </>
            ) : (
              <>
                <Compass size={16} />
                Compare Occupations
              </>
            )}
          </button>
        </div>

        {/* Side-by-side cards */}
        {occ1 && occ2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {[occ1, occ2].map((occ) => {
              const color = getDriColor(occ.dri);
              return (
                <div key={occ.slug} className="feature-card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#8B5CF6", fontWeight: 600, marginBottom: 4 }}>{occ.industryLabel}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em" }}>{occ.title}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 36, fontWeight: 900, color, letterSpacing: "-0.06em", lineHeight: 1 }}>
                        {getDriGrade(occ.dri)}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color }}>{occ.dri}/100</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                    <div style={{ color: "#555" }}>Automation</div>
                    <div style={{ fontWeight: 600, textAlign: "right" }}>{occ.automationPct}%</div>
                    <div style={{ color: "#555" }}>Salary</div>
                    <div style={{ fontWeight: 600, textAlign: "right" }}>${(occ.medianSalary / 1000).toFixed(0)}K</div>
                    <div style={{ color: "#555" }}>Jobs at Risk</div>
                    <div style={{ fontWeight: 600, textAlign: "right" }}>{(occ.jobsAtRisk / 1000).toFixed(0)}K</div>
                    <div style={{ color: "#555" }}>Timeline</div>
                    <div style={{ fontWeight: 600, textAlign: "right" }}>{occ.replacementTimeline}</div>
                    <div style={{ color: "#555" }}>Human Premium</div>
                    <div style={{ fontWeight: 600, textAlign: "right" }}>{occ.factors.humanValuePremium}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AI Analysis */}
        {(completion || isLoading) && (
          <div className="purple-card" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Compass size={18} color="#8B5CF6" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#8B5CF6", letterSpacing: "0.04em" }}>
                CAREER GEOGRAPHER ANALYSIS
              </span>
            </div>
            {completion ? (
              <div style={{ fontSize: 15, color: "#ABABAB", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {completion}
              </div>
            ) : (
              <div style={{ fontSize: 14, color: "#555" }}>Generating comparison…</div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
