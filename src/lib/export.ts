// Convert an SVG string to a PNG file at exact pixel dimensions and trigger a download.

export async function downloadSvgAsPng(
  svg: string,
  width: number,
  height: number,
  filename: string,
): Promise<void> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load SVG into image"));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas context unavailable");
    ctx.drawImage(img, 0, 0, width, height);
    const pngBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );
    if (!pngBlob) throw new Error("PNG encoding failed");
    const pngUrl = URL.createObjectURL(pngBlob);
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(pngUrl), 2000);
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
