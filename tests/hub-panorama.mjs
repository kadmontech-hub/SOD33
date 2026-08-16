import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [scene,views,styles,index,sw,pkg,visuals]=await Promise.all([
  readFile(new URL('../public/js/hub-scene.js',import.meta.url),'utf8'),
  readFile(new URL('../public/js/views.js',import.meta.url),'utf8'),
  readFile(new URL('../public/styles.css',import.meta.url),'utf8'),
  readFile(new URL('../public/index.html',import.meta.url),'utf8'),
  readFile(new URL('../public/sw.js',import.meta.url),'utf8'),
  readFile(new URL('../package.json',import.meta.url),'utf8'),
  readFile(new URL('../public/js/visual-assets.js',import.meta.url),'utf8'),
]);
assert.match(visuals,/https:\/\/i\.imgur\.com\/nQ65b36\.png/);
assert.match(scene,/VISUALS\.hub/);
assert.match(scene,/portalSpecs/);
for(const key of ['habits','hubLibraryIcon','hubSeedsIcon','hubObservatoryIcon'])assert.match(visuals,new RegExp(key));
assert.match(scene,/portalImages/);
assert.match(scene,/context\.drawImage\(image/);
for(const slug of ['habits','library','seeds','observatory'])assert.match(scene,new RegExp(`slug:'${slug}'`));
assert.match(scene,/this\.core=\{slug:'__orb',title:'Hablar con SØD'/);
assert.doesNotMatch(scene,/drawOrb\(/,'The source image already contains the central core and must not be duplicated');
assert.match(views,/Hub panorámico SØD/);
assert.match(styles,/SØD HUB PANORAMA v3\.0\.4/);
assert.match(index,/startup-fallback/);
assert.match(index,/preconnect/);
assert.match(sw,/sod-shell-v3\.9999-final-shell/);
assert.match(pkg,/"version": "3\.9999\.0"/);
console.log('Hub panorama tests passed: clean remote panorama, four floating image portals and startup recovery shell');
