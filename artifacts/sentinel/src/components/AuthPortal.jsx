import { useState, useEffect, useCallback, useRef } from 'react';

/* ─── Local credential registry (client-side simulation only) ─── */
const STORAGE_KEY = 'sentinel_portal_access_registry';

const DEFAULT_CREDENTIALS = {
  identifier: 'commander@i4c.gov.in',
  passcode: 'Sentinel@2026',
};

function loadRegisteredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function verifyLocalAccess(identifier, passcode, mode, confirmPasscode) {
  const normalizedId = identifier.trim().toLowerCase();
  const normalizedPass = passcode.trim();

  if (!normalizedId || !normalizedPass) {
    return { ok: false, error: 'All security fields are required for authorization.' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernamePattern = /^[a-zA-Z0-9._-]{3,64}$/;

  if (!emailPattern.test(normalizedId) && !usernamePattern.test(normalizedId)) {
    return { ok: false, error: 'Invalid command email or username format.' };
  }

  if (mode === 'signup') {
    if (normalizedPass.length < 8) {
      return { ok: false, error: 'Security passcode must be at least 8 characters.' };
    }
    if (normalizedPass !== confirmPasscode.trim()) {
      return { ok: false, error: 'Passcode confirmation does not match.' };
    }

    const users = loadRegisteredUsers();
    if (users.some((u) => u.identifier === normalizedId)) {
      return { ok: false, error: 'Identifier already provisioned in the portal registry.' };
    }

    users.push({ identifier: normalizedId, passcode: normalizedPass, provisionedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return { ok: true, message: 'Portal credentials provisioned. Access granted.' };
  }

  const users = loadRegisteredUsers();
  const registryMatch = users.find(
    (u) => u.identifier === normalizedId && u.passcode === normalizedPass,
  );
  const defaultMatch =
    normalizedId === DEFAULT_CREDENTIALS.identifier.toLowerCase() &&
    normalizedPass === DEFAULT_CREDENTIALS.passcode;

  if (registryMatch || defaultMatch) {
    return { ok: true, message: 'Identity verified. Establishing secure session.' };
  }

  return {
    ok: false,
    error: 'Authorization denied. Invalid credentials or insufficient clearance level.',
  };
}

function formatIST() {
  return new Date()
    .toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase()
    .replace(',', '');
}

/* ─── Inline SVG insignia placeholder ─── */
function PortalInsignia() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="insignia-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <radialGradient id="insignia-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="36" cy="36" r="36" fill="url(#insignia-glow)" />
      <circle cx="36" cy="36" r="33" stroke="rgba(56,189,248,0.2)" strokeWidth="0.75" strokeDasharray="3 3" />
      <circle cx="36" cy="36" r="28" stroke="url(#insignia-ring)" strokeWidth="1" opacity="0.6" />
      <path
        d="M36 14 L52 22 V38 C52 48 44 56 36 60 C28 56 20 48 20 38 V22 Z"
        stroke="#38BDF8"
        strokeWidth="1.2"
        fill="rgba(56,189,248,0.06)"
      />
      <circle cx="36" cy="34" r="8" stroke="#38BDF8" strokeWidth="0.8" fill="none" opacity="0.7" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 36 + Math.cos(rad) * 10;
        const y1 = 34 + Math.sin(rad) * 10;
        const x2 = 36 + Math.cos(rad) * 14;
        const y2 = 34 + Math.sin(rad) * 14;
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#38BDF8"
            strokeWidth="0.6"
            opacity="0.5"
          />
        );
      })}
      <path
        d="M33 34 L35.5 36.5 L40 31"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ─── Loading spinner ─── */
function AuthSpinner() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <span
        style={{
          width: '16px',
          height: '16px',
          border: '2px solid rgba(56,189,248,0.25)',
          borderTopColor: '#38BDF8',
          borderRadius: '50%',
          animation: 'auth-spin 0.7s linear infinite',
        }}
      />
      <span style={{ letterSpacing: '0.12em', fontSize: '11px' }}>ENCRYPTED HANDSHAKE</span>
    </span>
  );
}

/* ─── Main portal component ─── */
export default function AuthPortal({ onLoginSuccess }) {
  const [mode, setMode] = useState('signin');
  const [identifier, setIdentifier] = useState('');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [clock, setClock] = useState(formatIST());
  const [scanLine, setScanLine] = useState(0);
  const authorizeTimerRef = useRef(null);

  useEffect(() => {
    const clockId = setInterval(() => setClock(formatIST()), 1000);
    const scanId = setInterval(() => setScanLine((prev) => (prev + 1) % 100), 45);
    return () => {
      clearInterval(clockId);
      clearInterval(scanId);
      if (authorizeTimerRef.current) clearTimeout(authorizeTimerRef.current);
    };
  }, []);

  const resetFormState = useCallback(() => {
    setError('');
    setStatusMessage('');
    setPasscode('');
    setConfirmPasscode('');
    setShowPasscode(false);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    resetFormState();
  }, [resetFormState]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (isAuthorizing) return;

      setError('');
      setStatusMessage('');

      const result = verifyLocalAccess(identifier, passcode, mode, confirmPasscode);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setIsAuthorizing(true);
      setStatusMessage(result.message || 'Verifying clearance credentials…');

      authorizeTimerRef.current = setTimeout(() => {
        setIsAuthorizing(false);
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess({
            identifier: identifier.trim().toLowerCase(),
            mode,
            timestamp: Date.now(),
          });
        }
      }, 1500);
    },
    [identifier, passcode, confirmPasscode, mode, isAuthorizing, onLoginSuccess],
  );

  const inputBaseStyle = {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(10,15,29,0.65)',
    border: '1px solid rgba(31,41,55,0.9)',
    borderRadius: '2px',
    color: '#F1F5F9',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
    boxSizing: 'border-box',
  };

  const getInputStyle = (fieldName) => ({
    ...inputBaseStyle,
    borderColor: focusedField === fieldName ? '#38BDF8' : 'rgba(31,41,55,0.9)',
    boxShadow: focusedField === fieldName ? '0 0 0 1px rgba(56,189,248,0.35), 0 0 20px rgba(56,189,248,0.08)' : 'none',
    background: focusedField === fieldName ? 'rgba(13,19,33,0.85)' : 'rgba(10,15,29,0.65)',
  });

  const isSignUp = mode === 'signup';

  return (
    <>
      <style>{`
        @keyframes auth-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes auth-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes auth-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-portal-input::placeholder {
          color: #475569;
          letter-spacing: 0.04em;
        }
        .auth-mode-link {
          background: none;
          border: none;
          cursor: pointer;
          color: #38BDF8;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s ease, opacity 0.2s ease;
        }
        .auth-mode-link:hover {
          color: #7DD3FC;
        }
        .auth-submit-btn {
          width: 100%;
          padding: 13px 20px;
          margin-top: 6px;
          background: linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(37,99,235,0.12) 100%);
          border: 1px solid rgba(56,189,248,0.45);
          color: #38BDF8;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease;
        }
        .auth-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(56,189,248,0.25) 0%, rgba(37,99,235,0.2) 100%);
          border-color: rgba(56,189,248,0.7);
          box-shadow: 0 0 24px rgba(56,189,248,0.12);
        }
        .auth-submit-btn:active:not(:disabled) {
          transform: scale(0.985);
        }
        .auth-submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }
        .auth-passcode-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
        }
        .auth-passcode-toggle:hover {
          color: #38BDF8;
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0F1D',
          fontFamily: "'Inter', sans-serif",
          position: 'relative',
          overflow: 'hidden',
          padding: '24px 16px',
        }}
      >
        {/* Ambient grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.035,
            pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Scanline sweep */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `linear-gradient(to bottom,
              transparent ${scanLine}%,
              rgba(56,189,248,0.02) ${scanLine + 0.5}%,
              transparent ${scanLine + 1}%)`,
          }}
        />

        {/* Top security status bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 24px',
            borderBottom: '1px solid rgba(31,41,55,0.8)',
            background: 'rgba(8,13,26,0.92)',
            backdropFilter: 'blur(8px)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10B981',
                  animation: 'auth-pulse 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '0.14em',
                  color: '#10B981',
                }}
              >
                SECURE CHANNEL · TLS 1.3 ACTIVE
              </span>
            </div>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.12em',
                color: '#334155',
              }}
            >
              I4C UPLINK · MHA/CYBER/SECURE/2026
            </span>
          </div>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.1em',
              color: '#475569',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {clock} IST
          </span>
        </div>

        {/* Glassmorphic auth card */}
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            width: '100%',
            maxWidth: '440px',
            animation: 'auth-fade-in 0.5s ease-out',
            background: 'linear-gradient(145deg, rgba(13,19,33,0.88) 0%, rgba(10,15,29,0.78) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(31,41,55,0.85)',
            borderRadius: '3px',
            boxShadow: `
              0 0 0 1px rgba(56,189,248,0.04),
              0 24px 48px rgba(0,0,0,0.45),
              0 0 80px rgba(56,189,248,0.04)
            `,
            padding: '36px 32px 28px',
          }}
        >
          {/* Card corner accents */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '1px solid rgba(56,189,248,0.3)', borderLeft: '1px solid rgba(56,189,248,0.3)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '1px solid rgba(56,189,248,0.3)', borderRight: '1px solid rgba(56,189,248,0.3)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '1px solid rgba(56,189,248,0.3)', borderLeft: '1px solid rgba(56,189,248,0.3)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '1px solid rgba(56,189,248,0.3)', borderRight: '1px solid rgba(56,189,248,0.3)' }} />

          {/* Branding header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
            <PortalInsignia />
            <h1
              style={{
                margin: '16px 0 6px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: '#F8FAFC',
                textAlign: 'center',
              }}
            >
              PROJECT SENTINEL
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.1em',
                color: '#64748B',
                textAlign: 'center',
                lineHeight: 1.6,
                maxWidth: '320px',
              }}
            >
              I4C National Public Safety Intelligence Gateway — Restricted Access
            </p>
          </div>

          {/* Mode indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px',
              padding: '8px 12px',
              background: 'rgba(31,41,55,0.35)',
              border: '1px solid rgba(31,41,55,0.6)',
              borderRadius: '2px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isSignUp ? '#F59E0B' : '#38BDF8',
              }}
            />
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.14em',
                color: isSignUp ? '#F59E0B' : '#38BDF8',
              }}
            >
              {isSignUp ? 'PROVISIONING MODE · NEW CLEARANCE REQUEST' : 'AUTHENTICATION MODE · ACTIVE SESSION GATE'}
            </span>
          </div>

          {/* Auth form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Identifier field */}
            <div style={{ marginBottom: '18px' }}>
              <label
                htmlFor="auth-identifier"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                }}
              >
                Command Email / Username
              </label>
              <input
                id="auth-identifier"
                type="text"
                className="auth-portal-input"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onFocus={() => setFocusedField('identifier')}
                onBlur={() => setFocusedField(null)}
                placeholder="commander@i4c.gov.in"
                autoComplete="username"
                disabled={isAuthorizing}
                style={getInputStyle('identifier')}
              />
            </div>

            {/* Passcode field */}
            <div style={{ marginBottom: isSignUp ? '18px' : '22px' }}>
              <label
                htmlFor="auth-passcode"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                }}
              >
                Security Passcode
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-passcode"
                  type={showPasscode ? 'text' : 'password'}
                  className="auth-portal-input"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  onFocus={() => setFocusedField('passcode')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••••••"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  disabled={isAuthorizing}
                  style={{ ...getInputStyle('passcode'), paddingRight: '44px' }}
                />
                <button
                  type="button"
                  className="auth-passcode-toggle"
                  onClick={() => setShowPasscode((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 3l18 18M10.58 10.58A2 2 0 0012 15a2 2 0 001.41-.59M9.88 4.24A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7.5a11.8 11.8 0 01-4.74 5.2M6.11 6.11A11.75 11.75 0 002 12.5C3.73 16.89 8 20 13 20a10.9 10.9 0 004.12-.8" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 12.5C3.73 8.11 8 5 13 5s9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S3.73 16.89 2 12.5z" />
                      <circle cx="13" cy="12.5" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm passcode (signup only) */}
            {isSignUp && (
              <div style={{ marginBottom: '22px' }}>
                <label
                  htmlFor="auth-confirm-passcode"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                  }}
                >
                  Confirm Security Passcode
                </label>
                <input
                  id="auth-confirm-passcode"
                  type={showPasscode ? 'text' : 'password'}
                  className="auth-portal-input"
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  disabled={isAuthorizing}
                  style={getInputStyle('confirm')}
                />
              </div>
            )}

            {/* Error / status banners */}
            {error && (
              <div
                role="alert"
                style={{
                  marginBottom: '16px',
                  padding: '10px 12px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  borderRadius: '2px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  color: '#F87171',
                  lineHeight: 1.5,
                }}
              >
                ⚠ {error}
              </div>
            )}

            {statusMessage && !error && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '10px 12px',
                  background: 'rgba(56,189,248,0.06)',
                  border: '1px solid rgba(56,189,248,0.25)',
                  borderRadius: '2px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.06em',
                  color: '#38BDF8',
                  lineHeight: 1.5,
                }}
              >
                {statusMessage}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="auth-submit-btn" disabled={isAuthorizing}>
              {isAuthorizing ? <AuthSpinner /> : 'Authorize Access'}
            </button>
          </form>

          {/* Mode toggle */}
          <div
            style={{
              marginTop: '22px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(31,41,55,0.6)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: '0 0 8px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#475569',
                letterSpacing: '0.06em',
              }}
            >
              {isSignUp
                ? 'Already provisioned with clearance credentials?'
                : 'Require new portal access credentials?'}
            </p>
            <button type="button" className="auth-mode-link" onClick={toggleMode} disabled={isAuthorizing}>
              {isSignUp ? 'Sign In to Command Center' : 'Request Portal Provisioning (Sign Up)'}
            </button>
          </div>

          {/* Security footer */}
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px 20px',
            }}
          >
            {[
              { label: 'SESSION AUDIT', value: 'LOGGING' },
              { label: 'ENCRYPTION', value: 'AES-256-GCM' },
              { label: 'CLEARANCE', value: 'MHA-RESTRICTED' },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '7px',
                    letterSpacing: '0.14em',
                    color: '#334155',
                    marginBottom: '2px',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '8px',
                    letterSpacing: '0.1em',
                    color: '#38BDF8',
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom classification strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '8px 24px',
            borderTop: '1px solid rgba(31,41,55,0.6)',
            background: 'rgba(8,13,26,0.9)',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '8px',
              letterSpacing: '0.16em',
              color: '#334155',
            }}
          >
            UNAUTHORIZED ACCESS IS A CRIMINAL OFFENCE UNDER THE IT ACT, 2000 · ALL ACTIVITY IS MONITORED AND LOGGED
          </span>
        </div>
      </div>
    </>
  );
}
