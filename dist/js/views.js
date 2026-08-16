import { universes,seeds,sampleCodes,journeyDays,elementDefinitions,levelDefinitions,elementPieces,dailyFallback } from './content.js';
import { libraryBooks,libraryVideos,libraryVideoChannels,libraryVideoSections,libraryCategories,libraryRecommended,getLibraryBook,youtubeEmbedUrl,youtubeThumbnail } from './library-data.js';
import { store } from './store.js';
import { api } from './api.js';
import { navigate } from './router.js';
import { HubScene } from './hub-scene.js';
import { ambient } from './audio.js';
import { escapeHtml,formatDate,toast,openModal,pageHero,confirmAction,bindRouteButtons } from './ui.js';
import { visual, VISUALS } from './visual-assets.js';
import { createConversationController } from './conversation-controller.js';
import { sessionProvider } from './session-provider.js';
import { allSeedMarket,elementSeedMarket,seedRarities,seedElements,seedCollections,getCollectionFacets,getMarketSeed } from './seed-market-data.js';
import { dashboardDreamSamples,dashboardCommunity,dashboardMilestones,officialSocialLinks } from './dashboard-data.js';

const getPiece=(element,number)=>elementPieces.find(p=>p.element===element&&p.number===Number(number));
const state=()=>store.get();
const universeRoute=u=>u.destination||`/universos/${u.slug}`;

function portalView(){return{
  noShell:true,title:'Portal de entrada',
  html:`<main id="app-main" class="portal-page portal-cinematic" style="--portal-image:url('${visual('062')}')"><div class="portal-shade"></div><section class="portal-intro"><div class="portal-brand"><img src="${visual('002')}" alt=""><span>SØD</span></div><p class="eyebrow">AGENTE DE CLARIDAD MENTAL</p><h1>Entrá.</h1><p>No necesitás entender todo este lugar ahora. Solo traer aquello que hoy necesita ser observado.</p><div class="actions"><button class="btn btn-primary" data-enter>Entrar</button><a class="btn btn-ghost" href="/identidad-local" data-link>Continuar en este dispositivo</a></div><p class="portal-manifesto">SØD no se define por lo que sabe. Se define por cómo piensa.</p><p class="prototype-trust-note">Prototipo oficial de SØD Ecosystem · No solicita contraseñas, tarjetas ni credenciales.</p></section></main>`,
  mount(){document.querySelector('[data-enter]').onclick=()=>{store.update(s=>{s.profile.mode='guest';s.onboarding.completed=false;return s});navigate('/onboarding')}}
}}

function localIdentityView(){const current=state().profile?.name||'Explorador Ø';return{
  title:'Identidad local',
  html:`<main id="app-main" class="section local-identity-page"><div class="container" style="max-width:680px"><div class="card local-identity-card"><div class="card-body"><p class="eyebrow">IDENTIDAD LOCAL · MVP</p><h1>Continuá en este dispositivo.</h1><p class="lead" style="font-size:20px">Esta versión no tiene cuentas ni autenticación online. Podés elegir un nombre visible; el recorrido queda guardado localmente en este navegador.</p><div class="safe-access-notice"><strong>Acceso seguro del prototipo</strong><span>No pedimos email, contraseña, teléfono, tarjeta ni credenciales de ningún servicio.</span></div><form class="form" id="local-identity-form"><div class="field"><label for="local-name">¿Cómo querés que SØD te nombre?</label><input id="local-name" name="name" maxlength="80" value="${escapeHtml(current)}" placeholder="Explorador Ø" autocomplete="off"></div><button class="btn btn-primary" type="submit">Continuar</button><a class="btn btn-ghost" href="/" data-link>Volver</a></form><div class="divider"></div><p class="muted">Podés borrar estos datos desde Configuración. <a style="color:var(--cyan)" href="/privacidad" data-link>Ver privacidad y memoria</a>.</p><p class="prototype-host-note">Prototipo oficial de SØD Ecosystem · Alojamiento técnico de prueba en Vercel.</p></div></div></div></main>`,
  mount(){document.querySelector('#local-identity-form').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const name=String(fd.get('name')||'Explorador Ø').trim().slice(0,80)||'Explorador Ø';store.update(s=>{s.profile={...s.profile,name,email:'',mode:'local-device'};return s});toast('Identidad local actualizada');navigate(state().onboarding.completed?'/hub':'/onboarding')}}
}}

function onboardingView(){const current=state().onboarding;return{
  noShell:true,title:'Calibración inicial',
  html:`<main id="app-main" class="onboarding onboarding-visual" style="--onboarding-image:url('${visual('063')}')"><div class="onboarding-atmosphere"></div><section class="onboarding-shell"><div class="stepper"><span class="active"></span><span></span><span></span><span></span></div><div class="card onboarding-card"><div class="card-body" id="onboarding-content"></div></div></section></main>`,
  mount(){let step=0;const draft={...current};const root=document.querySelector('#onboarding-content');const shell=document.querySelector('.onboarding');const backgrounds=['063','063','064','064'];const steps=[
    ()=>`<p class="eyebrow">01 · RECONOCIMIENTO</p><h1>¿Qué necesitás hoy?</h1><p class="lead">No estás eligiendo una función. Estás nombrando la necesidad desde la que entrás.</p><div class="option-grid">${[['claridad','Comprender algo que hoy está confuso'],['cultivar','Sostener un cambio en el tiempo'],['direccion','Recordar hacia dónde quiero ir'],['observar','Reconocer en quién me estoy convirtiendo']].map(([v,t])=>`<label class="option ${draft.intention===v?'selected':''}"><input type="radio" name="intention" value="${v}" ${draft.intention===v?'checked':''}><strong>${t}</strong></label>`).join('')}</div>`,
    ()=>`<p class="eyebrow">02 · PRESENCIA</p><h1>¿Querés entrar con sonido?</h1><p class="lead">El silencio también es parte de SØD. Nada comienza sin tu consentimiento.</p><div class="option-grid">${[['true','Activar ambiente','Una capa sonora sutil, sin voz.'],['false','Entrar en silencio','La experiencia permanece completa.']].map(([v,t,d])=>`<label class="option ${String(draft.audio)===v?'selected':''}"><input type="radio" name="audio" value="${v}" ${String(draft.audio)===v?'checked':''}><strong>${t}</strong><small>${d}</small></label>`).join('')}</div>`,
    ()=>`<p class="eyebrow">03 · MOVIMIENTO</p><h1>Calibrá la intensidad</h1><p class="lead">El mundo puede respirar sin quitarte control.</p><div class="option-grid">${[['true','Experiencia viva','Movimiento ambiental, partículas y transiciones.'],['false','Movimiento reducido','Composición estable y mínima animación.']].map(([v,t,d])=>`<label class="option ${String(draft.motion)===v?'selected':''}"><input type="radio" name="motion" value="${v}" ${String(draft.motion)===v?'checked':''}><strong>${t}</strong><small>${d}</small></label>`).join('')}</div>`,
    ()=>`<p class="eyebrow">04 · CALIBRACIÓN</p><h1>El núcleo te reconoce.</h1><p class="lead">Podrás cambiar audio, calidad, movimiento, privacidad y memoria en cualquier momento.</p><div class="option-grid">${[['auto','Automática','El sistema adapta la escena.'],['low','Esencial','Menor densidad visual.'],['high','Alta','Máxima presencia para equipos capaces.']].map(([v,t,d])=>`<label class="option ${draft.quality===v?'selected':''}"><input type="radio" name="quality" value="${v}" ${draft.quality===v?'checked':''}><strong>${t}</strong><small>${d}</small></label>`).join('')}</div>`
  ];
  const render=()=>{shell.style.setProperty('--onboarding-image',`url('${visual(backgrounds[step])}')`);root.innerHTML=`${steps[step]()}<div class="actions"><button class="btn" data-back ${step===0?'disabled':''}>Atrás</button><button class="btn btn-primary" data-next>${step===3?'Entrar al Hub':'Continuar'}</button></div>`;document.querySelectorAll('.stepper span').forEach((el,i)=>el.classList.toggle('active',i<=step));root.querySelectorAll('input').forEach(input=>input.onchange=()=>{if(input.name==='audio'||input.name==='motion')draft[input.name]=input.value==='true';else draft[input.name]=input.value;render()});root.querySelector('[data-back]').onclick=()=>{if(step>0){step--;render()}};root.querySelector('[data-next]').onclick=async()=>{if(step<3){step++;render();return}store.update(s=>{s.onboarding={...draft,completed:true};s.settings={...s.settings,audio:draft.audio,motion:draft.motion,quality:draft.quality};s.journey.startedAt=s.journey.startedAt||new Date().toISOString();return s});if(draft.audio)await ambient.start(state().settings.ambientVolume);navigate('/hub')}};render()}
}}




function hubView(){const s=state();const groups=[
  {id:'understand',label:'Necesito comprender',items:['sod','library']},
  {id:'cultivate',label:'Necesito cultivar',items:['seeds','habits']},
  {id:'direction',label:'Necesito dirección',items:['dreams']},
  {id:'observe',label:'Necesito observar',items:['observatory']}
];return{
  title:'Hub Central',immersive:true,
  html:`<main id="app-main" class="hub-page hub-v3">
    <canvas id="hub-canvas" class="hub-canvas" tabindex="0" aria-label="Hub panorámico SØD. Arrastrá para explorar, tocá los portales o seleccioná una necesidad humana."></canvas>
    <div class="hub-vignette"></div>
    <div class="hub-title"><span class="eyebrow">PRESENCIA SØD</span><strong>¿Qué necesitás hoy?</strong><small>Elegí una necesidad. El mundo te mostrará una puerta.</small></div>
    <div class="hub-minimal-status"><span class="dot"></span><span>Presencia activa</span></div>
    <button class="hub-oracle-button" data-insight aria-label="Abrir mensaje y huellas"><img src="${VISUALS.hubSodIcon}" alt=""><small>Mensaje</small></button>
    <aside class="hub-insight-drawer" id="hub-insight" aria-label="Mensaje de SØD y huellas del recorrido">
      <button class="icon-button drawer-close" data-insight-close aria-label="Cerrar panel">✕</button>
      <p class="eyebrow">SØD</p><p class="hub-insight-message" id="daily-message">${escapeHtml(dailyFallback.message)}</p>
      <button class="btn btn-primary" data-dialogue>Entrar en conversación</button>
      <div class="hub-drawer-divider"></div>
      <p class="eyebrow">HUELLAS</p>
      <div class="hub-signal-row"><span>${s.collection.seeds.length}</span><small>Semillas descubiertas</small></div>
      <div class="hub-signal-row"><span>${(s.codes||[]).length}</span><small>Códigos conservados</small></div>
      <div class="hub-signal-row"><span>${s.journey.completedDays.length}</span><small>tramos sostenidos</small></div>
      <a class="btn" href="/dashboard" data-link>Abrir Dashboard</a>
      <div class="hub-drawer-divider"></div>
      <p class="eyebrow">CLAVE DEL DÍA</p><strong class="mono" id="daily-key">${escapeHtml(dailyFallback.key)}</strong>
    </aside>
    <nav class="hub-need-dock" aria-label="Necesidades humanas">${groups.map((g,i)=>`<button data-need="${g.id}"><span>0${i+1}</span><strong>${g.label}</strong></button>`).join('')}</nav>
    <section class="hub-world-drawer" id="hub-world-drawer" aria-live="polite">
      <div class="hub-world-drawer-head"><div><p class="eyebrow">PUERTAS DISPONIBLES</p><h2 id="hub-drawer-title">Elegí una necesidad</h2></div><button class="icon-button" data-world-close aria-label="Cerrar puertas">✕</button></div>
      <div class="hub-world-grid" id="hub-world-grid"></div>
    </section>
    <div class="hub-controls-v3"><button class="icon-button glass-panel" data-recenter aria-label="Recentrar">⌖</button><button class="icon-button glass-panel" data-audio aria-label="Audio">${s.settings.audio?'◉':'○'}</button><button class="icon-button glass-panel" data-gyro aria-label="Giroscopio">◌</button><button class="icon-button glass-panel" data-fallback aria-label="Modo 2D">▦</button><button class="icon-button glass-panel" data-hub-help aria-label="Ayuda del Hub">?</button></div>
    <div class="spatial-prompt" id="spatial-prompt"></div>
    <div class="scene-mirror"><h2>Alternativa accesible del Hub</h2><ul>${universes.filter(u=>['sod','library','seeds','habits','observatory'].includes(u.slug)).map(u=>`<li><a href="${universeRoute(u)}" data-link>${u.title}: ${u.humanNeed}</a></li>`).join('')}</ul></div>
    ${conversationSurfaceMarkup({overlay:true})}
  </main>`,
  mount(){
    let scene;const canvas=document.querySelector('#hub-canvas');const prompt=document.querySelector('#spatial-prompt');const drawer=document.querySelector('#hub-world-drawer');const grid=document.querySelector('#hub-world-grid');const title=document.querySelector('#hub-drawer-title');const insight=document.querySelector('#hub-insight');const conversation=document.querySelector('[data-sod-conversation]');
    const openConversation=()=>{conversation.hidden=false;conversation.setAttribute('aria-hidden','false');requestAnimationFrame(()=>conversation.classList.add('open'));document.documentElement.classList.add('sod-conversation-open');scene?.pause();setTimeout(()=>conversation.querySelector('[data-chat-input]')?.focus(),720)};
    const closeConversation=()=>{conversation.classList.remove('open');conversation.setAttribute('aria-hidden','true');document.documentElement.classList.remove('sod-conversation-open');setTimeout(()=>{conversation.hidden=true;scene?.resume();canvas.focus()},760)};
    const chatCleanup=mountConversationSurface(conversation,{onClose:closeConversation});
    const openGroup=id=>{const group=groups.find(g=>g.id===id);if(!group)return;const items=group.items.map(slug=>universes.find(u=>u.slug===slug)).filter(Boolean);title.textContent=group.label;grid.innerHTML=items.map(u=>u.slug==='sod'?`<button type="button" data-open-sod class="hub-world-card" style="--world-color:${u.color};--world-image:url('${u.visual}')"><div class="hub-world-card-shade"></div><span class="hub-world-card-icon">${u.icon}</span><div><p class="eyebrow">${u.type}</p><h3>${u.title}</h3><p>${u.entryQuestion}</p></div></button>`:`<a href="${universeRoute(u)}" data-link class="hub-world-card" style="--world-color:${u.color};--world-image:url('${u.visual}')"><div class="hub-world-card-shade"></div><span class="hub-world-card-icon">${u.icon}</span><div><p class="eyebrow">${u.type}</p><h3>${u.title}</h3><p>${u.entryQuestion}</p></div></a>`).join('');bindRouteButtons(grid);grid.querySelector('[data-open-sod]')?.addEventListener('click',()=>{drawer.classList.remove('open');openConversation()});drawer.classList.add('open')};
    scene=new HubScene(canvas,{settings:s.settings,onSelect:u=>u.slug==='sod'?openConversation():navigate(universeRoute(u)),onOrb:openConversation,onHover:u=>{prompt.textContent=u?`${u.entryQuestion||u.title}`:'';prompt.classList.toggle('show',!!u)},onQuality:()=>{}});
    document.querySelectorAll('[data-need]').forEach(btn=>btn.onclick=()=>openGroup(btn.dataset.need));
    document.querySelector('[data-world-close]').onclick=()=>drawer.classList.remove('open');
    document.querySelector('[data-insight]').onclick=()=>insight.classList.toggle('open');
    document.querySelector('[data-insight-close]').onclick=()=>insight.classList.remove('open');
    document.querySelector('[data-dialogue]').onclick=()=>{insight.classList.remove('open');openConversation()};
    document.querySelector('[data-recenter]').onclick=()=>scene.recenter();
    document.querySelector('[data-fallback]').onclick=()=>navigate('/hub-2d');
    const openHubHelp=()=>{store.update(x=>{x.onboarding.hubHelpSeen=true;return x});openModal({title:'Tu primer recorrido por SØD',content:`<div class="hub-help-list final"><p><strong>1 · Empezá por SØD</strong><br><span class="muted">El núcleo central es el corazón del ecosistema. Traé una situación real y dejá que la primera experiencia sea una conversación.</span></p><p><strong>2 · Volvé cada día</strong><br><span class="muted">Hábitos convierte una intención en evidencia: Tracker, Rutina y Metas.</span></p><p><strong>3 · Alimentá tu criterio</strong><br><span class="muted">Biblioteca reúne Libros y Videos curados. Semillas transforma comprensiones en símbolos que podés incorporar.</span></p><p><strong>4 · Observá el recorrido</strong><br><span class="muted">Dashboard reúne señales, Mapa de Sueños y Comunidad sin convertir tu vida en una planilla.</span></p><button class="btn btn-primary" data-first-sod>Hablar con SØD ahora</button></div>`,onMount:(root,close)=>{root.querySelector('[data-first-sod]')?.addEventListener('click',()=>{close();openConversation()})}})};
    document.querySelector('[data-hub-help]').onclick=openHubHelp;
    if(state().onboarding.completed&&!state().onboarding.hubHelpSeen)setTimeout(openHubHelp,900);
    document.querySelector('[data-audio]').onclick=async e=>{const enabled=!state().settings.audio;store.update(x=>{x.settings.audio=enabled;return x});if(enabled)await ambient.start(state().settings.ambientVolume);else ambient.stop();e.currentTarget.textContent=enabled?'◉':'○'};
    document.querySelector('[data-gyro]').onclick=async e=>{try{const ok=await scene.enableGyro();if(ok){store.update(x=>{x.settings.gyro=true;return x});e.currentTarget.textContent='◉';toast('Giroscopio activado')}else toast('El permiso no fue concedido','error')}catch{toast('Giroscopio no disponible','error')}};
    api.getState().then(r=>{if(r.adminContent?.dailyMessage)document.querySelector('#daily-message').textContent=r.adminContent.dailyMessage;if(r.adminContent?.dailyKey)document.querySelector('#daily-key').textContent=r.adminContent.dailyKey}).catch(()=>{});
    const keyHandler=e=>{if(e.key==='Escape'&&!conversation.hidden)closeConversation()};window.addEventListener('keydown',keyHandler);return()=>{window.removeEventListener('keydown',keyHandler);document.documentElement.classList.remove('sod-conversation-open');chatCleanup?.();scene.destroy()};
  }
}}


function fallbackHubView(){return{title:'Hub accesible',html:`<main id="app-main" class="fallback-hub visual-page" style="--visual-bg:url('${VISUALS.hub}')"><div class="visual-page-shade"></div><div class="container visual-page-content">${pageHero('MODO 2D','El mismo universo.<br><span style="color:var(--cyan)">Sin perder claridad.</span>','Todas las experiencias permanecen disponibles sin Canvas, movimiento ni giroscopio.',`<a class="btn btn-primary" href="/hub" data-link>Volver al modo inmersivo</a>`)}<div class="visual-card-grid">${universes.filter(u=>['sod','library','seeds','habits','observatory'].includes(u.slug)).map(u=>`<a class="universe-visual-card" href="${universeRoute(u)}" data-link style="--card-image:url('${u.visual}')"><div class="universe-visual-shade"></div><div><span class="universe-icon">${u.icon}</span><p class="eyebrow">${u.type}</p><h3>${u.title}</h3><p>${u.entryQuestion}</p></div></a>`).join('')}</div></div></main>`}}

function universeView(slug){const u=universes.find(x=>x.slug===slug);if(!u)return notFoundView();const sod=u.slug==='sod';return{title:u.title,html:`<main id="app-main"><section class="universe-hero universe-visual-hero" style="--universe-glow:${u.color}55;--universe-image:url('${u.visual}')"><div class="universe-hero-shade"></div><div class="container"><p class="eyebrow">UNIVERSO · ${escapeHtml(u.title.toUpperCase())}</p><h1 class="page-title"><span style="color:${u.color}">${u.icon}</span> ${u.title}</h1><p class="universe-question">${u.entryQuestion}</p><p class="lead">${sod?'Traé lo que todavía no lográs ordenar. No necesitás formularlo perfectamente.':u.shortDescription}</p><div class="actions">${sod?'<a class="btn btn-primary" href="/experiencia" data-link>Comenzar conversación</a>':'<button class="btn btn-primary" data-start-practice>Entrar en la experiencia</button>'}<a class="btn btn-ghost" href="/hub" data-link>Volver al Hub</a></div></div></section><section class="cognitive-path-section"><div class="container"><div class="cognitive-path-intro"><p class="eyebrow">MÉTODO SØD</p><h2>${u.message}</h2><p>La experiencia busca una transición reconocible. No actividad vacía.</p></div><div class="cognitive-path">${u.practices.map((p,i)=>`<article class="cognitive-step" data-practice="${i}"><span class="cognitive-step-index">0${i+1}</span><div class="cognitive-step-line"></div><p class="eyebrow">${p.duration}</p><h3>${p.title}</h3><p>${p.instruction}</p><button class="btn btn-small">Explorar fase</button></article>`).join('')}</div></div></section></main>`,mount(){if(sod)return;const start=i=>openModal({title:u.practices[i].title,content:`<p class="eyebrow">${u.practices[i].duration}</p><h2>${u.practices[i].instruction}</h2><p class="muted">Esta es una práctica funcional con contenido placeholder. Registrá qué cambió entre el antes y el después.</p><form class="form" id="practice-form"><div class="field"><label for="practice-before">Antes</label><textarea id="practice-before" required placeholder="¿Cómo observabas esto antes?"></textarea></div><div class="field"><label for="practice-after">Después</label><textarea id="practice-after" required placeholder="¿Qué podés distinguir ahora?"></textarea></div><button class="btn btn-primary">Conservar integración</button></form>`,onMount:(root,close)=>{root.querySelector('form').onsubmit=e=>{e.preventDefault();toast('Integración registrada como placeholder funcional');close()}}});document.querySelector('[data-start-practice]')?.addEventListener('click',()=>start(0));document.querySelectorAll('[data-practice]').forEach(b=>b.onclick=()=>start(Number(b.dataset.practice)))}}}


function journeyView(){const s=state();const done=new Set(s.journey.completedDays);return{title:'Journey',html:`<main id="app-main">${pageHero('JOURNEY DE 14 DÍAS','La comprensión necesita<br><span style="color:var(--cyan)">ritmo, no presión.</span>','Un recorrido diario de observación, pregunta, práctica, registro e integración. Perder un día no borra el camino.')}<section class="section" style="padding-top:20px"><div class="container"><div class="card"><div class="card-body"><div style="display:flex;justify-content:space-between;gap:20px;align-items:end"><div><p class="eyebrow">PROGRESO</p><h2 style="font-size:40px;margin-bottom:8px">${done.size} de 14 integraciones</h2></div><span class="mono">${Math.round(done.size/14*100)}%</span></div><div class="progress"><span style="width:${done.size/14*100}%"></span></div></div></div><div class="journey-grid" style="margin-top:20px">${journeyDays.map(d=>`<article class="day-card ${done.has(d.day)?'completed':''} ${d.day===Math.min(done.size+1,14)?'current':''}" tabindex="0" data-day="${d.day}"><div class="day-number">DÍA ${String(d.day).padStart(2,'0')}</div><h3>${d.title}</h3><small class="muted">${d.practice}</small><div class="check">${done.has(d.day)?'✓':'·'}</div></article>`).join('')}</div></div></section></main>`,mount(){const openDay=day=>{const d=journeyDays[day-1];const completed=state().journey.completedDays.includes(day);openModal({title:`Día ${day} · ${d.title}`,content:`<p class="eyebrow">PREGUNTA</p><h2>${d.question}</h2><div class="divider"></div><p class="eyebrow">PRÁCTICA</p><p class="lead" style="font-size:20px">${d.practice}</p><form class="form" id="day-form"><div class="field"><label for="day-reflection">¿Qué observaste?</label><textarea id="day-reflection" placeholder="No busques escribir bien. Buscá registrar con precisión."></textarea></div><button class="btn btn-primary" type="submit">${completed?'Actualizar integración':'Completar día'}</button></form>`,onMount:(root,close)=>{root.querySelector('form').onsubmit=e=>{e.preventDefault();store.update(s=>{if(!s.journey.completedDays.includes(day))s.journey.completedDays.push(day);s.journey.completedDays.sort((a,b)=>a-b);return s});toast(`Día ${day} integrado`);close();navigate('/journey',{replace:true});window.dispatchEvent(new PopStateEvent('popstate'))}}})};document.querySelectorAll('[data-day]').forEach(card=>{card.onclick=()=>openDay(Number(card.dataset.day));card.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')openDay(Number(card.dataset.day))}})}}}

function bitacoraView(){return{title:'Bitácora',html:`<main id="app-main">${pageHero('BITÁCORA','Registrar convierte experiencia<br><span style="color:var(--cyan)">en información disponible.</span>','Creá, editá y eliminá registros. En esta versión quedan guardados localmente en este dispositivo.')}<section class="section" style="padding-top:10px"><div class="container grid grid-2"><div class="card"><div class="card-body"><h2>Nueva reflexión</h2><form class="form" id="reflection-form"><div class="field"><label for="reflection-title">Título</label><input id="reflection-title" name="title" maxlength="120" placeholder="Qué querés recordar"></div><div class="field"><label for="reflection-text">Registro</label><textarea id="reflection-text" name="text" required placeholder="Hecho, interpretación, emoción, decisión..."></textarea></div><button class="btn btn-primary" type="submit">Guardar registro</button></form></div></div><div><div class="toolbar"><input class="search-input" id="reflection-search" placeholder="Buscar en la bitácora"><span class="pill" id="reflection-count">0 registros</span></div><div id="reflection-list"><div class="skeleton" style="height:180px"></div></div></div></div></section></main>`,mount(){let items=[];const list=document.querySelector('#reflection-list');const render=(query='')=>{const filtered=items.filter(x=>(x.title+' '+x.text).toLowerCase().includes(query.toLowerCase()));document.querySelector('#reflection-count').textContent=`${items.length} registros`;list.innerHTML=filtered.length?filtered.map(x=>`<article class="card reflection"><time>${formatDate(x.updatedAt)}</time><h3>${escapeHtml(x.title)}</h3><p class="muted">${escapeHtml(x.text)}</p><div class="reflection-actions"><button class="btn btn-small" data-edit="${x.id}">Editar</button><button class="btn btn-small btn-danger" data-delete="${x.id}">Eliminar</button></div></article>`).join('<div style="height:10px"></div>'):'<div class="empty">Todavía no hay registros. La bitácora empieza cuando una observación se vuelve explícita.</div>';list.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>confirmAction('¿Eliminar este registro de forma permanente?',async()=>{await api.deleteReflection(b.dataset.delete);items=items.filter(x=>x.id!==b.dataset.delete);render(document.querySelector('#reflection-search').value);toast('Registro eliminado')}));list.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const item=items.find(x=>x.id===b.dataset.edit);openModal({title:'Editar reflexión',content:`<form class="form" id="edit-reflection"><div class="field"><label>Título<input name="title" value="${escapeHtml(item.title)}"></label></div><div class="field"><label>Registro<textarea name="text">${escapeHtml(item.text)}</textarea></label></div><button class="btn btn-primary">Guardar cambios</button></form>`,onMount:(root,close)=>{root.querySelector('form').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const r=await api.updateReflection(item.id,{title:fd.get('title'),text:fd.get('text')});items=items.map(x=>x.id===item.id?r.item:x);render(document.querySelector('#reflection-search').value);close();toast('Registro actualizado')}}})})};api.getReflections().then(r=>{items=r.items;render()}).catch(err=>{list.innerHTML=`<div class="empty">${escapeHtml(err.message)}. Verificá que el servidor esté activo.</div>`});document.querySelector('#reflection-search').oninput=e=>render(e.target.value);document.querySelector('#reflection-form').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);try{const r=await api.createReflection({title:fd.get('title'),text:fd.get('text')});items.unshift(r.item);e.currentTarget.reset();render();toast('Reflexión guardada')}catch(err){toast(err.message,'error')}}}}}

const libraryExactAuthors=[
  {name:'Napoleon Hill',search:'Napoleon Hill',image:'/assets/library/authors/author-01.jpg'},
  {name:'Robin Sharma',search:'Robin Sharma',image:'/assets/library/authors/author-02.jpg'},
  {name:'Eckhart Tolle',search:'Eckhart Tolle',image:'/assets/library/authors/author-03.jpg'},
  {name:'Joe Dispenza',search:'Joe Dispenza',image:'/assets/library/authors/author-04.jpg'},
  {name:'Dale Carnegie',search:'Dale Carnegie',image:'/assets/library/authors/author-05.jpg'},
  {name:'Daniel Goleman',search:'Daniel Goleman',image:'/assets/library/authors/author-06.jpg'},
  {name:'Tony Robbins',search:'Tony Robbins',image:'/assets/library/authors/author-07.jpg'},
  {name:'Deepak Chopra',search:'Deepak Chopra',image:'/assets/library/authors/author-08.jpg'},
  {name:'Dr. Miguel Ruiz',search:'Don Miguel Ruiz',image:'/assets/library/authors/author-09.jpg'}
];

const libraryExactTopics=[
  {key:'mentalidad',title:'Mentalidad',copy:'Cambia tu forma\nde pensar',filters:['Mentalidad','Conciencia','Desarrollo personal','Creencias','Cerebro'],image:'/assets/library/topics/topic-01.jpg'},
  {key:'liderazgo',title:'Liderazgo',copy:'Inspira, guía\ny transforma',filters:['Liderazgo','Comunicación','Influencia','Relaciones','Oratoria'],image:'/assets/library/topics/topic-02.jpg'},
  {key:'abundancia',title:'Abundancia',copy:'Crea riqueza\ny libertad',filters:['Riqueza','Dinero','Finanzas','Abundancia','Activos'],image:'/assets/library/topics/topic-03.jpg'},
  {key:'espiritualidad',title:'Espiritualidad',copy:'Conecta con tu\nesencia',filters:['Espiritualidad','Metafísica','Sabiduría','Conciencia','Hermetismo'],image:'/assets/library/topics/topic-04.jpg'},
  {key:'habitos',title:'Hábitos',copy:'Pequeñas acciones,\ngrandes cambios',filters:['Hábitos','Disciplina','Foco','Atención','Rutina'],image:'/assets/library/topics/topic-05.jpg'},
  {key:'proposito',title:'Propósito',copy:'Vive alineado a tu\nverdadero llamado',filters:['Propósito','Sentido','Vida','Legado','Transformación'],image:'/assets/library/topics/topic-06.jpg'}
];

const libraryExactProgress={
  'book-01':67,'book-04':23,'book-05':81,'book-16':45,'book-03':72,'book-10':63,'book-02':38,'book-08':38,'book-15':68,
  'book-06':54,'book-07':46,'book-09':58,'book-11':61,'book-12':52,'book-13':49,'book-14':43,'book-17':57,'book-18':51
};

function libraryView(){
  const videoCategories=[
    {key:'all',label:'Todos',tokens:[]},
    {key:'conciencia',label:'Conciencia',tokens:['conciencia','despertar','no dualidad','metafísica']},
    {key:'filosofia',label:'Filosofía',tokens:['filosofía','estoicismo','psicología profunda','jung']},
    {key:'desarrollo',label:'Psicología & Desarrollo',tokens:['psicología','desarrollo personal','liderazgo','decisiones','motivación']},
    {key:'ciencia',label:'Neurociencia',tokens:['neurociencia','atención','foco']},
    {key:'negocios',label:'Negocios & Ventas',tokens:['negocios','ventas','negociación','marketing']},
    {key:'espiritualidad',label:'Espiritualidad',tokens:['espiritualidad','presencia','no dualidad']},
    {key:'bienestar',label:'Salud & Bienestar',tokens:['neurociencia','psicología','atención','hábitos']},
    {key:'sociedad',label:'Historia & Sociedad',tokens:['filosofía','educación','historia','sociedad']}
  ];
  const primaryVideoIds=['video-01','video-04','video-16','video-17','video-03','video-06','video-19','video-21'];
  const secondaryVideoIds=['video-07','video-12','video-05','video-11','video-13','video-15','video-02','video-20'];
  const featuredChannelNames=['Sadhguru','Huberman Lab','Tony Robbins','Mel Robbins','Alan Watts','Eckhart Tolle','Rupert Spira','Daily Stoic','Academy of Ideas','HealthyGamerGG','Alex Hormozi','Chris Voss'];
  return{
    title:'Biblioteca SØD',
    html:`<main id="app-main" class="library-exact-world" style="--library-bg:url('${VISUALS.library}')"><div class="library-exact-overlay"></div><div class="library-exact-content"><section class="library-exact-toolbar" aria-label="Herramientas de Biblioteca"><label class="library-exact-search"><span>⌕</span><input id="library-search" type="search" placeholder="Buscar título, autor, categoría o idea" autocomplete="off"><kbd>⌘K</kbd></label><div class="library-exact-modebar"><button class="library-exact-mode active" data-library-mode="books"><span>▤</span><strong>Libros</strong></button><button class="library-exact-mode" data-library-mode="videos"><span>▶</span><strong>Videos</strong></button><a class="library-exact-mode" href="/hub" data-link><span>⊙</span><strong>Hub</strong></a></div></section><section id="library-books-view" class="library-exact-books"><section class="library-exact-section library-exact-recommended"><div class="library-exact-section-head"><h2>Más recomendados <span>›</span></h2></div><div class="library-exact-row-wrap"><button class="library-exact-arrow library-exact-arrow-prev" data-scroll-target="library-recommended-row" data-scroll-direction="-1" aria-label="Ver libros anteriores">‹</button><div class="library-exact-book-row" id="library-recommended-row"></div><button class="library-exact-arrow" data-scroll-target="library-recommended-row" data-scroll-direction="1" aria-label="Ver más libros">›</button></div></section><section class="library-exact-section library-exact-authors"><div class="library-exact-section-head"><h2>Autores esenciales <span>›</span></h2></div><div class="library-exact-row-wrap"><button class="library-exact-arrow library-exact-arrow-prev" data-scroll-target="library-author-row" data-scroll-direction="-1" aria-label="Ver autores anteriores">‹</button><div class="library-exact-author-row" id="library-author-row">${libraryExactAuthors.map(libraryExactAuthorCard).join('')}</div><button class="library-exact-arrow" data-scroll-target="library-author-row" data-scroll-direction="1" aria-label="Ver más autores">›</button></div></section><section class="library-exact-section library-exact-topics"><div class="library-exact-section-head"><h2>Explorar por tema <span>›</span></h2></div><div class="library-exact-row-wrap"><button class="library-exact-arrow library-exact-arrow-prev" data-scroll-target="library-topic-row" data-scroll-direction="-1" aria-label="Ver temas anteriores">‹</button><div class="library-exact-topic-row" id="library-topic-row">${libraryExactTopics.map(libraryExactTopicCard).join('')}</div><button class="library-exact-arrow" data-scroll-target="library-topic-row" data-scroll-direction="1" aria-label="Ver más temas">›</button></div></section></section><section id="library-videos-view" class="videoteca-final" hidden></section></div></main>`,
    mount(){
      const world=document.querySelector('.library-exact-world');
      const search=document.querySelector('#library-search');
      const booksView=document.querySelector('#library-books-view');
      const videosView=document.querySelector('#library-videos-view');
      const recommendedRow=document.querySelector('#library-recommended-row');
      const modeButtons=[...document.querySelectorAll('[data-library-mode]')];
      const topicButtons=[...document.querySelectorAll('[data-library-topic]')];
      let mode='books';
      let topicKey='';
      let videoCategory='all';

      const query=()=>String(search.value||'').trim().toLowerCase();
      const matchesBook=book=>{
        const q=query();
        const haystack=[book.title,book.author,book.category,book.shortDescription,book.longDescription,...(book.tags||[])].join(' ').toLowerCase();
        const topic=libraryExactTopics.find(item=>item.key===topicKey);
        const topicMatch=!topic||topic.filters.some(token=>haystack.includes(token.toLowerCase()));
        return topicMatch&&(!q||haystack.includes(q));
      };
      const matchesVideo=video=>{
        const q=query();
        const haystack=[video.title,video.creator,video.description,video.section,video.category].join(' ').toLowerCase();
        const category=videoCategories.find(item=>item.key===videoCategory);
        const categoryMatch=!category||!category.tokens.length||category.tokens.some(token=>haystack.includes(token.toLowerCase()));
        return categoryMatch&&(!q||haystack.includes(q))&&Boolean(youtubeEmbedUrl(video.youtubeUrl));
      };

      const renderBooks=()=>{
        const books=libraryRecommended.filter(matchesBook);
        recommendedRow.innerHTML=books.length?books.map(libraryExactBookCard).join(''):libraryExactInlineEmpty('No encontramos libros para esta búsqueda.');
        bindLibraryBookShelf();
      };

      const renderVideos=()=>{
        const primary=primaryVideoIds.map(id=>libraryVideos.find(video=>video.id===id)).filter(Boolean).filter(matchesVideo);
        const secondary=secondaryVideoIds.map(id=>libraryVideos.find(video=>video.id===id)).filter(Boolean).filter(matchesVideo);
        const q=query();
        const category=videoCategories.find(item=>item.key===videoCategory);
        const channelMatches=channel=>{
          const haystack=[channel.name,channel.area,channel.description].join(' ').toLowerCase();
          const qMatch=!q||haystack.includes(q);
          const cMatch=!category||!category.tokens.length||category.tokens.some(token=>haystack.includes(token.toLowerCase()));
          return qMatch&&cMatch;
        };
        const channels=featuredChannelNames.map(name=>libraryVideoChannels.find(channel=>channel.name===name)).filter(Boolean).filter(channelMatches);
        videosView.innerHTML=`<div class="videoteca-final-shell"><nav class="videoteca-final-filters" aria-label="Categorías de Videoteca">${videoCategories.map(item=>`<button class="videoteca-final-filter ${item.key===videoCategory?'active':''}" data-video-category="${item.key}">${item.label}</button>`).join('')}<button class="videoteca-final-filter videoteca-final-more" data-more-filters>☰ <span>Más filtros</span></button></nav>${videotecaFinalShelf('Videos curados para ti',primary,'videoteca-final-primary','Curaduría breve para entrar por una idea fuerte.','✥')}${videotecaFinalShelf('Profundiza más',secondary,'videoteca-final-secondary','Charlas y análisis para expandir tu comprensión.','◉')}${videotecaFinalChannels(channels,'videoteca-final-channels')}<footer class="videoteca-final-footer"><span>✥</span><p>El conocimiento correcto, en el momento correcto, lo cambia todo.</p></footer></div>`;
        bindVideotecaFinalPlayers(videosView);
        bindLibraryCarouselArrows(videosView);
        videosView.querySelectorAll('[data-video-category]').forEach(button=>button.onclick=()=>{videoCategory=button.dataset.videoCategory;renderVideos()});
        videosView.querySelector('[data-more-filters]')?.addEventListener('click',()=>openModal({title:'Más filtros',content:`<div class="videoteca-more-filter-grid">${['Estoicismo','Metafísica','Liderazgo','Ventas','Entrevistas','Psicología profunda'].map(label=>`<button class="pill" data-video-extra-filter="${escapeHtml(label)}">${label}</button>`).join('')}</div><p class="muted" style="margin-top:14px">Elegí un tema para buscarlo dentro de la curaduría actual.</p>`,onMount:(root,close)=>{root.querySelectorAll('[data-video-extra-filter]').forEach(button=>button.onclick=()=>{videoCategory='all';search.value=button.dataset.videoExtraFilter;close();renderVideos()})}}));
        videosView.querySelectorAll('[data-video-show-all]').forEach(button=>button.onclick=()=>{videoCategory='all';search.value='';renderVideos()});
      };

      const render=()=>{
        const isBooks=mode==='books',isVideos=mode==='videos';
        booksView.hidden=!isBooks;videosView.hidden=!isVideos;
        booksView.style.display=isBooks?'':'none';videosView.style.display=isVideos?'block':'none';
        world.classList.toggle('is-video-mode',isVideos);
        modeButtons.forEach(button=>button.classList.toggle('active',button.dataset.libraryMode===mode));
        topicButtons.forEach(button=>button.classList.toggle('active',button.dataset.libraryTopic===topicKey));
        if(isBooks)renderBooks();else renderVideos();
      };

      modeButtons.forEach(button=>button.onclick=()=>{mode=button.dataset.libraryMode;topicKey='';videoCategory='all';search.value='';render()});
      search.addEventListener('input',()=>mode==='books'?renderBooks():renderVideos());
      search.addEventListener('keydown',event=>{if(event.key==='Escape'){search.value='';mode==='books'?renderBooks():renderVideos()}});
      document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();search.focus()}});
      bindLibraryCarouselArrows(document);
      document.querySelectorAll('[data-library-author]').forEach(button=>button.onclick=()=>{const author=button.dataset.libraryAuthor;const hasBooks=libraryBooks.some(book=>book.author.toLowerCase().includes(author.toLowerCase()));if(!hasBooks){toast(`${button.dataset.displayName||author}: títulos próximamente.`);return}topicKey='';search.value=author;mode='books';render()});
      document.querySelectorAll('[data-library-topic]').forEach(button=>button.onclick=()=>{const next=button.dataset.libraryTopic;topicKey=topicKey===next?'':next;search.value='';mode='books';render()});
      render();
    }
  };
}

function videotecaFinalShelf(title,videos,id,copy,icon='✥'){
  if(!videos.length)return `<section class="videoteca-final-panel"><header class="videoteca-final-section-head"><div class="videoteca-final-title"><span>${icon}</span><div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(copy)}</p></div></div></header><div class="library-exact-inline-empty"><span>Ø</span><p>No hay videos para este filtro.</p></div></section>`;
  return `<section class="videoteca-final-panel"><header class="videoteca-final-section-head"><div class="videoteca-final-title"><span>${icon}</span><div><h2>${escapeHtml(title)}</h2>${title==='Profundiza más'?`<p>${escapeHtml(copy)}</p>`:''}</div></div><div class="videoteca-final-section-tools"><button class="videoteca-final-view-all" data-video-show-all>Ver todos</button><button class="videoteca-final-arrow videoteca-final-arrow-prev" data-scroll-target="${id}" data-scroll-direction="-1" aria-label="Videos anteriores">‹</button><button class="videoteca-final-arrow" data-scroll-target="${id}" data-scroll-direction="1" aria-label="Más videos">›</button></div></header><div class="videoteca-final-row" id="${id}">${videos.map(videotecaFinalCard).join('')}</div></section>`;
}

function videotecaFinalCard(video){
  const thumb=youtubeThumbnail(video.youtubeUrl,'hqdefault');
  const videoId=videoYoutubeId(video.youtubeUrl);
  const initials=video.creator.split(/[\s·-]+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  return `<article class="videoteca-final-card" data-video-id="${video.id}"><div class="videoteca-final-player" data-inline-player="${video.id}"><button class="videoteca-final-poster" data-inline-play="${video.id}" aria-label="Reproducir ${escapeHtml(video.title)}">${thumb?`<img data-video-thumb-img data-video-id="${videoId}" data-thumb-stage="0" src="${thumb}" alt="Miniatura de ${escapeHtml(video.title)}" loading="lazy">`:''}<div class="videoteca-final-thumb-fallback" data-video-thumb-fallback ${thumb?'hidden':''}><span>${escapeHtml(initials||'Ø')}</span><small>${escapeHtml(video.creator)}</small></div><span class="videoteca-final-check">✓</span><span class="videoteca-final-duration">${escapeHtml(video.duration)}</span><span class="videoteca-final-youtube">▰ YouTube</span></button></div><div class="videoteca-final-card-copy"><div class="videoteca-final-card-title-row"><h3>${escapeHtml(video.title)}</h3><a href="${escapeHtml(video.channelUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir canal de ${escapeHtml(video.creator)}">⋮</a></div><p class="videoteca-final-creator">${escapeHtml(video.creator)}</p><p class="videoteca-final-description">${escapeHtml(video.description)}</p><span class="videoteca-final-tag">${escapeHtml(video.category)}</span></div></article>`;
}

function videotecaFinalChannels(channels,id){
  if(!channels.length)return '';
  return `<section class="videoteca-final-panel videoteca-final-channels-panel"><header class="videoteca-final-section-head"><div class="videoteca-final-title"><span>☆</span><div><h2>Canales esenciales</h2><p>Fuentes de conocimiento que inspiran y transforman.</p></div></div><div class="videoteca-final-section-tools"><button class="videoteca-final-view-all" data-video-show-all>Ver todos</button><button class="videoteca-final-arrow videoteca-final-arrow-prev" data-scroll-target="${id}" data-scroll-direction="-1" aria-label="Canales anteriores">‹</button><button class="videoteca-final-arrow" data-scroll-target="${id}" data-scroll-direction="1" aria-label="Más canales">›</button></div></header><div class="videoteca-final-channel-row" id="${id}">${channels.map(videotecaFinalChannelCard).join('')}</div></section>`;
}

function videotecaFinalChannelCard(channel){
  const video=libraryVideos.find(item=>item.creator.toLowerCase().includes(channel.name.toLowerCase())||channel.name.toLowerCase().includes(item.creator.split('·')[0].trim().toLowerCase()));
  const avatar=video?youtubeThumbnail(video.youtubeUrl,'mqdefault'):'';
  const initials=channel.name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  return `<a class="videoteca-final-channel" href="${escapeHtml(channel.url)}" target="_blank" rel="noopener noreferrer"><span class="videoteca-final-channel-avatar">${avatar?`<img src="${avatar}" alt="" loading="lazy">`:`<b>${escapeHtml(initials||'Ø')}</b>`}</span><span class="videoteca-final-channel-copy"><strong>${escapeHtml(channel.name)}</strong><small>${escapeHtml(channel.area)}</small></span><span class="videoteca-final-follow">＋ Seguir</span></a>`;
}

function videoYoutubeId(url=''){
  try{const parsed=new URL(url);if(parsed.hostname.includes('youtu.be'))return parsed.pathname.replace('/','').split('/')[0];if(parsed.hostname.includes('youtube.com'))return parsed.searchParams.get('v')||''}catch{}return '';
}

function bindVideotecaFinalPlayers(root){
  root.querySelectorAll('[data-video-thumb-img]').forEach(img=>img.addEventListener('error',()=>{
    const id=img.dataset.videoId;const stage=Number(img.dataset.thumbStage||0);
    if(id&&stage===0){img.dataset.thumbStage='1';img.src=`https://img.youtube.com/vi/${id}/mqdefault.jpg`;return}
    if(id&&stage===1){img.dataset.thumbStage='2';img.src=`https://img.youtube.com/vi/${id}/0.jpg`;return}
    img.hidden=true;img.parentElement?.querySelector('[data-video-thumb-fallback]')?.removeAttribute('hidden');
  }));
  root.querySelectorAll('[data-inline-play]').forEach(button=>button.onclick=()=>{
    const id=button.dataset.inlinePlay;const video=libraryVideos.find(item=>item.id===id);const shell=root.querySelector(`[data-inline-player="${id}"]`);if(!video||!shell)return;const embed=youtubeEmbedUrl(video.youtubeUrl);if(!embed){window.open(video.youtubeUrl||video.channelUrl,'_blank','noopener,noreferrer');return}shell.innerHTML=`<iframe src="${embed}?autoplay=1&rel=0&modestbranding=1" title="${escapeHtml(video.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  });
}

function libraryExactBookCard(book){
  const progress=libraryExactProgress[book.id]??Math.max(28,86-(Number(book.priority||50)%12)*4);
  return `<article class="library-exact-book ${book.placeholder?'is-placeholder':''}" data-book-id="${book.id}" tabindex="0" aria-label="${escapeHtml(book.title)}"><div class="library-exact-book-cover">${libraryExactCoverMarkup(book)}</div><div class="library-exact-book-info"><h3>${escapeHtml(book.title)}</h3><p>${escapeHtml(book.author)}</p><div class="library-exact-progress" aria-label="Relevancia SØD ${progress}%"><span>${progress}%</span><i><b style="width:${progress}%"></b></i></div></div></article>`;
}

function libraryExactCoverMarkup(book){
  if(book.cover)return `<img src="${book.cover}" alt="${escapeHtml(book.title)}" loading="lazy" referrerpolicy="no-referrer">`;
  const hue=(Number(book.priority||20)*37)%360;
  return `<div class="library-exact-placeholder-cover" style="--placeholder-hue:${hue}"><span>SØD LIBRARY</span><strong>${escapeHtml(book.title)}</strong><small>${escapeHtml(book.author)}</small><em>PORTADA<br>PRÓXIMAMENTE</em></div>`;
}

function libraryExactAuthorCard(author){
  return `<button class="library-exact-author" data-library-author="${escapeHtml(author.search)}" data-display-name="${escapeHtml(author.name)}"><span class="library-exact-author-image"><img src="${author.image}" alt="" loading="lazy"></span><strong>${escapeHtml(author.name)}</strong></button>`;
}

function libraryExactTopicCard(topic){
  return `<button class="library-exact-topic" data-library-topic="${escapeHtml(topic.key)}"><span class="library-exact-topic-icon"><img src="${topic.image}" alt="" loading="lazy"></span><span><strong>${escapeHtml(topic.title)}</strong><small>${escapeHtml(topic.copy).replace(/\n/g,'<br>')}</small></span></button>`;
}

function libraryExactInlineEmpty(message){
  return `<div class="library-exact-inline-empty"><span>Ø</span><p>${escapeHtml(message)}</p></div>`;
}

function bindLibraryBookShelf(){
  document.querySelectorAll('[data-book-id]').forEach(bookEl=>{
    const open=()=>{const book=getLibraryBook(bookEl.dataset.bookId);if(book)openBookDetails(book)};
    bookEl.onclick=e=>{if(e.target.closest('button,a'))return;open()};
    bookEl.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};
  });
}

function openBookDetails(book){
  const available=[book.pdfUrl&&'PDF',book.audioUrl&&'Audiolibro',book.summaryUrl&&'Resumen'].filter(Boolean);
  openModal({title:book.title,className:'library-v5-modal',content:`<div class="library-v5-detail"><div class="library-v5-detail-cover">${libraryExactCoverMarkup(book)}</div><div class="library-v5-detail-copy"><p class="eyebrow">${escapeHtml(book.category)} · ${escapeHtml(book.tags.join(' · '))}</p><h2>${escapeHtml(book.title)}</h2><p class="library-v5-detail-author">${escapeHtml(book.author)}</p><p>${escapeHtml(book.longDescription)}</p><div class="library-v5-metadata"><span>${escapeHtml(book.year)}</span><span>${escapeHtml(book.language)}</span><span>${available.length?`${available.length} formatos conectados`:'Enlaces en curaduría'}</span></div><div class="library-v5-detail-actions"><button class="btn btn-primary" data-library-pdf="${book.id}">Leer PDF</button><button class="btn" data-library-summary="${book.id}">Ver resumen</button><button class="btn" data-library-audio="${book.id}">Escuchar</button></div>${book.pdfFileName?`<p class="library-v5-source-note">Archivo PDF identificado: <strong>${escapeHtml(book.pdfFileName)}</strong>. Falta asignar su URL pública o subir el archivo al proyecto.</p>`:''}</div></div>`,onMount:root=>bindBookMediaActions(root,book)});
}

function bindBookMediaActions(root,book){
  root.querySelector('[data-library-pdf]')?.addEventListener('click',()=>openPdfChoice(book));
  root.querySelector('[data-library-summary]')?.addEventListener('click',()=>openYouTubeMedia(book,'summary'));
  root.querySelector('[data-library-audio]')?.addEventListener('click',()=>openYouTubeMedia(book,'audio'));
}

function openPdfChoice(book){
  if(!book.pdfUrl){toast(`El PDF de “${book.title}” todavía no tiene URL asignada.`,'error');return}
  openModal({title:`Leer · ${book.title}`,className:'library-v5-media-modal',content:`<div class="library-v5-choice"><p class="lead" style="font-size:19px">¿Cómo querés abrir este libro?</p><div class="library-v5-choice-grid"><button class="library-v5-choice-card" data-pdf-read><span>▤</span><strong>Leer acá</strong><small>Abrir el PDF dentro del visor de SØD.</small></button><a class="library-v5-choice-card" href="${escapeHtml(book.pdfUrl)}" download target="_blank" rel="noopener noreferrer"><span>⇩</span><strong>Descargar PDF</strong><small>Guardar una copia desde el enlace curado.</small></a></div></div>`,onMount:(root,close)=>{root.querySelector('[data-pdf-read]').onclick=()=>{close();openPdfViewer(book)}}});
}

function openPdfViewer(book){
  openModal({title:book.title,className:'library-v5-reader-modal',content:`<div class="library-v5-reader"><iframe src="${escapeHtml(book.pdfUrl)}" title="PDF · ${escapeHtml(book.title)}" loading="eager"></iframe><div class="library-v5-reader-fallback"><a class="btn" href="${escapeHtml(book.pdfUrl)}" target="_blank" rel="noopener noreferrer">Abrir PDF en una pestaña nueva</a></div></div>`});
}

function openYouTubeMedia(book,type){
  const url=type==='audio'?book.audioUrl:book.summaryUrl;
  const label=type==='audio'?'audiolibro':'resumen';
  if(!url){toast(`El ${label} de “${book.title}” todavía no tiene link de YouTube asignado.`,'error');return}
  const embed=youtubeEmbedUrl(url);
  if(!embed){window.open(url,'_blank','noopener,noreferrer');return}
  openModal({title:`${type==='audio'?'Escuchar':'Resumen'} · ${book.title}`,className:'library-v5-youtube-modal',content:`<div class="library-v5-youtube"><iframe src="${embed}" title="${escapeHtml(label)} · ${escapeHtml(book.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`});
}

function libraryVideoShelf(title,videos){
  if(!videos.length)return '';
  const id=`video-shelf-${title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`;
  return `<section class="library-video-sod-section"><div class="library-video-sod-head"><div><p class="eyebrow">CURADURÍA SØD</p><h2>${escapeHtml(title)}</h2></div><span class="pill">${videos.length} videos</span></div><div class="library-video-sod-row-wrap"><button class="library-video-sod-arrow library-video-sod-arrow-prev" data-scroll-target="${id}" data-scroll-direction="-1" aria-label="Videos anteriores">‹</button><div class="library-video-sod-row" id="${id}">${videos.map(libraryVideoV5Card).join('')}</div><button class="library-video-sod-arrow" data-scroll-target="${id}" data-scroll-direction="1" aria-label="Más videos">›</button></div></section>`;
}

function libraryVideoV5Card(video){
  const thumb=youtubeThumbnail(video.youtubeUrl,'hqdefault');
  const initials=video.creator.split(/[\s·-]+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  return `<article class="library-video-sod-card" data-video-id="${video.id}"><button class="library-video-sod-thumb" data-video-open="${video.id}" aria-label="Reproducir ${escapeHtml(video.title)}">${thumb?`<img src="${thumb}" alt="" loading="lazy" referrerpolicy="no-referrer">`:`<div class="library-video-sod-placeholder"><span>${escapeHtml(initials||'Ø')}</span><small>${escapeHtml(video.creator)}</small></div>`}<div class="library-video-sod-shade"></div><span class="library-video-sod-play">▶</span><span class="library-video-sod-duration">${escapeHtml(video.duration)}</span></button><div class="library-video-sod-copy"><p class="eyebrow">${escapeHtml(video.category)} · ${escapeHtml(video.creator)}</p><h3>${escapeHtml(video.title)}</h3><p>${escapeHtml(video.description)}</p><div class="library-video-sod-actions"><button class="btn btn-small" data-video-open="${video.id}">${youtubeEmbedUrl(video.youtubeUrl)?'Reproducir':'Abrir fuente'}</button><a class="library-video-channel-link" href="${escapeHtml(video.channelUrl||video.youtubeUrl)}" target="_blank" rel="noopener noreferrer">Canal ↗</a></div></div></article>`;
}

function libraryChannelShelf(channels){
  if(!channels.length)return '';
  const id='video-channel-shelf';
  return `<section class="library-video-sod-section library-video-channel-section"><div class="library-video-sod-head"><div><p class="eyebrow">FUENTES</p><h2>Canales esenciales</h2><p>Los exponentes y canales que alimentan la curaduría de la Videoteca SØD.</p></div><span class="pill">${channels.length} canales</span></div><div class="library-video-sod-row-wrap"><button class="library-video-sod-arrow library-video-sod-arrow-prev" data-scroll-target="${id}" data-scroll-direction="-1" aria-label="Canales anteriores">‹</button><div class="library-video-channel-row" id="${id}">${channels.map(libraryVideoChannelCard).join('')}</div><button class="library-video-sod-arrow" data-scroll-target="${id}" data-scroll-direction="1" aria-label="Más canales">›</button></div></section>`;
}

function libraryVideoChannelCard(channel){
  const initials=channel.name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
  const hue=(channel.name.split('').reduce((sum,char)=>sum+char.charCodeAt(0),0)*7)%360;
  return `<a class="library-video-channel-card" href="${escapeHtml(channel.url)}" target="_blank" rel="noopener noreferrer" style="--channel-hue:${hue}"><span class="library-video-channel-avatar">${escapeHtml(initials||'Ø')}</span><div><p class="eyebrow">${escapeHtml(channel.area)}</p><h3>${escapeHtml(channel.name)}</h3><p>${escapeHtml(channel.description)}</p><strong>Explorar canal ↗</strong></div></a>`;
}

function bindLibraryVideos(){
  document.querySelectorAll('[data-video-open]').forEach(button=>button.onclick=e=>{e.stopPropagation();const video=libraryVideos.find(item=>item.id===button.dataset.videoOpen);if(!video)return;store.update(x=>{x.mediaProgress.videosSeen=[...new Set([...(x.mediaProgress.videosSeen||[]),video.id])];return x});const embed=youtubeEmbedUrl(video.youtubeUrl);if(embed){openModal({title:video.title,className:'library-v5-youtube-modal',content:`<div class="library-v5-youtube"><iframe src="${embed}" title="${escapeHtml(video.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`});return}window.open(video.youtubeUrl||video.channelUrl,'_blank','noopener,noreferrer')});
}

function bindLibraryVideoChannels(){
  // Native anchors intentionally keep the source channel discoverable and open in a new tab.
}

function bindLibraryCarouselArrows(root=document){
  root.querySelectorAll?.('[data-scroll-target]').forEach(button=>button.onclick=()=>{
    const target=document.getElementById(button.dataset.scrollTarget);
    const direction=Number(button.dataset.scrollDirection||1)||1;
    target?.scrollBy({left:direction*Math.max(360,target.clientWidth*.72),behavior:'smooth'});
  });
}

function libraryEmpty(title,copy){return `<div class="library-v5-empty"><span>Ø</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(copy)}</p></div>`}

function seedMarketBrand(){return `<a class="seed-v35-brand" href="/semillas" data-link aria-label="Volver al portal de Semillas"><span class="seed-v35-brand-mark"><img src="${visual('002')}" alt=""></span><strong>SØD</strong></a>`}

function seedMarketCard(seed,{compact=false,compare=false}={}){
  const acquired=state().collection.seeds.includes(seed.id);
  return `<article class="seed-v35-card seed-v351-card collection-${seed.collection} ${compact?'compact':''} ${acquired?'discovered acquired':''}" style="--seed-rarity:${seed.rarityColor};--seed-element:${seed.facetColor};--seed-collection:${seed.collectionColor};--seed-art:url('${seed.art}');--seed-art-position:${seed.artPosition}" data-seed-card="${seed.id}">
    <div class="seed-v35-card-art"><span class="seed-v35-card-rarity" title="${escapeHtml(seed.rarityLabel)}">◇</span><span class="seed-v35-card-element" title="${escapeHtml(seed.facetLabel)}">${seed.facetGlyph}</span><span class="seed-v351-art-sigil" aria-hidden="true">${seed.facetGlyph}</span>${acquired?'<span class="seed-v35-owned">En Tesoros</span>':''}</div>
    <div class="seed-v35-card-body"><div class="seed-v351-card-title"><p class="seed-v35-sequence">${escapeHtml(seed.collectionLabel.toUpperCase())} · ${escapeHtml(seed.edition.toUpperCase())} · ${String(seed.number).padStart(2,'0')}</p><h3>${escapeHtml(seed.title)}</h3>${seed.subtitle?`<small>${escapeHtml(seed.subtitle)}</small>`:''}</div><div class="seed-v35-card-meta"><span style="--meta:${seed.rarityColor}"><i></i>${escapeHtml(seed.rarityLabel)}</span><span style="--meta:${seed.facetColor}">${seed.facetGlyph} ${escapeHtml(seed.facetLabel)}</span></div><div class="seed-v35-resonance"><span>Resonancia</span><strong>${seed.resonance}</strong></div><div class="seed-v35-card-actions"><button type="button" data-market-seed="${seed.id}">Ver detalle <span>→</span></button>${compare?`<button class="seed-v35-compare-toggle" type="button" data-compare-seed="${seed.id}" aria-label="Agregar ${escapeHtml(seed.title)} al comparador">＋</button>`:''}</div></div>
  </article>`;
}

function seedMarketDetail(seed){
  if(!seed)return;const acquired=state().collection.seeds.includes(seed.id);
  openModal({title:`Semilla · ${seed.collectionLabel}`,className:'seed-v35-detail-modal',content:`<div class="seed-v35-detail seed-v351-detail" style="--seed-rarity:${seed.rarityColor};--seed-element:${seed.facetColor};--seed-collection:${seed.collectionColor};--seed-art:url('${seed.art}');--seed-art-position:${seed.artPosition}"><div class="seed-v35-detail-art"><span class="seed-v351-detail-sigil">${seed.facetGlyph}</span><span>${String(seed.number).padStart(2,'0')}</span></div><div class="seed-v35-detail-copy"><p class="eyebrow">${escapeHtml(seed.collectionLabel.toUpperCase())} · ${escapeHtml(seed.edition.toUpperCase())}</p><h2>${escapeHtml(seed.title)}</h2>${seed.subtitle?`<p class="seed-v351-detail-subtitle">${escapeHtml(seed.subtitle)}</p>`:''}<div class="seed-v35-detail-badges"><span style="--meta:${seed.rarityColor}"><i></i>${escapeHtml(seed.rarityLabel)}</span><span style="--meta:${seed.facetColor}">${seed.facetGlyph} ${escapeHtml(seed.facetLabel)}</span></div><p>${escapeHtml(seed.description)}</p><dl><div><dt>Resonancia</dt><dd>${seed.resonance}</dd></div><div><dt>Posición</dt><dd>${seed.number} / ${seed.collection==='elementos'?33:12}</dd></div><div><dt>Colección</dt><dd>${escapeHtml(seed.collectionLabel)}</dd></div><div><dt>Estado</dt><dd>${acquired?'En Tesoros':'Por descubrir'}</dd></div></dl><div class="seed-v35-detail-actions"><button class="btn btn-primary" type="button" data-toggle-market-seed="${seed.id}">${acquired?'Retirar de Tesoros':'Incorporar a Tesoros'}</button>${seed.deepLink?`<a class="btn" href="${seed.deepLink}" data-link>Abrir lectura profunda</a>`:'<button class="btn" type="button" disabled>Lectura profunda · próximamente</button>'}</div><p class="seed-v35-contract-note">Tesoros representa tu colección personal dentro de esta maqueta. No hay wallet, compra, mint ni transferencia conectada.</p></div></div>`,onMount:(root,close)=>{root.querySelector('[data-toggle-market-seed]')?.addEventListener('click',event=>{store.update(s=>{const list=s.collection.seeds;const id=event.currentTarget.dataset.toggleMarketSeed;const index=list.indexOf(id);index>=0?list.splice(index,1):list.push(id);return s});toast(state().collection.seeds.includes(seed.id)?'Semilla incorporada a Tesoros':'Semilla retirada de Tesoros');window.dispatchEvent(new CustomEvent('sod:seed-treasures-changed'));close()});root.querySelector('a[data-link]')?.addEventListener('click',close)}});
}

function seedGatewayMarkup({active='landing'}={}){
  const owned=allSeedMarket.filter(seed=>state().collection.seeds.includes(seed.id)).length;
  return `<div class="seed-v36-gateway" data-seed-gateway>
    <button class="seed-v36-gateway-trigger" type="button" data-seed-gateway-trigger aria-expanded="false" aria-label="Abrir acceso a Mercado y Tesoros"><span class="seed-v36-gateway-orb">✦</span><span><strong>CONSEGUÍ LA TUYA</strong><small>${owned?`${owned} ${owned===1?'Tesoro':'Tesoros'} en tu colección`:'Mercado · Tesoros'}</small></span><i>↗</i></button>
    <div class="seed-v36-gateway-menu" role="dialog" aria-label="Acceso a Semillas">
      <div class="seed-v36-gateway-head"><div><p class="eyebrow">ACCESO SEMILLAS</p><strong>¿A dónde querés entrar?</strong></div><button type="button" data-seed-gateway-close aria-label="Cerrar">×</button></div>
      <a class="${active==='market'?'active':''}" href="/semillas/mercado" data-link><span>01</span><div><strong>Mercado</strong><small>Explorá colecciones y encontrá la Semilla que querés incorporar.</small></div><b>→</b></a>
      <a class="${active==='treasures'?'active':''}" href="/semillas/tesoros" data-link><span>02</span><div><strong>Tesoros</strong><small>Volvé a las Semillas que ya forman parte de tu recorrido.</small></div><b>→</b></a>
      <a class="${active==='landing'?'active':''} seed-v36-gateway-home" href="/semillas" data-link><span>Ø</span><div><strong>Volver a Semillas</strong><small>Regresá a la presentación del universo.</small></div><b>↩</b></a>
    </div>
  </div>`;
}

function mountSeedGateway(root=document){
  const gateway=root.querySelector?.('[data-seed-gateway]')||document.querySelector('[data-seed-gateway]');
  if(!gateway)return()=>{};
  const trigger=gateway.querySelector('[data-seed-gateway-trigger]');
  const setOpen=value=>{gateway.classList.toggle('open',value);trigger?.setAttribute('aria-expanded',String(value))};
  const onClick=event=>{
    if(event.target.closest('[data-seed-gateway-trigger]')){setOpen(!gateway.classList.contains('open'));return}
    if(event.target.closest('[data-seed-gateway-close]')){setOpen(false);return}
    if(event.target.closest('[data-open-seed-gateway]')){event.preventDefault();setOpen(true);return}
    if(gateway.classList.contains('open')&&!event.target.closest('[data-seed-gateway]'))setOpen(false);
  };
  const onKey=event=>{if(event.key==='Escape')setOpen(false)};
  document.addEventListener('click',onClick);document.addEventListener('keydown',onKey);
  return()=>{document.removeEventListener('click',onClick);document.removeEventListener('keydown',onKey)};
}

function seedsLandingView(){
  const elementHero=getMarketSeed('elementos-tierra-33')||elementSeedMarket[0];
  const owned=allSeedMarket.filter(seed=>state().collection.seeds.includes(seed.id)).length;
  const collectionPreview=(collection,seed)=>`<article class="seed-v36-collection-card" style="--collection-color:${collection.color};--collection-art:url('${seed.art}');--collection-position:${seed.artPosition}"><div class="seed-v36-collection-art"><span>${collection.glyph}</span></div><div class="seed-v36-collection-copy"><p class="eyebrow">${escapeHtml(collection.edition.toUpperCase())} · ${collection.count} SEMILLAS</p><h3>${escapeHtml(collection.label)}</h3><p>${escapeHtml(collection.description)}</p><div><span>${collection.status==='active'?'COLECCIÓN ACTIVA':'EDICIÓN EN DESARROLLO'}</span><b>0${seedCollections.indexOf(collection)+1}</b></div></div></article>`;
  return{
    title:'Semillas SØD',noShell:true,
    html:`<main id="app-main" class="seed-v36-portal" style="--seed-portal-bg:url('${VISUALS.seeds}')">
      <header class="seed-v36-nav"><a class="seed-v36-nav-brand" href="/hub" data-link><img src="${visual('002')}" alt=""><strong>SØD</strong><span></span><b>SEMILLAS</b></a><div><a href="/hub" data-link>Hub</a><button type="button" data-scroll-seed-story>Descubrir</button></div></header>
      <section class="seed-v36-hero" aria-labelledby="seed-v36-title">
        <div class="seed-v36-hero-video" data-seed-hero-video-slot aria-hidden="true"><div class="seed-v36-hero-video-fallback"></div><div class="seed-v36-hero-grid"></div></div>
        <div class="seed-v36-hero-art" aria-hidden="true">
          <article class="elementos" style="--hero-art:url('${elementHero.art}');--hero-position:${elementHero.artPosition};--hero-color:#24D7E8"><span>ELEMENTOS</span></article>
        </div>
        <div class="seed-v36-hero-copy"><p class="eyebrow">UNIVERSO SØD · SEMILLAS</p><h1 id="seed-v36-title">No colecciones imágenes.<br><span>Incorporá fuerzas.</span></h1><p>Las Semillas SØD son piezas digitales de activación personal: símbolos coleccionables que representan principios, arquetipos y procesos que podés integrar a tu recorrido dentro del ecosistema.</p><div class="seed-v36-hero-actions"><button type="button" data-scroll-seed-story>Descubrir cómo funcionan <span>↓</span></button><small><i></i> VIDEO CINEMATOGRÁFICO · SLOT PREPARADO</small></div></div>
        <div class="seed-v36-scroll-cue"><span></span><small>DESCENDÉ AL ORIGEN</small></div>
      </section>

      <section class="seed-v36-manifesto" id="seed-v36-story"><div class="seed-v36-section-inner seed-v36-split"><div><p class="eyebrow">01 · QUÉ ES UNA SEMILLA</p><h2>Una idea puede entenderse.<br><span>Una Semilla puede acompañarte.</span></h2></div><div class="seed-v36-manifesto-copy"><p class="lead">Una Semilla convierte una comprensión en algo visible, recordable y coleccionable. No existe para decorar tu perfil: existe para ocupar un lugar dentro de tu proceso.</p><div class="seed-v36-pillar-grid"><article><span>✦</span><strong>Símbolo vivo</strong><p>Representa una fuerza, principio o arquetipo con identidad propia.</p></article><article><span>⌁</span><strong>Ancla personal</strong><p>Puede recordarte aquello que decidiste observar, cultivar o sostener.</p></article><article><span>Ø</span><strong>Pieza del ecosistema</strong><p>Se conecta progresivamente con SØD, Hábitos, Dashboard y Códigos.</p></article><article><span>◇</span><strong>Colección con sentido</strong><p>Tu colección termina mostrando un mapa de aquello que elegiste integrar.</p></article></div></div></div></section>

      <section class="seed-v36-process"><div class="seed-v36-section-inner"><div class="seed-v36-section-head"><p class="eyebrow">02 · CÓMO FUNCIONA</p><h2>De encontrar una pieza<br>a convertirla en parte de tu recorrido.</h2></div><div class="seed-v36-process-line"><article><span>01</span><i>⌕</i><h3>Descubrís</h3><p>Explorás las colecciones hasta encontrar una Semilla que tenga sentido para tu momento.</p></article><article><span>02</span><i>✦</i><h3>Incorporás</h3><p>La sumás desde Mercado. Desde ese momento aparece en tu espacio personal de Tesoros.</p></article><article><span>03</span><i>◈</i><h3>Integrás</h3><p>La relacionás con una comprensión, una decisión, un hábito o un proceso que querés volver visible.</p></article><article><span>04</span><i>↗</i><h3>Cultivás</h3><p>Con el tiempo, SØD puede ayudarte a observar si esa comprensión produjo evidencia en tu conducta.</p></article></div></div></section>

      <section class="seed-v36-life"><div class="seed-v36-section-inner"><div class="seed-v36-section-head"><p class="eyebrow">03 · EN TU VIDA</p><h2>No se trata de poseer más.<br>Se trata de recordar mejor.</h2></div><div class="seed-v36-life-grid"><article><div class="seed-v36-life-number">A</div><p class="eyebrow">CLARIDAD</p><h3>“Necesito recordar desde dónde quiero decidir.”</h3><p>Una Semilla puede convertirse en un ancla visual para un criterio que no querés perder cuando vuelva el ruido.</p><small>DECISIÓN → SEMILLA → RECORDATORIO</small></article><article><div class="seed-v36-life-number">B</div><p class="eyebrow">HÁBITOS</p><h3>“Estoy intentando sostener algo en el tiempo.”</h3><p>Una Semilla puede representar la cualidad que estás cultivando mientras Hábitos registra la evidencia diaria.</p><small>INTENCIÓN → PRÁCTICA → CONTINUIDAD</small></article><article><div class="seed-v36-life-number">C</div><p class="eyebrow">IDENTIDAD</p><h3>“Quiero ver en qué me estoy convirtiendo.”</h3><p>Con el tiempo, Tesoros puede funcionar como una cartografía simbólica de fuerzas y aprendizajes que forman parte de tu historia.</p><small>RECORRIDO → COLECCIÓN → MAPA PERSONAL</small></article></div></div></section>

      <section class="seed-v36-collections"><div class="seed-v36-section-inner"><div class="seed-v36-section-head seed-v36-collections-head"><div><p class="eyebrow">04 · COLECCIONES</p><h2>Elementos abre el ciclo.<br>Las próximas colecciones esperan.</h2></div><p>El primer recorrido operativo es Elementos · Genesis. Animales y Sodiaco quedan anunciadas con discreción hasta que tengan contenido y arte definitivos.</p></div><div class="seed-v36-collection-grid seed-v399-collection-grid">${collectionPreview(seedCollections[0],elementHero)}<aside class="seed-v399-coming-soon"><p class="eyebrow">PRÓXIMAMENTE</p><article><span>◉</span><div><strong>Animales</strong><small>Arquetipos vivos. Todavía no disponible.</small></div></article><article><span>✧</span><div><strong>Sodiaco</strong><small>Ciclos y fuerzas celestes. Todavía no disponible.</small></div></article></aside></div></div></section>

      <section class="seed-v36-ecosystem"><div class="seed-v36-section-inner seed-v36-split"><div><p class="eyebrow">05 · DENTRO DE SØD</p><h2>Una Semilla no termina<br>cuando la conseguís.</h2><p>Su valor aparece cuando empieza a relacionarse con el resto de tu recorrido.</p></div><div class="seed-v36-orbit" aria-label="Relación de Semillas con el ecosistema"><div class="seed-v36-orbit-core"><span>✦</span><strong>SEMILLA</strong></div><article class="talk"><span>Ø</span><strong>SØD</strong><small>Comprensión</small></article><article class="habits"><span>✓</span><strong>Hábitos</strong><small>Evidencia</small></article><article class="dashboard"><span>⌁</span><strong>Dashboard</strong><small>Evolución</small></article><article class="codes"><span>◇</span><strong>Códigos</strong><small>Transformación</small></article></div></div></section>

      <section class="seed-v36-treasures-story"><div class="seed-v36-section-inner"><div class="seed-v36-treasure-object"><div><span>✦</span></div><small>${owned?`${owned} ${owned===1?'TESORO ACTUAL':'TESOROS ACTUALES'}`:'TU BÓVEDA AÚN ESTÁ VACÍA'}</small></div><div class="seed-v36-treasure-copy"><p class="eyebrow">06 · TUS TESOROS</p><h2>El Mercado muestra posibilidades.<br><span>Tesoros muestra elecciones.</span></h2><p>Tesoros no es una segunda tienda. Es tu colección personal: únicamente aparecen ahí las Semillas que ya incorporaste a tu recorrido.</p><dl><div><dt>Mercado</dt><dd>Lo que existe y podés explorar.</dd></div><div><dt>Tesoros</dt><dd>Lo que ya elegiste incorporar.</dd></div><div><dt>Integración</dt><dd>Lo que empieza a tener significado en tu vida.</dd></div></dl></div></div></section>

      <section class="seed-v36-final"><div class="seed-v36-final-glow"></div><div><p class="eyebrow">SEMILLAS SØD</p><h2>No elijas solamente una imagen.<br><span>Elegí qué querés cultivar.</span></h2><p>Cuando estés listo, el acceso a Mercado y a tus Tesoros está siempre disponible.</p><button type="button" data-open-seed-gateway>CONSEGUÍ LA TUYA <span>✦</span></button></div></section>
      ${seedGatewayMarkup({active:'landing'})}
    </main>`,
    mount(){
      document.documentElement.classList.add('seed-market-active','seed-portal-active');document.querySelector('.install-banner')?.remove();
      const gatewayCleanup=mountSeedGateway(document);
      const story=document.querySelector('#seed-v36-story');
      document.querySelectorAll('[data-scroll-seed-story]').forEach(button=>button.onclick=()=>story?.scrollIntoView({behavior:'smooth',block:'start'}));
      return()=>{gatewayCleanup?.();document.documentElement.classList.remove('seed-market-active','seed-portal-active')};
    }
  };
}

function seedsMarketplaceView(initialMode='market'){
  const defaultFilters={rarity:'all',collection:'elementos',facet:'all',status:'all',resonance:0};
  let filters={...defaultFilters};
  const mode=initialMode==='treasures'?'treasures':'market';
  let viewMode='grid';
  let sort='sequence';
  let query='';
  let visibleLimit=24;
  const compareIds=new Set();
  return{
    title:mode==='treasures'?'Tesoros · Semillas':'Mercado · Semillas',
    noShell:true,
    html:`<main id="app-main" class="seed-v35 seed-v351 seed-v36-market" style="--seed-market-bg:url('${VISUALS.seeds}')">
      <div class="seed-v35-backdrop" aria-hidden="true"></div>
      <header class="seed-v35-appbar">
        <div class="seed-v35-appbar-left">${seedMarketBrand()}<span class="seed-v35-divider"></span><a class="seed-v36-section-home" href="/semillas" data-link>Semillas</a></div>
        <div class="seed-v35-appbar-center"><label class="seed-v35-search"><span>⌕</span><input id="seed-v35-search" type="search" placeholder="Buscar Semillas" autocomplete="off"></label><select id="seed-v35-sort" aria-label="Ordenar Semillas"><option value="sequence">Colección</option><option value="recent">Más recientes</option><option value="resonance">Mayor resonancia</option><option value="rarity">Mayor rareza</option><option value="name">Nombre A–Z</option></select><button class="seed-v35-filter-trigger" type="button" data-filter-toggle><span>☷</span> Filtros</button></div>
        <div class="seed-v35-appbar-right"><button class="seed-v35-info" type="button" data-seed-video aria-label="Qué son las Semillas">?</button><span class="seed-v35-supply"><b>✦</b><strong>${elementSeedMarket.length}</strong><small>Elementos · Genesis</small></span><a class="seed-v35-hub-link" href="/hub" data-link>Hub</a><span class="seed-v35-profile">Ø</span></div>
      </header>
      <div class="seed-v35-layout">
        <aside class="seed-v35-filters" data-seed-filters aria-label="Filtros de Semillas">
          <div class="seed-v35-filter-head"><strong>FILTRAR</strong><button type="button" data-filter-close aria-label="Cerrar filtros">×</button></div>
          <section><p>RAREZA</p><label><input type="radio" name="seed-rarity" value="all" checked><span class="seed-v35-filter-symbol">◉</span>Todas <i></i></label>${seedRarities.map(r=>`<label><input type="radio" name="seed-rarity" value="${r.key}"><span style="color:${r.color}">◇</span>${r.label}<i style="background:${r.color}"></i></label>`).join('')}</section>
          <section><p>COLECCIÓN</p><label><input type="radio" name="seed-collection" value="elementos" checked><span style="color:#24D7E8">◈</span>Elementos <i style="background:#24D7E8"></i></label><label class="seed-v399-coming-filter"><input type="radio" disabled><span>◉</span>Animales <small>Próximamente</small></label><label class="seed-v399-coming-filter"><input type="radio" disabled><span>✧</span>Sodiaco <small>Próximamente</small></label></section>
          <section id="seed-v351-facet-section"></section>
          <section class="seed-v351-status-filter"><p>ESTADO</p><label><input type="radio" name="seed-status" value="all" checked><span>◉</span>Todas</label><label><input type="radio" name="seed-status" value="acquired"><span>✓</span>En Tesoros</label><label><input type="radio" name="seed-status" value="latent"><span>○</span>Por descubrir</label></section>
          <section class="seed-v35-resonance-filter"><p>RESONANCIA MÍNIMA <b id="seed-resonance-value">0</b></p><input id="seed-resonance-filter" type="range" min="0" max="950" step="50" value="0"></section>
          <button class="seed-v35-clear" type="button" data-clear-seed-filters>↻ Limpiar filtros</button>
        </aside>
        <section class="seed-v35-main"><div id="seed-v35-content"></div></section>
      </div>
      <footer class="seed-v35-footer"><span>${mode==='treasures'?'Tesoros · Semillas SØD':'Mercado de Semillas SØD'}</span><small>Descubrí · Integrá · Cultivá</small><div><span class="seed-v35-live-dot"></span>Prototipo local <b>•</b> ${elementSeedMarket.length} Semillas</div></footer>
      ${seedGatewayMarkup({active:mode})}
    </main>`,
    mount(){
      document.documentElement.classList.add('seed-market-active');
      document.querySelector('.install-banner')?.remove();
      const gatewayCleanup=mountSeedGateway(document);
      const content=document.querySelector('#seed-v35-content');
      const search=document.querySelector('#seed-v35-search');
      const sortSelect=document.querySelector('#seed-v35-sort');
      const filterPanel=document.querySelector('[data-seed-filters]');
      const facetSection=document.querySelector('#seed-v351-facet-section');
      const statusSection=document.querySelector('.seed-v351-status-filter');
      const resonanceInput=document.querySelector('#seed-resonance-filter');
      const resonanceValue=document.querySelector('#seed-resonance-value');
      const savedSet=()=>new Set(state().collection.seeds);
      const collectionMeta=key=>seedCollections.find(item=>item.key===key);
      const collectionOrder=key=>['elementos','animales','sodiaco'].indexOf(key);

      function renderFacetFilter(){
        const meta=collectionMeta(filters.collection);
        const facets=getCollectionFacets(filters.collection);
        if(!meta||!facets.length){facetSection.innerHTML='<p>FACETA</p><div class="seed-v351-facet-note">Elegí una colección para abrir sus categorías.</div>';return}
        facetSection.innerHTML=`<p>${escapeHtml(meta.facetLabel.toUpperCase())}</p><label><input type="radio" name="seed-facet" value="all" checked><span class="seed-v35-filter-symbol">◉</span>Todos <i></i></label>${facets.map(f=>`<label><input type="radio" name="seed-facet" value="${f.key}"><span style="color:${f.color}">${f.glyph}</span>${f.label}<i style="background:${f.color}"></i></label>`).join('')}`;
        facetSection.querySelectorAll('input[name="seed-facet"]').forEach(input=>input.onchange=()=>{filters.facet=input.value;visibleLimit=24;render()});
      }
      function setCollection(value){if(value!=='elementos')return;filters.collection='elementos';filters.facet='all';visibleLimit=24;document.querySelectorAll('input[name="seed-collection"]').forEach(input=>input.checked=input.value==='elementos');renderFacetFilter()}
      function filteredSeeds(){
        const saved=savedSet();
        let list=mode==='treasures'?elementSeedMarket.filter(seed=>saved.has(seed.id)):elementSeedMarket;
        list=list.filter(seed=>{const haystack=`${seed.title} ${seed.subtitle||''} ${seed.collectionLabel} ${seed.facetLabel} ${seed.rarityLabel} ${seed.number} ${seed.sequence} ${seed.description}`.toLowerCase();const acquired=saved.has(seed.id);const statusMatch=mode==='treasures'||filters.status==='all'||(filters.status==='acquired'&&acquired)||(filters.status==='latent'&&!acquired);return (!query||haystack.includes(query))&&(filters.rarity==='all'||seed.rarity===filters.rarity)&&(filters.collection==='all'||seed.collection===filters.collection)&&(filters.facet==='all'||seed.facetKey===filters.facet)&&statusMatch&&seed.resonance>=filters.resonance});
        return list.sort((a,b)=>{if(sort==='resonance')return b.resonance-a.resonance;if(sort==='rarity')return b.rarityRank-a.rarityRank||b.resonance-a.resonance;if(sort==='name')return a.title.localeCompare(b.title,'es');if(sort==='recent')return b.sequence-a.sequence;return collectionOrder(a.collection)-collectionOrder(b.collection)||a.sequence-b.sequence});
      }
      function collectionStrip(){return ''}
      function futureCollections(){return mode==='market'?`<section class="seed-v399-future-collections"><p class="eyebrow">PRÓXIMAS COLECCIONES</p><div><article><span>◉</span><strong>Animales</strong><small>Arquetipos vivos · Próximamente</small></article><article><span>✧</span><strong>Sodiaco</strong><small>Ciclos y fuerzas celestes · Próximamente</small></article></div></section>`:''}
      function resultToolbar(count){const meta=collectionMeta(filters.collection);return `<div class="seed-v35-results-head"><div><p class="eyebrow">${mode==='treasures'?'TU COLECCIÓN PERSONAL':'MERCADO'}</p><strong>${count} ${mode==='treasures'?'Tesoros':'Semillas encontradas'}</strong><small>${meta?`Colección ${meta.label} · ${meta.edition}`:'Todas las colecciones'}</small></div><div class="seed-v35-view-controls"><button type="button" class="${viewMode==='grid'?'active':''}" data-view-mode="grid" aria-label="Vista grilla">▦</button><button type="button" class="${viewMode==='list'?'active':''}" data-view-mode="list" aria-label="Vista lista">☷</button></div></div>`}
      function openComparison(){const selected=[...compareIds].map(getMarketSeed).filter(Boolean);if(selected.length<2)return;openModal({title:'Comparador de Tesoros',className:'seed-v35-compare-modal',content:`<div class="seed-v35-compare-grid">${selected.map(seed=>`<article style="--seed-rarity:${seed.rarityColor};--seed-element:${seed.facetColor}"><span>${seed.facetGlyph}</span><h3>${escapeHtml(seed.title)}</h3><p>${escapeHtml(seed.collectionLabel)} · ${escapeHtml(seed.rarityLabel)}</p><dl><div><dt>Resonancia</dt><dd>${seed.resonance}</dd></div><div><dt>Faceta</dt><dd>${escapeHtml(seed.facetLabel)}</dd></div><div><dt>Estado</dt><dd>En Tesoros</dd></div></dl></article>`).join('')}</div>`})}
      function bindDynamic(){
        content.querySelectorAll('[data-market-seed]').forEach(button=>button.onclick=()=>seedMarketDetail(getMarketSeed(button.dataset.marketSeed)));
        content.querySelectorAll('[data-view-mode]').forEach(button=>button.onclick=()=>{viewMode=button.dataset.viewMode;render()});
        content.querySelector('[data-load-more]')?.addEventListener('click',()=>{visibleLimit+=24;render()});
        content.querySelectorAll('[data-collection-card]').forEach(button=>button.onclick=()=>{setCollection(button.dataset.collectionCard);render()});
        content.querySelectorAll('[data-compare-seed]').forEach(button=>{const id=button.dataset.compareSeed;button.classList.toggle('active',compareIds.has(id));button.textContent=compareIds.has(id)?'✓':'＋';button.onclick=()=>{if(compareIds.has(id))compareIds.delete(id);else if(compareIds.size<3)compareIds.add(id);else toast('Podés comparar hasta 3 Tesoros','error');render()}});
        content.querySelector('[data-compare-open]')?.addEventListener('click',openComparison);
      }
      function renderMarket(){const list=filteredSeeds();const visible=list.slice(0,visibleLimit);content.innerHTML=`${collectionStrip()}${resultToolbar(list.length)}<div class="seed-v35-grid seed-v351-grid ${viewMode==='list'?'list':''}">${visible.map(seed=>seedMarketCard(seed)).join('')||'<div class="seed-v35-empty"><span>Ø</span><h2>No encontramos Semillas</h2><p>Probá quitando filtros o abriendo otra colección.</p></div>'}</div>${list.length>visible.length?`<div class="seed-v35-load-more"><button type="button" data-load-more>Mostrar ${Math.min(24,list.length-visible.length)} Semillas más</button><small>${visible.length} de ${list.length}</small></div>`:''}`;bindDynamic()}
      function renderTreasures(){
        const list=filteredSeeds();const totalOwned=elementSeedMarket.filter(seed=>savedSet().has(seed.id));
        if(!list.length){content.innerHTML=`<section class="seed-v35-treasure-head seed-v351-treasure-head"><div><p class="eyebrow">COLECCIÓN PERSONAL</p><h1>Tus Tesoros</h1><p>Acá viven únicamente las Semillas que ya incorporaste a tu recorrido.</p></div><div class="seed-v35-treasure-stats"><span><strong>${totalOwned.length}</strong><small>Adquiridas</small></span><span><strong>${new Set(totalOwned.map(seed=>seed.collection)).size}</strong><small>Colecciones</small></span></div></section><div class="seed-v351-treasure-empty"><span>✦</span><p class="eyebrow">CÁMARA VACÍA</p><h2>${totalOwned.length?'Ningún Tesoro coincide con estos filtros.':'Todavía no incorporaste Semillas.'}</h2><p>${totalOwned.length?'Probá limpiando los filtros para volver a ver tu colección.':'Cuando estés listo para explorar, usá el acceso flotante CONSEGUÍ LA TUYA y abrí Mercado. Tesoros nunca muestra piezas que todavía no incorporaste.'}</p><button type="button" data-open-seed-gateway>Abrir acceso de Semillas</button></div>`;bindDynamic();return}
        const top=[...list].sort((a,b)=>b.resonance-a.resonance).slice(0,3);const resonance=list.reduce((sum,item)=>sum+item.resonance,0);const represented=new Set(list.map(item=>item.collection)).size;
        content.innerHTML=`<section class="seed-v35-treasure-head seed-v351-treasure-head"><div><p class="eyebrow">COLECCIÓN PERSONAL</p><h1>Tus Tesoros</h1><p>Semillas ya adquiridas e incorporadas a tu recorrido. Nada nuevo aparece acá hasta que vos lo sumás desde Mercado.</p></div><div class="seed-v35-treasure-stats"><span><strong>${list.length}</strong><small>Tesoros</small></span><span><strong>${represented}</strong><small>Colecciones</small></span><span><strong>${resonance.toLocaleString('es-AR')}</strong><small>Resonancia</small></span><button type="button" data-compare-open ${compareIds.size<2?'disabled':''}>Comparar ${compareIds.size?`(${compareIds.size})`:''}</button></div></section><div class="seed-v35-treasure-feature seed-v351-treasure-feature">${top.map(seed=>seedMarketCard(seed,{compare:true})).join('')}</div><section class="seed-v35-treasure-summary"><p class="eyebrow">LECTURA DE TU COLECCIÓN</p><p>Tesoros no es otro catálogo: es tu bóveda personal. Reúne exclusivamente las Semillas que ya adquiriste, desbloqueaste o incorporaste al recorrido.</p><div class="seed-v35-common-attributes"><span><small>Resonancia total</small><strong>${resonance.toLocaleString('es-AR')}</strong></span><span><small>Colecciones</small><strong>${represented}</strong></span><span><small>Rarezas</small><strong>${new Set(list.map(item=>item.rarity)).size}</strong></span><span><small>Tesoros</small><strong>${list.length}</strong></span></div><div class="seed-v35-synergy"><span>Integración de colección</span><strong>Nivel ${Math.max(1,Math.min(5,Math.ceil(totalOwned.length/8)))}</strong><i style="--progress:${Math.min(100,Math.round(totalOwned.length/40*100))}%"></i><small>Representa profundidad de colección, no valor financiero.</small></div></section><div class="seed-v35-treasure-list-head"><strong>Todos tus Tesoros (${list.length})</strong><small>${filters.collection==='all'?'Todas las colecciones':collectionMeta(filters.collection)?.label||''}</small></div><div class="seed-v35-treasure-strip seed-v351-treasure-strip">${list.map(seed=>seedMarketCard(seed,{compact:true,compare:true})).join('')}</div>`;bindDynamic();
      }
      function render(){statusSection.hidden=mode==='treasures';if(mode==='treasures')renderTreasures();else renderMarket()}

      search.oninput=e=>{query=String(e.target.value||'').trim().toLowerCase();visibleLimit=24;render()};sortSelect.onchange=e=>{sort=e.target.value;render()};
      document.querySelectorAll('input[name="seed-rarity"]').forEach(input=>input.onchange=()=>{filters.rarity=input.value;visibleLimit=24;render()});document.querySelectorAll('input[name="seed-collection"]').forEach(input=>input.onchange=()=>{setCollection(input.value);render()});document.querySelectorAll('input[name="seed-status"]').forEach(input=>input.onchange=()=>{filters.status=input.value;visibleLimit=24;render()});
      resonanceInput.oninput=e=>{filters.resonance=Number(e.target.value||0);resonanceValue.textContent=String(filters.resonance);render()};
      document.querySelector('[data-clear-seed-filters]').onclick=()=>{filters={...defaultFilters};query='';sort='sequence';viewMode='grid';visibleLimit=24;search.value='';sortSelect.value='sequence';resonanceInput.value='0';resonanceValue.textContent='0';document.querySelectorAll('input[name="seed-rarity"]').forEach(input=>input.checked=input.value==='all');document.querySelectorAll('input[name="seed-collection"]').forEach(input=>input.checked=input.value===defaultFilters.collection);document.querySelectorAll('input[name="seed-status"]').forEach(input=>input.checked=input.value==='all');renderFacetFilter();render()};
      document.querySelector('[data-filter-toggle]').onclick=()=>filterPanel.classList.add('open');document.querySelector('[data-filter-close]').onclick=()=>filterPanel.classList.remove('open');
      document.querySelector('[data-seed-video]').onclick=()=>openModal({title:'¿Qué son las Semillas?',content:`<div class="seed-v351-video-placeholder"><span>▶</span><p class="eyebrow">VIDEO CANÓNICO · PRÓXIMAMENTE</p><h2>Una Semilla convierte una comprensión en algo que podés volver a mirar.</h2><p>Si querés conocer el sistema completo, volvé al portal de Semillas. Mercado sirve para explorar posibilidades y Tesoros para volver a aquello que ya incorporaste.</p></div>`});
      const changeHandler=()=>render();window.addEventListener('sod:seed-treasures-changed',changeHandler);
      if(mode==='treasures'){filters.collection='elementos';document.querySelectorAll('input[name="seed-collection"]').forEach(input=>input.checked=input.value==='elementos')}
      renderFacetFilter();render();
      return()=>{gatewayCleanup?.();window.removeEventListener('sod:seed-treasures-changed',changeHandler);document.documentElement.classList.remove('seed-market-active')};
    }
  };
}

function seedCard(seed){return `<a class="seed-visual-card" href="/semillas/${seed.id}" data-link style="--seed-image:url('${seed.image}')"><div class="seed-visual-shade"></div><div class="seed-card-content"><span class="eyebrow">${seed.state==='latent'?'LATENTE':'DESCUBIERTA'}</span><div class="seed-symbol">${seed.glyph||'Ø'}</div><blockquote>${escapeHtml(seed.title)}</blockquote><p>${escapeHtml(seed.interpretation)}</p><div class="tag-list">${(seed.keywords||[]).map(k=>`<span class="tag">${escapeHtml(k)}</span>`).join('')}</div></div></a>`}
function bindSeedCards(){/* links are handled by the router */}
function seedDetailView(id){const seed=seeds.find(x=>x.id===id);if(!seed)return notFoundView();const saved=state().collection.seeds.includes(id);return{title:seed.title,html:`<main id="app-main"><section class="seed-detail-hero" style="--seed-image:url('${seed.image}')"><div class="seed-detail-shade"></div><div class="container seed-detail-content"><p class="eyebrow">SEMILLA ${String(seed.number).padStart(2,'0')} · ${seed.state.toUpperCase()}</p><h1 class="page-title">${escapeHtml(seed.title)}</h1><p class="lead">${escapeHtml(seed.interpretation)}</p><div class="actions"><button class="btn btn-primary" data-save-seed>${saved?'Dejar de cultivar':'Descubrir y cultivar'}</button><a class="btn" href="/semillas" data-link>Volver</a></div></div></section><section class="section"><div class="container grid grid-2"><article class="card"><div class="card-body"><p class="eyebrow">COMPRENSIÓN</p><p class="lead" style="font-size:22px">${escapeHtml(seed.interpretation)}</p></div></article><article class="card"><div class="card-body"><p class="eyebrow">PRÁCTICA DE CULTIVO</p><p class="lead" style="font-size:22px">${escapeHtml(seed.application)}</p></div></article></div></section></main>`,mount(){document.querySelector('[data-save-seed]').onclick=e=>{store.update(s=>{const list=s.collection.seeds;const i=list.indexOf(id);i>=0?list.splice(i,1):list.push(id);return s});e.currentTarget.textContent=state().collection.seeds.includes(id)?'Dejar de cultivar':'Descubrir y cultivar';toast('Estado de la Semilla actualizado')}}}}

function elementsView(){return{title:'Elementos 33',html:`<main id="app-main" class="elements-sanctuary" style="--elements-bg:url('${visual('037')}')"><div class="elements-sanctuary-shade"></div><section class="elements-intro container"><p class="eyebrow">NÚCLEO FILOSÓFICO</p><h1>Cinco fuerzas.<br><span>Ciento sesenta y cinco lecturas.</span></h1><p>Elementos 33 no es una grilla de objetos. Es un mapa monumental del desarrollo humano. Esta V3 utiliza placeholders visuales hasta integrar las piezas definitivas.</p><div class="elements-law"><span>12 Velo</span><span>12 Remez</span><span>6 Derash</span><span>2 SØD</span><span>1 SØD²</span></div></section><section class="force-gates container">${elementDefinitions.map((e,i)=>`<a class="force-gate" href="/elementos/${e.key}" data-link style="--element:${e.color};--element-image:url('${e.visual}')"><div class="force-gate-image"></div><div class="force-gate-shade"></div><span class="force-number">0${i+1}</span>${e.placeholder?'<span class="placeholder-badge">PLACEHOLDER VISUAL</span>':''}<div class="force-copy"><span class="force-glyph">${e.glyph}</span><p class="eyebrow">33 PIEZAS</p><h2>${e.name}</h2><p>${e.description}</p><strong>Entrar a la fuerza →</strong></div></a>`).join('')}</section></main>`}}


function elementView(key){const element=elementDefinitions.find(e=>e.key===key);if(!element)return notFoundView();const pieces=elementPieces.filter(p=>p.element===key);const levelSection=(level,items)=>`<section class="element-level level-${level.key}" data-level-section="${level.key}"><header><div><p class="eyebrow">${level.label}</p><h2>${level.meaning}</h2></div><span>${items.length} piezas</span></header><div class="element-piece-field">${items.map(p=>`<a class="element-piece-artifact ${level.key==='sod2'?'origin-piece':''}" href="/elementos/${key}/${p.number}" data-link data-piece-search="${(p.title+p.levelLabel+p.geometricMotif+p.number).toLowerCase()}" style="--element:${element.color};--artifact-image:url('${element.visual}')"><div class="element-piece-image"></div><div class="element-piece-glow"></div><span class="element-piece-number">${String(p.number).padStart(2,'0')}</span><div><p>${p.levelLabel}</p><strong>${p.title}</strong><small>${p.geometricMotif}</small></div></a>`).join('')}</div></section>`;return{title:element.name,html:`<main id="app-main" class="element-world" style="--element:${element.color};--element-image:url('${element.visual}')"><section class="element-world-hero"><div class="element-world-bg"></div><div class="element-world-shade"></div><div class="container element-world-copy"><p class="eyebrow">ELEMENTOS 33 · FUERZA 0${elementDefinitions.indexOf(element)+1}</p><span class="element-world-glyph">${element.glyph}</span><h1>${element.name}</h1><p>${element.description}</p>${element.placeholder?'<span class="placeholder-badge">ARTE DEFINITIVO PENDIENTE · PLACEHOLDER ACTIVO</span>':''}<div class="actions"><a class="btn" href="/elementos" data-link>Volver a las cinco fuerzas</a></div></div></section><section class="element-codex"><div class="container"><div class="element-toolbar"><div><p class="eyebrow">CÓDICE DE ${element.name.toUpperCase()}</p><h2>De lo visible al origen.</h2></div><div class="element-toolbar-controls"><select class="search-input" id="level-filter"><option value="">Todos los niveles</option>${levelDefinitions.map(l=>`<option value="${l.key}">${l.label}</option>`).join('')}</select><input class="search-input" id="piece-search" placeholder="Buscar pieza, nivel o motivo"><span class="pill" id="piece-count">33 piezas</span></div></div><div id="element-levels">${levelDefinitions.map(level=>levelSection(level,pieces.filter(p=>p.level===level.key))).join('')}</div></div></section></main>`,mount(){const filter=()=>{const level=document.querySelector('#level-filter').value;const q=document.querySelector('#piece-search').value.toLowerCase();let count=0;document.querySelectorAll('[data-level-section]').forEach(section=>{let visible=0;section.querySelectorAll('[data-piece-search]').forEach(card=>{const show=(!q||card.dataset.pieceSearch.includes(q))&&(!level||section.dataset.levelSection===level);card.hidden=!show;if(show){visible++;count++}});section.hidden=visible===0});document.querySelector('#piece-count').textContent=`${count} piezas`};document.querySelector('#level-filter').onchange=filter;document.querySelector('#piece-search').oninput=filter}}}


function pieceDetailView(elementKey,number){const piece=getPiece(elementKey,number);if(!piece)return notFoundView();const element=elementDefinitions.find(e=>e.key===elementKey);const saved=state().collection.pieces.includes(piece.id);return{title:piece.title,html:`<main id="app-main" class="piece-experience" style="--element:${element.color};--piece-image:url('${element.visual}')"><section class="piece-experience-hero"><div class="piece-experience-bg"></div><div class="piece-experience-shade"></div><div class="container piece-experience-copy"><p class="eyebrow">${piece.elementName.toUpperCase()} · ${piece.levelLabel.toUpperCase()}</p><span class="piece-hero-number">${String(piece.number).padStart(2,'0')}</span><span class="piece-hero-glyph">${piece.symbol}</span><h1>${piece.title}</h1><p>${piece.phrase}</p>${element.placeholder?'<span class="placeholder-badge">PLACEHOLDER VISUAL</span>':''}<div class="actions"><button class="btn btn-primary" data-piece-practice>Vivir la experiencia</button><button class="btn" data-save-piece>${saved?'Quitar de mi archivo':'Guardar en mi archivo'}</button><a class="btn btn-ghost" href="/elementos/${elementKey}" data-link>Volver a ${piece.elementName}</a></div></div></section><section class="piece-reading"><div class="container"><article><p class="eyebrow">INTERPRETACIÓN</p><h2>Una lectura, no una doctrina.</h2><p>${piece.interpretation}</p></article><article><p class="eyebrow">APLICACIÓN</p><h2>La comprensión necesita evidencia.</h2><p>${piece.practicalApplication}</p></article><aside><p class="eyebrow">RELACIONES</p><div class="tag-list">${piece.keywords.map(k=>`<span class="tag">${k}</span>`).join('')}</div><p class="muted">Motivo: ${piece.geometricMotif}<br>Edición: ${piece.edition}<br>Profundidad: ${piece.rarity}</p></aside></div></section></main>`,mount(){document.querySelector('[data-save-piece]').onclick=e=>{store.update(s=>{const list=s.collection.pieces;const i=list.indexOf(piece.id);i>=0?list.splice(i,1):list.push(piece.id);return s});e.currentTarget.textContent=state().collection.pieces.includes(piece.id)?'Quitar de mi archivo':'Guardar en mi archivo';toast('Archivo personal actualizado')};document.querySelector('[data-piece-practice]').onclick=()=>openModal({title:`Experiencia · ${piece.title}`,content:`<p class="lead" style="font-size:20px">${piece.practicalApplication}</p><p class="muted">Contenido placeholder funcional. Un Código solo puede conservarse si reconocés una transición.</p><form class="form" id="piece-practice"><div class="field"><label>Antes</label><textarea name="before" required></textarea></div><div class="field"><label>Después</label><textarea name="after" required></textarea></div><label class="option"><input type="checkbox" name="transition" required><strong>Reconozco que algo cambió en cómo observo o actúo.</strong></label><button class="btn btn-primary">Conservar como Código</button></form>`,onMount:(root,close)=>{root.querySelector('form').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const now=new Date();store.update(s=>{s.codes=[...(s.codes||[]),{id:`SOD-${Date.now()}`,title:`Integración de ${piece.title}`,type:'Integración',depth:(s.codes||[]).length?'Común':'Fundacional',createdAt:now.toISOString(),date:now.toLocaleDateString('es-AR'),originUniverse:'elements33',originEvent:'element_practice_transition',summary:String(fd.get('after')),meaning:`Antes: ${String(fd.get('before'))}`,visual:visual('044'),linkedSeedIds:[],linkedElementIds:[piece.id],userConfirmed:true,privacy:'private',status:'active'}];return s});toast('Código SØD conservado');close()}}})}}}


function codeCard(code){return `<article class="code-card" style="--code-image:url('${code.visual||visual('042')}')"><div class="code-card-shade"></div><div class="code-card-content"><span class="eyebrow">${escapeHtml(code.type)} · ${escapeHtml(code.depth||'Común')}</span><h3>${escapeHtml(code.title)}</h3><p>${escapeHtml(code.summary)}</p><small>${escapeHtml(code.date||'')}</small></div></article>`}

function codesView(){const codes=state().codes||[];const active=codes[0]||sampleCodes[0];const archive=codes.length?codes:sampleCodes;return{title:'Códigos SØD',html:`<main id="app-main" class="codes-museum" style="--museum-bg:url('${visual('046')}')"><div class="codes-museum-shade"></div><section class="codes-museum-intro container"><p class="eyebrow">BIBLIOTECA PERSONAL</p><h1>Códigos SØD.<br><span>Evidencia del recorrido.</span></h1><p>Las Semillas transforman. Los Códigos conservan el momento en que algo realmente cambió.</p>${codes.length?'':'<span class="placeholder-badge">MODO DEMOSTRACIÓN · LAS RELIQUIAS VISIBLES SON PLACEHOLDERS</span>'}</section><section class="code-exhibition container"><div class="code-pedestal"><div class="code-pedestal-image" style="--code-image:url('${active.visual||visual('042')}')"></div><div class="code-pedestal-ring"></div></div><article class="code-story"><p class="eyebrow">${escapeHtml(active.type)} · ${escapeHtml(active.depth||'Común')}</p><h2>${escapeHtml(active.title)}</h2><p>${escapeHtml(active.summary)}</p><dl><div><dt>Origen</dt><dd>${escapeHtml(active.originUniverse||'Demostración')}</dd></div><div><dt>Fecha</dt><dd>${escapeHtml(active.date||'Placeholder')}</dd></div><div><dt>Privacidad</dt><dd>${escapeHtml(active.privacy||'Privado')}</dd></div></dl><div class="actions"><a class="btn btn-primary" href="/experiencia" data-link>Iniciar una transformación</a><a class="btn" href="/coleccion" data-link>Abrir museo personal</a></div></article></section><section class="code-archive-strip"><div class="container"><p class="eyebrow">RELIQUIAS DEL ARCHIVO</p><div class="code-relic-rail">${archive.map((c,i)=>`<article class="code-relic-mini ${i===0?'active':''}" style="--code-image:url('${c.visual||visual('042')}')"><div></div><span>${String(i+1).padStart(2,'0')}</span><strong>${escapeHtml(c.title)}</strong></article>`).join('')}</div></div></section></main>`}}


function localDateKey(date){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');return `${y}-${m}-${d}`}
function habitsWeek(){const today=new Date();const day=(today.getDay()+6)%7;const monday=new Date(today);monday.setHours(12,0,0,0);monday.setDate(today.getDate()-day);return Array.from({length:7},(_,i)=>{const date=new Date(monday);date.setDate(monday.getDate()+i);return {date,key:localDateKey(date),label:new Intl.DateTimeFormat('es-AR',{weekday:'short'}).format(date).replace('.',''),day:date.getDate()}})}
function habitGlyph(name='',category=''){
  const token=`${name} ${category}`.toLowerCase();
  if(token.includes('agua'))return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s5 6 5 10a5 5 0 1 1-10 0c0-4 5-10 5-10Z"/></svg>';
  if(token.includes('mov')||token.includes('cuerpo')||token.includes('energ'))return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="14" cy="4.7" r="2"/><path d="m8 20 2.7-5.4 2.2-2.2 2.4 2.1 3.7.5M6 10l4-2 3.6 1.2L16 7M11 9l-1 4.2-3 2.8"/></svg>';
  if(token.includes('leer')||token.includes('conocimiento')||token.includes('libro'))return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5c3-.8 5.5-.1 8 2v12c-2.5-2.1-5-2.8-8-2V5.5ZM20 5.5c-3-.8-5.5-.1-8 2v12c2.5-2.1 5-2.8 8-2V5.5Z"/></svg>';
  if(token.includes('claridad')||token.includes('silencio')||token.includes('mente'))return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4.8A3 3 0 0 0 5.8 8v1A3.3 3.3 0 0 0 4 12a3.3 3.3 0 0 0 1.8 3v1A3 3 0 0 0 9 19.2M15 4.8A3 3 0 0 1 18.2 8v1A3.3 3.3 0 0 1 20 12a3.3 3.3 0 0 1-1.8 3v1a3 3 0 0 1-3.2 3.2M9 4.8c1.8.2 3 1.5 3 3.2v8c0 1.7-1.2 3-3 3.2M15 4.8c-1.8.2-3 1.5-3 3.2"/></svg>';
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3"/></svg>';
}
function habitMetricGlyph(type){
  const icons={target:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m15 9 5-5M17 4h3v3"/></svg>',check:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="m8 12 2.5 2.5L16.5 8"/></svg>',pulse:'<svg viewBox="0 0 24 24"><path d="M3 12h4l2-5 4 10 2-5h6"/></svg>',star:'<svg viewBox="0 0 24 24"><path d="m12 2 2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2Z"/></svg>',blocks:'<svg viewBox="0 0 24 24"><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="m4 12 8 4 8-4M4 17l8 4 8-4"/></svg>',energy:'<svg viewBox="0 0 24 24"><path d="m13 2-7 11h6l-1 9 7-12h-6l1-8Z"/></svg>',trend:'<svg viewBox="0 0 24 24"><path d="m4 17 5-5 4 3 7-8M16 7h4v4"/></svg>'};return icons[type]||icons.target;
}
function habitsStats(s,week,habits){
  const today=localDateKey(new Date());
  const currentIndex=Math.max(0,week.findIndex(d=>d.key===today));
  const elapsed=week.slice(0,currentIndex+1);
  const doneToday=habits.filter(h=>s.habitSystem.checkins?.[today]?.[h.id]).length;
  const completed=elapsed.reduce((total,day)=>total+habits.filter(h=>s.habitSystem.checkins?.[day.key]?.[h.id]).length,0);
  const possible=Math.max(1,elapsed.length*Math.max(1,habits.length));
  const consistency=Math.round(completed/possible*100);
  const presentDays=elapsed.filter(day=>habits.some(h=>s.habitSystem.checkins?.[day.key]?.[h.id])).length;
  const presence=Math.round(presentDays/Math.max(1,elapsed.length)*100);
  let streak=0;for(let i=currentIndex;i>=0;i--){const day=week[i];if(habits.some(h=>s.habitSystem.checkins?.[day.key]?.[h.id]))streak++;else break}
  return {today,doneToday,consistency,presence,streak,elapsed:elapsed.length};
}
function percent(value,total){return Math.max(0,Math.min(100,Math.round(Number(value||0)/Math.max(1,Number(total||1))*100)))}
function habitStatCard({icon,label,value,detail='',progress=0,tone=''}){return `<article class="habit-v34-stat ${tone}"><span class="habit-v34-stat-icon">${habitMetricGlyph(icon)}</span><div class="habit-v34-stat-copy"><small>${label}</small><div><strong>${value}</strong>${detail?`<em>${detail}</em>`:''}</div></div><span class="habit-v34-stat-line"><i style="width:${Math.max(2,Math.min(100,progress))}%"></i></span></article>`}
function habitsView(){
  let activeTab='tracker';
  const tabCopy={tracker:{title:'Tracker diario',subtitle:'Pequeñas acciones, cambios profundos.'},routine:{title:'Rutina',subtitle:'Diseñá tu día alrededor de lo importante.'},goals:{title:'Metas',subtitle:'Objetivos claros. Progreso medible.'}};
  return{
    title:'Hábitos',
    html:`<main id="app-main" class="habits-world habits-v34" style="--habits-bg:url('${VISUALS.habits}')"><div class="habits-world-shade"></div><div class="habits-v34-shell"><header class="habits-v34-header"><div><p class="eyebrow">HÁBITOS SØD · <span>LOOP DIARIO</span></p><h1 data-habits-title>Tracker diario</h1><p data-habits-subtitle>Pequeñas acciones, cambios profundos.</p></div><nav class="sod-module-tabs habits-v34-tabs"><button class="active" data-habits-tab="tracker">Tracker</button><button data-habits-tab="routine">Rutina</button><button data-habits-tab="goals">Metas</button></nav></header><section id="habits-content" class="habits-v34-content"></section><footer class="habits-v34-footer" aria-hidden="true"><i></i><span>SØD&nbsp;&nbsp;//&nbsp;&nbsp;LOOP DIARIO</span><i></i></footer></div></main>`,
    mount(){
      const content=document.querySelector('#habits-content');const tabs=[...document.querySelectorAll('[data-habits-tab]')];const title=document.querySelector('[data-habits-title]');const subtitle=document.querySelector('[data-habits-subtitle]');
      const renderTracker=()=>{
        const s=state();const week=habitsWeek();const habits=s.habitSystem.habits.filter(h=>h.active);const stats=habitsStats(s,week,habits);
        const month=new Intl.DateTimeFormat('es-AR',{month:'long',year:'numeric'}).format(new Date());
        content.innerHTML=`<section class="habit-v34-tracker-layout"><div class="habit-v34-tracker-main"><div class="habit-v34-stats habit-v34-stats-four">${habitStatCard({icon:'target',label:'HÁBITOS ACTIVOS',value:habits.length,detail:`de ${habits.length}`,progress:100})}${habitStatCard({icon:'check',label:'COMPLETADOS HOY',value:stats.doneToday,detail:`de ${habits.length}`,progress:percent(stats.doneToday,habits.length)})}${habitStatCard({icon:'pulse',label:'CONSISTENCIA SEMANAL',value:`${stats.consistency}%`,detail:'▲ observando',progress:stats.consistency})}${habitStatCard({icon:'star',label:'PRESENCIA',value:`${stats.presence}%`,detail:'no perfección',progress:stats.presence})}</div><section class="habit-v34-panel habit-v34-tracker-card"><div class="habit-v34-table-head"><span>HÁBITO</span>${week.map(day=>`<span class="${day.key===stats.today?'today':''}">${day.label.toUpperCase()}<b>${day.day}</b></span>`).join('')}<div class="habit-v34-month" aria-label="Mes actual">${month}<span>▣</span></div></div><div class="habit-v34-table-body">${habits.map(h=>`<div class="habit-v34-row"><div class="habit-v34-name"><span class="habit-v34-icon">${habitGlyph(h.name,h.category)}</span><div><strong>${escapeHtml(h.name)}</strong><small>${escapeHtml(h.category)}</small></div></div>${week.map(day=>{const done=Boolean(s.habitSystem.checkins?.[day.key]?.[h.id]);return `<button class="habit-v34-check ${done?'done':''} ${day.key===stats.today?'today':''}" data-habit-check="${h.id}" data-day="${day.key}" aria-pressed="${done}" aria-label="${escapeHtml(h.name)} · ${day.label} ${day.day}">${done?'✓':'–'}</button>`}).join('')}</div>`).join('')||'<div class="habit-v34-empty">Todavía no hay hábitos activos.</div>'}</div></section></div><aside class="habit-v34-panel habit-v34-rail"><button class="habit-v34-primary" data-add-habit>＋ Nuevo hábito</button><div class="habit-v34-rail-section"><span class="habit-v34-mini-orb">✣</span><div><p class="eyebrow">ENFOQUE DE LA SEMANA</p><span>Vas bien. La consistencia en pequeños hábitos construye grandes cambios.</span></div></div><div class="habit-v34-rail-section"><span class="habit-v34-mini-orb green">♨</span><div><p class="eyebrow">RACHA ACTUAL</p><strong class="habit-v34-streak">${stats.streak} <small>${stats.streak===1?'día':'días'}</small></strong><span>La racha observa continuidad, no define tu valor.</span></div></div><div class="habit-v34-rail-section"><span class="habit-v34-mini-orb">☆</span><div><p class="eyebrow">CONSEJO</p><span>La constancia no es hacer más, es hacer lo que importa.</span></div></div><button class="habit-v34-secondary" data-open-routine>Ver rutina completa <span>→</span></button></aside></section>`;
        content.querySelectorAll('[data-habit-check]').forEach(button=>button.onclick=()=>{const id=button.dataset.habitCheck,key=button.dataset.day;store.update(x=>{x.habitSystem.checkins[key]??={};x.habitSystem.checkins[key][id]=!x.habitSystem.checkins[key][id];return x});renderTracker()});
        content.querySelector('[data-open-routine]')?.addEventListener('click',()=>{activeTab='routine';render()});
        content.querySelector('[data-add-habit]')?.addEventListener('click',()=>openModal({title:'Nuevo hábito',content:'<form class="form" id="add-habit-form"><div class="field"><label>Hábito<input name="name" required maxlength="80" placeholder="Ej. Caminar 20 minutos"></label></div><div class="field"><label>Categoría<input name="category" maxlength="40" placeholder="Cuerpo, claridad, conocimiento..."></label></div><button class="btn btn-primary">Agregar hábito</button></form>',onMount:(root,close)=>{root.querySelector('form').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);store.update(x=>{x.habitSystem.habits.push({id:`habit-${Date.now()}`,name:String(fd.get('name')).trim(),category:String(fd.get('category')||'Personal').trim(),active:true});return x});close();renderTracker();toast('Hábito agregado')}}}));
      };
      const renderRoutine=()=>{
        const s=state();const routine=s.habitSystem.routine;const habits=s.habitSystem.habits.filter(h=>h.active);const stats=habitsStats(s,habitsWeek(),habits);const night=routine.filter(item=>item.period==='Noche').length;const energy=Math.max(45,Math.min(95,92-Math.max(0,routine.length-4)*4-night*2));const completedBlocks=Math.min(routine.length,Math.round(routine.length*Math.max(.35,stats.consistency/100)));
        content.innerHTML=`<section class="habit-v34-routine"><div class="habit-v34-stats habit-v34-stats-three">${habitStatCard({icon:'blocks',label:'BLOQUES HOY',value:completedBlocks,detail:`de ${routine.length}`,progress:percent(completedBlocks,routine.length)})}${habitStatCard({icon:'pulse',label:'RITMO',value:`${stats.consistency}%`,detail:'▲ semanal',progress:stats.consistency})}${habitStatCard({icon:'energy',label:'ENERGÍA ESTIMADA',value:`${energy}%`,detail:energy>=70?'buena':'a cuidar',progress:energy,tone:'energy'})}</div><div class="habit-v34-routine-layout"><article class="habit-v34-panel habit-v34-routine-editor"><p class="eyebrow">RUTINA EDITABLE</p><div class="habit-v34-routine-list">${routine.map(item=>`<div class="habit-v34-routine-row" data-routine-id="${item.id}"><span class="habit-v34-drag" aria-hidden="true">⠿</span><label class="habit-v34-time"><input type="time" value="${escapeHtml(item.time)}" data-routine-time><span>◷</span></label><div class="habit-v34-routine-title"><span class="habit-v34-icon">${habitGlyph(item.title,item.period)}</span><input value="${escapeHtml(item.title)}" maxlength="100" data-routine-title aria-label="Nombre del bloque"></div><select data-routine-period aria-label="Momento del día"><option ${item.period==='Mañana'?'selected':''}>Mañana</option><option ${item.period==='Tarde'?'selected':''}>Tarde</option><option ${item.period==='Noche'?'selected':''}>Noche</option></select><button class="habit-v34-delete" data-remove-routine aria-label="Eliminar bloque">♲</button></div>`).join('')||'<div class="habit-v34-empty">Tu rutina todavía no tiene bloques.</div>'}</div><div class="habit-v34-add-zone"><button class="habit-v34-primary" data-add-routine>＋ Agregar bloque</button></div></article><aside class="habit-v34-routine-aside"><article class="habit-v34-panel habit-v34-criterion"><p class="eyebrow">CRITERIO</p><h3><span>✳</span> Una rutina no debería encerrarte.</h3><p>Reduce decisiones repetitivas para dejar energía disponible donde realmente la necesitás.</p><ul><li>Menos bloques, mejor sostenidos.</li><li>Protegé sueño y recuperación.</li><li>Dejá espacio para lo inesperado.</li></ul></article><article class="habit-v34-panel habit-v34-energy"><div><p class="eyebrow">ENERGÍA ESTIMADA</p><div class="habit-v34-energy-ring" style="--energy:${energy}"><strong>${energy}%</strong></div></div><div><strong>${energy>=70?'Buena':'A cuidar'}</strong><p>${energy>=70?'Día equilibrado. Sostenible y con margen.':'Hay demasiados bloques. Probá simplificar.'}</p></div></article></aside></div></section>`;
        content.querySelector('[data-add-routine]')?.addEventListener('click',()=>{store.update(x=>{x.habitSystem.routine.push({id:`routine-${Date.now()}`,time:'09:00',title:'Nuevo bloque',period:'Mañana'});return x});renderRoutine()});
        content.querySelectorAll('[data-routine-id]').forEach(row=>{const id=row.dataset.routineId;const save=()=>store.update(x=>{const item=x.habitSystem.routine.find(r=>r.id===id);if(item){item.time=row.querySelector('[data-routine-time]').value;item.title=row.querySelector('[data-routine-title]').value.trim()||'Bloque';item.period=row.querySelector('[data-routine-period]').value}return x});row.querySelectorAll('input,select').forEach(input=>{input.onchange=save});row.querySelector('[data-remove-routine]').onclick=()=>confirmAction('¿Eliminar este bloque de la rutina?',()=>{store.update(x=>{x.habitSystem.routine=x.habitSystem.routine.filter(r=>r.id!==id);return x});renderRoutine()})});
      };
      const renderGoals=()=>{
        const goals=state().habitSystem.goals;const active=goals.filter(g=>Number(g.current)<Number(g.target)).length;const complete=goals.filter(g=>Number(g.current)>=Number(g.target)).length;const avg=goals.length?Math.round(goals.reduce((sum,g)=>sum+percent(g.current,g.target),0)/goals.length):0;
        const goalIcon=goal=>habitGlyph(goal.title,goal.unit);
        content.innerHTML=`<section class="habit-v34-goals"><div class="habit-v34-goals-main"><div class="habit-v34-stats habit-v34-stats-three">${habitStatCard({icon:'target',label:'METAS ACTIVAS',value:active,detail:`de ${goals.length}`,progress:percent(active,goals.length)})}${habitStatCard({icon:'check',label:'CUMPLIDAS',value:complete,detail:`de ${goals.length}`,progress:percent(complete,goals.length),tone:'complete'})}${habitStatCard({icon:'trend',label:'PROGRESO MEDIO',value:`${avg}%`,detail:'▲ en curso',progress:avg})}</div><div class="habit-v34-goal-list">${goals.map(goal=>{const p=percent(goal.current,goal.target);return `<article class="habit-v34-panel habit-v34-goal" data-goal-id="${goal.id}"><span class="habit-v34-goal-icon">${goalIcon(goal)}</span><div class="habit-v34-goal-copy"><h3>${escapeHtml(goal.title)}</h3><p>${escapeHtml(goal.description||'Transformá una intención en una acción medible y sostenida.')}</p><span class="habit-v34-goal-tag">${escapeHtml(goal.cadence||'Meta activa')}</span></div><div class="habit-v34-goal-progress"><div><span>${goal.current} / ${goal.target} ${escapeHtml(goal.unit)}</span><strong>${p}%</strong></div><div class="habit-v34-gradient-progress"><i style="width:${p}%"></i></div><div class="habit-v34-goal-actions"><button data-edit-goal>⌁ Editar</button><button class="danger" data-remove-goal>♲ Eliminar</button></div></div><span class="habit-v34-goal-star">★</span></article>`}).join('')||'<div class="habit-v34-panel habit-v34-empty">Todavía no creaste metas.</div>'}</div></div><aside class="habit-v34-goal-aside"><form class="habit-v34-panel habit-v34-goal-builder" id="goal-builder"><p class="eyebrow">NUEVA META</p><label>Meta<input name="title" required maxlength="100" placeholder="¿Qué querés construir?"></label><label>Objetivo<input name="target" required type="number" min="1" value="10" placeholder="Ej: 10, 4, 12..."></label><label>Unidad<input name="unit" maxlength="30" placeholder="Ej: veces, libros, km..."></label><button class="habit-v34-primary">Crear meta</button></form><article class="habit-v34-panel habit-v34-focus"><span class="habit-v34-mini-orb">✦</span><div><p class="eyebrow">ENFOQUE</p><span>Las pequeñas decisiones sostenidas crean resultados extraordinarios.</span></div><button class="habit-v34-secondary" type="button" data-goal-summary>Ver progreso completo <span>→</span></button></article></aside></section>`;
        const editGoal=(id)=>{const goal=state().habitSystem.goals.find(g=>g.id===id);if(!goal)return;openModal({title:'Editar meta',content:`<form class="form" id="edit-goal-form"><div class="field"><label>Meta<input name="title" required value="${escapeHtml(goal.title)}"></label></div><div class="grid grid-2"><div class="field"><label>Progreso<input name="current" type="number" min="0" value="${goal.current}"></label></div><div class="field"><label>Objetivo<input name="target" type="number" min="1" value="${goal.target}"></label></div></div><div class="field"><label>Unidad<input name="unit" value="${escapeHtml(goal.unit)}"></label></div><button class="btn btn-primary">Guardar cambios</button></form>`,onMount:(root,close)=>{root.querySelector('form').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);store.update(x=>{const target=x.habitSystem.goals.find(g=>g.id===id);if(target){target.title=String(fd.get('title')).trim();target.current=Number(fd.get('current')||0);target.target=Math.max(1,Number(fd.get('target')||1));target.unit=String(fd.get('unit')||'veces').trim()}return x});close();renderGoals();toast('Meta actualizada')}}})};
        content.querySelectorAll('[data-goal-id]').forEach(card=>{const id=card.dataset.goalId;card.querySelector('[data-edit-goal]').onclick=()=>editGoal(id);card.querySelector('[data-remove-goal]').onclick=()=>confirmAction('¿Eliminar esta meta?',()=>{store.update(x=>{x.habitSystem.goals=x.habitSystem.goals.filter(g=>g.id!==id);return x});renderGoals()})});
        content.querySelector('#goal-builder').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);store.update(x=>{x.habitSystem.goals.push({id:`goal-${Date.now()}`,title:String(fd.get('title')).trim(),target:Math.max(1,Number(fd.get('target')||1)),current:0,unit:String(fd.get('unit')||'veces').trim(),cadence:'Meta activa'});return x});renderGoals();toast('Meta creada')};content.querySelector('[data-goal-summary]')?.addEventListener('click',()=>openModal({title:'Progreso de metas',content:`<div class="habit-v399-goal-summary">${goals.length?goals.map(goal=>`<article><div><strong>${escapeHtml(goal.title)}</strong><span>${goal.current} / ${goal.target} ${escapeHtml(goal.unit)}</span></div><div class="progress"><span style="width:${percent(goal.current,goal.target)}%"></span></div><b>${percent(goal.current,goal.target)}%</b></article>`).join(''):'<p class="muted">Todavía no hay metas para resumir.</p>'}</div>`}));
      };
      const render=()=>{const copy=tabCopy[activeTab];title.textContent=copy.title;subtitle.textContent=copy.subtitle;tabs.forEach(tab=>tab.classList.toggle('active',tab.dataset.habitsTab===activeTab));if(activeTab==='tracker')renderTracker();else if(activeTab==='routine')renderRoutine();else renderGoals()};tabs.forEach(tab=>tab.onclick=()=>{activeTab=tab.dataset.habitsTab;render()});render();
    }
  }
}
function dashboardTabMarkup(active){
  return `<nav class="dash-v371-tabs" aria-label="Vistas del Dashboard">
    <a class="${active==='metrics'?'active':''}" href="/dashboard" data-link>Métricas</a>
    <a class="${active==='dreams'?'active':''}" href="/dashboard/suenos" data-link>Mapa de Sueños</a>
    <a class="${active==='community'?'active':''}" href="/dashboard/comunidad" data-link>Comunidad</a>
  </nav>`;
}

function dashboardMetricCard(icon,label,value,delta,detail='vs período anterior'){
  return `<article class="dash-v371-metric"><span>${icon}</span><div><p>${label}</p><strong>${value}</strong><b>${delta}</b><small>${detail}</small></div></article>`;
}

function dashboardWeekKeys(){const today=new Date();const day=(today.getDay()+6)%7;const monday=new Date(today);monday.setDate(today.getDate()-day);return Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return localDateKey(d)})}
function dashboardHabitStats(snapshot){const keys=dashboardWeekKeys();const habits=snapshot.habitSystem?.habits?.filter(h=>h.active)||[];const total=Math.max(1,keys.length*Math.max(1,habits.length));const done=keys.reduce((sum,key)=>sum+habits.filter(h=>snapshot.habitSystem?.checkins?.[key]?.[h.id]).length,0);const days=keys.map(key=>habits.length?Math.round(habits.filter(h=>snapshot.habitSystem?.checkins?.[key]?.[h.id]).length/habits.length*100):0);return {performance:Math.round(done/total*100),days,done,total,keys}}
function dashboardMilestoneState(snapshot,item){const seedsCount=snapshot.collection?.seeds?.length||0;const events=snapshot.mediaProgress?.eventsAttended?.length||0;const codes=snapshot.codes?.length||0;if(item.type==='events')return events>=item.threshold;if(item.type==='codes')return codes>=item.threshold;if(item.type==='combined')return seedsCount+events+codes>=item.threshold;return seedsCount>=item.threshold}
function dashboardSafeImageSrc(value){const raw=String(value||'');if(!/^(https?:\/\/|data:image\/)/i.test(raw))return VISUALS.dreams;return raw.replace(/[\'\"<>\\\n\r]/g,'')}
function dashboardDreamCard(item,{personal=false,featured=false}={}){const safeSrc=escapeHtml(dashboardSafeImageSrc(item.src||VISUALS.dreams));const progress=Math.max(0,Math.min(100,Number(item.progress)||0));return `<article class="dash-v371-dream-card ${featured?'featured':''}" style="--dream-image:url('${safeSrc}')"><div class="dash-v371-dream-shade"></div><span>${escapeHtml(item.category||'Inspiración')}</span><div><h3>${escapeHtml(item.title||'Sueño')}</h3><p>${escapeHtml(item.description||'Una intención que elegiste volver visible.')}</p><footer><i style="width:${progress}%"></i><b>${progress}%</b></footer></div>${personal?`<button data-edit-dream="${escapeHtml(item.id)}" aria-label="Editar sueño">•••</button>`:''}</article>`}


function dashboardView(initialTab='metrics'){
  const allowed=new Set(['metrics','dreams','community']);
  let activeTab=allowed.has(initialTab)?initialTab:'metrics';
  return{
    title:activeTab==='dreams'?'Mapa de Sueños':activeTab==='community'?'Comunidad':'Dashboard',
    html:`<main id="app-main" class="dash-v371-world dash-v399-world"><div class="dash-v371-atmosphere"></div><section id="dashboard-content" class="dash-v371-content"></section></main>`,
    mount(){
      const content=document.querySelector('#dashboard-content');
      const chrome=active=>`<div class="dash-v371-chrome">${dashboardTabMarkup(active)}</div>`;

      const renderMetrics=()=>{
        const snapshot=state();const habit=dashboardHabitStats(snapshot);const seedsCount=(snapshot.collection?.seeds||[]).filter(id=>id.startsWith('elementos-')).length;const codesCount=snapshot.codes?.length||0;const eventsCount=snapshot.mediaProgress?.eventsAttended?.length||0;const videosCount=snapshot.mediaProgress?.videosSeen?.length||0;const bookProgress=Math.round(Object.values(libraryExactProgress).reduce((sum,n)=>sum+n,0)/Math.max(1,Object.values(libraryExactProgress).length));const readingMinutes=Math.round(bookProgress*6.1);const completedDays=habit.days.filter(v=>v>0).length;const currentMilestone=[...dashboardMilestones].reverse().find(item=>dashboardMilestoneState(snapshot,item))||dashboardMilestones[0];const metricDelta=n=>n>0?`↑ ${Math.min(99,Math.max(6,n*5))}%`:'—';
        content.innerHTML=`${chrome('metrics')}<div class="dash-v371-shell metrics dash-v399-shell">
          <section class="dash-v371-hero"><div class="dash-v371-hero-copy"><p class="eyebrow">TU SEÑAL</p><h1>Tu señal está <span>creciendo.</span></h1><p>Cada acción consciente suma. Este espacio vuelve visible lo que ya está ocurriendo en tu recorrido.</p></div><div class="dash-v371-signal" aria-hidden="true"><span></span><i></i><b></b></div><div class="dash-v371-metrics">${dashboardMetricCard('✦','Semillas incorporadas',seedsCount,metricDelta(seedsCount),'estado local')}${dashboardMetricCard('◇','Códigos conservados',codesCount,metricDelta(codesCount),'estado local')}${dashboardMetricCard('▣','Lectura (min)',readingMinutes,`≈ ${Math.max(0,Math.round(bookProgress/4))}%`,'estimación del prototipo')}${dashboardMetricCard('◎','Encuentros guardados',eventsCount,metricDelta(eventsCount),'Comunidad')}</div></section>
          <section class="dash-v371-main-grid"><article class="dash-v371-card consistency"><header><div><small>Consistencia semanal</small><h2>Pequeñas señales,<br>grandes cambios.</h2></div><div class="dash-v371-ring" style="--value:${habit.performance}"><strong>${habit.performance}%</strong><span>semanal</span></div></header><div class="dash-v371-week">${['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'].map((day,i)=>`<div><span>${day}</span><b class="${habit.days[i]>0?'done':''}">${habit.days[i]>=50?'✓':''}</b></div>`).join('')}</div><p>${completedDays>=5?'Tu frecuencia ya está construyendo continuidad.':'La continuidad importa más que la perfección.'}</p></article>
          <article class="dash-v371-card journey"><small>Tu recorrido</small><h2>Una lectura simple de dónde estás.</h2><div>${dashboardMilestones.map(item=>{const done=dashboardMilestoneState(snapshot,item);const current=item.title===currentMilestone.title;return `<section class="${done?'done':''} ${current?'current':''}"><i></i><div><strong>${item.title}</strong><span>${item.copy}</span></div></section>`}).join('')}</div></article>
          <article class="dash-v371-card pulse"><header><div><small>Pulso del ecosistema</small><h2>Las áreas empiezan a conversar.</h2></div></header><svg viewBox="0 0 620 190" preserveAspectRatio="none" aria-label="Pulso de señales"><path class="grid" d="M0 35H620M0 85H620M0 135H620M0 185H620"/><path class="a" d="M0 145 C80 105 125 145 190 108 S300 75 360 104 S475 45 620 72"/><path class="b" d="M0 118 C80 55 145 63 210 92 S330 132 395 80 S500 92 620 58"/><path class="c" d="M0 158 C90 150 160 139 235 130 S395 118 460 93 S550 103 620 118"/></svg><footer><span><i></i>Lectura <b>${readingMinutes} min</b></span><span><i></i>Videos <b>${videosCount}</b></span><span><i></i>Semillas <b>${seedsCount}</b></span><span><i></i>Códigos <b>${codesCount}</b></span></footer></article></section>
          <section class="dash-v371-bottom"><article class="dash-v371-insights">${[`Consistencia semanal: ${habit.performance}%.`,seedsCount?`Incorporaste ${seedsCount} Semilla${seedsCount===1?'':'s'}.`:'Todavía no incorporaste Semillas.',eventsCount?`Guardaste ${eventsCount} encuentro${eventsCount===1?'':'s'}.`:'Comunidad todavía no forma parte de tu recorrido.'].map((text,i)=>`<div><span>${['✦','◈','◎'][i]}</span><p>${text}<br><small>${['Cada pequeño paso construye dirección.','Una colección tiene sentido cuando representa elecciones.','La conexión amplía perspectiva cuando tiene sentido.'][i]}</small></p></div>`).join('')}</article><article class="dash-v371-intention"><div><small>Intención sugerida</small><blockquote>“${escapeHtml(snapshot.dashboardSystem?.intention||'Hoy elijo ser canal de claridad y propósito.')}”</blockquote><button data-set-dashboard-intention>${snapshot.dashboardSystem?.intentionSet?'Intención activa ✓':'Establecer como intención →'}</button></div><i></i></article></section>
        </div>`;
        content.querySelector('[data-set-dashboard-intention]')?.addEventListener('click',()=>{store.update(x=>{x.dashboardSystem.intentionSet=!x.dashboardSystem.intentionSet;return x});renderMetrics()});
      };

      const renderDreams=()=>{
        const snapshot=state();const personal=snapshot.visionBoard?.items||[];const all=[...personal,...dashboardDreamSamples.filter(sample=>!personal.some(item=>item.id===sample.id))];const filter=snapshot.dashboardSystem?.dreamFilter||'Todos';const visible=filter==='Todos'?all:all.filter(item=>item.category===filter);const featured=visible.find(item=>item.featured)||visible[0]||dashboardDreamSamples[0];const rest=visible.filter(item=>item.id!==featured.id).slice(0,6);const categories=['Todos',...new Set(all.map(item=>item.category).filter(Boolean))];const counts=[...new Set(all.map(item=>item.category))].slice(0,5).map(cat=>[cat,all.filter(item=>item.category===cat).length]);
        content.innerHTML=`${chrome('dreams')}<div class="dash-v371-shell dreams dash-v399-shell"><header class="dash-v371-page-head"><div><h1>Mapa de <span>Sueños</span></h1><p>Volvé visible la vida que querés construir para poder decidir con dirección.</p></div><button data-new-intention>＋ Nueva intención</button></header><div class="dash-v371-dream-controls"><button data-dream-filters>☷ Filtros${filter!=='Todos'?` · ${escapeHtml(filter)}`:''}</button></div><section class="dash-v371-dream-grid"><div class="dash-v371-dream-featured">${dashboardDreamCard(featured,{personal:personal.some(x=>x.id===featured.id),featured:true})}</div><article class="dash-v371-dream-summary"><small>Resumen de mi mapa</small><div><strong>${all.length}</strong><span>Sueños visibles</span></div><ul>${counts.map(([cat,count])=>`<li>${escapeHtml(cat)} <b>${count}</b></li>`).join('')}</ul></article>${rest.map(item=>dashboardDreamCard(item,{personal:personal.some(x=>x.id===item.id)})).join('')||'<article class="dash-v371-dream-empty"><strong>Tu mapa está listo para crecer.</strong><p>Agregá una intención que quieras volver visible.</p></article>'}</section><footer class="dash-v371-dream-footer"><span>✦</span><p><strong>Tu visión, organizada. Tus sueños, en movimiento.</strong><br>Revisá y actualizá lo que sigue teniendo sentido.</p></footer></div>`;
        const addDream=payload=>{store.update(x=>{x.visionBoard.items=[...(x.visionBoard.items||[]),{id:`dream-${Date.now()}`,progress:0,personal:true,...payload}];return x});renderDreams()};
        content.querySelector('[data-new-intention]')?.addEventListener('click',()=>openModal({title:'Nueva intención',content:`<form class="form" id="dash-dream-form"><div class="field"><label>Título<input name="title" required maxlength="100" placeholder="¿Qué querés volver visible?"></label></div><div class="field"><label>Categoría<select name="category"><option>Familia</option><option>Hogar</option><option>Proyectos</option><option>Experiencias</option><option>Viajes</option><option>Crecimiento</option><option>Intención principal</option></select></label></div><div class="field"><label>Descripción<textarea name="description" maxlength="260"></textarea></label></div><div class="field"><label>Imagen por URL<input name="src" type="url" placeholder="https://..."></label></div><div class="field"><label>O subir foto<input name="file" type="file" accept="image/*"></label></div><div class="field"><label>Progreso<input name="progress" type="range" min="0" max="100" value="10"></label></div><button class="btn btn-primary">Agregar al mapa</button></form>`,onMount:(root,close)=>{root.querySelector('form').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const file=fd.get('file');const base={title:String(fd.get('title')).trim(),category:String(fd.get('category')),description:String(fd.get('description')||''),progress:Number(fd.get('progress')||0),featured:String(fd.get('category'))==='Intención principal'};if(file&&file.size){if(file.size>900000){toast('Usá imágenes menores a 900 KB en esta maqueta.','error');return}const reader=new FileReader();reader.onload=()=>{addDream({...base,src:String(reader.result)});close()};reader.readAsDataURL(file)}else{addDream({...base,src:String(fd.get('src')||VISUALS.dreams)});close()}}}}));
        content.querySelector('[data-dream-filters]')?.addEventListener('click',()=>openModal({title:'Filtrar sueños',content:`<div class="dash-v371-filter-options">${categories.map(cat=>`<button class="btn ${cat===filter?'btn-primary':''}" data-dream-filter-value="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join('')}</div>`,onMount:(root,close)=>root.querySelectorAll('[data-dream-filter-value]').forEach(btn=>btn.onclick=()=>{store.update(x=>{x.dashboardSystem.dreamFilter=btn.dataset.dreamFilterValue;return x});close();renderDreams()})}));
        content.querySelectorAll('[data-edit-dream]').forEach(button=>button.onclick=()=>{const item=personal.find(x=>x.id===button.dataset.editDream);if(!item)return;openModal({title:'Editar sueño',content:`<form class="form" id="edit-dream-form"><div class="field"><label>Título<input name="title" maxlength="100" value="${escapeHtml(item.title)}"></label></div><div class="field"><label>Descripción<textarea name="description" maxlength="260">${escapeHtml(item.description||'')}</textarea></label></div><div class="field"><label>Progreso<input name="progress" type="range" min="0" max="100" value="${Number(item.progress)||0}"></label></div><div class="actions"><button class="btn btn-primary">Guardar</button><button type="button" class="btn btn-danger" data-remove>Eliminar</button></div></form>`,onMount:(root,close)=>{root.querySelector('form').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);store.update(x=>{x.visionBoard.items=x.visionBoard.items.map(d=>d.id===item.id?{...d,title:String(fd.get('title')).trim()||d.title,description:String(fd.get('description')||''),progress:Number(fd.get('progress')||0)}:d);return x});close();renderDreams()};root.querySelector('[data-remove]').onclick=()=>{store.update(x=>{x.visionBoard.items=x.visionBoard.items.filter(d=>d.id!==item.id);return x});close();renderDreams()}}})});
      };

      const renderCommunity=()=>{
        const snapshot=state();const c=dashboardCommunity;const event=c.event;const saved=(snapshot.mediaProgress?.eventsAttended||[]).includes(event.id);
        const socialSvg=key=>({x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4 5 20"/></svg>',youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10 9 5 3-5 3Z"/></svg>',instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17.2" cy="6.8" r=".8"/></svg>',tiktok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4v10.5a4 4 0 1 1-3-3.88M14 4c.7 3 2.2 4.3 5 4.7"/></svg>',linkedin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9v10M6 5.5v.1M10.5 19v-6.2c0-2.2 3.5-3.2 5-1.2.7.9.5 2.5.5 3.8V19M10.5 10v9"/></svg>',telegram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 17-7-4 16-5-5-3 3 1-6 7-5-9 7Z"/></svg>'}[key]||'<span>↗</span>');
        const socialCard=link=>`<a class="dash-v399-social-card ${link.primary?'primary':''}" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer"><span class="dash-v399-social-icon">${socialSvg(link.key)}</span><div><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.handle)}</small></div><b>↗</b></a>`;
        content.innerHTML=`${chrome('community')}<div class="dash-v371-shell community dash-v399-shell"><section class="dash-v399-community-hero"><div><p class="eyebrow">COMUNIDAD SØD · PREVIEW</p><h1>Encontrá personas que <span>resuenan.</span></h1><p>La comunidad real se conectará en V4. Mientras tanto, este espacio reúne los accesos oficiales, próximos encuentros y las primeras capas que después recibirán identidad y métricas reales.</p><div><a class="btn btn-primary" href="https://t.me/sodecosystem" target="_blank" rel="noopener noreferrer">Entrar a Telegram ↗</a><button class="btn" data-scroll-social>Ver redes oficiales</button></div></div><i aria-hidden="true"></i></section>
        <section class="dash-v399-community-core"><article class="dash-v399-event"><div class="dash-v399-event-image" style="--event-image:url('${event.image}')"></div><div><p class="eyebrow">PRÓXIMO ENCUENTRO</p><h2>${escapeHtml(event.title)}</h2><p>${escapeHtml(event.description)}</p><div class="actions"><button class="btn btn-primary" data-save-community-event>${saved?'Guardado ✓':'Guardar en mi recorrido'}</button><a class="btn" href="${event.detailsUrl}" target="_blank" rel="noopener noreferrer">Comunidad ↗</a></div></div></article><article class="dash-v399-circles"><header><p class="eyebrow">CÍRCULOS</p><h2>Espacios que llegarán con V4.</h2></header>${c.circles.map(circle=>`<section><span>✦</span><div><strong>${escapeHtml(circle.title)}</strong><p>${escapeHtml(circle.description)}</p></div><small>${escapeHtml(circle.status)}</small></section>`).join('')}</article></section>
        <section class="dash-v399-socials" id="official-socials"><header><div><p class="eyebrow">RED OFICIAL</p><h2>Seguí el ecosistema fuera de la app.</h2></div><p>Usamos enlaces directos sin cargar widgets sociales de terceros dentro de SØD. Menos trackers, menos ruido y menos puntos de falla.</p></header><div>${officialSocialLinks.map(socialCard).join('')}</div></section></div>`;
        content.querySelector('[data-save-community-event]')?.addEventListener('click',()=>{store.update(x=>{const list=new Set(x.mediaProgress.eventsAttended||[]);saved?list.delete(event.id):list.add(event.id);x.mediaProgress.eventsAttended=[...list];return x});renderCommunity()});content.querySelector('[data-scroll-social]')?.addEventListener('click',()=>content.querySelector('#official-socials')?.scrollIntoView({behavior:'smooth',block:'start'}));
      };

      const render=()=>{if(activeTab==='metrics')renderMetrics();else if(activeTab==='dreams')renderDreams();else renderCommunity()};
      document.documentElement.classList.add('dashboard-v371-active','dashboard-v399-active');document.querySelector('.install-banner')?.remove();render();return()=>document.documentElement.classList.remove('dashboard-v371-active','dashboard-v399-active');
    }
  }
}



function marketplaceView(){return{title:'La Forja',html:`<main id="app-main" class="visual-page" style="--visual-bg:url('${visual('046')}')"><div class="visual-page-shade"></div><div class="visual-page-content">${pageHero('LA FORJA · PRÓXIMAMENTE','Recursos para continuar.<br><span style="color:var(--gold)">Nunca el centro del viaje.</span>','La Forja permanecerá en la periferia del ecosistema y solo ofrecerá herramientas, experiencias y creadores alineados con la constitución de SØD.')}<section class="section" style="padding-top:10px"><div class="container"><article class="card"><div class="card-body"><span class="pill">CAPA FUTURA</span><h2 style="font-size:42px;margin-top:24px">Todavía no abrimos esta puerta.</h2><p class="lead">No inventamos contratos, precios, supply ni propiedad. El crecimiento personal no será interrumpido por promociones dentro del Hub.</p><a class="btn" href="/hub" data-link>Volver al Hub</a></div></article></div></section></div></main>`}}

function profileView(){const s=state();const completion=s.journey.completedDays.length;return{title:'Identidad',html:`<main id="app-main" class="visual-page" style="--visual-bg:url('${visual('055')}')"><div class="visual-page-shade"></div><div class="visual-page-content">${pageHero('IDENTIDAD','¿Quién sos hoy?','Identidad no es Ajustes. Es una representación revisable de tu historia, valores, dirección y forma de ser acompañado.')}<section class="section" style="padding-top:10px"><div class="container"><div class="grid grid-4"><article class="card metric"><span class="eyebrow">RECORRIDO</span><strong>${completion}</strong><span class="muted">integraciones</span></article><article class="card metric"><span class="eyebrow">SEMILLAS</span><strong>${s.collection.seeds.length}</strong><span class="muted">descubiertas</span></article><article class="card metric"><span class="eyebrow">CÓDIGOS</span><strong>${(s.codes||[]).length}</strong><span class="muted">momentos conservados</span></article><article class="card metric"><span class="eyebrow">HISTORIAL LOCAL</span><strong>${Math.floor((s.dialogue||[]).length/2)}</strong><span class="muted">capítulos anteriores</span></article></div><div class="grid grid-2" style="margin-top:18px"><article class="card"><div class="card-body"><h2>${escapeHtml(s.profile.name)}</h2><p class="muted">Esta identidad debe evolucionar con vos y nunca convertirse en una etiqueta fija o un diagnóstico.</p><div class="actions"><a class="btn btn-primary" href="/dashboard" data-link>Abrir Dashboard</a><a class="btn" href="/semillas/tesoros" data-link>Tesoros</a></div></div></article><article class="card"><div class="card-body"><h2>Control</h2><p class="muted">La memoria debe poder revisarse, corregirse, exportarse y olvidarse.</p><div class="actions"><a class="btn" href="/tools" data-link>Abrir Tools</a><a class="btn" href="/privacidad" data-link>Privacidad y memoria</a></div></div></article></div></div></section></div></main>`}}

function toolsView(){
  let activeTab='settings';
  return{
    title:'Tools',
    html:`<main id="app-main" class="tools-world tools-v399" style="--tools-bg:url('${visual('061')}')"><div class="tools-shade"></div><div class="container tools-shell"><header class="tools-header"><div><p class="eyebrow">TOOLS SØD</p><h1>Control, navegación<br><span>y acceso.</span></h1></div><nav class="sod-module-tabs" aria-label="Tools"><button class="active" data-tools-tab="settings">Ajustes</button><button data-tools-tab="navigation">Navegación</button><button data-tools-tab="subscription">Suscripción</button></nav></header><section id="tools-content"></section></div></main>`,
    mount(){
      const content=document.querySelector('#tools-content');
      const tabs=[...document.querySelectorAll('[data-tools-tab]')];
      const applyVisualSettings=()=>{const settings=state().settings;document.body.classList.toggle('high-contrast',!!settings.highContrast);document.body.classList.toggle('reduce-effects',!!settings.reduceEffects)};
      const renderSettings=()=>{
        const s=state();
        const installReady=Boolean(window.__sodInstallPrompt);
        content.innerHTML=`<section class="tools-settings-grid tools-v399-settings"><article><p class="eyebrow">EXPERIENCIA</p><h2>Ajustes</h2>${[['audio','Audio ambiental','Siempre opt-in.'],['motion','Movimiento dinámico','Podés reducirlo cuando necesites menos estímulo.'],['highContrast','Alto contraste','Refuerza lectura, bordes y foco.'],['reduceEffects','Reducir efectos','Reduce blur y recursos decorativos.']].map(([key,label,copy])=>`<div class="tool-setting-row"><span><strong>${label}</strong><small>${copy}</small></span><button class="switch ${s.settings[key]?'on':''}" data-tools-toggle="${key}" role="switch" aria-checked="${s.settings[key]}"><span></span></button></div>`).join('')}<div class="tool-setting-row"><span><strong>Calidad gráfica</strong><small>Equilibrio entre inmersión y rendimiento.</small></span><select id="tools-quality"><option value="auto" ${s.settings.quality==='auto'?'selected':''}>Automática</option><option value="low" ${s.settings.quality==='low'?'selected':''}>Esencial</option><option value="high" ${s.settings.quality==='high'?'selected':''}>Alta</option></select></div><div class="tool-setting-row"><span><strong>Volumen ambiente</strong><small>Solo afecta el audio de SØD.</small></span><input id="tools-volume" type="range" min="0" max="1" step="0.05" value="${Number(s.settings.ambientVolume)||0}"></div></article><article class="tools-danger"><p class="eyebrow">DISPOSITIVO</p><h2>Control local</h2><p>Hasta V4, hábitos, sueños, Tesoros, preferencias y señales del recorrido viven solamente en este dispositivo.</p><div class="tools-local-actions"><a class="btn" href="/privacidad" data-link>Privacidad y memoria</a><button class="btn" data-manual-install ${installReady?'':'disabled'}>${installReady?'Instalar SØD':'Instalar desde el navegador'}</button></div><small class="muted">No mostramos banners automáticos de instalación. ${installReady?'Tu navegador habilitó la instalación manual.':'Si tu navegador permite instalar PWA, usá su menú de instalación.'}</small><button class="btn btn-danger" data-tools-reset>Restablecer datos locales</button></article></section>`;
        content.querySelectorAll('[data-tools-toggle]').forEach(button=>button.onclick=async()=>{const key=button.dataset.toolsToggle;const value=!state().settings[key];store.update(x=>{x.settings[key]=value;return x});if(key==='audio'){if(value)await ambient.start(state().settings.ambientVolume);else ambient.stop()}applyVisualSettings();renderSettings();toast('Preferencia actualizada')});
        content.querySelector('#tools-quality').onchange=e=>{store.update(x=>{x.settings.quality=e.target.value;return x});toast('Calidad actualizada')};
        content.querySelector('#tools-volume').oninput=e=>{const value=Number(e.target.value);store.update(x=>{x.settings.ambientVolume=value;return x});ambient.setVolume(value)};
        content.querySelector('[data-manual-install]')?.addEventListener('click',async()=>{const prompt=window.__sodInstallPrompt;if(!prompt){toast('Usá la opción “Instalar app” de tu navegador.');return}try{await prompt.prompt();await prompt.userChoice;window.__sodInstallPrompt=null;toast('Solicitud de instalación procesada');renderSettings()}catch{toast('La instalación no está disponible en este momento.','error')}});
        content.querySelector('[data-tools-reset]').onclick=()=>confirmAction('Esto restablecerá onboarding, hábitos, sueños, Tesoros y preferencias locales.',()=>{store.reset();try{sessionStorage.removeItem('sod-guest-conversation-session-v1')}catch{}toast('Datos locales restablecidos');navigate('/')});
      };
      const renderNavigation=()=>{
        const links=[
          ['/hub','Hub Central','Tu punto de orientación.'],
          ['/experiencia','Hablar con SØD','Conversación de claridad.'],
          ['/biblioteca','Biblioteca','Libros y videos curados.'],
          ['/semillas','Semillas','Presentación, Mercado y Tesoros.'],
          ['/habitos','Hábitos','Tracker, rutina y metas.'],
          ['/dashboard','Dashboard','Métricas, sueños y comunidad.']
        ];
        content.innerHTML=`<section class="tools-navigation tools-v399-navigation"><div class="tools-navigation-intro"><p class="eyebrow">MAPA DE NAVEGACIÓN</p><h2>Una función, un lugar, una razón.</h2><p>El Hub contiene los cuatro mundos visibles; SØD ocupa el núcleo; Tools existe solamente como capa de control. Las rutas históricas permanecen por compatibilidad, no como navegación primaria.</p></div><div class="tools-navigation-grid">${links.map(([href,title,copy],i)=>`<a href="${href}" data-link><span>${String(i+1).padStart(2,'0')}</span><div><strong>${title}</strong><small>${copy}</small></div><b>→</b></a>`).join('')}</div><article class="oun-map"><p class="eyebrow">OUN · PRIMER RECORRIDO</p><div><span>Landing</span><i>→</i><span>Acceso local</span><i>→</i><span>Calibración</span><i>→</i><span>Hub</span><i>→</i><span>Hablar con SØD</span></div><small>V4 reemplazará el acceso local por Auth real y sincronización.</small></article></section>`;
      };
      const renderSubscription=()=>{
        const subscription=state().subscription||{plan:'free',premiumInterest:false};
        content.innerHTML=`<section class="subscription-grid tools-v399-subscription"><article class="subscription-card active"><p class="eyebrow">ACTUAL</p><h2>SØD Free</h2><strong>$0</strong><ul><li>Hub y mundos principales</li><li>Biblioteca curada</li><li>Hábitos y sueños locales</li><li>Semillas · Elementos</li></ul><button class="btn" disabled>Plan actual</button></article><article class="subscription-card premium"><p class="eyebrow">V4 · PRÓXIMAMENTE</p><h2>SØD Premium</h2><strong>Precio por definir</strong><ul><li>Memoria longitudinal</li><li>SØD con IA real</li><li>Sincronización multidispositivo</li><li>Infraestructura y experiencias avanzadas</li></ul><button class="btn btn-primary ${subscription.premiumInterest?'active':''}" data-premium-interest>${subscription.premiumInterest?'Interés registrado ✓':'Quiero enterarme'}</button></article><article class="subscription-note"><span>Ø</span><h3>Premium amplía continuidad, no vende transformación.</h3><p>La arquitectura de pagos y entitlements llegará con backend. Esta carcasa no simula una suscripción que todavía no existe.</p></article></section>`;
        content.querySelector('[data-premium-interest]').onclick=()=>{store.update(x=>{x.subscription.premiumInterest=!x.subscription.premiumInterest;return x});renderSubscription();toast(state().subscription.premiumInterest?'Interés en Premium guardado localmente':'Interés eliminado')};
      };
      const render=()=>{tabs.forEach(tab=>tab.classList.toggle('active',tab.dataset.toolsTab===activeTab));if(activeTab==='settings')renderSettings();else if(activeTab==='navigation')renderNavigation();else renderSubscription()};
      tabs.forEach(tab=>tab.onclick=()=>{activeTab=tab.dataset.toolsTab;render()});applyVisualSettings();render();
    }
  }
}

function privacyView(){return{title:'Privacidad',html:`<main id="app-main">${pageHero('PRIVACIDAD','La introspección no debe convertirse<br><span style="color:var(--cyan)">en materia prima de vigilancia.</span>','Política funcional del MVP y límites que la arquitectura debe conservar.')}<section class="section" style="padding-top:10px"><div class="container grid grid-2"><article class="card"><div class="card-body"><h2>Qué se guarda</h2><p class="muted">Preferencias, progreso y colección se guardan localmente. La conversación invitada usa una sesión temporal del navegador; todavía no existe sincronización longitudinal entre dispositivos.</p></div></article><article class="card"><div class="card-body"><h2>Qué no se envía</h2><p class="muted">El texto privado de diálogos y bitácora no se envía a analytics. Esta versión no incorpora trackers de terceros.</p></div></article><article class="card"><div class="card-body"><h2>Límites de SØD</h2><p class="muted">El diálogo es reflexión guiada, no terapia, diagnóstico, asesoramiento médico, legal ni autoridad absoluta.</p></div></article><article class="card"><div class="card-body"><h2>Control</h2><p class="muted">Podés borrar el estado local desde Configuración y eliminar registros individuales de la Bitácora.</p><a class="btn btn-small" href="/tools" data-link>Abrir Tools</a></div></article></div></section></main>`}}

function adminView(){return{title:'Admin',html:`<main id="app-main">${pageHero('ADMIN · LOCAL FIRST','Contenido operativo<br><span style="color:var(--cyan)">sin tocar componentes.</span>','Panel básico para editar mensaje, clave y anuncio. En producción debe protegerse por roles y sesiones reales.')}<section class="section" style="padding-top:10px"><div class="container grid grid-2"><article class="card"><div class="card-body"><h2>Contenido del Hub</h2><form class="form" id="admin-form"><div class="field"><label for="dailyMessage">Mensaje diario</label><textarea id="dailyMessage" name="dailyMessage"></textarea></div><div class="field"><label for="dailyKey">Clave del día</label><input id="dailyKey" name="dailyKey" maxlength="180"></div><div class="field"><label for="announcement">Anuncio</label><textarea id="announcement" name="announcement"></textarea></div><button class="btn btn-primary">Guardar cambios en este dispositivo</button></form></div></article><article class="card"><div class="card-body"><h2>Estado del contenido</h2><table class="admin-table"><tbody><tr><th>Universos</th><td>${universes.length} activos</td></tr><tr><th>Semillas base</th><td>${seeds.length}</td></tr><tr><th>Elementos 33</th><td>${elementPieces.length}</td></tr><tr><th>Journeys</th><td>1 · 14 días</td></tr><tr><th>Blockchain</th><td>Feature flag apagado</td></tr><tr><th>LLM</th><td>Adaptador scripted</td></tr></tbody></table><div class="divider"></div><p class="muted">Importación JSON/CSV, versionado editorial, media manager y RBAC quedan documentados como siguiente iteración real.</p></div></article></div></section></main>`,mount(){const form=document.querySelector('#admin-form');api.getAdmin().then(r=>{form.dailyMessage.value=r.content.dailyMessage||'';form.dailyKey.value=r.content.dailyKey||'';form.announcement.value=r.content.announcement||''}).catch(err=>toast(err.message,'error'));form.onsubmit=async e=>{e.preventDefault();const fd=new FormData(form);try{await api.saveAdmin(Object.fromEntries(fd));toast('Contenido publicado')}catch(err){toast(err.message,'error')}}}}}

function renderChatText(value=''){
  const escaped=escapeHtml(value).replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  const lines=escaped.split(/\r?\n/);
  let html='',listOpen=false;
  for(const raw of lines){
    const line=raw.trim();
    const bullet=line.match(/^[-*]\s+(.+)/);
    if(bullet){if(!listOpen){html+='<ul>';listOpen=true}html+=`<li>${bullet[1]}</li>`;continue}
    if(listOpen){html+='</ul>';listOpen=false}
    if(line)html+=`<p>${line}</p>`;
  }
  if(listOpen)html+='</ul>';
  return html||'<p></p>';
}

function chatTime(value){
  try{return new Date(value||Date.now()).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}catch{return ''}
}

function codedOrbMarkup(size='default'){
  return `<span class="sod-coded-orb ${size==='small'?'small':''}" aria-hidden="true"><i></i><b></b></span>`;
}

function chatMessageTemplate(message){
  const isUser=message.role==='user';
  const roleLabel=isUser?'Vos':'SØD';
  return `<article class="sod-conversation-message ${isUser?'user':'assistant'} ${message.status==='error'?'error':''}" data-message-id="${escapeHtml(message.id)}">
    ${isUser?'':`<div class="sod-message-avatar">${codedOrbMarkup('small')}</div>`}
    <div class="sod-message-bubble">
      <div class="sod-message-meta"><time>${chatTime(message.createdAt)}</time><strong>${roleLabel}</strong>${message.legacy?'<span>historial local</span>':''}</div>
      <div class="sod-message-copy">${renderChatText(message.text)}</div>
      ${message.status==='error'?`<div class="sod-message-error"><span>No se pudo enviar.</span><button class="btn btn-small" data-retry-message="${escapeHtml(message.id)}">Reintentar</button></div>`:''}
    </div>
    ${isUser?`<span class="sod-user-avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6"/></svg></span>`:''}
  </article>`;
}

const oracleIcon=(type)=>({
  menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="1.25"/><circle cx="12" cy="12" r="1.25"/><circle cx="18" cy="12" r="1.25"/></svg>',
  expand:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>',
  close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>',
  plus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  chat:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14v10H9l-4 3v-13Z"/><path d="M8 9h8M8 12h6"/></svg>',
  history:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6"/><path d="M4 4v4.6h4.6M12 8v4l2.7 1.7"/></svg>',
  back:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5-7 7 7 7"/></svg>'
}[type]||'');

function conversationSurfaceMarkup({overlay=false,mode='floating'}={}){
  const fullscreen=mode==='fullscreen';
  const panel=`<div class="sod-conversation-window ${fullscreen?'is-fullscreen':'is-floating'}">
    <header class="sod-conversation-topbar">
      ${fullscreen?`<button class="sod-chat-icon-button" data-sidebar-toggle type="button" aria-label="Mostrar u ocultar conversaciones">${oracleIcon('menu')}</button>`:`<button class="sod-chat-icon-button" data-history-toggle type="button" aria-label="Chats anteriores">${oracleIcon('menu')}</button>`}
      <div class="sod-chat-wordmark"><span>HABLAR CON</span><strong>SØD</strong></div>
      ${fullscreen?`<a class="sod-chat-icon-button" href="/hub" data-link aria-label="Volver al Hub">${oracleIcon('back')}</a>`:`<button class="sod-chat-icon-button" data-conversation-expand type="button" aria-label="Abrir chat en pantalla completa">${oracleIcon('expand')}</button>`}
    </header>
    <div class="sod-conversation-presence">
      ${codedOrbMarkup()}
      <p><strong>SØD está presente.</strong><span>¿Qué necesitás hoy?</span></p>
    </div>
    <div class="sod-conversation-scroll" data-chat-scroll>
      <div class="sod-conversation-stream" data-chat-stream role="log" aria-live="polite" aria-relevant="additions text"></div>
    </div>
    <div class="sod-conversation-status" data-typing-status hidden><span></span>SØD está escribiendo...</div>
    <div class="sod-conversation-composer-zone">
      <form class="sod-conversation-composer" data-chat-form>
        <textarea data-chat-input rows="1" maxlength="6000" placeholder="Escribe tu mensaje..." aria-label="Mensaje para SØD"></textarea>
        <button class="sod-conversation-send" type="submit" aria-label="Enviar mensaje"><span>↑</span></button>
      </form>
      <div class="sod-active-presence"><span></span>PRESENCIA ACTIVA</div>
    </div>
    ${!fullscreen?`<aside class="sod-floating-history" data-oracle-history aria-label="Chats anteriores"><div class="sod-floating-history-head"><strong>Conversaciones</strong><button type="button" data-history-close aria-label="Cerrar historial">×</button></div><button class="sod-history-new" type="button" data-new-conversation>${oracleIcon('plus')}<span>Nueva conversación</span></button><div class="sod-floating-history-list" data-history-list></div></aside>`:''}
  </div>`;
  if(fullscreen){
    return `<section class="sod-chat-ui sod-chat-ui--fullscreen" data-sod-conversation>
      <aside class="sod-chat-sidebar" data-chat-sidebar>
        <div class="sod-chat-sidebar-brand">${codedOrbMarkup('small')}<div><strong>SØD</strong><span>CONVERSACIONES</span></div></div>
        <button class="sod-sidebar-new" type="button" data-new-conversation>${oracleIcon('plus')}<span>Nueva conversación</span></button>
        <div class="sod-sidebar-section"><p>AHORA</p><button class="sod-sidebar-current active" type="button" data-current-conversation>${oracleIcon('chat')}<span><strong>Conversación actual</strong><small data-current-count>0 mensajes</small></span></button></div>
        <div class="sod-sidebar-section sod-sidebar-history-section"><p>HISTORIAL</p><div class="sod-sidebar-history" data-history-list></div></div>
        <div class="sod-sidebar-footer"><a href="/hub" data-link>${oracleIcon('back')}<span>Volver al Hub</span></a><small>Historial local de esta maqueta</small></div>
      </aside>
      <main class="sod-chat-full-main">${panel}</main>
    </section>`;
  }
  return `<section class="sod-chat-ui sod-chat-ui--overlay" data-sod-conversation ${overlay?'hidden aria-hidden="true"':''}>
    <div class="sod-chat-scrim" aria-hidden="true"></div>
    ${panel}
    <button class="sod-chat-overlay-close" data-conversation-close type="button" aria-label="Cerrar conversación">${oracleIcon('close')}</button>
  </section>`;
}

function mountConversationSurface(root,{onClose=null,fullscreen=false}={}){
  if(!root)return()=>{};
  const stream=root.querySelector('[data-chat-stream]');
  const scroll=root.querySelector('[data-chat-scroll]');
  const form=root.querySelector('[data-chat-form]');
  const input=root.querySelector('[data-chat-input]');
  const sendButton=root.querySelector('.sod-conversation-send');
  const typingStatus=root.querySelector('[data-typing-status]');
  const history=root.querySelector('[data-oracle-history]');
  const historyLists=[...root.querySelectorAll('[data-history-list]')];
  const currentCount=root.querySelector('[data-current-count]');
  const sidebar=root.querySelector('[data-chat-sidebar]');
  const HISTORY_KEY='sod-oracle-history-preview-v2';
  let draft='';
  let lastMessageCount=-1;
  let previewItem=null;

  const readHistory=()=>{try{return JSON.parse(sessionStorage.getItem(HISTORY_KEY)||'[]').slice(0,24)}catch{return[]}};
  const writeHistory=items=>{try{sessionStorage.setItem(HISTORY_KEY,JSON.stringify(items.slice(0,24)))}catch{}};
  const controller=createConversationController({api,sessionProvider,legacyMessages:store.get().dialogue||[],onChange:render});
  const archiveCurrent=()=>{
    const snapshot=controller.getState();
    if(!snapshot.messages.length)return;
    const first=snapshot.messages.find(item=>item.role==='user')?.text||'Conversación de claridad';
    const item={id:`history-${Date.now()}`,title:first.slice(0,64),createdAt:new Date().toISOString(),messages:snapshot.messages.slice(-40)};
    writeHistory([item,...readHistory()]);
  };
  const historyItemMarkup=item=>`<button class="sod-history-item ${previewItem?.id===item.id?'active':''}" type="button" data-history-id="${escapeHtml(item.id)}"><span class="sod-history-dot"></span><span><strong>${escapeHtml(item.title)}</strong><small>${formatDate(item.createdAt)}</small></span></button>`;
  const renderHistory=()=>{
    const items=readHistory();
    historyLists.forEach(list=>{
      list.innerHTML=items.length?items.map(historyItemMarkup).join(''):'<div class="sod-history-empty">Tus conversaciones anteriores aparecerán acá.</div>';
      list.querySelectorAll('[data-history-id]').forEach(button=>button.onclick=()=>{
        previewItem=items.find(entry=>entry.id===button.dataset.historyId)||null;
        render(controller.getState());
        history?.classList.remove('open');
      });
    });
    if(currentCount){const n=controller.getState().messages.length;currentCount.textContent=`${n} ${n===1?'mensaje':'mensajes'}`;}
  };
  function isNearBottom(){return scroll.scrollHeight-scroll.scrollTop-scroll.clientHeight<120}
  function resizeComposer(){input.style.height='auto';input.style.height=`${Math.min(input.scrollHeight,150)}px`}
  function emptyState(){return `<section class="sod-chat-empty-coded"><div class="sod-empty-line"></div><p>Podés empezar por una decisión, una tensión, una pregunta o algo que todavía no sabés nombrar.</p></section>`}
  function previewBanner(){return `<button class="sod-preview-banner" type="button" data-current-conversation>← Volver a la conversación actual</button>`}
  function render(chatState){
    const keepBottom=isNearBottom()||lastMessageCount<0;
    const liveMessages=chatState.messages||[];
    const messages=previewItem?.messages||liveMessages;
    stream.innerHTML=`${previewItem?previewBanner():''}${messages.length?messages.map(chatMessageTemplate).join(''):emptyState()}`;
    if(chatState.error&&!previewItem)stream.insertAdjacentHTML('beforeend',`<div class="sod-chat-recoverable" role="status"><strong>La conexión se interrumpió.</strong><span>${escapeHtml(chatState.error.message)}</span><button class="btn btn-small" data-retry-latest>Reintentar</button></div>`);
    typingStatus.hidden=!chatState.pending||Boolean(previewItem);
    sendButton.disabled=chatState.pending||Boolean(previewItem);input.disabled=chatState.pending||Boolean(previewItem);
    stream.querySelectorAll('[data-retry-message]').forEach(button=>button.onclick=async()=>{const result=await controller.retry(button.dataset.retryMessage);if(!result?.ok){draft=controller.getState().error?.text||draft;input.value=draft;resizeComposer();input.focus()}else{draft='';input.value='';resizeComposer();input.focus()}});
    stream.querySelector('[data-retry-latest]')?.addEventListener('click',async()=>{const id=controller.getState().error?.clientMessageId;if(!id)return;const result=await controller.retry(id);if(!result?.ok){draft=controller.getState().error?.text||draft;input.value=draft;resizeComposer();input.focus()}else{draft='';input.value='';resizeComposer();input.focus()}});
    stream.querySelector('[data-current-conversation]')?.addEventListener('click',()=>{previewItem=null;render(controller.getState())});
    if(messages.length!==lastMessageCount&&keepBottom&&!previewItem)requestAnimationFrame(()=>scroll.scrollTo({top:scroll.scrollHeight,behavior:lastMessageCount<0?'auto':'smooth'}));
    lastMessageCount=messages.length;
    renderHistory();
  }
  async function submit(){
    if(controller.getState().pending||previewItem)return;
    const message=input.value.trim();if(!message)return;
    draft=message;input.value='';resizeComposer();
    const result=await controller.send(message);
    if(!result?.ok){input.value=draft;resizeComposer();input.focus();return}
    if(!store.get().onboarding?.firstConversationStarted){store.update(x=>{x.onboarding.firstConversationStarted=true;return x})}
    draft='';input.focus();
  }
  const closeHistory=()=>history?.classList.remove('open');
  const toggleHistory=()=>{history?.classList.toggle('open');renderHistory()};
  const newConversation=()=>{
    const run=()=>{archiveCurrent();previewItem=null;controller.newConversation();draft='';input.value='';resizeComposer();closeHistory();input.focus()};
    if(!controller.getState().messages.length){run();return}
    confirmAction('¿Querés iniciar una conversación nueva? La conversación actual quedará en el historial local de esta maqueta.',run);
  };
  form.onsubmit=e=>{e.preventDefault();submit()};
  input.addEventListener('input',()=>{draft=input.value;resizeComposer()});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit()}});
  root.querySelectorAll('[data-history-toggle]').forEach(button=>button.onclick=toggleHistory);
  root.querySelector('[data-history-close]')?.addEventListener('click',closeHistory);
  root.querySelectorAll('[data-new-conversation]').forEach(button=>button.addEventListener('click',newConversation));
  root.querySelectorAll('[data-current-conversation]').forEach(button=>button.addEventListener('click',()=>{previewItem=null;render(controller.getState())}));
  root.querySelector('[data-sidebar-toggle]')?.addEventListener('click',()=>sidebar?.classList.toggle('collapsed'));
  root.querySelector('[data-conversation-expand]')?.addEventListener('click',()=>navigate('/experiencia'));
  root.querySelector('[data-conversation-close]')?.addEventListener('click',()=>onClose?.());
  controller.refreshSession().finally(()=>render(controller.getState()));
  render(controller.getState());resizeComposer();
  return()=>{};
}

function conversationExperienceView(){return{
  title:'Hablar con SØD',noShell:true,
  html:`<main id="app-main" class="sod-chat-fullscreen-route">${conversationSurfaceMarkup({mode:'fullscreen'})}</main>`,
  mount(){const root=document.querySelector('[data-sod-conversation]');const cleanup=mountConversationSurface(root,{fullscreen:true,onClose:()=>navigate('/hub')});setTimeout(()=>root.querySelector('[data-chat-input]')?.focus(),100);return cleanup}
}}

function notFoundView(){return{title:'Puerta no encontrada',html:`<main id="app-main" class="section"><div class="container"><div class="empty"><div style="font-size:80px;color:var(--cyan)">Ø</div><h1>Esta puerta todavía no existe.</h1><p>La ruta solicitada no corresponde a un universo activo.</p><a class="btn btn-primary" href="/hub" data-link>Volver al Hub</a></div></div></main>`}}

export function getView(route){
  if(route==='/')return portalView();
  if(route==='/identidad-local'||route==='/entrar'||route==='/registro')return localIdentityView();
  if(route==='/onboarding')return onboardingView();
  if(route==='/hub')return hubView();
  if(route==='/hub-2d')return fallbackHubView();
  if(route==='/experiencia')return conversationExperienceView();
  if(route==='/habitos')return habitsView();
  if(route==='/dashboard')return dashboardView('metrics');
  if(route==='/dashboard/suenos')return dashboardView('dreams');
  if(route==='/dashboard/comunidad')return dashboardView('community');
  if(route==='/tools')return toolsView();
  const universe=route.match(/^\/universos\/([^/]+)$/);if(universe)return universeView(decodeURIComponent(universe[1]));
  if(route==='/journey'||route.startsWith('/journey/'))return journeyView();
  if(route==='/bitacora')return bitacoraView();
  if(route==='/biblioteca')return libraryView();
  if(route==='/semillas')return seedsLandingView();
  if(route==='/semillas/mercado')return seedsMarketplaceView('market');
  if(route==='/semillas/tesoros')return seedsMarketplaceView('treasures');
  const seed=route.match(/^\/semillas\/([^/]+)$/);if(seed)return seedDetailView(decodeURIComponent(seed[1]));
  if(route==='/elementos')return elementsView();
  const piece=route.match(/^\/elementos\/([^/]+)\/(\d+)$/);if(piece)return pieceDetailView(piece[1],piece[2]);
  const element=route.match(/^\/elementos\/([^/]+)$/);if(element)return elementView(element[1]);
  if(route==='/codigos')return codesView();
  if(route==='/observatorio')return dashboardView('metrics');
  if(route==='/coleccion')return seedsMarketplaceView('treasures');
  if(route==='/marketplace')return marketplaceView();
  if(route==='/perfil')return profileView();
  if(route==='/configuracion')return toolsView();
  if(route==='/privacidad')return privacyView();
  if(route==='/admin')return adminView();
  return notFoundView();
}
