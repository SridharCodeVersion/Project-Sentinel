import { Link, useLocation } from 'wouter';
import { Shield, Radio, ScanLine, Network, SlidersHorizontal } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Shield,              label: 'COMMAND CENTER', sub: 'Incident Monitor',     href: '/' },
  { icon: Radio,               label: 'LIVE INTERCEPT', sub: 'Digital Arrest Engine', href: '/intercept' },
  { icon: ScanLine,            label: 'FICN AUDIT',     sub: 'Currency Forensics',   href: '/ficn' },
  { icon: Network,             label: 'SYNDICATE GRAPH',sub: 'Network Topology',     href: '/syndicate' },
  { icon: SlidersHorizontal,   label: 'SYSTEM SETTINGS',sub: 'AI Configuration',     href: '/settings' },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div
      className="w-[196px] flex-shrink-0 flex flex-col h-full"
      style={{ background: 'var(--st-header)', borderRight: '1px solid var(--st-border)' }}
    >
      {/* Nav Items */}
      <nav className="flex flex-col gap-1 p-2 flex-1 pt-3">
        {NAV_ITEMS.map(({ icon: Icon, label, sub, href }) => {
          const active = href === '/'
            ? location === '/' || location === ''
            : location.startsWith(href);
          return (
            <Link key={href} href={href}>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded cursor-pointer transition-all duration-150 relative group"
                style={{
                  background: active ? 'var(--st-active-nav)' : 'transparent',
                  borderLeft: active ? '2px solid var(--st-accent)' : '2px solid transparent',
                }}
              >
                {!active && (
                  <div
                    className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'var(--st-hover)' }}
                  />
                )}
                <Icon
                  size={15}
                  style={{ color: active ? 'var(--st-accent)' : 'var(--st-text-dim)', flexShrink: 0 }}
                />
                <div className="min-w-0">
                  <div
                    className="text-[10px] font-semibold tracking-widest leading-tight"
                    style={{
                      color: active ? 'var(--st-text-secondary)' : 'var(--st-text-muted)',
                      fontFamily: 'Inter',
                    }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-[9px] tracking-wide leading-tight mt-0.5"
                    style={{ color: active ? 'var(--st-text-muted)' : 'var(--st-nav-inactive)' }}
                  >
                    {sub}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--st-border-subtle)' }}>
        <div className="text-[8px] font-mono tracking-widest mb-2" style={{ color: 'var(--st-nav-inactive)' }}>
          SYSTEM STATUS
        </div>
        <div className="space-y-1.5">
          {[
            { label: 'CPU LOAD',   value: '34%',    color: 'var(--st-success)' },
            { label: 'MEM USAGE',  value: '61%',    color: 'var(--st-warning)' },
            { label: 'NET I/O',    value: '2.4 GB', color: 'var(--st-success)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="font-mono text-[8px] tracking-wider" style={{ color: 'var(--st-nav-inactive)' }}>{label}</span>
              <span className="font-mono text-[9px] font-medium" style={{ color }}>{value}</span>
            </div>
          ))}
        </div>
        <div
          className="mt-3 text-[8px] font-mono tracking-widest text-center py-1 rounded"
          style={{ background: 'var(--st-secure-badge-bg)', color: 'var(--st-danger)', border: '1px solid var(--st-secure-badge-border)' }}
        >
          SENTINEL v2.4.1 · SECURE
        </div>
      </div>
    </div>
  );
}
