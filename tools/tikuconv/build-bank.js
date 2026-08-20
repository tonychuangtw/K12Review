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

// 正解位置打散成 25/25/25/25：把 options 環狀旋轉，讓正解落到 i%4。
// 安全前提是解析引用的是選項「文字」而不是「第幾個」（本專案規格如此）；
// 保險起見，出現「第一則／第二個選項」這種位置指涉的題目一律跳過。
// 在這裡做而不回寫 jsonl，來源檔才能保持人寫的原樣。
const POS_REF = /第[一二三四1-4](?:則|個選項|句話是)|上列第|以上皆|以下皆/;
rows.forEach((r, i) => {
  if (r.options.length !== 4) return;
  if (POS_REF.test(r.exp || '') || r.options.some(o => POS_REF.test(o))) return;
  const shift = (i % 4 - r.answer + 4) % 4;
  if (!shift) return;
  const a = r.options.slice();
  r.options = a.map((_, k) => a[(k - shift + 4) % 4]);
  r.answer = i % 4;
});

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

// 爛誘答守門：選項本身不能是「以外都不對」「這裡沒有別的字」這種湊數字串，
// 那種選項一看就知道不是答案，等於把四選一變成三選一。
const BAD_OPT = /以外都不對|以外的(寫法|答案|字)|這裡沒有|都不對$|沒有這個選項|不是有效/;
let bad = 0;
rows.forEach(r => r.options.forEach(o => {
  if (BAD_OPT.test(o)) { console.log('⚠ 爛誘答', r.id, r.book, '｜', o); bad++; }
}));
if (bad) console.log('⚠ 共 ' + bad + ' 個爛誘答要改');
