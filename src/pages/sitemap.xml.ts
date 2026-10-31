import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { slugify } from '../lib/slugify';
import { HOME_PAGE_SIZE, MONTH_PAGE_SIZE } from '../lib/pagination';
import { LAST_UPDATED } from '../lib/staticPages';

type SitemapEntry = { path: string; lastmod?: Date };

type BlogEntry = {
  id: string;
  data: {
    pubDate: Date;
    createdAt?: Date;
    draft: boolean;
    category: string[];
    tags: string[];
    author: string;
    authorSlug?: string;
  };
};

type AuthorEntry = { id: string; data: { name: string; slug?: string; updated?: Date } };

const normalize = (value?: string) => value?.trim().toLocaleLowerCase() ?? '';

/** Fecha anotada a mano para las páginas fijas (formato `YYYY-MM-DD`). */
const staticDate = (path: string) => {
  const value = LAST_UPDATED[path];
  return value ? new Date(`${value}T00:00:00Z`) : undefined;
};

/** Fecha que se publica como `lastmod`: la de creación si existe, si no la de publicación. */
const postDate = (post: BlogEntry) => post.data.createdAt ?? post.data.pubDate;

const newer = (current: Date | undefined, candidate: Date) => (!current || candidate > current ? candidate : current);

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ?? new URL('https://blog.culturaydesarrollo.org');

  // Solo lo publicado: los borradores no deben entrar al sitemap.
  const posts = ((await getCollection('blog')) as BlogEntry[])
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const authors = (await getCollection('autores')) as AuthorEntry[];

  const entries: SitemapEntry[] = [];
  const add = (path: string, lastmod?: Date) => entries.push({ path, lastmod });

  const newestDate = posts.length ? postDate(posts[0]) : undefined;

  // Portada y páginas de sección
  add('/', newestDate);
  add('/acerca/', staticDate('/acerca/'));
  add('/categorias/', newestDate);
  add('/tags/', newestDate);
  add('/autores/', newestDate);
  add('/archivo/', newestDate);

  // Artículos publicados
  posts.forEach((post) => add(`/${post.id}/`, postDate(post)));

  // Perfiles de autoría: `lastmod` del artículo más reciente o, si todavía no
  // ha publicado, la fecha de revisión anotada en su perfil.
  authors.forEach((author) => {
    const identifiers = [author.id, author.data.slug, author.data.name].map(normalize).filter(Boolean);
    const newest = posts.find((post) =>
      [post.data.authorSlug, post.data.author].map(normalize).some((value) => value && identifiers.includes(value)),
    );
    add(`/autores/${author.data.slug ?? author.id}/`, newest ? postDate(newest) : author.data.updated);
  });

  // Paginación de la portada
  const homePages = Math.ceil(posts.length / HOME_PAGE_SIZE);
  for (let page = 2; page <= homePages; page += 1) add(`/pagina/${page}/`, newestDate);

  // Categorías y etiquetas: `lastmod` del artículo más reciente de cada una
  const categories = new Map<string, Date>();
  const tags = new Map<string, Date>();
  posts.forEach((post) => {
    const date = postDate(post);
    post.data.category.forEach((category) => {
      const key = slugify(category);
      categories.set(key, newer(categories.get(key), date));
    });
    post.data.tags.forEach((tag) => {
      const key = slugify(tag);
      tags.set(key, newer(tags.get(key), date));
    });
  });
  categories.forEach((lastmod, slug) => add(`/categorias/${slug}/`, lastmod));
  tags.forEach((lastmod, slug) => add(`/tags/${slug}/`, lastmod));

  // Archivo por año y por mes, incluida la paginación mensual
  const years = new Map<number, Date>();
  const months = new Map<string, { year: number; month: number; lastmod: Date; count: number }>();
  posts.forEach((post) => {
    const year = post.data.pubDate.getUTCFullYear();
    const month = post.data.pubDate.getUTCMonth() + 1;
    const key = `${year}-${String(month).padStart(2, '0')}`;
    const date = postDate(post);

    years.set(year, newer(years.get(year), date));

    const current = months.get(key);
    if (current) {
      current.count += 1;
      current.lastmod = newer(current.lastmod, date);
    } else {
      months.set(key, { year, month, lastmod: date, count: 1 });
    }
  });

  years.forEach((lastmod, year) => add(`/archivo/${year}/`, lastmod));
  months.forEach(({ year, month, lastmod, count }) => {
    const base = `/archivo/${year}/${String(month).padStart(2, '0')}/`;
    add(base, lastmod);
    const pageCount = Math.ceil(count / MONTH_PAGE_SIZE);
    for (let page = 2; page <= pageCount; page += 1) add(`${base}${page}/`, lastmod);
  });

  // Sin duplicados: si una ruta aparece dos veces se conserva la fecha más reciente
  const unique = new Map<string, Date | undefined>();
  entries.forEach(({ path, lastmod }) => {
    const previous = unique.get(path);
    unique.set(path, lastmod && previous ? newer(previous, lastmod) : (lastmod ?? previous));
  });

  const urls = [...unique.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, lastmod]) => {
      const loc = new URL(path, baseUrl).href;
      const stamp = lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
      return `  <url><loc>${loc}</loc>${stamp}</url>`;
    })
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
};
