"use client";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Users, AlertTriangle, BarChart2, Shield } from "lucide-react";
import { occupations, getDriColor, getDriLabel, getTopAtRisk, getTopResilient } from "@/data/occupations";

// Aggregate industry stats from occupation data
const industryStats = (() => {
  const map: Record<string, { label: string; total: number; count: number; jobsAtRisk: number }> = {};
  for (const occ of occupations) {
    if (!map[occ.industry]) {
      map[occ.industry] = { label: occ.industryLabel, total: 0, count: 0, jobsAtRisk: 0 };
    }
    map[occ.industry].total += occ.dri;
    map[occ.industry].count += 1;
    map[occ.industry].jobsAtRisk += occ.jobsAtRisk;
  }
  return Object.entries(map).map(([id, v]) => ({
    id,
    label: v.label,
    avgDri: Math.round(v.total / v.count),
    jobsAtRisk: v.jobsAtRisk,
  })).sort((a, b) => b.avgDri - a.avgDri);
})();

const totalJobsAtRisk = occupations.reduce((s, o) => s + o.jobsAtRisk, 0);
const avgDri = Math.round(occupations.reduce((s, o) => s + o.dri, 0) / occupations.length);
const criticalCount = occupations.filter((o) => o.dri >= 80).length;

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "rising") return <TrendingUp size={13} color="#EF4444" />;
  if (trend === "falling") return <TrendingDown size={13} color="#22C55E" />;
  return <Minus size={13} color="#EAB308" />;
}

function DriBar({ dri }: { dri: number }) {
  const color = getDriColor(dri);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#222", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${dri}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 32, textAlign: "right" }}>{dri}</span>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="feature-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ width: 40, height: 40, background: "rgba(139,92,246,0.12)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF" }}>{value}</div>
        <div style={{ fontSize: 13, color: "#ABABAB", marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function HomePage() {
  const topAtRisk = getTopAtRisk(5);
  const topResilient = getTopResilient(5);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section className="dot-grid" style={{ padding: "80px 24px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 28,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#8B5CF6", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#8B5CF6", letterSpacing: "0.06em" }}>
              Q2 2025 — 50 OCCUPATIONS TRACKED
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 68px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "#FFFFFF",
            marginBottom: 20,
          }}>
            What&apos;s your<br />
            <span style={{ color: "#8B5CF6" }}>AI displacement risk?</span>
          </h1>

          <p style={{ fontSize: 18, color: "#ABABAB", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.6 }}>
            The Displacement Risk Index measures AI&apos;s threat to your occupation — scored 0–100. Free. No account needed.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/assess" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 10,
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              color: "#FFFFFF", textDecoration: "none",
              fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em",
            }}>
              Get Your DRI Score <ArrowRight size={16} />
            </Link>
            <Link href="/occupations" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 10,
              background: "#161616", border: "1px solid #333",
              color: "#ABABAB", textDecoration: "none",
              fontSize: 15, fontWeight: 500,
            }}>
              Browse 50 Occupations
            </Link>
          </div>
        </div>
      </section>

      {/* Global Stats */}
      <section style={{ padding: "0 24px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <StatCard
              icon={<AlertTriangle size={20} color="#8B5CF6" />}
              label="Jobs currently at risk"
              value={`${(totalJobsAtRisk / 1_000_000).toFixed(1)}M`}
              sub="Across 50 tracked occupations"
            />
            <StatCard
              icon={<BarChart2 size={20} color="#8B5CF6" />}
              label="Average DRI score"
              value={`${avgDri}/100`}
              sub="Q2 2025 across all roles"
            />
            <StatCard
              icon={<Users size={20} color="#8B5CF6" />}
              label="Critical-risk occupations"
              value={`${criticalCount}`}
              sub="DRI ≥ 80 — actively threatened"
            />
            <StatCard
              icon={<Shield size={20} color="#8B5CF6" />}
              label="Low-risk occupations"
              value={`${occupations.filter((o) => o.dri < 40).length}`}
              sub="DRI < 40 — human premium intact"
            />
          </div>
        </div>
      </section>

      {/* Industry Risk Breakdown */}
      <section style={{ padding: "0 24px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>Risk by Sector</h2>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>Aggregate DRI across tracked occupations per industry</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {industryStats.slice(0, 12).map((ind) => (
              <div key={ind.id} className="feature-card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{ind.label}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: getDriColor(ind.avgDri),
                    background: `${getDriColor(ind.avgDri)}18`,
                    border: `1px solid ${getDriColor(ind.avgDri)}30`,
                    borderRadius: 6, padding: "2px 8px",
                  }}>
                    {getDriLabel(ind.avgDri)}
                  </span>
                </div>
                <DriBar dri={ind.avgDri} />
                <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
                  {(ind.jobsAtRisk / 1000).toFixed(0)}K jobs at risk
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top At Risk + Most Resilient */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {/* Most At Risk */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Most At Risk</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topAtRisk.map((occ, i) => (
                <Link key={occ.id} href={`/occupation/${occ.slug}`} style={{ textDecoration: "none" }}>
                  <div className="feature-card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#444", minWidth: 20 }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{occ.title}</span>
                        <TrendIcon trend={occ.trend} />
                      </div>
                      <span style={{ fontSize: 12, color: "#555" }}>{occ.industryLabel}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: getDriColor(occ.dri), letterSpacing: "-0.04em" }}>{occ.dri}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>DRI</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Most Resilient */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Most Resilient</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topResilient.map((occ, i) => (
                <Link key={occ.id} href={`/occupation/${occ.slug}`} style={{ textDecoration: "none" }}>
                  <div className="feature-card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#444", minWidth: 20 }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{occ.title}</span>
                        <TrendIcon trend={occ.trend} />
                      </div>
                      <span style={{ fontSize: 12, color: "#555" }}>{occ.industryLabel}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: getDriColor(occ.dri), letterSpacing: "-0.04em" }}>{occ.dri}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>DRI</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="purple-card" style={{ padding: "48px 40px", textAlign: "center" }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 12 }}>
              See where <em>your</em> role stands
            </h2>
            <p style={{ fontSize: 16, color: "#ABABAB", marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
              Get a letter grade, timeline forecast, and 3 transition paths — based on your specific job, industry, and experience.
            </p>
            <Link href="/assess" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 10,
              background: "#8B5CF6",
              color: "#FFFFFF", textDecoration: "none",
              fontSize: 15, fontWeight: 600,
            }}>
              Take the Assessment <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
