/* 瀏覽器 smoke test（無 npm 依賴，用 CDP 直接驅動 chrome-headless-shell）
 *
 * 為什麼要有這支：test/test.js 只跑純函式，DOM 行為（手寫題、解析鎖、家長檢視）測不到。
 * 用法：node test/browser-smoke.mjs
 *   找不到 chrome-headless-shell 就跳過（exit 0），不會擋住一般的資料測試流程。
 *   需要 python3（起靜態 server）與 node ≥ 22（內建 WebSocket）。
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SHELL = process.env.CHROME_SHELL ||
  process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell';

if (!existsSync(SHELL)) {
  // 找不到瀏覽器時預設跳過（exit 0），但要吼得夠大聲：這代表這一輪完全沒有前端覆蓋，
  // 不能讓人以為「測試都過了」（2026-08-27 codex 體檢 B 級）。
  // 需要把「沒跑到」當成失敗時（例如 CI），設 SMOKE_REQUIRED=1。
  console.log('');
  console.log('⚠️⚠️  跳過瀏覽器 smoke test —— 這一輪沒有任何前端流程被驗證  ⚠️⚠️');
  console.log('     找不到 ' + SHELL);
  console.log('     可用 CHROME_SHELL=<路徑> 指定，或 SMOKE_REQUIRED=1 讓缺瀏覽器直接算失敗');
  console.log('');
  process.exit(process.env.SMOKE_REQUIRED ? 1 : 0);
}

const fails = [];
function check(name, cond, extra = '') {
  console.log((cond ? '  ✓ ' : '  ✗ ') + name + (cond ? '' : ' — ' + extra));
  if (!cond) fails.push(name);
}

// 種一份 localStorage 狀態：n 題「手寫來源」的字形錯題
function seedWrong(ids) {
  return `(function(){
    var now = Date.now(), d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
    var t = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    localStorage.setItem('chinese-review-v1', JSON.stringify({
      phon: 'zhuyin', grades: [1,2,3,4,5,6], stats: {}, streak: { last: '', days: 0 },
      leitner: {}, subject: 'chinese',
      wrong: ${JSON.stringify(ids)}.map(function (x) {
        return { t: 'chars', id: x, n: 1, ok: 0, wr: 1, added: now, lastWrong: now, due: t, box: 1 };
      })
    }));
  })();`;
}

// 假的 hanzi-writer：quiz() 把 onComplete 掛上 window，測試自行決定寫對／寫錯
const FAKE_WRITER = `
  window.__hw = {};
  window.HanziWriter = {
    create: function (el, ch, opt) {
      window.__hw.char = ch;
      el.innerHTML = '<svg data-fake="1"></svg>';
      return {
        quiz: function (o) { window.__hw.onComplete = o.onComplete; window.__hw.quizzes = (window.__hw.quizzes || 0) + 1; },
        cancelQuiz: function () {},
        animateCharacter: function (o) { if (o && o.onComplete) setTimeout(o.onComplete, 10); }
      };
    }
  };
`;

async function session(port, cdpPort, { blockWriter, seed }, run) {
  const server = spawn('python3', ['-m', 'http.server', String(port)], { cwd: ROOT, stdio: 'ignore' });
  const chrome = spawn(SHELL, [`--remote-debugging-port=${cdpPort}`, '--no-sandbox', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  try {
    await sleep(1500);
    const list = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
    const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r));
    let id = 0;
    const pending = new Map();
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    });
    const send = (method, params = {}) => {
      const mid = ++id;
      ws.send(JSON.stringify({ id: mid, method, params }));
      return new Promise((r) => pending.set(mid, r));
    };
    const js = async (expr) => {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
      return r.result?.result?.value;
    };
    await send('Runtime.enable');
    await send('Page.enable');
    await send('Network.enable');
    // js/sync.js 一律擋掉：沒有 CloudSync 就不會被「先登入」攔住
    await send('Network.setBlockedURLs', { urls: ['*js/sync.js'].concat(blockWriter ? ['*hanzi-writer.min.js'] : []) });
    // 未捕捉的 JS 錯誤要當成失敗：2026-08-29 phonWordZy 被寫進別的函式裡，
    // 教學卡呼叫時 ReferenceError，整張卡只剩一行，畫面上完全看不出來出過錯。
    const ERR_HOOK = `window.__errs = [];
      addEventListener('error', function (e) { window.__errs.push(String(e.message || e.error)); });
      addEventListener('unhandledrejection', function (e) { window.__errs.push('promise: ' + e.reason); });`;
    await send('Page.addScriptToEvaluateOnNewDocument', { source: ERR_HOOK + (blockWriter ? FAKE_WRITER : '') + seed });
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await sleep(2500);
    await run(js);
    const errs = await js(`JSON.stringify(window.__errs || [])`);
    check('這一段流程沒有未捕捉的 JS 錯誤', errs === '[]', String(errs).slice(0, 300));
    ws.close();
  } finally {
    chrome.kill();
    server.kill();
  }
}

/* ---------- 1. 總結測驗的手寫題（假 writer，可模擬寫對／寫錯） ---------- */
console.log('手寫題進測驗（假 hanzi-writer）');
await session(8731, 9331, { blockWriter: true, seed: seedWrong(['c001', 'c002', 'c003', 'c004', 'c005', 'c006']) }, async (js) => {
  check('app 載入', await js('!!window.PURE'));
  await js(`document.querySelector('.card[data-go="review"]').click()`);
  await sleep(300);
  await js(`document.getElementById('rvMb').checked = true; document.getElementById('rvStart').click()`);
  await sleep(600);
  check('手寫來源的錯題出手寫題，不出選擇題',
    await js(`!document.getElementById('quizHwWrap').classList.contains('hidden') &&
              document.getElementById('quizOptions').classList.contains('hidden')`));
  check('題目文字要求手寫', /手寫這個字/.test(await js(`document.getElementById('quizQuestion').textContent`)));
  check('手寫題不顯示「用猜的」', await js(`document.getElementById('quizGuess').classList.contains('hidden')`));

  // 第 1 題：一次寫對 → 出解析確認題（這批題目都有 chk 資料）
  await js(`window.__hw.onComplete({ totalMistakes: 0 })`);
  await sleep(300);
  const fb = await js(`document.getElementById('quizFeedback').textContent`);
  check('一次寫對→公布解析', /一次就一筆不錯地寫對/.test(fb) && /正確答案/.test(fb), fb.slice(0, 50));
  // 答完的正解格：有筆順資料時畫楷書字形（hanzi-writer 的 SVG），沒有資料才退回純文字
  // （2026-08-25 Tony 回報「寫完顯示成原本的字，不是練習帶著寫的楷書」）
  check('答完在格子裡用楷書字形顯示正解',
    await js(`(function(){ var p = document.getElementById('quizHwPanel');
      return !!p.querySelector('svg') || p.textContent.length === 1; })()`));
  check('正解格點一下可以重播筆順', await js(`typeof document.getElementById('quizHwPanel').onclick === 'function'`));
  check('解析後出現確認題', await js(`!document.getElementById('quizChk').classList.contains('hidden')`));
  check('確認題有 4 個選項', await js(`document.querySelectorAll('#quizChkOpts .q-opt').length === 4`));
  check('確認題答完前不給下一題', await js(`document.getElementById('quizNext').classList.contains('hidden')`));
  // 答對確認題
  await js(`(function(){var a = window.APP_CHECKS[window.QuizDebug.id()].a;
    document.querySelectorAll('#quizChkOpts .q-opt')[a].click();})()`);
  await sleep(300);
  check('確認題答對→解鎖下一題', await js(`!document.getElementById('quizNext').classList.contains('hidden')`) &&
    /沒錯/.test(await js(`document.getElementById('quizChkFb').textContent`)));
  check('確認題答對有記進 state.chk', await js(`(function(){
    var c = (JSON.parse(localStorage.getItem('chinese-review-v1')).chk) || {};
    var k = Object.keys(c)[0]; return !!k && c[k].n === 1 && c[k].ok === 1;})()`));

  await js(`document.getElementById('quizNext').click()`);
  await sleep(400);
  // 第 2 題：寫錯 → 重寫到全對 → 確認題故意答錯
  await js(`window.__hw.onComplete({ totalMistakes: 2 })`);
  await sleep(400);
  check('寫錯要求重寫到全對', /重寫到全對/.test(await js(`document.getElementById('quizHwStatus').textContent`)));
  await sleep(2600);
  check('示範完重開手寫格', await js(`window.__hw.quizzes >= 3`));
  const id2 = await js(`window.QuizDebug.id()`);
  await js(`window.__hw.onComplete({ totalMistakes: 0 })`);
  await sleep(300);
  check('第一次寫錯的題目標明已進錯題本',
    /第一次沒寫對/.test(await js(`document.getElementById('quizFeedback').textContent`)));
  await js(`(function(){var a = window.APP_CHECKS[window.QuizDebug.id()].a;
    var bad = [0,1,2,3].filter(function(i){return i !== a;})[0];
    document.querySelectorAll('#quizChkOpts .q-opt')[bad].click();})()`);
  await sleep(300);
  check('確認題答錯→告知重排錯題本', /重新排入錯題本/.test(await js(`document.getElementById('quizChkFb').textContent`)),
    await js(`document.getElementById('quizChkFb').textContent`));
  check('確認題答錯→原題複習日拉到明天、連對歸零', await js(`(function(){
    var s = JSON.parse(localStorage.getItem('chinese-review-v1'));
    var w = (s.wrong || []).filter(function (x) { return x.id === ${JSON.stringify(id2)}; })[0];
    if (!w) return false;
    var d = new Date(); d.setDate(d.getDate() + 1);
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    var tmr = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    return w.ok === 0 && w.due === tmr;})()`),
    await js(`JSON.stringify((JSON.parse(localStorage.getItem('chinese-review-v1')).wrong || []).slice(0, 3))`));
  check('確認題答錯也記進 state.chk', await js(`(function(){
    var c = (JSON.parse(localStorage.getItem('chinese-review-v1')).chk) || {};
    var k = Object.keys(c)[0]; return !!k && c[k].n === 2 && c[k].ok === 1;})()`));

  // 第 3 題：沒有確認題資料時退回「解析鎖倒數」
  await js(`document.getElementById('quizNext').click()`);
  await sleep(400);
  await js(`delete window.APP_CHECKS[window.QuizDebug.id()]`);
  await js(`window.__hw.onComplete({ totalMistakes: 0 })`);
  await sleep(300);
  check('沒有確認題→退回解析鎖倒數',
    await js(`document.getElementById('quizChk').classList.contains('hidden')`) &&
    await js(`document.getElementById('quizNext').classList.contains('locked')`) &&
    /先看解析/.test(await js(`document.getElementById('quizNext').textContent`)),
    await js(`document.getElementById('quizNext').textContent`));
  // 鎖住的按鈕不設 disabled（disabled 收不到 click＝按了完全沒反應），改成按下去給提示
  check('鎖住期間按下一題不會跳題、但會給提示',
    await js(`(function(){var n=document.getElementById('quizProgress').textContent;
      document.getElementById('quizNext').click();
      return document.getElementById('quizProgress').textContent === n;})()`) &&
    await js(`(function(){var h=document.getElementById('quizGateHint');
      return !h.classList.contains('hidden') && /秒/.test(h.textContent);})()`),
    await js(`document.getElementById('quizGateHint').textContent`));
  check('鎖住期間按下一題會跳出完整解析',
    await js(`(function(){var m=document.querySelector('.dlg-overlay .dlg-msg');
      return !!m && /完整解析/.test(m.textContent) && /正解/.test(m.textContent);})()`),
    await js(`(document.querySelector('.dlg-overlay .dlg-msg')||{}).textContent`));
  await js(`document.querySelector('.dlg-overlay .dlg-primary').click()`);
  check('關掉解析彈窗', await js(`!document.querySelector('.dlg-overlay')`));
  await sleep(11000);
  check('倒數結束自動解鎖', await js(`!document.getElementById('quizNext').classList.contains('locked') &&
    document.getElementById('quizNext').disabled === false &&
    document.getElementById('quizGateHint').classList.contains('hidden') &&
    document.getElementById('quizNext').textContent === '下一題'`));
  await js(`document.getElementById('quizNext').click()`);
  await sleep(400);
  check('解析停留有寫進 state.dwell', await js(`(function(){
    var d = (JSON.parse(localStorage.getItem('chinese-review-v1')).dwell) || {};
    var k = Object.keys(d)[0]; return !!k && d[k].n >= 1 && d[k].ms > 0;})()`));
  check('總結測驗不算成自主練習（state.gen 空的）',
    await js(`Object.keys((JSON.parse(localStorage.getItem('chinese-review-v1')).gen) || {}).length === 0`),
    await js(`JSON.stringify((JSON.parse(localStorage.getItem('chinese-review-v1')).gen) || {})`));
});

/* ---------- 1a. 解析確認題開關（⚙️ 練習設定，2026-08-29 Tony） ---------- */
console.log('解析確認題開關');
await session(8746, 9346, { blockWriter: true, seed: seedWrong(['c001', 'c002', 'c003', 'c004', 'c005', 'c006']) }, async (js) => {
  await js(`document.getElementById('setBtn').click()`);
  await sleep(200);
  check('⚙️ 開得出練習設定面板',
    await js(`!document.getElementById('setPanel').classList.contains('hidden')`));
  check('三種選法都在', await js(`document.querySelectorAll('#setPanel .theme-sw').length === 3`));
  check('預設是「全部科目都出」',
    await js(`document.querySelectorAll('#setPanel .theme-sw')[0].classList.contains('active')`));
  // 選「都不出」
  await js(`document.querySelectorAll('#setPanel .theme-sw')[2].click()`);
  await sleep(200);
  check('選好會存進 state.chkMode',
    await js(`JSON.parse(localStorage.getItem('chinese-review-v1')).chkMode === 'off'`),
    await js(`JSON.parse(localStorage.getItem('chinese-review-v1')).chkMode`));
  // 關掉之後：答完題不出確認題，退回解析鎖倒數
  await js(`document.getElementById('setBtn').click()`);   // 收起面板
  await js(`document.querySelector('.card[data-go="review"]').click()`);
  await sleep(400);
  await js(`document.getElementById('rvMb').checked = true; document.getElementById('rvStart').click()`);
  await sleep(900);
  check('測驗有開起來（手寫題）',
    await js(`typeof (window.__hw || {}).onComplete === 'function'`));
  await js(`window.__hw.onComplete({ totalMistakes: 0 })`);
  await sleep(400);
  check('關掉之後不出確認題',
    await js(`document.getElementById('quizChk').classList.contains('hidden')`));
  check('關掉之後仍要看完解析才能往下（解析鎖倒數）',
    await js(`document.getElementById('quizNext').classList.contains('locked')`) &&
    /先看解析/.test(await js(`document.getElementById('quizNext').textContent`)),
    await js(`document.getElementById('quizNext').textContent`));
});

/* ---------- 1c. 互動元件：原子構造（2026-08-29 Tony 回報兩個問題） ---------- */
console.log('原子構造互動元件');
await session(8747, 9347, { blockWriter: true, seed: seedWrong(['c001']) }, async (js) => {
  await js(`(function(){
    var d = document.createElement('div');
    d.id = '__wgtest';
    document.body.appendChild(d);
    window.Widgets.render(d, { type: 'atom', z: 8 });
  })()`);
  const btnText = `Array.prototype.slice.call(document.querySelectorAll('#__wgtest .wg-btn'))`;
  check('原子元件畫得出來', await js(`!!document.querySelector('#__wgtest svg')`));
  // 一開始就是中性，按「回到中性」畫面不會變 → 要給提示，不能像壞掉
  await js(`${btnText}.filter(function(b){return b.textContent === '回到中性';})[0].click()`);
  // 提示要講原因（Tony 2026-08-29：只寫「已經是這個狀態了」看不懂，會以為不能再加）
  check('按了沒變化時會說明原因（已經是中性原子）',
    await js(`(function(){var h = document.querySelector('#__wgtest .wg-noop');
      return !!h && !h.classList.contains('hidden') && /已經是中性原子/.test(h.textContent);})()`),
    await js(`(document.querySelector('#__wgtest .wg-noop')||{}).textContent || '(沒有提示)'`));
  // 一直按 ＋1 個電子：以前會加到三十幾個、畫面停住；現在夾在 ±3
  for (let i = 0; i < 8; i++) {
    await js(`${btnText}.filter(function(b){return b.textContent === '＋ 1 個電子';})[0].click()`);
  }
  check('加到上限時會說明為什麼不能再加',
    await js(`(function(){var h = document.querySelector('#__wgtest .wg-noop');
      return !!h && /上限/.test(h.textContent) && /電子/.test(h.textContent);})()`),
    await js(`(document.querySelector('#__wgtest .wg-noop')||{}).textContent || '(沒有提示)'`));
  check('電子數有上限（氧最多加到 11 個，不會一路加下去）',
    await js(`/電子數/.test(document.querySelector('#__wgtest').textContent) &&
      document.querySelector('#__wgtest .wg-read-main').textContent.indexOf('電子 11 個') >= 0`),
    await js(`document.querySelector('#__wgtest .wg-read-main').textContent`));
  for (let i = 0; i < 8; i++) {
    await js(`${btnText}.filter(function(b){return b.textContent === '－ 1 個電子';})[0].click()`);
  }
  check('往下也有下限（氧最少剩 5 個電子）',
    await js(`document.querySelector('#__wgtest .wg-read-main').textContent.indexOf('電子 5 個') >= 0`),
    await js(`document.querySelector('#__wgtest .wg-read-main').textContent`));
});

/* ---------- 1c2. 說明寫「拉滑桿／拖動」的元件，真的拉得動、拖得動 ---------- */
console.log('互動元件的滑桿與拖曳');
await session(8749, 9349, { blockWriter: true, seed: seedWrong(['c001']) }, async (js) => {
  const SLIDERS = [
    ['phscale（酸鹼值）', { type: 'phscale', value: 3 }, 1],
    ['microscope（顯微鏡）', { type: 'microscope', eye: 10, obj: 40 }, 2],
    ['soundwave（波）', { type: 'soundwave', amp: 2, freq: 2 }, 2],
    ['solution（溶液）', { type: 'solution', solute: 5, max: 12, water: 100 }, 1]
  ];
  for (const [name, spec, n] of SLIDERS) {
    const r = await js(`(function(){
      var d = document.createElement('div'); document.body.appendChild(d);
      window.Widgets.render(d, ${JSON.stringify(spec)});
      var rs = d.querySelectorAll('input[type=range]');
      var before = d.querySelector('.wg').textContent;
      Array.prototype.forEach.call(rs, function (x) {
        x.value = String(Number(x.value) + (Number(x.step) || 1));
        x.dispatchEvent(new Event('input', { bubbles: true }));
      });
      var out = { n: rs.length, changed: d.querySelector('.wg').textContent !== before };
      d.remove(); return out;
    })()`);
    check(name + ' 有 ' + n + ' 條滑桿且拉了會變', r.n === n && r.changed, JSON.stringify(r));
  }
  for (const [name, spec] of [['clock（時鐘指針）', { type: 'clock', h: 5, m: 0, edit: true }],
                              ['vector（向量端點）', { type: 'vector', a: [3, 0], b: [0, 3], mode: 'add' }]]) {
    const r = await js(`(function(){
      var d = document.createElement('div'); document.body.appendChild(d);
      window.Widgets.render(d, ${JSON.stringify(spec)});
      var svg = null;
      Array.prototype.forEach.call(d.querySelectorAll('svg'), function (x) {
        if (x.style && x.style.cursor === 'grab') svg = svg || x;
      });
      if (!svg) { d.remove(); return { drag: false }; }
      var rect = svg.getBoundingClientRect(), before = d.querySelector('.wg').textContent;
      function ev(t, x, y) { svg.dispatchEvent(new PointerEvent(t, { bubbles: true, clientX: x, clientY: y, pointerId: 1 })); }
      ev('pointerdown', rect.left + rect.width * 0.5, rect.top + rect.height * 0.2);
      ev('pointermove', rect.left + rect.width * 0.8, rect.top + rect.height * 0.5);
      ev('pointerup', rect.left + rect.width * 0.8, rect.top + rect.height * 0.5);
      var out = { drag: true, changed: d.querySelector('.wg').textContent !== before };
      d.remove(); return out;
    })()`);
    check(name + ' 拖得動而且畫面會變', r.drag && r.changed, JSON.stringify(r));
  }
});

/* ---------- 1d. 單元教學卡：每一種類別都要有內容（2026-08-29 Tony 回報字音卡只有詞） ---------- */
console.log('單元教學卡');
await session(8748, 9348, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grade: 5, grades: [5], extra: [], subject: 'chinese', onboarded: 1, term: '全',
  stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [] }));` }, async (js) => {
  await js(`document.querySelector('.card[data-go="units"]').click()`);
  await sleep(500);
  await js(`(function(){var e=document.querySelectorAll('#unitList .unit-card, #unitList button');(e[11]||e[0]).click();})()`);
  await sleep(500);
  check('進得了單元教學卡',
    await js(`!document.getElementById('view-lesson').classList.contains('hidden')`));
  // 走完整個單元，每一張都要有內容（成語／俚語／字音／字形四種都會走到）
  const seen = {};
  let thin = '', phonZy = '', charZy = '';
  for (let i = 0; i < 20; i++) {
    const tag = await js(`(document.getElementById('lessonTag')||{}).textContent || ''`);
    const lines = await js(`document.querySelectorAll('#lessonBody > div').length`);
    const term = await js(`(document.querySelector('#lessonBody .lesson-term')||{}).textContent || ''`);
    const zy = await js(`(document.querySelector('#lessonBody .lesson-zy')||{}).textContent || ''`);
    const kind = tag.replace('📖 教學 · ', '').trim();
    if (kind) seen[kind] = (seen[kind] || 0) + 1;
    if (lines < 2 && !thin) thin = `${kind}「${term}」只有 ${lines} 行`;
    if (kind === '字音辨正' && !phonZy) phonZy = zy;
    if (kind === '字形辨正' && !charZy) charZy = zy;
    const last = await js(`/單元測驗/.test(document.getElementById('lessonNext').textContent)`);
    if (last) break;
    await js(`document.getElementById('lessonNext').click()`);
    await sleep(200);
  }
  check('每一張教學卡都有內容（不只一行詞）', thin === '', thin);
  check('四種類別的教學卡都走到了',
    ['成語', '俚語諺語', '字音辨正', '字形辨正'].every((k) => seen[k]),
    JSON.stringify(seen));
  // 2026-08-29 Tony：「字音練習，但是並沒有注音在上面」——整詞注音那行不能不見
  check('字音辨正的教學卡有整詞注音', /[ㄅ-ㄩ]/.test(phonZy) && phonZy.indexOf('｜') >= 0, phonZy || '(沒有注音行)');
  check('字形辨正的教學卡有注音', /[ㄅ-ㄩ]/.test(charZy), charZy || '(沒有注音行)');
});

/* ---------- 1b. 只考錯題本的錯題測驗 ---------- */
console.log('錯題測驗（只考錯題本）');
await session(8734, 9334, { blockWriter: true, seed: seedWrong(['c001', 'c002', 'c003', 'c004', 'c005', 'c006', 'c007', 'c008']) }, async (js) => {
  await js(`document.querySelector('.card[data-go="review"]').click()`);
  await sleep(300);
  await js(`document.getElementById('rvWrongOnly').click()`);
  await sleep(700);
  check('不挑日期也能出錯題考卷', await js(`!document.getElementById('view-quiz').classList.contains('hidden')`));
  check('題數＝錯題本題數（8 題）',
    /\/ 8/.test(await js(`document.getElementById('quizProgress').textContent`)),
    await js(`document.getElementById('quizProgress').textContent`));
  check('錯題測驗的題目也走手寫', await js(`!document.getElementById('quizHwWrap').classList.contains('hidden')`));
  // 全部答完 → 應記成 📕 錯題測驗
  for (let i = 0; i < 8; i++) {
    await js(`window.__hw.onComplete({ totalMistakes: 0 })`);
    await sleep(250);
    // 有確認題就答對它，沒有就直接解鎖
    await js(`(function(){
      var chk = window.APP_CHECKS[window.QuizDebug.id()];
      if (chk && !document.getElementById('quizChk').classList.contains('hidden')) {
        document.querySelectorAll('#quizChkOpts .q-opt')[chk.a].click();
      }})()`);
    await sleep(250);
    await js(`(function(){window.QuizDebug.unlock();document.getElementById('quizNext').click();})()`);
    await sleep(250);
  }
  check('考完記成錯題測驗成績', await js(`(function () {
    var h = (JSON.parse(localStorage.getItem('chinese-review-v1')).review) || [];
    return h.length === 1 && h[0].wrongOnly === 1 && h[0].n === 8;})()`),
    await js(`JSON.stringify((JSON.parse(localStorage.getItem('chinese-review-v1')).review) || [])`));
  check('結果畫面標示錯題測驗', /錯題測驗結束/.test(await js(`document.getElementById('quizResult').textContent`)),
    await js(`document.getElementById('quizResult').textContent.slice(0, 40)`));
});

/* ---------- 2. 真的 hanzi-writer：筆順資料抓得到、格子畫得出來 ---------- */
console.log('手寫題進測驗（真 hanzi-writer）');
await session(8732, 9332, { blockWriter: false, seed: seedWrong(['c001', 'c002', 'c003', 'c004', 'c005', 'c006']) }, async (js) => {
  await js(`document.querySelector('.card[data-go="review"]').click()`);
  await sleep(300);
  await js(`document.getElementById('rvStart').click()`);
  await sleep(2500);
  check('真 writer 在測驗裡畫出手寫格 svg', await js(`!!document.querySelector('#quizHwPanel svg')`),
    await js(`document.getElementById('quizHwStatus').textContent`));
  check('提示文字是手寫指引', /一筆一筆寫/.test(await js(`document.getElementById('quizHwStatus').textContent`)));
});

/* ---------- 3. 每日練習／自主練習的紀錄歸屬與解析鎖 ---------- */
console.log('每日練習與自主練習');
await session(8733, 9333, { blockWriter: false, seed: seedWrong(['c001']) }, async (js) => {
  await js(`document.querySelector('.card[data-go="wrongbook"]').click()`);
  await sleep(400);
  await js(`document.querySelector('#wrongList .wrong-item').click()`);
  await sleep(2500);
  check('錯題本點手寫錯題仍走手寫練習頁', await js(`!document.getElementById('view-write').classList.contains('hidden')`));
  check('手寫練習畫出 svg', await js(`!!document.querySelector('#writeQuizPanel svg')`));
  await js(`document.getElementById('writeExit').click()`);
  await sleep(300);

  await js(`document.querySelector('.card[data-go="daily"]').click()`);
  await sleep(900);
  check('每日練習開得起來', await js(`!document.getElementById('view-quiz').classList.contains('hidden')`));
  if (!await js(`!document.getElementById('quizHwWrap').classList.contains('hidden')`)) {
    // 這題先拿掉確認題資料，測「沒有確認題 → 退回解析鎖倒數」這條路。
    // 2026-08-27 起沒有手寫確認題會自動從解析生成，所以要連 _noChk 一起標，才走得到解析鎖
    await js(`(function(){ var id = window.QuizDebug.id();
      delete window.APP_CHECKS[id];
      ['idioms','slang','phonics','chars','reading'].forEach(function (k) {
        (window.APP_DATA[k] || []).forEach(function (it) { if (it.id === id) it._noChk = 1; });
      }); })()`);
    await js(`document.querySelector('#quizOptions .q-opt').click()`);
    await sleep(400);
    if (/再想一次/.test(await js(`document.getElementById('quizFeedback').textContent`))) {
      await js(`Array.prototype.slice.call(document.querySelectorAll('#quizOptions .q-opt'))
        .filter(function (b) { return !b.disabled; })[0].click()`);
      await sleep(400);
    }
    check('選擇題沒有確認題資料時退回解析鎖',
      await js(`document.getElementById('quizChk').classList.contains('hidden')`) &&
      await js(`document.getElementById('quizNext').classList.contains('locked')`) &&
      /先看解析/.test(await js(`document.getElementById('quizNext').textContent`)),
      await js(`document.getElementById('quizNext').textContent`));
    await sleep(13000);
    check('選擇題解析鎖會解開', await js(`!document.getElementById('quizNext').classList.contains('locked')
      && document.getElementById('quizNext').disabled === false`));
    await js(`document.getElementById('quizNext').click()`);
    await sleep(400);
    check('每日練習不算成自主練習（state.gen 空的）',
      await js(`Object.keys((JSON.parse(localStorage.getItem('chinese-review-v1')).gen) || {}).length === 0`),
      await js(`JSON.stringify((JSON.parse(localStorage.getItem('chinese-review-v1')).gen) || {})`));

    // 下一題（有確認題資料）→ 公布解析後應該出確認題，答對才放行
    if (await js(`document.getElementById('quizHwWrap').classList.contains('hidden')
      && !!window.APP_CHECKS[window.QuizDebug.id()]`)) {
      await js(`document.querySelector('#quizOptions .q-opt').click()`);
      await sleep(400);
      if (/再想一次/.test(await js(`document.getElementById('quizFeedback').textContent`))) {
        await js(`Array.prototype.slice.call(document.querySelectorAll('#quizOptions .q-opt'))
          .filter(function (b) { return !b.disabled; })[0].click()`);
        await sleep(400);
      }
      check('選擇題有確認題資料時追問確認題',
        await js(`!document.getElementById('quizChk').classList.contains('hidden')`) &&
        await js(`document.getElementById('quizNext').classList.contains('hidden')`),
        await js(`JSON.stringify({chk: document.getElementById('quizChk').className,
          next: document.getElementById('quizNext').className})`));
      await js(`(function(){var a = window.APP_CHECKS[window.QuizDebug.id()].a;
        document.querySelectorAll('#quizChkOpts .q-opt')[a].click();})()`);
      await sleep(300);
      check('確認題答對→放行下一題',
        await js(`!document.getElementById('quizNext').classList.contains('hidden')
          && document.getElementById('quizNext').disabled === false`),
        await js(`document.getElementById('quizChkFb').textContent`));
    }
  }

  await js(`document.getElementById('quizExit').click()`);
  await sleep(300);
  await js(`(function () { var b = document.querySelector('.dlg-ok, .dialog-ok, #dlgOk, .btn-good'); if (b) b.click(); })()`);
  await sleep(300);
  await js(`document.querySelector('.card[data-go="idioms"]').click()`);
  await sleep(700);
  if (await js(`!document.getElementById('view-quiz').classList.contains('hidden')`)) {
    await js(`document.querySelector('#quizOptions .q-opt').click()`);
    await sleep(400);
    await js(`(function () { var b = Array.prototype.slice.call(document.querySelectorAll('#quizOptions .q-opt'))
      .filter(function (x) { return !x.disabled; })[0]; if (b) b.click(); })()`);
    await sleep(400);
    check('成語刷題有記進自主練習 state.gen', await js(`(function () {
      var g = (JSON.parse(localStorage.getItem('chinese-review-v1')).gen) || {};
      var k = Object.keys(g)[0]; return !!k && g[k].n >= 1;})()`));

    /* 手寫練習不重複輪替（Tony 2026-08-28：兒子說一直練同幾個字）*/
  await js(`window.NavDebug.go('home')`);
  await sleep(300);
  await js(`document.querySelector('.card[data-go="write"]').click()`);
  await sleep(600);
  const w1 = await js(`(function(){var m=(JSON.parse(localStorage.getItem('chinese-review-v1')).writeSeen)||{};
    var k=Object.keys(m)[0]; return k? m[k].length : 0;})()`);
  check('手寫第一輪記下練過哪些字', w1 >= 1, String(w1));
  check('練習畫面顯示本輪還剩幾個字',
    await js(`/本輪還剩/.test(document.getElementById('writeTag').textContent)`),
    await js(`document.getElementById('writeTag').textContent`));
  await js(`document.getElementById('writeExit').click()`);
  await sleep(300);
  await js(`(function () { var b = document.querySelector('.dlg-ok, .dialog-ok, #dlgOk, .btn-good'); if (b) b.click(); })()`);
  await sleep(300);
  await js(`window.NavDebug.go('home')`);
  await sleep(300);
  await js(`document.querySelector('.card[data-go="write"]').click()`);
  await sleep(600);
  const w2 = await js(`(function(){var m=(JSON.parse(localStorage.getItem('chinese-review-v1')).writeSeen)||{};
    var k=Object.keys(m)[0]; return k? m[k].length : 0;})()`);
  check('第二輪抽到的是沒練過的字（累計字數增加）', w2 > w1, w1 + ' → ' + w2);
  check('同一輪內不重複（沒有重複的 id）', await js(`(function(){
    var m=(JSON.parse(localStorage.getItem('chinese-review-v1')).writeSeen)||{};
    var k=Object.keys(m)[0]; if(!k) return false;
    var a=m[k]; return a.length === new Set(a).size;})()`));
  await js(`document.getElementById('writeExit').click()`);
  await sleep(300);
  await js(`(function () { var b = document.querySelector('.dlg-ok, .dialog-ok, #dlgOk, .btn-good'); if (b) b.click(); })()`);
  await sleep(300);
  await js(`window.NavDebug.go('home')`);
  await sleep(300);
  await js(`document.querySelector('.card[data-go="idioms"]').click()`);
  await sleep(700);

  /* 逐題作答紀錄（Tony 2026-08-28）：做過的題目要能回頭再看 */
    check('刷題有寫進逐題紀錄 state.wlog', await js(`(function () {
      var w = (JSON.parse(localStorage.getItem('chinese-review-v1')).wlog) || {};
      var k = Object.keys(w)[0];
      return !!k && w[k].length >= 1 && !!w[k][0].e && w[k][0].e.id;})()`),
      await js(`JSON.stringify((JSON.parse(localStorage.getItem('chinese-review-v1')).wlog) || {}).slice(0, 160)`));
    await js(`document.getElementById('quizExit').click()`);
    await sleep(300);
    await js(`(function () { var b = document.querySelector('.dlg-ok, .dialog-ok, #dlgOk, .btn-good'); if (b) b.click(); })()`);
    await sleep(300);
    await js(`document.querySelector('.card[data-go="review"]').click()`);
    await sleep(500);
    check('總結測驗頁有「每天做過的題目」',
      await js(`/每天做過的題目/.test(document.getElementById('rvLog').textContent)`));
    check('列出有紀錄的日期', await js(`document.querySelectorAll('[data-wlog]').length >= 1`));
    await js(`document.querySelector('[data-wlog]').click()`);
    await sleep(400);
    check('點某一天會展開那天做過的題目',
      await js(`document.querySelectorAll('.wlog-detail:not(.hidden) .wlog-item').length >= 1`));
    check('依練習項目分區塊',
      await js(`document.querySelectorAll('.wlog-detail:not(.hidden) details.wlog-group').length >= 1`));
    check('每題都附答案與解析', await js(`(function () {
      var it = document.querySelector('.wlog-detail:not(.hidden) .wlog-item');
      return !!it && /答案/.test(it.textContent) && it.textContent.length > 30;})()`));
    check('答對的題目也列得出來（可以再看）',
      await js(`document.querySelectorAll('.wlog-detail:not(.hidden) .wlog-item.ok').length >= 1`));
  }
});

/* ---------- 4. 社會科（題庫型科目）：依課練習／單元學習／每日練習／錯題本 ---------- */
console.log('社會科');
await session(8734, 9334, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grades: [5], stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [], subject: 'social' }));` },
async (js) => {
  check('社會原創題庫載得到', await js(`(window.APP_DATA.social || []).length >= 50`),
    String(await js(`(window.APP_DATA.social || []).length`)));
  // 匯入題庫（各科題本轉檔）2026-08-27 起改成動態載入：先叫一次載入器再驗，
  // 對應 app.js 的 ensureImportBanks()（進到「匯入題庫」畫面時會走同一條路）
  await js(`window.__ensureImportBanks && window.__ensureImportBanks()`);
  for (let i = 0; i < 60 && !(await js(`(window.APP_DATA.socialCustom || []).length > 0`)); i++) await sleep(250);
  check('社會自創題庫載得到', await js(`(window.APP_DATA.socialCustom || []).length > 500`),
    String(await js(`(window.APP_DATA.socialCustom || []).length`)));
  await sleep(300);
  await js(`window.NavDebug.go('home')`);
  await sleep(300);
  check('國語專屬卡片在社會科隱藏',
    await js(`document.querySelector('.card[data-go="idioms"]').classList.contains('hidden')
      && !document.querySelector('.card[data-go="units"]').classList.contains('hidden')
      && !document.querySelector('.card[data-go="daily"]').classList.contains('hidden')`));
  check('科目內頁沒有匯入題庫的卡（匯入題庫已移到最外層）',
    await js(`!document.querySelector('.card[data-go="custom"]')`));

  // 匯入題庫（最外層）：選科目 → 冊/課列表 → 開始刷題 → 作答
  await js(`document.getElementById('subjectBtn').click()`);
  await sleep(300);
  check('科目頁分組列出科目',
    await js(`document.querySelectorAll('#subjectCards .subj-group').length >= 2
      && document.querySelectorAll('#subjectCards .card').length >= 3`),
    await js(`document.querySelectorAll('#subjectCards .subj-group').length + ' 組 / ' +
      document.querySelectorAll('#subjectCards .card').length + ' 卡'`));
  await js(`(function(){ var cs = Array.prototype.filter.call(
    document.querySelectorAll('#subjectCards .card'),
    function (c) { return (c.textContent || '').indexOf('匯入題庫') >= 0; });
    cs[0].click(); })()`);   // 依卡片名字找，不要用位置（下面還有家長／老師檢視那張）
  await sleep(400);
  check('科目頁最外層有家長／老師檢視入口',
    await js(`Array.prototype.some.call(document.querySelectorAll('#subjectCards .card'),
      function (c) { return (c.textContent || '').indexOf('家長／老師檢視') >= 0; })`));
  check('匯入題庫先出大選單', await js(`
    !document.getElementById('view-imphome').classList.contains('hidden')
    && document.querySelectorAll('#imphomeCards .card').length === 3`),
    String(await js(`document.getElementById('imphomeCards').textContent`)));
  await js(`(function(){ var b = Array.prototype.filter.call(
    document.querySelectorAll('#imphomeCards .card'),
    function (x) { return /做題/.test(x.textContent); })[0]; b.click(); })()`);
  await sleep(500);
  check('匯入題庫開得起來、列出科目列',
    await js(`!document.getElementById('view-custom').classList.contains('hidden')
      && document.querySelectorAll('#customSubjs .chip').length >= 5`),
    await js(`document.querySelectorAll('#customSubjs .chip').length + ' 科'`));
  await js(`(function(){ var b = Array.prototype.filter.call(
    document.querySelectorAll('#customSubjs .chip'),
    function (x) { return x.textContent.indexOf('社會') >= 0; })[0]; b.click(); })()`);
  await sleep(400);
  check('匯入題庫列出冊與課',
    await js(`document.querySelectorAll('#customBooks .chip').length >= 1
      && document.querySelectorAll('#customList .unit-item').length >= 3`),
    await js(`document.querySelectorAll('#customList .unit-item').length + ' 列'`));
  await js(`document.querySelectorAll('#customList .unit-item')[0].click()`);
  await sleep(500);
  check('匯入題庫開得起來（社會題）',
    await js(`!document.getElementById('view-quiz').classList.contains('hidden')
      && document.querySelectorAll('#quizOptions .q-opt').length >= 2`));
  check('匯入題庫出的是匯入的題', await js(`(window.QuizDebug.id() || '').indexOf('oc') === 0`),
    String(await js(`window.QuizDebug.id()`)));
  await js(`(function(){ var id = window.QuizDebug.id();
    var bank = id.indexOf('oc') === 0 ? window.APP_DATA.socialCustom : window.APP_DATA.social;
    var it = bank.filter(function(x){return x.id===id;})[0];
    document.querySelectorAll('#quizOptions .q-opt')[it.answer].click(); })()`);
  await sleep(400);
  check('社會題答對後出現解析',
    /正解/.test(await js(`document.getElementById('quizFeedback').textContent`)),
    (await js(`document.getElementById('quizFeedback').textContent`)).slice(0, 60));
  // 解析夠厚 → 自動生成確認題；太薄（例如只寫「見各選項說明」）→ 退回解析鎖，兩者都算對
  check('匯入題庫的題：追問確認題，解析太薄則退回解析鎖',
    await js(`(!document.getElementById('quizChk').classList.contains('hidden')
        && document.querySelectorAll('#quizChkOpts .q-opt').length === 4)
      || document.getElementById('quizNext').classList.contains('locked')`),
    await js(`document.getElementById('quizChkQ').textContent + ' | lock=' +
      document.getElementById('quizNext').classList.contains('locked')`));

  /* 自動生成的確認題：涵蓋率與格式（Tony 2026-08-27「想要套到所有題目去」） */
  console.log('自動生成的解析確認題');
  await js(`window.__ensureImportBanks(function(){ window.__chkReady = 1; })`);
  for (let i = 0; i < 60 && !(await js(`window.__chkReady`)); i++) await sleep(500);
  const chkStat = await js(`(function(){
    var cats = ['custom','socialCustom','mathCustom','englishCustom','science','social','math'];
    var out = { n: 0, made: 0, hand: 0, bad: 0, marker: 0, mk: '', sample: '' };
    cats.forEach(function (cat) {
      var bank = window.APP_DATA[cat] || [];
      var step = Math.max(1, Math.floor(bank.length / 300));
      for (var i = 0; i < bank.length; i += step) {
        var it = bank[i];
        if (!it) continue;
        out.n++;
        // 2026-08-29：Ｃ型停用後，覆蓋率要看「人工／依解析生成的確認題（APP_CHECKS）＋自動Ａ/Ｂ型」
        var c = (window.APP_CHECKS || {})[it.id];
        if (c) out.hand++;
        else c = window.ChkDebug.of(cat, it);
        if (!c) continue;
        out.made++;
        if (c.o.some(function (x) { return /[✅❌📚💡]/.test(x) || /^(正解|其他選項|課綱重點)[：:]/.test(x); })) {
          out.marker++; if (!out.mk) out.mk = it.id + ' ' + JSON.stringify(c.o);
        }
        var uniq = {}; c.o.forEach(function (x) { uniq[x] = 1; });
        var ok = c.q && c.o.length === 4 && Object.keys(uniq).length === 4 &&
          c.a >= 0 && c.a < 4 && c.o[c.a];
        if (!ok) { out.bad++; if (!out.sample) out.sample = it.id + ' ' + JSON.stringify(c); }
      }
    });
    return out;
  })()`);
  check('自動確認題格式全部合法（4 個不重複選項、答案索引有效）',
    chkStat.bad === 0, JSON.stringify(chkStat).slice(0, 220));
  console.log('    涵蓋率：' + chkStat.made + ' / ' + chkStat.n + ' = ' +
    Math.round(100 * chkStat.made / chkStat.n) + '%（抽樣）');
  check('確認題涵蓋率 ≥ 70%（人工／依解析生成 ＋ 自動Ａ/Ｂ型）',
    chkStat.made / chkStat.n >= 0.7,
    chkStat.made + ' / ' + chkStat.n + ' = ' + Math.round(100 * chkStat.made / chkStat.n) + '%');
  // 2026-08-29 Tony 回報：選項最前面出現 ✅❌📚，還有「✅ 正解：」開頭的選項其實是錯的
  check('選項不會帶著 ✅❌📚 或「正解：」這種排版記號',
    chkStat.marker === 0, chkStat.mk.slice(0, 200));
  // 俚語諺語與閱讀題本來沒有手寫確認題，現在改成自動生成（Tony 2026-08-27「套到所有題目去」）
  check('俚語諺語也生得出確認題（問這句話的意思）',
    await js(`(function(){
      var it = (window.APP_DATA.slang || [])[5];
      var c = it && window.ChkDebug.of('slang', it);
      return !!c && c.o.length === 4 && c.o[c.a] === it.meaning; })()`),
    (await js(`JSON.stringify(window.ChkDebug.of('slang', (window.APP_DATA.slang || [])[5]))`) || '').slice(0, 160));
  check('閱讀子題用該子題的解析生成（同一篇不同子題不會撞題）',
    await js(`(function(){
      var art = (window.APP_DATA.reading || []).filter(function (x) {
        return (x.questions || []).length >= 2 && x.questions[0].exp && x.questions[1].exp; })[0];
      if (!art) return true;
      var a = window.ChkDebug.of('reading', art, art.questions[0].exp, 0);
      var b = window.ChkDebug.of('reading', art, art.questions[1].exp, 1);
      return !a || !b || JSON.stringify(a) !== JSON.stringify(b); })()`));
  check('解析太短的題不硬生（維持解析鎖）',
    await js(`window.ChkDebug.of('custom', { id: '__t1', exp: '解析：見各選項說明。' }) === null
      && window.ChkDebug.of('custom', { id: '__t2', exp: '(Ｂ)被。' }) === null`));
  check('同一題每次生成的確認題都一樣（決定性）',
    await js(`(function(){
      var bank = window.APP_DATA.custom || [];
      var it = bank.filter(function (x) { return (x.exp || '').length > 60; })[3];
      if (!it) return true;
      var a = window.ChkDebug.of('custom', it);
      var b = window.ChkDebug.of('custom', it);
      return !!a && JSON.stringify(a) === JSON.stringify(b); })()`));

  await js(`window.QuizDebug.unlock(); document.getElementById('quizExit').click()`);
  await sleep(300);
  await js(`(function(){ var b = document.querySelector('.dlg-primary'); if (b) b.click(); })()`);
  await sleep(300);

  // 標題＝回最外層的科目選擇頁（Tony 2026-08-27：不然做完選不到其它科目）
  await js(`document.getElementById('homeLink').click()`);
  await sleep(300);
  check('點標題回到最外層的科目選擇頁',
    await js(`!document.getElementById('view-subject').classList.contains('hidden')`));

  // 單元學習：非國語改用「冊」分組，教學卡是重點卡
  await js(`window.NavDebug.go('home')`);
  await sleep(200);
  await js(`document.querySelector('.card[data-go="units"]').click()`);
  await sleep(400);
  check('社會單元學習切得出單元',
    await js(`document.querySelectorAll('#unitList .unit-item').length >= 5`),
    String(await js(`document.querySelectorAll('#unitList .unit-item').length`)));
  await js(`document.querySelectorAll('#unitList .unit-item')[0].click()`);
  await sleep(400);
  // 2026-08-22 起社會單元也有概念卡：有教材走概念卡，沒教材才退回舊的重點卡
  const socialView = await js(`(function(){
    if (!document.getElementById('view-read').classList.contains('hidden')) return 'read';
    if (!document.getElementById('view-concept').classList.contains('hidden')) return 'concept';
    if (!document.getElementById('view-lesson').classList.contains('hidden')) return 'lesson';
    return null; })()`);
  if (socialView === 'read') {
    // 2026-08-29 起：有課文的單元先進「課文帶讀」，讀完才接概念卡
    check('社會有課文的單元先進課文帶讀',
      (await js(`document.getElementById('readBody').textContent`)).length > 20 &&
      await js(`document.querySelectorAll('#readBody .read-s').length`) >= 3,
      '課文段落＋逐句');
    await js(`document.getElementById('readExit').click()`);
  } else if (socialView === 'concept') {
    check('社會有教材的單元進到概念卡',
      (await js(`document.getElementById('conceptBody').textContent`)).length > 10 &&
      await js(`!!document.querySelector('#conceptViz svg')`),
      '概念卡＋互動元件');
    await js(`document.getElementById('conceptExit').click()`);
  } else {
    check('社會教學卡顯示重點',
      /重點/.test(await js(`document.getElementById('lessonTag').textContent`)) &&
      (await js(`document.getElementById('lessonBody').textContent`)).length > 10,
      await js(`document.getElementById('lessonTag').textContent`));
    await js(`document.getElementById('lessonExit').click()`);
  }
  await sleep(300);
  await js(`(function(){ var b = document.querySelector('.dlg-primary'); if (b) b.click(); })()`);
  await sleep(200);

  // 每日練習：同日同科出同一組題，紀錄寫在 <日期>|social
  await js(`window.NavDebug.go('home')`);
  await sleep(200);
  await js(`document.querySelector('.card[data-go="daily"]').click()`);
  await sleep(600);
  check('社會每日練習出的是課綱自編題',
    await js(`!document.getElementById('view-quiz').classList.contains('hidden')
      && /^o\\d/.test(window.QuizDebug.id() || '')`),
    String(await js(`window.QuizDebug.id()`)));
  check('每日紀錄帶科目後綴', await js(`(function(){
    var d = (JSON.parse(localStorage.getItem('chinese-review-v1')).daily) || {};
    return Object.keys(d).some(function (k) { return k.indexOf('|social') > 0; });})()`),
    await js(`JSON.stringify(Object.keys((JSON.parse(localStorage.getItem('chinese-review-v1')).daily) || {}))`));
  // 故意答錯 → 進錯題本，切回國語後錯題本不該出現社會題
  await js(`(function(){ var id = window.QuizDebug.id();
    var bank = id.indexOf('oc') === 0 ? window.APP_DATA.socialCustom : window.APP_DATA.social;
    var it = bank.filter(function(x){return x.id===id;})[0];
    var wrong = it.answer === 0 ? 1 : 0;
    document.querySelectorAll('#quizOptions .q-opt')[wrong].click(); })()`);
  await sleep(400);
  await js(`document.getElementById('quizExit').click(); (function(){ var b = document.querySelector('.dlg-primary'); if (b) b.click(); })()`);
  await sleep(400);
  check('社會答錯進錯題本', await js(`(function(){
    var w = (JSON.parse(localStorage.getItem('chinese-review-v1')).wrong) || [];
    return w.some(function (x) { return x.t === 'social' || x.t === 'socialCustom'; });})()`),
    await js(`JSON.stringify((JSON.parse(localStorage.getItem('chinese-review-v1')).wrong) || [])`));
  await js(`window.NavDebug.go('home')`);
  await sleep(200);
  await js(`document.querySelector('.card[data-go="wrongbook"]').click()`);
  await sleep(400);
  const wbSocial = await js(`document.getElementById('wrongList').textContent.length`);
  check('社會錯題本看得到題目', wbSocial > 10, String(wbSocial));
  // 切回國語 → 錯題本應該是空的（各科分開）
  await js(`(function(){ var s = JSON.parse(localStorage.getItem('chinese-review-v1')); s.subject = 'chinese';
    localStorage.setItem('chinese-review-v1', JSON.stringify(s)); })()`);
  await js(`location.reload()`);
  await sleep(2500);
  await js(`window.NavDebug.go('home')`);
  await sleep(200);
  await js(`document.querySelector('.card[data-go="wrongbook"]').click()`);
  await sleep(400);
  check('切回國語後錯題本不含社會題',
    /沒有錯題/.test(await js(`document.getElementById('wrongList').textContent`)),
    (await js(`document.getElementById('wrongList').textContent`)).slice(0, 60));
});

/* ---------- 6. 題目附圖（img 欄位）：搜尋看得到、做題時也看得到 ---------- */
console.log('題目附圖');
await session(8736, 9336, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grades: [5], stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [], subject: 'science' }));` },
async (js) => {
  await js(`window.__ensureImportBanks && window.__ensureImportBanks()`);
  for (let i = 0; i < 60 && !(await js(`(window.APP_DATA.scienceCustom || []).length > 0`)); i++) await sleep(250);
  const withImg = await js(`(window.APP_DATA.scienceCustom || []).filter(function (x) { return x.img; }).length`);
  check('自然題庫有附圖的題', withImg > 0, String(withImg));
  await js(`window.NavDebug.go('home')`);
  await sleep(200);
  await js(`document.getElementById('homeSearch').click()`);
  await sleep(300);
  await js(`(function(){ var i = document.getElementById('searchInput');
    i.value = '太陽四季運行軌跡圖'; i.dispatchEvent(new Event('input')); })()`);
  // 搜尋範圍內的題庫是動態載入的（2026-08-27 起首頁只載國語核心），
  // 打了關鍵字才開始抓各科與匯入題庫，載完會自動重搜一次 —— 等它就緒再驗。
  for (let i = 0; i < 60 && !(await js(`!!window.__searchBanksReady`)); i++) await sleep(250);
  await sleep(400);
  const hits = await js(`document.querySelectorAll('#searchResults .s-item').length`);
  check('搜尋找得到附圖的題', hits > 0, String(hits));
  await js(`document.querySelector('#searchResults .s-item').click()`);
  await sleep(400);
  check('搜尋結果展開後看得到附圖',
    await js(`!!document.querySelector('#searchResults .q-fig-img')`),
    await js(`document.querySelector('#searchResults .s-detail') ? 'detail 有開但沒圖' : 'detail 沒開'`));
  await js(`(function(){ var b = Array.prototype.slice.call(document.querySelectorAll('#searchResults button'))
    .filter(function (x) { return /做這題/.test(x.textContent); })[0]; if (b) b.click(); })()`);
  await sleep(500);
  check('做題畫面顯示題目附圖',
    await js(`!document.getElementById('quizFig').classList.contains('hidden')
      && !!document.querySelector('#quizFig .q-fig-img')`));
  await js(`document.querySelector('#quizFig .q-fig-img').click()`);
  await sleep(200);
  check('點圖可放大（lightbox）', await js(`!!document.querySelector('.lightbox img')`));
  await js(`document.querySelector('.lightbox').click()`);
  await sleep(200);
  check('點一下關掉 lightbox', await js(`!document.querySelector('.lightbox')`));
});

/* ---------- 5. 家長儀表板跨科合併（daily key 帶科目後綴也要看得到） ---------- */
console.log('家長儀表板跨科合併');
const SEED_MULTI = `(function(){
  var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
  var t = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  var mk = function (firstOk, total) {
    return { done: true, firstOk: firstOk, total: total, ms: 600000, rounds: 1, grade: 5,
      gradesTxt: '五年級', finishedAt: Date.now(), wrong: [] };
  };
  var daily = {}; daily[t] = mk(18, 20); daily[t + '|social'] = mk(8, 10);
  localStorage.setItem('chinese-review-v1', JSON.stringify({
    phon: 'zhuyin', grades: [5], stats: {}, streak: { last: '', days: 0 },
    leitner: {}, wrong: [], subject: 'chinese', daily: daily }));
})();`;
await session(8735, 9335, { blockWriter: true, seed: SEED_MULTI }, async (js) => {
  await js(`document.querySelector('.card[data-go="progress"]').click()`);
  await sleep(300);
  await js(`document.querySelector('#progBody .pt-open').click()`);
  await sleep(400);
  const head = await js(`document.querySelector('#parentBody .pt-head').textContent`);
  check('家長頁把各科每日練習加總（18+8 / 20+10）', /26 \/ 30/.test(head), head.slice(0, 120));
  check('家長頁認得帶科目的紀錄＝今日已完成', /今日每日練習已完成/.test(head), head.slice(0, 80));
  const ovTxt = await js(`document.querySelector('#parentBody .pt-tbl').textContent`);
  check('學習總覽表列出每一科與全部總計',
    /國語/.test(ovTxt) && /社會/.test(ovTxt) && /全部總計/.test(ovTxt), ovTxt.slice(0, 120));
  check('學習總覽表把每日練習列成獨立一項', /每日練習/.test(ovTxt), ovTxt.slice(0, 120));
  // 點今天那格看細節：應列出國語與社會兩科
  await js(`(function(){ var c = document.querySelectorAll('#parentBody .cal-cell');
    c[c.length - 1].click(); })()`);
  await sleep(300);
  const detail = await js(`document.querySelector('#parentBody .daily-detail').textContent`);
  check('日細節列出當天練了哪幾科', /國語/.test(detail) && /社會/.test(detail), detail.slice(0, 120));
  // 進度頁（單科視角）仍只算目前科目：國語 18/20
  await js(`document.getElementById('parentExit').click()`);
  await sleep(300);
  const cal = await js(`document.querySelector('#progBody .daily-cal').textContent`);
  check('進度頁日曆仍是單科視角（今日有完成）', /✅/.test(cal), cal.slice(-20));
});

/* ---------- 7. 數學／英文（只有原創題庫、自創題庫還空著）：卡片要出得來、每日練習要出原創題 ---------- */
for (const [subj, label, idRe, port] of [['math', '數學', '^m\\d', 8738], ['english', '英文', '^e\\d', 8740]]) {
  console.log(label + '科');
  await session(port, port + 600, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
    phon: 'zhuyin', grades: [5], stats: {}, streak: { last: '', days: 0 }, leitner: [], wrong: [], subject: '${subj}' }));` },
  async (js) => {
    check(label + '原創題庫載得到', await js(`(window.APP_DATA.${subj} || []).length >= 100`),
      String(await js(`(window.APP_DATA.${subj} || []).length`)));
    check(label + '自創題庫是空的（還沒收到題本）',
      await js(`Array.isArray(window.APP_DATA.${subj}Custom) && window.APP_DATA.${subj}Custom.length === 0`));
    await js(`window.NavDebug.go('home')`);
    await sleep(300);
    // 有原創題就不該再顯示「題庫建置中」，功能卡要出得來
    check(label + '首頁不再顯示題庫建置中',
      await js(`document.getElementById('homePlaceholder').classList.contains('hidden')`),
      await js(`document.getElementById('homePlaceholder').textContent.slice(0, 40)`));
    check(label + '功能卡出得來',
      await js(`!document.querySelector('#view-home .cards').classList.contains('hidden')`));
    check(label + '國語專屬卡片有隱藏',
      await js(`Array.prototype.every.call(document.querySelectorAll('#view-home .card[data-cn]'),
        function (c) { return c.classList.contains('hidden'); })`));
    // 每日練習出的必須是原創題庫的題（id 前綴）
    await js(`document.querySelector('.card[data-go="daily"]').click()`);
    await sleep(600);
    check(label + '每日練習出的是課綱自編題',
      await js(`!document.getElementById('view-quiz').classList.contains('hidden')
        && /${idRe}/.test(window.QuizDebug.id() || '')`),
      String(await js(`window.QuizDebug.id()`)));
    check('每日紀錄帶 |' + subj + ' 後綴', await js(`(function(){
      var d = (JSON.parse(localStorage.getItem('chinese-review-v1')).daily) || {};
      return Object.keys(d).some(function (k) { return k.indexOf('|${subj}') > 0; });})()`),
      await js(`JSON.stringify(Object.keys((JSON.parse(localStorage.getItem('chinese-review-v1')).daily) || {}))`));
    // 單元學習：7 個單元都要切得出來
    await js(`window.NavDebug.go('home')`);
    await sleep(200);
    await js(`document.querySelector('.card[data-go="units"]').click()`);
    await sleep(400);
    check(label + '單元學習切得出課綱單元',
      await js(`document.querySelectorAll('#unitList .unit-item').length >= 7`),
      String(await js(`document.querySelectorAll('#unitList .unit-item').length`)));
    check(label + '單元照段考分組（每 3 單元一次段考）',
      await js(`document.querySelectorAll('#unitList .exam-head').length >= 2
        && /段考/.test(document.querySelector('#unitList .exam-head').textContent)`),
      await js(`document.querySelectorAll('#unitList .exam-head').length + ' 個段考標題'`));
    check(label + '單元標題用課綱單元名稱（不是「第 N 單元」而已）',
      await js(`/單元/.test(document.querySelector('#unitList .unit-item b').textContent)
        && document.querySelector('#unitList .unit-item b').textContent.length > 8`),
      await js(`document.querySelector('#unitList .unit-item b').textContent`));
    // 年級過濾：切到還沒有題目的年級，不可以把別的年級的題端出來
    await js(`window.NavDebug.go('home')`);
    await sleep(200);
    const g = await js(`(function(){
      var grades = (window.APP_DATA.${subj} || []).map(function (x) { return x.grade; });
      var other = 0; for (var i = 1; i <= 12; i++) if (grades.indexOf(i) < 0) { other = i; break; }
      if (!other) return -1;                       // 12 個年級都有題了就跳過這項
      document.getElementById('rangeBar').click();     // 開「學習範圍」面板
      var chips = document.querySelectorAll('#gradePanel .gp-quick .chip');
      chips[other - 1].click();                        // 主要年級換成沒題目的那一個
      return other; })()`);
    if (g > 0) {
      await sleep(400);
      check(label + '沒題目的年級不會端出別年級的題',
        await js(`document.getElementById('homePlaceholder')
          && !document.getElementById('homePlaceholder').classList.contains('hidden')`),
        await js(`String((window.APP_DATA.${subj} || []).length) + ' 題但年級不符'`));
    }
  });
}

/* ---------- 8. 返回鍵／科目頁分組與年級（2026-08-20 Tony 回報的 5 點） ---------- */
console.log('返回鍵與科目頁');
await session(8742, 9342, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grades: [5], stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [], subject: 'chinese' }));` },
async (js) => {
  const view = `(function(){ var v = ['subject','home','quiz','units','custom','drill','wrongbook','progress'];
    for (var i = 0; i < v.length; i++) if (!document.getElementById('view-' + v[i]).classList.contains('hidden')) return v[i];
    return null; })()`;
  check('進站停在科目頁', await js(view) === 'subject', String(await js(view)));

  // 科目頁：五年級只列有題的科目，高中分科要被收起來
  check('科目卡分組顯示',
    await js(`document.querySelectorAll('#subjectCards .subj-group').length >= 2`),
    String(await js(`document.querySelectorAll('#subjectCards .subj-group').length`)));
  // 2026-09-01：科目頁最外層多了「歷屆學測」卡，不能再用卡片總數判斷，改看有沒有高中分科出現
  check('五年級看不到高中分科（物理等）',
    await js(`!/物理|化學|生物|地球科學|公民|地理|歷史/.test(
      Array.prototype.map.call(document.querySelectorAll('#subjectCards .card-title'),
        function (x) { return x.textContent; }).join(','))`),
    await js(`Array.prototype.map.call(document.querySelectorAll('#subjectCards .card-title'),
      function (x) { return x.textContent; }).join(',')`));
  check('科目卡題數是「這個年級的題數」，不是全庫題數',
    await js(`(function(){ var c = document.querySelectorAll('#subjectCards .card');
      for (var i = 0; i < c.length; i++) {
        if (c[i].querySelector('.card-title').textContent !== '數學') continue;
        // 數學主題庫已改成點進去才載，卡片題數來自 js/data/counts.js；
        // 清單與真實題庫是否一致由 test/test.js 把關（對不上會直接測試失敗）
        var mc = (window.APP_COUNTS || {}).math || { grades: {} };
        var n = (window.APP_DATA.math || []).length
          ? (window.APP_DATA.math || []).filter(function (x) { return x.grade === 5; }).length
          : ((mc.grades[5] || {})['全'] || 0);
        return c[i].querySelector('.card-sub').textContent.indexOf(n + ' 題') === 0;
      } return false; })()`),
    await js(`Array.prototype.map.call(document.querySelectorAll('#subjectCards .card-sub'),
      function (x) { return x.textContent; }).join(' | ')`));
  // 「顯示全部科目」開關 → 高中分科出現且淡化
  await js(`document.querySelector('#subjectCards .subj-toggle').click()`);
  await sleep(200);
  check('顯示全部科目後高中分科出現且淡化',
    await js(`(function(){ var c = document.querySelectorAll('#subjectCards .card');
      for (var i = 0; i < c.length; i++) {
        if (c[i].querySelector('.card-title').textContent !== '生物') continue;
        return c[i].classList.contains('card-dim');
      } return false; })()`));
  // 點沒題的科目 → 問要不要切年級 → 確定後切到高中並進入該科
  await js(`(function(){ var c = document.querySelectorAll('#subjectCards .card');
    for (var i = 0; i < c.length; i++) {
      if (c[i].querySelector('.card-title').textContent === '生物') { c[i].click(); return; } } })()`);
  await sleep(300);
  check('點本年級沒題的科目會問要不要切年級',
    /生物/.test(await js(`(document.querySelector('.dlg-msg') || {}).textContent || ''`)),
    await js(`(document.querySelector('.dlg-msg') || {}).textContent || '(沒有對話框)'`));
  await js(`document.querySelector('.dlg-primary').click()`);
  await sleep(400);
  check('切年級後進得去生物且不是空白頁',
    await js(view) === 'home' &&
    await js(`document.getElementById('homePlaceholder').classList.contains('hidden')`) &&
    await js(`JSON.parse(localStorage.getItem('chinese-review-v1')).grade === 10`),
    await js(`String(JSON.parse(localStorage.getItem('chinese-review-v1')).grade)`));

  // 返回鍵：首頁 → 單元學習 → 返回應回首頁，再返回回科目頁（不是直接離站）
  await js(`document.querySelector('.card[data-go="units"]').click()`);
  await sleep(400);
  check('進得了單元學習', await js(view) === 'units', String(await js(view)));
  await js(`history.back()`);
  await sleep(400);
  check('按返回退回首頁（不是離站）', await js(view) === 'home', String(await js(view)));
  await js(`history.back()`);
  await sleep(400);
  check('再按返回退回科目頁', await js(view) === 'subject', String(await js(view)));
  // 返回鍵也要能離開測驗（從首頁進測驗，返回就回首頁）
  await js(`window.NavDebug.go('home')`);
  await sleep(300);
  await js(`document.querySelector('.card[data-go="daily"]').click()`);
  await sleep(700);
  check('每日練習開得起來', await js(view) === 'quiz', String(await js(view)));
  await js(`history.back()`);
  await sleep(400);
  check('測驗中按返回退回首頁', await js(view) === 'home', String(await js(view)));
});

/* ---------- 9. 學習範圍：第一次進站選年級、常駐範圍列、主要年級＋加練年級 ---------- */
console.log('學習範圍');
const VIEW = `(function(){ var v = ['welcome','subject','home','quiz','units','custom'];
  for (var i = 0; i < v.length; i++) if (!document.getElementById('view-' + v[i]).classList.contains('hidden')) return v[i];
  return null; })()`;
// 9a. 全新使用者（localStorage 空的）
await session(8744, 9344, { blockWriter: true, seed: `localStorage.removeItem('chinese-review-v1');` },
async (js) => {
  check('第一次進站先問年級', await js(VIEW) === 'welcome', String(await js(VIEW)));
  check('選年級時不顯示學習範圍列',
    await js(`document.getElementById('rangeBar').classList.contains('hidden')`));
  check('先選學段（三個）', await js(`document.querySelectorAll('#wcStages .wc-btn').length === 3`),
    String(await js(`document.querySelectorAll('#wcStages .wc-btn').length`)));
  check('還沒選學段就沒有年級鈕', await js(`document.querySelectorAll('#wcGrades .wc-btn').length === 0`));
  await js(`document.querySelectorAll('#wcStages .wc-btn')[1].click()`);   // 國中
  await sleep(200);
  check('選了國中出現三個年級', await js(`document.querySelectorAll('#wcGrades .wc-btn').length === 3`),
    await js(`Array.prototype.map.call(document.querySelectorAll('#wcGrades .wc-btn'),
      function (x) { return x.textContent; }).join(',')`));
  await js(`document.querySelectorAll('#wcGrades .wc-btn')[0].click()`);   // 國一
  await sleep(400);
  check('選完年級進科目頁', await js(VIEW) === 'subject', String(await js(VIEW)));
  check('主要年級記成國一、範圍只有國一',
    await js(`(function(){ var s = JSON.parse(localStorage.getItem('chinese-review-v1'));
      return s.grade === 7 && s.grades.join(',') === '7' && s.onboarded === true; })()`),
    await js(`JSON.stringify(JSON.parse(localStorage.getItem('chinese-review-v1')).grades)`));
  check('學習範圍列常駐且寫著國一',
    await js(`!document.getElementById('rangeBar').classList.contains('hidden')`) &&
    /國一/.test(await js(`document.getElementById('rangeBar').textContent`)),
    await js(`document.getElementById('rangeBar').textContent`));
  // 範圍列點下去＝開年級面板；改主要年級後科目卡跟著換
  await js(`document.getElementById('rangeBar').click()`);
  await sleep(200);
  check('點範圍列打得開年級面板',
    await js(`!document.getElementById('gradePanel').classList.contains('hidden')
      && document.querySelectorAll('#gradePanel .gp-quick:not(.gp-term) .chip').length === 12`),
    String(await js(`document.querySelectorAll('#gradePanel .gp-quick:not(.gp-term) .chip').length`)));
  await js(`document.querySelectorAll('#gradePanel .gp-quick:not(.gp-term) .chip')[9].click()`);   // 高一
  await sleep(300);
  check('改主要年級後範圍列與科目卡跟著換',
    /高一/.test(await js(`document.getElementById('rangeBar').textContent`)) &&
    await js(`Array.prototype.map.call(document.querySelectorAll('#subjectCards .card-title'),
      function (x) { return x.textContent; }).indexOf('物理') >= 0`),
    await js(`document.getElementById('rangeBar').textContent`));
  /* 學期（2026-08-26 Tony：「沒有分上下學期，例如小五會有五上和五下」）。
     題庫本來就分冊，這裡驗的是「選了學期之後真的只出那一冊」。 */
  await js(`document.getElementById('rangeBar').click()`);
  await sleep(200);
  check('學期有三顆晶片：整年／十上／十下',
    await js(`Array.prototype.map.call(document.querySelectorAll('#gradePanel .gp-term .chip'),
      function (x) { return x.textContent; }).join(',')`) === '整年,十上,十下',
    await js(`Array.prototype.map.call(document.querySelectorAll('#gradePanel .gp-term .chip'),
      function (x) { return x.textContent; }).join(',')`));
  /* 用「物理」這張卡驗：高一物理全是原創題、每一題都有冊，
     所以整年 = 上 + 下，上下各一半。
     ⚠️ 不要拿「所有科目題數相加」來驗：匯入題庫有些題沒有 book，
     那些題在任何學期都會出現，加起來自然不等於整年（實測 全6104 / 上3512 / 下3512）。 */
  const termCounts = await js(`(function () {
    /* 卡片副標長這樣：「576 題 · 高一」，開頭就是數字，
       直接 parseInt 即可。⚠️ 不要在這裡寫 /(\\d+)/ 這種正規表示式：
       這整段是包在樣板字串裡送進瀏覽器的，\\d 會先被樣板字串吃掉變成 d，
       regex 就永遠比對不到（2026-08-26 在這裡踩過一次）。 */
    function physics() {
      var cards = document.querySelectorAll('#subjectCards .card');
      for (var i = 0; i < cards.length; i++) {
        var t = cards[i].querySelector('.card-title');
        var sub = cards[i].querySelector('.card-sub');
        if (t && sub && t.textContent === '物理') {
          var n = parseInt(sub.textContent, 10);
          return isNaN(n) ? ('NONUM:' + sub.textContent) : n;
        }
      }
      return 'NOCARD';
    }
    var out = {};
    ['整年', '十上', '十下'].forEach(function (name) {
      var chips = document.querySelectorAll('#gradePanel .gp-term .chip');
      for (var i = 0; i < chips.length; i++) {
        if (chips[i].textContent === name) { chips[i].click(); break; }
      }
      out[name] = physics();
      document.getElementById('rangeBar').click();
    });
    return JSON.stringify(out);
  })()`);
  const tc = JSON.parse(termCounts);
  check('選上／下學期後物理題數各一半，相加等於整年',
    tc['整年'] > 0 && tc['十上'] > 0 && tc['十下'] > 0 &&
    tc['十上'] === tc['十下'] && (tc['十上'] + tc['十下']) === tc['整年'],
    termCounts);
  /* 切回整年，後面的斷言才不會被學期過濾影響 */
  await js(`(function () {
    var chips = document.querySelectorAll('#gradePanel .gp-term .chip');
    for (var i = 0; i < chips.length; i++) if (chips[i].textContent === '整年') { chips[i].click(); return; }
  })()`);
  await sleep(250);
  check('學期預設回到整年', await js(`JSON.parse(localStorage.getItem('chinese-review-v1')).term`) === '全',
    String(await js(`JSON.parse(localStorage.getItem('chinese-review-v1')).term`)));
  await js(`document.getElementById('rangeBar').click()`);
  await sleep(200);

  // 加練年級：多勾一個年級，範圍要含兩個年級，但主要年級不變
  await js(`document.querySelector('#gradePanel .gp-more').click()`);
  await sleep(200);
  await js(`(function(){ var cb = document.querySelectorAll('#gradePanel .gp-grid input');
    cb[10].checked = true; cb[10].dispatchEvent(new Event('change')); })()`);   // 加練高二
  await sleep(300);
  check('加練年級加得進去、主要年級不變',
    await js(`(function(){ var s = JSON.parse(localStorage.getItem('chinese-review-v1'));
      return s.grade === 10 && s.grades.join(',') === '10,11'; })()`),
    await js(`JSON.stringify([JSON.parse(localStorage.getItem('chinese-review-v1')).grade,
      JSON.parse(localStorage.getItem('chinese-review-v1')).grades])`));
  check('範圍列標出加練的年級', /加練/.test(await js(`document.getElementById('rangeBar').textContent`)),
    await js(`document.getElementById('rangeBar').textContent`));
  check('主要年級那格不能取消（一定在範圍內）',
    await js(`document.querySelectorAll('#gradePanel .gp-grid input')[9].disabled === true`));
});
// 9b. 舊使用者（多選年級的舊資料）：不再被問年級，範圍照舊
await session(8745, 9345, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grades: [3, 4, 5], stats: {}, streak: { last: '', days: 0 },
  leitner: {}, wrong: [], subject: 'chinese' }));` },
async (js) => {
  check('舊使用者不會被重問年級', await js(VIEW) === 'subject', String(await js(VIEW)));
  check('舊的多選年級轉成「主要小五＋加練小三小四」，過濾範圍不變',
    await js(`(function(){ var s = JSON.parse(localStorage.getItem('chinese-review-v1'));
      return s.grade === 5 && s.extra.slice().sort().join(',') === '3,4' && s.grades.join(',') === '3,4,5'; })()`),
    await js(`JSON.stringify(JSON.parse(localStorage.getItem('chinese-review-v1')).grades)`));
  check('範圍列同時寫出主要年級與加練年級',
    /小五/.test(await js(`document.getElementById('rangeBar').textContent`)) &&
    /加練/.test(await js(`document.getElementById('rangeBar').textContent`)),
    await js(`document.getElementById('rangeBar').textContent`));
  // 測驗中不顯示範圍列
  await js(`window.NavDebug.go('home')`);
  await sleep(300);
  await js(`document.querySelector('.card[data-go="daily"]').click()`);
  await sleep(700);
  check('測驗中不顯示學習範圍列',
    await js(VIEW) === 'quiz' && await js(`document.getElementById('rangeBar').classList.contains('hidden')`),
    String(await js(VIEW)));
  await js(`history.back()`);
  await sleep(400);
  check('離開測驗後範圍列回來',
    await js(`!document.getElementById('rangeBar').classList.contains('hidden')`));
});

/* ---------- 10. 概念卡：有教材的單元走「教學→立即檢核→測驗」 ---------- */
console.log('概念卡（單元教學層）');
const VIEW2 = `(function(){ var v = ['welcome','subject','home','quiz','units','concept','lesson'];
  for (var i = 0; i < v.length; i++) if (!document.getElementById('view-' + v[i]).classList.contains('hidden')) return v[i];
  return null; })()`;
// 全新使用者（一個單元都沒做過）：2026-08-21 起單元不上鎖，第 8 單元要能直接點進去
await session(8746, 9346, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grade: 3, extra: [], grades: [3], onboarded: true, subject: 'math',
  unitGrade: 3, unitBook: '三上', stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [],
  units: {} }));` },
async (js) => {
  await js(`window.NavDebug.go('home')`);
  await sleep(300);
  await js(`document.querySelector('.card[data-go="units"]').click()`);
  await sleep(600);
  check('數學三上進得了單元學習', await js(VIEW2) === 'units', String(await js(VIEW2)));
  const badged = await js(`(function(){ var n = 0;
    document.querySelectorAll('#unitList .unit-item').forEach(function (b) { if (b.querySelector('.unit-badge')) n++; });
    return n; })()`);
  // 期望值從 APP_LESSONS 讀，不要寫死——每補一冊概念卡這個數字就會變
  const decks = await js(`Object.keys(window.APP_LESSONS || {})
    .filter(function (k) { return k.indexOf('math|三上|') === 0; }).length`);
  check('有教材的單元都標出「教材」徽章', badged === decks && badged > 0,
    '有徽章 ' + badged + ' 個 / 有教材 ' + decks + ' 個');
  // Tony 2026-08-21：「全部都不要鎖，以後不用再鎖」——一個都沒做過時也不能有鎖頭
  check('單元一律不上鎖（沒有 🔒、沒有 locked）', await js(`(function(){
    var bad = 0;
    document.querySelectorAll('#unitList .unit-item').forEach(function (b) {
      if (b.classList.contains('locked') || /🔒/.test(b.textContent)) bad++; });
    return bad; })()`) === 0);
  // 記下點的是哪一個單元，後面的期望值（卡數、正解位置）都從它的資料算，不寫死
  await js(`(function(){ var t = null;
    document.querySelectorAll('#unitList .unit-item').forEach(function (b) {
      if (b.querySelector('.unit-badge')) t = b; });
    if (t) {
      var name = t.querySelector('b').textContent.replace(/^[✅▶️]+\\s*/, '').replace(/\\s*教材\\s*$/, '').trim();
      window.__smokeDeck = window.APP_LESSONS['math|三上|' + name] || null;
      window.__smokeText = (window.APP_TEXTS || {})['math|三上|' + name] || null;
      t.click();
    } })()`);
  await sleep(500);
  // 2026-08-30 起數學也有課文帶讀：有課文的單元先讀完課文才接概念卡
  if (await js(`!document.getElementById('view-read').classList.contains('hidden')`)) {
    const rsegs = await js(`(window.__smokeText ? window.__smokeText.segs.length : 0)`);
    check('數學有課文的單元先進課文帶讀',
      rsegs > 0 && await js(`document.querySelectorAll('#readDots .cdot').length`) === rsegs &&
      await js(`document.querySelectorAll('#readBody .read-s').length`) >= 3, '段數 ' + rsegs);
    for (let i = 0; i < rsegs; i++) {
      await js(`(function(){ var a = window.__smokeText.segs[${i}].q.answer;
        var o = document.querySelectorAll('#readCheck .ck-opt'); if (o[a]) o[a].click(); })()`);
      await sleep(180);
      await js(`document.getElementById('readNext').click()`);
      await sleep(320);
    }
  }
  check('點有教材的單元進到概念卡（不是題目劇透）', await js(VIEW2) === 'concept', String(await js(VIEW2)));
  check('概念卡畫出互動元件（SVG）',
    await js(`!!document.querySelector('#conceptViz svg')`));
  check('第一張卡有立即檢核題',
    await js(`document.querySelectorAll('#conceptCheck .ck-opt').length`) === 4);
  check('還沒答對前「下一個」不是主要按鈕',
    await js(`document.getElementById('conceptNext').className`) === 'btn-ghost');
  // 答錯 → 出現針對該迷思的說明（正解是第幾個從資料讀，不寫死）
  await js(`(function(){ var a = window.__smokeDeck.cards[0].check.answer;
    var o = document.querySelectorAll('#conceptCheck .ck-opt');
    for (var i = 0; i < o.length; i++) if (i !== a) { o[i].click(); return; } })()`);
  await sleep(200);
  const ngText = await js(`(document.querySelector('#conceptCheck .ck-fb') || {}).textContent || ''`);
  check('答錯給的是針對迷思的解釋，不是只說錯', /❌/.test(ngText) && ngText.length > 12, ngText.slice(0, 40));
  // 答對 → 綠燈、可以往下
  await js(`document.querySelectorAll('#conceptCheck .ck-opt')[window.__smokeDeck.cards[0].check.answer].click()`);
  await sleep(200);
  check('答對後標綠並解鎖下一步',
    await js(`/✅/.test((document.querySelector('#conceptCheck .ck-fb') || {}).textContent || '')`) &&
    await js(`document.getElementById('conceptNext').className`) === 'btn-primary');
  const nCards = await js(`document.querySelectorAll('#conceptDots .cdot').length`);
  const wantCards = await js(`window.__smokeDeck.cards.length`);
  check('概念卡張數與資料一致', nCards === wantCards, nCards + ' / 應為 ' + wantCards);
  for (let i = 0; i < nCards - 1; i++) { await js(`document.getElementById('conceptNext').click()`); await sleep(150); }
  check('最後一張的按鈕變成進測驗',
    /測驗/.test(await js(`document.getElementById('conceptNext').textContent`)),
    await js(`document.getElementById('conceptNext').textContent`));
  await js(`document.getElementById('conceptNext').click()`);
  await sleep(600);
  check('概念卡看完接單元測驗', await js(VIEW2) === 'quiz', String(await js(VIEW2)));
});

/* ---------- 11. 課文帶讀：讀懂一段才解鎖下一段 ---------- */
console.log('課文帶讀（教材層第一段）');
await session(8749, 9349, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grade: 8, extra: [], grades: [8], onboarded: true, subject: 'social',
  unitGrade: 8, unitBook: '八上', stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [],
  units: {} }));` },
async (js) => {
  await js(`window.NavDebug.go('home')`);
  await sleep(300);
  await js(`document.querySelector('.card[data-go="units"]').click()`);
  await sleep(900);
  const picked = await js(`(function(){ var t = null;
    document.querySelectorAll('#unitList .unit-item').forEach(function (b) {
      if (/自然環境/.test(b.textContent)) t = b; });
    if (!t) return false;
    window.__smokeText = window.APP_TEXTS['social|八上|第1單元 地理：中國的自然環境'];
    t.click(); return true; })()`);
  const inRead = await js(`!document.getElementById('view-read').classList.contains('hidden')`);
  check('有課文的單元先進「課文帶讀」', picked === true && inRead === true);
  const segs = await js(`window.__smokeText.segs.length`);
  check('段落數與資料一致', await js(`document.querySelectorAll('#readDots .cdot').length`) === segs);
  check('句子是一句一句可點的', await js(`document.querySelectorAll('#readBody .read-s').length`) ===
    await js(`window.__smokeText.segs[0].s.length`));
  check('還沒讀懂前「下一段」是鎖住的',
    await js(`document.getElementById('readNext').disabled`) === true);
  // 答錯 → 就地說明；答對 → 解鎖
  await js(`(function(){ var a = window.__smokeText.segs[0].q.answer;
    var o = document.querySelectorAll('#readCheck .ck-opt');
    for (var i = 0; i < o.length; i++) if (i !== a) { o[i].click(); return; } })()`);
  await sleep(200);
  check('答錯有針對性的說明', /❌/.test(await js(`(document.querySelector('#readCheck .ck-fb')||{}).textContent||''`)));
  check('答錯後仍然鎖住', await js(`document.getElementById('readNext').disabled`) === true);
  await js(`document.querySelectorAll('#readCheck .ck-opt')[window.__smokeText.segs[0].q.answer].click()`);
  await sleep(200);
  check('答對後解鎖下一段', await js(`document.getElementById('readNext').disabled`) === false);
  // 詞語解釋不會跟著翻到下一段
  await js(`(function(){ var t = document.querySelectorAll('#readTerms .read-term'); if (t[0]) t[0].click(); })()`);
  await sleep(150);
  check('點詞看得到解釋', await js(`document.querySelectorAll('.read-termd').length`) >= 1);
  await js(`document.getElementById('readNext').click()`);
  await sleep(400);
  check('翻到下一段時上一段的詞語解釋會收掉',
    await js(`document.querySelectorAll('.read-termd').length`) === 0);
  // 全部讀完 → 進概念卡
  for (let i = 1; i < segs; i++) {
    await js(`(function(){ var a = window.__smokeText.segs[${i}].q.answer;
      var o = document.querySelectorAll('#readCheck .ck-opt'); if (o[a]) o[a].click(); })()`);
    await sleep(180);
    await js(`document.getElementById('readNext').click()`);
    await sleep(320);
  }
  check('課文讀完接概念卡',
    await js(`!document.getElementById('view-concept').classList.contains('hidden')`));
  check('這一段流程沒有未捕捉的 JS 錯誤', (await js(`(window.__errs || []).join(' | ')`)) === '',
    await js(`(window.__errs || []).join(' | ')`));
});

/* ---------- 12. 匯入題庫：自己的錯題本與進度分析 ---------- */
console.log('匯入題庫（獨立區）');
await session(8751, 9351, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grade: 8, extra: [], grades: [8], onboarded: true, subject: 'social',
  unitGrade: 8, unitBook: '八上', streak: { last: '', days: 0 }, leitner: {},
  stats: { socialCustom: { n: 40, ok: 31 } },
  drillPos: { 'socialCustom|五上': 60 },
  wrong: [{ t: 'socialCustom', id: 'oc1505000242', n: 2, added: Date.now(), lastWrong: Date.now() }],
  units: {} }));` },
async (js) => {
  await js(`window.NavDebug.go('subject')`);
  await sleep(400);
  await js(`(function(){ var b = [].slice.call(document.querySelectorAll('#view-subject button, #view-subject .card'))
    .filter(function(x){ return /匯入題庫/.test(x.textContent); })[0]; if (b) b.click(); })()`);
  await sleep(3500);
  check('匯入題庫先出大選單（做題／錯題本／進度分析）',
    await js(`document.querySelectorAll('#imphomeCards .card').length`) === 3,
    String(await js(`document.getElementById('imphomeCards').textContent`)));
  await js(`(function(){ var b=[].slice.call(document.querySelectorAll('#imphomeCards .card'))
    .filter(function(x){ return /錯題本/.test(x.textContent); })[0]; if (b) b.click(); })()`);
  await sleep(900);
  check('進得了匯入題庫的錯題本',
    /匯入題庫/.test(await js(`document.getElementById('wrongTitle').textContent`)));
  const wbLabel = await js(`(function(){
    var b = document.querySelector('#wrongList .wrong-item b');
    return b ? b.textContent : ''; })()`);
  check('錯題本列出匯入題庫的錯題（不是 undefined）',
    !!wbLabel && wbLabel.indexOf('undefined') < 0, wbLabel);
  check('錯題本有科目篩選', await js(`(function(){
    return /全部科目/.test(document.getElementById('wrongFilters').textContent); })()`));
  await js(`document.getElementById('wrongExit').click()`);
  await sleep(900);
  check('錯題本返回會回到匯入題庫大選單',
    await js(`!document.getElementById('view-imphome').classList.contains('hidden')`));
  await js(`(function(){ var b=[].slice.call(document.querySelectorAll('#imphomeCards .card'))
    .filter(function(x){ return /進度/.test(x.textContent); })[0]; if (b) b.click(); })()`);
  await sleep(900);
  check('進得了匯入題庫的進度分析',
    /匯入題庫/.test(await js(`document.getElementById('progTitle').textContent`)));
  check('進度分析看得到做過幾題與正確率',
    /做過\s*40\s*題/.test(await js(`document.getElementById('progBody').textContent`)),
    (await js(`document.getElementById('progBody').textContent`)).slice(0, 60));
  await js(`document.getElementById('progExit').click()`);
  await sleep(700);
  check('進度分析返回會回到匯入題庫大選單',
    await js(`!document.getElementById('view-imphome').classList.contains('hidden')`));
  await js(`(function(){ var b=[].slice.call(document.querySelectorAll('#imphomeCards .card'))
    .filter(function(x){ return /做題/.test(x.textContent); })[0]; if (b) b.click(); })()`);
  await sleep(900);
  check('做題進得了依冊依課的畫面',
    await js(`!document.getElementById('view-custom').classList.contains('hidden')`));
  await js(`document.getElementById('customExit').click()`);
  await sleep(700);
  check('依課練習返回會回到匯入題庫大選單',
    await js(`!document.getElementById('view-imphome').classList.contains('hidden')`));
  await js(`window.NavDebug.go('home')`);
  await sleep(400);
  await js(`document.querySelector('.card[data-go="progress"]').click()`);
  await sleep(800);
  await js(`(function(){ var b = document.querySelector('#progBody .pt-open'); if (b) b.click(); })()`);
  await sleep(1400);
  check('家長／老師檢視看得到匯入題庫那一區',
    /匯入題庫/.test(await js(`document.getElementById('parentBody').textContent`)));
  check('這一段流程沒有未捕捉的 JS 錯誤', (await js(`(window.__errs || []).join(' | ')`)) === '',
    await js(`(window.__errs || []).join(' | ')`));
});

/* ---------- 13. 手寫練習：換年級之後舊的「依課練習」範圍不能把題目濾成空 ---------- */
console.log('手寫練習（換年級）');
await session(8757, 9357, { seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grade: 6, extra: [], grades: [6], onboarded: true, subject: 'chinese',
  writeLesson: '四上|第1課', term: '全',
  streak: { last: '', days: 0 }, leitner: {}, wrong: [], units: {} }));` },
async (js) => {
  await js(`window.NavDebug.go('home')`);
  await sleep(400);
  await js(`document.querySelector('.card[data-go="write"]').click()`);
  await sleep(900);
  check('六年級進得了手寫練習（不會被舊的課次篩成空）',
    await js(`!document.getElementById('view-write').classList.contains('hidden')`),
    String(await js(`(document.querySelector('.ui-dialog') || {}).textContent || ''`)).slice(0, 60));
  check('舊的課次選擇已自動清掉',
    await js(`(JSON.parse(localStorage.getItem('chinese-review-v1')).writeLesson || '') === ''`));
  check('這一段流程沒有未捕捉的 JS 錯誤', (await js(`(window.__errs || []).join(' | ')`)) === '',
    await js(`(window.__errs || []).join(' | ')`));
});

/* ---------- 14. 字級調整（主題面板） ---------- */
console.log('字級調整');
await session(8761, 9361, {}, async (js) => {
  await js(`window.NavDebug.go('home')`);
  await sleep(300);
  await js(`document.getElementById('themeBtn').click()`);
  await sleep(300);
  check('主題面板有字級調整列', await js(`!!document.getElementById('fsPlus')`));
  await js(`document.getElementById('fsPlus').click()`);
  await sleep(200);
  check('按 Ａ＋ 之後整站字級變大',
    await js(`document.documentElement.style.fontSize`) === '110%',
    String(await js(`document.documentElement.style.fontSize`)));
  check('字級有存起來',
    await js(`localStorage.getItem('chinese-fontsize')`) === '110');
  await js(`document.getElementById('fsMinus').click()`);
  await sleep(200);
  check('按 Ａ− 回得到 100%（不會偏掉級距）',
    await js(`document.getElementById('fsVal').textContent`) === '100%',
    String(await js(`document.getElementById('fsVal').textContent`)));
  check('這一段流程沒有未捕捉的 JS 錯誤', (await js(`(window.__errs || []).join(' | ')`)) === '',
    await js(`(window.__errs || []).join(' | ')`));
});

/* ---------- 15. 語文常識帶讀（國語專屬獨立一區） ---------- */
console.log('語文常識帶讀（國語）');
await session(8762, 9362, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grade: 1, extra: [], grades: [1], onboarded: true, subject: 'chinese',
  stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [], units: {}, lit: {} }));` },
async (js) => {
  await js(`window.NavDebug.go('home')`);
  await sleep(300);
  check('國語首頁看得到語文常識帶讀', await js(`!!document.querySelector('.card[data-go="lit"]')`));
  await js(`document.querySelector('.card[data-go="lit"]').click()`);
  await sleep(700);
  const n = await js(`document.querySelectorAll('#litList .unit-item').length`);
  check('列出這個年級的語文常識篇目', n >= 5, String(n));
  await js(`document.querySelectorAll('#litList .unit-item')[0].click()`);
  await sleep(400);
  check('點進去就是帶讀畫面',
    await js(`!document.getElementById('view-read').classList.contains('hidden')`));
  const segs = await js(`(function(){ var T = window.APP_TEXTS, k = Object.keys(T).filter(function(x){
    return x.indexOf('chinese|1|') === 0; }).sort()[0]; window.__litKey = k; return T[k].segs.length; })()`);
  check('段落數與資料一致',
    await js(`document.querySelectorAll('#readDots .cdot').length`) === segs, String(segs));
  for (let i = 0; i < segs; i++) {
    await js(`(function(){ var a = window.APP_TEXTS[window.__litKey].segs[${i}].q.answer;
      var o = document.querySelectorAll('#readCheck .ck-opt'); if (o[a]) o[a].click(); })()`);
    await sleep(180);
    await js(`document.getElementById('readNext').click()`);
    await sleep(300);
  }
  check('讀完回到語文常識列表（不是概念卡也不是測驗）',
    await js(`!document.getElementById('view-lit').classList.contains('hidden')`));
  check('讀完的那一篇打勾',
    await js(`document.querySelectorAll('#litList .unit-item.done').length`) >= 1);
  check('這一段流程沒有未捕捉的 JS 錯誤', (await js(`(window.__errs || []).join(' | ')`)) === '',
    await js(`(window.__errs || []).join(' | ')`));
});

/* ---------- 17. 歷屆學測：整卷作答 → 交卷 → 成績單（2026-08-31 Tony 指定的新大項） ---------- */
console.log('歷屆試題（整卷作答）');
await session(8763, 9363, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grade: 12, extra: [], grades: [12], onboarded: true, subject: 'chinese',
  stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [], units: {} }));` },
async (js) => {
  await js(`window.NavDebug.go('subject')`);
  await sleep(400);
  check('科目頁有「歷屆試題」這個大項',
    await js(`!![].slice.call(document.querySelectorAll('#subjectCards .card'))
      .filter(function(x){ return /歷屆試題/.test(x.textContent); })[0]`));
  await js(`(function(){ var b = [].slice.call(document.querySelectorAll('#subjectCards .card'))
    .filter(function(x){ return /歷屆試題/.test(x.textContent); })[0]; if (b) b.click(); })()`);
  await sleep(1500);
  check('進得了歷屆試題，列得出年份與卷子',
    await js(`document.querySelectorAll('#examYears .chip').length`) >= 1 &&
    await js(`document.querySelectorAll('#examList .card').length`) >= 1,
    await js(`document.getElementById('examList').textContent`));
  check('進去可以選升高中或升大學（2026-09-01 Tony）',
    await js(`document.querySelectorAll('#examStages .chip').length`) === 2,
    await js(`document.getElementById('examStages').textContent`));
  check('高中生預設在升大學那一區',
    await js(`!!document.querySelector('#examStages .chip.active') &&
      /升大學/.test(document.querySelector('#examStages .chip.active').textContent)`),
    await js(`(document.querySelector('#examStages .chip.active')||{}).textContent`));
  check('列表頁有作答時限的設定', await js(`document.querySelectorAll('#examLimitRow .chip').length`) >= 3,
    await js(`document.getElementById('examLimitRow').textContent`));
  await js(`(function(){ var b = [].slice.call(document.querySelectorAll('#examLimitRow .chip'))
    .filter(function(x){ return /30 分/.test(x.textContent); })[0]; if (b) b.click(); })()`);
  await sleep(300);
  check('選了時限會存進 state', await js(`(function(){
    var s = JSON.parse(localStorage.getItem('chinese-review-v1')); return String(s.examLimit); })()`) === '30');
  // 直接開卷（openExam 會跳確認框，測試改用 UIDialog 的自動確認）
  await js(`(function(){ window.__oldConfirm = window.UIDialog.confirm;
    window.UIDialog.confirm = function(msg, cb){ cb(); }; })()`);
  await js(`document.querySelectorAll('#examList .card')[0].click()`);
  await sleep(1500);
  check('開卷後進入整卷作答畫面',
    await js(`!document.getElementById('view-exam').classList.contains('hidden')`));
  check('限時模式是倒數計時', /剩/.test(await js(`document.getElementById('examClock').textContent`)),
    await js(`document.getElementById('examClock').textContent`));
  check('還沒寫完時看不到交卷鍵',
    await js(`document.getElementById('examSubmit').classList.contains('hidden')`) === true,
    await js(`document.getElementById('examSubmitHint').textContent`));
  const cells = await js(`document.querySelectorAll('#examNav .exam-cell').length`);
  check('題號導覽列出整卷題目', cells >= 30, String(cells));
  check('作答中不顯示解析與對錯',
    await js(`document.getElementById('examOpts').querySelectorAll('.correct, .wrongpick').length`) === 0);
  // 每題都照正解作答（多選題要把每個正確選項都點下去），交卷應該滿分
  await js(`(function(){
    var p = window.APP_EXAM_PAPERS['115-chinese'];
    window.__total = p.qs.length;
    return p.qs.length; })()`);
  const total = await js(`window.__total`);
  for (let i = 0; i < total; i++) {
    await js(`(function(){
      var cells = document.querySelectorAll('#examNav .exam-cell');
      if (cells[${i}]) cells[${i}].click(); })()`);
    await sleep(60);
    await js(`(function(){
      var p = window.APP_EXAM_PAPERS['115-chinese'], q = p.qs[${i}];
      var opts = document.querySelectorAll('#examOpts .q-opt');
      var want = Array.isArray(q.a) ? q.a : [q.a];
      want.forEach(function(k){ if (opts[k]) opts[k].click(); }); })()`);
    await sleep(60);
  }
  check('全部寫完後交卷鍵才出現',
    await js(`document.getElementById('examSubmit').classList.contains('hidden')`) === false);
  check('全部作答後交卷鍵不再提示未作答',
    !/沒作答/.test(await js(`document.getElementById('examSubmit').textContent`)),
    await js(`document.getElementById('examSubmit').textContent`));
  await js(`document.getElementById('examSubmit').click()`);
  await sleep(900);
  const res = await js(`document.getElementById('examResult').textContent`);
  check('交卷後出現成績單', /成績單/.test(res), res.slice(0, 60));
  check('照正解作答＝滿分 80 分', /80\s*／\s*80/.test(res.replace(/\s+/g, ' ')), res.slice(0, 80));
  const rv = await js(`document.getElementById('examReview').textContent`);
  check('成績單附逐題檢討與解析', /逐題檢討/.test(rv) && /正解/.test(rv), rv.slice(0, 60));
  check('成績存進 state，回列表看得到最佳成績', await js(`(function(){
    var s = JSON.parse(localStorage.getItem('chinese-review-v1'));
    return !!(s.examRuns && s.examRuns['115-chinese'] && s.examRuns['115-chinese'].best); })()`));
  await js(`(function(){ if (window.__oldConfirm) window.UIDialog.confirm = window.__oldConfirm; })()`);
  check('這一段流程沒有未捕捉的 JS 錯誤', (await js(`(window.__errs || []).join(' | ')`)) === '',
    await js(`(window.__errs || []).join(' | ')`));
});

/* ---------- 17b. 數學卷的選填題（2026-09-01 新增 type:'fill'） ---------- */
console.log('歷屆試題：數學卷的選填題');
await session(8765, 9365, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grade: 12, extra: [], grades: [12], onboarded: true, subject: 'chinese',
  examLimit: 'none', stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [], units: {} }));` },
async (js) => {
  await js(`window.NavDebug.go('subject')`);
  await sleep(400);
  await js(`(function(){ var b = [].slice.call(document.querySelectorAll('#subjectCards .card'))
    .filter(function(x){ return /歷屆試題/.test(x.textContent); })[0]; if (b) b.click(); })()`);
  await sleep(1800);
  await js(`(function(){ window.__oldConfirm = window.UIDialog.confirm;
    window.UIDialog.confirm = function(msg, cb){ cb(); }; })()`);
  // 直接開 115 數學A（選填題最多的一卷）
  check('列表裡找得到數學卷',
    await js(`[].slice.call(document.querySelectorAll('#examList .card'))
      .filter(function(x){ return /數學/.test(x.textContent); }).length`) >= 1,
    await js(`document.getElementById('examList').textContent.slice(0, 120)`));
  await js(`(function(){ var b = [].slice.call(document.querySelectorAll('#examList .card'))
    .filter(function(x){ return /數學Ａ/.test(x.textContent); })[0]; if (b) b.click(); })()`);
  await sleep(1800);
  check('開得了數學卷', await js(`!document.getElementById('view-exam').classList.contains('hidden')`) &&
    await js(`(window.APP_EXAM_PAPERS['115-matha']||{}).id`) === '115-matha');
  // 跳到第 13 題（選填題）
  await js(`(function(){
    var p = window.APP_EXAM_PAPERS['115-matha'];
    var k = 0; p.qs.forEach(function(q, i){ if (q.n === 13) k = i; });
    document.querySelectorAll('#examNav .exam-cell')[k].click(); })()`);
  await sleep(300);
  const cellN = await js(`document.querySelectorAll('#examOpts .exam-fill-cell input').length`);
  check('選填題畫出填答格（不是選項按鈕）', cellN === 3 &&
    await js(`document.querySelectorAll('#examOpts .q-opt').length`) === 0, String(cellN));
  check('題型標籤顯示選填題', /選填題/.test(await js(`document.getElementById('examTag').textContent`)),
    await js(`document.getElementById('examTag').textContent`));
  // 每一題都照正解作答（選填題把每一格填進去），交卷應該滿分
  await js(`(function(){ window.__total = window.APP_EXAM_PAPERS['115-matha'].qs.length; })()`);
  const totalM = await js(`window.__total`);
  for (let i = 0; i < totalM; i++) {
    await js(`(function(){ document.querySelectorAll('#examNav .exam-cell')[${i}].click(); })()`);
    await sleep(50);
    await js(`(function(){
      var q = window.APP_EXAM_PAPERS['115-matha'].qs[${i}];
      if (q.type === 'fill') {
        var ins = document.querySelectorAll('#examOpts .exam-fill-cell input');
        q.a.forEach(function(v, k){
          if (!ins[k]) return;
          ins[k].value = v;
          ins[k].dispatchEvent(new Event('input', { bubbles: true }));
        });
      } else {
        var opts = document.querySelectorAll('#examOpts .q-opt');
        var want = Array.isArray(q.a) ? q.a : [q.a];
        want.forEach(function(k){ if (opts[k]) opts[k].click(); });
      } })()`);
    await sleep(50);
  }
  check('選填題也算進「全部寫完」，交卷鍵才出現',
    await js(`document.getElementById('examSubmit').classList.contains('hidden')`) === false,
    await js(`document.getElementById('examSubmitHint').textContent`));
  await js(`document.getElementById('examSubmit').click()`);
  await sleep(900);
  const resM = await js(`document.getElementById('examResult').textContent`);
  check('照正解作答＝滿分 88 分（含 5 題選填）',
    /88\s*／\s*88/.test(resM.replace(/\s+/g, ' ')), resM.slice(0, 80));
  const rvM = await js(`document.getElementById('examReview').textContent`);
  check('逐題檢討看得到選填題的正解', /9 1 0/.test(rvM), rvM.slice(0, 200));
  await js(`(function(){ if (window.__oldConfirm) window.UIDialog.confirm = window.__oldConfirm; })()`);
  check('數學卷這一段沒有未捕捉的 JS 錯誤', (await js(`(window.__errs || []).join(' | ')`)) === '',
    await js(`(window.__errs || []).join(' | ')`));
});

console.log(fails.length ? `\n${fails.length} 項失敗：` + fails.join('、') : '\n瀏覽器 smoke test 全部通過');
process.exit(fails.length ? 1 : 0);
