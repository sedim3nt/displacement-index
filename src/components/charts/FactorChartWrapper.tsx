"use client";
import dynamic from "next/dynamic";

const FactorChart = dynamic(() => import("./FactorChart"), { ssr: false });

interface Props {
  factors: {
    taskRepeatability: number;
    dataAvailability: number;
    aiCapabilityMatch: number;
    adoptionVelocity: number;
    humanValuePremium: number;
  };
}

export default function FactorChartWrapper(props: Props) {
  return <FactorChart {...props} />;
}
