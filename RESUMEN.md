# Resumen del proyecto · Mapa de Apps

Documento que recoge **qué construimos**, **por qué** y **cómo está organizado**, para
que puedas retomarlo en cualquier momento aunque pase tiempo.

**Estado:** ✅ v3.0 "Precisión" — Responsive design mejorado + correcciones de seguridad (2026-06-06)

---

## 1. Qué es

**Mapa de Apps · Tu copiloto de vibecoding** es una aplicación de **un solo archivo
HTML** (`index.html`) pensada para alguien con **ideas pero sin conocimientos de
código**. Sirve de mapa y traductor entre tus ideas y el lenguaje técnico que Claude
entiende, para planear, construir y publicar una app.

- **Cómo se usa:** se abre con doble clic en cualquier navegador. No requiere instalar
  nada ni internet (salvo el analizador de repos, que consulta GitHub).
- **Dónde se guarda todo:** en el navegador (localStorage). Cada cosa se autoguarda.
- **Repositorio:** https://github.com/giopark4444-commits/mapa-de-apps-v2 (público)
- **Carpeta local:** `~/Desktop/mapa-de-apps/`

---

## 2. Secciones de la app (menú)

1. **Inicio** — Tarjeta dinámica de "tu siguiente paso" (lee tu proyecto activo y te
   dice qué hacer ahora) + dos caminos de entrada: "Tengo una idea nueva" / "Ya tengo
   código".
2. **Mis proyectos** — Gestiona varias ideas a la vez; exportar/importar respaldo.
3. **Proyecto actual** — Formulario enriquecido (15 campos) → genera resumen técnico,
   ranking de stack con el porqué, costos estimados y el prompt de arranque para Claude.
4. **Roadmap del proyecto** — Las 8 fases del ciclo de vida, adaptadas a tu tipo de app,
   con explicación, herramientas y ejemplos por paso. Checklist con progreso.
5. **Llevar a dispositivos** — Checklist por plataforma (web, Android, iPhone, tablet)
   con pasos y prompts. Avance guardado por proyecto.
6. **Analizar una app** — Pega un repo de GitHub y lo audita (ver detalle abajo).
7. **Seguridad** — Auditoría de seguridad del repo + roadmap de seguridad + recomendaciones
   de blindaje (ver detalle abajo).
8. **Mapa de arquitectura** — Explica las capas (frontend/backend/BD/deploy) con la
   analogía del restaurante.
9. **Diccionario** — Términos técnicos con analogías de la vida real + buscador.
10. **Prompts para Claude** — Plantillas listas para copiar + 5 reglas de oro.
11. **Errores comunes** — Errores típicos de vibecoding y cómo resolverlos.
12. **Ajustes** — Personaliza tema, color de acento, glow, riel (tamaño y comportamiento)
    y texto (tamaño, tono, contraste). Se aplica al instante y se guarda por dispositivo
    (no viaja en los respaldos). Botón "Restaurar todo".

> El **% de seguridad** de cada proyecto (tras auditarlo) aparece en tres lugares:
> dentro de la sección Seguridad, como insignia en "Mis proyectos" y en la tarjeta
> "Tu siguiente paso" del Inicio. Viaja también en los respaldos.

---

## 3. El analizador de repos (la pieza más potente)

Pega un repositorio público de GitHub y:

- **Detecta el tipo de proyecto** (app web, web estática, app móvil, librería, Python,
  Node…) y adapta los criterios — no penaliza a una librería por "no tener interfaz".
- **Lee de verdad** los archivos clave (HTML, CSS, package.json, .gitignore, README,
  licencia) para no adivinar; detecta viewport y media queries reales.
- **% de avance global** + **nivel** (prototipo → MVP → casi listo → listo para vender).
- **Lo que falta para publicar/vender** con soluciones, opciones y **prompts copiables**.
- **Revisión detallada por fase** con ✓ / 🟡 / ✗, evidencia y cómo solucionarlo.
- **Compatibilidad por dispositivo** (vista unificada): por cada dispositivo, % de
  preparación + checklist auto-detectado + opciones de mejora con prompts.
- **Marcado manual "Ya lo hice"** — para lo que el código no puede verificar (backend en
  otro servidor, deploy en tienda, mantenimiento). Se guarda por repo.
- **Enlaces del proyecto** — pega tu URL de Vercel/Supabase/tienda; confirma esos pasos
  y los deja a un clic, con comprobación de vida best-effort. Se guarda por repo.
- **Repos guardados** — guarda enlaces para reanalizar con un clic.

---

## 4. La sección de Seguridad

Tres pestañas:

- **Auditar mi repo** — escanea los archivos buscando problemas reales: **secretos
  filtrados** (claves de OpenAI, Anthropic, AWS, Google/Firebase, GitHub, Stripe, JWT,
  claves privadas, contraseñas), `.env` subido, `.gitignore`, dependencias, autenticación,
  validación de entradas (inyección SQL/XSS), HTTPS/cabeceras y **protección de APIs de IA**
  (solo si detecta uso de IA). Da un **% de seguridad**, gravedad por hallazgo
  (Crítico/Alto/Medio), cómo corregir con pasos y prompts copiables.
- **Roadmap de seguridad** — checklist de 10 medidas (de la más crítica a la menos), cada
  una con su prompt; avance guardado por proyecto.
- **Recomendaciones de blindaje** — buenas prácticas por área, con foco en **evitar el
  abuso de APIs de IA**. Regla de oro: *la clave nunca en el navegador + límites de uso
  (rate limiting) + tope de gasto en el proveedor*.

> Alcance honesto: el escáner detecta secretos por **patrón de formato** (muy fiable para
> claves conocidas) y revisa hasta ~45 archivos por repo. No reemplaza una auditoría
> profesional, pero atrapa los errores más comunes y peligrosos del vibecoding.

---

## 5. Principios de diseño que seguimos

- **Lenguaje sin tecnicismos**, todo en español, con analogías.
- **Honestidad**: si algo no se puede verificar automáticamente, lo dice ("no pude
  comprobar, ábrelo tú") en vez de inventar. Lo no verificable se confirma a mano.
- **Estética "Precisión"** (futurismo de plano técnico): doble tema claro/oscuro con
  toggle, un único acento violeta con glow (máx. un protagonista por vista), líneas de
  1px, datos en monospace, riel de navegación colapsable con numeración 01–11, marcas
  de registro en las tarjetas. Cada elemento usa un solo color; los estados
  (ok/alerta/crítico) conservan verde/ámbar/rojo desaturados. Iconos SVG de línea,
  sin emojis en la interfaz.
- **Todo se guarda solo** y por proyecto/repo.

---

## 6. Historial de versiones (commits)

| Commit | Qué incluyó |
|--------|-------------|
| `c04bce7` | **Versión 2 inicial** — multiproyecto, ranking de stack con argumentos, costos, roadmap adaptado, "Llevar a dispositivos" y analizador de repos con tipo de proyecto, marcado manual y enlaces. |
| `373682b` | **Inicio para principiantes** — tarjeta "siguiente paso" dinámica y dos caminos claros de entrada; conexión entre secciones. |
| `d5422a1` | **Costos honestos** (incluye el costo real de la IA y aviso de tiempo/límites) + **diccionario en contexto** (chip "?" en cada tecnología del ranking). |
| `42ce514` | **Fusión de las dos vistas de dispositivo** del analizador en una sola (quita duplicado); elimina código muerto. |
| `99c9551` | **Sección de Seguridad** — auditoría de repo (secretos, .env, deps, auth, inyección, IA), roadmap de seguridad y recomendaciones de blindaje (incl. anti-abuso de APIs de IA). |
| `0afb52b` | **% de seguridad en "Mis proyectos"** — insignia por tarjeta con color según riesgo y botón directo. |
| `7929ec9` | **% de seguridad en el Inicio** y confirmación de que viaja en los respaldos. |
| `panel-ajustes` | **Sección 12 · Ajustes** — panel de personalización en vivo: tema, 5 acentos, intensidad del glow, riel (iconos y comportamiento), texto (tamaño/tono/contraste); persistido en `maPrefs` con validación; "Restaurar todo". Verificado en navegador (14 checks + persistencia tras recarga, 0 errores JS). |
| `rediseno-precision` | **Rediseño estético "Precisión"** — doble tema claro/oscuro persistente, riel de iconos colapsable con numeración técnica, violeta único con glow, anillo-instrumento con marcas de dial, tarjetas con marcas de registro, inputs de línea inferior, insignias de contorno monospace. Contenido, flujos y lógica intactos; verificado con recorrido completo en navegador en ambos temas (23 checks, 0 errores JS). Spec y plan en `docs/superpowers/`. |
| `397847a` | **Correcciones de la revisión de código** — detección estricta de `.env` en `.gitignore` (`.env.example` ya no da falsa protección), respaldos validados al importar, progreso del roadmap de seguridad por id estable (con migración automática), colores de seguridad centralizados (`secColor`), auditoría con descargas en paralelo, caché de archivos compartida entre Analizar y Seguridad, y bug visual `${''}` del Inicio. Verificado con recorrido completo en navegador (todas las secciones, análisis y auditoría contra repo real). |

---

## 7. Pendientes opcionales (de bajo impacto)

- Colapsar la sección "Diseño y contexto" del formulario (15 campos es largo).
- Enlaces a documentación real (Vercel, Supabase) dentro de los pasos.
- Dividir `index.html` (~2000 líneas) en varios archivos para mantenimiento más seguro.

> La app ya cumple bien su objetivo; estos pendientes son mejoras, no necesidades.

---

## 8. Cambios recientes (2026-06-06)

### Responsive Design Mejorado
- **Breakpoint 640px:** Menú cambia de sidebar vertical a barra horizontal superior
- **Breakpoint 480px:** Menú se colapsa a botón hamburger con dropdown
- **Logo:** Visible en la barra superior en pantallas móviles
- **Ajustes de fuentes:** Optimizadas para pantallas pequeñas sin perder legibilidad

### Correcciones de Seguridad (Auditoría XSS)
- **Función esc():** Corregida para escapar `&` al inicio (previene double-encoding)
- **Confirm dialogs:** Nombre de proyecto con fallback seguro
- **Validación:** Todos los innerHTML usan `esc()` o `escAttr()` apropiadamente
- **localStorage:** Datos locales sin información sensible (ACEPTABLE)

**Estado de seguridad:** ✅ SEGURO - Sin vulnerabilidades XSS encontradas

---

## 9. Cómo verificamos cada cambio

Como la app es un solo HTML, validamos cada mejora ejecutando su JavaScript real en un
DOM simulado con Node (sintaxis, flujos, lógica del analizador contra repos reales de
GitHub). La parte puramente visual conviene revisarla abriendo la app en el navegador.

🤖 Generado con [Claude Code](https://claude.com/claude-code)
