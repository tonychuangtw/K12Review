#!/usr/bin/env node
/* 驗證 tools/zy2py.js：拿 chars.js／phonics.js 裡人工寫好的注音＋拼音逐筆比對。
   用法：node tools/zy2py-check.js   （有不合就 exit 1 並列出前幾筆） */
'use strict';
const fs = require('fs');
const path = require('path');
const { zy2py } = require('./zy2py');
const ROOT = path.join(__dirname, '..');
global.window = {};
for (const f of ['chars', 'phonics']) eval(fs.readFileSync(path.join(ROOT, 'js/data', f + '.js'), 'utf8'));
const D = window.APP_DATA;
const bad = [];
let n = 0;
[['chars', D.chars], ['phonics', D.phonics]].forEach(([name, arr]) => {
  (arr || []).forEach((it) => {
    if (!it.zhuyin || !it.pinyin) return;
    n++;
    const got = zy2py(it.zhuyin);
    if (got !== it.pinyin) bad.push(`${name}/${it.id} ${it.zhuyin} → 我們算出 ${got}，資料寫 ${it.pinyin}`);
  });
});
console.log(`比對 ${n} 筆，不合 ${bad.length} 筆`);
bad.slice(0, 15).forEach((x) => console.log('  ✗ ' + x));
process.exit(bad.length ? 1 : 0);
