# Mapa de Apps · Tu copiloto de vibecoding

**v3.1 "Producción"**

App web ligera que ayuda a personas con ideas —pero sin
conocimientos de código— a planear, construir, asegurar y publicar una app con la
ayuda de Claude. Se abre con doble clic en cualquier navegador; no requiere instalar
nada y todo se guarda en tu propio navegador.

**100% estática, sin backend:** corre tal cual en Vercel (o cualquier hosting). No usa
base de datos ni servidor propio — todo vive en tu navegador (localStorage). Las únicas
conexiones externas son directas a la API de GitHub (analizador) y, si lo activas, un
botón de apoyo que abre un checkout alojado (Dodo, Lemon Squeezy, Ko-fi…). Servida por
web incluye **cabeceras de seguridad** (CSP, HSTS, X-Frame-Options…) vía `vercel.json` y
**monitoreo propio** opcional (analítica de Vercel + registro local de errores).

El núcleo son tres archivos que viajan juntos: `index.html` (estructura), `styles.css`
(apariencia) y `app.js` (lógica). Mantén la carpeta junta; abres `index.html` y listo.
Funciona offline (salvo el analizador de repos, que consulta GitHub).

**Instalable (PWA):** servida por web (HTTPS), la app se puede **instalar** en el
teléfono o el escritorio y **funciona sin conexión** gracias a un service worker
(`sw.js` + `manifest.webmanifest` + iconos). Abierta con doble clic (`file://`) sigue
funcionando igual; la instalación solo aplica a la versión web.

**Atajos de teclado** (escritorio): `]` / `[` o `Alt`+`→` / `←` para cambiar de
sección, `t` para alternar el tema y `?` para ver la ayuda.

## Qué incluye

- **Inicio** — tarjeta dinámica de "tu siguiente paso" según tu proyecto activo.
- **Mis proyectos** — gestiona varias ideas a la vez, con respaldos (exportar/importar).
- **Proyecto actual** — describe tu idea y obtén un resumen técnico, un ranking de
  tecnologías con el porqué, costos estimados y el prompt perfecto para Claude.
- **Roadmap del proyecto** — las 8 fases del ciclo de vida, adaptadas a tu tipo de app
  (incluye escalabilidad, caché/velocidad y monitoreo, con prompts para resolver).
- **Llevar a dispositivos** — checklist para iPhone, Android, tablet y web.
- **Analizar una app** — pega un repo de GitHub (o **conecta tu GitHub** y elígelo de
  una lista, incluidos privados) y audita qué tiene, qué le falta y cómo solucionarlo
  (con prompts), incluyendo compatibilidad por dispositivo.
- **Seguridad** — escanea tu repo en busca de secretos filtrados y fallos reales,
  con % de seguridad, roadmap de blindaje y protección anti-abuso de APIs de IA.
  También aquí puedes **conectar tu GitHub** para elegir el repo a auditar.
- **Mapa de arquitectura, Diccionario, Prompts y Errores comunes** — guía de
  referencia sin tecnicismos, con analogías de la vida real.
- **Ajustes** — personaliza la apariencia en vivo: tema, color de acento, glow,
  riel de navegación y texto.

## La estética "Precisión" (v3.0)

Futurismo de plano técnico: doble tema claro/oscuro con un clic, un único color de
acento con glow, líneas de 1px, datos en monospace, riel de iconos colapsable y
marcas de registro en las tarjetas. Cada elemento usa un solo color.

## Uso

Descarga la carpeta completa (los tres archivos juntos) y abre `index.html` en tu
navegador. Listo. Si compartes la app, comparte la carpeta entera, no solo
`index.html`.

## Historial de versiones

| Versión | Qué trajo |
|---------|-----------|
| **v3.1 "Producción"** | PWA instalable + offline, cabeceras de seguridad (CSP/HSTS) vía `vercel.json` y `.gitignore`, roadmap ampliado (escalabilidad, caché, monitoreo) con su detección en el analizador, **conectar GitHub** para elegir repos (incl. privados) en Analizar y Seguridad, botón de apoyo/venta configurable y monitoreo propio (analítica de Vercel + registro local de errores). |
| **v3.0 "Precisión"** | Rediseño visual completo (doble tema, riel colapsable, acento único con glow) + sección de Ajustes con personalización en vivo. |
| v2.x | Sección de Seguridad (escáner de secretos, roadmap, blindaje), % de seguridad en tarjetas e Inicio, correcciones de la revisión de código. |
| v2.0 | Multiproyecto, ranking de stack con argumentos, costos, roadmap adaptado, "Llevar a dispositivos" y analizador de repos. |

> El detalle completo del proyecto y su historial vive en [RESUMEN.md](RESUMEN.md).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
