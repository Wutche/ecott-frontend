'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ACTIVE_SETUPS,
  ALERT_INBOX,
  ALL_WATCHLISTS,
  PRIMARY_WATCHLIST,
  TRADE_JOURNAL_ENTRIES,
} from '@/lib/fixtures';
import {
  ALERT_TYPE_LABELS,
  CURRENCY_PAIR_LABELS,
  SETUP_MODEL_LABELS,
  TRADE_OUTCOME_LABELS,
  formatRMultiple,
} from '@/lib/display';
import styles from './SearchModal.module.css';

interface SearchResult {
  id: string;
  group: 'Pairs' | 'Setups' | 'Journal' | 'Alerts' | 'Watchlists' | 'Pages';
  title: string;
  subtitle: string;
  href: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const allResults = useMemo(() => buildSearchIndex(), []);

  // Clear the query on close (an event), so reopening starts fresh without
  // calling setState synchronously inside an effect.
  const handleClose = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const filteredResults = normalizedQuery
    ? allResults.filter(
        (entry) =>
          entry.title.toLowerCase().includes(normalizedQuery) ||
          entry.subtitle.toLowerCase().includes(normalizedQuery),
      )
    : allResults;

  const grouped = groupResults(filteredResults);

  function navigate(href: string) {
    handleClose();
    router.push(href);
  }

  return (
    <div className={styles.backdrop} onClick={handleClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-label="Search"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.searchHeader}>
          <span className={styles.searchIcon} aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pairs, setups, alerts, journal entries…"
            className={styles.searchInput}
            autoFocus
          />
          <kbd className={styles.escHint}>esc</kbd>
        </header>

        <div className={styles.results}>
          {filteredResults.length === 0 ? (
            <p className={styles.emptyHint}>No matches for &ldquo;{query}&rdquo;.</p>
          ) : (
            grouped.map((group) => (
              <div key={group.label} className={styles.group}>
                <span className={styles.groupLabel}>{group.label}</span>
                <ul className={styles.groupList}>
                  {group.items.map((result) => (
                    <li key={result.id}>
                      <button
                        type="button"
                        className={styles.resultButton}
                        onClick={() => navigate(result.href)}
                      >
                        <div className={styles.resultText}>
                          <span className={styles.resultTitle}>{result.title}</span>
                          <span className={styles.resultSubtitle}>{result.subtitle}</span>
                        </div>
                        <span className={styles.resultArrow} aria-hidden="true">
                          →
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <footer className={styles.searchFooter}>
          <div className={styles.shortcutGroup}>
            <kbd className={styles.kbd}>↑↓</kbd>
            <span>Navigate</span>
          </div>
          <div className={styles.shortcutGroup}>
            <kbd className={styles.kbd}>↵</kbd>
            <span>Open</span>
          </div>
          <Link href="/settings" className={styles.footerLink} onClick={onClose}>
            Search settings
          </Link>
        </footer>
      </div>
    </div>
  );
}

function buildSearchIndex(): SearchResult[] {
  const entries: SearchResult[] = [];

  for (const [pairCode, label] of Object.entries(CURRENCY_PAIR_LABELS)) {
    const watchlistItem = PRIMARY_WATCHLIST.items.find((item) => item.pair_code === pairCode);
    entries.push({
      id: `pair-${pairCode}`,
      group: 'Pairs',
      title: label,
      subtitle: watchlistItem?.bias_statement_text ?? `Open ${label} weekly story`,
      href: `/story/${pairCode}/2026-05-26`,
    });
  }

  for (const setup of ACTIVE_SETUPS) {
    entries.push({
      id: `setup-${setup.id}`,
      group: 'Setups',
      title: `${CURRENCY_PAIR_LABELS[setup.pair_code]} ${setup.direction === 'long' ? 'Long' : 'Short'}`,
      subtitle: `${SETUP_MODEL_LABELS[setup.model]} · Score ${setup.confluence_score}`,
      href: `/setups/${setup.id}`,
    });
  }

  for (const entry of TRADE_JOURNAL_ENTRIES) {
    entries.push({
      id: `journal-${entry.id}`,
      group: 'Journal',
      title: `${TRADE_OUTCOME_LABELS[entry.outcome]} · ${formatRMultiple(entry.r_multiple)}`,
      subtitle: `Setup ${entry.setup_id}`,
      href: `/journal/${entry.id}`,
    });
  }

  for (const alert of ALERT_INBOX) {
    entries.push({
      id: `alert-${alert.id}`,
      group: 'Alerts',
      title: alert.title,
      subtitle: ALERT_TYPE_LABELS[alert.alert_type],
      href: '/alerts',
    });
  }

  for (const watchlist of ALL_WATCHLISTS) {
    entries.push({
      id: `watchlist-${watchlist.id}`,
      group: 'Watchlists',
      title: watchlist.name,
      subtitle:
        watchlist.description ??
        `${watchlist.items.length} tracked ${watchlist.items.length === 1 ? 'pair' : 'pairs'}`,
      href: `/watchlists/${watchlist.id}`,
    });
  }

  const PAGE_LINKS: Array<{ href: string; title: string; subtitle: string }> = [
    { href: '/dashboard', title: 'Dashboard', subtitle: 'Live read of your tracked pairs' },
    { href: '/setups/new', title: 'New setup', subtitle: 'Score a new trade setup' },
    { href: '/liquidity/new', title: 'New liquidity pool', subtitle: 'Mark a liquidity pool' },
    { href: '/journal/stats', title: 'Performance stats', subtitle: 'Win rate and R-multiple analytics' },
    { href: '/fundamentals', title: 'Fundamentals', subtitle: 'Currency strength and divergences' },
    { href: '/calculators', title: 'Calculators', subtitle: 'Position size and Fibonacci levels' },
    { href: '/settings', title: 'Settings', subtitle: 'Profile and notifications' },
  ];

  for (const page of PAGE_LINKS) {
    entries.push({ id: `page-${page.href}`, group: 'Pages', ...page });
  }

  return entries;
}

interface GroupedResults {
  label: SearchResult['group'];
  items: SearchResult[];
}

function groupResults(results: SearchResult[]): GroupedResults[] {
  const order: SearchResult['group'][] = [
    'Pages',
    'Pairs',
    'Watchlists',
    'Setups',
    'Journal',
    'Alerts',
  ];
  const map = new Map<SearchResult['group'], SearchResult[]>();
  for (const result of results) {
    const bucket = map.get(result.group) ?? [];
    bucket.push(result);
    map.set(result.group, bucket);
  }
  return order
    .filter((label) => map.has(label))
    .map((label) => ({ label, items: (map.get(label) ?? []).slice(0, 6) }));
}
