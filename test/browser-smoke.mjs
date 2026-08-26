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
  await js(`(function(){ var cs = document.querySelectorAll('#subjectCards .card');
    cs[cs.length - 1].click(); })()`);   // 最後一張＝匯入題庫
  await sleep(400);
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
  await sleep(400);
  // 2026-08-22 起社會單元也有概念卡：有教材走概念卡，沒教材才退回舊的重點卡
  const socialView = await js(`(function(){
    if (!document.getElementById('view-concept').classList.contains('hidden')) return 'concept';
    if (!document.getElementById('view-lesson').classList.contains('hidden')) return 'lesson';
    return null; })()`);
  if (socialView === 'concept') {
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

/* ---------- 6. 題目附圖（img 欄位）：搜尋看得到、做題時也看得到 ---------- */
console.log('題目附圖');
await session(8736, 9336, { blockWriter: true, seed: `localStorage.setItem('chinese-review-v1', JSON.stringify({
  phon: 'zhuyin', grades: [5], stats: {}, streak: { last: '', days: 0 }, leitner: {}, wrong: [], subject: 'science' }));` },
async (js) => {
  const withImg = await js(`(window.APP_DATA.scienceCustom || []).filter(function (x) { return x.img; }).length`);
  check('自然題庫有附圖的題', withImg > 0, String(withImg));
  await js(`document.getElementById('homeLink').click()`);
  await sleep(200);
  await js(`document.getElementById('homeSearch').click()`);
  await sleep(300);
  await js(`(function(){ var i = document.getElementById('searchInput');
    i.value = '太陽四季運行軌跡圖'; i.dispatchEvent(new Event('input')); })()`);
  await sleep(500);
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
    await js(`document.getElementById('homeLink').click()`);
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
    await js(`document.getElementById('homeLink').click()`);
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
    await js(`document.getElementById('homeLink').click()`);
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
  check('五年級看不到高中分科（物理等）',
    await js(`document.querySelectorAll('#subjectCards .card').length <= 7`),
    await js(`Array.prototype.map.call(document.querySelectorAll('#subjectCards .card-title'),
      function (x) { return x.textContent; }).join(',')`));
  check('科目卡題數是「這個年級的題數」，不是全庫題數',
    await js(`(function(){ var c = document.querySelectorAll('#subjectCards .card');
      for (var i = 0; i < c.length; i++) {
        if (c[i].querySelector('.card-title').textContent !== '數學') continue;
        var n = (window.APP_DATA.math || []).filter(function (x) { return x.grade === 5; }).length;
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
  await js(`document.getElementById('homeLink').click()`);
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
  const termCounts = await js(`(function () {
    var out = {};
    ['整年', '十上', '十下'].forEach(function (name) {
      var chips = document.querySelectorAll('#gradePanel .gp-term .chip');
      for (var i = 0; i < chips.length; i++) {
        if (chips[i].textContent === name) { chips[i].click(); break; }
      }
      var cards = document.querySelectorAll('#subjectCards .card-sub');
      var n = 0;
      for (var j = 0; j < cards.length; j++) {
        var m = /(\d+)\s*題/.exec(cards[j].textContent);
        if (m) n += parseInt(m[1], 10);
      }
      out[name] = n;
      document.getElementById('rangeBar').click();
    });
    return JSON.stringify(out);
  })()`);
  const tc = JSON.parse(termCounts);
  check('選上學期／下學期，科目題數各約一半且相加等於整年',
    tc['整年'] > 0 && tc['十上'] > 0 && tc['十下'] > 0 && (tc['十上'] + tc['十下']) === tc['整年'],
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
  await js(`document.getElementById('homeLink').click()`);
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
  await js(`document.getElementById('homeLink').click()`);
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
      t.click();
    } })()`);
  await sleep(500);
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

console.log(fails.length ? `\n${fails.length} 項失敗：` + fails.join('、') : '\n瀏覽器 smoke test 全部通過');
process.exit(fails.length ? 1 : 0);
