// Dimensiones intrínseas (px) de las imágenes de public/ que se pintan en
// tarjetas y artículos. Los <img> las usan como width/height para que el
// navegador reserve la proporción antes de descargar el archivo (anti-CLS);
// el tamaño final lo sigue mandando el CSS (width/height: auto).
// Medidas reales de los ficheros (parser de cabeceras PNG/JPEG/WebP/SVG).
const DIMENSIONS: Record<string, { width: number; height: number }> = {
  '/images/banner.webp': { width: 1600, height: 533 },
  '/images/sereno.jpg': { width: 1200, height: 1200 },
  '/images/conv-abierta-01.jpeg': { width: 600, height: 600 },
  '/images/SnJ-puri-logo-pat.png': { width: 384, height: 640 },
  '/images/SocratIA.webp': { width: 1860, height: 1860 },
  '/images/tabla-1.svg': { width: 1494, height: 607 },
  '/images/tabla-2.svg': { width: 1496, height: 690 },
  '/images/toque_de_cacho.webp': { width: 640, height: 838 },
  '/images/en_buenas_manos.webp': { width: 985, height: 761 },
};

export function imageDimensions(
  src?: string
): { width: number; height: number } | undefined {
  return src ? DIMENSIONS[src] : undefined;
}
