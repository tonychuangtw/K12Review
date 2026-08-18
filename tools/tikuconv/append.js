// 把新一批原創題接到 js/data/<file> 的陣列尾巴（一題一行 JSON），並更新檔頭「目前題數」。
const fs = require('fs');
const [,, jsonPath, target, idPrefix, pad] = process.argv;
const items = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let src = fs.readFileSync(target, 'utf8');
const lines = src.split('\n');
const closeAt = lines.findIndex(l => l.trim() === '];');
if (closeAt < 0) throw new Error('找不到陣列結尾 ];');
// 現有最大 id
const ids = [...src.matchAll(new RegExp('"id":"' + idPrefix + '(\\d+)"', 'g'))].map(m => +m[1]);
let next = Math.max(...ids) + 1;
// 答案位置太集中時，把部分 answer=1 的題換到第 4 個位置（純換選項順序，內容不動）
let flip = 0;
const out = items.map((it) => {
  if (it.answer === 1 && flip++ % 3 === 0) {
    const o = it.options.slice();
    const t = o[1]; o[1] = o[3]; o[3] = t;
    it.options = o; it.answer = 3;
  }
  return JSON.stringify({
    id: idPrefix + String(next++).padStart(+pad, '0'), grade: 5, book: '五上',
    lesson: it.lesson, tag: it.tag, diff: it.diff, qtype: '選擇題',
    q: it.q, options: it.options, answer: it.answer, exp: it.exp, src: it.src,
  }) + ',';
});
// 前一行原本結尾是 },  → 保持；最後一行去掉逗號
out[out.length - 1] = out[out.length - 1].replace(/,$/, '');
const prev = closeAt - 1;
if (!lines[prev].trim().endsWith(',')) lines[prev] = lines[prev] + ',';
lines.splice(closeAt, 0, ...out);
let res = lines.join('\n');
const total = (res.match(new RegExp('"id":"' + idPrefix + '\\d+"', 'g')) || []).length;
res = res.replace(/\/\/ 目前題數：\d+/, '// 目前題數：' + total);
fs.writeFileSync(target, res);
console.log('appended', items.length, '→ total', total);
