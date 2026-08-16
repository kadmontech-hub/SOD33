import assert from 'node:assert/strict';
import { createConversationController } from '../public/js/conversation-controller.js';
let id=0;const calls=[];const api={async dialogue(payload){calls.push(payload);return{id:`a-${id}`,conversationId:'stress-conv',reply:`reply ${id++}`,mode:'stress'}}};
const session={async getSession(){return{authenticated:false,accessToken:null,syncEnabled:false}},async getAccessToken(){return null}};
let uid=0;const controller=createConversationController({api,sessionProvider:session,uuid:()=>`u-${++uid}`});
for(let i=0;i<120;i++){const r=await controller.send(`message ${i}`);assert.equal(r.ok,true)}
const s=controller.getState();assert.equal(calls.length,120);assert.equal(s.messages.length,240);assert.equal(new Set(s.messages.map(x=>x.id)).size,240);assert.equal(s.pending,false);assert.equal(s.error,null);assert.ok(calls.every(c=>!('memory'in c)&&!('userId'in c)&&!('provider'in c)));
controller.newConversation();assert.equal(controller.getState().messages.length,0);assert.equal(controller.getState().conversationId,null);
console.log('Conversation stress test passed: 120 sequential turns / 240 messages, unique IDs, clean reset and constrained API payload');
