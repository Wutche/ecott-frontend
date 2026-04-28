'use client';

import React from 'react';
import styles from './AnalysisDashboard.module.css';

export interface COTData {
  pair: string;
  reportDate: string;
  overallBias: 'Bullish' | 'Bearish' | 'Neutral';
  biasStrength: 'Strong' | 'Moderate' | 'Weak';
  confidence: number;
  biasSubtitle: string;
  participants: {
    assetManager: ParticipantData;
    leveragedFund: ParticipantData;
    dealer: ParticipantData;
  };
  scenarios: { type: string; icon: string; label: string; text: string }[];
  actionSteps: string[];
}

export interface ParticipantData {
  net: string;
  direction: string;
  trend: string;
  signal: string;
}

export default function AnalysisDashboard({ data }: { data: COTData }) {
  if (!data) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>{data.pair} Analysis</h1>
          <span className={styles.date}>{data.reportDate}</span>
        </div>
        <div className={styles.biasBanner}>
          <div className={styles.biasInfo}>
            <h2>{data.overallBias} ({data.biasStrength})</h2>
            <p>{data.biasSubtitle}</p>
          </div>
          <div className={styles.confidenceBadge}>
            <span className={styles.confidenceValue}>{data.confidence}%</span>
            <span className={styles.confidenceLabel}>Confidence</span>
          </div>
        </div>
      </header>

      <section className={styles.participantsSection}>
        <h3>Institutional Positioning</h3>
        <div className={styles.cardsGrid}>
          <ParticipantCard title="Asset Manager" data={data.participants.assetManager} />
          <ParticipantCard title="Leveraged Fund" data={data.participants.leveragedFund} />
          <ParticipantCard title="Dealer" data={data.participants.dealer} />
        </div>
      </section>

      <div className={styles.bottomSection}>
        <section className={styles.scenariosSection}>
          <h3>Market Scenarios</h3>
          <ul className={styles.scenariosList}>
            {data.scenarios.map((scenario, idx) => (
              <li key={idx} className={styles.scenarioItem}>
                <span className={styles.scenarioIcon}>{scenario.icon}</span>
                <div>
                  <strong>{scenario.label}</strong>
                  <p>{scenario.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.actionSection}>
          <h3>Action Plan</h3>
          <ol className={styles.actionList}>
            {data.actionSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function ParticipantCard({ title, data }: { title: string, data: ParticipantData }) {
  return (
    <div className={`card ${styles.card}`}>
      <h4>{title}</h4>
      <div className={styles.cardStat}>
        <span>Net Position:</span>
        <strong>{data.net}</strong>
      </div>
      <div className={styles.cardStat}>
        <span>Direction:</span>
        <strong>{data.direction}</strong>
      </div>
      <div className={styles.cardStat}>
        <span>Trend:</span>
        <strong>{data.trend}</strong>
      </div>
      <div className={styles.cardBadge}>{data.signal}</div>
    </div>
  );
}
