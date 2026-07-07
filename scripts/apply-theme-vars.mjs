/**
 * Replaces hardcoded sentinel palette values with CSS theme variables.
 * Run: node scripts/apply-theme-vars.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'artifacts', 'sentinel', 'src');

const REPLACEMENTS = [
  ["'#080D1A'", "'var(--st-header)'"],
  ['"#080D1A"', '"var(--st-header)"'],
  ["'#050A14'", "'var(--st-ticker)'"],
  ['"#050A14"', '"var(--st-ticker)"'],
  ["'#0A0F1D'", "'var(--st-bg)'"],
  ['"#0A0F1D"', '"var(--st-bg)"'],
  ["'#0D1321'", "'var(--st-panel)'"],
  ['"#0D1321"', '"var(--st-panel)"'],
  ["'#0A1628'", "'var(--st-panel-alt)'"],
  ['"#0A1628"', '"var(--st-panel-alt)"'],
  ["'#060E1E'", "'var(--st-map-ocean)'"],
  ['"#060E1E"', '"var(--st-map-ocean)"'],
  ["'rgba(31,41,55,0.8)'", "'var(--st-border)'"],
  ['"rgba(31,41,55,0.8)"', '"var(--st-border)"'],
  ["'rgba(31,41,55,0.9)'", "'var(--st-border-strong)'"],
  ["'rgba(31,41,55,0.6)'", "'var(--st-border-subtle)'"],
  ['"rgba(31,41,55,0.6)"', '"var(--st-border-subtle)"'],
  ["'rgba(31,41,55,0.4)'", "'var(--st-border-faint)'"],
  ["'#94A3B8'", "'var(--st-text-label)'"],
  ['"#94A3B8"', '"var(--st-text-label)"'],
  ["'#64748B'", "'var(--st-text-muted)'"],
  ['"#64748B"', '"var(--st-text-muted)"'],
  ["'#475569'", "'var(--st-text-dim)'"],
  ['"#475569"', '"var(--st-text-dim)"'],
  ["'#334155'", "'var(--st-text-faint)'"],
  ['"#334155"', '"var(--st-text-faint)"'],
  ["'#1E293B'", "'var(--st-text-ghost)'"],
  ['"#1E293B"', '"var(--st-text-ghost)"'],
  ["'#374151'", "'var(--st-nav-inactive)'"],
  ['"#374151"', '"var(--st-nav-inactive)"'],
  ["'#CBD5E1'", "'var(--st-text-body)'"],
  ['"#CBD5E1"', '"var(--st-text-body)"'],
  ["'#E2E8F0'", "'var(--st-text-secondary)'"],
  ['"#E2E8F0"', '"var(--st-text-secondary)"'],
  ["'#F1F5F9'", "'var(--st-text-primary)'"],
  ["'#38BDF8'", "'var(--st-accent)'"],
  ['"#38BDF8"', '"var(--st-accent)"'],
  ["'#10B981'", "'var(--st-success)'"],
  ['"#10B981"', '"var(--st-success)"'],
  ["'#F59E0B'", "'var(--st-warning)'"],
  ['"#F59E0B"', '"var(--st-warning)"'],
  ["'#EF4444'", "'var(--st-danger)'"],
  ['"#EF4444"', '"var(--st-danger)"'],
  ["'rgba(16,185,129,0.08)'", "'var(--st-success-bg)'"],
  ['"rgba(16,185,129,0.08)"', '"var(--st-success-bg)"'],
  ["'rgba(16,185,129,0.2)'", "'var(--st-success-border)'"],
  ['"rgba(16,185,129,0.2)"', '"var(--st-success-border)"'],
  ["'rgba(56,189,248,0.05)'", "'var(--st-active-tab)'"],
  ["'rgba(56,189,248,0.08)'", "'var(--st-accent-bg)'"],
  ['"rgba(56,189,248,0.08)"', '"var(--st-accent-bg)"'],
  ["'rgba(8,13,26,0.85)'", "'var(--st-overlay)'"],
  ["'rgba(255,255,255,0.03)'", "'var(--st-hover)'"],
  ["'rgba(255,255,255,0.02)'", "'var(--st-hover-row)'"],
  ["'rgba(56,189,248,0.04)'", "'var(--st-grid-line)'"],
  ['"rgba(56,189,248,0.04)"', '"var(--st-grid-line)"'],
  ["'rgba(37,99,235,0.08)'", "'var(--st-map-fill)'"],
  ["'rgba(56,189,248,0.35)'", "'var(--st-map-stroke)'"],
  ["'rgba(56,189,248,0.08)'", "'var(--st-map-divider)'"],
  ["'rgba(100,116,139,0.5)'", "'var(--st-map-label)'"],
  ["'rgba(56,189,248,0.4)'", "'var(--st-map-compass)'"],
  ["'rgba(56,189,248,0.3)'", "'var(--st-map-compass-line)'"],
  ["'rgba(56,189,248,0.12)'", "'var(--st-map-watermark)'"],
  ["'rgba(239,68,68,0.12)'", "'var(--st-danger-bg)'"],
  ['"rgba(239,68,68,0.12)"', '"var(--st-danger-bg)"'],
  ["'rgba(245,158,11,0.12)'", "'var(--st-warning-bg)'"],
  ["'rgba(56,189,248,0.1)'", "'var(--st-accent-bg-soft)'"],
  ["'rgba(239,68,68,0.25)'", "'var(--st-danger-border)'"],
  ["'rgba(56,189,248,0.15)'", "'var(--st-accent-border-soft)'"],
  ["'rgba(16,185,129,0.5)'", "'var(--st-success-dim)'"],
  ["'rgba(71,85,105,0.4)'", "'var(--st-ticker-divider)'"],
  ["'rgba(37,99,235,0.1)'", "'var(--st-toggle-bg)'"],
  ["'rgba(37,99,235,0.25)'", "'var(--st-toggle-border)'"],
  ["'rgba(239,68,68,0.15)'", "'var(--st-classified-bg)'"],
  ["'rgba(239,68,68,0.4)'", "'var(--st-classified-border)'"],
  ["'rgba(239,68,68,0.2)'", "'var(--st-secure-badge-border)'"],
  ["'rgba(31,41,55,0.5)'", "'var(--st-border-muted)'"],
  ['"rgba(31,41,55,0.5)"', '"var(--st-border-muted)"'],
  ["'rgba(31,41,55,0.15)'", "'var(--st-inactive-bg)'"],
  ["'rgba(56,189,248,0.25)'", "'var(--st-accent-border-mid)'"],
  ["'rgba(56,189,248,0.3)'", "'var(--st-accent-border-mid)'"],
  ["'rgba(56,189,248,0.2)'", "'var(--st-accent-border-light)'"],
  ["'rgba(37,99,235,0.12)'", "'var(--st-accent-bg)'"],
  ["'rgba(37,99,235,0.15)'", "'var(--st-accent-border-soft)'"],
  ["'rgba(37,99,235,0.06)'", "'var(--st-accent-bg-soft)'"],
  ["'rgba(37,99,235,0.3)'", "'var(--st-accent-border-mid)'"],
  ["'2px solid #38BDF8'", "'2px solid var(--st-accent)'"],
  ["'#060D1C'", "'var(--st-map-ocean)'"],
  ["'#030810'", "'var(--st-map-ocean)'"],
  ["'rgba(239,68,68,0.2)'", "'var(--st-secure-badge-border)'"],
  ["'rgba(16,185,129,0.05)'", "'var(--st-success-bg)'"],
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.(tsx|jsx)$/.test(entry) && !entry.includes('AuthPortal')) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  let content = readFileSync(file, 'utf8');
  const original = content;
  for (const [from, to] of REPLACEMENTS) {
    content = content.split(from).join(to);
  }
  // text-white -> theme class
  content = content.replace(/\btext-white\b/g, 'text-[var(--st-text-title)]');
  if (content !== original) {
    writeFileSync(file, content);
    changed++;
    console.log('updated', path.relative(root, file));
  }
}
console.log(`Done. ${changed} files updated.`);
