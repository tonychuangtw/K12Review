/* 列出某科某冊還沒修的重複題，以及那些單元「已經有哪些題幹」（避免補的新題又撞到）。 */
const fs = require('fs'), path = require('path');
const [subj, book] = process.argv.slice(2);
const dir = path.join('tools/tikuconv', subj);
const readme = fs.readFileSync(path.join(dir, 'README.md'), 'utf8');
const block = (readme.match(/```bash[\s\S]*?```/g) || []).join('\n');
const order = [...new Set([...block.matchAll(/(?:tools\/tikuconv\/[\w-]+|\$\w+)\/([\w.-]+\.jsonl)/g)].map(m => m[1]))];
const norm = s => String(s || '').replace(/\s+/g, '').replace(/[，。？！、：；「」（）()]/g, '');
const seen = new Map(), dups = [], byUnit = {};
for (const f of order) {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) continue;
  fs.readFileSync(p, 'utf8').split('\n').filter(l => l.trim()).forEach((l, i) => {
    let d; try { d = JSON.parse(l); } catch (e) { return; }
    if (d.book !== book) return;
    (byUnit[d.lesson] = byUnit[d.lesson] || []).push(d.q);
    const k = norm(d.q);
    if (seen.has(k)) dups.push({ f, line: i + 1, lesson: d.lesson, q: d.q });
    else seen.set(k, f);
  });
}
console.log('### ' + subj + ' ' + book + '：待修 ' + dups.length + ' 題');
const units = [...new Set(dups.map(d => d.lesson))];
for (const d of dups) console.log(`  ${d.f}:${d.line}  [${d.lesson}]  ${d.q.slice(0, 44)}`);
console.log('\n--- 這些單元已有的題幹（新題不可撞） ---');
for (const u of units) {
  console.log('【' + u + '】');
  console.log(byUnit[u].map(q => '  ' + q.slice(0, 40)).join('\n'));
}
