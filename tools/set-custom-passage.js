/* 把「（承上題）…」孤兒題補上它原本的文章（2026-09-07）
 *
 * 匯入題庫裡 112／113／114 年會考的題組，帶文章的頭題在轉檔時掉了，
 * 只剩「（承上題）根據本文…」——整份題庫裡沒有那篇本文，學生根本沒得作答。
 * 這支工具把文章接回該組「在題庫裡的第一題」，並拿掉那題的「（承上題）」前綴。
 *
 * 用法：node tools/set-custom-passage.js <file.json> [--write]
 * JSON：[{ id:"x31798", passage:"（原卷的文章，含出處）" }, …]
 * 文章一律照心測中心公開釋出的試題本，不改字；解析（exp）另外用 set-custom-exp 補。
 */
const fs = require('fs'), path = require('path');
const FILE = path.join(__dirname, '..', 'js/data/custom.js');
const items = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const write = process.argv.includes('--write');
let src = fs.readFileSync(FILE, 'utf8').split('\n');
let done = 0, bad = 0;
items.forEach((it) => {
  const i = src.findIndex((l) => (l.indexOf('{"id": "' + it.id + '",') === 0 || l.indexOf('{"id":"' + it.id + '",') === 0));
  if (i < 0) { console.log('✗ 找不到 ' + it.id); bad++; return; }
  const obj = JSON.parse(src[i].replace(/,$/, ''));
  if (obj.q.indexOf('請閱讀') >= 0 || obj.q.length > 200) { console.log('· ' + it.id + ' 已經有文章，跳過'); return; }
  const q = obj.q.replace(/^（承上題[^）]*）/, '');
  obj.q = '請閱讀以下短文，並回答問題：\n' + it.passage.trim() + '\n\n' + q;
  src[i] = JSON.stringify(obj) + (src[i].endsWith(',') ? ',' : '');
  done++;
});
console.log((write ? '寫回' : '試跑') + '：' + done + ' 題' + (bad ? '，' + bad + ' 題有問題' : ''));
if (write && done) fs.writeFileSync(FILE, src.join('\n'));
