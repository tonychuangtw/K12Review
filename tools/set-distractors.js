#!/usr/bin/env node
/* 逐題換掉誘答（2026-08-30）
 *
 * 國小自然／社會有一批題目的誘答是「乾脆放棄不聽」「假裝聽懂」這種四到六個字的
 * 敷衍句，正解卻是十五到三十字的完整敘述 —— 不必讀題，挑最長的就會對。
 *
 * ⛔ 這一批不能用機器改。試過兩種都不行：
 *   ・借同一課其他題的正解 → 借到語意上也成立的敘述，變成兩個正確答案
 *   ・借同一冊其他課的正解 → 完全離題，學生改用「哪個跟題目有關」就能挑掉，
 *     而且會把本來設計得好的題（例如實驗設計題）一起毀掉
 * 所以誘答一律人工逐題撰寫，這支只負責把寫好的內容寫回檔案。
 *
 * 用法：node tools/set-distractors.js <patch.json> [--write]
 *   patch.json = [{ "id": "n0123", "d": ["誘答一", "誘答二", "誘答三"] }, ...]
 * 正解位置用 index % 4 打散（test.js 有守門檢查分布）。
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const PATCH = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!PATCH) { console.error('用法：node tools/set-distractors.js <patch.json> [--write]'); process.exit(1); }
const patch = JSON.parse(fs.readFileSync(PATCH, 'utf8'));

global.window = {};
['science', 'social', 'english', 'math'].forEach((s) => {
  const f = path.join(ROOT, 'js/data', s + '.js');
  if (fs.existsSync(f)) require(f);
});
const D = window.APP_DATA || {};
const where = {};                       // id -> 題庫名
Object.keys(D).forEach((k) => {
  if (Array.isArray(D[k])) D[k].forEach((it, i) => { if (it && it.id) where[it.id] = { bank: k, i: i }; });
});

const jobs = [];
let bad = 0;
patch.forEach((p) => {
  const w = where[p.id];
  if (!w) { console.log('✗ 找不到題目 ' + p.id); bad++; return; }
  const it = D[w.bank][w.i];
  if (!Array.isArray(p.d) || p.d.length !== 3) { console.log('✗ ' + p.id + ' 要剛好三個誘答'); bad++; return; }
  const cor = String(it.options[it.answer]);
  if (p.d.some((x) => String(x) === cor)) { console.log('✗ ' + p.id + ' 誘答跟正解一樣'); bad++; return; }
  if (new Set(p.d.map(String)).size !== 3) { console.log('✗ ' + p.id + ' 三個誘答有重複'); bad++; return; }
  // 長度要拉近：最長的誘答至少要有正解的七成，否則等於沒修
  const mx = Math.max(...p.d.map((x) => String(x).length));
  if (mx < 0.7 * cor.length) { console.log('⚠ ' + p.id + ' 誘答還是太短（' + mx + ' vs 正解 ' + cor.length + '）'); bad++; return; }
  const a = w.i % 4;
  const options = []; let k = 0;
  for (let s = 0; s < 4; s++) options.push(s === a ? cor : String(p.d[k++]));
  jobs.push({ id: p.id, bank: w.bank, options: options, answer: a, cor: cor, q: it.q, old: it.options });
});

console.log('可以改 ' + jobs.length + ' 題，問題 ' + bad + ' 題');
jobs.filter((_, i) => i % Math.max(1, Math.floor(jobs.length / 4)) === 0).slice(0, 4).forEach((j) => {
  console.log('\n[' + j.id + '] ' + j.q);
  console.log('  舊：' + j.old.map((o) => '[' + String(o).length + ']' + o).join('  '));
  j.options.forEach((o, i) => console.log('  ' + (i === j.answer ? '✅' : '  ') + ' [' + o.length + '] ' + o));
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
    done++;
    return JSON.stringify(o) + tail;
  });
  fs.writeFileSync(file, out.join('\n'));
});
console.log('\n寫回：改了 ' + done + ' 題');
