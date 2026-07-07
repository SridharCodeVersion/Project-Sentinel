import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { 
  ScanLine, CheckCircle, XCircle, AlertTriangle, Upload, 
  RefreshCw, Check, ShieldCheck, ShieldAlert, FileText, Trash2 
} from 'lucide-react';

import original500 from '../assets/original_500.png';
import original2000 from '../assets/original_2000.png';

interface CheckItem {
  id: string;
  label: string;
  subLabel: string;
}

const PENDING_CHECKS: CheckItem[] = [
  { id: 'microprint', label: 'MICROPRINT TEXT OCR SCAN', subLabel: 'भारत / RBI Central Register' },
  { id: 'thread', label: 'SECURITY THREAD SPECTRAL DEVIATION', subLabel: 'Variable Ink Signature Analysis' },
  { id: 'serial', label: 'GEOMETRIC SERIAL VALIDATION', subLabel: 'Alphanumeric Regex Check' },
  { id: 'uv', label: 'UV FLUORESCENCE RESPONSE', subLabel: 'Security Fibre Optical Scan' },
  { id: 'paper', label: 'PAPER COMPOSITION ANALYSIS', subLabel: 'Cotton Substrate Density Check' },
];

const getCounterfeitChecks = (denom: number) => [
  { id: 'microprint', label: 'MICROPRINT TEXT OCR SCAN', subLabel: 'भारत / RBI Central Register',
    status: 'PASS' as const, detail: 'VERIFIED — 2400 DPI STRUCTURAL MATCH · MICROLETTERING CONFIRMED', value: 100, color: 'var(--st-success)' },
  { id: 'thread', label: 'SECURITY THREAD SPECTRAL DEVIATION', subLabel: 'Variable Ink Signature Analysis',
    status: 'FAIL' as const, detail: 'FAIL — STATIC INK SIGNATURE DETECTED / NO VARIABLE SHIFT · FORGERY INDICATOR', value: 23, color: 'var(--st-danger)' },
  { id: 'serial', label: 'GEOMETRIC SERIAL VALIDATION', subLabel: 'Alphanumeric Regex Check',
    status: 'FAIL' as const, detail: `FAIL — NON-STANDARD ISSUE PATTERN DETECTED · SEQUENCE FOR ₹${denom} INVALID`, value: 11, color: 'var(--st-danger)' },
  { id: 'uv', label: 'UV FLUORESCENCE RESPONSE', subLabel: 'Security Fibre Optical Scan',
    status: 'FAIL' as const, detail: 'FAIL — FLUORESCENCE ABSENT ON SECURITY FIBRES · SUBSTRATE MISMATCH', value: 8, color: 'var(--st-danger)' },
  { id: 'paper', label: 'PAPER COMPOSITION ANALYSIS', subLabel: 'Cotton Substrate Density Check',
    status: 'PASS' as const, detail: 'PASS — 100% COTTON SUBSTRATE DETECTED · WEIGHT: 88 GSM (±1%) · MATCHES RBI SPEC', value: 96, color: 'var(--st-success)' },
];

const getGenuineChecks = (denom: number) => [
  { id: 'microprint', label: 'MICROPRINT TEXT OCR SCAN', subLabel: 'भारत / RBI Central Register',
    status: 'PASS' as const, detail: 'VERIFIED — 2400 DPI STRUCTURAL MATCH · MICROLETTERING CONFIRMED', value: 100, color: 'var(--st-success)' },
  { id: 'thread', label: 'SECURITY THREAD SPECTRAL DEVIATION', subLabel: 'Variable Ink Signature Analysis',
    status: 'PASS' as const, detail: 'PASS — DYNAMIC COLOR-SHIFT ACTIVE (GREEN-TO-BLUE) · VARIABLE INK SIGNATURE CONFIRMED', value: 98, color: 'var(--st-success)' },
  { id: 'serial', label: 'GEOMETRIC SERIAL VALIDATION', subLabel: 'Alphanumeric Regex Check',
    status: 'PASS' as const, detail: `PASS — STANDARD RBI ALPHANUMERIC ISSUANCE PATTERN MATCH FOR ₹${denom}`, value: 100, color: 'var(--st-success)' },
  { id: 'uv', label: 'UV FLUORESCENCE RESPONSE', subLabel: 'Security Fibre Optical Scan',
    status: 'PASS' as const, detail: 'PASS — DUAL-BAND FLUORESCENCE DETECTED ON SECURITY FIBRES', value: 97, color: 'var(--st-success)' },
  { id: 'paper', label: 'PAPER COMPOSITION ANALYSIS', subLabel: 'Cotton Substrate Density Check',
    status: 'PASS' as const, detail: 'PASS — 100% COTTON SUBSTRATE DETECTED · WEIGHT: 88 GSM (±1%) · MATCHES RBI SPEC', value: 99, color: 'var(--st-success)' },
];

interface Props {
  aiConfidenceCutoff: number;
}

export default function FICNAudit({ aiConfidenceCutoff }: Props) {
  // Config & Input States
  const [denomination, setDenomination] = useState<500 | 2000>(500);
  const [simulationMode, setSimulationMode] = useState<'auto' | 'genuine' | 'counterfeit'>('auto');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scan Execution States
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'completed'>('idle');
  const [currentScanIndex, setCurrentScanIndex] = useState<number>(-1);
  const [scanResult, setScanResult] = useState<'genuine' | 'counterfeit' | null>(null);
  
  // Interactive Toggles & Individual Re-scans
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(PENDING_CHECKS.map(c => [c.id, true]))
  );
  const [individualScanning, setIndividualScanning] = useState<Record<string, boolean>>({});

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
    };
  }, [uploadedFileUrl]);

  // Determine current active denomination image
  const referenceImage = denomination === 500 ? original500 : original2000;

  // Authenticity checking logic
  const determineAuthenticity = (file: File | null) => {
    if (simulationMode === 'genuine') return true;
    if (simulationMode === 'counterfeit') return false;
    if (!file) return false;
    
    const name = file.name.toLowerCase();
    return name.includes('real') || name.includes('original') || name.includes('genuine');
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
    setUploadedFile(file);
    setUploadedFileUrl(URL.createObjectURL(file));
    setScanState('idle');
    setScanResult(null);
    setCurrentScanIndex(-1);
    toast.success(`Specimen note loaded: ${file.name}`);
  };

  const handleClear = () => {
    if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
    setUploadedFile(null);
    setUploadedFileUrl(null);
    setScanState('idle');
    setScanResult(null);
    setCurrentScanIndex(-1);
    toast.info("Specimen cleared.");
  };

  // Main multi-stage scanning simulation
  const startForensicScan = () => {
    if (!uploadedFile) {
      toast.error("Please upload a currency specimen banknote image first.");
      return;
    }
    setScanState('scanning');
    setScanResult(null);
    setCurrentScanIndex(0);
  };

  useEffect(() => {
    if (scanState !== 'scanning') return;
    if (currentScanIndex < 0 || currentScanIndex > 4) return;

    const timer = setTimeout(() => {
      if (currentScanIndex < 4) {
        setCurrentScanIndex(prev => prev + 1);
      } else {
        // Scan finished, commit verdict
        const isGenuine = determineAuthenticity(uploadedFile);
        const result = isGenuine ? 'genuine' : 'counterfeit';
        setScanResult(result);
        setScanState('completed');
        setCurrentScanIndex(-1);
        
        if (isGenuine) {
          toast.success("Optical Analysis Complete: No counterfeiting markers found. Banknote verified genuine.");
        } else {
          toast.error("Optical Analysis Complete: Mismatch signatures detected on security features!");
        }
      }
    }, 600); // 600ms per check validation

    return () => clearTimeout(timer);
  }, [scanState, currentScanIndex, uploadedFile, simulationMode]);

  // Individual check re-scan
  const handleReScan = (id: string) => {
    setIndividualScanning(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setIndividualScanning(prev => ({ ...prev, [id]: false }));
      const checkLabel = PENDING_CHECKS.find(c => c.id === id)?.label;
      toast.info(`Individual re-scan complete: ${checkLabel}`);
    }, 1200);
  };

  const toggleCheck = (id: string) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate dynamic confidences
  const isFinalGenuine = scanResult === 'genuine';
  const detectionConfidence = isFinalGenuine 
    ? Math.min(99.9, 98.4 + (aiConfidenceCutoff / 100) * 1.5).toFixed(1)
    : Math.min(99.9, 89.2 + (aiConfidenceCutoff / 100) * 10.6).toFixed(1);

  const activeFailCount = scanResult === 'counterfeit' 
    ? getCounterfeitChecks(denomination).filter(c => c.status === 'FAIL' && toggles[c.id]).length 
    : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Dynamic Keyframe Scanner CSS Injection */}
      <style>{`
        @keyframes scanline-sweep {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scanline {
          animation: scanline-sweep 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: 'var(--st-border)', background: 'var(--st-header)' }}>
        <div className="flex items-center gap-3">
          <ScanLine size={14} style={{ color: 'var(--st-accent)' }} />
          <span className="font-mono text-xs tracking-widest text-[var(--st-text-title)] font-semibold">
            FICN FIELD AUDIT AGENT v3.1 — RESERVE BANK CERTIFIED · RBI/FICN/2026
          </span>
        </div>
        <div className="font-mono text-[9px] tracking-widest px-2 py-1 rounded"
          style={{ background: 'var(--st-success-bg)', color: 'var(--st-success)', border: '1px solid rgba(16,185,129,0.2)' }}>
          CERTIFICATION ACTIVE · ISO/IEC 17025:2017
        </div>
      </div>

      {/* Main split */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT PANEL: OPTICAL INPUT CAPTURE */}
        <div className="flex flex-col w-[48%] flex-shrink-0 border-r overflow-y-auto"
          style={{ borderColor: 'var(--st-border)' }}>
          
          <div className="p-3 border-b flex items-center justify-between" 
            style={{ borderColor: 'var(--st-border-muted)', background: 'var(--st-header)' }}>
            <div className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--st-text-dim)' }}>
              OPTICAL INPUT CAPTURE — SPECIMEN COMPARISON
            </div>
            <div className="flex items-center gap-1.5 bg-[#050A14] p-0.5 rounded border border-slate-800">
              <span className="font-mono text-[8px] px-1 text-slate-500">SIMULATE:</span>
              <select 
                value={simulationMode} 
                onChange={(e) => setSimulationMode(e.target.value as any)}
                className="bg-transparent text-[8px] font-mono text-sky-400 outline-none border-none cursor-pointer pr-1"
              >
                <option value="auto">Auto (Detect by File Name)</option>
                <option value="genuine">Force Genuine Note</option>
                <option value="counterfeit">Force Counterfeit Note</option>
              </select>
            </div>
          </div>

          <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
            {/* Top selectors & actions */}
            <div className="flex items-center justify-between gap-3">
              {/* Denomination select toggle */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-slate-400">DENOMINATION:</span>
                <div className="flex bg-[#050A14] p-0.5 rounded border border-slate-800">
                  <button 
                    onClick={() => setDenomination(500)}
                    className={`px-3 py-1 font-mono text-[10px] rounded transition-all ${denomination === 500 ? 'bg-[#38BDF8] text-[#0A0F1D] font-bold shadow-[0_0_8px_rgba(56,189,248,0.3)]' : 'text-slate-400 hover:text-white'}`}
                  >
                    ₹500
                  </button>
                  <button 
                    onClick={() => setDenomination(2000)}
                    className={`px-3 py-1 font-mono text-[10px] rounded transition-all ${denomination === 2000 ? 'bg-[#38BDF8] text-[#0A0F1D] font-bold shadow-[0_0_8px_rgba(56,189,248,0.3)]' : 'text-slate-400 hover:text-white'}`}
                  >
                    ₹2000
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              {uploadedFile && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 px-2 py-1 bg-red-950/20 hover:bg-red-950/40 border border-red-900/50 rounded font-mono text-[9px] text-red-400 transition-colors"
                >
                  <Trash2 size={10} />
                  <span>CLEAR</span>
                </button>
              )}
            </div>

            {/* Reference image card */}
            <div className="rounded border bg-[var(--st-panel-alt)] p-3 relative overflow-hidden flex-1 flex flex-col justify-between min-h-[160px]"
              style={{ borderColor: 'var(--st-border-subtle)' }}>
              
              <div className="flex justify-between items-center mb-2 z-10">
                <span className="font-mono text-[9px] text-slate-400 tracking-wider">
                  RBI REFERENCE TEMPLATE (₹{denomination} ORIGINAL)
                </span>
                <span className="font-mono text-[8px] bg-emerald-950/50 border border-emerald-800 text-emerald-400 px-1.5 py-0.5 rounded uppercase">
                  OFFICIAL STANDARD
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center relative p-1 bg-[#050A14]/30 rounded border border-slate-900 overflow-hidden">
                <img 
                  src={referenceImage} 
                  alt={`RBI Reference ₹${denomination}`}
                  className="w-full h-full max-h-[135px] object-contain rounded drop-shadow-lg"
                />
                
                {/* Scan Overlay Line */}
                {scanState === 'scanning' && (
                  <div className="absolute inset-x-0 h-0.5 bg-[#38BDF8] shadow-[0_0_12px_#38BDF8] animate-scanline"></div>
                )}
              </div>
            </div>

            {/* Specimen image upload/preview card */}
            <div className="rounded border bg-[var(--st-panel-alt)] p-3 relative overflow-hidden flex-1 flex flex-col justify-between min-h-[160px]"
              style={{ borderColor: 'var(--st-border-subtle)' }}>
              
              <div className="flex justify-between items-center mb-2 z-10">
                <span className="font-mono text-[9px] text-slate-400 tracking-wider">
                  SPECIMEN BANKNOTE (UNDER FIELD AUDIT)
                </span>
                {uploadedFile ? (
                  <span className="font-mono text-[8px] bg-sky-950/50 border border-sky-800 text-sky-400 px-1.5 py-0.5 rounded uppercase">
                    Specimen Loaded
                  </span>
                ) : (
                  <span className="font-mono text-[8px] bg-amber-950/50 border border-amber-800 text-amber-500 px-1.5 py-0.5 rounded uppercase animate-pulse">
                    Awaiting Upload
                  </span>
                )}
              </div>

              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploadedFile && fileInputRef.current?.click()}
                className={`flex-1 flex items-center justify-center relative p-1 bg-[#050A14]/30 rounded border overflow-hidden ${!uploadedFile ? 'cursor-pointer hover:border-sky-500/50 border-dashed border-slate-700 min-h-[135px] transition-colors' : 'border-slate-900'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                {uploadedFileUrl ? (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <img 
                      src={uploadedFileUrl} 
                      alt="Uploaded Specimen"
                      className="w-full h-full max-h-[135px] object-contain rounded drop-shadow-lg"
                    />
                    
                    {/* Scan Overlay Line */}
                    {scanState === 'scanning' && (
                      <div className="absolute inset-x-0 h-0.5 bg-sky-400 shadow-[0_0_12px_#38BDF8] animate-scanline"></div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
                    <div className={`p-2.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-500 ${isDragging ? 'text-sky-400 border-sky-900 bg-sky-950/10' : ''} transition-all`}>
                      <Upload size={18} className={isDragging ? 'animate-bounce text-sky-400' : 'animate-pulse text-slate-400'} />
                    </div>
                    <div className="space-y-1">
                      <div className="font-mono text-[9px] font-bold text-slate-300">
                        {isDragging ? 'DROP CURRENCY IMAGE HERE' : 'DRAG & DROP CURRENCY NOTE OR CLICK TO BROWSE'}
                      </div>
                      <div className="font-mono text-[7.5px] text-slate-500">
                        Supports JPEG, PNG, WEBP (Standard Field Upload)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Run Scan Action */}
            <button
              onClick={startForensicScan}
              disabled={!uploadedFile || scanState === 'scanning'}
              className={`w-full py-2.5 rounded font-mono text-[10px] tracking-widest font-bold border transition-all flex items-center justify-center gap-2 ${
                !uploadedFile 
                  ? 'bg-slate-900 text-slate-600 border-slate-800/80 cursor-not-allowed'
                  : scanState === 'scanning'
                    ? 'bg-amber-950/20 text-amber-500 border-amber-800/60 animate-pulse'
                    : 'bg-[#38BDF8] text-[#0A0F1D] border-[#38BDF8] hover:bg-[#38BDF8]/90 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
              }`}
            >
              <RefreshCw size={11} className={scanState === 'scanning' ? 'animate-spin' : ''} />
              <span>
                {scanState === 'scanning' 
                  ? 'RUNNING forenSIC OPTICAL SCAN...' 
                  : scanState === 'completed' 
                    ? 'RE-RUN forenSIC COMPARISON' 
                    : 'RUN forenSIC COMPARISON SCAN'}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: SPECTRAL FEATURE INSET & AUTOMATED INSPECTION DIAGNOSTICS */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          <div className="p-3 border-b flex-shrink-0" 
            style={{ borderColor: 'var(--st-border-muted)', background: 'var(--st-header)' }}>
            <div className="font-mono text-[9px] tracking-widest text-[var(--st-text-title)] font-semibold">
              SPECTRAL FEATURE INSET &amp; AUTOMATED INSPECTION DIAGNOSTICS
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {PENDING_CHECKS.map((check, i) => {
              // Determine check status/values dynamically
              const checkToggleActive = toggles[check.id];
              const isCheckingIndividually = individualScanning[check.id];
              
              let checkState: 'pending' | 'scanning' | 'passed' | 'failed' = 'pending';
              let statusText = 'PENDING';
              let detailText = 'Forensic scan sequence queued.';
              let progressValue = 0;
              let textColor = 'var(--st-text-faint)';
              let borderColor = 'var(--st-border-muted)';
              
              if (scanState === 'idle') {
                checkState = 'pending';
                statusText = 'AWAITING SCAN';
                detailText = 'Awaiting optical input verification.';
                progressValue = 0;
                textColor = 'var(--st-text-muted)';
                borderColor = 'var(--st-border-muted)';
              } else if (scanState === 'scanning') {
                if (i < currentScanIndex) {
                  // Already scanned in sequence
                  const mockIsGenuine = determineAuthenticity(uploadedFile);
                  const resultData = getCheckData(check.id, mockIsGenuine, denomination);
                  checkState = resultData.status === 'PASS' ? 'passed' : 'failed';
                  statusText = resultData.status;
                  detailText = resultData.detail;
                  progressValue = resultData.value;
                  textColor = resultData.color;
                  borderColor = resultData.status === 'PASS' ? 'var(--st-success-border)' : 'var(--st-secure-badge-border)';
                } else if (i === currentScanIndex) {
                  // Currently scanning in sequence
                  checkState = 'scanning';
                  statusText = 'ANALYZING';
                  detailText = 'Optical inspection alignment in progress...';
                  progressValue = 65;
                  textColor = 'var(--st-warning)';
                  borderColor = 'color-mix(in srgb, var(--st-warning) 30%, transparent)';
                } else {
                  // Pending sequence
                  checkState = 'pending';
                  statusText = 'QUEUED';
                  detailText = 'Scanning sequence queued.';
                  progressValue = 0;
                  textColor = 'var(--st-text-faint)';
                  borderColor = 'var(--st-border-muted)';
                }
              } else if (scanState === 'completed') {
                const resultData = getCheckData(check.id, isFinalGenuine, denomination);
                checkState = resultData.status === 'PASS' ? 'passed' : 'failed';
                statusText = resultData.status;
                detailText = resultData.detail;
                progressValue = resultData.value;
                textColor = resultData.color;
                borderColor = resultData.status === 'PASS' ? 'var(--st-success-border)' : 'var(--st-secure-badge-border)';
              }

              // Override if manual individual scanning is triggered
              if (isCheckingIndividually) {
                checkState = 'scanning';
                statusText = 'RE-SCANNING';
                detailText = 'Aligning multi-spectral optical grid...';
                progressValue = 45;
                textColor = 'var(--st-warning)';
              }

              return (
                <div 
                  key={check.id} 
                  className="rounded p-3 transition-colors"
                  style={{ 
                    background: 'var(--st-hover-row)', 
                    border: `1px solid ${checkToggleActive ? borderColor : 'var(--st-border-muted)'}` 
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[9px] font-semibold tracking-wider"
                          style={{ color: checkToggleActive ? 'var(--st-text-primary)' : 'var(--st-text-faint)' }}>
                          {i + 1}. {check.label}
                        </span>
                        
                        {checkToggleActive && checkState === 'passed' && (
                          <CheckCircle size={10} style={{ color: 'var(--st-success)' }} />
                        )}
                        {checkToggleActive && checkState === 'failed' && (
                          <XCircle size={10} style={{ color: 'var(--st-danger)' }} />
                        )}
                      </div>
                      <div className="font-mono text-[8px]" style={{ color: 'var(--st-text-muted)' }}>
                        {check.subLabel}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => toggleCheck(check.id)}
                        disabled={scanState === 'scanning'}
                        className={`w-7 h-4 rounded-full relative transition-colors ${scanState === 'scanning' ? 'opacity-40 cursor-not-allowed' : ''} ${checkToggleActive ? "bg-[#38BDF8]" : "bg-slate-800"}`}
                      >
                        <div className={`w-2.5 h-2.5 bg-slate-950 rounded-full absolute top-[3px] transition-all ${checkToggleActive ? "left-4" : "left-0.5"}`}></div>
                      </button>

                      {/* Rescan Button */}
                      <button
                        onClick={() => handleReScan(check.id)}
                        disabled={!uploadedFile || scanState === 'scanning' || !checkToggleActive || isCheckingIndividually}
                        className="px-2 py-0.5 rounded font-mono text-[8px] tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: isCheckingIndividually ? 'var(--st-warning-bg)' : 'var(--st-inactive-bg)',
                          color: isCheckingIndividually ? 'var(--st-warning)' : 'var(--st-text-body)',
                          border: `1px solid ${isCheckingIndividually ? 'color-mix(in srgb, var(--st-warning) 30%, transparent)' : 'var(--st-border-muted)'}`,
                        }}
                      >
                        {isCheckingIndividually ? 'RUNNING' : 'RE-SCAN'}
                      </button>
                    </div>
                  </div>

                  {!checkToggleActive ? (
                    <div className="font-mono text-[8px] text-slate-600 uppercase">
                      Check disabled — toggle to include in analysis
                    </div>
                  ) : checkState === 'scanning' ? (
                    <div className="space-y-1">
                      <div className="font-mono text-[8px] text-amber-500 animate-pulse">{detailText}</div>
                      <div className="h-1 rounded-full overflow-hidden bg-slate-900">
                        <div className="h-full rounded-full bg-amber-500 animate-pulse" style={{ width: `${progressValue}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="font-mono text-[8.5px] leading-relaxed" style={{ color: textColor }}>
                        {detailText}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-900">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${progressValue}%`, background: textColor }} 
                          />
                        </div>
                        <span className="font-mono text-[8px] min-w-[20px] text-right" style={{ color: textColor }}>
                          {progressValue}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* VERDICT CONTAINER */}
          <div className="flex-shrink-0 p-3 m-3 rounded border transition-all"
            style={{ 
              background: scanState === 'completed' 
                ? (isFinalGenuine ? 'var(--st-success-bg)' : 'var(--st-secure-badge-bg)')
                : 'transparent',
              borderColor: scanState === 'completed'
                ? (isFinalGenuine ? 'var(--st-success-border)' : 'var(--st-classified-border)')
                : 'var(--st-border-muted)'
            }}
          >
            {scanState === 'idle' && (
              <div className="flex items-start gap-2.5">
                <FileText size={14} className="text-slate-400 mt-0.5" />
                <div>
                  <div className="font-mono text-xs font-bold tracking-widest text-slate-400">
                    VERDICT: AWAITING FORENSIC SCAN INPUT
                  </div>
                  <div className="font-mono text-[8.5px] mt-1 text-slate-500">
                    DETECTION CONFIDENCE: --% · RECOMMENDATION: UPLOAD NOTE SPECIMEN AND TRIGGER COMPARISON SCAN
                  </div>
                </div>
              </div>
            )}

            {scanState === 'scanning' && (
              <div className="flex items-start gap-2.5">
                <RefreshCw size={14} className="text-amber-500 mt-0.5 animate-spin" />
                <div>
                  <div className="font-mono text-xs font-bold tracking-widest text-amber-500 uppercase animate-pulse">
                    VERDICT: FIELD SCAN IN PROGRESS
                  </div>
                  <div className="font-mono text-[8.5px] mt-1 text-amber-600">
                    DETECTION CONFIDENCE: ANALYZING SPECTRAL SIGNATURES...
                  </div>
                </div>
              </div>
            )}

            {scanState === 'completed' && (
              <div>
                <div className="flex items-start gap-2.5 mb-2">
                  {isFinalGenuine ? (
                    <ShieldCheck size={14} style={{ color: 'var(--st-success)' }} className="flex-shrink-0 mt-0.5 animate-pulse" />
                  ) : (
                    <AlertTriangle size={14} style={{ color: 'var(--st-danger)' }} className="flex-shrink-0 mt-0.5 pulse-slow" />
                  )}
                  <div>
                    <div className="font-mono text-xs font-bold tracking-widest uppercase" 
                      style={{ color: isFinalGenuine ? 'var(--st-success)' : 'var(--st-danger)' }}
                    >
                      {isFinalGenuine 
                        ? 'VERDICT: VERIFIED GENUINE CURRENCY NOTE (RBI OFFICIAL ISSUE)' 
                        : 'VERDICT: CONFIRMED FORGED INDIAN CURRENCY NOTE (FICN TYPE-4)'}
                    </div>
                    <div className="font-mono text-[8.5px] mt-1" 
                      style={{ color: isFinalGenuine ? 'var(--st-success)' : 'var(--st-danger)', opacity: 0.8 }}
                    >
                      DETECTION CONFIDENCE: {detectionConfidence}% · RECOMMENDATION:{' '}
                      <span className="font-bold">
                        {isFinalGenuine ? 'ACCEPT AS VALID LEGAL TENDER' : 'IMMEDIATE SEIZURE AND FIR FILING'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="font-mono text-[8px] tracking-widest space-y-0.5 pl-6 text-slate-500">
                  {isFinalGenuine ? (
                    <>
                      <div>PASSES: 5/5 SECURITY CHECKS · VALIDATION: RBI-FICN-PASS-2026</div>
                      <div>STATUS: OPTICALLY &amp; STRUCTURALLY CLEAN · CENTRAL LEDGER REGISTERED</div>
                    </>
                  ) : (
                    <>
                      <div>FAILURES: {activeFailCount}/5 SECURITY CHECKS · RBI CIRCULAR: FICN-2026/442</div>
                      <div>NCRB CASE REF: NCR-FICN-2026-1821 · CUSTODY: INS. R. KRISHNAMURTHY</div>
                    </>
                  )}
                </div>

                {isFinalGenuine ? (
                  <button
                    onClick={() => toast.success('Digital Integrity Certificate generated: RBI-FICN-PASS-2026-8941. Digitally signed by RBI Governor. Copied to security ledger.', { duration: 6000 })}
                    className="mt-2.5 w-full py-1.5 rounded font-mono text-[9px] tracking-widest transition-all hover:bg-emerald-950/20"
                    style={{ background: 'var(--st-success-bg)', color: 'var(--st-success)', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    GENERATE DIGITAL SECURITY CERTIFICATE
                  </button>
                ) : (
                  <button
                    onClick={() => toast.error('FIR Filed: NCR-FICN-2026-1821 registered at Connaught Place PS, New Delhi. Specimen transferred to RBI Forensic Laboratory. SBI branch manager notified.', { duration: 6000 })}
                    className="mt-2.5 w-full py-1.5 rounded font-mono text-[9px] tracking-widest transition-all hover:bg-red-950/20"
                    style={{ background: 'var(--st-classified-bg)', color: 'var(--st-danger)', border: '1px solid rgba(239,68,68,0.3)' }}
                  >
                    FILE IMMEDIATE FIR — RBI FORENSIC TRANSFER
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const getCheckData = (id: string, isGen: boolean, denom: number) => {
  const genuineList = getGenuineChecks(denom);
  const counterfeitList = getCounterfeitChecks(denom);
  return isGen 
    ? genuineList.find(c => c.id === id)! 
    : counterfeitList.find(c => c.id === id)!;
};
