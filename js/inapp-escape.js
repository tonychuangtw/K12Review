/* inapp-escape.js（2026-10-21 v2）— 在 App 內建瀏覽器開站時（LINE、Telegram、WeChat、FB／IG、TikTok…）：
 * 能自動跳外部瀏覽器的就跳；跳不了的，底部顯示提示和「複製網址」；並給站內一個共用判斷 InAppEscape.inApp。
 * Google 禁止在 App 內建瀏覽器登入（403 disallowed_useragent），只能換外部瀏覽器。
 * 正本：claude-shared/tools/inapp-escape/inapp-escape.js。各站原封不動複製一份，放在 <head> 裡第一個 <script>
 * （同步載入，不加 defer／async）。怎麼接、實測紀錄、測試：同資料夾 README.md、test.js。
 *
 * - LINE（iOS／Android）：網址加 openExternalBrowser=1（LINE 官方參數），LINE 會改用外部瀏覽器開。
 *   帶了參數還在 LINE 裡（這版 LINE 不吃參數），或 LINE 把網址交給外部瀏覽器後自己留在原頁（2.5 秒還沒換頁）
 *   → 底部「複製網址」提示
 * - Telegram iPhone／iPad（iOS 17 以上）：頁面好了導到 x-safari-https://… → 跳 Safari（同分頁只自動跳一次）；
 *   底部提示有「用 Safari 開」「複製網址」
 *   （2026-10-20 Tony iPhone 實測可行；Telegram iOS 原始碼 BrowserWebContent.swift：非 http(s) 一律
 *    openExternalUrl(forceExternal: true)，不看是不是手指點的，所以開頁就能自動跳）
 * - 其他內建瀏覽器：Telegram Android、iOS 16 以下、WeChat、FB／Messenger／IG／Threads、KakaoTalk、Snapchat、
 *   TikTok／抖音、Android WebView（UA 有 "; wv"）、iPhone 上 UA 沒有 "Safari/" 的 App（Google 也是這樣認的）
 *   → 沒有實測可用的自動跳法，底部「複製網址」提示
 *
 * 給站內用（README「接法」）：
 *   InAppEscape.inApp      true＝在內建瀏覽器裡，Google 登入不能用 → 不顯示 Google 登入鈕，改顯示站內指引
 *   InAppEscape.app        哪個 App：'line'、'telegram'、'wechat'、'facebook'…；認不出名字的是 'webview'；不在 App 裡是 ''
 *   InAppEscape.url()      給使用者複製的乾淨網址：拿掉 openExternalBrowser 和 token／code／state／session 這類參數。
 *                          站內可用 <meta name="inapp-escape-url" content="/#/login"> 指定（按下去那一刻才讀）
 *   InAppEscape.copy(cb)   把 url() 複製到剪貼簿，cb(成功與否, 網址)
 *   InAppEscape.open(fb)   能跳就跳（回 true；Telegram 1.5 秒內沒離開會叫 fb），跳不了回 false
 *
 * Telegram 只能靠 window.TelegramWebviewProxy 認：兩個平台的內建瀏覽器都把 UA 改得跟 Safari／Chrome 一樣
 * （iOS 補 "Safari/604.1"、Android 拿掉 "; wv)"）。Mini App 也有這個物件，但網址 hash 帶 tgWebAppData，
 * 要排除：Mini App 本來就該留在 Telegram 裡。iPhone 加到主畫面的網頁 App（standalone）UA 也沒有 "Safari/"，要排除。
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

  // UA 上的 App 記號，第一個對到的算數（Messenger 要在 FB 前、Threads 在 IG 前、抖音在 TikTok 前）
  var APPS = [
    ['wechat', /MicroMessenger|WeChat/i],
    ['messenger', /FBAN\/Messenger|FB_IAB\/(Orca|MESSENGER)/i],
    ['threads', /Barcelona/],
    ['instagram', /Instagram/i],
    ['facebook', /FBAN\/|FBAV\/|FB_IAB\/|FBIOS|\[FB/],
    ['kakaotalk', /KAKAOTALK/i],
    ['snapchat', /Snapchat/i],
    ['douyin', /aweme/i],
    ['tiktok', /musical_ly|Bytedance|TikTok/i],
    ['whatsapp', /WhatsApp/i]
  ];
  function standalone() {
    try {
      return navigator.standalone === true ||
        !!(w.matchMedia && w.matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches);
    } catch (e) { return false; }
  }
  var app = '';
  if (isLine) app = 'line';
  else if (isTg) app = 'telegram';
  else if (!miniApp) {
    for (var i = 0; i < APPS.length && !app; i++) if (APPS[i][1].test(ua)) app = APPS[i][0];
    if (!app && isAndroid && /;\s*wv\b/.test(ua)) app = 'webview';
    if (!app && isIOS && !/Safari\//.test(ua) && !standalone()) app = 'webview';
  }
  var inApp = top && !!app;

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

  // 複製出去的網址不帶登入憑證：token、OAuth 的 code／state、session…（keyword、author 這種不算）
  var SECRET = /token|secret|passw|credential|session|signature|apikey|jwt|(^|[_.-])(code|state|auth|sid|sig|otp|nonce|key|ticket|pwd)([_.-]|$)/i;
  function cleanQuery(q) {
    return q.split('&').filter(function (p) {
      var k = p.split('=')[0];
      try { k = decodeURIComponent(k); } catch (e) {}
      return k && k !== PARAM && !SECRET.test(k);
    }).join('&');
  }
  function url() {
    var m = d.querySelector('meta[name="inapp-escape-url"]');
    var u;
    try { u = new URL(m && m.content ? m.content : location.href, location.href); } catch (e) { return location.href; }
    var q = cleanQuery(u.search.slice(1));
    var h = u.hash.slice(1);
    var qi = h.indexOf('?');
    if (qi >= 0) { var hq = cleanQuery(h.slice(qi + 1)); h = h.slice(0, qi) + (hq ? '?' + hq : ''); }
    else if (h.indexOf('=') >= 0) h = cleanQuery(h);
    return u.origin + u.pathname + (q ? '?' + q : '') + (h ? '#' + h : '');
  }
  // 先用 Clipboard API，不行再用舊的 execCommand；都不行 cb(false)，由呼叫的人把網址顯示出來讓使用者長按
  function copy(cb) {
    var text = url();
    function finish(ok) { if (typeof cb === 'function') cb(ok, text); }
    function legacy() {
      var ok = false;
      try {
        var ta = d.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px';
        d.body.appendChild(ta);
        ta.focus();
        ta.select();
        ta.setSelectionRange(0, text.length);
        ok = d.execCommand('copy');
        d.body.removeChild(ta);
      } catch (e) {}
      finish(!!ok);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { finish(true); }, legacy);
        return;
      }
    } catch (e) {}
    legacy();
  }

  // 登入鈕用：if (window.InAppEscape && InAppEscape.open(顯示原本指引的函式)) return;
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
    v: '2026-10-21', inApp: inApp, app: app, line: isLine, telegram: isTg, ios: isIOS, android: isAndroid,
    iosMajor: iosMajor, canEscape: top && ((isLine && !hasParam()) || canSafari), open: open, url: url, copy: copy
  };
  if (!top) return;

  var leaving = isLine && !hasParam();
  if (leaving) go(addParam(location.href), true);   // replace：上一頁不會回到沒參數的網址又被導一次
  else if (!isLine) stripParam();
  if (!inApp) return;

  // 提示列的字：照 <html lang>（站內切語言會跟著換），沒有就照手機語言；沒有的語言用英文
  var T = {
    'zh-Hant': { msg: '{app}裡不能用 Google 登入', any: 'App 內建瀏覽器', safari: '用 Safari 開', copy: '複製網址',
      copied: '已複製，貼到 {b} 開啟', manual: '長按網址複製，貼到 {b} 開啟', close: '關閉', b: '瀏覽器' },
    'zh-Hans': { msg: '{app}里无法使用 Google 登录', any: 'App 内置浏览器', safari: '用 Safari 打开', copy: '复制链接',
      copied: '已复制，粘贴到 {b} 打开', manual: '长按链接复制，粘贴到 {b} 打开', close: '关闭', b: '浏览器' },
    en: { msg: "Google sign-in doesn't work in {app}", any: "this app's browser", safari: 'Open in Safari', copy: 'Copy link',
      copied: 'Copied. Paste it into {b}', manual: 'Press and hold the link to copy it, then paste it into {b}', close: 'Close', b: 'your browser' },
    ja: { msg: '{app}ではGoogleログインを使えません', any: 'アプリ内ブラウザ', safari: 'Safariで開く', copy: 'リンクをコピー',
      copied: 'コピーしました。{b}に貼り付けて開いてください', manual: 'リンクを長押ししてコピーし、{b}に貼り付けて開いてください', close: '閉じる', b: 'ブラウザ' },
    ko: { msg: '{app}에서는 Google 로그인을 사용할 수 없습니다', any: '앱 내 브라우저', safari: 'Safari로 열기', copy: '링크 복사',
      copied: '복사했습니다. {b}에 붙여넣어 열어 주세요', manual: '링크를 길게 눌러 복사한 뒤 {b}에 붙여넣어 열어 주세요', close: '닫기', b: '브라우저' },
    es: { msg: 'El inicio de sesión con Google no funciona en {app}', any: 'el navegador de esta app', safari: 'Abrir en Safari', copy: 'Copiar enlace',
      copied: 'Copiado: pégalo en {b}', manual: 'Mantén pulsado el enlace para copiarlo y pégalo en {b}', close: 'Cerrar', b: 'tu navegador' },
    fr: { msg: 'La connexion Google ne fonctionne pas dans {app}', any: 'le navigateur de cette appli', safari: 'Ouvrir dans Safari', copy: 'Copier le lien',
      copied: 'Copié : collez-le dans {b}', manual: 'Appuyez longuement sur le lien pour le copier, puis collez-le dans {b}', close: 'Fermer', b: 'votre navigateur' },
    de: { msg: 'Google-Anmeldung funktioniert nicht in {app}', any: 'diesem In-App-Browser', safari: 'In Safari öffnen', copy: 'Link kopieren',
      copied: 'Kopiert. In {b} einfügen', manual: 'Link gedrückt halten, kopieren und in {b} einfügen', close: 'Schließen', b: 'deinen Browser' },
    it: { msg: "L'accesso con Google non funziona in {app}", any: 'questo browser interno', safari: 'Apri in Safari', copy: 'Copia link',
      copied: 'Copiato: incollalo in {b}', manual: 'Tieni premuto il link per copiarlo, poi incollalo in {b}', close: 'Chiudi', b: 'un browser' }
  };
  var NAMES = { line: 'LINE', telegram: 'Telegram', wechat: 'WeChat', messenger: 'Messenger', threads: 'Threads', instagram: 'Instagram',
    facebook: 'Facebook', kakaotalk: 'KakaoTalk', snapchat: 'Snapchat', douyin: 'Douyin', tiktok: 'TikTok', whatsapp: 'WhatsApp' };
  var NAMES_ZH = { wechat: '微信', douyin: '抖音' };
  function lang() {
    var l = (d.documentElement.lang || navigator.language || 'en').toLowerCase();
    if (/^zh/.test(l)) return /hans|-cn|-sg|-my/.test(l) ? 'zh-Hans' : 'zh-Hant';
    l = l.slice(0, 2);
    return T[l] ? l : 'en';
  }
  function text(key) {
    var l = lang();
    var zh = l.indexOf('zh') === 0;
    var s = T[l][key].replace('{app}', (zh && NAMES_ZH[app]) || NAMES[app] || T[l].any)
      .replace('{b}', isIOS ? 'Safari' : isAndroid ? 'Chrome' : T[l].b);
    // 中文跟英數之間留空格（「Telegram 裡」）
    return zh ? s.replace(/([A-Za-z0-9])([一-鿿])/g, '$1 $2').replace(/([一-鿿])([A-Za-z0-9])/g, '$1 $2') : s;
  }

  function el(tag, css) { var e = d.createElement(tag); e.style.cssText = css; return e; }
  function button(act, css, fn) {
    var b = el('button', css);
    b.type = 'button';
    b.setAttribute('data-act', act);
    b.onclick = fn;
    return b;
  }
  var BTN = 'flex:none;border-radius:8px;padding:8px 12px;font:inherit;font-weight:600;cursor:pointer;';
  var MAIN = BTN + 'border:0;background:#3b82f6;color:#fff';
  var SUB = BTN + 'border:1px solid #94a3b8;background:transparent;color:#fff';

  // 留在內建瀏覽器裡的這一頁：底部一條提示＋「用 Safari 開」（能跳的才有）＋「複製網址」；按 × 同分頁不再出現
  function banner() {
    if (ss('inappEscape.hide') || d.getElementById('inapp-escape-bar')) return;
    var state = 'msg';
    var field = null;
    var bar = el('div', 'position:fixed;left:8px;right:8px;bottom:calc(8px + env(safe-area-inset-bottom,0px));z-index:2147483647;' +
      'display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:10px 10px 10px 14px;border-radius:12px;background:#1f2937;color:#fff;' +
      'font:14px/1.4 -apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC",sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.35)');
    bar.id = 'inapp-escape-bar';
    bar.setAttribute('role', 'status');
    var txt = el('span', 'flex:1 1 0;min-width:0');
    var x = button('close', 'flex:none;border:0;background:none;color:#cbd5e1;font:20px/1 sans-serif;padding:4px 6px;cursor:pointer', function () {
      ss('inappEscape.hide', '1');
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    });
    x.textContent = '×';
    var row = el('div', 'flex:1 1 100%;display:flex;justify-content:flex-end;gap:8px');
    var sf = canSafari ? button('safari', MAIN, safari) : null;
    var cp = button('copy', sf ? SUB : MAIN, function () {
      copy(function (ok, u) {
        state = ok ? 'copied' : 'manual';
        if (!ok && !field) {
          field = el('input', 'flex:1 1 100%;min-width:0;box-sizing:border-box;border:0;border-radius:6px;padding:6px 8px;' +
            'font:16px/1.3 ui-monospace,Menlo,monospace;color:#111827;background:#fff');
          field.readOnly = true;
          field.setAttribute('aria-label', 'URL');
          field.onfocus = field.onclick = function () { try { field.setSelectionRange(0, field.value.length); } catch (e) { field.select(); } };
          bar.insertBefore(field, row);
        }
        if (field) { field.value = u; try { field.focus(); } catch (e) {} }
        render();
      });
    });
    function render() {
      txt.textContent = text(state);
      x.setAttribute('aria-label', text('close'));
      if (sf) sf.textContent = text('safari');
      cp.textContent = (state === 'copied' ? '✓ ' : '') + text('copy');
    }
    if (sf) row.appendChild(sf);
    row.appendChild(cp);
    bar.appendChild(txt);
    bar.appendChild(x);
    bar.appendChild(row);
    render();
    (d.body || d.documentElement).appendChild(bar);   // 頁面被中途停掉（還沒有 body）也要看得到
    if (w.MutationObserver) new MutationObserver(render).observe(d.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  function ready() {
    banner();
    // 同一個內建瀏覽器分頁只自動跳一次：跳到 Safari 後回 Telegram 再點站內連結，不會一直被彈出去
    if (canSafari && !ss('inappEscape.tried')) { ss('inappEscape.tried', '1'); safari(); }
  }
  function whenReady(fn) { if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', fn); else fn(); }
  // LINE 剛導去帶參數的網址：導成功這頁就沒了；2.5 秒後還在＝LINE 把網址交給外部瀏覽器、自己留在這頁 → 補提示列
  if (leaving) { setTimeout(function () { whenReady(banner); }, 2500); return; }
  // 等 DOM 好了再跳：頁面先完整顯示（含提示列），跳出去後回到 Telegram 看到的不是半頁
  whenReady(ready);
})(window, document);
