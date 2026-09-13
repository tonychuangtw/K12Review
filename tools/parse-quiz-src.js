#!/usr/bin/env node
/* 從「挑戰小學堂」第 1-12 回的 PDF 文字裡抓出「改錯別字」的字組。
   原檔長相：（務）⒈這些是圖書館的書籍，請你物必在期限內歸還。
     → 括號裡是正確的字，句子裡藏著寫錯的那個字。
   怎麼找出寫錯的字：把句子裡每個字輪流換成正確字，換完如果變成
   《國語辭典簡編本》查得到的詞、而原本那個組合查不到，那個位置就是錯字。
   （這樣不必猜，錯字是被字典驗證出來的。）
   用法：node tools/parse-quiz-src.js > docs/source/kangxuan-5a-quiz-raw.json */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DIR = '/home/tony/TelegramClaude/chinese-sources/guo5shang/txt';
const { idx } = JSON.parse(fs.readFileSync(path.join(ROOT, '.cache', 'moe-concised.json'), 'utf8'));
const inDict = (w) => !!idx[w];

function findWrong(sentence, right) {
  const s = Array.from(sentence);
  const hits = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === right) continue;
    if (!/[一-鿿]/.test(s[i])) continue;
    const pairs = [];
    if (i + 1 < s.length) pairs.push([s[i] + s[i + 1], right + s[i + 1]]);
    if (i > 0) pairs.push([s[i - 1] + s[i], s[i - 1] + right]);
    for (const [was, now] of pairs) {
      if (inDict(now) && !inDict(was)) { hits.push({ wrong: s[i], word: now, badWord: was }); break; }
    }
  }
  return hits.length === 1 ? hits[0] : (hits.length ? { ambiguous: hits } : null);
}

const out = {};
for (let n = 1; n <= 12; n++) {
  const f = path.join(DIR, 'quizraw-' + String(n).padStart(2, '0') + '.txt');
  if (!fs.existsSync(f)) continue;
  const txt = fs.readFileSync(f, 'utf8');
  // 括號（或全形括弧）＋單字，後面接題號與句子
  const re = /[（︵(]\s*([一-鿿])\s*[）︶)]\s*[⒈-⒑]?\s*([^\n]{6,60}?)。/g;
  const items = [], unresolved = [];
  let m;
  const seen = new Set();
  while ((m = re.exec(txt))) {
    const right = m[1], sent = m[2].replace(/\s+/g, '');
    if (sent.length < 8) continue;                       // 太短的多半是「寫國字」那一大題
    if (seen.has(right + sent)) continue;
    seen.add(right + sent);
    const hit = findWrong(sent, right);
    if (hit && hit.wrong) items.push({ right, wrong: hit.wrong, word: hit.word, badWord: hit.badWord });
    else if (hit) unresolved.push({ right, sent, why: '有多個可能：' + hit.ambiguous.map(h => h.wrong + '→' + h.word).join('、') });
  }
  out[n] = { items, unresolved };
}
process.stdout.write(JSON.stringify(out, null, 1));
