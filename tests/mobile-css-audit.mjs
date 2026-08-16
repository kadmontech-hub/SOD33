import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const css=await readFile('public/styles.css','utf8');
assert.match(css,/Mobile normalization — full product, not a shrunken desktop/);
assert.match(css,/@media\(max-width:900px\)/);assert.match(css,/@media\(max-width:560px\)/);
for(const token of ['.habit-v34-goal{min-width:0!important','.seed-v351-grid{grid-template-columns:1fr!important','.dash-v399-socials>div{grid-template-columns:1fr','.sod-conversation-composer textarea{font-size:16px','.form input,.form textarea,.form select{font-size:16px'])assert.ok(css.includes(token),`mobile guard missing: ${token}`);
let balance=0;for(const ch of css){if(ch==='{')balance++;if(ch==='}')balance--;}assert.equal(balance,0,'CSS braces unbalanced');
console.log('Mobile CSS audit passed: phone/tablet overrides present, known Habits overflow neutralized, CSS balanced');
