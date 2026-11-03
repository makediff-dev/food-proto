import type { Metadata } from 'next';
import { ROLES_TITLE } from '@/features/roles/paths';
import { RolesScreen } from '@/features/roles/RolesScreen';

export const metadata: Metadata = {
  title: ROLES_TITLE,
};

export default function RolesPage() {
  return <RolesScreen />;
}
