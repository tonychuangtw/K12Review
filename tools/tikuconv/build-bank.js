// 把 scratchpad 的 jsonl 批次組成 js/data/<科目>.js（header + 一題一行）
//
// 用法：node build-bank.js <APP_DATA key> <輸出檔> <header 檔> [--renumber <前綴>] <jsonl...>
//
// --renumber <前綴>：照「檔案順序 → 檔內順序」重新編號成 <前綴>0001、<前綴>0002…
//   全年級題庫是一冊一個 jsonl、按年級順序併檔，重編號後 id 就會照年級遞增，
//   之後抽換某一冊也不會和別冊撞號。⚠️ 重編號會讓舊的作答紀錄（錯題本、單元過關）
//   對不到題目，只在題庫建置期間用。
//
// 併檔時順便守門：id 重複、答案位置是否過度集中、完全重複題。
'use strict';
const fs = require('fs');

const argv = process.argv.slice(2);
const key = argv.shift();
const outPath = argv.shift();
const headerPath = argv.shift();
let renumber = null;
const files = [];
while (argv.length) {
  const a = argv.shift();
  if (a === '--renumber') renumber = argv.shift();
  else files.push(a);
}

const rows = [];
for (const f of files) {
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const s = line.trim();
    if (!s) continue;
    rows.push(JSON.parse(s));   // 解析一次，語法錯誤當場爆
  }
}
if (renumber) rows.forEach((r, i) => { r.id = renumber + String(i + 1).padStart(4, '0'); });

const ids = new Set(rows.map(r => r.id));
if (ids.size !== rows.length) throw new Error('id 重複（' + (rows.length - ids.size) + ' 筆）');

const header = fs.readFileSync(headerPath, 'utf8').trimEnd();
fs.writeFileSync(outPath,
  'window.APP_DATA = window.APP_DATA || {};\n' + header +
  '\n// 目前題數：' + rows.length + '\nwindow.APP_DATA.' + key + ' = [\n' +
  rows.map(r => JSON.stringify(r)).join(',\n') + '\n];\n');

console.log(key, rows.length, '題 →', outPath);
const pos = [0, 0, 0, 0];
rows.forEach(r => { if (r.options.length === 4) pos[r.answer]++; });
console.log('答案位置分布', pos.join('/'), '最大占比',
  (Math.max(...pos) / rows.length * 100).toFixed(1) + '%');

// 每冊有幾個單元（Tony 2026-08-20：一冊 9 單元 = 3 段考 × 3 單元）
const books = [];
const bmap = {};
rows.forEach(r => {
  const b = r.grade + '|' + r.book;
  if (!bmap[b]) { bmap[b] = { book: r.book, grade: r.grade, n: 0, units: new Set() }; books.push(bmap[b]); }
  bmap[b].n++; bmap[b].units.add(r.lesson);
});
books.forEach(b => {
  const flag = b.units.size >= 9 ? '' : '  ⚠ 單元數不足 9';
  console.log('  ' + b.grade + ' ' + b.book + '：' + b.n + ' 題 / ' + b.units.size + ' 單元' + flag);
});

const seen = new Map();
rows.forEach(r => {
  const k = r.q.trim() + '||' + r.options.join('|') + '||' + r.answer;
  if (seen.has(k)) console.log('⚠ 完全重複題', r.id, seen.get(k));
  seen.set(k, r.id);
});
