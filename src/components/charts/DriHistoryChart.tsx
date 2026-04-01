"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Props {
  data: { quarter: string; dri: number }[];
  color: string;
}

export default function DriHistoryChart({ data, color }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
        <XAxis
          dataKey="quarter"
          tick={{ fill: "#555", fontSize: 11 }}
          axisLine={{ stroke: "#222" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#555", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip
          contentStyle={{ background: "#161616", border: "1px solid #333", borderRadius: 8 }}
          labelStyle={{ color: "#ABABAB", fontSize: 12 }}
          itemStyle={{ color: color, fontSize: 13, fontWeight: 700 }}
          formatter={(v: number) => [`DRI ${v}`, ""]}
        />
        <Line
          type="monotone"
          dataKey="dri"
          stroke={color}
          strokeWidth={2.5}
          dot={{ fill: color, r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
