# Tokens CCD — Brand Kit del blog

Hoja de identidad visual de la **Corporación Cultura y Desarrollo** extraída del
blog en vivo (<https://blog.culturaydesarrollo.org>, build `f5cc7fe`, 19/10/2026)
mediante estilos computados reales y las variables `:root` del CSS publicado.
Sirve como referencia canónica al diseñar piezas nuevas (decks, artículos,
aplicaciones XR, panel) — por ejemplo, pasándola como entrada a un diseño
generado en Local Codex u OpenDesign Cloud.

## Color

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#24130f` | Titulares, marca, botones sólidos (marrón muy oscuro) |
| `--color-secondary` | `#9a5f3f` | Acentos, enlaces, chips de categoría, foco (terracota) |
| `--color-text` | `#3f302b` | Texto corrido (cálido, nunca negro puro) |
| `--color-heading` | `#1f1a17` | Encabezados h1 |
| `--color-muted` | `#667085` | Metadatos y figcaptions (gris azulado) |
| `--color-bg` | `#fffdfb` | Fondo general (crema firma) |
| `--color-bg-alt` | `#f8f1ec` | Fondos alternos: tarjetas, chips, modales |
| `--color-border` | `#e4d7cf` | Bordes y reglas divisorias |
| `--color-surface-strong` | `#fff` | Superficies elevadas |
| `--color-on-primary` | `#fffdfb` | Texto sobre primario |

## Tipografía

| Rol | Stack | Notas |
|---|---|---|
| Serif editorial | `"Source Serif 4", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif` | Auto-alojada (`/fonts/source-serif-4-latin*.woff2`, pesos 400–700). Títulos y cuerpo editorial |
| Sans UI | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | UI, metadatos, formularios |
| Mono | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | Bloques de código |

### Escala medida en producción

| Elemento | Tamaño / interlínea | Peso | Color |
|---|---|---|---|
| h1 | 32 px / 1.16 (clamp 2.1–2.7 rem en artículo) | 600 serif | `--color-heading` (en artículo: `--color-primary`) |
| h2 de sección/tarjeta | 21.6–24.2 px / 1.16 | 600 serif | `--color-primary` |
| Cuerpo de artículo | 17.6 px / 1.7 | 400 serif | `--color-text`, medida **68ch** (≈613 px) |
| Cuerpo UI | 16 px / 1.7 | 400 sans | `--color-text` |
| Chips de categoría | 13.6 px, mayúsculas | 600 sans | `--color-secondary` |
| Figcaption | 14.4 px | 400 sans | `--color-muted` |

## Layout, radios y sombras

- **Medida de lectura**: `--ancho-lectura: 68ch` (≈613 px a 17.6 px).
- **Radios**: imágenes 8 px · tarjetas/paginación 6 px · tags e inputs 4 px · modales 10 px · chips y triggers píldora 999 px.
- **Sombra**: `--shadow-soft: 0 18px 40px #24130f14`.
- **Foco**: `outline: 2px solid color-mix(in srgb, var(--color-secondary) 25%, transparent)` + borde secondary.
- **Objetivos táctiles**: ≥44 px (menú, carrusel, estrellas, bio de autor).
- **Movimiento**: `prefers-reduced-motion: reduce` respetado en todo el sitio.

## Bloque :root listo para copiar

```css
:root {
  --color-primary: #24130f;
  --color-secondary: #9a5f3f;
  --color-text: #3f302b;
  --color-heading: #1f1a17;
  --color-muted: #667085;
  --color-bg: #fffdfb;
  --color-bg-alt: #f8f1ec;
  --color-border: #e4d7cf;
  --color-surface-strong: #fff;
  --color-on-primary: #fffdfb;
  --font-serif: "Source Serif 4", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif;
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --ancho-lectura: 68ch;
  --shadow-soft: 0 18px 40px #24130f14;
}
```

## Notas de uso

- El serif es para **contenido editorial** (títulos y cuerpo de artículo); la UI (nav, formularios, botones) va en sans — no invertir los roles.
- El crema `#fffdfb` es el fondo firma de la Dirección A («Edición cultural»); no usar blanco puro como fondo de página.
- Fuentes serif auto-alojadas: sin dependencias externas. Si copias la tipografía a otro proyecto, lleva ambos `.woff2` (latin y latin-ext).
