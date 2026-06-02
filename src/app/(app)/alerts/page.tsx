import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { ALERT_INBOX } from '@/lib/fixtures';
import {
  ALERT_TYPE_LABELS,
  alertSeverityTone,
  formatRelativeTime,
} from '@/lib/display';
import styles from './alerts.module.css';

export default function AlertsInboxPage() {
  const unreadCount = ALERT_INBOX.filter((alert) => !alert.is_read).length;

  return (
    <>
      <PageHeader
        title="Alerts inbox"
        subtitle={`${unreadCount} unread • ${ALERT_INBOX.length} total`}
        actions={
          <>
            <button type="button" className={styles.outlineButton}>
              Filter
            </button>
            <button type="button" className="btn-primary">
              Mark all read
            </button>
          </>
        }
      />

      {ALERT_INBOX.length === 0 ? (
        <EmptyState
          title="Your inbox is empty"
          description="High-conviction setups, COT phase shifts, and target / stop alerts will land here."
        />
      ) : (
        <Card padded={false}>
          <ul className={styles.alertList}>
            {ALERT_INBOX.map((alert) => (
              <li
                key={alert.id}
                className={`${styles.alertRow} ${alert.is_read ? styles.read : styles.unread}`}
              >
                <div className={styles.alertLeft}>
                  <span
                    className={styles.unreadDot}
                    style={{ opacity: alert.is_read ? 0 : 1 }}
                    aria-hidden="true"
                  />
                  <div className={styles.alertBody}>
                    <div className={styles.alertHeader}>
                      <Badge tone={alertSeverityTone(alert.severity)} variant="soft">
                        {ALERT_TYPE_LABELS[alert.alert_type]}
                      </Badge>
                      <span className={styles.alertTime}>
                        {formatRelativeTime(alert.created_at)}
                      </span>
                    </div>
                    <p className={styles.alertTitle}>{alert.title}</p>
                    <p className={styles.alertBodyText}>{alert.body}</p>
                  </div>
                </div>
                <div className={styles.alertActions}>
                  {!alert.is_read && (
                    <button type="button" className={styles.markReadButton}>
                      Mark read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
