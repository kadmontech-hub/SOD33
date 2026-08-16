import assert from 'node:assert/strict';
import dialogueHandler from '../api/dialogue.mjs';
import healthHandler from '../api/health.mjs';
import { sanitize } from '../lib/server-utils.mjs';

const getReq=new Request('https://example.test/api/dialogue',{method:'GET'});
let res=await dialogueHandler(getReq);assert.equal(res.status,405);assert.equal(res.headers.get('allow'),'POST');
res=await healthHandler(new Request('https://example.test/api/health',{method:'POST'}));assert.equal(res.status,405);
res=await dialogueHandler(new Request('https://example.test/api/dialogue',{method:'POST',headers:{'content-type':'application/json','x-forwarded-for':'guard-empty'},body:JSON.stringify({message:' '})}));assert.equal(res.status,400);
assert.equal(sanitize('<script>alert(1)</script>',40),'scriptalert(1)/script');
let limited=null;for(let i=0;i<21;i++){limited=await dialogueHandler(new Request('https://example.test/api/dialogue',{method:'POST',headers:{'content-type':'application/json','x-forwarded-for':'guard-rate'},body:JSON.stringify({message:'Necesito claridad'})}))}assert.equal(limited.status,429);
console.log('API guardrails passed: methods, empty input, sanitization and prototype rate limit');
