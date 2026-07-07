import { useState, useEffect } from 'react';
import { Lock, Wifi } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const TICKER_ITEMS = [
  { label: 'ACTIVE TELECOM INTERCEPTS', value: '14 NODES RUNNING', color: 'var(--st-accent)', key: 'intercepts' },
  { label: 'I4C CROSS-BORDER SYNDICATE SUPPRESSION RATE', value: '98.4%', color: 'var(--st-success)', key: 'suppression' },
  { label: 'HIGH-DENOMINATION FICN TRAJECTORY', value: '-12.4% (Q2 INTERCEPTION)', color: 'var(--st-success)', key: 'ficn' },
  { label: 'SECURE DATA LEDGER NODE', value: 'ACTIVE · AES-256-GCM CRYPTOGRAPHIC TUNNELING VERIFIED', color: 'var(--st-accent)', key: 'ledger' },
  { label: 'NCRB INCIDENT FEED', value: 'LIVE · 1,847 ACTIVE CASES', color: 'var(--st-accent)', key: 'ncrb' },
  { label: 'FIU-IND FINANCIAL INTELLIGENCE SYNC', value: 'SYNCHRONIZED · 99.1% UPTIME', color: 'var(--st-success)', key: 'fiu' },
  { label: 'RBI FICN DATABASE INTERFACE', value: 'CONNECTED · 3,241 SPECIMENS INDEXED', color: 'var(--st-success)', key: 'rbi' },
];

function formatIST(): string {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const hh = String(ist.getHours()).padStart(2, '0');
  const mm = String(ist.getMinutes()).padStart(2, '0');
  const ss = String(ist.getSeconds()).padStart(2, '0');
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dd = String(ist.getDate()).padStart(2, '0');
  const mon = months[ist.getMonth()];
  const yyyy = ist.getFullYear();
  return `${hh}:${mm}:${ss} IST  ${dd}-${mon}-${yyyy}`;
}

export default function Header() {
  const [clock, setClock] = useState(formatIST());
  const [interceptCount, setInterceptCount] = useState(14);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setClock(formatIST());
    }, 1000);
    const interceptInterval = setInterval(() => {
      setInterceptCount(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(10, Math.min(20, prev + delta));
      });
    }, 8000);
    return () => {
      clearInterval(clockInterval);
      clearInterval(interceptInterval);
    };
  }, []);

  const tickerItems = TICKER_ITEMS.map(item =>
    item.key === 'intercepts'
      ? { ...item, value: `${interceptCount} NODES RUNNING` }
      : item
  );

  return (
    <div className="flex-shrink-0">
      {/* MAIN HEADER BAR */}
      <div
        className="flex items-center justify-between px-4 h-[52px] border-b"
        style={{ background: 'var(--st-header)', borderColor: 'var(--st-border-strong)' }}
      >
        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="shield-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--st-accent)" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              <path d="M16 2L4 7V16C4 22.627 9.373 28 16 30C22.627 28 28 22.627 28 16V7L16 2Z"
                fill="url(#shield-grad)" opacity="0.15" />
              <path d="M16 2L4 7V16C4 22.627 9.373 28 16 30C22.627 28 28 22.627 28 16V7L16 2Z"
                stroke="url(#shield-grad)" strokeWidth="1.5" fill="none" />
              <path d="M11 16L14.5 19.5L21 13" stroke="var(--st-accent)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="16" r="5" stroke="var(--st-accent)" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--st-text-title)] font-semibold tracking-wider text-sm" style={{ fontFamily: 'Inter' }}>
                PROJECT SENTINEL
              </span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1"
                style={{ background: 'var(--st-classified-bg)', border: '1px solid var(--st-classified-border)', color: 'var(--st-danger)' }}
              >
                <Lock size={9} />
                CLASSIFIED
              </span>
            </div>
            <div className="text-[10px] tracking-wide" style={{ color: 'var(--st-text-muted)', fontFamily: 'Inter' }}>
              MINISTRY OF HOME AFFAIRS · I4C PORTAL INTEGRATION · MHA/CYBER/2026
            </div>
          </div>
        </div>

        {/* CENTER: Node Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded"
          style={{ background: 'var(--st-success-bg)', border: '1px solid var(--st-success-border)' }}>
          <div className="relative">
            <div className="w-2 h-2 rounded-full pulse-slow" style={{ background: 'var(--st-success)' }} />
            <div className="absolute inset-0 w-2 h-2 rounded-full pulse-ring" style={{ background: 'var(--st-success)' }} />
          </div>
          <span className="font-mono text-[11px] tracking-widest" style={{ color: 'var(--st-success)' }}>
            I4C UPLINK: ACTIVE · AES-256-GCM VERIFIED
          </span>
          <Wifi size={12} style={{ color: 'var(--st-success)' }} />
        </div>

        {/* RIGHT: Clock + theme */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-mono text-sm tracking-widest" style={{ color: 'var(--st-accent)' }}>
              {clock}
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* TELEMETRY TICKER BAR */}
      <div
        className="h-[36px] flex items-center overflow-hidden relative"
        style={{ background: 'var(--st-ticker)', borderBottom: '1px solid var(--st-border)' }}
      >
        <div className="ticker-track flex items-center gap-0">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-6">
              <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--st-text-dim)' }}>
                {item.label}:
              </span>
              <span className="font-mono text-[10px] font-semibold tracking-wide" style={{ color: item.color }}>
                {item.value}
              </span>
              <span style={{ color: 'var(--st-ticker-divider)', fontSize: 10 }}>|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
