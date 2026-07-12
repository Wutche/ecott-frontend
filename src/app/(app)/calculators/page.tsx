import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { PositionSizeCalculator } from './PositionSizeCalculator';
import styles from './calculators.module.css';

export default function CalculatorsPage() {
  return (
    <>
      <PageHeader
        title="Calculators"
        subtitle="Instrument-aware position sizing with risk management, plus Fibonacci levels."
      />

      <section className={styles.section}>
        <PositionSizeCalculator />
      </section>

      <section className={styles.section}>
        <Card>
          <CardHeader
            title="Fibonacci levels"
            subtitle="Common retracement and extension levels off a swing range."
          />
          <form className={styles.form}>
            <div className={styles.fieldRow}>
              <Field label="Swing high">
                <input className={styles.input} placeholder="1.16200" />
              </Field>
              <Field label="Swing low">
                <input className={styles.input} placeholder="1.13900" />
              </Field>
            </div>
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
          </form>
        </Card>
      </section>
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
