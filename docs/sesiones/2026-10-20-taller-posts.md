# Taller de posts — asistente del autor con circuito editorial

**Estado:** abierto · **Inicio:** 2026-10-20 · **Última:** 2026-10-20

> Nota de política: en este repo `docs/*` está en `.gitignore` (línea 8), así
> que esta bitácora queda **local**, igual que `TOKENS-CCD.md`. No se commitea
> con el código mientras esa política siga vigente.

## 18:30 — Interfaz en español, ayuda en cada control y categorías solo-admin

**Qué se hizo** — Toda la interfaz del taller (`local-tools/taller-posts/`)
pasó a nombres de campos/opciones/mensajes en español, con la clave técnica
del frontmatter entre paréntesis (`Fecha de publicación (pubDate)`). Cada
campo y botón quedó con tooltip + pista inline (33/33 controles verificados).
Regla nueva: las categorías **solo se eligen de las existentes**; un botón
«🔒 Nueva categoría (solo admin)» explica que solo el admin da de alta
categorías, y si un artículo cargado trae una categoría no registrada se
conserva como chip ⚠ (no se pierde al guardar) y la revisión lo avisa.

**Decisiones**
- Nombres en español con la clave técnica visible entre paréntesis, **porque**
  el frontmatter real es inglés (`pubDate`, `draft`) y ocultarlo rompería la
  correspondencia con el archivo; ocultarlo del todo confundía más.
- Categoría no registrada se conserva con ⚠ en vez de descartarla en silencio,
  **porque** `setFields` la estaba tirando al cargar (pérdida de dato al
  guardar); se descartó la opción de crear categorías desde el taller **porque**
  el usuario fue explícito: solo el admin.
- Textos de usuario en español también en la revisión (`dims` → `medidas`,
  `checklist` → `revisión`); se dejaron en inglés nombres que son código real
  (`alt`, `width/height`, `slug`, `src/content/...`).

**Verificación**
```powershell
# interfaz servida por el servidor (lee index.html en cada petición)
Invoke-WebRequest http://127.0.0.1:4322/ -UseBasicParsing | Select-Object -Expand StatusCode   # 200
git status --short --branch   # limpio: local-tools/ y docs/ están en .gitignore
```

**Errores míos**
- Pruebas de API desde PowerShell 5.1: `-Body` con string **no manda UTF-8**
  → los acentos llegan al servidor como U+FFFD (�). No es bug del servidor
  (el navegador sí manda UTF-8 bien). Regla: payloads **ASCII** en pruebas PS,
  o mandar bytes UTF-8 explícitos.

## 19:45 — Circuito editorial pre-publicación (área editorial + roles)

**Qué se hizo** — El taller pasó a ser el circuito obligatorio de
pre-publicación: al guardar, el artículo entra como **pre-post** en el área
editorial (pestaña nueva con tres listas: en revisión · aprobados ·
rechazados). Hay selector de rol (Autor/Editor/Admin); **solo editor o
admin** aprueban, rechazan (motivo obligatorio) o devuelven a consideración;
el servidor lo impone con 403. Historial completo por entrada. Todo verificado
end-to-end por API y por UI (ciclo aprobar → devolver → rechazar con motivo →
volver a consideración), 0 errores JS, datos de prueba borrados.

**Decisiones**
- Estado editorial en `local-tools/taller-posts/editorial.json` (local,
  gitignored), **no** en el frontmatter del MDX, **porque** meter claves ajenas
  al schema de Astro crearía diffs en un archivo trackeado y podría romper el
  build; el archivo local viaja con el taller y nunca se pushea.
- **Aprobar ≠ publicar**: aprobar solo marca «listo para publicación»; el
  `draft: false` y el push siguen siendo exclusivos del flujo
  `blog-publicacion` con aprobación explícita, **porque** es la regla dorada
  del repo.
- Si un **autor** re-guarda un artículo **aprobado**, vuelve a pre-post
  (re-aprobación), **porque** una corrección de autor anula la validación
  previa; si lo re-guarda editor/admin, conserva el estado.
- Se descartó meter el estado en localStorage, **porque** no sobrevive a
  cambiar de navegador/máquina y el área editorial debe ser compartida entre
  autor y editor en el mismo repo.

**Pendientes**
- [x] **Aislamiento de roles** → **resuelto en el bloque 13:50** (pantalla de
  entrada con clave, sesión por token, autor sin área editorial, editor/admin
  solo por «Abrir y corregir» con corrección marcada).

**Verificación**
```powershell
node local-tools\taller-posts\server.cjs      # → http://127.0.0.1:4322
Invoke-WebRequest http://127.0.0.1:4322/api/editorial -UseBasicParsing   # {"entradas":[]}
# 403 si rol autor intenta aprobar (payload ASCII en PowerShell):
$body = '{"slug":"x","estado":"aprobado","rol":"autor"}'
Invoke-WebRequest -Uri http://127.0.0.1:4322/api/editorial/estado -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing
git status --short --branch                   # debe quedar limpio
```

**Errores míos**
- Escribí `cambiarEstado()` usando `this.slug` (resto de un pensamiento en
  objeto) en una función suelta: habría lanzado `TypeError` en cada decisión
  editorial. Se detectó releyendo el edit antes de reiniciar el servidor; se
  corrigió pasando `slug` como parámetro.
- Tras guardar un artículo **nuevo**, «✏️ Abrir» salía deshabilitado en el
  área editorial porque `state.meta.posts` no lo contenía todavía; corregido
  empujando el slug a `state.meta.posts` en `save()`.

## 13:50 — Aislamiento de roles (entrada con clave, autor ⇄ editor/admin)

**Qué se hizo** — Se resolvió el pendiente de aislamiento con las respuestas
del usuario («el área de autor se pasa al área editorial donde se procesa; no
hace falta entrar al área de autor; todo lo que pasa al área editorial es
modificable» + «entrada con clave»):

- **Pantalla de entrada** (`#gate`) al cargar la herramienta: 👤 Autor entra
  directo; 🧑‍💼 Editor y 🔑 Admin exigen código. El rol se guarda en una
  **sesión con token** (`sessionStorage['taller-ccd-sesion']`, token aleatorio
  del servidor) y ya **no se alterna**: el selector `#rol` de la barra se
  eliminó y solo queda «🔓 Cambiar de rol», que vuelve a la pantalla (sin
  código no hay escalada).
- **Códigos en `local-tools/taller-posts/roles.json`** (local, gitignored; el
  servidor lo relee en cada intento, así que se cambian sin reiniciar). Hoy:
  `editor-ccd-2026` / `admin-ccd-2026` → **cambiarlos** para uso real.
- **Servidor con sesiones** (`server.cjs`): `POST /api/entrada` crea el token;
  `GET /api/editorial` exige rol editorial (403 sin token o con rol autor);
  `POST /api/editorial/estado` usa el **rol del token, nunca el del cuerpo**;
  `/api/save` atribuye con el rol de la sesión y las guardadas de editor/admin
  se marcan «corregido en el asistente (modo corrección)».
- **Autor**: sin pestaña Área editorial (ni siquiera la lee; 403 en el
  servidor). Ve su botón «✚ Nuevo».
- **Editor/Admin**: pantalla por defecto = **Área editorial**; **sin «✚
  Nuevo»**; modifican todo desde **«✏️ Abrir y corregir»** (abre el montaje
  con banner «✏️ Modo corrección — intervienes como …»), y sus guardadas
  quedan marcadas en el historial con su rol.
- Guía (pestaña 📖) y `LEEME.md` actualizados con «Roles y acceso».

**Decisiones**
- Códigos en `roles.json` en claro (no hash), **porque** es una herramienta
  local de un solo equipo y la meta es el aislamiento de roles, no la defensa
  contra un atacante con acceso al disco.
- Token en `sessionStorage` (por pestaña), **porque** una pestaña nueva vuelve
  a la pantalla de entrada (cada «carga» decide su rol) y cerrar la pestaña
  cierra la sesión; `localStorage` habría recordado el rol en contra del
  requisito.
- El rol del cuerpo de la petición se ignora en las decisiones (manda el
  token), **porque** con el selector eliminado cualquier texto del cliente es
  spoofeable.
- Editor/admin **no crean artículos nuevos** (sin «✚ Nuevo»), **porque** el
  usuario dijo que el área de autor se pasa al área editorial y no hace falta
  entrar allí: todo es modificable desde «Abrir y corregir».

**Verificación** (API con payloads ASCII + UI en la pestaña 127.0.0.1:4322):
```powershell
# entrada: autor sin código 200; editor código malo 401; editor/admin ok 200
# GET /api/editorial: sin token 403 · token autor 403 · token editor 200
# POST /api/editorial/estado: sin token 403 · token autor 403 · editor ok
# save editor → historial "corregido en el asistente (modo corrección) [editor]"
# save autor sobre aprobado → "vuelto a revisión tras corrección de autor [autor]"
```
UI: gate visible sin sesión → autor dentro (pestaña editorial invisible,
«✚ Nuevo» visible, tab activo = style) → «Cambiar de rol» → gate → código malo
(✗) → editor (área editorial 1·0·0 por defecto, sin «Nuevo») → «Abrir y
corregir» (banner visible, rol editor) → Guardar con confirmación de
sobrescritura → recibo ✓ y historial marcado. 0 errores JS. Artefactos de
prueba borrados (`test-aislamiento-rol.mdx`, `editorial.json`); `git status`
limpio.

**Errores míos**
- Puse `style.display = ''` en el banner de modo corrección pensando que lo
  mostraba: la regla CSS `#modo-correccion { display:none }` volvía a
  ocultarlo. Debe ser `display = 'block'` (detectado al probar la UI).
- Varias lecturas de estado le ganaron al `fetch`/render asíncrono (clic antes
  de que cargara meta, resultado leído antes de la respuesta): las pruebas de
  UI requieren un roundtrip de espera o polling, no lecturas inmediatas.
- Inventé IDs inexistentes al probar (`#ed-pre-post`, `#title`,
  `#save-receipt`): los reales son `#ed-pre`, `#f-title` y el toast +
  `#save-state`. Regla: grep de IDs antes de scripts de UI.

## 15:19 — Sala editorial, publicación al aprobar, correo al autor y área personal

**Qué se hizo** — Requisitos del usuario en dos mensajes: (1) editor/admin
ingresan a una **lista de solicitudes** que se abren individualmente; al
**aprobar se publica con datos del día**; el autor recibe **correo del
estado** (publicado, o rechazado con motivo) por **SMTP real**; el autor ya
no «cambia de rol»: **hace logout**. (2) El autor tiene **su área de
publicaciones aprobadas** que puede **eliminar individual o globalmente** o
**darse de baja** (eliminando o no sus publicaciones) cuando quiera.

- **Sala editorial** (antes «Área editorial»): cola de solicitudes; cada
  tarjeta se abre individualmente (clic o «✏️ Abrir y corregir»).
- **Aprobar = publicar en el repo local** (`cambiarEstado` →
  `ajustarDraftEnMdx`): `draft: false` + `pubDate` y `createdAt` = **hoy**
  (fecha local, no UTC); devolver/rechazar vuelve a `draft: true`. El
  taller **sigue sin commitear ni pushear** (blog-publicacion aparte).
- **Notificaciones SMTP** (cero dependencias): `smtpSend()` mínimo en Node
  (`net`/`tls`: implícito TLS 465 o STARTTLS 587, AUTH LOGIN, MIME UTF-8
  base64). Config en `config-smtp.json` y correos de autores en
  `autores-emails.json` (ambos locales; hay `.example`). Al aprobar →
  «publicado»; al rechazar → «rechazado con motivo». Sin config/correo queda
  *pendiente* en `notificaciones.json` y en la tarjeta (📨).
- **Identidad del autor**: la entrada pide el nombre (selector de
  `meta.autores`; «Soy autor nuevo» vincula su ficha al guardar vía
  `POST /api/sesion/autor`). **Logout** en vez de «cambiar de rol»
  (`POST /api/logout` invalida el token).
- **📚 Mis publicaciones** (pestaña solo del autor, `GET /api/editorial/mios`):
  aprobadas (más las de fuera del circuito), en revisión y rechazados con
  motivo; **🗑 eliminar** individual o todas (`POST /api/mis-publicaciones`,
  solo borra archivos cuyo frontmatter le pertenezca al autor) y **🚪 darse
  de baja** (`POST /api/autores/baja`: registra en `de-bajas.json`, quita el
  correo; opcionalmente borra artículos + ficha). Los dados de baja no pueden
  entrar (403 en `/api/entrada`).

**Decisiones**
- Aprobar estampa la fecha de hoy **porque** el usuario pidió «se publica con
  datos del día… fecha de creación»; el push a producción **no** se automatiza
  (regla dorada del repo: solo `main` despliega y con aprobación explícita).
- Baja **sin** eliminar conserva ficha y artículos **porque** borrar la ficha
  dejando artículos rompería el build del sitio (referencias al autor
  huérfano); la ficha solo se borra en la baja total (sin artículos suyos).
- Reversibilidad de la baja: quitando la entrada de `de-bajas.json` (archivo
  local, admin); se descartó un botón de reactivación en la herramienta
  **porque** dado de baja no debe poder entrar a decidir nada.
- Correos en claro en `autores-emails.json`/`config-smtp.json` **porque** es
  config local de un equipo (mismo criterio que `roles.json`).
- El autor ve ahora sus rechazados con motivo en su área (además del correo)
  **porque** su área personal ya existe y ver el motivo evita idas y vueltas.

**Verificación** (API + UI, pruebas ASCII; datos borrados al final)
```powershell
# entrada autor: sin nombre 400 · fantasma 404 · real 200 · dado de baja 403
# guardar (autor) → solicitud; rechazar (editor) → notif "pendiente: sin correo"
# aprobar → fechaPublicacion hoy y MDX: createdAt hoy · pubDate hoy · draft:false
# devolver a revisión → draft:true · mios del autor ve pre-post/rechazado/aprobado
# eliminar individual → archivo y entrada fuera · baja → 403 al volver a entrar
```
UI: puerta con los 6 autores reales + «Soy autor nuevo»; entra Laura →
identidad «· Laura Rada Solórzano», pestaña sala editorial invisible, «📚 Mis
publicaciones» con estados vacíos y acciones; logout → puerta; editor → cola
0·0·0 por defecto, sin «✚ Nuevo» ni pestaña personal. 0 errores JS.
`git status` limpio; `test-circuito-editorial.mdx` y ficha de prueba
borrados; `de-bajas.json`/`editorial.json`/`notificaciones.json` borrados.

**Errores míos**
- Al reemplazar la ruta `GET /api/editorial` por la nueva `/api/editorial/mios`
  la borré sin querer (oldString completo): la restauré en el mismo bloque.
  Regla: al añadir rutas, editar por inserción, no por reemplazo del bloque
  vecino.
- Dejé una línea inválida en `smtpSend` (`const b64 cuerpo = null;`, resto de
  un pensamiento): `node --check` la cazó antes de reiniciar. Regla: siempre
  `node --check` tras tocar el servidor.
- T13 (frontmatter tras aprobar) falló por una comilla mal cerrada en
  `Get-Content "...mdx -Raw"` y, encima, el archivo ya se había borrado en el
  paso siguiente: repetí el ciclo mínimo para verificarlo de verdad.
- Un 403 espurio a `/api/editorial` apareció en una transición artificial de
  pruebas (clics a mitad del arranque); en arranques limpios de autor y
  editor, 0 errores.

## 21:22 — Carga de .mdx y medios en el área del autor + app de escritorio (fase 1)

**Qué se hizo** — Dos peticiones del usuario: (1) «en área autor debe existir
opción de cargar archivos .mdx y medios»; (2) «app de escritorio para crear
mdx en formato que el blog demanda», resuelta en fase 1 como ventana de
programa (respuestas del usuario: *app ya + Electron después* y *para
compartir con autores*).

- **📥 Cargar archivos (área 📚 Mis publicaciones)**: botones «📁 Importar
  .mdx…» y «🖼 Subir medios…» con sus file inputs ocultos.
  - **Import .mdx**: el cliente manda el texto al nuevo `POST
    /api/import-mdx` (requiere sesión; **solo parsea**, no escribe nada en el
    repo: 403 sin sesión, 400 si está vacío o sin cuerpo) y `setFields()`
    rellena el formulario con draft forzado y saltando a la pestaña Estilo.
    El artículo entra al circuito cuando el autor pulsa «Guardar».
  - **Medios**: reutiliza `uploadFile()` → `/api/upload` (mismo destino
    `public/images` y `public/video`, medidas registradas); el handler actualiza
    `state.meta` y los selectores de portada/medios como el panel del taller.
- **🖥 App de escritorio (fase 1)** en `local-tools/`:
  - `abrir-taller-app.bat` + `lanzar-taller-app.ps1`: preflight (Node, raíz del
    repo con `src/content/blog`), servidor arrancado **vía WMI
    (`Win32_Process.Create`) para que no muera con el árbol de la consola**,
    ventana en modo app de Edge/Chrome (`--app=` con perfil propio
    `%LOCALAPPDATA%\TallerPostsCCD\perfil`), y **al cerrar la ventana se
    apaga el servidor que el lanzador arrancó** (si ya corría por otra vía, no
    lo toca). Mensajes en español con `WScript.Shell.Popup`.
  - `crear-icono-y-acceso.ps1` → icono `taller-icono.ico` (SVG→ICO ámbar dibujado
    con System.Drawing) y acceso directo **«Taller de artículos CCD.lnk»** en el
    escritorio (creado y verificado en este equipo). `detener-taller.bat` de
    seguridad. `APP-ESCRITORIO.md`: guía en español incluida la receta
    **portable para otros equipos** (clonar repo + copiar `local-tools` +
    `npm install` + icono + configs) y nota de fase 2 (Electron).

**Decisiones**
- Import = **solo parseo** (nada se escribe hasta «Guardar») **porque** mantiene
  un único punto de escritura en el repo (el guardado con validación) y evita
  .mdx a medias en `src/content/blog/`.
- Medios del área = reutilizar `uploadFile()` **porque** ya hace nombre limpio,
  no-sobrescritura y registro de medidas; duplicarlo sería fuente de divergencia.
- Fase 1 con ventana de programa en vez de Electron **porque** el usuario eligió
  «app ya + Electron después»: cero dependencias y sin descargas; Electron queda
  como fase 2 para el .exe autocontenido.
- Servidor arrancado por WMI y no `Start-Process` **porque** así sobrevive al
  cierre de la consola que lanza la app (y lo probamos: mata árboles de
  procesos, WMI no).

**Verificación** (pruebas ASCII + navegador; artefactos borrados)
```powershell
# import: sin sesión 403 · ok 200 (fields+body) · vacío 400 · sin cuerpo 400
# y comprobado que NO escribe src/content/blog/*.mdx
# UI (File + DataTransfer inyectados): título/descripción/cuerpo cargados,
# draft=true, salta a Estilo, línea de resultado en el área; PNG de64×32
# subido → /images/prueba-taller-carga.png, medidas ✓ y en el selector de portada
# app: cerrar puerto → abrir-taller-app.bat → servidor arriba + ventana
# «Taller de artículos · Corporación Cultura y Desarrollo» → cerrar ventana →
# servidor apagado solo y lanzador termina limpio
```
`git status` limpio (la imagen de prueba se borró y `imageDimensions.ts` se
revirtió); taller 4322 y preview 4321 arriba; acceso directo en el escritorio.

**Errores míos**
- Puse `POST /api/import-mdx` dentro del bloque `if (req.method === 'GET')`
  al insertarla tras la ruta GET `/api/post`: devolvía «ruta desconocida».
  Regla: las rutas POST se insertan tras `if (req.method === 'POST')`.
- El primer lanzador arrancaba el servidor con `Start-Process` como hijo: en
  pruebas, matar la consola mataba al servidor; y el bucle de espera de la
  ventana evaluó antes de que existiera, apagando el servidor recién
  arrancado. Solución: proceso vía WMI + espera explícita a que la ventana
  aparezca (20 s) y luego a que desaparezca.
- Dejé `$g.FillRoundedRectangle = $null` (residuo) en el script del icono:
  con `$ErrorActionPreference='Stop'` habría revocado; quitado antes de
  ejecutarlo.
