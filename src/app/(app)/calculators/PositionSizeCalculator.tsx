'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatTile } from '@/components/ui/StatTile';
import { apiFetchClient } from '@/lib/apiClient';
import {
  ACCOUNT_CURRENCIES,
  INSTRUMENTS,
  type AccountCurrency,
  type PositionPlanResult,
  type SafetyFinding,
} from '@/lib/positionCalculator';
import styles from './calculators.module.css';

// Backend /api/calculator/position-plan response (decimals arrive as strings).
interface PositionPlanApiResponse {
  blocked: boolean;
  findings: SafetyFinding[];
  final_risk_percentage: string;
  risk_amount: string;
  stop_pips: string;
  pip_value_per_standard_lot: string;
  lot_size: string | null;
  position_units: string | null;
  risk_reward_target_1: string | null;
  risk_reward_target_2: string | null;
  potential_profit_target_1: string | null;
  potential_profit_target_2: string | null;
}

interface OpenRiskResponse {
  open_position_count: number;
  total_open_risk_percentage: string;
  risk_capacity_remaining_percentage: string;
  max_total_risk_percentage: string;
  exceeds_cap: boolean;
}

const num = (value: string | null): number | null => (value === null ? null : Number(value));

function mapResult(r: PositionPlanApiResponse): PositionPlanResult {
  return {
    blocked: r.blocked,
    findings: r.findings,
    finalRiskPercentage: Number(r.final_risk_percentage),
    riskAmount: Number(r.risk_amount),
    stopPips: Number(r.stop_pips),
    pipValuePerLot: Number(r.pip_value_per_standard_lot),
    lotSize: num(r.lot_size),
    positionUnits: num(r.position_units),
    riskRewardTarget1: num(r.risk_reward_target_1),
    riskRewardTarget2: num(r.risk_reward_target_2),
    potentialProfitTarget1: num(r.potential_profit_target_1),
    potentialProfitTarget2: num(r.potential_profit_target_2),
  };
}

function parseNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatMoney(value: number, currency: string): string {
  return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

const INSTRUMENT_GROUPS = Array.from(new Set(INSTRUMENTS.map((item) => item.group)));

export function PositionSizeCalculator() {
  const [balance, setBalance] = useState('10000');
  const [currency, setCurrency] = useState<AccountCurrency>('USD');
  const [riskPercent, setRiskPercent] = useState('1');
  const [instrument, setInstrument] = useState('EUR/USD');
  const [entry, setEntry] = useState('1.1620');
  const [stop, setStop] = useState('1.1660');
  const [target1, setTarget1] = useState('1.1500');
  const [target2, setTarget2] = useState('1.1390');
  const [confluence, setConfluence] = useState('');
  const [phase, setPhase] = useState('');

  const [result, setResult] = useState<PositionPlanResult | null>(null);
  const [openRisk, setOpenRisk] = useState<OpenRiskResponse | null>(null);

  // Debounced live call to the backend calculator. persist:false keeps the
  // audit trail meaningful (deliberate calculations, not each keystroke).
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      const accountBalance = parseNumber(balance);
      const riskFraction = parseNumber(riskPercent);
      const entryPrice = parseNumber(entry);
      const stopPrice = parseNumber(stop);
      if (
        accountBalance === null ||
        riskFraction === null ||
        entryPrice === null ||
        stopPrice === null
      ) {
        setResult(null);
        return;
      }
      apiFetchClient<PositionPlanApiResponse>('/api/calculator/position-plan', {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify({
          account_balance: accountBalance,
          account_currency: currency,
          risk_percentage: riskFraction / 100,
          instrument_symbol: instrument,
          entry_price: entryPrice,
          stop_price: stopPrice,
          target_1_price: parseNumber(target1),
          target_2_price: parseNumber(target2),
          confluence_score: parseNumber(confluence),
          phase: parseNumber(phase),
          persist: false,
        }),
      })
        .then((r) => setResult(mapResult(r)))
        .catch(() => {
          /* aborted request or invalid input — keep the last result */
        });
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [balance, currency, riskPercent, instrument, entry, stop, target1, target2, confluence, phase]);

  useEffect(() => {
    apiFetchClient<OpenRiskResponse>('/api/calculator/open-risk')
      .then(setOpenRisk)
      .catch(() => {});
  }, []);

  const blocks = result?.findings.filter((f) => f.level === 'block') ?? [];
  const warnings = result?.findings.filter((f) => f.level === 'warning') ?? [];
  const hasResult = result !== null && !result.blocked && result.lotSize !== null;

  return (
    <div className={styles.calculatorGrid}>
      <Card>
        <CardHeader
          title="Position size calculator"
          subtitle="Instrument-aware sizing with confluence and phase risk adjustment."
        />
        <div className={styles.form}>
          <div className={styles.fieldRow}>
            <Field label="Account balance">
              <input className={styles.input} value={balance} onChange={(e) => setBalance(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="Currency">
              <select className={styles.input} value={currency} onChange={(e) => setCurrency(e.target.value as AccountCurrency)}>
                {ACCOUNT_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={`Risk per trade — ${riskPercent || '0'}%`}>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={riskPercent || '0'}
              onChange={(e) => setRiskPercent(e.target.value)}
              className={styles.slider}
            />
          </Field>

          <Field label="Instrument">
            <select className={styles.input} value={instrument} onChange={(e) => setInstrument(e.target.value)}>
              {INSTRUMENT_GROUPS.map((group) => (
                <optgroup key={group} label={group}>
                  {INSTRUMENTS.filter((item) => item.group === group).map((item) => (
                    <option key={item.symbol} value={item.symbol}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>

          <div className={styles.fieldRow}>
            <Field label="Entry price">
              <input className={styles.input} value={entry} onChange={(e) => setEntry(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="Stop loss">
              <input className={styles.input} value={stop} onChange={(e) => setStop(e.target.value)} inputMode="decimal" />
            </Field>
          </div>

          <div className={styles.fieldRow}>
            <Field label="Target 1 (optional)">
              <input className={styles.input} value={target1} onChange={(e) => setTarget1(e.target.value)} inputMode="decimal" />
            </Field>
            <Field label="Target 2 (optional)">
              <input className={styles.input} value={target2} onChange={(e) => setTarget2(e.target.value)} inputMode="decimal" />
            </Field>
          </div>

          <div className={styles.fieldRow}>
            <Field label="Confluence score (optional)">
              <input className={styles.input} value={confluence} onChange={(e) => setConfluence(e.target.value)} placeholder="e.g. 7.5" inputMode="decimal" />
            </Field>
            <Field label="COT phase (optional)">
              <input className={styles.input} value={phase} onChange={(e) => setPhase(e.target.value)} placeholder="1-6" inputMode="numeric" />
            </Field>
          </div>
        </div>
      </Card>

      <div className={styles.outputColumn}>
        <Card>
          <CardHeader title="Position size" subtitle="Rounded down to broker mini-lot precision." />
          {blocks.length > 0 ? (
            <div className={`${styles.banner} ${styles.bannerBlock}`}>
              {blocks.map((finding) => (
                <p key={finding.code}>{finding.message}</p>
              ))}
            </div>
          ) : hasResult && result ? (
            <>
              <div className={styles.primaryOutput}>
                <span className={styles.lotSize}>{result.lotSize?.toFixed(2)}</span>
                <span className={styles.lotLabel}>lots</span>
                {result.positionUnits !== null && (
                  <span className={styles.units}>
                    {result.positionUnits.toLocaleString('en-US')} units
                  </span>
                )}
              </div>
              <div className={styles.outputTiles}>
                <StatTile label="Pip value" value={formatMoney(result.pipValuePerLot, currency)} />
                <StatTile label="Stop distance" value={`${result.stopPips} pips`} />
                <StatTile
                  label="Risk amount"
                  value={formatMoney(result.riskAmount, currency)}
                  tone="warning"
                />
                <StatTile
                  label="Effective risk"
                  value={`${(result.finalRiskPercentage * 100).toFixed(2)}%`}
                />
              </div>
            </>
          ) : (
            <p className={styles.placeholder}>Enter valid inputs to see the position size.</p>
          )}

          {warnings.map((finding) => (
            <div key={finding.code} className={`${styles.banner} ${styles.bannerWarning}`}>
              <p>{finding.message}</p>
            </div>
          ))}
        </Card>

        {hasResult && result && (result.riskRewardTarget1 !== null || result.riskRewardTarget2 !== null) && (
          <Card>
            <CardHeader title="Risk / reward" subtitle="Potential outcome at each target." />
            <ul className={styles.rewardList}>
              {result.riskRewardTarget1 !== null && (
                <li className={styles.rewardRow}>
                  <span>Target 1</span>
                  <Badge tone="info" variant="soft">
                    1:{result.riskRewardTarget1.toFixed(1)}
                  </Badge>
                  <span className={styles.rewardProfit}>
                    +{formatMoney(result.potentialProfitTarget1 ?? 0, currency)}
                  </span>
                </li>
              )}
              {result.riskRewardTarget2 !== null && (
                <li className={styles.rewardRow}>
                  <span>Target 2</span>
                  <Badge tone="success" variant="soft">
                    1:{result.riskRewardTarget2.toFixed(1)}
                  </Badge>
                  <span className={styles.rewardProfit}>
                    +{formatMoney(result.potentialProfitTarget2 ?? 0, currency)}
                  </span>
                </li>
              )}
            </ul>
          </Card>
        )}

        {openRisk && (
          <Card>
            <CardHeader
              title="Open risk"
              subtitle="Aggregate risk across your active setups against the 5% account cap."
            />
            <div className={styles.outputTiles}>
              <StatTile label="Open positions" value={String(openRisk.open_position_count)} />
              <StatTile
                label="Total open risk"
                value={`${(Number(openRisk.total_open_risk_percentage) * 100).toFixed(2)}%`}
                tone={openRisk.exceeds_cap ? 'danger' : undefined}
              />
              <StatTile
                label="Capacity remaining"
                value={`${(Number(openRisk.risk_capacity_remaining_percentage) * 100).toFixed(2)}%`}
              />
              <StatTile
                label="Cap"
                value={`${(Number(openRisk.max_total_risk_percentage) * 100).toFixed(0)}%`}
              />
            </div>
            {openRisk.exceeds_cap && (
              <div className={`${styles.banner} ${styles.bannerWarning}`}>
                <p>Your open positions already exceed the 5% account risk cap.</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
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
