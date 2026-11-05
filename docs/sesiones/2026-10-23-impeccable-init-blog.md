# Impeccable en el blog CCD — init pendiente

**Estado:** cerrado · **Inicio:** 2026-10-23 · **Última:** 2026-10-23

## Qué pasó

2026-10-23: instalado **Impeccable** (`pbakaus/impeccable`) a nivel de usuario
para OpenCode (skill + motor nativo v0.1.16 en
`~\.config\opencode\skills\impeccable\`). El mismo día se ejecutó el
**`/impeccable init`** con el usuario (entrevista de 3 preguntas) y se creó
`PRODUCT.md` en la raíz del blog con la verdad de producto confirmada:

- Usuarios: público general hispanohablante interesado en cultura/arte.
- Posicionamiento: medio de la comunidad (por encima de lo institucional).
- Compromisos: identidad CCD + español, canonical + web3 (IPFS/.wallet),
  taxonomía y flujo MDX.

**Decisiones**
- Instalación **global** (no por proyecto): Impeccable vale para todos los
  repos del usuario.
- No se preguntó estética ni se creó `DESIGN.md` **porque** el flujo de init
  solo captura verdad de producto; lo visual toca a `document`/`new-work`.
- Sin generación de imágenes disponible en el entorno → no hay pregunta de
  buildPath (code-first es el único camino).

**Pendientes (opcionales, llevados aquí al cierre)**
- [ ] `/impeccable document` cuando el usuario quiera registrar el sistema
      visual actual en `DESIGN.md` (interfaz coherente existente sin documentar).
- [ ] `/impeccable hooks on` si quiere el detector de slop automático tras
      cada edición de UI.
- [ ] Skills de Emil (`emil-design-eng`, `review-animations`…) disponibles
      para cuando toque motion fino.

**Verificación**
```bash
ls PRODUCT.md                     # existe en la raíz del blog
# en el chat del agente: /impeccable critique  (o document, audit…)
```
