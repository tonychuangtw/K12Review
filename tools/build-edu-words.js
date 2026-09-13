#!/usr/bin/env node
/* 康軒版「生字表・字音字形」單元式練習產生器（2026-09-12 Tony 交辦）
   讀 docs/source/kangxuan-5a-words.json（形近字組＋詞例＋教育部注音），
   產出 js/data/edu-kangxuan-chinese-5a.js 裡 series='words' 的單元。
   一課 5 個單元、一單元 20 題，含選擇題與手寫題。
   用法：node tools/build-edu-words.js [課號…] */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'docs/source/kangxuan-5a-words.json');
const OUT = path.join(ROOT, 'js/data/edu-kangxuan-chinese-5a.js');
const PER_UNIT = 20;
const UNITS = [
  { n: 1, title: '生字字音（一）讀音辨別' },
  { n: 2, title: '生字字形（二）形近字選字' },
  { n: 3, title: '生字字形（三）詞語選字' },
  { n: 4, title: '生字手寫（四）看注音寫國字' },
  { n: 5, title: '生字綜合（五）字音字形總複習' }
];
const pad = (n, w) => String(n).padStart(w, '0');
/* 取用順序：用「與總數互質的步長」跳著取，不是單純旋轉。
   配合題的選項是固定一整排，答案索引＝該項在排裡的位置；照順序出題答案會 0,1,2… 連號。
   ⚠️ 步長一定要跟總數互質，否則只會繞回同幾個位置：
      28 個字用步長 7 → 只取到 0,7,14,21 四個，其餘全是重複（2026-09-13 實際踩到）。 */
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
function pickOrder(n, shift) {
  let stride = 7;
  while (stride > 1 && gcd(stride, n) !== 1) stride--;      // 找得到就用，最差退回 1（＝單純旋轉）
  const out = Array.from({ length: n }, (_, k) => (k * stride + shift) % n);
  if (new Set(out).size !== n) throw new Error('pickOrder(' + n + ') 取出重複的順序');
  return out;
}
/* 把各種題型交錯排好，不要「第一種題型的全部、再第二種的全部」。
   以前是後者，而每種題型的候選數＝該課的字數／成語數（18-34 個），
   取前 20 題時第二、三種題型根本輪不到 —— 單元五號稱「綜合」卻整份都是同一種題型，
   生字單元五說會穿插手寫題也一題都沒有（2026-09-13 codex／gemini review 抓到）。 */
function interleave(lists) {
  const out = [], max = Math.max.apply(null, lists.map(l => l.length).concat([0]));
  for (let i = 0; i < max; i++) lists.forEach(l => { if (i < l.length) out.push(l[i]); });
  return out;
}

function main() {
  const src = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const only = process.argv.slice(2).map(Number).filter(Boolean);
  const lessons = Object.keys(src).map(Number).sort((a, b) => a - b)
    .filter(n => !only.length || only.indexOf(n) >= 0);
  let out = [];
  lessons.forEach(n => { out = out.concat(buildLesson(n, src[String(n)])); });

  let keep = [];
  if (fs.existsSync(OUT)) {
    const W = { APP_EDU: [] };
    (new Function('window', fs.readFileSync(OUT, 'utf8')))(W);
    keep = W.APP_EDU.filter(u => !(u.series === 'words' && lessons.indexOf(u.lesson) >= 0));
  }
  const SER = { words: 0, idiom: 1, quiz: 2 };
  const all = keep.concat(out).sort((a, b) =>
    (SER[a.series] - SER[b.series]) || a.lesson - b.lesson || a.unit - b.unit);
  const nQ = all.reduce((s, u) => s + u.qs.length, 0);
  const head = '// 康軒版・國語五上（2026-09-12 Tony 交辦）逐課單元式練習：一課 5 單元、一單元 20 題。\n' +
    '// ⚠️ 這支檔案由 tools/build-edu-*.js 產出，不要手改；\n' +
    '//    要改內容請改 docs/source/kangxuan-5a-*.json 再重跑產生器。\n' +
    '// 規格見 docs/kangxuan-edition-spec.md。目前 ' + all.length + ' 單元、' + nQ + ' 題。\n' +
    'window.APP_EDU = window.APP_EDU || [];\nwindow.APP_EDU.push(\n';
  fs.writeFileSync(OUT, head + all.map(u => JSON.stringify(u)).join(',\n') + '\n);\n');
  console.log('寫出', path.relative(ROOT, OUT), '：', all.length, '單元、', nQ, '題（本次重建 words 第', lessons.join('、'), '課）');
}

function buildLesson(lessonNo, rec) {
  const groups = rec.groups;
  const flat = [];                                  // 每個字 + 它所屬的那一組（形近字互為誘答）
  groups.forEach((g, gi) => g.forEach((it, ii) => flat.push(Object.assign({ gi, ii, sibs: g }, it))));
  const N = flat.length;
  let seq = 0;
  const nextPos = () => (seq++) % 4;
  const book = '五上', lesson = '第' + lessonNo + '課';

  /* 誘答：同組的形近字優先（那才是真的會混淆的），不夠再從同課其他組補。
     ⚠️ key 指的是這一題的選項是拿哪個欄位當文字：
        字形題用 'c'（字），字音題用 'zy'（注音）。
        同一組的形近字常常同音（蚊／紋 都讀 ㄨㄣˊ），
        所以字音題一定要「用注音去比對重複」，不能只看字不一樣就當成不同選項。 */
  function distract(it, k, need, key) {
    const out = [], seen = new Set([it[key]]);
    const push = (cand) => {
      if (!cand || cand.c === it.c || seen.has(cand[key])) return;
      seen.add(cand[key]); out.push(cand);
    };
    const sib = it.sibs.filter(x => x.c !== it.c);
    for (let i = 0; i < sib.length && out.length < need; i++) push(sib[(i + k) % sib.length]);
    /* 字音題：同組形近字常常同音（蚊／紋都讀 ㄨㄣˊ），這時誘答補不滿。
       補的時候要挑「聽起來會混淆」的音 —— 同音不同調、或聲母韻母只差一點 ——
       而不是隨便抓本課另一個字的音。以前隨便抓，出來的四個選項差太遠，
       學生用消去法就猜得到（2026-09-13 codex／gemini review 抓到）。 */
    if (key === 'zy' && out.length < need) {
      const bare = (z) => String(z).replace(/[ˊˇˋ˙]/g, '');
      const mine = bare(it.zy);
      const near = flat.filter(x => x.c !== it.c && bare(x.zy) === mine)          // 同音不同調
        .concat(flat.filter(x => x.c !== it.c && bare(x.zy)[0] === mine[0]));      // 聲母相同
      for (let i = 0; out.length < need && i < near.length; i++) push(near[(i + k) % near.length]);
    }
    const base = flat.indexOf(it);
    for (let i = 0; out.length < need && i < N * 2; i++) push(flat[(base + i * 3 + k + 1) % N]);
    return out.slice(0, need);
  }
  // 誘答是不是真的來自同一組形近字：解析要照實說，不能一律寫「同組形近字」
  const sameGroup = (it, w) => w.every(x => it.sibs.indexOf(x) >= 0);
  const srcLabel = (it, w) => sameGroup(it, w) ? '同組形近字' : '本課其他生字';
  /* 這個字值不值得出「讀哪一個音」：同一組形近字如果全部同音（蚊／紋都讀 ㄨㄣˊ），
     這題就沒有鑑別度 —— 誘答只能從別組硬抓，四個音差很遠，學生不必懂就猜得到。
     這種字改考字形（蚊和紋同音，本來就是要靠部首分辨），字音題直接跳過。 */
  const worthZyQ = (it) => it.sibs.some(x => x.c !== it.c && x.zy !== it.zy);
  function place(correct, wrong, pos, key) {
    const arr = wrong.map(x => x[key]);
    arr.splice(pos, 0, correct[key]);
    return { options: arr, answer: pos };
  }
  const mkId = (u, k) => 'kx5a-w' + pad(lessonNo, 2) + 'u' + u + 'q' + pad(k + 1, 2);

  const V = {
    1: [
      (it, k) => { if (!worthZyQ(it)) return null;
        const p = nextPos(), w = distract(it, k, 3, 'zy');
        const f = place(it, w, p, 'zy');
        return { qtype: '字音', q: '「' + it.w[0] + '」的「' + it.c + '」要讀哪一個音？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.c + '讀「' + it.zy + '」（' + it.py + '），例如：' + it.w.join('、') + '。\n' +
            '📚 其他選項是' + srcLabel(it, w) + '的讀音：' + w.map(x => x.c + '＝' + x.zy).join('；') + '。' }; },
      (it, k) => { const p = nextPos(), w = distract(it, k + 1, 3, 'c');
        const f = place(it, w, p, 'c');
        return { qtype: '字音', q: '讀「' + it.zy + '」（' + it.py + '），而且可以組成「' + it.w[0] + '」的是哪一個字？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.c + '（' + it.zy + '）＝' + it.w.join('、') + '。\n' +
            '📚 其他選項：' + w.map(x => x.c + '（' + x.zy + '）＝' + x.w.join('、')).join('；') + '。' }; },
      (it, k) => { if (!worthZyQ(it)) return null;
        const p = nextPos(), w = distract(it, k + 2, 3, 'zy');
        const f = place(it, w, p, 'zy');
        const word = it.w[it.w.length - 1];
        return { qtype: '字音', q: '「' + word + '」的「' + it.c + '」要讀哪一個音？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.c + '讀「' + it.zy + '」（' + it.py + '），例如：' + it.w.join('、') + '。\n' +
            '📚 其他選項是' + srcLabel(it, w) + '的讀音：' + w.map(x => x.c + '＝' + x.zy).join('；') + '。' }; }
    ],
    2: [
      (it, k) => blankWord(it, k, 0),
      (it, k) => blankWord(it, k, it.w.length - 1),
      (it, k) => { const p = nextPos(), w = distract(it, k + 3, 3, 'c');
        const f = place(it, w, p, 'c');
        return { qtype: '字形', q: '下列哪一個字可以同時組成「' + it.w.join('」和「') + '」？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.c + '（' + it.zy + '）＝' + it.w.join('、') + '。\n' +
            '📚 其他選項：' + w.map(x => x.c + '（' + x.zy + '）＝' + x.w.join('、')).join('；') + '。' }; }
    ],
    3: [
      (it, k) => blankWord(it, k + 1, it.w.length - 1),
      (it, k) => blankWord(it, k + 2, 0),
      (it, k) => { const p = nextPos(), w = distract(it, k + 4, 3, 'c');
        const f = place(it, w, p, 'c');
        return { qtype: '字形', q: '「' + it.w[0].replace(it.c, '□') + '」的□要填哪一個字？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.w[0] + '的「' + it.c + '」讀 ' + it.zy + '。\n' +
            '📚 其他選項：' + w.map(x => x.c + '＝' + x.w.join('、')).join('；') + '。' }; }
    ],
    4: [
      (it, k) => writeQ(it, k),
      (it, k) => writeQ(it, k + 1, true),
      (it, k) => writeQ(it, k + 2)
    ],
    5: [
      (it, k) => blankWord(it, k + 5, 0),
      (it, k) => writeQ(it, k + 3),
      (it, k) => { if (!worthZyQ(it)) return null;
        const p = nextPos(), w = distract(it, k + 6, 3, 'zy');
        const f = place(it, w, p, 'zy');
        return { qtype: '字音', q: '「' + it.c + '」這個字要讀哪一個音？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.c + '讀「' + it.zy + '」（' + it.py + '），例如：' + it.w.join('、') + '。\n' +
            '📚 其他選項是' + srcLabel(it, w) + '的讀音：' + w.map(x => x.c + '＝' + x.zy).join('；') + '。' }; }
    ]
  };
  function blankWord(it, k, wi) {
    const p = nextPos(), w = distract(it, k, 3, 'c');
    const f = place(it, w, p, 'c');
    const word = it.w[Math.min(wi, it.w.length - 1)];
    return { qtype: '字形', q: '「' + word.replace(it.c, '□') + '」的□應該填入哪一個字？',
      options: f.options, answer: f.answer,
      exp: '✅ ' + word + '的「' + it.c + '」讀 ' + it.zy + '（' + it.py + '），其他詞例：' + it.w.join('、') + '。\n' +
        '📚 其他選項是形近字：' + w.map(x => x.c + '（' + x.zy + '）＝' + x.w.join('、')).join('；') + '。' };
  }
  function writeQ(it, k, useLast) {
    const p = nextPos(), w = distract(it, k, 3, 'c');
    const f = place(it, w, p, 'c');
    const word = useLast ? it.w[it.w.length - 1] : it.w[0];
    return { t: 'write', qtype: '手寫', ch: it.c, zhuyin: it.zy, pinyin: it.py,
      hint: word, options: f.options, ai: f.answer, answer: f.answer,
      q: '讀「' + it.zy + '」，用在「' + word + '」——請手寫這個字',
      exp: '✅ 正確答案是「' + it.c + '」，讀 ' + it.zy + '（' + it.py + '），詞例：' + it.w.join('、') + '。\n' +
        '📚 容易混淆的形近字：' + w.map(x => x.c + '（' + x.zy + '）＝' + x.w.join('、')).join('；') + '。' };
  }

  const BRIEF = {
    1: () => ({ intro: '這一課的生字裡，有 ' + groups.length + ' 組長得像、或是讀音容易混淆的字。先把每一組的讀音和詞例看過一遍，再開始作答。',
      rows: groups.map((g, i) => ({ t: '第' + (i + 1) + '組　' + g.map(x => x.c).join('／'),
        d: g.map(x => x.c + '（' + x.zy + '）' + x.w.join('、')).join('　') })),
      tip: '同一組的字常常只差一個部首，讀音卻不一定一樣——先記住哪個部首配哪個意思，就不容易選錯。' }),
    2: () => ({ intro: '這一單元考字形：一個詞挖掉一個字，從幾個長得很像的字裡挑出正確的那一個。',
      rows: groups.map((g, i) => ({ t: '第' + (i + 1) + '組　' + g.map(x => x.c).join('／'),
        d: g.map(x => x.c + '：' + x.w.join('、')).join('　') })),
      tip: '拿不定主意時，先想這個詞跟什麼有關：跟水有關多半是「氵」，跟手的動作有關多半是「扌」。' }),
    3: () => ({ intro: '再練一次選字，換一批詞語。這一次多半是每一組的第二、第三個詞。',
      rows: groups.map((g, i) => ({ t: '第' + (i + 1) + '組　' + g.map(x => x.c).join('／'),
        d: g.map(x => x.c + '：' + x.w.join('、')).join('　') })),
      tip: '同一個字會出現在好幾個詞裡，把詞一起記比單記一個字有用。' }),
    4: () => ({ intro: '這一單元全部是手寫：看注音和詞語，在格子裡一筆一畫把字寫出來。寫錯了會先播放正確筆順，再讓你重寫到對為止。',
      rows: flat.slice(0, 24).map(x => ({ t: x.c + '（' + x.zy + '）', d: x.w.join('、') })),
      tip: '寫之前先在心裡想一下部首：部首對了，整個字就不會差太多。' }),
    5: () => ({ intro: '最後把字音和字形合起來複習，中間也會穿插手寫題。',
      rows: groups.map((g, i) => ({ t: '第' + (i + 1) + '組　' + g.map(x => x.c).join('／'),
        d: g.map(x => x.c + '（' + x.zy + '）' + x.w.join('、')).join('　') })),
      tip: '這一課的字如果還有哪幾個常錯，做完可以到康軒版的錯題本再練一次。' })
  };

  const usedKeys = new Set();          // 整課共用，避免不同單元出到一模一樣的題目
  return UNITS.map(U => {
    const order = pickOrder(N, (U.n - 1) * 2);
    const cands = interleave(V[U.n].map((mk, vi) => order.map(i => () => mk(flat[i], vi))));
    // 逐個取用，跳過跟本課已出過的題目一模一樣的（有的字只有一個詞例，
    // 兩種變化題型會撞在一起）。候選有 3×N 個（N≥18），湊 20 題綽綽有餘。
    const qs = [];
    for (let i = 0; i < cands.length && qs.length < PER_UNIT; i++) {
      const q = cands[i]();
      if (!q) continue;                       // 題型自己判斷這個字不適合出這種題
      const key = String(q.q).replace(/\s+/g, '') + '||' + (q.options || []).join('|') + '||' + q.answer;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key);
      q.id = mkId(U.n, qs.length);
      if (!q.t) q.t = 'choice';
      q.book = book; q.lesson = lesson; q.tag = rec.name; q.diff = '中';
      qs.push(q);
    }
    if (qs.length !== PER_UNIT) {
      throw new Error('第' + lessonNo + '課 單元' + U.n + ' 只湊出 ' + qs.length + ' 題（候選 ' + cands.length + '）');
    }
    return {
      id: 'kx-c5a-words-' + pad(lessonNo, 2) + '-' + U.n,
      edition: 'kangxuan', subject: 'chinese', book: book, series: 'words',
      lesson: lessonNo, lessonName: rec.name, unit: U.n, title: UNITS[U.n - 1].title,
      brief: BRIEF[U.n](), qs: qs
    };
  });
}
main();
