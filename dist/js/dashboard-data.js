import { VISUALS, visual } from './visual-assets.js';

export const dashboardDreamSamples = [
  {id:'sample-main',title:'Vivir con propósito, libertad y conexión.',category:'Intención principal',description:'Construir una vida alineada con mis valores, donde el crecimiento personal, las relaciones y la libertad me permitan impactar y disfrutar.',progress:68,src:VISUALS.dreams,featured:true},
  {id:'sample-family',title:'Más tiempo en familia',category:'Familia',description:'Presencia real con las personas que importan.',progress:54,src:VISUALS.identity},
  {id:'sample-home',title:'Mi hogar ideal: naturaleza y calma',category:'Hogar',description:'Un espacio que cuide energía, descanso y creación.',progress:42,src:visual('048')},
  {id:'sample-project',title:'Crear mi estudio de diseño',category:'Proyectos',description:'Un lugar para construir con foco y criterio.',progress:37,src:VISUALS.forge},
  {id:'sample-travel',title:'Trekking en los Andes',category:'Experiencias',description:'Mover el cuerpo, ampliar horizonte y volver distinto.',progress:25,src:visual('050')},
  {id:'sample-aurora',title:'Auroras boreales en Islandia',category:'Viajes',description:'Una experiencia que quiero vivir al menos una vez.',progress:18,src:visual('049')},
];

export const officialSocialLinks = Object.freeze([
  {key:'x',label:'X',handle:'@SODEcosystem',url:'https://x.com/SODEcosystem',icon:'X'},
  {key:'youtube',label:'YouTube',handle:'@SODEcosystem',url:'https://www.youtube.com/@SODEcosystem',icon:'▶'},
  {key:'instagram',label:'Instagram',handle:'@sodecosystem',url:'https://www.instagram.com/sodecosystem/',icon:'◎'},
  {key:'tiktok',label:'TikTok',handle:'@sodecosystem',url:'https://www.tiktok.com/@sodecosystem',icon:'♪'},
  {key:'linkedin',label:'LinkedIn',handle:'SØD Ecosystem',url:'https://www.linkedin.com/in/sod-ecosystem-b07b6037b/',icon:'in'},
  {key:'telegram',label:'Telegram',handle:'Comunidad SØD',url:'https://t.me/sodecosystem',icon:'➤',primary:true},
]);

export const dashboardCommunity = Object.freeze({
  status:'preview',
  copy:'Comunidad está en etapa de construcción. Los accesos oficiales ya funcionan; perfiles, círculos y métricas reales se conectarán en V4.',
  event:{
    id:'event-sod-01',
    title:'Próximo encuentro SØD',
    description:'La información oficial del encuentro está contenida en la pieza del evento. Guardalo en tu recorrido o abrí la comunidad para recibir novedades.',
    image:'https://i.imgur.com/AkMzntZ.png',
    detailsUrl:'https://t.me/sodecosystem',
  },
  circles:[
    {title:'Claridad & Dirección',description:'Conversaciones para ordenar pensamiento, decisiones y próximos pasos.',status:'Próximamente'},
    {title:'Constructores',description:'Personas que están construyendo proyectos, sistemas y una vida con dirección.',status:'Próximamente'},
    {title:'Hábitos & Integración',description:'Un espacio para sostener cambios pequeños con evidencia real.',status:'Próximamente'},
  ],
});

export const dashboardMilestones = [
  {title:'Explorador',copy:'Comenzaste tu viaje',threshold:0},
  {title:'Sembrador',copy:'Incorporaste tus primeras Semillas',threshold:1},
  {title:'Conector',copy:'Registraste tu primer encuentro',threshold:1,type:'events'},
  {title:'Guía',copy:'Conservaste transformaciones como Códigos',threshold:3,type:'codes'},
  {title:'Alquimista',copy:'Tus distintas señales empiezan a conversar',threshold:7,type:'combined'},
];
