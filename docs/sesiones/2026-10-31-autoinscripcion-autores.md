# Autoinscripción de autores y aprobación editorial

**Estado:** abierto (requisito registrado, sin implementar) · **Inicio:** 2026-10-31

## 2026-10-31 — Cómo debe funcionar la ficha de autor

**Requisito** — Cuando una persona se inscribe por su cuenta y acepta las
condiciones del blog, el sistema debe crear su ficha (biografía, fotografía y
registro como autor) en estado **pendiente**. La publicación en producción
ocurre solo con la aprobación de admin o editor.

Flujo previsto:

1. El autor se inscribe por su cuenta y acepta las condiciones del blog.
2. El sistema emite un **token de registro** y aplica los procesos de
   verificación ya implementados.
3. Se crea la ficha del autor —bio, fotografía, registro— en estado pendiente.
4. El sistema **notifica a admin y/o editor**.
5. Admin o editor **aprueban**: la ficha pasa a producción.
6. Solo entonces el autor accede al **módulo de creación de contenido**, cuya
   interfaz y funcionamiento quedan por revisar y poner a prueba.

**Situación actual (por qué no se toca el blog todavía)** — Ese módulo **no
está habilitado en producción**. Todas las fichas que existen hoy fueron
creadas a mano por admin, de modo que están aprobadas de hecho. Por eso el
sitemap puede listar los siete perfiles y no hay estado intermedio que filtrar.
El módulo empezará a funcionar cuando se adquiera el VPS.

**Lo que habrá que hacer cuando entre el módulo**

| Pieza | Cambio necesario |
|---|---|
| Esquema de `autores` | Campo de estado (`pendiente` / `aprobado`), con valor por defecto seguro |
| `/autores/` y `/autores/[slug]/` | No generar página pública para fichas pendientes; el autor necesita una vista previa propia |
| `sitemap.xml` | Excluir perfiles no aprobados |
| RSS y buscador | Excluir artículos de autores no aprobados |
| Tokens, notificaciones y verificación | Fuera del blog: pertenecen al API y al panel |

**Decisiones**

- No se añade todavía el campo de estado **porque** no existe ninguna fuente de
  fichas pendientes: el blog es estático y las altas las hace admin. Adelantarlo
  obligaría a inventar un flujo que aún no tiene origen de datos.
- El sitemap incluye los perfiles de autoría **porque** hoy todos corresponden a
  altas aprobadas; cuando el módulo entre, esa lista deberá filtrarse por estado.
- La revisión del módulo de creación de contenido (interfaz, permisos y
  comportamiento) queda como tarea aparte, después de la puesta en marcha.

**Verificación de partida**

```bash
cmd /c npm run validate     # 127 páginas
```

El sitemap publicado tiene 124 URLs, de las cuales 7 son perfiles de autoría,
todos creados por admin.
