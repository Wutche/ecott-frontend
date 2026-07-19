'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { apiFetchClient } from '@/lib/apiClient';
import { ALL_CURRENCY_PAIRS, CURRENCY_PAIR_LABELS } from '@/lib/display';
import type { CurrencyPair } from '@/lib/types';
import styles from './watchlist-detail.module.css';

interface Props {
  id: string;
  name: string;
  description: string | null;
  pairs: CurrencyPair[];
}

export function WatchlistControls({ id, name, description, pairs }: Props) {
  const router = useRouter();
  const [newName, setNewName] = useState(name);
  const [newDescription, setNewDescription] = useState(description ?? '');
  const [pairToAdd, setPairToAdd] = useState<CurrencyPair | ''>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availablePairs = ALL_CURRENCY_PAIRS.filter((pair) => !pairs.includes(pair));

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusy(false);
    }
  }

  const rename = () =>
    run(async () => {
      await apiFetchClient(`/api/watchlists/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: newName, description: newDescription || null }),
      });
    });

  const addPair = () => {
    if (!pairToAdd) return;
    void run(async () => {
      await apiFetchClient(`/api/watchlists/${id}/pairs`, {
        method: 'POST',
        body: JSON.stringify({ pair_code: pairToAdd }),
      });
      setPairToAdd('');
    });
  };

  const removePair = (pair: CurrencyPair) =>
    run(async () => {
      await apiFetchClient(`/api/watchlists/${id}/pairs/${pair}`, { method: 'DELETE' });
    });

  async function deleteWatchlist() {
    setBusy(true);
    setError(null);
    try {
      await apiFetchClient(`/api/watchlists/${id}`, { method: 'DELETE' });
      router.push('/watchlists');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete.');
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader title="Manage watchlist" subtitle="Rename, add or remove pairs, or delete." />
      <div className={styles.controls}>
        <div className={styles.controlRow}>
          <input
            className={styles.controlInput}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            aria-label="Name"
          />
          <input
            className={styles.controlInput}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description"
            aria-label="Description"
          />
          <button type="button" className={styles.outlineButton} onClick={rename} disabled={busy}>
            Save name
          </button>
        </div>

        <div className={styles.controlRow}>
          <select
            className={styles.controlInput}
            value={pairToAdd}
            onChange={(e) => setPairToAdd(e.target.value as CurrencyPair)}
            aria-label="Add pair"
          >
            <option value="">Add a pair…</option>
            {availablePairs.map((pair) => (
              <option key={pair} value={pair}>
                {CURRENCY_PAIR_LABELS[pair]}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={addPair}
            disabled={busy || !pairToAdd}
          >
            Add pair
          </button>
        </div>

        {pairs.length > 0 && (
          <div className={styles.chipRow}>
            {pairs.map((pair) => (
              <span key={pair} className={styles.pairChip}>
                {CURRENCY_PAIR_LABELS[pair]}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => removePair(pair)}
                  disabled={busy}
                  aria-label={`Remove ${pair}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {error && <p className={styles.controlError}>{error}</p>}

        <div>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={deleteWatchlist}
            disabled={busy}
          >
            Delete watchlist
          </button>
        </div>
      </div>
    </Card>
  );
}
