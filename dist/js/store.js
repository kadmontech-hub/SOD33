const KEY='sod-ecosystem-state-v1';
const defaults={
  profile:{name:'Explorador Ø',email:'',mode:'guest'},
  onboarding:{completed:false,intention:'claridad',audio:false,motion:true,quality:'auto',gyro:false,hubHelpSeen:false,firstConversationStarted:false},
  settings:{audio:false,motion:true,quality:'auto',gyro:false,highContrast:false,reduceEffects:false,ambientVolume:.35},
  journey:{completedDays:[],startedAt:null},
  collection:{seeds:[],pieces:[],seedStates:{}},
  transformation:{lastCompletedAt:null,before:'',after:'',seedId:null},
  codes:[],
  dialogue:[],
  habitSystem:{
    habits:[
      {id:'habit-agua',name:'Tomar agua al despertar',category:'Cuerpo',active:true},
      {id:'habit-movimiento',name:'Mover el cuerpo',category:'Energía',active:true},
      {id:'habit-lectura',name:'Leer 20 minutos',category:'Conocimiento',active:true},
      {id:'habit-silencio',name:'10 minutos sin estímulos',category:'Claridad',active:true}
    ],
    checkins:{},
    routine:[
      {id:'routine-1',time:'07:30',title:'Agua + respiración',period:'Mañana'},
      {id:'routine-2',time:'08:00',title:'Movimiento',period:'Mañana'},
      {id:'routine-3',time:'21:30',title:'Lectura + cierre del día',period:'Noche'}
    ],
    goals:[
      {id:'goal-1',title:'Leer 12 libros este año',target:12,current:3,unit:'libros',cadence:'Meta anual',description:'Expandir conocimiento y perspectiva cada día.'},
      {id:'goal-2',title:'Sostener movimiento 4 veces por semana',target:4,current:2,unit:'sesiones',cadence:'Meta semanal',description:'Fortalecer cuerpo y disciplina con constancia.'},
      {id:'goal-3',title:'Convertir una intención en algo observable',target:3,current:1,unit:'observaciones',cadence:'Meta mensual',description:'Transformar ideas en acciones medibles.'}
    ]
  },
  mediaProgress:{videosSeen:[],eventsAttended:[]},
  visionBoard:{items:[]},
  dashboardSystem:{intention:'Hoy elijo ser canal de claridad y propósito.',intentionSet:false,communityInterest:false,communityRsvps:[],savedCommunityEvents:[],dreamBoardName:'Vida que estoy construyendo',dreamFilter:'Todos'},
  subscription:{plan:'free',premiumInterest:false},
  lastRoute:'/'
};
let state=load();
const listeners=new Set();
function load(){try{return merge(defaults,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{return structuredClone(defaults)}}
function merge(base,custom){const out=structuredClone(base);for(const [k,v] of Object.entries(custom||{})){out[k]=(v&&typeof v==='object'&&!Array.isArray(v)&&base[k])?merge(base[k],v):v}return out}
function persist(){localStorage.setItem(KEY,JSON.stringify(state));listeners.forEach(fn=>fn(state))}
export const store={
  get:()=>state,
  set(patch){state=merge(state,patch);persist();return state},
  update(fn){state=fn(structuredClone(state));persist();return state},
  reset(){state=structuredClone(defaults);persist()},
  subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
};
