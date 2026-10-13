import type { Metadata } from "next";
import { CoveragePage } from "@/components/marketing/coverage-pages";

export const metadata: Metadata = {
  title: "Service areas & coverage checker · JMWired",
  description:
    "Check fiber coverage in your barangay, find local branch offices, and see upcoming network expansion areas.",
  alternates: { canonical: "/coverage" },
};

export default function Page() {
  return <CoveragePage />;
}
