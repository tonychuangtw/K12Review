/* 從匯入題庫刪掉指定的題目（2026-09-07）
 * 用途：那種「（承上題）根據本文…」但文章根本不在題庫裡、又補不回來的孤兒題
 *（例如原卷是看圖作答，圖沒有辦法用文字重現）。留著只會讓學生卡住。
 * 用法：node tools/del-custom.js x31820,x31846 [--write]
 * ⚠ 刪之前先確認：(1) 別處有沒有一模一樣、而且文章完整的版本；(2) 有沒有對應的解析確認題。
 */
const fs = require('fs'), path = require('path');
const FILE = path.join(__dirname, '..', 'js/data/custom.js');
const ids = (process.argv[2] || '').split(',').map((s) => s.trim()).filter(Boolean);
const write = process.argv.includes('--write');
const lines = fs.readFileSync(FILE, 'utf8').split('\n');
const keep = [], gone = [];
lines.forEach((l) => {
  const m = l.match(/^\{"id": ?"([^"]+)",/);   // 有些行沒有空格
  if (m && ids.indexOf(m[1]) >= 0) { gone.push(m[1]); return; }
  keep.push(l);
});
console.log((write ? '刪除' : '試跑') + '：' + gone.length + ' 題（' + gone.join(' ') + '）');
ids.filter((i) => gone.indexOf(i) < 0).forEach((i) => console.log('✗ 找不到 ' + i));
if (write && gone.length) fs.writeFileSync(FILE, keep.join('\n'));
