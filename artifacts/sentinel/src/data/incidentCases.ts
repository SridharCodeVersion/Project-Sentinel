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
  outcome: string;
  summary: string;
  verifiedLinks: number;
  evidenceHash: string;
  liveInterceptSupported: boolean;
  syndicateFilter: "all" | "mewat" | "cross-border" | "jamtara";
  timeline: IncidentTimelineEvent[];
  entities: IncidentEntity[];
}

export interface HotspotCaseInput {
  id: string;
  name: string;
  state: string;
  severity: "critical" | "high" | "medium";
  vectors: number;
  voipNodes: number;
}

interface IncidentProfile {
  title: string;
  campaign: string;
  docketSuffix: string;
  amount: string;
  confidence: string;
  responseTime: string;
  victim: string;
  origin: string;
  payment: string;
  command: string;
  detection: string;
  link: string;
  containment: string;
  evidenceHash: string;
}

const INCIDENT_PROFILES: Record<string, IncidentProfile> = {
  ncr: {
    title: "NCR Digital Arrest Command Interception",
    campaign: "NCR Impersonation Cluster 07",
    docketSuffix: "NCR-4419",
    amount: "₹8,40,000",
    confidence: "99.1%",
    responseTime: "02:58",
    victim: "R. Mehta · Senior Finance Professional",
    origin: "+44-789-XX · UK VPN",
    payment: "ICICI ···· 1844",
    command: "Dwarka Relay 07",
    detection:
      "CBI impersonation and cloned-voice markers crossed the NCR intervention threshold.",
    link: "The beneficiary account matched six active NCR digital-arrest complaints.",
    containment: "The Dwarka relay and its associated SIM route were isolated.",
    evidenceHash: "SHA256 · 1ac9d740...7e20a6b",
  },
  mewat: {
    title: "Mewat Digital Arrest Interception",
    campaign: "Mewat Extortion Campaign 04",
    docketSuffix: "IN492",
    amount: "₹2,50,000",
    confidence: "98.2%",
    responseTime: "03:42",
    victim: "S. Iyer · Retired Government Employee",
    origin: "+1-829-XX · Bahrain",
    payment: "HDFC ···· 9021",
    command: "Mewat Sector B",
    detection:
      "CBI impersonation and cloned-voice markers crossed the intervention threshold.",
    link: "HDFC account ending 9021 matched the Mewat campaign evidence graph.",
    containment:
      "The Rohini IMSI node and associated VoIP gateway were isolated.",
    evidenceHash: "SHA256 · 4b89a1f2...c392f4e",
  },
  jamtara: {
    title: "Jamtara OTP Phishing Interception",
    campaign: "Jamtara Telecom Fraud Ring 12",
    docketSuffix: "JAM-7318",
    amount: "₹6,80,000",
    confidence: "97.6%",
    responseTime: "04:06",
    victim: "A. Singh · Banking Customer",
    origin: "+91-8709-XX · SIM Farm",
    payment: "SBI ···· 7741",
    command: "Jamtara Cell 12",
    detection:
      "A coordinated OTP-harvesting script matched known Jamtara voice and device signatures.",
    link: "The destination account appeared across seven linked phishing complaints.",
    containment:
      "The SIM farm burst and beneficiary relay account were blocked.",
    evidenceHash: "SHA256 · 8e27caa1...b511930",
  },
  mumbai: {
    title: "Mumbai Hawala Wire Disruption",
    campaign: "Mumbai Financial Relay 09",
    docketSuffix: "MUM-2057",
    amount: "₹14,30,000",
    confidence: "96.8%",
    responseTime: "05:14",
    victim: "K. Desai · SME Account Holder",
    origin: "+971-50-XX · Dubai Relay",
    payment: "Axis ···· 6118",
    command: "Kurla Relay 09",
    detection:
      "Transaction velocity and beneficiary reuse triggered the hawala disruption model.",
    link: "The beneficiary chain matched an active Mumbai–Dubai financial relay.",
    containment:
      "The wire instruction and downstream settlement account were frozen.",
    evidenceHash: "SHA256 · 32fd1b09...aa47c81",
  },
  bengaluru: {
    title: "Bengaluru Crypto Job-Scam Interception",
    campaign: "Tech Corridor Fraud Cluster 05",
    docketSuffix: "BLR-3186",
    amount: "₹7,00,000",
    confidence: "95.9%",
    responseTime: "04:31",
    victim: "N. Rao · Technology Professional",
    origin: "TG Bot · Offshore VPS",
    payment: "USDT ···· 4A2F",
    command: "Whitefield VPS 05",
    detection:
      "A fraudulent job task flow matched wallet and phishing-kit indicators.",
    link: "The wallet appeared in a cluster of work-from-home scam complaints.",
    containment: "The phishing host and active crypto off-ramp were isolated.",
    evidenceHash: "SHA256 · d17af0c2...9e1156a",
  },
  ahmedabad: {
    title: "Ahmedabad Investment Fraud Shield",
    campaign: "Gujarat Social Investment Ring 03",
    docketSuffix: "AMD-8264",
    amount: "₹3,20,000",
    confidence: "96.4%",
    responseTime: "04:48",
    victim: "R. Patel · Retired Bank Officer",
    origin: "Social Ad · Proxy VPS",
    payment: "Kotak ···· 3312",
    command: "Ahmedabad Node 03",
    detection:
      "Guaranteed-return language and a cloned trading portal triggered the fraud model.",
    link: "The receiving account matched the Gujarat investment-fraud evidence graph.",
    containment:
      "The payment request and cloned investment portal were disabled.",
    evidenceHash: "SHA256 · 61cc302e...f94b821",
  },
  hyderabad: {
    title: "Hyderabad BPO Impersonation Takedown",
    campaign: "Madhapur Call-Centre Cluster 08",
    docketSuffix: "HYD-6403",
    amount: "₹4,60,000",
    confidence: "94.7%",
    responseTime: "05:22",
    victim: "P. Reddy · Private-Sector Employee",
    origin: "SIP Trunk · Cloud PBX",
    payment: "UPI ···· 4088",
    command: "Madhapur Node 08",
    detection:
      "A coordinated bank-support impersonation flow crossed the surveillance threshold.",
    link: "The UPI handle linked back to an active call-centre fraud cluster.",
    containment:
      "The cloud PBX route and beneficiary UPI handle were suspended.",
    evidenceHash: "SHA256 · b55c1de8...0217ca4",
  },
  "cross-border": {
    title: "Cross-Border Crypto Relay Disruption",
    campaign: "Cross-Border Crypto Footprint 11",
    docketSuffix: "XBR-5011",
    amount: "₹24,80,000",
    confidence: "97.2%",
    responseTime: "06:08",
    victim: "Multi-State Victim Cluster · 11 Linked Complaints",
    origin: "+44-789-XX · UK VPN",
    payment: "USDT ···· 4A2F",
    command: "Dubai Relay 11",
    detection:
      "Wallet reuse and international VoIP coordination exposed a cross-border extraction route.",
    link: "The wallet and hawala settlement agent matched eleven linked complaints.",
    containment:
      "The crypto off-ramp was flagged and the international relay was escalated.",
    evidenceHash: "SHA256 · 95af801b...4d12e70",
  },
};

const FALLBACK_PROFILE = INCIDENT_PROFILES.ncr;

export function createIncidentFromHotspot(
  hotspot: HotspotCaseInput,
): IncidentCase {
  const profile = INCIDENT_PROFILES[hotspot.id] ?? FALLBACK_PROFILE;
  const priority =
    hotspot.severity === "critical"
      ? "PRIORITY 1"
      : hotspot.severity === "high"
        ? "PRIORITY 2"
        : "PRIORITY 3";

  return {
    id: `SENTINEL-2026-${profile.docketSuffix}`,
    title: profile.title,
    campaign: profile.campaign,
    location: `${hotspot.name} Grid · ${hotspot.state}`,
    priority,
    status: "VICTIM SHIELDED",
    confidence: profile.confidence,
    responseTime: profile.responseTime,
    amountAtRisk: profile.amount,
    amountProtected: profile.amount,
    victim: profile.victim,
    outcome: "ZERO FUNDS TRANSFERRED",
    summary: `${profile.victim}. The threat origin, payment destination, and command infrastructure are linked under this verified docket.`,
    verifiedLinks: 4,
    evidenceHash: profile.evidenceHash,
    liveInterceptSupported: hotspot.id === "mewat",
    syndicateFilter:
      hotspot.id === "mewat"
        ? "mewat"
        : hotspot.id === "jamtara"
          ? "jamtara"
          : hotspot.id === "mumbai" || hotspot.id === "bengaluru"
            ? "cross-border"
            : "all",
    timeline: [
      {
        time: "18:42:10",
        title: "Cross-signal threat detected",
        description: profile.detection,
        status: "verified",
      },
      {
        time: "18:42:24",
        title: "Victim extraction window opened",
        description: `${hotspot.vectors} active vectors were correlated across the ${hotspot.name} grid.`,
        status: "verified",
      },
      {
        time: "18:43:02",
        title: "Payment destination linked",
        description: profile.link,
        status: "verified",
      },
      {
        time: "18:44:16",
        title: "Threat infrastructure isolated",
        description: `${profile.containment} ${hotspot.voipNodes} VoIP nodes remain under monitoring.`,
        status: "contained",
      },
      {
        time: "18:45:52",
        title: "Transfer prevented",
        description:
          "The victim confirmed no funds were transferred; evidence was preserved under the unified docket.",
        status: "contained",
      },
    ],
    entities: [
      {
        type: "ORIGIN",
        label: "THREAT GW",
        detail: profile.origin,
        tone: "danger",
      },
      {
        type: "TARGET",
        label: "VICTIM",
        detail: profile.victim,
        tone: "accent",
      },
      {
        type: "PAYMENT",
        label: "DESTINATION",
        detail: profile.payment,
        tone: "warning",
      },
      {
        type: "COMMAND",
        label: "CMD NODE",
        detail: profile.command,
        tone: "danger",
      },
    ],
  };
}

export const FEATURED_INCIDENT = createIncidentFromHotspot({
  id: "mewat",
  name: "Rohini",
  state: "New Delhi NCR",
  severity: "critical",
  vectors: 42,
  voipNodes: 12,
});

export const GRAPH_INCIDENTS = {
  mewat: FEATURED_INCIDENT,
  jamtara: createIncidentFromHotspot({
    id: "jamtara",
    name: "Jamtara",
    state: "Jharkhand",
    severity: "critical",
    vectors: 38,
    voipNodes: 9,
  }),
  "cross-border": createIncidentFromHotspot({
    id: "cross-border",
    name: "International Relay",
    state: "Cross-Border Coordination",
    severity: "critical",
    vectors: 27,
    voipNodes: 6,
  }),
} as const;

export const INCIDENT_SOURCE_LABELS: Record<IncidentSource, string> = {
  "command-center": "NATIONAL INCIDENT MAP",
  "live-intercept": "LIVE INTERCEPT ENGINE",
  "syndicate-graph": "SYNDICATE NETWORK GRAPH",
};
