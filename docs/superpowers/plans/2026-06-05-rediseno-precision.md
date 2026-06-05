# Rediseño estético "Precisión" — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar la estética "Precisión" (futurismo de plano técnico, doble tema, violeta único) a `index.html` sin cambiar contenido, flujos ni lógica.

**Architecture:** La app es un solo `index.html` con un bloque `<style>` (~244 líneas) que ya usa variables CSS en todos los componentes. El rediseño es: (1) tokens dobles con `data-theme`, (2) riel de navegación colapsable, (3) reescritura por grupos de componentes, (4) caza de colores hardcodeados para que el tema claro funcione. La referencia visual exacta es `mockup-precision.html` (raíz del repo).

**Tech Stack:** HTML/CSS/JS vanilla en un archivo. Verificación: Node (`new Function` sobre el `<script>`) + recorrido en navegador (servir con `python3 -m http.server`, Playwright MCP; el perfil Chrome del MCP a veces se bloquea: limpiar con `lsof +D ~/Library/Caches/ms-playwright/mcp-chrome-* | awk 'NR>1{print $2}' | sort -u | xargs kill -9`).

**Regla transversal (vale para TODAS las tareas):**
- No tocar textos, IDs, ni clases que el JS usa como hooks (`.nav-b`, `data-go`, `.page`, `.on`, `.card`, `.secpill`, `data-sectab`, `data-sec-task`, `#anUrl`, `#secUrl`, etc.). El restyle es CSS sobre los mismos selectores.
- Verificación de sintaxis tras cada tarea:
  `node -e "const h=require('fs').readFileSync('index.html','utf8');new Function(h.match(/<script>([\s\S]*?)<\/script>/)[1]);console.log('sintaxis OK')"`
- Commit al final de cada tarea.

---

### Task 1: Tokens dobles + persistencia de tema

**Files:**
- Modify: `index.html` (líneas ~8-18 `:root`, etiqueta `<html>`, final del `<script>`)

- [ ] **Step 1: `data-theme` en `<html>`**

Cambiar `<html lang="es">` por:
```html
<html lang="es" data-theme="dark">
```

- [ ] **Step 2: Reemplazar el bloque `:root{...}` completo por tokens dobles**

El bloque actual empieza con `:root{` y termina antes de `*{box-sizing`. Reemplazarlo por:

```css
  :root{
    --accent:#8b5cf6;
    --accent-glow:rgba(139,92,246,.35);
    --accent-soft:rgba(139,92,246,.09);
    --r:5px;
    --shadow:none;
    --t:160ms cubic-bezier(.4,0,.2,1);
    --mono:"SFMono-Regular",ui-monospace,Menlo,Consolas,monospace;
    --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }
  [data-theme="dark"]{
    --bg:#08090b; --bg-soft:#0b0c0f; --panel:#0d0e11; --panel-2:#121318;
    --line:rgba(255,255,255,.07); --line-soft:rgba(255,255,255,.045); --line-strong:rgba(255,255,255,.14);
    --ink:#ededf0; --ink-soft:#9b9ea6; --ink-dim:#5c5f66;
    --brand:var(--accent); --brand-2:#a78bfa;
    --ok:#3eb46c; --warn:#d9a425; --bad:#e06363; --gold:#d9a425;
    --code-ink:#c9cdd6;
  }
  [data-theme="light"]{
    --bg:#fafafa; --bg-soft:#f6f6f7; --panel:#ffffff; --panel-2:#f4f4f5;
    --line:rgba(0,0,0,.09); --line-soft:rgba(0,0,0,.055); --line-strong:rgba(0,0,0,.18);
    --ink:#18181b; --ink-soft:#52525b; --ink-dim:#a1a1aa;
    --brand:var(--accent); --brand-2:#7c3aed;
    --ok:#15803d; --warn:#a16207; --bad:#b91c1c; --gold:#a16207;
    --code-ink:#3f3f46;
  }
```

Notas: `--brand`/`--brand-2`/`--ok`/`--warn`/`--bad` se conservan como nombres porque el CSS y el JS los referencian (`var(--ok)` etc. aparece en templates JS). `--brand-2` deja de ser turquesa: ahora es violeta claro (los acentos secundarios quedan en la familia del acento).

- [ ] **Step 3: Transición de tema en `body`**

En la regla `body{...}` existente añadir al final: `transition:background var(--t),color var(--t);`

- [ ] **Step 4: JS de tema (al final del `<script>`, antes del cierre)**

```js
/* ===== tema claro/oscuro ===== */
(function(){
  const saved=localStorage.getItem('maTheme');
  if(saved==='light'||saved==='dark')document.documentElement.dataset.theme=saved;
  window.toggleTheme=function(){
    const h=document.documentElement;
    h.dataset.theme=h.dataset.theme==='dark'?'light':'dark';
    localStorage.setItem('maTheme',h.dataset.theme);
    const l=document.getElementById('themeLabel');
    if(l)l.textContent=h.dataset.theme==='dark'?'Tema claro':'Tema oscuro';
  };
})();
```

- [ ] **Step 5: Verificar sintaxis** — comando de la regla transversal. Esperado: `sintaxis OK`.

- [ ] **Step 6: Abrir en navegador y confirmar** que la app carga en oscuro (más profundo que antes) y que `document.documentElement.dataset.theme='light'` en consola cambia el fondo a claro (habrá colores rotos: se cazan en Task 5).

- [ ] **Step 7: Commit** — `git add index.html && git commit -m "Rediseño precisión 1/6: tokens dobles + tema persistente"`

---

### Task 2: Riel de navegación colapsable + eyebrows numerados

**Files:**
- Modify: `index.html` (HTML del `aside`, reglas CSS `.wrap/aside/.brand/.logo/nav/.nav-h/.nav-b/.side-active/.side-foot`, eyebrows de cada `.page`)

- [ ] **Step 1: HTML del `aside`**

El `aside` actual tiene: `.brand` (logo+texto), `nav` con `.nav-h` y botones `.nav-b` (icono dentro de `.ic` + texto), `.side-active` y `.side-foot`. Transformarlo conservando **todos** los `data-go` y el orden:

- En `.brand`: dejar solo el logo (el `<b>`/`<span>` de texto pasan a tener clase `brand-txt` para ocultarlos colapsado, no se borran).
- A cada `.nav-b` añadirle como primer hijo `<span class="num">NN</span>` con su número 01–11 según orden del menú (01 Inicio, 02 Mis proyectos, 03 Proyecto actual, 04 Roadmap del proyecto, 05 Llevar a dispositivos, 06 Analizar una app, 07 Seguridad, 08 Mapa de arquitectura, 09 Diccionario, 10 Prompts para Claude, 11 Errores comunes).
- Envolver el texto de cada botón en `<span class="lbl">Texto</span>` (el texto exacto no cambia).
- Al final del `aside`, después de `.side-foot`, añadir:

```html
<button class="theme-btn" onclick="toggleTheme()" title="Cambiar tema">
  <span class="i"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg></span>
  <span class="lbl" id="themeLabel">Tema claro</span>
</button>
```

- [ ] **Step 2: CSS del riel** — reemplazar las reglas `.wrap`, `aside`, `.brand`, `.logo`, `nav`, `.nav-h`, `.nav-b` (y sus hijos), `.side-active`, `.side-foot` por:

```css
  .wrap{display:grid;grid-template-columns:64px 1fr;min-height:100vh;transition:grid-template-columns var(--t)}
  .wrap.exp{grid-template-columns:230px 1fr}
  aside{position:sticky;top:0;height:100vh;overflow:hidden;background:var(--bg);border-right:1px solid var(--line);padding:18px 12px;display:flex;flex-direction:column}
  .brand{display:flex;align-items:center;gap:11px;margin:0 0 20px}
  .logo{width:40px;height:40px;border-radius:var(--r);flex:none;display:grid;place-items:center;border:1px solid var(--line);color:var(--ink-soft);background:transparent}
  .logo svg{width:19px;height:19px}
  .brand-txt{opacity:0;transition:opacity var(--t);white-space:nowrap}
  .wrap.exp .brand-txt{opacity:1}
  .brand b{font-size:13.5px;display:block;font-weight:600;letter-spacing:-.02em}
  .brand span{font-size:10.5px;color:var(--ink-dim)}
  nav{display:flex;flex-direction:column;gap:1px}
  .nav-h{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--ink-dim);margin:16px 11px 6px;white-space:nowrap;opacity:0;transition:opacity var(--t)}
  .wrap.exp .nav-h{opacity:1}
  .nav-b{display:flex;align-items:center;gap:12px;width:100%;text-align:left;cursor:pointer;background:transparent;border:0;color:var(--ink-dim);font:inherit;font-size:12.5px;padding:9px 11px;border-radius:var(--r);white-space:nowrap;transition:color var(--t),background var(--t)}
  .nav-b .num{font-family:var(--mono);font-size:9.5px;letter-spacing:.5px;width:18px;flex:none;text-align:right;opacity:0;transition:opacity var(--t)}
  .nav-b .lbl{opacity:0;transition:opacity var(--t)}
  .wrap.exp .nav-b .num,.wrap.exp .nav-b .lbl{opacity:1}
  .nav-b .ic{width:18px;height:18px;flex:none;display:grid;place-items:center;color:inherit}
  .nav-b .ic svg{width:17px;height:17px;display:block}
  .nav-b:hover{color:var(--ink-soft);background:var(--panel-2)}
  .nav-b.on{color:var(--ink)}
  .nav-b.on .ic{color:var(--accent);filter:drop-shadow(0 0 6px var(--accent-glow))}
  .side-active{margin:14px 9px 0;font-size:10.5px;color:var(--ink-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;transition:opacity var(--t)}
  .wrap.exp .side-active{opacity:1}
  .side-active b{color:var(--ink-soft);display:block;font-size:12px;margin-top:2px;font-weight:500}
  .side-foot{margin:14px 9px 6px;font-size:10.5px;color:var(--ink-dim);border-top:1px solid var(--line);padding-top:12px;white-space:normal;opacity:0;transition:opacity var(--t)}
  .wrap.exp .side-foot{opacity:1}
  .theme-btn{display:flex;align-items:center;gap:12px;width:100%;margin-top:auto;border:1px solid var(--line);background:transparent;color:var(--ink-dim);font:inherit;font-size:11.5px;padding:9px 11px;border-radius:var(--r);cursor:pointer;white-space:nowrap;transition:all var(--t)}
  .theme-btn:hover{color:var(--ink-soft);border-color:var(--line-strong)}
  .theme-btn .i{width:15px;height:15px;flex:none}
  .theme-btn .lbl{opacity:0;transition:opacity var(--t)}
  .wrap.exp .theme-btn .lbl{opacity:1}
```

Nota: `.side-foot` y `.side-active` ocultos colapsado; `.theme-btn` con `margin-top:auto` ancla abajo. El `aside` necesita `display:flex;flex-direction:column` (incluido arriba).

- [ ] **Step 3: JS de expansión (junto al JS de tema)**

```js
/* ===== riel colapsable ===== */
(function(){
  const w=document.querySelector('.wrap'),a=document.querySelector('aside');
  if(!w||!a)return;
  a.addEventListener('mouseenter',()=>w.classList.add('exp'));
  a.addEventListener('mouseleave',()=>w.classList.remove('exp'));
})();
```

- [ ] **Step 4: Eyebrows numerados** — cada `.page` empieza con `<div class="eyebrow">Texto</div>`. Anteponer el número de su sección con barra, conservando la palabra actual. Lista exacta (id de página → eyebrow nuevo):
`inicio→01 / Bienvenido` · `dashboard→02 / Tus ideas` · `proyecto→03 / Asistente` · `roadmap→04 / Paso a paso` (usar el texto actual tras la barra; si difiere, conservar el existente) · `dispositivos→05 / …` · `analizar→06 / …` · `seguridad→07 / …` · `arquitectura→08 / …` · `diccionario→09 / …` · `prompts→10 / …` · `errores→11 / …`. El patrón es: `NN / <texto actual sin cambios>`. Envolver el número en `<b>` para colorearlo.

CSS del eyebrow (reemplaza la regla actual):
```css
  .eyebrow{font-family:var(--mono);font-size:10.5px;letter-spacing:2.5px;color:var(--ink-dim);text-transform:uppercase;font-weight:400}
  .eyebrow b{color:var(--accent);font-weight:500}
```

- [ ] **Step 5: Media query móvil** — en la regla `@media(max-width:820px)` ya existe `aside{display:none}`; añadir `.wrap{grid-template-columns:1fr}` ya está. No requiere cambios, solo confirmar que sigue así.

- [ ] **Step 6: Verificar sintaxis + navegador** — riel colapsado de 64px, expande al hover, numeración visible, los 11 botones navegan, móvil (`responsive design mode`) muestra `.mtop`.

- [ ] **Step 7: Commit** — `git commit -am "Rediseño precisión 2/6: riel colapsable + eyebrows numerados"`

---

### Task 3: Componentes núcleo (tipografía, botones, tarjetas, barras, inputs, toast)

**Files:**
- Modify: `index.html` (reglas CSS indicadas)

- [ ] **Step 1: Encabezados y lead** — reemplazar reglas existentes de `h1` (si está en `main` genérico, ajustar la que aplique), `.lead`:

```css
  h1{font-size:30px;font-weight:650;letter-spacing:-.03em;margin:6px 0 8px}
  .lead{color:var(--ink-soft);font-size:13.5px;max-width:560px}
```

- [ ] **Step 2: Botones** — reemplazar `.btn`, `.btn.primary`(o la clase primaria que exista; el primario actual usa `--brand` de fondo), `.btn.ghost`, `.btn.sm`, `.btn.danger`:

```css
  .btn{font:inherit;font-size:12.5px;padding:8px 16px;border-radius:var(--r);cursor:pointer;border:1px solid var(--accent);background:var(--accent);color:#fff;box-shadow:0 0 18px var(--accent-glow);transition:all var(--t)}
  .btn:hover{box-shadow:0 0 26px var(--accent-glow)}
  .btn.ghost{background:transparent;border-color:var(--line-strong);color:var(--ink-soft);box-shadow:none}
  .btn.ghost:hover{color:var(--ink);border-color:var(--ink-dim)}
  .btn.sm{padding:6px 12px;font-size:12px}
  .btn.danger{background:transparent;border-color:transparent;color:var(--bad);box-shadow:none}
  .btn.danger:hover{border-color:var(--bad)}
```

(Comprobar primero cómo se llama el botón primario en el CSS actual — es `.btn` a secas con fondo `--brand` — y mantener la misma jerarquía de clases.)

- [ ] **Step 3: Tarjetas + marcas de registro** — reemplazar `.card` y añadir las marcas (CSS puro, sin tocar HTML):

```css
  .card{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:22px 24px;margin-bottom:14px;transition:border-color var(--t)}
  .card:hover{border-color:var(--line-strong)}
  .card::before,.card::after{content:"";position:absolute;width:7px;height:7px;border:0 solid var(--line-strong);opacity:.8;pointer-events:none}
  .card::before{top:-1px;left:-1px;border-top-width:1px;border-left-width:1px}
  .card::after{bottom:-1px;right:-1px;border-bottom-width:1px;border-right-width:1px}
```

⚠️ Si `.card::before/::after` ya se usan para otra cosa, buscar antes (`grep -n "card:before\|card::before\|card:after" index.html`) y resolver el conflicto.

- [ ] **Step 4: Barras de progreso** — reemplazar `.progwrap/.progbar`, `.scorebar/.scorefill`, `.plat .bar`, `.ph-roll .bar`:

```css
  .progwrap{height:2px;background:var(--line);border-radius:1px;overflow:hidden;border:0;margin:10px 0 4px}
  .progbar{height:100%;width:0;background:var(--ink-soft);transition:width .4s}
  .scorebar{flex:1;height:2px;background:var(--line);border-radius:1px;overflow:hidden;border:0}
  .scorefill{height:100%;background:var(--ink-soft)}
  .plat .bar{height:2px;background:var(--line);border:0;border-radius:1px;overflow:hidden;margin:10px 0 9px}
  .ph-roll .bar{flex:1;height:2px;background:var(--line);border:0;border-radius:1px;overflow:hidden}
```

Nota: los rellenos que el JS pinta con colores de estado (`bar i` con background inline) se quedan como están — color de estado permitido.

- [ ] **Step 5: Inputs / selects / textareas** — localizar las reglas de `input,select,textarea` (o `label` + campos del formulario) y reemplazar por línea inferior:

```css
  input[type=text],input[type=url],textarea,select{width:100%;font:inherit;font-size:13.5px;background:transparent;border:0;border-bottom:1px solid var(--line-strong);color:var(--ink);padding:7px 1px;outline:0;border-radius:0;transition:border-color var(--t)}
  input[type=text]:focus,input[type=url]:focus,textarea:focus,select:focus{border-color:var(--accent)}
  select{cursor:pointer}
  label{display:block;font-family:var(--mono);font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:var(--ink-dim);margin:14px 0 4px}
```

⚠️ Ajustar a los selectores reales del archivo (puede que use `.form-sec input` etc.). `select` sin fondo hereda el del sistema para el desplegable: aceptable.

- [ ] **Step 6: Toast** — reemplazar `.toast`:

```css
  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);opacity:0;background:var(--panel);color:var(--ink);border:1px solid var(--ok);font-family:var(--mono);font-size:12px;letter-spacing:.5px;padding:9px 18px;border-radius:var(--r);transition:.25s;pointer-events:none;z-index:50}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
```

- [ ] **Step 7: iconbtn** —

```css
  .iconbtn{display:inline-grid;place-items:center;width:26px;height:26px;flex:none;cursor:pointer;border:1px solid var(--line);background:transparent;color:var(--ink-soft);border-radius:var(--r);padding:0;transition:all var(--t)}
  .iconbtn:hover{color:var(--accent);border-color:var(--accent)}
```

- [ ] **Step 8: Verificar sintaxis + navegador** (Inicio, Mis proyectos, formulario). **Commit** — `git commit -am "Rediseño precisión 3/6: componentes núcleo"`

---

### Task 4: Componentes de sección (anillo-dial, pestañas, checklists, ranking, fixes, insignias)

**Files:**
- Modify: `index.html` (reglas CSS indicadas)

- [ ] **Step 1: Anillo-instrumento** — reemplazar `.ring` (hoy conic-gradient grueso con `:after` inset 11px):

```css
  .ring{--p:0;width:118px;height:118px;border-radius:50%;flex:none;background:conic-gradient(var(--accent) calc(var(--p)*1%),var(--line) 0);display:grid;place-items:center;position:relative;filter:drop-shadow(0 0 6px var(--accent-glow))}
  .ring:after{content:"";position:absolute;inset:2.5px;border-radius:50%;background:var(--panel)}
  .ring:before{content:"";position:absolute;inset:-7px;border-radius:50%;background:repeating-conic-gradient(var(--line-strong) 0 .6deg,transparent .6deg 45deg);-webkit-mask:radial-gradient(closest-side,transparent calc(100% - 5px),#000 calc(100% - 5px));mask:radial-gradient(closest-side,transparent calc(100% - 5px),#000 calc(100% - 5px))}
  .ring b{position:relative;z-index:1;font-family:var(--mono);font-size:24px;font-weight:500;letter-spacing:-1px;color:var(--ink)}
  .ring small{position:relative;z-index:1;font-family:var(--mono);color:var(--ink-dim);font-size:9px;letter-spacing:2px;text-transform:uppercase}
  .level{font-size:14px;font-weight:600}
```

- [ ] **Step 2: Pestañas del analizador y seguridad** — `.an-modes/.an-mode` (las usan ambas secciones):

```css
  .an-modes{display:flex;gap:22px;margin:6px 0 16px;border-bottom:1px solid var(--line);flex-wrap:wrap}
  .an-mode{cursor:pointer;border:0;background:none;color:var(--ink-dim);padding:0 2px 10px;font:inherit;font-size:12.5px;font-weight:500;position:relative}
  .an-mode.on{color:var(--ink)}
  .an-mode.on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:var(--accent);box-shadow:0 0 8px var(--accent-glow)}
```

- [ ] **Step 3: Checklists (.task)** —

```css
  .task{border:0;border-top:1px solid var(--line);border-radius:0;padding:13px 2px;margin:0;background:transparent}
  .task .tl input{appearance:none;width:16px;height:16px;flex:none;margin-top:2px;border:1px solid var(--line-strong);border-radius:4px;cursor:pointer;position:relative;transition:all var(--t)}
  .task .tl input:checked{border-color:var(--ok)}
  .task .tl input:checked::after{content:"";position:absolute;inset:3px;border-radius:2px;background:var(--ok)}
  .task .tl span{font-weight:500;color:var(--ink);font-size:13.5px}
  .task.checked .tl span{color:var(--ink-dim);text-decoration:line-through;text-decoration-color:var(--line-strong)}
```

- [ ] **Step 4: Insignias y estados** — `.sev`, `.secpill`, `.pill`, `.typebadge`, `.badge-best`, `.mtag` pasan a monospace contorno (ya usan `currentColor`, solo la piel):

```css
  .sev{font-family:var(--mono);font-size:9.5px;font-weight:500;letter-spacing:1.2px;text-transform:uppercase;border-radius:3px;padding:2px 8px;border:1px solid currentColor;margin-left:6px}
  .secpill{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;font-weight:500;border:1px solid currentColor;border-radius:var(--r);padding:3px 10px;letter-spacing:.5px}
  .badge-best{margin-left:auto;font-family:var(--mono);font-size:9.5px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:var(--accent);background:transparent;border:1px solid var(--accent);padding:3px 9px;border-radius:3px}
  .typebadge{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:500;color:var(--ink);background:transparent;border:1px solid var(--line-strong);border-radius:var(--r);padding:6px 13px}
```

- [ ] **Step 5: Pase de radios y píldoras** — sustituir TODOS los `border-radius` que no sean círculos (`50%`/`999px` decorativos de chips/pills ya tratados): valores `14px/12px/11px/10px/9px/8px/7px/6px` → `var(--r)`. Comando de apoyo para encontrarlos:
`grep -nE "border-radius:(14|12|11|10|9|8|7|6)px" index.html`
Los `border-radius:999px` restantes (chips, gloss, medal, pnum) → `var(--r)` salvo los círculos reales (`.pnum`, `.medal-n`, `.gloss`, `.chip .cx`, `.dot` se quedan `50%` si lo son).

- [ ] **Step 6: Acentos rgba lila viejos** — el CSS tiene rgba hardcodeados del lila anterior y turquesa. Buscar y reemplazar:
`grep -n "155,140,255\|34,211,238\|124,108,255" index.html`
- `rgba(155,140,255,.X)` → `var(--accent-glow)` si es glow/sombra, `var(--accent-soft)` si es fondo, o `var(--accent)` al 40% para bordes → usar `color-mix(in srgb,var(--accent) 40%,transparent)`.
- `rgba(34,211,238,…)` (turquesa: `.pjcard.cur`, `.adv`) → mismo criterio con `--accent`.
- `rgba(124,108,255,.08)` (`.cost .tot td`) → `var(--accent-soft)`.

- [ ] **Step 7: Verificar sintaxis + navegador** (Roadmap, Dispositivos, Analizar con repo real, Seguridad las 3 pestañas). **Commit** — `git commit -am "Rediseño precisión 4/6: anillo-dial, pestañas, checklists, insignias"`

---

### Task 5: Caza de colores hardcodeados (tema claro funcional)

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Inventario** — `grep -nE "#fff|#d7def0|#cdd6ea|#04210f|#15131f|#0a0b0d|rgba\(28,35,47" index.html` (sobre CSS y sobre templates JS).

- [ ] **Step 2: Reemplazos en CSS** (lista conocida; puede haber más, el grep manda):
- `.pjcard h3{color:#fff}`, `.term h3{color:#fff}`, `.mistake h3{color:#fff}`, `.rankcat>h3{color:#fff}`, `.opt .oname{color:#fff}`, `.ring b{color:#fff}` (ya cambiado en Task 4), `.cost .tot td{color:#fff}` → todos `color:var(--ink)`.
- `pre`/`.ex`/`code` con `#d7def0`/`#cdd6ea` → `color:var(--code-ink)`.
- `.toast` `#04210f` ya eliminado en Task 3.
- `.gloss:hover{background:var(--brand);color:#15131f}` → `color:#fff`.
- `.layer{background:rgba(28,35,47,.5)}` → `background:var(--panel)`.
- `.btn` primario `color:#fff` se queda (sobre violeta siempre va blanco, ambos temas).

- [ ] **Step 3: Reemplazos en templates JS** — el JS genera estilos inline (`style="color:${col}"` con var(--ok) etc.: están bien). Buscar hex crudos en templates: `grep -n "#fff\|#0a0b0d" index.html | grep -v "^\s*\." ` y convertir los que pinten texto/fondos fijos a `var(--ink)`/`var(--panel)`. Los `var(--ok)/var(--warn)/var(--bad)/var(--accent)` inline quedan.

- [ ] **Step 4: QA visual en claro** — recorrer las 11 secciones con tema claro buscando: texto blanco invisible, fondos oscuros pegados, bordes desaparecidos. Arreglar in situ con tokens.

- [ ] **Step 5: Verificar sintaxis. Commit** — `git commit -am "Rediseño precisión 5/6: tema claro completo, sin colores hardcodeados"`

---

### Task 6: Verificación total, limpieza y publicación

**Files:**
- Modify: `RESUMEN.md` · Delete: `mockup-precision.html`

- [ ] **Step 1: Sintaxis** — comando transversal. Esperado `sintaxis OK`.

- [ ] **Step 2: Servir y recorrer TODO en ambos temas** — `python3 -m http.server 8765` + Playwright. Recorrido mínimo en CADA tema: 11 secciones renderizan · formulario genera mapa · checkbox de roadmap persiste · diccionario filtra · pestañas de seguridad conmutan · analizar repo real (`giopark4444-commits/mapa-de-apps-v2`) sin `undefined/NaN` · auditoría seguridad termina y la insignia % aparece en Mis proyectos e Inicio · toggle de tema persiste tras recargar (localStorage `maTheme`) · riel expande/colapsa · 0 errores JS en consola.

- [ ] **Step 3: Capturas** — Inicio, Mis proyectos y Seguridad en oscuro y claro (6 archivos) para revisión del usuario.

- [ ] **Step 4: Borrar mockup** — `git rm mockup-precision.html` (el spec queda como referencia).

- [ ] **Step 5: RESUMEN.md** — añadir fila al historial: rediseño "Precisión" (doble tema con toggle, riel colapsable numerado, violeta único con glow, marcas de registro, anillo-instrumento; contenido y flujos intactos). Actualizar la línea de "Estética minimalista" de la sección 5 para describir la nueva dirección.

- [ ] **Step 6: Commit final + push** — `git add -A && git commit -m "Rediseño precisión 6/6: verificación completa, limpieza y RESUMEN"` y `git push`.

---

## Self-review del plan

- **Cobertura del spec:** tokens (T1) · riel+numeración (T2) · componentes núcleo (T3) · dial/pestañas/checklists/insignias (T4) · tema claro (T5) · verificación dos temas+capturas+limpieza mockup (T6). El "glow que respira" del botón primario del Inicio queda cubierto por el glow estático de `.btn` — la animación de respiración se omite por YAGNI (decisión: el glow estático cumple; si Gio la pide, es una regla `@keyframes` de 3 líneas).
- **Placeholders:** los pasos con `grep` son instrucciones ejecutables con criterio de reemplazo explícito, no TODOs.
- **Consistencia:** `--brand` se mantiene como alias de `--accent` porque los templates JS lo referencian; `--brand-2` pasa a violeta claro. `--line-strong` se define en T1 y se usa en T2-T4. `toggleTheme`/`themeLabel` definidos en T1, usados en T2.
