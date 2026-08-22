// 資料完整性 + 純邏輯測試（node test/test.js）
'use strict';
const fs = require('fs');
const path = require('path');

global.window = {};
const root = path.join(__dirname, '..');
for (const f of ['idioms', 'slang', 'phonics', 'chars', 'reading', 'writing', 'custom', 'social', 'social-custom', 'science', 'science-custom', 'english', 'english-custom', 'math', 'math-custom',
                 'physics', 'physics-custom', 'chemistry', 'chemistry-custom',
                 'biology', 'biology-custom', 'earth', 'earth-custom',
                 'history', 'history-custom', 'geography', 'geography-custom',
                 'civics', 'civics-custom']) {
  eval(fs.readFileSync(path.join(root, 'js/data', f + '.js'), 'utf8'));
}
for (const f of ['checks-idioms', 'checks-phonics', 'checks-chars']) {
  eval(fs.readFileSync(path.join(root, 'js/data', f + '.js'), 'utf8'));
}
for (const f of ['lessons-math', 'lessons-science', 'lessons-social', 'lessons-english',
  'lessons-physics']) {          // 概念卡（單元教學層）
  eval(fs.readFileSync(path.join(root, 'js/data', f + '.js'), 'utf8'));
}
global.window.APP_DATA = window.APP_DATA;
global.window.APP_CHECKS = window.APP_CHECKS;
eval(fs.readFileSync(path.join(root, 'js/app.js'), 'utf8'));
const PURE = window.PURE;
const D = window.APP_DATA;

let failed = 0;
function ok(cond, msg) {
  if (cond) console.log('  ✓ ' + msg);
  else { failed++; console.error('  ✗ ' + msg); }
}

const ZY_WORD = /^[ㄅ-ㄩˊˇˋ˙ ]+$/;  // 詞注音（可含空格）
const ZY_CHAR = /^[ㄅ-ㄩˊˇˋ˙]+$/;   // 單字注音

console.log('資料完整性');
ok(D.idioms.length >= 150, `成語 ≥150（實際 ${D.idioms.length}）`);
ok(D.slang.length >= 60, `俚語諺語 ≥60（實際 ${D.slang.length}）`);
ok(D.phonics.length >= 120, `字音 ≥120（實際 ${D.phonics.length}）`);
ok(D.chars.length >= 120, `字形 ≥120（實際 ${D.chars.length}）`);

for (const [cat, items] of Object.entries(D)) {
  const ids = new Set(items.map(i => i.id));
  ok(ids.size === items.length, `${cat} id 不重複`);
  if (cat !== 'custom') ok(items.every(i => i.grade >= 1 && i.grade <= 12), `${cat} grade 都在 1-12`);
}
// 題庫型題目（自創題庫、社會等各科題庫）共用同一組轉檔品質守門
for (const [bankName, bank] of [['自創題庫', D.custom], ['社會題庫', D.social], ['社會自創題庫', D.socialCustom], ['自然題庫', D.science], ['自然自創題庫', D.scienceCustom], ['英文題庫', D.english], ['英文自創題庫', D.englishCustom], ['數學題庫', D.math], ['數學自創題庫', D.mathCustom], 
      ['物理題庫', D.physics], ['化學題庫', D.chemistry], ['生物題庫', D.biology], ['地科題庫', D.earth], 
      ['歷史題庫', D.history], ['地理題庫', D.geography], ['公民題庫', D.civics]]) {
ok(bank.every(c => c.q && Array.isArray(c.options) && c.options.length >= 2 && c.answer >= 0 && c.answer < c.options.length),
  bankName + '欄位合法（目前 ' + bank.length + ' 題）');
{
  // 陣列空洞（批次接檔時多打一個逗號會造成，filter/forEach 會跳過而測不出來）
  let holes = 0;
  for (let i = 0; i < bank.length; i++) if (!(i in bank)) holes++;
  ok(holes === 0, bankName + '陣列無空洞（空洞 ' + holes + ' 處）');
  // 完全重複題（題幹+選項+答案全同）。「承上題」子題會跨課共用題幹，不算重複
  {
    const seen = new Map(), dup = [];
    bank.forEach(c => {
      if (/承上題/.test(c.q)) return;
      const k = c.q.trim() + '||' + c.options.join('|') + '||' + c.answer;
      if (seen.has(k)) dup.push(c.id + '/' + seen.get(k)); else seen.set(k, c.id);
    });
    ok(dup.length === 0, bankName + '無完全重複題（重複 ' + dup.length + ' 題'
      + (dup.length ? '：' + dup.slice(0, 5).join(',') : '') + '）');
  }
  const CTRL = /[\u0000-\u001f]/;
  const badOpt = bank.filter(c => c.options.some(o => typeof o !== 'string' || !o.trim() || CTRL.test(o))
    || new Set(c.options).size !== c.options.length);
  ok(badOpt.length === 0, bankName + '選項無空白/控制字元/重複（壞題 ' + badOpt.length + ' 題'
    + (badOpt.length ? '：' + badOpt.slice(0, 5).map(c => c.id).join(',') : '') + '）');
  // 注音的「ㄧ」必須用 U+3127，不可誤植成漢字「一」（畫面看似正確，但比對、搜尋都會失效）
  const BAD_YI = /\u4e00(?=[\u02ca\u02c7\u02cb\u02d9\u311a-\u3125])|(?<=[\u3105-\u3119])\u4e00/;
  const badYi = bank.filter(c => BAD_YI.test(c.q) || BAD_YI.test(c.exp || '') || c.options.some(o => BAD_YI.test(o)));
  ok(badYi.length === 0, bankName + '注音「ㄧ」未誤植成漢字「一」（壞題 ' + badYi.length + ' 題'
    + (badYi.length ? '：' + badYi.slice(0, 5).map(c => c.id).join(',') : '') + '）');
  const CTRL_NL = /[\u0000-\u0009\u000b-\u001f]/; // 題幹/解析允許換行
  const badTxt = bank.filter(c => CTRL_NL.test(c.q) || CTRL_NL.test(c.exp || '')
    || /eq \\o\(/.test(c.q) || /eq \\o\(/.test(c.exp || ''));
  ok(badTxt.length === 0, bankName + '題幹/解析無殘留 Word 功能變數碼（壞題 ' + badTxt.length + ' 題'
    + (badTxt.length ? '：' + badTxt.slice(0, 5).map(c => c.id).join(',') : '') + '）');
}}

ok(D.idioms.every(i => i.term && i.meaning && i.example && ZY_WORD.test(i.zhuyin) && i.pinyin),
  '成語欄位完整、注音格式正確');
ok(D.slang.every(i => i.term && i.meaning && i.example && ['俚語', '諺語', '歇後語'].includes(i.kind)),
  '俚語諺語欄位完整、kind 合法');
ok(D.phonics.every(i => i.word.includes(i.target) && ZY_CHAR.test(i.zhuyin) && i.pinyin &&
  Array.isArray(i.wrong) && i.wrong.length >= 2 && i.wrong.every(w => w.z && w.p)),
  '字音欄位完整、target 在 word 內、誤讀成對');
ok(D.chars.every(i => i.sentence.includes('（') && !i.sentence.includes(i.answer) &&
  i.answer.length === 1 && Array.isArray(i.wrong) && i.wrong.length >= 2 &&
  !i.wrong.includes(i.answer) && ZY_CHAR.test(i.zhuyin)),
  '字形欄位完整、句不洩答案、誤字合法');

console.log('題目生成');
for (let t = 0; t < 200; t++) {
  const iq = PURE.buildIdiomQ(D.idioms[t % D.idioms.length], D.idioms);
  if (!(iq.options.length === 4 && iq.correct >= 0 && iq.correct < 4)) { ok(false, '成語題選項/答案異常 @' + t); break; }
  if (t === 199) ok(true, '成語題 200 次生成皆 4 選項且答案索引有效');
}
for (let t = 0; t < 200; t++) {
  const pq = PURE.buildPhonicsQ(D.phonics[t % D.phonics.length], D.phonics, t % 2 ? 'zhuyin' : 'pinyin');
  const uniq = new Set(pq.options);
  if (!(pq.correct >= 0 && uniq.size === pq.options.length)) { ok(false, '字音題選項重複或答案異常 @' + t); break; }
  if (t === 199) ok(true, '字音題 200 次生成選項不重複、答案索引有效');
}
for (let t = 0; t < 200; t++) {
  const cq = PURE.buildCharsQ(D.chars[t % D.chars.length], D.chars, 'zhuyin');
  if (!(cq.options[cq.correct] === D.chars[t % D.chars.length].answer)) { ok(false, '字形題答案索引錯 @' + t); break; }
  if (t === 199) ok(true, '字形題 200 次生成答案索引正確');
}
const sq = PURE.buildSlangQ(D.slang[0], D.slang);
ok(sq.options[sq.correct] === D.slang[0].meaning, '俚語題答案對應正確');

console.log('工具函式');
ok(PURE.filterByGrade(D.idioms, 6, true).every(i => i.grade <= 6), '含以下年級過濾正確');
ok(PURE.filterByGrade(D.idioms, 6, false).every(i => i.grade === 6), '單一年級過濾正確');
ok(PURE.nextDue(1, '2026-08-02') === '2026-08-03', 'Leitner 盒1 +1 天');
ok(PURE.nextDue(2, '2026-08-02') === '2026-08-04', 'Leitner 盒2 +2 天');
ok(PURE.nextDue(3, '2026-08-02') === '2026-08-07', 'Leitner 盒3 +5 天');
ok(PURE.gradeLabel(1) === '小一' && PURE.gradeLabel(7) === '國一' && PURE.gradeLabel(12) === '高三', '年級標籤');

console.log('閱讀測驗');
ok(D.reading.length >= 30, `閱讀題組 ≥30（實際 ${D.reading.length}）`);
ok(D.reading.every(r => r.passage && r.questions.length >= 2 &&
  r.questions.every(q => q.options.length === 4 && q.answer >= 0 && q.answer <= 3 && q.exp)),
  '閱讀題組欄位完整、每題 4 選項有解說');
{
  const dist = [0, 0, 0, 0];
  D.reading.forEach(r => r.questions.forEach(q => dist[q.answer]++));
  const total = dist.reduce((a, b) => a + b, 0);
  ok(Math.max(...dist) / total < 0.5, `閱讀答案位置分散（${dist.join('/')}）`);
  const rq = PURE.buildReadingQ(D.reading[0], 0);
  ok(rq.options[rq.correct] === D.reading[0].questions[0].options[D.reading[0].questions[0].answer],
    '閱讀題答案索引正確');
}

console.log('同義成語');
{
  const withSyn = D.idioms.filter(i => Array.isArray(i.syn) && i.syn.length);
  ok(withSyn.length >= 100, `含同義詞成語 ≥100（實際 ${withSyn.length}）`);
  ok(withSyn.every(i => !i.syn.includes(i.term)), 'syn 不含自身');
  for (let t = 0; t < 100; t++) {
    const it = withSyn[t % withSyn.length];
    const q = PURE.buildSynQ(it, D.idioms);
    if (!(q.options.length === 4 && it.syn.includes(q.options[q.correct]))) {
      ok(false, '同義題答案不在 syn 內 @' + it.id); break;
    }
    if (t === 99) ok(true, '同義題 100 次生成答案皆為同義成語');
  }
}

console.log('每日練習');
{
  const G = [1, 2, 3, 4, 5];
  const a = PURE.composeDaily(D, G, '2026-08-02|x');
  const b = PURE.composeDaily(D, G, '2026-08-02|x');
  const c = PURE.composeDaily(D, G, '2026-08-03|x');
  ok(JSON.stringify(a) === JSON.stringify(b), '同種子組卷結果一致');
  ok(JSON.stringify(a) !== JSON.stringify(c), '不同日期組卷不同');
  ok(a.length >= 22, `組卷題數 ≥22（實際 ${a.length}）`);
  const cats = new Set(a.map(e => e.t));
  ok(cats.has('idioms') && cats.has('slang') && cats.has('phonics') && cats.has('chars'), '組卷涵蓋四大類');
  const w = PURE.composeDaily(D, G, '2026-08-02|x', { idioms: 8, chars: 4 });
  ok(w.filter(e => e.t === 'idioms').length === 8 && w.filter(e => e.t === 'chars').length === 4, '弱點加權可調各類題數');
  ok(PURE.dailyStreak({ '2026-08-01': { done: true }, '2026-08-02': { done: true } }, '2026-08-02') === 2, '連續天數計算（今天已做）');
  ok(PURE.dailyStreak({ '2026-08-01': { done: true } }, '2026-08-02') === 1, '連續天數計算（今天未做從昨天回數）');
}

console.log('總結測驗');
{
  const G = [1, 2, 3, 4, 5];
  const day1 = PURE.composeDaily(D, G, '2026-08-05|x');
  const day2 = PURE.composeDaily(D, G, '2026-08-06|x');
  const wrongPool = [{ t: 'idioms', id: D.idioms[0].id }, { t: 'chars', id: D.chars[0].id }, { t: 'phonics', id: D.phonics[0].id }];
  const rng = () => PURE.rngFromString('rv-test');
  const r = PURE.composeReview([day1, day2], wrongPool, 20, 6, rng());
  ok(r.length === 20, `總結測驗共 20 題（實際 ${r.length}）`);
  const keys = r.map(e => e.t + ':' + e.id + (e.qi != null ? '#' + e.qi : ''));
  ok(new Set(keys).size === keys.length, '總結測驗題目不重複');
  ok(r.filter(e => e.rev).length <= 6, '錯題本混入至多 6 題');
  // 同篇閱讀子題必須連續出現
  const rIdx = {};
  r.forEach((e, i) => { if (e.t === 'reading') (rIdx[e.id] = rIdx[e.id] || []).push(i); });
  const contiguous = Object.keys(rIdx).every(id => rIdx[id].every((v, k) => k === 0 || v === rIdx[id][k - 1] + 1));
  ok(contiguous, '同篇閱讀子題連續出現');
  // 同種子決定性
  const r2 = PURE.composeReview([day1, day2], wrongPool, 20, 6, rng());
  ok(JSON.stringify(r) === JSON.stringify(r2), '同種子組卷一致');
  // 排除當日混入的複習題（rev）與跨天重複
  const dayDup = day1.concat([{ t: 'idioms', id: day1.find(e => e.t === 'idioms').id, rev: true }]);
  const r3 = PURE.composeReview([dayDup, day1], [], 50, 0, rng());
  const k3 = r3.map(e => e.t + ':' + e.id + (e.qi != null ? '#' + e.qi : ''));
  ok(new Set(k3).size === k3.length && r3.every(e => !e.rev), '跨天去重且不收當日 rev 條目');
  // 題池不足時題數縮減不爆
  const small = PURE.composeReview([day1.slice(0, 3)], [], 20, 6, rng());
  ok(small.length === 3, '題池不足時以實際題數出卷');
}

console.log('多選年級 / 弱點 / 錯題排程 / 寫作素材');
{
  ok(PURE.filterByGrades(D.idioms, [3, 7]).every(i => i.grade === 3 || i.grade === 7), '多選年級過濾正確');
  ok(PURE.gradesLabel([1, 2, 3, 4]) === '小一–小四', '年級標籤連續縮寫');
  ok(PURE.gradesLabel([1, 2, 7]) === '小一–小二、國一', '年級標籤混合區間');
  const ws = PURE.weakStrong({ idioms: { n: 20, ok: 10 }, chars: { n: 20, ok: 19 } });
  ok(ws && ws.weak === 'idioms' && ws.strong === 'chars', '弱點分析找出最弱/最強');
  ok(PURE.weakStrong({ idioms: { n: 5, ok: 1 } }) === null, '樣本不足不加權');
  const w1 = { box: 1, due: '2026-08-02' };
  ok(PURE.bumpWrongSchedule(w1, true, '2026-08-02') === 'up' && w1.box === 2 && w1.due === '2026-08-05', '錯題答對升級 +3 天');
  ok(PURE.bumpWrongSchedule(w1, true, '2026-08-05') === 'up' && w1.box === 3 && w1.due === '2026-08-12', '再答對 +7 天');
  ok(PURE.bumpWrongSchedule(w1, true, '2026-08-12') === 'graduate', '三關後畢業');
  ok(PURE.bumpWrongSchedule(w1, false, '2026-08-12') === 'reset' && w1.box === 1, '答錯重排隔天');
  ok(D.writing.length >= 50, `寫作素材 ≥50（實際 ${D.writing.length}）`);
  const u1 = PURE.buildUnits(D, 5), u2 = PURE.buildUnits(D, 5);
  ok(JSON.stringify(u1) === JSON.stringify(u2), '單元切分決定性一致');
  ok(u1.length >= 3 && u1.every(u => u.length >= 6), `小五單元 ≥3 且每單元 ≥6 條（實際 ${u1.length} 單元）`);
  const allIds = u1.flat().map(e => e.t + e.id);
  ok(new Set(allIds).size === allIds.length, '單元內詞條不重複');
  ok(D.writing.every(w => w.quote && w.src && w.tip && w.prompt && w.grade >= 1 && w.grade <= 12), '寫作素材欄位完整');
}

console.log('全科架構 / 自創分冊分課 / 解析強化');
{
  const fake = [
    { id: 'x001', book: '五上', lesson: '第1課', q: 'q1', options: ['a', 'b', 'c', 'd'], answer: 0 },
    { id: 'x002', book: '五上', lesson: '第2課', q: 'q2', options: ['a', 'b', 'c', 'd'], answer: 1 },
    { id: 'x003', book: '五下', lesson: '第1課', q: 'q3', options: ['a', 'b', 'c', 'd'], answer: 2 },
    { id: 'x004', q: 'q4', options: ['a', 'b', 'c', 'd'], answer: 3 }
  ];
  const books = PURE.customBooks(fake);
  ok(books.length === 3 && books[0].book === '五上' && books[0].lessons.length === 2, '自創題庫分冊分課結構正確');
  ok(books.some(b => b.book === '未分類'), '沒標冊的題歸入未分類');
  ok(PURE.customPool(fake, '五上', null).length === 2 && PURE.customPool(fake, '五上', '第1課').length === 1, '冊/課範圍過濾正確');
  for (let t = 0; t < 50; t++) {
    const q = PURE.buildIdiomQ(D.idioms[t % D.idioms.length], D.idioms);
    if (q.explain.indexOf('其他選項') < 0) { ok(false, '成語解析缺其他選項說明 @' + t); break; }
    if (t === 49) ok(true, '成語解析含其他 3 個選項的成語意思');
  }
  const deepIt = D.idioms.find(i => i.id === 'i013');
  ok(deepIt && deepIt.deep && deepIt.deep.indexOf('典故由來') >= 0 && deepIt.deep.indexOf('引申意思') >= 0, 'i013 典故解析範例存在');
  const dq = PURE.buildIdiomQ(deepIt, D.idioms);
  ok(dq.explain.indexOf('注音比較') >= 0 && dq.explain.indexOf('楚：ㄔㄨˇ（三聲）') >= 0, '成語注音比較自動生成');
  ok(dq.explain.indexOf('典故與成語意思') >= 0, '典故解析會出現在答題回饋');
  const dq2 = PURE.buildIdiomQ(D.idioms.find(i => i.id === 'i001'), D.idioms);
  ok(dq2.explain.indexOf('注音比較') >= 0, '沒寫 deep 的成語也自動有注音比較');
  for (const k of ['idioms', 'phonics', 'chars']) {
    const n = D[k].filter(i => i.deep && i.deep.length >= 30).length;
    ok(n === D[k].length, `${k} 深度解析全數覆蓋（${n}/${D[k].length}）`);
  }
  for (const [bn, bank] of [['自創題庫', D.custom], ['社會題庫', D.social], ['社會自創題庫', D.socialCustom], ['自然題庫', D.science], ['自然自創題庫', D.scienceCustom], ['英文題庫', D.english], ['英文自創題庫', D.englishCustom], ['數學題庫', D.math], ['數學自創題庫', D.mathCustom], 
      ['物理題庫', D.physics], ['化學題庫', D.chemistry], ['生物題庫', D.biology], ['地科題庫', D.earth], 
      ['歷史題庫', D.history], ['地理題庫', D.geography], ['公民題庫', D.civics]]) {
    const noExp = bank.filter(c => !c.exp || c.exp.trim().length < 2).length;
    ok(noExp === 0, `${bn}解析零缺漏（缺 ${noExp} 題）`);
    ok(bank.every(c => ['易', '中', '難'].includes(c.diff) && c.qtype), bn + '難易度/題型欄位完整');
  }
  // 社會題庫：每題都要標冊/課，單元學習與依課練習才切得出範圍
  ok(D.social.every(c => c.book && c.lesson && /^o\d/.test(c.id)),
    `社會原創題庫冊/單元/id 前綴完整（${D.social.length} 題）`);
  ok(D.socialCustom.every(c => c.book && c.lesson && c.id.indexOf('oc') === 0),
    `社會自創題庫冊/課/id 前綴完整（${D.socialCustom.length} 題）`);
  ok(D.science.every(c => c.book && c.lesson && /^n\d/.test(c.id)),
    `自然原創題庫冊/單元/id 前綴完整（${D.science.length} 題）`);
  ok(D.scienceCustom.every(c => c.book && c.lesson && c.id.indexOf('nc') === 0),
    `自然自創題庫冊/課/id 前綴完整（${D.scienceCustom.length} 題）`);
  ok(D.english.every(c => c.book && c.lesson && /^e\d/.test(c.id)),
    `英文原創題庫冊/單元/id 前綴完整（${D.english.length} 題）`);
  ok(D.englishCustom.every(c => c.book && c.lesson && c.id.indexOf('ec') === 0),
    `英文自創題庫冊/課/id 前綴完整（${D.englishCustom.length} 題）`);
  ok(D.math.every(c => c.book && c.lesson && /^m\d/.test(c.id)),
    `數學原創題庫冊/單元/id 前綴完整（${D.math.length} 題）`);
  ok(D.mathCustom.every(c => c.book && c.lesson && c.id.indexOf('mc') === 0),
    `數學自創題庫冊/課/id 前綴完整（${D.mathCustom.length} 題）`);
  // 高中分科：原創題 2 碼前綴、自創題 3 碼前綴（見 js/app.js 的 ID_PREFIX）
  for (const [bn, bank, pfx, cbank, cpfx] of [
    ['物理', D.physics, 'ph', D.physicsCustom, 'phc'],
    ['化學', D.chemistry, 'ch', D.chemistryCustom, 'chc'],
    ['生物', D.biology, 'bi', D.biologyCustom, 'bic'],
    ['地球科學', D.earth, 'es', D.earthCustom, 'esc'],
    ['歷史', D.history, 'hi', D.historyCustom, 'hic'],
    ['地理', D.geography, 'ge', D.geographyCustom, 'gec'],
    ['公民與社會', D.civics, 'ci', D.civicsCustom, 'cic']]) {
    ok(bank.every(c => c.book && c.lesson && c.id.indexOf(pfx) === 0 && /\d/.test(c.id[pfx.length])),
      `${bn}原創題庫冊/單元/id 前綴 ${pfx} 完整（${bank.length} 題）`);
    ok(cbank.every(c => c.book && c.lesson && c.id.indexOf(cpfx) === 0),
      `${bn}自創題庫冊/課/id 前綴 ${cpfx} 完整（${cbank.length} 題）`);
  }
  // 原創題庫：正解不可以都排在同一個位置（答案位置要分散）
  {
    for (const [bn, bank] of [['社會', D.social], ['自然', D.science], ['英文', D.english], ['數學', D.math],
                              ['物理', D.physics], ['化學', D.chemistry], ['生物', D.biology], ['地科', D.earth],
                              ['歷史', D.history], ['地理', D.geography], ['公民', D.civics]]) {
      const pos = [0, 0, 0, 0];
      bank.forEach(c => { if (c.options.length === 4) pos[c.answer]++; });
      const tot = pos.reduce((a, b) => a + b, 0);
      ok(tot === 0 || Math.max(...pos) <= tot * 0.45, `${bn}原創題答案位置分散（${pos.join('/')}）`);
    }
  }

  // 題目附圖：img 欄位指到的檔案一定要真的在 repo 裡，不然前端會是一塊破圖
  {
    const fs2 = require('fs');
    const path2 = require('path');
    const root = path2.join(__dirname, '..');
    const withImg = [];
    for (const bank of [D.custom, D.social, D.socialCustom, D.science, D.scienceCustom,
                        D.english, D.englishCustom, D.math, D.mathCustom,
                        D.idioms, D.slang, D.phonics, D.chars, D.reading]) {
      (bank || []).forEach(c => { if (c && c.img) withImg.push(c); });
    }
    const missing = withImg.filter(c => !fs2.existsSync(path2.join(root, c.img)));
    ok(missing.length === 0,
      `題目附圖檔案齊全（${withImg.length} 題有圖，缺 ${missing.length}${missing.length ? '：' + missing.slice(0, 5).map(c => c.id + '→' + c.img).join('、') : ''}）`);
    const badPath = withImg.filter(c => !/^img\/[\w./-]+\.(svg|webp|png|jpg)$/.test(c.img));
    ok(badPath.length === 0, `題目附圖路徑格式正確（壞 ${badPath.length} 題）`);
  }

  // 手寫練習筆順資料覆蓋率:新增字形題後若忘了補 strokes/,這裡會擋下來
  // 補字法見 memory/chinese-stroke-data.md（hanzi-writer-data CDN）
  const fs = require('fs');
  const path = require('path');
  const strokeDir = path.join(__dirname, '..', 'strokes');
  const KNOWN_NO_DATA = ['揹', '譁', '縝', '靄', '譟', '靨']; // 筆順資料庫查無此字,前端已改顯示標楷體靜態字
  const lackStroke = D.chars
    .map(c => c.answer)
    .filter(ch => ch && KNOWN_NO_DATA.indexOf(ch) < 0)
    .filter(ch => !fs.existsSync(path.join(strokeDir, 'u' + ch.codePointAt(0).toString(16) + '.json')));
  ok(lackStroke.length === 0,
    `手寫字筆順資料齊全（缺 ${lackStroke.length} 字${lackStroke.length ? '：' + lackStroke.join('') : ''}）`);
}

/* ---------- 解析確認題（js/data/checks-*.js） ---------- */
console.log('解析確認題');
{
  const CHK = window.APP_CHECKS || {};
  const byId = {};
  ['idioms', 'phonics', 'chars'].forEach(c => D[c].forEach(it => { byId[it.id] = c; }));
  const ids = Object.keys(CHK);
  const bad = [];
  ids.forEach(id => {
    const k = CHK[id];
    if (!byId[id]) return bad.push(id + ' 對不到題庫題目');
    if (!k || typeof k.q !== 'string' || k.q.length < 6) return bad.push(id + ' 題目太短');
    if (!Array.isArray(k.o) || k.o.length !== 4) return bad.push(id + ' 選項不是 4 個');
    if (new Set(k.o).size !== 4) return bad.push(id + ' 選項重複');
    if (k.o.some(o => typeof o !== 'string' || !o.length)) return bad.push(id + ' 選項有空值');
    if (!Number.isInteger(k.a) || k.a < 0 || k.a > 3) return bad.push(id + ' 答案索引錯誤');
    // 確認題不能只是把原題答案再問一次：字形／字音題的正解不可等於原題答案本身
    const src = D[byId[id]].find(x => x.id === id);
    if (byId[id] === 'chars' && k.o[k.a] === src.answer) bad.push(id + ' 正解與原題答案相同（等於再問一次原題）');
  });
  ok(bad.length === 0, `確認題格式正確（問題 ${bad.length} 筆${bad.length ? '：' + bad.slice(0, 5).join('；') : ''}）`);
  const cover = {};
  ['idioms', 'phonics', 'chars'].forEach(c => {
    cover[c] = D[c].filter(it => CHK[it.id]).length;
  });
  const dist = [0, 0, 0, 0];
  ids.forEach(id => dist[CHK[id].a]++);
  ok(!ids.length || Math.max(...dist) / ids.length < 0.5, `確認題答案位置分散（${dist.join('/')}）`);
  console.log(`    覆蓋率：成語 ${cover.idioms}/${D.idioms.length}、字音 ${cover.phonics}/${D.phonics.length}、字形 ${cover.chars}/${D.chars.length}`);
  const total = cover.idioms + cover.phonics + cover.chars;
  const need = D.idioms.length + D.phonics.length + D.chars.length;
  // 2026-08-17 起 100% 覆蓋是硬性門檻：新增成語／字音／字形題時，要一併寫 js/data/checks-*.js 的確認題
  ok(total === need, `確認題全數覆蓋（${total}/${need}）`);
}

/* ---------- 概念卡（單元學習的教材層，js/data/lessons-*.js） ----------
   低階模型照 docs/bank-maintain-sop.md 流程 D 寫概念卡時，這段是守門：
   單元名對不上題庫的 lesson 就永遠不會出現在網站上，這是最容易犯又最難發現的錯。 */
{
  console.log('\n概念卡（單元教學層）');
  const LES = window.APP_LESSONS || {};
  const keys = Object.keys(LES);
  const WIDGETS = ['fracbar', 'fraccircle', 'fraccompare', 'placevalue', 'column',
                   'array', 'grouping', 'angle', 'circleparts', 'clock', 'numberline',
                   'areagrid', 'decimalgrid', 'bargraph',
                   'protractor', 'lines', 'triangle', 'quad', 'exprsteps', 'rounding',
                   'factors', 'polygon', 'areaformula', 'cuboid', 'symmetry', 'netbox',
                   'circlearea', 'ratiobar', 'piechart', 'dotplot', 'balance', 'cylinder',
                   'tenframe', 'numbond', 'counters', 'compare',
                   'intchips', 'primefac', 'algetile',
                   'coordplane', 'linegraph', 'ineqline', 'proportion', 'linechart',
                   'areamodel', 'crossmult', 'pythagoras', 'boxplot',
                   'seq', 'cutangles', 'triangleangles', 'congruent', 'quaddiag',
                   'similar', 'circleangles', 'circleline', 'tricenters', 'parabola',
                   'solid', 'probtable', 'spread',
                   'logexp', 'trig', 'triglaw',
                   'counting', 'vector', 'conic', 'matrix', 'linprog',
                   'unitcircle', 'trigwave', 'limit', 'space3d',
                   'lintrans', 'normaldist', 'scatter', 'condprob',
                   'deriv', 'curveplot', 'integralarea', 'complexplane',
                   'optics', 'moonphase', 'earthsun', 'soundwave', 'compareexp', 'classify',
                   'plantparts', 'solution', 'phscale', 'statechange',
                   'microscope', 'bodysystem', 'circuit', 'energyflow',
                   'foodweb', 'strata', 'plates', 'weathermap', 'magnet', 'force',
                   'lamp', 'heat', 'buoyancy', 'lever',
                   'cell', 'levels', 'enzyme', 'nerve', 'punnett', 'dna', 'cycle', 'density', 'imaging', 'atom', 'ptable', 'chemeq', 'motion', 'newton', 'energyball', 'pressure',
                   'static', 'ohm', 'solarsys',
                   'timeline', 'mapdir', 'taiwan', 'orgchart', 'poppyramid', 'supply', 'regionmap',
                   'sentence', 'tense', 'phonics'];  // 與 js/widgets.js 的 REG 同步
  const bad = [];
  keys.forEach(k => {
    const [subj, book, lesson] = k.split('|');
    const bank = D[subj];
    if (!Array.isArray(bank)) return bad.push(k + '：找不到題庫 ' + subj);
    // 單元名必須與題庫的 book+lesson 一字不差，否則前端對不上
    if (!bank.some(it => it.book === book && it.lesson === lesson)) {
      return bad.push(k + '：題庫裡沒有這個冊／單元（單元名要一字不差）');
    }
    const deck = LES[k];
    if (!deck || !Array.isArray(deck.cards) || !deck.cards.length) return bad.push(k + '：沒有 cards');
    if (deck.cards.length > 8) bad.push(k + '：概念卡 ' + deck.cards.length + ' 張，超過 8 張學生會累');
    deck.cards.forEach((c, i) => {
      const tag = k + ' 第' + (i + 1) + '張';
      if (!c.title || !c.body) return bad.push(tag + '：缺 title 或 body');
      if (c.viz && WIDGETS.indexOf(c.viz.type) < 0) bad.push(tag + '：未知的元件 ' + c.viz.type);
      if (!c.check) return;
      const q = c.check;
      if (!Array.isArray(q.options) || q.options.length !== 4) return bad.push(tag + '：檢核題選項不是 4 個');
      if (new Set(q.options).size !== 4) bad.push(tag + '：檢核題選項重複');
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) return bad.push(tag + '：檢核題答案索引錯誤');
      // 誤答分支是這套設計最值錢的部分：每個誘答都要寫「你為什麼會這樣想」
      if (!Array.isArray(q.why) || q.why.length !== 4) return bad.push(tag + '：why 不是 4 格');
      q.why.forEach((w, j) => {
        if (j === q.answer) return;                       // 正解那格放 null
        if (typeof w !== 'string' || w.length < 8) bad.push(tag + ' 選項' + j + '：誤答分支沒寫或太短');
      });
    });
  });
  ok(bad.length === 0, `概念卡格式與單元名正確（問題 ${bad.length} 筆${bad.length ? '：' + bad.slice(0, 5).join('；') : ''}）`);
  // 2026-08-22：寫卡時混進西里爾字母／日文假名各一次（「типа」「начало」），
  // 畫面上不明顯但就是錯字。這段直接掃原始檔，之後不會再靜默出貨。
  {
    const STRAY = /[\u0400-\u04FF\u3040-\u30FF\uAC00-\uD7AF]/;
    const files = ['js/data/lessons-math.js', 'js/data/lessons-science.js',
      'js/data/lessons-social.js', 'js/data/lessons-english.js',
      'js/data/lessons-physics.js', 'js/widgets.js'];
    const hits = [];
    files.forEach(f => {
      const src = fs.readFileSync(path.join(root, f), 'utf8');
      src.split('\n').forEach((line, i) => {
        if (STRAY.test(line)) hits.push(`${f}:${i + 1}`);
      });
    });
    ok(hits.length === 0, `教材文字沒有混進西里爾字母／假名／諺文（${hits.slice(0, 5).join('、') || '乾淨'}）`);
    // 同一類問題的另一種形態：英文單字直接黏在中文旁邊（例如「地殼活動activo頻繁」）。
    // 正常的專有名詞（pH 值、log₂ 32、sin θ）前後都會有空格或標點，黏在一起的幾乎都是誤植。
    const GLUED = /[\u4e00-\u9fff][A-Za-z]{3,}|[A-Za-z]{3,}[\u4e00-\u9fff]/;
    const glued = [];
    files.forEach(f => {
      fs.readFileSync(path.join(root, f), 'utf8').split('\n').forEach((line, i) => {
        if (GLUED.test(line)) glued.push(`${f}:${i + 1}`);
      });
    });
    ok(glued.length === 0, `沒有英文單字黏在中文旁邊（${glued.slice(0, 5).join('、') || '乾淨'}）`);
  }
  const nCards = keys.reduce((n, k) => n + ((LES[k].cards || []).length), 0);
  console.log(`    目前 ${keys.length} 個單元有教材、共 ${nCards} 張概念卡`);
}

console.log(failed ? `\n${failed} 項失敗` : '\n全部通過');
process.exit(failed ? 1 : 0);
