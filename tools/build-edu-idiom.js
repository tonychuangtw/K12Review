/* 康軒版「成語加油站」單元式練習產生器（2026-09-12 Tony 交辦）
   讀 docs/source/kangxuan-5a-idiom-atoms.json（成語素材，人工撰寫），
   組出 js/data/edu-kangxuan-chinese-5a.js 裡 series='idiom' 的單元。

   規格：一課 5 個單元、一單元「剛好 20 題」。
   但各課的成語數不一樣（9～12 條），所以每個單元都備了 3 種變化題型：
   成語少的課（9 條）用到第 3 種才湊滿 20，成語多的課（12 條）用前兩種就夠、
   第 20 題之後的先不出 —— 而且每個單元的取用順序會輪轉，
   不會固定都是同樣那幾條成語被少考一題。

   用法：node tools/build-edu-idiom.js        （全部課次）
        node tools/build-edu-idiom.js 1 2    （只重建第 1、2 課）
   ⚠️ 題目是機械組裝，但每一句釋義、例句、誤用句、形近字都是素材檔裡人工寫的。*/
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'docs/source/kangxuan-5a-idiom-atoms.json');
const OUT = path.join(ROOT, 'js/data/edu-kangxuan-chinese-5a.js');
const PER_UNIT = 20;

const UNITS = [
  { n: 1, title: '成語加油站（一）認識意思' },
  { n: 2, title: '成語加油站（二）用在句子裡' },
  { n: 3, title: '成語加油站（三）配合題' },
  { n: 4, title: '成語加油站（四）近義與反義' },
  { n: 5, title: '成語加油站（五）綜合練習' }
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

function main() {
  const src = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const only = process.argv.slice(2).map(Number).filter(Boolean);
  const lessons = Object.keys(src).filter(k => k !== '_note').map(Number).sort((a, b) => a - b)
    .filter(n => !only.length || only.indexOf(n) >= 0);
  let out = [];
  lessons.forEach(n => { out = out.concat(buildLesson(n, src[String(n)])); });

  let keep = [];
  if (fs.existsSync(OUT)) {
    const W = { APP_EDU: [] };
    (new Function('window', fs.readFileSync(OUT, 'utf8')))(W);
    keep = W.APP_EDU.filter(u => !(u.series === 'idiom' && lessons.indexOf(u.lesson) >= 0));
  }
  const all = keep.concat(out).sort((a, b) =>
    a.series.localeCompare(b.series) || a.lesson - b.lesson || a.unit - b.unit);
  const nQ = all.reduce((s, u) => s + u.qs.length, 0);
  const head = '// 康軒版・國語五上（2026-09-12 Tony 交辦）逐課單元式練習：一課 5 單元、一單元 20 題。\n' +
    '// ⚠️ 這支檔案由 tools/build-edu-*.js 產出，不要手改；\n' +
    '//    要改內容請改 docs/source/kangxuan-5a-*.json 再重跑產生器。\n' +
    '// 規格見 docs/kangxuan-edition-spec.md。目前 ' + all.length + ' 單元、' + nQ + ' 題。\n' +
    'window.APP_EDU = window.APP_EDU || [];\n' +
    'window.APP_EDU.push(\n';
  fs.writeFileSync(OUT, head + all.map(u => JSON.stringify(u)).join(',\n') + '\n);\n');
  console.log('寫出', path.relative(ROOT, OUT), '：', all.length, '單元、', nQ,
    '題（本次重建第', lessons.join('、'), '課）');
}

function buildLesson(lessonNo, rec) {
  const arr = rec.items;
  const N = arr.length;
  const allWords = arr.map(x => x.w);
  let seq = 0;                                   // 全課流水號，用來輪轉答案位置
  const nextPos = () => (seq++) % 4;
  // 同課其他成語當誘答，用位移取，讓每題的組合都不一樣。
  // ⚠️ 位移不可以是 N 的倍數（會取到題目自己 → 選項重複），也不可以兩個位移同餘。
  //    各課成語數 9～12，所以位移一律取 1～8。這裡直接擋下來，以後加新課才不會靜靜的壞掉。
  const others = (i, offs) => {
    const mods = offs.map(o => o % N);
    if (mods.some(m => m === 0) || new Set(mods).size !== mods.length) {
      throw new Error('誘答位移 ' + offs.join(',') + ' 在 ' + N + ' 條成語的課裡會取到重複或題目自己');
    }
    return offs.map(o => arr[(i + o) % N]);
  };
  function four(correct, wrong, pos) {
    const metas = wrong.slice();
    metas.splice(pos, 0, correct);
    return { options: metas.map(x => x.w), answer: pos, metas };
  }
  const tail = (metas, pos) => '\n📚 其他選項：' +
    metas.filter((_, k) => k !== pos).map(o => o.w + '＝' + (o.ms || o.m)).join('；') + '。';

  /* 每個單元三種變化題型。回傳 {q, options, answer, exp, qtype}。 */
  const V = {
    1: [
      (it, i) => { const p = nextPos(), f = four(it, others(i, [1, 2, 3]), p);
        return { qtype: '成語', q: '下列哪一個成語的意思是「' + it.m + '」？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.w + '＝' + it.m + '，所以選它。' + tail(f.metas, p) }; },
      (it, i) => { const p = nextPos(), w = others(i, [4, 5, 6]);
        const o = w.map(x => x.ms); o.splice(p, 0, it.ms);
        return { qtype: '成語', q: '「' + it.w + '」是什麼意思？', options: o, answer: p,
          exp: '✅ ' + it.w + '＝' + it.m + '。\n📚 其他選項分別是：' +
            w.map(x => x.w + '＝' + x.ms).join('；') + '。' }; },
      (it, i) => { const p = nextPos(), f = four(it, others(i, [2, 4, 6]), p);
        return { qtype: '成語', q: '「' + it.ms + '」要用哪一個成語來說？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.w + '＝' + it.m + '。' + tail(f.metas, p) }; }
    ],
    2: [
      (it, i) => fill(it, i, 's', [1, 3, 5]),
      (it, i) => fill(it, i, 's2', [2, 4, 6]),
      (it, i) => { const p = nextPos(), w = others(i, [3, 5, 8]);
        const o = w.map(x => x.s.replace(/□+/g, '（　　　）') + '。');
        o.splice(p, 0, it.s.replace(/□+/g, '（　　　）') + '。');
        return { qtype: '成語', q: '「' + it.w + '」最適合填進下面哪一個句子？',
          options: o, answer: p,
          exp: '✅ ' + it.w + '＝' + it.m + '，只有這一句的情境合得上。\n❌ 其他三句要填的是：' +
            w.map(x => x.w).join('、') + '。' }; }
    ],
    3: [
      (it, i) => ({ qtype: '配對', options: allWords, answer: i,
        q: '配合題：請從下面的選項中，選出最合適的成語。\n意思：' + it.ms,
        exp: '✅ 這個意思說的是「' + it.w + '」：' + it.m + '。' }),
      (it, i) => ({ qtype: '配對', options: allWords, answer: i,
        q: '配合題：請從下面的選項中，選出最合適的成語。\n句子：' + it.s2.replace(/□+/g, '（　　　）'),
        exp: '✅ 這一句要填「' + it.w + '」：' + it.m + '。' }),
      (it, i) => ({ qtype: '配對', options: allWords, answer: i,
        q: '配合題：請從下面的選項中，選出最合適的成語。\n句子：' + it.s.replace(/□+/g, '（　　　）'),
        exp: '✅ 這一句要填「' + it.w + '」：' + it.m + '。' })
    ],
    4: [
      (it, i) => { const p = nextPos(), f = four(it.syn, others(i, [1, 2, 3]), p);
        return { qtype: '成語', q: '「' + it.w + '」（' + it.ms + '）跟下列哪一個成語意思最接近？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.syn.w + '＝' + it.syn.m + '，跟「' + it.w + '」意思最接近。' + tail(f.metas, p) }; },
      (it, i) => { const p = nextPos();
        // 每條成語都要有反義詞（素材檔的硬規定）：以前 ant 可以留空、改出填空題，
        // 結果那一題跟單元二的填空題一字不差重複 —— 不留這條退路。
        if (!it.ant) throw new Error(it.w + ' 沒有寫 ant（反義成語），單元四出不了題');
        const f = four(it.ant, others(i, [3, 5, 7]), p);
        return { qtype: '成語', q: '「' + it.w + '」（' + it.ms + '）的意思跟下列哪一個成語相反？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.ant.w + '＝' + it.ant.m + '，跟「' + it.w + '」正好相反。' + tail(f.metas, p) }; },
      (it, i) => { const p = nextPos(), f = four(it, others(i, [5, 7, 8]), p);
        return { qtype: '成語', q: '「' + it.syn.w + '」（' + it.syn.m + '）跟下列哪一個成語意思最接近？',
          options: f.options, answer: f.answer,
          exp: '✅ ' + it.w + '＝' + it.m + '，跟「' + it.syn.w + '」意思最接近。' + tail(f.metas, p) }; }
    ],
    5: [
      (it) => { const b = it.blank, p = nextPos(), w = b.o.slice(1);
        const o = w.slice(); o.splice(p, 0, b.o[0]);
        const masked = it.w.split('').map((c, k) => k === b.i ? '□' : c).join('');
        return { qtype: '字形', q: '成語「' + masked + '」（' + it.ms + '）空格裡應該填哪一個字？',
          options: o, answer: p,
          exp: '✅ 正確寫法是「' + it.w + '」。\n📚 其他選項是形近或同音字，寫進這個成語裡都不對：' + w.join('、') + '。' }; },
      (it, i) => { const p = nextPos(), w = others(i, [1, 2, 3]);
        const o = w.map(x => x.bad); o.splice(p, 0, it.s.replace(/□+/g, it.w) + '。');
        return { qtype: '成語', q: '下列哪一句成語用得正確？', options: o, answer: p,
          exp: '✅ 「' + it.w + '」＝' + it.m + '，這一句用得正確。\n❌ 其他三句都用錯了：' +
            w.map(x => '「' + x.w + '」' + x.why).join('；') + '。' }; },
      (it, i) => { const p = nextPos(), w = others(i, [4, 6, 8]);
        const o = w.map(x => x.s.replace(/□+/g, x.w) + '。'); o.splice(p, 0, it.bad);
        return { qtype: '成語', q: '下列哪一句成語用錯了？', options: o, answer: p,
          exp: '❌ 「' + it.w + '」用錯了：' + it.why + '（' + it.w + '＝' + it.m + '）。\n' +
            '✅ 其他三句都用得正確。' }; }
    ]
  };
  function fill(it, i, field, offs) {
    const p = nextPos(), f = four(it, others(i, offs), p);
    return { qtype: '成語',
      q: '「' + it[field] + '。」句中的' + '□'.repeat(it.w.length) + '應填入下列哪一個成語？',
      options: f.options, answer: f.answer,
      exp: '✅ ' + it.w + '＝' + it.m + '，放進句子裡最通順。' + tail(f.metas, p) };
  }

  const BRIEF = {
    1: () => ({ intro: '這一課有 ' + N + ' 個成語。先把每一個的意思看過一遍再開始作答；看不懂的先記下來，做完題目回頭再看一次會更清楚。',
      rows: arr.map(it => ({ t: it.w, d: it.m })),
      tip: '成語多半不能照字面解釋，「赴湯蹈火」不是去燙青菜，重點在它比喻的意思。' }),
    2: () => ({ intro: '會解釋還不夠，要會用才算學會。這一單元每一題都是一個句子，把最合適的成語填進去。',
      rows: arr.map(it => ({ t: it.w, d: it.ms, e: it.s.replace(/□+/g, it.w) })),
      tip: '填之前先看清楚句子在講什麼：是在稱讚、在責備，還是在描述情況？語氣對不上就不是那一個成語。' }),
    3: () => ({ intro: '配合題的選項是同一排，全課 ' + N + ' 個成語都在裡面。先確定自己每一個都認得，再一題一題對回去。',
      rows: arr.map(it => ({ t: it.w, d: it.ms })),
      tip: '配合題可以先挑最有把握的做；剩下的選項變少，難的題目自然就好選了。' }),
    4: () => ({ intro: '兩個成語意思很像，不代表可以隨便替換；意思相反的成語擺在一起記，反而記得更牢。這一單元每個成語都配了一個近義詞，多數還配了一個反義詞。',
      rows: arr.map(it => ({ t: it.w, d: '近義：' + it.syn.w + '（' + it.syn.m + '）' + (it.ant ? '　反義：' + it.ant.w + '（' + it.ant.m + '）' : '') })),
      tip: '近義詞常常差在語氣輕重或使用的對象，寫作文挑字時要想一想哪一個更貼切。' }),
    5: () => ({ intro: '最後一個單元把前面學的合起來考：先看成語裡的字有沒有寫對，再看得不得出別人用錯了成語。',
      rows: arr.map(it => ({ t: it.w, d: it.ms, e: '容易寫錯成：' + it.blank.o.slice(1).join('、') })),
      tip: '成語裡最容易寫錯的就是同音或形近的字；知道那個字為什麼是這個意思，就不會寫錯。' })
  };

  return UNITS.map(U => {
    // 取用順序每個單元輪轉，成語多的課才不會固定都是同樣那幾條被少考一題
    const order = pickOrder(N, (U.n - 1) * 2);
    const cands = [];
    V[U.n].forEach(mk => order.forEach(i => cands.push(() => mk(arr[i], i))));
    const qs = cands.slice(0, PER_UNIT).map((mk, k) => {
      const q = mk();
      q.id = 'kx5a-i' + pad(lessonNo, 2) + 'u' + U.n + 'q' + pad(k + 1, 2);
      q.t = q.qtype === '配對' ? 'match' : 'choice';
      q.book = '五上'; q.lesson = '第' + lessonNo + '課'; q.tag = rec.name; q.diff = '中';
      return q;
    });
    return {
      id: 'kx-c5a-idiom-' + pad(lessonNo, 2) + '-' + U.n,
      edition: 'kangxuan', subject: 'chinese', book: '五上', series: 'idiom',
      lesson: lessonNo, lessonName: rec.name, unit: U.n, title: U.title,
      brief: BRIEF[U.n](), qs: qs
    };
  });
}
main();
