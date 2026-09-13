#!/usr/bin/env node
/* 康軒版「生字表・字音字形」素材整理：
   讀 docs/source/kangxuan-5a-zyzx-raw.json（從原始 .doc 抽出來的形近字組與詞例），
   逐字去教育部《國語辭典簡編本》查注音，寫出 docs/source/kangxuan-5a-words.json。

   ⚠️ 注音一律查字典，不可憑印象（CLAUDE.md「注音的唯一依據」；
      2026-08-28 Tony 的兒子抓到「湖泊」注音錯就是憑印象的下場）。
   多音字用「詞」來定音：蚊帳＝ㄨㄣˊ ㄓㄤˋ → 蚊在這個詞裡讀 ㄨㄣˊ。
   查不到、或字典裡有多個讀音而詞又查不到的，一律標 need_check 不自己猜。

   用法：node tools/build-edu-words-src.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { zy2py } = require('./zy2py');
const ROOT = path.join(__dirname, '..');
const RAW = path.join(ROOT, 'docs/source/kangxuan-5a-zyzx-raw.json');
const OUT = path.join(ROOT, 'docs/source/kangxuan-5a-words.json');
const CACHE = path.join(ROOT, '.cache', 'moe-concised.json');
if (!fs.existsSync(CACHE)) {
  require('child_process').execFileSync('python3', [path.join(__dirname, 'moe-zy-index.py')], { stdio: 'inherit' });
}
const { idx } = JSON.parse(fs.readFileSync(CACHE, 'utf8'));
const norm = (z) => String(z || '').replace(/\s+/g, ' ').trim();

/* 從「詞」裡取出某個字的讀音：詞在字典裡查得到、音節數與字數相同才算數 */
function readingInWord(ch, word) {
  const e = idx[word];
  if (!e || !e.main.length) return null;
  const k = word.indexOf(ch);
  if (k < 0) return null;
  for (const reading of e.main.concat(e.alt)) {
    const syl = norm(reading).split(' ');
    if (syl.length === Array.from(word).length) return syl[k];
  }
  return null;
}
function readingOfChar(ch, words) {
  for (const w of words) {                       // 先用詞定音（多音字才定得準）
    const r = readingInWord(ch, w);
    if (r) return { zy: r, from: w };
  }
  const e = idx[ch];                             // 詞查不到就看單字；只有一個讀音才敢用
  if (e) {
    const all = e.main.concat(e.alt).map(norm).filter(Boolean);
    if (all.length === 1) return { zy: all[0], from: '單字' };
    if (all.length > 1) return { zy: null, from: '多音字：' + all.join(' | ') };
  }
  return { zy: null, from: '字典查無' };
}

const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'));
const out = {};
const todo = [];
let nChar = 0;
Object.keys(raw).sort((a, b) => a - b).forEach((ln) => {
  const rec = raw[ln];
  const groups = [];
  rec.groups.forEach((g, gi) => {
    const items = [];
    g.forEach((it) => {
      nChar++;
      const r = readingOfChar(it.c, it.w);
      const o = { c: it.c, w: it.w, zy: r.zy, py: r.zy ? zy2py(r.zy) : null, src: r.from };
      if (!o.zy || !o.py) { o.need_check = r.from; todo.push(`第${ln}課 第${gi + 1}組 「${it.c}」（${it.w.join('、')}）：${r.from}`); }
      items.push(o);
    });
    groups.push(items);
  });
  out[ln] = { name: rec.name, groups: groups };
});
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`寫出 ${path.relative(ROOT, OUT)}：12 課、${nChar} 個字`);
console.log(`需要人工確認的：${todo.length} 筆`);
todo.slice(0, 40).forEach((t) => console.log('  · ' + t));
