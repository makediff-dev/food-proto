import type { Metadata } from 'next';
import { PlanningScreen } from '@/features/planning/PlanningScreen';
import { PLANNING_SECTION_TITLE, parsePlanningQuery } from '@/features/planning/paths';

export const metadata: Metadata = {
  title: PLANNING_SECTION_TITLE,
};

export default async function PlanningPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const params = await searchParams;
  const query = parsePlanningQuery(params);
  return <PlanningScreen month={query.month} />;
}
