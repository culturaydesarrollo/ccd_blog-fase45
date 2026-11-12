# Taller de posts en Go: paridad byte a byte y canal de logs cifrados

**Estado:** cerrado · **Inicio:** 2026-11-11 · **Última:** 2026-11-12

## 2026-11-11/12 — Puerto completo de `server.cjs` a `local-tools/taller-go/`

**Qué se hizo** — Portar el servidor del asistente (`server.cjs`, 790 líneas
de Node) a un único ejecutable Go que corre en Windows **sin Node instalado**,
con paridad de comportamiento verificada contra el JS, y montar encima un
canal de logs cifrados por correo.

### Por qué

Premisas acordadas: (P1) un solo archivo que corre en Windows sin Node, contra
un clon del repo; (P2) «Validar proyecto» se degrada sin toolchain Node sin
tumbar el taller; (P3) UI (`index.html`) y circuito editorial intactos;
(P4) `local-tools/` no se commitea ni se pushea nunca — el puerto vive solo en
esta máquina.

### Cómo se verificó la paridad

Dos fases sobre harness propios (`%TEMP%\paridad\`), con las mismas peticiones
a ambos servidores (Go 4322 / JS 4323), normalizando timestamps y tokens:

- **Fase 1 (85 casos no mutantes): 85/85 idénticos** — rutas GET/POST de
  lectura, login, meta, editorial, autores, upload, etc. Única corrección:
  `DimsMap` (orden de fichero de `imageDimensions.ts` preservado con
  `MarshalJSON` propio).
- **Fase 2 (18 casos mutantes): `difs=0`, 2701/2701 líneas** — guardados,
  409, cambios de estado, aprobaciones, con traza de 7 ficheros + PNGs.
  Comparación **por bloques `CASE`** (`comparar-bloques.ps1`): la comparación
  línea a línea se desalinea en cascada ante la primera diferencia de tamaño.

Detalles de paridad replicados sin V8: mensajes de error de Node
(`name.trim is not a function`, …) verificados con `probe2.js` real, `String()`
ECMA-262 (`js.go`), decodificador base64 con semántica de Node, orden de
claves JSON de todas las respuestas, orden NTFS de `readdir` y claves de
`fields` en orden de frontmatter.

**Divergencias deliberadas** (aceptadas): body limit 40 MB (JS 5e6); JSON
inválido / body `null` / array en **400** con mensaje de `encoding/json` (el JS
da 500 con mensajes de V8); mensajes de `roles.json` hacia el data dir real.

### Hallazgo: Norton bloquea los PNG recién escritos (~8 min)

Los PNG que crean los servidores no se pueden borrar ni renombrar durante
~8-13 minutos: `Remove-Item`, `[IO.File]::Delete`, rename y matar el proceso
dan *Acceso denegado*; Restart Manager no ve handles. Es un **minifilter de
Norton Security** (Defender apagado, `0x800106ba`) reteniendo el análisis —
solo el tiempo lo libera. El harness lo contempla: `EsperarPNGsLibres`
(hasta 960 s, poll 2 s) antes de cada corrida y al final. Fue justo lo que
explicó la única divergencia aparente de la fase 2 (los PNG de la corrida Go
aún retenidos al empezar la JS).

### Gate Go

`gofmt -s -w .` · `go vet ./...` (0) · `go test -count=1 ./...` → `ok` ·
`go build -o taller-go.exe .` → ~12,85 MB.

## Canal de logs cifrados (etapa 1: SMTP STARTTLS + age)

**Qué se hizo** — `logs.go` con dos flags nuevos en `taller-go.exe`:

- **`-log`** — redirige el paquete `log` a una cola; cada **5 minutos** o al
  llegar a **200 eventos** (lo que pase primero, solo si hay algo nuevo) se
  envía un correo con el lote **cifrado con age** (`filippo.io/age`, opción
  del usuario ante la ausencia de ChaCha20-Poly1305 en stdlib) en armor ASCII
  al destinatario `logTo` (o al propio remitente) vía `smtpSend` (STARTTLS,
  20 s, nunca tira el proceso). Sin config SMTP/clave el lote **se guarda y
  reintenta** (premisa P2): un aviso a stderr y nada más.
- **`-age-keygen`** — genera el par X25519, escribe `agePublic` en
  `config-smtp.json` preservando el resto de campos e imprime la privada
  **una sola vez** (redirigida a fichero en esta sesión: la clave no entra en
  el chat). Descifrar la bandeja: `age -d -i <clave>`.

Instrumentación (solo con `-log`, sin tocar respuestas): middleware de
**5xx** en el mux y log de **fallos SMTP** al notificar al autor — los dos
casos que nadie se entera de lejos.

**Bug latente arreglado en el camino:** `SMTPConfig.Port` era `string`, así
que `"port": 587` numérico (el del `config-smtp.example.json` real) hacía
fallar todo el `Unmarshal` y las notificaciones quedaban «pendiente» mientras
el JS las enviaba. Nuevo tipo `Puerto` con `UnmarshalJSON` tolerante que
replica `Number(cfg.port)` del JS.

### Arranque

```powershell
cd local-tools\taller-go
.\taller-go.exe -port 4322 -data ..\taller-posts [-log]
# primera vez: .\taller-go.exe -data ..\taller-posts -age-keygen
```

`index.html` junto al `.exe` hace override del embebido sin recompilar.
`-data` apunta al directorio de datos (editorial, roles, SMTP); sin `-data`
va junto al ejecutable.

### Verificación

- Tests nuevos `logs_test.go`: roundtrip age cifrar→descifrar, formato de
  lote, cola/flush, guardado ante falta de config, keygen que preserva el
  config, middleware solo-5xx. **Gate completo en verde.**
- Smoke: `-log` en 4322 → arranque con las 4 líneas en stderr, `meta=200`,
  primer lote en el tick de 5 min sin config (aviso + lote guardado).
- Paridad intacta: `SMTPConfig` solo se lee, nunca se serializa en respuestas;
  sin `-log` el mux va idéntico.

### Pendiente

- Etapa 2 del canal: endpoint `/ingest` al desplegar la Fase 5 de `ccd-infra`
  en Oracle (el plan Go de la API TS sigue congelado: **no se reescribe**).
- El envío real SMTP+age quedó probado hasta la cola: falta un
  `config-smtp.json` con credenciales reales para el primer lote de verdad.
