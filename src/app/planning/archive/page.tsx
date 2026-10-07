import type { Metadata } from 'next';

import { PLANNING_ARCHIVE_TITLE } from '@/features/planning/paths';
import { PlanningArchiveScreen } from '@/features/planning/planning-archive-screen';

export const metadata: Metadata = {
  title: PLANNING_ARCHIVE_TITLE,
};

export default function PlanningArchivePage() {
  return <PlanningArchiveScreen />;
}
