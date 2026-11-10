import type { APIRoute } from 'astro';

// robots.txt del blog.
//
// Por qué no es solo `Allow: /`: durante noviembre de 2026 el 41 % de las
// solicitudes del mes (26,82k de 65,11k) fueron respuestas 404 — escáneres
// barriendo rutas que no existen (/wp-config.php, /supabase/config.toml…).
// `Allow: /` sin más le decía a todo crawler que pasara libre por todo.
//
// Restringimos solo lo que no aporta indexación:
//   - /cdn-cgi/        endpoint interno de Cloudflare, nunca debe rastrearse.
//   - /search-index.json  132 KB con el texto íntegro de todos los artículos:
//     un solo archivo == todo el blog. El buscador del sitio lo pide con fetch
//     desde el propio dominio, así que no se rompe nada al desautorizarlo.
//
// Ojo: esto ordena a los crawlers educados, NO detiene a un atacante — un
// scraper malicioso ignora robots.txt. El control real es la regla WAF.
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap.xml', site ?? 'https://blog.culturaydesarrollo.org');

  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /cdn-cgi/',
      'Disallow: /search-index.json',
      '',
      `Sitemap: ${sitemapUrl.href}`,
      '',
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
};
