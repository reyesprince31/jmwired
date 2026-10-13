export type CoverageStatus = "active" | "expanding" | "survey";

export type CoverageArea = {
  id: string;
  name: string;
  municipality: string;
  status: CoverageStatus;
  statusLabel: string;
  portsAvailable: boolean;
  estInstallTime: string;
  branchOrgId: string;
  branchName: string;
  streets: string[];
  notes: string;
};

export type BranchOffice = {
  id: string;
  name: string;
  area: string;
  address: string;
  landmark: string;
  phone: string;
  hours: string;
  services: string[];
  orgId: string;
};

export const coverageAreas: CoverageArea[] = [
  {
    id: "poblacion-proper",
    name: "Barangay Poblacion",
    municipality: "Central District",
    status: "active",
    statusLabel: "Active Fiber Coverage",
    portsAvailable: true,
    estInstallTime: "24–48 hours",
    branchOrgId: "poblacion",
    branchName: "JMWired Poblacion Branch",
    streets: [
      "Mabini Street",
      "Rizal Avenue",
      "Bonifacio Street",
      "Del Pilar Street",
      "Burgos Street",
      "Public Market Commercial Zone",
      "Zamora Street",
    ],
    notes:
      "Full aerial fiber distribution with active NAP boxes. Ready for immediate installation.",
  },
  {
    id: "san-jose-corridor",
    name: "Barangay San Jose",
    municipality: "East District",
    status: "active",
    statusLabel: "Active Fiber Coverage",
    portsAvailable: true,
    estInstallTime: "24–48 hours",
    branchOrgId: "san-jose",
    branchName: "JMWired San Jose Branch",
    streets: [
      "Purok 1 (Centro)",
      "Purok 2 (Riverside)",
      "Purok 3",
      "Purok 4",
      "Purok 5",
      "National Highway Corridor",
    ],
    notes:
      "Fully operational distribution line with high port availability across all five puroks.",
  },
  {
    id: "santa-maria-expansion",
    name: "Barangay Santa Maria",
    municipality: "North District",
    status: "expanding",
    statusLabel: "Scheduled Rollout (Q4 2026)",
    portsAvailable: false,
    estInstallTime: "Pre-registration open",
    branchOrgId: "poblacion",
    branchName: "JMWired Poblacion Branch",
    streets: [
      "Santa Maria Proper",
      "Purok Riverside",
      "North Access Road",
      "Purok 3 Substation",
    ],
    notes:
      "Primary backbone fiber splicing completed. Distribution terminal boxes are being mounted this month. Advance applications prioritize drop cable scheduling.",
  },
  {
    id: "san-isidro-survey",
    name: "Barangay San Isidro",
    municipality: "South District",
    status: "survey",
    statusLabel: "Community Demand Survey",
    portsAvailable: false,
    estInstallTime: "Pending subscriber threshold",
    branchOrgId: "san-jose",
    branchName: "JMWired San Jose Branch",
    streets: [
      "San Isidro Highway",
      "Purok Crossing",
      "Boundary Road",
      "Agrarian Resettlement Area",
    ],
    notes:
      "Currently gathering requests from homeowners and business establishments to finalize route engineering.",
  },
];

export const branchOffices: BranchOffice[] = [
  {
    id: "office-poblacion",
    name: "Poblacion Main Branch Office",
    area: "Poblacion",
    address: "12 Mabini Street, Poblacion",
    landmark: "Across from the Municipal Town Hall, next to Central Pharmacy",
    phone: "0917-555-0100 / (043) 555-0100",
    hours: "Monday to Saturday, 8:00 AM – 5:00 PM (Closed Sundays)",
    services: [
      "New connection applications & verification",
      "Cash billing payments and official receipts",
      "ONU router pickups & cable supplies",
      "Drop-in customer technical support desk",
      "Lineman dispatch headquarters",
    ],
    orgId: "poblacion",
  },
  {
    id: "office-san-jose",
    name: "San Jose Service Center",
    area: "San Jose",
    address: "24 Rizal Street, San Jose",
    landmark: "Near San Jose Elementary School, beside Barangay Hall",
    phone: "0918-555-0200 / (043) 555-0200",
    hours: "Monday to Saturday, 8:00 AM – 5:00 PM (Closed Sundays)",
    services: [
      "New connection inquiries and sign-ups",
      "In-person bill payments and account inquiries",
      "Equipment replacement and testing",
      "Local field team staging depot",
    ],
    orgId: "san-jose",
  },
];

export const installationWorkflow = [
  {
    step: "01",
    title: "Application & Line Survey",
    description:
      "Submit your form online or at our branch. Our field crew checks the optical power meter at the closest Network Access Point (NAP) box.",
  },
  {
    step: "02",
    title: "Aerial Drop Routing",
    description:
      "Trained linemen neatly route tough, outdoor-rated fiber drop cable along municipal utility poles directly into your premises.",
  },
  {
    step: "03",
    title: "Optical Splicing & ONU Setup",
    description:
      "The line is precision-spliced, tested with an optical power meter (-18 to -22 dBm target), and connected to your Wi-Fi 6 ONU gateway.",
  },
  {
    step: "04",
    title: "Speed Test & Portal Activation",
    description:
      "Our technician runs an on-site speed verification test with you and hands over your customer portal activation credentials.",
  },
];
