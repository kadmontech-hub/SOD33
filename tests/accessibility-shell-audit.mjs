import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [html,ui,views,styles]=await Promise.all([
  readFile('public/index.html','utf8'),readFile('public/js/ui.js','utf8'),readFile('public/js/views.js','utf8'),readFile('public/styles.css','utf8')
]);
assert.match(html,/class="skip-link"/);assert.match(html,/aria-live="polite"/);
assert.match(ui,/aria-label="SØD Ecosystem"/);assert.match(ui,/aria-controls="main-nav"/);assert.match(ui,/aria-expanded="false"/);
assert.match(views,/aria-label="Hub panorámico SØD/);assert.match(views,/role="log" aria-live="polite"/);assert.match(views,/aria-label="Mensaje para SØD"/);
assert.match(styles,/:focus-visible/);assert.match(styles,/prefers-reduced-motion/);
assert.match(views,/Movimiento reducido/);assert.match(views,/Alto contraste|highContrast/);
assert.doesNotMatch(views,/href=["']javascript:/i);
assert.doesNotMatch(views,/type=["']password["']/i);
console.log('Accessibility shell audit passed: skip/focus/live regions, keyboard-oriented Hub/chat labels, reduced-motion and no javascript/password links');
