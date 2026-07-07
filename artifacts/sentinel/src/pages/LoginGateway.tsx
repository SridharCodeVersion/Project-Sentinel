import { useState, useEffect } from 'react';
import { Shield, Lock, Wifi, AlertTriangle, Eye } from 'lucide-react';

function formatIST(): string {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase().replace(',', '');
}

interface Props {
  onLogin: () => void;
}

export default function LoginGateway({ onLogin }: Props) {
  const [clock, setClock] = useState(formatIST());
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const clockId = setInterval(() => setClock(formatIST()), 1000);
    const scanId = setInterval(() => setScanLine(prev => (prev + 1) % 100), 40);
    return () => { clearInterval(clockId); clearInterval(scanId); };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden relative"
      style={{ background: 'var(--st-ticker)', fontFamily: 'IBM Plex Mono, monospace' }}
    >
      {/* Animated scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `linear-gradient(to bottom,
            transparent ${scanLine}%,
            rgba(56,189,248,0.018) ${scanLine + 1}%,
            transparent ${scanLine + 2}%)`,
        }}
      />

      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 z-0" style={{ opacity: 0.04 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="lg" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--st-accent)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lg)" />
        </svg>
      </div>

      {/* Top status bar */}
      <div
        className="relative z-10 flex items-center justify-between px-6 py-2 border-b"
        style={{ borderColor: 'var(--st-border)', background: 'rgba(8,13,26,0.9)' }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--st-success)', animation: 'pulse-ring 2s ease-out infinite' }} />
            <span className="text-[9px] tracking-widest" style={{ color: 'var(--st-success)' }}>NETWORK: CLASSIFIED · TLS 1.3 ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi size={9} style={{ color: 'var(--st-accent)' }} />
            <span className="text-[9px] tracking-widest" style={{ color: 'var(--st-text-faint)' }}>I4C UPLINK · MHA/CYBER/SECURE/2026</span>
          </div>
        </div>
        <div className="text-[9px] tracking-widest tabular-nums" style={{ color: 'var(--st-text-dim)' }}>
          {clock} IST
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">

        {/* Emblem cluster */}
        <div className="flex items-center justify-center mb-8">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
            <defs>
              <linearGradient id="sh-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--st-accent)" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <radialGradient id="glow-g" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--st-accent)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--st-accent)" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Glow halo */}
            <circle cx="48" cy="48" r="48" fill="url(#glow-g)" />
            {/* Outer ring */}
            <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1" strokeDasharray="4,4" />
            <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="0.5" />
            {/* Shield body */}
            <path d="M48 8L16 20V44C16 62.778 30.222 78 48 82C65.778 78 80 62.778 80 44V20L48 8Z"
              fill="rgba(56,189,248,0.06)" stroke="url(#sh-g)" strokeWidth="1.5" />
            {/* Inner shield accent */}
            <path d="M48 18L24 27V44C24 58.359 34.641 70.5 48 73.5C61.359 70.5 72 58.359 72 44V27L48 18Z"
              fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="0.5" />
            {/* Checkmark */}
            <path d="M34 48L43 57L62 38" stroke="var(--st-accent)" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
            {/* Lock dots */}
            <circle cx="48" cy="48" r="3" fill="rgba(56,189,248,0.4)" />
          </svg>
        </div>

        {/* Title block */}
        <div className="text-center mb-2">
          <div className="text-[10px] tracking-[0.4em] mb-3" style={{ color: 'var(--st-text-faint)' }}>
            GOVERNMENT OF INDIA · MINISTRY OF HOME AFFAIRS
          </div>
          <h1 className="text-3xl font-bold tracking-[0.15em] mb-1" style={{ color: 'var(--st-text-secondary)', fontFamily: 'Inter, sans-serif' }}>
            PROJECT SENTINEL
          </h1>
          <div className="text-[11px] tracking-[0.3em] font-medium" style={{ color: 'var(--st-accent)' }}>
            NATIONAL SECURITY ACCESS PORTAL
          </div>
          <div className="text-[9px] tracking-widest mt-2" style={{ color: 'var(--st-text-ghost)' }}>
            UNIFIED CYBERCRIME COMMAND &amp; INTELLIGENCE PLATFORM · v2.4.1
          </div>
        </div>

        {/* Classification badge */}
        <div className="flex items-center gap-2 mt-4 mb-10 px-4 py-1.5 rounded"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertTriangle size={10} style={{ color: 'var(--st-danger)' }} />
          <span className="text-[9px] tracking-widest font-semibold" style={{ color: 'var(--st-danger)' }}>
            RESTRICTED ACCESS · AUTHORIZED PERSONNEL ONLY · SECTION 43A IT ACT
          </span>
        </div>

        {/* Auth card */}
        <div
          className="w-full max-w-md rounded-lg overflow-hidden"
          style={{
            background: 'var(--st-overlay)',
            border: '1px solid rgba(31,41,55,0.8)',
            boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(56,189,248,0.04)',
          }}
        >
          {/* Card header */}
          <div className="px-6 py-4 border-b flex items-center gap-3"
            style={{ borderColor: 'var(--st-border)', background: 'rgba(5,10,20,0.6)' }}>
            <Lock size={12} style={{ color: 'var(--st-accent)' }} />
            <span className="text-[9px] tracking-widest" style={{ color: 'var(--st-text-dim)' }}>
              SECURE IDENTITY VERIFICATION — OIDC / PKI AUTHENTICATION
            </span>
          </div>

          {/* Card body */}
          <div className="px-8 py-8 space-y-6">
            <div className="text-center space-y-1">
              <div className="text-xs tracking-widest font-semibold" style={{ color: 'var(--st-text-label)' }}>
                AUTHORIZED ACCESS REQUIRED
              </div>
              <div className="text-[9px] leading-relaxed" style={{ color: 'var(--st-text-faint)' }}>
                Identity verification is mandatory before accessing classified operational data.
                All sessions are cryptographically signed, logged, and auditable under
                MHA Security Protocol MHA/SENTINEL/SEC/2026.
              </div>
            </div>

            {/* Auth method indicators */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'ENTERPRISE SSO', status: 'ENABLED', color: 'var(--st-success)' },
                { label: 'MFA ENFORCED', status: 'ACTIVE', color: 'var(--st-success)' },
                { label: 'SESSION AUDIT', status: 'LOGGING', color: 'var(--st-accent)' },
                { label: 'END-TO-END ENC', status: 'AES-256', color: 'var(--st-accent)' },
              ].map(({ label, status, color }) => (
                <div key={label} className="p-2 rounded text-center"
                  style={{ background: 'var(--st-hover-row)', border: '1px solid rgba(31,41,55,0.6)' }}>
                  <div className="text-[8px] tracking-widest mb-0.5" style={{ color: 'var(--st-text-faint)' }}>{label}</div>
                  <div className="text-[9px] font-semibold tracking-widest" style={{ color }}>{status}</div>
                </div>
              ))}
            </div>

            {/* Primary login button */}
            <button
              onClick={onLogin}
              className="w-full py-3.5 rounded font-semibold tracking-widest text-xs transition-all duration-200 flex items-center justify-center gap-3 group"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(56,189,248,0.15) 100%)',
                border: '1px solid rgba(56,189,248,0.4)',
                color: 'var(--st-text-secondary)',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 0 20px rgba(56,189,248,0.08)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, rgba(37,99,235,0.3) 0%, rgba(56,189,248,0.25) 100%)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 30px rgba(56,189,248,0.15)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(56,189,248,0.15) 100%)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 20px rgba(56,189,248,0.08)';
              }}
            >
              <Eye size={14} style={{ color: 'var(--st-accent)' }} />
              AUTHENTICATE &amp; ACCESS COMMAND CENTER
            </button>

            <div className="text-center text-[8px] tracking-widest" style={{ color: 'var(--st-text-ghost)' }}>
              BY PROCEEDING YOU CONSENT TO ACTIVITY MONITORING UNDER IT ACT 2000 §69
            </div>
          </div>

          {/* Card footer */}
          <div className="px-6 py-3 border-t flex items-center justify-between"
            style={{ borderColor: 'var(--st-border-muted)', background: 'rgba(5,10,20,0.4)' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--st-success)' }} />
              <span className="text-[8px] tracking-widest" style={{ color: 'var(--st-success)' }}>SECURE CHANNEL ESTABLISHED</span>
            </div>
            <span className="text-[8px] tracking-widest" style={{ color: 'var(--st-text-ghost)' }}>
              SESSION LOGS: NODE-7 · I4C
            </span>
          </div>
        </div>

        {/* Footer metadata */}
        <div className="mt-10 text-center space-y-1.5">
          <div className="flex items-center justify-center gap-6 text-[8px] tracking-widest" style={{ color: 'var(--st-text-ghost)' }}>
            <span>INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-IN)</span>
            <span>·</span>
            <span>NATIONAL CYBER CRIME REPORTING PORTAL</span>
            <span>·</span>
            <span>I4C · MHA · GOI</span>
          </div>
          <div className="text-[8px] tracking-widest" style={{ color: '#0F172A' }}>
            UNAUTHORIZED ACCESS IS A CRIMINAL OFFENCE UNDER IPC §66 &amp; IT ACT 2000 §43, §66, §70
          </div>
        </div>
      </div>

      {/* Bottom classification bar */}
      <div className="relative z-10 flex items-center justify-center py-2 border-t"
        style={{ borderColor: 'var(--st-border-subtle)', background: 'rgba(8,13,26,0.9)' }}>
        <div className="flex items-center gap-3 text-[8px] tracking-[0.3em]" style={{ color: 'var(--st-text-ghost)' }}>
          <span>CLASSIFICATION: RESTRICTED</span>
          <span>·</span>
          <span>HANDLE VIA OFFICIAL CHANNELS ONLY</span>
          <span>·</span>
          <span>DO NOT COPY OR DISTRIBUTE</span>
        </div>
      </div>
    </div>
  );
}
