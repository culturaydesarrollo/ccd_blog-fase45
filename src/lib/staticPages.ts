/**
 * Fechas de última actualización de las páginas fijas.
 *
 * Estas páginas no nacen de una colección de contenido y por eso no tienen una
 * fecha propia que el sitemap pueda leer. Se anotan aquí a mano, con la fecha
 * real del último cambio de la página, y se actualizan solo cuando el
 * contenido cambie de verdad: un `lastmod` automático (la fecha del build) haría
 * que los buscadores desconfiaran del campo.
 */
export const LAST_UPDATED: Record<string, string> = {
  '/acerca/': '2026-10-27',
};
