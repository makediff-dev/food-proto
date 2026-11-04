import { redirect } from 'next/navigation';
import { SETTINGS_HREF } from '@/features/settings/paths';

export default function RolesPage() {
  redirect(SETTINGS_HREF);
}
