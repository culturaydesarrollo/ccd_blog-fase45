---
name: Blog CCD — Edición cultural y del desarrollo social
description: Sistema editorial cálido del blog de la Corporación Cultura y Desarrollo — serif de lectura, papel crema y acentos de terracota.
colors:
  tinta-cafe: "#24130f"
  terracota: "#9a5f3f"
  titular: "#1f1a17"
  texto: "#3f302b"
  papel: "#fffdfb"
  arena: "#f8f1ec"
  superficie-fuerte: "#ffffff"
  borde: "#e4d7cf"
  neblina: "#667085"
  sobre-tinta: "#fffdfb"
  callout-nota: "#3f8f7a"
  callout-aviso: "#bb7b2a"
typography:
  display:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "clamp(2.2rem, 5vw, 3.4rem)"
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: "-0.01em"
  titulo:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "clamp(1.4rem, 3vw, 1.7rem)"
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: "-0.01em"
  lectura:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  cuerpo:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  etiqueta:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.12em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "1rem"
  micro:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    letterSpacing: "0.02em"
  meta:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.85rem"
  ui:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.95rem"
  frase:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.05rem"
  lede:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.1rem"
  lede-alta:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.15rem"
  subtitulo:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.16
  h3-articulo:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "1.35rem"
    fontWeight: 600
    lineHeight: 1.16
  titular-form:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.16
  h3-seccion:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "1.6rem"
    fontWeight: 600
    lineHeight: 1.16
  h1-compacto:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "1.8rem"
    fontWeight: 600
    lineHeight: 1.16
  h1-seccion:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "2.3rem"
    fontWeight: 600
    lineHeight: 1.16
  h1-articulo:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif"
    fontSize: "clamp(2.1rem, 4vw, 2.7rem)"
    fontWeight: 600
    lineHeight: 1.16
rounded:
  sm: "4px"
  buscador: "5px"
  md: "6px"
  lg: "8px"
  xl: "10px"
  pill: "999px"
  modal: "12px"
spacing:
  xs: "0.45rem"
  sm: "0.65rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  card-post:
    backgroundColor: "{colors.arena}"
    textColor: "{colors.texto}"
    rounded: "{rounded.lg}"
    padding: "2rem"
  card-destacado:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.texto}"
    rounded: "{rounded.xl}"
    padding: "1rem"
  badge-destacado:
    backgroundColor: "{colors.tinta-cafe}"
    textColor: "{colors.sobre-tinta}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.6rem"
  input-busqueda:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.texto}"
    rounded: "5px"
    padding: "0.25rem 0.65rem"
    height: "2.1rem"
  boton-carrusel:
    backgroundColor: "{colors.arena}"
    textColor: "{colors.tinta-cafe}"
    rounded: "50%"
    size: "2.75rem"
  boton-volver-arriba:
    backgroundColor: "{colors.tinta-cafe}"
    textColor: "{colors.sobre-tinta}"
    height: "3.75rem"
    width: "7.5rem"
---

# Design System: Blog CCD — Edición cultural y del desarrollo social

## Overview

**Creative North Star: "Edición cultural y del desarrollo social"**

Este sistema es un periódico cultural impreso que aprendió a vivir en pantalla. Nace de la Corporación Cultura y Desarrollo y lleva esa doble naturaleza en cada decisión: el rigor editorial de una fundación y el calor artesanal de un taller. La paleta no pide permiso con estridencias: habla en marrones profundos de tinta y terracota, sobre un papel crema que nunca es blanco puro.

La densidad es la de la lectura larga: medida de 68ch, serif editorial en los titulares y el cuerpo del artículo, sans discreta para la infraestructura (nav, metadatos, controles). El acento terracota es escaso y preciso — un borde izquierdo, un enlace, un eyebrow — porque su rareza es su fuerza. Todo está pensado para que el contenido venza al contenedor.

La anti-referencia es explícita y confirmada por el autor del proyecto: el look startup/tech — gradientes morados, glassmorphism, neón, tarjetas genéricas en grid infinito. Ese mundo no entra aquí.

**Key Characteristics:**
- Papel cálido (#fffdfb) en lugar de blanco puro; contenedores por borde, no por fondo chillón.
- Serif editorial (Source Serif 4 auto-alojada) para todo lo que se lee; sans para todo lo que se opera.
- Terracota como acento escaso y estructural (bordes izquierdos, top-borders, enlaces).
- Dual theme completo (claro/oscuro) resuelto solo con variables.
- Imágenes siempre completas, sin recortes — regla de la casa escrita en el CSS.
- Accesibilidad como infraestructura: foco visible 3px, objetivos ≥44px, reduced-motion, skip-link, control de tamaño de texto.

## Colors

Paleta de papeles y tintas: cálida, apagada, sin colores primarios puros.

### Primary
- **Tinta Café Institucional** (#24130f): marrón casi negro, el color del logo institucional. Encabezados de página, títulos de artículo, botón sólido (badge, volver-arriba, cierre de modal), skip-link. Es la voz con autoridad.

### Secondary
- **Terracota del Taller** (#9a5f3f): el único acento cromático del sistema. Enlaces, eyebrows, bordes izquierdos de tarjetas y callouts, foco visible, bordes superiores de destacados, estado activo del carrusel.

### Neutral
- **Titular Casi-Negro** (#1f1a17): h1–h6 genéricos.
- **Texto Cálido** (#3f302b): cuerpo de texto.
- **Papel Crema** (#fffdfb): fondo general.
- **Arena Suave** (#f8f1ec): fondo de tarjetas, paneles, callouts, inputs de carrusel.
- **Borde Cobre Claro** (#e4d7cf): todos los bordes de 1px.
- **Neblina** (#667085): metadatos y texto secundario - el único gris, levemente frío, reservado a lo que debe callarse. Es también `--color-muted` en CSS (modo claro); en modo oscuro muta a #d8c4bb cálido. **Única fuente de gris en el sistema**: placeholders de formularios (`::placeholder`) y meta de listados migrados a este token el 24/10/2026 (antes existían #98a2b3 y #718096 como grises sueltos; eliminados).
- **Sobre-Tinta** (#fffdfb): texto sobre primarios sólidos.

### Acentos funcionales (callouts MDX)
- **Verde Nota** (#3f8f7a): callout de tipo nota.
- **Ámbar Aviso** (#bb7b2a): callout de tipo advertencia.

### Acentos funcionales (formularios y métricas) — tokenizados 23/10/2026
- **Verde Éxito** (#147a3c): confirmaciones de formulario y estados de comentarios.
- **Rojo Error** (#b42318): mensajes de error y validación.
- **Oro Métrica** (#f4b740): estrellas de valoración en artículos.
- **Tinta de Video** (#000000): fondo de letterboxing detrás de vídeos (`background: #000` en `video`) — negro puro permitido solo aquí.
- Las veladuras (overlays `rgba(...)`) deben derivar siempre de estos tokens, nunca introducir nuevos tintes.

### Tema oscuro (via `[data-theme='dark']`)
Inversiones planas del mismo carácter: Tinta Café → durazno claro (#f1c8ae), Terracota → terracota luminosa (#e7a27b), Papel → chocolate profundo (#211816), Arena → barro (#30231f), Borde → cobre oscuro (#59443b), Sobre-Tinta → chocolate (#211816). El banner se atenúa con `brightness(0.48)`.

### Named Rules
**La Regla del Papel.** Nunca blanco puro como fondo: el fondo es Papel Crema (#fffdfb) o Arena (#f8f1ec). El blanco puro (#ffffff) existe solo como `superficie-fuerte` puntual. La calidez del papel es la identidad.
**La Regla de la Terracota Escasa.** El acento terracota no pinta superficies grandes: vive en enlaces, eyebrows (0.75rem uppercase), bordes estructurales (izquierdo 2px, inferior 2px; superior 4px solo en year-cards) y estados de foco. Si aparece más del ~10% de una pantalla, algo está mal.

## Typography

**Display Font:** Source Serif 4 (auto-alojada, woff2 400–700; fallback Iowan Old Style, Palatino, Georgia, serif)
**Body Font:** system-ui stack (Segoe UI, Roboto, Helvetica Neue, Arial)
**Mono Font:** ui-monospace stack (SFMono-Regular, Menlo, Consolas)

**Character:** Serif editorial con autoridad imprenta para todo lo que se lee; sans de sistema silenciosa para todo lo que se opera. El contraste entre ambas ES la jerarquía.

### Hierarchy
- **Display** (600, clamp(2.2rem, 5vw, 3.4rem), 1.16): h1 de página (`.page-heading h1`), con letter-spacing -0.01em.
- **Title** (600, clamp(1.4rem, 3vw, 1.7rem), 1.16): títulos de tarjeta y de artículo (`.post-title-link`, destacados).
- **Heading** (600, serif, 1.16): h2–h4; en artículo, heredan color Tinta Café.
- **Lectura** (400, 1rem, 1.7): cuerpo del artículo, serif, máximo 68ch (`.article-content`). Descripciones de tarjeta también serif.
- **Cuerpo** (400, 1rem, 1.7): UI, metadatos, nav, pie — sans.
- **Etiqueta** (700, 0.75rem, letter-spacing 0.12em, uppercase): eyebrows y badges.
- **Mono** (1rem): `code/pre/samp/kbd` dentro del artículo.

### Named Rules
**La Regla de la Medida (68ch).** El texto de lectura nunca excede `--ancho-lectura: 68ch`. Es la diferencia entre un artículo y un muro de texto.
**La Regla Serif/Sans.** Serif = contenido (títulos, lectura). Sans = infraestructura (UI, metadatos, formularios). Nunca al revés. Controles dentro del artículo (`button/input/select/textarea`) vuelven a sans explícitamente.

### Rampa auxiliar consolidada (24/10/2026)
Los tamaños de texto auxiliar se consolidaron a **3 pasos reales**: `micro` (0.75rem — eyebrows, chips, fechas, flechas), `meta` (0.85rem — breadcrumbs, TOC, meta de tarjetas, labels de formulario) y `ui` (0.95rem — párrafos de UI, footer, comentarios). La rampa absorbió 12 tamaños casi indistinguibles (0.62–0.92) con 48 reemplazos verificados por script; `0.75rem` es también el piso de legibilidad (11.2px ≥ 11px). Por encima: `frase`/`lede`/`lede-alta` (1.05–1.15) y titulares serif (1.25–2.3 + clamp 2.1–2.7), sin cambios.

## Layout

Contenedor único de **850px** máximo, centrado, con `padding-top: 95px` (reserva de la nav fija) y 1.5rem laterales (1rem en móvil ≤560px). Ritmo vertical por márgenes de 1–2rem; tarjetas de destacados con gap extra (1.5rem).

- **Portada**: banner a todo el ancho del contenedor (max-height 360px, object-position center 8%), destacados en grid de 2 columnas, «Artículos anteriores» en **filas horizontales con miniatura de 96px** (texto a la derecha, `object-fit: contain`).
- **Carruseles**: bloques de 2 tarjetas con scroll-snap, dots de 10px (target invisible 44px) y botones circulares de 2.75rem.
- **Breakpoints**: 980px (grid se mantiene 2col pero se ajusta), 560px (todo a 1 columna; controles de texto ocultos; TOC compacto).
- **TOC flotante**: fijo a la derecha del contenedor (`right: max(1rem, calc((100vw - 850px)/2))`).
- Impresión: nav y breadcrumbs ocultos, enlaces sin color (`.article-content a { color: inherit }`).

## Elevation & Depth

Sistema de **capas cálidas**: la profundidad la dan los bordes planos de 1px casi siempre; la sombra es un refuerzo ambiental reservado a superficies flotantes (tarjetas, paneles TOC, modales). Sombras teñidas del marrón de la paleta, nunca grises neutros.

### Shadow Vocabulary
- **Ambiente de tarjeta** (`box-shadow: 0 18px 40px rgba(36, 19, 15, 0.08)` — `--shadow-soft`): tarjetas post/destacado, panel TOC, toggle TOC. En oscuro: `rgba(0, 0, 0, 0.35)`.
- **Modal** (`0 20px 60px rgba(36, 19, 15, 0.24)`): modal de autor.
- **Pestaña superior** (`0 -3px 12px rgba(0, 0, 0, 0.16)`): «Volver arriba» (sombra hacia arriba, única del sistema).

### Named Rules
**La Regla Plano-por-Defecto.** Las superficies descansan planas; la sombra aparece solo en flotación (tarjeta en lista, panel, modal). Nunca sombra decorativa en elementos en línea.

## Shapes

Lenguaje de esquinas suaves pero contenidas: radios de 4px (inputs, toggle tema) → 5px (buscador) → 6px (media, cierre de modal) → 8px (tarjeta post, empty state) → 10px (tarjeta destacado) → 12px (modal) → pill 999px (badge, TOC-toggle).

Bordes estructurales de acento: **izquierdo 2px** terracota (tarjetas post, callouts, panel TOC, about-quote), **superior 4px** terracota (year-cards), **inferior 2px** cobre (page-heading, author-profile). Borde base: 1px `--color-border`.

Media: radio 6px, `object-fit: contain` SIEMPRE — el contenido manda sobre el marco. Firma geométrica única: la pestaña «Volver arriba» con cúpula (`border-radius: 50% 50% 0 0 / 100% 100% 0 0`) anclada al borde inferior del pie.

## Components

### Tarjetas de artículo (`.post-item`)
- **Shape:** radio 8px (10px en destacado), padding 2rem (1.2rem móvil), acento izquierdo terracota 2px vía `box-shadow: inset` (suavizado 23/10/2026 tras critique — el inset respeta el radio de la esquina y evita el patrón "side-tab").
- **Background:** Arena (#f8f1ec); en tema oscuro, `superficie-fuerte`.
- **Shadow:** `--shadow-soft`.
- **Estados:** `[hidden]` fuerza `display:none !important` (hereda `display:grid`).

### Tarjeta destacada (`.featured-card`)
- Gradiente diagonal Arena→Papel, borde 1px, radio 10px, `--shadow-soft` (el acento vive en el eyebrow y el gradiente; el borde superior de 4px se retiró el 23/10/2026 tras critique). Título en serif Title, eyebrow de categoría en terracota uppercase.

### Badge destacado (`.featured-badge`)
- Píldora sólida Tinta Café, texto Sobre-Tinta, Etiqueta 0.7rem uppercase, letter-spacing 0.04em.

### Buscador (`.blog-search-input` / `.blog-author-filter`)
- Fondo Papel, borde 1px, radio 5px, altura 2.1rem, **font-size 1rem** (evita el zoom iOS). Foco: borde terracota + outline suave `color-mix(…25%)`.

### Controles de carrusel
- Dots: 10px, borde 1.5px Tinta Café; activo relleno terracota; target táctil ampliado a 44px con `::after`. Botones: circulares 2.75rem, fondo Arena, foco/hover terracota; deshabilitados `opacity: 0.35`.

### TOC flotante (`.toc-toggle` / `.toc-panel`)
- Toggle: píldora Arena con `--shadow-soft`. Panel: Arena, borde 1px + izquierdo 2px terracota, ancho `min(280px, 100vw - 2rem)`.

### Modal de autor (`.author-modal`)
- Overlay `rgba(36, 19, 15, 0.48)`, tarjeta Papel radio 12px, sombra modal; cierre sólido Tinta Café radio 6px.

### Firma: «Volver arriba» (`.back-to-top`)
- Pestaña-cúpula sólida Tinta Café (7.5rem × 3.75rem) que asoma del pie con margen negativo; hover terracota + `translateY(-2px)`; active con `superficie-fuerte`. Componente insignia del sistema.

### Callouts MDX (`.mdx-callout`)
- Fondo Arena, borde izquierdo 2px (terracota por defecto; verde nota / ámbar advertencia), título en Tinta Café.

## Do's and Don'ts

### Do:
- **Do** mantener títulos y lectura en Source Serif 4 y la UI en sans de sistema.
- **Do** mostrar imágenes y videos completos (`object-fit: contain`, radio 6px) — regla de la casa.
- **Do** usar foco visible de 3px terracota con offset 3px en todo elemento interactivo.
- **Do** garantizar objetivos táctiles ≥44px (dots, toggles, triggers).
- **Do** resolver el tema oscuro solo con las variables de `:root[data-theme='dark']`.
- **Do** respetar la medida de 68ch en cualquier texto de lectura nuevo.

### Don't:
- **Don't** recortar imágenes con `object-fit: cover` en tarjetas o artículo.
- **Don't** introducir gradientes morados, glassmorphism, neón ni el look startup (anti-referencia confirmada).
- **Don't** usar blanco puro de fondo ni grises neutros en bordes: son Papel y Borde Cobre.
- **Don't** pasar de ~200ms en transiciones de UI ni animar acciones de teclado.
- **Don't** pintar superficies grandes de terracota: es acento, no fondo.
