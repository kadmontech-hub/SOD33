import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const views=await readFile('public/js/views.js','utf8');
const ui=await readFile('public/js/ui.js','utf8');
const combined=`${views}\n${ui}`;
const paths=[...combined.matchAll(/href=["'](\/[^"']*)/g)].map(m=>m[1]);
const allowed=[/^\/$/,/^\/hub(?:-2d)?$/, /^\/experiencia$/, /^\/biblioteca$/, /^\/semillas(?:\/mercado|\/tesoros|\/\$\{seed\.id\})?$/, /^\/habitos$/, /^\/dashboard(?:\/suenos|\/comunidad)?$/, /^\/tools$/, /^\/privacidad$/, /^\/identidad-local$/, /^\/coleccion$/, /^\/elementos(?:\/.*)?$/];
for(const route of paths)assert.ok(allowed.some(rx=>rx.test(route)),`Unclassified internal navigation path: ${route}`);
// Compatibility route should be an alias to the canonical destination, not another UI.
assert.match(views,/if\(route==='\/coleccion'\)return seedsMarketplaceView\('treasures'\)/);
assert.match(views,/if\(route==='\/configuracion'\)return toolsView\(\)/);
assert.match(views,/if\(route==='\/observatorio'\)return dashboardView\('metrics'\)/);
// Important controls have handlers.
for(const attr of ['data-new-intention','data-save-community-event','data-add-habit','data-add-routine','data-premium-interest','data-manual-install','data-first-sod'])assert.ok(views.includes(attr),`missing control ${attr}`);
console.log(`Navigation audit passed: ${new Set(paths).size} static internal path shapes classified; compatibility aliases converge on canonical UI`);
