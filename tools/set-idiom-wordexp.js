/* 把手寫的成語逐字解析（wordExp）寫回 js/data/idioms.js
 * 用法：node tools/set-idiom-wordexp.js <file.json> [--write]
 * JSON：[{ id:"i123", wordExp:"甲＝…；乙＝…。合起來…" }, …]
 * 逐條人工撰寫（不可交 subagent 量產），寫完跑 node test/test.js
 */
const fs = require('fs'), path = require('path');
const FILE = path.join(__dirname, '..', 'js/data/idioms.js');
const items = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const write = process.argv.includes('--write');
let src = fs.readFileSync(FILE, 'utf8');
let done = 0, bad = 0;
items.forEach((it) => {
  if (!it.wordExp || it.wordExp.length < 12) { console.log('⚠ ' + it.id + ' wordExp 太短'); bad++; return; }
  const re = new RegExp('(\\{ id: "' + it.id + '",[^\\n]*?)(, deep:|, syn:| \\},?\\n)');
  const m = src.match(re);
  if (!m) { console.log('✗ 找不到 ' + it.id); bad++; return; }
  if (/wordExp:/.test(m[1])) { console.log('· ' + it.id + ' 已有 wordExp，跳過'); return; }
  src = src.replace(m[0], m[1] + ', wordExp: ' + JSON.stringify(it.wordExp) + m[2]);
  done++;
});
console.log((write ? '寫回' : '試跑') + '：' + done + ' 條' + (bad ? '，' + bad + ' 條有問題' : ''));
if (write && done) fs.writeFileSync(FILE, src);
