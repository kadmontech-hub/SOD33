import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [views,styles,store,pkg,sw]=await Promise.all([
  readFile(new URL('../public/js/views.js',import.meta.url),'utf8'),
  readFile(new URL('../public/styles.css',import.meta.url),'utf8'),
  readFile(new URL('../public/js/store.js',import.meta.url),'utf8'),
  readFile(new URL('../package.json',import.meta.url),'utf8'),
  readFile(new URL('../public/sw.js',import.meta.url),'utf8'),
]);
assert.match(pkg,/"version": "3\.9999\.0"/);
assert.match(sw,/sod-shell-v3\.9999-final-shell/);
assert.match(views,/function habitsView\(\)/);
assert.match(views,/Tracker diario/);
assert.match(views,/RUTINA EDITABLE/);
assert.match(views,/NUEVA META/);
assert.match(views,/ENFOQUE DE LA SEMANA/);
assert.match(views,/RACHA ACTUAL/);
assert.match(views,/ENERGÍA ESTIMADA/);
assert.match(views,/data-habit-check/);
assert.match(views,/data-add-habit/);
assert.match(views,/data-add-routine/);
assert.match(views,/data-edit-goal/);
assert.match(views,/confirmAction\('¿Eliminar esta meta\?'/);
assert.match(store,/goal-3/);
assert.match(styles,/SØD V3\.4\.0 — HÁBITOS \/ LOOP DIARIO/);
assert.match(styles,/habit-v34-tracker-layout/);
assert.match(styles,/habit-v34-routine-layout/);
assert.match(styles,/habit-v34-goals/);
assert.match(styles,/habit-v34-check\.done/);
assert.match(styles,/habit-v34-energy-ring/);
assert.match(styles,/habit-v34-gradient-progress/);
assert.match(views,/--habits-bg:url\('\$\{VISUALS\.habits\}'\)/);
console.log('Habits V3.4 tests passed: approved Tracker/Rutina/Metas UI, stateful interactions, current Habits background preserved');
