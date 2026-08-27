// 把新一批原創題接到 js/data/<file> 的陣列尾巴（一題一行 JSON），並更新檔頭「目前題數」。
//
// 用法：node append.js <來源 json> <目標 js> <id 前綴> <位數> [年級] [冊名]
//   年級／冊名不給就從來源 json 的每一題自己帶（it.grade / it.book）。
// ⚠️ 2026-08-27 之前這支把 grade 與 book 硬寫成「5 / 五上」，換一個目標檔時
//    會靜靜把整批題目標成五上五年級（codex 體檢 B 級）。現在沒得推斷就直接中止。
const fs = require('fs');
const [,, jsonPath, target, idPrefix, pad, gradeArg, bookArg] = process.argv;
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
  const grade = gradeArg ? Number(gradeArg) : it.grade;
  const book = bookArg || it.book;
  if (!grade || !book) {
    throw new Error('第 ' + (next) + ' 題缺 grade/book：來源沒帶就要在命令列指定（node append.js … <年級> <冊名>）');
  }
  return JSON.stringify({
    id: idPrefix + String(next++).padStart(+pad, '0'), grade: grade, book: book,
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
