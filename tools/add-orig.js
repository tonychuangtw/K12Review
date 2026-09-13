#!/usr/bin/env node
/* 幫文言文篇章補上逐句對照（orig）。
   用法：node tools/add-orig.js <orig.json>
   JSON 形狀：{ "r220": [{ "c": "原文句", "v": "白話語譯", "n": "字詞注釋（可省略）" }, …], … }
   檢查：
     - id 要存在，而且 genre 必須是「文言」
     - 每一句的原文要真的出現在 passage 裡（避免抄錯字、漏字）
     - 所有 c 串起來要涵蓋 passage 的絕大部分（避免整段漏譯）
   （2026-09-13 Tony：「所有文言文都要有附每句解析，之前的也補上」） */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'js/data/reading.js');
const src = process.argv[2];
if (!src) { console.error('用法：node tools/add-orig.js <orig.json>'); process.exit(2); }

global.window = {};
eval(fs.readFileSync(FILE, 'utf8'));
const list = window.APP_DATA.reading;
const add = JSON.parse(fs.readFileSync(src, 'utf8'));
const strip = (t) => String(t).replace(/[\s，。、；：「」『』（）？！─…·\n]/g, '');
const bad = [];

Object.keys(add).forEach((id) => {
  const item = list.find((r) => r.id === id);
  if (!item) return bad.push(id + ' 找不到這一篇');
  if (item.genre !== '文言') return bad.push(id + ' 不是文言文（' + item.genre + '）');
  const rows = add[id];
  if (!Array.isArray(rows) || !rows.length) return bad.push(id + ' 沒有內容');
  /* 算涵蓋率前要先扣掉兩種不必逐句翻譯的東西：
       1. 文章結尾的「註：…」（既有的字詞註解）
       2. 句末標出處的括號，例如（〈衛靈公〉）、（《孟子・公孫丑上》） */
  const bodyOnly = String(item.passage)
    .split(/\n\s*註[：:]/)[0]
    .replace(/（[^）]*[〈《][^）]*）/g, '')
    .replace(/[—─-]{2,}\s*[〈《][^〉》]*[〉》]\s*$/, '');   // 句末的「——《世說新語・德行》」這種出處
  const flat = strip(bodyOnly);
  rows.forEach((o, i) => {
    if (!o.c || !o.v) return bad.push(id + ' 第 ' + (i + 1) + ' 句缺原文或語譯');
    if (flat.indexOf(strip(o.c)) < 0) bad.push(id + ' 第 ' + (i + 1) + ' 句對不到原文：' + o.c.slice(0, 14));
  });
  const covered = rows.reduce((n, o) => n + strip(o.c).length, 0);
  if (covered < flat.length * 0.9) {
    bad.push(id + ' 逐句只涵蓋原文 ' + Math.round(100 * covered / flat.length) + '%，有整段漏譯');
  }
});
if (bad.length) { console.error('檢查沒過：\n  ' + bad.join('\n  ')); process.exit(1); }

let text = fs.readFileSync(FILE, 'utf8');
let done = 0;
Object.keys(add).forEach((id) => {
  const item = list.find((r) => r.id === id);
  item.orig = add[id];
  const before = JSON.stringify({ id: item.id, grade: item.grade, title: item.title,
    genre: item.genre, src: item.src, passage: item.passage, questions: item.questions });
  const after = JSON.stringify(item);
  if (text.indexOf(before) < 0) { console.error('改寫失敗（找不到原本那一行）：' + id); process.exit(1); }
  text = text.replace(before, after);
  done++;
});
fs.writeFileSync(FILE, text);
const total = list.filter((r) => r.genre === '文言').length;
const has = list.filter((r) => r.genre === '文言' && (r.orig || []).length).length;
console.log('補上逐句對照 ' + done + ' 篇；文言文共 ' + total + ' 篇，已附 ' + has + ' 篇（還缺 ' + (total - has) + ' 篇）');
