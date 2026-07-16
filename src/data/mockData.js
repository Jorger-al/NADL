export const databaseRecords = [
  {
    id: "PT-CAS-1502",
    vessel: "Nossa Senhora dos Mártires",
    location: "Cascais Site B",
    epoch: "1606 (Empire)",
    materials: ["Timber", "Porcelain"],
    depth: "12.5m",
    archive: "ANTT - India Run Vol. IV",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA69zM8ustKvuQykDclpoxHR1VfjNohe1HMmmLcXVn9OSTpgzTz7q3pOBHaAK7O5Ecip8ScmVH546B0TyV1UHw6gYgF_LySGspIKobsrtdHNX36ofKZWxLP0BSokiw-IiqKRxZIum1m1MH613sRbG7zWYBaVRoHHrPktmy6roR9qhntYWxE6c5jP8w-T7G2-vG30XEn70MELpX1nIPyqpd2Z6neclHvmCKw6xtXOXvqQ6ZEeqRRpsquO8qxISihVGCu_sDjqOTlW9A",
  },
  {
    id: "PT-SAG-1740",
    vessel: "Sagres Iron Frigate",
    location: "Cabo de S. Vicente",
    epoch: "18th Century",
    materials: ["Iron", "Bronze"],
    depth: "38.0m",
    archive: "Naval History Museum",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk45gWz7H7K9YwNb-JJItav4Tlu3uzbyKgG0tUgNVthzb3jawZMMgJ15TCu_HXMyfUr8xJf2pFPvenInAAQFddunx1KxyZ_fBrjGVN_0ijPMbk2lOKesfirTeK4WXTCrqlM-8ONip-Pi6k6fLV7HkDVtEjEtqEp-nDiqv76ezSM0EdHw1bDsESbNECs5JZiBGSTGFLO_MYJbHAm2ch9bsFcSXhYV4n6TeAQWUU7jiHGwy9BdCyGih_0XCWbv3cvo3r3g50KgE3Nss",
  },
  {
    id: "PT-TER-1583",
    vessel: "Angra D Shipwreck",
    location: "Terceira, Azores",
    epoch: "Late 16th Century",
    materials: ["Oak", "Lead"],
    depth: "22.0m",
    archive: "Angra Municipal Archive",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdRwrHj061G_nrpv4BT9FCXM5OuA-ffgkAL631QieeFmbuf7uEf15MCBb0B0hqKW6R-R73VOY71sJLpOBVvVGif42zGTfjsg8_lYkJxQr-apGxEPqHHma-p5Ig21CvaxifHLz0eJjjyt7CXdOCG01GWZLPBLhth5TWCjqObmA9uMiQcjABfEuWD8-Z_bZFHZs5ysJ3mXwSqkMplxu2upVjI59VDLMNqExe0-Fb1ZX4IEPTa1kgQCKBwTjfioU2vvQ2UnQOGqKuySY",
  }
];

// Sidebar filters
export const filters = [
  { icon: "filter_list", label: "Map Filters", active: true },
  { icon: "history", label: "Epoch", active: false },
  { icon: "layers", label: "Material", active: false },
  { icon: "sailing", label: "Depth", active: false },
  { icon: "inventory_2", label: "Conservation", active: false },
];

export const publications = [
  {
    id: "pub-1",
    tag: "Deep Sea Excavation",
    date: "October 2024",
    title: "The Sinking of the 'Santa Maria de Gracia': A Multidisciplinary Analysis of 16th Century Hull Architecture",
    authors: "Dr. Henrique Silva, Mariana Costa (Graduate Fellow), Joao Pereira",
    excerpt: "\"This paper presents the results of a three-year underwater survey focused on the timber framing techniques utilized in late Renaissance Portuguese shipyards...\"",
    doi: "10.1088/maritime.2024.01",
    cite: "Silva et al., 2024"
  },
  {
    id: "pub-2",
    tag: "Student Presentation",
    date: "September 2024",
    title: "Mapping the Arade Estuary: Photogrammetric Reconstruction of Vernacular Coastal Vessels",
    authors: "Isabel Almeida (PhD Cand.), Prof. Carlos Rocha",
    excerpt: "Utilizing high-resolution sonar and DSLR photogrammetry, this student-led project reconstructs the morphological evolution of small-scale fishing vessels...",
    doi: "ARC-2024-ALGARVE",
    cite: "Peer Reviewed"
  },
  {
    id: "pub-3",
    tag: "Conservation Science",
    date: "August 2024",
    title: "Desalination Protocols for Waterlogged Iron Artifacts: A Comparative Case Study",
    authors: "Beatriz Fontes, Dr. Luis Mendes",
    excerpt: "An evaluation of electrolytic reduction versus chemical cleaning for ferrous materials recovered from high-salinity environments...",
    doi: "CNANS-772",
    cite: "Conservation, Iron, Estuary"
  }
];

export const ongoingProjects = [
  {
    id: "proj-1",
    type: "FIELD MISSION",
    title: "The Belém Wreck Site",
    description: "Systematic excavation of the 17th-century 'pimenta' ship in the Tagus river mouth.",
    progress: 65,
    icon: "sailing"
  },
  {
    id: "proj-2",
    type: "DIGITAL ARCHIVING",
    title: "Porto Harbor Ledger Project",
    description: "Digitizing the 18th-century customs records for maritime commercial reconstruction.",
    link: "Explore Metadata"
  },
  {
    id: "proj-3",
    type: "LAB ANALYSIS",
    title: "Isotopic Study of Iberian Oak",
    description: "Tracing timber origins of Navy vessels using strontium and oxygen isotopes."
  }
];

export const mapDetail = {
  title: "Nossa Senhora dos Mártires",
  status: "Active Excavation",
  heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzkw5usKPpUlot8urgAzIjyl3gf7HiZb3JR6xjMkXPClfk1Y4EOkSMMuOnjVIkWcx7cqHzyQAXRw2qc6WlWJQZY_PhmXigUuyz_6fzqp7zAudGFlKAwfp1cXZCIhYpYMbPZQAHDX5qsqCv6CWUC2pttl0fgE6puEtchmrNwoJz5NkQMT-E_Epm9xICGa3GJk40dikUBtsrmfnPNIcsHpOMpDucujuIPrbRetY0AQDwVKn3uTI3pBRiEj6W_gKzVY2BTrxc8li5E9s",
  metadata: [
    { label: "Site Type", value: "Shipwreck" },
    { label: "Chronology", value: "Late 16th Century" },
    { label: "Depth", value: "12m - 14m Below MSL" },
    { label: "Status", value: "Monitored" }
  ],
  summary: "Discovered in 1993, this site represents one of the most significant finds for the \"Carreira da Índia.\" The vessel was wrecked in September 1606 upon returning from Goa. Archaeological findings include pepper, porcelain, and structural timber fragments.",
  gallery: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCfFZBYGMCovwfOiR_DrwaFZbbi7CWvfqL5P7NMP_1RhKa6zHfSoyHTtMbdBUNuCZhb46u6BbKk9PqcwCgmtTWZ5AQOw2ktBZpAQFTJkCqlrftfTQcFPd_EwA89m3HXHB9MJxtjW1-9xnHMReqrXOvxxZmkffM0qbf7AmifYnRfFmMAzIP3qOtQ_PP6UKW-y-SLpAIU7rwKhpCuqNzsZuKypCDLrjRYZltSLxG3Xbb04khz-yF7xJsv_cm7iQF6P94BVCvBzV5_sJc",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAQfR5bxUGYMkfxxuyn30558pgDy0bR72DG4iO7XAcFLoaEa6C9t3Sua38N-fJXu215wfPx6IaFMBZ1sVg_gnOBSca5KaSYnTMB2YcKqaE1QAeOUcFrxJUXwXeDcn5b6JFijgOetF_5jc2Rd-LNHg_R786vnyZCaIJXeSfarEadz_0Xzr0-RrxhA03KOjlDOphhHqUnTZphzQ0hHTKYifUG7X8jiL8-SShcCY2LYsJzl3zqrRnJ1JoECq0-ud6BZ07u9jxK29ZtWCs",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC2a5f4u2EQIAhQAErP1UqoqG6JKx6t00Ndcjuc9XuK23nKwW_hSzkOtHeOIqUcqcIyimZ7hID_ZWilxkGYYUlJepq6SdVRcsAXLa7ellqrYSaZ7YdDnRmAZc-geENdfa-GvjMdCIVgZecRn-CWeVkTvwsEAzrH8zYR-WtApnBH2RDpXTs3xJyyTSsIBuHUCcJ7I-rBtEHCLFx-FlhOCJl4Ad2zlJ007A_lYuCsYlRopKWh2Q5TVcCnhlKuqHbSpFuzTzWlmYNqtb0"
  ]
};

export const globeFilters = {
  type: ["Shipwreck", "Artillery & Guns", "Anchor", "Artifact", "Fort", "Harbor Structure", "Shipyard Structure", "Other Structure", "Iconography", "Astrolabe", "Pattern", "Other"],
  epoch: ["15th Century", "16th Century", "17th Century", "18th Century"],
  region: ["Azores", "Tagus Estuary", "Cape Verde", "Goa Route", "Brazil Route", "Algarve Coast"]
};

export const typeColors = {
  "Shipwreck": "#3b82f6",           // blue
  "Artillery & Guns": "#ef4444",    // red
  "Anchor": "#6366f1",              // indigo
  "Artifact": "#f97316",            // orange
  "Fort": "#84cc16",                // lime
  "Harbor Structure": "#06b6d4",    // cyan
  "Shipyard Structure": "#8b5cf6",  // violet
  "Other Structure": "#64748b",     // slate
  "Iconography": "#ec4899",         // pink
  "Astrolabe": "#eab308",           // yellow
  "Pattern": "#14b8a6",             // teal
  "Other": "#a3a3a3"                 // neutral gray
};

export const globeMarkers = [
  {
    id: "PT-CAS-1502",
    lat: 38.69,
    lng: -9.42,
    coordinates: "38.6900° N, 9.4200° W",
    name: "Nossa Senhora dos Mártires",
    type: "Shipwreck",
    epoch: "17th Century",
    region: "Tagus Estuary",
    status: "Excavation Ongoing",
    completion: "64%",
    artifactsCount: 142,
    description: "Wrecked in September 1606 upon returning from Goa. Archaeological findings include pepper, porcelain, and structural timber.",
    date: "1606",
    size: 1.5,
    color: typeColors["Shipwreck"]
  },
  {
    id: "PT-SAG-1740",
    lat: 37.02,
    lng: -8.99,
    coordinates: "37.0225° N, 8.9964° W",
    name: "Sagres Iron Frigate",
    type: "Artillery & Guns",
    epoch: "18th Century",
    region: "Algarve Coast",
    status: "Survey Complete",
    completion: "100%",
    artifactsCount: 45,
    description: "An 18th-century iron frigate discovered off the coast of Sagres. The site contains significant remains of the hull and artillery.",
    date: "1740",
    size: 1.2,
    color: typeColors["Artillery & Guns"]
  },
  {
    id: "PT-TER-1583",
    lat: 38.65,
    lng: -27.22,
    coordinates: "38.6500° N, 27.2200° W",
    name: "Angra D Shipwreck",
    type: "Anchor",
    epoch: "16th Century",
    region: "Azores",
    status: "Conserved",
    completion: "89%",
    artifactsCount: 312,
    description: "A 16th-century galleon found in the Bay of Angra do Heroísmo. Features well-preserved lower hull structure.",
    date: "1583",
    size: 1.5,
    color: typeColors["Anchor"]
  },
  {
    id: "PT-CV-1490",
    lat: 15.12,
    lng: -23.6,
    coordinates: "15.1200° N, 23.6000° W",
    name: "Santiago Caravel",
    type: "Artifact",
    epoch: "15th Century",
    region: "Cape Verde",
    status: "Initial Survey",
    completion: "12%",
    artifactsCount: 8,
    description: "Early exploration vessel remains near the Cape Verde archipelago.",
    date: "1490",
    size: 1.0,
    color: typeColors["Artifact"]
  },
  {
    id: "PT-GOA-1610",
    lat: 15.49,
    lng: 73.82,
    coordinates: "15.4900° N, 73.8200° E",
    name: "Bom Jesus do Coromandel",
    type: "Fort",
    epoch: "17th Century",
    region: "Goa Route",
    status: "Excavation Ongoing",
    completion: "45%",
    artifactsCount: 89,
    description: "Lost during the monsoon season near Goa.",
    date: "1610",
    size: 1.3,
    color: typeColors["Fort"]
  }
];
