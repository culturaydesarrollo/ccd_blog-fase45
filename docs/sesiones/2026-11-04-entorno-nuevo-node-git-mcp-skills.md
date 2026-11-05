# Entorno nuevo: Node, Git, MCP y suites de skills

**Estado:** cerrado · **Inicio:** 2026-11-04 · **Última:** 2026-11-04

## 2026-11-04 — Puesta a punto de la máquina nueva

**Qué se hizo** — Máquina Windows nueva (usuario `kutzmanich`) preparada para
desarrollar el blog: herramientas de base, restauración de la configuración de
MCP y dos suites de skills de agente.

### Herramientas de base

- Node.js LTS **26.13.0** (npm 11.20.0) vía `winget install OpenJS.NodeJS.LTS`.
- `Microsoft.VCRedist.2015+.x64`: el binding nativo `satteri_napi.win32-x64-msvc.node`
  fallaba con error 126 por `VCRUNTIME140.dll` ausente.
- `node_modules` **reinstalado desde cero** — la instalación opcional había
  dejado el binding nativo roto (bug de dependencias opcionales de npm).
- Git **2.56.0** y GitHub CLI **2.103.3** vía winget; `gh auth login --web`
  como cuenta **culturaydesarrollo** (scopes: gist, read:org, repo).
- Blender **5.2** y `uv`/`uvx` (requisito de blender-mcp).
- Bun **1.4.4** (requisito de gstack; exige ≥1.4.2).

### Configuración MCP restaurada (`~/.config/opencode/opencode.json`)

Origen: `G:\escritorionov-26\opencode.json` (rescatado de una instalación
fallida).

- Migrada al **formato V2 nativo**: `mcp.servers`, `disabled` en lugar de
  `enabled`, `$schema` a `https://opencode.ai/config.json`.
- Rutas corregidas `C:\Users\kutzm\…` → `C:\Users\kutzmanich\…`.
- **Token y `SPHEROID_FILE_IDS` verificados byte a byte contra el original**
  (dos errores de transcripción detectados por comparación y corregidos).
- Endpoints remotos corregidos — el archivo apuntaba a las páginas web, no al
  protocolo MCP:
  - Astro docs → `https://mcp.docs.astro.build/mcp` (verificado con `initialize` → 200)
  - context7 → `https://mcp.context7.com/mcp`
  - unstoppable-domains → `https://api.unstoppabledomains.com/mcp/v1` (endpoint oficial)
- Servidores locales con **rutas absolutas** (`C:\Program Files\nodejs\node.exe`,
  scripts en `AppData\Roaming\npm\node_modules\…`): el servicio de OpenCode
  arrancó antes de instalar Node y no ve el PATH; los comandos `npx`/`node`
  genéricos fallaban con "no se reconoce como un comando".
- Instalados globalmente `@playwright/mcp` y `rea-agents@6.5.0`.

### Suites de skills

- **addyosmani/agent-skills** clonado en `Documents\GitHub\agent-skills` e
  instalado globalmente: 25 skills → `~/.config/opencode/skills/`, 7 checklists
  compartidos → `references/` (resuelven los `../../references/` de las skills),
  4 personas → `agents/`, 9 comandos → `commands/` (limpios del frontmatter
  específico de Claude: `disable-model-invocation` y prefijos `agent-skills:`).
- **gstack** (Garry Tan) clonado en `Documents\GitHub\gstack` e instalado con
  `setup.ps1 --host opencode`: 65 skills `gstack-*` + 64 comandos
  `/gstack-*` + navegador propio compilado (`browse/dist/browse.exe`).
  v1.95.5, tier **experimental** en OpenCode (hooks advisory, no bloquean).

**Decisiones**

- Endpoints MCP corregidos **porque** el archivo original guardaba URLs de
  sitios web (`https://astro.build`) que devuelven 405/HTML al POST de
  JSON-RPC; se verificó cada endpoint con un `initialize` manual antes de
  cambiarlo.
- Comandos locales MCP por ruta absoluta **porque** el servicio en segundo
  plano se creó antes de instalar Node y su PATH no se actualiza hasta
  reinicio; con rutas absolutas funcionan sin depender del entorno.
- Ambas suites conviven **porque** cubren dominios distintos (addyosmani =
  metodología de proceso, gstack = herramientas ejecutables); el solape se
  resuelve con la política de precedencia, no desinstalando.
- `/cso` de gstack queda **no disponible** (falta VS 2022 Build Tools) y
  `gbrain` no detectado — ambos opcionales, el resto de gstack funciona.

### Política de dominios

Creado `~/.config/opencode/AGENTS.md` (reglas globales de OpenCode, ya
activas): tabla intención→suite que fija el dueño de cada dominio cuando las
dos suites se solapan (depuración→`gstack-investigate`, revisión→addyosmani
por defecto, QA navegador/diseño/deploy/office-hours→gstack, spec/plan→addyosmani,
revisión de planes→`gstack-plan-*`…), más la regla de no ejecutar los dos
ciclos de vida completos para la misma tarea y la economía de contexto (no
cargar skills gstack >10k palabras sin necesidad).

**Verificación**

```bash
opencode-cli mcp list
# ✓ Astro docs, blender-mcp, context7, playwright, rea, spheroid
# ⚠ unstoppable-domains  needs authentication   (OAuth pendiente: /mcps)
# ○ open-design           disabled              (app no instalada)
cmd /c npm run validate       # typecheck + build → 135 páginas
cmd /c npm audit              # 0 vulnerabilidades
```

Las 25 skills de addyosmani y las 65 de gstack aparecen registradas en el
catálogo de OpenCode; el `AGENTS.md` global se carga en sesión (comprobado
por system-update). La sesión de bitácora confirma además que `gh` autentica
como `culturaydesarrollo`.

**Pendientes conocidos**

- OAuth de `unstoppable-domains` (`/mcps` en OpenCode).
- Token de Spheroid: **vence 2026-11-15**.
- `open-design`: cambiar `disabled: true` → `false` cuando la app se instale.
- Opcional: VS 2022 Build Tools para habilitar `/gstack-cso`.
