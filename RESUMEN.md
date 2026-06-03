# Resumen del proyecto · Mapa de Apps

Documento que recoge **qué construimos**, **por qué** y **cómo está organizado**, para
que puedas retomarlo en cualquier momento aunque pase tiempo.

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
7. **Mapa de arquitectura** — Explica las capas (frontend/backend/BD/deploy) con la
   analogía del restaurante.
8. **Diccionario** — Términos técnicos con analogías de la vida real + buscador.
9. **Prompts para Claude** — Plantillas listas para copiar + 5 reglas de oro.
10. **Errores comunes** — Errores típicos de vibecoding y cómo resolverlos.

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

## 4. Principios de diseño que seguimos

- **Lenguaje sin tecnicismos**, todo en español, con analogías.
- **Honestidad**: si algo no se puede verificar automáticamente, lo dice ("no pude
  comprobar, ábrelo tú") en vez de inventar. Lo no verificable se confirma a mano.
- **Estética minimalista**: paleta casi monocromática, iconos SVG de línea de un solo
  color (sin emojis en la interfaz), superficies planas, tipografía cuidada.
- **Todo se guarda solo** y por proyecto/repo.

---

## 5. Historial de versiones (commits)

| Commit | Qué incluyó |
|--------|-------------|
| `c04bce7` | **Versión 2 inicial** — multiproyecto, ranking de stack con argumentos, costos, roadmap adaptado, "Llevar a dispositivos" y analizador de repos con tipo de proyecto, marcado manual y enlaces. |
| `373682b` | **Inicio para principiantes** — tarjeta "siguiente paso" dinámica y dos caminos claros de entrada; conexión entre secciones. |
| `d5422a1` | **Costos honestos** (incluye el costo real de la IA y aviso de tiempo/límites) + **diccionario en contexto** (chip "?" en cada tecnología del ranking). |
| `42ce514` | **Fusión de las dos vistas de dispositivo** del analizador en una sola (quita duplicado); elimina código muerto. |

---

## 6. Pendientes opcionales (de bajo impacto)

- Colapsar la sección "Diseño y contexto" del formulario (15 campos es largo).
- Enlaces a documentación real (Vercel, Supabase) dentro de los pasos.
- Dividir `index.html` (~1900 líneas) en varios archivos para mantenimiento más seguro.

> La app ya cumple bien su objetivo; estos pendientes son mejoras, no necesidades.

---

## 7. Cómo verificamos cada cambio

Como la app es un solo HTML, validamos cada mejora ejecutando su JavaScript real en un
DOM simulado con Node (sintaxis, flujos, lógica del analizador contra repos reales de
GitHub). La parte puramente visual conviene revisarla abriendo la app en el navegador.

🤖 Generado con [Claude Code](https://claude.com/claude-code)
