/* 圖文不搭巡檢（執行期）：卡片有自己傳資料給元件時，
   把元件畫出來，看那些字有沒有真的出現在畫面上。一個都沒出現 → 元件根本沒吃這份資料。 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
const SHELL = process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell';
const server = spawn('python3', ['-m', 'http.server', '8776'], { cwd: '/home/tony/TelegramClaude/chinese', stdio: 'ignore' });
const chrome = spawn(SHELL, ['--remote-debugging-port=9376', '--no-sandbox', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
try {
  await sleep(1600);
  const list = await (await fetch('http://127.0.0.1:9376/json/list')).json();
  const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = new Map();
  ws.addEventListener('message', (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
  const send = (m, p = {}) => { const mid = ++id; ws.send(JSON.stringify({ id: mid, method: m, params: p })); return new Promise((r) => pending.set(mid, r)); };
  const js = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 200)); return r.result?.result?.value; };
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
  await send('Network.setBlockedURLs', { urls: ['*js/sync.js'] });
  await send('Page.navigate', { url: 'http://127.0.0.1:8776/index.html' });
  await sleep(2200);
  const files = ['math', 'science', 'english', 'social', 'physics', 'chemistry', 'biology', 'earth', 'history', 'geography', 'civics', 'chinese'];
  for (const f of files) {
    await js(`new Promise(function(res){ var s=document.createElement('script');
      s.src='js/data/lessons-${f}.js'; s.onload=function(){res(1)}; s.onerror=function(){res(0)};
      document.head.appendChild(s); })`).catch(() => {});
  }
  // 課文帶讀的每一段也可能有圖，一起檢查（2026-08-30 起數理科也開始放圖）
  for (const f of files) {
    await js(`new Promise(function(res){ var s=document.createElement('script');
      s.src='js/data/texts-${f}.js'; s.onload=function(){res(1)}; s.onerror=function(){res(0)};
      document.head.appendChild(s); })`).catch(() => {});
  }
  await sleep(800);
  const out = await js(`(function(){
    var res = [];
    var host = document.createElement('div'); document.body.appendChild(host);
    // 課文帶讀的段落先攤平成和概念卡一樣的形狀
    var TEXTSEGS = {};
    Object.keys(window.APP_TEXTS || {}).forEach(function (k) {
      TEXTSEGS['課文｜' + k] = { cards: (APP_TEXTS[k].segs || []).map(function (sg) {
        return { title: sg.h, viz: sg.viz };
      }) };
    });
    var ALL = {};
    Object.keys(window.APP_LESSONS || {}).forEach(function (k) { ALL[k] = APP_LESSONS[k]; });
    Object.keys(TEXTSEGS).forEach(function (k) { ALL[k] = TEXTSEGS[k]; });
    Object.keys(ALL).forEach(function (k) {
      (ALL[k].cards || []).forEach(function (c, ci) {
        if (!c.viz || !c.viz.type) return;
        // 收集卡片傳給元件的中文字串（至少 2 個字）
        var words = [];
        (function walk(o, d) {
          if (d > 4 || o == null) return;
          if (typeof o === 'string') { if (/[\\u4e00-\\u9fff]{2,}/.test(o)) words.push(o); return; }
          if (Array.isArray(o)) return o.forEach(function (x) { walk(x, d + 1); });
          if (typeof o === 'object') Object.keys(o).forEach(function (kk) { if (kk !== 'type') walk(o[kk], d + 1); });
        })(c.viz, 0);
        if (!words.length) return;
        host.innerHTML = '';
        try { window.Widgets.render(host, c.viz); } catch (e) { res.push({ k: k, i: ci, t: c.title, v: c.viz.type, err: String(e).slice(0, 80) }); return; }
        var txt = host.textContent || '';
        var hit = words.filter(function (w) { return txt.indexOf(w) >= 0; }).length;
        if (hit === 0) res.push({ k: k, i: ci, t: c.title, v: c.viz.type, words: words.slice(0, 4) });
      });
    });
    host.remove();
    return JSON.stringify(res);
  })()`);
  const res = JSON.parse(out);
  console.log('卡片有傳資料、但畫面上一個字都沒出現：' + res.length + ' 張');
  const byType = {};
  res.forEach(r => (byType[r.v] = (byType[r.v] || 0) + 1));
  console.log(Object.entries(byType).sort((a, b) => b[1] - a[1]).map(e => e[0] + ':' + e[1]).join(' '));
  if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(res, null, 1));
  // exprsteps 只顯示目前這一步，後面幾步的字本來就還沒出現，不算配錯
  const real = res.filter(r => r.v !== 'exprsteps');
  if (real.length) {
    console.log('✗ 這些卡片的圖沒有用到卡片自己的資料（會顯示元件內建的別科內容）：');
    real.slice(0, 20).forEach(r => console.log('   ' + r.v + ' | ' + r.k + ' | ' + r.t));
    process.exitCode = 1;
  } else {
    console.log('✓ 每張有自備資料的概念卡，圖上都看得到自己的內容');
  }
  ws.close();
} finally { chrome.kill(); server.kill(); }
