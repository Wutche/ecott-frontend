'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { apiFetchClient } from '@/lib/apiClient';
import type { WeeklyStory } from '@/lib/types';
import styles from './story-detail.module.css';

interface Props {
  pair: string;
  week: string;
  story: WeeklyStory;
}

const EDITABLE = [
  { key: 'chapter_2_price_structure', title: 'Chapter 2 — Price structure' },
  { key: 'chapter_3_liquidity', title: 'Chapter 3 — Liquidity targets' },
  { key: 'chapter_4_timing', title: 'Chapter 4 — Timing' },
  { key: 'chapter_5_execution', title: 'Chapter 5 — Execution plan' },
] as const;

export function StoryEditor({ pair, week, story }: Props) {
  const router = useRouter();
  const [chapters, setChapters] = useState<Record<string, string>>({
    chapter_2_price_structure: story.chapter_2_price_structure ?? '',
    chapter_3_liquidity: story.chapter_3_liquidity ?? '',
    chapter_4_timing: story.chapter_4_timing ?? '',
    chapter_5_execution: story.chapter_5_execution ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function save() {
    setSaving(true);
    setStatus('idle');
    try {
      await apiFetchClient(`/api/story/${pair}/${week}`, {
        method: 'PUT',
        body: JSON.stringify(chapters),
      });
      setStatus('saved');
      router.refresh();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className={styles.chapters}>
        <Card>
          <CardHeader
            title="Chapter 1 — Institutional narrative"
            subtitle="Auto-generated from the weekly CFTC report."
          />
          <p className={styles.staticText}>{story.chapter_1_institutional_narrative}</p>
        </Card>

        {EDITABLE.map((chapter) => (
          <Card key={chapter.key}>
            <CardHeader title={chapter.title} subtitle="User-editable" />
            <textarea
              className={styles.editor}
              rows={6}
              value={chapters[chapter.key]}
              onChange={(e) =>
                setChapters((prev) => ({ ...prev, [chapter.key]: e.target.value }))
              }
              placeholder="Write this chapter..."
            />
          </Card>
        ))}
      </div>

      <div className={styles.actionsRow}>
        {status === 'saved' && <span className={styles.savedNote}>Saved ✓</span>}
        {status === 'error' && <span className={styles.errorNote}>{errorMessage}</span>}
        <button type="button" className="btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save story'}
        </button>
      </div>
    </>
  );
}
