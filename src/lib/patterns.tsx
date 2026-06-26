import type { Palette } from "./palettes";

export type Pattern = {
  id: string;
  name: string;
  description: string;
  // Returns the full SVG markup string for the wallpaper at given dimensions.
  renderSvg: (w: number, h: number, p: Palette) => string;
};

const randId = () => Math.random().toString(36).slice(2, 9);

const blurFilter = (id: string, stdDeviation: number) => `
  <filter id="${id}" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="${stdDeviation}" />
  </filter>
`;

const softShadow = (id: string, dy: number, blur: number, opacity: number) => `
  <filter id="${id}" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" />
    <feOffset dy="${dy}" />
    <feComponentTransfer><feFuncA type="linear" slope="${opacity}" /></feComponentTransfer>
    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
  </filter>
`;

const svgWrap = (id: string, w: number, h: number, inner: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" data-wllpr="${id}">
${inner}
</svg>`;

const aurora: Pattern = {
  id: "aurora",
  name: "Aurora",
  description: "Soft color fields",
  renderSvg: (w, h, p) => {
    const blurId = `blur-${randId()}`;
    return svgWrap("aurora", w, h, `
  <defs>${blurFilter(blurId, Math.max(40, h * 0.12))}</defs>
  <rect width="${w}" height="${h}" fill="${p.background}" />
  <g filter="url(#${blurId})">
    <ellipse cx="${w * 0.25}" cy="${h * 0.3}" rx="${w * 0.55}" ry="${h * 0.45}" fill="${p.primary}" opacity="0.95" />
    <ellipse cx="${w * 0.78}" cy="${h * 0.55}" rx="${w * 0.5}" ry="${h * 0.4}" fill="${p.secondary}" opacity="0.85" />
    <ellipse cx="${w * 0.5}" cy="${h * 0.85}" rx="${w * 0.6}" ry="${h * 0.35}" fill="${p.accent}" opacity="0.6" />
    <ellipse cx="${w * 0.95}" cy="${h * 0.15}" rx="${w * 0.3}" ry="${h * 0.25}" fill="${p.secondary}" opacity="0.55" />
    <ellipse cx="${w * 0.08}" cy="${h * 0.78}" rx="${w * 0.4}" ry="${h * 0.28}" fill="${p.primary}" opacity="0.45" />
  </g>
`);
  },
};

const bauhaus: Pattern = {
  id: "bauhaus",
  name: "Bauhaus",
  description: "Geometric primitives",
  renderSvg: (w, h, p) => {
    const sId = `bauhaus-shadow-${randId()}`;
    return svgWrap("bauhaus", w, h, `
  <defs>${softShadow(sId, 10, 18, 0.25)}</defs>
  <rect width="${w}" height="${h}" fill="${p.background}" />
  <circle cx="${w * 0.28}" cy="${h * 0.42}" r="${h * 0.32}" fill="${p.primary}" filter="url(#${sId})" />
  <path d="M ${w} ${h * 0.18} A ${h * 0.28} ${h * 0.28} 0 0 1 ${w} ${h * 0.74} Z" fill="${p.secondary}" filter="url(#${sId})" />
  <rect x="${w * 0.5}" y="${h * 0.7}" width="${w * 0.42}" height="${h * 0.13}" fill="${p.accent}" filter="url(#${sId})" />
  <circle cx="${w * 0.84}" cy="${h * 0.3}" r="${h * 0.05}" fill="${p.accent}" />
`);
  },
};

const concentric: Pattern = {
  id: "concentric",
  name: "Concentric",
  description: "Layered rings",
  renderSvg: (w, h, p) => {
    const cx = w * 0.5;
    const cy = h * 0.55;
    const maxR = Math.min(w, h) * 0.7;
    const rings = 22;
    let ringsSvg = "";
    for (let i = 0; i < rings; i++) {
      const r = maxR * (i / rings) + 6;
      const stroke = [p.primary, p.secondary, p.accent][i % 3];
      const strokeW = i % 4 === 0 ? 4 : 1.5;
      const opacity = 0.45 + (i % 3) * 0.2;
      ringsSvg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${strokeW}" opacity="${opacity}" />`;
    }
    return svgWrap("concentric", w, h, `
  <rect width="${w}" height="${h}" fill="${p.background}" />
  ${ringsSvg}
  <circle cx="${cx}" cy="${cy}" r="${maxR * 0.07}" fill="${p.accent}" />
  <circle cx="${cx}" cy="${cy}" r="${maxR * 0.025}" fill="${p.background}" />
`);
  },
};

const waves: Pattern = {
  id: "waves",
  name: "Waves",
  description: "Layered sine curves",
  renderSvg: (w, h, p) => {
    const colors = [p.primary, p.secondary, p.accent];
    const layers = 6;
    let layerSvg = "";
    for (let i = 0; i < layers; i++) {
      const cy = h * (0.25 + i * 0.12);
      const amp = h * (0.06 + i * 0.012);
      const period = w * (0.5 + i * 0.06);
      const phase = i * 0.7;
      const segs: string[] = [];
      segs.push(`M 0 ${cy.toFixed(2)}`);
      for (let k = 1; k <= 28; k++) {
        const x = (k * w) / 28;
        const y = cy + Math.sin((x / period) * Math.PI * 2 + phase) * amp;
        segs.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
      }
      segs.push(`L ${w} ${h}`);
      segs.push(`L 0 ${h} Z`);
      const d = segs.join(" ");
      const opacity = (0.5 + i * 0.07).toFixed(2);
      layerSvg += `<path d="${d}" fill="${colors[i % colors.length]}" opacity="${opacity}" />`;
    }
    return svgWrap("waves", w, h, `
  <rect width="${w}" height="${h}" fill="${p.background}" />
  ${layerSvg}
`);
  },
};

const grid: Pattern = {
  id: "grid",
  name: "Bricks",
  description: "Offset rectangle mosaic",
  renderSvg: (w, h, p) => {
    const step = h * 0.085;
    const rows = Math.ceil(h / step) + 2;
    const cols = Math.ceil(w / step) + 2;
    let cells = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const offset = r % 2 === 0 ? 0 : step / 2;
        const x = c * step + offset - step;
        const y = r * step;
        const colorRng = (r * 5 + c * 11) % 9;
        const fill =
          colorRng === 0
            ? p.primary
            : colorRng === 3
              ? p.secondary
              : colorRng === 7
                ? p.accent
                : p.background;
        const opacity = fill === p.background ? 0 : 0.85;
        cells += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(step * 0.94).toFixed(2)}" height="${(step * 0.94).toFixed(2)}" fill="${fill}" opacity="${opacity}" />`;
      }
    }
    return svgWrap("grid", w, h, `
  <rect width="${w}" height="${h}" fill="${p.background}" />
  ${cells}
`);
  },
};

const dots: Pattern = {
  id: "dots",
  name: "Dots",
  description: "Focal dot grid",
  renderSvg: (w, h, p) => {
    const step = h * 0.05;
    const cols = Math.ceil(w / step) + 1;
    const rows = Math.ceil(h / step) + 1;
    let grid = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * step + step / 2 + (r % 2 === 0 ? 0 : step / 2);
        const y = r * step + step / 2;
        const radiusVar = ((Math.sin(r * 1.7) + Math.cos(c * 1.3)) + 2) / 4;
        const radius = step * (0.06 + radiusVar * 0.1);
        const colorRng = (r * cols + c) % 7;
        const color =
          colorRng === 0
            ? p.primary
            : colorRng === 3
              ? p.secondary
              : p.accent;
        grid += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(2)}" fill="${color}" opacity="0.85" />`;
      }
    }
    const focal1 = `<circle cx="${(w * 0.32).toFixed(1)}" cy="${(h * 0.28).toFixed(1)}" r="${(h * 0.085).toFixed(1)}" fill="${p.primary}" opacity="0.95" />`;
    const focal2 = `<circle cx="${(w * 0.72).toFixed(1)}" cy="${(h * 0.7).toFixed(1)}" r="${(h * 0.05).toFixed(1)}" fill="${p.accent}" opacity="0.95" />`;
    return svgWrap("dots", w, h, `
  <rect width="${w}" height="${h}" fill="${p.background}" />
  ${grid}
  ${focal1}
  ${focal2}
`);
  },
};

const stripes: Pattern = {
  id: "stripes",
  name: "Stripes",
  description: "Wide diagonal stripes",
  renderSvg: (w, h, p) => {
    const stripeCount = 9;
    let stripesSvg = "";
    const palette = [p.primary, p.secondary, p.accent];
    for (let i = 0; i < stripeCount; i++) {
      const offset = i * (w * 0.12) - w * 0.4;
      const width = w * 0.04;
      stripesSvg += `<rect x="${offset}" y="-${h}" width="${width}" height="${h * 3}" fill="${palette[i % 3]}" opacity="${(0.55 + (i % 3) * 0.15).toFixed(2)}" transform="rotate(22 ${w / 2} ${h / 2})" />`;
    }
    return svgWrap("stripes", w, h, `
  <rect width="${w}" height="${h}" fill="${p.background}" />
  ${stripesSvg}
`);
  },
};

const orbs: Pattern = {
  id: "orbs",
  name: "Orbs",
  description: "Floating spheres",
  renderSvg: (w, h, p) => {
    const orbCount = 9;
    const defsRng = randId();
    let defs = "";
    let orbsSvg = "";
    const palette = [p.primary, p.secondary, p.accent];
    for (let i = 0; i < orbCount; i++) {
      const gradientId = `orb-${defsRng}-${i}`;
      const cx = w * (0.1 + ((i * 0.13) % 0.85));
      const cy = h * (0.1 + ((i * 0.18) % 0.82));
      const r = h * (0.06 + ((i * 7) % 3) * 0.035);
      const fill = palette[i % 3];
      defs += `
        <radialGradient id="${gradientId}" cx="35%" cy="32%" r="68%">
          <stop offset="0%" stop-color="${fill}" stop-opacity="0.98" />
          <stop offset="55%" stop-color="${fill}" stop-opacity="0.85" />
          <stop offset="100%" stop-color="${p.background}" stop-opacity="0.95" />
        </radialGradient>`;
      const offset = (i % 2 === 0 ? 1 : -1) * r * 0.4;
      orbsSvg += `<circle cx="${(cx + offset).toFixed(1)}" cy="${(cy + r * 0.4).toFixed(1)}" r="${r.toFixed(1)}" fill="url(#${gradientId})" />`;
    }
    return svgWrap("orbs", w, h, `
  <defs>${defs}</defs>
  <rect width="${w}" height="${h}" fill="${p.background}" />
  ${orbsSvg}
`);
  },
};

const particles: Pattern = {
  id: "particles",
  name: "Particles",
  description: "Deterministic dots",
  renderSvg: (w, h, p) => {
    const count = 260;
    let pts = "";
    let seed = 1234567;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    const palette = [p.primary, p.secondary, p.accent];
    for (let i = 0; i < count; i++) {
      const x = rng() * w;
      const y = rng() * h;
      const r = 0.8 + rng() * (h * 0.012);
      const colorRng = Math.floor(rng() * 4);
      const color =
        colorRng === 0
          ? p.primary
          : colorRng === 2
            ? p.secondary
            : p.accent;
      const opacity = 0.45 + rng() * 0.5;
      pts += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${color}" opacity="${opacity.toFixed(2)}" />`;
    }
    return svgWrap("particles", w, h, `
  <rect width="${w}" height="${h}" fill="${p.background}" />
  ${pts}
`);
  },
};

const mesh: Pattern = {
  id: "mesh",
  name: "Mesh",
  description: "Blurred color mesh",
  renderSvg: (w, h, p) => {
    const blurId = `mesh-blur-${randId()}`;
    return svgWrap("mesh", w, h, `
  <defs>
    ${blurFilter(blurId, Math.max(60, h * 0.15))}
    <radialGradient id="mesh-edge" cx="50%" cy="50%" r="70%">
      <stop offset="60%" stop-color="${p.background}" stop-opacity="0" />
      <stop offset="100%" stop-color="${p.background}" stop-opacity="0.9" />
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${p.background}" />
  <g filter="url(#${blurId})">
    <circle cx="${w * 0.15}" cy="${h * 0.2}" r="${h * 0.35}" fill="${p.primary}" />
    <circle cx="${w * 0.85}" cy="${h * 0.25}" r="${h * 0.3}" fill="${p.secondary}" />
    <circle cx="${w * 0.52}" cy="${h * 0.55}" r="${h * 0.36}" fill="${p.accent}" />
    <circle cx="${w * 0.2}" cy="${h * 0.85}" r="${h * 0.3}" fill="${p.secondary}" />
    <circle cx="${w * 0.85}" cy="${h * 0.88}" r="${h * 0.25}" fill="${p.primary}" />
  </g>
  <rect width="${w}" height="${h}" fill="url(#mesh-edge)" />
`);
  },
};

const lattice: Pattern = {
  id: "lattice",
  name: "Lattice",
  description: "Crosshatched lines",
  renderSvg: (w, h, p) => {
    const step = h * 0.12;
    const strokeW = step * 0.07;
    const cols = Math.ceil(w / step) + 1;
    const rows = Math.ceil(h / step) + 1;
    let lines = "";
    const palette = [p.primary, p.secondary, p.accent];
    for (let c = 0; c < cols; c++) {
      const x = c * step;
      lines += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${palette[c % 3]}" stroke-width="${strokeW}" opacity="0.7" />`;
    }
    for (let r = 0; r < rows; r++) {
      const y = r * step;
      lines += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${palette[r % 3]}" stroke-width="${strokeW}" opacity="0.6" />`;
    }
    return svgWrap("lattice", w, h, `
  <rect width="${w}" height="${h}" fill="${p.background}" />
  ${lines}
`);
  },
};

const horizon: Pattern = {
  id: "horizon",
  name: "Horizon",
  description: "Sun arc",
  renderSvg: (w, h, p) => {
    const cx = w / 2;
    const cy = h * 0.62;
    const r = Math.min(w * 0.6, h * 0.55);
    const gradId = `horizon-sky-${randId()}`;
    return svgWrap("horizon", w, h, `
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.primary}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="${p.secondary}" stop-opacity="0.85" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${p.background}" />
  <rect width="${w}" height="${cy}" fill="url(#${gradId})" />
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.accent}" />
  <rect x="0" y="${cy}" width="${w}" height="${h - cy}" fill="${p.background}" />
  <line x1="0" y1="${cy}" x2="${w}" y2="${cy}" stroke="${p.accent}" stroke-width="2" opacity="0.5" />
`);
  },
};

const spiral: Pattern = {
  id: "spiral",
  name: "Spiral",
  description: "Logarithmic spiral",
  renderSvg: (w, h, p) => {
    const cx = w / 2;
    const cy = h / 2;
    const turns = 6;
    const points = 320;
    let path = "";
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * turns * Math.PI * 2;
      const r = Math.exp(t * 0.085) * (h * 0.0045);
      const x = cx + Math.cos(t) * r;
      const y = cy + Math.sin(t) * r;
      path += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    return svgWrap("spiral", w, h, `
  <rect width="${w}" height="${h}" fill="${p.background}" />
  <path d="${path}" fill="none" stroke="${p.primary}" stroke-width="${Math.max(2, h * 0.006)}" opacity="0.92" />
  <circle cx="${cx}" cy="${cy}" r="6" fill="${p.accent}" />
`);
  },
};

const blob: Pattern = {
  id: "blob",
  name: "Blob",
  description: "Macro organic form",
  renderSvg: (w, h, p) => {
    const cx = w * 0.5;
    const cy = h * 0.5;
    const r = Math.min(w, h) * 0.32;
    const points = 8;
    let path = "";
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * Math.PI * 2;
      const noise = Math.sin(t * 3) * 0.18 + Math.cos(t * 5) * 0.12;
      const rr = r * (1 + noise);
      const x = cx + Math.cos(t) * rr;
      const y = cy + Math.sin(t) * rr;
      const tNext = ((i + 0.5) / points) * Math.PI * 2;
      const noiseC = Math.sin(tNext * 3) * 0.18 + Math.cos(tNext * 5) * 0.12;
      const rrC = r * (1 + noiseC) * 1.3;
      const cxcp = cx + Math.cos(tNext) * rrC;
      const cycp = cy + Math.sin(tNext) * rrC;
      if (i === 0) {
        path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
      } else {
        path += ` Q ${cxcp.toFixed(2)} ${cycp.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
    }
    const sId = `blob-shadow-${randId()}`;
    const gradId = `blob-grad-${randId()}`;
    return svgWrap("blob", w, h, `
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.primary}" />
      <stop offset="100%" stop-color="${p.secondary}" />
    </linearGradient>
    ${softShadow(sId, 14, 36, 0.45)}
  </defs>
  <rect width="${w}" height="${h}" fill="${p.background}" />
  <path d="${path} Z" fill="url(#${gradId})" filter="url(#${sId})" />
  <circle cx="${(cx - r * 0.32).toFixed(1)}" cy="${(cy - r * 0.5).toFixed(1)}" r="${(r * 0.1).toFixed(1)}" fill="${p.accent}" opacity="0.92" />
`);
  },
};

const triangles: Pattern = {
  id: "triangles",
  name: "Triangles",
  description: "Tessellated triangles",
  renderSvg: (w, h, p) => {
    const s = h * 0.16;
    const cols = Math.ceil(w / s) + 2;
    const rows = Math.ceil(h / (s * 0.866)) + 2;
    let tiles = "";
    const palette = [p.primary, p.secondary, p.accent];
    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const x = c * s + (r % 2 === 0 ? 0 : s / 2);
        const y = r * s * 0.866;
        const idxA = (r * 7 + c * 3 + 0) % 3;
        const idxB = (r * 7 + c * 3 + 1) % 3;
        const opacityA = 0.82;
        const opacityB = 0.72;
        tiles += `<polygon points="${x},${y} ${x + s},${y} ${x + s / 2},${y + s * 0.866}" fill="${palette[idxA]}" opacity="${opacityA}" />`;
        tiles += `<polygon points="${x + s / 2},${y + s * 0.866} ${x + s * 1.5},${y + s * 0.866} ${x + s},${y}" fill="${palette[idxB]}" opacity="${opacityB}" />`;
      }
    }
    return svgWrap("triangles", w, h, `
  <rect width="${w}" height="${h}" fill="${p.background}" />
  ${tiles}
`);
  },
};

const chevron: Pattern = {
  id: "chevron",
  name: "Chevron",
  description: "Repeating V",
  renderSvg: (w, h, p) => {
    const step = h * 0.08;
    const rows = Math.ceil(h / step) + 2;
    const cols = Math.ceil(w / (step * 2)) + 4;
    let lines = "";
    const palette = [p.primary, p.secondary, p.accent];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * step * 2 + (r % 2 === 0 ? 0 : step);
        const y = r * step;
        const idx = (r * 5 + c * 3) % 3;
        lines += `<polyline points="${x},${y + step} ${x + step},${y} ${x + step * 2},${y + step}" fill="none" stroke="${palette[idx]}" stroke-width="${(step * 0.28).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" />`;
      }
    }
    return svgWrap("chevron", w, h, `
  <rect width="${w}" height="${h}" fill="${p.background}" />
  ${lines}
`);
  },
};

export const patterns: Pattern[] = [
  aurora,
  bauhaus,
  concentric,
  waves,
  grid,
  dots,
  stripes,
  orbs,
  particles,
  mesh,
  lattice,
  horizon,
  spiral,
  blob,
  triangles,
  chevron,
];

export const patternById = (id: string) =>
  patterns.find((p) => p.id === id) ?? patterns[0];
