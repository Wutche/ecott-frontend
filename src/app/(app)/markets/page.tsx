import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { getCommodityOverview } from '@/lib/api/endpoints';
import {
  COMMODITY_PHASE_LABELS,
  HEDGE_RATIO_LABELS,
  RISK_REGIME_LABELS,
  STATUS_TONE_TO_CSS_VAR,
  commodityPhaseTone,
  hedgeRatioTone,
  netPositionTone,
  riskRegimeTone,
} from '@/lib/display';
import styles from './markets.module.css';

const RISK_COMPONENT_LABELS: Record<string, string> = {
  sp500_managed_money: 'S&P 500 (MM)',
  vix_managed_money: 'VIX (MM)',
  gold_managed_money: 'Gold (MM)',
  jpy_leveraged_funds: 'JPY (LF)',
};

function formatNet(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('en-US')}`;
}

export default async function MarketsPage() {
  const { risk_sentiment, commodities, indices } = await getCommodityOverview();

  return (
    <>
      <PageHeader
        title="Markets"
        subtitle="Cross-asset positioning: commodities, indices, and the risk regime that frames them."
      />

      {risk_sentiment && (
        <section className={styles.section}>
          <Card>
            <CardHeader
              title="Risk Sentiment Composite"
              subtitle="Institutional positioning across S&P 500, VIX, gold and yen — 0 risk-off, 100 risk-on."
              trailing={
                <Badge tone={riskRegimeTone(risk_sentiment.regime)} variant="solid">
                  {RISK_REGIME_LABELS[risk_sentiment.regime]}
                </Badge>
              }
            />
            <div className={styles.gaugeRow}>
              <span className={styles.gaugeScore}>{risk_sentiment.score}</span>
              <div className={styles.gaugeTrackWrap}>
                <div className={styles.gaugeTrack}>
                  <span
                    className={styles.gaugeFill}
                    style={{
                      width: `${Number(risk_sentiment.score)}%`,
                      backgroundColor: STATUS_TONE_TO_CSS_VAR[riskRegimeTone(risk_sentiment.regime)],
                    }}
                  />
                </div>
                <div className={styles.gaugeScale}>
                  <span>Risk-Off</span>
                  <span>Neutral</span>
                  <span>Risk-On</span>
                </div>
              </div>
            </div>
            <ul className={styles.componentList}>
              {risk_sentiment.components.map((component) => (
                <li key={component.name} className={styles.componentRow}>
                  <span className={styles.componentName}>
                    {RISK_COMPONENT_LABELS[component.name] ?? component.name}
                  </span>
                  <span className={styles.componentNet} style={{ color: STATUS_TONE_TO_CSS_VAR[netPositionTone(component.net_position)] }}>
                    {formatNet(component.net_position)}
                  </span>
                  <span className={styles.componentWeight}>
                    {Math.round(Number(component.weight) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      <section className={styles.section}>
        <Card padded={false}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Commodities</h2>
            <span className={styles.tableSubtitle}>Disaggregated COT — producers are the smart money.</span>
          </div>
          <div className={styles.commodityHead}>
            <span>Market</span>
            <span>Phase</span>
            <span>Hedging</span>
            <span className={styles.numeric}>Producer net</span>
            <span className={styles.numeric}>Managed money</span>
          </div>
          {commodities.map((item) => (
            <Link key={item.market_code} href={`/markets/${item.market_code}`} className={styles.commodityRow}>
              <span className={styles.marketName}>{item.market_name}</span>
              <span>
                <Badge tone={commodityPhaseTone(item.phase)} variant="soft">
                  {item.phase ? COMMODITY_PHASE_LABELS[item.phase] : '—'}
                </Badge>
              </span>
              <span>
                <Badge tone={hedgeRatioTone(item.hedge_signal)} variant="outline">
                  {HEDGE_RATIO_LABELS[item.hedge_signal]}
                </Badge>
              </span>
              <span className={styles.numeric} style={{ color: STATUS_TONE_TO_CSS_VAR[netPositionTone(item.producer_net)] }}>
                {formatNet(item.producer_net)}
              </span>
              <span className={styles.numeric} style={{ color: STATUS_TONE_TO_CSS_VAR[netPositionTone(item.managed_money_net)] }}>
                {formatNet(item.managed_money_net)}
              </span>
            </Link>
          ))}
        </Card>
      </section>

      <section className={styles.section}>
        <Card padded={false}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Indices</h2>
            <span className={styles.tableSubtitle}>TFF speculative positioning — the risk-on/off tell.</span>
          </div>
          <div className={styles.indexHead}>
            <span>Market</span>
            <span className={styles.numeric}>Leveraged funds net</span>
          </div>
          {indices.map((item) => (
            <Link key={item.market_code} href={`/markets/${item.market_code}`} className={styles.indexRow}>
              <span className={styles.marketName}>{item.market_name}</span>
              <span className={styles.numeric} style={{ color: STATUS_TONE_TO_CSS_VAR[netPositionTone(item.leveraged_funds_net)] }}>
                {formatNet(item.leveraged_funds_net)}
              </span>
            </Link>
          ))}
        </Card>
      </section>
    </>
  );
}
