"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface Props {
  factors: {
    taskRepeatability: number;
    dataAvailability: number;
    aiCapabilityMatch: number;
    adoptionVelocity: number;
    humanValuePremium: number;
  };
}

const LABELS: Record<string, string> = {
  taskRepeatability: "Task Repeatability",
  dataAvailability: "Data Availability",
  aiCapabilityMatch: "AI Capability Match",
  adoptionVelocity: "Adoption Velocity",
  humanValuePremium: "Human Value Premium",
};

export default function FactorChart({ factors }: Props) {
  const data = Object.entries(factors).map(([key, value]) => ({
    name: LABELS[key] ?? key,
    value,
    isProtective: key === "humanValuePremium",
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fill: "#ABABAB", fontSize: 12 }} axisLine={false} tickLine={false} width={150} />
        <Tooltip
          contentStyle={{ background: "#161616", border: "1px solid #333", borderRadius: 8 }}
          labelStyle={{ color: "#ABABAB", fontSize: 12 }}
          itemStyle={{ fontSize: 13, fontWeight: 700 }}
          formatter={(v: number) => [`${v}/100`, "Score"]}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.isProtective ? "#22C55E" : "#8B5CF6"}
              opacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
