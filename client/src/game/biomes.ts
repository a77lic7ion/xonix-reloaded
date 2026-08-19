// HD biome reminder: gameplay stays identical while stage palettes create distinct readable field identities.
export interface BiomePalette {
  id: string;
  label: string;
  sea: string;
  rail: string;
  railSoft: string;
  claimed: string;
  claimedLine: string;
  trail: string;
  player: string;
  playerHot: string;
  orb: string;
  enemy: string;
}

const BIOMES: BiomePalette[] = [
  { id: "abyss", label: "LUMINOUS ABYSS", sea: "#09101F", rail: "#20E4C3", railSoft: "#0EA88F", claimed: "#10384B", claimedLine: "#2A8390", trail: "#FFB33E", player: "#A855F7", playerHot: "#F174FF", orb: "#48DDFE", enemy: "#FF5E80" },
  { id: "reef", label: "EMBER REEF", sea: "#1B1011", rail: "#F6A137", railSoft: "#B85A2C", claimed: "#4A2624", claimedLine: "#A7513E", trail: "#FFF0B5", player: "#EE4F9C", playerHot: "#FF95C8", orb: "#FFD65A", enemy: "#FF4D62" },
  { id: "ice", label: "AURORA ICE", sea: "#101329", rail: "#90F3FF", railSoft: "#4D93DB", claimed: "#26345D", claimedLine: "#6477C9", trail: "#FF8CC8", player: "#BC8CFF", playerHot: "#E5C6FF", orb: "#C4FCFF", enemy: "#E981FF" },
  { id: "verdant", label: "VERDANT FLUX", sea: "#081914", rail: "#78F080", railSoft: "#2F9B6E", claimed: "#1D463C", claimedLine: "#3F8B6E", trail: "#FFD460", player: "#C36CFF", playerHot: "#E8B7FF", orb: "#BCFF72", enemy: "#FF5BB7" },
  { id: "rift", label: "SOLAR RIFT", sea: "#180D22", rail: "#FFD166", railSoft: "#B87637", claimed: "#452741", claimedLine: "#8D4C7D", trail: "#FFF8D5", player: "#FF7ADB", playerHot: "#FFC2EF", orb: "#FF9B52", enemy: "#FF4D74" },
];

export function biomeForLevel(level: number): BiomePalette {
  return BIOMES[Math.min(BIOMES.length - 1, Math.floor(Math.max(1, level) - 1) / 2)];
}
