/* 把新題目插進匯入題庫 js/data/custom.js（2026-09-07）
 *
 * 用途：照心測中心公開釋出的官方試題本，把題庫裡缺的歷屆題補上。
 * 用法：node tools/add-custom.js <file.json> [--write]
 * JSON：[{ id, book, lesson, tag, diff, qtype, q, options[4], answer, exp }, …]
 *   id 要挑「現有題目之間的空號」，這樣依序刷題時才會排在原卷的位置上。
 *   answer 是索引（0 起算），一律對照官方參考答案；exp 要自己寫（官方只給答案不給解析）。
 * ⚠ 圖片題（看圖表、看賽程表、看詩作圖片）文字重現不了，不要收。
 * ⚠ 插完要跑 node tools/gen-counts.js 更新題數清單，再跑 node test/test.js。
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
  ['id', 'book', 'lesson', 'qtype', 'q', 'options', 'answer', 'exp'].forEach((k) => {
    if (it[k] == null) { console.log('⚠ ' + it.id + ' 缺 ' + k); bad++; }
  });
  if (!Array.isArray(it.options) || it.options.length !== 4) { console.log('⚠ ' + it.id + ' 選項不是 4 個'); bad++; return; }
  if (lines.some((l) => idOf(l) === it.id)) { console.log('✗ ' + it.id + ' 已經存在'); bad++; return; }
  // 插在第一個 id 比它大的題目前面
  let at = lines.findIndex((l) => { const i = idOf(l); return i && num(i) > num(it.id); });
  if (at < 0) at = lines.length - 1;
  lines.splice(at, 0, JSON.stringify(it) + ',');
  done++;
});
console.log((write ? '寫回' : '試跑') + '：' + done + ' 題' + (bad ? '，' + bad + ' 題有問題' : ''));
if (write && done && !bad) fs.writeFileSync(FILE, lines.join('\n'));
else if (write && bad) console.log('有問題，沒有寫回。');
