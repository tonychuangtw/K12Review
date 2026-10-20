/* inapp-escape.js（2026-10-20）— 在 LINE／Telegram 的 App 內建瀏覽器開站時，自動改用外部瀏覽器開同一頁。
 * Google 禁止在 App 內建瀏覽器登入（403 disallowed_useragent），只能跳出去。
 * 正本：claude-shared/tools/inapp-escape/inapp-escape.js。各站原封不動複製一份，放在 <head> 裡第一個 <script>
 * （同步載入，不加 defer／async）。怎麼接、實測紀錄、測試：同資料夾 README.md、test.js。
 *
 * - LINE（iOS／Android）：網址加 openExternalBrowser=1（LINE 官方參數），LINE 會改用外部瀏覽器開
 * - Telegram iPhone／iPad（iOS 17 以上）：導到 x-safari-https://…，Telegram 把非 http(s) 網址交給系統開 → Safari
 *   （2026-10-20 Tony iPhone 實測可行；Telegram iOS 原始碼 BrowserWebContent.swift：非 http(s) 一律
 *    openExternalUrl(forceExternal: true)，不看是不是手指點的，所以開頁就能自動跳）
 * - Telegram Android、iOS 16 以下、FB／IG 等其他 App：沒有實測可用的自動跳法 → 不動作，交給各站原本的指引
 *
 * Telegram 只能靠 window.TelegramWebviewProxy 認：兩個平台的內建瀏覽器都把 UA 改得跟 Safari／Chrome 一樣
 * （iOS 補 "Safari/604.1"、Android 拿掉 "; wv)"）。Mini App 也有這個物件，但網址 hash 帶 tgWebAppData，
 * 要排除：Mini App 本來就該留在 Telegram 裡。
 * ⛔ 不准用 window.webkit.messageHandlers 判斷：iPhone／iPad 上的 Chrome 也有（2026-08-24 iPad Chrome 被誤判事故）。
 */
(function (w, d) {
  'use strict';
  if (w.InAppEscape) return;

  var ua = navigator.userAgent || '';
  var PARAM = 'openExternalBrowser';

  function ss(key, val) {
    try {
      if (val === undefined) return w.sessionStorage.getItem(key);
      w.sessionStorage.setItem(key, val);
    } catch (e) {}
    return null;
  }

  var top = w.self === w.top;
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/.test(ua);
  var isLine = /\bLine\//i.test(ua);
  if (/[#&]tgWebApp(Data|Version|Platform)=/.test(location.hash)) ss('inappEscape.miniapp', '1');
  var miniApp = !!(ss('inappEscape.miniapp') || ss('__telegram__initParams'));
  var isTg = !miniApp && (!!w.TelegramWebviewProxy || /Telegram/i.test(ua));
  var ver = ua.match(/ OS (\d+)_/) || ua.match(/Version\/(\d+)/);
  var iosMajor = isIOS && ver ? parseInt(ver[1], 10) : 0;
  var canSafari = top && isTg && isIOS && iosMajor >= 17 && /^https?:$/.test(location.protocol);

  function hasParam() { return new RegExp('[?&]' + PARAM + '=').test(location.search); }
  function addParam(href) {
    var i = href.indexOf('#');
    var base = i < 0 ? href : href.slice(0, i);
    return base + (base.indexOf('?') < 0 ? '?' : '&') + PARAM + '=1' + (i < 0 ? '' : href.slice(i));
  }
  // 已經在外部瀏覽器：把 openExternalBrowser=1 從網址拿掉，書籤、分享出去才乾淨
  function stripParam() {
    if (!hasParam() || !w.history || !history.replaceState) return;
    var q = location.search.slice(1).split('&').filter(function (p) { return p.split('=')[0] !== PARAM; }).join('&');
    try { history.replaceState(history.state, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (e) {}
  }
  // data-inapp-escape 記下要去的網址：test.js 靠它驗證（瀏覽器自動化看不到自訂 scheme 的導向）
  function go(url, replace) {
    d.documentElement.setAttribute('data-inapp-escape', url);
    if (replace) location.replace(url); else location.href = url;
  }
  function safari() { go('x-safari-' + location.href); }

  // 給各站登入鈕用：if (window.InAppEscape && InAppEscape.open(顯示原本指引的函式)) return;
  // 回 true＝正在跳出去；Telegram 1.5 秒內沒離開（沒跳成功）會呼叫那個函式。回 false＝跳不了，照原本顯示指引
  function open(fallback) {
    if (!top) return false;
    if (isLine) {
      if (hasParam()) return false;   // 帶了參數還在 LINE 裡＝這版 LINE 不吃參數，交給指引
      go(addParam(location.href), true);
      return true;
    }
    if (!canSafari) return false;
    var left = false;
    function onVis() { if (d.visibilityState === 'hidden') left = true; }
    d.addEventListener('visibilitychange', onVis);
    safari();
    setTimeout(function () {
      d.removeEventListener('visibilitychange', onVis);
      if (!left && typeof fallback === 'function') fallback();
    }, 1500);
    return true;
  }

  w.InAppEscape = {
    v: '2026-10-20', line: isLine, telegram: isTg, ios: isIOS, android: isAndroid, iosMajor: iosMajor,
    canEscape: top && ((isLine && !hasParam()) || canSafari), open: open
  };
  if (!top) return;

  if (isLine) {
    if (!hasParam()) go(addParam(location.href), true);   // replace：上一頁不會回到沒參數的網址又被導一次
    return;
  }
  stripParam();
  if (!canSafari) return;

  // 留在 Telegram 裡的這一頁：底部一條提示＋「用 Safari 開」（自動跳沒成功或使用者跑回來時用）
  function banner() {
    if (ss('inappEscape.hide') || d.getElementById('inapp-escape-bar')) return;
    var zh = /^zh/i.test(d.documentElement.lang || navigator.language || '');
    var bar = d.createElement('div');
    bar.id = 'inapp-escape-bar';
    bar.setAttribute('role', 'status');
    bar.style.cssText = 'position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom,0px));z-index:2147483647;' +
      'display:flex;align-items:center;gap:8px;padding:10px 10px 10px 14px;border-radius:12px;background:#1f2937;color:#fff;' +
      'font:14px/1.4 -apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC",sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.35)';
    var txt = d.createElement('span');
    txt.style.cssText = 'flex:1;min-width:0';
    txt.textContent = zh ? 'Telegram 裡不能用 Google 登入' : "Google sign-in doesn't work inside Telegram";
    var btn = d.createElement('button');
    btn.type = 'button';
    btn.textContent = zh ? '用 Safari 開' : 'Open in Safari';
    btn.style.cssText = 'flex:none;border:0;border-radius:8px;padding:8px 12px;background:#3b82f6;color:#fff;font:inherit;font-weight:600;cursor:pointer';
    btn.onclick = safari;
    var x = d.createElement('button');
    x.type = 'button';
    x.textContent = '×';
    x.setAttribute('aria-label', zh ? '關閉' : 'Close');
    x.style.cssText = 'flex:none;border:0;background:none;color:#cbd5e1;font:20px/1 sans-serif;padding:4px 6px;cursor:pointer';
    x.onclick = function () { ss('inappEscape.hide', '1'); if (bar.parentNode) bar.parentNode.removeChild(bar); };
    bar.appendChild(txt);
    bar.appendChild(btn);
    bar.appendChild(x);
    d.body.appendChild(bar);
  }
  function ready() {
    banner();
    // 同一個內建瀏覽器分頁只自動跳一次：跳到 Safari 後回 Telegram 再點站內連結，不會一直被彈出去
    if (!ss('inappEscape.tried')) { ss('inappEscape.tried', '1'); safari(); }
  }
  // 等 DOM 好了再跳：頁面先完整顯示（含提示列），跳出去後回到 Telegram 看到的不是半頁
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', ready); else ready();
})(window, document);
