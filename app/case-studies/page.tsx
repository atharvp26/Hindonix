export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { getCaseStudiesFromDB } from "@/lib/server-data";
import { CaseStudiesClient } from "./CaseStudiesClient";

export const metadata: Metadata = {
  title: "Case Studies - Architectural Hardware Projects",
  description:
    "Real-world projects showcasing Hindonix's architectural hardware, door handles, and door knobs in action.",
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudiesFromDB();
  return <CaseStudiesClient initialCaseStudies={caseStudies} />;
}
