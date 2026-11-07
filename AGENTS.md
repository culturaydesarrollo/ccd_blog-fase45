# AGENTS.md — ccd_blog-fase45

Blog estático de la Corporación Cultura y Desarrollo. Astro 7 + MDX + TypeScript 7,
sin framework de UI. Todo el contenido vive en el repo y se genera a `dist/`.

## Comandos

```bash
cmd /c npm run validate     # typecheck + build — el gate antes de commitear
cmd /c npm run test         # tests de interacción del visor (Playwright)
cmd /c npm run dev          # servidor local
cmd /c npm run build        # solo build
```

> En esta máquina `npm.ps1` está bloqueado por la execution policy de PowerShell:
> usar siempre `cmd /c npm …` (o `npm.cmd`).

## Tests

- `tests/visor.spec.ts` — interacción del visor 3D (`/visor/un-clavo/`): carga,
  auto-rotación, zoom con límites, centrar, AR, compartir, pantalla completa y teclado.
- Playwright corre contra el **build real** (`dist/` vía `astro preview`), con el
  Chrome del sistema (`channel: 'chrome'`): sin descargar Chromium.
- Antes de commitear cambios de comportamiento en el visor: `npm run test` en verde.

## Estructura

- `src/content/blog/` — artículos en MDX (frontmatter con `author`, `authorSlug`, `authorImage`).
- `src/content/autores/` — fichas de autoría (bio + `image`).
- `src/lib/author.ts` — `resolveAuthorImage()`: la imagen de la **colección autores**
  tiene prioridad sobre el `authorImage` del post (este es solo fallback).
- `src/pages/` — rutas (incluye redirecciones legacy con meta refresh).
- `public/images/` — imágenes; `public/models/` — modelos 3D; `public/vendor/` — librerías autoalojadas.
- `docs/sesiones/` — bitácora de sesiones, **sí se versiona** (`.gitignore` la des-excluye de `docs/*`).

## Git

- Rama de trabajo y de publicación: `main`. Todo cambio se integra y se empuja a `main`;
  no se publica desde ramas de fase. Remotos: `fase45` (repo del proyecto) y `origin`.
- Identidad: `corporacionculturadesarrollo <corporacionculturadesarrollo@gmail.com>`.
- Commits atómicos y convencionales (`feat:`, `fix:`, `style:`, `chore:`); no mezclar
  formateo con cambios de comportamiento; el mensaje explica el **por qué**.
- Antes de commitear: `npm run validate` en verde.

## Regla: binarios y artefactos pesados

- **Nunca versionar** `dist/`, `dist_exe/`, `build_pyinstaller/` — ya están en `.gitignore`.
- `public/models/*.glb` **sí se versionan hoy**, pero Git guarda cada versión para siempre:
  - Mientras haya **una sola obra 3D** y no se reexporte seguido, se queda en el repo (decisión actual).
  - Si aparecen **varias obras** o el `.glb` se reexporta con frecuencia, migrar
    `public/models/` a **Git LFS** *antes* de acumular versiones. Migrar después es gratis;
    adoptar LFS por adelantado cuesta a todo el equipo (`git lfs install`, checkout en CI).
- `public/vendor/` se autoaloja a propósito (sin CDN en runtime). Cada archivo lleva su
  procedencia y licencia en `public/vendor/README.md`; actualizarlo es reemplazar el archivo
  y probar la página afectada.

## Skills

Las reglas globales de la máquina (`~/.config/opencode/AGENTS.md`) definen qué suite de
skills manda en cada dominio (addyosmani = proceso; gstack = herramientas). Este archivo
solo añade lo específico del proyecto.
