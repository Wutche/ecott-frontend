'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface NavigationLink {
  href: string;
  label: string;
  icon: string;
}

interface NavigationSection {
  label: string;
  links: NavigationLink[];
}

const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    label: 'Trade',
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: '◧' },
      { href: '/watchlists', label: 'Watchlists', icon: '☰' },
      { href: '/setups', label: 'Setups', icon: '◇' },
      { href: '/liquidity', label: 'Liquidity pools', icon: '◯' },
    ],
  },
  {
    label: 'Review',
    links: [
      { href: '/fundamentals', label: 'Fundamentals', icon: '◉' },
      { href: '/markets', label: 'Markets', icon: '◈' },
      { href: '/journal', label: 'Trade journal', icon: '✎' },
      { href: '/story', label: 'Weekly story', icon: '☷' },
    ],
  },
  {
    label: 'Account',
    links: [
      { href: '/calculators', label: 'Calculators', icon: '◰' },
      { href: '/settings', label: 'Settings', icon: '◑' },
    ],
  },
];

export function Sidebar() {
  const currentPath = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark} />
        <span className={styles.brandName}>ecott</span>
      </div>

      <nav className={styles.nav}>
        {NAVIGATION_SECTIONS.map((section) => (
          <div key={section.label} className={styles.section}>
            <span className={styles.sectionLabel}>{section.label}</span>
            <ul className={styles.linkList}>
              {section.links.map((link) => {
                const isActive =
                  currentPath === link.href || currentPath.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    >
                      <span className={styles.navIcon} aria-hidden="true">
                        {link.icon}
                      </span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
