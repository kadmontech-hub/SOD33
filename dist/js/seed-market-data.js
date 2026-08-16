import { VISUALS } from './visual-assets.js';

export const seedRarities = Object.freeze([
  {key:'comun',label:'Común',rank:1,color:'#82919C'},
  {key:'infrecuente',label:'Infrecuente',rank:2,color:'#62D394'},
  {key:'rara',label:'Rara',rank:3,color:'#35BFFF'},
  {key:'epica',label:'Épica',rank:4,color:'#B978FF'},
  {key:'legendaria',label:'Legendaria',rank:5,color:'#F2AE3D'},
  {key:'fundacional',label:'Fundacional',rank:6,color:'#EAFBFF'}
]);

export const seedElements = Object.freeze([
  {key:'tierra',label:'Tierra',glyph:'△',color:'#C99A4D',description:'Materia, cuerpo, límite, estructura y arraigo.',art:VISUALS.earth},
  {key:'agua',label:'Agua',glyph:'◡',color:'#21C8FF',description:'Emoción, memoria, adaptación, vínculo y profundidad.',art:VISUALS.water},
  {key:'viento',label:'Viento',glyph:'≋',color:'#A9E7E4',description:'Pensamiento, palabra, perspectiva, movimiento y posibilidad.',art:VISUALS.wind},
  {key:'fuego',label:'Fuego',glyph:'◇',color:'#FF735A',description:'Voluntad, transformación, deseo, coraje y dirección.',art:VISUALS.fire},
  {key:'eter',label:'Éter',glyph:'Ø',color:'#9A70FF',description:'Conciencia, información, unidad, vacío y origen.',art:VISUALS.ether}
]);
export const animalFacets = Object.freeze([
  {key:'instinto',label:'Instinto',glyph:'◈',color:'#D4A663'},
  {key:'vision',label:'Visión',glyph:'✦',color:'#6CD6FF'},
  {key:'vinculo',label:'Vínculo',glyph:'∞',color:'#6AE0B1'},
  {key:'transformacion',label:'Transformación',glyph:'◇',color:'#C77CFF'}
]);
export const zodiacFacets = Object.freeze([
  {key:'fuego',label:'Fuego',glyph:'◇',color:'#FF735A'},
  {key:'tierra',label:'Tierra',glyph:'△',color:'#C99A4D'},
  {key:'aire',label:'Aire',glyph:'≋',color:'#A9E7E4'},
  {key:'agua',label:'Agua',glyph:'◡',color:'#21C8FF'}
]);
export const seedCollections = Object.freeze([
  {key:'elementos',label:'Elementos',edition:'Genesis',glyph:'◈',color:'#24D7E8',count:165,facetLabel:'Elemento',description:'Cinco fuerzas fundamentales. 33 Semillas por fuerza.',status:'active'},
  {key:'animales',label:'Animales',edition:'Genesis',glyph:'◉',color:'#70D4A3',count:12,facetLabel:'Arquetipo',description:'Doce arquetipos animales como espejos de instinto, vínculo, visión y transformación.',status:'coming-soon'},
  {key:'sodiaco',label:'Sodiaco',edition:'Genesis',glyph:'✧',color:'#A778FF',count:12,facetLabel:'Elemento zodiacal',description:'Doce Semillas inspiradas en los signos y sus cuatro fuerzas elementales.',status:'coming-soon'}
]);

const elementNames={
  tierra:['Cimiento Silencioso','Raíz de Presencia','Peso de lo Real','Límite Fértil','Cuerpo Templo','Materia Consciente','Casa Interior','Disciplina de Piedra','Orden Esencial','Territorio Propio','Ritmo del Cuerpo','Umbral de Raíz','Arquitectura del Día','Columna Interior','Suelo Común','Pacto con la Materia','Forma Sostenida','Centro de Gravedad','Huella del Cuerpo','Frontera Viva','Refugio Interno','Semilla de Estructura','Pulso Mineral','Cuerpo que Sabe','Mapa del Límite','Templo de Hábitos','Piedra de Coherencia','Tierra Prometida','Geometría del Sostén','Raíz Primordial','Cubo Terrenal','Corazón de Gaia','Origen de la Forma'],
  agua:['Memoria Líquida','Emoción Nombrada','Cauce Interior','Profundidad Serena','Vínculo Vivo','Adaptación Consciente','Marea Interna','Agua que Recuerda','Río de Presencia','Espejo Profundo','Corriente Afectiva','Lago Silencioso','Vaso de Memoria','Pulso del Océano','Cauce del Vínculo','Lluvia Interior','Marea de Cambio','Fluir sin Perderse','Agua de Origen','Pozo de Escucha','Cristal de Emoción','Ritmo de Mareas','Puente Líquido','Profundidad Habitable','Océano Íntimo','Memoria del Cuerpo','Corriente de Confianza','Fuente Serena','Esfera del Flujo','Perla de Presencia','Cáliz del Vínculo','Mar sin Borde','Origen del Agua'],
  viento:['Primera Pregunta','Aire entre Ideas','Perspectiva Abierta','Palabra Precisa','Movimiento Mental','Horizonte Posible','Silencio entre Pensamientos','Brújula del Aire','Voz Interior','Corriente de Ideas','Ventana de Perspectiva','Respiración de la Mente','Espiral del Lenguaje','Pregunta Fértil','Distancia Justa','Mapa de Posibilidades','Palabra que Ordena','Aire Nuevo','Umbral del Pensamiento','Movimiento de Sentido','Mirada Lateral','Voz sin Ruido','Dirección del Viento','Claridad en Movimiento','Espiral de Preguntas','Horizonte Mental','Corriente de Atención','Puerta del Lenguaje','Susurro del Viento','Pluma de Perspectiva','Aliento del Horizonte','Cielo Interior','Origen del Aire'],
  fuego:['Chispa Inicial','Voluntad Serena','Deseo con Dirección','Coraje Suficiente','Fuego de Decisión','Impulso Consciente','Horno Interior','Llama Sostenida','Fricción Creativa','Pacto con el Deseo','Calor de Presencia','Energía Dirigida','Umbral de Acción','Fuego sin Ruido','Motor Interno','Decisión Encendida','Límite Ardiente','Forja del Carácter','Ritmo de Acción','Pulso Solar','Brasa Persistente','Transformación Activa','Llama de Coherencia','Fuego del Centro','Coraje Habitable','Dirección Solar','Forja del Propósito','Sol Interior','Pilar de Fuego','Corona de Brasa','Llama Primigenia','Corazón Solar','Origen del Fuego'],
  eter:['Espacio Antes de la Forma','Vacío Fértil','Conciencia Testigo','Unidad en Movimiento','Campo de Información','Presencia sin Nombre','Punto Cero','Silencio Original','Trama Invisible','Centro sin Centro','Resonancia Sutil','Puerta del Vacío','Campo de Posibilidad','Nexo Interior','Información Viva','Geometría Invisible','Testigo del Cambio','Umbral de Unidad','Eco del Origen','Espacio Consciente','Red de Sentido','Vacío Habitable','Presencia Fundamental','Núcleo SØD','Campo Unificado','Origen sin Forma','Memoria del Vacío','Eje de Conciencia','Gema del Vacío','Corona de Éter','Portal de Unidad','Núcleo Primordial','Origen Ø']
};
const elementDescriptions={
  tierra:['Sostener antes de expandir.','El cuerpo también piensa.','La forma protege energía.'],agua:['Sentir sin quedar atrapado.','La memoria cambia cuando puede ser observada.','Adaptarse no es perderse.'],viento:['Una pregunta puede cambiar el mapa.','La perspectiva abre espacio de decisión.','Nombrar con precisión reduce ruido.'],fuego:['La energía necesita dirección.','El coraje también puede ser silencioso.','Transformar es comprometer energía con una forma nueva.'],eter:['Antes de la respuesta existe un campo de posibilidades.','Observar modifica la relación con lo observado.','La unidad no elimina las diferencias: las contiene.']
};
const artPool=[VISUALS.seedArtifact,VISUALS.codeArtifact,VISUALS.coreEvidence,VISUALS.elements,VISUALS.calibration];
function rarityForElement(number){if(number===33)return seedRarities[5];if(number>=31)return seedRarities[4];if(number>=28)return seedRarities[3];if(number>=23)return seedRarities[2];if(number>=15)return seedRarities[1];return seedRarities[0];}
function rarityForSmall(index){return seedRarities[[1,1,1,2,2,2,3,3,4,4,5,6][index]-1];}
function resonanceFor(seedIndex,rarityRank,base=220){return Math.min(999,base+(seedIndex*29)+(rarityRank*61));}
export const elementSeedMarket = Object.freeze(seedElements.flatMap((element,elementIndex)=>elementNames[element.key].map((title,index)=>{const number=index+1;const rarity=rarityForElement(number);return {id:`elementos-${element.key}-${String(number).padStart(2,'0')}`,collection:'elementos',collectionLabel:'Elementos',edition:'Genesis',collectionColor:'#24D7E8',facetKey:element.key,facetLabel:element.label,facetGlyph:element.glyph,facetColor:element.color,element:element.key,elementLabel:element.label,elementGlyph:element.glyph,elementColor:element.color,number,title,rarity:rarity.key,rarityLabel:rarity.label,rarityColor:rarity.color,rarityRank:rarity.rank,resonance:Math.min(999,180+(number*17)+(elementIndex*23)+(rarity.rank*62)),description:elementDescriptions[element.key][index%3],art:[element.art,...artPool][(number+elementIndex)%6],artPosition:`${38+((number*13)%25)}% ${35+((number*7)%32)}%`,sequence:(elementIndex*33)+number,deepLink:`/elementos/${element.key}/${number}`};})));

const animals=[
 ['Lobo del Vínculo','Lobo','vinculo','∞','La fuerza de pertenecer sin perder dirección propia.'],['Águila de Perspectiva','Águila','vision','✦','Tomar altura para distinguir el mapa del ruido inmediato.'],['Jaguar del Coraje','Jaguar','instinto','◈','Moverse con decisión cuando el cuerpo reconoce el momento.'],['Búho del Silencio','Búho','vision','◎','Ver lo que aparece cuando disminuye el ruido.'],['Ciervo de Sensibilidad','Ciervo','vinculo','⌁','Percibir con delicadeza sin convertir sensibilidad en fragilidad.'],['Serpiente de Transformación','Serpiente','transformacion','∿','Soltar una forma vieja para permitir una nueva.'],['Delfín del Juego','Delfín','vinculo','≋','Recordar que exploración y ligereza también producen inteligencia.'],['Elefante de Memoria','Elefante','instinto','◉','Honrar lo vivido sin quedar prisionero de lo recordado.'],['Zorro de Adaptación','Zorro','instinto','◇','Cambiar estrategia sin abandonar propósito.'],['Caballo de Libertad','Caballo','vinculo','∞','Convertir energía disponible en movimiento con dirección.'],['Oso de Presencia','Oso','instinto','⬡','Habitar el propio espacio con calma, límite y potencia.'],['Mariposa de Metamorfosis','Mariposa','transformacion','✧','Aceptar que crecer también modifica la identidad desde la que miramos.']
];
const animalArts=[VISUALS.earth,VISUALS.wind,VISUALS.fire,VISUALS.ether,VISUALS.water,VISUALS.ether,VISUALS.water,VISUALS.earth,VISUALS.wind,VISUALS.fire,VISUALS.earth,VISUALS.calibration];
export const animalSeedMarket=Object.freeze(animals.map((item,index)=>{const facet=animalFacets.find(x=>x.key===item[2]);const rarity=rarityForSmall(index);const number=index+1;return {id:`animales-${String(number).padStart(2,'0')}`,collection:'animales',collectionLabel:'Animales',edition:'Genesis',collectionColor:'#70D4A3',facetKey:facet.key,facetLabel:facet.label,facetGlyph:item[3],facetColor:facet.color,element:facet.key,elementLabel:facet.label,elementGlyph:item[3],elementColor:facet.color,number,title:item[0],subtitle:item[1],rarity:rarity.key,rarityLabel:rarity.label,rarityColor:rarity.color,rarityRank:rarity.rank,resonance:resonanceFor(index,rarity.rank,250),description:item[4],art:animalArts[index],artPosition:`${42+((index*9)%18)}% ${38+((index*11)%26)}%`,sequence:200+number};}));
const zodiac=[
 ['Impulso de Aries','Aries','♈','fuego','Comenzar antes de que la duda se convierta en inmovilidad.'],['Materia de Tauro','Tauro','♉','tierra','Construir algo que pueda sostenerse más allá del entusiasmo inicial.'],['Doble Mirada de Géminis','Géminis','♊','aire','Sostener dos perspectivas antes de reducirlas a una respuesta.'],['Refugio de Cáncer','Cáncer','♋','agua','Reconocer qué necesita protección y qué necesita apertura.'],['Sol de Leo','Leo','♌','fuego','Expresar potencia sin convertir presencia en necesidad de aprobación.'],['Precisión de Virgo','Virgo','♍','tierra','Mejorar la forma sin confundir excelencia con perfeccionismo.'],['Equilibrio de Libra','Libra','♎','aire','Elegir equilibrio sin usarlo para evitar una decisión.'],['Profundidad de Escorpio','Escorpio','♏','agua','Mirar lo que transforma aunque todavía no tenga nombre.'],['Horizonte de Sagitario','Sagitario','♐','fuego','Expandir el mapa sin perder contacto con el presente.'],['Cumbre de Capricornio','Capricornio','♑','tierra','Convertir dirección en estructura y estructura en continuidad.'],['Futuro de Acuario','Acuario','♒','aire','Imaginar sistemas nuevos sin desconectarse de las personas reales.'],['Océano de Piscis','Piscis','♓','agua','Percibir totalidad sin perder los límites que permiten habitarla.']
];
const zodiacArt={fuego:VISUALS.fire,tierra:VISUALS.earth,aire:VISUALS.wind,agua:VISUALS.water};
export const zodiacSeedMarket=Object.freeze(zodiac.map((item,index)=>{const facet=zodiacFacets.find(x=>x.key===item[3]);const rarity=rarityForSmall(index);const number=index+1;return {id:`sodiaco-${String(number).padStart(2,'0')}`,collection:'sodiaco',collectionLabel:'Sodiaco',edition:'Genesis',collectionColor:'#A778FF',facetKey:facet.key,facetLabel:facet.label,facetGlyph:item[2],facetColor:facet.color,element:facet.key,elementLabel:facet.label,elementGlyph:item[2],elementColor:facet.color,number,title:item[0],subtitle:item[1],rarity:rarity.key,rarityLabel:rarity.label,rarityColor:rarity.color,rarityRank:rarity.rank,resonance:resonanceFor(index,rarity.rank,290),description:item[4],art:zodiacArt[item[3]],artPosition:`${40+((index*7)%20)}% ${36+((index*13)%28)}%`,sequence:300+number};}));
export const allSeedMarket=Object.freeze([...elementSeedMarket,...animalSeedMarket,...zodiacSeedMarket]);
export function getCollectionSeeds(key){return key==='all'?[...allSeedMarket]:allSeedMarket.filter(seed=>seed.collection===key);}
export function getCollectionFacets(key){if(key==='elementos')return seedElements;if(key==='animales')return animalFacets;if(key==='sodiaco')return zodiacFacets;return [];}
export function getMarketSeed(id){return allSeedMarket.find(seed=>seed.id===id)||null;}
export function getSeedRarity(key){return seedRarities.find(item=>item.key===key)||seedRarities[0];}
export function getSeedElement(key){return seedElements.find(item=>item.key===key)||seedElements[0];}
