import type { Metadata } from 'next';
import { SETTINGS_TITLE } from '@/features/settings/paths';
import { SettingsScreen } from '@/features/settings/SettingsScreen';

export const metadata: Metadata = {
  title: SETTINGS_TITLE,
};

export default function SettingsPage() {
  return <SettingsScreen />;
}
