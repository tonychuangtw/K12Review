#!/usr/bin/env node
/* 把 js/data/custom.js（國語匯入題庫，24MB）按「冊」拆成小檔。
   由來：2026-09-13 Tony 回報「電腦可進手機不行」——匯入題庫一次要載幾十 MB，
   手機直接失敗。首頁與科目切換已經改成不載題庫了，但「做題」仍要整包載，
   所以再拆一層：選到哪一冊才載那一冊（五上約 2.6MB，是原本的十分之一）。

   產出：
     js/data/custom/<slug>.js   每一冊一支，內容 append 進 window.APP_DATA.custom
     js/data/custom-index.js    冊→課的清單與題數（很小，隨頁面一起載）
   來源 js/data/custom.js 保留不動：搜尋與錯題本仍有「整包載」的路徑要用。
   用法：node tools/split-custom.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUTDIR = path.join(ROOT, 'js/data/custom');

global.window = {};
eval(fs.readFileSync(path.join(ROOT, 'js/data/custom.js'), 'utf8'));
const all = window.APP_DATA.custom || [];

// 冊名 → 檔名（只用英數，避免不同系統對中文檔名的處理差異）
const GRADE = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
function slugOf(book) {
  const m = /^(十[一二])?([一二三四五六七八九十])?(上|下)$/.exec(book || '');
  if (m) {
    const g = m[1] ? (m[1] === '十一' ? 11 : 12) : GRADE[m[2]];
    return 'g' + g + (m[3] === '上' ? 'a' : 'b');
  }
  const other = { 會考: 'cap', 基測: 'bctest', 特招: 'special', 未分類: 'misc' };
  return other[book] || 'x' + Buffer.from(String(book)).toString('hex').slice(0, 8);
}

const byBook = new Map();
all.forEach((q) => {
  const b = q.book || '未分類';
  if (!byBook.has(b)) byBook.set(b, []);
  byBook.get(b).push(q);
});

fs.mkdirSync(OUTDIR, { recursive: true });
const index = [];
for (const [book, list] of byBook) {
  const slug = slugOf(book);
  const lessons = [];
  const seen = new Map();
  list.forEach((q) => {
    const l = q.lesson || '未分課';
    if (!seen.has(l)) { seen.set(l, { lesson: l, n: 0 }); lessons.push(seen.get(l)); }
    seen.get(l).n++;
  });
  // 題目 id → 哪一冊（2026-09-14 codex 體檢）：錯題本只記 id，以前查不到出處就整包載 24MB。
  // id 在同一冊裡幾乎連號，用區間表示全庫只要 255 段，索引檔多不到 4KB。
  const nums = list.map((q) => parseInt(String(q.id).replace(/^x/, ''), 10))
    .filter((n) => n > 0).sort((a, b) => a - b);
  const ranges = [];
  nums.forEach((n) => {
    const last = ranges[ranges.length - 1];
    if (last && n === last[1] + 1) last[1] = n;
    else if (!last || n !== last[1]) ranges.push([n, n]);
  });

  const body = '// 康軒／家長匯入題庫・' + book + '（由 tools/split-custom.js 從 js/data/custom.js 拆出，勿手改）\n' +
    'window.APP_DATA = window.APP_DATA || {};\n' +
    'window.APP_DATA.custom = (window.APP_DATA.custom || []).concat(\n' +
    list.map((q) => JSON.stringify(q)).join(',\n') + '\n);\n';
  fs.writeFileSync(path.join(OUTDIR, slug + '.js'), body);
  index.push({ book: book, slug: slug, n: list.length, r: ranges, lessons: lessons });
}
index.sort((a, b) => b.n - a.n);
fs.writeFileSync(path.join(ROOT, 'js/data/custom-index.js'),
  '// 國語匯入題庫的「冊→課」清單（由 tools/split-custom.js 產生，勿手改）。\n' +
  '// 題庫本體按冊拆在 js/data/custom/<slug>.js，選到哪一冊才載哪一冊。\n' +
  'window.APP_CUSTOM_INDEX = ' + JSON.stringify(index) + ';\n');

const sizes = index.map((x) => {
  const kb = Math.round(fs.statSync(path.join(OUTDIR, x.slug + '.js')).size / 1024);
  return x.book + ' ' + x.n + '題/' + kb + 'KB';
});
console.log('拆成 ' + index.length + ' 冊：' + sizes.join('、'));
console.log('索引 js/data/custom-index.js：' +
  Math.round(fs.statSync(path.join(ROOT, 'js/data/custom-index.js')).size / 1024) + 'KB');
