/* 把手寫的成語同義詞（syn）寫回 js/data/idioms.js
 *
 * 兩種輸入格式：
 *   A. 逐條： [{ id:"i123", syn:["同義成語A","同義成語B"] }, …]
 *   B. 同義群（建議用這個）：{ "clusters": [["成語A","成語B","成語C"], …] }
 *      群裡每個「在題庫裡」的成語，syn ＝群裡其他成員（含不在題庫裡的），
 *      這樣同一群互相對稱 —— 否則 A 說 B 同義、B 卻沒說 A，出 B 的同義題時
 *      A 就可能被當誘答，變成「誘答其實也對」。
 *
 * 用法：node tools/set-idiom-syn.js <file.json> [--write] [--merge]
 *   --merge：已經有 syn 的條目改成合併（預設是跳過不動）
 *
 * ⚠ syn 會被前端拿去出「同義成語」題（syn 裡的當正解，庫內其他成語當誘答），
 *   每一條都必須是真的同義，寧缺勿濫；查不到確實同義的就別寫。
 *   syn 不必在題庫裡，但不可等於該成語本身。逐條人工撰寫，寫完跑 node test/test.js
 */
const fs = require('fs'), path = require('path');
const FILE = path.join(__dirname, '..', 'js/data/idioms.js');
const write = process.argv.includes('--write');
const merge = process.argv.includes('--merge');
const raw = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

global.window = global;
require(FILE);
const byTerm = {};
global.APP_DATA.idioms.forEach((x) => { if (!byTerm[x.term]) byTerm[x.term] = x; });

let items = [];
if (Array.isArray(raw)) items = raw;
else {
  (raw.clusters || []).forEach((g, gi) => {
    const uniq = Array.from(new Set(g));
    if (uniq.length !== g.length) console.log('⚠ 第 ' + (gi + 1) + ' 群有重複成員');
    if (uniq.length < 2) { console.log('⚠ 第 ' + (gi + 1) + ' 群不足兩個'); return; }
    uniq.forEach((t) => {
      const it = byTerm[t];
      if (!it) return;                                   // 不在題庫裡，只當同義詞用
      items.push({ id: it.id, syn: uniq.filter((o) => o !== t) });
    });
  });
}

let src = fs.readFileSync(FILE, 'utf8');
let done = 0, bad = 0, skip = 0;
items.forEach((it) => {
  const s = it.syn;
  if (!Array.isArray(s) || !s.length) { console.log('⚠ ' + it.id + ' syn 是空的'); bad++; return; }
  if (s.some((x) => typeof x !== 'string' || x.length < 3)) { console.log('⚠ ' + it.id + ' syn 有太短的條目'); bad++; return; }
  // 題庫兩種寫法都要吃：{ id: "i001", … } 與 {"id": "i001", … }（早期批次是 JSON 直出）
  const re = new RegExp('(\\{ ?"?id"?: "' + it.id + '",[^\\n]*?)(, ?"?wordExp"?:|, ?"?deep"?:| ?\\},?\\n)');
  const m = src.match(re);
  if (!m) { console.log('✗ 找不到 ' + it.id); bad++; return; }
  const term = (m[1].match(/"?term"?: "([^"]+)"/) || [])[1];
  if (term && s.indexOf(term) >= 0) { console.log('⚠ ' + it.id + ' syn 含自己'); bad++; return; }
  const q = /"id"/.test(m[1]) ? '"syn"' : 'syn';
  const old = m[1].match(/, ?"?syn"?: (\[[^\]]*\])/);
  if (old) {
    if (!merge) { skip++; return; }
    const all = Array.from(new Set(JSON.parse(old[1]).concat(s))).filter((x) => x !== term);
    src = src.replace(m[0], m[1].replace(old[0], ', ' + q + ': ' + JSON.stringify(all)) + m[2]);
  } else {
    src = src.replace(m[0], m[1] + ', ' + q + ': ' + JSON.stringify(s) + m[2]);
  }
  done++;
});
console.log((write ? '寫回' : '試跑') + '：' + done + ' 條' + (skip ? '，' + skip + ' 條已有 syn 跳過' : '') + (bad ? '，' + bad + ' 條有問題' : ''));
if (write && done) fs.writeFileSync(FILE, src);
