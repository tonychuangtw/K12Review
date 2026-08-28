#!/usr/bin/env node
/* 拿教育部《國語辭典簡編本》比對 phonics.js / chars.js / idioms.js 的注音。
 *
 * 由來：2026-08-28 Tony 的兒子（小四）發現「湖泊」正解給 ㄆㄛ，教育部審訂音是 ㄅㄛˊ，
 * 而正確的 ㄅㄛˊ 反而被放進錯誤選項。一掃才知道三個題庫共 97 條注音不是審訂音。
 * 所以把這個比對寫成常駐工具：**新增字音／字形／成語題之後跑一次**。
 *
 * 用法：node tools/moe-zy-audit.js         （缺快取會自動叫 tools/moe-zy-index.py 下載）
 *       node tools/moe-zy-audit.js --json  （輸出 JSON 給別的腳本吃）
 * 有不一致時 exit code 1。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const CACHE = path.join(ROOT, '.cache', 'moe-concised.json');
if (!fs.existsSync(CACHE)) {
  execFileSync('python3', [path.join(__dirname, 'moe-zy-index.py')], { stdio: 'inherit' });
}
const { idx } = JSON.parse(fs.readFileSync(CACHE, 'utf8'));

global.window = {};
for (const f of ['phonics', 'chars', 'idioms']) {
  eval(fs.readFileSync(path.join(ROOT, 'js/data', f + '.js'), 'utf8'));
}
const D = window.APP_DATA;
const n = z => String(z || '').replace(/\s+/g, ' ').trim();
const readings = w => {
  const e = idx[w];
  return e ? [...e.main, ...e.alt].map(n) : null;
};

const bad = [];
for (const it of D.phonics) {
  const c = readings(it.target);
  if (c && !c.includes(n(it.zhuyin)))
    bad.push({ bank: 'phonics', id: it.id, grade: it.grade, item: it.word,
               field: `目標字「${it.target}」`, ours: it.zhuyin, moe: c.join(' | ') });
  const w = readings(it.word);
  if (w && !w.includes(n(it.wz)))
    bad.push({ bank: 'phonics', id: it.id, grade: it.grade, item: it.word,
               field: '整詞注音 wz', ours: n(it.wz), moe: w.join(' | ') });
}
for (const it of D.chars) {
  const c = readings(it.answer);
  if (c && !c.includes(n(it.zhuyin)))
    bad.push({ bank: 'chars', id: it.id, grade: it.grade, item: it.answer,
               field: 'zhuyin', ours: it.zhuyin, moe: c.join(' | ') });
}
for (const it of D.idioms) {
  const w = readings(it.term);
  if (w && w.length && !w.includes(n(it.zhuyin)))
    bad.push({ bank: 'idioms', id: it.id, grade: it.grade, item: it.term,
               field: 'zhuyin', ours: n(it.zhuyin), moe: w.join(' | ') });
}

/* 已人工判定為「辭典本身沒收這個詞條、單字條目又不列輕聲」的例外。
   加白名單前請先查教育部辭典確認，並在這裡寫清楚理由。 */
const ALLOW = {
  // 「東西」（物品）簡編本詞條就是 ㄉㄨㄥ ˙ㄒㄧ；只有單字「西」條目不列輕聲
  p425: '買東西的「西」讀輕聲，簡編本「東西」詞條有列 ㄉㄨㄥ ˙ㄒㄧ',
};
const real = bad.filter(b => !ALLOW[b.id]);

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(real, null, 2));
} else {
  console.log(`教育部簡編本注音比對：字音 ${D.phonics.length}／字形 ${D.chars.length}／成語 ${D.idioms.length} 題`);
  if (!real.length) {
    console.log('  ✓ 全部相符（辭典查無的詞條自動略過）');
  } else {
    real.forEach(b => console.log(
      `  ✗ ${b.id} G${b.grade} ${b.bank} ${b.item} ${b.field}：我們 ${b.ours}　簡編本 ${b.moe}`));
    console.log(`共 ${real.length} 筆不一致`);
  }
}
process.exit(real.length ? 1 : 0);
