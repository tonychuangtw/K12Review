/* 互動元件全面體檢（2026-08-29 Tony：「感覺這種 bug 還很多，有辦法幫我全部檢查嗎？」）
 *
 * 做法：把每一種互動元件用「概念卡裡真的在用的 spec」畫出來，然後把上面每一顆按鈕
 * 都連按 12 下，逐次檢查：
 *   ① 畫得出來嗎（有沒有 SVG／文字，render 有沒有丟例外）
 *   ② 畫面上有沒有 NaN／undefined／Infinity 這種漏算的字
 *   ③ 按鈕會不會完全沒作用（畫面沒變、也沒給「已經是這個狀態了」的提示）＝死按鈕
 *   ④ 連按同一顆會不會卡住（前幾下有變、後面永遠不再變，而且沒提示）＝像原子那種吃掉狀態的 bug
 * 用法：node test/widget-audit.mjs        （找不到 chrome-headless-shell 就跳過）
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SHELL = process.env.CHROME_SHELL ||
  process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell';
if (!existsSync(SHELL)) {
  console.log('⚠️  跳過互動元件體檢：找不到 ' + SHELL);
  process.exit(process.env.SMOKE_REQUIRED ? 1 : 0);
}

/* 1. 從概念卡資料收集每一種元件真正用到的 spec（同型別最多取 3 種） */
const LESSON_FILES = ['math', 'science', 'social', 'english', 'physics', 'chemistry',
  'biology', 'earth', 'history', 'geography', 'civics'];
const w = {};
for (const f of LESSON_FILES) {
  const src = readFileSync(`${ROOT}/js/data/lessons-${f}.js`, 'utf8');
  // eslint-disable-next-line no-eval
  eval(src.replace(/^window\./gm, 'w.').replace(/window\.APP_LESSONS/g, 'w.APP_LESSONS'));
}
const specs = new Map();
Object.values(w.APP_LESSONS || {}).forEach((deck) => {
  (deck.cards || []).forEach((c) => {
    if (!c.viz || !c.viz.type) return;
    const list = specs.get(c.viz.type) || [];
    const key = JSON.stringify(c.viz);
    if (list.length < 3 && !list.some((x) => JSON.stringify(x) === key)) list.push(c.viz);
    specs.set(c.viz.type, list);
  });
});
console.log(`收集到 ${specs.size} 種互動元件、${[...specs.values()].reduce((n, l) => n + l.length, 0)} 組 spec`);

const server = spawn('python3', ['-m', 'http.server', '8760'], { cwd: ROOT, stdio: 'ignore' });
const chrome = spawn(SHELL, ['--remote-debugging-port=9360', '--no-sandbox', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
let bad = [];
try {
  await sleep(1500);
  const list = await (await fetch('http://127.0.0.1:9360/json/list')).json();
  const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  const send = (method, params = {}) => {
    const mid = ++id; ws.send(JSON.stringify({ id: mid, method, params }));
    return new Promise((r) => pending.set(mid, r));
  };
  const js = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 300));
    return r.result?.result?.value;
  };
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
  await send('Network.setBlockedURLs', { urls: ['*js/sync.js'] });
  await send('Page.navigate', { url: 'http://127.0.0.1:8760/index.html' });
  await sleep(2500);

  // 2. 逐個 spec 在瀏覽器裡跑完整檢查（都在頁面內做，來回一次就好）
  const payload = JSON.stringify([...specs.entries()].flatMap(([t, l]) => l.map((s) => [t, s])));
  const report = await js(`(function(){
   try {
    var jobs = ${payload}, out = [];
    var CLICKS = 12;
    function text(el) { return (el.textContent || '').replace(/\\s+/g, ' '); }
    // 比對畫面時把「已經是這個狀態了」那行提示排掉（那是回饋，不算內容變化）
    function snap(wg) {
      var c = wg.cloneNode(true), h = c.querySelector('.wg-noop');
      if (h && h.parentNode) h.parentNode.removeChild(h);
      return c.innerHTML;
    }
    jobs.forEach(function (job) {
      var type = job[0], spec = job[1];
      var host = document.createElement('div');
      document.body.appendChild(host);
      var rec = { type: type, spec: JSON.stringify(spec).slice(0, 80), issues: [] };
      try { window.Widgets.render(host, spec); }
      catch (e) { rec.issues.push('render 丟例外：' + (e && e.message)); out.push(rec); host.remove(); return; }
      var wg = host.querySelector('.wg');
      if (!wg) { rec.issues.push('沒有畫出任何東西'); out.push(rec); host.remove(); return; }
      if (!wg.querySelector('svg') && text(wg).trim().length < 4) rec.issues.push('畫面幾乎是空的');
      var t0 = text(wg);
      if (/(NaN|undefined|Infinity)/.test(t0)) rec.issues.push('畫面出現 NaN／undefined／Infinity');
      var btns = Array.prototype.slice.call(wg.querySelectorAll('.wg-btn'));
      /* 真正的死按鈕判定：先按別顆把狀態帶開，再回來按它。
         只有「不管狀態在哪裡按都不會改變任何東西」才算死掉——
         單純「已經是這個狀態」那種，是正常的，畫面上會有提示。 */
      btns.forEach(function (b, bi) {
        var everChanged = false;
        for (var oi = 0; oi < btns.length && !everChanged; oi++) {
          if (oi !== bi) { try { btns[oi].click(); } catch (e) { /* 下面那圈會抓 */ } }
          var pre = snap(wg);
          try { b.click(); } catch (e) { break; }
          if (snap(wg) !== pre) everChanged = true;
        }
        if (!everChanged) rec.issues.push('按鈕「' + ((b.textContent || '').trim().slice(0, 12) || ('#' + bi)) +
          '」不管狀態在哪裡按都不會改變畫面（疑似死按鈕）');
      });
      // 其他互動元素（滑桿、下拉、SVG 上掛 click 的）也要能動
      var others = Array.prototype.slice.call(wg.querySelectorAll('input,select'));
      others.forEach(function (o) {
        var before = snap(wg);
        try {
          if (o.tagName === 'SELECT' && o.options.length > 1) {
            o.selectedIndex = (o.selectedIndex + 1) % o.options.length;
          } else if (o.type === 'range' || o.type === 'number') {
            // 已經頂到最大值時往上加沒有意義（瀏覽器會夾住），改成往下拉一格
            var st = Number(o.step || 1) || 1, cur = Number(o.value || 0);
            var up = String(cur + st), down = String(cur - st);
            o.value = up;
            if (o.value === String(cur)) o.value = down;
          } else if (o.type === 'checkbox' || o.type === 'radio') { o.checked = !o.checked; }
          o.dispatchEvent(new Event('input', { bubbles: true }));
          o.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) { rec.issues.push('操作 ' + o.tagName.toLowerCase() + ' 丟例外：' + (e && e.message)); }
        if (snap(wg) === before) rec.issues.push('元素 ' + o.tagName.toLowerCase() +
          '（' + (o.type || '') + '）操作後畫面沒有變化');
      });
      btns.forEach(function (b, bi) {
        var label = (b.textContent || '').trim().slice(0, 12) || ('#' + bi);
        var changed = 0, hinted = 0, stuckAfter = -1, lastChangeAt = -1;
        for (var k = 0; k < CLICKS; k++) {
          var before = snap(wg);
          try { b.click(); }
          catch (e) { rec.issues.push('按「' + label + '」丟例外：' + (e && e.message)); break; }
          var now = wg.innerHTML;
          var hint = wg.querySelector('.wg-noop');
          var hintOn = !!hint && !hint.classList.contains('hidden');
          // 把提示本身的變化排除掉（提示是我們自己加的回饋，不算內容變化）
          var strip = function (h) { return h.replace(/<span class="wg-noop[^>]*>[^<]*<\\/span>/g, ''); };
          if (strip(now) !== strip(before)) { changed++; lastChangeAt = k; }
          else if (hintOn) hinted++;
          else if (stuckAfter < 0) stuckAfter = k;
          if (/(NaN|undefined|Infinity)/.test(text(wg))) {
            rec.issues.push('按「' + label + '」' + (k + 1) + ' 下之後出現 NaN／undefined／Infinity');
            break;
          }
        }
        if (changed === 0 && hinted === 0) rec.issues.push('按鈕「' + label + '」完全沒有作用（畫面沒變、也沒提示）');
        else if (stuckAfter >= 0 && changed > 0 && hinted === 0)
          rec.issues.push('按鈕「' + label + '」按到第 ' + (stuckAfter + 1) + ' 下之後就沒反應了（沒有提示）');
      });
      host.remove();
      if (rec.issues.length) out.push(rec);
    });
    return out;
   } catch (e) { return [{ type: '（體檢腳本自己爆了）', spec: '', issues: [String(e && e.stack || e).slice(0, 400)] }]; }
  })()`);
  bad = report || [];
  ws.close();
} finally {
  chrome.kill(); server.kill();
}

if (!bad.length) {
  console.log('\n✅ 全部互動元件都正常：畫得出來、按鈕都有作用或有提示、沒有 NaN／undefined');
} else {
  console.log(`\n⚠️  ${bad.length} 組有問題：`);
  bad.forEach((r) => {
    console.log(`\n  ${r.type}  ${r.spec}`);
    r.issues.forEach((i) => console.log('    ・' + i));
  });
}
process.exit(bad.length ? 1 : 0);
