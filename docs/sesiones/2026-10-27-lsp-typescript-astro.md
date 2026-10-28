# Servidores LSP del blog (TypeScript + Astro)

**Estado:** cerrado · **Inicio:** 2026-10-27 · **Última:** 2026-10-27

## 2026-10-27 — OpenCode puede hablar con TypeScript y Astro

**Qué se hizo** — Instalados `typescript-language-server@6.0.2` y
`@astrojs/language-server@2.17.3` como `devDependencies`, más el alias
`typescript5@npm:typescript@5` (5.9.3). Creado `opencode.json` en la raíz del
repo con las dos entradas `lsp` (`typescript` y `astro`), usando rutas
**relativas** al proyecto. Config recargada con `opencode-cli reload`.

**Decisiones**
- Se añade el alias `typescript5` **porque** el proyecto usa TypeScript 7
  (compilador nativo), que ya no publica `lib/tsserver.js`; los servidores de
  lenguaje lo necesitan y fallaban con
  `"The TypeScript of the workspace (TypeScript 7.0.2 …) provides no
  tsserver.js"`. El alias deja intacto el `tsc` que usa `npm run validate`.
- Las rutas van relativas (`node_modules/…`) **porque** el repo es compartido y
  no debe llevar rutas absolutas de esta máquina (`C:\Users\…`).
- `tsls` recibe su ruta por `initializationOptions.tsserver.path`; `astro-ls`
  por `initializationOptions.typescript.tsdk`. Son las únicas claves que leen
  (verificado en `node_modules/@astrojs/language-server/dist/nodeServer.js` y
  en `cli.mjs`).
- `npm audit fix` subió `undici` 8.12.1 → 8.12.3 (transitiva vía
  `astro → unifont`): 4 advisories de denegación de servicio sin relación con el
  blog, pero el build la arrastra.

**Verificación**
```bash
cmd /c npm run validate                            # 111 páginas
cmd /c npx impeccable detect --no-advisory dist    # 137 (sin cambios)
cmd /c npm audit                                   # 0 vulnerabilidades
node %TEMP%\lsp-handshake2.js .                    # initialize OK en ambos
```
El handshake LSP real (`initialize` → `initialized` → `shutdown`) responde en
los dos servidores con las rutas relativas: TypeScript con 23 capacidades y
Astro con 26. OpenCode no lanza los procesos en segundo plano hasta que el
editor pide diagnósticos, así que la validación es el handshake, no un proceso
vivo.
