import type { Metadata } from "next";
import { DeviceTabs } from "@/components/pages/DeviceTabs";
import { portfolioData } from "@/data/portfolioData";

export const metadata: Metadata = { title: "Device Setup" };

export default function DeviceSetupPage() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">Device Setup</h1>
      <DeviceTabs devices={portfolioData.devices} />
    </>
  );
}
