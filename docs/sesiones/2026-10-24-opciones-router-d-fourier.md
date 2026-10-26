# Opciones D y F del router + refinamiento de la pieza Fourier

**Estado:** abierto · **Inicio:** 2026-10-24 · **Última:** 2026-10-25

## 2026-10-25 — F completa, D acoplada, Tolima adelgazado y push

**Qué se hizo** — Cerrada la Opción F: los scripts restantes re-anclados a
`astro:page-load` (`[slug].astro` inline grande, ArticleComments, ContactForm,
SubscribeWidget, autores/index, pagina/[page]). Opción D (filtro de categoría en
portada) commiteada. Línea que traza al Tolima de 1.7 a 1 px. Los 8 commits de la
ronda (`28762d0..2ff5bd5`) **pushados** a `fase45/fase-45`.

**Decisiones**
- D y F en un commit juntos (`aa34dfc`) **porque** el filtro de categoría vive dentro
  del bloque que F re-ancla; separarlos dejaría el filtro apuntando a un DOM que el
  swap ya descartó.
- Redirect pages (`autores/tags dimitri-guzman`) sin cambios **porque**
  `window.location.replace` fuerza recarga completa donde todo corre fresh — no
  necesitan `data-astro-reload`.
- Patrón F = replicar el de BlogNavbar: guard `window.__ccd*EvitaDoble` +
  `astro:page-load` + `AbortController` con `signal` **solo** en binds a
  document/window (los de elementos los descarta el swap con el DOM viejo).
- El history-box de `[slug].astro` salió de `DOMContentLoaded` (dentro de
  `astro:page-load` el evento ya pasó) y corre directo en cada visita.
- Línea del Tolima a 1 px **porque** 1.7 tapaba el contorno irregular; a 1 queda
  coherente con su `cadena2` y se leen los detalles.
- `ArticleComments`: callback de `astro:page-load` en `async` **porque** el cuerpo
  tenía `await cargar()` y no compilaba en callback síncrono.

**Pendientes**
- [ ] E2E de `marcador-ar` con el Vivo (V2436) — **motivo**: sin teléfono conectado;
      al conectar: `usbipd attach --wsl` + `adb install -r` según
      `marcador-ar/ESTADO-SESION.md`.

**Verificación**
```bash
cmd /c npm run validate                            # 111 páginas
cmd /c npx impeccable detect --no-advisory dist    # baseline 138
git log --oneline fase45/fase-45..HEAD             # vacío = todo pushado
```

**Errores míos**
- Conté "26 commits sin push" contra `origin/fase-45`: **remoto equivocado** — hay
  dos (`origin` → ccd_blog.git, `fase45` → ccd_blog-fase45.git). El del blog es
  `fase45/fase-45`; tras el `fetch` la cuenta real era 7.
- Diagnostiqué "doble handler" en `/autores/` con instrumentación de contadores:
  era contaminación del HMR; tras recarga dura el init corre 1× y 6 registros de
  click (1 por trigger). No había bug.
- Añadí `"$35.99"` a un `Add-Content` entre comillas dobles: PowerShell expandió
  `$35` y dejó la línea como ".99/yr". Arreglado reescribiendo con comillas simples.
