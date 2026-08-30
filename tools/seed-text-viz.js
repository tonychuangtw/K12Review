#!/usr/bin/env node
/* 課文帶讀配圖（2026-08-30 Tony：「12 個年級的帶讀全都是純文字，太死了」）
 *
 * 想法：每個單元的概念卡本來就有 6 張配好的圖，那些 spec 已經照這個單元的內容挑過、
 *       也通過 viz-match 的圖文相符檢查。把它們接到帶讀對應的段落即可，
 *       不必重新設計，也不會硬塞不相干的圖。
 *
 * 對齊方式：帶讀段落與概念卡逐字比相似度，取最相似的那一張。
 *   ・數學 99.5%、自然 100% 是同序對齊（兩邊都照同一份大綱寫），比對只是再確認
 *   ・物理／化學／生物／地科的帶讀是另外寫的，沒有同序關係，一律靠相似度挑
 *
 * 一個單元只配前 3 高分的段落（不是六段全配）：
 *   ・避免和後面的概念卡完全重複（Mayer 的 redundancy 原則）
 *   ・codex 的建議也是先覆蓋 15-25%，把圖放在「單靠文字說不清楚」的地方
 *
 * 用法：node tools/seed-text-viz.js <科目> [--write] [--min 0.5] [--per 3]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SUBJ = process.argv[2];
const WRITE = process.argv.includes('--write');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const MIN = arg('--min', 0.5), PER = arg('--per', 3);
/* --no-texty：完全不要文字排版類元件。高中理科用這個 ——
   那四科的概念卡九成是文字排版，接過去等於把同一段文字換個框再看一次。 */
const NO_TEXTY = process.argv.includes('--no-texty');
if (!SUBJ) { console.error('用法：node tools/seed-text-viz.js <科目> [--write]'); process.exit(1); }

global.window = {};
require(path.join(ROOT, 'js/data', 'texts-' + SUBJ + '.js'));
require(path.join(ROOT, 'js/data', 'lessons-' + SUBJ + '.js'));
const T = window.APP_TEXTS, L = window.APP_LESSONS;

const toks = (s) => new Set(String(s).replace(/[，。、；：？！「」（）()\s]/g, '').split(''));
function sim(a, b) {
  const A = toks(a), B = toks(b);
  let h = 0; A.forEach((c) => { if (B.has(c)) h++; });
  return h / Math.max(1, Math.min(A.size, B.size));
}

/* 有些元件其實只是「把文字排進框裡」（左右對照、流程步驟、分類表），
   不是真的圖。這種能幫上忙但價值低，同一個單元最多用一個，
   而且只有在沒有真正的圖可用時才選 —— 不然就變成把文字換個框再貼一次。 */
const TEXTY = new Set(['compareexp', 'classify', 'energyflow', 'levels', 'orgchart']);
const BONUS = 0.25;           // 真的是圖的加分，讓它贏過分數略高的文字排版

const plan = [];              // { key, si, viz, score, cardTitle, segH }
Object.keys(T).forEach((key) => {
  if (key.split('|')[0] !== SUBJ) return;
  const les = L[key];
  if (!les || !Array.isArray(les.cards)) return;
  const segs = T[key].segs || [], cards = les.cards;
  const rows = [];
  segs.forEach((g, i) => {
    if (g.viz) return;                                   // 已經配過的不動（樣板單元）
    const st = g.h + ' ' + g.s.join('');
    let best = null;
    cards.forEach((c, j) => {
      if (!c.viz || !c.viz.type) return;
      if (NO_TEXTY && TEXTY.has(c.viz.type)) return;
      const raw = sim(st, (c.title || '') + ' ' + (c.body || ''));
      const v = raw + (TEXTY.has(c.viz.type) ? 0 : BONUS);
      if (!best || v > best.v) best = { v, raw, j, c };
    });
    if (best && best.raw >= MIN) rows.push({ i, ...best });
  });
  rows.sort((a, b) => b.v - a.v);
  const usedCard = {}, usedType = {};
  let n = 0, texty = 0;
  rows.forEach((r) => {
    if (n >= PER) return;
    if (usedCard[r.j] || usedType[r.c.viz.type]) return;  // 同單元不重複用同一張／同一型
    const isTexty = TEXTY.has(r.c.viz.type);
    if (isTexty && texty >= 1) return;                    // 文字排版類一個單元最多一個
    usedCard[r.j] = usedType[r.c.viz.type] = 1;
    n++; if (isTexty) texty++;
    plan.push({ key, si: r.i, viz: r.c.viz, score: r.raw,
                cardTitle: r.c.title || '', segH: segs[r.i].h });
  });
});

const units = new Set(plan.map((p) => p.key)).size;
const types = {};
plan.forEach((p) => { types[p.viz.type] = (types[p.viz.type] || 0) + 1; });
console.log(`${SUBJ}：${units} 個單元、${plan.length} 段要配圖（門檻 ${MIN}、每單元最多 ${PER}）`);
console.log('用到的元件：' + Object.entries(types).sort((a, b) => b[1] - a[1])
  .slice(0, 12).map((e) => e[0] + '×' + e[1]).join(' '));
console.log('\n抽樣：');
plan.filter((_, i) => i % Math.max(1, Math.floor(plan.length / 8)) === 0).slice(0, 8)
  .forEach((p) => console.log(`  [${p.key}] 第${p.si + 1}段「${p.segH}」\n     ← ${p.viz.type}（來自概念卡「${p.cardTitle}」，相似度 ${p.score.toFixed(2)}）`));

if (!WRITE) { console.log('\n（沒有加 --write，只看不改）'); process.exit(0); }

/* 寫回：在該段的 "q: {" 前插入 viz */
const file = path.join(ROOT, 'js/data', 'texts-' + SUBJ + '.js');
let src = fs.readFileSync(file, 'utf8');
const byKey = {};
plan.forEach((p) => { (byKey[p.key] = byKey[p.key] || []).push(p); });
let done = 0, miss = 0;
Object.keys(byKey).forEach((key) => {
  const head = "window.APP_TEXTS['" + key + "'] = {";
  const i = src.indexOf(head);
  if (i < 0) { miss += byKey[key].length; return; }
  const j = src.indexOf('\n};\n', i);
  const parts = src.slice(i, j).split('\n      q: {');
  if (parts.length !== 7) { miss += byKey[key].length; return; }
  const want = {};
  byKey[key].forEach((p) => { want[p.si] = p.viz; });
  let out = parts[0];
  for (let n = 1; n <= 6; n++) {
    const v = want[n - 1];
    if (v) { out += '\n      viz: ' + JSON.stringify(v) + ',\n      q: {' + parts[n]; done++; }
    else out += '\n      q: {' + parts[n];
  }
  src = src.slice(0, i) + out + src.slice(j);
});
fs.writeFileSync(file, src);
console.log(`\n寫回 ${file}：配了 ${done} 段，失敗 ${miss} 段`);
