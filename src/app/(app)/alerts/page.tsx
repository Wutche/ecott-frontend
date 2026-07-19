import { PageHeader } from '@/components/ui/PageHeader';
import { getAlerts } from '@/lib/api/endpoints';
import { AlertsInbox } from './AlertsInbox';

export default async function AlertsInboxPage() {
  const { items: alerts, total } = await getAlerts();
  const unreadCount = alerts.filter((alert) => !alert.is_read).length;

  return (
    <>
      <PageHeader
        title="Alerts inbox"
        subtitle={`${unreadCount} unread • ${total} total`}
      />
      <AlertsInbox alerts={alerts} />
    </>
  );
}
