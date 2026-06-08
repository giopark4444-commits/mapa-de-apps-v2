/* ===== navegación ===== */
const pages=[...document.querySelectorAll('.page')];
function go(id){
  pages.forEach(p=>p.classList.toggle('on',p.id===id));
  document.querySelectorAll('#nav .nav-b').forEach(b=>b.classList.toggle('on',b.dataset.go===id));
  document.querySelectorAll('#mtop .nav-b').forEach(b=>b.classList.toggle('on',b.dataset.go===id));
  if(id==='inicio') renderHome();
  if(id==='roadmap') renderPhases();
  if(id==='dashboard') renderDashboard();
  if(id==='proyecto'){renderSwitch();loadForm();}
  if(id==='dispositivos') renderDevices();
  if(id==='seguridad') renderBlindaje(); // precarga la pestaña de blindaje
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
const hamburgerSvg='<svg viewBox="0 0 24 24"><path d="M3 7h18"/><path d="M3 12h18"/><path d="M3 17h18"/></svg>';
const logoSvg='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2.2 5-5 2.2 2.2-5z"/></svg>';
const navButtons=[...document.querySelectorAll('#nav .nav-b')].map(b=>`<button class="nav-b ${b.classList.contains('on')?'on':''}" data-go="${b.dataset.go}"><span class="ic">${b.querySelector('.ic').innerHTML}</span> <span class="lbl">${(b.querySelector('.lbl')||{textContent:b.textContent}).textContent.trim()}</span></button>`).join('');
document.getElementById('mtop').innerHTML=`<button class="mtop-logo" title="Mapa de Apps"><span class="i">${logoSvg}</span></button><button class="hamburger" id="hamburger" title="Menú"><span class="i">${hamburgerSvg}</span></button><div class="menu-dropdown" id="menu-dropdown">${navButtons}</div>${navButtons}`;
document.querySelectorAll('#mtop .nav-b').forEach(b=>b.addEventListener('click',()=>{go(b.dataset.go);document.getElementById('menu-dropdown').classList.remove('open');}));
document.getElementById('hamburger').addEventListener('click',()=>document.getElementById('menu-dropdown').classList.toggle('open'));
document.addEventListener('click',e=>{if(!e.target.closest('#hamburger')&&!e.target.closest('#menu-dropdown'))document.getElementById('menu-dropdown').classList.remove('open');});

/* ===== toast + copiar ===== */
const toast=document.getElementById('toast');
function showToast(t='Copiado ✓'){toast.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1500);}
document.addEventListener('click',e=>{
  const ct=e.target.closest('[data-copytext]');
  if(ct){navigator.clipboard.writeText(ct.getAttribute('data-copytext')).then(()=>showToast('Prompt copiado'));return;}
  const c=e.target.closest('[data-copy]');if(!c)return;navigator.clipboard.writeText(document.querySelector(c.dataset.copy).innerText).then(()=>showToast());
});
function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function escAttr(s){return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'&#10;');}
/* ===== documentación oficial: enlaza nombres de productos conocidos ===== */
const DOCS=[
  [/github/i,'https://docs.github.com/es','GitHub'],
  [/\bgit\b/i,'https://git-scm.com/doc','Git'],
  [/supabase/i,'https://supabase.com/docs','Supabase'],
  [/firebase/i,'https://firebase.google.com/docs','Firebase'],
  [/vercel/i,'https://vercel.com/docs','Vercel'],
  [/netlify/i,'https://docs.netlify.com/','Netlify'],
  [/next\.?js/i,'https://nextjs.org/docs','Next.js'],
  [/react native/i,'https://reactnative.dev/docs/getting-started','React Native'],
  [/\breact\b/i,'https://react.dev/learn','React'],
  [/expo|eas/i,'https://docs.expo.dev/','Expo'],
  [/capacitor/i,'https://capacitorjs.com/docs','Capacitor'],
  [/excalidraw/i,'https://docs.excalidraw.com/','Excalidraw'],
  [/stripe/i,'https://stripe.com/docs','Stripe'],
  [/sentry/i,'https://docs.sentry.io/','Sentry'],
];
// Renderiza una herramienta del roadmap; si es un producto conocido, la enlaza a su doc oficial.
function gtool(t){
  for(const [re,url] of DOCS){ if(re.test(t)) return `<a class="gtool gtool-doc" href="${url}" target="_blank" rel="noopener">${esc(t)} <span class="gt-ext">↗</span></a>`; }
  return `<span class="gtool">${esc(t)}</span>`;
}
// Documentación oficial relevante por plataforma (sección "Llevar a dispositivos").
const PLAT_DOCS={
  web:[['Vercel · publicar','https://vercel.com/docs'],['Netlify','https://docs.netlify.com/'],['PWA · MDN','https://developer.mozilla.org/es/docs/Web/Progressive_web_apps']],
  android:[['Google Play Console','https://support.google.com/googleplay/android-developer'],['Capacitor · Android','https://capacitorjs.com/docs/android'],['PWA → Play (TWA)','https://developer.chrome.com/docs/android/trusted-web-activity']],
  ios:[['Apple Developer','https://developer.apple.com/documentation/'],['App Store Connect','https://developer.apple.com/help/app-store-connect/'],['Capacitor · iOS','https://capacitorjs.com/docs/ios']],
  tablet:[['Diseño responsive · MDN','https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Responsive_Design'],['PWA · MDN','https://developer.mozilla.org/es/docs/Web/Progressive_web_apps']],
};
function platDocs(key){
  const d=PLAT_DOCS[key]; if(!d) return '';
  return `<div class="plat-docs"><span class="pd-label">${ic('book')} Documentación oficial:</span> ${d.map(([n,u])=>`<a href="${u}" target="_blank" rel="noopener">${esc(n)} <span class="gt-ext">↗</span></a>`).join('')}</div>`;
}
/* ===== sistema de iconos (línea, un color) ===== */
const ICONS={
 target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/>',
 pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
 tool:'<path d="M14.7 6.3a3.6 3.6 0 0 0-4.8 4.5L4 16.7 7.3 20l5.9-5.9a3.6 3.6 0 0 0 4.5-4.8l-2.3 2.3-2-2z"/>',
 window:'<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9h17"/>',
 server:'<rect x="3.5" y="4.5" width="17" height="6" rx="1.5"/><rect x="3.5" y="13.5" width="17" height="6" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
 test:'<path d="M9 3h6"/><path d="M10 3v6l-4.4 8a2 2 0 0 0 1.8 3h9.2a2 2 0 0 0 1.8-3L14 9V3"/><path d="M7.6 15h8.8"/>',
 upload:'<path d="M12 15V4"/><path d="M7.5 8.5 12 4l4.5 4.5"/><path d="M5 19h14"/>',
 download:'<path d="M12 4v11"/><path d="M7.5 10.5 12 15l4.5-4.5"/><path d="M5 19h14"/>',
 refresh:'<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 16"/><path d="M4 20v-4h4"/>',
 check:'<path d="M5 12.5 10 17 19 7"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 half:'<circle cx="12" cy="12" r="7.5"/><path d="M12 4.5a7.5 7.5 0 0 1 0 15z" fill="currentColor" stroke="none"/>',
 info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><path d="M12 7.6h.01"/>',
 users:'<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M15.5 5.4a3.2 3.2 0 0 1 0 6.2"/><path d="M16.5 13.4a5.5 5.5 0 0 1 4 5.6"/>',
 bag:'<path d="M6 8h12l-1 11H7z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
 checkSquare:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 12 11 14.5 15.5 9.5"/>',
 book:'<path d="M5 4.5h11a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2z"/><path d="M18 16.5H7a2 2 0 0 0-2 2"/>',
 message:'<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3.5z"/>',
 calendar:'<rect x="4" y="5.5" width="16" height="14" rx="2"/><path d="M4 9.5h16"/><path d="M8 3.5v3M16 3.5v3"/>',
 chart:'<path d="M4 4v16h16"/><path d="M8 16v-4M12 16v-7M16 16v-3"/>',
 globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.6 2.6 2.6 14.4 0 17M12 3.5c-2.6 2.6-2.6 14.4 0 17"/>',
 spark:'<path d="M12 3v18M3 12h18"/><path d="M5.6 5.6 18.4 18.4M18.4 5.6 5.6 18.4" opacity=".55"/>',
 folder:'<path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h3.6l2 2.3H19a1.5 1.5 0 0 1 1.5 1.5v8.2A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z"/>',
 trash:'<path d="M5 7h14"/><path d="M9 7V5h6v2"/><path d="M7 7l1 12h8l1-12"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 note:'<path d="M6 3.5h8L19 8v12.5H6z"/><path d="M14 3.5V8h5"/><path d="M9 13h6M9 16.5h4"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5 16.5 16.5"/>',
 pin:'<path d="M9 4h6v6l2 3H7l2-3z"/><path d="M12 13v6"/>',
 list:'<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
 layers:'<path d="M12 3 21 8l-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
 coin:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M14.5 9.3a2.6 2.6 0 0 0-2.5-1.3c-1.6 0-2.6.9-2.6 2s1 1.8 2.6 2 2.6.9 2.6 2-1 2-2.6 2a2.6 2.6 0 0 1-2.5-1.3"/>',
 bulb:'<path d="M9.5 17.5h5"/><path d="M10 20.5h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.6.6.9 1.1.9 2.4h5.8c0-1.3.3-1.8.9-2.4A6 6 0 0 0 12 3z"/>',
 alert:'<path d="M12 4 21 20H3z"/><path d="M12 10v4.5M12 17.6h.01"/>',
 share:'<circle cx="6" cy="12" r="2.5"/><circle cx="17" cy="6" r="2.5"/><circle cx="17" cy="18" r="2.5"/><path d="M8.2 10.8 14.8 7.2M8.2 13.2l6.6 3.6"/>',
 arrowRight:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 flag:'<path d="M6 21V4"/><path d="M6 4.5h11l-2 3 2 3H6"/>',
 cube:'<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
 database:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3.5v3M12 17.5v3M4.6 7.5l2.6 1.5M16.8 15l2.6 1.5M19.4 7.5 16.8 9M7.2 15l-2.6 1.5"/>',
 phone:'<rect x="7" y="3.5" width="10" height="17" rx="2.2"/><path d="M11 17.5h2"/>',
 cpu:'<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><rect x="10" y="10" width="4" height="4" rx="1"/><path d="M9 3.5v3M15 3.5v3M9 17.5v3M15 17.5v3M3.5 9h3M3.5 15h3M17.5 9h3M17.5 15h3"/>',
 trending:'<path d="M4 16 10 10l3 3 7-7"/><path d="M15 9h5v5"/>',
 wallet:'<rect x="3.5" y="6" width="17" height="13" rx="2"/><path d="M3.5 10h17"/><path d="M16 13.5h.01"/>',
 eyeOff:'<path d="M4 4l16 16"/><path d="M9.6 9.6a3 3 0 0 0 4.2 4.2"/><path d="M7 7C4.6 8.6 3 12 3 12s3 6 9 6c1.6 0 3-.4 4.2-1M10 5.2A9 9 0 0 1 12 5c6 0 9 6 9 6s-.6 1.2-1.9 2.6"/>',
 save:'<path d="M5 4.5h11L19.5 8v11.5H5z"/><path d="M8 4.5V9h7"/><rect x="8.5" y="13" width="7" height="6.5"/>',
 key:'<circle cx="8" cy="8" r="3.6"/><path d="M10.6 10.6 20 20M16 16l2-2M18 18l1.5-1.5"/>',
 shield:'<path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6z"/><path d="M9.5 12l1.8 1.8 3.5-3.6"/>',
 lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14v3"/>',
 grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
 git:'<circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><circle cx="17" cy="9" r="2.4"/><path d="M6 8.4v7.2M8.2 7.2 14.8 9M17 11.4c0 4-4 3.6-8 3.6"/>',
 copy:'<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M5.5 15.5H5A1.5 1.5 0 0 1 3.5 14V5A1.5 1.5 0 0 1 5 3.5h9A1.5 1.5 0 0 1 15.5 5v.5"/>',
 apple:'<path d="M14.6 3.6c.2 1.3-.4 2.5-1.2 3.2"/><path d="M15.8 20.4c-1 0-1.7-.6-3.3-.6s-2.4.6-3.4.6C7 20.4 4.5 16.5 4.5 13c0-2.7 1.9-4.2 3.6-4.2 1.2 0 2.1.7 3 .7s1.7-.8 3.2-.7c1.6.1 2.6.9 3.1 1.9-2.7 1.6-2.2 5.3.4 6.3-.6 1.3-1.4 3.4-2 3.4z"/>',
 android:'<rect x="5" y="9" width="14" height="9" rx="2"/><path d="M5 13.5h14M8 9 6.5 6M16 9l1.5-3"/><circle cx="9.5" cy="6.6" r=".55" fill="currentColor" stroke="none"/><circle cx="14.5" cy="6.6" r=".55" fill="currentColor" stroke="none"/>',
 tablet:'<rect x="4.5" y="3.5" width="15" height="17" rx="2"/><path d="M10 17.5h4"/>',
 devices:'<rect x="3" y="5" width="12.5" height="9" rx="1.5"/><path d="M6 17.5h6.5"/><rect x="16.5" y="9" width="5" height="9" rx="1.2"/>',
};
function ic(name){return `<span class="i"><svg viewBox="0 0 24 24">${ICONS[name]||ICONS.spark}</svg></span>`;}

/* ===== datos: varios proyectos ===== */
const DB_KEY='mapa_db_v2';
const FIELDS=['que','problema','quien','donde','datos','login','escala','func','integraciones','sensibles','estilo','monetiza','inspiracion','presupuesto','plazo'];
function uid(){return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);}
function blankFields(){return {que:'',problema:'',quien:'',donde:'web',datos:'no',login:'no',escala:'hobby',func:'',integraciones:'',sensibles:'no',estilo:'auto',monetiza:'no',inspiracion:'',presupuesto:'gratis',plazo:'sin-prisa'};}
function loadDB(){
  let db=JSON.parse(localStorage.getItem(DB_KEY)||'null'); if(db) return db;
  const old=JSON.parse(localStorage.getItem('mapa_proyecto_v1')||'null');
  const oldRm=JSON.parse(localStorage.getItem('mapa_roadmap_v1')||'{}');
  db={activeId:null,projects:{}};
  if(old){const id=uid();const f=blankFields();FIELDS.forEach(k=>{if(old[k]!==undefined)f[k]=old[k];});
    db.projects[id]={name:truncName(old.que||'Mi primer proyecto'),createdAt:Date.now(),fields:f,roadmap:oldRm,notes:'',generated:!!old.que};db.activeId=id;}
  return db;
}
let DB=loadDB();
function saveDB(){localStorage.setItem(DB_KEY,JSON.stringify(DB));}
function active(){return DB.projects[DB.activeId];}
function projCount(){return Object.keys(DB.projects).length;}
function newProject(name,silent){const id=uid();DB.projects[id]={name:name||('Proyecto '+(projCount()+1)),createdAt:Date.now(),fields:blankFields(),roadmap:{},notes:'',generated:false};DB.activeId=id;saveDB();if(!silent)showToast('Proyecto creado ✓');return id;}
function ensureProject(){if(!DB.activeId||!DB.projects[DB.activeId]){const ids=Object.keys(DB.projects);if(ids.length)DB.activeId=ids[0];else newProject('Proyecto 1',true);saveDB();}}
ensureProject();
function refreshChrome(){document.getElementById('sideActive').textContent=active().name;document.getElementById('rmProjName').textContent=active().name;updateProg();}

/* ===== detectar tipo de app ===== */
const TYPES=[
 {k:'tienda',e:ic('bag'),label:'Tienda / e-commerce',kw:['vend','tienda','product','compr','carrito','pago','ecommerce','catálogo de venta','pedido'],
  mvp:'Lista de productos + ver detalle + carrito. Deja pagos reales para después.',
  screens:'Catálogo, detalle de producto, carrito, checkout.',
  data:'Productos (nombre, precio, foto, stock), pedidos, clientes.',
  test:'Agregar al carrito, cambiar cantidades, simular una compra.'},
 {k:'social',e:ic('users'),label:'Red social / comunidad',kw:['red social','seguir','amig','publica','feed','perfil','comunidad','comentar','like','post'],
  mvp:'Crear perfil + publicar + ver el feed de los demás.',
  screens:'Feed, perfil, crear publicación, detalle con comentarios.',
  data:'Usuarios, publicaciones, comentarios, seguidores.',
  test:'Publicar, comentar, ver el feed con varias cuentas.'},
 {k:'tareas',e:ic('checkSquare'),label:'Tareas / productividad',kw:['tarea','pendient','to-do','todo','lista','organiz','hábito','recordator','nota','agenda personal'],
  mvp:'Agregar tareas, marcarlas como hechas y borrarlas.',
  screens:'Lista principal, agregar/editar tarea, filtros (hechas/pendientes).',
  data:'Tareas (texto, hecha sí/no, fecha, categoría).',
  test:'Crear, completar, editar y borrar una tarea; recargar y ver que persiste.'},
 {k:'contenido',e:ic('book'),label:'Catálogo / contenido',kw:['blog','artícul','noticia','receta','reseñ','libro','películ','música','galería','curso','wiki'],
  mvp:'Lista de elementos + ver detalle de cada uno + buscador.',
  screens:'Listado, detalle, buscador/filtros.',
  data:'Elementos (título, descripción, imagen, categoría, nota).',
  test:'Buscar, filtrar, abrir detalles; probar con muchos elementos.'},
 {k:'chat',e:ic('message'),label:'Chat / mensajería',kw:['chat','mensaj','conversa','sala','tiempo real'],
  mvp:'Enviar y recibir mensajes en una sala en tiempo real.',
  screens:'Lista de chats, conversación, escribir mensaje.',
  data:'Mensajes (autor, texto, hora), salas, usuarios.',
  test:'Abrir en dos ventanas y ver que los mensajes llegan al instante.'},
 {k:'reservas',e:ic('calendar'),label:'Reservas / citas',kw:['reserv','cita','turno','booking','horario','agenda','calendario','disponib'],
  mvp:'Ver horarios disponibles y reservar uno.',
  screens:'Calendario/horarios, formulario de reserva, mis reservas.',
  data:'Servicios, horarios, reservas (cliente, fecha, hora).',
  test:'Reservar un hueco y confirmar que ya no aparece disponible.'},
 {k:'dashboard',e:ic('chart'),label:'Panel de datos / finanzas',kw:['dashboard','panel','métrica','gráfic','finanz','gasto','presupuesto','control de','seguimiento de','estadístic'],
  mvp:'Ingresar datos y verlos resumidos en una gráfica o totales.',
  screens:'Resumen con números/gráficas, agregar registro, historial.',
  data:'Registros (monto/valor, fecha, categoría).',
  test:'Agregar registros y verificar que los totales y gráficas cuadran.'},
 {k:'landing',e:ic('globe'),label:'Landing / portafolio',kw:['landing','portafolio','presentación','mi negocio','página de','one page','currículum','cv'],
  mvp:'Una sola página atractiva con tu información y un botón de contacto.',
  screens:'Secciones: portada, sobre mí/nosotros, servicios, contacto.',
  data:'Normalmente no necesita guardar datos (quizá un formulario de contacto).',
  test:'Verla en celular y computadora; probar el botón/formulario de contacto.'},
];
function detectType(f){
  const t=((f.que||'')+' '+(f.func||'')).toLowerCase();
  for(const ty of TYPES){if(ty.kw.some(k=>t.includes(k)))return ty;}
  return {k:'general',e:ic('spark'),label:'App a medida',mvp:'La versión más simple que ya resuelva el problema principal. Una sola pantalla funcional.',
    screens:'La pantalla principal con la acción más importante.',data:'Lo mínimo que necesites recordar entre usos.',test:'Probar la acción principal de inicio a fin.'};
}

/* ===== switcher + dashboard ===== */
function renderSwitch(){document.getElementById('projSwitch').innerHTML=Object.entries(DB.projects).map(([id,p])=>`<option value="${id}" ${id===DB.activeId?'selected':''}>${esc(p.name)}</option>`).join('');}
document.getElementById('projSwitch').addEventListener('change',e=>{DB.activeId=e.target.value;saveDB();loadForm();refreshChrome();showToast('Cambiaste de proyecto');});
document.getElementById('renameBtn').addEventListener('click',()=>{const n=prompt('Nuevo nombre:',active().name);if(n&&n.trim()){active().name=n.trim();saveDB();renderSwitch();refreshChrome();renderDashboard();showToast('Renombrado ✓');}});
document.getElementById('delBtn').addEventListener('click',()=>{if(projCount()<=1){showToast('Necesitas al menos un proyecto');return;}if(!confirm('¿Eliminar "'+active().name+'" y todo su avance?'))return;delete DB.projects[DB.activeId];DB.activeId=Object.keys(DB.projects)[0];saveDB();loadForm();renderSwitch();refreshChrome();renderDashboard();showToast('Eliminado');});
document.getElementById('newProjBtn2').addEventListener('click',()=>{newProject();loadForm();renderSwitch();refreshChrome();renderDashboard();});
document.getElementById('newProjBtn').addEventListener('click',()=>{newProject();renderDashboard();go('proyecto');});

function projProgress(p){const total=PHASES.reduce((a,ph)=>a+ph.tasks.length,0);const done=Object.values(p.roadmap||{}).filter(Boolean).length;return {done,total,pct:Math.round(done/total*100)};}
// color del nivel de seguridad — único lugar donde viven los umbrales (dashboard, inicio y reporte lo comparten)
function secColor(sa){return sa.crit?'var(--bad)':sa.pct>=80?'var(--ok)':'var(--warn)';}
// recorta nombres largos en una palabra completa y con elipsis (evita "…apunta los libros q")
function truncName(s){s=(s||'').trim();if(s.length<=42)return s;const cut=s.slice(0,42);const i=cut.lastIndexOf(' ');return (i>20?cut.slice(0,i):cut)+'…';}
function renderDashboard(){
  const grid=document.getElementById('projGrid');
  grid.innerHTML=Object.entries(DB.projects).map(([id,p])=>{
    const pr=projProgress(p);const cur=id===DB.activeId;const ty=detectType(p.fields);
    const sa=p.secAudit;
    const secCol=sa?secColor(sa):'var(--ink-dim)';
    const secPill=sa?`<span class="secpill" style="color:${secCol};border-color:${secCol}" title="Última auditoría de seguridad${sa.repo?' de '+esc(sa.repo):''}">${ic('shield')} Seguridad ${sa.pct}%${sa.crit?' · '+sa.crit+' crítico'+(sa.crit>1?'s':''):''}</span>`:'';
    return `<div class="pjcard ${cur?'cur':''}">${cur?'<span class="curtag">● ACTIVO</span>':''}
      <h3>${esc(p.name)}</h3>
      <div class="meta">${ty.e} ${ty.label} · creado ${new Date(p.createdAt).toLocaleDateString('es')} · ${p.generated?'mapa generado':'sin mapa aún'}</div>
      <div class="desc">${p.fields.que?esc(p.fields.que):'<i style="color:var(--ink-dim)">Aún sin descripción</i>'}</div>
      <div class="progwrap"><div class="progbar" style="width:${pr.pct}%"></div></div>
      <div class="hint">${pr.done}/${pr.total} pasos (${pr.pct}%)${p.notes?' · con notas':''}</div>
      ${sa?`<div style="margin-top:9px">${secPill}</div>`:''}
      <div class="row" style="margin-top:12px"><button class="btn sm" data-open="${id}">Abrir</button><button class="btn ghost sm" data-rm="${id}">Roadmap</button>${sa?`<button class="btn ghost sm" data-sec="${id}">Seguridad</button>`:''}<button class="btn danger sm" data-del="${id}">Eliminar</button></div></div>`;
  }).join('');
  grid.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{DB.activeId=b.dataset.open;saveDB();loadForm();refreshChrome();go('proyecto');}));
  grid.querySelectorAll('[data-rm]').forEach(b=>b.addEventListener('click',()=>{DB.activeId=b.dataset.rm;saveDB();loadForm();refreshChrome();go('roadmap');}));
  grid.querySelectorAll('[data-sec]').forEach(b=>b.addEventListener('click',()=>{DB.activeId=b.dataset.sec;saveDB();loadForm();refreshChrome();go('seguridad');}));
  grid.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',()=>{if(projCount()<=1){showToast('Necesitas al menos un proyecto');return;}const p=DB.projects[b.dataset.del];if(!confirm('¿Eliminar "'+(p.name||'proyecto')+'"?'))return;delete DB.projects[b.dataset.del];if(DB.activeId===b.dataset.del)DB.activeId=Object.keys(DB.projects)[0];saveDB();renderDashboard();refreshChrome();showToast('Eliminado');}));
}

/* ===== exportar / importar ===== */
document.getElementById('exportBtn').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(DB,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='mapa-de-apps-respaldo-'+new Date().toISOString().slice(0,10)+'.json';a.click();
  URL.revokeObjectURL(a.href);showToast('Respaldo descargado ✓');
});
// los respaldos pueden venir editados o de otra versión: descarta auditorías malformadas (evita "undefined%")
function sanitizeProject(p){if(p&&p.secAudit&&(typeof p.secAudit.pct!=='number'||typeof p.secAudit.crit!=='number'))delete p.secAudit;return p;}
document.getElementById('importBtn').addEventListener('click',()=>document.getElementById('importFile').click());
document.getElementById('importFile').addEventListener('change',e=>{
  const file=e.target.files[0];if(!file)return;const r=new FileReader();
  r.onload=()=>{try{
    const data=JSON.parse(r.result);
    if(!data.projects)throw 0;
    const mode=confirm('Aceptar = AÑADIR estos proyectos a los tuyos.\nCancelar = REEMPLAZAR todo por el respaldo.');
    if(mode){let n=0;for(const id in data.projects){const nid=DB.projects[id]?uid():id;DB.projects[nid]=sanitizeProject(data.projects[id]);n++;}showToast(n+' proyecto(s) añadidos ✓');}
    else{DB=data;ensureProject();Object.values(DB.projects).forEach(sanitizeProject);showToast('Respaldo restaurado ✓');}
    saveDB();renderSwitch();loadForm();refreshChrome();renderDashboard();
  }catch(_){showToast('Archivo no válido');}e.target.value='';};
  r.readAsText(file);
});

/* ===== formulario + notas ===== */
function loadForm(){
  const f=active().fields;FIELDS.forEach(k=>{const el=document.getElementById('f_'+k);if(el)el.value=f[k];});
  document.getElementById('f_notes').value=active().notes||'';
  if(active().generated&&f.que){generate(true);}else{document.getElementById('projOut').classList.remove('show');}
}
function readForm(){const o={};FIELDS.forEach(k=>{o[k]=document.getElementById('f_'+k).value;});return o;}
FIELDS.forEach(k=>{const el=document.getElementById('f_'+k);el&&el.addEventListener('input',()=>{active().fields=readForm();saveDB();});});
document.getElementById('f_notes').addEventListener('input',e=>{active().notes=e.target.value;saveDB();});

/* ===== ranking de stack ===== */
function rankFrontend(v){
  const web=v.donde==='web'||v.donde==='nose'||v.donde==='ambos',mobile=v.donde==='movil'||v.donde==='ambos';
  const simple=v.datos==='no'&&v.login!=='si',big=v.escala==='grande';const o=[];
  o.push({name:'HTML + CSS + JavaScript',tag:'sin framework, lo más simple',score:web?(simple?96:58)-(big?15:0):18,
    why:simple?'Tu app es sencilla y para web: lo más fácil de entender, casi sin instalar nada. Perfecto para aprender.':'Funciona, pero con datos/cuentas se vuelve difícil de mantener a mano.',
    pros:['Cero/mínima instalación','Fácil de entender','Puede ser un solo archivo'],cons:['Se complica en apps grandes','Trabajo manual repetido']});
  o.push({name:'React (con Vite)',tag:'el estándar moderno web',score:web?(simple?72:90):24,
    why:'La tecnología web más usada: Claude la domina y hay ayuda para todo. Gran equilibrio potencia/facilidad.',
    pros:['Muchísima ayuda y ejemplos','Escala bien','Claude la conoce a fondo'],cons:['Pequeña curva de aprendizaje','Hay que instalar herramientas']});
  o.push({name:'Next.js',tag:'React + extras para apps serias',score:web?((!simple||big)?86:60):24,
    why:(!simple||big)?'Como tendrás datos/cuentas (o quieres crecer), une frontend y backend y se publica gratis en Vercel facilísimo.':'Potente, pero quizá más de lo que tu app simple necesita hoy.',
    pros:['Frontend y backend juntos','Deploy gratis sencillo','Gran rendimiento'],cons:['Más conceptos','Excesivo para apps muy simples']});
  if(mobile){
    o.push({name:'React Native (Expo)',tag:'celular iOS + Android',score:92,why:'Quieres móvil: con Expo haces iPhone y Android con un código y pruebas en tu celular al instante.',pros:['iOS y Android con un código','Pruebas en tu celular ya','Comparte base con React web'],cons:['Publicar en tiendas tiene trámite','Algo más complejo que una web']});
    o.push({name:'Flutter',tag:'alternativa móvil de Google',score:82,why:'Otra gran opción móvil, muy fluida. Usa el lenguaje Dart en vez de JavaScript.',pros:['Apps muy fluidas','iOS y Android a la vez'],cons:['Lenguaje distinto (Dart)','Menos compartible con web']});
  }
  return o;
}
function rankBackend(v){
  const o=[];
  if(v.datos==='no'){o.push({name:'No necesitas backend',tag:'solo frontend',score:96,why:'Tu app no guarda info: sin servidor ni base de datos. Más simple y gratis de publicar.',pros:['Nada que mantener','Gratis','Menos cosas que fallar'],cons:['No recuerda datos entre visitas']});
    o.push({name:'localStorage',tag:'por si luego guardas algo',score:58,why:'Si luego quieres recordar algo solo en el dispositivo, basta sin montar nada.',pros:['Cero configuración','Gratis'],cons:['Solo ese dispositivo','No se comparte']});return o;}
  if(v.datos==='local'){o.push({name:'localStorage',tag:'guardado en el dispositivo',score:90,why:'Quieres guardar datos solo para ti en tu dispositivo: lo más simple y gratis.',pros:['Cero configuración','Gratis','Funciona sin internet'],cons:['No sincroniza entre dispositivos']});
    o.push({name:'Supabase',tag:'por si luego quieres nube',score:56,why:'Si en el futuro entras desde varios dispositivos, migrar a Supabase es el paso natural.',pros:['Crece contigo','Login y archivos listos'],cons:['Más de lo que necesitas hoy']});return o;}
  const big=v.escala==='grande';
  o.push({name:'Supabase',tag:'base de datos + cuentas, todo en uno',score:big?90:93,why:'Base de datos, login y archivos listos, panel visual fácil y buen plan gratis. Claude lo maneja muy bien (¡ya lo tienes instalado!).',pros:['BD + login + archivos juntos','Panel visual amigable','Plan gratis generoso'],cons:['Conceptos de BD por aprender']});
  o.push({name:'Firebase',tag:'la opción de Google',score:86,why:'Muy popular, ideal para tiempo real (chats, notificaciones en vivo). También tienes su plugin instalado.',pros:['Tiempo real muy fácil','Muy probado','Buen plan gratis'],cons:['Puede costar al escalar','No es BD tradicional']});
  o.push({name:'Backend propio (Node)',tag:'máximo control',score:big?60:42,why:big?'Si apuntas a algo muy grande, da control total — pero requiere experiencia. Empieza con Supabase y migra si hace falta.':'Control total, pero mantienes mucho más tú. Mejor con experiencia.',pros:['Control total','Sin límites de proveedor'],cons:['Mucho más trabajo','Tú mantienes el servidor','No ideal para empezar']});
  return o;
}
function rankDeploy(v){
  const o=[],mobile=v.donde==='movil'||v.donde==='ambos',web=v.donde!=='movil';
  if(web){o.push({name:'Vercel',tag:'publicar webs gratis',score:91,why:'Publicas en minutos conectando GitHub. Gratis para empezar y se actualiza solo al cambiar algo.',pros:['Gratis para empezar','Súper fácil','Se actualiza automático'],cons:['Funciones avanzadas de pago']});
    o.push({name:'Netlify',tag:'alternativa a Vercel',score:85,why:'Casi idéntico a Vercel, igual de fácil.',pros:['Gratis','Fácil','Formularios incluidos'],cons:['Muy similar a Vercel: elige uno']});
    if(v.datos==='no')o.push({name:'GitHub Pages',tag:'webs simples',score:74,why:'Si es solo frontend, lo publicas gratis directo desde GitHub.',pros:['100% gratis','Integrado con GitHub'],cons:['Solo webs estáticas']});}
  if(mobile)o.push({name:'Expo EAS + tiendas',tag:'App Store / Google Play',score:80,why:'Para móvil, Expo te ayuda a generar la app y subirla a las tiendas paso a paso.',pros:['Guía a las tiendas','iOS y Android'],cons:['Apple ~US$99/año','Google ~US$25 única vez']});
  return o;
}
// Glosario corto de términos del stack para explicar en contexto (tooltip nativo)
const TECHDEF={
  'react':'Una de las formas más usadas de construir webs por piezas (componentes). Muy popular: hay ayuda para todo.',
  'vite':'Una herramienta que hace que tu web cargue y se actualice rapidísimo mientras la construyes.',
  'next.js':'React con extras: une la parte visible y la lógica, y se publica gratis muy fácil en Vercel.',
  'vue':'Otra forma popular y amigable de construir webs por componentes, parecida a React.',
  'svelte':'Una forma moderna y ligera de construir webs; escribe menos código.',
  'angular':'Un framework grande y completo para webs, usado sobre todo en empresas.',
  'html + css + javascript':'Los tres ladrillos básicos de toda web: estructura, estilo y comportamiento. Lo más simple para empezar.',
  'react native':'Te deja hacer apps de iPhone y Android con un solo código, parecido a React.',
  'expo':'Un kit que facilita mucho React Native: pruebas en tu celular al instante y publicas más fácil.',
  'flutter':'Tecnología de Google para apps móviles muy fluidas; usa el lenguaje Dart.',
  'supabase':'Te da base de datos, cuentas de usuario y archivos listos, con un panel visual fácil y plan gratis.',
  'firebase':'La opción de Google: base de datos en tiempo real, cuentas y más, muy usada.',
  'localstorage':'Un cajón del propio navegador para guardar datos solo en ese dispositivo. Cero configuración.',
  'vercel':'Servicio para publicar tu web en minutos conectando GitHub. Gratis para empezar.',
  'netlify':'Muy parecido a Vercel: publica tu web fácil y gratis.',
  'github pages':'Forma gratuita de publicar webs sencillas directamente desde GitHub.',
  'git + github':'Git guarda cada versión de tu código (un "deshacer" infinito); GitHub lo respalda en la nube.',
  'backend propio (node)':'Construir tú mismo el "cerebro" del servidor. Más control, pero mucho más trabajo.',
};
function glossChip(name){
  const n=(name||'').toLowerCase();
  let d=TECHDEF[n];
  if(!d){ // coincidencia por palabra clave (ej. "React (con Vite)" -> react)
    const keys=Object.keys(TECHDEF).sort((a,b)=>b.length-a.length);
    const k=keys.find(key=>n.includes(key));
    if(k)d=TECHDEF[k];
  }
  return d?` <span class="gloss" title="${escAttr(d)}">?</span>`:'';
}
function renderOptions(list){list.sort((a,b)=>b.score-a.score);const max=list[0].score||1;
  return list.map((op,i)=>{const best=i===0;return `<div class="opt ${best?'best':''}"><div class="oh"><span class="medal-n">${i+1}</span><span><span class="oname">${op.name}</span>${glossChip(op.name)} <span class="otag">— ${op.tag}</span></span>${best?'<span class="badge-best">RECOMENDADO</span>':''}</div><div class="scoreline"><div class="scorebar"><div class="scorefill" style="width:${Math.max(8,Math.round(op.score/max*100))}%"></div></div><span class="scorenum">aptitud ${op.score}%</span></div><div class="why"><b>Por qué:</b> ${op.why}</div><div class="pclist"><div class="pro"><span class="pch">✓ A favor</span><ul>${op.pros.map(p=>`<li>${p}</li>`).join('')}</ul></div><div class="con"><span class="pch">✕ En contra</span><ul>${op.cons.map(c=>`<li>${c}</li>`).join('')}</ul></div></div></div>`;}).join('');
}

/* ===== costos ===== */
function renderCost(v,be){
  const mobile=v.donde==='movil'||v.donde==='ambos';
  const rows=[];
  rows.push([ic('window')+' Frontend / hosting web', v.donde==='movil'?'No aplica (es móvil)':'Vercel o Netlify, plan gratis', v.donde==='movil'?'—':'$0']);
  if(v.datos==='nube'||v.login==='si'){
    const grande=v.escala==='grande';
    rows.push([ic('database')+' Backend + base de datos', be+' — plan gratis al inicio', grande?'$0 → ~$25/mes':'$0 (free tier)']);
  } else rows.push([ic('database')+' Backend + base de datos','No necesario / guardado local','$0']);
  rows.push([ic('globe')+' Dominio propio (opcional)','Ej: mi-app.com (Namecheap, etc.)','~$10–15/año']);
  if(mobile) rows.push([ic('phone')+' Publicar en tiendas','Apple Developer + Google Play','~$99/año + $25 única vez']);
  rows.push([ic('git')+' Git + GitHub','Control de versiones','$0']);
  rows.push([ic('cpu')+' Claude (para construir)','Tu copiloto que escribe el código','Plan gratis o ~US$20/mes']);
  let minMo=0,maxMo=0;
  if(v.escala==='grande'&&(v.datos==='nube'||v.login==='si')) maxMo=25;
  const oneTime=mobile?'+ ~$99/año (Apple) y $25 (Google) si publicas en tiendas':'';
  return `<table class="cost"><tr><th>Concepto</th><th>Qué es</th><th>Costo aprox.</th></tr>
    ${rows.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}
    <tr class="tot"><td>${ic('wallet')} Para empezar y probar</td><td>Casi todo tiene plan gratis</td><td>$0 / mes</td></tr>
    <tr class="tot"><td>${ic('trending')} Si crece</td><td>Pagas solo cuando tienes uso/usuarios</td><td>~$${minMo}–${maxMo||25} / mes</td></tr></table>
    ${oneTime?`<p class="hint" style="margin-top:10px">${oneTime}. Un dominio propio es opcional (~$10–15/año); sin él, tu app igual vive gratis en una dirección tipo <code>mi-app.vercel.app</code>.</p>`:'<p class="hint" style="margin-top:10px">Un dominio propio es opcional; sin él, tu app vive gratis en una dirección tipo <code>mi-app.vercel.app</code>.</p>'}
    <div class="callout" style="margin-top:14px"><b>Sé realista, no solo es dinero:</b> lo que más "cuesta" al empezar es <b>tu tiempo</b> y la <b>curva de aprendizaje</b>. La herramienta de IA que te ayuda a construir (como Claude) suele tener un costo mensual; los servicios gratis tienen <b>límites</b> y empiezan a cobrar cuando creces. Empieza pequeño, aprende, y paga solo cuando tu app lo justifique.</div>`;
}

/* ===== generar mapa ===== */
function generate(silent){
  const v=readForm();
  if(!v.que.trim()){showToast('Escribe primero qué hace tu app');return;}
  active().fields=v;active().generated=true;
  if(active().name.startsWith('Proyecto ')) active().name=truncName(v.que);
  saveDB();renderSwitch();refreshChrome();
  const needsBackend=v.datos==='nube'||v.login==='si',needsDB=v.datos!=='no';
  const platform={web:'Aplicación web (navegador)',movil:'App móvil',ambos:'Web + móvil',nose:'Web (recomendado para empezar)'}[v.donde];
  const ty=detectType(v);
  const L={
    sensibles:{no:'No',personales:'Datos personales',pagos:'Pagos / financieros',salud:'Salud / muy sensibles'},
    estilo:{auto:'A propuesta de Claude',minimal:'Minimalista y limpio',moderno:'Moderno / tech',colorido:'Colorido y divertido',elegante:'Elegante / premium',corporativo:'Serio / corporativo'},
    monetiza:{no:'Proyecto personal',gratis:'Gratis',['pago-unico']:'Pago único',suscripcion:'Suscripción',anuncios:'Anuncios',comision:'Comisión por venta'},
    presupuesto:{gratis:'Solo gratis',poco:'Poco (pocos US$/mes)',flexible:'Flexible'},
    plazo:{['sin-prisa']:'Sin prisa',semanas:'En semanas',pronto:'Lo antes posible'},
  };
  const opt=(v2)=>esc(v2)?esc(v2):'<span style="color:var(--ink-dim)">No indicado</span>';
  document.getElementById('briefCard').innerHTML=`<div class="typetag">${ty.e} Tipo detectado: ${ty.label}</div><dl class="kv" style="margin-top:12px">
    <dt>Propósito</dt><dd>${esc(v.que)}</dd>
    <dt>Problema que resuelve</dt><dd>${opt(v.problema)}</dd>
    <dt>Usuarios</dt><dd>${opt(v.quien)}</dd>
    <dt>Plataforma</dt><dd>${platform}</dd><dt>Persistencia</dt><dd>${ {no:'No requiere guardar',local:'Guardado local',nube:'Base de datos en la nube'}[v.datos] }</dd>
    <dt>Autenticación</dt><dd>${ {no:'No requerida',si:'Sí (cuentas)',nose:'Por decidir'}[v.login] }</dd>
    <dt>Datos sensibles</dt><dd>${L.sensibles[v.sensibles]||'No'}${v.sensibles&&v.sensibles!=='no'?' <span style="color:var(--warn)">· requiere cuidado de seguridad</span>':''}</dd>
    <dt>Integraciones</dt><dd>${opt(v.integraciones)}</dd>
    <dt>Escala</dt><dd>${ {hobby:'Pequeña / personal',negocio:'Negocio / varios usuarios',grande:'Grande / con miras a crecer'}[v.escala] }</dd>
    <dt>Estilo visual</dt><dd>${L.estilo[v.estilo]||'A propuesta de Claude'}</dd>
    <dt>Referencias</dt><dd>${opt(v.inspiracion)}</dd>
    <dt>Monetización</dt><dd>${L.monetiza[v.monetiza]||'Proyecto personal'}</dd>
    <dt>Presupuesto · Plazo</dt><dd>${L.presupuesto[v.presupuesto]||'Solo gratis'} · ${L.plazo[v.plazo]||'Sin prisa'}</dd>
    <dt>MVP sugerido</dt><dd>${ty.mvp}</dd>
    <dt>Complejidad</dt><dd>${needsBackend?'Media — backend y datos':(needsDB?'Baja-media — datos sencillos':'Baja — solo interfaz')}</dd></dl>`;
  const feL=rankFrontend(v),beL=rankBackend(v),depL=rankDeploy(v);
  document.getElementById('rankStack').innerHTML=`
    <div class="rankcat"><h3>${ic('window')}Frontend <span class="otag">— lo visible</span></h3><div class="sub">La pantalla con la que interactúan tus usuarios.</div>${renderOptions(feL)}</div>
    <div class="rankcat"><h3>${ic('gear')}Backend y datos <span class="otag">— el cerebro</span></h3><div class="sub">Dónde se procesa y se guarda la información.</div>${renderOptions(beL)}</div>
    <div class="rankcat"><h3>${ic('upload')}Publicación <span class="otag">— para que otros la usen</span></h3><div class="sub">Dónde vivirá tu app online.</div>${renderOptions(depL)}</div>
    <div class="rankcat"><h3>${ic('git')}Control de versiones <span class="otag">— siempre recomendado</span></h3><div class="sub">Tu red de seguridad para no perder trabajo.</div>
      <div class="opt best"><div class="oh"><span class="medal-n">1</span><span><span class="oname">Git + GitHub</span> <span class="otag">— guarda cada versión</span></span><span class="badge-best">RECOMENDADO</span></div><div class="why"><b>Por qué:</b> Guarda cada versión y respalda todo en la nube. Si algo se rompe, vuelves atrás. Imprescindible.</div></div></div>`;
  document.getElementById('costCard').innerHTML=renderCost(v,beL[0].name);
  const fe=feL[0].name,be=beL[0].name,dep=depL[0].name;
  const funcs=v.func.trim()?`\nFunciones que imagino:\n${v.func.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>'- '+l).join('\n')}`:'';
  const line=(lbl,val)=>val?`\n${lbl}: ${val}`:'';
  document.getElementById('startPrompt').textContent=
`Quiero crear una app y no sé programar, así que explícame todo en palabras simples.

QUÉ HACE: ${v.que}
TIPO: ${ty.label}${line('PROBLEMA QUE RESUELVE',v.problema)}
QUIÉN LA USA: ${v.quien||'(por definir)'}
DÓNDE: ${platform}
GUARDA DATOS: ${ {no:'No',local:'Solo en el dispositivo',nube:'Sí, en la nube'}[v.datos] }
NECESITA LOGIN: ${ {no:'No',si:'Sí',nose:'Por decidir'}[v.login] }
ESCALA: ${ {hobby:'Pequeña/personal',negocio:'Negocio/varios usuarios',grande:'Quiero que crezca'}[v.escala] }${line('INTEGRACIONES (servicios externos)',v.integraciones)}${v.sensibles&&v.sensibles!=='no'?line('DATOS SENSIBLES',L.sensibles[v.sensibles]+' (necesito buenas prácticas de seguridad/privacidad)'):''}${v.estilo&&v.estilo!=='auto'?line('ESTILO VISUAL',L.estilo[v.estilo]):''}${line('REFERENCIAS QUE ME GUSTAN',v.inspiracion)}${v.monetiza&&v.monetiza!=='no'?line('MONETIZACIÓN',L.monetiza[v.monetiza]):''}
PRESUPUESTO: ${L.presupuesto[v.presupuesto]} · PLAZO: ${L.plazo[v.plazo]}${funcs}

Stack que me recomendó mi guía (dime si estás de acuerdo o propones algo mejor):
- Frontend: ${fe}
- Backend/datos: ${be}
- Publicación: ${dep}
- Control de versiones: Git + GitHub

Por favor:
1. Hazme las preguntas que necesites para entender bien la idea.
2. Confirma o ajusta el stack y explícame por qué (considera mi presupuesto, plazo e integraciones).
3. Propón un MVP y NO escribas código hasta que yo te dé el visto bueno.
4. Cuando construyas, ve de a una cosa a la vez y dime cómo probar cada parte.${v.sensibles&&v.sensibles!=='no'?'\n5. Cuida la seguridad y privacidad de los datos sensibles desde el inicio.':''}`;
  document.getElementById('projOut').classList.add('show');
  if(!silent){showToast('Mapa generado');document.getElementById('projOut').scrollIntoView({behavior:'smooth'});}
}
document.getElementById('genBtn').addEventListener('click',()=>generate(false));
document.getElementById('clearBtn').addEventListener('click',()=>{if(!confirm('¿Limpiar los campos de este proyecto?'))return;active().fields=blankFields();active().generated=false;saveDB();loadForm();showToast('Campos limpiados');});

/* ===== ROADMAP (adaptado al proyecto) ===== */
const PHASES=[
 {name:'Idea y alcance',icon:ic('target'),intro:'Define QUÉ vas a construir y, sobre todo, qué NO. El error #1 es querer hacerlo todo de una vez.',
  tasks:[
   {t:'Escribe tu idea en una frase',how:'Una frase clara guía toda la app. Si no cabe en una frase, todavía es muy grande.',tools:['La sección "Proyecto actual" de esta app'],ex:'"App para que mis clientes reserven una cita conmigo."'},
   {t:'Define tu MVP (lo mínimo que ya sirve)',how:'El MVP es la versión más pequeña que ya resuelve el problema principal. Lo demás, después.',tools:['superpowers:brainstorming (Claude)'],ex:'Empieza por: ver horarios y reservar. Pagos y recordatorios: después.'},
   {t:'Lista 3-5 funciones para la 1ª versión',how:'Pocas funciones, bien hechas. Anota el resto en una lista de "más adelante".',tools:['El campo Funciones del formulario'],ex:'1) ver productos 2) detalle 3) carrito.'},
   {t:'Anota qué dejas para después',how:'Tener una lista de "después" te quita la ansiedad de meterlo todo ya.',tools:['Notas del proyecto'],ex:'Después: login con Google, modo oscuro, compartir.'},
  ]},
 {name:'Diseño y arquitectura',icon:ic('pen'),intro:'Decide cómo se verá y qué piezas técnicas necesitas. Aquí usas el Mapa de arquitectura.',
  tasks:[
   {t:'Imagina las pantallas principales',how:'Dibuja en papel (¡vale!) las pantallas y cómo se pasa de una a otra.',tools:['Lápiz y papel','Excalidraw (gratis, online)'],ex:'Pantalla lista → tocar un ítem → pantalla detalle.'},
   {t:'Define si necesitas backend y base de datos',how:'¿Tu app debe recordar cosas para varios usuarios? Entonces sí. Si no, solo frontend.',tools:['Mapa de arquitectura (esta app)'],ex:'Una calculadora: no. Una tienda: sí.'},
   {t:'Elige tu stack',how:'Usa el ranking que esta app te generó. Si dudas, ve siempre con la opción nº1.',tools:['Proyecto actual → ranking de stack'],ex:'Frontend React + datos en Supabase + deploy en Vercel.'},
   {t:'Piensa si podrá crecer (sin sobre-construir)',how:'No necesitas aguantar millones de usuarios hoy, pero elige servicios que crezcan contigo (la nube escala sola) y no te ates a algo que se quede chico. Diséñalo simple ahora; ya crecerás cuando haga falta.',tools:['Mapa de arquitectura (esta app)','Servicios serverless (Vercel/Supabase)'],ex:'"Mi app es [tu idea] con [tu stack]. ¿Aguantaría si muchos usuarios la usan a la vez? Dime qué escala solo, qué se podría quedar corto y qué cambiarías más adelante, sin complicarme de más ahora."'},
   {t:'Pídele a Claude un boceto de la interfaz',how:'Con todas las decisiones tomadas, Claude genera una primera versión visual para reaccionar sobre algo concreto.',tools:['frontend-design (skill que ya tienes)'],ex:'"Crea la pantalla principal con [estos elementos], estilo minimalista."'},
  ]},
 {name:'Preparar el entorno',icon:ic('tool'),intro:'Dejar todo listo para construir. Claude te guía en cada instalación, paso a paso.',
  tasks:[
   {t:'Crea la carpeta del proyecto',how:'Una carpeta dedicada mantiene todo ordenado. Claude la crea por ti.',tools:['Claude Code'],ex:'"Crea una carpeta para mi proyecto y explícame qué pones dentro."'},
   {t:'Inicia el control de versiones (Git)',how:'Desde el día 1. Es tu botón de "deshacer" infinito y tu respaldo.',tools:['Git + GitHub','plugin github (ya instalado)'],ex:'"Inicia Git y haz el primer guardado (commit)."'},
   {t:'Pide a Claude la estructura base',how:'Una base limpia evita líos después. Pide que te explique cada archivo.',tools:['feature-dev (ya instalado)'],ex:'"Arma la estructura base de una app [tu stack] y explícame cada carpeta."'},
   {t:'Confirma que ves la app en localhost',how:'Localhost = tu app corriendo en tu compu antes de publicarla. Ver "algo" motiva.',tools:['run (skill que ya tienes)'],ex:'"Levanta la app y dime en qué dirección la veo en mi navegador."'},
  ]},
 {name:'Construir el frontend',icon:ic('window'),intro:'La parte visible. Empieza por lo que se ve, aunque los botones aún no hagan nada.',
  tasks:[
   {t:'Construye la pantalla principal',how:'La más importante primero. Que se vea, aunque sea con datos de ejemplo.',tools:['frontend-design (ya instalado)'],ex:'"Crea la pantalla principal con datos de ejemplo para verla."'},
   {t:'Añade la navegación entre pantallas',how:'Conecta las pantallas: que al tocar algo, te lleve a otra.',tools:['Claude Code'],ex:'"Al tocar un ítem de la lista, llévame a su pantalla de detalle."'},
   {t:'Cuida que se vea bien en celular (responsive)',how:'Mucha gente entra desde el teléfono. Pídelo explícitamente.',tools:['Modo responsive del navegador (F12)'],ex:'"Haz que se vea bien en celular; muéstrame cómo se ve en pantalla chica."'},
   {t:'Revisa colores, textos y espaciado',how:'Los detalles visuales hacen que se sienta profesional, no "hecha por IA".',tools:['frontend-design','code-simplifier (ya instalados)'],ex:'"Mejora el espaciado y usa una paleta de 2-3 colores coherente."'},
  ]},
 {name:'Construir la lógica / backend',icon:ic('gear'),intro:'Hacer que los botones funcionen y los datos se procesen. Si tu app es simple, quizá no la necesitas.',
  tasks:[
   {t:'Conecta los botones a acciones reales',how:'Que cada botón haga algo de verdad, no solo se vea.',tools:['Claude Code'],ex:'"Que el botón Guardar realmente añada el ítem a la lista."'},
   {t:'Configura la base de datos (si guardas info)',how:'Crea las "tablas" donde vivirán tus datos. Claude lo hace con tu proveedor.',tools:['supabase / firebase (ya instalados)'],ex:'"Crea en Supabase una tabla para [tus datos] y conéctala a la app."'},
   {t:'Añade login si hace falta',how:'No construyas login a mano: usa el del proveedor, es seguro y rápido.',tools:['Auth de Supabase/Firebase'],ex:'"Agrega inicio de sesión con correo usando Supabase Auth."'},
   {t:'Prueba que los datos se guarden y carguen',how:'Crea algo, recarga la página y confirma que sigue ahí.',tools:['El propio navegador'],ex:'"Guardé un ítem, recargué y debe seguir apareciendo."'},
  ]},
 {name:'Probar',icon:ic('test'),intro:'Romper tu propia app a propósito para hallar errores antes que tus usuarios.',
  tasks:[
   {t:'Prueba cada función como usuario real',how:'Recorre la app como si fueras un cliente. Anota todo lo raro.',tools:['Notas del proyecto'],ex:'Haz el camino completo: entrar → usar → lograr el objetivo.'},
   {t:'Prueba en celular y computadora',how:'Lo que funciona en una pantalla puede romperse en otra.',tools:['Tu teléfono','F12 del navegador'],ex:'Ábrela en tu celular y repite las acciones clave.'},
   {t:'Anota cada bug y pídeselo a Claude uno a uno',how:'Un bug por mensaje, con el error completo. No los amontones.',tools:['superpowers:systematic-debugging'],ex:'"Pasó esto [pasos], esperaba esto, salió esto, error: [pega todo]."'},
   {t:'Pide a Claude una revisión de seguridad',how:'Antes de publicar, que revise datos expuestos o fallos comunes.',tools:['security-guidance','code-review (ya instalados)'],ex:'"Revisa mi código por problemas de seguridad antes de publicar."'},
  ]},
 {name:'Publicar (deploy)',icon:ic('upload'),intro:'Subir tu app a internet para que el mundo la use.',
  tasks:[
   {t:'Elige dónde publicar',how:'Usa la recomendación de deploy de tu mapa. Casi siempre hay opción gratis.',tools:['Proyecto actual → ranking de deploy'],ex:'Web → Vercel. Móvil → Expo + tiendas.'},
   {t:'Sube el proyecto',how:'Conecta tu GitHub con el servicio y publica. Claude te guía clic a clic.',tools:['Vercel/Netlify + GitHub'],ex:'"Guíame paso a paso para publicar en Vercel desde mi GitHub."'},
   {t:'Haz que cargue rápido (caché y compresión)',how:'Una app veloz retiene usuarios. Tu hosting suele comprimir y servir desde una CDN solo; confírmalo y guarda en caché lo que no cambia para que la 2ª visita abra al instante.',tools:['CDN de tu hosting (Vercel/Netlify)','Service worker (PWA)'],ex:'"Optimiza la velocidad de mi app publicada: confirma que el hosting la sirve comprimida (gzip/brotli) y cachea los archivos que no cambian. Dime qué revisar y cómo, paso a paso."'},
   {t:'Prueba la versión publicada',how:'La versión online puede comportarse distinto a localhost. Pruébala igual que en local.',tools:['Tu navegador y tu celular'],ex:'Abre el enlace público y repite las pruebas clave.'},
   {t:'Comparte el enlace',how:'¡Tu app ya existe en internet! Compártela y empieza a recibir comentarios.',tools:['El enlace de tu deploy'],ex:'"mi-app.vercel.app" — mándalo a 3 personas de confianza.'},
  ]},
 {name:'Mantener y mejorar',icon:ic('refresh'),intro:'Una app viva se actualiza. Escucha a quien la usa y mejora de a poco.',
  tasks:[
   {t:'Entérate si algo falla en producción',how:'Lo primero al mantener una app es poder enterarte si algo se rompe para tus usuarios. Empieza con lo gratis que ya trae tu hosting (analítica de visitas y velocidad). Si más adelante quieres ver los errores reales de tus usuarios, puedes complementar con una "alarma" como Sentry. No es obligatorio para empezar.',tools:['Analítica de tu hosting (Vercel)','Sentry (opcional, cuando crezca)'],ex:'"Quiero enterarme si mi app falla para mis usuarios. Activa primero la analítica gratis de mi hosting y añade un aviso básico de errores en el navegador. Déjame Sentry como opción para más adelante. Explícamelo paso a paso."'},
   {t:'Recoge comentarios de usuarios',how:'Lo que tú crees obvio puede confundir a otros. Pregúntales.',tools:['Notas del proyecto'],ex:'Anota: "3 personas no encontraron el botón de guardar".'},
   {t:'Lista mejoras y nuevos errores',how:'Mantén una lista priorizada. Ataca lo importante primero.',tools:['Notas / un documento simple'],ex:'Prioridad alta: arreglar login. Baja: modo oscuro.'},
   {t:'Implementa de a poco',how:'Pequeños cambios, probados y guardados. Igual que al construir.',tools:['Claude Code + Git'],ex:'Un cambio → probar → guardar versión → siguiente.'},
   {t:'Guarda copias de seguridad',how:'Con Git ya respaldas el código. Exporta también tus proyectos de esta app.',tools:['Git','Exportar respaldo (esta app)'],ex:'Haz un commit y exporta tu respaldo cada cierto tiempo.'},
  ]},
];

function phaseAdvice(i,ty,v){
  const fe=rankFrontend(v)[0].name,be=rankBackend(v)[0].name,dep=rankDeploy(v)[0].name;
  let html='';
  const head=`<div class="adv"><div class="at">${ty.e} Para tu app · ${ty.label}</div>`;
  if(i===0) html=head+`<ul><li><b>MVP sugerido:</b> ${ty.mvp}</li><li><b>Tip:</b> escribe en Notas tu "lista de después" para no meterlo todo en la v1.</li></ul></div>`;
  else if(i===1) html=head+`<ul><li><b>Pantallas típicas de esta app:</b> ${ty.screens}</li><li><b>Datos que probablemente manejes:</b> ${ty.data}</li></ul></div>`;
  else if(i===2) html=head+`<ul><li><b>Tu stack elegido:</b> ${fe} · ${be} · deploy en ${dep}.</li><li><b>Pídele a Claude:</b> "Prepara el entorno para una app de ${fe} y explícame cada paso".</li></ul></div>`;
  else if(i===3) html=head+`<ul><li><b>Empieza por:</b> ${ty.screens.split(',')[0]}.</li><li><b>Ejemplo de prompt:</b> "Crea ${ty.screens.split(',')[0].toLowerCase()} con datos de ejemplo, estilo limpio y responsive".</li></ul></div>`;
  else if(i===4){ if(v.datos==='no') html=head+`<ul><li>Tu app <b>no necesita backend</b>: concéntrate en que la lógica del frontend funcione bien. ¡Te ahorras esta capa!</li></ul></div>`;
    else html=head+`<ul><li><b>Datos a guardar:</b> ${ty.data}</li><li><b>Con ${be}:</b> "Crea las tablas para ${ty.data.toLowerCase()} y conéctalas".</li>${v.login==='si'?'<li><b>Login:</b> usa el del proveedor, no lo hagas a mano.</li>':''}</ul></div>`; }
  else if(i===5) html=head+`<ul><li><b>Prueba clave de tu tipo de app:</b> ${ty.test}</li><li>Anota cada fallo en Notas y pásaselos a Claude de uno en uno.</li></ul></div>`;
  else if(i===6) html=head+`<ul><li><b>Para ${platformShort(v)}:</b> publica en <b>${dep}</b>.</li><li><b>Pídele:</b> "Guíame paso a paso para publicar en ${dep.split(' ')[0]}".</li></ul></div>`;
  else if(i===7) html=head+`<ul><li>Pregunta a tus primeros usuarios qué les costó usar.</li><li>Exporta tu respaldo de proyectos (botón Exportar en Mis proyectos) cada cierto tiempo.</li></ul></div>`;
  return html;
}
function platformShort(v){return {web:'web',movil:'móvil',ambos:'web y móvil',nose:'web'}[v.donde];}

const phasesEl=document.getElementById('phases');
function renderPhases(){
  const v=active().fields, ty=detectType(v), rm=active().roadmap||(active().roadmap={});
  document.getElementById('rmTypeTag').innerHTML=v.que?`<span class="typetag" style="margin-left:6px">${ty.e} ${ty.label}</span>`:'';
  // next step
  let next=null;
  outer: for(let i=0;i<PHASES.length;i++){for(let j=0;j<PHASES[i].tasks.length;j++){if(!rm[`p${i}_${j}`]){next={i,j};break outer;}}}
  const nb=document.getElementById('nextBanner');
  if(!v.que){nb.innerHTML=`<span class="nb-ic">${ic('note')}</span><div>Primero describe tu idea en <b>Proyecto actual</b> y genera el mapa. Así el roadmap se adaptará a tu tipo de app con ejemplos a medida.</div>`;}
  else if(next){nb.innerHTML=`<span class="nb-ic">${ic('arrowRight')}</span><div><b>Tu siguiente paso:</b> ${PHASES[next.i].icon} ${PHASES[next.i].name} → ${PHASES[next.i].tasks[next.j].t}</div>`;}
  else{nb.innerHTML=`<span class="nb-ic">${ic('flag')}</span><div><b>¡Completaste todo el roadmap de "${esc(active().name)}"!</b> Sigue mejorando con la fase de mantenimiento.</div>`;}

  phasesEl.innerHTML=PHASES.map((p,i)=>{
    const dn=p.tasks.filter((_,j)=>rm[`p${i}_${j}`]).length, all=dn===p.tasks.length;
    const isNext=next&&next.i===i;
    const tasks=p.tasks.map((tk,j)=>{
      const id=`p${i}_${j}`,on=!!rm[id];
      return `<div class="task ${on?'checked':''}"><label class="tl"><input type="checkbox" data-task="${id}" ${on?'checked':''}><span>${tk.t}</span></label>
        <div class="guide">
          <div class="gline"><span class="gi">${ic('bulb')}</span><span><b>Cómo:</b> ${tk.how}</span></div>
          <div class="gline"><span class="gi">${ic('tool')}</span><span><b>Herramientas:</b> ${tk.tools.map(gtool).join('')}</span></div>
          <div class="gline"><span class="gi">${ic('spark')}</span><span><b>Ejemplo:</b> ${tk.ex}</span></div>
        </div></div>`;
    }).join('');
    return `<div class="phase ${all?'done':''}"><div class="pnum">${all?'✓':i+1}</div>
      <details class="acc" ${isNext||(i===0&&!next)?'open':''}><summary>${p.icon} ${p.name} <span class="ph-prog">${dn}/${p.tasks.length}</span><span class="chev">›</span></summary>
      <div class="acc-body"><p style="margin-top:10px">${p.intro}</p>${v.que?phaseAdvice(i,ty,v):''}${tasks}</div></details></div>`;
  }).join('');
  phasesEl.querySelectorAll('[data-task]').forEach(c=>c.addEventListener('change',()=>{active().roadmap[c.dataset.task]=c.checked;saveDB();renderPhases();}));
  updateProg();
}
function updateProg(){
  const pr=projProgress(active());
  ['rmProg','globalProg'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.width=pr.pct+'%';});
  const rt=document.getElementById('rmProgTxt');if(rt)rt.textContent=`${pr.done} de ${pr.total} pasos completados (${pr.pct}%)`;
  const gt=document.getElementById('globalProgTxt');
  if(gt)gt.textContent=pr.pct===0?`"${active().name}" — aún sin pasos completados.`:pr.pct===100?`¡"${active().name}" completó toda la ruta!`:`"${active().name}": ${pr.pct}% del camino. ¡Sigue así!`;
  renderHome();
}
/* Inicio: tarjeta dinámica de "tu siguiente paso" según el proyecto activo */
function renderHome(){
  const box=document.getElementById('nextStepCard'); if(!box) return;
  document.getElementById('glossaryCard').style.display='';
  const a=active(), v=a.fields||{};
  const btn=(go,label,ghost)=>`<button class="btn ${ghost?'ghost ':''}sm" data-go="${go}">${label}</button>`;
  let ic_,lbl,title,desc,acts;
  if(!v.que){
    ic_='spark'; lbl='Empieza aquí';
    title='Aún no describiste tu proyecto';
    desc='Cuéntame tu idea en una frase y armo tu mapa: stack recomendado, costos y el primer prompt para Claude.';
    acts=btn('proyecto','Describir mi idea')+btn('analizar','O analizar un repo existente',true);
  } else {
    const pr=projProgress(a);
    // encontrar siguiente paso pendiente del roadmap
    let next=null;
    outer: for(let i=0;i<PHASES.length;i++){for(let j=0;j<PHASES[i].tasks.length;j++){if(!(a.roadmap||{})[`p${i}_${j}`]){next={i,j};break outer;}}}
    const ty=detectType(v);
    if(!a.generated){
      ic_='pen'; lbl='Continúa con '+esc(a.name);
      title='Genera el mapa de tu proyecto';
      desc='Ya tienes la idea escrita. Genera el mapa para ver tu stack, costos y el prompt de arranque.';
      acts=btn('proyecto','Generar mi mapa')+btn('roadmap','Ver roadmap',true);
    } else if(next){
      ic_='arrowRight'; lbl='Tu siguiente paso · '+esc(a.name)+' ('+pr.pct+'%)';
      title=PHASES[next.i].name+': '+PHASES[next.i].tasks[next.j].t;
      desc=PHASES[next.i].tasks[next.j].how;
      acts=btn('roadmap','Ir a este paso')+btn('dispositivos','Llevar a dispositivos',true)+btn('analizar','Analizar mi código',true);
    } else {
      ic_='flag'; lbl='¡Roadmap completo! · '+esc(a.name);
      title='Prepárala para publicar y dispositivos';
      desc='Completaste las fases. Ahora revisa la compatibilidad por dispositivo y analiza tu repo antes de publicar.';
      acts=btn('dispositivos','Llevar a dispositivos')+btn('analizar','Analizar mi código',true);
    }
  }
  // Línea de seguridad: si el proyecto fue auditado, muéstrala (y prioriza si hay críticos)
  const sa=a.secAudit;
  let secHtml='';
  if(sa){
    const col=secColor(sa);
    const txt=sa.crit?`Seguridad: ${sa.pct}% · ${sa.crit} punto${sa.crit>1?'s':''} crítico${sa.crit>1?'s':''} por corregir`:`Seguridad: ${sa.pct}% — sin puntos críticos`;
    secHtml=`<div class="ns-sec" style="border-color:${col}"><span class="i" style="color:${col}"><svg viewBox="0 0 24 24">${ICONS.shield}</svg></span><span style="color:${col};font-weight:600">${txt}</span><button class="btn ghost sm" data-go="seguridad" style="margin-left:auto">Ver seguridad</button></div>`;
  }
  box.innerHTML=`<div class="nextstep"><div class="ns-ic"><span class="i"><svg viewBox="0 0 24 24">${ICONS[ic_]||ICONS.spark}</svg></span></div>
    <div style="flex:1"><div class="ns-lbl">${lbl}</div><h3>${title}</h3><p>${desc}</p>
    <div class="ns-act">${acts}</div>${secHtml}</div></div>`;
  // los botones nuevos necesitan su listener (se recrean en cada render)
  box.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
}

/* ===== guía estática ===== */
const DICT=[
 ["Frontend","Lo visible","Todo lo que el usuario ve y toca.","Es el salón de un restaurante."],
 ["Backend","El cerebro","La parte invisible que procesa y decide.","Es la cocina: no se ve, pero ahí se prepara todo."],
 ["Base de datos","Memoria","Donde se guarda la información permanente.","Es la despensa con todo etiquetado."],
 ["API","Mensajero","Cómo dos programas se piden y mandan info.","Es el mesero que lleva el pedido y trae el plato."],
 ["Deploy","Publicar","Subir tu app a internet para que la usen.","Es abrir las puertas del restaurante."],
 ["Hosting","El local","El servidor donde vive tu app 24/7.","Es el edificio que rentas."],
 ["Dominio","La dirección","El nombre de tu web: mi-app.com.","Es la dirección de la calle."],
 ["Framework","Kit base","Herramientas que aceleran construir. Ej: React.","Es un mueble de IKEA: viene medio armado."],
 ["Repositorio","Archivador","La carpeta con el código y su historial.","Un archivador con todas las versiones."],
 ["Git / GitHub","Versiones","Guarda cada cambio y respalda en la nube.","'Deshacer' infinito + copia de seguridad."],
 ["Bug","Error","Un fallo: algo no hace lo que debería.","Una receta con un paso mal escrito."],
 ["Debug","Depurar","Buscar y arreglar un bug.","Probar la receta paso a paso."],
 ["Variable","Cajita","Un espacio con nombre que guarda un dato.","Una caja etiquetada 'precio'."],
 ["Función","Receta","Instrucciones que hacen una tarea.","Una receta que sigues cuando quieres ese plato."],
 ["Autenticación","Portero","Verificar quién eres antes de entrar.","El portero que revisa tu identificación."],
 ["Servidor","Siempre encendido","Computadora en internet que responde a tu app.","La cocina central que nunca cierra."],
 ["Localhost","Tu ensayo","Tu app solo en tu compu, antes de publicar.","Ensayar la obra en casa antes del estreno."],
 ["Responsive","Se adapta","Que se vea bien en celular y computadora.","Ropa elástica: le queda a cualquier talla."],
 ["Dependencia","Ingrediente externo","Código de otros que tu app usa.","Comprar la salsa ya hecha."],
 ["MVP","Versión mínima","La versión más simple que ya sirve. Empieza aquí.","Vender solo café antes de la cafetería completa."],
 ["Frontend vs Backend","Salón vs cocina","El salón es lo que ves; la cocina, lo que procesa.","Cliente ve el salón; nunca entra a la cocina."],
 ["Deploy continuo","Auto-publicar","Cada cambio que guardas se publica solo.","El restaurante actualiza el menú automáticamente."],
];
const PROMPTS=[
 [ic('upload')+" Arrancar un proyecto nuevo","Quiero crear [app en una frase]. La usarán [quién]. No sé programar, explícame cada paso en simple.\n\nAntes de escribir código:\n1. Hazme las preguntas que necesites.\n2. Propón un MVP y qué tecnologías usarías y por qué.\n3. Espera mi visto bueno antes de construir."],
 [ic('window')+" Pedir una pantalla o diseño","Crea la pantalla de [nombre], con [elementos].\nEstilo: [moderno / minimalista / colorido].\nQue se vea bien en celular y computadora.\nMuéstrame el resultado y dime cómo verlo."],
 [ic('tool')+" Pedir un cambio puntual","En [pantalla], quiero [el cambio exacto].\nNo cambies nada más. Cuando termines, dime qué modificaste."],
 [ic('alert')+" Reportar un error","Algo no funciona:\n- Qué hice: [pasos]\n- Qué esperaba: [...]\n- Qué pasó: [...]\n- Error (completo): [pega TODO el texto]\n\nExplícame por qué pasó y arréglalo paso a paso."],
 [ic('book')+" Entender qué hizo Claude","Explícame en simple:\n- Qué archivos creaste o cambiaste\n- Qué hace cada parte\n- Qué debo revisar para confirmar que funciona"],
 [ic('key')+" Revisión antes de publicar","Voy a publicar. Antes:\n1. Revisa problemas de seguridad o datos expuestos.\n2. Dime si falta algo importante.\n3. Guíame paso a paso para el deploy gratis o barato."],
];
const MISTAKES=[
 [ic('layers'),"Querer todo de una vez","Pides 10 funciones en un mensaje y todo se enreda.","Construye <b>una función a la vez</b>."],
 [ic('eyeOff'),"Aceptar sin mirar","Dices 'sí' a todo sin probar.","Tras cada cambio, <b>ábrelo y pruébalo</b>."],
 [ic('pen'),"Pedir cosas vagas","'Hazlo más bonito' confunde a Claude.","Sé concreto: <b>'título más grande, centrado y azul'</b>."],
 [ic('save'),"No guardar versiones","Algo se rompe y no puedes volver atrás.","Usa <b>Git</b> desde el inicio."],
 [ic('key'),"Exponer claves secretas","Pones contraseñas en el código público.","Pregunta: <b>'¿hay datos secretos que proteger?'</b>"],
 [ic('alert'),"Saltarte las pruebas","Publicas sin probar.","Dedica una fase a <b>romper tu app a propósito</b>."],
 [ic('cube'),"No entender nada","Acumulas código mágico que no comprendes.","Pide explicaciones simples seguido."],
 [ic('refresh'),"Cambiar de idea a media obra","Rediseñas todo a la mitad.","Termina tu <b>MVP</b> primero; anota ideas en 'después'."],
];
const dictGrid=document.getElementById('dictGrid');
function renderDict(q=''){q=q.toLowerCase().trim();const items=DICT.filter(d=>!q||d[0].toLowerCase().includes(q)||d[2].toLowerCase().includes(q)||d[1].toLowerCase().includes(q));dictGrid.innerHTML=items.map(d=>`<div class="term"><span class="tag">${d[1]}</span><h3>${d[0]}</h3><p>${d[2]}</p><div class="ana">${d[3]}</div></div>`).join('');document.getElementById('dictEmpty').style.display=items.length?'none':'block';}
renderDict();document.getElementById('dictSearch').addEventListener('input',e=>renderDict(e.target.value));
document.getElementById('promptList').innerHTML=PROMPTS.map((p,i)=>`<div class="prompt"><div class="ph">${p[0]} <button class="btn ghost sm copy" data-copy="#pr${i}">Copiar</button></div><pre id="pr${i}">${p[1].replace(/</g,'&lt;')}</pre></div>`).join('');
document.getElementById('mistakeList').innerHTML=MISTAKES.map(m=>`<div class="mistake"><div class="mi">${m[0]}</div><div><h3>${m[1]}</h3><p style="font-size:13.5px;margin:4px 0 0">${m[2]}</p><div class="fix"><span class="st-ok">${ic('check')}</span> <b>Solución:</b> ${m[3]}</div></div></div>`).join('');

/* ===== ANALIZADOR de repos / apps ===== */
let LAST_AN=null, LAST_CTX=null;
/* Marcas manuales "ya lo hice", guardadas por repositorio */
const OVR_KEY='mapa_overrides_v1';
function loadOverrides(){try{return JSON.parse(localStorage.getItem(OVR_KEY)||'{}');}catch(_){return {};}}
function ovrFor(name){const all=loadOverrides();return all[name]||{};}
function setOvr(name,key,val){const all=loadOverrides();const o=all[name]||(all[name]={});if(val)o[key]=true;else delete o[key];localStorage.setItem(OVR_KEY,JSON.stringify(all));}
function applyOverrides(ctx,checks){
  // Si el usuario marcó "ya lo hice", el check pasa a 'ok' (solo para los no detectados automáticamente)
  const o=ovrFor(ctx.name);
  checks.forEach((c,i)=>{c._key='chk_'+i;if(c.status!=='ok'&&o[c._key]){c.status='ok';c._manual=true;}});
  return checks;
}
/* Enlaces del proyecto (deploy/backend/tienda), guardados por repositorio */
const LINKS_KEY='mapa_links_v1';
function loadLinks(){try{return JSON.parse(localStorage.getItem(LINKS_KEY)||'{}');}catch(_){return {};}}
function linksFor(name){return loadLinks()[name]||{};}
function setLink(name,key,val){const all=loadLinks();const o=all[name]||(all[name]={});val=(val||'').trim();if(val)o[key]=val;else delete o[key];localStorage.setItem(LINKS_KEY,JSON.stringify(all));}
function applyLinks(ctx,checks){
  const lk=linksFor(ctx.name);
  const mark=(matcher,label)=>{const c=checks.find(matcher);if(c&&c.status!=='ok'){c.status='ok';c._byLink=label;}};
  if(lk.deploy) mark(c=>/publicaci|deploy/i.test(c.label),'enlace');
  if(lk.backend) mark(c=>/backend \/ base de datos/i.test(c.label),'enlace');
  return checks;
}
function checkLive(url,elId){
  // best-effort: no-cors no deja leer el estado, pero si resuelve, el sitio respondió algo
  fetch(url,{mode:'no-cors'}).then(()=>{const e=document.getElementById(elId);if(e){e.textContent='· respondió';e.className='live ok';}})
    .catch(()=>{const e=document.getElementById(elId);if(e){e.textContent='· no pude comprobar (ábrelo tú)';e.className='live bad';}});
}
const LINK_DEFS=[
  {key:'deploy',label:'App publicada (deploy)',ph:'https://mi-app.vercel.app',hint:'Vercel, Netlify, tu dominio…'},
  {key:'backend',label:'Backend / base de datos',ph:'https://xxxx.supabase.co',hint:'Supabase, Firebase, tu API…'},
  {key:'tienda',label:'Ficha en tienda (opcional)',ph:'https://play.google.com/... o App Store',hint:'Google Play / App Store'},
];
function linksCardHtml(ctx){
  const lk=linksFor(ctx.name);
  return LINK_DEFS.map(d=>{
    const v=lk[d.key]||'';
    const live=v?`<span class="live" id="live_${d.key}">comprobando…</span>`:'';
    const open=v?`<a class="btn ghost sm" href="${escAttr(v)}" target="_blank" rel="noopener">${ic('upload')} Abrir</a>`:'';
    return `<div class="linkrow">
      <label>${d.label} <span style="color:var(--ink-dim);font-weight:400">— ${d.hint}</span></label>
      <div class="row" style="gap:8px"><input class="linkin" data-link="${d.key}" value="${escAttr(v)}" placeholder="${d.ph}" style="flex:1">${open}</div>
      ${v?`<div class="linkstate">${ic('check')} Confirmado por enlace ${live}</div>`:''}
    </div>`;
  }).join('');
}
function parseRepo(url){url=(url||'').trim().replace(/\.git$/,'');let m=url.match(/github\.com[\/:]([^\/]+)\/([^\/?#]+)/i);if(m)return {owner:m[1],repo:m[2]};m=url.match(/^([^\/\s]+)\/([^\/\s]+)$/);if(m)return {owner:m[1],repo:m[2]};return null;}
async function ghJSON(u){const r=await fetch(u,{headers:{'Accept':'application/vnd.github+json'}});if(r.status===403)throw new Error('rate');if(r.status===404)throw new Error('404');if(!r.ok)throw new Error('http');return r.json();}
const GH_TEXT_CACHE=new Map(); // comparte descargas entre "Analizar una app" y "Seguridad" (3 min de vigencia)
async function ghText(o,re,b,p){
  const k=o+'/'+re+'/'+b+'/'+p, hit=GH_TEXT_CACHE.get(k);
  if(hit&&Date.now()-hit.at<180000)return hit.t;
  try{
    const r=await fetch(`https://raw.githubusercontent.com/${o}/${re}/${b}/${p}`);
    const t=r.ok?await r.text():null;
    if(GH_TEXT_CACHE.size>300)GH_TEXT_CACHE.clear();
    GH_TEXT_CACHE.set(k,{t,at:Date.now()});
    return t;
  }catch(_){return null;}
}
function statusIcon(s){const m={ok:['check','st-ok'],partial:['half','st-partial'],missing:['x','st-missing'],info:['info','st-info']}[s]||['info','st-info'];return `<span class="${m[1]}">${ic(m[0])}</span>`;}
function levelFor(p){if(p>=88)return {t:'Listo para publicar / vender',c:'var(--ok)'};if(p>=70)return {t:'Casi listo — pulir detalles',c:'var(--ok)'};if(p>=50)return {t:'MVP funcional',c:'var(--brand-2)'};if(p>=28)return {t:'MVP en construcción',c:'var(--warn)'};return {t:'Prototipo temprano',c:'var(--bad)'};}
function auditPrompt(target){return `Quiero que audites mi app/proyecto siguiendo TODO el ciclo de vida de una aplicación. No sé programar, explícame en simple.

${target}

Revisa y dime, por cada fase (1 Idea/alcance, 2 Diseño/arquitectura, 3 Entorno, 4 Frontend, 5 Backend/datos, 6 Pruebas, 7 Publicación/deploy, 8 Mantenimiento):
- [HECHO] Qué ya está hecho y a qué nivel (bien / mejorable).
- [A MEDIAS] Qué está a medias y cómo completarlo.
- [FALTA] Qué falta por completo.

Al final dame:
1. Un nivel general (prototipo / MVP / casi listo / listo para publicar).
2. La lista PRIORIZADA de lo que debo arreglar primero.
3. Qué le falta específicamente para poder PUBLICARSE y VENDERSE (seguridad, pruebas, licencia, documentación, manejo de datos sensibles, rendimiento).`;}

/* Detecta el TIPO de proyecto del repo para adaptar los chequeos */
function detectRepoKind(ctx){
  const {has,dep,pkg,paths}=ctx;
  const lang = has(/\.(tsx|jsx)$/)||dep('react')||dep('vue')||dep('svelte')||dep('next') ? 'js-ui'
    : (has(/\.py$/)||has(/requirements\.txt$/)||has(/pyproject\.toml$/)||has(/setup\.py$/)) ? 'python'
    : (has(/\.(html)$/)&&!pkg) ? 'static'
    : (pkg) ? 'js'
    : has(/\.(go)$/)?'go':has(/\.(rb)$/)?'ruby':has(/\.(php)$/)?'php':'otro';
  const mobile = dep('react-native')||dep('expo')||has(/\.(swift|kt)$/)||has(/pubspec\.yaml$/);
  const hasUI = has(/\.(html|jsx|tsx|vue|svelte)$/)||has(/index\.html$/);
  // Señales de "librería" (se publica para que otros la importen, no es una app de usuario)
  const looksLib = (pkg&&(pkg.main||pkg.exports||pkg.module)&&!hasUI&&!dep('next')&&!dep('vite')) ||
                   has(/setup\.py$/)||has(/pyproject\.toml$/);
  let kind, e, label, desc;
  if(mobile){kind='movil';e=ic('phone');label='App móvil';desc='Aplicación para celular (iOS/Android).';}
  else if(looksLib&&!hasUI){kind='libreria';e=ic('cube');label='Librería / paquete';desc='Código pensado para que otros lo usen dentro de SUS proyectos. No tiene interfaz propia.';}
  else if(lang==='python'){kind='python';e=ic('cpu');label='Proyecto Python';desc='Backend, script o herramienta en Python.';}
  else if(lang==='static'){kind='static';e=ic('window');label='Web estática';desc='Sitio web sencillo (HTML/CSS/JS) sin servidor propio.';}
  else if(hasUI){kind='webapp';e=ic('window');label='Aplicación web';desc='App con pantallas con las que interactúan los usuarios.';}
  else if(lang==='js'){kind='js';e=ic('gear');label='Proyecto JavaScript/Node';desc='Proyecto Node (puede ser API, herramienta o servicio).';}
  else {kind='otro';e=ic('spark');label='Proyecto de código';desc='No pude clasificarlo con certeza; reviso lo común a todo proyecto.';}
  return {kind,e,label,desc,hasUI,mobile,lang,looksLib};
}

/* Cada chequeo puede traer fix:[{name,desc,ex}] con SOLUCIONES y EJEMPLOS */
function runChecks(ctx){
  const C=[];
  const P=(phase,label,status,evidence,tip,critical,fix)=>C.push({phase,label,status,evidence,tip:tip||'',critical:!!critical,fix:fix||null});
  const {has,dep,paths,pkg,meta,gitignore,readme}=ctx;
  const K=ctx.kind=detectRepoKind(ctx);
  const isApp = K.kind==='webapp'||K.kind==='static'||K.kind==='movil';
  const isLib = K.kind==='libreria';
  const py = K.lang==='python';

  const hasUI=K.hasUI;
  const css=has(/\.(css|scss|sass)$/)||dep('tailwind')||dep('styled-components')||dep('@emotion');
  const fw=dep('next')?'Next.js':dep('react-native')?'React Native':dep('expo')?'Expo':dep('react')?'React':dep('vue')?'Vue':dep('svelte')?'Svelte':dep('@angular/core')?'Angular':(has(/index\.html$/)?'HTML/CSS/JS':null);
  const backend=dep('supabase')||dep('firebase')||dep('express')||dep('fastify')||dep('prisma')||dep('mongoose')||dep('flask')||dep('django')||dep('fastapi')||has(/(^|\/)server\.(js|ts)$/)||has(/(^|\/)api\//)||has(/\/functions\//);
  const beName=dep('supabase')?'Supabase':dep('firebase')?'Firebase':dep('django')?'Django':dep('flask')?'Flask':dep('fastapi')?'FastAPI':dep('prisma')?'Prisma/BD':(dep('express')||dep('fastify'))?'Servidor Node':'backend';
  const authLib=dep('next-auth')||dep('clerk')||dep('@clerk')||dep('passport')||dep('lucia')||dep('@auth/')||dep('supabase')||dep('firebase');
  const tests=has(/(\.test\.|\.spec\.|__tests__|\/tests?\/|cypress|playwright|test_.*\.py|_test\.py)/)||dep('jest')||dep('vitest')||dep('mocha')||dep('@testing-library')||dep('cypress')||dep('playwright')||dep('pytest');
  const lint=has(/\.eslintrc|eslint\.config|\.prettierrc|biome\.json|\.flake8|ruff\.toml/)||dep('eslint')||dep('prettier')||dep('biome')||dep('ruff')||dep('flake8')||dep('black');
  const deployCfg=has(/vercel\.json|netlify\.toml|dockerfile|render\.yaml|fly\.toml|procfile|\.github\/workflows/);
  const ci=has(/\.github\/workflows/);
  const manifest = pkg ? 'package.json' : has(/pyproject\.toml$/)?'pyproject.toml':has(/requirements\.txt$/)?'requirements.txt':has(/setup\.py$/)?'setup.py':null;
  const buildScript=pkg&&pkg.scripts&&(pkg.scripts.build||pkg.scripts.start);
  const envExample=has(/\.env\.example|\.env\.sample/);
  const envCommitted=has(/(^|\/)\.env$/)||has(/\.env\.local$/);
  const envIgnored=!!gitignore&&/^\s*(\*\*\/)?\/?(\.env\*?|\*\.env)\s*$/m.test(gitignore); // entrada real, no ".env.example"
  const license=!!(meta.license)||has(/^license/)||has(/\/license/);
  const gitignoreHas=has(/\.gitignore$/);
  const hasExamples=has(/\/examples?\//)||has(/\/demo/)||(readme&&/```/.test(readme));

  // ---- FASE 0: Idea / documentación ----
  P(0,'README que explica la idea',
    readme?(readme.length>250?'ok':'partial'):'missing',
    readme?(readme.length>250?'README presente y descriptivo':'README muy corto'):'No hay README',
    'El README es lo primero que ve quien llega. Debe decir qué es, para quién y cómo se usa.',true,
    readme&&readme.length>250?null:[
      {name:'Pídeselo a Claude',tag:'recomendado',desc:'Que genere un README completo leyendo tu proyecto.',ex:'"Lee mi proyecto y escríbeme un README claro: qué hace, para quién, cómo se instala y un ejemplo de uso."'},
      {name:'Plantilla mínima',tag:'manual',desc:'Crea un archivo README.md con estas secciones.',ex:'# Nombre\\nQué hace en 1 frase.\\n\\n## Cómo usar\\n1. ...\\n2. ...\\n\\n## Capturas\\n(imágenes)'},
    ]);

  // ---- FASE 1: Diseño / estructura ----
  P(1,'Estructura de proyecto organizada',
    (has(/(^|\/)src\//)||has(/\/components?\//)||has(/(^|\/)app\//))?'ok':(paths.length>6?'partial':'missing'),
    (has(/(^|\/)src\//)?'src/ ':'')+(has(/\/components?\//)?'components/ ':'')+(has(/(^|\/)app\//)?'app/':'')||'estructura plana',
    'Carpetas claras evitan el caos cuando la app crece.',false,
    (has(/(^|\/)src\//)||has(/\/components?\//))?null:[
      {name:'Que Claude reorganice',tag:'recomendado',desc:'Agrupa el código en carpetas con sentido sin romper nada.',ex:'"Reorganiza mi proyecto en carpetas claras (ej: src/, componentes, estilos) y explícame qué pusiste en cada una."'},
    ]);
  if(isApp){
    P(1,'Framework/base de la interfaz',fw?'ok':'partial',fw?('Detecté '+fw):'No detecté un framework de UI claro',
      'Una base como React o Next.js te da estructura y mucha ayuda disponible.',false,
      fw?null:[
        {name:'Sigue con HTML/CSS/JS',tag:'lo más simple',desc:'Si es una web pequeña, no necesitas framework. Está bien así.',ex:'Ideal para landings o apps de 1-2 pantallas.'},
        {name:'Migra a React (Vite)',tag:'si va a crecer',desc:'Cuando la app se complica, un framework ordena todo.',ex:'"¿Me conviene pasar mi web a React? Explícame pros y contras para mi caso."'},
      ]);
  }

  // ---- FASE 2: Entorno / fundamentos ----
  if(isLib){
    P(2,'Archivo de configuración del paquete',manifest?'ok':'missing',manifest?(manifest+' presente'):'Sin archivo de paquete',
      'Una librería necesita declarar su nombre, versión y cómo se instala.',true,
      manifest?null:[
        {name:py?'Crea pyproject.toml':'Crea package.json',tag:'recomendado',desc:'Define el paquete para que otros lo instalen.',ex:py?'"Crea un pyproject.toml para publicar mi librería en PyPI."':'"Crea un package.json listo para publicar mi paquete en npm."'},
      ]);
  } else {
    P(2,'Lista de dependencias ('+(manifest||(py?'requirements.txt':'package.json'))+')',
      manifest?'ok':(K.kind==='static'?'info':'missing'),
      manifest?(manifest+' presente'):(K.kind==='static'?'Web estática: puede no necesitar dependencias':'Sin archivo de dependencias'),
      'Es la "lista de ingredientes": deja claro qué librerías usa tu app.',K.kind!=='static',
      (manifest||K.kind==='static')?null:[
        {name:py?'Genera requirements.txt':'Inicializa package.json',tag:'recomendado',desc:'Registra las librerías que usa tu proyecto.',ex:py?'"Crea un requirements.txt con las librerías que uso."':'"Ejecuta lo necesario para crear un package.json y registra mis dependencias."'},
      ]);
  }
  P(2,'Control de versiones (Git)','ok','Es un repositorio de GitHub','');
  P(2,'.gitignore presente',gitignoreHas?'ok':'missing',gitignoreHas?'.gitignore presente':'Falta .gitignore',
    'Evita subir basura y, sobre todo, archivos con claves secretas.',true,
    gitignoreHas?null:[
      {name:'Que Claude lo genere',tag:'recomendado',desc:'Un .gitignore adecuado a tu tecnología.',ex:py?'"Crea un .gitignore para Python (ignora venv, __pycache__, .env)."':'"Crea un .gitignore para mi proyecto (ignora node_modules, .env, builds)."'},
    ]);

  // ---- FASE 3: Frontend / interfaz (solo si aplica) ----
  if(isApp){
    P(3,'Interfaz de usuario',hasUI?'ok':'missing',hasUI?'Encontré archivos de interfaz':'No detecté archivos de UI',
      'Es la parte que tus usuarios ven y tocan.',isApp,
      hasUI?null:[
        {name:'Construye la pantalla principal',tag:'recomendado',desc:'Empieza por la pantalla con la acción más importante.',ex:'"Crea la pantalla principal de mi app con datos de ejemplo, estilo limpio y responsive."'},
      ]);
    P(3,'Estilos / diseño',css?'ok':'partial',css?'Usa CSS o framework de estilos':'No detecté estilos',
      'El diseño hace que se sienta profesional, no "en bruto".',false,
      css?null:[
        {name:'CSS a mano',tag:'simple',desc:'Para apps pequeñas, un archivo de estilos basta.',ex:'"Dale estilo a mi app: tipografía legible, espaciado y 2-3 colores coherentes."'},
        {name:'Tailwind CSS',tag:'popular',desc:'Estilos rápidos con clases; muy usado.',ex:'"Configura Tailwind y aplícalo a mi pantalla principal."'},
      ]);
  } else if(isLib){
    P(3,'Interfaz de usuario','info','No aplica: una librería no tiene interfaz propia','Las librerías se usan desde el código de otros, no tienen pantallas.');
  }

  // ---- FASE 4: Backend / datos ----
  if(backend){
    P(4,'Backend / base de datos','ok','Detecté '+beName,'');
    P(4,'Autenticación (cuentas)',authLib?'ok':'info',authLib?'Hay librería para login':'No detecté login (puede no hacer falta)',
      'Si los usuarios deben tener cuenta, usa un sistema ya hecho (seguro).',false,
      authLib?null:[
        {name:'Auth de Supabase',tag:'recomendado',desc:'Login por correo/Google listo, sin construirlo a mano.',ex:'"Agrega inicio de sesión con correo usando Supabase Auth."'},
        {name:'Firebase Auth',tag:'alternativa',desc:'Sistema de cuentas de Google, muy probado.',ex:'"Agrega login con Google usando Firebase Auth."'},
      ]);
  } else if(isLib){
    P(4,'Backend / base de datos','info','No aplica a una librería','Una librería no guarda datos de usuarios; eso lo hace la app que la use.');
  } else {
    P(4,'Backend / base de datos','info','No detecté backend (puede ser app solo-frontend)',
      'Si tu app debe recordar datos de varios usuarios, te faltará esta capa.',false,
      [{name:'Supabase',tag:'recomendado',desc:'Base de datos + login listos, con plan gratis.',ex:'"Conecta mi app a Supabase y crea una tabla para [tus datos]."'},
       {name:'Solo en el dispositivo',tag:'si es personal',desc:'Si guardas datos solo para ti, basta el navegador.',ex:'"Guarda mis datos en localStorage del navegador."'}]);
  }

  // ---- FASE 5: Calidad / pruebas / seguridad ----
  P(5,'Pruebas automatizadas',tests?'ok':'missing',tests?'Hay pruebas o framework de testing':'No encontré pruebas',
    'Las pruebas avisan si un cambio rompe algo. Dan confianza para publicar.',true,
    tests?null:[
      {name:'Pídele pruebas a Claude',tag:'recomendado',desc:'Que cree pruebas para tus funciones más importantes.',ex:py?'"Agrega pruebas con pytest para mis funciones principales."':'"Agrega pruebas con Vitest para las funciones clave y dime cómo ejecutarlas."'},
      {name:'Prueba manual guiada',tag:'mínimo',desc:'Si aún no quieres automatizar, al menos ten una lista de pasos a probar.',ex:'"Dame una lista de pasos para probar a mano cada función antes de publicar."'},
    ]);
  P(5,'Linter / formato de código',lint?'ok':'partial',lint?'Configurado':'Sin linter/formato',
    'Mantiene el código limpio y consistente (menos errores tontos).',false,
    lint?null:[
      {name:py?'Ruff (Python)':'ESLint + Prettier',tag:'recomendado',desc:'Detecta errores y formatea solo.',ex:py?'"Configura Ruff para revisar y formatear mi código Python."':'"Configura ESLint y Prettier en mi proyecto y formatéalo."'},
    ]);
  P(5,'Manejo seguro de secretos',
    envCommitted?'missing':((envExample||envIgnored)?'ok':'partial'),
    envCommitted?'Hay un archivo .env subido al repo':(envExample?'.env.example presente':(envIgnored?'.env está en .gitignore':'No detecté manejo de variables')),
    envCommitted?'Riesgo alto: tus claves quedaron públicas.':'Las claves (de BD, pagos, APIs) nunca deben subirse al repo.',true,
    (!envCommitted&&(envExample||envIgnored))?null:(
      envCommitted?[
        {name:'Acción urgente',tag:'¡ahora!',desc:'Saca el .env del repo, ignóralo y CAMBIA esas claves (ya son públicas).',ex:'"Saca el .env del repositorio, agrégalo a .gitignore y dime qué claves debo rotar."'},
      ]:[
        {name:'Variables de entorno',tag:'recomendado',desc:'Pon las claves en un .env (ignorado) y deja un .env.example sin valores reales.',ex:'"Mueve mis claves a un archivo .env, ignóralo en git y crea un .env.example de muestra."'},
      ]));

  // ---- FASE 6: Publicación ----
  if(isLib){
    P(6,'Publicación del paquete',(pkg&&!pkg.private)||has(/pyproject\.toml$/)?'partial':'info',
      'Una librería se publica en un registro (npm/PyPI), no se "despliega".',
      'Para que otros la instalen, publícala en el registro de tu lenguaje.',false,
      [{name:py?'Publicar en PyPI':'Publicar en npm',tag:'guía',desc:'El registro estándar para compartir/vender acceso a tu librería.',ex:py?'"Guíame paso a paso para publicar mi librería en PyPI."':'"Guíame paso a paso para publicar mi paquete en npm."'}]);
  } else {
    P(6,'Configuración de publicación (deploy)',deployCfg?'ok':'missing',deployCfg?('Config de deploy'+(ci?' + CI':'')):'Sin configuración de deploy',
      'Sin esto, tu app vive solo en tu compu. El deploy la pone online.',true,
      deployCfg?null:[
        {name:'Vercel',tag:'recomendado',desc:'Publica conectando GitHub; gratis y se actualiza solo.',ex:'"Guíame paso a paso para publicar mi app en Vercel desde GitHub."'},
        {name:'Netlify',tag:'alternativa',desc:'Muy parecido a Vercel, igual de fácil.',ex:'"Publica mi web en Netlify y explícame cada paso."'},
        K.kind==='static'?{name:'GitHub Pages',tag:'web simple',desc:'Si es solo HTML/CSS/JS, gratis directo desde GitHub.',ex:'"Publica esta web estática en GitHub Pages."'}:null,
      ].filter(Boolean));
    if(isApp) P(6,'Script de build',buildScript?'ok':(K.kind==='static'?'info':'partial'),buildScript?'Tiene script de build/start':(K.kind==='static'?'Web estática: no requiere build':'Sin script de build'),
      'Define cómo se "construye" tu app para publicarla.',false,
      (buildScript||K.kind==='static')?null:[
        {name:'Que Claude lo agregue',tag:'recomendado',desc:'Añade los comandos de build/start a tu package.json.',ex:'"Agrega los scripts de build y start a mi package.json."'},
      ]);
  }

  // ---- FASE 7: Legal / docs para vender ----
  P(7,'Licencia (clave para vender)',license?'ok':'missing',license?'Tiene LICENSE':'Sin licencia',
    'Sin licencia, legalmente no queda claro si otros pueden usarla o comprarla.',true,
    license?null:[
      {name:'Elige con Claude',tag:'recomendado',desc:'Te ayuda a elegir según si quieres abrirla o venderla.',ex:'"Quiero vender mi app. ¿Qué licencia me conviene y por qué? Crea el archivo LICENSE."'},
      {name:'MIT (abierta)',tag:'común',desc:'Permisiva: otros pueden usar tu código libremente.',ex:'Buena si quieres difusión y comunidad.'},
      {name:'Propietaria',tag:'para vender',desc:'Te reservas los derechos; vendes acceso o licencias.',ex:'"Crea una licencia propietaria: todos los derechos reservados."'},
    ]);
  P(7,'Documentación de uso/instalación',
    (readme&&/(install|instalar|usage|uso|getting started|npm |yarn |pip |run )/i.test(readme))?'ok':(readme?'partial':'missing'),
    readme?(/(install|instalar|usage|uso|pip |npm |run )/i.test(readme)?'README con instrucciones':'README sin pasos de uso'):'Sin documentación',
    'Explica cómo instalar y usar; vital si otros la van a usar o comprar.',false,
    (readme&&/(install|instalar|usage|uso|npm |pip |run )/i.test(readme))?null:[
      {name:'Sección de uso',tag:'recomendado',desc:'Agrega al README pasos de instalación y un ejemplo de uso.',ex:'"Agrega al README una sección de instalación paso a paso y un ejemplo de uso real."'},
    ]);
  if(isLib&&!hasExamples) P(7,'Ejemplos de uso',hasExamples?'ok':'partial','No vi ejemplos ni bloques de código',
    'En una librería, los ejemplos son lo que convence a otros de usarla.',false,
    [{name:'Añade ejemplos',tag:'recomendado',desc:'Una carpeta examples/ o bloques de código en el README.',ex:'"Agrega 2-3 ejemplos de uso de mi librería en el README."'}]);
  return C;
}

async function analyzeRepo(){
  const pr=parseRepo(document.getElementById('anUrl').value);
  const box=document.getElementById('anResult');
  if(!pr){showToast('Pega un enlace de GitHub válido');return;}
  box.style.display='block';
  box.innerHTML=`<div class="card">Analizando <b>${esc(pr.owner)}/${esc(pr.repo)}</b>… leyendo archivos del repositorio.</div>`;
  try{
    const meta=await ghJSON(`https://api.github.com/repos/${pr.owner}/${pr.repo}`);
    const branch=meta.default_branch||'main';
    let tree={};try{tree=await ghJSON(`https://api.github.com/repos/${pr.owner}/${pr.repo}/git/trees/${branch}?recursive=1`);}catch(_){}
    const paths=(tree.tree||[]).map(t=>t.path);
    const lower=paths.map(p=>p.toLowerCase());
    const has=re=>lower.some(p=>re.test(p));
    const pkgTxt=await ghText(pr.owner,pr.repo,branch,'package.json');
    let pkg=null;try{pkg=pkgTxt?JSON.parse(pkgTxt):null;}catch(_){}
    const depNames=pkg?Object.keys(Object.assign({},pkg.dependencies,pkg.devDependencies)).map(d=>d.toLowerCase()):[];
    const dep=n=>depNames.some(d=>d.includes(n));
    const gitignore=await ghText(pr.owner,pr.repo,branch,'.gitignore');
    const readme=await ghText(pr.owner,pr.repo,branch,'README.md')||await ghText(pr.owner,pr.repo,branch,'readme.md');
    // --- análisis más minucioso: leemos archivos clave para no adivinar ---
    const get=p=>ghText(pr.owner,pr.repo,branch,p);
    const htmlPath=paths.find(p=>/(^|\/)(index|app)\.html$/i.test(p))||paths.find(p=>/\.html$/i.test(p));
    const cssPaths=paths.filter(p=>/\.(css|scss)$/i.test(p)).slice(0,3);
    const cfgPaths=paths.filter(p=>/(tailwind\.config|vite\.config|next\.config|app\.json|manifest\.(json|webmanifest)|capacitor\.config)/i.test(p)).slice(0,3);
    const htmlTxt=htmlPath?await get(htmlPath):null;
    let cssTxt='';for(const c of cssPaths){const t=await get(c);if(t)cssTxt+='\n'+t;if(cssTxt.length>40000)break;}
    let cfgTxt='';for(const c of cfgPaths){const t=await get(c);if(t)cfgTxt+='\n'+t;}
    const ctx={has,dep,paths,pkg,meta,gitignore,readme,name:pr.owner+'/'+pr.repo,desc:meta.description,
      htmlTxt,cssTxt,cfgTxt,
      hasViewport: htmlTxt?/name=["']?viewport/i.test(htmlTxt):null,
      hasMediaQ: cssTxt?/@media[^{]*\((max|min)-width/i.test(cssTxt):null,
      hasViewportUnits: cssTxt?/(\d+(vw|vh|dvh|svh)|clamp\(|minmax\()/i.test(cssTxt):null,
      fileCount: paths.length,
    };
    renderReport(ctx,runChecks(ctx));
  }catch(e){
    const msg=e.message==='404'?'No encontré ese repositorio (¿es público y el enlace es correcto?).':e.message==='rate'?'GitHub me limitó por muchas consultas. Espera unos minutos e intenta de nuevo.':'No pude analizarlo. Revisa el enlace e intenta otra vez.';
    box.innerHTML=`<div class="card"><div class="miss"><b>Ups.</b> ${msg}</div></div>`;
  }
}
// cabecera común (nombre + etiqueta + descripción) de las opciones de solución; la usan renderFix y secFix
function fixOptHead(o){return `<div class="ot">${esc(o.name)}${o.tag?`<span class="tag2">${esc(o.tag)}</span>`:''}</div><div class="od">${esc(o.desc)}</div>`;}
function renderFix(fix){
  if(!fix||!fix.length)return '';
  return `<div class="fixbox"><div class="fh">${ic('tool')} Cómo solucionarlo · opciones</div>${fix.map(o=>{
    const txt=(o.ex||'').replace(/\\n/g,'\n');
    const isPrompt=/^["“]/.test(txt.trim());
    return `<div class="fixopt">${fixOptHead(o)}${o.ex?`<div class="ex"><span class="exl">${isPrompt?'Prompt para Claude':'Ejemplo'}${isPrompt?`<button class="iconbtn copytext" data-copytext="${escAttr(txt)}" title="Copiar prompt">${ic('copy')}</button>`:''}</span>${esc(txt)}</div>`:''}</div>`;
  }).join('')}</div>`;
}
/* Señales detectadas del repo, reutilizadas por compatibilidad y roadmaps */
function deviceSignals(ctx){
  const {has,dep}=ctx; const K=ctx.kind||detectRepoKind(ctx);
  const expo=dep('expo'),rn=dep('react-native'),flutter=has(/pubspec\.yaml$/),cap=dep('capacitor')||dep('@capacitor')||dep('cordova');
  const native=expo||rn||flutter||cap;
  const pwaManifest=has(/manifest\.(json|webmanifest)$/)||(ctx.htmlTxt&&/rel=["']?manifest/i.test(ctx.htmlTxt));
  const sw=has(/(sw|service-worker|service_worker)\.(js|ts)$/)||dep('workbox')||dep('next-pwa')||dep('vite-plugin-pwa')||dep('@vite-pwa/');
  const pwa=pwaManifest&&sw;
  const respCss=ctx.hasMediaQ===true||ctx.hasViewportUnits===true;
  const respLib=dep('tailwind')||dep('bootstrap')||dep('@chakra-ui')||dep('@mui')||dep('react-bootstrap')||dep('bulma');
  const webUI=K.kind==='webapp'||K.kind==='static'||has(/index\.html$/)||dep('react')||dep('vue')||dep('next')||dep('svelte')||dep('@angular/core');
  const deploy=has(/vercel\.json|netlify\.toml|\.github\/workflows/)||dep('gh-pages');
  return {expo,rn,flutter,cap,native,pwaManifest,sw,pwa,respCss,respLib,responsive:respCss||respLib,
    viewport:ctx.hasViewport,webUI,deploy,K};
}
/* Roadmap por dispositivo: cada paso se auto-marca según lo detectado */
function deviceRoadmaps(ctx){
  const s=deviceSignals(ctx);
  const yes='ok',no='missing',may='partial';
  // st: 'ok' (hecho) | 'missing' (falta) | 'partial' (parcial/por confirmar)
  const step=(t,st,detail,prompt)=>({t,st,detail,prompt});
  const R={};

  R.web={name:'Web (navegador)',icon:ic('window'),steps:[
    step('Tiene interfaz web', s.webUI?yes:no,
      s.webUI?'Detecté una interfaz web (HTML o framework).':'No detecté interfaz web.',
      '"Crea la pantalla principal de mi app como web, con datos de ejemplo, estilo limpio y responsive."'),
    step('Etiqueta viewport (clave para móvil/tablet)', s.viewport===true?yes:(s.viewport===false?no:may),
      s.viewport===true?'Encontré la etiqueta viewport en el HTML.':(s.viewport===false?'No vi la etiqueta viewport: la web se verá "encogida" en móvil.':'No pude leer el HTML para confirmarlo.'),
      '"Agrega la etiqueta meta viewport en el <head> de mi HTML y explícame para qué sirve."'),
    step('Diseño responsive (media queries)', s.responsive?(s.respCss?yes:may):no,
      s.respCss?'Detecté media queries / unidades flexibles reales.':(s.respLib?'Usas un framework de estilos responsive (por confirmar visualmente).':'No detecté reglas responsive.'),
      '"Haz mi web totalmente responsive con media queries para móvil, tablet y escritorio. Explícame los cambios."'),
    step('Publicada online (deploy)', s.deploy?yes:no,
      s.deploy?'Encontré configuración de deploy.':'No detecté configuración de publicación.',
      '"Guíame paso a paso para publicar mi web en Vercel desde GitHub."'),
    step('Instalable (PWA)', s.pwa?yes:(s.pwaManifest||s.sw?may:no),
      s.pwa?'Es una PWA completa (manifest + service worker).':(s.pwaManifest||s.sw?'PWA a medias: falta manifest o service worker.':'No es instalable todavía.'),
      '"Convierte mi web en PWA instalable: crea el manifest y el service worker, y dime cómo comprobarlo."'),
  ]};

  R.android={name:'Android',icon:ic('android'),steps:[
    step('Base usable en Android', (s.native||s.webUI)?yes:no,
      s.native?'App nativa (corre en Android).':(s.webUI?'Web: se ve en Chrome de Android.':'Sin base usable.'),
      '"Optimiza mi app para Android: botones cómodos al tacto, textos legibles y viewport correcto."'),
    step('Diseño adaptado a móvil', s.responsive?(s.respCss?yes:may):no,
      s.respCss?'Diseño responsive detectado.':(s.respLib?'Framework responsive (por confirmar).':'Falta diseño responsive para móvil.'),
      '"Asegura que mi app se vea bien en pantallas de móvil Android. Dame los cambios paso a paso."'),
    step('Instalable (PWA o nativa)', s.native?yes:(s.pwa?yes:no),
      s.native?'Es app nativa.':(s.pwa?'Es PWA instalable en Android.':'Aún no es instalable.'),
      '"Explícame si para Android me conviene PWA o Capacitor según mi app, y hagamos la opción recomendada paso a paso."'),
    step('Empaquetada para Google Play', s.native?may:no,
      s.native?'Tienes base nativa: falta generar el .aab firmado.':'Falta empaquetarla (TWA desde PWA, o Capacitor).',
      '"Guíame para empaquetar mi app para Google Play (.aab) y dime qué necesito, paso a paso."'),
    step('Publicada en Google Play', no,
      'No puedo verificar la publicación en la tienda desde el repo (hazlo tú y márcalo).',
      '"Guíame para crear la cuenta de Google Play Developer (US$25) y publicar mi app: ficha, capturas y envío a revisión."'),
  ]};

  R.ios={name:'iPhone (iOS)',icon:ic('apple'),steps:[
    step('Base usable en iPhone', (s.native||s.webUI)?yes:no,
      s.native?'App nativa (corre en iPhone).':(s.webUI?'Web: se ve en Safari del iPhone.':'Sin base usable.'),
      '"Optimiza mi app para Safari del iPhone: viewport, área segura del notch y botones cómodos."'),
    step('Diseño adaptado a móvil', s.responsive?(s.respCss?yes:may):no,
      s.respCss?'Diseño responsive detectado.':(s.respLib?'Framework responsive (por confirmar).':'Falta diseño responsive para móvil.'),
      '"Asegura que mi app se vea bien en iPhone (varios tamaños). Dame los cambios paso a paso."'),
    step('Instalable (PWA o nativa)', s.native?yes:(s.pwa?yes:no),
      s.native?'Es app nativa.':(s.pwa?'PWA: instalable desde Safari (añadir a inicio).':'Aún no es instalable.'),
      '"Haz que mi web se instale como PWA en iPhone (añadir a inicio): icono, splash y modo app."'),
    step('Empaquetada para App Store', s.native?may:no,
      s.native?'Tienes base nativa: falta el build firmado (requiere Mac/Xcode).':'Falta envolverla (Capacitor) para la App Store; necesitarás una Mac.',
      '"Quiero llevar mi app a la App Store con Capacitor. Explícame qué necesito (Mac, Xcode, cuenta Apple) y guíame paso a paso."'),
    step('Publicada en la App Store', no,
      'No puedo verificar la publicación desde el repo (hazlo tú y márcalo).',
      '"Guíame para crear la cuenta Apple Developer (US$99/año) y publicar mi app en la App Store: build, ficha y revisión."'),
  ]};

  R.tablet={name:'Tablet',icon:ic('tablet'),steps:[
    step('Etiqueta viewport', s.viewport===true?yes:(s.viewport===false?no:may),
      s.viewport===true?'Viewport presente.':(s.viewport===false?'Falta viewport.':'No pude confirmarlo.'),
      '"Agrega la etiqueta meta viewport en mi HTML para que se adapte a tablet."'),
    step('Diseño responsive', s.respCss?yes:(s.respLib?may:no),
      s.respCss?'Media queries / unidades flexibles detectadas.':(s.respLib?'Framework responsive (por confirmar).':'Sin reglas responsive.'),
      '"Mejora el responsive de mi app para tablet: en ancho de tablet (768px+) usa 2-3 columnas y aprovecha el espacio."'),
    step('Diseño específico para pantalla grande', s.respCss?may:no,
      'No puedo confirmar diseños pensados para tablet (2-3 columnas). Revísalo visualmente.',
      '"Adapta mi app a tablet: en pantallas grandes usa varias columnas y mejor uso del espacio. Paso a paso."'),
    step('Funciona en vertical y horizontal', may,
      'No verificable desde el código; pruébalo girando la tablet o en un emulador.',
      '"Asegura que mi app se vea bien en tablet tanto en vertical como en horizontal. Explícame los ajustes."'),
  ]};
  return R;
}
function rmStat(st){return st==='ok'?statusIcon('ok'):st==='partial'?statusIcon('partial'):statusIcon('missing');}
/* Evalúa compatibilidad con plataformas (iOS / Android / Tablet / Web) */
function platformCompat(ctx){
  const {has,dep}=ctx; const K=ctx.kind||detectRepoKind(ctx);
  const expo=dep('expo'), rn=dep('react-native'), flutter=has(/pubspec\.yaml$/),
        cap=dep('capacitor')||dep('@capacitor')||dep('cordova');
  const native=expo||rn||flutter||cap;
  const nativeName=flutter?'Flutter':cap?'Capacitor':'React Native/Expo';
  const pwaManifest=has(/manifest\.(json|webmanifest)$/)||(ctx.htmlTxt&&/rel=["']?manifest/i.test(ctx.htmlTxt));
  const sw=has(/(sw|service-worker|service_worker)\.(js|ts)$/)||dep('workbox')||dep('next-pwa')||dep('vite-plugin-pwa')||dep('@vite-pwa/');
  const pwa=pwaManifest&&sw, partialPwa=pwaManifest||sw;
  const respLib=dep('tailwind')||dep('bootstrap')||dep('@chakra-ui')||dep('@mui')||dep('react-bootstrap')||dep('bulma');
  // responsive REAL: media queries o unidades flexibles detectadas en el CSS leído
  const respCss=ctx.hasMediaQ===true||ctx.hasViewportUnits===true;
  const responsive=respLib||respCss;
  const viewport=ctx.hasViewport; // true/false/null(no se pudo leer)
  const webUI=K.kind==='webapp'||K.kind==='static'||has(/index\.html$/)||dep('react')||dep('vue')||dep('next')||dep('svelte')||dep('@angular/core');
  const userFacing=webUI||native||pwa;
  if(!userFacing){
    return {na:true,reason:'Este proyecto es de tipo "'+K.label.replace(/<[^>]+>/g,'')+'", que no es una app de usuario final. La compatibilidad con iPhone/Android/Tablet/Web aplica a apps con interfaz (web o móvil).'};
  }
  // o:{name,tag,desc,steps[],prompt}  -> opciones detalladas
  const P=(key,name,icon,score,note,missing,opts)=>({key,name,icon,score,status:score>=75?'ok':score>=40?'partial':'missing',note,missing,opts});
  const plats=[];
  const capOpt=(plat)=>({name:'Envolver con Capacitor',tag:'app nativa',desc:'Capacitor toma tu web tal cual y la mete en una app real de '+plat+', con acceso a cámara, notificaciones, etc. Reutilizas TODO tu código web.',
    steps:['Instala Capacitor en tu proyecto web.','Añade la plataforma '+(plat==='iPhone'?'iOS':plat)+'.','Genera el proyecto nativo y ábrelo.','Prueba en simulador o dispositivo.','Genera el build firmado para la tienda.'],
    prompt:'"Mi app es una web ('+(K.label.replace(/<[^>]+>/g,''))+'). Quiero convertirla en app de '+plat+' usando Capacitor. Explícame qué es Capacitor y guíame paso a paso desde instalarlo hasta tener la app lista, sin asumir que sé programar."'});
  const pwaOpt=(plat)=>({name:'Convertirla en PWA',tag:'lo más simple',desc:'Una PWA es tu misma web pero "instalable": el usuario la añade a su pantalla de inicio y funciona casi como una app, sin pasar por tiendas.',
    steps:['Crea un archivo manifest (nombre, icono, colores).','Añade un service worker (permite que cargue y funcione offline).','Verifica con las herramientas del navegador (Lighthouse).','En el dispositivo: '+(plat==='iPhone'?'Safari → Compartir → Añadir a inicio':'Chrome → Instalar app')+'.'],
    prompt:'"Quiero convertir mi web en una PWA instalable para '+plat+'. Explícame qué es una PWA, crea el manifest y el service worker, y dime cómo probar que se instala. Hazlo paso a paso."'});

  /* ---------- iPhone (iOS) ---------- */
  if(native){
    plats.push(P('ios','iPhone (iOS)',ic('apple'),85,
      'Usas '+nativeName+', que genera apps nativas para iPhone.',
      'Falta generar el build firmado y publicarlo en la App Store.',
      [{name:'Publicar en la App Store',tag:'recomendado',desc:'El camino oficial para que cualquiera la descargue desde el iPhone.',
        steps:['Crea una cuenta de Apple Developer (US$99/año).','Genera el build de iOS'+(flutter?' (flutter build ipa)':' (eas build -p ios)')+'.','Sube el build a App Store Connect.','Completa la ficha: nombre, capturas, descripción, privacidad.','Envía a revisión de Apple (suele tardar 1-3 días).'],
        prompt:'"Tengo una app en '+nativeName+'. Guíame paso a paso para generar el build de iOS y publicarla en la App Store. Dime qué cuentas y herramientas necesito, y explícame cada paso sin asumir que sé programar."'},
       {name:'Probar antes con TestFlight',tag:'pruebas',desc:'Reparte la app a personas de confianza antes de publicarla oficialmente.',
        steps:['Sube un build a App Store Connect.','Activa TestFlight e invita a tus testers por correo.','Recoge su feedback y corrige.','Luego publica la versión final.'],
        prompt:'"Quiero repartir mi app de iPhone a unos amigos para probarla antes de publicarla. Explícame qué es TestFlight y guíame para configurarlo paso a paso."'}]));
  } else if(pwa){
    plats.push(P('ios','iPhone (iOS)',ic('apple'),62,
      'Es una PWA: en iPhone se puede "Añadir a pantalla de inicio".',
      'iOS limita notificaciones push y algunas funciones; para experiencia/tienda nativa conviene envolverla.',
      [{name:'Usarla como PWA (ya funciona)',tag:'gratis',desc:'Sin tiendas ni cuentas: el usuario la instala desde Safari.',
        steps:['Abre la web en Safari del iPhone.','Toca Compartir → "Añadir a pantalla de inicio".','Compártela con tus usuarios con esas instrucciones.'],
        prompt:'"Mi web ya es PWA. Mejórala para iPhone: buen icono, splash y que se sienta app. Dime también cómo explicar a mis usuarios cómo instalarla en iPhone."'},
       capOpt('iPhone')]));
  } else if(webUI){
    plats.push(P('ios','iPhone (iOS)',ic('apple'),30,
      'Es una web: se ve en Safari del iPhone, pero aún no es una app instalable.',
      'Para que sea "app de iPhone" hay que convertirla en PWA o envolverla con Capacitor.',
      [pwaOpt('iPhone'),capOpt('iPhone'),
       {name:'Solo web móvil',tag:'mínimo',desc:'Si no necesitas que sea instalable, basta con que se vea bien en Safari móvil.',
        steps:['Asegura la etiqueta viewport en el HTML.','Verifica que el diseño se adapte a pantalla de móvil.','Prueba en un iPhone real o en el simulador.'],
        prompt:'"Haz que mi web se vea perfecta en el navegador del iPhone (Safari): viewport correcto, textos legibles y botones cómodos para el dedo. Dame los cambios paso a paso."'}]));
  }

  /* ---------- Android ---------- */
  if(native){
    plats.push(P('android','Android',ic('android'),85,
      'Usas '+nativeName+', que genera apps nativas para Android.',
      'Falta generar el APK/AAB firmado y publicarlo en Google Play.',
      [{name:'Publicar en Google Play',tag:'recomendado',desc:'La tienda oficial de Android. Cuenta de pago único, más barata que Apple.',
        steps:['Crea una cuenta de Google Play Developer (US$25, pago único).','Genera el build de Android'+(flutter?' (flutter build appbundle)':' (eas build -p android)')+'.','Sube el archivo .aab a Google Play Console.','Completa la ficha y la clasificación de contenido.','Envía a revisión y publica.'],
        prompt:'"Tengo una app en '+nativeName+'. Guíame paso a paso para generar el build de Android (.aab) y publicarla en Google Play. Explícame cada paso y qué necesito."'},
       {name:'Compartir un APK directo',tag:'sin tienda',desc:'Puedes mandar el archivo de instalación directamente, sin pasar por la tienda.',
        steps:['Genera un APK de instalación.','Compártelo (link/archivo) con tus usuarios.','Ellos activan "instalar de orígenes desconocidos" para instalarlo.'],
        prompt:'"Quiero compartir mi app Android como APK directo para que la prueben sin Google Play. Guíame para generarlo y dime cómo lo instalan."'}]));
  } else if(pwa){
    plats.push(P('android','Android',ic('android'),82,
      'Es una PWA y Android las soporta muy bien (instalables, con notificaciones).',
      'Opcional: además puedes llevarla a Google Play empaquetándola.',
      [{name:'Usarla como PWA (ya funciona)',tag:'gratis',desc:'Chrome ofrece "Instalar app" automáticamente.',
        steps:['Abre la web en Chrome de Android.','Toca el aviso "Instalar app" (o menú → Instalar).','Queda como app con su icono.'],
        prompt:'"Mi web ya es PWA. Optimízala para Android: icono, notificaciones y que funcione offline. Guíame paso a paso."'},
       {name:'Llevarla a Google Play (TWA)',tag:'tienda',desc:'Una TWA empaqueta tu PWA como app de Play Store sin reescribir nada.',
        steps:['Empaqueta la PWA como TWA (con Bubblewrap o PWABuilder).','Crea cuenta de Google Play Developer (US$25).','Sube el paquete a Play Console y publica.'],
        prompt:'"Quiero subir mi PWA a Google Play como TWA. Explícame qué es una TWA y guíame con Bubblewrap/PWABuilder paso a paso."'}]));
  } else if(webUI){
    plats.push(P('android','Android',ic('android'),34,
      'Es una web: se ve en Chrome de Android, pero aún no es instalable.',
      'Conviértela en PWA (Android las soporta muy bien) o envuélvela con Capacitor.',
      [pwaOpt('Android'),capOpt('Android'),
       {name:'Solo web móvil',tag:'mínimo',desc:'Si no necesitas instalación, que se vea bien en Chrome móvil basta.',
        steps:['Asegura el viewport en el HTML.','Adapta el diseño a pantallas de móvil.','Prueba en un Android real o emulador.'],
        prompt:'"Haz que mi web se vea perfecta en Chrome de Android: viewport, textos y botones cómodos al tacto. Dame los cambios paso a paso."'}]));
  }

  /* ---------- Tablet ---------- */
  const tabletNote = responsive
    ? (respCss?'Detecté diseño responsive real (media queries / unidades flexibles): buena base para tablet.':'Usas un sistema de estilos responsive; suele adaptarse bien a tablet.')
    : (viewport===false?'No vi etiqueta viewport ni reglas responsive: probablemente NO se adapte bien a tablet.':'No pude confirmar que el diseño se adapte a tablet (no detecté reglas responsive).');
  const tabletScore = native?72 : (respCss?74 : (responsive?64 : (viewport===false?34:48)));
  if(native){
    plats.push(P('tablet','Tablet',ic('tablet'),tabletScore,
      nativeName+' soporta tablets; suele funcionar, pero el diseño hay que adaptarlo a pantallas grandes.',
      'Verificar que los diseños aprovechen el espacio (no que se vea como un móvil gigante).',
      [{name:'Adaptar el diseño a pantalla grande',tag:'recomendado',desc:'Usa más columnas y aprovecha el ancho extra de la tablet.',
        steps:['Prueba en un emulador de iPad / tablet Android.','Define diseños distintos para ancho grande (2-3 columnas).','Ajusta tamaños de texto y márgenes.','Vuelve a probar en la tablet.'],
        prompt:'"Revisa que mi app '+nativeName+' se vea bien en tablet y adáptala para aprovechar pantallas grandes (más columnas, mejor uso del espacio). Dame los cambios paso a paso."'}]));
  } else if(webUI||pwa){
    const opts=[{name:'Mejorar el diseño responsive',tag:'recomendado',desc:'Reglas que reordenan el contenido según el ancho de pantalla (móvil, tablet, escritorio).',
        steps:['Asegura <meta viewport> en el HTML.','Añade media queries para ancho de tablet (~768px+).','Convierte listas en rejillas de 2-3 columnas en tablet.','Prueba con el modo responsive del navegador (F12) en tamaño tablet.'],
        prompt:'"Mejora el diseño responsive de mi web para tablet: agrega o ajusta las media queries para que en ancho de tablet (768px+) use 2-3 columnas y aproveche el espacio. Explícame los cambios paso a paso."'}];
    if(viewport===false) opts.unshift({name:'Agregar la etiqueta viewport',tag:'primero esto',desc:'Sin <meta viewport> el móvil/tablet muestran la web "encogida". Es el arreglo nº1 y toma 1 línea.',
      steps:['Abre tu index.html.','Dentro de <head> agrega la etiqueta meta viewport.','Recarga y prueba en móvil/tablet.'],
      prompt:'"A mi web le falta la etiqueta meta viewport y no se ve bien en móvil/tablet. Agrégala en el HTML y explícame qué hace."'});
    plats.push(P('tablet','Tablet',ic('tablet'),tabletScore,tabletNote,
      responsive?'Verifica el diseño en ancho de tablet; ajusta lo que se vea desaprovechado.':'Falta confirmar y mejorar el diseño responsive para pantallas medianas/grandes.',
      opts));
  }

  /* ---------- Web ---------- */
  if(webUI||pwa||K.kind==='static'){
    plats.push(P('web','Web (navegador)',ic('window'),pwa?95:90,
      pwa?'Es una web app instalable (PWA): la mejor base multiplataforma.':'Funciona en cualquier navegador de escritorio.',
      pwa?'Prácticamente listo. Solo asegúrate del deploy.':'Opcional: conviértela en PWA para que también sea instalable.',
      pwa?[{name:'Publicarla (deploy)',tag:'recomendado',desc:'Ponla online para que cualquiera la abra con un enlace.',
        steps:['Conecta tu repo de GitHub a Vercel o Netlify.','Publica (deploy).','Prueba la versión online.','Comparte el enlace.'],
        prompt:'"Guíame paso a paso para publicar mi web/PWA en Vercel desde GitHub y verificar que se instala bien."'}]
      :[{name:'Publicarla en Vercel/Netlify',tag:'recomendado',desc:'Deploy gratis conectando GitHub; se actualiza solo al hacer cambios.',
        steps:['Conecta tu repo a Vercel o Netlify.','Publica.','Prueba la versión online y compártela.'],
        prompt:'"Guíame paso a paso para publicar mi web en Vercel desde GitHub. Explícame cada paso sin asumir que sé programar."'},
        {name:'Hacerla instalable (PWA)',tag:'mejora',desc:'Convierte tu web en PWA para que también se instale en móvil y escritorio.',
        steps:['Agrega manifest e icono.','Agrega un service worker.','Verifica con Lighthouse.'],
        prompt:'"Convierte mi web en PWA instalable (manifest + service worker) y dime cómo comprobar que funciona. Paso a paso."'}]));
  } else if(native&&(expo||flutter)){
    plats.push(P('web','Web (navegador)',ic('window'),flutter?60:55,
      (flutter?'Flutter':'Expo')+' puede exportar también a web, con ajustes.',
      'Falta configurar y probar la versión web; algunas funciones nativas no existen en web.',
      [{name:'Exportar a web',tag:'reutiliza código',desc:'Generas una versión web del mismo proyecto.',
        steps:['Activa el objetivo web ('+(flutter?'flutter build web':'expo start --web')+').','Revisa qué funciona y qué no en navegador.','Ajusta lo que dependa de funciones del móvil.','Publica la web en Vercel/Netlify.'],
        prompt:'"Tengo una app en '+(flutter?'Flutter':'Expo')+'. Quiero también una versión web. Explícame qué se puede reutilizar, qué no funcionará y guíame paso a paso."'}]));
  } else if(native){
    plats.push(P('web','Web (navegador)',ic('window'),30,
      'Tu app es nativa (React Native sin web); no corre en navegador tal cual.',
      'Para web necesitarías react-native-web o una versión web aparte.',
      [{name:'Usar react-native-web',tag:'reutiliza código',desc:'Permite correr parte de tu app React Native en el navegador.',
        steps:['Instala react-native-web.','Configura el empaquetado para web.','Prueba qué componentes funcionan.','Publica la web.'],
        prompt:'"Mi app es React Native. Explícame si conviene usar react-native-web para tener versión web, con pros y contras para mi caso, y guíame si decido hacerlo."'},
       {name:'Crear una web aparte',tag:'alternativa',desc:'A veces es más simple una web sencilla independiente que comparta el backend.',
        steps:['Define qué pantallas necesitas en web.','Crea una web simple (React/HTML) conectada al mismo backend.','Publícala en Vercel/Netlify.'],
        prompt:'"Quiero una versión web de mi app móvil que use el mismo backend. Ayúdame a planearla y construir un MVP web paso a paso."'}]));
  }

  return {na:false,plats};
}
/* Vista unificada por dispositivo: % + checklist detectado + opciones de mejora */
function renderDevicesUnified(ctx){
  const pc=platformCompat(ctx);
  if(pc.na) return `<div class="card"><div class="win" style="border-left-color:var(--ink-dim);background:var(--bg-soft)">${ic('info')} ${esc(pc.reason)}</div></div>`;
  const R=deviceRoadmaps(ctx);
  const bc=s=>s>=75?'var(--ok)':s>=40?'var(--warn)':'var(--bad)';
  const optHtml=o=>`<div class="popt"><div class="ot">${esc(o.name)}${o.tag?`<span class="tag2">${esc(o.tag)}</span>`:''}</div><div class="od">${esc(o.desc)}</div><ol class="steps">${o.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><div class="ex"><span class="exl">Prompt para Claude<button class="iconbtn copytext" data-copytext="${escAttr(o.prompt)}" title="Copiar prompt">${ic('copy')}</button></span>${esc(o.prompt)}</div></div>`;
  return pc.plats.map(p=>{
    const rm=R[p.key];
    const done=rm?rm.steps.filter(s=>s.st==='ok').length:0, total=rm?rm.steps.length:0;
    const checklist=rm?`<div class="dev-checklist">${rm.steps.map(s=>`
        <div class="task ${s.st==='ok'?'checked':''}" style="margin:7px 0">
          <div class="tl" style="align-items:flex-start"><span class="st" style="margin-top:1px">${rmStat(s.st)}</span><span>${s.t}</span></div>
          <div class="guide"><div class="gline"><span class="gi">${ic('info')}</span><span>${esc(s.detail)}</span></div>
            ${s.st!=='ok'?`<div class="gline"><span class="gi">${ic('message')}</span><span><b>Cómo lograrlo:</b> <button class="iconbtn copytext" data-copytext="${escAttr(s.prompt)}" title="Copiar prompt" style="vertical-align:-7px">${ic('copy')}</button> <span style="font-family:var(--mono);font-size:11.5px;color:var(--code-ink)">${esc(s.prompt)}</span></span></div>`:''}
          </div></div>`).join('')}</div>`:'';
    return `<details class="plat" style="padding:0"><summary class="plat-sum">
        <span class="i">${p.icon}</span><b>${p.name}</b>
        <span class="dev-chk-count">${total?done+'/'+total+' listos':''}</span>
        <span class="plat-pct" style="color:${bc(p.score)}">${p.score}%</span><span class="chev">›</span></summary>
      <div class="plat-inner">
        <div class="bar"><i style="width:${p.score}%;background:${bc(p.score)}"></i></div>
        <div class="plat-note">${esc(p.note)}</div>
        ${platDocs(p.key)}
        ${checklist}
        <details class="plat-fix" style="margin-top:12px"><summary>${ic('tool')} Cómo mejorarlo · ${p.opts.length} opcion${p.opts.length>1?'es':''} <span class="chev">›</span></summary>
          <div class="plat-body"><div class="plat-miss">${ic('arrowRight')} ${esc(p.missing)}</div>${p.opts.map(optHtml).join('')}</div>
        </details>
      </div></details>`;
  }).join('')+`<p class="hint" style="margin-top:10px">${ic('info')} Los porcentajes y el ✓/✗ se estiman leyendo tus archivos (HTML, CSS, librerías). Lo que no se puede ver desde el código (publicado en tienda, mantenimiento) confírmalo tú abriendo la app en cada dispositivo.</p>`;
}
function renderReport(ctx,checks){
  LAST_CTX=ctx;
  checks=applyLinks(ctx,applyOverrides(ctx,checks));
  const w={ok:1,partial:.5,missing:0};let sum=0,tot=0;checks.forEach(c=>{if(c.status==='info')return;tot++;sum+=w[c.status];});
  const pct=tot?Math.round(sum/tot*100):0;const lv=levelFor(pct);
  const K=ctx.kind||detectRepoKind(ctx);
  const rolls=PHASES.map((p,i)=>{const cs=checks.filter(c=>c.phase===i&&c.status!=='info');if(!cs.length)return null;let s=0;cs.forEach(c=>s+=w[c.status]);return Math.round(s/cs.length*100);});
  LAST_AN={name:ctx.name,pct,rolls,kind:K.label};
  const bc=p=>p>=80?'var(--ok)':p>=50?'var(--warn)':'var(--bad)';
  const missingCrit=checks.filter(c=>(c.status==='missing'||c.status==='partial')&&c.critical);
  const wins=checks.filter(c=>c.status==='ok');
  const phaseRows=PHASES.map((p,i)=>{const rp=rolls[i];return `<div class="ph-roll"><span class="pi">${p.icon}</span><span style="width:170px;font-size:13px">${p.name}</span><span class="bar"><i style="width:${rp===null?0:rp}%;background:${rp===null?'var(--line)':bc(rp)}"></i></span><span class="scorenum">${rp===null?'N/A':rp+'%'}</span></div>`;}).join('');
  const checkList=PHASES.map((p,i)=>{const cs=checks.filter(c=>c.phase===i);if(!cs.length)return '';return `<details class="acc"><summary>${p.icon} ${p.name} <span class="ph-prog">${cs.filter(c=>c.status==='ok').length}/${cs.length} ✓</span><span class="chev">›</span></summary><div class="acc-body">${cs.map(c=>{
      const confirmed=c._manual||c._byLink;
      const markBtn=c._manual
        ? `<button class="markbtn done" data-ovr="${c._key}">${ic('check')} Marcado por ti · desmarcar</button>`
        : (c._byLink ? '' : (c.status!=='ok'&&c.status!=='info' ? `<button class="markbtn" data-ovr="${c._key}">${ic('check')} Ya lo hice</button>` : ''));
      const tag=c._byLink?' <span class="mtag">confirmado por enlace</span>':(c._manual?' <span class="mtag">confirmado por ti</span>':'');
      return `<div class="chk"><span class="st">${statusIcon(c.status)}</span><div class="cl"><b>${c.label}</b>${tag}<div class="ev">${c.evidence}</div>${confirmed?'':(c.tip?`<div class="tp">${c.tip}</div>`:'')}${confirmed?'':renderFix(c.fix)}${markBtn}</div></div>`;
    }).join('')}</div></details>`;}).join('');
  document.getElementById('anResult').innerHTML=`
   <div class="card"><div class="score-ring">
     <div class="ring" style="--p:${pct}"><b>${pct}%</b><small>completo</small></div>
     <div><div class="hint" style="margin:0">Análisis de</div><h2 style="margin:2px 0 6px">${esc(ctx.name)}</h2><div class="level" style="color:${lv.c}">${lv.t}</div>${ctx.desc?`<p style="font-size:13px;margin:6px 0 0">${esc(ctx.desc)}</p>`:''}</div>
   </div>
   <div class="typebar"><span class="typebadge">${K.e} ${K.label}</span><div class="typefacts"><span class="fact">${esc(K.desc)}</span></div></div></div>
   <h2>${ic('globe')}Enlaces de tu proyecto</h2>
   <p style="font-size:13px;margin:-4px 0 10px;color:var(--ink-dim)">GitHub solo muestra el código. Si tu app ya está publicada o tu backend vive en otro servicio, pega aquí sus enlaces: confirmo esos pasos como hechos y los dejo a un clic. Se guardan para este repo.</p>
   <div class="card">${linksCardHtml(ctx)}</div>
   <h2>${ic('chart')}Avance por fase</h2><div class="card">${phaseRows}</div>
   ${missingCrit.length?`<h2>${ic('x')}Lo que falta para publicar / vender</h2><p style="font-size:13px;margin:-4px 0 10px;color:var(--ink-dim)">Lo crítico, con cómo resolverlo, opciones y ejemplos.</p>${missingCrit.map(c=>`<div class="miss"><b>${c.label}.</b> ${c.tip||c.evidence}${renderFix(c.fix)}</div>`).join('')}`:`<div class="card"><div class="win"><b>¡Buenas noticias!</b> No detecté carencias críticas para publicar este tipo de proyecto. Revisa los detalles abajo.</div></div>`}
   <h2>${ic('check')}Lo que ya tienes bien</h2><div class="card">${wins.length?wins.map(c=>`<div class="win">${c.label} — ${c.evidence}</div>`).join(''):'<p>Aún pocas cosas marcadas. ¡Es el comienzo!</p>'}</div>
   <h2>${ic('devices')}Compatibilidad por dispositivo</h2><p style="font-size:13px;margin:-4px 0 10px;color:var(--ink-dim)">Para iPhone, Android, tablet y web: su % de preparación, lo que ya está hecho (✓), lo que falta y cómo lograrlo con prompts. Despliega cada uno.</p>${renderDevicesUnified(ctx)}
   <h2>${ic('search')}Revisión detallada por fase</h2><p style="font-size:13px;margin:-4px 0 10px;color:var(--ink-dim)">Cada punto a mejorar incluye cómo solucionarlo, con opciones y ejemplos. ¿Algo que el análisis no puede ver (backend en otro servidor, deploy en una tienda, mantenimiento) y que <b>ya hiciste</b>? Pulsa <b>"Ya lo hice"</b> para marcarlo — se guarda para este repo.</p>${checkList}
   <div class="card"><div class="row">
     <button class="btn" id="anApply">${ic('pin')} Crear proyecto con este avance</button>
     <button class="btn ghost" id="anPrompt2">${ic('message')} Prompt para que Claude lo arregle</button>
   </div><div class="prompt" id="anFixWrap" style="display:none;margin-top:14px"><div class="ph">${ic('tool')} Prompt para Claude <button class="btn ghost sm copy" data-copy="#anFix">Copiar</button></div><pre id="anFix"></pre></div></div>`;
  document.getElementById('anApply').addEventListener('click',applyAnalysisToRoadmap);
  document.getElementById('anPrompt2').addEventListener('click',()=>{
    const miss=checks.filter(c=>c.status!=='ok'&&c.status!=='info').sort((a,b)=>(b.critical?1:0)-(a.critical?1:0));
    const list=miss.map(c=>{
      const opts=c.fix&&c.fix.length?` (opciones: ${c.fix.map(o=>o.name).join(' / ')})`:'';
      return `- [${c.status==='missing'?'FALTA':'MEJORAR'}] ${c.label}: ${c.tip||c.evidence}${opts}`;
    }).join('\n');
    document.getElementById('anFix').textContent=`Analicé mi proyecto ${ctx.name} (tipo: ${K.label}) y estos son los puntos a resolver, de mayor a menor prioridad. No sé programar; ayúdame uno por uno, en simple y sin romper lo que ya funciona. En cada uno, dime las opciones que tengo y recomiéndame una:\n\n${list||'- (sin pendientes detectados)'}\n\nEmpecemos por el más importante para poder publicar/vender.`;
    document.getElementById('anFixWrap').style.display='';
  });
  // marcar/desmarcar "ya lo hice" (no verificable automáticamente) y re-renderizar
  document.querySelectorAll('#anResult [data-ovr]').forEach(b=>b.addEventListener('click',()=>{
    const key=b.dataset.ovr, on=!b.classList.contains('done');
    setOvr(ctx.name,key,on);
    renderReport(ctx,runChecks(ctx));
    showToast(on?'Marcado como hecho':'Desmarcado');
  }));
  // enlaces del proyecto: guardar al salir del campo (blur o Enter) y re-renderizar
  document.querySelectorAll('#anResult [data-link]').forEach(inp=>{
    const commit=()=>{const prev=linksFor(ctx.name)[inp.dataset.link]||'';if(inp.value.trim()===prev)return;setLink(ctx.name,inp.dataset.link,inp.value);renderReport(ctx,runChecks(ctx));showToast(inp.value.trim()?'Enlace guardado':'Enlace quitado');};
    inp.addEventListener('blur',commit);
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();inp.blur();}});
  });
  // comprobación de vida best-effort de los enlaces guardados
  const lk=linksFor(ctx.name);
  if(lk.deploy) checkLive(lk.deploy,'live_deploy');
  if(lk.backend) checkLive(lk.backend,'live_backend');
}
function applyAnalysisToRoadmap(){
  if(!LAST_AN)return;
  const id=newProject('Análisis: '+LAST_AN.name,true);
  const rm={};LAST_AN.rolls.forEach((p,i)=>{if(p===null)return;if(p>=80)PHASES[i].tasks.forEach((_,j)=>rm['p'+i+'_'+j]=true);else if(p>=40)rm['p'+i+'_0']=true;});
  DB.projects[id].roadmap=rm;
  DB.projects[id].fields.que='App analizada: '+LAST_AN.name;
  DB.projects[id].notes='Importado del análisis de '+LAST_AN.name+' (tipo: '+(LAST_AN.kind||'?')+', '+LAST_AN.pct+'% completo). Revisa los pasos pendientes en el roadmap.';
  saveDB();renderSwitch();loadForm();refreshChrome();renderDashboard();
  showToast('Creé un proyecto con el avance detectado ✓');go('roadmap');
}
document.getElementById('anBtn').addEventListener('click',analyzeRepo);
document.getElementById('anUrl').addEventListener('keydown',e=>{if(e.key==='Enter')analyzeRepo();});

/* ===== repos guardados ===== */
const REPOS_KEY='mapa_repos_v1';
function loadRepos(){try{return JSON.parse(localStorage.getItem(REPOS_KEY)||'[]');}catch(_){return [];}}
function saveRepos(list){localStorage.setItem(REPOS_KEY,JSON.stringify(list));}
function renderSavedRepos(){
  const box=document.getElementById('anSaved');const list=loadRepos();
  if(!list.length){box.innerHTML='<p class="hint" style="margin:0">Aún no guardaste repos. Pega un enlace y pulsa "Guardar enlace" para tenerlo a mano.</p>';return;}
  box.innerHTML=`<div class="saved-h">Repos guardados (${list.length})</div><div class="chips">${list.map((r,i)=>`<span class="chip"><span class="cn" data-open="${i}" title="Analizar ${escAttr(r.full)}">${esc(r.full)}</span><span class="cx" data-del="${i}" title="Quitar">${ic('x')}</span></span>`).join('')}</div>`;
  box.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>{
    const r=loadRepos()[+el.dataset.open];if(!r)return;
    document.getElementById('anUrl').value=r.full;analyzeRepo();
  }));
  box.querySelectorAll('[data-del]').forEach(el=>el.addEventListener('click',()=>{
    const l=loadRepos();l.splice(+el.dataset.del,1);saveRepos(l);renderSavedRepos();showToast('Repo quitado');
  }));
}
document.getElementById('anSaveBtn').addEventListener('click',()=>{
  const pr=parseRepo(document.getElementById('anUrl').value);
  if(!pr){showToast('Pega un enlace de GitHub válido');return;}
  const full=pr.owner+'/'+pr.repo;const list=loadRepos();
  if(list.some(r=>r.full.toLowerCase()===full.toLowerCase())){showToast('Ese repo ya está guardado');return;}
  list.unshift({full,url:'https://github.com/'+full,savedAt:Date.now()});saveRepos(list);renderSavedRepos();showToast('Repo guardado');
});
renderSavedRepos();
document.querySelectorAll('#analizar .an-mode').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#analizar .an-mode').forEach(x=>x.classList.toggle('on',x===b));document.getElementById('anGithub').style.display=b.dataset.mode==='github'?'':'none';document.getElementById('anOtro').style.display=b.dataset.mode==='otro'?'':'none';}));
document.getElementById('anAuditPrompt').textContent=auditPrompt('Apunta a la carpeta de mi proyecto (ábrela en Claude Code). Si es una web en vivo sin código fuente, ábrela y revísala visualmente: [pega la URL aquí].');

/* ===== LLEVAR A DISPOSITIVOS: roadmap/checklist por plataforma ===== */
const DEVICE_PLANS=[
 {key:'web',name:'Web (navegador)',icon:ic('window'),intro:'La base más fácil y universal. Empieza aquí: casi todo lo demás se construye encima de una buena web.',
  steps:[
   {t:'Diseño responsive (se adapta a cualquier pantalla)',how:'Que se vea bien en móvil, tablet y escritorio. Es la base para todo lo demás.',prompt:'"Haz que mi web sea totalmente responsive: agrega la etiqueta viewport y media queries para móvil, tablet y escritorio. Explícame los cambios."'},
   {t:'Publicarla online (deploy)',how:'Ponla en internet con un enlace que puedas compartir.',prompt:'"Guíame paso a paso para publicar mi web en Vercel desde GitHub, sin asumir que sé programar."'},
   {t:'Convertirla en PWA (instalable)',how:'Una PWA se instala como app y puede funcionar sin conexión. Es el puente hacia móvil.',prompt:'"Convierte mi web en una PWA instalable: crea el manifest y el service worker, y dime cómo comprobar que se instala. Paso a paso."'},
   {t:'Probar en navegadores reales',how:'Ábrela en Chrome, Safari y en el móvil para confirmar que todo va bien.',prompt:'"Dame una lista de comprobaciones para probar mi web en distintos navegadores y en móvil antes de compartirla."'},
  ]},
 {key:'android',name:'Android',icon:ic('android'),intro:'El camino más barato a una tienda (cuenta de US$25 única vez). Si ya tienes PWA, casi todo está hecho.',
  steps:[
   {t:'Que funcione bien en Chrome de Android',how:'Pruébala en el móvil; ajusta tamaños y botones cómodos para el dedo.',prompt:'"Optimiza mi web para Chrome de Android: botones cómodos al tacto, textos legibles y viewport correcto."'},
   {t:'Hacerla instalable (PWA o Capacitor)',how:'PWA = la opción simple. Capacitor = app nativa reusando tu web.',prompt:'"Explícame si para Android me conviene PWA o Capacitor según mi app, y hagamos la opción recomendada paso a paso."'},
   {t:'Empaquetarla para Google Play',how:'Con TWA (desde PWA) o con Capacitor generas el archivo .aab para la tienda.',prompt:'"Quiero publicar mi app en Google Play. Guíame para empaquetarla (.aab) con TWA o Capacitor, paso a paso."'},
   {t:'Crear cuenta y publicar en Google Play',how:'Cuenta de desarrollador (US$25 pago único), subir el archivo y la ficha.',prompt:'"Guíame para crear la cuenta de Google Play Developer y publicar mi app: ficha, capturas y envío a revisión."'},
  ]},
 {key:'ios',name:'iPhone (iOS)',icon:ic('apple'),intro:'Apple pide cuenta de US$99/año y una Mac para algunos pasos. La vía más simple sin tienda es la PWA.',
  steps:[
   {t:'Que funcione bien en Safari del iPhone',how:'Pruébala en Safari móvil; cuida el viewport y el área segura (notch).',prompt:'"Optimiza mi web para Safari del iPhone: viewport, área segura del notch y botones cómodos. Paso a paso."'},
   {t:'Instalable como PWA (sin tienda)',how:'El usuario la añade a la pantalla de inicio desde Safari. Gratis y rápido.',prompt:'"Haz que mi web se instale como PWA en iPhone (añadir a inicio): icono, splash y modo app. Explícame cómo la instala el usuario."'},
   {t:'App nativa con Capacitor (para la App Store)',how:'Capacitor envuelve tu web en una app iOS real. Necesitarás una Mac con Xcode.',prompt:'"Quiero llevar mi web a la App Store con Capacitor. Explícame qué necesito (Mac, Xcode, cuenta Apple) y guíame paso a paso."'},
   {t:'Cuenta Apple Developer y publicación',how:'Cuenta US$99/año, build firmado y envío a revisión en App Store Connect.',prompt:'"Guíame para crear la cuenta Apple Developer y publicar mi app en la App Store: build, ficha y revisión."'},
  ]},
 {key:'tablet',name:'Tablet',icon:ic('tablet'),intro:'No es una tienda aparte: es asegurar que tu diseño aproveche pantallas medianas/grandes (iPad y tablets Android).',
  steps:[
   {t:'Diseño para pantallas grandes',how:'Que no se vea como un móvil estirado: usa 2-3 columnas y aprovecha el ancho.',prompt:'"Adapta mi app a tablet: en ancho de tablet usa 2-3 columnas y mejor uso del espacio. Dame los cambios paso a paso."'},
   {t:'Probar en tamaño tablet',how:'Usa el modo responsive del navegador (F12) en tamaño tablet, o un emulador de iPad.',prompt:'"Dame una lista de comprobaciones para revisar que mi app se ve bien en tablet (vertical y horizontal)."'},
   {t:'Orientación vertical y horizontal',how:'Las tablets se usan en ambas; confirma que el diseño aguanta las dos.',prompt:'"Asegura que mi app se vea bien tanto en vertical como en horizontal en tablet. Explícame los ajustes."'},
  ]},
];
function renderDevices(){
  const sw=document.getElementById('devSwitch');
  sw.innerHTML=Object.entries(DB.projects).map(([id,p])=>`<option value="${id}" ${id===DB.activeId?'selected':''}>${esc(p.name)}</option>`).join('');
  const a=active(); a.devices=a.devices||{};
  // tabs
  const cur=a._devTab||'web';
  document.getElementById('devTabs').innerHTML=DEVICE_PLANS.map(d=>{
    const done=d.steps.filter((_,j)=>a.devices[d.key+'_'+j]).length;
    return `<button class="an-mode ${d.key===cur?'on':''}" data-dev="${d.key}"><span class="i" style="width:15px;height:15px;vertical-align:-2px">${d.icon}</span> ${d.name} <span style="opacity:.6">${done}/${d.steps.length}</span></button>`;
  }).join('');
  document.querySelectorAll('#devTabs [data-dev]').forEach(b=>b.addEventListener('click',()=>{active()._devTab=b.dataset.dev;saveDB();renderDevices();}));
  // body
  const plan=DEVICE_PLANS.find(d=>d.key===cur);
  const done=plan.steps.filter((_,j)=>a.devices[cur+'_'+j]).length, pct=Math.round(done/plan.steps.length*100);
  document.getElementById('devHint').textContent=a.fields.que?('Proyecto: '+a.name):'Tip: define tu proyecto en "Proyecto actual" para personalizarlo.';
  document.getElementById('devBody').innerHTML=`
    <div class="card">
      <div class="plat-h" style="margin-bottom:4px"><span class="i">${plan.icon}</span><b>${plan.name}</b><span class="plat-pct" style="color:${pct>=75?'var(--ok)':pct>=40?'var(--warn)':'var(--bad)'}">${pct}%</span></div>
      <div class="progwrap"><div class="progbar" style="width:${pct}%"></div></div>
      <p style="font-size:13px;margin:10px 0 0">${plan.intro}</p>
    </div>
    ${plan.steps.map((s,j)=>{const id=cur+'_'+j,on=!!a.devices[id];return `
      <div class="task ${on?'checked':''}"><label class="tl"><input type="checkbox" data-dev-task="${id}" ${on?'checked':''}><span>${s.t}</span></label>
        <div class="guide">
          <div class="gline"><span class="gi">${ic('bulb')}</span><span><b>Qué es:</b> ${s.how}</span></div>
          <div class="gline"><span class="gi">${ic('message')}</span><span><b>Prompt:</b> <button class="iconbtn copytext" data-copytext="${escAttr(s.prompt)}" title="Copiar prompt" style="vertical-align:-7px">${ic('copy')}</button> <span style="font-family:var(--mono);font-size:11.6px;color:var(--code-ink)">${esc(s.prompt)}</span></span></div>
        </div></div>`;}).join('')}`;
  document.querySelectorAll('#devBody [data-dev-task]').forEach(c=>c.addEventListener('change',()=>{active().devices[c.dataset.devTask]=c.checked;saveDB();renderDevices();}));
}
document.getElementById('devSwitch').addEventListener('change',e=>{DB.activeId=e.target.value;saveDB();refreshChrome();renderDevices();});

/* ===================== SEGURIDAD ===================== */
/* --- Auditoría: escanea archivos del repo en busca de problemas reales --- */
const SECRET_PATTERNS=[
  {re:/(sk-[a-zA-Z0-9]{20,}|sk-proj-[a-zA-Z0-9_-]{20,})/,name:'Clave de OpenAI'},
  {re:/(sk-ant-[a-zA-Z0-9_-]{20,})/,name:'Clave de Anthropic (Claude)'},
  {re:/AIza[0-9A-Za-z_-]{30,}/,name:'Clave de Google/Firebase'},
  {re:/AKIA[0-9A-Z]{16}/,name:'Clave de AWS'},
  {re:/(ghp|gho|ghs)_[0-9A-Za-z]{30,}/,name:'Token de GitHub'},
  {re:/xox[baprs]-[0-9A-Za-z-]{10,}/,name:'Token de Slack'},
  {re:/sk_live_[0-9A-Za-z]{20,}/,name:'Clave secreta de Stripe (LIVE)'},
  {re:/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,name:'Token JWT'},
  {re:/-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/,name:'Clave privada'},
  {re:/(password|passwd|contraseña)\s*[:=]\s*["'][^"'\s]{6,}["']/i,name:'Contraseña en texto'},
];
async function auditSecurity(){
  const pr=parseRepo(document.getElementById('secUrl').value);
  const box=document.getElementById('secResult');
  if(!pr){showToast('Pega un enlace de GitHub válido');return;}
  box.style.display='block';
  box.innerHTML=`<div class="card">Auditando seguridad de <b>${esc(pr.owner)}/${esc(pr.repo)}</b>… revisando archivos y dependencias.</div>`;
  try{
    const meta=await ghJSON(`https://api.github.com/repos/${pr.owner}/${pr.repo}`);
    const branch=meta.default_branch||'main';
    let tree={};try{tree=await ghJSON(`https://api.github.com/repos/${pr.owner}/${pr.repo}/git/trees/${branch}?recursive=1`);}catch(_){}
    const paths=(tree.tree||[]).map(t=>t.path); const lower=paths.map(p=>p.toLowerCase());
    const has=re=>lower.some(p=>re.test(p));
    const get=p=>ghText(pr.owner,pr.repo,branch,p);
    const gitignore=await get('.gitignore');
    const pkgTxt=await get('package.json'); let pkg=null;try{pkg=pkgTxt?JSON.parse(pkgTxt):null;}catch(_){}
    const deps=pkg?Object.assign({},pkg.dependencies,pkg.devDependencies):{};
    // leer archivos de código candidatos a contener secretos (límite para no saturar)
    const codeFiles=paths.filter(p=>/\.(js|jsx|ts|tsx|py|env|json|yml|yaml|html|rb|php|go|java|txt|config|ini)$/i.test(p)
      && !/package-lock|yarn\.lock|pnpm-lock|\.min\.|node_modules\//i.test(p)).slice(0,40);
    const envLike=paths.filter(p=>/(^|\/)\.env/i.test(p));
    const scanned=[...new Set([...envLike,...codeFiles])].slice(0,45);
    const findings=[];
    // lotes en paralelo: misma cuota de API de GitHub, pero la espera baja de ~45 viajes seguidos a ~6
    for(let i=0;i<scanned.length;i+=8){
      const batch=scanned.slice(i,i+8);
      const texts=await Promise.all(batch.map(f=>get(f)));
      texts.forEach((t,k)=>{ if(!t)return; SECRET_PATTERNS.forEach(p=>{ if(p.re.test(t)) findings.push({file:batch[k],name:p.name}); }); });
    }
    const ctx={pr,meta,paths,has,gitignore,pkg,deps,findings,scannedCount:scanned.length,name:pr.owner+'/'+pr.repo};
    renderSecReport(ctx);
  }catch(e){
    const msg=e.message==='404'?'No encontré ese repositorio (¿es público?).':e.message==='rate'?'GitHub me limitó por muchas consultas. Espera unos minutos.':'No pude auditarlo. Revisa el enlace.';
    box.innerHTML=`<div class="card"><div class="miss"><b>Ups.</b> ${msg}</div></div>`;
  }
}
function secChecks(ctx){
  const {has,gitignore,deps,findings,pkg}=ctx;
  const C=[];
  const P=(label,status,evidence,sev,fix)=>C.push({label,status,evidence,sev,fix});
  const depHas=n=>Object.keys(deps).some(d=>d.toLowerCase().includes(n));
  const usesAI=depHas('openai')||depHas('@anthropic')||depHas('anthropic')||depHas('@google/genai')||depHas('replicate')||depHas('cohere')||depHas('langchain');
  const usesBackend=depHas('express')||depHas('fastify')||depHas('next')||has(/\/api\//)||depHas('supabase')||depHas('firebase')||depHas('flask')||depHas('django')||depHas('fastapi');
  // exige una entrada real para .env (.env, .env*, *.env); ".env.example" solo NO protege el .env
  const envIgnored=!!gitignore&&/^\s*(\*\*\/)?\/?(\.env\*?|\*\.env)\s*$/m.test(gitignore);
  const envCommitted=has(/(^|\/)\.env$/)||has(/\.env\.local$/)||has(/\.env\.production$/);

  // 1. Secretos filtrados (lo más crítico)
  if(findings.length){
    P('Claves o secretos expuestos en el código','missing',
      findings.map(f=>f.name+' en '+f.file).join(' · '),'critico',
      [{name:'Acción inmediata',tag:'¡urgente!',desc:'Esas claves ya son públicas: cualquiera puede usarlas y gastar tu dinero. Hay que ROTARLAS (generar nuevas) y sacarlas del código.',
        steps:['Entra al panel del servicio (OpenAI, Stripe, etc.) y REVOCA/regenera esas claves ya.','Mueve las claves a un archivo .env (que NO se sube).','Agrega .env al .gitignore.','Borra las claves del historial de Git (o, si es posible, recrea el repo limpio).'],
        prompt:'"Tengo claves de API expuestas en mi repositorio: '+findings.map(f=>f.name).join(', ')+'. Explícame paso a paso, sin asumir que sé programar: 1) cómo revocarlas y crear nuevas, 2) cómo moverlas a variables de entorno (.env), 3) cómo asegurarme de que no vuelvan a subirse, y 4) cómo limpiarlas del historial de Git."'}]);
  } else {
    P('Claves o secretos en el código','ok','No detecté patrones de claves filtradas en '+(ctx.scannedCount===1?'el archivo revisado':'los '+ctx.scannedCount+' archivos revisados')+'.','');
  }
  // 2. .env subido
  P('Archivo .env en el repositorio',envCommitted?'missing':'ok',
    envCommitted?'Hay un archivo .env versionado: nunca debe subirse.':'No detecté un .env subido.','critico',
    envCommitted?[{name:'Sácalo del repo y rota lo que contenga',tag:'urgente',desc:'El .env suele tener todas tus claves. Si está en el repo, son públicas.',
      steps:['Agrega .env al .gitignore.','Quítalo del repositorio (git rm --cached .env).','Rota/regenera cualquier clave que tuviera.','Crea un .env.example sin valores reales como guía.'],
      prompt:'"Tengo un archivo .env subido a mi repo de GitHub. Guíame paso a paso para quitarlo del repositorio, ignorarlo en git, rotar sus claves y dejar un .env.example de ejemplo."'}]:null);
  // 3. .gitignore protege secretos
  P('Protección de secretos (.gitignore)',envIgnored?'ok':(envCommitted?'missing':'partial'),
    envIgnored?'.gitignore ya ignora archivos .env':(gitignore?'.gitignore existe pero no parece ignorar .env':'Sin .gitignore'),'alto',
    envIgnored?null:[{name:'Configura .gitignore',tag:'recomendado',desc:'Evita que archivos con claves se suban por accidente.',
      steps:['Crea/edita .gitignore.','Añade líneas para .env, .env.local y carpetas de build.','Confirma que git ya no rastrea esos archivos.'],
      prompt:'"Crea o ajusta mi .gitignore para que nunca suba secretos (.env y variantes) ni archivos basura. Explícame qué hace cada línea."'}]);
  // 4. Dependencias y vulnerabilidades conocidas
  P('Revisión de dependencias',pkg?'partial':'info',
    pkg?('Tienes '+Object.keys(deps).length+' dependencias. No puedo escanear vulnerabilidades desde aquí; hazlo con una herramienta.'):'Sin package.json (o no es proyecto Node).','medio',
    pkg?[{name:'Ejecuta una auditoría de dependencias',tag:'recomendado',desc:'Las librerías que usas pueden tener fallos conocidos. Hay comandos que los listan y arreglan.',
      steps:['En tu proyecto, ejecuta el comando de auditoría (npm audit).','Revisa los problemas reportados (severidad alta/crítica primero).','Aplica las correcciones sugeridas (npm audit fix).','Repite cada cierto tiempo.'],
      prompt:'"Quiero revisar si las librerías de mi proyecto tienen vulnerabilidades conocidas. Guíame para ejecutar una auditoría de dependencias (npm audit u otra), entender los resultados y corregir lo importante, paso a paso."'}]:null);
  // 5. Autenticación / acceso (si hay backend)
  if(usesBackend){
    const authLib=depHas('next-auth')||depHas('clerk')||depHas('@clerk')||depHas('passport')||depHas('lucia')||depHas('supabase')||depHas('firebase');
    P('Autenticación y control de acceso',authLib?'partial':'info',
      authLib?'Hay librería de autenticación; revisa que protejas las rutas/datos.':'Tienes backend; confirma quién puede acceder a qué.','alto',
      [{name:'Protege datos y rutas sensibles',tag:'recomendado',desc:'No basta con login: cada usuario debe ver solo lo suyo.',
        steps:['Verifica que las rutas privadas exijan sesión válida.','Si usas Supabase, activa Row Level Security (RLS) en las tablas.','Valida permisos en el servidor, no solo en la pantalla.','Prueba intentar acceder a datos de otro usuario.'],
        prompt:'"Revisa la seguridad de acceso de mi app: que las rutas privadas exijan login, que cada usuario solo vea sus datos (RLS si uso Supabase) y que los permisos se validen en el servidor. Dame los cambios paso a paso."'}]);
  }
  // 6. Validación de entradas (inyección/XSS)
  P('Validación de datos que entran del usuario','info',
    'No verificable solo con archivos; depende de cómo manejas formularios y consultas.','alto',
    [{name:'Valida y sanea todo lo que el usuario escribe',tag:'recomendado',desc:'Evita inyección SQL y XSS: nunca confíes en lo que llega del usuario.',
      steps:['Usa consultas parametrizadas (no concatenes texto en SQL).','Escapa/sanea el texto antes de mostrarlo en pantalla (evita XSS).','Valida tipos y longitudes en el servidor.','Limita el tamaño de lo que se puede enviar.'],
      prompt:'"Revisa mi app contra inyección SQL y XSS: que use consultas parametrizadas y que sanee lo que el usuario escribe antes de guardarlo o mostrarlo. Explícame qué encontraste y cómo corregirlo, paso a paso."'}]);
  // 7. HTTPS / cabeceras
  P('Conexión segura (HTTPS) y cabeceras','info',
    'Si publicas en Vercel/Netlify, HTTPS viene incluido. Las cabeceras de seguridad suelen faltar.','medio',
    [{name:'Añade cabeceras de seguridad',tag:'recomendado',desc:'Cabeceras como CSP, HSTS y X-Frame-Options reducen muchos ataques.',
      steps:['Confirma que tu sitio carga con https:// (candado).','Agrega cabeceras de seguridad en la config de tu hosting.','Verifica con una herramienta gratuita (ej. securityheaders.com).'],
      prompt:'"Agrega cabeceras de seguridad a mi app (CSP, HSTS, X-Frame-Options, etc.) según mi hosting (Vercel/Netlify/otro) y explícame qué protege cada una. Paso a paso."'}]);
  // 8. ABUSO DE APIs DE IA (lo que pediste específicamente)
  if(usesAI){
    P('Protección de tus APIs de IA (anti-abuso)','missing',
      'Detecté uso de APIs de IA. Sin protección, alguien puede dispararte la factura usándolas sin control.','critico',
      [{name:'Nunca pongas la clave de IA en el frontend',tag:'lo más importante',desc:'Si la clave está en el navegador, es visible para cualquiera. Debe vivir SOLO en el servidor.',
        steps:['Mueve las llamadas a la IA a un backend/función serverless.','Guarda la clave como variable de entorno en el servidor.','El navegador llama a TU servidor, y tu servidor llama a la IA.'],
        prompt:'"Mi app usa una API de IA. Quiero que la clave nunca quede expuesta en el navegador. Guíame para mover las llamadas a un backend (o función serverless), guardar la clave como variable de entorno y que el frontend llame a mi servidor en vez de a la IA directamente. Paso a paso."'},
       {name:'Límites de uso (rate limiting)',tag:'esencial',desc:'Pon un tope de cuántas peticiones por usuario/IP por minuto, para que nadie abuse.',
        steps:['Añade rate limiting en tu backend (por IP y/o por usuario).','Define un tope diario de gasto/uso.','Devuelve un error claro cuando se supera.'],
        prompt:'"Agrega límites de uso (rate limiting) a las llamadas de IA de mi app: por usuario e IP, con un tope por minuto y un máximo diario, para evitar abuso y facturas sorpresa. Explícame las opciones y hazlo paso a paso."'},
       {name:'Requiere inicio de sesión para usar la IA',tag:'recomendado',desc:'Que solo usuarios identificados puedan gastar tus créditos de IA.',
        steps:['Exige sesión válida antes de llamar a la IA.','Asocia el uso a cada cuenta.','Registra el consumo por usuario.'],
        prompt:'"Quiero que solo usuarios con sesión iniciada puedan usar las funciones de IA de mi app, y llevar registro de cuánto consume cada uno. Guíame paso a paso."'},
       {name:'Tope de gasto en el proveedor',tag:'red de seguridad',desc:'En el panel de OpenAI/Anthropic, pon un límite de gasto mensual como última barrera.',
        steps:['Entra al panel de facturación del proveedor de IA.','Configura un límite de gasto (budget/usage limit) mensual.','Activa alertas por correo al acercarte al límite.'],
        prompt:'"Explícame cómo poner un límite de gasto mensual y alertas en el panel de mi proveedor de IA (OpenAI/Anthropic) para no llevarme sustos en la factura."'}]);
  }
  return C;
}
const SEV_ORDER={critico:0,alto:1,medio:2,bajo:3};
function sevTag(sev){const m={critico:['Crítico','st-missing'],alto:['Alto','st-missing'],medio:['Medio','st-partial'],bajo:['Bajo','st-info']}[sev];return m?`<span class="sev ${m[1]}">${m[0]}</span>`:'';}
function secFix(fix){
  if(!fix||!fix.length)return '';
  return `<div class="fixbox"><div class="fh">${ic('tool')} Cómo corregirlo · opciones</div>${fix.map(o=>`<div class="popt">${fixOptHead(o)}${o.steps?`<ol class="steps">${o.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}<div class="ex"><span class="exl">Prompt para Claude<button class="iconbtn copytext" data-copytext="${escAttr(o.prompt)}" title="Copiar prompt">${ic('copy')}</button></span>${esc(o.prompt)}</div></div>`).join('')}</div>`;
}
let LAST_SEC=null;
function renderSecReport(ctx){
  const checks=secChecks(ctx);
  const crit=checks.filter(c=>c.status==='missing'&&(c.sev==='critico'||c.sev==='alto'));
  const w={ok:1,partial:.5,missing:0,info:null};
  let s=0,t=0;checks.forEach(c=>{if(w[c.status]===null)return;t++;s+=w[c.status];});
  const pct=t?Math.round(s/t*100):100;
  const lvl={t:crit.length?'Riesgo alto — corrige lo crítico ya':pct>=80?'Buena base de seguridad':'Mejorable — revisa los puntos',c:secColor({crit:crit.length,pct})};
  LAST_SEC={name:ctx.name,pct,crit:crit.length};
  // guarda el resultado en el proyecto activo para mostrarlo en "Mis proyectos"
  if(typeof active==='function'&&active()){active().secAudit={pct,crit:crit.length,repo:ctx.name,at:Date.now()};saveDB();}
  const ord=[...checks].sort((a,b)=>(SEV_ORDER[a.sev]??9)-(SEV_ORDER[b.sev]??9));
  document.getElementById('secResult').innerHTML=`
   <div class="card"><div class="score-ring">
     <div class="ring" style="--p:${pct}"><b>${pct}%</b><small>seguro</small></div>
     <div><div class="hint" style="margin:0">Auditoría de seguridad de</div><h2 style="margin:2px 0 6px">${esc(ctx.name)}</h2><div class="level" style="color:${lvl.c}">${lvl.t}</div>
     <p style="font-size:12.5px;margin:6px 0 0">Revisé ${ctx.scannedCount} archivo${ctx.scannedCount===1?'':'s'} en busca de secretos, además de configuración y dependencias.</p></div>
   </div></div>
   ${ctx.findings.length?`<div class="card" style="border-color:color-mix(in srgb,var(--bad) 50%,transparent)"><div class="miss"><b>${ic('alert')} ¡Atención! Posibles claves expuestas</b><br>${ctx.findings.map(f=>esc(f.name)+' → <code>'+esc(f.file)+'</code>').join('<br>')}<br><br>Trátalas como comprometidas: revócalas y crea nuevas. Abajo te explico cómo.</div></div>`:''}
   <h2>${ic('shield')}Resultados (de mayor a menor riesgo)</h2>
   <p style="font-size:13px;margin:-4px 0 10px;color:var(--ink-dim)">Cada punto trae su gravedad, cómo corregirlo y un prompt para Claude.</p>
   ${ord.map(c=>`<div class="chk" style="border:1px solid var(--line);border-radius:var(--r);padding:13px 14px;margin:0 0 9px;background:var(--panel)"><span class="st">${statusIcon(c.status)}</span><div class="cl"><b>${c.label}</b> ${sevTag(c.sev)}<div class="ev">${esc(c.evidence)}</div>${c.fix?secFix(c.fix):''}</div></div>`).join('')}
   <div class="card"><div class="row">
     <button class="btn" id="secToRoadmap">${ic('shield')} Ver roadmap de seguridad</button>
     <button class="btn ghost" id="secAllPrompt">${ic('message')} Prompt: arréglalo todo</button>
   </div><div class="prompt" id="secAllWrap" style="display:none;margin-top:14px"><div class="ph">${ic('tool')} Prompt para Claude <button class="btn ghost sm copy" data-copy="#secAll">Copiar</button></div><pre id="secAll"></pre></div></div>`;
  document.getElementById('secToRoadmap').addEventListener('click',()=>{secTab('roadmap');});
  document.getElementById('secAllPrompt').addEventListener('click',()=>{
    const items=ord.filter(c=>c.status!=='ok'&&c.fix).map(c=>`- [${(c.sev||'').toUpperCase()}] ${c.label}: ${c.evidence}`).join('\n');
    document.getElementById('secAll').textContent=`Audité la seguridad de mi proyecto ${ctx.name} y estos son los puntos a resolver, de mayor a menor gravedad. No sé programar; ayúdame uno por uno, sin romper lo que funciona, y empieza por lo crítico:\n\n${items||'- (sin pendientes)'}\n\nPor cada uno, dime las opciones, recomiéndame una y guíame paso a paso.`;
    document.getElementById('secAllWrap').style.display='';
  });
}

/* --- Roadmap de seguridad (checklist por proyecto) --- */
// cada paso tiene un id estable: el progreso se guarda por id (no por posición), así reordenar o insertar pasos no corrompe lo marcado
const SEC_STEPS=[
 {id:'secretos',t:'Sacar todos los secretos del código',how:'Claves de API, contraseñas y tokens nunca van en el código. Van en variables de entorno (.env) que no se suben.',prompt:'"Revisa mi proyecto y mueve cualquier clave, contraseña o token a variables de entorno (.env), ignóralo en git y deja un .env.example. Paso a paso."'},
 {id:'gitignore',t:'Configurar .gitignore para no filtrar nada',how:'Evita subir .env, builds y archivos con datos sensibles por accidente.',prompt:'"Crea/ajusta mi .gitignore para no subir nunca secretos ni basura. Explícame cada línea."'},
 {id:'login',t:'Exigir login en lo que sea privado',how:'Cada usuario debe ver solo lo suyo; valida permisos en el servidor, no solo en pantalla.',prompt:'"Asegura que las partes privadas de mi app exijan sesión y que cada usuario solo acceda a sus datos. Si uso Supabase, activa RLS. Paso a paso."'},
 {id:'validar-entradas',t:'Validar y sanear lo que el usuario escribe',how:'Previene inyección SQL y XSS: nunca confíes en datos que llegan de fuera.',prompt:'"Protege mi app contra inyección SQL y XSS: consultas parametrizadas y saneo de entradas. Dime qué cambiar, paso a paso."'},
 {id:'proteger-ia',t:'Proteger las APIs de IA contra abuso',how:'Clave solo en el servidor + límites de uso (rate limit) + tope de gasto en el proveedor.',prompt:'"Mi app usa IA. Protégela: clave solo en backend, rate limiting por usuario/IP, login para usarla y tope de gasto en el proveedor. Explícame y hazlo paso a paso."'},
 {id:'dependencias',t:'Auditar dependencias regularmente',how:'Las librerías pueden tener fallos conocidos; hay comandos que los detectan y corrigen.',prompt:'"Guíame para auditar las dependencias de mi proyecto (npm audit u otra), entender los resultados y corregir lo importante."'},
 {id:'https',t:'HTTPS y cabeceras de seguridad',how:'HTTPS cifra la conexión; cabeceras como CSP/HSTS bloquean ataques comunes.',prompt:'"Confirma que mi app use HTTPS y añade cabeceras de seguridad (CSP, HSTS, X-Frame-Options) según mi hosting. Explica cada una."'},
 {id:'respaldos',t:'Copias de seguridad y plan de recuperación',how:'Si algo se rompe o te atacan, poder volver a un estado bueno lo es todo.',prompt:'"Ayúdame a configurar copias de seguridad de mi base de datos y un plan simple para recuperar mi app si algo falla."'},
 {id:'limites-gasto',t:'Límites de gasto y alertas en los servicios',how:'Topes de gasto en IA, hosting y base de datos evitan facturas sorpresa por abuso.',prompt:'"Explícame cómo poner límites de gasto y alertas de uso en mis servicios (IA, hosting, base de datos) para no llevarme sustos."'},
 {id:'revision-final',t:'Revisión final antes de publicar',how:'Una última pasada de seguridad antes de abrir tu app al público.',prompt:'"Voy a publicar mi app. Haz una revisión de seguridad completa final y dame una lista priorizada de lo que falta blindar."'},
];
function renderSecRoadmap(){
  const sw=document.getElementById('secSwitch');
  sw.innerHTML=Object.entries(DB.projects).map(([id,p])=>`<option value="${id}" ${id===DB.activeId?'selected':''}>${esc(p.name)}</option>`).join('');
  const a=active(); a.security=a.security||{};
  // migra el progreso guardado con claves por índice (s0..s9, versiones previas) a las claves estables por id
  let mig=false;SEC_STEPS.forEach((s,j)=>{const old='s'+j;if(old in a.security){if(!(s.id in a.security))a.security[s.id]=a.security[old];delete a.security[old];mig=true;}});
  if(mig)saveDB();
  const done=SEC_STEPS.filter(s=>a.security[s.id]).length, pct=Math.round(done/SEC_STEPS.length*100);
  document.getElementById('secRoadmapBody').innerHTML=`
    <div class="card"><div class="plat-h" style="margin-bottom:4px"><span class="i">${ic('shield')}</span><b>Roadmap de seguridad · ${esc(a.name)}</b><span class="plat-pct" style="color:${pct>=75?'var(--ok)':pct>=40?'var(--warn)':'var(--bad)'}">${pct}%</span></div>
      <div class="progwrap"><div class="progbar" style="width:${pct}%"></div></div>
      <p style="font-size:13px;margin:10px 0 0">Marca cada medida cuando la apliques. Empieza por las primeras (las más críticas). Tu avance se guarda en este proyecto.</p></div>
    ${SEC_STEPS.map((s,j)=>{const on=!!a.security[s.id];return `
      <div class="task ${on?'checked':''}"><label class="tl"><input type="checkbox" data-sec-task="${s.id}" ${on?'checked':''}><span>${j+1}. ${s.t}</span></label>
        <div class="guide">
          <div class="gline"><span class="gi">${ic('bulb')}</span><span><b>Por qué:</b> ${s.how}</span></div>
          <div class="gline"><span class="gi">${ic('message')}</span><span><b>Prompt:</b> <button class="iconbtn copytext" data-copytext="${escAttr(s.prompt)}" title="Copiar prompt" style="vertical-align:-7px">${ic('copy')}</button> <span style="font-family:var(--mono);font-size:11.5px;color:var(--code-ink)">${esc(s.prompt)}</span></span></div>
        </div></div>`;}).join('')}`;
  document.querySelectorAll('#secRoadmapBody [data-sec-task]').forEach(c=>c.addEventListener('change',()=>{active().security[c.dataset.secTask]=c.checked;saveDB();renderSecRoadmap();}));
}
document.getElementById('secSwitch').addEventListener('change',e=>{DB.activeId=e.target.value;saveDB();refreshChrome();renderSecRoadmap();});

/* --- Recomendaciones de blindaje --- */
const BLINDAJE=[
 {ic:'key',t:'Secretos y claves',items:[
   'Nunca pongas claves de API, contraseñas ni tokens en el código. Usa variables de entorno (.env) que NO se suben a GitHub.',
   'Si una clave se filtró alguna vez, considérala comprometida: revócala y crea una nueva.',
   'Ten un .env.example con los nombres de las variables pero SIN los valores reales.']},
 {ic:'cpu',t:'APIs de IA (evitar abuso y facturas sorpresa)',items:[
   'La clave de IA va SOLO en el servidor, nunca en el navegador. El frontend llama a tu servidor; tu servidor llama a la IA.',
   'Pon límites de uso (rate limiting) por usuario e IP: máximo X peticiones por minuto.',
   'Exige inicio de sesión para usar funciones de IA, y registra el consumo por usuario.',
   'Configura un tope de gasto mensual y alertas en el panel del proveedor (OpenAI/Anthropic).',
   'Valida y limita el tamaño de lo que el usuario envía a la IA (evita prompts gigantes que cuesten mucho).']},
 {ic:'lock',t:'Acceso y cuentas',items:[
   'No construyas el login a mano: usa sistemas probados (Supabase Auth, Firebase Auth, Clerk).',
   'Valida permisos en el servidor, no solo escondiendo botones en la pantalla.',
   'Cada usuario debe ver solo sus datos. Con Supabase, activa Row Level Security (RLS).',
   'Usa contraseñas fuertes y, si puedes, verificación en dos pasos (2FA).']},
 {ic:'shield',t:'Entradas y ataques comunes',items:[
   'Nunca confíes en lo que escribe el usuario: valida tipo, longitud y formato en el servidor.',
   'Usa consultas parametrizadas para la base de datos (previene inyección SQL).',
   'Escapa el texto antes de mostrarlo en pantalla (previene XSS).',
   'Protege formularios con límites de envío y, si hace falta, captcha contra bots.']},
 {ic:'globe',t:'Conexión y publicación',items:[
   'Sirve siempre por HTTPS (en Vercel/Netlify viene incluido).',
   'Añade cabeceras de seguridad: CSP, HSTS, X-Frame-Options.',
   'No expongas mensajes de error técnicos al usuario final (dan pistas a atacantes).',
   'Mantén dependencias y servicios actualizados.']},
 {ic:'save',t:'Datos y recuperación',items:[
   'Haz copias de seguridad periódicas de tu base de datos.',
   'Ten un plan simple para volver atrás si algo se rompe o te atacan (Git + backups).',
   'Cumple lo básico de privacidad si guardas datos personales (aviso de privacidad, consentimiento).',
   'Pon límites de gasto en TODOS los servicios de pago, no solo en la IA.']},
];
function renderBlindaje(){
  document.getElementById('secBlindaje').innerHTML=`
    <p class="lead" style="margin-bottom:6px">Buenas prácticas para proteger tu app de ataques, hackeos y abuso. No necesitas aplicarlas todas de golpe: empieza por secretos y APIs de IA.</p>
    ${BLINDAJE.map(b=>`<div class="card"><h3>${ic(b.ic)} ${b.t}</h3><ul style="margin:10px 0 0;padding-left:18px">${b.items.map(i=>`<li style="font-size:13.3px;color:var(--ink-soft);margin:6px 0">${esc(i)}</li>`).join('')}</ul></div>`).join('')}
    <div class="callout">¿Tu app usa IA? Lee con calma la sección <b>"APIs de IA"</b>: es donde más gente pierde dinero por no protegerla. La regla de oro: <b>la clave nunca en el navegador + límites de uso + tope de gasto</b>.</div>`;
}

/* --- pestañas de Seguridad --- */
function secTab(name){
  document.querySelectorAll('#secTabs [data-sectab]').forEach(b=>b.classList.toggle('on',b.dataset.sectab===name));
  document.getElementById('secAuditar').style.display=name==='auditar'?'':'none';
  document.getElementById('secRoadmap').style.display=name==='roadmap'?'':'none';
  document.getElementById('secBlindaje').style.display=name==='blindaje'?'':'none';
  if(name==='roadmap')renderSecRoadmap();
  if(name==='blindaje')renderBlindaje();
}
document.querySelectorAll('#secTabs [data-sectab]').forEach(b=>b.addEventListener('click',()=>secTab(b.dataset.sectab)));
document.getElementById('secBtn').addEventListener('click',auditSecurity);
document.getElementById('secUrl').addEventListener('keydown',e=>{if(e.key==='Enter')auditSecurity();});

/* ===== arranque ===== */
renderSwitch();loadForm();refreshChrome();renderPhases();renderDashboard();

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

/* ===== tema claro/oscuro ===== */
(function(){
  const saved=localStorage.getItem('maTheme');
  if(saved==='light'||saved==='dark')document.documentElement.dataset.theme=saved;
  const sync=()=>{const l=document.getElementById('themeLabel');if(l)l.textContent=document.documentElement.dataset.theme==='dark'?'Tema claro':'Tema oscuro';const tc=document.getElementById('theme-color-meta');if(tc)tc.setAttribute('content',document.documentElement.dataset.theme==='light'?'#fafafa':'#08090b');};
  sync();
  window.toggleTheme=function(){
    const h=document.documentElement;
    h.dataset.theme=h.dataset.theme==='dark'?'light':'dark';
    localStorage.setItem('maTheme',h.dataset.theme);
    sync();
    applyPrefs();
    if(typeof renderAjustes==='function')renderAjustes();
  };
  const railBtn=document.getElementById('themeBtnRail');
  if(railBtn)railBtn.addEventListener('click',window.toggleTheme);
})();
applyPrefs();

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

/* ===== riel colapsable ===== */
(function(){
  const w=document.querySelector('.wrap'),a=document.querySelector('aside');
  if(!w||!a)return;
  a.addEventListener('mouseenter',()=>{if((w.dataset.railmode||'hover')==='hover')w.classList.add('exp')});
  a.addEventListener('mouseleave',()=>{if((w.dataset.railmode||'hover')==='hover')w.classList.remove('exp')});
})();

/* ===== PWA: registrar service worker (solo en http/https; en file:// no aplica) ===== */
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{});});
}

/* ===== atajos de teclado (escritorio) ===== */
(function(){
  const order=pages.map(p=>p.id);
  const curIdx=()=>{const on=document.querySelector('.page.on');return on?Math.max(0,order.indexOf(on.id)):0;};
  const goIdx=i=>go(order[(i+order.length)%order.length]);
  function toggleHelp(){
    let h=document.getElementById('kb-help');
    if(h){h.remove();return;}
    h=document.createElement('div');h.id='kb-help';
    h.innerHTML=`<div class="kb-card"><b>Atajos de teclado</b>
      <div class="kb-row"><kbd>]</kbd> / <kbd>[</kbd><span>Sección siguiente / anterior</span></div>
      <div class="kb-row"><kbd>Alt</kbd>+<kbd>→</kbd> / <kbd>←</kbd><span>Sección siguiente / anterior</span></div>
      <div class="kb-row"><kbd>t</kbd><span>Cambiar tema claro/oscuro</span></div>
      <div class="kb-row"><kbd>?</kbd><span>Mostrar / ocultar esta ayuda</span></div>
      <div class="kb-row"><kbd>Esc</kbd><span>Cerrar</span></div></div>`;
    h.addEventListener('click',()=>h.remove());
    document.body.appendChild(h);
  }
  document.addEventListener('keydown',e=>{
    const t=e.target;
    if(t&&(t.matches&&t.matches('input,textarea,select')||t.isContentEditable))return;
    if(e.ctrlKey||e.metaKey)return;
    const help=document.getElementById('kb-help');
    if(e.key==='Escape'){if(help)help.remove();document.getElementById('menu-dropdown')?.classList.remove('open');return;}
    if(e.altKey){
      if(e.key==='ArrowRight'){e.preventDefault();goIdx(curIdx()+1);}
      else if(e.key==='ArrowLeft'){e.preventDefault();goIdx(curIdx()-1);}
      return;
    }
    if(e.key===']'){e.preventDefault();goIdx(curIdx()+1);}
    else if(e.key==='['){e.preventDefault();goIdx(curIdx()-1);}
    else if(e.key==='t'||e.key==='T'){e.preventDefault();if(typeof toggleTheme==='function')toggleTheme();}
    else if(e.key==='?'){e.preventDefault();toggleHelp();}
  });
})();
