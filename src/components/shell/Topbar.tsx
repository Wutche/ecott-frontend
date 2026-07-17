'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ALERT_INBOX, CURRENT_USER_PROFILE } from '@/lib/fixtures';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { SearchModal } from './SearchModal';
import styles from './Topbar.module.css';

export function Topbar() {
  const router = useRouter();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const unreadAlertCount = ALERT_INBOX.filter((alert) => !alert.is_read).length;
  const userInitial = CURRENT_USER_PROFILE.email.charAt(0).toUpperCase();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/sign-in');
    router.refresh();
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isShortcut) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.searchTrigger}
          onClick={() => setSearchOpen(true)}
          aria-label="Open search"
        >
          <span className={styles.searchIcon} aria-hidden="true">
            ⌕
          </span>
          <span className={styles.searchPlaceholder}>Search pairs, setups, alerts…</span>
          <kbd className={styles.kbd}>⌘K</kbd>
        </button>

        <div className={styles.actions}>
          <Link
            href="/alerts"
            className={styles.alertButton}
            aria-label={`Alerts (${unreadAlertCount} unread)`}
          >
            <span className={styles.alertIcon}>◐</span>
            {unreadAlertCount > 0 && (
              <span className={styles.alertBadge}>{unreadAlertCount}</span>
            )}
          </Link>
          <Link href="/setups/new" className="btn-primary">
            New setup
          </Link>
          <Link href="/settings" className={styles.avatar} aria-label="Account settings">
            {userInitial}
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className={styles.signOutButton}
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </header>

      <SearchModal open={isSearchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
