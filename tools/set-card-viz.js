#!/usr/bin/env node
/* 把指定概念卡的 viz 換成新的（2026-08-30）
 *
 * lessons-*.js 是手寫的 JS（body 用字串串接），不能 JSON round-trip 回寫，
 * 所以這裡用「找到那張卡 → 對 viz 的大括號做配對 → 只換那一段」的做法。
 * 配對時會跳過字串內容，避免把 body 裡的符號當成括號。
 *
 * 用法：node tools/set-card-viz.js <plan.json> [--write]
 *   plan.json = [{ "key": "geography|十上|第7單元 聚落與都市",
 *                  "title": "④ 都市內部結構",
 *                  "viz": { "type": "landuse" } }, ...]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const PLAN = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!PLAN) { console.error('用法：node tools/set-card-viz.js <plan.json> [--write]'); process.exit(1); }
const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'));

/* 從 src[i]（指向 '{'）往後找到配對的 '}'，跳過字串與註解 */
function matchBrace(src, i) {
  let depth = 0, q = null;
  for (let p = i; p < src.length; p++) {
    const c = src[p];
    if (q) {
      if (c === '\\') { p++; continue; }
      if (c === q) q = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { q = c; continue; }
    if (c === '/' && src[p + 1] === '/') { p = src.indexOf('\n', p); if (p < 0) return -1; continue; }
    if (c === '/' && src[p + 1] === '*') { p = src.indexOf('*/', p) + 1; if (p < 1) return -1; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (!depth) return p; }
  }
  return -1;
}

const bySubj = {};
plan.forEach((it) => { const s = it.key.split('|')[0]; (bySubj[s] = bySubj[s] || []).push(it); });

let done = 0, miss = 0;
Object.keys(bySubj).forEach((subj) => {
  const file = path.join(ROOT, 'js/data', 'lessons-' + subj + '.js');
  let src = fs.readFileSync(file, 'utf8');
  // 由後往前改，前面的位移才不會影響後面的索引
  const jobs = [];
  bySubj[subj].forEach((it) => {
    const head = "window.APP_LESSONS['" + it.key + "'] = {";
    const at = src.indexOf(head);
    if (at < 0) { console.log('✗ 找不到單元：' + it.key); miss++; return; }
    const end = matchBrace(src, src.indexOf('{', at));
    const tAt = src.indexOf("title: '" + it.title + "'", at);
    if (tAt < 0 || tAt > end) { console.log('✗ 找不到卡片：' + it.key + ' 〈' + it.title + '〉'); miss++; return; }
    // 這張卡的範圍：到下一個 title: 為止（沒有就到單元結尾）
    const nextT = src.indexOf('title: ', tAt + 10);
    const stop = nextT > 0 && nextT < end ? nextT : end;
    const vAt = src.indexOf('viz: {', tAt);
    if (vAt < 0 || vAt > stop) { console.log('✗ 這張卡沒有 viz 可換：' + it.key + ' 〈' + it.title + '〉'); miss++; return; }
    const vEnd = matchBrace(src, src.indexOf('{', vAt));
    if (vEnd < 0) { console.log('✗ 括號配對失敗：' + it.key); miss++; return; }
    jobs.push({ from: src.indexOf('{', vAt), to: vEnd, viz: it.viz, label: it.key + ' 〈' + it.title + '〉' });
  });
  jobs.sort((a, b) => b.from - a.from).forEach((j) => {
    src = src.slice(0, j.from) + JSON.stringify(j.viz) + src.slice(j.to + 1);
    console.log('✓ ' + j.label + ' → ' + j.viz.type);
    done++;
  });
  if (WRITE && jobs.length) fs.writeFileSync(file, src);
});
console.log('\n改了 ' + done + ' 張，失敗 ' + miss + ' 張' + (WRITE ? '（已寫回）' : '（沒加 --write，只看不改）'));
