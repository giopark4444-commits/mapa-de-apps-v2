# Sección 12 · Ajustes — panel de personalización estética

**Fecha:** 2026-06-05 · **Estado:** aprobado por Gio (opción A: variables CSS dinámicas)

## Objetivo

Nueva sección "Ajustes" (12) donde el usuario personaliza la estética "Precisión" en vivo,
sin recargar. Cero cambios al contenido ni a la lógica existente.

## Controles

| Grupo | Control | Valores (default en negrita) | Variables que toca |
|---|---|---|---|
| Tema | Claro/Oscuro | **oscuro** | `data-theme` (reusa `toggleTheme`) |
| Acento | 5 swatches | **Violeta #8b5cf6** · Cian #06b6d4 · Verde #10b981 · Ámbar #f59e0b · Rosa #ec4899 | `--accent`, `--accent-glow`, `--accent-soft` (rgba derivados del rgb del acento) |
| Glow | Intensidad | Apagado(0) · Suave(.2) · **Normal(.35)** · Fuerte(.55) | alfa de `--accent-glow` |
| Riel | Tamaño de iconos | Pequeño(15px) · **Normal(17px)** · Grande(19px) | `--rail-ic` (nueva var usada por `.nav-b .ic svg`) |
| Riel | Comportamiento | **Expandir al pasar** · Siempre expandido · Siempre colapsado | el IIFE del riel consulta la pref; "expandido" fija `.exp`, "colapsado" ignora mouseenter (focus-within sigue funcionando) |
| Texto | Tamaño | Compacto(.92) · **Normal(1)** · Grande(1.1) | `zoom` en `main` (px fijos en toda la app; `zoom` soportado en Chrome/Safari/Edge/Firefox 126+) |
| Texto | Tono del gris | **Neutro** · Cálido(hue 35) · Frío(hue 225) | `--ink`, `--ink-soft`, `--ink-dim` |
| Texto | Contraste | Suave · **Normal** · Alto | idem (lightness de los 3 inks) |

Los inks se calculan en JS: función `inkSet(theme, tone, contrast)` que devuelve los 3
valores HSL (tabla de luminosidades por tema/contraste, hue/saturación por tono;
saturación 0 en neutro, ~6% en cálido/frío). Se aplican como overrides inline sobre
`document.documentElement.style`; "neutro+normal" no escribe nada (usa los del tema).

## Mecánica

- `maPrefs` en localStorage: JSON `{accent,glow,railIc,railMode,fontZoom,inkTone,inkContrast}`.
  Solo se guardan claves no-default. Valores inválidos → se ignoran (default silencioso).
- `applyPrefs()` corre al cargar (después del IIFE de tema, que también la invoca al
  alternar tema, porque los inks dependen del tema) y tras cada cambio de control.
- Botón **"Restaurar todo"**: borra `maPrefs` y los overrides inline, re-renderiza el panel.
- Las prefs son por dispositivo: NO viajan en exportar/importar respaldo (apariencia, no datos).

## UI (estética Precisión)

- Riel: nueva entrada al final del grupo "La guía": `<span class="num">12</span>` + icono
  deslizadores (SVG línea) + `<span class="lbl">Ajustes</span>`, `data-go="ajustes"`.
- Página `#ajustes` (clase `page`): eyebrow `<b>12</b> / A tu gusto`, `h1` "Ajustes",
  lead corto. Tarjetas `.card` por grupo (Tema+Acento+Glow en "Apariencia"; Riel; Texto).
- Controles como **chips segmentados**: botones `.seg` con `.on` (hairline, el activo con
  borde `--accent`); swatches del acento: círculos de 22px del color, el activo con anillo.
- Etiquetas de control en monospace uppercase (mismo idiom que labels del formulario).
- Pie: botón ghost "Restaurar todo" + nota de que se guarda solo en este dispositivo.

## Verificación

Node (sintaxis) + navegador: cambiar cada control y comprobar efecto vivo + persistencia
tras recarga; restaurar todo; ambos temas; recorrido de regresión de las 11 secciones.
