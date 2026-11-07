# Publicación en main, rama de Cloudflare Pages y CSP del visor

**Estado:** cerrado · **Inicio:** 2026-11-07 · **Última:** 2026-11-07

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
