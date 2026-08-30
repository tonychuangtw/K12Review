/* 修正俚語條目（換掉重複／查不到出處的假條目、改正錯誤的意思或分類）
 * 用法：node tools/fix-slang.js <fix.json> [--write]
 * JSON：[{ id:"s049", term:"…", kind:"…", meaning:"…", example:"…" }, …]  只寫要改的欄位
 * 逐條人工判斷（不可交 subagent），改完跑 node test/test.js
 */
const fs = require('fs'), path = require('path');
const FILE = path.join(__dirname, '..', 'js/data/slang.js');
const items = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const write = process.argv.includes('--write');
let src = fs.readFileSync(FILE, 'utf8');
let done = 0, bad = 0;
items.forEach((it) => {
  const re = new RegExp('\\{ id: "' + it.id + '",[^\\n]*?\\},?\\n');
  const m = src.match(re);
  if (!m) { console.log('✗ 找不到 ' + it.id); bad++; return; }
  let line = m[0];
  ['term', 'kind', 'meaning', 'example', 'deep'].forEach((k) => {
    if (it[k] == null) return;
    const kre = new RegExp('(' + k + ': )(?:"(?:[^"\\\\]|\\\\.)*")');
    if (!kre.test(line)) { console.log('⚠ ' + it.id + ' 沒有 ' + k + ' 欄位'); return; }
    line = line.replace(kre, '$1' + JSON.stringify(it[k]).replace(/\$/g, '$$$$'));
  });
  src = src.replace(m[0], line);
  done++;
});
console.log((write ? '寫回' : '試跑') + '：' + done + ' 條' + (bad ? '，' + bad + ' 條找不到' : ''));
if (write && done) fs.writeFileSync(FILE, src);
