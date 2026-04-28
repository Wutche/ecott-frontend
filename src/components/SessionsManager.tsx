'use client';

import React from 'react';
import styles from './SessionsManager.module.css';

interface Session {
  id: string;
  label: string;
  pair: string;
  date: string;
  expiresInDays: number;
}

interface SessionsManagerProps {
  onSelectSession?: (pair: string, label: string) => void;
}

export default function SessionsManager({ onSelectSession }: SessionsManagerProps) {
  const [sessions, setSessions] = React.useState<Session[]>([
    { id: '1', label: 'Weekly Setup', pair: 'EUR/USD', date: 'Oct 12, 2026', expiresInDays: 9 },
    { id: '2', label: 'Post-NFP', pair: 'GBP/USD', date: 'Oct 05, 2026', expiresInDays: 2 },
    { id: '3', label: 'Q3 Opening', pair: 'USD/JPY', date: 'Sep 28, 2026', expiresInDays: 0 },
  ]);

  const handleDelete = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleEmail = () => {
    alert('Email report successfully scheduled for ecottrading@gmail.com!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Recent Sessions</h3>
      </div>
      
      {sessions.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          No recent sessions.
        </div>
      ) : (
        <ul className={styles.list}>
          {sessions.map(session => (
            <li key={session.id} className={`${styles.sessionItem} ${session.expiresInDays === 0 ? styles.expired : ''}`}>
              <div className={styles.itemHeader}>
                <strong>{session.pair}</strong>
                <div className={styles.sessionMeta}>
                  {session.expiresInDays > 0 ? (
                    <span className={`${styles.badge} ${session.expiresInDays <= 3 ? styles.badgeWarning : styles.badgeActive}`}>
                      {session.expiresInDays} days left
                    </span>
                  ) : (
                    <span className={`${styles.badge} ${styles.badgeExpired}`}>
                      Expired
                    </span>
                  )}
                </div>
              </div>
              
              <div className={styles.itemBody}>
                <div className={styles.infoText}>
                  <span className={styles.label}>{session.label || 'Unnamed Session'}</span>
                  <span className={styles.date}>{session.date}</span>
                </div>
                <div className={styles.actions}>
                  <button className={styles.actionBtn} title="Open" onClick={() => onSelectSession?.(session.pair, session.label)}>📂</button>
                  <button className={styles.actionBtn} title="Email Report" onClick={handleEmail}>✉️</button>
                  <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete" onClick={() => handleDelete(session.id)}>🗑️</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
