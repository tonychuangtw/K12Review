#!/usr/bin/env node
/* 列出還沒修的高中七科題目（誘答是借來的、解析留著自白句）。
 * 用法：node tools/dump-qfix-todo.js <科目> [n] [--from <id>]
 * 輸出每題：id｜冊｜單元｜題幹｜正解（附字數，寫誘答時要對齊長度）
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SUBJ = process.argv[2];
const N = parseInt(process.argv[3], 10) || 60;
const FROM = process.argv.includes('--from') ? process.argv[process.argv.indexOf('--from') + 1] : null;
if (!SUBJ) { console.error('用法：node tools/dump-qfix-todo.js <科目> [n] [--from id]'); process.exit(1); }
global.window = {};
require(path.join(ROOT, 'js/data', SUBJ + '.js'));
const arr = window.APP_DATA[SUBJ];
let todo = arr.filter((x) => x.exp && x.exp.indexOf('各自都對，但不是這一題在問的') >= 0);
if (FROM) todo = todo.filter((x) => x.id >= FROM);
console.log('# ' + SUBJ + ' 待修 ' + todo.length + ' 題，以下列出 ' + Math.min(N, todo.length) + ' 題');
todo.slice(0, N).forEach((x) => {
  console.log(x.id + '｜' + x.book + '｜' + x.lesson + '｜' + x.q + '｜正解[' + String(x.options[x.answer]).length + ']：' + x.options[x.answer]);
});
