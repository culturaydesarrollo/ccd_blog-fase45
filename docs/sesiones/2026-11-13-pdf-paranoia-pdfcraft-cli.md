# Regeneración del PDF del artículo «La Paranoia como Virtud Teleológica»

**Estado:** cerrado · **Inicio:** 2026-11-13 · **Última:** 2026-11-13

## 2026-11-13 — Erratas del MDX y PDF a 2 columnas vía make-pdf + PdfCraft CLI

**Qué se hizo** — Corregir las dos erratas del artículo en el MDX y regenerar
su PDF editorial (`%TEMP%\opencode\paranoia-post.pdf`) con resumen ES+EN,
cuerpo a 2 columnas, tildes correctas y portada sin solape con la marca DRAFT.

### Por qué

Revisiones editoriales sobre el PDF anterior (9 págs.): fecha de portada
cortada por la marca «DRAFT» y en inglés («November 10, 2026»), tildes ausentes
en portada/índice/H1 (se derivaban de los slugs), errata de concordancia
«es colonización e industrializada» y «frontiers» dentro del título en español
de Zuboff. Además se pidió abstract ES+EN y cuerpo a 2 columnas, usando la app
**PdfCraft** por CLI.

### Erratas en el MDX (commit `0a5896a`)

- Línea 57: «colonización e industrializada» → **«colonizada e industrializada»**
  (concordancia con «esta infraestructura biológica»).
- Línea 106: «frente a las nuevas frontiers del poder» → **«fronteras»**
  (título oficial de Paidós, verificado por websearch).

Gate en verde tras los cambios: `validate` 135 páginas + `test` 16/16.
Los «Bloque 1…6» y las líneas guía en cursiva **no se tocaron**: quedan
diferidos a una revisión posterior, según decisión del usuario.

### PDF: pipeline de dos herramientas por CLI

1. **make-pdf** (`pdf.exe generate --cover --toc --title … --author … --date "9 de noviembre de 2026"`):
   el markdown fuente (`%TEMP%\opencode\paranoia-post.md`) se reconstruyó desde
   el MDX actual —tildes y erratas incluidas— más un bloque `<style>` que pone
   `section.chapter` a 2 columnas (`column-count: 2`, partición y guionización),
   con `column-span: all` para H1, imagen, pie y el bloque `.abstract`.
   `printBackground` solo se activa con `--watermark` de make-pdf, así que el
   recuadro del resumen usa filete lateral (se imprime siempre).
2. **PdfCraft CLI** (`pdfcraft-cli run --script paranoia-finalize.json`):
   marca de agua `DRAFT` (rojo 8 %, detrás del texto, `offset_y: -150` para que
   cruce la zona vacía de la portada y no la fecha), metadata del documento
   (Title/Author/Subject con tildes) y `doc_save`. Verificación con `info`,
   `text` y `render` de la propia CLI.

Nota: la CLI de PdfCraft no importa markdown/HTML (edita y verifica PDF; sin
LibreOffice no convierte Office), por eso el rol de render es de make-pdf y el
de acabado/verificación de PdfCraft.

### Verificación (7 págs., 634 KB)

- Portada: «Teleológica, Patología, Epistémico, Guzmán» + «9 de noviembre de
  2026»; DRAFT desplazada debajo, sin tocar la fecha.
- Índice: tildes y números de página completados.
- Pág. 3: título + imagen + pie + bloque Resumen (ES) / Abstract (EN).
- Pág. 4+: cuerpo a 2 columnas equilibradas, con guionización.
- Erratas: «es colo-nizada e industrializada» y «nuevas fronteras del poder»
  (partición de línea incluida) presentes en la extracción de texto.
- El PDF anterior quedó respaldado como `paranoia-post.prev.pdf`.

### Artefactos

- Fuente: `%TEMP%\opencode\paranoia-post.md` · script: `paranoia-finalize.json`
- Salida: `%TEMP%\opencode\paranoia-post.pdf` (7 pág.) · base intermedia:
  `paranoia-base.pdf` · respaldo del anterior: `paranoia-post.prev.pdf`
