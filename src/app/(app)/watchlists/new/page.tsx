'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiFetchClient } from '@/lib/apiClient';
import { ALL_CURRENCY_PAIRS, CURRENCY_PAIR_LABELS } from '@/lib/display';
import type { CurrencyPair, Watchlist } from '@/lib/types';
import styles from './new-watchlist.module.css';

export default function NewWatchlistPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pairs, setPairs] = useState<CurrencyPair[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function togglePair(pair: CurrencyPair) {
    setPairs((prev) => (prev.includes(pair) ? prev.filter((p) => p !== pair) : [...prev, pair]));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await apiFetchClient<Watchlist>('/api/watchlists', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description: description || null,
          initial_pairs: pairs,
        }),
      });
      router.push(`/watchlists/${created.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the watchlist.');
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="New watchlist"
        subtitle="Group the pairs you track."
        actions={
          <Link href="/watchlists" className={styles.linkButton}>
            ← All watchlists
          </Link>
        }
      />

      <Card>
        <CardHeader title="Details" />
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Name</span>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
              placeholder="e.g. Majors I trade"
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Description (optional)</span>
            <input
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this list is for"
            />
          </label>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Pairs to track</span>
            <div className={styles.pairGrid}>
              {ALL_CURRENCY_PAIRS.map((pair) => (
                <label key={pair} className={styles.pairChip}>
                  <input
                    type="checkbox"
                    checked={pairs.includes(pair)}
                    onChange={() => togglePair(pair)}
                  />
                  <span>{CURRENCY_PAIR_LABELS[pair]}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actionsRow}>
            <button type="submit" disabled={saving || name.trim() === ''} className="btn-primary">
              {saving ? 'Creating…' : 'Create watchlist'}
            </button>
          </div>
        </form>
      </Card>
    </>
  );
}
