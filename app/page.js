'use client';
import { useState } from 'react';
import styles from './page.module.css';

const THEMES = [
  { id: 'all', label: 'All' },
  { id: 'geopolitics', label: 'Geopolitics' },
  { id: 'macro', label: 'Macro & Rates' },
  { id: 'trade', label: 'Trade & Supply' },
  { id: 'energy', label: 'Energy' },
  { id: 'em', label: 'EM' },
  { id: 'tech', label: 'Tech & AI' },
];

const QUICK = [
  'US-China trade tensions right now',
  'Emerging market debt risks',
  'Energy transition winners and losers',
  'Consumer market stress signals globally',
  'Geopolitical flashpoints investors should watch',
  'Dollar strength and its effects',
  'Southeast Asia macro outlook',
];

const TAG_STYLES = {
  stress: { bg: 'var(--red-bg)', color: 'var(--red)' },
  opportunity: { bg: 'var(--green-bg)', color: 'var(--green)' },
  watch: { bg: 'var(--amber-bg)', color: 'var(--amber)' },
  shift: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  neutral: { bg: 'var(--gray-bg)', color: 'var(--text2)' },
};

function formatDrillText(text) {
  const sections = ['WHAT\'S HAPPENING', 'WHY IT MATTERS', 'WHAT TO WATCH'];
  let result = text;
  sections.forEach(s => {
    result = result.replace(new RegExp(`(${s})`, 'g'), `\n__HEADER__${s}__HEADER__\n`);
  });
  return result.split('\n').filter(l => l.trim()).map((line, i) => {
    if (line.startsWith('__HEADER__') && line.endsWith('__HEADER__')) {
      const label = line.replace(/__HEADER__/g, '');
      return <div key={i} style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--accent)', marginTop: i === 0 ? 0 : '1rem', marginBottom: '4px', fontWeight: 500 }}>{label}</div>;
    }
    return <div key={i} style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.7 }}>{line}</div>;
  });
}

export default function Home() {
  const [activeTheme, setActiveTheme] = useState('all');
  const [briefingItems, setBriefingItems] = useState([]);
  const [briefingDate, setBriefingDate] = useState('');
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState('');
  const [drillQuery, setDrillQuery] = useState('');
  const [drillResults, setDrillResults] = useState([]);
  const [drillLoading, setDrillLoading] = useState(false);

  async function runBriefing() {
    setBriefingLoading(true);
    setBriefingError('');
    setBriefingItems([]);
    try {
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: activeTheme })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBriefingItems(data.items);
      setBriefingDate(data.date);
    } catch (e) {
      setBriefingError(e.message);
    }
    setBriefingLoading(false);
  }

  async function runDrill(q) {
    const query = q || drillQuery.trim();
    if (!query) return;
    setDrillLoading(true);
    setDrillQuery('');
    const id = Date.now();
    setDrillResults(prev => [{ id, query, text: null, loading: true }, ...prev]);
    try {
      const res = await fetch('/api/drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setDrillResults(prev => prev.map(r => r.id === id ? { ...r, text: data.error ? `Error: ${data.error}` : data.text, loading: false } : r));
    } catch (e) {
      setDrillResults(prev => prev.map(r => r.id === id ? { ...r, text: `Error: ${e.message}`, loading: false } : r));
    }
    setDrillLoading(false);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>MACRO INTEL</div>
          <div className={styles.tagline}>Global signal tracking</div>
        </div>
        <div className={styles.headerRight}>
          {briefingDate && <span className={styles.dateLabel}>{briefingDate}</span>}
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.briefingSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Global briefing</span>
            <div className={styles.themeRow}>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  className={`${styles.pill} ${activeTheme === t.id ? styles.pillActive : ''}`}
                  onClick={() => setActiveTheme(t.id)}
                >{t.label}</button>
              ))}
            </div>
            <button
              className={styles.runBtn}
              onClick={runBriefing}
              disabled={briefingLoading}
            >
              {briefingLoading ? <><span className={styles.spinner} /> Scanning...</> : 'Run briefing →'}
            </button>
          </div>

          {briefingError && <div className={styles.errorBox}>{briefingError}</div>}

          {briefingLoading && (
            <div className={styles.loadingGrid}>
              {[1,2,3,4,5].map(i => <div key={i} className={styles.skeleton} style={{ animationDelay: `${i * 0.1}s` }} />)}
            </div>
          )}

          {!briefingLoading && briefingItems.length > 0 && (
            <div className={styles.cardsGrid}>
              {briefingItems.map((item, i) => {
                const tag = TAG_STYLES[item.tag] || TAG_STYLES.neutral;
                return (
                  <div key={i} className={styles.card}>
                    <div className={styles.cardTop}>
                      <span className={styles.cardTheme}>{item.theme}</span>
                      <span className={styles.cardTag} style={{ background: tag.bg, color: tag.color }}>{item.tag}</span>
                    </div>
                    <div className={styles.cardHeadline}>{item.headline}</div>
                    <div className={styles.cardBody}>{item.summary}</div>
                    <div className={styles.cardSignal}>
                      <span className={styles.watchLabel}>watch</span> {item.signal}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!briefingLoading && briefingItems.length === 0 && !briefingError && (
            <div className={styles.emptyState}>
              Select a theme filter and hit run to get today's macro snapshot
            </div>
          )}
        </section>

        <div className={styles.divider} />

        <section className={styles.drillSection}>
          <div className={styles.sectionLabel}>Drill down</div>
          <div className={styles.drillInput}>
            <input
              type="text"
              placeholder="Any region, sector, event, currency, trade flow..."
              value={drillQuery}
              onChange={e => setDrillQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runDrill()}
            />
            <button onClick={() => runDrill()} disabled={drillLoading || !drillQuery.trim()}>
              {drillLoading ? '...' : '↗'}
            </button>
          </div>

          <div className={styles.quickRow}>
            {QUICK.map((q, i) => (
              <button key={i} className={styles.quickBtn} onClick={() => runDrill(q)}>{q}</button>
            ))}
          </div>

          <div className={styles.drillResults}>
            {drillResults.map(r => (
              <div key={r.id} className={styles.drillCard}>
                <div className={styles.drillQuery}>{r.query}</div>
                {r.loading
                  ? <div className={styles.drillLoading}><span className={styles.spinner} /> Researching...</div>
                  : <div className={styles.drillText}>{formatDrillText(r.text)}</div>
                }
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
