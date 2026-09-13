#!/usr/bin/env node
/* 康軒版「挑戰小學堂」單元式練習產生器（2026-09-12 Tony 交辦：只要選擇題）。
   挑戰小學堂本來就是每一課的綜合複習卷，所以這裡的題目也是綜合的：
   錯別字、字音、字形、詞語與成語，最後一個單元是模擬卷。

   素材：
     docs/source/kangxuan-5a-words.json        形近字組＋詞例＋教育部注音
     docs/source/kangxuan-5a-idiom-atoms.json  本課成語
     docs/source/kangxuan-5a-quiz-raw.json     原卷「改錯別字」抓出來的字組（字典驗證過）
     docs/source/kangxuan-5a-quiz-words.json   原卷考過的詞語（字典驗證過）

   ⚠️ 錯別字題的「錯詞」不是自己編的：把詞裡的字換成同組形近字之後，
      一定要《國語辭典簡編本》查不到才算數（查得到就表示那也是個真詞，不能當錯字）。
   用法：node tools/build-edu-quiz.js [課號…] */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'js/data/edu-kangxuan-chinese-5a.js');
const PER_UNIT = 20;
const WORDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/source/kangxuan-5a-words.json'), 'utf8'));
const IDIOM = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/source/kangxuan-5a-idiom-atoms.json'), 'utf8'));
const ERRS = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/source/kangxuan-5a-quiz-raw.json'), 'utf8'));
const QWORDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/source/kangxuan-5a-quiz-words.json'), 'utf8'));
const { idx } = JSON.parse(fs.readFileSync(path.join(ROOT, '.cache', 'moe-concised.json'), 'utf8'));
const inDict = (w) => !!idx[w];
const radOf = (c) => (idx[c] && idx[c].rad) || '';
/* 兩個形近字的差別怎麼講：同音就靠部首分辨，不同音就把兩個音都列出來。
   以前一律寫「（紋讀 ㄨㄣˊ／蚊讀 ㄨㄣˊ）」，同音時等於沒解釋。 */
function tellApart(wrongC, wrongZy, rightC, rightZy) {
  const rw = radOf(wrongC), rr = radOf(rightC);
  if (wrongZy === rightZy) {
    return '這兩個字同音（都讀 ' + rightZy + '），要靠部首分辨：' +
      (rw && rr ? wrongC + '是「' + rw + '」部、' + rightC + '是「' + rr + '」部。'
                : '寫的時候要看清楚偏旁。');
  }
  return wrongC + '讀 ' + wrongZy + '、' + rightC + '讀 ' + rightZy +
    (rw && rr ? '，部首也不一樣（' + wrongC + '是「' + rw + '」部、' + rightC + '是「' + rr + '」部）。' : '。');
}

const UNITS = [
  { n: 1, title: '挑戰小學堂（一）錯別字大挑戰' },
  { n: 2, title: '挑戰小學堂（二）字音大挑戰' },
  { n: 3, title: '挑戰小學堂（三）字形大挑戰' },
  { n: 4, title: '挑戰小學堂（四）詞語與成語' },
  { n: 5, title: '挑戰小學堂（五）綜合模擬卷' }
];
const pad = (n, w) => String(n).padStart(w, '0');
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
function pickOrder(n, shift) {
  let stride = 7;
  while (stride > 1 && gcd(stride, n) !== 1) stride--;
  const out = Array.from({ length: n }, (_, k) => (k * stride + shift) % n);
  if (new Set(out).size !== n) throw new Error('pickOrder(' + n + ') 重複');
  return out;
}

function main() {
  const only = process.argv.slice(2).map(Number).filter(Boolean);
  const lessons = Object.keys(WORDS).map(Number).sort((a, b) => a - b)
    .filter(n => !only.length || only.indexOf(n) >= 0);
  let out = [];
  lessons.forEach(n => { out = out.concat(buildLesson(n)); });
  let keep = [];
  if (fs.existsSync(OUT)) {
    const W = { APP_EDU: [] };
    (new Function('window', fs.readFileSync(OUT, 'utf8')))(W);
    keep = W.APP_EDU.filter(u => !(u.series === 'quiz' && lessons.indexOf(u.lesson) >= 0));
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
  console.log('寫出', path.relative(ROOT, OUT), '：', all.length, '單元、', nQ, '題（本次重建 quiz 第', lessons.join('、'), '課）');
}

function buildLesson(ln) {
  const rec = WORDS[String(ln)];
  const groups = rec.groups;
  const flat = [];
  groups.forEach((g, gi) => g.forEach((it) => flat.push(Object.assign({ gi, sibs: g }, it))));
  const N = flat.length;
  const idioms = (IDIOM[String(ln)] || { items: [] }).items;
  const qwords = (QWORDS[String(ln)] || []).filter(w => w.length >= 2);
  const errs = ((ERRS[String(ln)] || {}).items || []);
  let seq = 0;
  const nextPos = () => (seq++) % 4;
  const usedKeys = new Set();

  /* 把詞裡的字換成同組形近字，造出「看起來很像但字典查不到」的錯詞 */
  function corrupt(it) {
    for (const sib of it.sibs) {
      if (sib.c === it.c) continue;
      for (const w of it.w) {
        const bad = w.replace(it.c, sib.c);
        if (bad !== w && !inDict(bad)) return { bad, good: w, wrongChar: sib.c, rightChar: it.c, sib };
      }
    }
    return null;
  }
  const corrupted = flat.map(corrupt).filter(Boolean);
  // 正確詞（拿來當「沒有錯字」的選項）
  const goodWords = [];
  flat.forEach(it => it.w.forEach(w => { if (inDict(w) && goodWords.indexOf(w) < 0) goodWords.push(w); }));
  // 同組裡讀音不一樣的字：拿來出「哪一個讀音跟其他三個不同」
  const oddSets = [];
  groups.forEach((g) => {
    const by = {};
    g.forEach(x => (by[x.zy] = by[x.zy] || []).push(x));
    const keys = Object.keys(by);
    keys.forEach((k) => {
      if (by[k].length !== 1) return;
      const rest = [].concat.apply([], keys.filter(x => x !== k).map(x => by[x]));
      if (rest.length >= 3 && new Set(rest.map(x => x.zy)).size === 1) oddSets.push({ odd: by[k][0], same: rest });
    });
  });

  function pickN(arr, k, n, exclude) {
    const out = [];
    for (let i = 0; out.length < n && i < arr.length * 3; i++) {
      const v = arr[(i * 3 + k) % arr.length];
      if (v === undefined) continue;
      const key = typeof v === 'string' ? v : v.c;
      if ((exclude || []).indexOf(key) >= 0 || out.some(x => (typeof x === 'string' ? x : x.c) === key)) continue;
      out.push(v);
    }
    return out;
  }

  const V = {
    1: [
      // 哪一個詞語有錯字
      (i, k) => { const c = corrupted[i % corrupted.length]; if (!c) return null;
        const p = nextPos();
        const good = pickN(goodWords.filter(w => w !== c.good), k, 3, []);
        if (good.length < 3) return null;
        const o = good.slice(); o.splice(p, 0, c.bad);
        return { qtype: '字形', q: '下列哪一個詞語裡有錯字？', options: o, answer: p,
          exp: '✅ 「' + c.bad + '」的「' + c.wrongChar + '」寫錯了，應該是「' + c.good + '」的「' + c.rightChar + '」。\n' +
            '📚 ' + tellApart(c.wrongChar, c.sib.zy, c.rightChar, (flat.find(x => x.c === c.rightChar) || {}).zy) +
            '　其他三個詞語都沒有錯字。' }; },
      // 改正：這個詞正確的寫法是
      (i, k) => { const c = corrupted[(i + 1) % corrupted.length]; if (!c) return null;
        const p = nextPos();
        const wrong = pickN(flat.filter(x => x.c !== c.rightChar), k, 3, []);
        if (wrong.length < 3) return null;
        const o = wrong.map(x => x.c); o.splice(p, 0, c.rightChar);
        return { qtype: '字形', q: '「' + c.bad + '」寫錯了一個字，正確的應該是哪一個字？',
          options: o, answer: p,
          exp: '✅ 正確的寫法是「' + c.good + '」，用的是「' + c.rightChar + '」。\n' +
            '📚 其他選項：' + wrong.map(x => x.c + '（' + x.zy + '）＝' + x.w.join('、')).join('；') + '。' }; },
      // 哪一個詞語完全正確
      (i, k) => { const c = corrupted[(i + 2) % corrupted.length]; if (!c) return null;
        const p = nextPos();
        const others = corrupted.filter(x => x !== c);
        const bads = pickN(others.map(x => x.bad), k, 3, []);
        if (bads.length < 3) return null;
        const o = bads.slice(); o.splice(p, 0, c.good);
        return { qtype: '字形', q: '下列哪一個詞語完全沒有錯字？', options: o, answer: p,
          exp: '✅ 「' + c.good + '」是正確的寫法。\n📚 其他三個都有錯字：' +
            others.filter(x => bads.indexOf(x.bad) >= 0)
              .map(x => x.bad + '→' + x.good).join('、') + '。' }; }
    ],
    2: [
      (i, k) => { const s = oddSets[i % (oddSets.length || 1)]; if (!s) return null;
        const p = nextPos();
        const same = pickN(s.same, k, 3, []);
        if (same.length < 3) return null;
        const o = same.map(x => x.c); o.splice(p, 0, s.odd.c);
        return { qtype: '字音', q: '下列四個字，哪一個的讀音跟其他三個不一樣？', options: o, answer: p,
          exp: '✅ ' + s.odd.c + '讀「' + s.odd.zy + '」，其他三個都讀「' + same[0].zy + '」（' +
            same.map(x => x.c).join('、') + '）。' }; },
      (i, k) => { const it = flat[i]; const p = nextPos();
        const w = pickN(flat.filter(x => x.zy !== it.zy), k, 3, [it.c]);
        if (w.length < 3) return null;
        const o = w.map(x => x.zy); o.splice(p, 0, it.zy);
        return { qtype: '字音', q: '「' + it.w[0] + '」的「' + it.c + '」，讀音是下列哪一個？',
          options: o, answer: p,
          exp: '✅ ' + it.c + '讀「' + it.zy + '」（' + it.py + '）。\n📚 其他選項分別是：' +
            w.map(x => x.c + '＝' + x.zy).join('；') + '。' }; },
      (i, k) => { const it = flat[i]; const p = nextPos();
        const w = pickN(flat.filter(x => x.c !== it.c), k, 3, []);
        if (w.length < 3) return null;
        const o = w.map(x => x.c); o.splice(p, 0, it.c);
        return { qtype: '字音', q: '下列哪一個字讀「' + it.zy + '」（' + it.py + '）？',
          options: o, answer: p,
          exp: '✅ ' + it.c + '讀 ' + it.zy + '，詞例：' + it.w.join('、') + '。\n📚 其他選項：' +
            w.map(x => x.c + '讀 ' + x.zy).join('；') + '。' }; }
    ],
    3: [
      (i, k) => { const it = flat[i]; const p = nextPos();
        const w = pickN(it.sibs.filter(x => x.c !== it.c).concat(flat.filter(x => x.c !== it.c)), k, 3, [it.c]);
        if (w.length < 3) return null;
        const o = w.map(x => x.c); o.splice(p, 0, it.c);
        return { qtype: '字形', q: '「' + it.w[0].replace(it.c, '□') + '」的□要填哪一個字？',
          options: o, answer: p,
          exp: '✅ ' + it.w[0] + '（' + it.c + '讀 ' + it.zy + '）。\n📚 其他選項：' +
            w.map(x => x.c + '（' + x.zy + '）＝' + x.w.join('、')).join('；') + '。' }; },
      (i, k) => { const it = flat[i]; const p = nextPos();
        if (it.w.length < 2) return null;
        const w = pickN(it.sibs.filter(x => x.c !== it.c).concat(flat.filter(x => x.c !== it.c)), k + 1, 3, [it.c]);
        if (w.length < 3) return null;
        const o = w.map(x => x.c); o.splice(p, 0, it.c);
        return { qtype: '字形', q: '「' + it.w[1].replace(it.c, '□') + '」的□要填哪一個字？',
          options: o, answer: p,
          exp: '✅ ' + it.w[1] + '（' + it.c + '讀 ' + it.zy + '）。\n📚 其他選項：' +
            w.map(x => x.c + '（' + x.zy + '）＝' + x.w.join('、')).join('；') + '。' }; },
      (i, k) => { const it = flat[i]; const p = nextPos();
        const w = pickN(flat.filter(x => x.c !== it.c), k + 2, 3, []);
        if (w.length < 3 || it.w.length < 2) return null;
        const o = w.map(x => x.c); o.splice(p, 0, it.c);
        return { qtype: '字形', q: '哪一個字可以同時填進「' + it.w[0].replace(it.c, '□') + '」和「' +
            it.w[1].replace(it.c, '□') + '」？', options: o, answer: p,
          exp: '✅ ' + it.c + '（' + it.zy + '）＝' + it.w.join('、') + '。\n📚 其他選項：' +
            w.map(x => x.c + '＝' + x.w.join('、')).join('；') + '。' }; }
    ],
    4: [
      (i, k) => { const it = idioms[i % (idioms.length || 1)]; if (!it) return null;
        const p = nextPos();
        const w = pickN(idioms.filter(x => x.w !== it.w).map(x => ({ c: x.w, ms: x.ms })), k, 3, []);
        if (w.length < 3) return null;
        const o = w.map(x => x.c); o.splice(p, 0, it.w);
        return { qtype: '成語', q: '「' + it.s.replace(/□+/g, '（　　　）') + '。」括號裡要填哪一個成語？',
          options: o, answer: p,
          exp: '✅ ' + it.w + '＝' + it.m + '。\n📚 其他選項：' + w.map(x => x.c + '＝' + x.ms).join('；') + '。' }; },
      (i, k) => { const word = qwords[i % (qwords.length || 1)]; if (!word) return null;
        const p = nextPos();
        const w = pickN(qwords.filter(x => x !== word), k, 3, []);
        if (w.length < 3) return null;
        const rd = (idx[word] && idx[word].main[0]) || '';
        if (!rd) return null;
        const o = w.map(x => (idx[x] && idx[x].main[0]) || '').filter(Boolean);
        if (o.length < 3) return null;
        o.splice(p, 0, rd);
        if (new Set(o).size !== o.length) return null;
        return { qtype: '字音', q: '「' + word + '」的注音是下列哪一個？', options: o, answer: p,
          exp: '✅ ' + word + '＝' + rd + '。\n📚 其他選項分別是：' +
            w.map(x => x + '＝' + ((idx[x] && idx[x].main[0]) || '')).join('；') + '。' }; },
      (i, k) => { const it = idioms[(i + 1) % (idioms.length || 1)]; if (!it) return null;
        const p = nextPos();
        const w = pickN(idioms.filter(x => x.w !== it.w).map(x => ({ c: x.w, ms: x.ms })), k + 1, 3, []);
        if (w.length < 3) return null;
        const o = w.map(x => x.c); o.splice(p, 0, it.w);
        return { qtype: '成語', q: '下列哪一個成語的意思是「' + it.ms + '」？', options: o, answer: p,
          exp: '✅ ' + it.w + '＝' + it.m + '。\n📚 其他選項：' + w.map(x => x.c + '＝' + x.ms).join('；') + '。' }; }
    ]
  };
  V[5] = [V[1][0], V[3][0], V[4][0], V[2][1], V[4][2], V[3][2]];   // 模擬卷：各類混合

  const BRIEF = {
    1: () => ({ intro: '挑戰小學堂是這一課的綜合複習。第一關考錯別字：這一課的生字裡，有好幾組長得很像、只差一個部首的字，寫錯了整個詞的意思就跑掉了。',
      rows: corrupted.slice(0, 14).map(c => ({ t: c.good,
        d: '常寫成「' + c.bad + '」——' + tellApart(c.wrongChar, c.sib.zy, c.rightChar, (flat.find(x => x.c === c.rightChar) || {}).zy) })),
      tip: '判斷錯別字先看部首：跟水有關用「氵」、跟手的動作有關用「扌」、跟說話有關用「訁」。' }),
    2: () => ({ intro: '第二關考字音。同一組形近字的讀音不一定一樣，要一個一個記清楚。',
      rows: groups.map((g, i) => ({ t: '第' + (i + 1) + '組', d: g.map(x => x.c + '（' + x.zy + '）').join('　') })),
      tip: '有的形近字同音（蚊／紋都讀 ㄨㄣˊ），有的不同音（隱 ㄧㄣˇ／穩 ㄨㄣˇ），別一律當成同音。' }),
    3: () => ({ intro: '第三關考字形：看詞語挑字。這一關的誘答都是同一組的形近字，要看清楚部首。',
      rows: groups.map((g, i) => ({ t: '第' + (i + 1) + '組　' + g.map(x => x.c).join('／'),
        d: g.map(x => x.c + '：' + x.w.join('、')).join('　') })),
      tip: '不確定時把詞放進句子裡念一遍，想想這個詞跟什麼有關。' }),
    4: () => ({ intro: '第四關把這一課的詞語和成語一起複習。',
      rows: idioms.map(x => ({ t: x.w, d: x.ms })).concat(qwords.slice(0, 10).map(w => ({ t: w, d: (idx[w] && idx[w].main[0]) || '' }))),
      tip: '成語看的是有沒有用對場合；詞語看的是讀音和寫法有沒有記牢。' }),
    5: () => ({ intro: '最後一關是模擬卷：錯別字、字音、字形、詞語、成語都會出現，跟真正的小考一樣。',
      rows: groups.map((g, i) => ({ t: '第' + (i + 1) + '組　' + g.map(x => x.c).join('／'),
        d: g.map(x => x.c + '（' + x.zy + '）' + x.w.join('、')).join('　') })),
      tip: '寫錯的題目會進康軒版的錯題本，考完可以直接去那裡再練一次。' })
  };

  return UNITS.map(U => {
    const order = pickOrder(Math.max(N, 8), (U.n - 1) * 2);
    const cands = [];
    V[U.n].forEach((mk, vi) => order.forEach(i => cands.push(() => mk(i % N, vi))));
    const qs = [];
    for (let i = 0; i < cands.length && qs.length < PER_UNIT; i++) {
      let q;
      try { q = cands[i](); } catch (e) { q = null; }
      if (!q || !q.options || new Set(q.options).size !== q.options.length) continue;
      const key = String(q.q).replace(/\s+/g, '') + '||' + q.options.join('|') + '||' + q.answer;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key);
      q.id = 'kx5a-q' + pad(ln, 2) + 'u' + U.n + 'q' + pad(qs.length + 1, 2);
      q.t = 'choice';
      q.book = '五上'; q.lesson = '第' + ln + '課'; q.tag = rec.name; q.diff = '中';
      qs.push(q);
    }
    if (qs.length !== PER_UNIT) throw new Error('第' + ln + '課 單元' + U.n + ' 只湊出 ' + qs.length + ' 題');
    return {
      id: 'kx-c5a-quiz-' + pad(ln, 2) + '-' + U.n,
      edition: 'kangxuan', subject: 'chinese', book: '五上', series: 'quiz',
      lesson: ln, lessonName: rec.name, unit: U.n, title: UNITS[U.n - 1].title,
      brief: BRIEF[U.n](), qs: qs
    };
  });
}
main();
