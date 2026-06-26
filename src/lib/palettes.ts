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
];

export const paletteById = (id: string) =>
  palettes.find((p) => p.id === id) ?? palettes[0];
