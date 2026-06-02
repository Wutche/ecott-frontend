import Link from 'next/link';
import styles from './landing.module.css';

const FEATURE_CARDS = [
  {
    title: 'Nine-factor confluence scoring',
    description:
      'Every setup runs the PRD §5.3 rubric — COT bias, Fibonacci levels, divergence, kill-zone session, leveraged-funds extremes, dealer wicks. Score 6.0+ to qualify as HIGH CONVICTION.',
  },
  {
    title: 'Six-phase institutional cycle',
    description:
      'Automated phase detection from Capitulation through Decline, with confidence scoring driven by consecutive-week consistency and Asset Manager positioning.',
  },
  {
    title: 'Liquidity pool validation',
    description:
      'Mark BSL, SSL, FVGs, order blocks, and breakers. Six-criterion weighted scoring tiers each pool from WEAK to PRIMARY TARGET.',
  },
  {
    title: 'Cross-report rotation detection',
    description:
      'EUR/USD bias confirmed against DXY positioning the same week — the highest-conviction signal in the framework, watched automatically.',
  },
  {
    title: 'Trade journal with R-math',
    description:
      'Close a setup, get engine-computed R-multiple and pip P/L. Win-rate, expectancy, and per-pair / per-model breakdowns built from your actual trades.',
  },
  {
    title: 'News-risk blackout',
    description:
      'High-impact USD events automatically block setup creation in their blackout window. No more getting stopped through NFP because you forgot the calendar.',
  },
];

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'CFTC ingestion every Friday',
    description:
      'The scheduler pulls the weekly Traders in Financial Futures report at 3:30 PM EST and computes the full derived dataset for the eight tracked pairs.',
  },
  {
    step: '02',
    title: 'Bias, phase, and story published',
    description:
      'Each pair receives a fresh bias statement, phase classification, and Chapter 1 of the weekly story narrative — ready before Monday open.',
  },
  {
    step: '03',
    title: 'Score your setups against the COT',
    description:
      'Mark entry, stop, targets, and manual confluence factors. The engine combines them with live COT data and tells you whether to take the trade.',
  },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark} />
          <span className={styles.brandName}>ecott</span>
        </Link>
        <nav className={styles.topNav}>
          <a href="#features" className={styles.topLink}>
            Features
          </a>
          <a href="#how-it-works" className={styles.topLink}>
            How it works
          </a>
          <Link href="/sign-in" className={styles.signInButton}>
            Sign in
          </Link>
          <Link href="/sign-up" className="btn-primary">
            Sign up
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.heroEyebrow}>COT Intelligence Platform</span>
          <h1 className={styles.heroTitle}>
            Read institutional positioning <br />
            before the market does.
          </h1>
          <p className={styles.heroSubtitle}>
            ecott turns the weekly CFTC Commitments of Traders report into a structured trading edge —
            phase detection, bias statements, confluence-scored setups, liquidity maps, and a journal that
            tracks the math.
          </p>
          <div className={styles.heroActions}>
            <Link href="/sign-up" className={`btn-primary ${styles.primaryCta}`}>
              Create your account
            </Link>
            <Link href="/sign-in" className={styles.secondaryCta}>
              Sign in
            </Link>
          </div>
          <div className={styles.heroMeta}>
            <Meta label="Pairs tracked" value="8 + DXY" />
            <Meta label="Setup models" value="3" />
            <Meta label="Confluence factors" value="9" />
            <Meta label="Update cadence" value="Weekly · Friday 15:30 EST" />
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>What ecott does</span>
            <h2 className={styles.sectionTitle}>Built around the institutional playbook.</h2>
          </div>
          <div className={styles.featureGrid}>
            {FEATURE_CARDS.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className={styles.pipeline}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>How it works</span>
            <h2 className={styles.sectionTitle}>From CFTC release to executed setup.</h2>
          </div>
          <ol className={styles.pipelineList}>
            {PIPELINE_STEPS.map((entry) => (
              <li key={entry.step} className={styles.pipelineRow}>
                <span className={styles.pipelineStep}>{entry.step}</span>
                <div>
                  <h3 className={styles.pipelineTitle}>{entry.title}</h3>
                  <p className={styles.pipelineDescription}>{entry.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.bottomCta}>
          <div className={styles.bottomCtaCard}>
            <div>
              <h2 className={styles.bottomCtaTitle}>Ready to trade the institutions?</h2>
              <p className={styles.bottomCtaSubtitle}>
                Set up your profile in under a minute and start scoring setups against the latest COT
                release.
              </p>
            </div>
            <div className={styles.bottomCtaActions}>
              <Link href="/sign-up" className="btn-primary">
                Create your account
              </Link>
              <Link href="/sign-in" className={styles.secondaryCta}>
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} ecott. CFTC data via the U.S. Commodity Futures Trading Commission.</span>
        <div className={styles.footerLinks}>
          <Link href="/sign-in">Sign in</Link>
          <Link href="/sign-up">Sign up</Link>
        </div>
      </footer>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metaItem}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
