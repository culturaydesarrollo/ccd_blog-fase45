# «Acerca de» sin repetir la landing de la Corporación

**Estado:** cerrado · **Inicio:** 2026-10-27 · **Última:** 2026-10-27

## 2026-10-27 — La página Acerca de pasa a hablar del blog, no de la Corporación

**Qué se hizo** — Reescrita `src/pages/acerca.astro`: fuera los bloques que
repetían casi literalmente la landing de `culturaydesarrollo.org` (lema «Memoria
que conecta», «Quiénes somos» completo, los tres caminos 01/02/03,
Misión/Visión/Filosofía, equipo y «Trabajamos con comunidades…»). En su lugar,
una sección breve «Detrás del blog» que remite al sitio de la Corporación, y se
conserva íntegra la pieza Fourier. Limpiado el CSS huérfano (`about-lead`,
`about-quote`, `about-cards`, `about-card`, `about-filosofia`, `about-paths`,
`about-path*`, `about-team`) y el arreglo `paths` que solo usaban esos bloques.

**Decisiones**
- Se elimina el contenido corporativo duplicado **porque** la landing ya lo dice
  mejor y con fotos del equipo; repetirlo en el blog duplica mantenimiento
  (si cambia la misión hay que tocarla en dos sitios) y diluye el propósito de
  la página, que es explicar **el blog**.
- «Detrás del blog» conserva el vínculo con la Corporación con un párrafo y dos
  enlaces (sitio corporativo y `/autores/`) **porque** el lector necesita saber
  quién publica, sin volver a leer la presentación institucional.
- Se mantiene la pieza Fourier **porque** es contenido original del blog y el
  usuario la refinó en la sesión anterior; no viene de la landing.
- La descripción meta se reescribió para describir el blog (línea editorial,
  organización, autores, participación), no la misión corporativa.

**Verificación**
```bash
cmd /c npm run validate                            # 111 páginas
cmd /c npx impeccable detect --no-advisory dist    # 137 (antes 138)
```
En vivo: encabezados finales `Qué es este blog`, `Qué encontrarás`, `Participa`,
`Detrás del blog`, `¡Mayor compromiso, mejor país!`; ninguna de las frases
duplicadas aparece en el DOM; Fourier pinta y anima sin errores JS.
