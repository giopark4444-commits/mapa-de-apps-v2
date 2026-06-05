# Rediseño estético "Precisión" — Mapa de Apps

**Fecha:** 2026-06-05 · **Estado:** aprobado por Gio (mockup validado: `mockup-precision.html`)

## Objetivo

Reemplazar por completo la estética actual (oscura, lila, radio 14px) por la dirección
**"Precisión"**: futurismo de plano técnico/instrumento. Minimalista, limpio, monocromo
disciplinado. **El contenido no cambia en absoluto**: ni textos, ni secciones, ni flujos,
ni lógica JS, ni datos guardados.

## Reglas de oro

1. **Un color por elemento**: cada elemento usa exactamente un color (un gris, el violeta,
   o un color de estado). Nunca dos colores en el mismo elemento.
2. **Violeta protagonista único**: `#8b5cf6` aparece como máximo en un elemento principal
   por vista (anillo de %, botón primario, dato clave), siempre con glow suave
   (`box-shadow`/`drop-shadow` de `rgba(139,92,246,.35)`).
3. **Estados desaturados**: ok/alerta/crítico conservan verde/ámbar/rojo, en variantes
   por tema (oscuro: `#3eb46c/#d9a425/#e06363`; claro: `#15803d/#a16207/#b91c1c`).
4. **Sin logos coloridos**: el logo es trazo gris monocromo.

## Tokens

| Token | Oscuro | Claro |
|---|---|---|
| `--bg` | `#08090b` | `#fafafa` |
| `--panel` / `--panel-2` | `#0d0e11` / `#121318` | `#ffffff` / `#f4f4f5` |
| `--line` / `--line-strong` | blanco 7% / 14% | negro 9% / 18% |
| `--ink` / `--ink-soft` / `--ink-dim` | `#ededf0` / `#9b9ea6` / `#5c5f66` | `#18181b` / `#52525b` / `#a1a1aa` |
| `--accent` | `#8b5cf6` (ambos) | — |
| `--r` (radio) | `5px` (ambos) | — |

- Tipografía: fuente del sistema. Datos numéricos (%, contadores, fechas) en `--mono`.
- Etiquetas/eyebrows: MAYÚSCULAS monospace, tracking 2–2.5px.
- Transiciones: 150–180ms `cubic-bezier(.4,0,.2,1)`.
- El tema se cambia con `data-theme` en `<html>`; se guarda en localStorage (clave nueva
  p. ej. `maTheme`); por defecto oscuro.

## Navegación: riel colapsable

- Sidebar de 248px → **riel de 64px solo iconos**; se expande a 230px con hover.
  (V1 es solo hover; un botón de "fijar expandido" queda explícitamente fuera de alcance.)
- Numeración técnica `01`–`11` visible en el riel expandido y en el eyebrow de cada
  página: `02 / MIS PROYECTOS` (número en violeta).
- Pie del riel: proyecto activo (punto violeta + nombre al expandir) y **toggle de tema**
  (sol/luna) con borde hairline.
- Ítem activo: icono violeta con glow; texto `--ink`. Inactivos: `--ink-dim`.

## Componentes (misma función, nueva piel)

- **Tarjetas**: `--panel` + hairline; hover sube hairline a `--line-strong`; sin sombras
  grandes. **Marcas de registro** `⌐` (7px, 1px) en esquinas superior-izquierda e
  inferior-derecha de las tarjetas principales.
- **Botón primario**: violeta sólido, texto blanco, glow; **secundario**: hairline +
  `--ink-soft`; **peligro**: texto rojo, borde transparente que aparece al hover.
- **Anillo de %**: trazo 2px, marcas de dial (8 ticks) alrededor, número grande monospace.
- **Barras de progreso**: 2px alto, relleno `--ink-soft` (gris, no violeta).
- **Checkboxes**: 16px, radio 4px, relleno verde al marcar; numeración `01`/`02` monospace
  al lado en checklists; tarea hecha → texto tachado `--ink-dim`.
- **Insignias** (Seguridad %, Crítico/Alto/Medio): contorno 1px del color de estado,
  fondo transparente, texto monospace en mayúsculas.
- **Inputs/selects/textareas**: sin fondo, hairline inferior; al foco la línea pasa a
  violeta. Etiquetas arriba en monospace mayúsculas.
- **Pestañas**: subrayado 1px violeta con glow bajo la pestaña activa.
- **Toasts**: igual lógica; piel hairline + monospace.

## Movimiento

Fade entre páginas (ya existe, se conserva). Glow del botón primario del Inicio "respira"
sutilmente (animación de `box-shadow`, ciclo ≥3s). Nada más se anima solo.

## Garantías de no-regresión

- Cero cambios en textos, secciones, formularios, flujos y lógica.
- Los IDs y clases que usa el JS se conservan (`.nav-b`, `.page`, `.on`, `.card`,
  `.secpill`, `data-go`, `data-sectab`, etc.) — el restyle es CSS sobre los mismos hooks.
- HTML solo cambia donde el riel lo exige (estructura del `aside`) + botón de tema.
- JS nuevo: ~15 líneas (expandir/colapsar riel, recordar tema). Nada existente se toca.
- localStorage de proyectos intacto (solo se añade la clave del tema).

## Verificación

1. Sintaxis JS con Node (método RESUMEN §8).
2. Recorrido completo en navegador (Playwright vía HTTP local): 11 secciones, formulario,
   roadmaps, diccionario, prompts, analizar + auditar con repo real — **en ambos temas**.
3. Captura de pantalla de Inicio, Mis proyectos y Seguridad en oscuro y claro.

## Referencia visual

`mockup-precision.html` en la raíz del repo (temporal, borrar al terminar la
implementación). El mockup es la fuente de verdad visual para tokens y componentes.
