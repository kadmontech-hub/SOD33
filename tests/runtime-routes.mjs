import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port=47831;
const base=`http://127.0.0.1:${port}`;
const child=spawn(process.execPath,['server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
let output='';
child.stdout.on('data',chunk=>output+=chunk);
child.stderr.on('data',chunk=>output+=chunk);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
try{
  let ready=false;
  for(let i=0;i<40;i++){
    await wait(100);
    try{const response=await fetch(`${base}/api/health`);if(response.ok){ready=true;break}}catch{}
  }
  assert.equal(ready,true,`Server did not become ready. ${output}`);
  const routes=['/','/hub','/biblioteca','/semillas','/semillas/mercado','/semillas/tesoros','/habitos','/dashboard','/dashboard/suenos','/dashboard/comunidad','/tools','/experiencia','/observatorio','/configuracion'];
  for(const route of routes){
    const response=await fetch(`${base}${route}`,{redirect:'manual'});
    assert.equal(response.status,200,`${route} should return 200`);
    assert.match(response.headers.get('content-type')||'',/text\/html/,`${route} should return HTML`);
    const html=await response.text();
    assert.match(html,/id="app"/,`${route} should serve the SØD shell`);
    assert.match(html,/\/js\/app\.js/,`${route} should load app.js`);
  }
  for(const asset of ['/styles.css','/js/app.js','/js/views.js','/js/hub-scene.js']){
    const response=await fetch(`${base}${asset}`);
    assert.equal(response.status,200,`${asset} should return 200`);
    assert.ok((await response.text()).length>100,`${asset} should not be empty`);
  }
  const health=await fetch(`${base}/api/health`).then(r=>r.json());
  assert.equal(Boolean(health.ok),true,'API health should be ok');
  console.log('Runtime route tests passed: server boot, SPA routes, core assets and API health');
} finally {
  child.kill('SIGTERM');
  await Promise.race([new Promise(resolve=>child.once('exit',resolve)),wait(800)]);
  if(!child.killed)child.kill('SIGKILL');
}
