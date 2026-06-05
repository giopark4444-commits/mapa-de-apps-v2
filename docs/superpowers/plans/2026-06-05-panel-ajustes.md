# Panel de Ajustes (Sección 12) — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sección "12 · Ajustes" para personalizar acento, glow, riel y texto en vivo, persistido en `maPrefs`.

**Architecture:** Todo vive en `index.html` (app de un solo archivo). Un módulo JS de preferencias (tablas de valores válidos + `loadPrefs/applyPrefs/setPref/inkSet`) escribe variables CSS inline sobre `<html>`; la página `#ajustes` es HTML estático con chips segmentados manejados por delegación de eventos; `renderAjustes()` sincroniza los estados `.on`.

**Tech Stack:** HTML/CSS/JS vanilla. Verificación: Node (sintaxis + lógica extraída) y navegador (Playwright vía `python3 -m http.server`; si el Chrome del MCP se bloquea: `lsof +D ~/Library/Caches/ms-playwright/mcp-chrome-* | awk 'NR>1{print $2}' | sort -u | xargs kill -9`).

**Regla transversal:** no tocar contenido ni lógica existente fuera de lo aquí especificado. Verificar sintaxis tras cada tarea con:
`node -e "const h=require('fs').readFileSync('index.html','utf8');new Function(h.match(/<script>([\s\S]*?)<\/script>/)[1]);console.log('sintaxis OK')"`

---

### Task 1: Módulo de preferencias (JS) + cableado del riel

**Files:**
- Modify: `/Users/usuario/Desktop/mapa-de-apps/index.html` (final del `<script>`, IIFE del riel, IIFE de tema, 1 regla CSS)

- [ ] **Step 1: Insertar el módulo de prefs ANTES del IIFE de tema** (busca `/* ===== tema claro/oscuro ===== */`); pegar justo antes:

```js
/* ===== preferencias de apariencia (sección Ajustes) ===== */
const PREF_DEFAULTS={accent:'violeta',glow:'normal',railIc:'normal',railMode:'hover',fontZoom:'normal',inkTone:'neutro',inkContrast:'normal'};
const PREF_ACCENTS={violeta:[139,92,246],cian:[6,182,212],verde:[16,185,129],ambar:[245,158,11],rosa:[236,72,153]};
const PREF_GLOWS={apagado:0,suave:.2,normal:.35,fuerte:.55};
const PREF_RAIL_IC={pequeno:'15px',normal:'17px',grande:'19px'};
const PREF_ZOOMS={compacto:.92,normal:1,grande:1.1};
const PREF_VALID={accent:Object.keys(PREF_ACCENTS),glow:Object.keys(PREF_GLOWS),railIc:Object.keys(PREF_RAIL_IC),railMode:['hover','fijo','colapsado'],fontZoom:Object.keys(PREF_ZOOMS),inkTone:['neutro','calido','frio'],inkContrast:['suave','normal','alto']};
function loadPrefs(){
  let raw={};try{raw=JSON.parse(localStorage.getItem('maPrefs')||'{}')||{}}catch(_){raw={}}
  const p={...PREF_DEFAULTS};
  for(const k in PREF_DEFAULTS){if(PREF_VALID[k].includes(raw[k]))p[k]=raw[k];}
  return p;
}
/* grises del texto según tema × tono × contraste (l de --ink, --ink-soft, --ink-dim) */
function inkSet(theme,tone,contrast){
  const hue=tone==='calido'?35:tone==='frio'?225:0, sat=tone==='neutro'?0:6;
  const L=theme==='dark'
    ? {suave:[85,58,36],normal:[93,63,40],alto:[100,72,46]}[contrast]
    : {suave:[18,38,62],normal:[10,33,66],alto:[3,25,55]}[contrast];
  return L.map(l=>`hsl(${hue} ${sat}% ${l}%)`);
}
function applyPrefs(){
  const p=loadPrefs(), r=document.documentElement, s=r.style;
  const [cr,cg,cb]=PREF_ACCENTS[p.accent];
  s.setProperty('--accent',`rgb(${cr} ${cg} ${cb})`);
  s.setProperty('--accent-glow',`rgba(${cr},${cg},${cb},${PREF_GLOWS[p.glow]})`);
  s.setProperty('--accent-soft',`rgba(${cr},${cg},${cb},.09)`);
  s.setProperty('--rail-ic',PREF_RAIL_IC[p.railIc]);
  const m=document.querySelector('main'); if(m)m.style.zoom=PREF_ZOOMS[p.fontZoom];
  if(p.inkTone==='neutro'&&p.inkContrast==='normal'){
    s.removeProperty('--ink');s.removeProperty('--ink-soft');s.removeProperty('--ink-dim');
  }else{
    const [i,so,di]=inkSet(r.dataset.theme,p.inkTone,p.inkContrast);
    s.setProperty('--ink',i);s.setProperty('--ink-soft',so);s.setProperty('--ink-dim',di);
  }
  const w=document.querySelector('.wrap');
  if(w){w.dataset.railmode=p.railMode;w.classList.toggle('exp',p.railMode==='fijo');}
}
function setPref(k,v){
  const p=loadPrefs(); p[k]=v;
  const out={}; for(const key in p){if(p[key]!==PREF_DEFAULTS[key])out[key]=p[key];}
  if(Object.keys(out).length)localStorage.setItem('maPrefs',JSON.stringify(out));
  else localStorage.removeItem('maPrefs');
  applyPrefs();
  if(typeof renderAjustes==='function')renderAjustes();
}
```

- [ ] **Step 2: Llamar `applyPrefs()` al cargar y al cambiar tema.** (a) Dentro del IIFE de tema, en `toggleTheme`, después de `sync();` añadir `applyPrefs();` (los inks dependen del tema). (b) Justo después del cierre del IIFE de tema, añadir la línea `applyPrefs();` (aplicación inicial; el módulo ya está definido arriba).

- [ ] **Step 3: El riel respeta `railMode`.** En el IIFE del riel, reemplazar los dos listeners por:

```js
  a.addEventListener('mouseenter',()=>{if((w.dataset.railmode||'hover')==='hover')w.classList.add('exp')});
  a.addEventListener('mouseleave',()=>{if((w.dataset.railmode||'hover')==='hover')w.classList.remove('exp')});
```

- [ ] **Step 4: Cablear `--rail-ic` en CSS.** En la regla `.nav-b .ic svg{width:17px;height:17px;display:block}` cambiar a `.nav-b .ic svg{width:var(--rail-ic,17px);height:var(--rail-ic,17px);display:block}`.

- [ ] **Step 5: Test de lógica con Node** (extrae las funciones y las prueba con localStorage simulado):

```bash
cd /Users/usuario/Desktop/mapa-de-apps && node -e "
const h=require('fs').readFileSync('index.html','utf8');
const js=h.match(/<script>([\s\S]*?)<\/script>/)[1];
const seg=js.slice(js.indexOf('const PREF_DEFAULTS'),js.indexOf('function applyPrefs'));
let store={};global.localStorage={getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]};
eval(seg);
// inválido → defaults
store.maPrefs=JSON.stringify({accent:'fucsia',glow:'fuerte',basura:1});
let p=loadPrefs();
if(p.accent!=='violeta')throw new Error('accent inválido no cayó a default');
if(p.glow!=='fuerte')throw new Error('glow válido no se respetó');
// corrupto → defaults
store.maPrefs='{{{';p=loadPrefs();
if(p.railMode!=='hover')throw new Error('corrupto no cayó a default');
// inkSet coherente
const d=inkSet('dark','neutro','normal'),l=inkSet('light','frio','alto');
if(d.length!==3||!d[0].includes('93%'))throw new Error('inkSet dark mal');
if(!l[0].includes('225'))throw new Error('inkSet frio sin hue 225');
console.log('lógica de prefs OK');
"
```
Esperado: `lógica de prefs OK`. Después el check de sintaxis transversal: `sintaxis OK`.

- [ ] **Step 6: Commit** — `git add index.html && git commit -m "Ajustes 1/4: módulo de preferencias + riel configurable"`

---

### Task 2: HTML de la sección 12 + entrada del riel + CSS de controles

**Files:**
- Modify: `/Users/usuario/Desktop/mapa-de-apps/index.html` (aside, main, `<style>`)

- [ ] **Step 1: Entrada del riel.** En el `aside`, dentro del grupo "La guía", después del botón de Errores comunes (`data-go="errores"`), añadir:

```html
        <button class="nav-b" data-go="ajustes"><span class="num">12</span><span class="ic"><svg viewBox="0 0 24 24"><path d="M4 8h10M18 8h2M4 16h2M10 16h10"/><circle cx="16" cy="8" r="2"/><circle cx="8" cy="16" r="2"/></svg></span><span class="lbl">Ajustes</span></button>
```

- [ ] **Step 2: Página `#ajustes`.** Dentro de `<main>`, después del cierre de la última sección `.page` (id `errores`), añadir:

```html
<section class="page" id="ajustes">
  <div class="eyebrow"><b>12</b> / A tu gusto</div>
  <h1>Ajustes</h1>
  <p class="lead">Personaliza la apariencia de la app. Todo se aplica al instante y se guarda en este dispositivo.</p>
  <div class="card"><h3>Apariencia</h3>
    <label>Tema</label>
    <div class="segrow"><button class="seg" data-pref="theme" data-val="dark">Oscuro</button><button class="seg" data-pref="theme" data-val="light">Claro</button></div>
    <label>Color de acento</label>
    <div class="segrow">
      <button class="sw" data-pref="accent" data-val="violeta" style="--sw:#8b5cf6" title="Violeta"></button>
      <button class="sw" data-pref="accent" data-val="cian" style="--sw:#06b6d4" title="Cian"></button>
      <button class="sw" data-pref="accent" data-val="verde" style="--sw:#10b981" title="Verde"></button>
      <button class="sw" data-pref="accent" data-val="ambar" style="--sw:#f59e0b" title="Ámbar"></button>
      <button class="sw" data-pref="accent" data-val="rosa" style="--sw:#ec4899" title="Rosa"></button>
    </div>
    <label>Intensidad del glow</label>
    <div class="segrow"><button class="seg" data-pref="glow" data-val="apagado">Apagado</button><button class="seg" data-pref="glow" data-val="suave">Suave</button><button class="seg" data-pref="glow" data-val="normal">Normal</button><button class="seg" data-pref="glow" data-val="fuerte">Fuerte</button></div>
  </div>
  <div class="card"><h3>Riel de navegación</h3>
    <label>Tamaño de iconos</label>
    <div class="segrow"><button class="seg" data-pref="railIc" data-val="pequeno">Pequeño</button><button class="seg" data-pref="railIc" data-val="normal">Normal</button><button class="seg" data-pref="railIc" data-val="grande">Grande</button></div>
    <label>Comportamiento</label>
    <div class="segrow"><button class="seg" data-pref="railMode" data-val="hover">Expandir al pasar</button><button class="seg" data-pref="railMode" data-val="fijo">Siempre expandido</button><button class="seg" data-pref="railMode" data-val="colapsado">Siempre colapsado</button></div>
  </div>
  <div class="card"><h3>Texto</h3>
    <label>Tamaño</label>
    <div class="segrow"><button class="seg" data-pref="fontZoom" data-val="compacto">Compacto</button><button class="seg" data-pref="fontZoom" data-val="normal">Normal</button><button class="seg" data-pref="fontZoom" data-val="grande">Grande</button></div>
    <label>Tono del gris</label>
    <div class="segrow"><button class="seg" data-pref="inkTone" data-val="neutro">Neutro</button><button class="seg" data-pref="inkTone" data-val="calido">Cálido</button><button class="seg" data-pref="inkTone" data-val="frio">Frío</button></div>
    <label>Contraste</label>
    <div class="segrow"><button class="seg" data-pref="inkContrast" data-val="suave">Suave</button><button class="seg" data-pref="inkContrast" data-val="normal">Normal</button><button class="seg" data-pref="inkContrast" data-val="alto">Alto</button></div>
  </div>
  <div class="row"><button class="btn ghost" id="resetPrefs">Restaurar todo</button></div>
  <p style="font-size:11.5px;color:var(--ink-dim);margin-top:10px">Estos ajustes se guardan solo en este navegador; no viajan en los respaldos.</p>
</section>
```

- [ ] **Step 3: CSS de los controles.** Añadir al final del `<style>` (antes del media query):

```css
  .segrow{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 4px;align-items:center}
  .seg{font:inherit;font-size:12px;padding:6px 13px;border-radius:var(--r);cursor:pointer;border:1px solid var(--line-strong);background:transparent;color:var(--ink-soft);transition:color var(--t),border-color var(--t)}
  .seg:hover{color:var(--ink)}
  .seg.on{color:var(--ink);border-color:var(--accent);box-shadow:0 0 10px var(--accent-glow)}
  .sw{width:22px;height:22px;border-radius:50%;border:1px solid var(--line-strong);background:var(--sw);cursor:pointer;padding:0;flex:none}
  .sw.on{outline:2px solid var(--sw);outline-offset:3px;border-color:transparent}
```

- [ ] **Step 4: Verificar** — sintaxis transversal + `node -e "const h=require('fs').readFileSync('index.html','utf8');for(const t of ['data-go=\"ajustes\"','id=\"ajustes\"','data-pref=\"accent\"','id=\"resetPrefs\"','.seg.on']){if(!h.includes(t))throw new Error('FALTA: '+t)}console.log('estructura OK')"`. Nota: el botón del riel funciona sin JS nuevo porque los listeners de navegación se registran sobre todos los `.nav-b` al cargar.

- [ ] **Step 5: Commit** — `git add index.html && git commit -m "Ajustes 2/4: sección 12 con controles + entrada del riel"`

---

### Task 3: Lógica del panel (render, delegación, restaurar)

**Files:**
- Modify: `/Users/usuario/Desktop/mapa-de-apps/index.html` (final del `<script>`, después del módulo de prefs y los IIFEs)

- [ ] **Step 1: Añadir al final del `<script>`:**

```js
/* ===== panel de Ajustes ===== */
function renderAjustes(){
  const sec=document.getElementById('ajustes'); if(!sec)return;
  const p=loadPrefs();
  sec.querySelectorAll('[data-pref]').forEach(b=>{
    const k=b.dataset.pref;
    const cur=k==='theme'?document.documentElement.dataset.theme:p[k];
    b.classList.toggle('on',b.dataset.val===cur);
  });
}
(function(){
  const sec=document.getElementById('ajustes'); if(!sec)return;
  sec.addEventListener('click',e=>{
    const b=e.target.closest('[data-pref]');
    if(b){
      if(b.dataset.pref==='theme'){
        if(document.documentElement.dataset.theme!==b.dataset.val)toggleTheme();
        renderAjustes();
      }else setPref(b.dataset.pref,b.dataset.val);
      return;
    }
    if(e.target.closest('#resetPrefs')){
      localStorage.removeItem('maPrefs');
      const s=document.documentElement.style;
      ['--accent','--accent-glow','--accent-soft','--rail-ic','--ink','--ink-soft','--ink-dim'].forEach(v=>s.removeProperty(v));
      applyPrefs();renderAjustes();showToast('Ajustes restaurados ✓');
    }
  });
  renderAjustes();
})();
```

- [ ] **Step 2: El render debe refrescarse al alternar tema desde el riel.** En `toggleTheme` (IIFE de tema), después de `applyPrefs();` añadir `if(typeof renderAjustes==='function')renderAjustes();`

- [ ] **Step 3: Verificar** — sintaxis transversal + `node -e "const h=require('fs').readFileSync('index.html','utf8');const js=h.match(/<script>([\s\S]*?)<\/script>/)[1];for(const t of ['function renderAjustes','resetPrefs','Ajustes restaurados']){if(!js.includes(t))throw new Error('FALTA: '+t)}console.log('panel OK')"`

- [ ] **Step 4: Commit** — `git add index.html && git commit -m "Ajustes 3/4: lógica del panel con restaurar"`

---

### Task 4: Verificación en navegador + publicación

**Files:**
- Modify: `/Users/usuario/Desktop/mapa-de-apps/RESUMEN.md`

- [ ] **Step 1: Servir y probar** — `python3 -m http.server 8765` + Playwright sobre `http://127.0.0.1:8765/index.html`. Checks mínimos (en evaluate):
  - Navegar a `#ajustes` desde el riel; eyebrow empieza con `12`.
  - Click swatch cian → `getComputedStyle(document.documentElement).getPropertyValue('--accent')` contiene `6, 182, 212` (o `6 182 212`); el botón primario cambia de color a simple vista (screenshot).
  - Glow "apagado" → `--accent-glow` termina en `,0)`.
  - Riel "Siempre expandido" → `.wrap` tiene clase `exp` sin hover; "Siempre colapsado" → mouseenter no expande.
  - Texto "grande" → `document.querySelector('main').style.zoom==='1.1'`.
  - Tono "frío" + contraste "alto" → `--ink` inline contiene `225`.
  - Recargar página → todas las prefs persisten (re-chequear `--accent` y zoom).
  - "Restaurar todo" → `localStorage.maPrefs` vacío, `--accent` inline vuelve al violeta por defecto (`applyPrefs` siempre lo escribe), chips vuelven a defaults.
  - Cambiar tema con prefs de ink activas → los inks se recalculan (valor distinto de `--ink` entre temas).
  - Regresión: las 11 secciones renderizan, 0 errores JS.
- [ ] **Step 2: Captura** de la sección Ajustes (oscuro) para el usuario.
- [ ] **Step 3: RESUMEN.md** — en la sección 2 (menú), añadir `12. **Ajustes** — personaliza tema, acento, glow, riel y texto; se guarda por dispositivo.` y una fila al historial.
- [ ] **Step 4: Commit + push** — `git add -A && git commit -m "Ajustes 4/4: verificación y RESUMEN" && git push`

---

## Self-review del plan

- **Cobertura del spec:** tema (T2 chips + T3 lógica), acento+glow (T1 applyPrefs, T2 swatches), riel tamaño/comportamiento (T1 Steps 3-4, T2), texto zoom/tono/contraste (T1 inkSet/applyPrefs, T2), restaurar (T3), persistencia solo-no-defaults (T1 setPref), prefs por dispositivo/nota respaldos (T2 nota al pie), verificación dos temas (T4). Sin huecos.
- **Placeholders:** ninguno; todo el código está completo.
- **Consistencia de nombres:** `loadPrefs/applyPrefs/setPref/inkSet/renderAjustes/PREF_*` idénticos entre tareas; `data-pref/data-val` consistentes entre T2 (HTML) y T3 (delegación); `--rail-ic` definida en T1 y usada en T1 Step 4.
