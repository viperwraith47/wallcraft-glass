// Curated color palettes for wallpapers.
// Each palette is intentionally restrained so the wallpaper reads as art first.

export type Palette = {
  id: string;
  name: string;
  // Used by patterns as the dominant color fill.
  primary: string;
  // Used by patterns as the secondary fill or stroke.
  secondary: string;
  // Used as a tertiary highlight (small accents, focal points).
  accent: string;
  // Base background color of the wallpaper.
  background: string;
};

export const palettes: Palette[] = [
  {
    id: "aurora",
    name: "Aurora",
    primary: "#FF6BA8",
    secondary: "#7B5FFF",
    accent: "#3FE0E0",
    background: "#0A0A1F",
  },
  {
    id: "ocean",
    name: "Ocean",
    primary: "#1E7AFF",
    secondary: "#00C9C9",
    accent: "#A8F0FF",
    background: "#04111F",
  },
  {
    id: "sunset",
    name: "Sunset",
    primary: "#FF6A3D",
    secondary: "#FFB347",
    accent: "#FFE8B0",
    background: "#1A0930",
  },
  {
    id: "forest",
    name: "Forest",
    primary: "#2BB96E",
    secondary: "#7CE0A0",
    accent: "#E8FFCE",
    background: "#08241B",
  },
  {
    id: "sakura",
    name: "Sakura",
    primary: "#FF92C2",
    secondary: "#FFC4D8",
    accent: "#5A1F45",
    background: "#1B0518",
  },
  {
    id: "cosmic",
    name: "Cosmic",
    primary: "#5B4FFF",
    secondary: "#9D4FFF",
    accent: "#E0BFFF",
    background: "#08051A",
  },
  {
    id: "mono-light",
    name: "Mono Light",
    primary: "#1A1A1A",
    secondary: "#3A3A3A",
    accent: "#8A8A8A",
    background: "#F2EFE6",
  },
  {
    id: "mono-dark",
    name: "Mono Dark",
    primary: "#F2F2F2",
    secondary: "#BFBFBF",
    accent: "#666666",
    background: "#0A0A0A",
  },
  {
    id: "earth",
    name: "Earth",
    primary: "#C97B4A",
    secondary: "#E8C18A",
    accent: "#3A4A2E",
    background: "#1B130A",
  },
  {
    id: "citrus",
    name: "Citrus",
    primary: "#FFD23F",
    secondary: "#9FE870",
    accent: "#FF7A59",
    background: "#0F1A04",
  },
  {
    id: "lavender",
    name: "Lavender Mist",
    primary: "#A48BE3",
    secondary: "#DCC8F7",
    accent: "#F7E8A0",
    background: "#F9F6F2",
  },
  {
    id: "midnight",
    name: "Midnight",
    primary: "#3B82F6",
    secondary: "#1E40AF",
    accent: "#93C5FD",
    background: "#050816",
  },
  {
    id: "coral",
    name: "Coral Reef",
    primary: "#FF7E5F",
    secondary: "#FEB47B",
    accent: "#FFD56F",
    background: "#1A0E2E",
  },
  {
    id: "mint",
    name: "Mint",
    primary: "#4ADE80",
    secondary: "#A7F3D0",
    accent: "#FBCFE8",
    background: "#042F1A",
  },
  {
    id: "ember",
    name: "Ember",
    primary: "#EF4444",
    secondary: "#F97316",
    accent: "#FCD34D",
    background: "#1A0808",
  },
  {
    id: "electric",
    name: "Electric",
    primary: "#D946EF",
    secondary: "#06B6D4",
    accent: "#FDF4FF",
    background: "#08001A",
  },
  {
    id: "olive",
    name: "Olive Grove",
    primary: "#84CC16",
    secondary: "#A16207",
    accent: "#D4D4A8",
    background: "#1A1F08",
  },
  {
    id: "storm",
    name: "Storm",
    primary: "#64748B",
    secondary: "#94A3B8",
    accent: "#CBD5E1",
    background: "#0F172A",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    primary: "#F472B6",
    secondary: "#FCD34D",
    accent: "#FBCFE8",
    background: "#1B0F1A",
  },
  {
    id: "ice",
    name: "Ice",
    primary: "#7DD3FC",
    secondary: "#E0F2FE",
    accent: "#FFFFFF",
    background: "#0F172A",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    primary: "#FF2D7B",
    secondary: "#00F0FF",
    accent: "#FACC15",
    background: "#0A0014",
  },
  {
    id: "tropical",
    name: "Tropical",
    primary: "#FF6B35",
    secondary: "#00C49A",
    accent: "#FFD166",
    background: "#0B1A12",
  },
  {
    id: "rose",
    name: "Rose Quartz",
    primary: "#D4618C",
    secondary: "#C9B1D0",
    accent: "#F5E6F0",
    background: "#1A0F15",
  },
  {
    id: "nebula",
    name: "Nebula",
    primary: "#8B5CF6",
    secondary: "#3B82F6",
    accent: "#F472B6",
    background: "#0C0520",
  },
  {
    id: "desert",
    name: "Desert",
    primary: "#D4A574",
    secondary: "#E8C9A0",
    accent: "#C2724D",
    background: "#1A120A",
  },
  {
    id: "frost",
    name: "Frost",
    primary: "#A5B4FC",
    secondary: "#C7D2FE",
    accent: "#E0E7FF",
    background: "#0F172A",
  },
  {
    id: "volcanic",
    name: "Volcanic",
    primary: "#DC2626",
    secondary: "#F97316",
    accent: "#FBBF24",
    background: "#1C0800",
  },
  {
    id: "pastel",
    name: "Pastel Dream",
    primary: "#F9A8D4",
    secondary: "#A5F3FC",
    accent: "#FDE68A",
    background: "#1E1B2E",
  },
  {
    id: "slate",
    name: "Slate",
    primary: "#64748B",
    secondary: "#94A3B8",
    accent: "#E2E8F0",
    background: "#0F172A",
  },
];

export const paletteById = (id: string) =>
  palettes.find((p) => p.id === id) ?? palettes[0];
