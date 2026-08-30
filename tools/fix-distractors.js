#!/usr/bin/env node
/* 誘答重寫（2026-08-30 Tony 回報「正確答案幾乎都是描述最長的那一個」）
 *
 * 問題：各科自編原創題的正解是完整句子（平均 23 字），誘答卻是「兩者相同」
 *       「固定不變」這種 4-6 字的敷衍句。實測公民 99.8%、地理 98.3% 的題目，
 *       正解都是唯一最長的選項 —— 學生不必讀題，挑最長的就有九成五。
 *
 * 做法：同一課其他題的「正解」就是天然的好誘答 —— 長度相當、語氣一致、
 *       主題相鄰，而且對這一題來說明確是錯的。這和 checks-*.js 的
 *       解析確認題用同一套邏輯（正解取自原文、誘答取自同課其他題）。
 *
 * 守門：
 *   ・反向題（「下列何者不是…」）跳過不動 —— 借來的敘述可能剛好也成立
 *   ・借來的敘述與正解字元重疊超過六成就跳過（避免換湯不換藥）
 *   ・借來的敘述出現在題幹裡就跳過
 *   ・題幹彼此高度相似（近似重複題）不互相借
 *   ・候選不足 3 個就整題跳過，保留原本的選項
 *   ・正解位置用 index % 4 打散（test.js 有守門檢查分布）
 *   ・解析的「❌ 其他選項」原句保留不動（checks-*.js 的正解要在解析裡找得到根據），
 *     只在後面補一句說明三個誘答分別是哪些概念
 *
 * 用法：node tools/fix-distractors.js <題庫>        只看報告與抽樣，不寫檔
 *       node tools/fix-distractors.js <題庫> --write  寫回 js/data/<題庫>.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const BANK = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!BANK) { console.error('用法：node tools/fix-distractors.js <題庫> [--write]'); process.exit(1); }

global.window = {};
require(path.join(ROOT, 'js/data', BANK + '.js'));
const A = (window.APP_DATA || {})[BANK];
if (!Array.isArray(A) || !A.length) { console.error('找不到題庫 ' + BANK); process.exit(1); }

const NEG = /不是|不正確|錯誤|何者非|不包括|不屬於|以外/;
function term(q) { const m = String(q).match(/[「『]([^」』]{2,12})[」』]/); return m ? m[1] : null; }
function overlap(a, b) {
  const sa = new Set(a), sb = new Set(b);
  let hit = 0; sa.forEach((c) => { if (sb.has(c)) hit++; });
  return hit / Math.max(1, Math.min(sa.size, sb.size));
}

const byLesson = {};
A.forEach((it, i) => {
  const k = (it.book || '') + '|' + (it.lesson || '');
  (byLesson[k] = byLesson[k] || []).push(i);
});

const plan = new Map();          // index -> { options, answer, note }
let skipped = 0;
Object.values(byLesson).forEach((idxs) => {
  idxs.forEach((gi, pos) => {
    const it = A[gi];
    if (NEG.test(it.q)) { skipped++; return; }
    if (!Array.isArray(it.options) || it.options.length !== 4) { skipped++; return; }
    const cor = String(it.options[it.answer]);
    /* 數值題不動：正解是「3 m/s²」這種的話，借來的敘述型誘答會變成
       「四個選項只有一個是數字」，反而更好猜。原本的數值誘答型別相符，
       實測最長率本來就只有 12-15%，沒有問題。（2026-08-30） */
    const NUM = (t) => /[0-9]/.test(String(t));
    const numOrigDistr = it.options.filter((o, i) => i !== it.answer && NUM(o)).length;
    if (NUM(cor) || numOrigDistr >= 2) { skipped++; return; }
    const cands = idxs
      .filter((j) => j !== gi)
      .map((j) => ({ t: String(A[j].options[A[j].answer]), j,
                     d: Math.abs(String(A[j].options[A[j].answer]).length - cor.length) +
                        Math.abs(idxs.indexOf(j) - pos) * 0.3 }))
      .filter((c) => c.t !== cor
        && !NUM(c.t)
        && overlap(c.t, cor) < 0.6
        && overlap(String(A[c.j].q), String(it.q)) < 0.75
        && !String(it.q).includes(c.t.slice(0, 6))
        && !c.t.includes(cor.slice(0, 6))
        && Math.abs(c.t.length - cor.length) <= Math.max(8, cor.length * 0.6));
    cands.sort((x, y) => x.d - y.d);
    const pick = [];
    for (const c of cands) {
      if (pick.length === 3) break;
      if (pick.some((p) => p.t === c.t || overlap(p.t, c.t) > 0.7)) continue;
      pick.push(c);
    }
    if (pick.length < 3) { skipped++; return; }
    const a = gi % 4;
    const options = []; let k = 0;
    for (let s = 0; s < 4; s++) options.push(s === a ? cor : pick[k++].t);
    const names = pick.map((p) => term(A[p.j].q)).filter(Boolean);
    plan.set(gi, { options, answer: a, names });
  });
});

/* 統計：改完之後「正解是唯一最長／最短」的比例 */
function extremeRate(get, pickExtreme) {
  let n = 0, hit = 0;
  A.forEach((it, i) => {
    const p = plan.get(i);
    const o = get(it, p), a = p ? p.answer : it.answer;
    if (!Array.isArray(o) || o.length !== 4) return;
    const L = o.map((x) => String(x).length);
    const m = pickExtreme(...L);
    if (L[a] === m && L.filter((x) => x === m).length === 1) hit++;
    n++;
  });
  return 100 * hit / n;
}
const before = extremeRate((it) => it.options, Math.max);
const after = extremeRate((it, p) => (p ? p.options : it.options), Math.max);
const sBefore = extremeRate((it) => it.options, Math.min);
const sAfter = extremeRate((it, p) => (p ? p.options : it.options), Math.min);
console.log(`${BANK}：共 ${A.length} 題，可重寫 ${plan.size} 題，跳過 ${skipped} 題`);
console.log(`「正解是唯一最長」：${before.toFixed(1)}% → ${after.toFixed(1)}%`);
console.log(`「正解是唯一最短」：${sBefore.toFixed(1)}% → ${sAfter.toFixed(1)}%`);

/* 抽樣給人看（每 8 課抽一題） */
const keys = Object.keys(byLesson);
keys.filter((_, i) => i % 8 === 0).slice(0, 6).forEach((k) => {
  const gi = byLesson[k].find((i) => plan.has(i));
  if (gi == null) return;
  const p = plan.get(gi);
  console.log('\n[' + k + '] ' + A[gi].q);
  console.log('  舊：' + A[gi].options.map((o) => '[' + String(o).length + ']' + o).join('  '));
  p.options.forEach((o, i) => console.log('  ' + (i === p.answer ? '✅' : '  ') + ' [' + o.length + '] ' + o));
  if (p.names.length) console.log('  誘答來自本課的：' + p.names.join('、'));
});

if (!WRITE) { console.log('\n（沒有加 --write，只看不改）'); process.exit(0); }

/* 解析補一句：說明三個誘答分別是本課的哪些概念（原本的 ✅／❌／📚 三行一字不動） */
function patchExp(exp, names) {
  const who = names.length
    ? '本課「' + names.join('」「') + '」的說明'
    : '本課其他概念的說明';
  const note = '（另外三個選項是' + who + '，各自都對，但不是這一題在問的。）';
  const lines = String(exp || '').split('\n');
  if (lines.some((l) => l.indexOf(note) >= 0)) return exp;
  const at = lines.findIndex((l) => l.trim().startsWith('📚'));
  if (at < 0) lines.push(note); else lines.splice(at, 0, note);
  return lines.join('\n');
}

/* 寫回檔案：每題本來就是一行 compact JSON（已驗證 1:1 round-trip），
 * 所以逐行 parse → 改 options／answer／exp → stringify 寫回，版面不變。 */
const file = path.join(ROOT, 'js/data', BANK + '.js');
const byId = new Map();
A.forEach((it, i) => { if (plan.has(i)) byId.set(it.id, plan.get(i)); });
let changed = 0, missed = 0;
const out = fs.readFileSync(file, 'utf8').split('\n').map((line) => {
  if (!line.startsWith('{"id":')) return line;
  const tail = line.endsWith(',') ? ',' : '';
  const body = tail ? line.slice(0, -1) : line;
  let o;
  try { o = JSON.parse(body); } catch (e) { missed++; return line; }
  const p = byId.get(o.id);
  if (!p) return line;
  o.options = p.options;
  o.answer = p.answer;
  o.exp = patchExp(o.exp, p.names);
  changed++;
  return JSON.stringify(o) + tail;
});
fs.writeFileSync(file, out.join('\n'));
console.log(`\n寫回 ${file}：改了 ${changed} 題，parse 失敗 ${missed} 行`);
