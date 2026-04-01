import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DRI Methodology — Displacement Index",
  description: "Full methodology for the Displacement Risk Index (DRI). Data sources, calculation formula, and scoring explanation.",
};

const FACTORS = [
  {
    name: "Task Repeatability",
    weight: "25%",
    description: "How much of the role involves repeating defined tasks with predictable inputs and outputs. Derived from O*NET task taxonomy and McKinsey occupational mapping.",
    color: "#8B5CF6",
  },
  {
    name: "Data Availability",
    weight: "20%",
    description: "Degree to which the occupation's core workflows operate on digitized, structured data accessible to AI systems. Roles working with analog or highly contextual data score lower.",
    color: "#3B82F6",
  },
  {
    name: "AI Capability Match",
    weight: "25%",
    description: "Current and projected AI model capabilities against the core competencies required by the occupation. Evaluated against SWE-bench, MMLU, and domain-specific benchmarks.",
    color: "#F97316",
  },
  {
    name: "Adoption Velocity",
    weight: "20%",
    description: "Speed at which AI automation tools are being deployed in this occupational category. Tracked via BLS hiring trends, Challenger Gray layoff reports, and earnings call AI mentions.",
    color: "#EAB308",
  },
  {
    name: "Human Value Premium",
    weight: "10%",
    description: "Degree to which clients, employers, and society specifically require human judgment, empathy, physical presence, or accountability. Acts as a protective offset against the other risk factors.",
    color: "#22C55E",
  },
];

const SOURCES = [
  { name: "Bureau of Labor Statistics (BLS)", desc: "Occupational employment statistics, task definitions via O*NET, and salary benchmarks" },
  { name: "Challenger Gray & Christmas", desc: "Monthly job cut announcements including AI-attributed layoff data" },
  { name: "World Economic Forum", desc: "Future of Jobs Report 2025 — occupational displacement forecasts and skill trends" },
  { name: "McKinsey Global Institute", desc: "Automation potential by occupation and economic displacement modeling" },
  { name: "Goldman Sachs Research", desc: "AI labor market impact study (2024) — occupational exposure estimates" },
  { name: "Company Earnings Calls", desc: "Quarterly transcripts from S&P 500 companies for AI automation mentions by function" },
  { name: "AI Benchmark Reports", desc: "SWE-bench, MMLU, HumanEval, and domain-specific AI capability assessments" },
  { name: "LinkedIn Economic Graph", desc: "Hiring trend data and job posting volume by occupation" },
];

export default function MethodologyPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px 80px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 12 }}>
            DRI Methodology
          </h1>
          <p style={{ fontSize: 16, color: "#ABABAB", lineHeight: 1.7 }}>
            The Displacement Risk Index (DRI) is a composite score (0–100) measuring the probability and velocity of AI-driven displacement for a given occupation. Higher scores indicate greater near-term risk.
          </p>
        </div>

        {/* Formula */}
        <div className="purple-card" style={{ padding: 28, marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#8B5CF6", letterSpacing: "0.06em", marginBottom: 16 }}>
            CALCULATION FORMULA
          </div>
          <div style={{
            fontFamily: "monospace", fontSize: 15, lineHeight: 2, color: "#ABABAB",
            background: "#0A0A0A", padding: "20px 24px", borderRadius: 10,
            border: "1px solid #222",
          }}>
            <span style={{ color: "#8B5CF6", fontWeight: 700 }}>DRI</span> = (<br />
            &nbsp;&nbsp;<span style={{ color: "#8B5CF6" }}>0.25</span> × Task_Repeatability +<br />
            &nbsp;&nbsp;<span style={{ color: "#3B82F6" }}>0.20</span> × Data_Availability +<br />
            &nbsp;&nbsp;<span style={{ color: "#F97316" }}>0.25</span> × AI_Capability_Match +<br />
            &nbsp;&nbsp;<span style={{ color: "#EAB308" }}>0.20</span> × Adoption_Velocity −<br />
            &nbsp;&nbsp;<span style={{ color: "#22C55E" }}>0.10</span> × Human_Value_Premium<br />
            ) × 100
          </div>
          <p style={{ fontSize: 13, color: "#555", marginTop: 12 }}>
            Each factor is scored 0–100 based on normalized data from the sources below. Scores are updated quarterly as new data becomes available.
          </p>
        </div>

        {/* Factors */}
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 20 }}>Factor Definitions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
          {FACTORS.map((f) => (
            <div key={f.name} className="feature-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#FFF" }}>{f.name}</h3>
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: f.color,
                  background: `${f.color}18`, border: `1px solid ${f.color}30`,
                  borderRadius: 6, padding: "2px 10px",
                }}>
                  Weight: {f.weight}
                </span>
              </div>
              <p style={{ fontSize: 14, color: "#ABABAB", lineHeight: 1.6 }}>{f.description}</p>
            </div>
          ))}
        </div>

        {/* Risk Levels */}
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 20 }}>Risk Level Definitions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 48 }}>
          {[
            { grade: "F / D", range: "80–100", label: "Critical Risk", color: "#EF4444", desc: "Active displacement underway. Expect significant role restructuring within 2–3 years. Immediate transition planning recommended." },
            { grade: "C", range: "60–79", label: "High Risk", color: "#F97316", desc: "Accelerating automation pressure. Core tasks are being automated. Upskilling in AI-adjacent areas is urgent." },
            { grade: "B", range: "40–59", label: "Moderate Risk", color: "#EAB308", desc: "Structural change likely by 2028–2030. Human premium exists but is narrowing. Strategic adaptation advised." },
            { grade: "A", range: "0–39", label: "Low Risk", color: "#22C55E", desc: "Strong human premium. AI augments rather than displaces. Resilience through 2030+ is likely for current practitioners." },
          ].map((r) => (
            <div key={r.grade} className="feature-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: r.color, letterSpacing: "-0.04em" }}>{r.grade}</span>
                <span style={{ fontSize: 12, color: "#555" }}>DRI {r.range}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: r.color, marginBottom: 6 }}>{r.label}</div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Data Sources */}
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 20 }}>Data Sources</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 48 }}>
          {SOURCES.map((s) => (
            <div key={s.name} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              padding: "14px 18px", background: "#111", borderRadius: 10, border: "1px solid #1E1E1E",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B5CF6", marginTop: 7, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#FFF" }}>{s.name}</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 3 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Limitations */}
        <div className="feature-card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 16 }}>Limitations & Caveats</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "DRI scores reflect task-level automation potential, not individual worker outcomes. Highly skilled practitioners in displaced occupations often successfully transition.",
              "Regional variation is significant. Displacement rates in major metro areas can differ substantially from rural markets for the same occupation.",
              "DRI scores are updated quarterly based on available research. Rapid AI capability changes (e.g., a major new model release) may cause scores to change significantly between updates.",
              "Occupations with DRI < 40 still face AI augmentation pressure. 'Low risk' does not mean 'no change' — it means human practitioners retain clear value advantages.",
              "Employer restructuring decisions involve financial, political, and organizational factors beyond AI capability alone. High DRI scores indicate elevated risk, not certainty of displacement.",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#333", marginTop: 8, flexShrink: 0 }} />
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
