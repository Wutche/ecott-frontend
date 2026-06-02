import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatTile } from '@/components/ui/StatTile';
import styles from './calculators.module.css';

export default function CalculatorsPage() {
  return (
    <>
      <PageHeader
        title="Calculators"
        subtitle="Stateless tools for position sizing and Fibonacci levels."
      />

      <div className={styles.twoColumn}>
        <Card>
          <CardHeader
            title="Position size"
            subtitle="Lot size and dollar risk for a given account and stop distance."
          />
          <form className={styles.form}>
            <Field label="Account balance (USD)">
              <input className={styles.input} placeholder="10000.00" />
            </Field>
            <Field label="Risk percentage">
              <input className={styles.input} placeholder="0.01" />
            </Field>
            <Field label="Stop distance (pips)">
              <input className={styles.input} placeholder="30" />
            </Field>
            <button type="submit" className="btn-primary">
              Calculate
            </button>
          </form>

          <div className={styles.previewRow}>
            <StatTile label="Lot size" value="—" />
            <StatTile label="Risk amount" value="—" />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Fibonacci levels"
            subtitle="Common retracement and extension levels off a swing range."
          />
          <form className={styles.form}>
            <Field label="Swing high">
              <input className={styles.input} placeholder="1.16200" />
            </Field>
            <Field label="Swing low">
              <input className={styles.input} placeholder="1.13900" />
            </Field>
            <Field label="Direction">
              <div className={styles.toggleGroup}>
                <button type="button" className={`${styles.toggle} ${styles.toggleActive}`}>
                  ↗ Up
                </button>
                <button type="button" className={styles.toggle}>
                  ↘ Down
                </button>
              </div>
            </Field>
            <button type="submit" className="btn-primary">
              Calculate
            </button>
          </form>
        </Card>
      </div>
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
