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

  await js(`window.__hw.onComplete({ totalMistakes: 0 })`);
  await sleep(300);
  const fb = await js(`document.getElementById('quizFeedback').textContent`);
  check('一次寫對→公布解析', /一次就一筆不錯地寫對/.test(fb) && /正確答案/.test(fb), fb.slice(0, 50));
  check('答完在格子裡顯示正解字', (await js(`document.getElementById('quizHwPanel').textContent`)).length === 1);
  check('下一題先被解析鎖鎖住',
    await js(`document.getElementById('quizNext').disabled === true`) &&
    /先看解析/.test(await js(`document.getElementById('quizNext').textContent`)));
  check('鎖住期間按下一題不會跳題',
    await js(`(function(){var n=document.getElementById('quizProgress').textContent;
      document.getElementById('quizNext').click();
      return document.getElementById('quizProgress').textContent === n;})()`));
  await sleep(10000);
  check('倒數結束自動解鎖', await js(`document.getElementById('quizNext').disabled === false &&
    document.getElementById('quizNext').textContent === '下一題'`));

  await js(`document.getElementById('quizNext').click()`);
  await sleep(400);
  check('解析停留有寫進 state.dwell', await js(`(function(){
    var d = (JSON.parse(localStorage.getItem('chinese-review-v1')).dwell) || {};
    var k = Object.keys(d)[0]; return !!k && d[k].n >= 1 && d[k].ms > 0;})()`));

  await js(`window.__hw.onComplete({ totalMistakes: 2 })`);
  await sleep(400);
  check('寫錯要求重寫到全對', /重寫到全對/.test(await js(`document.getElementById('quizHwStatus').textContent`)));
  await sleep(2600);
  check('示範完重開手寫格', await js(`window.__hw.quizzes >= 3`));
  await js(`window.__hw.onComplete({ totalMistakes: 0 })`);
  await sleep(300);
  check('第一次寫錯的題目標明已進錯題本',
    /第一次沒寫對/.test(await js(`document.getElementById('quizFeedback').textContent`)));
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
    await sleep(200);
    await js(`(function(){var b=document.getElementById('quizNext');b.disabled=false;b.click();})()`);
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
    await js(`document.querySelector('#quizOptions .q-opt').click()`);
    await sleep(400);
    if (/再想一次/.test(await js(`document.getElementById('quizFeedback').textContent`))) {
      await js(`Array.prototype.slice.call(document.querySelectorAll('#quizOptions .q-opt'))
        .filter(function (b) { return !b.disabled; })[0].click()`);
      await sleep(400);
    }
    check('選擇題也有解析鎖',
      await js(`document.getElementById('quizNext').disabled === true`) &&
      /先看解析/.test(await js(`document.getElementById('quizNext').textContent`)));
    await sleep(13000);
    check('選擇題解析鎖會解開', await js(`document.getElementById('quizNext').disabled === false`));
    await js(`document.getElementById('quizNext').click()`);
    await sleep(400);
    check('每日練習不算成自主練習（state.gen 空的）',
      await js(`Object.keys((JSON.parse(localStorage.getItem('chinese-review-v1')).gen) || {}).length === 0`),
      await js(`JSON.stringify((JSON.parse(localStorage.getItem('chinese-review-v1')).gen) || {})`));
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

console.log(fails.length ? `\n${fails.length} 項失敗：` + fails.join('、') : '\n瀏覽器 smoke test 全部通過');
process.exit(fails.length ? 1 : 0);
