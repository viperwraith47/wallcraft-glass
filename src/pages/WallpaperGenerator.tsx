import { useEffect, useMemo, useState } from "react";
import { palettes as allPalettes, paletteById, type Palette } from "@/lib/palettes";
import { patterns as allPatterns, patternById, type Pattern } from "@/lib/patterns";
import { downloadSvgAsPng } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Download, Moon, Smartphone, Sparkles, Sun, Wand2, Monitor } from "lucide-react";

// Wallpaper export resolutions
const DESKTOP_W = 1920;
const DESKTOP_H = 1080;
const PHONE_W = 1290;
const PHONE_H = 2796;

export default function WallpaperGenerator() {
  const [patternId, setPatternId] = useState<string>(allPatterns[0].id);
  const [paletteId, setPaletteId] = useState<string>(allPalettes[0].id);
  const [isDark, setIsDark] = useState<boolean>(true);

  const palette = useMemo(() => paletteById(paletteId), [paletteId]);
  const pattern = useMemo(() => patternById(patternId), [patternId]);

  // Apply theme class to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [isDark]);

  // Full-resolution SVGs (used for download/export)
  const desktopSvg = useMemo(
    () => pattern.renderSvg(DESKTOP_W, DESKTOP_H, palette),
    [pattern, palette],
  );
  const phoneSvg = useMemo(
    () => pattern.renderSvg(PHONE_W, PHONE_H, palette),
    [pattern, palette],
  );

  // Preview-resolution SVGs (used inside mockups in DOM)
  const desktopPreview = useMemo(
    () => pattern.renderSvg(1280, 720, palette),
    [pattern, palette],
  );
  const phonePreview = useMemo(
    () => pattern.renderSvg(360, 780, palette),
    [pattern, palette],
  );

  const handleRandomize = () => {
    let attempts = 0;
    let np = allPatterns[Math.floor(Math.random() * allPatterns.length)];
    let npl = allPalettes[Math.floor(Math.random() * allPalettes.length)];
    while (attempts < 6 && (np.id === patternId || npl.id === paletteId)) {
      np = allPatterns[Math.floor(Math.random() * allPatterns.length)];
      npl = allPalettes[Math.floor(Math.random() * allPalettes.length)];
      attempts++;
    }
    setPatternId(np.id);
    setPaletteId(npl.id);
  };

  const handleDownload = async (variant: "desktop" | "phone") => {
    const w = variant === "desktop" ? DESKTOP_W : PHONE_W;
    const h = variant === "desktop" ? DESKTOP_H : PHONE_H;
    const svg = variant === "desktop" ? desktopSvg : phoneSvg;
    const filename = `wllpr-${variant === "desktop" ? "desktop" : "iphone"}-${pattern.id}-${palette.id}.png`;
    try {
      await downloadSvgAsPng(svg, w, h, filename);
      toast.success(
        variant === "desktop"
          ? "Desktop wallpaper downloaded"
          : "iPhone wallpaper downloaded",
        {
          description: `${w}×${h}`,
          icon: <Download className="size-4" />,
        },
      );
    } catch (err) {
      toast.error("Failed to generate image", { description: String(err) });
    }
  };

  return (
    <div className="min-h-screen relative isolate bg-app overflow-x-hidden">
      <BackgroundOrbs />
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <div className="flex-1 flex flex-col min-w-0">
          <Header isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />
          <main className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8 lg:pt-16 lg:pb-12 gap-8">
            <PreviewStage
              desktopSvg={desktopPreview}
              phoneSvg={phonePreview}
              isDark={isDark}
            />
            <div className="flex gap-2.5">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={handleRandomize}
                  className="h-10 glass-button-primary rounded-xl gap-2 font-medium text-xs cursor-pointer"
                >
                  <Wand2 className="size-3.5" />
                  Random
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() => handleDownload("desktop")}
                  className="h-10 glass-button rounded-xl gap-2 font-medium text-xs cursor-pointer"
                >
                  <Download className="size-3.5" />
                  Download Desktop
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() => handleDownload("phone")}
                  className="h-10 glass-button rounded-xl gap-2 font-medium text-xs cursor-pointer"
                >
                  <Smartphone className="size-3.5" />
                  Download iPhone
                </Button>
              </motion.div>
            </div>
          </main>
          <FooterHint />
        </div>
        <Sidebar
          patternId={patternId}
          setPatternId={setPatternId}
          paletteId={paletteId}
          setPaletteId={setPaletteId}
          currentPalette={palette}
          currentPattern={pattern}
        />
      </div>
    </div>
  );
}

// ===== Sub Components =====

function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-[720px] h-[720px] rounded-full bg-orb-violet" />
      <div className="absolute -bottom-44 -right-44 w-[820px] h-[820px] rounded-full bg-orb-cyan" />
      <div className="absolute top-[35%] left-[55%] w-[600px] h-[600px] rounded-full bg-orb-rose" />
      <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}

function Header({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <header className="glass-panel sticky top-0 z-30 rounded-none border-x-0 border-t-0">
      <div className="px-5 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="leading-tight">
            <div className="text-lg font-bold tracking-[0.18em] text-luminous">WLLPR</div>
            <div className="text-[11px] text-muted-foreground/80 hidden sm:block">
              wallpapers that match your vibe
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground/80 hidden md:inline">
            {isDark ? "Dark" : "Light"}
          </span>
          <div className="glass-button p-1.5 flex items-center gap-2 rounded-full">
            <Sun
              className={`size-4 transition-opacity ${isDark ? "opacity-40" : "opacity-100"} text-foreground`}
            />
            <Switch
              checked={isDark}
              onCheckedChange={onToggleTheme}
              className="data-[state=checked]:bg-violet-500 h-5 w-9"
            />
            <Moon
              className={`size-4 transition-opacity ${isDark ? "opacity-100" : "opacity-40"} text-foreground`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="size-9 rounded-xl glass-card flex items-center justify-center shadow-[0_4px_18px_rgba(123,95,255,0.35)]">
      <Sparkles className="size-4 text-luminous" />
    </div>
  );
}

function FooterHint() {
  return (
    <div className="px-6 pb-6 pt-2 flex justify-center lg:justify-start">
      <div className="glass-pill rounded-full px-4 py-2 text-[11px] text-muted-foreground/80 flex items-center gap-3">
        <span className="hidden sm:inline">Live preview</span>
        <span className="hidden sm:inline opacity-30">·</span>
        <span>Desktop 1920×1080</span>
        <span className="opacity-30">·</span>
        <span>iPhone 1290×2796</span>
      </div>
    </div>
  );
}

function PreviewStage({
  desktopSvg,
  phoneSvg,
  isDark,
}: {
  desktopSvg: string;
  phoneSvg: string;
  isDark: boolean;
}) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
      <DesktopMockup svg={desktopSvg} isDark={isDark} />
      <PhoneMockup svg={phoneSvg} isDark={isDark} />
    </div>
  );
}

function DesktopMockup({ svg, isDark }: { svg: string; isDark: boolean }) {
  const url = useMemo(
    () => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
    [svg],
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate"
    >
      {/* Glow behind monitor */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-50 bg-luminous-radial" />
      {/* Monitor bezel */}
      <div
        className={`relative w-[min(64vw,560px)] lg:w-[min(44vw,440px)] aspect-[16/10] rounded-[20px] p-[10px] ring-1 ring-white/15 ${
          isDark ? "glass-bezel-dark" : "glass-bezel-light"
        }`}
        style={{
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Screen */}
        <div
          className="relative w-full aspect-[16/9] rounded-[8px] overflow-hidden ring-1 ring-black/30"
          style={{ backgroundImage: url, backgroundSize: "cover" }}
        />
        {/* Camera notch */}
        <div className="absolute top-[18px] left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-zinc-700" />
      </div>
      {/* Stand neck */}
      <div className="flex justify-center -mt-0.5">
        <div
          className={`w-3.5 h-3 ${isDark ? "bg-zinc-900" : "bg-zinc-300"} rounded-b-md`}
        />
        <div
          className={`w-3.5 h-3 ${isDark ? "bg-zinc-900" : "bg-zinc-300"} translate-y-[3px] rounded-b-md`}
        />
      </div>
      {/* Stand base (sliding out view) */}
      <div className="flex justify-center -mt-1">
        <div
          className={`w-44 h-2 rounded-md ${isDark ? "bg-zinc-800" : "bg-zinc-400"}`}
          style={{
            boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
          }}
        />
      </div>
      {/* Label */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
        Desktop
      </div>
    </motion.div>
  );
}

function PhoneMockup({ svg, isDark }: { svg: string; isDark: boolean }) {
  const url = useMemo(
    () => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
    [svg],
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative isolate"
    >
      <div className="absolute inset-0 -z-10 blur-2xl opacity-50 bg-luminous-radial" />
      <div
        className={`relative w-[170px] aspect-[9/19.5] rounded-[34px] p-[6px] ring-1 ring-white/15 ${
          isDark ? "glass-bezel-dark" : "glass-bezel-light"
        }`}
        style={{
          boxShadow:
            "0 30px 70px rgba(0,0,0,0.5), 0 6px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[74px] h-[20px] bg-black rounded-full z-10" />
        {/* Screen */}
        <div
          className="w-full h-full rounded-[28px] overflow-hidden"
          style={{ backgroundImage: url, backgroundSize: "cover" }}
        />
        {/* Home indicator */}
        <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[50px] h-[3.5px] bg-white/60 rounded-full" />
      </div>
      {/* Label */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70 whitespace-nowrap">
        iPhone
      </div>
    </motion.div>
  );
}

function Sidebar(props: {
  patternId: string;
  setPatternId: (id: string) => void;
  paletteId: string;
  setPaletteId: (id: string) => void;
  currentPalette: Palette;
  currentPattern: Pattern;
}) {
  return (
    <aside className="w-full lg:w-[380px] lg:max-w-[380px] lg:min-h-screen lg:sticky lg:top-0 glass-panel rounded-t-2xl lg:rounded-none border-b-0 lg:border-b border-x-0 lg:border-l lg:border-r-0 overflow-y-auto">
      <div className="p-4 flex flex-col gap-4">
        {/* Active Palette Preview */}
        <motion.div
          layout
          className="glass-card rounded-xl p-3 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-0.5">
                Active Palette
              </div>
              <div className="text-sm font-semibold text-foreground/90">
                {props.currentPalette.name}
              </div>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground/50 bg-white/5 px-2 py-1 rounded-md">
              {props.currentPattern.name}
            </div>
          </div>
          {/* Palette color strip */}
          <div className="flex gap-1 h-5 rounded-lg overflow-hidden">
            {[props.currentPalette.primary, props.currentPalette.secondary, props.currentPalette.accent, props.currentPalette.background].map(
              (c, i) => (
                <motion.div
                  key={`${c}-${i}`}
                  layoutId={`strip-${i}`}
                  className="flex-1 ring-1 ring-white/10"
                  style={{ backgroundColor: c }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              ),
            )}
          </div>
        </motion.div>

        {/* Designs Section */}
        <Section
          title="Designs"
          count={allPatterns.length}
          icon={<Monitor className="size-3.5" />}
        >
          <div className="grid grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
            {allPatterns.map((p) => (
              <PatternCard
                key={p.id}
                patternId={p.id}
                label={p.name}
                selected={props.patternId === p.id}
                palette={props.currentPalette}
                onClick={() => props.setPatternId(p.id)}
              />
            ))}
          </div>
        </Section>

        {/* Colors Section */}
        <Section
          title="Colors"
          count={allPalettes.length}
          icon={<Sparkles className="size-3.5" />}
        >
          <div className="grid grid-cols-5 gap-1">
            {allPalettes.map((p) => (
              <PaletteSwatch
                key={p.id}
                palette={p}
                selected={props.paletteId === p.id}
                onClick={() => props.setPaletteId(p.id)}
              />
            ))}
          </div>
        </Section>
      </div>
    </aside>
  );
}

function Section({
  title,
  count,
  icon,
  children,
}: {
  title: string;
  count?: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/85 flex items-center gap-1.5">
          {icon}
          {title}
        </h3>
        {count != null && (
          <span className="text-[10px] text-muted-foreground/50 font-mono">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function PatternCard({
  patternId,
  label,
  selected,
  palette,
  onClick,
}: {
  patternId: string;
  label: string;
  selected: boolean;
  palette: Palette;
  onClick: () => void;
}) {
  const svg = useMemo(
    () => patternById(patternId).renderSvg(160, 100, palette),
    [patternId, palette],
  );
  const url = useMemo(
    () => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
    [svg],
  );
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="group flex flex-col gap-1.5 cursor-pointer w-full"
    >
      <div
        className={`relative w-full aspect-[16/10] rounded-xl overflow-hidden ring-1 transition-all duration-200 ${
          selected
            ? "ring-luminous shadow-[0_0_0_1px_rgba(169,156,255,0.5),0_8px_28px_rgba(123,95,255,0.35)]"
            : "ring-white/10 hover:ring-white/25 shadow-md shadow-black/15"
        }`}
      >
        <div
          className="absolute inset-0 bg-cover transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundImage: url, backgroundSize: "cover" }}
        />
        {/* Frosted glass overlay on hover */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200" />
        {/* Selected checkmark */}
        {selected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1.5 right-1.5 size-4 rounded-full glass-card flex items-center justify-center"
          >
            <div className="size-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(169,156,255,0.9)]" />
          </motion.div>
        )}
      </div>
      {/* Label below card */}
      <div className={`text-[10px] text-center leading-tight tracking-wide truncate ${
        selected ? "text-luminous font-medium" : "text-muted-foreground/60"
      }`}>
        {label}
      </div>
    </motion.button>
  );
}

function PaletteSwatch({
  palette,
  selected,
  onClick,
}: {
  palette: Palette;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={palette.name}
      className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
        selected
          ? "ring-2 ring-luminous shadow-[0_0_0_1px_rgba(169,156,255,0.4),0_4px_16px_rgba(123,95,255,0.3)]"
          : "ring-1 ring-white/8 hover:ring-white/25 shadow-md shadow-black/20"
      }`}
    >
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div style={{ backgroundColor: palette.primary }} />
        <div style={{ backgroundColor: palette.secondary }} />
        <div style={{ backgroundColor: palette.accent }} />
        <div style={{ backgroundColor: palette.background }} />
      </div>
      <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/30"
        >
          <div className="size-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </motion.div>
      )}
    </motion.button>
  );
}
