#!/usr/bin/env node
/* 解析確認題的待辦清單（Tony 2026-08-27）
 *
 * 背景：Ａ 字義列舉、Ｂ 逐選項標註這兩型是真的在問解析內容，程式自動生成即可；
 * Ｃ 型（句子辨識）Tony 已否決 —— 只確認有沒有看，不確認有沒有懂，要逐題人工重寫。
 *
 * 用法：
 *   node tools/chk-todo.js                 各題庫的統計（哪些已有、哪些要寫、哪些解析太薄）
 *   node tools/chk-todo.js <cat> [n]       印出該題庫最前面 n 題待寫的（含題目、選項、解析）
 *   node tools/chk-todo.js <cat> [n] --json  同上，輸出 JSON 給出題腳本吃
 */
global.window = global.window || {};
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ChkGen = require(path.join(ROOT, 'js/chk-gen.js'));

const BANK_FILES = ['custom', 'english-custom', 'math-custom', 'science-custom', 'social-custom',
  'physics-custom', 'chemistry-custom', 'biology-custom', 'earth-custom', 'history-custom',
  'geography-custom', 'civics-custom', 'english', 'math', 'science', 'social', 'physics',
  'chemistry', 'biology', 'earth', 'history', 'geography', 'civics'];
const CHECK_FILES = ['checks-idioms', 'checks-phonics', 'checks-chars', 'checks-custom'];

BANK_FILES.concat(CHECK_FILES).forEach(f => {
  try { require(path.join(ROOT, 'js/data', f + '.js')); } catch (e) {}
});
const DATA = window.APP_DATA || {};
const CHECKS = window.APP_CHECKS || {};

function scan(cat) {
  const out = { cat, total: 0, hand: 0, A: 0, B: 0, todo: [], thin: [] };
  (DATA[cat] || []).forEach(it => {
    if (!it || !it.q) return;
    out.total++;
    if (CHECKS[it.id]) { out.hand++; return; }
    const shape = ChkGen.shapeOf(it.exp);
    if (shape === 'A') out.A++;
    else if (shape === 'B') out.B++;
    else if (shape === 'C') out.todo.push(it);
    else out.thin.push(it);
  });
  return out;
}

const cats = Object.keys(DATA).filter(k => Array.isArray(DATA[k]) && (DATA[k][0] || {}).q);
const arg = process.argv[2];

if (!arg) {
  let T = 0, H = 0, A = 0, B = 0, TD = 0, TH = 0;
  console.log('題庫'.padEnd(18) + '總題數  已手寫   Ａ型   Ｂ型  待人工寫  解析太薄');
  cats.sort().forEach(cat => {
    const r = scan(cat);
    if (!r.total) return;
    T += r.total; H += r.hand; A += r.A; B += r.B; TD += r.todo.length; TH += r.thin.length;
    console.log(cat.padEnd(18) +
      String(r.total).padStart(6) + String(r.hand).padStart(8) +
      String(r.A).padStart(7) + String(r.B).padStart(7) +
      String(r.todo.length).padStart(10) + String(r.thin.length).padStart(10));
  });
  console.log('-'.repeat(66));
  console.log('合計'.padEnd(18) + String(T).padStart(6) + String(H).padStart(8) +
    String(A).padStart(7) + String(B).padStart(7) + String(TD).padStart(10) + String(TH).padStart(10));
  console.log('\n待人工寫 = Ｃ型（句子辨識，Tony 已否決）＋沒有手寫確認題');
  console.log('解析太薄 = 解析 <' + ChkGen.MIN_LEN + ' 字或只寫「見各選項說明」，要先補解析本體');
  process.exit(0);
}

const r = scan(arg);
const n = parseInt(process.argv[3], 10) || 20;
const items = r.todo.slice(0, n);
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(items.map(it => ({
    id: it.id, book: it.book || '', lesson: it.lesson || '', qtype: it.qtype || '',
    q: it.q, options: it.options, answer: it.answer, exp: it.exp
  })), null, 1));
} else {
  console.log(`${arg}：待人工寫 ${r.todo.length} 題，以下是最前面 ${items.length} 題\n`);
  items.forEach(it => {
    console.log(`── ${it.id}  ${it.book || ''} ${it.lesson || ''}  [${it.qtype || ''}]`);
    console.log(`Q: ${it.q}`);
    (it.options || []).forEach((o, i) =>
      console.log(`   ${i === it.answer ? '✔' : ' '} ${'ＡＢＣＤ'[i] || i}. ${o}`));
    console.log(`解析: ${it.exp}\n`);
  });
}
