// 把 jsonl 題庫的「正解位置」重新打散成接近 25/25/25/25。
//
// 用法：node tools/tikuconv/balance-answers.js <jsonl...>
//
// 做法：對每一題把 options 做環狀旋轉，讓正解落到目標位置，answer 跟著改。
// 這樣安全的前提是——解析（exp）引用的是選項的「文字」而不是「第幾個」，
// 本專案的規格就是 `✅ 正解：<選項文字>——…`，所以旋轉不會讓解析對不上。
// 保險起見，exp 或 options 裡出現「第一則／第二個選項」這種位置指涉的題目一律跳過。
'use strict';
const fs = require('fs');

const POS_REF = /第[一二三四1-4](?:則|個選項|句話是)|上列第|以上皆|以下皆/;
const files = process.argv.slice(2);
if (!files.length) { console.error('要給至少一個 jsonl'); process.exit(1); }

let total = 0, moved = 0, skipped = 0;
const before = [0, 0, 0, 0], after = [0, 0, 0, 0];

for (const f of files) {
  const rows = fs.readFileSync(f, 'utf8').split('\n').filter(s => s.trim()).map(s => JSON.parse(s));
  rows.forEach((r, i) => {
    total++;
    if (r.options.length === 4) before[r.answer]++;
    const locked = r.options.length !== 4 || POS_REF.test(r.exp || '') || r.options.some(o => POS_REF.test(o));
    if (locked) { skipped++; if (r.options.length === 4) after[r.answer]++; return; }
    const target = i % 4;                       // 檔內位置決定目標，結果穩定可重現
    const shift = (target - r.answer + 4) % 4;
    if (shift) {
      const a = r.options.slice();
      r.options = a.map((_, k) => a[(k - shift + 4) % 4]);
      r.answer = target;
      moved++;
    }
    after[r.answer]++;
  });
  fs.writeFileSync(f, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
}

const pct = a => a.map(n => (n / a.reduce((x, y) => x + y, 0) * 100).toFixed(1) + '%').join(' / ');
console.log('共 ' + total + ' 題，旋轉 ' + moved + ' 題，跳過（有位置指涉）' + skipped + ' 題');
console.log('旋轉前：' + before.join('/') + '  →  ' + pct(before));
console.log('旋轉後：' + after.join('/') + '  →  ' + pct(after));
