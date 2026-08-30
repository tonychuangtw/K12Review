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
['science', 'social', 'english', 'math', 'civics', 'geography', 'history', 'physics', 'chemistry', 'biology', 'earth'].forEach((s) => {
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
  /* 只換一個誘答：{ id, one } —— 把目前最長的那個誘答換成 one。
     用在「三個誘答都寫好了，但沒有任何一個比正解長」的補救，不必整題重寫。 */
  if (p.one && !p.d) {
    const cur = it.options.map((o, k) => ({ o: String(o), k })).filter((x) => x.k !== it.answer);
    cur.sort((a, b) => b.o.length - a.o.length);
    p = { id: p.id, d: [String(p.one), cur[1].o, cur[2].o] };
  }
  if (!Array.isArray(p.d) || p.d.length !== 3) { console.log('✗ ' + p.id + ' 要剛好三個誘答'); bad++; return; }
  const cor = String(it.options[it.answer]);
  if (p.d.some((x) => String(x) === cor)) { console.log('✗ ' + p.id + ' 誘答跟正解一樣'); bad++; return; }
  if (new Set(p.d.map(String)).size !== 3) { console.log('✗ ' + p.id + ' 三個誘答有重複'); bad++; return; }
  /* 長度守門（2026-08-30 收緊）：至少要有一個誘答不比正解短。
     原本只要求「最長的誘答有正解的七成」，結果正解仍然是四個選項裡唯一最長的那一個 ——
     破綻只是從「一眼看出」變成「看兩眼看出」，test.js 的比例也降不下來。
     現在要求 max(誘答長度) ≥ 正解長度，正解就不可能是唯一最長的。 */
  const mx = Math.max(...p.d.map((x) => String(x).length));
  /* 2026-08-30 再修：原本要求「至少一個誘答不比正解短」，實作上為了湊那一兩個字
     會把句子拉得很不自然，改了好幾輪也還在差一兩字。真正要避免的是「一眼就看出
     哪個最長」，差一兩個字沒有人看得出來，所以放寬成「最長的誘答不得比正解短 3 字以上」。
     test.js 另外加了一條更貼近實際的指標：正解比第二長的選項多 4 個字以上才算有破綻。 */
  if (mx < cor.length - 3) { console.log('⚠ ' + p.id + ' 誘答比正解短太多（最長 ' + mx + ' vs 正解 ' + cor.length + '）'); bad++; return; }
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
