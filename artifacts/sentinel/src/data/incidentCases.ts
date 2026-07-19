export type IncidentSource =
  | "command-center"
  | "live-intercept"
  | "syndicate-graph";

export interface IncidentTimelineEvent {
  time: string;
  title: string;
  description: string;
  status: "verified" | "contained" | "active";
}

export interface IncidentEntity {
  type: string;
  label: string;
  detail: string;
  tone: "danger" | "warning" | "accent" | "success";
}

export interface IncidentCase {
  id: string;
  title: string;
  campaign: string;
  location: string;
  priority: string;
  status: string;
  confidence: string;
  responseTime: string;
  amountAtRisk: string;
  amountProtected: string;
  victim: string;
  evidenceHash: string;
  timeline: IncidentTimelineEvent[];
  entities: IncidentEntity[];
}

export const FEATURED_INCIDENT: IncidentCase = {
  id: "SENTINEL-2026-IN492",
  title: "Mewat Digital Arrest Interception",
  campaign: "Mewat Extortion Campaign 04",
  location: "Rohini Grid · New Delhi NCR",
  priority: "PRIORITY 1",
  status: "VICTIM SHIELDED",
  confidence: "98.2%",
  responseTime: "03:42",
  amountAtRisk: "₹2,50,000",
  amountProtected: "₹2,50,000",
  victim: "S. Iyer · Retired Government Employee",
  evidenceHash: "SHA256 · 4b89a1f2...c392f4e",
  timeline: [
    {
      time: "18:42:10",
      title: "Synthetic identity detected",
      description:
        "CBI impersonation and cloned-voice markers crossed the intervention threshold.",
      status: "verified",
    },
    {
      time: "18:42:24",
      title: "Victim extraction window opened",
      description:
        "Isolation and financial-coercion language confirmed a digital-arrest pattern.",
      status: "verified",
    },
    {
      time: "18:43:02",
      title: "Mule account linked",
      description:
        "HDFC account ending 9021 matched the Mewat campaign evidence graph.",
      status: "verified",
    },
    {
      time: "18:44:16",
      title: "Telecom node isolated",
      description:
        "Rohini IMSI node and the associated VoIP gateway were contained.",
      status: "contained",
    },
    {
      time: "18:45:52",
      title: "Transfer prevented",
      description:
        "The victim confirmed no funds were transferred; the rescue protocol was closed.",
      status: "contained",
    },
  ],
  entities: [
    {
      type: "ORIGIN",
      label: "VOIP GW",
      detail: "+1-829-XX · Bahrain",
      tone: "danger",
    },
    {
      type: "TARGET",
      label: "VICTIM",
      detail: "S. Iyer · Bengaluru",
      tone: "accent",
    },
    {
      type: "PAYMENT",
      label: "MULE A/C",
      detail: "HDFC ···· 9021",
      tone: "warning",
    },
    {
      type: "COMMAND",
      label: "CMD NODE",
      detail: "Mewat Sector B",
      tone: "danger",
    },
  ],
};

export const INCIDENT_SOURCE_LABELS: Record<IncidentSource, string> = {
  "command-center": "NATIONAL INCIDENT MAP",
  "live-intercept": "LIVE INTERCEPT ENGINE",
  "syndicate-graph": "SYNDICATE NETWORK GRAPH",
};
