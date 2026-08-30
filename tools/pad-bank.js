/* 誘答長度微調：把某一科題庫裡「正解比最長誘答多 6 字以上」的題目，
 * 在最長的那個誘答前面加一句自然的語氣詞，把差距壓到 6 字以內。
 * 只處理「誘答本身已經是完整敘述、只差長度」的情況；差太多（>12 字）的列出來人工重寫。
 * 用法：node tools/pad-bank.js <科目> [--write]
 */
const fs = require('fs'), path = require('path');
global.window = global;
const subj = process.argv[2], write = process.argv.includes('--write');
const FILE = path.join(__dirname, '..', 'js/data', subj + '.js');
require(FILE);
const A = global.APP_DATA[subj] || [];
const CJ = (s) => (String(s).match(/[一-鿿]/g) || []).length;
/* 依需要補的字數挑語氣詞。都是句首放得下、不改變語意的說法 */
/* ⛔ 只補到 4 字為止。2026-09-03 試過補到 14 字，會生出「按照絕大多數人的一般理解來說指的是…」
   這種沒人會這樣講的句子——這是給小孩看的站，寧可人工寫。 */
const PRE = { 1: '其', 2: '其實', 3: '基本上', 4: '一般來說' };
let src = fs.readFileSync(FILE, 'utf8');
let done = 0, manual = [];
A.forEach((it) => {
  const L = it.options.map((x) => String(x).length);
  const cor = L[it.answer];
  let mi = -1, mx = -1;
  L.forEach((n, i) => { if (i !== it.answer && n > mx) { mx = n; mi = i; } });
  if (cor - mx < 6) return;
  if (!it.options.every((o, i) => i === it.answer || CJ(o) >= 3)) return;   // 太短的誘答要人工重寫
  const need = cor - mx - 5;
  if (need > 4) { manual.push(it.id + ' 差 ' + need + ' 字'); return; }
  const old = String(it.options[mi]);
  const nw = PRE[need] + old;
  const from = JSON.stringify(old), to = JSON.stringify(nw);
  if (src.indexOf(from) < 0) { manual.push(it.id + ' 字串比對不到'); return; }
  src = src.replace(from, to);
  done++;
});
console.log(subj + '：' + (write ? '補了 ' : '可補 ') + done + ' 題' + (manual.length ? '，需人工 ' + manual.length + ' 題' : ''));
if (manual.length && process.argv.includes('--list')) console.log('  ' + manual.join('\n  '));
if (write && done) fs.writeFileSync(FILE, src);
