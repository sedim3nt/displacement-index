import { notFound } from "next/navigation";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, ArrowLeft, DollarSign, Users, Calendar } from "lucide-react";
import { occupations, getOccupationBySlug, getDriColor, getDriGrade } from "@/data/occupations";
import DriHistoryChartWrapper from "@/components/charts/DriHistoryChartWrapper";
import FactorChartWrapper from "@/components/charts/FactorChartWrapper";

export function generateStaticParams() {
  return occupations.map((o) => ({ slug: o.slug }));
}

export default async function OccupationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const occ = getOccupationBySlug(slug);
  if (!occ) notFound();

  const driColor = getDriColor(occ.dri);
  const grade = getDriGrade(occ.dri);
  const related = occupations.filter((o) => occ.relatedOccupations.includes(o.slug));

  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Back */}
        <Link href="/occupations" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "#555", textDecoration: "none", marginBottom: 28,
        }}>
          <ArrowLeft size={14} /> Back to Occupations
        </Link>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "#8B5CF6", fontWeight: 600, marginBottom: 6 }}>{occ.industryLabel}</div>
            <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 8 }}>{occ.title}</h1>
            <p style={{ fontSize: 15, color: "#ABABAB", maxWidth: 560, lineHeight: 1.6 }}>{occ.description}</p>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              {occ.trend === "rising" ? <TrendingUp size={15} color="#EF4444" /> :
               occ.trend === "falling" ? <TrendingDown size={15} color="#22C55E" /> :
               <Minus size={15} color="#EAB308" />}
              <span style={{ fontSize: 13, color: "#666", textTransform: "capitalize" }}>
                {occ.trend} risk {occ.trendDelta !== 0 ? `(${occ.trendDelta > 0 ? "+" : ""}${occ.trendDelta} this quarter)` : ""}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{
              fontSize: 80, fontWeight: 900, letterSpacing: "-0.06em",
              color: driColor, lineHeight: 1,
              filter: `drop-shadow(0 0 24px ${driColor}40)`,
            }}>
              {grade}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: driColor, marginTop: 4 }}>{occ.dri}<span style={{ fontSize: 14, color: "#555" }}>/100</span></div>
            <div style={{
              marginTop: 6,
              padding: "3px 12px",
              background: `${driColor}18`,
              border: `1px solid ${driColor}30`,
              borderRadius: 100,
              fontSize: 12, fontWeight: 600, color: driColor, display: "inline-block",
            }}>
              {occ.replacementTimeline}
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { icon: <DollarSign size={16} color="#8B5CF6" />, label: "Median Salary", value: `$${(occ.medianSalary / 1000).toFixed(0)}K/yr` },
            { icon: <Users size={16} color="#8B5CF6" />, label: "Jobs at Risk", value: `${(occ.jobsAtRisk / 1000).toFixed(0)}K` },
            { icon: <Calendar size={16} color="#8B5CF6" />, label: "Automation Est.", value: `${occ.automationPct}%` },
          ].map((s, i) => (
            <div key={i} className="feature-card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, background: "rgba(139,92,246,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <div className="feature-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.06em", marginBottom: 16 }}>
              DRI HISTORY
            </div>
            <DriHistoryChartWrapper data={occ.history} color={driColor} />
          </div>
          <div className="feature-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.06em", marginBottom: 16 }}>
              FACTOR BREAKDOWN
            </div>
            <FactorChartWrapper factors={occ.factors} />
          </div>
        </div>

        {/* Skills */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div className="feature-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#22C55E", letterSpacing: "0.06em", marginBottom: 14 }}>
              RISING SKILLS
            </div>
            {occ.risingSkills.map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <TrendingUp size={14} color="#22C55E" />
                <span style={{ fontSize: 14, color: "#ABABAB" }}>{s}</span>
              </div>
            ))}
          </div>
          <div className="feature-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#EF4444", letterSpacing: "0.06em", marginBottom: 14 }}>
              DECLINING SKILLS
            </div>
            {occ.decliningSkills.map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <TrendingDown size={14} color="#EF4444" />
                <span style={{ fontSize: 14, color: "#ABABAB" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transition Paths */}
        <div className="feature-card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#8B5CF6", letterSpacing: "0.06em", marginBottom: 16 }}>
            TRANSITION PATHS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {occ.transitionPaths.map((path, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 16px", background: "#161616", borderRadius: 10, border: "1px solid #222",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#8B5CF6", flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{path.title}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{path.overlap}% skill overlap</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: getDriColor(path.dri) }}>{path.dri}</div>
                  <div style={{ fontSize: 10, color: "#555" }}>DRI</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        {occ.events.length > 0 && (
          <div className="feature-card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.06em", marginBottom: 16 }}>
              KEY EVENTS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {occ.events.map((ev, i) => {
                const magColor = ev.magnitude === "high" ? "#EF4444" : ev.magnitude === "medium" ? "#F97316" : "#EAB308";
                return (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: magColor, marginTop: 6, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, color: "#555", marginBottom: 3 }}>{ev.date}</div>
                      <div style={{ fontSize: 14, color: "#ABABAB", lineHeight: 1.5 }}>{ev.event}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Tools */}
        {occ.aiTools.length > 0 && (
          <div className="feature-card" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.06em", marginBottom: 14 }}>
              AI TOOLS DRIVING DISPLACEMENT
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {occ.aiTools.map((tool) => (
                <span key={tool} style={{
                  padding: "5px 12px", borderRadius: 100,
                  background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)",
                  fontSize: 13, color: "#8B5CF6", fontWeight: 500,
                }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Occupations */}
        {related.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.06em", marginBottom: 14 }}>
              RELATED OCCUPATIONS
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {related.map((r) => (
                <Link key={r.id} href={`/occupation/${r.slug}`} style={{
                  padding: "10px 16px", borderRadius: 10,
                  background: "#111", border: "1px solid #222",
                  textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#FFF" }}>{r.title}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: getDriColor(r.dri) }}>{r.dri}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
