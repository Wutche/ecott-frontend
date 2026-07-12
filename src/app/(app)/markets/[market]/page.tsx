import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatTile } from '@/components/ui/StatTile';
import {
  COMMODITY_ANALYSES,
  INDEX_REPORTS,
  MARKET_DEFINITIONS,
} from '@/lib/fixtures';
import {
  COMMERCIAL_SPECULATOR_LABELS,
  COMMODITY_PHASE_LABELS,
  DISAGGREGATED_CATEGORY_LABELS,
  HEDGE_RATIO_LABELS,
  STATUS_TONE_TO_CSS_VAR,
  commercialSpeculatorTone,
  commodityPhaseTone,
  hedgeRatioTone,
  netPositionTone,
} from '@/lib/display';
import type { CommodityAnalysis, IndexReport, MarketDefinition } from '@/lib/types';
import styles from './market-detail.module.css';

interface RouteProps {
  params: Promise<{ market: string }>;
}

function formatNet(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('en-US')}`;
}

export default async function MarketDetailPage({ params }: RouteProps) {
  const { market } = await params;
  const code = market.toUpperCase();
  const definition = MARKET_DEFINITIONS.find((item) => item.market_code === code);
  const commodity = COMMODITY_ANALYSES[code];
  const index = INDEX_REPORTS[code];

  if (!definition || (!commodity && !index)) notFound();

  return (
    <>
      <PageHeader
        title={definition.market_name}
        subtitle={`${definition.report_type === 'disaggregated' ? 'Disaggregated' : 'TFF'} COT · CFTC ${definition.cftc_code}`}
        actions={
          <Link href="/markets" className={styles.linkButton}>
            ← All markets
          </Link>
        }
      />

      {commodity ? (
        <CommodityDetail analysis={commodity} definition={definition} />
      ) : (
        <IndexDetail report={index!} definition={definition} />
      )}
    </>
  );
}

function CommodityDetail({
  analysis,
  definition,
}: {
  analysis: CommodityAnalysis;
  definition: MarketDefinition;
}) {
  const { report, hedge_ratio, commercial_speculator, phase } = analysis;
  return (
    <>
      <div className={styles.statRow}>
        <StatTile
          label="Producer hedge ratio"
          value={`${hedge_ratio.hedge_ratio_percentage}%`}
          tone={hedgeRatioTone(hedge_ratio.signal)}
          hint={HEDGE_RATIO_LABELS[hedge_ratio.signal]}
        />
        <StatTile
          label="Phase"
          value={phase ? COMMODITY_PHASE_LABELS[phase] : '—'}
          tone={commodityPhaseTone(phase)}
        />
        <StatTile
          label="Producer net"
          value={formatNet(analysis.producer_net)}
          tone={netPositionTone(analysis.producer_net)}
        />
        <StatTile
          label="Managed money net"
          value={formatNet(analysis.managed_money_net)}
          tone={netPositionTone(analysis.managed_money_net)}
        />
      </div>

      <Card>
        <CardHeader
          title="Disaggregated positioning"
          subtitle="Producers hedge by selling — heavy producer shorts at low prices are bullish."
        />
        <div className={styles.categoryHead}>
          <span>Category</span>
          <span className={styles.numeric}>Long</span>
          <span className={styles.numeric}>Short</span>
          <span className={styles.numeric}>Net</span>
        </div>
        {report.categories.map((category) => (
          <div key={category.category} className={styles.categoryRow}>
            <span className={styles.categoryName}>
              {DISAGGREGATED_CATEGORY_LABELS[category.category] ?? category.category}
            </span>
            <span className={styles.numeric}>{category.long_contracts.toLocaleString('en-US')}</span>
            <span className={styles.numeric}>{category.short_contracts.toLocaleString('en-US')}</span>
            <span
              className={styles.numeric}
              style={{ color: STATUS_TONE_TO_CSS_VAR[netPositionTone(category.net_contracts)] }}
            >
              {formatNet(category.net_contracts)}
            </span>
          </div>
        ))}
        <div className={styles.openInterest}>
          <span>Open interest</span>
          <span className={styles.numeric}>
            {report.open_interest.toLocaleString('en-US')}
            <span className={styles.oiChange}> ({formatNet(report.open_interest_total_change)})</span>
          </span>
        </div>
      </Card>

      <div className={styles.twoColumn}>
        <Card>
          <CardHeader
            title="Commercial vs speculator"
            subtitle="When commercials (smart money) and speculators diverge, commercials usually win."
          />
          <div className={styles.divergenceBody}>
            <Badge tone={commercialSpeculatorTone(commercial_speculator.signal)} variant="soft">
              {COMMERCIAL_SPECULATOR_LABELS[commercial_speculator.signal]}
            </Badge>
            <dl className={styles.divergenceMetrics}>
              <div>
                <dt>Commercial net</dt>
                <dd style={{ color: STATUS_TONE_TO_CSS_VAR[netPositionTone(commercial_speculator.commercial_net)] }}>
                  {formatNet(commercial_speculator.commercial_net)}
                </dd>
              </div>
              <div>
                <dt>Speculator net</dt>
                <dd style={{ color: STATUS_TONE_TO_CSS_VAR[netPositionTone(commercial_speculator.speculator_net)] }}>
                  {formatNet(commercial_speculator.speculator_net)}
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        <Card>
          <CardHeader title="Market reference" subtitle="Contract spec and its currency linkage." />
          <dl className={styles.referenceGrid}>
            <div>
              <dt>Contract size</dt>
              <dd>{definition.contract_size ?? '—'}</dd>
            </div>
            <div>
              <dt>Correlated currency</dt>
              <dd>{definition.primary_correlation_currency ?? '—'}</dd>
            </div>
            <div>
              <dt>Correlation</dt>
              <dd>{definition.correlation_strength ?? '—'}</dd>
            </div>
            <div>
              <dt>Report date</dt>
              <dd>{report.report_date}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}

function IndexDetail({
  report,
  definition,
}: {
  report: IndexReport;
  definition: MarketDefinition;
}) {
  return (
    <>
      <div className={styles.statRow}>
        <StatTile
          label="Leveraged funds net"
          value={formatNet(report.leveraged_funds_net)}
          tone={netPositionTone(report.leveraged_funds_net)}
          hint="Speculative positioning"
        />
        <StatTile
          label="Asset manager net"
          value={formatNet(report.asset_manager_net)}
          tone={netPositionTone(report.asset_manager_net)}
        />
        <StatTile
          label="Dealer net"
          value={formatNet(report.dealer_net)}
          tone={netPositionTone(report.dealer_net)}
        />
        <StatTile label="Open interest" value={report.open_interest.toLocaleString('en-US')} />
      </div>

      <Card>
        <CardHeader title="Market reference" subtitle="Contract spec and report metadata." />
        <dl className={styles.referenceGrid}>
          <div>
            <dt>Contract size</dt>
            <dd>{definition.contract_size ?? '—'}</dd>
          </div>
          <div>
            <dt>Report type</dt>
            <dd>TFF</dd>
          </div>
          <div>
            <dt>CFTC code</dt>
            <dd>{definition.cftc_code}</dd>
          </div>
          <div>
            <dt>Report date</dt>
            <dd>{report.report_date}</dd>
          </div>
        </dl>
      </Card>
    </>
  );
}
