import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  CheckCircle2,
  Headphones,
  Languages,
  PhoneCall,
  ShieldCheck,
  Square,
  Volume2,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RESCUE_SCRIPTS, type RescueLanguage } from "@/data/rescueScripts";
import type { IncidentCase } from "@/data/incidentCases";

interface BharatRescueModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: IncidentCase;
  isLive: boolean;
}

export default function BharatRescueMode({
  open,
  onOpenChange,
  incident,
  isLive,
}: BharatRescueModeProps) {
  const [language, setLanguage] = useState<RescueLanguage>("english");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const script = RESCUE_SCRIPTS[language];
  const isComplete = completedSteps.length === script.steps.length;
  const progress = Math.round(
    (completedSteps.length / script.steps.length) * 100,
  );

  const stopSpeaking = useCallback(() => {
    const currentUtterance = utteranceRef.current;
    if (currentUtterance) {
      currentUtterance.onstart = null;
      currentUtterance.onend = null;
      currentUtterance.onerror = null;
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (open) {
      stopSpeaking();
      setCompletedSteps([]);
      setLanguage("english");
    } else {
      stopSpeaking();
    }
  }, [open, stopSpeaking]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  useEffect(() => {
    if (isComplete) {
      toast.success(
        isLive
          ? `Bharat Rescue Protocol complete: victim safe and ${incident.amountProtected} protected.`
          : `Bharat Rescue drill complete: ${incident.amountProtected} scenario fully verified.`,
        { duration: 5000 },
      );
    }
  }, [incident.amountProtected, isComplete, isLive]);

  const languageOptions = useMemo(
    () =>
      Object.entries(RESCUE_SCRIPTS) as Array<
        [RescueLanguage, (typeof RESCUE_SCRIPTS)[RescueLanguage]]
      >,
    [],
  );

  const toggleStep = (index: number) => {
    setCompletedSteps((current) =>
      current.includes(index)
        ? current.filter((step) => step !== index)
        : [...current, index].sort(),
    );
  };

  const readAloud = () => {
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      toast.error(
        "Voice playback is unavailable in this browser. The operator script remains visible.",
      );
      return;
    }
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    try {
      const utterance = new SpeechSynthesisUtterance(
        `${script.title} ${script.spokenScript}`,
      );
      utterance.lang = script.locale;
      utterance.rate = 0.92;
      utterance.onstart = () => {
        if (utteranceRef.current === utterance) {
          setIsSpeaking(true);
          toast.info(`${script.label} rescue script playing on this device.`);
        }
      };
      utterance.onend = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null;
          setIsSpeaking(false);
        }
      };
      utterance.onerror = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null;
          setIsSpeaking(false);
          toast.error(
            "Voice playback could not start. The operator script remains visible.",
          );
        }
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      stopSpeaking();
      toast.error(
        "Voice playback could not start. The operator script remains visible.",
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        data-testid="bharat-rescue-mode"
        className="w-[94vw] overflow-y-auto border-l p-0 sm:max-w-[620px] [&>button]:hidden"
        style={{
          background: "var(--st-header)",
          borderColor: "var(--st-success-border)",
        }}
      >
        <div
          className="sticky top-0 z-10 border-b px-5 py-4"
          style={{
            background: "rgba(8,13,26,0.97)",
            borderColor: "var(--st-border)",
          }}
        >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close Bharat Rescue Mode"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-white/[0.05]"
            style={{ color: "var(--st-text-muted)" }}
          >
            <X size={14} />
          </button>
          <SheetHeader className="pr-8 text-left">
            <div className="mb-2 flex flex-wrap items-center gap-2 pr-8">
              <div
                className="flex h-7 w-7 items-center justify-center rounded"
                style={{
                  background: "var(--st-success-bg)",
                  border: "1px solid var(--st-success-border)",
                }}
              >
                <ShieldCheck size={14} style={{ color: "var(--st-success)" }} />
              </div>
              <span
                className="font-mono text-[10px] tracking-[0.22em]"
                style={{ color: "var(--st-success)" }}
              >
                BHARAT RESCUE MODE · VICTIM SHIELD
              </span>
              <span
                className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[8px] tracking-widest sm:ml-auto"
                style={{
                  background: isLive
                    ? "var(--st-danger-bg)"
                    : "var(--st-accent-bg)",
                  border: `1px solid ${isLive ? "var(--st-danger-border)" : "var(--st-accent-border-mid)"}`,
                  color: isLive ? "var(--st-danger)" : "var(--st-accent)",
                }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isLive ? "animate-pulse" : ""}`}
                  style={{
                    background: isLive
                      ? "var(--st-danger)"
                      : "var(--st-accent)",
                  }}
                />
                {isLive ? "EXTRACTION WINDOW OPEN" : "RESPONSE DRILL READY"}
              </span>
            </div>
            <SheetTitle
              className="font-sans text-xl font-semibold tracking-wide"
              style={{ color: "var(--st-text-title)" }}
            >
              Multilingual Digital-Arrest Intervention
            </SheetTitle>
            <SheetDescription
              className="font-mono text-[9px] tracking-wider"
              style={{ color: "var(--st-text-muted)" }}
            >
              CASE {incident.id} ·{" "}
              {isLive
                ? "HIGH-CONFIDENCE COERCION PATTERN"
                : "FEATURED DEMO SCENARIO"}{" "}
              · HUMAN-GUIDED RESPONSE
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="space-y-4 p-5">
          <section
            className="grid grid-cols-3 gap-2"
            aria-label="Rescue operation status"
          >
            {[
              {
                label: "AMOUNT AT RISK",
                value: incident.amountAtRisk,
                color: isComplete ? "var(--st-text-muted)" : "var(--st-danger)",
              },
              {
                label: "CYBER HELPLINE",
                value: "1930",
                color: "var(--st-accent)",
              },
              {
                label: isComplete
                  ? isLive
                    ? "VICTIM STATUS"
                    : "DRILL STATUS"
                  : isLive
                    ? "RESPONSE WINDOW"
                    : "DRILL TARGET",
                value: isComplete
                  ? isLive
                    ? "SAFE"
                    : "READY"
                  : incident.responseTime,
                color: "var(--st-success)",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded p-2 text-center sm:p-3"
                style={{
                  background: "var(--st-hover-row)",
                  border: "1px solid var(--st-border-subtle)",
                }}
              >
                <div
                  className="break-words font-mono text-sm font-semibold tabular-nums sm:text-lg"
                  style={{ color: item.color }}
                >
                  {item.value}
                </div>
                <div
                  className="mt-1 font-mono text-[8px] tracking-widest"
                  style={{ color: "var(--st-text-faint)" }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </section>

          <section>
            <div className="mb-2 flex items-center gap-2">
              <Languages size={11} style={{ color: "var(--st-accent)" }} />
              <h3
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "var(--st-text-dim)" }}
              >
                OPERATOR LANGUAGE
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {languageOptions.map(([key, option]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    setLanguage(key);
                  }}
                  aria-pressed={language === key}
                  className="rounded py-2 font-mono text-[9px] font-semibold tracking-wider transition-all"
                  style={{
                    background:
                      language === key ? "var(--st-accent-bg)" : "transparent",
                    border: `1px solid ${language === key ? "var(--st-accent-border-mid)" : "var(--st-border-subtle)"}`,
                    color:
                      language === key
                        ? "var(--st-accent)"
                        : "var(--st-text-muted)",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section
            className="rounded p-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(56,189,248,0.04))",
              border: "1px solid var(--st-success-border)",
            }}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Headphones size={13} style={{ color: "var(--st-success)" }} />
                <span
                  className="font-mono text-[9px] tracking-widest"
                  style={{ color: "var(--st-success)" }}
                >
                  {isLive
                    ? "SPEAK TO THE VICTIM NOW"
                    : "OPERATOR RESPONSE SCRIPT"}
                </span>
              </div>
              <button
                type="button"
                onClick={readAloud}
                className="flex items-center gap-1.5 rounded px-2.5 py-1.5 font-mono text-[8px] tracking-widest transition-colors hover:bg-white/[0.04]"
                style={{
                  color: "var(--st-accent)",
                  border: "1px solid var(--st-accent-border-mid)",
                }}
              >
                {isSpeaking ? <Square size={9} /> : <Volume2 size={10} />}
                {isSpeaking ? "STOP AUDIO" : "READ ALOUD"}
              </button>
            </div>
            <div
              className="font-sans text-[17px] font-semibold leading-snug"
              style={{ color: "var(--st-text-title)" }}
            >
              {script.title}
            </div>
            <div
              className="mt-3 text-[12px] leading-6"
              style={{ color: "var(--st-text-body)" }}
            >
              {script.spokenScript}
            </div>
            <div
              className="mt-3 rounded px-3 py-2 text-[10px] leading-relaxed"
              style={{
                background: "rgba(0,0,0,0.18)",
                borderLeft: "2px solid var(--st-accent)",
                color: "var(--st-text-label)",
              }}
            >
              {script.reassurance}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall size={11} style={{ color: "var(--st-warning)" }} />
                <h3
                  className="font-mono text-[9px] tracking-widest"
                  style={{ color: "var(--st-text-dim)" }}
                >
                  RESCUE CHECKLIST
                </h3>
              </div>
              <span
                aria-live="polite"
                className="font-mono text-[9px] tabular-nums"
                style={{
                  color: isComplete ? "var(--st-success)" : "var(--st-warning)",
                }}
              >
                {completedSteps.length}/{script.steps.length} VERIFIED
              </span>
            </div>
            <div className="space-y-2">
              {script.steps.map((step, index) => {
                const checked = completedSteps.includes(index);
                return (
                  <button
                    key={step}
                    type="button"
                    data-testid={`rescue-step-${index}`}
                    onClick={() => toggleStep(index)}
                    aria-pressed={checked}
                    className="flex w-full items-center gap-3 rounded p-3 text-left transition-all hover:bg-white/[0.025]"
                    style={{
                      background: checked
                        ? "var(--st-success-bg)"
                        : "var(--st-panel)",
                      border: `1px solid ${checked ? "var(--st-success-border)" : "var(--st-border-subtle)"}`,
                    }}
                  >
                    <span
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-mono text-[9px]"
                      style={{
                        background: checked
                          ? "var(--st-success)"
                          : "var(--st-inactive-bg)",
                        border: `1px solid ${checked ? "var(--st-success)" : "var(--st-border)"}`,
                        color: checked
                          ? "var(--st-header)"
                          : "var(--st-text-muted)",
                      }}
                    >
                      {checked ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span
                      className="font-sans text-[11px] font-medium"
                      style={{
                        color: checked
                          ? "var(--st-text-body)"
                          : "var(--st-text-label)",
                      }}
                    >
                      {step}
                    </span>
                    {checked && (
                      <CheckCircle2
                        size={13}
                        className="ml-auto flex-shrink-0"
                        style={{ color: "var(--st-success)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section
            className="rounded p-3"
            style={{
              background: "var(--st-ticker)",
              border: "1px solid var(--st-border-subtle)",
            }}
          >
            <div className="mb-2 flex items-center justify-between font-mono text-[8px] tracking-widest">
              <span style={{ color: "var(--st-text-faint)" }}>
                RESCUE PROTOCOL COMPLETION
              </span>
              <span
                style={{
                  color: isComplete ? "var(--st-success)" : "var(--st-accent)",
                }}
              >
                {progress}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Rescue protocol completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-1.5 overflow-hidden rounded-full"
              style={{ background: "var(--st-border)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: isComplete
                    ? "var(--st-success)"
                    : "var(--st-accent)",
                }}
              />
            </div>
          </section>

          {isComplete && (
            <section
              data-testid="rescue-complete"
              role="status"
              aria-live="polite"
              className="rounded p-4 text-center fade-in"
              style={{
                background: "var(--st-success-bg)",
                border: "1px solid var(--st-success-border)",
              }}
            >
              <ShieldCheck
                size={24}
                className="mx-auto mb-2"
                style={{ color: "var(--st-success)" }}
              />
              <div
                className="font-mono text-[10px] font-semibold tracking-widest"
                style={{ color: "var(--st-success)" }}
              >
                {isLive
                  ? `VICTIM SAFE · ${incident.amountProtected} PROTECTED`
                  : `PROTOCOL READY · ${incident.amountProtected} SCENARIO VERIFIED`}
              </div>
              <div
                className="mt-1 font-mono text-[8px]"
                style={{ color: "var(--st-text-muted)" }}
              >
                {isLive
                  ? `${incident.outcome} · EVIDENCE PRESERVED`
                  : "TRAINING MODE · EVIDENCE WORKFLOW VERIFIED"}{" "}
                · CASE {incident.id}
              </div>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
