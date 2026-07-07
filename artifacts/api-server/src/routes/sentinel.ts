/**
 * PROJECT SENTINEL — Live Data Engine
 * Serves /api/hotspots and /api/ledger with an in-memory store
 * that self-mutates every 5 seconds via a background interval.
 */

import { Router, type IRouter } from "express";

const router: IRouter = Router();

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */

interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  severity: "critical" | "high" | "medium";
  vectors: number;
  voipNodes: number;
  arrests: number;
  firs: number;
  description: string;
  state: string;
}

interface LedgerEntry {
  id: string;
  time: string;       // HH:MM:SS IST
  message: string;
  color: string;      // hex – matches severity palette
}

/* ─────────────────────────────────────────────────────────────────
   IST timestamp helper (server-derived)
───────────────────────────────────────────────────────────────── */

function getIST(): string {
  return new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* ─────────────────────────────────────────────────────────────────
   In-memory Hotspot Store
───────────────────────────────────────────────────────────────── */

const hotspots: Hotspot[] = [
  {
    id: "ncr",
    name: "NCR Delhi",
    x: 193,
    y: 133,
    severity: "critical",
    state: "Delhi",
    vectors: 56,
    voipNodes: 18,
    arrests: 62,
    firs: 189,
    description:
      "NCR Sector represents the highest density cybercrime zone. Multiple active digital arrest scam cells operating from residential areas in Dwarka, Rohini, and Gurugram sectors. I4C has designated this a Priority-1 intervention zone.",
  },
  {
    id: "mewat",
    name: "Mewat",
    x: 178,
    y: 148,
    severity: "critical",
    state: "Haryana",
    vectors: 42,
    voipNodes: 12,
    arrests: 31,
    firs: 87,
    description:
      "Mewat Grid Sector B is a primary extortion hub utilizing SIM farms and VoIP spoofing networks targeting senior citizens and government employees across NCR, Punjab, and Rajasthan. IMSI analysis confirms 12 active VoIP routing nodes.",
  },
  {
    id: "jamtara",
    name: "Jamtara",
    x: 278,
    y: 233,
    severity: "critical",
    state: "Jharkhand",
    vectors: 38,
    voipNodes: 9,
    arrests: 44,
    firs: 112,
    description:
      "Jamtara Sector operates as a sophisticated phishing coordination center. Multiple youth-led cells operate from rural areas with high-speed internet, targeting OTP theft from banking customers. Known links to inter-state syndicate chains.",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    x: 128,
    y: 278,
    severity: "high",
    state: "Maharashtra",
    vectors: 31,
    voipNodes: 8,
    arrests: 27,
    firs: 73,
    description:
      "Mumbai financial center faces coordinated hawala network operations and FICN circulation through Dharavi and Kurla sectors. SBI and HDFC branch alerts active. ₹14.3 Cr in suspicious wire transfers under CBI investigation.",
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    x: 210,
    y: 352,
    severity: "high",
    state: "Karnataka",
    vectors: 19,
    voipNodes: 5,
    arrests: 14,
    firs: 41,
    description:
      "Bengaluru tech corridor sees high-volume crypto fraud and work-from-home scam operations. Educated perpetrators leverage coding skills for sophisticated phishing kits. CERT-In monitoring 5 active darknet marketplaces.",
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    x: 108,
    y: 207,
    severity: "high",
    state: "Gujarat",
    vectors: 24,
    voipNodes: 7,
    arrests: 19,
    firs: 54,
    description:
      "Ahmedabad cluster specializes in investment fraud and Ponzi schemes via social media platforms. Recent surge in fake FD scheme fraud targeting retired government employees. FIU-IND tracking ₹8.2 Cr in suspicious transactions.",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    x: 233,
    y: 298,
    severity: "medium",
    state: "Telangana",
    vectors: 16,
    voipNodes: 4,
    arrests: 11,
    firs: 28,
    description:
      "Hyderabad cluster identified for tech-enabled fraud leveraging BPO infrastructure. Call center fraud operations intercepted in Madhapur SEZ zone. Coordination with Cyber Crime Station ongoing.",
  },
];

/* ─────────────────────────────────────────────────────────────────
   In-memory Ledger Store (rolling 50, serve latest 10)
───────────────────────────────────────────────────────────────── */

const LEDGER_TEMPLATES = [
  {
    color: "#EF4444",
    prefix: "FICN ALERT",
    messages: [
      "Counterfeit ₹500 note (Serial: 5AA 123456) flagged at SBI Connaught Place Branch, New Delhi. Referred to RBI Forensic Cell.",
      "Counterfeit ₹2000 note detected at HDFC Bank, Chandni Chowk. Batch serial mismatch confirmed. RBI circuit alert dispatched.",
      "FICN batch (₹500 × 14) seized from courier at Indira Gandhi International Airport. Customs & BCAS alerted.",
      "PNB Lajpat Nagar reports 3 counterfeit notes in morning cash bundle. Forensic referral filed under FICN Act.",
    ],
  },
  {
    color: "#EF4444",
    prefix: "DIGITAL ARREST",
    messages: [
      "Victim R. Mehta (Noida) prevented from ₹8,40,000 transfer to fraudster posing as CBI officer. Sentinel AI alert triggered.",
      "Senior citizen S. Iyer (Bengaluru, 72) rescued from 48-hour 'digital arrest' extortion. Perpetrator IP traced to Mewat cluster.",
      "Retired schoolteacher A. Yadav (Bhopal) targeted — ₹3,20,000 saved. SIM block order issued to TRAI.",
      "Government employee P. Sharma (Gurugram) prevented from ₹12,50,000 NEFT to mule account flagged by I4C.",
    ],
  },
  {
    color: "#F59E0B",
    prefix: "VOIP INTERCEPTION",
    messages: [
      "International VoIP call (+1-829-XX) traced to Mewat grid node. IMSI captured. TRAI notified for SIM deactivation.",
      "Active VoIP call spoofing CBI officer identity intercepted in Gurugram. AI voice clone probability: 96.1%.",
      "Spoofed call (+44-789-XX) mimicking ED official origin traced to Bahrain VoIP node. Coordination with Interpol initiated.",
      "VoIP burst of 340 simultaneous calls from Jamtara cluster intercepted by TSP monitoring. IMSI blanket block applied.",
    ],
  },
  {
    color: "#F59E0B",
    prefix: "WIRE DISRUPTION",
    messages: [
      "74-minute extortion ring frozen in Mumbai. Cyber Cell dispatched. Asset tracking FIR filed at Dharavi PS.",
      "₹4,50,000 mule transfer (HDFC → Paytm → crypto) frozen via I4C emergency freeze order. Beneficiary in custody.",
      "Suspicious NEFT chain (SBI Jamtara → 7 relay accounts) blocked. ₹6,80,000 returned to victim. FIU-IND SAR filed.",
      "Hawala route (₹24,80,000) disrupted between Mumbai and Dubai via coordinated ED + NCB operation.",
    ],
  },
  {
    color: "#38BDF8",
    prefix: "NCRB SYNC",
    messages: [
      "14 new FIRs uploaded to National Cybercrime Reporting Portal. Cross-state linkage analysis complete. 3 inter-state syndicate matches.",
      "NCRB data refresh complete. 847 new cyber threat vectors indexed from 22 state police feeds.",
      "FIU-IND financial intelligence report ingested. 12 suspicious SARs flagged for enforcement review.",
      "I4C database sync complete. 3 new syndicate clusters identified via graph correlation engine.",
    ],
  },
  {
    color: "#10B981",
    prefix: "ENFORCEMENT ACTION",
    messages: [
      "Arrest confirmed: 2 suspects (Mewat ring) taken into custody by Cyber Crime Branch, Gurugram. Devices seized.",
      "Court-ordered asset freeze executed: ₹8.2 Cr across 14 bank accounts linked to Jamtara syndicate. PMLA proceedings initiated.",
      "Bengaluru Cyber Crime Station arrests 4 in darknet marketplace sting. Crypto wallet seized: ₹1.1 Cr equivalent.",
      "CBI files chargesheet in NCR digital arrest case. 6 accused identified. Trial court hearing scheduled.",
    ],
  },
];

const INDIAN_SERIALS = [
  "INC-2026-04921",
  "FIR-2026-08841",
  "CYB-2026-07321",
  "NCR-FICN-2026-1821",
  "SENT-2026-NCR-4419",
];

const ledger: LedgerEntry[] = [
  {
    id: "seed-1",
    time: "18:52:10",
    color: "#EF4444",
    message:
      "FICN ALERT: Counterfeit ₹500 note (Serial: 5AA 123456) flagged at SBI Connaught Place Branch, New Delhi. Referred to RBI Forensic Cell.",
  },
  {
    id: "seed-2",
    time: "18:50:32",
    color: "#F59E0B",
    message:
      "WIRE DISRUPTION: 74-minute extortion ring frozen in Mumbai. Cyber Cell dispatched. Asset tracking FIR filed at Dharavi PS.",
  },
  {
    id: "seed-3",
    time: "18:48:01",
    color: "#F59E0B",
    message:
      "VOIP INTERCEPTION: International VoIP call (+1-829-XX) traced to Mewat grid node. IMSI captured. TRAI notified for SIM deactivation.",
  },
  {
    id: "seed-4",
    time: "18:45:44",
    color: "#EF4444",
    message:
      "DIGITAL ARREST: Victim R. Mehta (Noida) prevented from ₹8,40,000 transfer. Sentinel AI alert triggered. CBI coordination active.",
  },
  {
    id: "seed-5",
    time: "18:43:22",
    color: "#38BDF8",
    message:
      "NCRB SYNC: 14 new FIRs uploaded to National Cybercrime Reporting Portal. Cross-state linkage analysis complete. 3 inter-state syndicate matches.",
  },
];

/* ─────────────────────────────────────────────────────────────────
   Utility: clamp a number within [min, max]
───────────────────────────────────────────────────────────────── */

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/* ─────────────────────────────────────────────────────────────────
   Background Mutation Engine — runs every 5 seconds
───────────────────────────────────────────────────────────────── */

setInterval(() => {
  // Fluctuate metrics on each hotspot
  for (const hs of hotspots) {
    const vectorDelta = Math.floor(Math.random() * 7) - 3; // ±3
    const voipDelta = Math.random() < 0.35 ? (Math.random() < 0.5 ? 1 : -1) : 0; // ±1 occasionally

    hs.vectors = clamp(hs.vectors + vectorDelta, 5, 120);
    hs.voipNodes = clamp(hs.voipNodes + voipDelta, 1, 30);

    // Small random walk for arrests/FIRs (arrests only go up, rarely)
    if (Math.random() < 0.08) hs.arrests += 1;
    if (Math.random() < 0.18) hs.firs += 1;
  }

  // Generate new ledger entry
  const template =
    LEDGER_TEMPLATES[Math.floor(Math.random() * LEDGER_TEMPLATES.length)];
  const message =
    template.messages[Math.floor(Math.random() * template.messages.length)];
  const serial =
    INDIAN_SERIALS[Math.floor(Math.random() * INDIAN_SERIALS.length)];

  const entry: LedgerEntry = {
    id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time: getIST(),
    color: template.color,
    message: `${template.prefix}: ${message} [REF: ${serial}]`,
  };

  // Prepend and cap at 50
  ledger.unshift(entry);
  if (ledger.length > 50) ledger.length = 50;
}, 5000);

/* ─────────────────────────────────────────────────────────────────
   REST Endpoints
───────────────────────────────────────────────────────────────── */

// Copy of dataset for real-time mutations
const EXTORTION_CAMPAIGNS = {
  all: {
    nodes: [
      { id: "n1", label: "Target: R. Patel", sub: "Ahmedabad | ₹3,20,000", type: "TARGET", x: 350, y: 380 },
      { id: "n2", label: "Target: S. Iyer", sub: "Bengaluru | ₹7,00,000", type: "TARGET", x: 450, y: 720 },
      { id: "n3", label: "CMD IP", sub: "103.22.XX.XX (Kolkata)", type: "CMD_IP", x: 470, y: 280 },
      { id: "n4", label: "CMD NODE", sub: "Mewat Sector B", type: "CMD_NODE", x: 550, y: 420 },
      { id: "n5", label: "VOIP GW", sub: "+1-829-XX (Bahrain)", type: "VOIP_GW", x: 440, y: 520 },
      { id: "n6", label: "VOIP GW", sub: "+44-789-XX (UK VPN)", type: "VOIP_GW", x: 650, y: 310 },
      { id: "n7", label: "Mule Acc: Paytm", sub: "Paytm #3312 | ₹1,20,000", type: "MULE", x: 720, y: 450 },
      { id: "n8", label: "Mule Acc: HDFC", sub: "HDFC #9021 | ₹4,50,000", type: "MULE", x: 650, y: 600 },
      { id: "n9", label: "Mule Acc: SBI", sub: "SBI #7741 | ₹2,80,000", type: "MULE", x: 670, y: 720 },
      { id: "n10", label: "Crypto Wallet", sub: "bc1qxx...4a2f | ₹12,40,000", type: "CRYPTO", x: 790, y: 640 },
      { id: "n11", label: "Hawala Agent", sub: "M. Khan, Dubai | ₹24,80,000", type: "HAWALA", x: 830, y: 390 }
    ],
    edges: [
      { from: "n3", to: "n4", label: "SCAM CHANNEL" },
      { from: "n4", to: "n1", label: "ROUTED: ₹3,20,000" },
      { from: "n5", to: "n2", label: "SCAM CALL" },
      { from: "n4", to: "n5", label: "DIRECTIVE" },
      { from: "n3", to: "n6", label: "COORDINATION" },
      { from: "n6", to: "n7", label: "COORDINATION" },
      { from: "n4", to: "n8", label: "DIRECTIVE" },
      { from: "n2", to: "n8", label: "ROUTED: ₹4,50,000" },
      { from: "n2", to: "n9", label: "ROUTED: ₹2,80,000" },
      { from: "n8", to: "n10", label: "LAYERING" },
      { from: "n7", to: "n10", label: "LAYERING" },
      { from: "n10", to: "n11", label: "EXTRACTION" }
    ]
  }
};

// In-memory state tracking for dynamic values
const liveSyndicateData = JSON.parse(JSON.stringify(EXTORTION_CAMPAIGNS));
const rawExposure = {
  n1: 320000,
  n2: 700000,
  n7: 120000,
  n8: 450000,
  n9: 280000,
  n10: 1240000,
  n11: 2480000
};

let telemetryActiveNodes = 11;
let telemetryActiveEdges = 12;

// Background loop executing every 6 seconds to mutate values
setInterval(() => {
  // 1. Slightly increment financial exposures
  rawExposure.n1 += Math.floor(Math.random() * 4000) + 1000;
  rawExposure.n2 += Math.floor(Math.random() * 8000) + 2000;
  rawExposure.n7 += Math.floor(Math.random() * 2000) + 500;
  rawExposure.n8 += Math.floor(Math.random() * 5000) + 1500;
  rawExposure.n9 += Math.floor(Math.random() * 3000) + 1000;
  rawExposure.n10 += Math.floor(Math.random() * 12000) + 4000;
  rawExposure.n11 += Math.floor(Math.random() * 20000) + 7000;

  // 2. Rotate simulated crypto hash string suffix
  const hashChars = "0123456789abcdef";
  let randomHashPart = "";
  for (let i = 0; i < 4; i++) {
    randomHashPart += hashChars[Math.floor(Math.random() * 16)];
  }

  // Update nodes in-memory mapping
  liveSyndicateData.all.nodes = liveSyndicateData.all.nodes.map((node: any) => {
    switch (node.id) {
      case "n1":
        node.sub = `Ahmedabad | ₹${rawExposure.n1.toLocaleString("en-IN")}`;
        break;
      case "n2":
        node.sub = `Bengaluru | ₹${rawExposure.n2.toLocaleString("en-IN")}`;
        break;
      case "n7":
        node.sub = `Paytm #3312 | ₹${rawExposure.n7.toLocaleString("en-IN")}`;
        break;
      case "n8":
        node.sub = `HDFC #9021 | ₹${rawExposure.n8.toLocaleString("en-IN")}`;
        break;
      case "n9":
        node.sub = `SBI #7741 | ₹${rawExposure.n9.toLocaleString("en-IN")}`;
        break;
      case "n10":
        node.sub = `bc1qxx...${randomHashPart} | ₹${rawExposure.n10.toLocaleString("en-IN")}`;
        break;
      case "n11":
        node.sub = `M. Khan, Dubai | ₹${rawExposure.n11.toLocaleString("en-IN")}`;
        break;
      default:
        break;
    }
    return node;
  });

  // Update edge labels matching exposure values
  liveSyndicateData.all.edges = liveSyndicateData.all.edges.map((edge: any) => {
    if (edge.from === "n4" && edge.to === "n1") {
      edge.label = `ROUTED: ₹${rawExposure.n1.toLocaleString("en-IN")}`;
    } else if (edge.from === "n2" && edge.to === "n8") {
      edge.label = `ROUTED: ₹${rawExposure.n8.toLocaleString("en-IN")}`;
    } else if (edge.from === "n2" && edge.to === "n9") {
      edge.label = `ROUTED: ₹${rawExposure.n9.toLocaleString("en-IN")}`;
    }
    return edge;
  });

  // 3. Fluctuated active node and edge telemetry
  // Varies between 10-11 nodes and 11-12 edges mapped
  telemetryActiveNodes = Math.random() > 0.35 ? 11 : 10;
  telemetryActiveEdges = Math.random() > 0.35 ? 12 : 11;
}, 6000);

/**
 * GET /api/hotspots
 * Returns the live hotspot array with up-to-the-second metrics.
 */
router.get("/hotspots", (_req, res) => {
  res.json({
    timestamp: getIST(),
    data: hotspots,
  });
});

/**
 * GET /api/ledger
 * Returns the latest 10 intelligence ledger entries.
 */
router.get("/ledger", (_req, res) => {
  res.json({
    timestamp: getIST(),
    data: ledger.slice(0, 10),
  });
});

/**
 * GET /api/syndicate
 * Unauthenticated endpoint returning complete node-and-edge mapping and telemetry metrics.
 */
router.get("/syndicate", (_req, res) => {
  res.json({
    timestamp: getIST(),
    nodes: liveSyndicateData.all.nodes,
    edges: liveSyndicateData.all.edges,
    telemetry: {
      nodesCount: liveSyndicateData.all.nodes.length,
      edgesCount: liveSyndicateData.all.edges.length,
      status: `${telemetryActiveNodes} NODES • ${telemetryActiveEdges} EDGES MAPPED`
    }
  });
});

export default router;
