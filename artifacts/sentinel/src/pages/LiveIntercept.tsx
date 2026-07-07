import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Radio, AlertTriangle, Clock, Zap, Upload, Play, Pause, RefreshCw, FileAudio } from 'lucide-react';

interface TranscriptLine {
  id: string;
  speaker: string;
  text: string;
  flag: string;
  flagType: 'critical' | 'info' | 'system' | null;
  triggerProgress?: number;
}

const UPLOAD_TRANSCRIPT_LINES: TranscriptLine[] = [
  { id: 'u0', speaker: 'SYSTEM', text: 'Uplink established. Analyzing audio track...', flag: 'SEGMENTATION HUBS ACTIVE · SIGNAL DE-NOISING ENFORCED', flagType: 'system', triggerProgress: 0.0 },
  { id: 'u1', speaker: 'ATTACKER', text: 'Namaskar. Mera naam Deputy Commissioner Rajesh Mehta hai. Main CBI Special Branch, Mumbai se bol raha hoon.', flag: 'IDENTITY CLAIM · CBI IMPERSONATION PATTERN · CONFIDENCE: 98.2%', flagType: 'critical', triggerProgress: 0.05 },
  { id: 'u2', speaker: 'VICTIM', text: 'Haan ji... aap kaun bol rahe hain? Mujhe samajh nahi aaya.', flag: 'VICTIM INCOMPREHENSION · DISTRESS SIGNALS DETECTED', flagType: 'info', triggerProgress: 0.15 },
  { id: 'u3', speaker: 'ATTACKER', text: 'Aapka Aadhaar number ek hawala account se link hua hai Dubai mein, jisme chaudah lakh battis hazar rupaye ka money laundering hua hai.', flag: 'FINANCIAL COERCION · HAWALA/MONEY LAUNDERING THREAT · CONFIDENCE: 99.4%', flagType: 'critical', triggerProgress: 0.25 },
  { id: 'u4', speaker: 'VICTIM', text: 'Yeh kaise ho sakta hai? Main toh kabhi Dubai nahi gaya!', flag: 'VICTIM STRESS PEAK · STUTTER DETECTED · RESPIRATION RATE: HIGH', flagType: 'info', triggerProgress: 0.35 },
  { id: 'u5', speaker: 'ATTACKER', text: 'Aap abhi "Digital Arrest" ke under hain. Is video call ko bilkul mat kaato. Yeh ek classified government operation hai.', flag: 'COERCIVE EXTORTION PROTOCOL · DIGITAL ARREST INTIMIDATION', flagType: 'critical', triggerProgress: 0.45 },
  { id: 'u6', speaker: 'ATTACKER', text: 'Apne family members ko mat batao. Yeh ek secret inquiry hai. Koi bhi document mat dekhao kisi ko bhi.', flag: 'ISOLATION PATTERN · SOCIAL ENGINEERING PHASE 3', flagType: 'critical', triggerProgress: 0.55 },
  { id: 'u7', speaker: 'VICTIM', text: 'Main darr gaya hoon... main kya karun? Aap meri help karo...', flag: 'VICTIM COMPLIANCE SIGNAL · EXTRACTION WINDOW ACTIVE', flagType: 'info', triggerProgress: 0.65 },
  { id: 'u8', speaker: 'ATTACKER', text: 'Abhi turant do lakh pachas hazar rupaye is account mein transfer karo: HDFC account number 9021. Yeh court ke liye security deposit hai.', flag: 'EXTORTION PAYMENT INITIATION · TARGET HDFC ACCOUNT: 9021', flagType: 'critical', triggerProgress: 0.75 },
  { id: 'u9', speaker: 'I4C ENGINE', text: 'Mewat Extortion Campaign fingerprint match. VoIP spoofing node identified. Initiating network teardown.', flag: 'SYSTEM FLAG: SYNDICATE IDENTIFIED · MEWAT CLUSTER · HDFC ACCOUNT 9021 FLAGGED', flagType: 'system', triggerProgress: 0.80 },
  { id: 'u10', speaker: 'ATTACKER', text: 'Jaldi karo! Warrant is waqt Supreme Court mein process ho raha hai. Ek ghante mein aapko arrest kar lenge.', flag: 'TIME PRESSURE TACTIC · FALSE SUPREME COURT WARRANT', flagType: 'critical', triggerProgress: 0.85 },
  { id: 'u11', speaker: 'I4C ENGINE', text: 'IMSI node +91-98107-XXXX Rohini grid isolated. TRAI SIM deactivation order transmitted.', flag: 'SYSTEM FLAG: THREAT CONTAINED · VICTIM SHIELD ACTIVE', flagType: 'system', triggerProgress: 0.95 }
];

const WAVEFORM_BARS = 32;

interface Props {
  deepfakeSensorWeight: number;
}

export default function LiveIntercept({ deepfakeSensorWeight }: Props) {
  // Start in Standby mode with only a system standby log message
  const [visibleLines, setVisibleLines] = useState<TranscriptLine[]>([
    { id: 'system-standby', speaker: 'SYSTEM', text: 'I4C NLP Parser v4.2 initialized. Standby mode active. Awaiting threat audio uplink...', flag: 'AWAITING UPLINK PACKET', flagType: 'system' }
  ]);
  const [elapsed, setElapsed] = useState(0);
  const [barHeights, setBarHeights] = useState<number[]>(Array.from({ length: WAVEFORM_BARS }, () => 4));
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Audio Uplink States
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeMB} MB`);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setVisibleLines([UPLOAD_TRANSCRIPT_LINES[0]]);
      setElapsed(0);
      toast.success(`Audio Uplink Successful: ${file.name} loaded. Ready to play.`);
    }
  };

  // Clear upload handler
  const handleClearUplink = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setFileName('');
    setFileSize('');
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setElapsed(0);
    // Return to standby mode
    setVisibleLines([
      { id: 'system-standby', speaker: 'SYSTEM', text: 'I4C NLP Parser v4.2 initialized. Standby mode active. Awaiting threat audio uplink...', flag: 'AWAITING UPLINK PACKET', flagType: 'system' }
    ]);
    toast.info("Audio Uplink cleared. Returning to standby.");
  };

  // Play/Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        toast.error("Audio playback failed. Please try another audio file.");
      });
    }
  };

  // Audio event sync
  const handlePlayPause = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const curTime = audioRef.current.currentTime;
    setCurrentTime(curTime);
    setElapsed(Math.floor(curTime));

    if (audioRef.current.duration) {
      const progress = curTime / audioRef.current.duration;
      // Filter lines whose trigger progress is less than or equal to current progress
      const linesToShow = UPLOAD_TRANSCRIPT_LINES.filter(line => progress >= (line.triggerProgress ?? 0));
      setVisibleLines(linesToShow);
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Master visualizer waveform effect
  useEffect(() => {
    let waveTimer: NodeJS.Timeout | undefined;
    if (audioUrl && isPlaying) {
      waveTimer = setInterval(() => {
        setBarHeights(Array.from({ length: WAVEFORM_BARS }, () => Math.random() * 24 + 4));
      }, 120);
    } else {
      setBarHeights(Array.from({ length: WAVEFORM_BARS }, () => 4));
    }
    return () => {
      if (waveTimer) clearInterval(waveTimer);
    };
  }, [audioUrl, isPlaying]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  // Dynamic analysis metrics computed based on parsed dialog progress
  const hasLine1 = visibleLines.some(l => l.id === 'u1');
  const hasLine2 = visibleLines.some(l => l.id === 'u2');
  const hasLine3 = visibleLines.some(l => l.id === 'u3');
  const hasLine6 = visibleLines.some(l => l.id === 'u6');
  const hasLine10 = visibleLines.some(l => l.id === 'u10');

  // Deepfake probability ranges
  const syntheticProb = audioUrl && hasLine1 ? Math.min(99.9, 94.2 * deepfakeSensorWeight).toFixed(1) : '0.0';
  const cloneConfidence = audioUrl && hasLine1 ? Math.min(99.8, 96.8 * deepfakeSensorWeight).toFixed(1) : '0.0';

  // Attack vectors
  const vectors = [
    { label: 'IDENTITY FRAUD', value: hasLine1 ? '98.2%' : '0.0%', color: 'var(--st-danger)', w: hasLine1 ? '98%' : '0%' },
    { label: 'SOCIAL ENGINEERING', value: hasLine2 ? '94.1%' : '0.0%', color: 'var(--st-danger)', w: hasLine2 ? '94%' : '0%' },
    { label: 'FINANCIAL COERCION', value: hasLine3 ? '99.4%' : '0.0%', color: 'var(--st-danger)', w: hasLine3 ? '99%' : '0%' },
    { label: 'ISOLATION TACTIC', value: hasLine6 ? '88.7%' : '0.0%', color: 'var(--st-warning)', w: hasLine6 ? '89%' : '0%' },
    { label: 'TIME PRESSURE', value: hasLine10 ? '76.3%' : '0.0%', color: 'var(--st-warning)', w: hasLine10 ? '76%' : '0%' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: 'var(--st-border)', background: 'var(--st-header)' }}>
        <div className="flex items-center gap-3">
          <Radio size={14} style={{ color: audioUrl ? 'var(--st-danger)' : 'var(--st-text-dim)' }} className={audioUrl ? "pulse-slow" : ""} />
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--st-text-label)' }}>
            LIVE INTERCEPT ENGINE · DIGITAL ARREST MITIGATION · ACTIVE OPERATION
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded"
            style={{ 
              background: audioUrl ? 'var(--st-danger-bg)' : 'var(--st-inactive-bg)', 
              border: `1px solid ${audioUrl ? 'var(--st-danger-border)' : 'var(--st-border-subtle)'}` 
            }}>
            <div className={`w-2 h-2 rounded-full ${audioUrl && isPlaying ? 'blink' : ''}`} 
              style={{ background: audioUrl ? 'var(--st-danger)' : 'var(--st-text-dim)' }} />
            <span className="font-mono text-[10px] tracking-widest" style={{ color: audioUrl ? 'var(--st-danger)' : 'var(--st-text-muted)' }}>
              {audioUrl ? (isPlaying ? 'DECODING TRACK...' : 'UPLINK CONNECTED') : 'SYSTEM STANDBY'}
            </span>
            <span className="font-mono text-[10px] font-bold" style={{ color: audioUrl ? 'var(--st-danger)' : 'var(--st-text-muted)' }}>
              {formatElapsed(elapsed)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split */}
      <div className="flex flex-1 min-h-0 overflow-hidden gap-0">
        {/* LEFT: Video feed & Audio source uplink */}
        <div className="flex flex-col w-[45%] flex-shrink-0 border-r"
          style={{ borderColor: 'var(--st-border)' }}>
          <div className="p-2 border-b flex-shrink-0" style={{ borderColor: 'var(--st-border-subtle)', background: 'var(--st-header)' }}>
            <div className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--st-text-dim)' }}>
              INTERCEPTED THREAT STREAM — VIDEO CHANNEL 7
            </div>
          </div>

          {/* Video container */}
          <div className="relative flex-shrink-0 animate-in fade-in" style={{ height: '200px', background: 'var(--st-map-ocean)' }}>
            {/* Scanline overlay */}
            <div className="absolute inset-0 scanline-overlay" />

            {/* Fake video content - grid pattern suggesting a face/figure */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="200" height="150" viewBox="0 0 200 150" opacity={audioUrl ? 0.15 : 0.04}>
                <circle cx="100" cy="40" r="25" fill="none" stroke="var(--st-accent)" strokeWidth="0.8" />
                <rect x="75" y="70" width="50" height="60" rx="4" fill="none" stroke="var(--st-accent)" strokeWidth="0.8" />
                <line x1="75" y1="90" x2="55" y2="120" stroke="var(--st-accent)" strokeWidth="0.8" />
                <line x1="125" y1="90" x2="145" y2="120" stroke="var(--st-accent)" strokeWidth="0.8" />
                {[28, 38, 48, 58].map(y =>
                  <line key={`fy${y}`} x1="80" y1={y} x2="120" y2={y} stroke="var(--st-accent)" strokeWidth="0.3" />
                )}
                {[85, 95, 105, 115].map(x =>
                  <line key={`fx${x}`} x1={x} y1="18" x2={x} y2="62" stroke="var(--st-accent)" strokeWidth="0.3" />
                )}
                <circle cx="100" cy="40" r="35" fill="none" stroke="var(--st-danger)" strokeWidth="0.5" strokeDasharray="4,4" />
              </svg>
              {/* DEEPFAKE DETECTED overlay */}
              <div className="absolute top-2 left-2 right-2 flex justify-between">
                <div className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                  style={{ 
                    background: audioUrl && hasLine1 ? 'var(--st-secure-badge-border)' : 'var(--st-inactive-bg)', 
                    border: `1px solid ${audioUrl && hasLine1 ? 'rgba(239,68,68,0.4)' : 'var(--st-border-faint)'}`, 
                    color: audioUrl && hasLine1 ? 'var(--st-danger)' : 'var(--st-text-muted)' 
                  }}>
                  {audioUrl ? (hasLine1 ? '● LIVE FEED · SYNTHETIC AVATAR DETECTED' : '● LINK ACTIVE · STANDBY') : '● STANDBY · NO ACTIVE THREAT STREAM'}
                </div>
                <div className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--st-text-muted)' }}>
                  REC ● {formatElapsed(elapsed)}
                </div>
              </div>
            </div>

            {/* Telemetry overlays */}
            <div className="absolute bottom-2 left-2 right-2 space-y-1.5">
              <div className="flex items-center justify-between px-2 py-1 rounded"
                style={{ 
                  background: audioUrl && hasLine1 ? 'var(--st-danger-bg)' : 'rgba(255,255,255,0.02)', 
                  border: `1px solid ${audioUrl && hasLine1 ? 'rgba(239,68,68,0.25)' : 'var(--st-border-faint)'}` 
                }}>
                <span className="font-mono text-[8px] tracking-wider" style={{ color: audioUrl ? 'var(--st-text-label)' : 'var(--st-text-dim)' }}>
                  FACE-MESH SPATIAL INCONSISTENCY
                </span>
                <span className="font-mono text-[9px] font-bold" style={{ color: audioUrl && hasLine1 ? 'var(--st-danger)' : 'var(--st-text-dim)' }}>
                  {syntheticProb}% SYNTHETIC PROB
                </span>
              </div>
            </div>
          </div>

          {/* Audio Uplink Panel */}
          <div className="flex-shrink-0 p-3 border-b" style={{ borderColor: 'var(--st-border-muted)', background: 'var(--st-header)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] tracking-widest font-semibold" style={{ color: 'var(--st-text-label)' }}>
                AUDIO THREAT UPLINK
              </span>
              {audioUrl && (
                <span className="font-mono text-[8px] flex items-center gap-1 text-[#10B981] animate-pulse">
                  <div className="w-1 h-1 rounded-full bg-[#10B981]" />
                  UPLINK SEGMENTATION ACTIVE
                </span>
              )}
            </div>

            {!audioUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed rounded p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/[0.02] bg-black/10"
                style={{ borderColor: 'var(--st-border)' }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="audio/*"
                  className="hidden"
                />
                <Upload size={18} className="text-slate-400 mb-2" />
                <span className="text-[9px] font-mono text-slate-300 font-bold mb-1">
                  DROP SCAM AUDIO FILE OR CLICK TO UPLINK
                </span>
                <span className="text-[7px] font-mono text-slate-500">
                  SUPPORTS MP3, WAV, M4A, OGG
                </span>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 p-2 rounded bg-black/20 border border-[#1F2937]/50">
                  <FileAudio size={16} className="text-[#38BDF8] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[9px] text-white truncate font-semibold">{fileName}</div>
                    <div className="font-mono text-[8px] text-slate-500">{fileSize}</div>
                  </div>
                  <button
                    onClick={handleClearUplink}
                    className="p-1 rounded bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20 transition-colors"
                  >
                    <RefreshCw size={10} />
                  </button>
                </div>

                {/* Custom Audio controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-[#38BDF8]/10 border border-[#38BDF8]/40 text-[#38BDF8] hover:bg-[#38BDF8]/20"
                  >
                    {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between font-mono text-[8px] text-slate-400">
                      <span>{formatElapsed(Math.floor(currentTime))}</span>
                      <span>{formatElapsed(Math.floor(duration))}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      step="any"
                      onChange={(e) => {
                        if (audioRef.current) {
                          const time = parseFloat(e.target.value);
                          audioRef.current.currentTime = time;
                          setCurrentTime(time);
                        }
                      }}
                      className="w-full h-1 bg-[#1F2937] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
                    />
                  </div>
                </div>

                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleAudioEnded}
                  onPlay={() => handlePlayPause(true)}
                  onPause={() => handlePlayPause(false)}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Waveform Analyzer */}
          <div className="flex-shrink-0 p-3 border-b" style={{ borderColor: 'var(--st-border-muted)', background: 'var(--st-ticker)' }}>
            <div className="font-mono text-[8px] tracking-widest mb-2" style={{ color: 'var(--st-text-faint)' }}>
              VOICE SPECTRAL ANALYSIS — REAL-TIME HARMONICS
            </div>
            <div className="flex items-end gap-[2px] h-8">
              {barHeights.map((h, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all duration-75"
                  style={{
                    height: `${h}px`,
                    background: h > 20
                      ? 'var(--st-danger)'
                      : h > 14
                        ? 'var(--st-warning)'
                        : 'color-mix(in srgb, var(--st-accent) 50%, transparent)',
                    opacity: 0.8,
                  }} />
              ))}
            </div>
            <div className="flex justify-between font-mono text-[7px] mt-1" style={{ color: 'var(--st-text-ghost)' }}>
              <span>0 Hz</span><span>2kHz</span><span>4kHz</span><span>8kHz</span><span>16kHz</span>
            </div>
          </div>

          {/* Attack vector summary */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="font-mono text-[8px] tracking-widest" style={{ color: 'var(--st-text-faint)' }}>ATTACK VECTOR ANALYSIS</div>
            {vectors.map(({ label, value, color, w }) => (
              <div key={label}>
                <div className="flex justify-between font-mono text-[8px] mb-0.5">
                  <span className="font-mono text-[8px]" style={{ color: 'var(--st-text-dim)' }}>{label}</span>
                  <span className="font-mono text-[8px] font-bold" style={{ color }}>{value}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--st-border)' }}>
                  <div className="h-full rounded-full" style={{ width: w, background: color, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: NLP Transcript */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div className="p-2 border-b flex-shrink-0 flex items-center justify-between"
            style={{ borderColor: 'var(--st-border-subtle)', background: 'var(--st-header)' }}>
            <div className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--st-text-dim)' }}>
              I4C NLP ANALYSIS PARSER — REAL-TIME TRANSCRIPT
            </div>
            <div className="font-mono text-[8px] flex items-center gap-1.5" style={{ color: 'var(--st-success)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" style={{ background: 'var(--st-success)' }} />
              {audioUrl ? (isPlaying ? 'DECODING AUDIO...' : 'PARSER PAUSED') : 'PARSER IDLE'}
            </div>
          </div>

          <div
            ref={transcriptRef}
            className="flex-1 overflow-y-auto p-3 space-y-2"
            style={{ background: 'var(--st-ticker)', fontFamily: 'IBM Plex Mono' }}
          >
            {visibleLines.map((line, idx) => (
              <div key={line.id} className="fade-in space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-[9px] flex-shrink-0 font-semibold mt-0.5"
                    style={{
                      color: line.speaker === 'ATTACKER' ? 'var(--st-danger)'
                        : line.speaker === 'VICTIM' ? 'var(--st-accent)'
                          : 'var(--st-warning)',
                    }}>
                    [{line.speaker}]
                  </span>
                  <span className="text-[9px] leading-relaxed font-medium" style={{ color: 'var(--st-text-label)' }}>
                    {line.text}
                  </span>
                </div>
                {line.flag && (
                  <div className="ml-0 pl-2"
                    style={{ borderLeft: `2px solid ${line.flagType === 'critical' ? 'color-mix(in srgb, var(--st-danger) 30%, transparent)' : line.flagType === 'system' ? 'color-mix(in srgb, var(--st-warning) 30%, transparent)' : 'color-mix(in srgb, var(--st-accent) 30%, transparent)'}` }}>
                    <span className={
                      line.flagType === 'critical' ? 'tag-critical' :
                        line.flagType === 'system' ? 'tag-system' : 'tag-info'
                    }>
                      {line.flag}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {/* Cursor */}
            <div className="flex items-center gap-1">
              <span className="font-mono text-[9px]" style={{ color: 'var(--st-text-ghost)' }}>I4C_PARSER &gt;</span>
              <div className="w-1.5 h-3 blink" style={{ background: 'var(--st-accent)' }} />
            </div>
          </div>

          {/* Enforcement Actions */}
          <div className="flex-shrink-0 border-t p-3 space-y-2"
            style={{ borderColor: 'var(--st-border)', background: 'var(--st-header)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={11} style={{ color: 'var(--st-warning)' }} />
              <span className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--st-text-dim)' }}>
                STRATEGIC ENFORCEMENT CONTROLS
              </span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={!audioUrl}
                onClick={() => toast.success('MHA Alert Packet #2026-04921 generated and transmitted to I4C Coordination Hub. Tracking ID: SENT-2026-MH-492. Auto-flagged for Director review.', { duration: 5000 })}
                className="flex-1 py-2 rounded font-mono text-[9px] tracking-wider transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: 'var(--st-accent-bg)', color: 'var(--st-accent)', border: '1px solid var(--st-accent-border-mid)' }}>
                GENERATE MHA ALERT PACKET
              </button>
              <button
                disabled={!audioUrl}
                onClick={() => toast.warning('Decoy audio loop injected on intercept channel. Attacker audio path disrupted for 3 min 42 sec. Victim extraction window: OPEN.', { duration: 5000 })}
                className="flex-1 py-2 rounded font-mono text-[9px] tracking-wider transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--st-warning)', border: '1px solid rgba(245,158,11,0.3)' }}>
                INJECT DECOY AUDIO LOOP
              </button>
              <button
                disabled={!audioUrl}
                onClick={() => toast.error('IMSI Node +91-XXXXXX-8821 isolated. Telecom provider (Reliance Jio) notified. SIM card flagged for immediate deactivation. TRAI breach report filed.', { duration: 5000 })}
                className="flex-1 py-2 rounded font-mono text-[9px] tracking-wider transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--st-danger)', border: '1px solid rgba(239,68,68,0.3)' }}>
                ISOLATE TELECOM IMSI NODE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
