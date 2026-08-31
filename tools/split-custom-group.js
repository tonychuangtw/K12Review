/* 把「文章 + 題目」的匯入題庫條目拆成兩題（2026-08-31）
 *
 * 用途：歷屆題組原本有 2～3 題共用一篇文章，轉檔時只留下後面那一題，
 *       文章就掛在它身上。要把原卷前面那一題補回來時，
 *       新題要當「帶文章的頭題」，舊題則改成「（承上題）…」。
 * 用法：node tools/split-custom-group.js <file.json> [--write]
 * JSON：[{ newId, srcId, diff, qtype, stem, options[4], answer, exp }, …]
 *   · 文章直接沿用 srcId 那一題的文章（q 的 "\n\n" 之前那段），不重打
 *   · srcId 那一題會被改寫成「（承上題）」＋原本的題目
 * 改完要跑 node tools/gen-counts.js 與 node test/test.js
 */
const fs = require('fs'), path = require('path');
const FILE = path.join(__dirname, '..', 'js/data/custom.js');
const items = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const write = process.argv.includes('--write');
const lines = fs.readFileSync(FILE, 'utf8').split('\n');
const num = (id) => Number(String(id).replace(/\D/g, ''));
const idOf = (l) => { const m = l.match(/^\{"id": ?"([^"]+)",/); return m ? m[1] : null; };
let bad = 0, done = 0;
items.forEach((it) => {
  const at = lines.findIndex((l) => idOf(l) === it.srcId);
  if (at < 0) { console.log('✗ 找不到 ' + it.srcId); bad++; return; }
  if (lines.some((l) => idOf(l) === it.newId)) { console.log('✗ ' + it.newId + ' 已經存在'); bad++; return; }
  if (num(it.newId) >= num(it.srcId)) { console.log('✗ ' + it.newId + ' 不會排在 ' + it.srcId + ' 前面'); bad++; return; }
  const src = JSON.parse(lines[at].replace(/,\s*$/, ''));
  const cut = src.q.indexOf('\n\n');
  if (cut < 0) { console.log('✗ ' + it.srcId + ' 的題幹裡找不到文章與題目的分界'); bad++; return; }
  const text = src.q.slice(0, cut), oldStem = src.q.slice(cut + 2);
  if (/^（承上題/.test(oldStem)) { console.log('✗ ' + it.srcId + ' 已經是承上題'); bad++; return; }
  const now = Object.assign({}, src, {
    id: it.newId, diff: it.diff || src.diff, qtype: it.qtype || src.qtype,
    q: text + '\n\n' + it.stem, options: it.options, answer: it.answer, exp: it.exp,
  });
  const after = Object.assign({}, src, { q: '（承上題）' + oldStem });
  lines[at] = JSON.stringify(after) + ',';
  lines.splice(at, 0, JSON.stringify(now) + ',');
  done++;
});
console.log((write ? '寫回' : '試跑') + '：' + done + ' 組' + (bad ? '，' + bad + ' 組有問題' : ''));
if (write && done && !bad) fs.writeFileSync(FILE, lines.join('\n'));
else if (write && bad) console.log('有問題，沒有寫回。');
