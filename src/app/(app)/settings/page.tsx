import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { CURRENT_USER_PROFILE } from '@/lib/fixtures';
import {
  ALL_CURRENCY_PAIRS,
  CURRENCY_PAIR_LABELS,
} from '@/lib/display';
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

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Trader profile, notification preferences, and risk defaults."
      />

      <form className={styles.form}>
        <Card>
          <CardHeader title="Trader profile" />
          <div className={styles.fieldGrid}>
            <Field label="Email">
              <input
                className={styles.input}
                defaultValue={CURRENT_USER_PROFILE.email}
                readOnly
              />
            </Field>
            <Field label="Timezone">
              <input
                className={styles.input}
                defaultValue={CURRENT_USER_PROFILE.timezone}
              />
            </Field>
            <Field label="Account balance (USD)">
              <input
                className={styles.input}
                defaultValue={CURRENT_USER_PROFILE.account_balance_usd ?? ''}
              />
            </Field>
            <Field label="Default risk %">
              <input
                className={styles.input}
                defaultValue={CURRENT_USER_PROFILE.default_risk_percentage ?? ''}
              />
            </Field>
            <Field label="Experience level">
              <select
                className={styles.input}
                defaultValue={CURRENT_USER_PROFILE.experience_level ?? 'intermediate'}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>
            <Field label="Primary trading pair">
              <select
                className={styles.input}
                defaultValue={CURRENT_USER_PROFILE.primary_trading_pair ?? ''}
              >
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
            title="Notification channels"
            subtitle="Email and push respect quiet hours. In-app always-on."
          />
          <div className={styles.checkboxList}>
            <CheckboxField label="In-app inbox (always on)" disabled />
            <CheckboxField label="Email" />
            <CheckboxField label="Push notifications" />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Alert categories"
            subtitle="Opt out of any category without disabling channels."
          />
          <div className={styles.checkboxGrid}>
            {ALERT_PREFERENCES.map((preference) => (
              <CheckboxField key={preference.key} label={preference.label} defaultChecked />
            ))}
          </div>
        </Card>

        <div className={styles.actionsRow}>
          <button type="submit" className="btn-primary">
            Save changes
          </button>
        </div>
      </form>
    </>
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

function CheckboxField({
  label,
  defaultChecked,
  disabled,
}: {
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className={`${styles.checkboxField} ${disabled ? styles.checkboxDisabled : ''}`}>
      <input
        type="checkbox"
        className={styles.checkbox}
        defaultChecked={defaultChecked ?? disabled}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
}
