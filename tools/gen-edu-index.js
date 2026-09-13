#!/usr/bin/env node
/* 產生 js/data/edu-index.js：康軒版的「系列→課→單元」清單與題數（很小，隨頁面一起載）。
   家長／老師檢視要顯示「已完成幾單元／共幾單元」，但教材本體 2MB 是動態載入的，
   不該為了看進度就把它拉下來，所以另外做一份索引。
   用法：node tools/gen-edu-index.js（改過 js/data/edu-*.js 之後跑） */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const W = { APP_EDU: [] };
(new Function('window', fs.readFileSync(path.join(ROOT, 'js/data/edu-kangxuan-chinese-5a.js'), 'utf8')))(W);

const SERIES_NAME = { words: '生字表・字音字形', idiom: '成語加油站', quiz: '挑戰小學堂' };
const out = {};
W.APP_EDU.forEach((u) => {
  const key = u.edition + '|' + u.subject + '|' + u.book;
  const e = out[key] = out[key] || { edition: u.edition, subject: u.subject, book: u.book, series: {} };
  const s = e.series[u.series] = e.series[u.series] || { name: SERIES_NAME[u.series] || u.series, units: 0, qs: 0, lessons: {} };
  s.units++; s.qs += (u.qs || []).length;
  s.lessons[u.lesson] = s.lessons[u.lesson] || { name: u.lessonName, units: 0 };
  s.lessons[u.lesson].units++;
  // 家長檢視要顯示單元名稱，但不想載 2MB 教材 → 索引裡帶一份 id→標題
  (e.titles = e.titles || {})[u.id] = { t: u.title, l: u.lesson, ln: u.lessonName, s: u.series, n: (u.qs || []).length };
});
const file = path.join(ROOT, 'js/data/edu-index.js');
fs.writeFileSync(file,
  '// 康軒版教材的索引（由 tools/gen-edu-index.js 產生，勿手改）。\n' +
  '// 家長／老師檢視靠它顯示單元名稱與「完成幾／共幾」，不必載 2MB 的教材本體。\n' +
  'window.APP_EDU_INDEX = ' + JSON.stringify(out) + ';\n');
console.log('寫出 js/data/edu-index.js（' + Math.round(fs.statSync(file).size / 1024) + 'KB）：' +
  Object.keys(out).map((k) => k + ' ' + Object.keys(out[k].series).map((s) => s + ':' + out[k].series[s].units).join('/')).join('；'));
