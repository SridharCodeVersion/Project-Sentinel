import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock3,
  Copy,
  Fingerprint,
  IndianRupee,
  MapPin,
  Network,
  Radio,
  ShieldCheck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIncidentCase } from "@/contexts/IncidentCaseContext";
import {
  INCIDENT_SOURCE_LABELS,
  type IncidentEntity,
} from "@/data/incidentCases";

const ENTITY_ICONS = [Radio, UserRound, WalletCards, Network];

const TONE_COLOR: Record<IncidentEntity["tone"], string> = {
  danger: "var(--st-danger)",
  warning: "var(--st-warning)",
  accent: "var(--st-accent)",
  success: "var(--st-success)",
};

export default function Incident360Drawer() {
  const [, navigate] = useLocation();
  const { incident, source, isOpen, setIsOpen } = useIncidentCase();

  const navigateTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const copyDocketId = async () => {
    try {
      await navigator.clipboard.writeText(incident.id);
      toast.success(`Docket ${incident.id} copied to the secure clipboard.`);
    } catch {
      toast.error(
        "Secure clipboard unavailable. Docket ID remains visible in the case header.",
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        data-testid="incident-360-drawer"
        className="w-[94vw] overflow-y-auto border-l p-0 sm:max-w-[590px] [&>button]:hidden"
        style={{
          background: "var(--st-header)",
          borderColor: "var(--st-accent-border-mid)",
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
            onClick={() => setIsOpen(false)}
            aria-label="Close Incident 360"
            className="absolute right-4 top-4 rounded p-1.5 transition-colors hover:bg-white/[0.05]"
            style={{ color: "var(--st-text-muted)" }}
          >
            <X size={14} />
          </button>
          <SheetHeader className="pr-8 text-left">
            <div className="mb-2 flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded"
                style={{
                  background: "var(--st-accent-bg)",
                  border: "1px solid var(--st-accent-border-mid)",
                }}
              >
                <Fingerprint size={14} style={{ color: "var(--st-accent)" }} />
              </div>
              <span
                className="font-mono text-[10px] tracking-[0.22em]"
                style={{ color: "var(--st-accent)" }}
              >
                INCIDENT 360 · UNIFIED CASE VIEW
              </span>
              <span
                className="ml-auto rounded px-2 py-1 font-mono text-[8px] tracking-widest"
                style={{
                  background: "var(--st-danger-bg)",
                  border: "1px solid var(--st-danger-border)",
                  color: "var(--st-danger)",
                }}
              >
                {incident.priority}
              </span>
            </div>
            <SheetTitle
              className="font-sans text-xl font-semibold tracking-wide"
              style={{ color: "var(--st-text-title)" }}
            >
              {incident.title}
            </SheetTitle>
            <SheetDescription asChild>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[9px]">
                <span style={{ color: "var(--st-accent)" }}>{incident.id}</span>
                <span
                  className="flex items-center gap-1"
                  style={{ color: "var(--st-text-muted)" }}
                >
                  <MapPin size={9} /> {incident.location}
                </span>
                <span style={{ color: "var(--st-text-faint)" }}>
                  OPENED FROM: {INCIDENT_SOURCE_LABELS[source]}
                </span>
              </div>
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="space-y-4 p-5">
          <section
            className="grid grid-cols-4 gap-2"
            aria-label="Case impact summary"
          >
            {[
              {
                label: "AT RISK",
                value: incident.amountAtRisk,
                icon: IndianRupee,
                color: "var(--st-danger)",
              },
              {
                label: "PROTECTED",
                value: incident.amountProtected,
                icon: ShieldCheck,
                color: "var(--st-success)",
              },
              {
                label: "RESPONSE",
                value: incident.responseTime,
                icon: Clock3,
                color: "var(--st-warning)",
              },
              {
                label: "CONFIDENCE",
                value: incident.confidence,
                icon: Activity,
                color: "var(--st-accent)",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded p-2.5"
                style={{
                  background: "var(--st-hover-row)",
                  border: "1px solid var(--st-border-subtle)",
                }}
              >
                <Icon size={11} className="mb-2" style={{ color }} />
                <div
                  className="font-mono text-[12px] font-semibold tabular-nums"
                  style={{ color }}
                >
                  {value}
                </div>
                <div
                  className="mt-1 font-mono text-[7px] tracking-widest"
                  style={{ color: "var(--st-text-faint)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </section>

          <section
            className="rounded p-3"
            style={{
              background: "var(--st-success-bg)",
              border: "1px solid var(--st-success-border)",
            }}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "var(--st-success)" }}
              />
              <div>
                <div
                  className="font-mono text-[10px] font-semibold tracking-widest"
                  style={{ color: "var(--st-success)" }}
                >
                  {incident.status} · ZERO FUNDS TRANSFERRED
                </div>
                <div
                  className="mt-1 text-[10px] leading-relaxed"
                  style={{ color: "var(--st-text-muted)" }}
                >
                  {incident.victim}. The threat channel, payment destination,
                  and command infrastructure are linked under one verified
                  docket.
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "var(--st-text-dim)" }}
              >
                CROSS-SIGNAL ENTITY CHAIN
              </h3>
              <span
                className="font-mono text-[8px]"
                style={{ color: "var(--st-success)" }}
              >
                4/4 LINKS VERIFIED
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {incident.entities.map((entity, index) => {
                const Icon = ENTITY_ICONS[index] ?? CircleDot;
                const color = TONE_COLOR[entity.tone];
                return (
                  <div
                    key={entity.type}
                    className="relative rounded p-2 text-center"
                    style={{
                      background: "var(--st-panel)",
                      border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
                    }}
                  >
                    {index < incident.entities.length - 1 && (
                      <ArrowRight
                        size={10}
                        className="absolute -right-2 top-1/2 z-10 -translate-y-1/2"
                        style={{ color: "var(--st-text-dim)" }}
                      />
                    )}
                    <Icon
                      size={13}
                      className="mx-auto mb-1.5"
                      style={{ color }}
                    />
                    <div
                      className="font-mono text-[7px] tracking-widest"
                      style={{ color: "var(--st-text-faint)" }}
                    >
                      {entity.type}
                    </div>
                    <div
                      className="mt-1 font-mono text-[9px] font-semibold"
                      style={{ color }}
                    >
                      {entity.label}
                    </div>
                    <div
                      className="mt-0.5 truncate font-mono text-[7px]"
                      title={entity.detail}
                      style={{ color: "var(--st-text-muted)" }}
                    >
                      {entity.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3
                className="font-mono text-[9px] tracking-widest"
                style={{ color: "var(--st-text-dim)" }}
              >
                INTERVENTION TIMELINE
              </h3>
              <span
                className="font-mono text-[8px]"
                style={{ color: "var(--st-text-faint)" }}
              >
                {incident.campaign}
              </span>
            </div>
            <div
              className="rounded px-3 py-2"
              style={{
                background: "var(--st-ticker)",
                border: "1px solid var(--st-border-subtle)",
              }}
            >
              {incident.timeline.map((event, index) => {
                const isContained = event.status === "contained";
                const color = isContained
                  ? "var(--st-success)"
                  : "var(--st-accent)";
                return (
                  <div
                    key={`${event.time}-${event.title}`}
                    className="relative flex gap-3 pb-3 last:pb-0"
                  >
                    {index < incident.timeline.length - 1 && (
                      <div
                        className="absolute left-[4px] top-3 h-full w-px"
                        style={{ background: "var(--st-border)" }}
                      />
                    )}
                    <CheckCircle2
                      size={10}
                      className="relative z-[1] mt-1 flex-shrink-0"
                      style={{ color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="font-mono text-[9px] font-semibold"
                          style={{ color: "var(--st-text-label)" }}
                        >
                          {event.title}
                        </span>
                        <span
                          className="font-mono text-[8px] tabular-nums"
                          style={{ color }}
                        >
                          {event.time}
                        </span>
                      </div>
                      <div
                        className="mt-0.5 text-[9px] leading-relaxed"
                        style={{ color: "var(--st-text-muted)" }}
                      >
                        {event.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section
            className="flex items-center justify-between rounded px-3 py-2"
            style={{
              background: "var(--st-panel)",
              border: "1px solid var(--st-border-subtle)",
            }}
          >
            <div>
              <div
                className="font-mono text-[8px] tracking-widest"
                style={{ color: "var(--st-text-faint)" }}
              >
                CHAIN-OF-CUSTODY
              </div>
              <div
                className="mt-1 font-mono text-[9px]"
                style={{ color: "var(--st-success)" }}
              >
                {incident.evidenceHash}
              </div>
            </div>
            <button
              type="button"
              onClick={copyDocketId}
              aria-label="Copy incident docket ID"
              className="flex items-center gap-1.5 rounded px-2.5 py-1.5 font-mono text-[8px] tracking-widest transition-colors hover:bg-white/[0.04]"
              style={{
                color: "var(--st-accent)",
                border: "1px solid var(--st-accent-border-mid)",
              }}
            >
              <Copy size={9} /> COPY DOCKET
            </button>
          </section>

          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              type="button"
              onClick={() => navigateTo("/intercept")}
              className="flex items-center justify-center gap-2 rounded py-2.5 font-mono text-[9px] tracking-widest transition-all hover:brightness-125"
              style={{
                background: "var(--st-danger-bg)",
                border: "1px solid var(--st-danger-border)",
                color: "var(--st-danger)",
              }}
            >
              <Radio size={11} /> OPEN LIVE INTERCEPT
            </button>
            <button
              type="button"
              onClick={() => navigateTo("/syndicate")}
              className="flex items-center justify-center gap-2 rounded py-2.5 font-mono text-[9px] tracking-widest transition-all hover:brightness-125"
              style={{
                background: "var(--st-accent-bg)",
                border: "1px solid var(--st-accent-border-mid)",
                color: "var(--st-accent)",
              }}
            >
              <Network size={11} /> TRACE SYNDICATE
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
