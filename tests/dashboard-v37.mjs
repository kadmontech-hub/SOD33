import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [views,styles,data,store,pkg,sw]=await Promise.all([
 readFile(new URL('../public/js/views.js',import.meta.url),'utf8'),readFile(new URL('../public/styles.css',import.meta.url),'utf8'),readFile(new URL('../public/js/dashboard-data.js',import.meta.url),'utf8'),readFile(new URL('../public/js/store.js',import.meta.url),'utf8'),readFile(new URL('../package.json',import.meta.url),'utf8'),readFile(new URL('../public/sw.js',import.meta.url),'utf8')
]);
assert.match(pkg,/"version": "3\.9999\.0"/);assert.match(sw,/sod-shell-v3\.9999-final-shell/);
assert.match(views,/function dashboardView\(initialTab='metrics'\)/);assert.match(views,/href="\/dashboard\/suenos"/);assert.match(views,/href="\/dashboard\/comunidad"/);
assert.match(views,/if\(route==='\/dashboard\/suenos'\)return dashboardView\('dreams'\)/);assert.match(views,/if\(route==='\/dashboard\/comunidad'\)return dashboardView\('community'\)/);
assert.doesNotMatch(views,/function dashboardRailMarkup/);assert.match(views,/TU SEÑAL/);assert.match(views,/Mapa de <span>Sueños/);assert.match(views,/COMUNIDAD SØD · PREVIEW/);
assert.match(data,/https:\/\/i\.imgur\.com\/AkMzntZ\.png/);for(const url of ['x.com/SODEcosystem','youtube.com/@SODEcosystem','instagram.com/sodecosystem','tiktok.com/@sodecosystem','linkedin.com/in/sod-ecosystem-b07b6037b','t.me/sodecosystem'])assert.match(data,new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
assert.match(store,/dashboardSystem/);assert.match(styles,/Dashboard final: quiet background/);assert.match(styles,/dash-v399-social-card/);
assert.doesNotMatch(data,/1,248|1248|92%|4\.9\/5/,'Community preview must not claim fake live metrics');
console.log('Dashboard final tests passed: route-based tabs, reduced chrome, functional dreams, real official links and reduced Community preview');
