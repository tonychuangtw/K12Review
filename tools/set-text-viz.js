#!/usr/bin/env node
/* 直接把 viz 掛到課文帶讀的段落上（2026-08-30）
 *
 * seed-text-viz.js 是「從概念卡挑一張接過來」，只能用在有 lessons-<科>.js 的科目。
 * 國語沒有概念卡系統（它的單元學習走成語／字音／字形那一套），
 * 所以語文常識的帶讀要直接指定：哪一篇的第幾段配哪一張圖。
 *
 * 用法：node tools/set-text-viz.js <plan.json> [--write]
 *   plan.json = [{ "key": "chinese|1|第1篇 注音符號怎麼拼",
 *                  "seg": 1,                       // 第幾段，從 1 起算
 *                  "viz": { "type": "zhuyinparts" } }, ...]
 * 已經有 viz 的段落不動（要換要先手動清掉），避免重複跑之後愈疊愈多。
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const PLAN = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!PLAN) { console.error('用法：node tools/set-text-viz.js <plan.json> [--write]'); process.exit(1); }
const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'));

global.window = {};
const subjs = [...new Set(plan.map((p) => p.key.split('|')[0]))];
subjs.forEach((s) => require(path.join(ROOT, 'js/data', 'texts-' + s + '.js')));
const T = window.APP_TEXTS;

/* 先驗證：單元在不在、段號合不合法、那一段是不是已經有圖、一個單元有沒有超過 3 段 */
const perUnit = {};
const good = [];
let bad = 0;
plan.forEach((p) => {
  const u = T[p.key];
  if (!u) { console.log('✗ 找不到單元：' + p.key); bad++; return; }
  const g = (u.segs || [])[p.seg - 1];
  if (!g) { console.log('✗ 沒有第 ' + p.seg + ' 段：' + p.key); bad++; return; }
  if (g.viz) { console.log('－ 已經有圖，跳過：' + p.key + ' 第' + p.seg + '段'); return; }
  const has = (u.segs || []).filter((x) => x.viz).length;
  perUnit[p.key] = (perUnit[p.key] || has) + 1;
  /* 2026-09-05 Tony 要求提高帶讀配圖比例 → 上限由 3 放寬到 4。
     一個單元 6 段，配 4 段留 2 段純文字，還是保有變化（Mayer 的 redundancy 原則）。
     要再放寬就下 --per N。 */
  const PER = (function () { const i = process.argv.indexOf('--per'); return i > 0 ? Number(process.argv[i + 1]) : 4; })();
  if (perUnit[p.key] > PER) { console.log('✗ 超過每單元 ' + PER + ' 段的上限：' + p.key); bad++; return; }
  good.push({ ...p, h: g.h });
});

console.log('\n可以配 ' + good.length + ' 段，' + Object.keys(perUnit).length + ' 個單元，問題 ' + bad + ' 筆');
const types = {};
good.forEach((p) => { types[p.viz.type] = (types[p.viz.type] || 0) + 1; });
console.log('用到的元件：' + Object.entries(types).sort((a, b) => b[1] - a[1])
  .map((e) => e[0] + '×' + e[1]).join(' '));
console.log('\n抽樣：');
good.filter((_, i) => i % Math.max(1, Math.floor(good.length / 8)) === 0).slice(0, 8)
  .forEach((p) => console.log('  [' + p.key + '] 第' + p.seg + '段「' + p.h + '」← ' + p.viz.type));

if (!WRITE) { console.log('\n（沒有加 --write，只看不改）'); process.exit(bad ? 1 : 0); }

/* 寫回：在該段的 "q: {" 前插入 viz —— 與 seed-text-viz.js 同一套做法 */
const bySubj = {};
good.forEach((p) => { const s = p.key.split('|')[0]; (bySubj[s] = bySubj[s] || []).push(p); });
let done = 0, miss = 0;
Object.keys(bySubj).forEach((subj) => {
  const file = path.join(ROOT, 'js/data', 'texts-' + subj + '.js');
  let src = fs.readFileSync(file, 'utf8');
  const byKey = {};
  bySubj[subj].forEach((p) => { (byKey[p.key] = byKey[p.key] || []).push(p); });
  Object.keys(byKey).forEach((key) => {
    const head = "window.APP_TEXTS['" + key + "'] = {";
    const i = src.indexOf(head);
    if (i < 0) { miss += byKey[key].length; return; }
    const j = src.indexOf('\n};\n', i);
    const parts = src.slice(i, j).split('\n      q: {');
    if (parts.length !== 7) { console.log('✗ 段落結構不是六段：' + key); miss += byKey[key].length; return; }
    const want = {};
    byKey[key].forEach((p) => { want[p.seg - 1] = p.viz; });
    let out = parts[0];
    for (let n = 1; n <= 6; n++) {
      const v = want[n - 1];
      if (v) { out += '\n      viz: ' + JSON.stringify(v) + ',\n      q: {' + parts[n]; done++; }
      else out += '\n      q: {' + parts[n];
    }
    src = src.slice(0, i) + out + src.slice(j);
  });
  fs.writeFileSync(file, src);
});
console.log('\n配了 ' + done + ' 段，失敗 ' + miss + ' 段');
