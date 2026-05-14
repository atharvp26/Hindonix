export const dynamic = 'force-dynamic';

import { getCaseStudiesFromDB } from "@/lib/server-data";
import { CaseStudiesClient } from "./CaseStudiesClient";

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudiesFromDB();
  return <CaseStudiesClient initialCaseStudies={caseStudies} />;
}
