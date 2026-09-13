/* 康軒版「成語加油站」單元式練習產生器（2026-09-12 Tony 交辦）
   讀 docs/source/kangxuan-5a-idiom-atoms.json（成語素材，人工撰寫），
   組出 js/data/edu-kangxuan-chinese-5a.js 裡 series='idiom' 的單元。
   一課 5 個單元、一單元 20 題，題型：選擇題＋配合題。
   用法：node tools/build-edu-idiom.js        （全部課次）
        node tools/build-edu-idiom.js 1 2    （只重建第 1、2 課）
   ⚠️ 題目是機械組裝，但每一句釋義、例句、誤用句都是素材檔裡人工寫的，不是模型現編。*/
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'docs/source/kangxuan-5a-idiom-atoms.json');
const OUT = path.join(ROOT, 'js/data/edu-kangxuan-chinese-5a.js');

const UNIT_TITLES = [
  '成語加油站（一）認識意思',
  '成語加油站（二）用在句子裡',
  '成語加油站（三）配合題',
  '成語加油站（四）近義與反義',
  '成語加油站（五）綜合練習'
];

function pad(n, w) { return String(n).padStart(w, '0'); }
// 誘答：同一課的其他成語，用位移取，讓每題的組合不一樣
function others(arr, i, offs) { return offs.map(o => arr[(i + o) % arr.length]); }
// 把正解插在指定位置，回傳 {options, answer, metas}
function place(correct, wrong, pos) {
  const metas = wrong.slice();
  metas.splice(pos, 0, correct);
  return { options: metas.map(x => x.w), answer: pos, metas };
}
function expOf(correct, metas, pos, head) {
  return head + '\n📚 其他選項：' +
    metas.filter((_, i) => i !== pos).map(o => o.w + '＝' + o.m).join('；') + '。';
}

function buildLesson(lessonNo, rec) {
  const arr = rec.items;
  const units = [];
  let n = 0;                                   // 全課流水號，用來輪轉答案位置
  const nextPos = () => (n++) % 4;
  const qid = (u, k) => 'kx5a-i' + pad(lessonNo, 2) + 'u' + u + 'q' + pad(k, 2);

  // 單元一：認識意思（釋義→成語 10 題、成語→釋義 10 題）
  {
    const qs = [];
    arr.forEach((it, i) => {
      const pos = nextPos();
      const p = place(it, others(arr, i, [1, 2, 3]), pos);
      qs.push({ id: qid(1, qs.length + 1), t: 'choice', qtype: '成語',
        q: '下列哪一個成語的意思是「' + it.m + '」？',
        options: p.options, answer: p.answer,
        exp: expOf(it, p.metas, pos, '✅ ' + it.w + '＝' + it.m + '，所以選它。') });
    });
    arr.forEach((it, i) => {
      const pos = nextPos();
      const wrong = others(arr, i, [4, 5, 6]);
      // 選項用短釋義：四個長句子擺在一起小五生根本讀不完，也會讓最長的那個一眼被看出來
      const opts = wrong.map(x => x.ms); opts.splice(pos, 0, it.ms);
      qs.push({ id: qid(1, qs.length + 1), t: 'choice', qtype: '成語',
        q: '「' + it.w + '」是什麼意思？',
        options: opts, answer: pos,
        exp: '✅ ' + it.w + '＝' + it.m + '。\n📚 其他選項分別是：' +
          wrong.map(o => o.w + '＝' + o.ms).join('；') + '。' });
    });
    units.push({ unit: 1, title: UNIT_TITLES[0], qs,
      brief: {
        intro: '這一課有 ' + arr.length + ' 個成語。先把每一個的意思看過一遍，再開始作答；看不懂的先記下來，做完題目回頭再看一次會更清楚。',
        rows: arr.map(it => ({ t: it.w, d: it.m })),
        tip: '成語多半不能照字面解釋，「赴湯蹈火」不是去燙青菜，重點在它比喻的意思。'
      } });
  }

  // 單元二：用在句子裡（兩組語境填空）
  {
    const qs = [];
    [['s', [1, 3, 5]], ['s2', [2, 4, 6]]].forEach(([field, offs]) => {
      arr.forEach((it, i) => {
        const pos = nextPos();
        const p = place(it, others(arr, i, offs), pos);
        const blank = '□'.repeat(it.w.length);
        qs.push({ id: qid(2, qs.length + 1), t: 'choice', qtype: '成語',
          q: '「' + it[field] + '。」句中的' + blank + '應填入下列哪一個成語？',
          options: p.options, answer: p.answer,
          exp: expOf(it, p.metas, pos, '✅ ' + it.w + '＝' + it.m + '，放進句子裡最通順。') });
      });
    });
    units.push({ unit: 2, title: UNIT_TITLES[1], qs,
      brief: {
        intro: '會解釋還不夠，要會用才算學會。這一單元每一題都是一個句子，把最合適的成語填進去。',
        rows: arr.map(it => ({ t: it.w, d: it.m, e: it.s.replace(/□+/g, it.w) })),
        tip: '填之前先看清楚句子在講什麼：是在稱讚、在責備，還是在描述情況？語氣對不上就不是那一個成語。'
      } });
  }

  // 單元三：配合題（選項＝全課成語，依代號作答）
  {
    const qs = [];
    const all = arr.map(x => x.w);
    const head = '配合題：請從下面的選項中，選出最合適的成語。\n';
    // 配合題的選項是固定的一整排，答案索引＝該成語在排裡的位置。
    // 若照原順序出題，答案會是 0,1,2…9 一路往下，學生看得出規律 —— 所以把出題順序打散。
    // 用固定位移（不是亂數）才能讓每次重建產出同一份檔案。
    const order = arr.map((_, i) => (i * 7 + 3) % arr.length);
    order.forEach((i) => {
      const it = arr[i];
      qs.push({ id: qid(3, qs.length + 1), t: 'match', qtype: '配對',
        q: head + '意思：' + it.ms,
        options: all, answer: i,
        exp: '✅ 這個意思說的是「' + it.w + '」：' + it.m + '。' });
    });
    order.slice().reverse().forEach((i) => {
      const it = arr[i];
      qs.push({ id: qid(3, qs.length + 1), t: 'match', qtype: '配對',
        q: head + '句子：' + it.s2.replace(/□+/g, '（　　　）'),
        options: all, answer: i,
        exp: '✅ 這一句要填「' + it.w + '」：' + it.m + '。' });
    });
    units.push({ unit: 3, title: UNIT_TITLES[2], qs,
      brief: {
        intro: '配合題的選項是同一組，全課 ' + arr.length + ' 個成語都在裡面。先確定自己每一個都認得，再一題一題對回去。',
        rows: arr.map(it => ({ t: it.w, d: it.m })),
        tip: '配合題可以先挑最有把握的做，剩下的選項變少，難的題目自然就好選了。'
      } });
  }

  // 單元四：近義與反義
  {
    const qs = [];
    arr.forEach((it, i) => {
      const pos = nextPos();
      const p = place(it.syn, others(arr, i, [1, 2, 3]), pos);
      qs.push({ id: qid(4, qs.length + 1), t: 'choice', qtype: '成語',
        q: '「' + it.w + '」（' + it.ms + '）跟下列哪一個成語意思最接近？',
        options: p.options, answer: p.answer,
        exp: expOf(it.syn, p.metas, pos, '✅ ' + it.syn.w + '＝' + it.syn.m + '，跟「' + it.w + '」意思最接近。') });
    });
    arr.forEach((it, i) => {
      const pos = nextPos();
      if (it.ant) {
        const p = place(it.ant, others(arr, i, [3, 5, 7]), pos);
        qs.push({ id: qid(4, qs.length + 1), t: 'choice', qtype: '成語',
          q: '「' + it.w + '」（' + it.ms + '）的意思跟下列哪一個成語相反？',
          options: p.options, answer: p.answer,
          exp: expOf(it.ant, p.metas, pos, '✅ ' + it.ant.w + '＝' + it.ant.m + '，跟「' + it.w + '」正好相反。') });
      } else {
        // 沒有現成反義詞的成語改考「哪一句用對了」，不硬湊反義
        const p = place(it, others(arr, i, [3, 5, 7]), pos);
        qs.push({ id: qid(4, qs.length + 1), t: 'choice', qtype: '成語',
          q: '「' + it.s2.replace(/□+/g, '（　　　）') + '。」括號裡要填哪一個成語？',
          options: p.options, answer: p.answer,
          exp: expOf(it, p.metas, pos, '✅ ' + it.w + '＝' + it.m + '，最合這句的語意。') });
      }
    });
    units.push({ unit: 4, title: UNIT_TITLES[3], qs,
      brief: {
        intro: '兩個成語意思很像，不代表可以隨便換；意思相反的成語擺在一起記，反而記得更牢。這一單元每一個成語都配了一個近義詞，多數還配了一個反義詞。',
        rows: arr.map(it => ({ t: it.w, d: '近義：' + it.syn.w + '（' + it.syn.m + '）' + (it.ant ? '／反義：' + it.ant.w + '（' + it.ant.m + '）' : '') })),
        tip: '近義詞通常差在語氣輕重或用的對象不同，寫作文挑字時要想一想哪一個更貼切。'
      } });
  }

  // 單元五：綜合練習（缺字題＋誤用判斷）
  {
    const qs = [];
    arr.forEach((it) => {
      const b = it.blank, pos = nextPos();
      const wrong = b.o.slice(1);
      const opts = wrong.slice(); opts.splice(pos, 0, b.o[0]);
      const masked = it.w.split('').map((c, k) => k === b.i ? '□' : c).join('');
      qs.push({ id: qid(5, qs.length + 1), t: 'choice', qtype: '字形',
        q: '成語「' + masked + '」（' + it.ms + '）空格裡應該填哪一個字？',
        options: opts, answer: pos,
        exp: '✅ 正確寫法是「' + it.w + '」。\n📚 其他選項是形近或同音字，寫進這個成語裡都不對：' +
          wrong.join('、') + '。' });
    });
    arr.forEach((it, i) => {
      const pos = nextPos();
      const wrong = others(arr, i, [1, 2, 3]);
      // 正解＝用對的那一句；三個誤答＝別的成語被誤用的句子
      const right = it.s.replace(/□+/g, it.w) + '。';
      const opts = wrong.map(o => o.bad); opts.splice(pos, 0, right);
      qs.push({ id: qid(5, qs.length + 1), t: 'choice', qtype: '成語',
        q: '下列哪一句成語用得正確？',
        options: opts, answer: pos,
        exp: '✅ 「' + it.w + '」＝' + it.m + '，這一句用得正確。\n❌ 其他三句都用錯了：' +
          wrong.map(o => '「' + o.w + '」' + o.why).join('；') + '。' });
    });
    units.push({ unit: 5, title: UNIT_TITLES[4], qs,
      brief: {
        intro: '最後一個單元把前面學的合起來考：先考成語裡的字有沒有寫對，再考會不會看出別人用錯成語。',
        rows: arr.map(it => ({ t: it.w, d: it.m, e: '常寫錯：' + it.blank.o.slice(1).join('、') })),
        tip: '成語裡最容易寫錯的，就是同音或形近的字；記住這個字為什麼是這個意思，就不會寫錯。'
      } });
  }

  // 每題補上冊／課／課名：答題畫面的【五上 第1課】標籤與錯題本的分類都吃這幾個欄位
  units.forEach(u => u.qs.forEach(q => {
    q.book = '五上'; q.lesson = '第' + lessonNo + '課'; q.tag = rec.name; q.diff = q.diff || '中';
  }));
  return units.map(u => ({
    id: 'kx-c5a-idiom-' + pad(lessonNo, 2) + '-' + u.unit,
    edition: 'kangxuan', subject: 'chinese', book: '五上', series: 'idiom',
    lesson: lessonNo, lessonName: rec.name, unit: u.unit, title: u.title,
    brief: u.brief, qs: u.qs
  }));
}

function main() {
  const src = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const only = process.argv.slice(2).map(Number).filter(Boolean);
  const lessons = Object.keys(src).filter(k => k !== '_note').map(Number).sort((a, b) => a - b)
    .filter(n => !only.length || only.indexOf(n) >= 0);
  let out = [];
  lessons.forEach(n => { out = out.concat(buildLesson(n, src[String(n)])); });

  // 保留檔案裡其他系列（生字表／挑戰小學堂）已建好的單元
  let keep = [];
  if (fs.existsSync(OUT)) {
    const W = { APP_EDU: [] };
    const code = fs.readFileSync(OUT, 'utf8');
    (new Function('window', code))(W);
    keep = W.APP_EDU.filter(u => !(u.series === 'idiom' && lessons.indexOf(u.lesson) >= 0));
  }
  const all = keep.concat(out).sort((a, b) =>
    a.series.localeCompare(b.series) || a.lesson - b.lesson || a.unit - b.unit);
  const nQ = all.reduce((s, u) => s + u.qs.length, 0);
  const head = '// 康軒版・國語五上（2026-09-12 Tony 交辦）逐課單元式練習：一課 5 單元、一單元 20 題。\n' +
    '// ⚠️ 這支檔案由 tools/build-edu-idiom.js 等產生器產出，不要手改；\n' +
    '//    要改內容請改 docs/source/kangxuan-5a-*.json 再重跑產生器。\n' +
    '// 規格見 docs/kangxuan-edition-spec.md。目前 ' + all.length + ' 單元、' + nQ + ' 題。\n' +
    'window.APP_EDU = window.APP_EDU || [];\n' +
    'window.APP_EDU.push(\n';
  fs.writeFileSync(OUT, head + all.map(u => JSON.stringify(u)).join(',\n') + '\n);\n');
  console.log('寫出', OUT, '：', all.length, '單元、', nQ, '題（本次重建第', lessons.join('、'), '課）');
}
main();
