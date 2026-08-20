// 把 scratchpad 的 jsonl 批次組成 js/data/<subj>.js（header + 一題一行）
// 用法：node build.js <APP_DATA key> <輸出檔> <header 檔> <jsonl...>
const fs = require('fs');
const [, , key, outPath, headerPath, ...files] = process.argv;
const rows = [];
for (const f of files) {
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const s = line.trim();
    if (!s) continue;
    rows.push(JSON.parse(s));  // 解析一次，語法錯誤當場爆
  }
}
const ids = new Set(rows.map(r => r.id));
if (ids.size !== rows.length) throw new Error('id 重複');
const header = fs.readFileSync(headerPath, 'utf8').trimEnd();
const out = 'window.APP_DATA = window.APP_DATA || {};\n' + header +
  '\n// 目前題數：' + rows.length + '\nwindow.APP_DATA.' + key + ' = [\n' +
  rows.map(r => JSON.stringify(r)).join(',\n') + '\n];\n';
fs.writeFileSync(outPath, out);
console.log(key, rows.length, '題 →', outPath);
const pos = [0, 0, 0, 0];
rows.forEach(r => { if (r.options.length === 4) pos[r.answer]++; });
console.log('答案位置分布', pos.join('/'), '最大占比', (Math.max(...pos) / rows.length * 100).toFixed(1) + '%');
const byLesson = {};
rows.forEach(r => byLesson[r.lesson] = (byLesson[r.lesson] || 0) + 1);
console.log(byLesson);
// 重複題檢查
const seen = new Map();
rows.forEach(r => {
  const k = r.q.trim() + '||' + r.options.join('|') + '||' + r.answer;
  if (seen.has(k)) console.log('⚠ 重複題', r.id, seen.get(k));
  seen.set(k, r.id);
});
