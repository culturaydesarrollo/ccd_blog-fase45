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

## 2026-11-08 — Corrección: el reciente es el visor, no el ensayo

**Qué se hizo** — Revertir `a24b57f` y reordenar la portada por posición.

**El usuario aclaró**: "Un clavo... s o c - Ficción Plástica" es de **2026-09-27**
(su fecha real de escritura) y ahí se queda; lo **más reciente** es la **pieza
interactiva (visor 3D)**, publicada el 2026-11-07. Es decir, el error no era la
fecha del ensayo sino **dónde estaba colocada** la sección del visor.

**Cambios** (`d8ca568`):
1. `un-clavo-soc-ficcion-plastica.mdx` → `pubDate: "2026-09-27"` y
   `createdAt: "2026-09-27T18:13:37-05:00"` (originales restaurados).
2. `src/pages/index.astro` → la sección `visor-section` ("Pieza interactiva")
   pasa a ser la **primera de `<main>`**, antes de "Artículo reciente" (que
   vuelve a mostrar El Real de Minas, 2-nov). Así el orden lo decide la
   estructura, no fechas editadas a mano.
3. La cabecera de la tarjeta del visor gana `<time datetime="2026-11-07">`
   con el formato del resto de tarjetas: "7 de noviembre de 2026 · Realidad
   aumentada · 5,08 MB".

**Orden resultante:** Pieza interactiva (7-nov) → Artículo reciente (2-nov) →
Destacados (28-oct, **27-sep Un clavo**, …) → Anteriores.

**Verificación:** `npm run validate` ✅ · `npm test` **16/16** ✅ · build local
con las 4 secciones en ese orden y las fechas correctas.

**Lección:** `getPostSortTimestamp` solo rige los posts de la colección `blog`;
el visor es una sección estática, así que "es lo más reciente" se expresa con
la posición en el DOM, no con un `pubDate` inflado (lo intentado en `a24b57f`).

**Pendientes**
- [ ] Ninguno. Los otros 9 posts sin `createdAt` caen al `pubDate` (mismo día),
      así que no alteran el orden.

## 2026-11-08 — "Pieza interactiva" integrada al patrón de la portada

**Qué se hizo** — Tras mover la sección a primera posición, el usuario señaló
que se sentía una sección ajena a las demás. Ajustes (`49d6458`):

1. **Posición**: vuelve a la secuencia conocida — *Artículo reciente → Pieza
   interactiva → Destacados → Anteriores* (mi cambio anterior la había puesto
   arriba de todo).
2. **Sin subtítulo**: la cabecera queda solo con `<h2>Pieza interactiva</h2>`
   (antes llevaba "La escultura del ensayo, en tres dimensiones."). **Por
   decisión del usuario**: las secciones no llevan subtítulo.
3. **Carrusel y acumulación**: la sección ya no tiene la tarjeta escrita a
   mano en el marcado; renderiza desde el array `piezasInteractivas` del
   frontmatter, **ordenado por `fecha` (más reciente primero)** y partido con
   `enBloques(…, 1)` (una pieza por bloque). Flechas y puntos aparecen a
   partir de la segunda pieza. **Para publicar la próxima pieza basta con
   empujar un objeto al array** — es la instrucción del usuario: "en adelante,
   las piezas interactivas se seguirán ordenando y acumulando en carrusel".
4. **Bio**: la tarjeta gana el botón `ver bio` + `author-trigger` + el modal
   `author-modal-<slug>`, resueltos desde el artículo relacionado
   (`postRelacionado`) con `getAuthorImage`/`getAuthorBio`, para que la ficha
   sea idéntica a la del resto de la portada (misma fuente, sin duplicar la
   bio).
5. **Contador**: "17 artículos · página 1 de 2" → **"17 elementos · página 1
   de 2"** (SSR y la etiqueta que reescribe el buscador al filtrar), porque ya
   no todo lo listado es un artículo.
6. El resumen pasó a `<p set:html>` para conservar el hipervínculo al
   artículo; **el texto no cambió**.

**Test** — `tests/portada.spec.ts`: el alcance del resumen se limita a
`.latest-card-content > p` **porque** la tarjeta ahora incluye el `<p>` del
modal de biografía (el selector anterior casaba con dos `<p>` y rompía el modo
estricto de Playwright). El resto del test (badge, enlace al artículo, CTA)
sin cambios.

**Verificación:** `npm run validate` ✅ · `npm test` **16/16** ✅ · build local
con las 4 secciones en orden, cabecera sin subtítulo, "17 elementos", trigger
y modal presentes, y la fecha "7 de noviembre de 2026 · Realidad aumentada ·
5,08 MB" en la tarjeta.
