import fs from 'node:fs';
import assert from 'node:assert/strict';

const data=fs.readFileSync('public/js/library-data.js','utf8');
const views=fs.readFileSync('public/js/views.js','utf8');
const css=fs.readFileSync('public/styles.css','utf8');
const vercel=fs.readFileSync('vercel.json','utf8');
for(const token of ['libraryVideoChannels','youtubeThumbnail','Eckhart Tolle','Rupert Spira','Sadhguru','Daily Stoic','Huberman Lab','Alex Hormozi','Eternalised']) assert.ok(data.includes(token),`missing videoteca token: ${token}`);
for(const token of ['videoteca-final','Videos curados para ti','Profundiza más','Canales esenciales','data-inline-play','bindVideotecaFinalPlayers']) assert.ok(views.includes(token),`missing videoteca UI token: ${token}`);
assert.ok(views.includes("booksView.style.display=isBooks?'':'none'"),'books hard-hide missing');
assert.ok(views.includes("videosView.style.display=isVideos?'block':'none'"),'videos hard-show/hide missing');
assert.doesNotMatch(views,/data-library-mode="events"/,'Events must live in Community, not Library');
assert.match(css,/Library final: books \+ videos only/);
assert.ok(vercel.includes('https://img.youtube.com'));
assert.ok(vercel.includes('https://i.ytimg.com'));
console.log('Videoteca tests passed: Books/Videos exclusive, curated channels, inline playback, no duplicate Events module');
