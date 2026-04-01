"use client";
import { useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, ArrowUpDown } from "lucide-react";
import { occupations, getDriColor, getDriLabel, type Occupation } from "@/data/occupations";

type SortKey = "dri" | "title" | "automationPct" | "medianSalary" | "industryLabel";
type SortDir = "asc" | "desc";

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "rising") return <TrendingUp size={13} color="#EF4444" />;
  if (trend === "falling") return <TrendingDown size={13} color="#22C55E" />;
  return <Minus size={13} color="#EAB308" />;
}

function StatusBadge({ status }: { status: Occupation["status"] }) {
  const colors: Record<string, string> = {
    critical: "#EF4444",
    high: "#F97316",
    moderate: "#EAB308",
    low: "#22C55E",
  };
  const c = colors[status];
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color: c,
      background: `${c}18`, border: `1px solid ${c}30`,
      borderRadius: 6, padding: "2px 8px", textTransform: "capitalize",
    }}>
      {status}
    </span>
  );
}

export default function OccupationsPage() {
  const [sortKey, setSortKey] = useState<SortKey>("dri");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const industries = Array.from(new Set(occupations.map((o) => o.industryLabel))).sort();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir(key === "title" || key === "industryLabel" ? "asc" : "desc"); }
  };

  const sorted = [...occupations]
    .filter((o) => (!filterIndustry || o.industryLabel === filterIndustry) && (!filterStatus || o.status === filterStatus))
    .sort((a, b) => {
      let av = a[sortKey] as string | number;
      let bv = b[sortKey] as string | number;
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => handleSort(k)}
      style={{
        padding: "12px 16px", textAlign: "left", fontSize: 11,
        fontWeight: 700, color: sortKey === k ? "#8B5CF6" : "#555",
        letterSpacing: "0.06em", cursor: "pointer", whiteSpace: "nowrap",
        background: "#111", borderBottom: "1px solid #222",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label} <ArrowUpDown size={11} />
      </span>
    </th>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 8 }}>
            50 Tracked Occupations
          </h1>
          <p style={{ fontSize: 15, color: "#666" }}>
            Sorted by Displacement Risk Index (DRI). Click any occupation for detailed breakdown.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            style={{
              padding: "8px 14px", background: "#161616", border: "1px solid #333",
              borderRadius: 8, color: filterIndustry ? "#FFF" : "#666", fontSize: 13,
            }}
          >
            <option value="">All Industries</option>
            {industries.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "8px 14px", background: "#161616", border: "1px solid #333",
              borderRadius: 8, color: filterStatus ? "#FFF" : "#666", fontSize: 13,
            }}
          >
            <option value="">All Risk Levels</option>
            <option value="critical">Critical (DRI ≥ 80)</option>
            <option value="high">High (DRI 60–79)</option>
            <option value="moderate">Moderate (DRI 40–59)</option>
            <option value="low">Low (DRI &lt; 40)</option>
          </select>
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#555", alignSelf: "center" }}>
            {sorted.length} occupations
          </span>
        </div>

        {/* Table */}
        <div style={{ border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <SortHeader label="OCCUPATION" k="title" />
                  <SortHeader label="INDUSTRY" k="industryLabel" />
                  <SortHeader label="DRI SCORE" k="dri" />
                  <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.06em", background: "#111", borderBottom: "1px solid #222", whiteSpace: "nowrap" }}>TREND</th>
                  <SortHeader label="AUTOMATION %" k="automationPct" />
                  <SortHeader label="MEDIAN SALARY" k="medianSalary" />
                  <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.06em", background: "#111", borderBottom: "1px solid #222" }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((occ, i) => (
                  <tr
                    key={occ.id}
                    style={{ background: i % 2 === 0 ? "#0A0A0A" : "#0D0D0D", cursor: "pointer" }}
                    onClick={() => window.location.href = `/occupation/${occ.slug}`}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#0A0A0A" : "#0D0D0D")}
                  >
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #161616" }}>
                      <Link
                        href={`/occupation/${occ.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontSize: 14, fontWeight: 600, color: "#FFF", textDecoration: "none" }}
                      >
                        {occ.title}
                      </Link>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#666", borderBottom: "1px solid #161616", whiteSpace: "nowrap" }}>
                      {occ.industryLabel}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #161616" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 48, height: 5, background: "#222", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${occ.dri}%`, height: "100%", background: getDriColor(occ.dri), borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: getDriColor(occ.dri), letterSpacing: "-0.03em" }}>{occ.dri}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #161616" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <TrendIcon trend={occ.trend} />
                        <span style={{ fontSize: 12, color: "#555", textTransform: "capitalize" }}>{occ.trend}</span>
                        {occ.trendDelta !== 0 && (
                          <span style={{ fontSize: 11, color: occ.trendDelta > 0 ? "#EF4444" : "#22C55E" }}>
                            {occ.trendDelta > 0 ? "+" : ""}{occ.trendDelta}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: getDriColor(occ.dri), borderBottom: "1px solid #161616" }}>
                      {occ.automationPct}%
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#ABABAB", borderBottom: "1px solid #161616", whiteSpace: "nowrap" }}>
                      ${(occ.medianSalary / 1000).toFixed(0)}K
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #161616" }}>
                      <StatusBadge status={occ.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
