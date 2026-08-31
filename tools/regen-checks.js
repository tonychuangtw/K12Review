#!/usr/bin/env node
/* 重建「解析說其他選項各錯在哪？」型的確認題（2026-08-31）
 *
 * 高中七科品質修復（set-qfix.js）把 ❌ 段從一句籠統的話改寫成「逐個交代三個誘答各錯在哪」，
 * 舊的確認題正解是那句被刪掉的老話，會變成解析裡找不到根據。這支負責把它們重寫成
 * 「正解＝本題 ❌ 段的第一個小句，誘答＝同科其他題 ❌ 段的小句」。
 *
 * ✅ 型（「解析怎麼說明正解？」）不動：✅ 段沒有被改寫，那些題還是對的。
 *
 * 用法：node tools/regen-checks.js <科目> [--write]
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SUBJ = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!SUBJ) { console.error('用法：node tools/regen-checks.js <科目> [--write]'); process.exit(1); }

global.window = {};
require(path.join(ROOT, 'js/data', SUBJ + '.js'));
require(path.join(ROOT, 'js/data', 'checks-' + SUBJ + '.js'));
const arr = window.APP_DATA[SUBJ];
const CHK = window.APP_CHECKS || {};

/* 取 ❌ 段的第一個小句當素材（例：「一出生就具備規範」把後天學習誤當先天本能，規範是學來的不是生來的） */
function clauseOf(it) {
  const line = String(it.exp || '').split('\n').find((l) => l.indexOf('❌') === 0);
  if (!line) return null;
  const body = line.replace(/^❌\s*其他選項：?/, '').trim();
  /* 取第一個小句；太短（例如「「修改資料」是造假」只有九個字）就接上第二句，
     否則會被判定沒有可用素材，該題的確認題就補不回來。 */
  const parts = body.split('；');
  let c = parts[0].replace(/[。\s]+$/, '');
  if (c.length < 10 && parts[1]) c = (c + '；' + parts[1]).replace(/[。\s]+$/, '');
  return c.length >= 8 && c.length <= 70 ? c : null;
}

/* 只處理「已經被 set-qfix 改寫過」的題：❌ 段有用「」逐個點名誘答 */
/* 「已改寫過」＝解析裡沒有舊的自白句、且 ❌ 段有可用的小句。
   一開始用「❌ 其他選項：「」判斷，漏掉了不是以「」開頭的改寫（例：「第一個選項把兩者對調了」）。 */
const pool = arr.filter((it) => clauseOf(it) && String(it.exp || '').indexOf('各自都對，但不是這一題在問的') < 0);
const byId = {};
pool.forEach((it) => { byId[it.id] = clauseOf(it); });
const ids = pool.map((it) => it.id);
console.log(SUBJ + '：已改寫 ' + ids.length + ' 題可作素材');

const targets = pool.filter((it) => {
  const k = CHK[it.id];
  /* 舊題型「解析說其他選項各錯在哪？」與本工具產生的「解析說第一個誘答錯在哪？」都要能重建，
     否則改寫過的題再次調整 ❌ 段時就補不回來。 */
  if (!k || typeof k.q !== 'string') return false;
  if (k.q.indexOf('其他選項各錯在哪') < 0 && k.q.indexOf('第一個誘答錯在哪') < 0) return false;
  /* 已經重建過而且正解仍對得上本題 ❌ 段的，就不要再動 —— 否則每跑一次都會換一批誘答，diff 全是雜訊 */
  return k.o[k.a] !== clauseOf(it);
});
console.log('要重建的確認題 ' + targets.length + ' 題');
if (targets.length && ids.length < 4) { console.error('素材不足四題，先多改幾批再跑'); process.exit(1); }

const out = {};
targets.forEach((it, n) => {
  const self = byId[it.id];
  const i = ids.indexOf(it.id);
  const ds = [];
  for (let step = 1; ds.length < 3 && step < ids.length; step++) {
    const c = byId[ids[(i + step * 7 + n) % ids.length]];
    if (c && c !== self && ds.indexOf(c) < 0) ds.push(c);
  }
  if (ds.length < 3) return;
  const a = n % 4;
  const o = []; let k = 0;
  for (let s = 0; s < 4; s++) o.push(s === a ? self : ds[k++]);
  out[it.id] = { q: '解析說第一個誘答錯在哪？', o: o, a: a };
});
console.log('重建成功 ' + Object.keys(out).length + ' 題');
const sample = Object.keys(out)[0];
if (sample) console.log('\n[' + sample + '] ' + out[sample].q + '\n  ' + out[sample].o.map((x, i) => (i === out[sample].a ? '✅ ' : '   ') + x).join('\n  '));
if (!WRITE) { console.log('\n（沒有加 --write，只看不改）'); process.exit(0); }

const file = path.join(ROOT, 'js/data', 'checks-' + SUBJ + '.js');
let done = 0;
const txt = fs.readFileSync(file, 'utf8').split('\n').map((line) => {
  const m = line.match(/^\s*"([^"]+)":\s*(\{.*\}),?\s*$/);
  if (!m || !out[m[1]]) return line;
  done++;
  return '  "' + m[1] + '": ' + JSON.stringify(out[m[1]]) + ',';
}).join('\n');
fs.writeFileSync(file, txt);
console.log('寫回：改了 ' + done + ' 題');
