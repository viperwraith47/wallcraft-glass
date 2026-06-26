import { useEffect, useMemo, useState } from "react";
import { palettes as allPalettes, paletteById, type Palette } from "@/lib/palettes";
import { patterns as allPatterns, patternById, type Pattern } from "@/lib/patterns";
import { downloadSvgAsPng } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
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
          <main className="flex-1 flex items-center justify-center px-6 py-8 lg:py-12">
            <PreviewStage
              desktopSvg={desktopPreview}
              phoneSvg={phonePreview}
              isDark={isDark}
            />
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
          onRandomize={handleRandomize}
          onDownloadDesktop={() => handleDownload("desktop")}
          onDownloadPhone={() => handleDownload("phone")}
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
      <div className="glass-card rounded-full px-4 py-2 text-[11px] text-muted-foreground/80 flex items-center gap-3">
        <span className="hidden sm:inline">Visualização ao vivo</span>
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
    <div className="flex flex-col items-center gap-10 lg:gap-16">
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
        className={`relative w-[min(64vw,560px)] aspect-[16/10] rounded-[20px] p-[10px] ${
          isDark
            ? "bg-zinc-950 ring-1 ring-white/15"
            : "bg-zinc-200 ring-1 ring-black/5"
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
        className={`relative w-[170px] aspect-[9/19.5] rounded-[34px] p-[6px] ${
          isDark ? "bg-zinc-950" : "bg-zinc-800"
        } ring-1 ring-white/15`}
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
  onRandomize: () => void;
  onDownloadDesktop: () => void;
  onDownloadPhone: () => void;
}) {
  return (
    <aside className="w-full lg:w-[360px] lg:max-w-[360px] lg:min-h-screen lg:sticky lg:top-0 glass-panel rounded-t-2xl lg:rounded-none border-b-0 lg:border-b border-x-0 lg:border-l lg:border-r-0">
      <div className="p-5 flex flex-col gap-6">
        {/* Designs Section */}
        <Section
          title="Designs"
          subtitle={`${allPatterns.length} patterns`}
          icon={<Monitor className="size-3.5" />}
        >
          <div className="grid grid-cols-2 gap-2.5">
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
          subtitle={`${allPalettes.length} palettes`}
          icon={<Sparkles className="size-3.5" />}
        >
          <div className="grid grid-cols-5 gap-2.5">
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

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-1">
          <Button
            onClick={props.onRandomize}
            className="w-full h-12 glass-button-primary rounded-xl text-sm font-semibold gap-2"
          >
            <Wand2 className="size-4" />
            Generate new
          </Button>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="ghost"
              onClick={props.onDownloadDesktop}
              className="h-12 glass-button rounded-xl gap-2 font-medium hover:bg-transparent hover:!bg-white/15"
            >
              <Download className="size-4" />
              <span className="text-xs">Download Desktop</span>
            </Button>
            <Button
              variant="ghost"
              onClick={props.onDownloadPhone}
              className="h-12 glass-button rounded-xl gap-2 font-medium hover:bg-transparent hover:!bg-white/15"
            >
              <Smartphone className="size-4" />
              <span className="text-xs">Download iPhone</span>
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <div className="glass-card rounded-xl px-3 py-2.5 text-[11px] text-muted-foreground/90 flex items-center justify-between">
          <span>
            {props.currentPalette.name} · {props.currentPattern.name}
          </span>
          <span className="font-mono text-foreground/70">PNG</span>
        </div>
      </div>
    </aside>
  );
}

function Section({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/85 flex items-center gap-1.5">
          {icon}
          {title}
        </h3>
        {subtitle && (
          <span className="text-[10px] text-muted-foreground/65 tracking-wide">
            {subtitle}
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
    () => patternById(patternId).renderSvg(160, 90, palette),
    [patternId, palette],
  );
  const url = useMemo(
    () => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
    [svg],
  );
  return (
    <button
      onClick={onClick}
      className={`group relative aspect-[16/9] rounded-[10px] overflow-hidden transition-all ${
        selected
          ? "ring-2 ring-luminous shadow-[0_0_0_1px_rgba(169,156,255,0.5),0_8px_30px_rgba(123,95,255,0.35)]"
          : "ring-1 ring-white/12 hover:ring-white/30"
      }`}
    >
      <div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: url, backgroundSize: "cover" }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-2 py-1.5">
        <div className="text-[10px] font-medium text-white/95 drop-shadow tracking-wide">
          {label}
        </div>
      </div>
      {selected && (
        <div className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-violet-300 shadow-[0_0_10px_3px_rgba(169,156,255,0.9)]" />
      )}
    </button>
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
    <button
      onClick={onClick}
      title={palette.name}
      className={`group relative aspect-square rounded-[8px] overflow-hidden transition-all ${
        selected
          ? "ring-2 ring-luminous shadow-[0_0_0_1px_rgba(169,156,255,0.5)]"
          : "ring-1 ring-white/12 hover:ring-white/30"
      }`}
    >
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div style={{ backgroundColor: palette.primary }} />
        <div style={{ backgroundColor: palette.secondary }} />
        <div style={{ backgroundColor: palette.accent }} />
        <div style={{ backgroundColor: palette.background }} />
      </div>
      <div className="absolute inset-0 ring-1 ring-inset ring-black/15" />
    </button>
  );
}
