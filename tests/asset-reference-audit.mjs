import assert from 'node:assert/strict';
import { readFile,readdir,stat } from 'node:fs/promises';
import path from 'node:path';

async function walk(dir){const out=[];for(const name of await readdir(dir)){const file=path.join(dir,name);const s=await stat(file);if(s.isDirectory())out.push(...await walk(file));else out.push(file)}return out}
const sourceFiles=(await walk('public')).filter(file=>/\.(?:html|css|js|json|webmanifest)$/.test(file));
const refs=new Set();
for(const file of sourceFiles){const text=await readFile(file,'utf8');for(const match of text.matchAll(/(?:^|["'`(=:\s])(\/assets\/[A-Za-z0-9_./-]+\.[A-Za-z0-9]+)(?=["'`)\s?#]|$)/g))refs.add(match[1])}
const missing=[];for(const ref of refs){try{await stat(path.join('public',ref))}catch{missing.push(ref)}}
assert.deepEqual(missing,[],`Missing local asset references: ${missing.join(', ')}`);
console.log(`Asset reference audit passed: ${refs.size} literal local /assets references resolve`);
