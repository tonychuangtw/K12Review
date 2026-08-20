/* K12學霸養成 — 應用邏輯（vanilla JS，無依賴，資料存 localStorage） */
(function () {
  'use strict';

  var W = (typeof window !== 'undefined') ? window : this;
  var DATA = W.APP_DATA || {};
  ['idioms', 'slang', 'phonics', 'chars', 'reading', 'writing', 'custom',
   'english', 'math', 'science', 'social',
   'physics', 'chemistry', 'biology', 'earth', 'history', 'geography', 'civics',
   'englishCustom', 'mathCustom', 'scienceCustom', 'socialCustom',
   'physicsCustom', 'chemistryCustom', 'biologyCustom', 'earthCustom',
   'historyCustom', 'geographyCustom', 'civicsCustom'].forEach(function (k) {
    if (!Array.isArray(DATA[k])) DATA[k] = [];
  });
  var SUBJECTS = W.APP_SUBJECTS || [{ key: 'chinese', name: '國語', icon: '📖', ready: true, desc: '' }];
  var CHECKS = W.APP_CHECKS || {};   // 解析確認題（js/data/checks-*.js）

  /* ---------- 純函式（node 測試用，經 window.PURE 匯出） ---------- */

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pickOthers(pool, self, field, n) {
    // 從 pool 挑 n 個不同於 self 且 field 值不重複的干擾項
    var seen = {}; seen[self[field]] = true;
    var out = [];
    var cand = shuffle(pool);
    for (var i = 0; i < cand.length && out.length < n; i++) {
      var v = cand[i][field];
      if (cand[i].id !== self.id && v && !seen[v]) { seen[v] = true; out.push(cand[i]); }
    }
    return out;
  }

  function filterByGrade(pool, grade, cumulative) {
    return pool.filter(function (it) {
      return cumulative ? it.grade <= grade : it.grade === grade;
    });
  }

  // 多選年級（grades 為 1-12 的陣列）
  function filterByGrades(pool, grades) {
    return pool.filter(function (it) { return grades.indexOf(it.grade) >= 0; });
  }

  // 年級組合顯示：連續區間縮寫，如 [1,2,3,4] → 小一–小四
  function gradesLabel(grades) {
    if (!grades.length) return '未選年級';
    if (grades.length === 12) return '全部年級';
    var g = grades.slice().sort(function (a, b) { return a - b; });
    var parts = [], start = g[0], prev = g[0];
    for (var i = 1; i <= g.length; i++) {
      if (i < g.length && g[i] === prev + 1) { prev = g[i]; continue; }
      parts.push(start === prev ? gradeLabel(start) : gradeLabel(start) + '–' + gradeLabel(prev));
      if (i < g.length) { start = g[i]; prev = g[i]; }
    }
    return parts.join('、');
  }

  function gradeLabel(g) {
    var names = ['', '小一', '小二', '小三', '小四', '小五', '小六', '國一', '國二', '國三', '高一', '高二', '高三'];
    return names[g] || ('年級' + g);
  }

  // 其他選項的成語意思（Tony 2026-08-03：錯誤選項也要給解析）
  function otherIdiomsExp(others) {
    if (!others.length) return '';
    return '\n📖 其他選項：' + others.map(function (o) { return o.term + '＝' + o.meaning; }).join('；');
  }

  // 注音聲調名（一聲不標調號）
  function toneName(zy) {
    if (zy.indexOf('˙') >= 0) return '輕聲';
    var last = zy.charAt(zy.length - 1);
    return last === 'ˊ' ? '二聲' : last === 'ˇ' ? '三聲' : last === 'ˋ' ? '四聲' : '一聲';
  }

  // 成語注音比較：由 term+zhuyin 自動逐字產生（Tony 2026-08-03：成語解析要含注音比較）
  function idiomZyCompare(item) {
    if (!item.term || !item.zhuyin) return '';
    var chars = item.term.split('');
    var zys = item.zhuyin.split(' ');
    if (chars.length !== zys.length) return '';
    return '\n🔤 注音比較：\n' + chars.map(function (c, i) {
      return c + '：' + zys[i] + '（' + toneName(zys[i]) + '）';
    }).join('\n');
  }

  // 深度解析（存 item.deep，逐條人工撰寫）：
  // 成語＝典故與成語意思（注音比較自動生成，不含國字拆解）；字音/字形＝注音比較＋國字拆解與造字原因
  function deepExp(item) {
    var isIdiom = item.id && item.id.charAt(0) === 'i';
    var auto = isIdiom ? idiomZyCompare(item) : '';
    var deep = item.deep ? '\n📚 ' + (isIdiom ? '典故與成語意思' : '深度解析') + '：\n' + item.deep : '';
    return auto + deep;
  }

  function buildIdiomQ(item, pool) {
    // 兩種題型隨機：釋義選擇 / 例句克漏字
    var cloze = item.example && item.example.indexOf(item.term) >= 0 && Math.random() < 0.5;
    if (cloze) {
      var others = pickOthers(pool, item, 'term', 3);
      var opts = shuffle([item].concat(others));
      return {
        type: 'idioms', item: item,
        question: item.example.split(item.term).join('（　　　　）') + '\n括號中應填入哪個成語？',
        options: opts.map(function (o) { return o.term; }),
        correct: opts.indexOf(item),
        explain: item.term + '：' + item.meaning + (item.wordExp ? '\n🔍 逐字解析：' + item.wordExp : '') + (item.misuse ? '\n⚠️ ' + item.misuse : '') + otherIdiomsExp(others) + deepExp(item)
      };
    }
    var others2 = pickOthers(pool, item, 'meaning', 3);
    var opts2 = shuffle([item].concat(others2));
    return {
      type: 'idioms', item: item,
      question: '「' + item.term + '」的意思是？',
      options: opts2.map(function (o) { return o.meaning; }),
      correct: opts2.indexOf(item),
      explain: '例句：' + item.example + (item.wordExp ? '\n🔍 逐字解析：' + item.wordExp : '') + (item.misuse ? '\n⚠️ ' + item.misuse : '') + otherIdiomsExp(others2) + deepExp(item)
    };
  }

  function buildSlangQ(item, pool) {
    var others = pickOthers(pool, item, 'meaning', 3);
    var opts = shuffle([item].concat(others));
    return {
      type: 'slang', item: item,
      question: '「' + item.term + '」（' + item.kind + '）的意思是？',
      options: opts.map(function (o) { return o.meaning; }),
      correct: opts.indexOf(item),
      explain: '例句：' + item.example
    };
  }

  function buildPhonicsQ(item, pool, phon) {
    var z = phon === 'zhuyin';
    var correctTxt = z ? item.zhuyin : item.pinyin;
    var opts = [{ txt: correctTxt, ok: true }];
    (item.wrong || []).forEach(function (wr) {
      opts.push({ txt: z ? wr.z : wr.p, ok: false });
    });
    // 補一個別題的讀音當第 4 選項（避免與現有重複）
    var texts = opts.map(function (o) { return o.txt; });
    var extra = shuffle(pool).find(function (o) {
      var t = z ? o.zhuyin : o.pinyin;
      return o.id !== item.id && texts.indexOf(t) < 0;
    });
    if (extra) opts.push({ txt: z ? extra.zhuyin : extra.pinyin, ok: false });
    opts = shuffle(opts);
    var correct = -1;
    opts.forEach(function (o, i) { if (o.ok) correct = i; });
    var qWord = item.word.split(item.target).join('「' + item.target + '」');
    // 借來的第 4 選項標明出處，note 已涵蓋同字誤讀的正確用法
    var extraExp = extra ? '\n📖 選項「' + (z ? extra.zhuyin : extra.pinyin) + '」是「' + extra.word + '」的「' + extra.target + '」的讀音。' : '';
    return {
      type: 'phonics', item: item,
      question: qWord + ' — 「' + item.target + '」的讀音是？',
      options: opts.map(function (o) { return o.txt; }),
      correct: correct,
      explain: (item.note || '') + '\n正確讀音：' + item.zhuyin + '（' + item.pinyin + '）' + extraExp + deepExp(item)
    };
  }

  function buildCharsQ(item, pool, phon) {
    var reading = phon === 'zhuyin' ? item.zhuyin : item.pinyin;
    var opts = shuffle([item.answer].concat(item.wrong || []));
    return {
      type: 'chars', item: item,
      question: item.sentence + '\n括號中讀「' + reading + '」的字是？',
      options: opts,
      correct: opts.indexOf(item.answer),
      explain: (item.note || '') + '\n正確答案：' + item.answer + deepExp(item)
    };
  }

  function buildSynQ(item, pool) {
    // 同義成語題：從 syn 挑一個當正解，干擾項取庫內非同義成語
    var syn = (item.syn || []).slice();
    var ans = syn[Math.floor(Math.random() * syn.length)];
    var cand = pool.filter(function (o) { return syn.indexOf(o.term) < 0 && o.term !== ans; });
    var distractItems = pickOthers(cand, item, 'term', 3);
    var opts = shuffle([ans].concat(distractItems.map(function (o) { return o.term; })));
    return {
      type: 'idioms', item: item,
      question: '下列哪個成語與「' + item.term + '」意義最接近？',
      options: opts,
      correct: opts.indexOf(ans),
      explain: item.term + '：' + item.meaning + '\n同義成語：' + syn.join('、') + otherIdiomsExp(distractItems) + deepExp(item)
    };
  }

  function buildReadingQ(item, qi) {
    var q = item.questions[qi];
    return {
      type: 'reading', item: item, qi: qi,
      passage: (item.title ? '《' + item.title + '》\n' : '') + item.passage,
      question: '（' + (qi + 1) + '/' + item.questions.length + '）' + q.q,
      options: q.options.slice(),
      correct: q.answer,
      explain: q.exp
    };
  }

  function buildCustomQ(item) {
    var scope = [item.book, item.lesson].filter(Boolean).join(' ');
    var tag = scope || item.tag;
    return {
      type: 'custom', item: item,
      question: (tag ? '【' + tag + '】' : '') + item.q,
      options: item.options.slice(),
      correct: item.answer,
      explain: (item.exp || '') + '\n正確答案：' + item.options[item.answer]
    };
  }

  // 冊名（一上、五下、十一上…）→ 排序用的序號，好讓冊照年級排而不是照題目出現順序
  //（2026-08-20 Tony：匯入題庫「進去後能夠自己選哪個科目哪個年級」）
  var BOOK_GRADE = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
  function bookOrder(book) {
    var m = /^(十[一二])?([一二三四五六七八九十])?(上|下)$/.exec(book || '');
    if (!m) return 9999;                                   // 會考、基測、特招、未分類 → 排最後
    var g = m[1] ? (m[1] === '十一' ? 11 : 12) : BOOK_GRADE[m[2]];
    return g * 2 + (m[3] === '下' ? 1 : 0);
  }
  // 匯入題庫分冊分課：冊→[課]，沒標 book 的歸「未分類」
  function customBooks(pool) {
    var books = [], seen = {};
    pool.forEach(function (it) {
      var b = it.book || '未分類';
      if (!seen[b]) { seen[b] = { book: b, lessons: [], ls: {} }; books.push(seen[b]); }
      var l = it.lesson || '未分課';
      if (!seen[b].ls[l]) { seen[b].ls[l] = true; seen[b].lessons.push(l); }
    });
    books.sort(function (a, b) { return bookOrder(a.book) - bookOrder(b.book); });
    return books;
  }

  function customPool(pool, book, lesson) {
    return pool.filter(function (it) {
      if (book && (it.book || '未分類') !== book) return false;
      if (lesson && (it.lesson || '未分課') !== lesson) return false;
      return true;
    });
  }

  // 以字串種子產生決定性亂數（每日練習：同一天同年級 → 同一組題）
  function rngFromString(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6D2B79F5;
      var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededPick(pool, n, rng) {
    var a = pool.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a.slice(0, n);
  }

  // 每日練習組卷：回傳 entry 清單 [{t, id, syn?, qi?}]，同一種子必產出同一組。
  // counts 可覆寫各類題數（弱點加權用），預設共 22 題 + 1 篇閱讀題組（2-3 題）≈ 25 題。
  function composeDaily(data, grades, seed, counts) {
    var c = counts || {};
    var n = {
      idioms: c.idioms != null ? c.idioms : 6,
      slang: c.slang != null ? c.slang : 4,
      phonics: c.phonics != null ? c.phonics : 6,
      chars: c.chars != null ? c.chars : 6
    };
    var rng = rngFromString(seed);
    var entries = [];
    function poolOf(cat) { return filterByGrades(data[cat] || [], grades); }
    seededPick(poolOf('idioms'), n.idioms, rng).forEach(function (it, i) {
      // 前兩題若有同義詞資料就出同義題
      entries.push({ t: 'idioms', id: it.id, syn: i < 2 && (it.syn || []).length > 0 });
    });
    seededPick(poolOf('slang'), n.slang, rng).forEach(function (it) { entries.push({ t: 'slang', id: it.id }); });
    seededPick(poolOf('phonics'), n.phonics, rng).forEach(function (it) { entries.push({ t: 'phonics', id: it.id }); });
    seededPick(poolOf('chars'), n.chars, rng).forEach(function (it) { entries.push({ t: 'chars', id: it.id }); });
    var reads = seededPick(poolOf('reading'), 1, rng);
    reads.forEach(function (r) {
      for (var qi = 0; qi < r.questions.length; qi++) entries.push({ t: 'reading', id: r.id, qi: qi });
    });
    return entries;
  }

  // 題庫型科目（社會等）的每日練習：同日同科同一組題（種子＝日期|科目），依題庫順序抽 n 題
  function composeDailyBank(bank, seed, n) {
    var rng = rngFromString(seed);
    return seededPick(bank || [], n || 20, rng).map(function (it) {
      return { t: quizCatOf(it), id: it.id };
    });
  }

  // 總結測驗組卷：從所選日期的每日練習題目（daysEntries = [[{t,id,syn?,qi?}...]...]）
  // 收集題池（去重、排除當日混入的錯題複習題），混入至多 mbShare 題錯題本題（標 rev），
  // 共出 total 題。閱讀同篇子題永遠連續出現（成塊洗牌）。rng 可傳 Math.random（真隨機）。
  function composeReview(daysEntries, wrongPool, total, mbShare, rng) {
    var seen = {};
    function bareKey(t, id, qi) { return t + ':' + id + (qi != null ? '#' + qi : ''); }
    var mbItems = [];
    seededPick(wrongPool || [], (wrongPool || []).length, rng).forEach(function (w) {
      if (mbItems.length >= mbShare) return;
      var k = bareKey(w.t, w.id, null);
      if (seen[k]) return;
      seen[k] = true;
      var mb = { t: w.t, id: w.id, rev: true };
      if (w.t === 'chars' && w.wr) mb.hw = true;   // 手寫來源的字形錯題 → 考卷上也用手寫作答
      mbItems.push(mb);
    });
    var pool = [];
    (daysEntries || []).forEach(function (dayList) {
      (dayList || []).forEach(function (e) {
        if (e.rev) return;
        var k = bareKey(e.t, e.id, e.qi);   // 同條目的同義題/一般題視為重複，只出一次
        if (seen[k]) return;
        seen[k] = true;
        var it = { t: e.t, id: e.id };
        if (e.syn) it.syn = true;
        if (e.qi != null) it.qi = e.qi;
        if (e.hw) it.hw = true;             // 手寫練習做過的字，重考時仍出手寫題
        pool.push(it);
      });
    });
    // 閱讀同篇成塊，其餘單題成塊
    var blocks = [], byGid = {};
    pool.forEach(function (e) {
      if (e.t === 'reading') {
        var g = 'r|' + e.id;
        if (!byGid[g]) { byGid[g] = []; blocks.push(byGid[g]); }
        byGid[g].push(e);
      } else blocks.push([e]);
    });
    // 抽日期塊湊到 total - 錯題數，再與錯題塊合併洗牌攤平
    var need = Math.max(0, total - mbItems.length);
    var chosen = [];
    seededPick(blocks, blocks.length, rng).some(function (blk) {
      if (need <= 0) return true;
      var take = Math.min(blk.length, need);
      chosen.push(blk.slice(0, take));
      need -= take;
      return false;
    });
    mbItems.forEach(function (m) { chosen.push([m]); });
    var out = [];
    seededPick(chosen, chosen.length, rng).forEach(function (blk) {
      blk.forEach(function (e) { out.push(e); });
    });
    return out;
  }

  // 單元學習：把單一年級的題庫依 id 序切成單元（4成語+2俚語+4字音+4字形≈14 條），
  // 尾端不足 6 條就併入前一單元。決定性切法：同年級永遠切出同樣的單元。
  function buildUnits(data, grade, take) {
    var cats = ['idioms', 'slang', 'phonics', 'chars'];
    take = take || { idioms: 4, slang: 2, phonics: 4, chars: 4 };
    var qs = {}, idx = {};
    cats.forEach(function (c) { qs[c] = filterByGrades(data[c] || [], [grade]); idx[c] = 0; });
    var units = [];
    while (true) {
      var u = [];
      cats.forEach(function (c) {
        for (var i = 0; i < take[c] && idx[c] < qs[c].length; i++) u.push({ t: c, id: qs[c][idx[c]++].id });
      });
      if (!u.length) break;
      if (u.length < 6 && units.length) units[units.length - 1] = units[units.length - 1].concat(u);
      else units.push(u);
    }
    return units;
  }

  // 弱點分析：由累計統計找出正確率最低與最高的類別（各類至少答過 10 題才納入）
  function weakStrong(stats) {
    var cats = ['idioms', 'slang', 'phonics', 'chars'];
    var rated = cats.map(function (c) {
      var s = stats[c] || { n: 0, ok: 0 };
      return { cat: c, n: s.n, rate: s.n ? s.ok / s.n : null };
    }).filter(function (r) { return r.n >= 10; });
    if (rated.length < 2) return null;
    rated.sort(function (a, b) { return a.rate - b.rate; });
    if (rated[rated.length - 1].rate - rated[0].rate < 0.1) return null; // 差距小就不加權
    return { weak: rated[0].cat, strong: rated[rated.length - 1].cat, weakRate: rated[0].rate };
  }

  // 錯題間隔重考：答對升級（1→3→7 天），三級後畢業；答錯回到隔天重考
  function bumpWrongSchedule(w, ok, todayStr) {
    var days = [1, 3, 7];
    if (!ok) { w.box = 1; w.due = nextDueDays(todayStr, 1); return 'reset'; }
    var box = (w.box || 1) + 1;
    if (box > 3) return 'graduate';
    w.box = box;
    w.due = nextDueDays(todayStr, days[box - 1]);
    return 'up';
  }

  function nextDueDays(todayStr, days) {
    var d = new Date(todayStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return fmtDate(d);
  }

  // 一律用本地日期（toISOString 是 UTC，台灣早上 8 點前會差一天）
  function fmtDate(d) {
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  function nextDue(box, today) {
    var days = box >= 3 ? 5 : (box === 2 ? 2 : 1);
    var d = new Date(today + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return fmtDate(d);
  }

  // 由每日紀錄計算連續完成天數（today 為 YYYY-MM-DD）
  function dailyStreak(daily, todayStr) {
    var n = 0;
    var d = new Date(todayStr + 'T00:00:00');
    if (!daily[todayStr] || !daily[todayStr].done) d.setDate(d.getDate() - 1); // 今天還沒做，從昨天往回數
    while (true) {
      var key = fmtDate(d);
      if (daily[key] && daily[key].done) { n++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return n;
  }

  W.PURE = {
    shuffle: shuffle, pickOthers: pickOthers, filterByGrade: filterByGrade,
    filterByGrades: filterByGrades, gradesLabel: gradesLabel,
    buildIdiomQ: buildIdiomQ, buildSlangQ: buildSlangQ,
    buildPhonicsQ: buildPhonicsQ, buildCharsQ: buildCharsQ,
    buildSynQ: buildSynQ, buildReadingQ: buildReadingQ, buildCustomQ: buildCustomQ,
    rngFromString: rngFromString, seededPick: seededPick, composeDaily: composeDaily,
    composeReview: composeReview,
    weakStrong: weakStrong, bumpWrongSchedule: bumpWrongSchedule, buildUnits: buildUnits,
    dailyStreak: dailyStreak, customBooks: customBooks, customPool: customPool,
    nextDue: nextDue, gradeLabel: gradeLabel
  };

  if (typeof document === 'undefined') return; // node 測試環境到此為止

  /* ---------- 狀態 ---------- */

  var LS_KEY = 'chinese-review-v1';
  var state = load();
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(LS_KEY)); } catch (e) {}
    if (!s || typeof s !== 'object') {
      s = {
        phon: 'zhuyin', grade: 5, extra: [], grades: [5], onboarded: false,
        stats: {}, streak: { last: '', days: 0 }, wrong: [], leitner: {}
      };
    }
    // 舊版單選年級 → 多選遷移
    if (!Array.isArray(s.grades) || !s.grades.length) {
      var g = s.grade || 5;
      s.grades = [];
      if (s.cumulative === false) s.grades = [g];
      else for (var i = 1; i <= g; i++) s.grades.push(i);
    }
    // 2026-08-20 年級改版：主要年級（單選，決定科目與課程進度）＋加練年級（多選）。
    // 舊資料的多選年級以「最高的那個」當主要年級，其餘轉成加練，實際過濾範圍完全不變。
    if (!s.grade || s.grades.indexOf(s.grade) < 0 || !Array.isArray(s.extra)) {
      s.grade = s.grades.slice().sort(function (a, b) { return a - b; }).pop();
      s.extra = s.grades.filter(function (x) { return x !== s.grade; });
      s.onboarded = true;              // 舊使用者不用再被問一次年級
    }
    // 錯題排程遷移
    (s.wrong || []).forEach(function (w) {
      if (!w.box) { w.box = 1; w.due = w.due || fmtDate(new Date()); }
    });
    return s;
  }
  function save() { localStorage.setItem(LS_KEY, JSON.stringify(state)); }
  function today() { return fmtDate(new Date()); }

  function bumpStat(cat, ok) {
    if (!state.stats[cat]) state.stats[cat] = { n: 0, ok: 0 };
    state.stats[cat].n++;
    if (ok) state.stats[cat].ok++;
    var t = today();
    if (state.streak.last !== t) {
      var y = new Date(); y.setDate(y.getDate() - 1);
      state.streak.days = (state.streak.last === fmtDate(y)) ? state.streak.days + 1 : 1;
      state.streak.last = t;
    }
    save();
  }

  // 一般學習（每日練習以外的刷題/單元/錯題重練/手寫等）逐日彙整（Tony 2026-08-12）：
  // 家長檢視與週報顯示「當天有自主練習」，refs 供總結測驗出題檢驗精熟。
  // 只留 30 天；不自行 save()，由呼叫端接續的 bumpStat 一併存檔。
  function bumpGen(cat, ok, ref) {
    var g = (state.gen = state.gen || {});
    var t = today();
    var rec = g[t] || (g[t] = { n: 0, ok: 0, cats: {}, refs: [] });
    rec.n++;
    if (ok) rec.ok++;
    if (!rec.cats[cat]) rec.cats[cat] = { n: 0, ok: 0 };
    rec.cats[cat].n++;
    if (ok) rec.cats[cat].ok++;
    if (ref && (rec.refs = rec.refs || []).length < 200 &&
        !rec.refs.some(function (r) { return r.t === ref.t && r.id === ref.id && r.qi === ref.qi; })) {
      rec.refs.push(ref);
    }
    var days = Object.keys(g).sort();
    while (days.length > 30) delete g[days.shift()];
  }

  function addWrong(type, id, isWrite) {
    var hit = state.wrong.find(function (w) { return w.t === type && w.id === id; });
    if (hit) { hit.n++; hit.ok = 0; hit.lastWrong = Date.now(); hit.due = nextDueDays(today(), 1); if (isWrite) hit.wr = 1; }
    else state.wrong.push({ t: type, id: id, n: 1, ok: 0, added: Date.now(), lastWrong: Date.now(), due: nextDueDays(today(), 1), wr: isWrite ? 1 : 0 });
    if ((type === 'idioms' || type === 'slang') && !state.leitner[id]) {
      state.leitner[id] = { box: 1, due: today() };
    }
    save();
  }

  // 錯題保留制（Tony 2026-08-02 定案）：答對只記連對次數並延後複習日，不自動移除，由家長/學生手動刪
  function touchWrongOnCorrect(t, id) {
    var w = state.wrong.find(function (x) { return x.t === t && x.id === id; });
    if (!w) return;
    w.ok = (w.ok || 0) + 1;
    var days = [3, 7, 14][Math.min(w.ok - 1, 2)];
    w.due = nextDueDays(today(), days);
    save();
  }

  // 家長儀表板用：逐題記錄「第一次作答」結果（答錯的多存題目／他選／正解文字）。
  // 只留近 30 天、上限 800 筆；不自行 save()，由呼叫端接續的 bumpStat 一併存檔。
  function logAnswer(q, idx, ok) {
    state.answers = state.answers || [];
    var rec = { ts: Date.now(), t: q.type, ok: ok ? 1 : 0 };
    if (!ok) {
      rec.id = q.item.id;
      rec.q = String(q.question || '').slice(0, 90);
      rec.chosen = q.hw ? '（手寫的筆順／字形寫錯）'
        : String(q.options[idx] == null ? '' : q.options[idx]).slice(0, 60);
      rec.correct = q.hw ? String(q.item.answer)
        : String(q.options[q.correct] == null ? '' : q.options[q.correct]).slice(0, 60);
    }
    state.answers.push(rec);
    var cut = Date.now() - 30 * 86400000;
    if (state.answers.length > 800 || (state.answers[0] && state.answers[0].ts < cut)) {
      state.answers = state.answers.filter(function (a) { return a.ts >= cut; });
      if (state.answers.length > 800) state.answers = state.answers.slice(-800);
    }
  }

  function deleteWrong(keys) { // keys: ['t:id', ...]
    var set = {};
    keys.forEach(function (k) { set[k] = true; });
    state.wrong = state.wrong.filter(function (x) { return !set[x.t + ':' + x.id]; });
    save();
  }

  function labelOf(t, id) {
    var it = findItem(t, id);
    if (!it) return id;
    if (isBankCat(t)) return (it.q || '').slice(0, 18) + '…';
    return it.term || (it.word ? it.word : it.answer || it.title || id);
  }

  function findItem(type, id) {
    return (DATA[type] || []).find(function (it) { return it.id === id; });
  }

  /* ---------- 視圖切換 ---------- */

  var views = ['welcome', 'subject', 'home', 'quiz', 'write', 'flash', 'wrongbook', 'progress', 'parent', 'writing', 'units', 'lesson', 'drill', 'custom', 'review', 'help', 'search'];
  // 手機返回手勢／瀏覽器上一頁（2026-08-20 Tony：「很多選進去後都不能回前一頁」）
  // 這是單頁站，本來按返回會直接離站。做法：navStack 與 history 條目一一對應——
  // 前進 pushState，退回一律交給 history.go（畫面在 popstate 裡才更新），
  // 於是「返回手勢」＝畫面上的「✕ 返回」，退到最外層才真的離站。
  var navStack = [], navBusy = false;
  // 中途離開某些頁要收尾（測驗計時、手寫畫布），按返回鍵跟按 ✕ 一樣要清乾淨
  var NAV_CLEAN = {
    quiz: function () { logDwell(); hqCancel(); },
    write: function () { wqCancel(); }
  };
  function curView() {
    for (var i = 0; i < views.length; i++) {
      if (!document.getElementById('view-' + views[i]).classList.contains('hidden')) return views[i];
    }
    return null;
  }
  function render(name) {
    views.forEach(function (v) {
      document.getElementById('view-' + v).classList.toggle('hidden', v !== name);
    });
    // 回到首頁／科目頁就離開匯入題庫模式（返回手勢走這裡，不是只有 ✕ 按鈕）
    if (name === 'home' || name === 'subject') importMode = false;
    // 學習範圍列：除了測驗與第一次選年級，其他頁都常駐（Tony：右上角那顆太小、常忘記勾）
    $('rangeBar').classList.toggle('hidden', RANGE_HIDDEN_VIEWS.indexOf(name) >= 0);
    $('gradePanel').classList.add('hidden');
    // 還沒選年級前，右上角那排（科目／注音／年級）先不要出現，畫面只有一件事要做
    document.querySelector('.topbar-controls').classList.toggle('hidden', name === 'welcome');
    if (name === 'welcome') W.__welcomeRender();
    if (name === 'home') renderHome();
    if (name === 'subject') renderSubjects();
  }
  function show(name) {
    if (navBusy) { render(name); return; }
    if (!navStack.length) {                       // 進站第一頁＝最外層，不佔 history 條目
      navStack = [name];
      try { history.replaceState({ d: 1 }, ''); } catch (e) {}
      render(name); return;
    }
    if (navStack[navStack.length - 1] === name) { render(name); return; }
    var i = navStack.lastIndexOf(name);
    if (i >= 0) {                                 // 回到堆疊裡原本就有的頁 → 走 history 退回
      navBusy = true;
      try { history.go(i - (navStack.length - 1)); } catch (e) { navBusy = false; }
      setTimeout(function () {                    // history.go 沒觸發 popstate 時的保險
        if (!navBusy) return;
        navBusy = false;
        navStack = navStack.slice(0, i + 1);
        render(name);
      }, 300);
      return;
    }
    navStack.push(name);
    try { history.pushState({ d: navStack.length }, ''); } catch (e) {}
    render(name);
  }
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('popstate', function (e) {
      var d = (e.state && e.state.d) || 1;
      if (d > navStack.length) d = navStack.length;   // 只退不進
      var from = curView();
      if (NAV_CLEAN[from]) { try { NAV_CLEAN[from](); } catch (err) {} }
      navStack = navStack.slice(0, Math.max(1, d));
      navBusy = true;
      render(navStack[navStack.length - 1] || 'subject');
      navBusy = false;
    });
  }
  function $(id) { return document.getElementById(id); }

  /* ---------- 首頁 ---------- */

  function pool(cat) { return filterByGrades(DATA[cat], state.grades); }

  function subjectOf(key) {
    return SUBJECTS.find(function (s) { return s.key === key; }) || SUBJECTS[0];
  }

  /* ---------- 科目通用（2026-08-18 Tony：社會等科目也要單元學習那些功能）----------
     國語以外的科目，題庫 schema 同自創題庫（{q,options,answer,exp,book,lesson,diff,qtype}），
     所以「依課練習／依序刷題／單元學習／每日練習／總結測驗／錯題本」全部沿用同一套流程，
     差別只在題庫來源（bankCat）與紀錄的 key 要帶科目，免得各科紀錄互相蓋掉。 */
  function curSubj() { return state.subject || 'chinese'; }
  function isChinese() { return curSubj() === 'chinese'; }
  // 匯入題庫（家長給的題本轉檔）2026-08-20 起是最外層的獨立入口，不綁「目前科目」，
  // 選了哪一科記在 state.importSubj；importMode 期間 bankCat() 就指到那一科的匯入庫。
  var importMode = false;
  function importCat() { return CUSTOM_CATS[state.importSubj || 'chinese'] || 'custom'; }
  function bankCat() { return importMode ? importCat() : (CUSTOM_CATS[curSubj()] || 'custom'); }
  function bankReady(cat) { return (cat || bankCat()) === 'custom' ? W.__customReady : true; }
  // 科目的原創題庫（每日練習／單元學習／依序刷題用）
  function mainCat() { return isChinese() ? null : curSubj(); }
  // 原創題庫已擴充到各年級，每日練習／單元學習／依序刷題一律先照勾選的年級過濾，
  // 否則五年級會抽到國中、高中的題。（2026-08-20）
  // 「依課練習」用的自創題庫不套這層：那邊使用者本來就自己挑冊/課。
  // 沒寫 grade 的題目一律留著（國語自創題庫有些沒標年級），有寫的才照勾選年級過濾
  function gradePool(bank) {
    return (bank || []).filter(function (it) {
      return it.grade == null || state.grades.indexOf(it.grade) >= 0;
    });
  }
  function mainPool() { return gradePool(DATA[mainCat()] || []); }
  // 沒有原創題時退回該科自創題庫（一樣照年級），不要讓五年級抽到別的年級的題本題
  function bankFallback() { return gradePool(DATA[bankCat()] || []); }
  // 每日練習/總結測驗紀錄的 key：國語沿用純日期（相容舊資料），其他科加 |科目
  function subjKey(date) { return isChinese() ? date : date + '|' + curSubj(); }
  // 只取目前科目的每日紀錄（日曆、連續天數用），key 一律還原成純日期
  function subjMap(map) {
    var out = {};
    Object.keys(map || {}).forEach(function (k) {
      var p = k.split('|');
      if ((p[1] || 'chinese') === curSubj()) out[p[0]] = map[k];
    });
    return out;
  }
  // 家長／週報視角：把各科的每日紀錄依日期併成一筆（key 還原成純日期）。
  // 家長要看的是「今天有沒有練」，不是單一科目，所以跨科加總；rec.subjs 記錄當天練了哪幾科。
  function mergeDailyAll(map) {
    var out = {};
    Object.keys(map || {}).forEach(function (k) {
      var p = k.split('|'), date = p[0], subj = p[1] || 'chinese', r = map[k];
      if (!r) return;
      var m = out[date] || (out[date] = { done: false, firstOk: 0, total: 0, ms: 0, rounds: 1, wrong: [], subjs: [] });
      if (!r.done) return;
      m.done = true;
      m.subjs.push(subj);
      m.firstOk += r.firstOk || 0;
      m.total += r.total || 0;
      m.ms += r.ms || 0;
      m.rounds = Math.max(m.rounds, r.rounds || 1);
      m.grade = m.grade || r.grade;
      m.gradesTxt = m.gradesTxt || r.gradesTxt;
      m.finishedAt = Math.max(m.finishedAt || 0, r.finishedAt || 0);
      (r.wrong || []).forEach(function (w) { m.wrong.push(w); });
    });
    return out;
  }

  /* ---------- 科目選擇頁（2026-08-20 Tony：「首頁科目卡這樣太亂」）----------
     12 張卡平鋪太亂，改成三組帶標題；而且**只列目前勾選年級真的有題的科目**
     （勾小學就不會看到物理化學），其餘收在「顯示全部科目」後面。
     配套修掉 Tony 回報的「外面看都 432 題、點進去空的」：卡上的題數一律是
     「目前年級的題數」，不是全庫題數；點到本年級沒題的科目會問要不要一鍵切年級。 */
  var SUBJ_GROUPS = [
    { title: '共同科目', keys: ['chinese', 'english', 'math'] },
    { title: '自然領域', keys: ['science', 'physics', 'chemistry', 'biology', 'earth'] },
    { title: '社會領域', keys: ['social', 'history', 'geography', 'civics'] }
  ];
  var CHINESE_CATS = ['idioms', 'slang', 'phonics', 'chars', 'reading'];
  function subjBanks(key) {
    return key === 'chinese' ? CHINESE_CATS.map(function (c) { return DATA[c] || []; }) : [DATA[key] || []];
  }
  // 某科在指定年級有幾題（國語＝成語/俚語/字音/字形/閱讀加總）
  function subjCount(key, grades) {
    return subjBanks(key).reduce(function (n, bank) {
      return n + filterByGrades(bank, grades).length;
    }, 0);
  }
  // 某科題庫涵蓋哪些年級（算過就記著，資料是靜態的）
  var _subjGrades = {};
  function subjGrades(key) {
    if (_subjGrades[key]) return _subjGrades[key];
    var gs = [];
    subjBanks(key).forEach(function (bank) {
      bank.forEach(function (it) { if (it.grade && gs.indexOf(it.grade) < 0) gs.push(it.grade); });
    });
    gs.sort(function (a, b) { return a - b; });
    return (_subjGrades[key] = gs);
  }
  function enterSubject(key) {
    state.subject = key;
    save();
    show('home');
  }
  // 本年級沒題的科目：問要不要把年級切到該科有題的範圍，不要讓他點進去看到空白
  function askSwitchGrades(s) {
    var gs = subjGrades(s.key);
    if (!gs.length) {
      UIDialog.alert(s.name + '的題庫還在建置中。把題本（Word 檔等）傳到 Telegram，轉檔後就會出現在這裡。');
      return;
    }
    UIDialog.confirm('「' + s.name + '」是 ' + gradesLabel(gs) + ' 的科目，你目前的學習範圍（' +
      gradesLabel(state.grades) + '）沒有題目。\n要幫你把主要年級改成 ' + gradeLabel(gs[0]) + ' 嗎？',
      function () {
        setPrimaryGrade(gs[0]);
        enterSubject(s.key);
      });
  }
  function subjCard(s) {
    var n = subjCount(s.key, state.grades), gs = subjGrades(s.key);
    var b = document.createElement('button');
    b.className = 'card' + (state.subject === s.key ? ' daily-done' : '') + (n ? '' : ' card-dim');
    var sub = n ? n + ' 題 · ' + gradesLabel(state.grades.filter(function (g) { return gs.indexOf(g) >= 0; }))
      : (gs.length ? '這個年級沒有題 · 適用 ' + gradesLabel(gs) : '題庫建置中');
    b.innerHTML = '<span class="card-icon">' + s.icon + '</span><span class="card-title">' + s.name + '</span>' +
      '<span class="card-sub">' + sub + '</span>';
    b.addEventListener('click', function () {
      if (!n) { askSwitchGrades(s); return; }
      enterSubject(s.key);
    });
    return b;
  }
  function renderSubjects() {
    var box = $('subjectCards');
    box.innerHTML = '';
    var hidden = 0;
    SUBJ_GROUPS.forEach(function (g) {
      var wrap = document.createElement('div');
      wrap.className = 'cards';
      g.keys.forEach(function (key) {
        var s = SUBJECTS.find(function (x) { return x.key === key; });
        if (!s) return;
        if (!subjCount(key, state.grades) && !state.allSubj) { hidden++; return; }
        wrap.appendChild(subjCard(s));
      });
      if (!wrap.children.length) return;
      var h = document.createElement('div');
      h.className = 'subj-group';
      h.textContent = g.title;
      box.appendChild(h);
      box.appendChild(wrap);
    });
    // 有科目被年級篩掉時給個開關，不要讓人以為科目不見了
    if (hidden || state.allSubj) {
      var t = document.createElement('button');
      t.className = 'chip subj-toggle';
      t.textContent = state.allSubj ? '只顯示這個年級的科目' : '＋ 顯示全部科目（' + hidden + ' 科不在這個年級）';
      t.addEventListener('click', function () {
        state.allSubj = !state.allSubj;
        save();
        renderSubjects();
      });
      box.appendChild(t);
    }
    // 匯入題庫獨立在最外層，跟科目並列（2026-08-20 Tony：跟我自己出的題分清楚）
    var ih = document.createElement('div');
    ih.className = 'subj-group';
    ih.textContent = '家長匯入';
    box.appendChild(ih);
    var iwrap = document.createElement('div');
    iwrap.className = 'cards';
    var ib = document.createElement('button');
    ib.className = 'card card-wide';
    var itotal = importSubjects().reduce(function (n, x) { return n + x.n; }, 0);
    ib.innerHTML = '<span class="card-icon">📦</span><span class="card-title">匯入題庫</span>' +
      '<span class="card-sub">' + (itotal ? itotal.toLocaleString() + ' 題 · 依冊、依課練習' : '傳題本給我轉檔') + '</span>';
    ib.addEventListener('click', function () {
      if (needLogin()) return;
      showImport();
    });
    iwrap.appendChild(ib);
    box.appendChild(iwrap);
  }

  function renderHome() {
    var subj = subjectOf(state.subject);
    $('subjectBtn').textContent = subj.icon + ' ' + subj.name + ' ▾';
    var cards = document.querySelector('#view-home .cards');
    var ph = $('homePlaceholder');
    var cn = subj.key === 'chinese';
    var bank = cn ? [] : mainPool().concat(bankFallback());
    // 國語專屬的卡片（成語、字音、手寫那些）只在國語出現；其餘功能各科共用
    document.querySelectorAll('#view-home .card[data-cn]').forEach(function (c) {
      c.classList.toggle('hidden', !cn);
    });
    cards.classList.toggle('hidden', !cn && !bank.length);
    $('phonToggle').classList.toggle('hidden', !cn);
    $('homeSearch').textContent = cn ? '🔍 搜尋成語、字詞、文章關鍵字…' : '🔍 搜尋' + subj.name + '題目關鍵字…';
    if (!cn && !bank.length) {
      // 空白頁要講清楚是「年級不對」還是「真的沒題」，並給一鍵切年級（2026-08-20 Tony：
      // 「外面看都 432 題，點進去都空的」——就是勾的年級與該科涵蓋年級對不上）
      var gs = subjGrades(subj.key);
      ph.classList.remove('hidden');
      ph.innerHTML = gs.length
        ? subj.icon + ' ' + subj.name + '在目前的學習範圍（' + gradesLabel(state.grades) + '）沒有題目' +
          '<br><small>' + subj.name + '的題庫是 ' + gradesLabel(gs) + '（共 ' + subjCount(subj.key, gs) + ' 題）。</small>' +
          '<br><button class="chip" id="phGradeFix">切到 ' + gradeLabel(gs[0]) + '</button>'
        : subj.icon + ' ' + subj.name + '科題庫建置中' +
          '<br><small>架構已就緒——把題庫（Word 檔等）傳到 Telegram，轉檔後就能在這裡練習。</small>';
      var fix = $('phGradeFix');
      if (fix) fix.addEventListener('click', function () { setPrimaryGrade(gs[0]); });
      renderGradeBtn();
      return;
    }
    ph.classList.add('hidden');
    if (!cn) {
      var sRec = (state.daily || {})[subjKey(today())];
      var sCard = document.querySelector('.card[data-go="daily"]');
      $('cnt-daily').textContent = sRec && sRec.done ? '今天完成了 ✅' : '今天還沒做';
      if (sCard) sCard.classList.toggle('daily-done', !!(sRec && sRec.done));
      var sDs = dailyStreak(subjMap(state.daily || {}), today());
      $('cnt-streak').textContent = sDs ? '每日練習連續 ' + sDs + ' 天' : '開始累積吧';
      var sWrong = state.wrong.filter(function (w) { return w.t === subj.key; });
      var sDue = sWrong.filter(function (w) { return (w.due || '') <= today(); }).length;
      $('cnt-wrong').textContent = sWrong.length + ' 題待複習' + (sDue ? ' · ' + sDue + ' 題到期' : '');
      var sRv = (state.review || []).filter(function (h) { return (h.subj || 'chinese') === subj.key; }).pop();
      $('cnt-review').textContent = sRv ? '上次 ' + sRv.score + ' 分 · 挑日期或只考錯題本'
        : '挑日期出考卷／只考錯題本 · 滿分100';
      var sUnits = Object.keys(state.units || {}).filter(function (k) { return k.indexOf(subj.key + '-') === 0; }).length;
      $('cnt-drill').textContent = '照順序一題不漏';
      var mainN = mainPool().length;
      $('cnt-units').textContent = sUnits ? '已完成 ' + sUnits + ' 個單元'
        : (mainN ? '課綱自編 ' + mainN + ' 題 · 先看重點再測驗' : '先讀重點再測驗 · 逐關解鎖');
      renderGradeBtn();
      return;
    }
    $('cnt-idioms').textContent = pool('idioms').length + ' 題可練';
    $('cnt-slang').textContent = pool('slang').length + ' 題可練';
    $('cnt-phonics').textContent = pool('phonics').length + ' 題可練';
    $('cnt-chars').textContent = pool('chars').length + ' 題可練';
    $('cnt-reading').textContent = pool('reading').length + ' 篇可練';
    var rec = (state.daily || {})[today()];
    var dCard = document.querySelector('.card[data-go="daily"]');
    $('cnt-daily').textContent = rec && rec.done ? '今天完成了 ✅' : '今天還沒做';
    if (dCard) dCard.classList.toggle('daily-done', !!(rec && rec.done));
    var due = dueCards().length;
    $('cnt-flash').textContent = due ? due + ' 張到期' : '間隔複習';
    $('cnt-wrong').textContent = state.wrong.length + ' 題待複習';
    var ds = dailyStreak(state.daily || {}, today());
    $('cnt-streak').textContent = ds ? '每日練習連續 ' + ds + ' 天' : '開始累積吧';
    var dueN = state.wrong.filter(function (w) { return (w.due || '') <= today(); }).length;
    if (dueN) $('cnt-wrong').textContent = state.wrong.length + ' 題待複習 · ' + dueN + ' 題到期';
    $('cnt-writing').textContent = '每日一句 · 仿寫';
    var rvLast = (state.review || [])[(state.review || []).length - 1];
    $('cnt-review').textContent = rvLast ? '上次 ' + rvLast.score + ' 分 · 挑日期或只考錯題本'
      : '挑日期出考卷／只考錯題本 · 滿分100';
    var uDone = Object.keys(state.units || {}).length;
    $('cnt-units').textContent = uDone ? '已完成 ' + uDone + ' 個單元' : '先教後考 · 逐關解鎖';
    $('cnt-drill').textContent = '照順序一題不漏';
    $('phonToggle').textContent = state.phon === 'zhuyin' ? '注音' : '拼音';
    renderGradeBtn();
  }

  /* ---------- 學習範圍：主要年級（單選）＋加練年級（多選）----------
     2026-08-20 Tony：「常常會忘記勾年級，進去之後看目錄看起來會很奇怪，
     而且勾年級的地方在右上角小小的並不明顯。」
     → 主要年級單選（決定科目清單與課程進度，目錄不會再把好幾個年級混成一長串），
       想複習低年級用「加練其他年級」；入口改成標題列下方整條的「學習範圍」。
     state.grades 仍是實際過濾用的年級陣列＝主要年級 ∪ 加練年級，全站舊邏輯不用改。 */
  var STAGES = [{ name: '國小', from: 1, to: 6 }, { name: '國中', from: 7, to: 9 }, { name: '高中', from: 10, to: 12 }];
  function syncGrades() {
    var out = [state.grade];
    (state.extra || []).forEach(function (g) { if (out.indexOf(g) < 0) out.push(g); });
    state.grades = out.sort(function (a, b) { return a - b; });
  }
  function setPrimaryGrade(g) {
    state.grade = g;
    state.extra = (state.extra || []).filter(function (x) { return x !== g; });
    state.unitGrade = g;        // 單元學習跟著主要年級走，不用再自己切一次
    state.unitBook = '';        // 冊重算（換年級後原本那一冊多半不在範圍裡了）
    syncGrades();
    save();
    afterGradeChange();
  }
  function toggleExtraGrade(g) {
    if (g === state.grade) return;
    state.extra = state.extra || [];
    var i = state.extra.indexOf(g);
    if (i >= 0) state.extra.splice(i, 1); else state.extra.push(g);
    syncGrades();
    save();
    afterGradeChange();
  }
  function afterGradeChange() {
    renderGradeBtn();
    renderRangeBar();
    renderGradePanel();
    refreshView();
  }
  // 換年級後把目前這一頁重畫（不新增 history 條目）
  function refreshView() {
    var v = curView();
    if (v === 'home') renderHome();
    else if (v === 'subject') renderSubjects();
    else if (v === 'units') showUnits();
    else if (v === 'drill') showDrill();
    else if (v === 'custom') showCustom();
    else if (v === 'wrongbook') showWrongbook();
    else if (v === 'progress') showProgress();
    else renderHome();
  }
  function renderGradeBtn() { $('gradeBtn').textContent = gradeLabel(state.grade) + ' ▾'; }
  // 常駐的學習範圍列（測驗中不顯示，免得做到一半題目被換掉）
  var RANGE_HIDDEN_VIEWS = ['quiz', 'write', 'flash', 'welcome'];
  function renderRangeBar() {
    var extra = (state.extra || []).slice().sort(function (a, b) { return a - b; });
    $('rangeBar').innerHTML = '<span class="rb-main">📚 目前：<b>' + gradeLabel(state.grade) + '</b></span>' +
      (extra.length ? '<span class="rb-extra">加練 ' + extra.map(gradeLabel).join('、') + '</span>' : '') +
      '<span class="rb-go">換年級 ›</span>';
  }
  function renderGradePanel() {
    var panel = $('gradePanel');
    panel.innerHTML = '';
    var t1 = document.createElement('div');
    t1.className = 'gp-title';
    t1.textContent = '主要年級（決定科目與課程進度）';
    panel.appendChild(t1);
    STAGES.forEach(function (st) {
      var row = document.createElement('div');
      row.className = 'gp-quick';
      var lab = document.createElement('span');
      lab.className = 'gp-stage';
      lab.textContent = st.name;
      row.appendChild(lab);
      for (var g = st.from; g <= st.to; g++) {
        (function (g) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'chip' + (state.grade === g ? ' active' : '');
          b.textContent = gradeLabel(g);
          b.addEventListener('click', function () { setPrimaryGrade(g); });
          row.appendChild(b);
        })(g);
      }
      panel.appendChild(row);
    });
    var t2 = document.createElement('button');
    t2.type = 'button';
    t2.className = 'gp-more';
    var open = !!state.extraOpen || (state.extra || []).length > 0;
    t2.textContent = (open ? '▾' : '＋') + ' 加練其他年級（複習舊的、預習新的）';
    t2.addEventListener('click', function () { state.extraOpen = !open; save(); renderGradePanel(); });
    panel.appendChild(t2);
    if (open) {
      var grid = document.createElement('div');
      grid.className = 'gp-grid';
      for (var g2 = 1; g2 <= 12; g2++) {
        (function (g) {
          var lab = document.createElement('label');
          var cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.value = g;
          cb.checked = state.grades.indexOf(g) >= 0;
          cb.disabled = g === state.grade;         // 主要年級一定在範圍內，不能取消
          cb.addEventListener('change', function () { toggleExtraGrade(g); });
          lab.appendChild(cb);
          lab.appendChild(document.createTextNode(gradeLabel(g) + (g === state.grade ? '（主要）' : '')));
          grid.appendChild(lab);
        })(g2);
      }
      panel.appendChild(grid);
    }
    var done = document.createElement('button');
    done.type = 'button';
    done.className = 'chip gp-done';
    done.textContent = '完成';
    done.addEventListener('click', function () { panel.classList.add('hidden'); });
    panel.appendChild(done);
  }
  (function initGradePanel() {
    var panel = $('gradePanel');
    function toggle(e) {
      e.stopPropagation();
      renderGradePanel();
      panel.classList.toggle('hidden');
    }
    $('gradeBtn').addEventListener('click', toggle);
    $('rangeBar').addEventListener('click', toggle);
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { panel.classList.add('hidden'); });
  })();

  // 第一次進站：先選學段、再選年級（只問這一次）
  (function initWelcome() {
    var stage = null;
    function render() {
      var sr = $('wcStages');
      sr.innerHTML = '';
      STAGES.forEach(function (st) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'wc-btn' + (stage === st ? ' active' : '');
        b.textContent = st.name;
        b.addEventListener('click', function () { stage = st; render(); });
        sr.appendChild(b);
      });
      var gr = $('wcGrades');
      gr.innerHTML = '';
      if (!stage) return;
      for (var g = stage.from; g <= stage.to; g++) {
        (function (g) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'wc-btn wc-grade';
          b.textContent = gradeLabel(g);
          b.addEventListener('click', function () {
            state.grade = g;
            state.extra = [];
            state.onboarded = true;
            syncGrades();
            save();
            renderGradeBtn();
            renderRangeBar();
            show('subject');
          });
          gr.appendChild(b);
        })(g);
      }
    }
    W.__welcomeRender = render;
  })();

  $('phonToggle').addEventListener('click', function () {
    state.phon = state.phon === 'zhuyin' ? 'pinyin' : 'zhuyin';
    save(); renderHome();
  });
  $('homeLink').addEventListener('click', function () { show('home'); });
  $('subjectBtn').addEventListener('click', function () { show('subject'); });

  // ===== 主題色系（可自選，存 state.theme）=====
  var THEMES = [
    { key: 'night', name: '深夜藍', dot: '#5b8def' },
    { key: 'light', name: '純淨白', dot: '#3b6fe0' },
    { key: 'forest', name: '森林綠', dot: '#3fae7a' },
    { key: 'sakura', name: '櫻花粉', dot: '#e0608c' },
    { key: 'sunny', name: '暖陽杏', dot: '#e08f2e' },
    { key: 'violet', name: '紫夜', dot: '#8b6fe8' }
  ];
  function applyTheme() {
    var t = state.theme || 'night';
    if (t === 'night') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
    var meta = document.querySelector('meta[name=theme-color]');
    if (meta) {
      var bgs = { night: '#12141a', light: '#f3f5fa', forest: '#101815', sakura: '#fdf3f5', sunny: '#fbf6ec', violet: '#14121f' };
      meta.setAttribute('content', bgs[t] || '#12141a');
    }
  }
  (function initThemePanel() {
    var panel = $('themePanel');
    function render() {
      panel.innerHTML = '';
      THEMES.forEach(function (t) {
        var b = document.createElement('button');
        b.className = 'theme-sw' + ((state.theme || 'night') === t.key ? ' active' : '');
        b.innerHTML = '<span class="theme-dot" style="background:' + t.dot + '"></span>' + t.name;
        b.addEventListener('click', function () {
          state.theme = t.key;
          save(); applyTheme(); render();
        });
        panel.appendChild(b);
      });
    }
    $('themeBtn').addEventListener('click', function (e) {
      e.stopPropagation();
      render();
      panel.classList.toggle('hidden');
    });
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { panel.classList.add('hidden'); });
  })();
  applyTheme();

  // 強制登入（2026-08-09 Tony 要求）：未登入不能開始做題，先提示並觸發 Google 登入。
  // 只擋「開始練習」的入口，不擋做到一半的人（token 一小時過期，重新整理會自動續登）。
  function needLogin() {
    if (!window.CloudSync) return false;            // sync.js 沒載入（本機開發）不擋
    if (CloudSync.signedIn()) return false;
    setStatusToast('要先登入才能開始練習！點右上角的「登入」，紀錄才會同步、家長週報才看得到 👆');
    CloudSync.promptLogin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  }
  var LOGIN_GATED = ['daily', 'review', 'idioms', 'slang', 'phonics', 'chars', 'drill', 'custom', 'units', 'reading', 'write', 'flash'];

  document.querySelectorAll('.card').forEach(function (c) {
    c.addEventListener('click', function () {
      var go = c.getAttribute('data-go');
      if (LOGIN_GATED.indexOf(go) >= 0 && needLogin()) return;
      if (go === 'idioms' || go === 'slang' || go === 'phonics' || go === 'chars') startQuiz(go, null);
      else if (go === 'daily') startDaily();
      else if (go === 'reading') startReading();
      else if (go === 'writing') showWriting();
      else if (go === 'units') showUnits();
      else if (go === 'drill') showDrill();
      else if (go === 'custom') showCustom();
      else if (go === 'write') startWrite();
      else if (go === 'flash') startFlash();
      else if (go === 'wrongbook') showWrongbook();
      else if (go === 'review') showReview();
      else if (go === 'progress') showProgress();
    });
  });

  /* ---------- 選擇題測驗（一般／閱讀／每日練習共用引擎） ---------- */

  var quiz = null; // {entries, i, score, mode, round, firstTry, wrongNow, startedAt, combo}
  var CAT_NAME = {
    idioms: '成語', slang: '俚語諺語', phonics: '字音辨正', chars: '字形辨正', reading: '閱讀測驗', custom: '匯入題庫',
    write: '手寫',
    chinese: '國語', english: '英文', math: '數學', science: '自然', social: '社會',
    physics: '物理', chemistry: '化學', biology: '生物', earth: '地球科學',
    history: '歷史', geography: '地理', civics: '公民與社會',
    englishCustom: '英文匯入題庫', mathCustom: '數學匯入題庫',
    scienceCustom: '自然匯入題庫', socialCustom: '社會匯入題庫',
    physicsCustom: '物理匯入題庫', chemistryCustom: '化學匯入題庫',
    biologyCustom: '生物匯入題庫', earthCustom: '地球科學匯入題庫',
    historyCustom: '歷史匯入題庫', geographyCustom: '地理匯入題庫', civicsCustom: '公民與社會匯入題庫'
  };
  // 高中的自然／社會依 108 課綱分科（Tony 2026-08-20 定案「高中要拆」）：
  // 自然 → 物理/化學/生物/地球科學；社會 → 歷史/地理/公民與社會。國中維持領域合科。
  var SUBJECT_CATS = ['english', 'math', 'science', 'social',
    'physics', 'chemistry', 'biology', 'earth', 'history', 'geography', 'civics'];
  // 各科的「自創題庫」（家長提供的題本轉檔）與科目本身的原創題庫分開放：
  // 原創題（依教育部課綱自編）＝ DATA[科目]，用在每日練習／單元學習／依序刷題；
  // 題本轉檔＝ DATA[科目+'Custom']，用在「自創題庫（依課練習）」。（Tony 2026-08-18 定案）
  var CUSTOM_CATS = { chinese: 'custom', english: 'englishCustom', math: 'mathCustom',
    science: 'scienceCustom', social: 'socialCustom', physics: 'physicsCustom',
    chemistry: 'chemistryCustom', biology: 'biologyCustom', earth: 'earthCustom',
    history: 'historyCustom', geography: 'geographyCustom', civics: 'civicsCustom' };
  // id 前綴 → 題庫（依長度由長到短比對，3 碼是自創題庫、2 碼是高中分科原創題庫）
  var ID_PREFIX = {
    phc: 'physicsCustom', chc: 'chemistryCustom', bic: 'biologyCustom', esc: 'earthCustom',
    hic: 'historyCustom', gec: 'geographyCustom', cic: 'civicsCustom',
    ph: 'physics', ch: 'chemistry', bi: 'biology', es: 'earth',
    hi: 'history', ge: 'geography', ci: 'civics',
    ec: 'englishCustom', mc: 'mathCustom', nc: 'scienceCustom', oc: 'socialCustom'
  };

  function buildQ(type, item, p) {
    if (type === 'idioms') return buildIdiomQ(item, p);
    if (type === 'slang') return buildSlangQ(item, p);
    if (type === 'phonics') return buildPhonicsQ(item, p, state.phon);
    return buildCharsQ(item, p, state.phon);
  }

  function quizCatOf(item) {
    var p3 = ID_PREFIX[item.id.slice(0, 3)];
    if (p3) return p3;
    var p2 = ID_PREFIX[item.id.slice(0, 2)];
    if (p2) return p2;
    var c = item.id.charAt(0);
    return c === 'i' ? 'idioms' : c === 's' ? 'slang' : c === 'p' ? 'phonics' : c === 'r' ? 'reading' :
      c === 'x' ? 'custom' : c === 'e' ? 'english' : c === 'm' ? 'math' : c === 'n' ? 'science' : c === 'o' ? 'social' : 'chars';
  }

  function entryKey(e) { return e.t + ':' + e.id + (e.qi != null ? '#' + e.qi : '') + (e.syn ? ':syn' : ''); }

  function buildEntryQ(e) {
    var it = findItem(e.t, e.id);
    if (!it) return null;
    if (isBankCat(e.t)) {
      var q = buildCustomQ(it);
      q.type = e.t;
      return q;
    }
    if (e.t === 'reading') return buildReadingQ(it, e.qi);
    if (e.syn && (it.syn || []).length) return buildSynQ(it, DATA.idioms);
    return buildQ(e.t, it, DATA[e.t]);
  }

  // 非國語科目的練習（schema 同 custom）
  function startSubjectQuiz(key) {
    var p = filterByGrades(DATA[key], state.grades);
    if (!p.length) p = DATA[key];
    if (!p.length) { UIDialog.alert('這科還沒有題目。'); return; }
    var entries = shuffle(p).slice(0, 10).map(function (it) { return { t: key, id: it.id }; });
    beginQuiz(entries, 'normal', key);
  }

  function itemsToEntries(items) {
    return items.map(function (it) { return { t: it._t || quizCatOf(it), id: it.id }; });
  }

  function startQuiz(cat, itemsOverride) {
    var items = itemsOverride || shuffle(pool(cat)).slice(0, 10);
    if (!items.length) { UIDialog.alert('這個年級目前沒有題目，換個年級或勾選「含以下年級」。'); return; }
    beginQuiz(itemsToEntries(items), itemsOverride ? 'retry' : 'normal', cat);
  }

  function startReading() {
    // 挑 2 篇文章，展開全部子題
    var picks = shuffle(pool('reading')).slice(0, 2);
    if (!picks.length) { UIDialog.alert('這個年級目前沒有閱讀題，換個年級或勾選「含以下年級」。'); return; }
    var entries = [];
    picks.forEach(function (r) {
      for (var qi = 0; qi < r.questions.length; qi++) entries.push({ t: 'reading', id: r.id, qi: qi });
    });
    beginQuiz(entries, 'normal', 'reading');
  }

  // 測試用小掛鉤（test/browser-smoke.mjs 需要知道現在考的是哪一題）
  W.QuizDebug = {
    id: function () { return (quiz && quiz.cur) ? quiz.cur.item.id : null; },
    unlock: function () { clearGate(); }   // 測試用：跳過解析鎖倒數
  };

  function beginQuiz(entries, mode, cat) {
    quiz = {
      entries: entries, i: 0, score: 0, mode: mode, cat: cat,
      round: 1, firstTry: {}, wrongNow: [], startedAt: Date.now(), combo: 0, best: 0,
      snaps: [], view: null // 已出過的題目快照（供「上一題」回顧）
    };
    $('quizResult').classList.add('hidden');
    document.querySelector('#view-quiz .quiz-card').classList.remove('hidden');
    show('quiz');
    renderQ();
  }

  function renderQ() {
    clearGate();   // 換題一定解鎖，避免上一題的倒數殘留把按鈕卡死
    var e = quiz.entries[quiz.i];
    var q = buildEntryQ(e);
    if (!q) { quiz.i++; if (quiz.i < quiz.entries.length) return renderQ(); return finishRound(); }
    if (hwEntry(e)) {
      q.hw = true;   // 手寫來源的字形題：測驗裡也用手寫作答
      q.question = q.item.sentence + '\n括號中讀「' +
        (state.phon === 'zhuyin' ? q.item.zhuyin : q.item.pinyin) + '」— 請在下面的格子裡手寫這個字';
    }
    quiz.snaps.push({ q: q, e: e, no: quiz.i + 1, round: quiz.round, answered: null });
    paintSnap(quiz.snaps.length - 1);
  }

  // 畫出第 k 個快照；k < 最新 ⇒ 回顧模式（唯讀）
  function paintSnap(k) {
    var snap = quiz.snaps[k];
    var q = snap.q, e = snap.e;
    var latest = k === quiz.snaps.length - 1;
    quiz.view = k;
    quiz.cur = q; quiz.curEntry = e;
    $('quizProgress').textContent = latest
      ? snap.no + ' / ' + quiz.entries.length + (quiz.mode === 'daily' && quiz.round > 1 ? ' · 第' + quiz.round + '輪' : '')
      : '🔎 回顧 第' + snap.no + '題';
    $('quizScore').textContent = quiz.mode === 'daily' ? '' : '得分 ' + quiz.score;
    $('quizBar').style.width = Math.round(100 * (snap.no - 1) / quiz.entries.length) + '%';
    $('quizTag').textContent = (quiz.mode === 'daily' ? '📅 每日練習 · ' : '') +
      (quiz.mode === 'review' ? '📋 總結測驗 · ' : '') +
      (e.rev ? (quiz.mode === 'review' ? '📕 來自錯題本 · ' : '🔁 錯題複習 · ') : '') +
      CAT_NAME[q.type] + (q.item.grade ? ' · ' + gradeLabel(q.item.grade) : '');
    hideChk();
    var pas = $('quizPassage');
    if (q.passage) { pas.textContent = q.passage; pas.classList.remove('hidden'); }
    else pas.classList.add('hidden');
    $('quizQuestion').textContent = q.question;
    renderFig($('quizFig'), q.item);
    var box = $('quizOptions');
    box.innerHTML = '';
    if (q.hw) {
      // 手寫題：未作答→開手寫格；已作答／回顧→顯示正解字
      box.classList.add('hidden');
      if (!snap.answered) hqLoad(snap, q);
      else {
        hqCancel();
        $('quizHwWrap').classList.remove('hidden');
        var pan = $('quizHwPanel');
        pan.className = 'wq-panel wq-done';
        pan.textContent = q.item.answer;
      }
    } else {
      box.classList.remove('hidden');
      hqCancel();
    }
    if (!q.hw) q.options.forEach(function (opt, idx) {
      var b = document.createElement('button');
      b.className = 'q-opt';
      b.textContent = opt;
      if (snap.answered) {
        b.disabled = true;
        if (idx === q.correct) b.classList.add('correct');
        if (!snap.answered.ok && idx === snap.answered.idx) b.classList.add('wrongpick');
        if (snap.answered && snap.answered.secondIdx != null && !snap.answered.secondOk && idx === snap.answered.secondIdx) b.classList.add('wrongpick');
      } else {
        if (snap.retryFirst != null && idx === snap.retryFirst) { b.disabled = true; b.classList.add('wrongpick'); }
        else b.addEventListener('click', function () { answer(idx, b); });
      }
      box.appendChild(b);
    });
    var fb = $('quizFeedback');
    if (snap.answered) {
      fb.textContent = feedbackText(snap.answered, q);
      fb.className = 'q-feedback ' + (snap.answered.ok || snap.answered.secondOk ? 'good' : 'bad');
      fb.classList.remove('hidden');
      maybeImg(fb, q.type, q.item.id);
      if (q.type === 'idioms') maybeAnimBtn(fb, q.item);
      $('quizNext').textContent = latest ? '下一題' : '返回 →';
      $('quizNext').classList.remove('hidden');
    } else if (snap.retryFirst != null) {
      fb.textContent = '✗ 不對，再想一次！（成績以第一次為準，這題已列入錯題本）';
      fb.className = 'q-feedback bad';
      fb.classList.remove('hidden');
      $('quizNext').classList.add('hidden');
    } else {
      fb.classList.add('hidden');
      $('quizNext').classList.add('hidden');
    }
    // 用猜的按鈕：只在「最新一題、已答且答對」時顯示（規則：答錯自動進錯題本，不需此鈕）
    var gBtn = $('quizGuess');
    if (latest && snap.answered && snap.answered.ok && q.type !== 'reading' && !q.hw) {
      gBtn.textContent = '🤔 這題用猜的（加入複習）';
      gBtn.disabled = false;
      gBtn.classList.remove('hidden');
      gBtn.onclick = function () {
        addWrong(q.type, q.item.id);
        gBtn.textContent = '✓ 已加入錯題本';
        gBtn.disabled = true;
      };
    } else gBtn.classList.add('hidden');
    $('quizPrev').classList.toggle('hidden', k === 0);
  }

  /* 題目附圖（2026-08-19）：題本裡「看圖回答」「題組」這類題目本來就要看圖才答得出來，
     資料的 img 欄位放圖檔路徑（SVG 或 webp），點圖可以放大看。載不到就整個拿掉，不留破圖。 */
  function renderFig(box, item) {
    box.innerHTML = '';
    if (!item || !item.img) { box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    var img = document.createElement('img');
    img.className = 'q-fig-img';
    img.alt = '題目附圖';
    img.src = item.img;
    img.onerror = function () { box.classList.add('hidden'); box.innerHTML = ''; };
    img.addEventListener('click', function () { showLightbox(item.img); });
    box.appendChild(img);
    var hint = document.createElement('small');
    hint.className = 'q-fig-hint';
    hint.textContent = '（點圖可放大）';
    box.appendChild(hint);
  }

  function showLightbox(src) {
    var ov = document.createElement('div');
    ov.className = 'lightbox';
    var im = document.createElement('img');
    im.src = src;
    im.alt = '';
    ov.appendChild(im);
    ov.addEventListener('click', function () { ov.remove(); });
    document.body.appendChild(ov);
  }

  function maybeImg(container, type, id) {
    if (type !== 'idioms') return;
    var img = document.createElement('img');
    img.className = 'q-img';
    img.alt = '';
    img.src = 'img/idioms/' + id + '.webp';
    img.onerror = function () { img.remove(); };
    container.appendChild(img);
  }

  // 成語動畫卡入口按鈕（js/anim.js 的 IdiomAnim）
  function maybeAnimBtn(container, item) {
    if (!item || !item.term || !W.IdiomAnim) return;
    var b = document.createElement('button');
    b.className = 'anim-launch';
    b.textContent = '🎬 看動畫卡';
    b.addEventListener('click', function (ev) {
      ev.stopPropagation();
      W.IdiomAnim.play(item, { phon: state.phon });
    });
    container.appendChild(b);
  }

  // 作答結果的回饋文字（answer 與 paintSnap 共用）
  function feedbackText(ans, q) {
    var head;
    if (q.hw) {
      head = ans.ok ? '✓ 一次就一筆不錯地寫對了！'
                    : '✗ 第一次沒寫對（已列入錯題本安排複習），剛才已重寫到全對。';
      return head + '\n' + q.explain;
    }
    if (ans.ok) head = '✓ 答對了！';
    else if (ans.secondOk) head = '第一次沒選對，第二次答對了 ✓（此題以答錯計，已加入錯題本安排複習）';
    else if (ans.secondIdx != null) head = '✗ 還是不對，正確答案已標示。（已自動加入錯題本安排複習）';
    else head = '✗ 答錯了。（已自動加入錯題本安排複習）';
    return head + '\n' + q.explain;
  }

  /* ---------- 測驗裡的手寫題（Tony 2026-08-17 指示）----------
     手寫練習寫錯的字進錯題本後，混進每日練習／總結測驗時一樣要用手寫作答，不改成選擇題。
     判定沿用手寫練習的規則：第一次一筆全對才算對，寫錯先看示範再重寫到全對才過關；
     成績與錯題本一律以第一次為準。罕用字沒有筆順資料時才退回選擇題。 */

  var hqWriter = null;
  // 這個字形題是否該用手寫出題：entry 明確標了 hw，或錯題本裡這題是手寫來源（wr）
  function hwEntry(e) {
    if (e.t !== 'chars') return false;
    if (e.hw) return true;
    return (state.wrong || []).some(function (w) {
      return w.t === 'chars' && w.id === e.id && w.wr;
    });
  }
  function hqCancel() {
    if (hqWriter) { try { hqWriter.cancelQuiz(); } catch (er) {} hqWriter = null; }
    $('quizHwPanel').innerHTML = '';
    $('quizHwWrap').classList.add('hidden');
    $('quizHwBtns').classList.add('hidden');
    $('quizHwStatus').classList.add('hidden');
  }
  function hqStatus(msg, cls) {
    var el = $('quizHwStatus');
    el.textContent = msg;
    el.className = 'q-feedback' + (cls ? ' ' + cls : '');
    el.classList.remove('hidden');
  }
  // 沒有筆順資料 → 這題退回選擇題
  function hqFallback(snap, q) {
    q.hw = false;
    hqCancel();
    if (quiz.cur === q) paintSnap(quiz.view);
  }
  function hqLoad(snap, q) {
    hqCancel();
    $('quizOptions').classList.add('hidden');
    if (snap.hwData) { hqRun(snap, q, snap.hwData); return; }
    if (!W.HanziWriter || typeof fetch === 'undefined') { hqFallback(snap, q); return; }
    hqStatus('筆順資料載入中…', '');
    fetch('strokes/u' + q.item.answer.codePointAt(0).toString(16) + '.json')
      .then(function (r) { if (!r.ok) throw new Error('404'); return r.json(); })
      .then(function (data) {
        if (quiz.cur !== q) return;
        snap.hwData = data;
        hqRun(snap, q, data);
      })
      .catch(function () { if (quiz.cur === q) hqFallback(snap, q); });
  }
  function hqRun(snap, q, data) {
    if (hqWriter) { try { hqWriter.cancelQuiz(); } catch (er) {} hqWriter = null; }
    $('quizHwWrap').classList.remove('hidden');
    $('quizHwBtns').classList.remove('hidden');
    var panel = $('quizHwPanel');
    panel.className = 'wq-panel';
    panel.innerHTML = '';
    var spd = strokeOpts();
    hqWriter = HanziWriter.create(panel, q.item.answer, {
      width: 260, height: 260, padding: 14,
      showCharacter: false, showOutline: false, showHintAfterMisses: 3,
      strokeColor: '#1a1c22', drawingColor: '#2c66d9', drawingWidth: 10,
      highlightColor: '#e0b64b',
      strokeAnimationSpeed: spd.speed, delayBetweenStrokes: spd.delay,
      charDataLoader: function (c, done) { done(data); }
    });
    hqWriter.quiz({
      leniency: 1.4,
      onComplete: function (sum) { hqDone(snap, q, sum.totalMistakes); }
    });
    hqStatus(snap.hwTried
      ? '照剛剛的示範再寫一次，單次全對才能進下一題！'
      : '這題要手寫：直接在格子裡一筆一筆寫（連續寫錯 3 筆會出現提示筆畫）', '');
  }
  function hqDemoThenRetry(snap, q) {
    if (!hqWriter) { hqRun(snap, q, snap.hwData); return; }
    try { hqWriter.cancelQuiz(); } catch (er) {}
    hqWriter.animateCharacter({ onComplete: function () {
      setTimeout(function () { if (quiz.cur === q) hqRun(snap, q, snap.hwData); }, 2000);
    } });
  }
  function hqDone(snap, q, mistakes) {
    var ok = mistakes === 0;
    if (!snap.hwJudged) {
      snap.hwJudged = true;
      snap.hwFirstOk = ok;
      hwRecordFirst(snap, q, ok);
    }
    if (ok) {
      hqCancel();
      snap.answered = { idx: null, ok: !!snap.hwFirstOk, secondIdx: null, secondOk: null, hw: true };
      paintSnap(quiz.view);
      afterReveal(q, snap.answered.ok);
      return;
    }
    snap.hwTried = true;
    hqStatus('✗ 有 ' + mistakes + ' 筆寫錯（已列入錯題本）。先看一次正確筆順，再重寫到全對才過關！', 'bad');
    hqDemoThenRetry(snap, q);
  }
  // 手寫題的第一次結果：成績、統計、錯題本比照選擇題（錯題標 wr=1，之後仍出手寫）
  function hwRecordFirst(snap, q, ok) {
    var e = snap.e;
    if (ok) quiz.score++;
    quiz.combo = ok ? quiz.combo + 1 : 0;
    if (quiz.combo > quiz.best) quiz.best = quiz.combo;
    $('quizCombo').textContent = quiz.combo >= 3 ? '🔥' + quiz.combo : '';
    var k = entryKey(e);
    if (quiz.firstTry[k] === undefined) {
      quiz.firstTry[k] = ok;
      logAnswer(q, null, ok);
      logGen(q, e, ok);
    }
    if (ok) touchWrongOnCorrect('chars', q.item.id);
    else {
      quiz.wrongNow.push(e);
      if (quiz.round === 1) addWrong('chars', q.item.id, true);
    }
    bumpStat('chars', ok);
    if (quiz.mode !== 'daily') $('quizScore').textContent = '得分 ' + quiz.score;
    if (quiz.mode === 'daily') saveDailyRun(quiz.i + 1);
  }
  $('quizHwDemo').addEventListener('click', function () {
    var snap = quiz && quiz.snaps[quiz.snaps.length - 1];
    if (!snap || !snap.q || !snap.q.hw || snap.answered) return;
    if (!snap.hwJudged) { snap.hwJudged = true; snap.hwFirstOk = false; hwRecordFirst(snap, snap.q, false); }
    snap.hwTried = true;
    hqStatus('看完示範後要重寫到全對才能過關（這題已算答錯，列入錯題本）。', 'bad');
    hqDemoThenRetry(snap, snap.q);
  });

  /* ---------- 自主練習／總結測驗的當日紀錄 ----------
     每日練習有自己的 state.daily 紀錄，總結測驗記在 state.review，
     兩者都不能混進「自主練習」(state.gen)，否則家長檢視會把當天考的每日練習內容
     全都算成自主練習（Tony 2026-08-17 回報）。 */
  function logGen(q, e, ok) {
    if (quiz.mode === 'daily' || quiz.mode === 'review') return;
    var gref = null;
    if (!e.rev) {
      gref = { t: q.type, id: q.item.id };
      if (e.qi != null) gref.qi = e.qi;
      if (q.hw) gref.hw = 1;
    }
    bumpGen(q.hw ? 'write' : q.type, ok, gref);
  }

  /* ---------- 解析停留（Tony 2026-08-17：做太快＝沒看解析）----------
     公布答案後先鎖住「下一題」幾秒，秒數依解析長度加權、答錯的鎖久一點；
     同時記錄每題實際停留時間，家長檢視看得到「解析平均停留幾秒」。 */
  var gate = { timer: null, shownAt: 0, logged: true, left: 0 };
  function gateSeconds(q, ok) {
    var len = String(q.explain || '').length;
    return (ok ? 3 : 6) + Math.min(6, Math.floor(len / 60));
  }
  // 鎖住＝按鈕仍可按（disabled 的按鈕收不到 click，按下去毫無反應；Tony 2026-08-18 回報）
  function clearGate() {
    if (gate.timer) { clearInterval(gate.timer); gate.timer = null; }
    gate.left = 0;
    var btn = $('quizNext');
    btn.disabled = false;
    btn.classList.remove('locked');
    btn.removeAttribute('aria-disabled');
    var hint = $('quizGateHint');
    hint.classList.add('hidden');
    hint.textContent = '';
  }
  function gateNext(q, ok) {
    clearGate();
    gate.shownAt = Date.now();
    gate.logged = false;
    var btn = $('quizNext');
    gate.left = gateSeconds(q, ok);
    btn.classList.add('locked');
    btn.setAttribute('aria-disabled', 'true');
    btn.textContent = '📖 先看解析（' + gate.left + '）';
    gate.timer = setInterval(function () {
      gate.left--;
      if (gate.left <= 0) {
        clearGate();
        btn.textContent = '下一題';
      } else {
        btn.textContent = '📖 先看解析（' + gate.left + '）';
        var hint = $('quizGateHint');
        if (!hint.classList.contains('hidden')) hint.textContent = gateHintText();
      }
    }, 1000);
  }
  function gateHintText() {
    return '⏳ 再 ' + gate.left + ' 秒就可以進下一題。';
  }
  // 倒數期間按「📖 先看解析」：跳出完整解析（Tony 2026-08-18：按了就要出現完整的解析）
  function gateNudge() {
    var hint = $('quizGateHint');
    hint.textContent = gateHintText();
    hint.classList.remove('hidden');
    showFullExp();
  }
  // 完整解析彈窗：這一題的題目、正解與全部解析文字（閱讀題含原文）
  function showFullExp() {
    var snap = quiz && quiz.snaps[quiz.snaps.length - 1];
    var q = snap && snap.q;
    if (!q) return;
    var out = [];
    if (q.passage) out.push(q.passage, '');
    out.push('【題目】' + q.question);
    var ansText = q.hw ? q.item.answer : (q.options ? q.options[q.correct] : '');
    if (ansText) out.push('【正解】' + ansText);
    out.push('', '【完整解析】', q.explain || '（這題沒有額外解析）');
    UIDialog.alert(out.join('\n'));
  }
  // 離開解析畫面時記一筆停留秒數（每日 30 天內）
  function logDwell() {
    clearGate();
    if (gate.logged || !gate.shownAt) return;
    gate.logged = true;
    var ms = Math.min(Date.now() - gate.shownAt, 180000);
    gate.shownAt = 0;
    var d = (state.dwell = state.dwell || {});
    var rec = d[today()] || (d[today()] = { n: 0, ms: 0 });
    rec.n++;
    rec.ms += ms;
    var days = Object.keys(d).sort();
    while (days.length > 30) delete d[days.shift()];
    save();
  }

  /* ---------- 解析確認題（Tony 2026-08-17 定案 (c) 完整版）----------
     公布解析後追問一題「解析裡才有答案」的確認題，答對才能進下一題。
     答錯 ⇒ 原題重新排入錯題本（複習日拉到隔天、連對次數歸零），不另外生成新錯題；
     原題答對但確認題答錯也會進錯題本（會選但說不出為什麼＝還沒懂）。
     沒有確認題資料的題目退回「解析鎖倒數」。 */

  function chkOf(q) {
    return (q && q.item && !q.item._noChk) ? CHECKS[q.item.id] : null;
  }
  // 原題降級：確認題錯了就當這題還沒精熟
  function demoteWrong(t, id) {
    var w = (state.wrong || []).find(function (x) { return x.t === t && x.id === id; });
    if (!w) { addWrong(t, id); return; }
    w.ok = 0;
    w.due = nextDueDays(today(), 1);
    save();
  }
  function bumpChkStat(ok) {
    var c = (state.chk = state.chk || {});
    var rec = c[today()] || (c[today()] = { n: 0, ok: 0 });
    rec.n++;
    if (ok) rec.ok++;
    var days = Object.keys(c).sort();
    while (days.length > 30) delete c[days.shift()];
    save();
  }
  function hideChk() {
    $('quizChk').classList.add('hidden');
    $('quizChkFb').classList.add('hidden');
    $('quizChkOpts').innerHTML = '';
  }
  // 公布解析之後：有確認題就問，沒有就用倒數鎖
  function afterReveal(q, ok) {
    var chk = chkOf(q);
    if (!chk) { gateNext(q, ok); return; }
    showChk(q, chk);
  }
  function showChk(q, chk) {
    var box = $('quizChk');
    box.classList.remove('hidden');
    $('quizChkQ').textContent = chk.q;
    $('quizChkFb').classList.add('hidden');
    var opts = $('quizChkOpts');
    opts.innerHTML = '';
    $('quizNext').classList.add('hidden');   // 答完確認題才出現
    chk.o.forEach(function (text, i) {
      var b = document.createElement('button');
      b.className = 'q-opt';
      b.textContent = text;
      b.addEventListener('click', function () { answerChk(q, chk, i); });
      opts.appendChild(b);
    });
  }
  function answerChk(q, chk, idx) {
    var ok = idx === chk.a;
    var btns = $('quizChkOpts').querySelectorAll('.q-opt');
    Array.prototype.forEach.call(btns, function (b, i) {
      b.disabled = true;
      if (i === chk.a) b.classList.add('correct');
      if (i === idx && !ok) b.classList.add('wrongpick');
    });
    var fb = $('quizChkFb');
    fb.textContent = ok
      ? '✓ 沒錯，這就是解析講的重點。'
      : '✗ 這一點在剛剛的解析裡——原本那題已重新排入錯題本，明天會再考一次。' +
        (chk.exp ? '\n' + chk.exp : '');
    fb.className = 'q-feedback ' + (ok ? 'good' : 'bad');
    fb.classList.remove('hidden');
    bumpChkStat(ok);
    if (!ok && q.type !== 'reading') demoteWrong(q.type, q.item.id);
    $('quizNext').textContent = '下一題';
    $('quizNext').classList.remove('hidden');
    if (quiz.mode === 'daily') saveDailyRun(quiz.i + 1);
  }

  function answer(idx, btn) {
    var q = quiz.cur, e = quiz.curEntry;
    var snap = quiz.snaps[quiz.snaps.length - 1];
    var ok = idx === q.correct;
    var isSecond = snap.retryFirst != null;
    if (!isSecond) {
      // 成績、統計、錯題本一律以「第一次作答」為準
      if (ok) quiz.score++;
      quiz.combo = ok ? quiz.combo + 1 : 0;
      if (quiz.combo > quiz.best) quiz.best = quiz.combo;
      $('quizCombo').textContent = quiz.combo >= 3 ? '🔥' + quiz.combo : '';
      var k = entryKey(e);
      var firstEncounter = quiz.firstTry[k] === undefined;
      if (firstEncounter) quiz.firstTry[k] = ok;
      if (firstEncounter) logAnswer(q, idx, ok);
      if (firstEncounter) logGen(q, e, ok);   // 每日練習與總結測驗不算自主練習
      if (firstEncounter && quiz.mode === 'drill') {
        state.drillPos = state.drillPos || {};
        state.drillPos[quiz.drillKey] = quiz.drillBase + quiz.i + 1;
        save();
      }
      if (ok && q.type !== 'reading') touchWrongOnCorrect(q.type, q.item.id);
      if (!ok) quiz.wrongNow.push(e);
      bumpStat(q.type, ok);
      if (!ok && q.type !== 'reading' && quiz.round === 1) addWrong(q.type, q.item.id);
    }
    // 二次作答：第一次答錯先不公布答案，讓學生再想一次（選項剩 2 個以下就直接公布）
    if (!ok && !isSecond && q.options.length > 2) {
      snap.retryFirst = idx;
      btn.disabled = true;
      btn.classList.add('wrongpick');
      var fb0 = $('quizFeedback');
      fb0.textContent = '✗ 不對，再想一次！（成績以第一次為準，這題已列入錯題本）';
      fb0.className = 'q-feedback bad';
      fb0.classList.remove('hidden');
      $('quizNext').classList.add('hidden');
      $('quizGuess').classList.add('hidden');
      return;
    }
    // 定案：公布答案與解析
    var opts = document.querySelectorAll('#quizOptions .q-opt');
    opts.forEach(function (o) { o.disabled = true; });
    snap.answered = isSecond
      ? { idx: snap.retryFirst, ok: false, secondIdx: idx, secondOk: ok }
      : { idx: idx, ok: ok, secondIdx: null, secondOk: null };
    if (opts[q.correct]) opts[q.correct].classList.add('correct');
    if (!snap.answered.ok) {
      if (opts[snap.answered.idx]) opts[snap.answered.idx].classList.add('wrongpick');
      if (snap.answered.secondIdx != null && !snap.answered.secondOk && opts[snap.answered.secondIdx]) {
        opts[snap.answered.secondIdx].classList.add('wrongpick');
      }
    }
    // 規則：第一次就答對才顯示「用猜的」按鈕（答錯已自動進錯題本）
    var gBtn = $('quizGuess');
    if (snap.answered.ok && q.type !== 'reading') {
      gBtn.textContent = '🤔 這題用猜的（加入複習）';
      gBtn.disabled = false;
      gBtn.classList.remove('hidden');
      gBtn.onclick = function () {
        addWrong(q.type, q.item.id);
        gBtn.textContent = '✓ 已加入錯題本';
        gBtn.disabled = true;
      };
    } else gBtn.classList.add('hidden');
    var fb = $('quizFeedback');
    fb.textContent = feedbackText(snap.answered, q);
    fb.className = 'q-feedback ' + (snap.answered.ok || snap.answered.secondOk ? 'good' : 'bad');
    fb.classList.remove('hidden');
    maybeImg(fb, q.type, q.item.id);
    if (q.type === 'idioms') maybeAnimBtn(fb, q.item);
    $('quizNext').textContent = '下一題';
    $('quizNext').classList.remove('hidden');
    afterReveal(q, snap.answered.ok);   // 有確認題就問一題，沒有就用倒數鎖
    if (quiz.mode !== 'daily') $('quizScore').textContent = '得分 ' + quiz.score;
    if (quiz.mode === 'daily') saveDailyRun(quiz.i + 1);
  }

  function finishRound() {
    if (quiz.mode === 'review') { completeReview(); return; }   // 考試模式：一次作答、不重做
    if (quiz.mode === 'daily' || quiz.mode === 'unit') {
      if (quiz.wrongNow.length) {
        // 精熟迴圈：錯的題目下一輪重做，直到全對
        var again = shuffle(quiz.wrongNow);
        quiz.wrongNow = [];
        quiz.entries = again;
        quiz.i = 0;
        quiz.round++;
        saveDailyRun(0);
        var fb = $('quizFeedback');
        renderQ();
        setStatusToast('還有 ' + again.length + ' 題沒答對，再來一輪 💪');
        return;
      }
      if (quiz.mode === 'unit') completeUnit(); else completeDaily();
      return;
    }
    document.querySelector('#view-quiz .quiz-card').classList.add('hidden');
    var r = $('quizResult');
    r.innerHTML = '本回合結束<br><b style="font-size:1.6rem">' + quiz.score + ' / ' + quiz.entries.length +
      '</b>' + (quiz.best >= 3 ? '<br>最長連對 🔥' + quiz.best : '') +
      '<br>' + (quiz.score === quiz.entries.length ? '全對，太強了 🎉' : '答錯的題目已加入錯題本') +
      '<br><button class="btn-primary" id="quizAgain">再來一回合</button>';
    r.classList.remove('hidden');
    if (quiz.score === quiz.entries.length) confetti();
    var cat = quiz.cat, retry = quiz.mode === 'retry', drill = quiz.mode === 'drill', search = quiz.mode === 'search';
    if (search) $('quizAgain').textContent = '← 回搜尋結果';
    if (drill) {
      var done = Math.min(quiz.drillBase + quiz.entries.length, quiz.drillTotal);
      var finished = done >= quiz.drillTotal;
      $('quizAgain').textContent = finished ? '回列表' : '繼續刷下一批 →';
      var prog = document.createElement('div');
      prog.textContent = finished
        ? '🎉 「' + (quiz.drillDesc || CAT_NAME[cat]) + '」的題目已完整刷完一輪！（共 ' + quiz.drillTotal + ' 題）'
        : (quiz.drillDesc || CAT_NAME[cat]) + ' 進度：' + done + ' / ' + quiz.drillTotal;
      $('quizResult').insertBefore(prog, $('quizAgain'));
      if (finished) setStatusToast('🎉 這一類題目做完一輪了！');
    }
    var dBook = quiz.drillBook, dLesson = quiz.drillLesson, dKey = quiz.drillKey;
    $('quizAgain').addEventListener('click', function () {
      if (search) { show('search'); return; }
      if (retry) showWrongbook();
      else if (drill) {
        if ((state.drillPos[dKey] || 0) >= quiz.drillTotal) { if (importMode) showCustom(); else showDrill(); }
        else startDrill(cat, dBook, dLesson);
      }
      else if (cat === 'reading') startReading();
      else if (isBankCat(cat)) startSubjectQuiz(cat);
      else startQuiz(cat, null);
    });
  }

  $('quizNext').addEventListener('click', function () {
    if (gate.timer) { gateNudge(); return; }   // 解析鎖倒數中：給提示，不放行
    logDwell();
    // 回顧模式：往前走回最新一題
    if (quiz.view != null && quiz.view < quiz.snaps.length - 1) { paintSnap(quiz.view + 1); return; }
    quiz.i++;
    if (quiz.i >= quiz.entries.length) finishRound();
    else renderQ();
  });
  $('quizPrev').addEventListener('click', function () {
    logDwell();
    var k = (quiz.view == null ? quiz.snaps.length - 1 : quiz.view) - 1;
    if (k >= 0) paintSnap(k);
  });
  $('quizExit').addEventListener('click', function () {
    logDwell();
    hqCancel();
    function leave() {
      if (quiz && quiz.mode === 'search') { show('search'); return; }
      if (importMode) { showCustom(); return; }   // 從匯入題庫進來的，退回匯入題庫
      show('home');
    }
    if (quiz && quiz.mode === 'daily' && !((state.daily || {})[today()] || {}).done) {
      UIDialog.confirm('今日練習還沒完成，確定要離開？（進度不會保留）', leave); return;
    }
    if (quiz && quiz.mode === 'review' && quiz.i < quiz.entries.length) {
      UIDialog.confirm('測驗還沒做完，確定要離開？（這次不會計分）', leave); return;
    }
    leave();
  });

  /* ---------- 搜尋題庫 ---------- */

  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // 關鍵字反白（大小寫不分），輸出安全 HTML
  function hiHtml(text, kw) {
    text = String(text == null ? '' : text);
    if (!kw) return escHtml(text);
    var out = '', low = text.toLowerCase(), k = kw.toLowerCase(), i = 0, j;
    while ((j = low.indexOf(k, i)) >= 0) {
      out += escHtml(text.slice(i, j)) + '<mark>' + escHtml(text.slice(j, j + kw.length)) + '</mark>';
      i = j + kw.length;
    }
    return out + escHtml(text.slice(i));
  }
  // 長文取關鍵字前後片段
  function excerptAround(text, kw, before, after) {
    text = String(text || '');
    var j = text.toLowerCase().indexOf(kw.toLowerCase());
    if (j < 0) return text.slice(0, before + after) + (text.length > before + after ? '…' : '');
    var s = Math.max(0, j - before), e = Math.min(text.length, j + kw.length + after);
    return (s > 0 ? '…' : '') + text.slice(s, e) + (e < text.length ? '…' : '');
  }

  var SEARCH_CAP = 30;
  var searchTimer = null;
  var searchFilter = { grade: 'all', diff: [] }; // diff 可複選；空陣列＝不限

  // 難易度：自創題庫有標的用原標示，其他題庫依年級推（國小=易、國中=中、高中=難）
  function itemDiff(it) {
    if (it.diff) return it.diff;
    if (!it.grade) return null;
    return it.grade <= 6 ? '易' : it.grade <= 9 ? '中' : '難';
  }
  function searchFilterOk(it) {
    var g = searchFilter.grade;
    if (g !== 'all' && it.grade) {
      if (g === 'mine') { if (state.grades.indexOf(it.grade) < 0) return false; }
      else if (g === 'elem') { if (it.grade > 6) return false; }
      else if (g === 'jr') { if (it.grade < 7 || it.grade > 9) return false; }
      else if (g === 'sr') { if (it.grade < 10) return false; }
    }
    if (searchFilter.diff.length) {
      var dv = itemDiff(it);
      if (dv && searchFilter.diff.indexOf(dv) < 0) return false;
    }
    return true;
  }
  (function initSearchFilters() {
    function buildRow(rowId, key, opts) {
      var row = $(rowId);
      opts.forEach(function (o) {
        var b = document.createElement('button');
        b.className = 'chip' + (searchFilter[key] === o[0] ? ' active' : '');
        b.type = 'button';
        b.textContent = o[1];
        b.addEventListener('click', function () {
          searchFilter[key] = o[0];
          row.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
          b.classList.add('active');
          doSearch();
        });
        row.appendChild(b);
      });
    }
    buildRow('searchGradeRow', 'grade', [['all', '全部年級'], ['mine', '我的年級'], ['elem', '國小'], ['jr', '國中'], ['sr', '高中']]);
    // 難易度可複選：點易/中/難切換勾選，「全部難度」清空
    var diffRow = $('searchDiffRow');
    var diffOpts = [['all', '全部難度'], ['易', '易'], ['中', '中'], ['難', '難']];
    function paintDiff() {
      diffRow.querySelectorAll('.chip').forEach(function (c) {
        var v = c.getAttribute('data-v');
        c.classList.toggle('active', v === 'all' ? !searchFilter.diff.length : searchFilter.diff.indexOf(v) >= 0);
      });
    }
    diffOpts.forEach(function (o) {
      var b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.textContent = o[1];
      b.setAttribute('data-v', o[0]);
      b.addEventListener('click', function () {
        if (o[0] === 'all') searchFilter.diff = [];
        else {
          var i = searchFilter.diff.indexOf(o[0]);
          if (i >= 0) searchFilter.diff.splice(i, 1); else searchFilter.diff.push(o[0]);
        }
        paintDiff();
        doSearch();
      });
      diffRow.appendChild(b);
    });
    paintDiff();
  })();

  function searchDefs() {
    var defs = [
      { t: 'idioms', fields: function (it) { return [it.term, it.zhuyin, it.pinyin, it.meaning, it.example]; } },
      { t: 'slang', fields: function (it) { return [it.term, it.meaning, it.example]; } },
      { t: 'phonics', fields: function (it) { return [it.word, it.zhuyin, it.pinyin, it.note]; } },
      { t: 'chars', fields: function (it) { return [it.answer, it.sentence, it.zhuyin, it.pinyin, it.note]; } },
      { t: 'reading', fields: function (it) { return [it.title, it.passage]; } },
      { t: 'custom', fields: function (it) { return [it.q, it.tag, it.lesson, it.book]; } }
    ];
    SUBJECT_CATS.forEach(function (k) {
      [k, CUSTOM_CATS[k]].forEach(function (c) {
        if ((DATA[c] || []).length) defs.push({ t: c, fields: function (it) { return [it.q, it.tag, it.lesson, it.book]; } });
      });
    });
    return defs;
  }

  function doSearch() {
    var kw = $('searchInput').value.trim();
    var box = $('searchResults');
    box.innerHTML = '';
    if (!kw) {
      $('searchHint').textContent = '搜尋全部年級的成語、俚語諺語、字音、字形、閱讀與匯入題庫。點結果先看解析，再按「做這題」。';
      return;
    }
    var low = kw.toLowerCase();
    var total = 0;
    searchDefs().forEach(function (def) {
      var hits = (DATA[def.t] || []).filter(function (it) {
        return searchFilterOk(it) && def.fields(it).some(function (f) {
          return f != null && String(f).toLowerCase().indexOf(low) >= 0;
        });
      });
      if (!hits.length) return;
      total += hits.length;
      var head = document.createElement('div');
      head.className = 's-group';
      head.textContent = CAT_NAME[def.t] + '（' + hits.length + '）';
      box.appendChild(head);
      hits.slice(0, SEARCH_CAP).forEach(function (it) { box.appendChild(searchItemEl(def.t, it, kw)); });
      if (hits.length > SEARCH_CAP) {
        var more = document.createElement('div');
        more.className = 's-more';
        more.textContent = '…還有 ' + (hits.length - SEARCH_CAP) + ' 筆，把關鍵字打長一點可以縮小範圍';
        box.appendChild(more);
      }
    });
    var filtered = searchFilter.grade !== 'all' || searchFilter.diff.length > 0;
    $('searchHint').textContent = total ? '共找到 ' + total + ' 筆' + (filtered ? '（已套用篩選）' : '')
      : '找不到「' + kw + '」' + (filtered ? '，試著放寬年級／難度篩選' : '，換個關鍵字試試（可以搜詞語、意思、例句或注音）');
  }

  function searchItemEl(t, it, kw) {
    var d = document.createElement('div');
    d.className = 's-item';
    var z = state.phon === 'zhuyin';
    var title = '', zy = '', sub = '';
    if (t === 'idioms') { title = it.term; zy = z ? it.zhuyin : it.pinyin; sub = it.meaning; }
    else if (t === 'slang') { title = it.term; zy = '（' + it.kind + '）'; sub = it.meaning; }
    else if (t === 'phonics') { title = it.word; zy = '「' + it.target + '」讀 ' + (z ? it.zhuyin : it.pinyin); sub = it.note || ''; }
    else if (t === 'chars') { title = it.answer; zy = z ? it.zhuyin : it.pinyin; sub = it.sentence; }
    else if (t === 'reading') { title = it.title; zy = '（' + (it.genre || '閱讀') + ' · ' + it.questions.length + ' 題）'; sub = excerptAround(it.passage, kw, 20, 40); }
    else { // custom 與其他科目
      title = excerptAround(it.q || '', kw, 15, 25);
      var meta = [it.book, it.lesson, it.tag, it.qtype, it.diff].filter(Boolean).join(' · ');
      sub = meta;
    }
    var gradeTag = it.grade ? '<span class="s-grade">' + gradeLabel(it.grade) + '</span>' : '';
    if (it.diff) gradeTag += '<span class="s-grade">' + escHtml(it.diff) + '</span>';
    d.innerHTML = '<div class="s-head"><span class="s-title">' + hiHtml(title, kw) + '</span>' +
      (zy ? '<span class="s-zy">' + escHtml(zy) + '</span>' : '') + gradeTag + '</div>' +
      (sub ? '<div class="s-sub">' + hiHtml(sub, kw) + '</div>' : '');
    var detail = null;
    d.addEventListener('click', function () {
      if (detail) { detail.classList.toggle('hidden'); return; }
      detail = document.createElement('div');
      detail.className = 's-detail';
      detail.textContent = searchDetailText(t, it);
      if (t === 'idioms') maybeImg(detail, 'idioms', it.id);
      if (it.img) {
        var fig = document.createElement('div');
        fig.className = 'q-fig';
        detail.appendChild(fig);
        renderFig(fig, it);
      }
      var acts = document.createElement('div');
      acts.className = 's-actions';
      var go = document.createElement('button');
      go.className = 'btn-primary';
      go.textContent = t === 'reading' ? '✏️ 做這篇的題目（' + it.questions.length + ' 題）' : '✏️ 做這題';
      go.addEventListener('click', function (e) {
        e.stopPropagation();
        if (needLogin()) return;
        startSearchQuiz(t, it);
      });
      acts.appendChild(go);
      detail.appendChild(acts);
      d.appendChild(detail);
    });
    return d;
  }

  function searchDetailText(t, it) {
    var z = state.phon === 'zhuyin';
    var out = [];
    if (t === 'idioms') {
      out.push('💡 ' + it.meaning);
      if (it.wordExp) out.push('🔍 逐字解析：' + it.wordExp);
      out.push('例：' + it.example);
      if (it.syn && it.syn.length) out.push('同義：' + it.syn.join('、'));
      if (it.misuse) out.push('⚠️ ' + it.misuse);
      var dx = deepExp(it);
      if (dx) out.push(dx.replace(/^\n/, ''));
    } else if (t === 'slang') {
      out.push('💡 ' + it.meaning);
      out.push('例：' + it.example);
    } else if (t === 'phonics') {
      if (it.note) out.push('💡 ' + it.note);
      if (it.deep) out.push('📚 ' + it.deep);
    } else if (t === 'chars') {
      out.push('例：' + it.sentence.split('（　）').join(it.answer));
      if (it.note) out.push('💡 ' + it.note);
      if (it.deep) out.push('📚 ' + it.deep);
    } else if (t === 'reading') {
      out.push(it.passage);
      if (it.src) out.push('（出處：' + it.src + '）');
    } else {
      out.push(it.q || '');
      out.push('👉 按「做這題」看選項並作答，答完會有完整解析。');
    }
    return out.join('\n');
  }

  function startSearchQuiz(t, it) {
    var entries;
    if (t === 'reading') {
      entries = [];
      for (var qi = 0; qi < it.questions.length; qi++) entries.push({ t: 'reading', id: it.id, qi: qi });
    } else entries = [{ t: t, id: it.id }];
    beginQuiz(entries, 'search', t);
  }

  $('homeSearch').addEventListener('click', function () {
    show('search');
    setTimeout(function () { $('searchInput').focus(); }, 60);
  });
  $('searchExit').addEventListener('click', function () { show('home'); });
  $('searchInput').addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(doSearch, 180);
  });

  /* ---------- 每日練習 ---------- */

  function dailyRec() { return (state.daily = state.daily || {})[subjKey(today())]; }
  // 這筆 ref（自主練習/每日練習出過的題）屬不屬於目前科目
  function refIsCur(r) {
    if (isChinese()) return SUBJECT_CATS.indexOf(r.t) < 0 && !/Custom$/.test(r.t || '');
    return r.t === curSubj() || r.t === bankCat();
  }

  // 中途進度續做（2026-08-08）：每答完一題把「還剩哪些題、答到第幾題」寫進 state.dailyRun，
  // 隨雲端同步 → 換裝置（或關掉分頁）都能從上次的題號繼續，不會從第 1 題重來。
  function saveDailyRun(nextI) {
    if (!quiz || quiz.mode !== 'daily') return;
    state.dailyRun = {
      date: today(), subj: curSubj(), entries: quiz.entries, i: nextI, score: quiz.score,
      round: quiz.round, firstTry: quiz.firstTry, wrongNow: quiz.wrongNow,
      elapsed: Date.now() - quiz.startedAt
    };
    save();
  }

  function resumeDaily(run) {
    quiz = {
      entries: run.entries, i: run.i, score: run.score || 0, mode: 'daily', cat: null,
      round: run.round || 1, firstTry: run.firstTry || {}, wrongNow: run.wrongNow || [],
      startedAt: Date.now() - (run.elapsed || 0), combo: 0, best: 0, snaps: [], view: null
    };
    quiz.total = run.entries.length;
    $('quizResult').classList.add('hidden');
    document.querySelector('#view-quiz .quiz-card').classList.remove('hidden');
    show('quiz');
    if (quiz.i >= quiz.entries.length) { finishRound(); return; }
    renderQ();
    setStatusToast('接續上次進度，從第 ' + (quiz.i + 1) + ' 題繼續 👍');
  }

  function startDaily() {
    var rec = dailyRec();
    if (rec && rec.done) { showDailySummary(rec); return; }
    var run = state.dailyRun;
    if (run && run.date === today() && (run.subj || 'chinese') === curSubj() &&
        Array.isArray(run.entries) && run.entries.length) {
      resumeDaily(run);
      return;
    }
    // 弱點加權：正確率最低的類別 +2 題、最高的 -2 題
    var ws = isChinese() ? weakStrong(state.stats) : null;
    var entries;
    if (isChinese()) {
      var counts = { idioms: 6, slang: 4, phonics: 6, chars: 6 };
      if (ws) {
        counts[ws.weak] += 2;
        if (counts[ws.strong] > 3) counts[ws.strong] -= 2;
      }
      entries = composeDaily(DATA, state.grades, today() + '|' + state.grades.join(','), counts);
    } else {
      // 題庫型科目：同日同科出同一組（種子＝日期|科目），依冊/課順序不重複抽 20 題
      var dBank = mainPool().length ? mainPool() : bankFallback();
      entries = composeDailyBank(dBank, today() + '|' + curSubj(), 20);
    }
    if (entries.length < 5) { UIDialog.alert(isChinese() ? '所選年級題目不足，請多勾幾個年級。' : '這一科題目不足。'); return; }
    // 記下今天實際出了哪些題（總結測驗依此精確重組當日題組）
    var dk = subjKey(today());
    var recPrev = state.daily[dk] || {};
    recPrev.refs = entries.slice();
    state.daily[dk] = recPrev;
    save();
    // 錯題到期複習：最多 3 題混入今日練習
    var t = today();
    state.wrong.filter(function (w) { return (w.due || t) <= t && refIsCur(w); }).slice(0, 3)
      .forEach(function (w) {
        var e = { t: w.t, id: w.id, rev: true };
        if (w.t === 'chars' && w.wr) e.hw = true;   // 手寫錯的字混進每日練習時一樣手寫
        entries.push(e);
      });
    beginQuiz(entries, 'daily', null);
    quiz.total = entries.length;
    quiz.weakBoost = ws ? ws.weak : null;
  }

  function completeDaily() {
    var firstOk = 0, total = 0, wrongList = [];
    Object.keys(quiz.firstTry).forEach(function (k) {
      total++;
      if (quiz.firstTry[k]) firstOk++;
      else {
        var parts = k.split(':');
        wrongList.push({ t: parts[0], id: parts[1].split('#')[0] });
      }
    });
    var ms = Date.now() - quiz.startedAt;
    state.dailyRun = null;   // 今日已完成，清掉中途進度
    var keepRefs = (state.daily[subjKey(today())] || {}).refs;
    state.daily[subjKey(today())] = {
      done: true, grade: state.grades[state.grades.length - 1], gradesTxt: gradesLabel(state.grades),
      total: total, firstOk: firstOk, rounds: quiz.round,
      ms: ms, finishedAt: Date.now(), wrong: wrongList, refs: keepRefs
    };
    save();
    document.querySelector('#view-quiz .quiz-card').classList.add('hidden');
    var mins = Math.max(1, Math.round(ms / 60000));
    var streak = dailyStreak(subjMap(state.daily), today());
    var r = $('quizResult');
    r.innerHTML = '🎉 今日練習完成！<br>' +
      '<b style="font-size:1.6rem">' + firstOk + ' / ' + total + '</b><small> 第一次就答對</small><br>' +
      (quiz.round > 1 ? '錯題重做 ' + (quiz.round - 1) + ' 輪後全部答對<br>' : '一輪全對，超強！<br>') +
      '用時約 ' + mins + ' 分鐘 · 連續完成 ' + streak + ' 天🔥<br>' +
      '<small>家長可在「學習進度」查看每日紀錄</small><br>' +
      '<button class="btn-primary" id="quizAgain">回首頁</button>';
    r.classList.remove('hidden');
    confetti();
    $('quizAgain').addEventListener('click', function () { show('home'); });
  }

  function showDailySummary(rec) {
    show('quiz');
    document.querySelector('#view-quiz .quiz-card').classList.add('hidden');
    var r = $('quizResult');
    var mins = Math.max(1, Math.round(rec.ms / 60000));
    r.innerHTML = '✅ 今天已完成每日練習<br>' +
      '<b style="font-size:1.6rem">' + rec.firstOk + ' / ' + rec.total + '</b><small> 第一次就答對</small><br>' +
      '重做 ' + (rec.rounds - 1) + ' 輪 · 用時約 ' + mins + ' 分鐘<br>' +
      '<button class="btn-primary" id="quizAgain">再練一回（不列入紀錄）</button> ' +
      '<button class="btn-ghost" id="quizHome">回首頁</button>';
    r.classList.remove('hidden');
    $('quizAgain').addEventListener('click', function () {
      if (!isChinese()) { startSubjectQuiz(curSubj()); return; }
      var items = shuffle(pool('idioms').concat(pool('phonics')).concat(pool('chars'))).slice(0, 10);
      startQuiz('mixed', items);
    });
    $('quizHome').addEventListener('click', function () { show('home'); });
  }

  /* ---------- 總結測驗：挑日期＋錯題本出 100 分考卷 ---------- */

  // 取某天可考的題目清單＝每日練習＋當日自主練習（state.gen 的 refs）。
  // 每日練習新紀錄有 refs 可精確重組；舊紀錄沒存就用同日種子＋預設配額近似重組
  // （年級設定與當時不同會有出入）；只做過自主練習的日子就只考自主練習內容。
  function reviewEntriesForDate(date) {
    var rec = (state.daily || {})[subjKey(date)] || {};
    var out = [];
    if (rec.refs && rec.refs.length) out = rec.refs.slice();
    else if (rec.done && isChinese()) out = composeDaily(DATA, state.grades, date + '|' + state.grades.join(','), null);
    var g = (state.gen || {})[date];
    if (g && g.refs && g.refs.length) out = out.concat(g.refs.filter(refIsCur));
    return out;
  }

  function showReview() {
    var daily = subjMap(state.daily || {});
    var gen = {};
    Object.keys(state.gen || {}).forEach(function (d) {
      var rec = state.gen[d];
      var refs = (rec.refs || []).filter(refIsCur);
      if (refs.length) gen[d] = { n: refs.length, refs: refs };
    });
    var box = $('rvDays');
    box.innerHTML = '';
    var days = [];
    for (var i = 0; i < 21; i++) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var key = fmtDate(d);
      var hasDaily = daily[key] && (daily[key].done || (daily[key].refs || []).length);
      var hasGen = gen[key] && (gen[key].refs || []).length;
      if (hasDaily || hasGen) days.push(key);
    }
    if (!days.length) {
      box.innerHTML = '<div class="prog-hint">還沒有練習紀錄——先做幾天每日練習或自主練習，再回來考總結測驗。</div>';
    } else {
      days.forEach(function (key) {
        var rec = daily[key];
        var g = gen[key];
        var lab = document.createElement('label');
        lab.className = 'rv-day';
        var status = rec && rec.done
          ? '✅ ' + rec.firstOk + '/' + rec.total + '（' + Math.round(100 * rec.firstOk / rec.total) + '%）'
          : rec && (rec.refs || []).length ? '開始過、未完成' : '';
        if (g && (g.refs || []).length) status += (status ? ' · ' : '') + '📖 自主練 ' + g.n + ' 題';
        lab.innerHTML = '<input type="checkbox" value="' + key + '"> <span>' + key +
          '</span><span class="rv-day-sub">' + status + '</span>';
        box.appendChild(lab);
      });
    }
    renderReviewHistory();
    show('review');
  }

  function renderReviewHistory() {
    var el = $('rvHistory');
    var hist = (state.review || []).filter(function (h) { return (h.subj || 'chinese') === curSubj(); });
    var html = '<h3 class="prog-h3">📊 歷次成績</h3>';
    if (!hist.length) {
      html += '<div class="prog-hint">還沒考過總結測驗。</div>';
    } else {
      hist.slice(-8).reverse().forEach(function (h) {
        html += '<div class="prog-row"><b>' + h.score + ' 分</b><span>' + h.date +
          ' · 答對 ' + h.ok + '/' + h.n +
          (h.wrongOnly ? ' · 📕 錯題測驗' : ' · 考 ' + h.days.length + ' 天份') +
          (h.gradesTxt ? ' · ' + h.gradesTxt : '') + '</span></div>';
      });
    }
    el.innerHTML = html;
  }

  function startReviewTest() {
    var days = Array.prototype.slice.call(document.querySelectorAll('#rvDays input:checked'))
      .map(function (c) { return c.value; });
    var includeMb = $('rvMb').checked;
    if (!days.length && !includeMb) { UIDialog.alert('至少勾選一天，或勾選「混入錯題本題目」。'); return; }
    var daysEntries = days.map(reviewEntriesForDate);
    var mb = includeMb ? (state.wrong || []).filter(refIsCur) : [];
    var entries = composeReview(daysEntries, mb, 20, 6, Math.random);
    if (entries.length < 5) { UIDialog.alert('可出的題目太少，請多勾幾天。'); return; }
    beginQuiz(entries, 'review', null);
    quiz.reviewDays = days;
  }

  // 錯題測驗（Tony 2026-08-17）：隔幾天單獨驗收錯題本，不挑日期。
  // 優先出今天到期的、再依錯的次數排，最多 20 題；手寫來源的字形錯題照樣出手寫題。
  function startWrongTest() {
    var t = today();
    var pool = (state.wrong || []).filter(refIsCur).sort(function (a, b) {
      var ad = (a.due || t) <= t ? 0 : 1, bd = (b.due || t) <= t ? 0 : 1;
      if (ad !== bd) return ad - bd;
      if ((b.n || 0) !== (a.n || 0)) return (b.n || 0) - (a.n || 0);
      return (b.lastWrong || 0) - (a.lastWrong || 0);
    }).slice(0, 20);
    if (pool.length < 3) {
      UIDialog.alert('錯題本目前不到 3 題，先做幾回練習累積錯題再來考。');
      return;
    }
    var entries = composeReview([], pool, pool.length, pool.length, Math.random);
    beginQuiz(entries, 'review', null);
    quiz.reviewDays = [];
    quiz.wrongOnly = true;
  }

  function completeReview() {
    var total = 0, firstOk = 0;
    Object.keys(quiz.firstTry).forEach(function (k) { total++; if (quiz.firstTry[k]) firstOk++; });
    var score = total ? Math.round(100 * firstOk / total) : 0;
    var ms = Date.now() - quiz.startedAt;
    state.review = state.review || [];
    state.review.push({ date: today(), ts: Date.now(), subj: curSubj(), days: quiz.reviewDays || [], n: total,
                        ok: firstOk, score: score, ms: ms, gradesTxt: gradesLabel(state.grades),
                        wrongOnly: quiz.wrongOnly ? 1 : 0 });
    if (state.review.length > 30) state.review = state.review.slice(-30);
    save();
    document.querySelector('#view-quiz .quiz-card').classList.add('hidden');
    var mins = Math.max(1, Math.round(ms / 60000));
    var wo = quiz.wrongOnly;
    var verdict = score >= 90 ? (wo ? '💯 太棒了，錯過的題目幾乎都記住了！' : '💯 太棒了，這幾天的內容記得很牢！')
      : score >= 75 ? '👍 掌握得不錯，答錯的題目已排入錯題複習。'
      : score >= 60 ? (wo ? '🟡 及格邊緣——這些錯題還沒真正記牢，再練一輪。' : '🟡 及格邊緣——這幾天的內容要再複習一下。')
      : (wo ? '❌ 分數偏低，這些錯題等於還沒學會。建議先看解析、再用手寫／單題重練一遍。'
            : '❌ 分數偏低，之前的練習可能沒有用心做。錯題已排入複習，建議把這幾天的內容重新讀過。');
    var r = $('quizResult');
    r.innerHTML = (wo ? '📕 錯題測驗結束<br>' : '📋 總結測驗結束<br>') +
      '<b style="font-size:2rem">' + score + '</b><small> / 100 分</small><br>' +
      '答對 ' + firstOk + ' / ' + total + ' 題 · 用時約 ' + mins + ' 分鐘<br>' +
      verdict + '<br>' +
      '<small>成績已記錄——「總結測驗」頁和「學習進度」都看得到歷次分數</small><br>' +
      '<button class="btn-primary" id="quizAgain">回首頁</button>';
    r.classList.remove('hidden');
    if (score >= 90) confetti();
    $('quizAgain').addEventListener('click', function () { show('home'); });
  }

  /* ---------- 使用說明與版本紀錄（ℹ️，資料在 js/versions.js） ---------- */

  var helpRendered = false;
  $('helpBtn').addEventListener('click', function () {
    if (!helpRendered) {
      helpRendered = true;
      var el = $('verList');
      el.innerHTML = '';
      (window.APP_VERSIONS || []).forEach(function (ver) {
        var box = document.createElement('div');
        box.className = 'ver-item';
        var h = document.createElement('div');
        h.className = 'ver-head';
        h.innerHTML = '<b>' + ver.v + '</b><span class="ver-date">' + ver.date + '</span>';
        box.appendChild(h);
        var ul = document.createElement('ul');
        ver.items.forEach(function (t) {
          var li = document.createElement('li');
          li.textContent = t;
          ul.appendChild(li);
        });
        box.appendChild(ul);
        el.appendChild(box);
      });
    }
    show('help');
    window.scrollTo(0, 0);
  });
  $('helpExit').addEventListener('click', function () { show('home'); });

  $('reviewExit').addEventListener('click', function () { show('home'); });
  $('rvStart').addEventListener('click', startReviewTest);
  $('rvWrongOnly').addEventListener('click', function () { if (!needLogin()) startWrongTest(); });
  $('rvLast7').addEventListener('click', function () {
    var d = new Date(); d.setDate(d.getDate() - 6);
    var cut = fmtDate(d);
    document.querySelectorAll('#rvDays input').forEach(function (c) { c.checked = c.value >= cut; });
  });
  $('rvClear').addEventListener('click', function () {
    document.querySelectorAll('#rvDays input').forEach(function (c) { c.checked = false; });
  });

  /* ---------- 小工具：吐司與彩帶 ---------- */

  var toastTimer = null;
  function setStatusToast(msg) {
    var t = $('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2500);
  }

  function confetti() {
    var colors = ['#5b8def', '#3fb46f', '#e0a13f', '#e05555', '#a06fe0'];
    for (var i = 0; i < 36; i++) {
      var p = document.createElement('div');
      p.className = 'confetti';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.8) + 's';
      p.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
      document.body.appendChild(p);
      (function (el) { setTimeout(function () { el.remove(); }, 3800); })(p);
    }
  }

  /* ---------- 手寫練習（看注音寫國字） ---------- */

  var wr = null;
  // startWrite()＝一般 10 題；startWrite(items,'wrongbook')＝錯題本手寫重練（練完可回錯題本）
  function startWrite(itemsArg, backTo) {
    var items = Array.isArray(itemsArg) ? itemsArg.slice() : shuffle(pool('chars')).slice(0, 10);
    if (!items.length) { UIDialog.alert('這個年級目前沒有題目。'); return; }
    wr = { items: items, i: 0, score: 0, attempt: 1, judged: false, curData: null,
           backTo: backTo || null };
    $('writeResult').classList.add('hidden');
    document.querySelector('#view-write .quiz-card').classList.remove('hidden');
    show('write');
    renderWrite();
  }

  // 逐筆判定測驗（hanzi-writer quiz）：學生直接在格子裡寫，每一筆即時比對字形與筆順。
  // 錯了不能跳過——同一個字重寫到單次全對才進下一題；成績/錯題本一律以第一次書寫為準。
  var wqWriter = null;
  // 筆順示範速度固定用「快」（Tony 2026-08-14 定案，不做切換）
  function strokeOpts() { return { speed: 2.2, delay: 160 }; }
  function wqCancel() {
    if (wqWriter) { try { wqWriter.cancelQuiz(); } catch (e) {} wqWriter = null; }
    $('writeQuizPanel').innerHTML = '';
  }
  function wqStatus(msg, cls) {
    var el = $('writeQuizStatus');
    el.textContent = msg;
    el.className = 'q-feedback' + (cls ? ' ' + cls : '');
    el.classList.remove('hidden');
  }
  function wqRecordFirst(ok, it) {
    if (wr.judged) return;
    wr.judged = true;
    if (ok) { wr.score++; touchWrongOnCorrect('chars', it.id); $('writeScore').textContent = '寫對 ' + wr.score; }
    else addWrong('chars', it.id, true);
    bumpGen('write', ok, { t: 'chars', id: it.id, hw: 1 });
    bumpStat('write', ok);
  }
  function wqStart(it, data) {
    document.querySelector('#view-write .canvas-wrap').classList.add('hidden');
    $('writeClear').classList.add('hidden');
    $('writeReveal').classList.remove('hidden');
    $('writeReveal').textContent = '▶ 看筆順示範（算答錯）';
    $('writeQuizWrap').classList.remove('hidden');
    wqCancel();
    var spd = strokeOpts();
    wqWriter = HanziWriter.create($('writeQuizPanel'), it.answer, {
      width: 260, height: 260, padding: 14,
      showCharacter: false, showOutline: false, showHintAfterMisses: 3,
      strokeColor: '#1a1c22', drawingColor: '#2c66d9', drawingWidth: 10,
      highlightColor: '#e0b64b',
      strokeAnimationSpeed: spd.speed, delayBetweenStrokes: spd.delay,
      charDataLoader: function (c, done) { done(data); }
    });
    wqWriter.quiz({
      leniency: 1.4,
      onComplete: function (summary) { wqDone(it, summary.totalMistakes); }
    });
    wqStatus(wr.attempt === 1
      ? '直接在格子裡一筆一筆寫（連續寫錯 3 筆會出現提示筆畫）'
      : '照剛剛的示範再寫一次，單次全對才能進下一題！', '');
  }
  function wqDemoThenRetry(it) {
    // 示範一次正確筆順→整字停留 2 秒讓學生看清楚→才清空重寫
    // （停留太短會讓最後幾筆看起來「消失」，Tony 2026-08-14 回報）
    if (!wqWriter) { wqStart(it, wr.curData); return; }
    try { wqWriter.cancelQuiz(); } catch (e) {}
    wqWriter.animateCharacter({ onComplete: function () {
      setTimeout(function () {
        if (wr && wr.items[wr.i] === it) wqStart(it, wr.curData);
      }, 2000);
    } });
  }
  function wqDone(it, mistakes) {
    if (it.note) {
      $('writeNote').textContent = it.note;
      $('writeNote').className = 'q-feedback';
      $('writeNote').classList.remove('hidden');
    }
    if (mistakes === 0) {
      var first = !wr.judged;
      wqRecordFirst(true, it);
      wqStatus(first ? '✓ 一次全對，太棒了！' : '✓ 這次全對了，進下一題！（此題成績以第一次為準）', 'good');
      setTimeout(writeNext, 1200);
    } else {
      wqRecordFirst(false, it);
      wr.attempt++;
      wqStatus('✗ 有 ' + mistakes + ' 筆寫錯（已列入錯題本）。先看一次正確筆順，再重寫到全對才過關！', 'bad');
      wqDemoThenRetry(it);
    }
  }
  function writeNext() {
    wr.i++;
    if (wr.i >= wr.items.length) {
      wqCancel();
      document.querySelector('#view-write .quiz-card').classList.add('hidden');
      var r = $('writeResult');
      var fromWb = wr.backTo === 'wrongbook';
      var sameItems = wr.items;
      r.innerHTML = '手寫練習結束<br><b style="font-size:1.6rem">' + wr.score + ' / ' + wr.items.length +
        '</b><br><button class="btn-primary" id="writeAgain">' + (fromWb ? '再練一次這些字' : '再來一回合') + '</button>' +
        (fromWb ? ' <button class="btn-ghost" id="writeBack">回錯題本</button>' : '');
      r.classList.remove('hidden');
      $('writeAgain').addEventListener('click', function () {
        if (fromWb) startWrite(sameItems, 'wrongbook'); else startWrite();
      });
      if (fromWb) $('writeBack').addEventListener('click', showWrongbook);
    } else renderWrite();
  }

  function renderWrite() {
    var it = wr.items[wr.i];
    wr.attempt = 1; wr.judged = false; wr.curData = null;
    var reading = state.phon === 'zhuyin' ? it.zhuyin : it.pinyin;
    $('writeProgress').textContent = (wr.i + 1) + ' / ' + wr.items.length;
    $('writeScore').textContent = '寫對 ' + wr.score;
    $('writeTag').textContent = '手寫 · ' + gradeLabel(it.grade);
    $('writePrompt').textContent = it.sentence + '\n括號中讀「' + reading + '」— 請在下方寫出這個字';
    $('writeAnswer').classList.add('hidden');
    $('writeAnswer').textContent = it.answer;
    $('writeJudge').classList.add('hidden');
    $('writeNote').classList.add('hidden');
    $('writeReveal').classList.remove('hidden');
    $('strokeWrap').classList.add('hidden');
    $('writeQuizWrap').classList.add('hidden');
    $('writeQuizStatus').classList.add('hidden');
    wqCancel();
    clearCanvas();
    // 有筆順資料 → 逐筆判定測驗；罕用字沒有資料 → 退回畫布自評
    if (window.HanziWriter && typeof fetch !== 'undefined') {
      fetch('strokes/u' + it.answer.codePointAt(0).toString(16) + '.json')
        .then(function (r) { if (!r.ok) throw new Error('404'); return r.json(); })
        .then(function (data) {
          if (wr && wr.items[wr.i] === it) { wr.curData = data; wqStart(it, data); }
        })
        .catch(function () { if (wr && wr.items[wr.i] === it) wqFallbackUI(); });
    } else wqFallbackUI();
  }
  function wqFallbackUI() {
    $('writeQuizWrap').classList.add('hidden');
    document.querySelector('#view-write .canvas-wrap').classList.remove('hidden');
    $('writeClear').classList.remove('hidden');
    $('writeReveal').textContent = '顯示答案';
  }

  // 畫布
  var cv = $('writeCanvas');
  var ctx = cv.getContext('2d');
  ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.strokeStyle = '#222';
  var drawing = false;
  function pos(e) {
    var r = cv.getBoundingClientRect();
    var p = e.touches ? e.touches[0] : e;
    return { x: (p.clientX - r.left) * (cv.width / r.width), y: (p.clientY - r.top) * (cv.height / r.height) };
  }
  function down(e) { e.preventDefault(); drawing = true; var p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
  function move(e) { if (!drawing) return; e.preventDefault(); var p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }
  function up() { drawing = false; }
  cv.addEventListener('mousedown', down); cv.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);
  cv.addEventListener('touchstart', down, { passive: false });
  cv.addEventListener('touchmove', move, { passive: false });
  cv.addEventListener('touchend', up);
  function clearCanvas() { ctx.clearRect(0, 0, cv.width, cv.height); }

  $('writeClear').addEventListener('click', clearCanvas);
  $('writeReveal').addEventListener('click', function () {
    var it = wr.items[wr.i];
    if (!$('writeQuizWrap').classList.contains('hidden')) {
      // 測驗模式：主動看示範＝這題算答錯（僅第一次記），看完仍要重寫到全對才過
      wqRecordFirst(false, it);
      wr.attempt++;
      wqStatus('看完示範後照著重寫，單次全對才過關（成績以第一次為準）。', '');
      wqDemoThenRetry(it);
      return;
    }
    // 自評模式（罕用字）：翻答案自評
    $('writeAnswer').classList.remove('hidden');
    $('writeJudge').classList.remove('hidden');
    $('writeReveal').classList.add('hidden');
    showStroke(it.answer);
    if (it.note) {
      $('writeNote').textContent = it.note;
      $('writeNote').className = 'q-feedback';
      $('writeNote').classList.remove('hidden');
    }
  });
  function judgeWrite(ok) {
    var it = wr.items[wr.i];
    if (!wr.judged) {
      wr.judged = true;
      if (ok) { wr.score++; touchWrongOnCorrect('chars', it.id); }
      bumpGen('write', ok, { t: 'chars', id: it.id, hw: 1 });
      bumpStat('write', ok);
      if (!ok) addWrong('chars', it.id, true);
    }
    if (ok) { writeNext(); return; }
    // 寫錯不跳過：清畫布照答案重寫，寫好按「✓ 我寫對了」才進下一題（成績以第一次為準）
    clearCanvas();
    $('writeNote').textContent = '✗ 已列入錯題本。把正確的字照著多寫一次，寫好按「✓ 我寫對了」繼續（成績以第一次為準）。';
    $('writeNote').className = 'q-feedback bad';
    $('writeNote').classList.remove('hidden');
  }
  $('writeRight').addEventListener('click', function () { judgeWrite(true); });
  $('writeWrong').addEventListener('click', function () { judgeWrite(false); });
  $('writeExit').addEventListener('click', function () { wqCancel(); show('home'); });

  // 筆順動畫:讀本地 strokes/uXXXX.json(hanzi-writer 資料);
  // 少數罕用字筆順資料庫沒有,改在同一位置顯示楷書靜態字並註明,不留空白
  var strokeWriter = null;
  function showStroke(ch) {
    var wrap = $('strokeWrap'), panel = $('strokePanel'), replay = $('strokeReplay');
    if (!window.HanziWriter || typeof fetch === 'undefined') return;
    panel.innerHTML = '';
    strokeWriter = null;
    fetch('strokes/u' + ch.codePointAt(0).toString(16) + '.json')
      .then(function (r) { if (!r.ok) throw new Error('404'); return r.json(); })
      .then(function (data) {
        wrap.classList.remove('hidden');
        replay.classList.remove('hidden');
        strokeWriter = HanziWriter.create(panel, ch, {
          width: 170, height: 170, padding: 10,
          showOutline: true,
          strokeColor: '#1a1c22', outlineColor: '#d5d8e0', radicalColor: '#2c66d9',
          strokeAnimationSpeed: strokeOpts().speed, delayBetweenStrokes: strokeOpts().delay,
          charDataLoader: function (c, onComplete) { onComplete(data); }
        });
        strokeWriter.animateCharacter();
      })
      .catch(function () {
        wrap.classList.remove('hidden');
        replay.classList.add('hidden');
        panel.innerHTML = '<div class="stroke-fallback">' + ch +
          '<span>此字暫無筆順動畫資料</span></div>';
      });
  }
  $('strokeReplay').addEventListener('click', function () {
    if (strokeWriter) strokeWriter.animateCharacter();
  });

  /* ---------- 字卡複習（Leitner 三盒） ---------- */

  var fl = null;
  function dueCards() {
    var t = today();
    return Object.keys(state.leitner).filter(function (id) {
      return state.leitner[id].due <= t && findItem(id.charAt(0) === 'i' ? 'idioms' : 'slang', id);
    });
  }

  function startFlash() {
    var due = dueCards();
    show('flash');
    if (!due.length) {
      $('flashEmpty').classList.remove('hidden');
      $('flashCard').classList.add('hidden');
      $('flashFlip').parentElement.classList.add('hidden');
      $('flashJudge').classList.add('hidden');
      // 提供快速加卡
      if (!$('flashSeed')) {
        var b = document.createElement('button');
        b.id = 'flashSeed'; b.className = 'btn-primary';
        b.textContent = '從目前年級隨機加入 20 張字卡';
        b.addEventListener('click', function () {
          var cand = shuffle(pool('idioms').concat(pool('slang')))
            .filter(function (it) { return !state.leitner[it.id]; }).slice(0, 20);
          cand.forEach(function (it) { state.leitner[it.id] = { box: 1, due: today() }; });
          save(); startFlash();
        });
        $('flashEmpty').appendChild(b);
      }
      $('flashInfo').textContent = '字卡複習';
      return;
    }
    $('flashEmpty').classList.add('hidden');
    $('flashCard').classList.remove('hidden');
    $('flashFlip').parentElement.classList.remove('hidden');
    fl = { ids: shuffle(due), i: 0 };
    renderFlash();
  }

  function renderFlash() {
    var id = fl.ids[fl.i];
    var it = findItem(id.charAt(0) === 'i' ? 'idioms' : 'slang', id);
    var box = state.leitner[id].box;
    $('flashInfo').textContent = (fl.i + 1) + ' / ' + fl.ids.length + ' · 盒' + box;
    $('flashFront').textContent = it.term;
    $('flashFront').classList.remove('hidden');
    $('flashBack').innerHTML = '';
    $('flashBack').textContent = it.meaning;
    var small = document.createElement('small');
    small.textContent = '例：' + it.example;
    $('flashBack').appendChild(small);
    maybeImg($('flashBack'), id.charAt(0) === 'i' ? 'idioms' : 'slang', id);
    if (id.charAt(0) === 'i') maybeAnimBtn($('flashBack'), it);
    $('flashBack').classList.add('hidden');
    $('flashJudge').classList.add('hidden');
    $('flashFlip').classList.remove('hidden');
  }

  function flipFlash() {
    $('flashFront').classList.add('hidden');
    $('flashBack').classList.remove('hidden');
    $('flashFlip').classList.add('hidden');
    $('flashJudge').classList.remove('hidden');
  }
  $('flashFlip').addEventListener('click', flipFlash);
  $('flashCard').addEventListener('click', function () {
    if ($('flashBack').classList.contains('hidden')) flipFlash();
  });

  function judgeFlash(know) {
    var id = fl.ids[fl.i];
    var L = state.leitner[id];
    if (know) { L.box = Math.min(3, L.box + 1); }
    else { L.box = 1; }
    L.due = nextDue(L.box, today());
    save();
    fl.i++;
    if (fl.i >= fl.ids.length) startFlash();
    else renderFlash();
  }
  $('flashKnow').addEventListener('click', function () { judgeFlash(true); });
  $('flashForget').addEventListener('click', function () { judgeFlash(false); });
  $('flashExit').addEventListener('click', function () { show('home'); });

  /* ---------- 錯題本 ---------- */

  var wb = { time: 'all', cat: 'all', lesson: 'all', diff: 'all', kw: '', edit: false, sel: {} };

  function wrongFiltered() {
    var cut = 0;
    var now = Date.now();
    if (wb.time === 'today') { var d = new Date(); d.setHours(0, 0, 0, 0); cut = d.getTime(); }
    else if (wb.time === '7d') cut = now - 7 * 86400000;
    else if (wb.time === '30d') cut = now - 30 * 86400000;
    return state.wrong.filter(function (w) {
      if (!refIsCur(w)) return false;   // 錯題本只看目前科目的題（切科目就換一本）
      if (wb.cat !== 'all' && w.t !== wb.cat) return false;
      if ((w.lastWrong || w.added || 0) < cut) return false;
      if (wb.lesson !== 'all') {
        if (!isBankCat(w.t)) return false;
        var itL = findItem(w.t, w.id);
        if (!itL || ((itL.book || '未分類') + '|' + (itL.lesson || '未分類')) !== wb.lesson) return false;
      }
      if (wb.diff !== 'all') {
        var itD = findItem(w.t, w.id);
        if (!itD || itemDiff(itD) !== wb.diff) return false;
      }
      if (wb.kw) {
        var it = findItem(w.t, w.id);
        if (!it) return false;
        var hay = [it.term, it.word, it.target, it.answer, it.sentence, it.meaning, it.note, it.q, it.title, it.tag]
          .filter(Boolean).join(' ').toLowerCase();
        if (hay.indexOf(wb.kw.toLowerCase()) < 0) return false;
      }
      return true;
    }).sort(function (a, b) { return (b.lastWrong || 0) - (a.lastWrong || 0); });
  }

  function fmtTs(ts) {
    if (!ts) return '—';
    var d = new Date(ts);
    return (d.getMonth() + 1) + '/' + d.getDate();
  }

  function showWrongbook() {
    show('wrongbook');
    // 時間 + 類別篩選
    var f = $('wrongFilters');
    f.innerHTML = '';
    [['all', '全部時間'], ['today', '今天'], ['7d', '近7天'], ['30d', '近30天']].forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'chip' + (wb.time === t[0] ? ' active' : '');
      b.textContent = t[1];
      b.addEventListener('click', function () { wb.time = t[0]; showWrongbook(); });
      f.appendChild(b);
    });
    var cats = [['all', '全類別']];
    Object.keys(CAT_NAME).forEach(function (c) {
      if (state.wrong.some(function (w) { return w.t === c && refIsCur(w); })) cats.push([c, CAT_NAME[c]]);
    });
    if (cats.length === 2) cats = [];   // 只有一類（例：社會）就不用顯示類別列
    cats.forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'chip' + (wb.cat === t[0] ? ' active' : '');
      b.textContent = t[1];
      b.addEventListener('click', function () { wb.cat = t[0]; showWrongbook(); });
      f.appendChild(b);
    });
    // 課別篩選（自創題庫的冊·課，有錯題才顯示）
    var lessons = {};
    state.wrong.forEach(function (w) {
      if (!isBankCat(w.t) || !refIsCur(w)) return;
      var it = findItem(w.t, w.id);
      if (!it) return;
      var key = (it.book || '未分類') + '|' + (it.lesson || '未分類');
      lessons[key] = (it.book || '未分類') + '·' + (it.lesson || '未分類');
    });
    var lkeys = Object.keys(lessons).sort();
    if (lkeys.length) {
      if (wb.lesson !== 'all' && !lessons[wb.lesson]) wb.lesson = 'all';
      var lrow = document.createElement('div');
      lrow.className = 'gp-quick unit-grades';
      [['all', '全部課別']].concat(lkeys.map(function (k) { return [k, lessons[k]]; })).forEach(function (t) {
        var b = document.createElement('button');
        b.className = 'chip' + (wb.lesson === t[0] ? ' active' : '');
        b.textContent = t[1];
        b.addEventListener('click', function () { wb.lesson = t[0]; showWrongbook(); });
        lrow.appendChild(b);
      });
      f.appendChild(lrow);
    } else wb.lesson = 'all';
    // 難易度篩選（自創題庫用原標示，其他題庫依年級推）
    var drow = document.createElement('div');
    drow.className = 'gp-quick';
    [['all', '全部難度'], ['易', '易'], ['中', '中'], ['難', '難']].forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'chip' + (wb.diff === t[0] ? ' active' : '');
      b.textContent = t[1];
      b.addEventListener('click', function () { wb.diff = t[0]; showWrongbook(); });
      drow.appendChild(b);
    });
    f.appendChild(drow);
    // 關鍵字篩選（即時過濾，不重建輸入框以保留游標）
    var kw = document.createElement('input');
    kw.type = 'search';
    kw.className = 'wb-kw';
    kw.placeholder = '🔍 關鍵字篩選（詞語、題目、意思…）';
    kw.value = wb.kw;
    kw.addEventListener('input', function () { wb.kw = kw.value.trim(); renderWrongItems(); });
    f.appendChild(kw);
    renderWrongItems();
  }

  // 錯題本工具列＋清單（依 wb 篩選條件重繪；關鍵字輸入時只重繪這一段）
  function renderWrongItems() {
    // 工具列
    var tools = $('wrongTools');
    tools.innerHTML = '';
    var list = wrongFiltered();
    var info = document.createElement('span');
    info.className = 'prog-hint';
    info.textContent = '共 ' + list.length + ' 題' + (list.length ? ' · 點任一題可單獨重練' : '');
    tools.appendChild(info);
    // 手寫來源的錯題：整批用實際手寫重練（一次至多 10 字）
    var writeOnes = list.filter(function (w) { return w.t === 'chars' && w.wr; });
    if (writeOnes.length) {
      var wBtn = document.createElement('button');
      wBtn.className = 'chip';
      wBtn.textContent = '🖌 手寫重練（' + writeOnes.length + '）';
      wBtn.addEventListener('click', function () {
        if (needLogin()) return;
        var items = shuffle(writeOnes).slice(0, 10)
          .map(function (w) { return findItem('chars', w.id); })
          .filter(Boolean);
        startWrite(items, 'wrongbook');
      });
      tools.appendChild(wBtn);
    }
    var editBtn = document.createElement('button');
    editBtn.className = 'chip' + (wb.edit ? ' active' : '');
    editBtn.textContent = wb.edit ? '完成編輯' : '☑ 編輯／刪除';
    editBtn.addEventListener('click', function () { wb.edit = !wb.edit; wb.sel = {}; showWrongbook(); });
    tools.appendChild(editBtn);
    if (wb.edit) {
      var allBtn = document.createElement('button');
      allBtn.className = 'chip';
      allBtn.textContent = '全選';
      allBtn.addEventListener('click', function () {
        list.forEach(function (w) { wb.sel[w.t + ':' + w.id] = true; });
        showWrongbook();
      });
      tools.appendChild(allBtn);
      var delBtn = document.createElement('button');
      delBtn.className = 'chip danger';
      var n = Object.keys(wb.sel).filter(function (k) { return wb.sel[k]; }).length;
      delBtn.textContent = '🗑 刪除選取（' + n + '）';
      delBtn.addEventListener('click', function () {
        var keys = Object.keys(wb.sel).filter(function (k) { return wb.sel[k]; });
        if (!keys.length) { setStatusToast('先勾選要刪的題目'); return; }
        UIDialog.confirm('確定刪除 ' + keys.length + ' 題？（確定已記牢再刪）', function () {
          deleteWrong(keys);
          wb.sel = {};
          showWrongbook();
        });
      });
      tools.appendChild(delBtn);
    }
    // 清單
    var box = $('wrongList');
    box.innerHTML = '';
    if (!list.length) {
      box.innerHTML = '<div class="empty">這個範圍沒有錯題 🎉</div>';
      return;
    }
    list.forEach(function (w) {
      var it = findItem(w.t, w.id);
      if (!it) return;
      var key = w.t + ':' + w.id;
      var div = document.createElement('div');
      div.className = 'wrong-item';
      var head = document.createElement('div');
      head.className = 'wb-row';
      if (wb.edit) {
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!wb.sel[key];
        cb.addEventListener('change', function () { wb.sel[key] = cb.checked; showWrongbook(); });
        head.appendChild(cb);
      }
      var label = w.t === 'custom' ? labelOf(w.t, w.id) :
        (it.term || (it.word ? it.word + '（' + it.target + '）' : it.answer + '：' + it.sentence));
      var bEl = document.createElement('b');
      bEl.textContent = label;
      head.appendChild(bEl);
      var del = document.createElement('button');
      del.className = 'wb-del';
      del.textContent = '✕';
      del.title = '確定記牢了，刪除這題';
      del.addEventListener('click', function (ev) {
        ev.stopPropagation();
        UIDialog.confirm('刪除「' + label + '」？', function () { deleteWrong([key]); showWrongbook(); });
      });
      head.appendChild(del);
      div.appendChild(head);
      // 點整列：一般模式單獨重練這一題；編輯模式改為勾選（Tony 2026-08-14）
      // 手寫來源的錯題（w.wr）重練時走實際手寫逐筆判定，不出選擇題
      div.classList.add('wb-click');
      div.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'INPUT') return;   // 直接點 checkbox 交給它自己處理
        if (wb.edit) { wb.sel[key] = !wb.sel[key]; showWrongbook(); return; }
        if (needLogin()) return;
        if (w.t === 'chars' && w.wr) { startWrite([it], 'wrongbook'); return; }
        beginQuiz([{ t: w.t, id: w.id }], 'retry', null);
      });
      var meta = document.createElement('small');
      var dueTxt = (w.due || '') <= today() ? '⏰今日複習' : '下次 ' + (w.due || '—');
      meta.textContent = CAT_NAME[w.t] + (w.wr ? ' · 🖌手寫' : '') + ' · 錯 ' + w.n + ' 次 · 連對 ' + (w.ok || 0) + ' 次 · 最後錯 ' + fmtTs(w.lastWrong) + ' · ' + dueTxt;
      div.appendChild(meta);
      var sub = document.createElement('small');
      sub.className = 'wb-sub';
      sub.textContent = w.t === 'custom' ? '' : (it.meaning || it.note || '');
      div.appendChild(sub);
      box.appendChild(div);
    });
  }
  $('wrongRetry').addEventListener('click', function () {
    if (needLogin()) return;
    // 手寫來源的錯題不出選擇題（用清單上方的「手寫重練」或點該題單獨手寫）
    var all = wrongFiltered();
    var entries = all.filter(function (w) { return !(w.t === 'chars' && w.wr); })
      .map(function (w) { return { t: w.t, id: w.id }; });
    if (!entries.length) {
      setStatusToast(all.length ? '這個範圍都是手寫錯題——請用「🖌 手寫重練」' : '這個範圍沒有錯題');
      return;
    }
    beginQuiz(shuffle(entries).slice(0, 20), 'retry', null);
  });
  $('wrongExit').addEventListener('click', function () { show('home'); });

  /* ---------- 進度 ---------- */

  function showProgress() {
    show('progress');
    var body = $('progBody');
    body.innerHTML = '';
    var pbtn = document.createElement('button');
    pbtn.className = 'btn-primary pt-open';
    pbtn.textContent = '👨‍🏫 家長／老師儀表板';
    pbtn.addEventListener('click', function () { showParent(); });
    body.appendChild(pbtn);
    var rows = isChinese() ? [
      ['成語', 'idioms'], ['俚語諺語', 'slang'], ['字音辨正', 'phonics'],
      ['字形辨正', 'chars'], ['手寫練習', 'write']
    ] : [[CAT_NAME[curSubj()], curSubj()]];
    rows.forEach(function (r) {
      var s = state.stats[r[1]] || { n: 0, ok: 0 };
      var pct = s.n ? Math.round(100 * s.ok / s.n) : 0;
      var div = document.createElement('div');
      div.className = 'prog-row';
      div.innerHTML = '<b>' + r[0] + '</b><span>' + s.n + ' 題 · 正確率 ' + pct + '%</span>';
      body.appendChild(div);
    });
    if (isChinese()) {
      var extra = document.createElement('div');
      extra.className = 'prog-row';
      var boxes = [0, 0, 0];
      Object.keys(state.leitner).forEach(function (id) { boxes[state.leitner[id].box - 1]++; });
      extra.innerHTML = '<b>字卡</b><span>盒1×' + boxes[0] + ' 盒2×' + boxes[1] + ' 盒3×' + boxes[2] + '</span>';
      body.appendChild(extra);
      // 弱點分析
      var ws = weakStrong(state.stats);
      var weakDiv = document.createElement('div');
      weakDiv.className = 'prog-hint';
      if (ws) {
        weakDiv.textContent = '📊 弱點分析：「' + CAT_NAME[ws.weak] + '」正確率最低（' +
          Math.round(ws.weakRate * 100) + '%），每日練習已自動對它加重出題。';
      } else {
        weakDiv.textContent = '📊 弱點分析：各類作答量還不夠或表現平均，累積更多作答後會自動對最弱類別加重出題。';
      }
      body.appendChild(weakDiv);
    }
    renderDailyCal(body, subjMap(state.daily || {}));
    renderReviewScores(body, (state.review || []).filter(function (h) { return (h.subj || 'chinese') === curSubj(); }));
  }

  // 家長檢視：歷次總結測驗成績（滿分 100）；histOverride = 跨帳號檢視時傳入對方資料
  function renderReviewScores(body, histOverride) {
    var hist = histOverride || state.review || [];
    var head = document.createElement('h3');
    head.className = 'prog-h3';
    head.textContent = '📋 總結測驗成績';
    body.appendChild(head);
    if (!hist.length) {
      var hint = document.createElement('div');
      hint.className = 'prog-hint';
      hint.textContent = '還沒考過。首頁「總結測驗」可挑幾天的每日練習＋自主練習內容出考卷（滿分 100），檢驗有沒有真的精熟。';
      body.appendChild(hint);
      return;
    }
    hist.slice(-8).reverse().forEach(function (h) {
      var row = document.createElement('div');
      row.className = 'prog-row';
      row.innerHTML = '<b>' + h.score + ' 分</b><span>' + h.date + ' · 答對 ' + h.ok + '/' + h.n +
        ' · 考 ' + h.days.length + ' 天份 · 約 ' + Math.max(1, Math.round(h.ms / 60000)) + ' 分鐘</span>';
      body.appendChild(row);
    });
  }

  // 家長檢視：近 14 天每日練習完成狀況，點日期看細節；dailyOverride/genOverride = 跨帳號檢視時傳入對方資料
  function renderDailyCal(body, dailyOverride, genOverride, reviewOverride, dwellOverride, chkOverride) {
    var daily = dailyOverride || state.daily || {};
    var gen = genOverride || state.gen || {};
    var reviews = reviewOverride || state.review || [];
    var dwell = dwellOverride || state.dwell || {};
    var chk = chkOverride || state.chk || {};
    var head = document.createElement('h3');
    head.className = 'prog-h3';
    head.textContent = '👨‍👩‍👧 家長檢視 — 每日學習紀錄';
    body.appendChild(head);
    var hint = document.createElement('div');
    hint.className = 'prog-hint';
    var ds = dailyStreak(daily, today());
    var week = 0;
    for (var i = 0; i < 7; i++) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var k = fmtDate(d);
      if (daily[k] && daily[k].done) week++;
    }
    hint.textContent = '連續完成 ' + ds + ' 天 · 最近 7 天完成 ' + week + ' 天。' +
      '✅=每日練習完成、📖=當天有自主練習（刷題/單元/錯題重練/手寫）、📋=當天考過總結測驗。' +
      '點日期看做了什麼、錯了什麼、解析看多久。';
    body.appendChild(hint);
    var cal = document.createElement('div');
    cal.className = 'daily-cal';
    var detail = document.createElement('div');
    detail.className = 'daily-detail hidden';
    for (var j = 13; j >= 0; j--) {
      (function (offset) {
        var d = new Date(); d.setDate(d.getDate() - offset);
        var key = fmtDate(d);
        var rec = daily[key];
        var gRec = gen[key];
        var rvRec = reviews.filter(function (h) { return h.date === key; });
        var dRec = dwell[key];
        var studied = gRec && gRec.n > 0;
        var cell = document.createElement('button');
        cell.className = 'cal-cell' + (rec && rec.done ? ' done' : studied || rvRec.length ? ' gen' : offset === 0 ? ' today' : '');
        cell.innerHTML = '<small>' + (d.getMonth() + 1) + '/' + d.getDate() + '</small>' +
          (rec && rec.done ? '✅' : studied ? '📖' : rvRec.length ? '📋' : offset === 0 ? '⬜' : '❌');
        cell.addEventListener('click', function () { showDayDetail(detail, key, rec, gRec, rvRec, dRec, chk[key]); });
        cal.appendChild(cell);
      })(j);
    }
    body.appendChild(cal);
    body.appendChild(detail);
  }

  // 一般學習當日摘要文字：「自主練習 12 題，答對 10（成語 6、字音 4、手寫 2）」
  function genDayText(gRec) {
    if (!gRec || !gRec.n) return '';
    var cats = Object.keys(gRec.cats || {}).map(function (c) {
      return (CAT_NAME[c] || c) + ' ' + gRec.cats[c].n;
    }).join('、');
    return '📖 自主練習 ' + gRec.n + ' 題，答對 ' + gRec.ok + (cats ? '（' + cats + '）' : '');
  }

  // 總結測驗當日摘要：「📋 總結測驗 85 分（答對 17/20，考 3 天份）」，可能一天考多次
  function rvDayText(rvRec) {
    return (rvRec || []).map(function (h) {
      return (h.wrongOnly ? '📕 錯題測驗 ' : '📋 總結測驗 ') + h.score + ' 分（答對 ' + h.ok + '/' + h.n +
        (h.wrongOnly ? '，只考錯題本' : '，考 ' + (h.days || []).length + ' 天份') + '）';
    }).join('<br>');
  }
  // 解析停留：做題太快＝沒看解析，這裡讓家長看得到平均秒數
  function dwellDayText(dRec) {
    if (!dRec || !dRec.n) return '';
    var sec = dRec.ms / dRec.n / 1000;
    return '📖 解析平均停留 ' + (Math.round(sec * 10) / 10) + ' 秒／題（' + dRec.n + ' 題）' +
      (sec < 4 ? ' ⚠️ 偏快，可能沒看解析' : '');
  }

  function showDayDetail(box, key, rec, gRec, rvRec, dRec, cRecIn) {
    box.classList.remove('hidden');
    var cRec = cRecIn || (state.chk || {})[key];
    var chkTxt = cRec && cRec.n
      ? '📝 解析確認題 ' + cRec.ok + '/' + cRec.n + ' 答對' +
        (cRec.ok / cRec.n < 0.6 ? ' ⚠️ 解析沒讀懂' : '')
      : '';
    var extra = (gRec && gRec.n ? '<br>' + genDayText(gRec) : '') +
      ((rvRec || []).length ? '<br>' + rvDayText(rvRec) : '') +
      (dwellDayText(dRec) ? '<br>' + dwellDayText(dRec) : '') +
      (chkTxt ? '<br>' + chkTxt : '');
    if (!rec || !rec.done) {
      box.innerHTML = '<b>' + key + '</b><br>這一天沒有完成每日練習。' + extra;
      return;
    }
    var mins = Math.max(1, Math.round(rec.ms / 60000));
    var fin = new Date(rec.finishedAt);
    var pct = rec.total ? Math.round(100 * rec.firstOk / rec.total) : 0;
    var subjTxt = (rec.subjs || []).length
      ? '（' + rec.subjs.map(function (s) { return CAT_NAME[s] || s; }).join('、') + '）' : '';
    var html = '<b>' + key + '</b>' + subjTxt + '（' + (rec.gradesTxt || gradeLabel(rec.grade)) + '）<br>' +
      '✅ 完成於 ' + ('0' + fin.getHours()).slice(-2) + ':' + ('0' + fin.getMinutes()).slice(-2) +
      ' · 用時約 ' + mins + ' 分鐘<br>' +
      '第一次答對 ' + rec.firstOk + ' / ' + rec.total + '（' + pct + '%）· 錯題重做 ' + (rec.rounds - 1) + ' 輪後全對';
    html += extra;
    if (rec.wrong && rec.wrong.length) {
      html += '<br><br><b>當天答錯過的題目：</b>';
      rec.wrong.forEach(function (w) {
        var it = findItem(w.t, w.id);
        if (!it) return;
        var label = it.term || (it.word ? it.word + '（' + it.target + '）' : it.title ? '閱讀《' + it.title + '》' : it.answer);
        html += '<br>· ' + (CAT_NAME[w.t] || w.t) + '：' + label;
      });
    } else {
      html += '<br>全部一次答對 💯';
    }
    box.innerHTML = html;
  }
  $('progReset').addEventListener('click', function () {
    UIDialog.confirm('確定清除所有練習紀錄、錯題本與字卡進度？', function () {
      localStorage.removeItem(LS_KEY);
      state = load(); save(); renderHome(); show('home');
    });
  });
  $('progExit').addEventListener('click', function () { show('home'); });

  /* ---------- 家長／老師儀表板 ---------- */

  function fmtTsTime(ts) {
    var d = new Date(ts);
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' +
      ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  // extState/ownerEmail：家長帳號檢視被授權孩子時，傳入從雲端抓回來的對方 state（唯讀）
  function showParent(extState, ownerEmail) {
    show('parent');
    var st = extState || state;
    var body = $('parentBody');
    body.innerHTML = '';
    renderParentCloud(body, ownerEmail);
    // 各科的每日練習紀錄 key 是「日期|科目」，家長頁一律合併看（2026-08-18）
    var daily = mergeDailyAll(st.daily || {});
    var todayRec = daily[today()];

    function h3(t) {
      var e = document.createElement('h3');
      e.className = 'prog-h3';
      e.textContent = t;
      body.appendChild(e);
    }
    function hintEl(t) {
      var e = document.createElement('div');
      e.className = 'prog-hint';
      e.textContent = t;
      body.appendChild(e);
    }
    function tile(num, label) {
      return '<div class="pt-tile"><div class="pt-num">' + num + '</div><div class="pt-label">' + label + '</div></div>';
    }

    // 頂部摘要
    var head = document.createElement('div');
    head.className = 'pt-head';
    var b0 = document.createElement('b');
    b0.textContent = '🔥 每日練習連續完成 ' + dailyStreak(daily, today()) + ' 天';
    var gen = st.gen || {};
    var genToday = gen[today()];
    var rvAll = st.review || [];
    var rvToday = rvAll.filter(function (h) { return h.date === today(); });
    var dwellAll = st.dwell || {};
    var dwToday = dwellAll[today()];
    var s1 = document.createElement('span');
    s1.textContent = (todayRec && todayRec.done
      ? '✅ 今日已完成（第一次答對 ' + todayRec.firstOk + ' / ' + todayRec.total + '）'
      : '⬜ 今日每日練習還沒完成') +
      (genToday && genToday.n ? ' · 📖 今日自主練習 ' + genToday.n + ' 題' : '') +
      (rvToday.length ? ' · 📋 今日總結測驗 ' + rvToday.map(function (h) { return h.score + ' 分'; }).join('、') : '') +
      (dwToday && dwToday.n ? ' · 📖 解析平均停留 ' +
        (Math.round(dwToday.ms / dwToday.n / 100) / 10) + ' 秒／題' : '');
    var s2 = document.createElement('span');
    s2.textContent = '年級設定：' + gradesLabel(st.grades || []) +
      (ownerEmail ? ' · 檢視對象：' + ownerEmail : '');
    head.appendChild(b0); head.appendChild(s1); head.appendChild(s2);
    body.appendChild(head);

    // 三格數字
    var ok7 = 0, tot7 = 0, done7 = 0, gen7 = 0, rv7 = 0, dwN = 0, dwMs = 0, chkN = 0, chkOk = 0;
    var day7 = {};
    for (var i = 0; i < 7; i++) {
      var d7 = new Date(); d7.setDate(d7.getDate() - i);
      var k7 = fmtDate(d7);
      day7[k7] = true;
      var r7 = daily[k7];
      if (r7 && r7.done) { done7++; ok7 += r7.firstOk || 0; tot7 += r7.total || 0; }
      var g7 = gen[k7];
      if (g7 && g7.n) { gen7 += g7.n; ok7 += g7.ok || 0; tot7 += g7.n; }
      var w7 = dwellAll[k7];
      if (w7 && w7.n) { dwN += w7.n; dwMs += w7.ms || 0; }
      var c7 = (st.chk || {})[k7];
      if (c7 && c7.n) { chkN += c7.n; chkOk += c7.ok || 0; }
    }
    rvAll.forEach(function (h) {
      if (!day7[h.date]) return;
      rv7++; ok7 += h.ok || 0; tot7 += h.n || 0;
    });
    var wrongArr = st.wrong || [];
    var dueN = wrongArr.filter(function (w) { return (w.due || '') <= today(); }).length;
    var tiles = document.createElement('div');
    tiles.className = 'pt-tiles';
    tiles.innerHTML =
      tile(tot7 ? Math.round(100 * ok7 / tot7) + '%' : '—', '近7天首次答對率（每日＋自主＋總結測驗）') +
      tile(done7 + '/7' + (gen7 ? ' +📖' + gen7 : '') + (rv7 ? ' +📋' + rv7 : ''),
           '近7天每日練習完成' + (gen7 ? '＋自主練題數' : '') + (rv7 ? '＋總結測驗次數' : '')) +
      tile(dwN ? (Math.round(dwMs / dwN / 100) / 10) + 's' : '—', '近7天平均看解析秒數／題') +
      tile(chkN ? Math.round(100 * chkOk / chkN) + '%' : '—', '近7天解析確認題答對率（' + chkN + ' 題）') +
      tile(String(wrongArr.length), '錯題本累積（' + dueN + ' 題到期）');
    body.appendChild(tiles);

    // 近 14 天完成格（沿用進度頁的月曆，可點日期看細節）
    renderDailyCal(body, daily, gen, rvAll, dwellAll, st.chk || {});

    // 各類正確率（近 30 天，來自逐題作答紀錄）
    h3('📊 各類正確率（近 30 天）');
    var ans = st.answers || [];
    var byCat = {};
    ans.forEach(function (a) {
      if (!byCat[a.t]) byCat[a.t] = { n: 0, ok: 0 };
      byCat[a.t].n++;
      if (a.ok) byCat[a.t].ok++;
    });
    var catKeys = Object.keys(byCat).sort(function (a, b) { return byCat[b].n - byCat[a].n; });
    if (!catKeys.length) {
      hintEl('本次改版起才開始逐題記錄，做過練習後這裡會出現各類長條圖。');
    } else {
      catKeys.forEach(function (c) {
        var s = byCat[c];
        var pct = Math.round(100 * s.ok / s.n);
        var row = document.createElement('div');
        row.className = 'pt-cat';
        row.innerHTML = '<div class="pt-cat-top"><b></b><span>' + pct + '%（' + s.n + ' 題）</span></div>' +
          '<div class="drill-track"><div class="drill-bar" style="width:' + pct + '%"></div></div>';
        row.querySelector('b').textContent = CAT_NAME[c] || c;
        body.appendChild(row);
      });
    }

    // 一直記不住的題（錯 2 次以上，錯最多的排前面）
    h3('🔁 一直記不住的題');
    var hard = wrongArr.filter(function (w) { return (w.n || 0) >= 2; })
      .sort(function (a, b) { return (b.n - a.n) || ((b.lastWrong || 0) - (a.lastWrong || 0)); })
      .slice(0, 8);
    if (!hard.length) {
      hintEl('目前沒有反覆答錯的題目 🎉（同一題錯 2 次以上才會列在這裡）');
    } else {
      var chips = document.createElement('div');
      chips.className = 'pt-chips';
      hard.forEach(function (w) {
        var chip = document.createElement('span');
        chip.className = 'pt-chip';
        var bb = document.createElement('b');
        bb.textContent = labelOf(w.t, w.id);
        var sm = document.createElement('small');
        sm.textContent = '（' + (CAT_NAME[w.t] || w.t) + '，錯 ' + w.n + ' 次）';
        chip.appendChild(bb); chip.appendChild(sm);
        chips.appendChild(chip);
      });
      body.appendChild(chips);
    }

    // 最近錯題（近 14 天，含他選／正解）
    h3('❌ 最近錯題（14 天內）');
    var cut14 = Date.now() - 14 * 86400000;
    var mist = ans.filter(function (a) { return !a.ok && a.ts >= cut14 && a.q; })
      .sort(function (a, b) { return b.ts - a.ts; });
    if (!mist.length) {
      hintEl('最近 14 天沒有記錄到答錯的題目。（逐題紀錄自本次改版起累積）');
    } else {
      mist.slice(0, 12).forEach(function (a) {
        var div = document.createElement('div');
        div.className = 'pt-mist';
        var q = document.createElement('div');
        q.className = 'pt-mist-q';
        q.textContent = a.q;
        var ansRow = document.createElement('div');
        ansRow.className = 'pt-mist-a';
        var badB = document.createElement('b');
        badB.className = 'pt-bad';
        badB.textContent = '他選：' + (a.chosen || '—');
        var goodB = document.createElement('b');
        goodB.className = 'pt-good';
        goodB.textContent = '正解：' + (a.correct || '—');
        ansRow.appendChild(badB);
        ansRow.appendChild(document.createTextNode('　'));
        ansRow.appendChild(goodB);
        var meta = document.createElement('small');
        meta.textContent = (CAT_NAME[a.t] || a.t) + ' · ' + fmtTsTime(a.ts);
        div.appendChild(q); div.appendChild(ansRow); div.appendChild(meta);
        body.appendChild(div);
      });
      if (mist.length > 12) hintEl('僅顯示最近 12 筆（共 ' + mist.length + ' 筆）。');
    }

    // 總結測驗歷次成績
    renderReviewScores(body, st.review || []);
  }

  /* ---- 跨帳號檢視（email 綁定授權，後端 /api/grants + /api/progress?owner=）---- */

  function ptApi(method, path, body, cb) {
    var cs = window.CloudSync;
    if (!cs || !cs.signedIn()) { cb('auth'); return; }
    var xhr = new XMLHttpRequest();
    xhr.open(method, cs.apiBase + path);
    xhr.setRequestHeader('Authorization', 'Bearer ' + cs.token());
    if (body) xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      var data = null;
      try { data = JSON.parse(xhr.responseText); } catch (e) {}
      if (xhr.status < 200 || xhr.status >= 300) cb((data && data.error) || ('http ' + xhr.status));
      else cb(null, data);
    };
    xhr.onerror = function () { cb('network'); };
    xhr.send(body ? JSON.stringify(body) : null);
  }

  function ptLoadChild(email) {
    setStatusToast('載入 ' + email + ' 的進度…');
    ptApi('GET', '/api/progress?level=main&app=chinese&owner=' + encodeURIComponent(email), null, function (err, res) {
      if (err) { UIDialog.alert('讀不到對方進度：' + err); return; }
      var childState = null;
      try { childState = JSON.parse(((res && res.blob) || {})['chinese-review-v1'] || 'null'); } catch (e) {}
      if (!childState) { UIDialog.alert('這個帳號還沒有雲端進度資料（要先在孩子的裝置登入並練習過）。'); return; }
      showParent(childState, email);
    });
  }

  // 儀表板最上方的「檢視對象」列＋「授權家長/老師」管理（只在看自己時顯示授權管理）
  function renderParentCloud(body, ownerEmail) {
    var box = document.createElement('div');
    box.className = 'pt-cloud';
    body.appendChild(box);
    var cs = window.CloudSync;
    if (!cs || !cs.signedIn()) {
      box.innerHTML = '<small class="prog-hint">☁️ 右上角用 Google 登入後，可把進度授權給家長／老師的帳號：' +
        '對方用自己的手機登入，就能在這頁看到孩子的儀表板。</small>';
      return;
    }
    box.innerHTML = '<small class="prog-hint">☁️ 讀取授權資料…</small>';
    ptApi('GET', '/api/grants?app=chinese', null, function (err, res) {
      if (err) { box.innerHTML = '<small class="prog-hint">⚠️ 雲端連線失敗（' + err + '），僅顯示本機資料。</small>'; return; }
      box.innerHTML = '';
      var received = (res && res.received) || [];
      // 檢視對象切換列（自己 + 每個授權我看的孩子）
      if (received.length || ownerEmail) {
        var row = document.createElement('div');
        row.className = 'pt-viewrow';
        var lab = document.createElement('small');
        lab.textContent = '檢視對象：';
        row.appendChild(lab);
        var selfChip = document.createElement('button');
        selfChip.className = 'chip' + (ownerEmail ? '' : ' active');
        selfChip.textContent = '這台裝置（自己）';
        selfChip.addEventListener('click', function () { showParent(); });
        row.appendChild(selfChip);
        received.forEach(function (g) {
          var c = document.createElement('button');
          c.className = 'chip' + (ownerEmail === g.ownerEmail ? ' active' : '');
          c.textContent = '👧 ' + g.ownerEmail;
          c.addEventListener('click', function () { ptLoadChild(g.ownerEmail); });
          row.appendChild(c);
        });
        box.appendChild(row);
      }
      if (ownerEmail) return;   // 檢視他人時不顯示自己的授權管理
      // 授權管理（孩子端操作：把自己的進度開放給家長/老師 email）
      var mgr = document.createElement('div');
      mgr.className = 'pt-grant';
      var title = document.createElement('small');
      title.className = 'prog-hint';
      title.textContent = '🔗 授權家長／老師檢視這個帳號的進度（輸入對方 Google email）：';
      mgr.appendChild(title);
      var granted = (res && res.granted) || [];
      if (granted.length) {
        var glist = document.createElement('div');
        glist.className = 'pt-chips';
        granted.forEach(function (g) {
          var chip = document.createElement('span');
          chip.className = 'pt-chip';
          var bb = document.createElement('b');
          bb.textContent = g.viewer_email || g.viewerEmail || '';
          chip.appendChild(bb);
          var del = document.createElement('button');
          del.className = 'wb-del';
          del.textContent = '✕';
          del.title = '取消授權';
          del.addEventListener('click', function () {
            UIDialog.confirm('取消 ' + bb.textContent + ' 的檢視授權？', function () {
              ptApi('DELETE', '/api/grants?app=chinese&viewerEmail=' + encodeURIComponent(bb.textContent), null, function (derr) {
                if (derr) { UIDialog.alert('取消失敗：' + derr); return; }
                showParent();
              });
            });
          });
          chip.appendChild(del);
          glist.appendChild(chip);
        });
        mgr.appendChild(glist);
      }
      var form = document.createElement('div');
      form.className = 'pt-grant-form';
      var inp = document.createElement('input');
      inp.type = 'email';
      inp.placeholder = 'parent@gmail.com';
      inp.className = 'pt-email';
      var btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = '＋授權';
      btn.addEventListener('click', function () {
        var em = (inp.value || '').trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setStatusToast('請輸入正確的 email'); return; }
        btn.disabled = true;
        ptApi('POST', '/api/grants?app=chinese', { viewerEmail: em, role: 'viewer' }, function (aerr) {
          btn.disabled = false;
          if (aerr) { UIDialog.alert('授權失敗：' + aerr); return; }
          setStatusToast('✓ 已授權 ' + em);
          showParent();
        });
      });
      form.appendChild(inp);
      form.appendChild(btn);
      mgr.appendChild(form);
      box.appendChild(mgr);
    });
  }
  $('parentExit').addEventListener('click', showProgress);

  /* ---------- 自創題庫（分冊分課選範圍） ---------- */

  // 每個科目各記自己的選取（book/難易度/題型），切科目不會互相干擾
  var customSelAll = {};
  function curSel() {
    var k = bankCat();
    return (customSelAll[k] = customSelAll[k] || { book: null, diffs: [], qtypes: [] });
  }

  function customFilter(pool) {
    var sel = curSel();
    return pool.filter(function (it) {
      if (sel.diffs.length && sel.diffs.indexOf(it.diff || '中') < 0) return false;
      if (sel.qtypes.length && sel.qtypes.indexOf(it.qtype || '綜合') < 0) return false;
      return true;
    });
  }

  function toggleSel(arr, v) {
    var i = arr.indexOf(v);
    if (i >= 0) arr.splice(i, 1); else arr.push(v);
  }

  // 有哪幾科可以選（含還沒匯入的，Tony：「每科都要預留」），順序照科目卡
  function importSubjects() {
    var order = [];
    SUBJ_GROUPS.forEach(function (g) { g.keys.forEach(function (k) { order.push(k); }); });
    return order.map(function (k) {
      var s = SUBJECTS.find(function (x) { return x.key === k; });
      return s ? { key: k, name: s.name, icon: s.icon, n: (DATA[CUSTOM_CATS[k]] || []).length } : null;
    }).filter(Boolean);
  }
  // 匯入題庫入口（最外層）：先選科目，再選冊/課
  function showImport(key) {
    importMode = true;
    var list = importSubjects();
    if (key) state.importSubj = key;
    if (!state.importSubj || !list.some(function (x) { return x.key === state.importSubj; })) {
      var first = list.filter(function (x) { return x.n; })[0] || list[0];
      state.importSubj = first.key;
    }
    save();
    showCustom();
  }

  function showCustom() {
    var cat = bankCat();
    var bank = DATA[cat] || [];
    var sel = curSel();
    if (!bank.length) {
      if (!bankReady(cat)) { setStatusToast('📦 題庫還在背景載入中，請稍候幾秒再點一次'); return; }
      if (!importMode) {
        UIDialog.alert('這一科還沒有題目。請把 Word 題庫檔傳到 Telegram，轉檔後會自動分冊分課出現在這裡。');
        return;
      }
    }
    show('custom');
    $('customTitle').textContent = importMode ? '📦 匯入題庫' : '📂 ' + CAT_NAME[cat] + '・依課練習';
    // 科目列（只有匯入題庫模式才有；沒匯入的科目照樣列出來，點了說明怎麼給題）
    var srow = $('customSubjs');
    srow.innerHTML = '';
    srow.classList.toggle('hidden', !importMode);
    if (importMode) {
      importSubjects().forEach(function (x) {
        var b = document.createElement('button');
        b.className = 'chip' + (state.importSubj === x.key ? ' active' : '') + (x.n ? '' : ' chip-dim');
        b.textContent = x.icon + ' ' + x.name + (x.n ? '（' + x.n + '）' : '（未匯入）');
        b.addEventListener('click', function () { showImport(x.key); });
        srow.appendChild(b);
      });
    }
    if (!bank.length) {   // 匯入題庫模式：這一科還沒題，科目列留著讓他換一科
      ['customBooks', 'customDiffs', 'customTypes'].forEach(function (id) { $(id).innerHTML = ''; });
      $('customList').innerHTML = '<div class="empty">這一科還沒有匯入題本。<br>' +
        '<small>把題本（Word／PDF）傳到 Telegram，轉檔後會自動分冊分課出現在這裡。</small></div>';
      return;
    }
    var books = customBooks(bank);
    if (!sel.book || !books.some(function (b) { return b.book === sel.book; })) {
      sel.book = books[0].book;
    }
    var row = $('customBooks');
    row.innerHTML = '';
    books.forEach(function (b) {
      var btn = document.createElement('button');
      btn.className = 'chip' + (sel.book === b.book ? ' active' : '');
      btn.textContent = b.book;
      btn.addEventListener('click', function () { sel.book = b.book; showCustom(); });
      row.appendChild(btn);
    });
    // 難易度篩選（可複選；「全部難度」清空選取）
    var drow = $('customDiffs');
    drow.innerHTML = '';
    [[null, '全部難度'], ['易', '易'], ['中', '中'], ['難', '難']].forEach(function (o) {
      var b = document.createElement('button');
      b.className = 'chip' + ((o[0] === null ? !sel.diffs.length : sel.diffs.indexOf(o[0]) >= 0) ? ' active' : '');
      b.textContent = o[1];
      b.addEventListener('click', function () {
        if (o[0] === null) sel.diffs = [];
        else toggleSel(sel.diffs, o[0]);
        showCustom();
      });
      drow.appendChild(b);
    });
    // 題型篩選（可複選；只列該冊實際存在的題型）
    var trow = $('customTypes');
    trow.innerHTML = '';
    var typesHere = [];
    customPool(bank, sel.book, null).forEach(function (it) {
      var t = it.qtype || '綜合';
      if (typesHere.indexOf(t) < 0) typesHere.push(t);
    });
    sel.qtypes = sel.qtypes.filter(function (t) { return typesHere.indexOf(t) >= 0; });
    [[null, '全部題型']].concat(typesHere.map(function (t) { return [t, t]; })).forEach(function (o) {
      var b = document.createElement('button');
      b.className = 'chip' + ((o[0] === null ? !sel.qtypes.length : sel.qtypes.indexOf(o[0]) >= 0) ? ' active' : '');
      b.textContent = o[1];
      b.addEventListener('click', function () {
        if (o[0] === null) sel.qtypes = [];
        else toggleSel(sel.qtypes, o[0]);
        showCustom();
      });
      trow.appendChild(b);
    });
    var list = $('customList');
    list.innerHTML = '';
    state.drillPos = state.drillPos || {};
    var cur = books.find(function (b) { return b.book === sel.book; });
    var rows = cur.lessons.map(function (l) { return { label: l, lesson: l }; });
    rows.push({ label: '整冊全部', lesson: null });
    rows.forEach(function (r) {
      var p = customFilter(customPool(bank, cur.book, r.lesson));
      var key = customDrillKey(cur.book, r.lesson);
      var pos = Math.min(state.drillPos[key] || 0, p.length);
      var pct = p.length ? Math.round(100 * pos / p.length) : 0;
      var div = document.createElement('button');
      div.className = 'unit-item';
      div.innerHTML = '<b>' + r.label + '</b>' +
        '<small>' + pos + ' / ' + p.length + ' 題（' + pct + '%）' + (pos >= p.length && p.length ? ' · 已刷完一輪 🎉 可重頭再刷' : '') + '</small>' +
        '<div class="drill-track"><div class="drill-bar" style="width:' + pct + '%"></div></div>';
      div.addEventListener('click', function () {
        if (!p.length) { setStatusToast('這個範圍沒有符合篩選的題目'); return; }
        startDrill(cat, cur.book, r.lesson);
      });
      list.appendChild(div);
    });
  }
  $('customExit').addEventListener('click', function () {
    if (importMode) { importMode = false; show('subject'); return; }   // 匯入題庫是從科目頁進來的
    show('home');
  });

  function customDrillKey(book, lesson, catArg) {
    // 舊 key 'custom'（全庫）沿用；有選冊/課/難度/題型才加後綴（複選排序後串接）
    var sel = curSel();
    var d = sel.diffs.slice().sort().join(',');
    var t = sel.qtypes.slice().sort().join(',');
    return (catArg || bankCat()) + (book ? '|' + book : '') + (lesson ? '|' + lesson : '') +
      (d ? '|d:' + d : '') + (t ? '|t:' + t : '');
  }

  /* ---------- 依序刷題（含自創題庫，做到哪記到哪） ---------- */

  var DRILL_CHUNK = 20;

  // 題庫型科目（自創題庫、社會等）照冊/課/篩選走，國語各類別照年級走
  // 題庫型類別＝{q, options, answer, exp} 這種 schema（各科原創題庫與各科自創題庫都是）
  function isBankCat(cat) { return cat === 'custom' || /Custom$/.test(cat || '') || SUBJECT_CATS.indexOf(cat) >= 0; }
  function drillPool(cat, book, lesson) {
    var bank = DATA[cat] || [];
    if (cat && cat === mainCat()) bank = filterByGrades(bank, state.grades);  // 原創題庫照年級
    if (isBankCat(cat)) return customFilter(book ? customPool(bank, book, lesson) : bank);
    return filterByGrades(bank, state.grades);
  }
  function drillKey(cat, book, lesson) {
    if (cat && cat === mainCat()) return customDrillKey(book, lesson, cat) + '|g:' + state.grades.join(',');
    return isBankCat(cat) ? customDrillKey(book, lesson, cat) : cat + '|' + state.grades.join(',');
  }

  function showDrill() {
    show('drill');
    var list = $('drillList');
    list.innerHTML = '';
    var hint = document.createElement('div');
    hint.className = 'prog-hint';
    hint.textContent = isChinese()
      ? '照題庫順序一題不漏地刷（目前年級範圍：' + gradesLabel(state.grades) + '），一批 ' + DRILL_CHUNK + ' 題，進度自動記住。'
      : '照題庫順序一題不漏地刷（課綱自編題的年級範圍：' + gradesLabel(state.grades) +
        '），一批 ' + DRILL_CHUNK + ' 題，進度自動記住（家長匯入的題本要挑冊/課，請回科目頁用「匯入題庫」）。';
    list.appendChild(hint);
    // 科目裡只刷「依課綱自編」的原創題；家長匯入的題本一律走最外層的「匯入題庫」
    //（2026-08-20 Tony：自創題庫和我叫你自創的題目怕搞混）
    var cats = isChinese() ? ['idioms', 'slang', 'phonics', 'chars'] : [];
    if (!isChinese() && mainPool().length) cats.push(mainCat());
    state.drillPos = state.drillPos || {};
    cats.forEach(function (cat) {
      var pool = drillPool(cat);
      var pos = Math.min(state.drillPos[drillKey(cat)] || 0, pool.length);
      var pct = pool.length ? Math.round(100 * pos / pool.length) : 0;
      var div = document.createElement('button');
      div.className = 'unit-item';
      div.innerHTML = '<b>' + CAT_NAME[cat] + '</b>' +
        '<small>' + pos + ' / ' + pool.length + ' 題（' + pct + '%）' + (pos >= pool.length && pool.length ? ' · 已刷完，可重頭再刷' : '') + '</small>' +
        '<div class="drill-track"><div class="drill-bar" style="width:' + pct + '%"></div></div>';
      div.addEventListener('click', function () { startDrill(cat); });
      list.appendChild(div);
    });
  }
  $('drillExit').addEventListener('click', function () { show('home'); });

  function startDrill(cat, book, lesson) {
    var pool = drillPool(cat, book, lesson);
    if (!pool.length) { UIDialog.alert(isBankCat(cat) ? '這個範圍還沒有題目。請把 Word 題庫檔傳到 Telegram，轉檔後就會出現。' : '這個年級範圍沒有題目。'); return; }
    state.drillPos = state.drillPos || {};
    var key = drillKey(cat, book, lesson);
    var pos = state.drillPos[key] || 0;
    function go(p) {
      var entries = pool.slice(p, p + DRILL_CHUNK).map(function (it) { return { t: cat, id: it.id }; });
      beginQuiz(entries, 'drill', cat);
      quiz.drillKey = key;
      quiz.drillBase = p;
      quiz.drillTotal = pool.length;
      quiz.drillBook = book || null;
      quiz.drillLesson = lesson || null;
      var sel = curSel();
      quiz.drillDesc = isBankCat(cat)
        ? [book, lesson,
           sel.diffs.length ? '難度:' + sel.diffs.join('/') : '',
           sel.qtypes.length ? '題型:' + sel.qtypes.join('/') : ''].filter(Boolean).join(' ') || CAT_NAME[cat]
        : CAT_NAME[cat] + '（' + gradesLabel(state.grades) + '）';
    }
    if (pos >= pool.length) {
      UIDialog.confirm('這個範圍已經刷完一輪，要從第 1 題重新開始嗎？', function () {
        state.drillPos[key] = 0;
        save();
        go(0);
      });
      return;
    }
    go(pos);
  }

  /* ---------- 單元學習（先教後考，逐關解鎖） ---------- */

  var lessonState = null; // {grade, unitIdx, items, i}

  var UNIT_SIZES = {
    10: { idioms: 3, slang: 1, phonics: 3, chars: 3 },
    14: { idioms: 4, slang: 2, phonics: 4, chars: 4 },
    21: { idioms: 6, slang: 3, phonics: 6, chars: 6 }
  };
  function unitSize() { return state.unitSize || 14; }
  function unitKey(g, i) {
    var s = unitSize();
    // 原創題庫走課綱單元制（單元由 lesson 決定，與 unitSize 無關），key 不帶 s
    if (!isChinese()) return curSubj() + '-' + (state.unitBook || '') +
      (lessonUnits() ? '' : '-s' + s) + '-u' + i;
    return s === 14 ? 'g' + g + '-u' + i : 'g' + g + '-s' + s + '-u' + i;
  }
  // 目前這一科的單元學習是否走「課綱單元制」：有原創題庫時就是
  // （Tony 2026-08-20：單元學習＝教學後測驗，要照課本單元分細一點，一學期 3 次段考 × 3 單元）
  function lessonUnits() { return !isChinese() && mainPool().length > 0; }
  // 題庫型科目的單元：
  //   原創題庫 → 依 lesson（課綱單元）分組，出現順序即單元順序
  //   自創題庫（題本轉檔沒有課綱單元）→ 沿用「同一冊照 id 序每 size 題切一單元」
  function buildBankUnits(bank, book, size, byLesson) {
    var p = customPool(bank, book, null);
    var units = [];
    if (byLesson) {
      var seen = {};
      p.forEach(function (it) {
        var k = it.lesson || '未分單元';
        if (!seen[k]) { seen[k] = { name: k, items: [] }; units.push(seen[k]); }
        seen[k].items.push({ t: quizCatOf(it), id: it.id });
      });
      return units.map(function (u) { var a = u.items; a.name = u.name; return a; });
    }
    for (var i = 0; i < p.length; i += size) {
      units.push(p.slice(i, i + size).map(function (it) { return { t: quizCatOf(it), id: it.id }; }));
    }
    return units;
  }
  // 段考分組：每 EXAM_UNITS 個單元一次段考
  var EXAM_UNITS = 3;
  var EXAM_NAME = ['第一次段考', '第二次段考', '第三次段考', '第四次段考', '第五次段考'];

  function showUnits() {
    show('units');
    if (!state.unitGrade) state.unitGrade = state.grade || state.grades[state.grades.length - 1] || 5;
    var srow = $('unitSizeRow');
    srow.innerHTML = '';
    srow.classList.toggle('hidden', lessonUnits());   // 課綱單元制：單元由課本單元決定，不給改題數
    var unitWord = isChinese() ? ' 條' : ' 題';
    [[10, '小單元 10'], [14, '標準 14'], [21, '大單元 21']].forEach(function (opt) {
      opt = [opt[0], opt[1] + unitWord];
      var b = document.createElement('button');
      b.className = 'chip' + (unitSize() === opt[0] ? ' active' : '');
      b.textContent = opt[1];
      b.addEventListener('click', function () { state.unitSize = opt[0]; save(); showUnits(); });
      srow.appendChild(b);
    });
    var row = $('unitGradeRow');
    row.innerHTML = '';
    var cn = isChinese();
    var bank = cn ? null : (mainPool().length ? mainPool() : bankFallback());
    if (cn) {
      for (var g = 1; g <= 12; g++) {
        (function (g) {
          var b = document.createElement('button');
          b.className = 'chip' + (g === state.unitGrade ? ' active' : '');
          b.textContent = gradeLabel(g);
          b.addEventListener('click', function () { state.unitGrade = g; save(); showUnits(); });
          row.appendChild(b);
        })(g);
      }
    } else {
      // 非國語科目：單元照「冊」切（例：五上）
      var books = customBooks(bank);
      if (!books.some(function (b) { return b.book === state.unitBook; })) state.unitBook = books.length ? books[0].book : '';
      books.forEach(function (bk) {
        var b = document.createElement('button');
        b.className = 'chip' + (bk.book === state.unitBook ? ' active' : '');
        b.textContent = bk.book;
        b.addEventListener('click', function () { state.unitBook = bk.book; save(); showUnits(); });
        row.appendChild(b);
      });
    }
    var list = $('unitList');
    list.innerHTML = '';
    var byLesson = lessonUnits();
    var units = cn ? buildUnits(DATA, state.unitGrade, UNIT_SIZES[unitSize()])
                   : buildBankUnits(bank, state.unitBook, unitSize(), byLesson);
    if (!cn) $('unitsHint').textContent = byLesson
      ? '照課綱單元編排，每 ' + EXAM_UNITS + ' 個單元對應一次段考。先看重點卡，測驗全對才過關。'
      : '目前用匯入題庫的題目編單元（題本沒有課綱單元，照題號順序切）。';
    state.units = state.units || {};
    if (!units.length) { list.innerHTML = '<div class="empty">' + (cn ? '這個年級目前沒有教材。' : '這一冊目前沒有題目。') + '</div>'; return; }
    var lastExam = -1;
    units.forEach(function (u, i) {
      var done = !!state.units[unitKey(state.unitGrade, i)];
      var locked = i > 0 && !state.units[unitKey(state.unitGrade, i - 1)];
      // 課綱單元制：每 EXAM_UNITS 個單元插一條段考分隔（一學期三次段考）
      if (byLesson) {
        var ex = Math.floor(i / EXAM_UNITS);
        if (ex !== lastExam) {
          lastExam = ex;
          var doneN = 0;
          for (var k = ex * EXAM_UNITS; k < Math.min((ex + 1) * EXAM_UNITS, units.length); k++) {
            if (state.units[unitKey(state.unitGrade, k)]) doneN++;
          }
          var nUnits = Math.min((ex + 1) * EXAM_UNITS, units.length) - ex * EXAM_UNITS;
          var h = document.createElement('div');
          h.className = 'exam-head';
          h.textContent = '📝 ' + (EXAM_NAME[ex] || ('第 ' + (ex + 1) + ' 次段考')) +
            '　' + doneN + '/' + nUnits + ' 單元完成';
          list.appendChild(h);
        }
      }
      var lessons = [];
      if (!cn) u.forEach(function (e) {
        var it = findItem(e.t, e.id);
        var l = it && (it.lesson || it.tag);
        if (l && lessons.indexOf(l) < 0) lessons.push(l);
      });
      var title = byLesson && u.name ? u.name : '第 ' + (i + 1) + ' 單元';
      var div = document.createElement('button');
      div.className = 'unit-item' + (done ? ' done' : locked ? ' locked' : '');
      div.innerHTML = '<b>' + (done ? '✅' : locked ? '🔒' : '▶️') + ' ' + title + '</b>' +
        '<small>' + (cn ? u.length + ' 個詞條' : u.length + ' 題' + (byLesson ? '' : ' · ' + lessons.join('、'))) + ' · ' +
        (done ? '已完成，可重新練習' : locked ? '完成上一單元後解鎖' : cn ? '教學 → 測驗全對過關' : '看重點 → 測驗全對過關') + '</small>';
      if (!locked) div.addEventListener('click', function () { startLesson(state.unitGrade, i, u); });
      list.appendChild(div);
    });
  }
  $('unitsExit').addEventListener('click', function () { show('home'); });

  function startLesson(grade, unitIdx, items) {
    lessonState = { grade: grade, unitIdx: unitIdx, items: items, i: 0 };
    show('lesson');
    renderLessonCard();
  }

  function renderLessonCard() {
    var L = lessonState;
    var e = L.items[L.i];
    var it = findItem(e.t, e.id);
    $('lessonInfo').textContent = (isChinese() ? gradeLabel(L.grade) : (state.unitBook || CAT_NAME[bankCat()])) +
      ' · ' + (L.items.name || ('第' + (L.unitIdx + 1) + '單元')) + ' · ' + (L.i + 1) + '/' + L.items.length;
    $('lessonTag').textContent = '📖 教學 · ' + CAT_NAME[e.t];
    var body = $('lessonBody');
    body.innerHTML = '';
    if (!it) { body.textContent = '資料載入失敗'; return; }
    var z = state.phon === 'zhuyin';
    function line(cls, text) {
      var d = document.createElement('div');
      d.className = cls; d.textContent = text;
      body.appendChild(d);
    }
    if (e.t === 'idioms') {
      line('lesson-term', it.term);
      line('lesson-zy', z ? it.zhuyin : it.pinyin);
      line('lesson-meaning', '💡 ' + it.meaning);
      if (it.wordExp) line('lesson-meaning', '🔍 逐字解析：' + it.wordExp);
      line('lesson-example', '例：' + it.example);
      if (it.syn && it.syn.length) line('lesson-extra', '同義：' + it.syn.join('、'));
      if (it.misuse) line('lesson-extra', '⚠️ ' + it.misuse);
      maybeImg(body, 'idioms', it.id);
      maybeAnimBtn(body, it);
    } else if (e.t === 'slang') {
      line('lesson-term', it.term);
      line('lesson-extra', '（' + it.kind + '）');
      line('lesson-meaning', '💡 ' + it.meaning);
      line('lesson-example', '例：' + it.example);
    } else if (e.t === 'phonics') {
      line('lesson-term', it.word);
      line('lesson-zy', '「' + it.target + '」讀 ' + (z ? it.zhuyin : it.pinyin));
      if (it.note) line('lesson-meaning', '💡 ' + it.note);
    } else if (isBankCat(e.t)) {
      // 題庫型科目（社會等）：重點卡＝題目＋正解＋解析，看完再考同一批題
      $('lessonTag').textContent = '📖 重點 · ' + [it.book, it.lesson].filter(Boolean).join(' ');
      line('lesson-meaning', it.q);
      line('lesson-term', it.options[it.answer]);
      if (it.exp) line('lesson-extra', it.exp);
    } else {
      line('lesson-term', it.answer);
      line('lesson-zy', z ? it.zhuyin : it.pinyin);
      if (it.note) line('lesson-meaning', '💡 ' + it.note);
      line('lesson-example', '例：' + it.sentence.split('（　）').join(it.answer));
    }
    var dx = isBankCat(e.t) ? '' : deepExp(it);
    if (dx) line('lesson-extra', dx.replace(/^\n/, ''));
    $('lessonPrev').disabled = L.i === 0;
    $('lessonNext').textContent = L.i === L.items.length - 1 ? '開始單元測驗 ✍️' : '下一個 →';
  }

  $('lessonPrev').addEventListener('click', function () {
    if (lessonState.i > 0) { lessonState.i--; renderLessonCard(); }
  });
  $('lessonNext').addEventListener('click', function () {
    var L = lessonState;
    if (L.i < L.items.length - 1) { L.i++; renderLessonCard(); return; }
    var entries = shuffle(L.items.slice());
    beginQuiz(entries, 'unit', null);
    quiz.total = entries.length;
    quiz.unitKey = unitKey(L.grade, L.unitIdx);
  });
  $('lessonExit').addEventListener('click', function () { showUnits(); });

  function completeUnit() {
    state.units = state.units || {};
    state.units[quiz.unitKey] = { done: true, ts: Date.now() };
    save();
    document.querySelector('#view-quiz .quiz-card').classList.add('hidden');
    var r = $('quizResult');
    r.innerHTML = '🎉 單元完成！<br><b style="font-size:1.6rem">' + quiz.total + ' 題全部答對</b><br>' +
      (quiz.round > 1 ? '錯題重做 ' + (quiz.round - 1) + ' 輪後過關' : '一次全對，太強了！') +
      '<br>下一單元已解鎖<br><button class="btn-primary" id="quizAgain">回單元列表</button>';
    r.classList.remove('hidden');
    confetti();
    $('quizAgain').addEventListener('click', function () { showUnits(); });
  }

  /* ---------- 寫作素材（每日一句 + 仿寫） ---------- */

  function showWriting() {
    show('writing');
    var poolW = filterByGrades(DATA.writing, state.grades);
    if (!poolW.length) poolW = DATA.writing;
    if (!poolW.length) { UIDialog.alert('素材庫載入失敗'); return; }
    var it = seededPick(poolW, 1, rngFromString(today() + '|writing'))[0];
    $('wrTag').textContent = '今日素材 · ' + today();
    $('wrQuote').textContent = '「' + it.quote + '」';
    $('wrSrc').textContent = '—— ' + it.src;
    $('wrTip').textContent = '💡 怎麼用：' + it.tip;
    $('wrTip').className = 'q-feedback';
    $('wrPrompt').textContent = '✍️ 仿寫練習：' + it.prompt;
    state.writingLog = state.writingLog || {};
    var saved = state.writingLog[today()];
    $('wrInput').value = saved ? saved.text : '';
    renderWrHistory();
    $('wrSave').onclick = function () {
      var text = $('wrInput').value.trim();
      if (!text) { setStatusToast('先寫點內容再儲存'); return; }
      state.writingLog[today()] = { id: it.id, quote: it.quote, text: text, ts: Date.now() };
      save();
      setStatusToast('✓ 已儲存，家長檢視也看得到');
      renderWrHistory();
    };
  }

  function renderWrHistory() {
    var box = $('wrHistory');
    box.innerHTML = '';
    var log = state.writingLog || {};
    var dates = Object.keys(log).sort().reverse().slice(0, 7);
    if (!dates.length) return;
    var h = document.createElement('h3');
    h.className = 'prog-h3';
    h.textContent = '最近的仿寫';
    box.appendChild(h);
    dates.forEach(function (d) {
      var div = document.createElement('div');
      div.className = 'wrong-item';
      var meta = document.createElement('small');
      meta.textContent = d + ' · 「' + log[d].quote.slice(0, 14) + '…」';
      var body = document.createElement('div');
      body.textContent = log[d].text;
      div.appendChild(meta);
      div.appendChild(body);
      box.appendChild(div);
    });
  }

  $('writingExit').addEventListener('click', function () { show('home'); });

  /* ---------- 啟動 ---------- */
  // 自創題庫檔已達 20MB+，改為背景載入：頁面先開先用，載完自動補上並更新畫面
  //（2026-08-14 Tony 回報手機開站白屏——同步載入大檔在慢網路/低階機會卡死）
  DATA.custom = DATA.custom || [];
  W.__customReady = false;
  (function loadCustomBank() {
    var s = document.createElement('script');
    s.src = 'js/data/custom.js';
    s.async = true;
    s.onload = function () {
      W.__customReady = true;
      renderHome();
      var vs = $('view-subject');
      if (vs && !vs.classList.contains('hidden')) renderSubjects();   // 匯入題庫的題數要補上
      var vc = $('view-custom'), vd = $('view-drill');
      if (vc && !vc.classList.contains('hidden')) showCustom();
      else if (vd && !vd.classList.contains('hidden')) showDrill();
      setStatusToast('📦 匯入題庫載入完成（' + (DATA.custom || []).length + ' 題）');
    };
    s.onerror = function () { setStatusToast('⚠️ 題庫載入失敗，請重新整理頁面'); };
    document.body.appendChild(s);
  })();
  syncGrades();
  save();               // 把年級遷移的結果寫回去，免得每次開站都重算一次
  renderRangeBar();
  renderHome();
  // 第一次進站先問年級（只問這一次），之後每次進站都先選科目（2026-08-04 Tony：一致性）
  show(state.onboarded ? 'subject' : 'welcome');
})();
