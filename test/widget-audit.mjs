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
function collect(viz) {
  if (!viz || !viz.type) return;
  const list = specs.get(viz.type) || [];
  const key = JSON.stringify(viz);
  if (list.length < 3 && !list.some((x) => JSON.stringify(x) === key)) list.push(viz);
  specs.set(viz.type, list);
}
Object.values(w.APP_LESSONS || {}).forEach((deck) => {
  (deck.cards || []).forEach((c) => collect(c.viz));
});
/* 課文帶讀的段落也會放圖（2026-08-30 起）。只收概念卡的話，
   只用在帶讀的元件（例如會動的那幾種）永遠不會被體檢到。 */
const TEXT_FILES = ['math', 'science', 'social', 'english', 'chinese', 'physics',
  'chemistry', 'biology', 'earth', 'history', 'geography', 'civics'];
for (const f of TEXT_FILES) {
  const fp = `${ROOT}/js/data/texts-${f}.js`;
  if (!existsSync(fp)) continue;
  // eslint-disable-next-line no-eval
  eval(readFileSync(fp, 'utf8').replace(/^window\./gm, 'w.').replace(/window\.APP_TEXTS/g, 'w.APP_TEXTS'));
}
Object.values(w.APP_TEXTS || {}).forEach((unit) => {
  (unit.segs || []).forEach((g) => collect(g.viz));
});
console.log(`收集到 ${specs.size} 種互動元件、${[...specs.values()].reduce((n, l) => n + l.length, 0)} 組 spec`);

/* 1b. 說明文字答應的操作，元件真的做得到嗎（2026-08-29 Tony：「寫有可以拉滑桿，但並沒有」） */
const SLIDER_WORD = /滑桿|拉一拉/;
const DRAG_WORD = /拖曳|拖動|拉動(?!.*滑桿)/;
const CLICK_WORD = /按鈕|按一下|按按|點一下|點選|切換|選一個|試著按|自己按|按看看/;
const promises = [];
Object.entries(w.APP_LESSONS || {}).forEach(([key, deck]) => {
  (deck.cards || []).forEach((c, i) => {
    if (!c.viz) return;
    const t = c.tip || '';        // 只看 tip：body 是課文內容，寫「選一個函數」「快速切換」不是在講操作
    const wantSlider = SLIDER_WORD.test(t);
    const wantDrag = DRAG_WORD.test(t);
    const wantClick = CLICK_WORD.test(t);
    if (wantSlider || wantDrag || wantClick) {
      promises.push({ key, i, title: c.title || '', tip: (c.tip || '').slice(0, 40),
        spec: c.viz, wantSlider, wantDrag, wantClick });
    }
  });
});
console.log(`說明有提到「拉滑桿／按按鈕」的卡片：${promises.length} 張`);

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

  const promiseReport = await js(`(function(){
   try {
    var jobs = ${JSON.stringify(promises)}, out = [];
    jobs.forEach(function (j) {
      var host = document.createElement('div');
      document.body.appendChild(host);
      try { window.Widgets.render(host, j.spec); } catch (e) {
        out.push({ key: j.key, i: j.i, title: j.title, tip: j.tip, miss: 'render 丟例外' });
        host.remove(); return;
      }
      var wg = host.querySelector('.wg');
      var hasSlider = !!(wg && wg.querySelector('input[type=range]'));
      var hasBtn = !!(wg && wg.querySelector('.wg-btn, button, select'));
      // 可拖曳的元件會把游標設成 grab（clock 的鐘面、vector 的坐標平面就是這樣）
      var hasDrag = !!(wg && Array.prototype.some.call(wg.querySelectorAll('svg'),
        function (x) { return x.style && x.style.cursor === 'grab'; }));
      var miss = [];
      if (j.wantSlider && !hasSlider) miss.push('說明寫「拉滑桿」，但這個元件沒有滑桿');
      if (j.wantDrag && !hasDrag && !hasSlider) miss.push('說明寫「拖動」，但這個元件不能拖');
      if (j.wantClick && !hasBtn) miss.push('說明寫「按按鈕／點選」，但這個元件沒有可按的東西');
      if (miss.length) out.push({ key: j.key, i: j.i, title: j.title, tip: j.tip,
        type: j.spec.type, miss: miss.join('；') });
      host.remove();
    });
    return out;
   } catch (e) { return [{ key: '（第二段體檢自己爆了）', miss: String(e && e.stack || e).slice(0, 300) }]; }
  })()`);
  if (promiseReport && promiseReport.length) {
    console.log(`\n⚠️  說明與實際操作對不上：${promiseReport.length} 張卡`);
    promiseReport.forEach((r) => {
      console.log(`  ${r.key} card${r.i}（${r.title}）viz=${r.type}`);
      console.log(`    tip：${r.tip}`);
      console.log(`    ・${r.miss}`);
    });
    bad = bad.concat(promiseReport.map((r) => ({ type: r.type || '?', spec: r.key + ' card' + r.i, issues: [r.miss] })));
  }
  /* 3. 動畫收尾檢查（2026-08-30 加）：會動的元件在畫面被換掉之後，
        requestAnimationFrame 迴圈必須真的停下來。Widgets.render 只做
        innerHTML=''，不會停計時器 —— 這種漏掉的迴圈在手機上會一直吃電，
        而且畫面上完全看不出來，靠人工測不到。 */
  const ANIM_TYPES = ['fracequiv', 'floatsink', 'motionplay'];
  const animSpecs = ANIM_TYPES
    .map((t) => (specs.get(t) || [])[0])
    .filter(Boolean);
  if (animSpecs.length) {
    const leaks = await js(`(function(){
     try {
      var jobs = ${JSON.stringify(animSpecs)}, out = [];
      var origRAF = window.requestAnimationFrame.bind(window);
      var n = 0;
      window.requestAnimationFrame = function (fn) { n++; return origRAF(fn); };
      return jobs.reduce(function (p, spec) {
        return p.then(function () {
          var host = document.createElement('div');
          // 放進可視範圍：不然 IntersectionObserver 會先把動畫停掉，
          // 就測不到「換畫面時有沒有真的停」這件事（會假通過）
          host.style.cssText = 'position:fixed;top:0;left:0;width:340px;z-index:99999';
          document.body.appendChild(host);
          window.Widgets.render(host, spec);
          var play = host.querySelector('.wg-btn');
          if (!play) { out.push({ type: spec.type, issue: '找不到播放鍵' }); host.remove(); return; }
          play.click();                                   // 開始播
          return new Promise(function (r) { setTimeout(r, 220); }).then(function () {
            window.Widgets.render(host, { type: 'fracbar', parts: 2, shade: 1 });  // 畫面換掉
            var before = n;
            return new Promise(function (r) { setTimeout(r, 320); }).then(function () {
              var after = n - before;
              // 換畫面後最多容許 1 幀（切換當下可能有一幀已經排進去了）
              if (after > 1) out.push({ type: spec.type,
                issue: '畫面換掉之後動畫還在跑（又排了 ' + after + ' 幀）' });
              host.remove();
            });
          });
        });
      }, Promise.resolve()).then(function () {
        window.requestAnimationFrame = origRAF;
        return out;
      });
     } catch (e) { return [{ type: '（動畫收尾檢查自己爆了）', issue: String(e && e.stack || e).slice(0, 300) }]; }
    })()`);
    if (leaks && leaks.length) {
      console.log(`\n⚠️  動畫沒收乾淨：${leaks.length} 種`);
      leaks.forEach((r) => console.log(`  ${r.type}：${r.issue}`));
      bad = bad.concat(leaks.map((r) => ({ type: r.type, spec: '動畫收尾', issues: [r.issue] })));
    } else {
      console.log(`\n✅ 動畫收尾正常：${animSpecs.length} 種會動的元件，畫面換掉後迴圈都有停`);
    }
  }

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
