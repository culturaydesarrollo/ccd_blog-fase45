# Impeccable en el blog CCD — document · critique · hooks

**Estado**: abierto · **Inicio**: 2026-10-23 · **Última**: 2026-10-24
**Fecha**: 2026-10-23 → 2026-10-24
**Alcance**: instalación y ejecución del stack de diseño anti-slop (Impeccable) sobre el sistema de diseño del blog; pieza editorial Fourier en «Acerca de».

## Qué se hizo

### 1. `impeccable document` → `DESIGN.md` + `.impeccable/design.json`

Entrevista de dirección con el autor (2 rondas). Decisiones del autor:

- **Estrella Norte**: «Edición cultural y del desarrollo social».
- **Voz**: editorial cálido impreso. Anti-referencia explícita: look startup/tech (gradientes morados, glassmorphism, neón).
- **Colores con nombre**: `#24130f` = «Tinta Café Institucional» · `#9a5f3f` = «Terracota del Taller».
- **Elevación**: capas cálidas (sombra suave solo en flotación; planos por defecto).
- **Componentes**: sereno y contenido-primero.

`DESIGN.md` (raíz) documenta frontmatter (12 colores, 6 roles tipográficos base, radii, spacing, 6 componentes) + 8 secciones canónicas con reglas nombradas (Regla del Papel, Terracota Escasa, Medida 68ch, Serif/Sans, Plano-por-Defecto). Sidecar `.impeccable/design.json`: colorMeta (nombre/display/tonal ramp/valor oscuro), shadows, motion, breakpoints, 7 componentes con HTML/CSS autocontenidos `ds-*`, narrative.

### 2. `impeccable critique` (motor `impeccable detect`)

Primer pase: 12 anti-patrones + 131 avisos sobre 42 archivos. Tras entrevista de decisión con el autor:

- **Firma «side-tab»** (border-left 5px terracota): el autor eligió **suavizar** → 2px y, donde el detector seguía (tarjetas), conversión a `box-shadow: inset 2px 0 0` (respeta el radio, misma estética, fuera del patrón). Global, callouts, TOC, categorías, tags, ContactForm, acerca.
- **Borde-top sobre esquinas redondeadas** (featured-card, about-sections): el autor eligió **quitar** el border-top.
- **Drift tipográfico**: el autor eligió **documentar** → escalones reales añadidos al frontmatter (0.62–2.3 + clamp) con nota de consolidación pendiente (7 tamaños 0.8–0.95 a unificar en próxima pasada).
- **Colores sin token**: `#147a3c`, `#b42318`, `#f4b740`, `#98a2b3`, `#718096`, `#000` (video letterbox) → tokenizados en `colorMeta` y documentados en Colors.
- **Legibilidad real** (motor HTML sobre `.astro`): «ver bio» (0.62rem) y grupo legal (0.68rem) en `[slug].astro` → subidos a **0.75rem** (piso de 11px).
- **Falso positivo**: `src/lib/postImage.ts` (regex literal) → ignore acotado vía `impeccable hooks ignore-value` con razón.

**Resultado final**: `detect` sobre `src/` → **0 anti-patrones, 0 avisos**. `npm run validate` (tsc + build) → **111 páginas, verde**.

### 3. `impeccable hooks on` + config

- `hook.enabled: true` en `.impeccable/config.json` (consentimiento local registrado).
- `detector.extensions`: motor **HTML para `.astro`** (reglas de elementos reales: tiny-text, contraste) — habilitó la detección de los 2 textos <11px.
- Nota: en OpenCode el hook no se auto-dispara (harness no soportado); ejecutar `detect` a mano al terminar tandas de edición UI. En Claude Code/Codex/Cursor sí será automático.

## Lecciones

- El detector de Impeccable es **regex sobre CSS/JS y HTML parseado**; en CSS inline de Astro y en el HTML parsea el árbol pero resuelve mal las herencias (muchos `rgb(0,0,0)` son artefactos de herencia, no drift real).
- `impeccable` (CLI) no tiene subcomando `critique` — el flujo es en sesión usando `detect` + criterio; la referencia está en `~\.config\opencode\skills\impeccable\reference\critique.md`.
- La firma de identidad (side-tab) puede defenderse con ignore documentado; el autor prefirió suavizar — decisión respetada y registrada.

## Pendientes

- [x] ~~Consolidar rampa tipográfica~~ → **hecho 24/10/2026**: 12 tamaños (0.62–0.92) → 3 pasos (micro 0.75 / meta 0.85 / ui 0.95), 48 reemplazos por script, build verde + detect 0/0, commit `0e103a3`.
- [x] ~~Migrar `#98a2b3`/`#718096` a Neblina~~ → **hecho 24/10/2026**: 4 usos (placeholders ContactForm/SubscribeWidget + meta categorías/tags) → `var(--color-muted)`; grises eliminados de `colorMeta` y `DESIGN.md`, commit `0e103a3`.
- [x] Monitoreo RackNerd Black Friday 2026 → **loop lanzado 24/10/2026** (ver siguiente sección).

## Loop de monitoreo RackNerd BF 2026 (lanzado)

- Script: `C:\Users\kutzm\AppData\Local\Temp\opencode\monitoreo-racknerd-bf.ps1` (+ `.log` y `-resultado.txt` junto a él).
- Cadencia: chequeo diario hasta 20-nov; cada 3 h desde entonces (ventana BF). Deadline 2026-12-06.
- Condición de parada: plan anual ≤ $20 en `racknerd.com/specials/` (parser calibrado contra la página viva: 5 precios /yr detectados, mín. $21.99 → sin falso disparo). No compra: escribe resultado + popup, y sale.
- Si la máquina se reinicia, el proceso muere; relanzar el .ps1 retoma el monitoreo (el log es el state file).

## Animaciones del blog (24/10/2026)

### Auditoría de rendimiento (skill `animation-performance`) → commit `0e619e1`

Inventario: 19 transiciones CSS, 0 keyframes, 0 JS de animación (sin rAF/observers), sin `will-change` ni blur. Fixes aplicados:

- **Carrusel**: retirada `transition: height 0.3s` (`fitHeight()` corre por evento scroll → mantenía layout+repaint en cada frame durante el swipe). Queda `scroll-behavior` nativo.
- **3× `transition: all`** en `[slug].astro` (.tag-item, .pagination-btn, .history-btn) → enumeradas a las propiedades que sus hover cambian realmente.
- Transición muerta de `.author-trigger img` fuera; `background`→`background-color` en `.carousel-dot`; guard `reduced-motion` en el toast de ContactForm; nota documental en `.home-banner` brightness.

### Nuevas entradas (decisión del autor: A+B+C) → commit `1f92679`

Técnica: `transition-behavior: allow-discrete` + `@starting-style` — todo CSS puro, **sin tocar JS** (el sitio abre/cierra con el atributo `hidden`). Degradación limpia: navegador sin soporte → ignora los at-rules → comportamiento actual exacto. ≤200ms, token `ease-estandar`.

- **A · Modal de autor**: 1 edit en `global.css` cubre las 5 instancias — veladura en fade + tarjeta `translateY(8px)→0`.
- **B · Paneles**: desplegable «Explorar» (BlogNavbar, la base hereda al override móvil), panel TOC y resultados de búsqueda global — fade + `translateY(-4px)→0`.
- **C · reduced-motion global**: el blanket **ya existía** en `global.css` (línea 67) — solo se completó con `animation-iteration-count: 1` y `scroll-behavior: auto !important`.

Verificación: build verde (111 páginas) + `@starting-style: 4` y `allow-discrete: 4` confirmados en el CSS de `dist/` (sobreviven al bundling de Astro, incl. el scoped de BlogNavbar) + `detect` 0/0. Documentación: sección **Motion** nueva en `DESIGN.md` + 2 tokens nuevos en el sidecar (`entrada-panel`, `entrada-modal`).

Opciones no seleccionadas: D (filtro de portada), E (pulso de estrellas), F (View Transitions — merece sesión propia con auditoría de scripts).

## Pieza editorial Fourier («Acerca de») → commit `6c2aa95`

Origen: reel de @epicycle.studio (21-oct-2026): mapa trazado por epiciclos con error final 0,05 %. Regla del taller: canvas 2D nativo, **sin p5.js** (blog sin framework JS).

**Matemática (máxima fidelidad del dato):** contorno Natural Earth 10m (dominio público) → Douglas-Peucker → remuestreo uniforme por longitud de arco a **1000 puntos** → corrección `cos(lat)` → normalizado [-1,1]. Error por identidad de **Parseval** (O(1), sin redibujar): K=1 → 14,99 %; K=90 (default) → 0,40 %; K=350 → 0,086 %. Datos en `src/data/colombia-outline.ts`.

**El lema:** «¡Mayor compromiso, mejor país!» — **primera aparición en el blog**, encabezado de la sección nueva en `acerca.astro`. La metáfora es literal: 1 término = óvalo = intención sola; cada término corrige el trazo; K=350 → el país casi exacto. Prosas de la metáfora en la sección; `figcaption` solo técnico (Natural Earth + Parseval). Espacio fino antes del `%`.

**Componente** `src/components/FourierMap.astro`: canvas responsive (DPR + ResizeObserver), colores desde tokens css (MutationObserver en `[data-theme]`), ≤48 epiciclos por energía con decaimiento, slider de términos (1–350) con **error en vivo**, ciclo 15 s + pausa 1,1 s, **DFT deferido a IntersectionObserver** (0 coste fuera de vista), `prefers-reduced-motion` → trazo estático completo, `<noscript>`.

**Verificación:** `npm run validate` → verde 111 páginas · `impeccable detect dist` → **cero hallazgos de la pieza** (los 2 de `dist/acerca/` son preexistentes: falso positivo del simulador de hover + eyebrow-chip decidido).

### Ajuste: compromiso colectivo (habitantes, cursor exigente, arranque aleatorio, pulgar humano) → commit `042ac69` (push a `fase45/fase-45`)

Petición del autor: la metáfora del compromiso debe sentirse en el recorrido. Cuatro cambios en `FourierMap.astro`:

- **Términos en habitantes**: cada término = **150.559,86 habitantes** (52.695.952 repartidos entre los 350 posibles). Salida `≈ N habitantes` bajo el contador (`Intl.NumberFormat('es-CO')`) y en `aria-valuetext`. Al tope, K=350 suma **exactamente 52.695.952** — el país entero.
- **Cursor exigente**: mapeo `K = 350^(x^2.39)` (x = 0–1). El punto donde el croquis se reconoce (K=19, error 2,03 %) cae **ahora en el 75 %** del recorrido, no en el 50 %. Tabla leída en vivo: p=0 → K=1 (14,99 %); p=500 → K=3 (12,01 %); p=750 → K=19 (2,03 %); p=1000 → K=350 (0,09 %). `<datalist>` recalculado a las posiciones de octava del nuevo mapa. Teclado ahora dobla/mitica K y reconvier te a posición (antes sumaba posiciones del mapa viejo).
- **Arranque aleatorio**: cada visita parte entre **15 y 99 términos** (`K_INICIAL`), distinto en cada carga.
- **Pulgar humano**: el `::-webkit-slider-thumb`/`::-moz-range-thumb` deja de ser botón; es una **figura caminante** (máscara SVG teñida con `--color-secondary`, respeta el tema). Pista custom en track WebKit/Gecko.

Verificación en vivo (`/acerca/`): aleatorio 52 en una carga · K=19 exacto a p=750 · habitantes cuadran (K=350 → 52.695.952) · K=1 dibuja solo una elipse (mensaje: 1 término = óvalo, sin país). `npm run validate` verde 111 pág · `impeccable detect dist` **138 → 138, cero nuevos**.

### Ajuste previo: cursor logarítmico por octavas → commit `f16d262`

Problema detectado al verla en vivo: con recorrido lineal, **toda la distorsión vivía amontonada en los primeros píxeles** — el 76 % del cursor (K=90→350) apenas movía el error de 0,40 % a 0,086 %. Petición del usuario: «mayor distorsión con valores menores del 50 %» + hacer visible el costo acumulado.

- **Mapeo** `K = 350^(p/1000)` (p = posición 0–1000): recorrido igual por octava. Primer cuarto → K=4 (**8,03 %**), mitad → K=19 (2,03 %), techo → 350 (0,086 %). La segunda mitad entera cuesta 2 % → 0,09 %: el «más costoso» sentido en el brazo.
- **`<datalist>`** con las 10 posiciones de octava (0, 118, 237 … 1000): tics naturales que comunican la no-linealidad sin una palabra.
- **Teclado**: flechas saltan una octava (118 de posición = dobla/mitad los términos). Verificado en vivo: 90→179→350 / 175→88→44→22.
- **A11y**: `aria-valuetext`/`aria-valuenow` en **términos** («19 términos», «1 término»), no la posición cruda. Contador a `K / 350` (min-width 9ch, sin salto). Figcaption actualiza la escala («a mitad de recorrido, 19 términos; al final, 350»).
- Verificación: build verde 111 pág · detect **138 → 138, cero nuevos** · posiciones p=0/500/1000 leídas en vivo = tabla calculada.

## Pendientes al retomar (pausa 2026-10-24)

**Decisiones ya tomadas, sin ejecutar**
- [x] **Opción D (filtro por categoría en portada)** — hecho 25/10/2026, **sin commitear**: select de categorías junto al de autor; `data-category` en las 3 plantillas de tarjeta (minúsculas unidas por `|`); `applyFilters` filtra por categoría; se extiende a los resultados globales de búsqueda (`renderGlobalResults` con `selectedCategory`). Verificado en vivo: 20 categorías, «arte» → 1 tarjeta correcta, quitar → 14.
- [ ] Opción **E (estrellas en nocturno)** — **NO ejecutada**. El `global.css` actual no tiene ningún `::before`/`::after` de estrellas bajo `[data-theme='dark']`. El resimen de la conversación la daba por implementada, pero no llegó al código.
- [ ] Opción **F (View Transitions)** — **iniciada, INCOMPLETA, sin commitear**: `Layout.astro` ya tiene `<ClientRouter />` + script `astro:after-swap` que re-aplica `ccd-theme`/`ccd-text-size`. **Pero falta re-anclar los ~12 scripts a `astro:page-load`** (AbortController para binds document/window; quitar `DOMContentLoaded` de [slug] history-box) y evaluar `data-astro-reload` en las redirect pages. **Con el router puesto y los scripts sin re-anclar, la navegación cliente rompería carrusel, modales, búsqueda y theme-toggle** — no commitear ni publicar hasta cerrarlo.
- [ ] Consolidación de drift tipográfico: 7 tamaños 0.8–0.95 → unificar (quedó anotado en la entrevista, no ejecutado).

**En espera de recurso/decisión externa**
- [x] Push de los commits a `fase-45` — **hecho 25/10/2026** (`git push fase45 fase-45` → `042ac69`). ⚠️ Hay **dos remotos**: `fase45` = `ccd_blog-fase45.git` (este blog, el que interesa) y `origin` = `ccd_blog.git` (blog madre, otra rama). Verificar siempre contra `fase45/fase-45`, no `origin/fase-45`.
- [ ] E2E de `marcador-ar` con el Vivo V2436 — sin teléfono: al conectar, `usbipd attach --wsl` (PowerShell admin) + `adb install -r`, guiado por `marcador-ar/ESTADO-SESION.md`.
- [ ] Decisión Serv00 ($0) vs VPS (~$36/año) — datos del loop el 27-nov.

**Verificación al retomar**
```bash
cmd /c npm run validate
cmd /c npx impeccable detect --no-advisory dist
cmd /c git log --oneline -8
```
Dev server (si sigue vivo): `http://localhost:4321/acerca/` — revisar la pieza Fourier arrastrando el cursor.

## Commits

- `PRODUCT.md` (init): `81f0a7a`.
- Sistema de diseño + critique: `23e218e` (10 archivos, sin push).
- Consolidación de rampa + grises a Neblina: `0e103a3` (14 archivos, sin push).
- Auditoría de animación + fixes: `0e619e1` (3 archivos, sin push).
- Entradas de modal/paneles + reduced-motion global: `1f92679` (4 archivos, sin push).
- Pieza Fourier en «Acerca de»: `6c2aa95` (3 archivos, +452, sin push).
- Cursor logarítmico por octavas: `f16d262` (1 archivo, +54/−11, sin push).
- Push solo con aprobación explícita (`git push fase45 fase-45`).
