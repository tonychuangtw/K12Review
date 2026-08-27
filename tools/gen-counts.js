#!/usr/bin/env node
/* 產生 js/data/counts.js —— 各科（依年級）的題數清單。
 *
 * 為什麼需要：2026-08-27 起各科主題庫（english/math/social/… 共約 18MB）改成
 * 「點進那一科才載入」，但科目選擇頁必須先顯示每一科在目前年級的題數。
 * 題數若要現算就得先把題庫載進來，等於白做 —— 所以先在這裡算好一份很小的清單。
 *
 * 用法：
 *   node tools/gen-counts.js          # 重新產生 js/data/counts.js
 *   node tools/gen-counts.js --check  # 只檢查現有檔案是否為最新（CI/測試用，不寫檔）
 *
 * ⚠️ 只要動到 js/data/<科目>.js 的題目數量或 grade 欄位，就要重跑一次；
 *    test/test.js 會擋（數字對不上直接測試失敗）。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHINESE_CATS = ['idioms', 'slang', 'phonics', 'chars', 'reading'];
const SUBJECT_FILES = ['english', 'math', 'science', 'social', 'physics', 'chemistry',
  'biology', 'earth', 'history', 'geography', 'civics'];
// 匯入題庫（家長題本轉檔）也是動態載入的，科目選擇頁的「匯入題庫」卡要顯示總題數
const CUSTOM_FILES = ['custom'].concat(SUBJECT_FILES.map((k) => k + '-custom'));
const CUSTOM_KEY = { custom: 'custom' };
SUBJECT_FILES.forEach((k) => { CUSTOM_KEY[k + '-custom'] = k + 'Custom'; });

function loadBanks() {
  const win = {};
  global.window = win;
  for (const f of CHINESE_CATS.concat(SUBJECT_FILES).concat(CUSTOM_FILES)) {
    const p = path.join(ROOT, 'js', 'data', f + '.js');
    if (!fs.existsSync(p)) continue;
    // 資料檔就是一支 IIFE，直接跑起來讓它掛進 window.APP_DATA
    new Function('window', fs.readFileSync(p, 'utf8'))(win);
  }
  return win.APP_DATA || {};
}

// 學期（上／下）過濾看的是 book 的最後一個字；沒有 book 的題任何學期都算得到，
// 與 js/app.js 的 termOk() 一致。每一格都存三個數字：整年 / 上 / 下。
function bump(slot, it) {
  slot['全']++;
  const b = it.book || '';
  const last = b.charAt(b.length - 1);
  if (!b || last === '上') slot['上']++;
  if (!b || last === '下') slot['下']++;
}
function emptySlot() { return { '全': 0, '上': 0, '下': 0 }; }

function countOf(bank) {
  const grades = {};
  const noGrade = emptySlot();
  let total = 0;
  (bank || []).forEach((it) => {
    total++;
    if (it.grade) {
      if (!grades[it.grade]) grades[it.grade] = emptySlot();
      bump(grades[it.grade], it);
    } else {
      bump(noGrade, it);
    }
  });
  return { total, noGrade, grades };
}

function mergeSlot(a, b) {
  return { '全': a['全'] + b['全'], '上': a['上'] + b['上'], '下': a['下'] + b['下'] };
}
function merge(a, b) {
  const out = { total: a.total + b.total, noGrade: mergeSlot(a.noGrade, b.noGrade), grades: {} };
  Object.keys(a.grades).forEach((g) => { out.grades[g] = Object.assign({}, a.grades[g]); });
  Object.keys(b.grades).forEach((g) => {
    out.grades[g] = out.grades[g] ? mergeSlot(out.grades[g], b.grades[g]) : Object.assign({}, b.grades[g]);
  });
  return out;
}

function build() {
  const DATA = loadBanks();
  const out = {};
  out.chinese = CHINESE_CATS
    .map((c) => countOf(DATA[c]))
    .reduce(merge, { total: 0, noGrade: emptySlot(), grades: {} });
  SUBJECT_FILES.forEach((k) => { out[k] = countOf(DATA[k]); });
  CUSTOM_FILES.forEach((f) => {
    const key = CUSTOM_KEY[f];
    out[key] = countOf(DATA[key]);
  });
  return out;
}

function render(counts) {
  return '/* 各科題數清單 —— 由 tools/gen-counts.js 產生，不要手改。\n' +
    '   科目主題庫改成動態載入後，科目選擇頁靠這份小檔顯示「這個年級有幾題」。\n' +
    '   每一格是 { 全, 上, 下 } 三個數字（學期過濾看 book 的最後一個字，與 app.js 的 termOk 一致）。\n' +
    '   noGrade = 沒標年級的題（任何年級都算得到）。 */\n' +
    'window.APP_COUNTS = ' + JSON.stringify(counts, null, 2) + ';\n';
}

const target = path.join(ROOT, 'js', 'data', 'counts.js');
const counts = build();
const text = render(counts);
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (cur !== text) {
    console.error('js/data/counts.js 不是最新的 —— 請跑 node tools/gen-counts.js 後一起 commit');
    process.exit(1);
  }
  console.log('counts.js 是最新的');
} else {
  fs.writeFileSync(target, text);
  console.log('已產生 js/data/counts.js（' + Object.keys(counts).length + ' 科）');
}
