import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { allSeedMarket,elementSeedMarket,animalSeedMarket,zodiacSeedMarket,seedRarities,seedElements,seedCollections } from '../public/js/seed-market-data.js';
const [views,styles,pkg,sw]=await Promise.all([
  readFile(new URL('../public/js/views.js',import.meta.url),'utf8'),readFile(new URL('../public/styles.css',import.meta.url),'utf8'),readFile(new URL('../package.json',import.meta.url),'utf8'),readFile(new URL('../public/sw.js',import.meta.url),'utf8')
]);
assert.match(pkg,/"version": "3\.9999\.0"/);assert.match(sw,/sod-shell-v3\.9999-final-shell/);
assert.equal(elementSeedMarket.length,165);assert.equal(animalSeedMarket.length,12);assert.equal(zodiacSeedMarket.length,12);assert.equal(allSeedMarket.length,189);
assert.equal(new Set(allSeedMarket.map(x=>x.id)).size,189);
assert.deepEqual(seedElements.map(x=>x.key),['tierra','agua','viento','fuego','eter']);for(const el of seedElements)assert.equal(elementSeedMarket.filter(x=>x.element===el.key).length,33);
assert.deepEqual(seedRarities.map(x=>x.label),['Común','Infrecuente','Rara','Épica','Legendaria','Fundacional']);
assert.deepEqual(Object.fromEntries(seedRarities.map(r=>[r.key,elementSeedMarket.filter(x=>x.rarity===r.key).length])),{comun:70,infrecuente:40,rara:25,epica:15,legendaria:10,fundacional:5});
assert.deepEqual(seedCollections.map(x=>x.status),['active','coming-soon','coming-soon']);
assert.match(views,/function seedsLandingView\(\)/);assert.match(views,/function seedsMarketplaceView\(initialMode='market'\)/);
assert.match(views,/CONSEGUÍ LA TUYA/);assert.match(views,/Animales[\s\S]{0,180}Próximamente/);assert.match(views,/Sodiaco[\s\S]{0,180}Próximamente/);
assert.match(views,/mode==='treasures'\?elementSeedMarket\.filter/,'Treasures must use operational Elementos only');
assert.match(views,/const totalOwned=elementSeedMarket\.filter/,'Treasure totals must ignore future collection prototypes');
assert.doesNotMatch(views,/data-seed-market-tab/);assert.doesNotMatch(views,/PRECIO \(SØD\)|12,450|12\.450/i);
assert.match(views,/No hay wallet, compra, mint ni transferencia conectada/);assert.match(styles,/SØD V3\.9999 — FINAL SHELL/);
console.log('Seeds final tests passed: Elementos operational, 5x33, future collections hidden/coming-soon, acquired-only Tesoros, no fake economy');
