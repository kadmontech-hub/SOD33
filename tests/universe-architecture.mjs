import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [views,content,store,ui,scene,styles,pkg,sw]=await Promise.all([
 readFile(new URL('../public/js/views.js',import.meta.url),'utf8'),readFile(new URL('../public/js/content.js',import.meta.url),'utf8'),readFile(new URL('../public/js/store.js',import.meta.url),'utf8'),readFile(new URL('../public/js/ui.js',import.meta.url),'utf8'),readFile(new URL('../public/js/hub-scene.js',import.meta.url),'utf8'),readFile(new URL('../public/styles.css',import.meta.url),'utf8'),readFile(new URL('../package.json',import.meta.url),'utf8'),readFile(new URL('../public/sw.js',import.meta.url),'utf8')
]);
assert.match(pkg,/"version": "3\.9999\.0"/);assert.match(sw,/sod-shell-v3\.9999-final-shell/);
assert.match(scene,/slug:'habits'.*visualKey:'habits'/);assert.match(scene,/this\.core=\{slug:'__orb',title:'Hablar con SØD'/);assert.doesNotMatch(scene,/slug:'sod'.*visualKey:'hubTalkIcon'/);
for(const token of ["['/biblioteca','Biblioteca'","['/semillas','Semillas'","['/habitos','Hábitos'","['/dashboard','Dashboard'"])assert.match(ui,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
assert.match(ui,/href="\/tools"/);assert.doesNotMatch(ui,/href="\/coleccion"/);
assert.match(views,/function habitsView/);assert.match(views,/function seedsLandingView/);assert.match(views,/function dashboardView/);assert.match(views,/function toolsView/);
assert.doesNotMatch(views,/data-library-mode="events"/);assert.match(views,/PRÓXIMO ENCUENTRO/);
for(const token of ['habitSystem','mediaProgress','visionBoard','subscription','hubHelpSeen','firstConversationStarted'])assert.match(store,new RegExp(token));
assert.match(content,/destination:'\/habitos'/);assert.match(content,/destination:'\/dashboard\/suenos'/);assert.match(styles,/Mobile normalization/);
console.log('Universe architecture final tests passed: 4 Hub worlds + SØD core + Tools, single Events owner, local functional state and mobile finalization');
