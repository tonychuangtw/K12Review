/* 全題庫重複掃描：先看完全重複（題幹一字不差），再看高相似。
   以「冊」為單位比對——同一冊內重複才是學生真的會連續遇到的。 */
const fs = require('fs');
global.window = {};
const SUBJ = ['biology','chemistry','civics','earth','english','geography','history','math','physics','science','social'];
for (const f of SUBJ) eval(fs.readFileSync('js/data/' + f + '.js', 'utf8'));
const D = window.APP_DATA;

const norm = s => String(s || '').replace(/\s+/g, '').replace(/[，。？！、：；「」（）()]/g, '');
function bigrams(s) { const g = new Set(); for (let i = 0; i < s.length - 1; i++) g.add(s.slice(i, i + 2)); return g; }
function sim(a, b) {
  const A = bigrams(a), B = bigrams(b);
  if (!A.size || !B.size) return 0;
  let n = 0; for (const g of A) if (B.has(g)) n++;
  return 2 * n / (A.size + B.size);
}

const report = [];
let totalExact = 0, totalNear = 0, totalQ = 0;
for (const key of SUBJ) {
  const arr = D[key] || [];
  totalQ += arr.length;
  const byBook = {};
  for (const q of arr) (byBook[q.book] = byBook[q.book] || []).push(q);
  for (const book of Object.keys(byBook)) {
    const items = byBook[book];
    const seen = new Map(), exact = [], near = [];
    for (const q of items) {
      const n = norm(q.q);
      if (seen.has(n)) exact.push([seen.get(n), q]);
      else seen.set(n, q);
    }
    /* 近似：同一冊兩兩比（一冊 288 題 = 41k 對，很快） */
    const uniq = [...seen.values()];
    for (let i = 0; i < uniq.length; i++) {
      for (let j = i + 1; j < uniq.length; j++) {
        const s = sim(norm(uniq[i].q), norm(uniq[j].q));
        if (s >= 0.80) near.push([uniq[i], uniq[j], s]);
      }
    }
    if (exact.length || near.length) {
      totalExact += exact.length; totalNear += near.length;
      report.push({ key, book, exact, near });
    }
  }
}
console.log('掃描', totalQ, '題');
console.log('完全重複', totalExact, '組 ／ 近似(≥0.80)', totalNear, '組\n');
report.sort((a, b) => (b.exact.length * 100 + b.near.length) - (a.exact.length * 100 + a.near.length));
for (const r of report.slice(0, 25)) {
  console.log(`--- ${r.key} ${r.book}: 完全 ${r.exact.length} / 近似 ${r.near.length}`);
  for (const [a, b] of r.exact.slice(0, 3)) console.log(`   [完全] ${a.id}=${b.id} ${a.q.slice(0, 46)}`);
  for (const [a, b, s] of r.near.slice(0, 3)) {
    console.log(`   [近似 ${s.toFixed(2)}] ${a.id} ${a.q.slice(0, 42)}`);
    console.log(`              ${b.id} ${b.q.slice(0, 42)}`);
  }
}
