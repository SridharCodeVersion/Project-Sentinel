import { toast } from 'sonner';
import { SlidersHorizontal, Wifi, WifiOff } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface Props {
  aiConfidenceCutoff: number;
  setAiConfidenceCutoff: (v: number) => void;
  deepfakeSensorWeight: number;
  setDeepfakeSensorWeight: (v: number) => void;
}

export default function SystemSettings({
  aiConfidenceCutoff, setAiConfidenceCutoff,
  deepfakeSensorWeight, setDeepfakeSensorWeight,
}: Props) {
  const [nodeToggles, setNodeToggles] = useState({
    i4c: true,
    ncrb: true,
    rbi: true,
    fiu: false,
  });

  const toggleNode = (key: keyof typeof nodeToggles) => {
    setNodeToggles(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const label = { i4c: 'I4C Primary Node', ncrb: 'NCRB Data Feed', rbi: 'RBI FICN Database', fiu: 'FIU-IND Financial Intelligence' }[key];
      if (next[key]) toast.success(`${label} connected. Sync active.`);
      else toast.warning(`${label} disconnected. Offline mode.`);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: 'var(--st-border)', background: 'var(--st-header)' }}>
        <SlidersHorizontal size={14} style={{ color: 'var(--st-accent)' }} />
        <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--st-text-label)' }}>
          SYSTEM CONFIGURATION — AI CLASSIFIER &amp; SENSOR MANAGEMENT
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* AI PARAMETERS */}
        <div className="rounded p-4 space-y-5"
          style={{ background: 'var(--st-hover-row)', border: '1px solid var(--st-border-subtle)' }}>
          <div className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--st-text-faint)' }}>
            AI CLASSIFIER PARAMETERS
          </div>

          {/* Confidence Cutoff */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-mono text-xs font-semibold" style={{ color: 'var(--st-text-body)' }}>
                  AI CLASSIFIER CONFIDENCE CUTOFF
                </div>
                <div className="font-mono text-[8px] mt-0.5" style={{ color: 'var(--st-text-dim)' }}>
                  Minimum confidence threshold for automated threat classification and alert generation
                </div>
              </div>
              <div className="font-mono text-2xl font-bold tabular-nums" style={{ color: 'var(--st-accent)' }}>
                {aiConfidenceCutoff}%
              </div>
            </div>
            <Slider
              min={0} max={100} step={1}
              value={[aiConfidenceCutoff]}
              onValueChange={([v]) => setAiConfidenceCutoff(v)}
              className="w-full"
            />
            <div className="flex justify-between font-mono text-[8px]" style={{ color: 'var(--st-text-faint)' }}>
              <span>0% — LOG ALL EVENTS</span>
              <span>50% — BALANCED</span>
              <span>100% — CONFIRMED ONLY</span>
            </div>
            <div className="text-[9px] font-mono px-2 py-1.5 rounded"
              style={{ background: 'var(--st-accent-bg-soft)', border: '1px solid var(--st-accent-border-soft)', color: 'var(--st-text-muted)' }}>
              EFFECT: FICN Detection Confidence → {Math.min(99.9, 89.2 + (aiConfidenceCutoff / 100) * 10.6).toFixed(1)}% · Alert Volume: {aiConfidenceCutoff < 50 ? 'HIGH' : aiConfidenceCutoff < 80 ? 'MODERATE' : 'LOW (PRECISION MODE)'}
            </div>
          </div>

          {/* Deepfake Weight */}
          <div className="space-y-3 pt-3 border-t" style={{ borderColor: 'var(--st-border-muted)' }}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-mono text-xs font-semibold" style={{ color: 'var(--st-text-body)' }}>
                  DEEPFAKE SENSOR WEIGHTING
                </div>
                <div className="font-mono text-[8px] mt-0.5" style={{ color: 'var(--st-text-dim)' }}>
                  Amplification factor for AI voice clone and face-mesh synthetic probability scoring
                </div>
              </div>
              <div className="font-mono text-2xl font-bold tabular-nums" style={{ color: 'var(--st-warning)' }}>
                {deepfakeSensorWeight.toFixed(1)}x
              </div>
            </div>
            <Slider
              min={0.1} max={2.0} step={0.1}
              value={[deepfakeSensorWeight]}
              onValueChange={([v]) => setDeepfakeSensorWeight(parseFloat(v.toFixed(1)))}
              className="w-full"
            />
            <div className="flex justify-between font-mono text-[8px]" style={{ color: 'var(--st-text-faint)' }}>
              <span>0.1x — LENIENT</span>
              <span>1.0x — CALIBRATED</span>
              <span>2.0x — HYPERSENSITIVE</span>
            </div>
            <div className="text-[9px] font-mono px-2 py-1.5 rounded"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', color: 'var(--st-text-muted)' }}>
              EFFECT: Synthetic Probability → {Math.min(99.9, 94.2 * deepfakeSensorWeight).toFixed(1)}% · Voice Clone Confidence → {Math.min(99.9, 96.8 * deepfakeSensorWeight).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* NODE CONFIGURATION */}
        <div className="rounded p-4 space-y-3"
          style={{ background: 'var(--st-hover-row)', border: '1px solid var(--st-border-subtle)' }}>
          <div className="font-mono text-[9px] tracking-widest mb-3" style={{ color: 'var(--st-text-faint)' }}>
            NODE CONFIGURATION — INTELLIGENCE FEED UPLINKS
          </div>
          {[
            { key: 'i4c' as const, label: 'I4C PRIMARY NODE', sub: 'Indian Cyber Crime Coordination Centre · MHA/I4C/LIVE', latency: '12ms', uptime: '99.97%' },
            { key: 'ncrb' as const, label: 'NCRB DATA FEED', sub: 'National Crime Records Bureau · Crime Database API v3', latency: '28ms', uptime: '99.82%' },
            { key: 'rbi' as const, label: 'RBI FICN DATABASE', sub: 'Reserve Bank of India · Counterfeit Currency Registry', latency: '19ms', uptime: '99.91%' },
            { key: 'fiu' as const, label: 'FIU-IND FINANCIAL INTELLIGENCE', sub: 'Financial Intelligence Unit India · SAR Feed · AML Data', latency: '44ms', uptime: '98.74%' },
          ].map(({ key, label, sub, latency, uptime }) => {
            const active = nodeToggles[key];
            return (
              <div key={key} className="flex items-center gap-3 p-3 rounded"
                style={{ background: active ? 'var(--st-success-bg)' : 'var(--st-inactive-bg)', border: `1px solid ${active ? 'var(--st-success-border)' : 'var(--st-border-muted)'}` }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {active
                      ? <Wifi size={10} style={{ color: 'var(--st-success)' }} />
                      : <WifiOff size={10} style={{ color: 'var(--st-text-dim)' }} />
                    }
                    <span className="font-mono text-[9px] font-semibold" style={{ color: active ? 'var(--st-text-body)' : 'var(--st-text-dim)' }}>
                      {label}
                    </span>
                  </div>
                  <div className="font-mono text-[8px]" style={{ color: 'var(--st-text-faint)' }}>{sub}</div>
                  {active && (
                    <div className="flex gap-3 mt-1 font-mono text-[8px]">
                      <span style={{ color: 'var(--st-success)' }}>LATENCY: {latency}</span>
                      <span style={{ color: 'var(--st-success)' }}>UPTIME: {uptime}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggleNode(key)}
                  className="px-3 py-1.5 rounded font-mono text-[9px] tracking-widest transition-all flex-shrink-0"
                  style={{
                    background: active ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                    color: active ? 'var(--st-danger)' : 'var(--st-success)',
                    border: `1px solid ${active ? 'var(--st-danger-border)' : 'rgba(16,185,129,0.25)'}`,
                  }}>
                  {active ? 'DISCONNECT' : 'CONNECT'}
                </button>
              </div>
            );
          })}
        </div>

        {/* AUDIT LOG EXPORT */}
        <div className="rounded p-4 space-y-3"
          style={{ background: 'var(--st-hover-row)', border: '1px solid var(--st-border-subtle)' }}>
          <div className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--st-text-faint)' }}>AUDIT LOG EXPORT</div>
          <div className="font-mono text-[8px]" style={{ color: 'var(--st-text-dim)' }}>
            Export encrypted audit trail for compliance review. Logs are AES-256 encrypted and signed with HSM key.
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toast.success('Audit log SENTINEL-AUDIT-2026-Q2.zip (2.4 MB, AES-256) exported. SHA256 hash transmitted to MHA compliance portal.')}
              className="px-4 py-2 rounded font-mono text-[9px] tracking-widest"
              style={{ background: 'var(--st-accent-bg-soft)', color: 'var(--st-accent)', border: '1px solid var(--st-accent-border-mid)' }}>
              EXPORT AUDIT LOGS (Q2 2026)
            </button>
            <button
              onClick={() => toast.info('System diagnostic report generated: SENTINEL-DIAG-2026-07-06.pdf. Forwarded to CTO office.')}
              className="px-4 py-2 rounded font-mono text-[9px] tracking-widest"
              style={{ background: 'var(--st-map-fill)', color: 'var(--st-text-muted)', border: '1px solid var(--st-border-muted)' }}>
              SYSTEM DIAGNOSTIC REPORT
            </button>
          </div>
        </div>

        {/* Version info */}
        <div className="font-mono text-[8px] space-y-0.5 pt-2" style={{ color: 'var(--st-text-ghost)' }}>
          <div>SENTINEL PLATFORM v2.4.1 · BUILD 20260706.1821 · NODE.JS RUNTIME</div>
          <div>LICENSED: MINISTRY OF HOME AFFAIRS — GOVERNMENT OF INDIA</div>
          <div>CLASSIFICATION: RESTRICTED — AUTHORIZED PERSONNEL ONLY</div>
        </div>
      </div>
    </div>
  );
}
