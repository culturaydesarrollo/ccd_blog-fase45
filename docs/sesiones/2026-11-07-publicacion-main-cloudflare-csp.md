# Publicación en main, rama de Cloudflare Pages y CSP del visor

**Estado:** cerrado · **Inicio:** 2026-11-07 · **Última:** 2026-11-12

## 2026-11-07 — Analítica gratuita: Cloudflare Web Analytics + Microsoft Clarity

**Qué se hizo** — Activar analítica **totalmente gratuita** en el blog:
Web Analytics de Cloudflare (cuantitativa) ya estaba activa sin que lo
supiéramos, y se añadió Microsoft Clarity (cualitativa: heatmaps y
grabaciones de sesiones) como complemento.

### Contexto y decisión

El usuario pidió analítica gratis de Cloudflare. Se compararon las opciones
de `free-for.dev` (Cloudflare WA, GoatCounter, Microsoft Clarity) y se
eligió: **Cloudflare WA** como base (cero servicios nuevos, mismo panel) y
**Clarity** como complemento para entender *cómo* se usa el visor 3D, que
las métricas de página vistas no explican.

### Hallazgo: el blog ya contaba visitas (falso negativo de `curl`)

- La zona tiene un sitio Web Analytics con **setup automático** (id
  `15de5db4…`, 22 días de vida) en `culturaydesarrollo.org`.
- En plan **Free el beacon se inyecta en todos los subdominios** de la
  zona, incluido `blog.culturaydesarrollo.org` → el blog ya estaba midiendo
  (65 vistas / 49 visitas en 24 h al revisar).
- **Lección:** `curl` devuelve HTML sin beacon porque Cloudflare no inyecta
  a bots/UA no navegadores. La verificación fiable es un navegador real
  (beacon `beacon.min.js/vce701823…` + POST `/cdn-cgi/rum` en `performance`).
- Se creó por error un sitio manual para el blog (id `2972ea97…`,
  "Instalación de snippet de JS"): **redundante y en 0 vistas**, se eliminó;
  quedó 1 solo sitio con "Configuración automática".
- La API de Web Analytics no funciona con el token actual (404
  `code 10001`, falta permiso `Web Analytics: Edit`): todo por panel.

### Clarity (proyecto `za9f4el211`; la etiqueta `3j9kkblzoj` fue errónea)

- Snippet **oficial sin modificar** en `src/layouts/Layout.astro`
  (`is:inline`, afecta a todas las páginas) — commit `98c103d`.
- Elegido el sector "Ciencia, ciencias sociales y otros".

> **Corrección 2026-11-10**: la etiqueta usada en su momento (`3j9kkblzoj`)
> pertenecía a **otro proyecto que no está en la cuenta** (config de test,
> `track:false`, originado en el portal antiguo `app.clarity.ms`, hoy
> retirado — NXDOMAIN en el DNS autoritativo). El proyecto real *Blog Cultura
> y Desarrollo* usa como tag el propio ID **`za9f4el211`**. El blog se
> corrigió en `6eddeea`: **sin este cambio Clarity nunca recibió datos del
> sitio** (el proyecto quedaba eternamente en "¡Casi terminamos!"). La CSP no
> necesitó cambios: `*.clarity.ms` ya cubre `h.clarity.ms` (el nuevo
> endpoint de recolección).

### CSP: ampliación obligatoria (sin ella Clarity falla en silencio)

La CSP vive en la Transform Rule `a2006c83…` del panel, no en el repo.
Como la API rechaza `PUT` con el token (`code 10405`), se editó por panel
(Rules → Reglas de transformación de encabezados de respuestas). Cambios:

- `script-src`: `+ https://www.clarity.ms https://scripts.clarity.ms https://*.clarity.ms`
- `connect-src`: `+ https://*.clarity.ms https://c.bing.com`
- `img-src`: `+ https://c.clarity.ms https://c.bing.com`

`default-src` **no basta** (si existe `script-src`/`connect-src`, el fallback
no aplica). Clarity rotsubdominios de una letra (`a.clarity.ms`…`z`), por
eso el wildcard.

### Verificación en vivo

- `validate` (typecheck + build) y **15/15 tests** en verde antes del push.
- Push a `main` (`98c103d`) → Pages **deploy success** (snippet en producción
  en <1 min).
- Navegador real: tag `www.clarity.ms/tag/3j9kkblzoj` 200,
  librería `scripts.clarity.ms/0.8.75/clarity.js`, `window.clarity` función,
  **`l.clarity.ms/collect`** respondiendo, beacon de Cloudflare intacto y
  **consola sin errores ni avisos** (cero violaciones de CSP).

### Lecciones

- Un chequeo por `curl` sobre beacon/inyección perimetral da falsos
  negativos: Cloudflare decide inyección por UA.
- Antes de crear un sitio de analítica, comprobar si el setup automático de
  la zona ya lo cubre (plan Free = todos los subdominios, 0 reglas).
- "Funciona sin CSP" no sobrevive al contacto con una CSP estricta: añadir
  Clarity exige tocar la Transform Rule, y si no, el fallo es **silencioso**
  (página bien, dashboard vacío).

## 2026-11-07 — Un solo branch y el visor publicado de verdad

**Qué se hizo** — Consolidación de `main` como única rama de trabajo y
publicación, cambio de la rama de producción en Cloudflare Pages y arreglo de
la textura del modelo 3D en el dominio en vivo.

### Contexto

El sitio se publica con **Cloudflare Pages** (proyecto `ccd-blog-fase45`,
cuenta `bb1693d0…`, zona `culturaydesarrollo.org`), no con GitHub Pages: ese
está configurado pero con certificado `bad_authz` y el DNS ya no apunta a él.
La rama de producción del proyecto era `fase-45`, por lo que `main` quedaba
fuera del despliegue aunque acumulara todo el trabajo.

### Rama única (`main`)

- `main` se creó desde `fase45/main` (`7726807`) y se fast-forward hasta
  incluir todo el trabajo de `fase-45` (visor, enlace del ensayo, estilos).
- `AGENTS.md` fija la convención: *"Rama de trabajo y de publicación: `main`.
  Todo cambio se integra y se empuja a `main`; no se publica desde ramas de
  fase."* (commit `6269cae`).
- Commits de la sesión previa en la portada y el visor: `0176bab`
  (sección "Pieza interactiva") y `c3691a1` (soporte AR y `title` del botón).

### Cloudflare Pages: rama de producción

- API token con permisos acotados: `Cloudflare Pages: Edit`,
  `Account Settings: Read`, `Zone: Read`, `Transform Rules: Edit`.
  **Primer intento fallido:** el token se creó en una cuenta nueva y vacía
  (0 zonas, 0 proyectos); el sitio vive en otra cuenta del mismo usuario.
- `PATCH …/pages/projects/ccd-blog-fase45` → `production_branch: main`.
- Despliegue de producción forzado sobre `main@6269cae`: **success** en ~15 s.
- Verificado en vivo: portada con la sección `visor-section`/"Pieza
  interactiva", visor con el párrafo AR corregido y `btnAR.title`, y el
  callout `article-visor` del ensayo intacto.

### CSP: textura del modelo en producción

La cabecera no está en el repo: la añade una **Transform Rule de la zona**
(`CCD response headers`, regla `a2006c83…`, fase
`http_response_headers_transform`, expression
`(http.host eq "blog.culturaydesarrollo.org")`). Por eso el modelo se veía
blanco solo en el dominio y con textura en local y en `*.pages.dev`.

- **Causa raíz:** `THREE.GLTFLoader: Couldn't load texture blob:…` +
  error de WebAssembly. El GLB tiene su textura PNG 2048×2048 embebida
  (verificada; sin draco/meshopt), pero la CSP bloqueaba `blob:` en `img-src`
  y `connect-src`, y `'wasm-unsafe-eval'` en `script-src`.
- **Cambio:** solo se añadieron esos tres tokens a la CSP del blog; el resto
  de directivas quedaron iguales. La CSP de `culturaydesarrollo.org` (otra
  regla) no se tocó.
- **Verificación:** cabecera en vivo con los tres cambios, página del visor
  con `model-viewer` `loaded`/`modelIsVisible` true, **cero** errores de
  consola y captura con la textura de madera visible.

### Lecciones

- Antes de concluir "Cloudflare publica la rama X", mirar
  `source.config.production_branch` y `canonical_deployment` en la API: la
  confusión venía de asumirlo por el contenido en vivo.
- Un token de API nace en la cuenta que tenga abierta la sesión del
  navegador: verificar `GET /accounts` y `GET /zones` antes de usarlo.
- Una CSP en vivo con la página rota y el repo limpio siempre es edge
  (Transform Rules / `_headers` de otro servicio): comparar el mismo
  recurso en `*.pages.dev` (sin la regla de la zona) y en el dominio
  personalizado aísla al culpable en una llamada.

### Pendiente

- ~~Los botones del visor (rotación, zoom, compartir, pantalla completa, AR)
  siguen sin tests automatizados de interacción.~~ **Cerrado el mismo día**
  (ver abajo).

## 2026-11-07 — Tests automatizados de interacción del visor

**Qué se hizo** — Suite Playwright con 13 tests para los controles del visor
3D, que cierra el pendiente de la sesión anterior. (También se cerró el otro
pendiente: la rama huérfana `fase45/fase-45` se borró remota y local, tras
confirmar 0 commits únicos no integrados.)

### Infraestructura

- `@playwright/test` con `channel: 'chrome'`: usa el Chrome del sistema,
  sin descargar Chromium.
- `playwright.config.ts` sirve el **build real** (`npm run build &&
  npm run preview` sobre `dist/`), igual que Cloudflare Pages, no el dev server.
- `npm test` en `package.json`; documentado en `AGENTS.md`.
- Artefactos de Playwright (`test-results/`, `playwright-report/`) ignorados.

### Causas raíz que los tests destaparon

1. **El teclado era inalcanzable** (bug real, `fix de90b27`): el manejador de
   flechas/`+`/`-`/`0` vive en `#vitrina`, pero ni la sección ni el
   `model-viewer` tenían `tabindex` → con foco real el handler jamás se
   disparaba. Fix: `tabindex="0"` en `.vitrina` + anillo `focus-visible`.
2. **`navigator.share` cuelga en headless** con gesto de usuario (sin gesto
   rechaza al instante): el `await` no vuelve y el fallback de portapapeles
   no se alcanza a probar. Los tests de compartir stubbean las tres ramas
   (sin share / share rechaza / share resuelve) con `addInitScript` sobre
   `Navigator.prototype.share`.
3. **El portapapeles es del sistema**, no del contexto de navegador: lo pisan
   tests en paralelo. Los tests de compartir van en `mode: 'serial'`.

### Cobertura (13 tests, todos en verde)

Carga y dimensiones · auto-rotación (`aria-pressed` + `mv.autoRotate`) ·
zoom con topes 0,5×–2,2× · centrar con aviso y retorno de radio · AR
deshabilitado con `title` explicativo (Firefox/iPhone/`.usdz`) · compartir en
sus tres ramas · pantalla completa (`aria-label` de entrada/salida, con
fallback si el entorno la rechaza) · teclado (flechas giran, `0` centra,
`+`/`-` hacen zoom).

### Lecciones

- Un test que no puede enfocar su objetivo suele revelar un bug de
  accesibilidad, no un problema del test.
- APIs de plataforma que abren UI del sistema (`navigator.share`,
  pantalla completa) no son testeables en headless: stubbear la entrada y
  ejercitar las ramas del código, en vez de aflojar la aserción.
- `npm run validate` + `npm run test` en verde antes de cada push.

## 2026-11-12 — Análisis de métricas (zona + WA + Clarity) e investigación del beacon

**Qué se hizo** — Analizar juntas las métricas de producción (Cloudflare
zona, Web Analytics y Microsoft Clarity) y resolver la discrepancia de
conteo entre la zona (336 visitas/24 h) y el beacon (5 visitas/24 h).

### Datos capturados (2026-11-12; cifras redondeadas del panel)

**Zona `culturaydesarrollo.org`, 24 h** — 4,26k solicitudes (↗279,4 %),
52,91 MB (↗157,6 %), **354 pageviews / 336 visitas** (↗39/46 %), cache
hit 19,04 %, 5xx 0,12 %. Desglose: hosts blog 271 · apex 75 · panel 8;
top UA **AhrefsBot 212**, meta-webindexer 14, SemrushBot 4; rutas `/` 95
y páginas internas con 5-6 hits uniformes (firma de rastreo).

**Web Analytics (beacon, `excludeBots=Yes`), 24 h** — 5 visitas / 6
pageviews: Colombia 100 %, referentes directo 4 · `culturaydesarrollo.org`
1, rutas `/` 4 · `/visor/un-clavo/` 1, Safari 2 / Firefox 1 / Chrome 2,
Desktop 4 / Mobile 1.

- **Core Web Vitals 24 h:** LCP P75 **916 ms** (P50 803 / P90 2652; 75 %
  buena, 25 % mejorable) con TTFB 1155 ms = 59 % del LCP; **INP** con un
  elemento a **1440 ms** (`div.blog-container.visor-page > header… >
  span.meta-author`; retardo de entrada 1361 ms = 94 %, procesamiento 7
  ms) y 33 % mala; CLS 100 % buena; carga total 1073 ms.

**Clarity (`za9f4el211`), últimos 3 días — 4 grabaciones:** 2 en
`/visor/un-clavo/` (ChromeMobile 00:38/4 clics; SamsungInternet 00:25/2
clics), 2 en `/pagina/2/` (Safari PC 03:10 y 29:58, 0 clics); todas
Colombia, dos con referente `culturaydesarrollo.org`.

### Hallazgo: la instalación del beacon está bien

- Navegador real en producción: `performance` contiene
  `static.cloudflareinsights.com/beacon.min.js/vce701823…` **y**
  `POST /cdn-cgi/rum?`; Clarity también carga. La CSP no lo bloquea.
- El sitio WA (setup automático `15de5db4…`) cubre la zona entera: su
  desglose de hosts a 30 días (blog 360 + apex 50 = 410) confirma que
  `blog.*` reporta. Sin sitio huérfano ni doble conteo.
- **WA a 30 días: 410 visitas / 590 pageviews** (≈14/día) — beacon sano.
  (El 07-11 midió 49 visitas/24 h: siempre ha contado bien.)

### De dónde vienen esas 410 visitas (WA, 30 días)

- **Referente:** directo **330 (80 %)** · `localhost` **30** (pruebas
  locales hacia el sitio en vivo, no audiencia) · `m.facebook.com` 20 ·
  auto (`blog.*`) 10 · `www.google.com` 10.
- **País:** Colombia 340 (83 %) · Estados Unidos 60 · China 10 (menor).
- **Host:** `blog.*` 360 · apex `culturaydesarrollo.org` 50 (el beacon
  del portal institucional reporta al mismo sitio WA).
- **Dispositivo:** Desktop 240 / Mobile 170; SO Windows 190, Android 140,
  iOS 30, macOS 20; navegadores ChromeMobile 100, ChromeDerivative 100,
  Chrome 70, Firefox 60, MobileSafari 30.
- **Rutas:** `/` 200 · `/visor/un-clavo/` 80 · `/vivir-mas-vivir-distinto/`
  30 · `/un-clavo-soc-ficcion-plastica/` 20 · `/mito-del-sereno/` 20.
- **Lectura:** tráfico mayormente directo (WhatsApp/correo/marcadores),
  Google apenas 10 visitas (SEO orgánico aún sin efecto), Facebook el
  mejor referente externo, reparto desktop/móvil equilibrado.

### Por qué no cuadra: la zona mide HTTP, el beacon mide humanos

- **Zona 30 días: 21,99k pageviews / 19,12k visitas** (blog 14,31k ·
  panel 5,27k · apex 2,36k) vs beacon **590 / 410** → 37-47×.
- **La zona está dominada por bots:** AhrefsBot 212 (≈60 % de los
  pageviews del día), ChatGLM-Spider 930 y ClaudeBot 630 a 30 días, y
  rutas de scanner: **`/supabase/config.toml` 800 hits**, `/robots.txt`
  240, `/sitemap.xml` 230 en un blog estático. Firma bot: **1,15
  página/visita** en la zona (los humanos leen varias páginas).
- **Cuadre del día:** 354 pageviews de zona − ≈230 bots − ≈83
  panel/apex − fetch de SPA y ad-blockers ≈ 6 del beacon.
- **Diferencias estructurales (no bugs):** (1) la zona cuenta cada fetch
  HTML, el beacon solo cargas de documento completo — con el ClientRouter
  de Astro, hojear 10 artículos = 10 pageviews de zona y 1 de beacon;
  (2) el panel de WA aplica `excludeBots=Yes` y la zona no; (3)
  EasyPrivacy bloquea `static.cloudflareinsights.com` (ad-blockers =
  lectores reales que no reportan).

### Conclusión y criterio de uso

**Nada que arreglar en la instalación** (beacon, CSP, ámbito y Clarity
OK). Los dos números nunca cuadrarán; cada métrica para lo que mide:

| Pregunta | Métrica |
|---|---|
| Cuánta gente lee el blog | Web Analytics (beacon) |
| Rastreo SEO y carga de origen | Zona |
| Caché / 5xx / transferencia | Zona |
| Cómo se usa el visor | Clarity |

### Pendiente

- **INP del visor:** el retardo de entrada (1440 ms) en `span.meta-author`
  de la cabecera apunta a la escena WebGL bloqueando el hilo principal en
  la primera interacción — diferir la carga de la escena.
- **Cache hit 19 %:** revisar cabeceras de caché de los assets en Pages.
- Opcional: limitar AhrefsBot con regla WAF para limpiar la zona (sin
  bloquearlo del todo si interesa el rastreo SEO).

### Lecciones

- Zona y Web Analytics no cuentan lo mismo: una mide peticiones HTTP
  (mayormente bots), la otra páginas cargadas por humanos con JS. La
  brecha de 47× es esperada; el error sería "arreglar" el beacon para
  igualar la zona.
- Rutas raras en un sitio estático (`/supabase/config.toml`, 800 hits)
  son scanners: no confundir picos de zona con picos de audiencia.
- La verificación fiable del beacon sigue siendo `performance` en un
  navegador real (script + `POST /cdn-cgi/rum`), no `curl`.
