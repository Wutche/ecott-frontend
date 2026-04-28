'use client';

import React, { useState } from 'react';
import UploadArea, { AnalysisRequestData } from '@/components/UploadArea';
import AnalysisDashboard, { COTData } from '@/components/AnalysisDashboard';
import ChatInterface from '@/components/ChatInterface';
import SessionsManager from '@/components/SessionsManager';
import styles from './page.module.css';

export default function Home() {
  const [activeData, setActiveData] = useState<COTData | null>(null);

  const handleAnalyze = (requestData: AnalysisRequestData) => {
    // Mock the AI Response JSON
    const mockResponse: COTData = {
      pair: requestData.pair || 'EUR/USD',
      reportDate: 'Oct 12, 2026',
      overallBias: 'Bullish',
      biasStrength: 'Strong',
      confidence: 85,
      biasSubtitle: 'Asset Managers and Leveraged Funds align on long accumulation.',
      participants: {
        assetManager: { net: '+45,230', direction: 'Long', trend: 'Adding Longs', signal: 'Bullish' },
        leveragedFund: { net: '+12,400', direction: 'Long', trend: 'Flipping Net Long', signal: 'Bullish' },
        dealer: { net: '-58,000', direction: 'Short', trend: 'Providing Liquidity', signal: 'Bearish (Expected)' },
      },
      scenarios: [
        { type: 'Primary', icon: '📈', label: 'Continuation', text: 'Price respects current support and continues upward.' },
        { type: 'Alternative', icon: '📉', label: 'Pullback', text: 'Temporary dip to gather liquidity before moving higher.' },
        { type: 'Invalidation', icon: '🛑', label: 'Trend Break', text: 'Price breaks key support, invalidating the bullish bias.' }
      ],
      actionSteps: [
        'Monitor the 1.0500 support level for price action.',
        'Wait for London session volume to confirm the move.',
        'Scale into longs if price rejects the lower boundary.',
        'Watch for cross-pair divergence with GBP/USD.'
      ]
    };
    setActiveData(mockResponse);
  };

  const handleSelectSession = (pair: string, sessionLabel: string) => {
    handleAnalyze({ fileCount: 0, pair, sessionLabel });
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⬛</span>
          ecott
        </div>
        <div className={styles.navLinks}>
          <button className={styles.navBtn} onClick={() => setActiveData(null)}>New Analysis</button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.sidebar}>
          <SessionsManager onSelectSession={handleSelectSession} />
        </div>

        <div className={styles.content}>
          {!activeData ? (
            <UploadArea onAnalyze={handleAnalyze} />
          ) : (
            <div className={styles.dashboardLayout}>
              <div className={styles.dashboardMain}>
                <AnalysisDashboard data={activeData} />
              </div>
              <div className={styles.dashboardSide}>
                <ChatInterface />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
