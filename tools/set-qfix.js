#!/usr/bin/env node
/* 高中七科題目品質修復（2026-08-31，Tony 核定第 8 項「丙：兩者都做」）
 *
 * 問題：高中七科 12,096 題裡有 10,951 題的三個誘答是「從同一課別張卡片借來的正確敘述」，
 * 解析裡還留著自白「（另外三個選項是本課『○○』的說明，各自都對，但不是這一題在問的。）」。
 * 學生只要記得「這一課有幾張卡」就能刪去法答對，而且四個選項其實都對＝題目本身有瑕疵。
 *
 * 修法（一律人工逐題撰寫，不可用程式生成）：
 *   1. 三個誘答改寫成「跟題目同一個概念、但確實是錯的」敘述（常見錯誤、似是而非、張冠李戴）
 *   2. exp 重寫：✅ 正解為什麼對 ＋ ❌ 逐個交代三個誘答各自錯在哪 ＋ 📚 課綱重點
 *
 * 用法：node tools/set-qfix.js <patch.json> [--write]
 *   patch.json = [{ "id":"ci0001", "d":["誘答一","誘答二","誘答三"], "exp":"✅ …\n❌ …\n📚 課綱重點：…" }]
 *   exp 選填；不給就只換誘答（沿用舊解析）。
 * 正解位置用 index % 4 打散（test.js 有守門檢查分布）。
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const PATCH = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!PATCH) { console.error('用法：node tools/set-qfix.js <patch.json> [--write]'); process.exit(1); }
const patch = JSON.parse(fs.readFileSync(PATCH, 'utf8'));

global.window = {};
['science', 'social', 'english', 'math', 'civics', 'geography', 'history', 'physics', 'chemistry', 'biology', 'earth'].forEach((s) => {
  const f = path.join(ROOT, 'js/data', s + '.js');
  if (fs.existsSync(f)) require(f);
});
const D = window.APP_DATA || {};
const where = {};
Object.keys(D).forEach((k) => {
  if (Array.isArray(D[k])) D[k].forEach((it, i) => { if (it && it.id) where[it.id] = { bank: k, i: i }; });
});

const jobs = [];
let bad = 0;
const seen = {};
patch.forEach((p) => {
  const w = where[p.id];
  if (!w) { console.log('✗ 找不到題目 ' + p.id); bad++; return; }
  if (seen[p.id]) { console.log('✗ ' + p.id + ' 在 patch 裡重複'); bad++; return; }
  seen[p.id] = 1;
  const it = D[w.bank][w.i];
  if (!Array.isArray(p.d) || p.d.length !== 3) { console.log('✗ ' + p.id + ' 要剛好三個誘答'); bad++; return; }
  const cor = String(it.options[it.answer]);
  if (p.d.some((x) => String(x) === cor)) { console.log('✗ ' + p.id + ' 誘答跟正解一樣'); bad++; return; }
  if (new Set(p.d.map(String)).size !== 3) { console.log('✗ ' + p.id + ' 三個誘答有重複'); bad++; return; }
  const mx = Math.max(...p.d.map((x) => String(x).length));
  /* 2026-08-31 收緊：至少要有一個誘答不比正解短。
     原本只擋「短 6 字以上」，結果正解仍是四個選項裡唯一最長的那個，
     test.js 的「正解最長」比例反而被推高（公民做到 280 題就從 8.6% 升到 15.5%）。
     長度不是唯一破綻，但它是唯一可以機械守門的那一個，就守到底。 */
  if (mx < cor.length) { console.log('⚠ ' + p.id + ' 要有一個誘答不比正解短（最長 ' + mx + ' vs 正解 ' + cor.length + '）'); bad++; return; }
  if (p.exp) {
    if (p.exp.indexOf('各自都對，但不是這一題在問的') >= 0) { console.log('✗ ' + p.id + ' 解析還留著舊的自白句'); bad++; return; }
    /* ❌ 段不可寫「第一個選項」這種位置指涉：選項順序是 index % 4 打散的，位置不固定；
       而且確認題會把這些小句抓去當選項，test.js 的 POS_REF 會直接擋下。要指名就引用那句誘答本身。 */
    if (/第[一二三四1-4]個選項|第[一二三四1-4]句|最後一句|上面那句|前一句/.test(p.exp)) { console.log('✗ ' + p.id + ' 解析有位置指涉（第N個選項），要改成引用誘答原文'); bad++; return; }
    if (p.exp.indexOf('✅') < 0 || p.exp.indexOf('❌') < 0 || p.exp.indexOf('📚') < 0) { console.log('✗ ' + p.id + ' 解析要有 ✅ ❌ 📚 三段'); bad++; return; }
    /* ✅ 與 📚 兩行一字不能改：確認題（checks-*.js）有兩種題型直接拿這兩行當正解，
       改了字面就會變成「正解在解析裡找不到根據」（2026-08-31 公民 12 條踩過）。
       這一輪要改寫的只有 ❌ 段。 */
    const oldL = String(it.exp || '').split('\n'), newL = p.exp.split('\n');
    const pick = (ls, sym) => ls.find((l) => l.indexOf(sym) === 0) || '';
    if (pick(oldL, '✅') && pick(newL, '✅') !== pick(oldL, '✅')) { console.log('✗ ' + p.id + ' ✅ 那一行被改了，要原文照抄'); bad++; return; }
    if (pick(oldL, '📚') && pick(newL, '📚') !== pick(oldL, '📚')) { console.log('✗ ' + p.id + ' 📚 那一行被改了，要原文照抄'); bad++; return; }
  }
  const a = w.i % 4;
  const options = []; let k = 0;
  for (let s = 0; s < 4; s++) options.push(s === a ? cor : String(p.d[k++]));
  jobs.push({ id: p.id, bank: w.bank, options: options, answer: a, cor: cor, q: it.q, old: it.options, exp: p.exp || null });
});

console.log('可以改 ' + jobs.length + ' 題，問題 ' + bad + ' 題');
jobs.filter((_, i) => i % Math.max(1, Math.floor(jobs.length / 3)) === 0).slice(0, 3).forEach((j) => {
  console.log('\n[' + j.id + '] ' + j.q);
  j.options.forEach((o, i) => console.log('  ' + (i === j.answer ? '✅' : '  ') + ' [' + o.length + '] ' + o));
  if (j.exp) console.log('  解析：' + j.exp.replace(/\n/g, ' ⏎ '));
});
if (!WRITE) { console.log('\n（沒有加 --write，只看不改）'); process.exit(bad ? 1 : 0); }

const byBank = {};
jobs.forEach((j) => { (byBank[j.bank] = byBank[j.bank] || {})[j.id] = j; });
let done = 0;
Object.keys(byBank).forEach((bank) => {
  const file = path.join(ROOT, 'js/data', bank + '.js');
  const out = fs.readFileSync(file, 'utf8').split('\n').map((line) => {
    if (!line.startsWith('{"id":')) return line;
    const tail = line.endsWith(',') ? ',' : '';
    let o;
    try { o = JSON.parse(tail ? line.slice(0, -1) : line); } catch (e) { return line; }
    const j = byBank[bank][o.id];
    if (!j) return line;
    o.options = j.options; o.answer = j.answer;
    if (j.exp) o.exp = j.exp;
    done++;
    return JSON.stringify(o) + tail;
  });
  fs.writeFileSync(file, out.join('\n'));
});
console.log('\n寫回：改了 ' + done + ' 題');
