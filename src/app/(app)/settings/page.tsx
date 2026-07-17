import { PageHeader } from '@/components/ui/PageHeader';
import { getUserProfile } from '@/lib/api/endpoints';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage() {
  const profile = await getUserProfile();

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Trader profile, notification preferences, and risk defaults."
      />
      <SettingsForm profile={profile} />
    </>
  );
}
