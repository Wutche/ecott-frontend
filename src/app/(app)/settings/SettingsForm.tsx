'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { ALL_CURRENCY_PAIRS, CURRENCY_PAIR_LABELS } from '@/lib/display';
import { apiFetchClient } from '@/lib/apiClient';
import type { ExperienceLevel, UserProfile } from '@/lib/types';
import styles from './settings.module.css';

const ALERT_PREFERENCES: Array<{ key: string; label: string }> = [
  { key: 'high_conviction_alerts_enabled', label: 'High-conviction setup alerts' },
  { key: 'setup_invalidated_alerts_enabled', label: 'Setup invalidated' },
  { key: 'target_hit_alerts_enabled', label: 'Target hit' },
  { key: 'stop_hit_alerts_enabled', label: 'Stop hit' },
  { key: 'cot_phase_alerts_enabled', label: 'COT phase transitions' },
  { key: 'cot_bias_alerts_enabled', label: 'COT bias flips' },
  { key: 'cross_report_rotation_alerts_enabled', label: 'Cross-report rotation' },
  { key: 'weekly_story_alerts_enabled', label: 'Weekly story published' },
];

export function SettingsForm({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const [timezone, setTimezone] = useState(profile.timezone);
  const [accountBalance, setAccountBalance] = useState(profile.account_balance_usd ?? '');
  const [riskPercentage, setRiskPercentage] = useState(profile.default_risk_percentage ?? '');
  const [experience, setExperience] = useState<ExperienceLevel>(
    profile.experience_level ?? 'intermediate',
  );
  const [primaryPair, setPrimaryPair] = useState(profile.primary_trading_pair ?? '');
  const [preferences, setPreferences] = useState<Record<string, boolean>>(
    profile.notification_preferences ?? {},
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus('idle');
    try {
      await apiFetchClient('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          timezone,
          account_balance_usd: accountBalance === '' ? null : accountBalance,
          default_risk_percentage: riskPercentage === '' ? null : riskPercentage,
          experience_level: experience,
          primary_trading_pair: primaryPair === '' ? null : primaryPair,
          notification_preferences: preferences,
        }),
      });
      setStatus('saved');
      router.refresh();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Trader profile" />
        <div className={styles.fieldGrid}>
          <Field label="Email">
            <input className={styles.input} value={profile.email} readOnly />
          </Field>
          <Field label="Timezone">
            <input
              className={styles.input}
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            />
          </Field>
          <Field label="Account balance (USD)">
            <input
              className={styles.input}
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              inputMode="decimal"
            />
          </Field>
          <Field label="Default risk (fraction, e.g. 0.01)">
            <input
              className={styles.input}
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(e.target.value)}
              inputMode="decimal"
            />
          </Field>
          <Field label="Experience level">
            <select
              className={styles.input}
              value={experience}
              onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>
          <Field label="Primary trading pair">
            <select
              className={styles.input}
              value={primaryPair}
              onChange={(e) => setPrimaryPair(e.target.value)}
            >
              <option value="">None</option>
              {ALL_CURRENCY_PAIRS.map((pair) => (
                <option key={pair} value={pair}>
                  {CURRENCY_PAIR_LABELS[pair]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Alert categories"
          subtitle="Opt out of any category without disabling channels."
        />
        <div className={styles.checkboxGrid}>
          {ALERT_PREFERENCES.map((preference) => (
            <label key={preference.key} className={styles.checkboxField}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={preferences[preference.key] ?? true}
                onChange={(e) =>
                  setPreferences((prev) => ({ ...prev, [preference.key]: e.target.checked }))
                }
              />
              <span>{preference.label}</span>
            </label>
          ))}
        </div>
      </Card>

      <div className={styles.actionsRow}>
        {status === 'saved' && <span className={styles.savedNote}>Saved ✓</span>}
        {status === 'error' && <span className={styles.errorNote}>{errorMessage}</span>}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}
