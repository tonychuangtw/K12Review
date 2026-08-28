#!/usr/bin/env node
/* 補齊手寫練習的筆順資料:掃 chars.js 的 answer,缺的就從 hanzi-writer-data CDN 下載到 strokes/
 * 用法:node tools/fetch-strokes.js          （只補缺的）
 *      node tools/fetch-strokes.js --check  （只檢查不下載,缺就 exit 1）
 * 新增字形題後務必跑一次,否則手寫練習顯示答案時不會有一筆一劃的動畫。
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const STROKE_DIR = path.join(ROOT, 'strokes');
// 筆順資料庫查無此字,前端會改顯示標楷體靜態字+說明,不必重試
const KNOWN_NO_DATA = ['揹', '譁', '縝', '靄', '譟', '靨', '鎚', '粿', '韉'];

global.window = { APP_DATA: {} };
eval(fs.readFileSync(path.join(ROOT, 'js/data/chars.js'), 'utf8'));
const chars = window.APP_DATA.chars || [];

const missing = [];
chars.forEach(function (c) {
  const ch = c.answer;
  if (!ch || KNOWN_NO_DATA.indexOf(ch) >= 0) return;
  const f = path.join(STROKE_DIR, 'u' + ch.codePointAt(0).toString(16) + '.json');
  if (!fs.existsSync(f) && missing.indexOf(ch) < 0) missing.push(ch);
});

if (!missing.length) {
  console.log('筆順資料已齊全（' + chars.length + ' 個手寫字，另有 ' +
    KNOWN_NO_DATA.length + ' 字資料庫查無：' + KNOWN_NO_DATA.join('') + '）');
  process.exit(0);
}
console.log('缺 ' + missing.length + ' 字：' + missing.join(''));
if (process.argv.indexOf('--check') >= 0) process.exit(1);

function fetchOne(ch) {
  return new Promise(function (resolve) {
    const url = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' + encodeURIComponent(ch) + '.json';
    https.get(url, function (res) {
      if (res.statusCode !== 200) { res.resume(); return resolve(false); }
      let body = '';
      res.on('data', function (d) { body += d; });
      res.on('end', function () {
        try {
          const data = JSON.parse(body);
          if (!data.strokes || !data.strokes.length) return resolve(false);
          fs.writeFileSync(path.join(STROKE_DIR, 'u' + ch.codePointAt(0).toString(16) + '.json'), body);
          resolve(true);
        } catch (e) { resolve(false); }
      });
    }).on('error', function () { resolve(false); });
  });
}

(async function () {
  const failed = [];
  for (const ch of missing) {
    const ok = await fetchOne(ch);
    process.stdout.write(ok ? '.' : 'x');
    if (!ok) failed.push(ch);
  }
  console.log('\n下載完成 ' + (missing.length - failed.length) + ' 字' +
    (failed.length ? '，資料庫查無 ' + failed.length + ' 字：' + failed.join('') +
      '（請加入 KNOWN_NO_DATA 並確認前端 fallback）' : ''));
})();
