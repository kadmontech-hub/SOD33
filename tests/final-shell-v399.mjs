import assert from 'node:assert/strict';
import { readFile,readdir,stat } from 'node:fs/promises';
import path from 'node:path';
const [views,ui,app,styles,data,pkg,sw]=await Promise.all([
  readFile('public/js/views.js','utf8'),readFile('public/js/ui.js','utf8'),readFile('public/js/app.js','utf8'),readFile('public/styles.css','utf8'),readFile('public/js/dashboard-data.js','utf8'),readFile('package.json','utf8'),readFile('public/sw.js','utf8')
]);
assert.match(pkg,/"version": "3\.9999\.0"/);assert.match(sw,/sod-shell-v3\.9999-final-shell/);
// Canonical product map
for(const route of ['/experiencia','/biblioteca','/semillas','/habitos','/dashboard'])assert.ok(ui.includes(route),`Explore menu missing ${route}`);
for(const forbidden of ['href="/coleccion"','href="/codigos"','href="/perfil"'])assert.ok(!ui.includes(forbidden),`Primary header should not expose legacy ${forbidden}`);
assert.match(views,/Hablar con SØD ahora/);assert.match(views,/firstConversationStarted=true/);
// No duplicated Events in Library; Community owns it.
assert.doesNotMatch(views,/data-library-mode="events"/);assert.match(views,/PRÓXIMO ENCUENTRO/);assert.match(data,/AkMzntZ\.png/);
// Semillas operating model.
assert.match(views,/mode==='treasures'\?elementSeedMarket\.filter/);assert.match(views,/Próximamente/);assert.match(views,/CONSEGUÍ LA TUYA/);
// Dashboard route tabs and reduced community.
assert.match(views,/\/dashboard\/suenos/);assert.match(views,/\/dashboard\/comunidad/);assert.match(views,/COMUNIDAD SØD · PREVIEW/);
// PWA may be installed manually, never auto-prompts.
assert.match(app,/beforeinstallprompt/);assert.doesNotMatch(app,/showInstall\(\);/);
// No fake credential UX.
assert.doesNotMatch(views,/type=["']password["']/i);assert.doesNotMatch(views,/name=["']password["']/i);
// Final mobile layer exists and fixes known Habits overflow.
assert.match(styles,/SØD V3\.9999 — FINAL SHELL POLISH/);assert.match(styles,/\.habit-v34-goal\{min-width:0!important/);
// Local payload remains deliberately small.
async function walk(dir){let total=0,max=0,maxFile='';for(const name of await readdir(dir)){const f=path.join(dir,name);const s=await stat(f);if(s.isDirectory()){const r=await walk(f);total+=r.total;if(r.max>max){max=r.max;maxFile=r.maxFile}}else{total+=s.size;if(s.size>max){max=s.size;maxFile=f}}}return{total,max,maxFile}}
const payload=await walk('public');assert.ok(payload.total<2_000_000,`public payload too large: ${payload.total}`);assert.ok(payload.max<600_000,`single local asset too large: ${payload.maxFile} ${payload.max}`);
console.log(`Final shell tests passed: canonical navigation, no duplicate Events, local-first functionality, manual PWA, payload ${(payload.total/1024).toFixed(1)} KB`);
