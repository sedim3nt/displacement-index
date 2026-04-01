"use client";
import dynamic from "next/dynamic";

const DriHistoryChart = dynamic(() => import("./DriHistoryChart"), { ssr: false });

interface Props {
  data: { quarter: string; dri: number }[];
  color: string;
}

export default function DriHistoryChartWrapper(props: Props) {
  return <DriHistoryChart {...props} />;
}
