/* 把手寫的俚語 deep 解析寫回 js/data/slang.js
 * 用法：node tools/set-slang-deep.js <deep.json> [--write]
 * JSON 格式：[{ id:"s001", deep:"典故由來：…\n字面意思：…\n引申意思：…" }, …]
 * 逐條人工撰寫（不可交 subagent 量產），寫完跑 node test/test.js
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'js/data/slang.js');
const items = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const write = process.argv.includes('--write');
let src = fs.readFileSync(FILE, 'utf8');
let done = 0, bad = 0;
items.forEach((it) => {
  if (!it.deep || it.deep.length < 30) { console.log('⚠ ' + it.id + ' deep 太短（' + (it.deep || '').length + '）'); bad++; return; }
  // 找到該條的那一行，在 example 後面補上 deep
  const re = new RegExp('(\\{ id: "' + it.id + '",[^\\n]*?)( \\},?)\\n');
  const m = src.match(re);
  if (!m) { console.log('✗ 找不到 ' + it.id); bad++; return; }
  if (/deep:/.test(m[1])) { console.log('· ' + it.id + ' 已有 deep，覆蓋'); }
  const body = m[1].replace(/, deep: "(?:[^"\\\\]|\\\\.)*"/, '');
  src = src.replace(m[0], body + ', deep: ' + JSON.stringify(it.deep) + m[2] + '\n');
  done++;
});
console.log((write ? '寫回' : '試跑') + '：' + done + ' 條' + (bad ? '，' + bad + ' 條有問題' : ''));
if (write && done) fs.writeFileSync(FILE, src);
