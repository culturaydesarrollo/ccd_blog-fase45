# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Lector hispanohablante del público general interesado en cultura, arte y
desarrollo. Descubre los artículos por búsqueda o difusión y los lee en
contexto de ocio para enterarse de lo que la Corporación Cultura y Desarrollo
y su comunidad crean, aprenden y publican.

## Product Purpose

Blog editorial de la comunidad de la Corporación Cultura y Desarrollo: publica
artículos MDX sobre cultura, desarrollo, arte digital, XR y web3. Es el medio
de la comunidad, por encima de lo meramente institucional. El éxito es que se
lea y se comparta: contenido encontrado y terminado.

## Positioning

Un blog corporativo institucional no podría copiar esto dos cosas: (1) es la
**voz de la comunidad** de la Corporación, no un boletín de la dirección; y (2)
el contenido se publica también ** descentralizado en IPFS** y es resoluble por
el **dominio web3** (.wallet), lo que hace el archivo público verificable y
soberano.

## Operating Context

- Flujo editorial MDX: artículos en `src/content/posts/` con frontmatter
  (`draft: true` obligatorio en el taller); validaciones del proyecto.
- Repositorio git con rama `fase-45`; push solo `git push fase45 fase-45`;
  CI en GitHub Actions.
- Publicación web3: IPFS vía Unstoppable Domains (`somoscreativos00.wallet`);
  el blog canonical sigue siendo `blog.culturaydesarrollo.org`.
- SEO: Search Console y bucles de verificación del runbook.

## Capabilities and Constraints

- Astro 5 + MDX, tema propio (sin template): `src/content`, `src/data`,
  `src/i18n`, `src/layouts`, `src/pages`, `src/styles`, `src/utils`.
- Taxonomía por namespaces de contenido: corporation, culture, development,
  general (nombres en inglés; la interfaz y el contenido van en español).
- Sitio 100% estático, sin backend ni dependencias de servidor.
- Hecho en Windows/PowerShell 5.1: los comandos del proyecto evitan `&&`.

## Brand Commitments

- Nombre y voz de la **Corporación Cultura y Desarrollo** (CCD).
- **Español primero**: UI y contenido en español.
- `blog.culturaydesarrollo.org` como canonical; la publicación en IPFS +
  dominio web3 es parte del producto, no un extra.
- Taxonomía y flujo editorial MDX existentes preservados.

## Evidence on Hand

- Artículos MDX reales en `src/content/posts/` (el post de Octubre 2025 es la
  referencia actual del flujo).
- Estructura del sitio en `src/` (layouts, pages, styles, i18n, utils).
- Historial de publicaciones web3 (IPFS) del repositorio.
- Ausencias que no se deben fabricar: no hay testimonios, precios, ni
  métricas de audiencia en el repo; no existe aún `DESIGN.md` (es un hueco de
  documentación, no un hecho de producto).

## Product Principles

1. El contenido es de la comunidad; la Corporación aporta el marco y la voz.
2. Público y verificable: lo que se publica queda también en la web
   descentralizada.
3. Español primero, sin excepciones.
4. El flujo editorial MDX con borradores es la única puerta de entrada.
5. Cero dependencias de servidor: el sitio es estático, portable y soberano.
