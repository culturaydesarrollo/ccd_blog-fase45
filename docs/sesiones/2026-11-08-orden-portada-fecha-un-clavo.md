# Orden de la portada: fecha real de publicación de "Un clavo"

**Estado:** cerrado · **Inicio:** 2026-11-08 · **Última:** 2026-11-08

## 2026-11-08 — "Un clavo" aparecía como artículo anterior

**Qué se hizo** — Corregir el frontmatter de
`src/content/blog/un-clavo-soc-ficcion-plastica.mdx` para que el visor 3D y su
ensayo figuren como la publicación más reciente de la portada.

### Diagnóstico

La portada (`src/pages/index.astro`) ordena con `getPostSortTimestamp`, que usa
`createdAt` con fallback a `pubDate`. El ensayo tenía:

```yaml
pubDate: "2026-09-27"
createdAt: "2026-09-27T18:13:37-05:00"
```

Es decir, la fecha en que se **escribió** el texto (git: commit `ae0d696`,
27-sep), no la en que se **publicó**: la página del visor
(`src/pages/visor/un-clavo.astro`) nació el 4-nov (`2e310f5`) y llegó a
producción el **7-nov** (`ce5eb1a`, bitácora
`2026-11-07-publicacion-main-cloudflare-csp.md`: "Un solo branch y el visor
publicado de verdad"). Con la fecha vieja el ensayo salía 4º, dentro de
"Artículos destacados" y con "27 de septiembre", mientras "Artículo reciente"
mostraba El Real de Minas (2-nov).

### Cambio

```yaml
pubDate: "2026-11-07"
createdAt: "2026-11-07T12:00:00-05:00"
```

Se mantuvo el **formato de cabecera del resto de posts** (fecha de calendario
en `pubDate` + ISO con offset `-05:00` en `createdAt`) y **no se tocó el texto
del artículo** — solo las dos líneas de fechas.

**Por qué `createdAt` manda en la portada:** `pubDate` es la fecha editorial
que se muestra; `createdAt` documenta cuándo entró de verdad el contenido, y la
portada prefiere esta última para no mostrar como "reciente" algo reescrito
hace meses. Aquí ambas apuntaban al origen del texto, no a la publicación real.

### Verificación

- `npm run validate` (typecheck + build, 135 páginas) ✅
- `npm test` → **16/16** ✅
- Build local `dist/index.html`:
  - "Artículo reciente" = **Un clavo… Ficción Plástica**, `<time>` con
    `2026-11-07T00:00:00.000Z` y "7 de noviembre de 2026".
  - "Artículos anteriores" en orden descendente: 2-nov, 30-oct, 27-sep, …
  - Cabecera del artículo: "7 de noviembre de 2026".
  - `rss.xml` encabeza con `Sat, 07 Nov 2026`.

### Commits

- `a24b57f` `fix(content): corrige la fecha de publicacion de Un clavo a la
  real del visor` → push `main` (Cloudflare Pages despliega solo).

**Pendientes**
- [ ] Ninguno. Los otros 9 posts sin `createdAt` caen al `pubDate` (mismo día),
      así que no alteran el orden.
