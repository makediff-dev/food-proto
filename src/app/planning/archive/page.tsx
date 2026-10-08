import type { Metadata } from 'next';
import { PlanningArchiveScreen } from '@/features/planning/PlanningArchiveScreen';
import { PLANNING_ARCHIVE_TITLE } from '@/features/planning/paths';

export const metadata: Metadata = {
  title: PLANNING_ARCHIVE_TITLE,
};

export default function PlanningArchivePage() {
  return <PlanningArchiveScreen />;
}
