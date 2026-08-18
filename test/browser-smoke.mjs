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
  console.log('（跳過瀏覽器 smoke test：找不到 ' + SHELL + '，可用 CHROME_SHELL=<路徑> 指定）');
  process.exit(0);
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
    await send('Page.addScriptToEvaluateOnNewDocument', { source: (blockWriter ? FAKE_WRITER : '') + seed });
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
    await sleep(2500);
    await run(js);
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
  check('答完在格子裡顯示正解字', (await js(`document.getElementById('quizHwPanel').textContent`)).length === 1);
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
    // 這題先拿掉確認題資料，測「沒有確認題 → 退回解析鎖倒數」這條路
    await js(`delete window.APP_CHECKS[window.QuizDebug.id()]`);
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
  }
});

/* ---------- 4. 社會科（題庫型科目）：依課練習／單元學習／每日練習／錯題本 ---------- */
console.log('社會科');
await session(8734, 9334, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grades: [5], stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [], subject: 'social' }));` },
async (js) => {
  check('社會原創題庫載得到', await js(`(window.APP_DATA.social || []).length >= 50`),
    String(await js(`(window.APP_DATA.social || []).length`)));
  check('社會自創題庫載得到', await js(`(window.APP_DATA.socialCustom || []).length > 500`),
    String(await js(`(window.APP_DATA.socialCustom || []).length`)));
  await sleep(300);
  await js(`document.getElementById('homeLink').click()`);
  await sleep(300);
  check('國語專屬卡片在社會科隱藏',
    await js(`document.querySelector('.card[data-go="idioms"]').classList.contains('hidden')
      && !document.querySelector('.card[data-go="units"]').classList.contains('hidden')
      && !document.querySelector('.card[data-go="daily"]').classList.contains('hidden')`));
  check('自創題庫卡改名為依課練習',
    await js(`document.querySelector('.card[data-go="custom"] .card-title').textContent === '依課練習'`),
    await js(`document.querySelector('.card[data-go="custom"] .card-title').textContent`));

  // 依課練習：冊/課列表 → 開始刷題 → 作答
  await js(`document.querySelector('.card[data-go="custom"]').click()`);
  await sleep(400);
  check('依課練習列出冊與課',
    await js(`document.querySelectorAll('#customBooks .chip').length >= 1
      && document.querySelectorAll('#customList .unit-item').length >= 3`),
    await js(`document.querySelectorAll('#customList .unit-item').length + ' 列'`));
  await js(`document.querySelectorAll('#customList .unit-item')[0].click()`);
  await sleep(500);
  check('依課練習開得起來（社會題）',
    await js(`!document.getElementById('view-quiz').classList.contains('hidden')
      && document.querySelectorAll('#quizOptions .q-opt').length >= 2`));
  check('依課練習出的是自創題庫的題', await js(`(window.QuizDebug.id() || '').indexOf('oc') === 0`),
    String(await js(`window.QuizDebug.id()`)));
  await js(`(function(){ var id = window.QuizDebug.id();
    var bank = id.indexOf('oc') === 0 ? window.APP_DATA.socialCustom : window.APP_DATA.social;
    var it = bank.filter(function(x){return x.id===id;})[0];
    document.querySelectorAll('#quizOptions .q-opt')[it.answer].click(); })()`);
  await sleep(400);
  check('社會題答對後出現解析',
    /正解/.test(await js(`document.getElementById('quizFeedback').textContent`)),
    (await js(`document.getElementById('quizFeedback').textContent`)).slice(0, 60));
  check('社會題沒有確認題資料時走解析鎖',
    await js(`document.getElementById('quizNext').classList.contains('locked')`));
  await js(`window.QuizDebug.unlock(); document.getElementById('quizExit').click()`);
  await sleep(300);
  await js(`(function(){ var b = document.querySelector('.dlg-primary'); if (b) b.click(); })()`);
  await sleep(300);

  // 單元學習：非國語改用「冊」分組，教學卡是重點卡
  await js(`document.getElementById('homeLink').click()`);
  await sleep(200);
  await js(`document.querySelector('.card[data-go="units"]').click()`);
  await sleep(400);
  check('社會單元學習切得出單元',
    await js(`document.querySelectorAll('#unitList .unit-item').length >= 5`),
    String(await js(`document.querySelectorAll('#unitList .unit-item').length`)));
  await js(`document.querySelectorAll('#unitList .unit-item')[0].click()`);
  await sleep(300);
  check('社會教學卡顯示重點',
    /重點/.test(await js(`document.getElementById('lessonTag').textContent`)) &&
    (await js(`document.getElementById('lessonBody').textContent`)).length > 10,
    await js(`document.getElementById('lessonTag').textContent`));
  await js(`document.getElementById('lessonExit').click()`);
  await sleep(200);

  // 每日練習：同日同科出同一組題，紀錄寫在 <日期>|social
  await js(`document.getElementById('homeLink').click()`);
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
  await js(`document.getElementById('homeLink').click()`);
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
  await js(`document.getElementById('homeLink').click()`);
  await sleep(200);
  await js(`document.querySelector('.card[data-go="wrongbook"]').click()`);
  await sleep(400);
  check('切回國語後錯題本不含社會題',
    /沒有錯題/.test(await js(`document.getElementById('wrongList').textContent`)),
    (await js(`document.getElementById('wrongList').textContent`)).slice(0, 60));
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
  check('家長頁認得帶科目的紀錄＝今日已完成', /今日已完成/.test(head), head.slice(0, 80));
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

console.log(fails.length ? `\n${fails.length} 項失敗：` + fails.join('、') : '\n瀏覽器 smoke test 全部通過');
process.exit(fails.length ? 1 : 0);
