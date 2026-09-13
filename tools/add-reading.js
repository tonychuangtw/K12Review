#!/usr/bin/env node
/* 把新的閱讀題組接到 js/data/reading.js 後面。
   用法：node tools/add-reading.js <新題組.json>
   JSON 是陣列，每篇 {grade, title, genre, passage, questions:[{q,options[4],answer,exp}×N]}，
   id 由這支自動接號（r287、r288…）。
   ⚠️ 答案位置要打散：test.js 有「閱讀答案位置分散」的守門，
      這支會把每一題的正解輪流放到不同位置，並同步改寫 answer。*/
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'js/data/reading.js');
const src = process.argv[2];
if (!src) { console.error('用法：node tools/add-reading.js <新題組.json>'); process.exit(2); }

global.window = {};
eval(fs.readFileSync(FILE, 'utf8'));
const cur = window.APP_DATA.reading;
let maxId = 0;
cur.forEach((r) => { const n = parseInt(String(r.id).slice(1), 10); if (n > maxId) maxId = n; });

const add = JSON.parse(fs.readFileSync(src, 'utf8'));
const bad = [];
let seq = 0;
const out = add.map((r, i) => {
  if (!r.grade || !r.title || !r.passage || !Array.isArray(r.questions) || !r.questions.length) {
    bad.push('第 ' + (i + 1) + ' 篇欄位不全');
  }
  if (cur.some((x) => x.title === r.title)) bad.push('標題重複：' + r.title);
  const qs = (r.questions || []).map((q) => {
    if (!Array.isArray(q.options) || q.options.length !== 4) bad.push(r.title + ' 有題目不是 4 個選項');
    if (new Set(q.options).size !== 4) bad.push(r.title + ' 有題目選項重複');
    if (!q.exp) bad.push(r.title + ' 有題目沒有解說');
    // 把正解輪流搬到不同位置，答案才不會集中在同一格
    const want = seq++ % 4;
    const correct = q.options[q.answer];
    const rest = q.options.filter((_, k) => k !== q.answer);
    const opts = rest.slice();
    opts.splice(want, 0, correct);
    return { q: q.q, options: opts, answer: want, exp: q.exp };
  });
  return { id: 'r' + String(++maxId).padStart(3, '0'), grade: r.grade, title: r.title,
           genre: r.genre || '白話', src: r.src || null, passage: r.passage, questions: qs };
});
if (bad.length) { console.error('檢查沒過：\n  ' + bad.join('\n  ')); process.exit(1); }

const text = fs.readFileSync(FILE, 'utf8');
const at = text.lastIndexOf('];');
if (at < 0) { console.error('找不到 reading.js 的結尾'); process.exit(1); }
const body = out.map((r) => '  ' + JSON.stringify(r)).join(',\n');
fs.writeFileSync(FILE, text.slice(0, at).replace(/,?\s*$/, '') + ',\n' + body + '\n];\n');
console.log('新增 ' + out.length + ' 篇（' + out[0].id + '～' + out[out.length - 1].id + '）、' +
  out.reduce((n, r) => n + r.questions.length, 0) + ' 題；reading.js 現有 ' + (cur.length + out.length) + ' 篇');
