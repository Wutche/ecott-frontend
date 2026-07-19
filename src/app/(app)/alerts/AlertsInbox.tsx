'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiFetchClient } from '@/lib/apiClient';
import { ALERT_TYPE_LABELS, alertSeverityTone, formatRelativeTime } from '@/lib/display';
import type { Alert } from '@/lib/types';
import styles from './alerts.module.css';

export function AlertsInbox({ alerts }: { alerts: Alert[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function markRead(id: string) {
    setPending(true);
    try {
      await apiFetchClient(`/api/alerts/${id}/read`, { method: 'POST' });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function markAllRead() {
    setPending(true);
    try {
      await apiFetchClient('/api/alerts/read-all', { method: 'POST' });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (alerts.length === 0) {
    return (
      <EmptyState
        title="Your inbox is empty"
        description="High-conviction setups, COT phase shifts, and target / stop alerts will land here."
      />
    );
  }

  const hasUnread = alerts.some((alert) => !alert.is_read);

  return (
    <>
      {hasUnread && (
        <div className={styles.toolbar}>
          <button
            type="button"
            className="btn-primary"
            onClick={markAllRead}
            disabled={pending}
          >
            Mark all read
          </button>
        </div>
      )}
      <Card padded={false}>
        <ul className={styles.alertList}>
          {alerts.map((alert) => (
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
                    <span className={styles.alertTime}>{formatRelativeTime(alert.created_at)}</span>
                  </div>
                  <p className={styles.alertTitle}>{alert.title}</p>
                  <p className={styles.alertBodyText}>{alert.body}</p>
                </div>
              </div>
              <div className={styles.alertActions}>
                {!alert.is_read && (
                  <button
                    type="button"
                    className={styles.markReadButton}
                    onClick={() => markRead(alert.id)}
                    disabled={pending}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
