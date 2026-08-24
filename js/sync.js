/* K12學霸養成 cloud sync — Google Identity Services + progress sync API.
 * 比照 LanExamMock/poker 同一套後端（app=chinese），跨裝置同步 localStorage 進度。 */
(function () {
  var CLIENT_ID = "481860179039-gb37qsdogd4vgnn2g5umh73jen02avj4.apps.googleusercontent.com";
  var API_BASE = "https://claudebot500.tailfcf67f.ts.net";

  if (!CLIENT_ID || !API_BASE || typeof window === "undefined") return;

  // App 內建瀏覽器（LINE/Telegram/FB 等 webview）偵測：Google 封鎖 webview 內的 OAuth，
  // GSI 元件就算載得進來，點登入也只會開出一片空白的 accounts.google.com（2026-08-15 Tony 實測）。
  // 這類環境直接給「改用外部瀏覽器」指引，不讓使用者踩進死路。
  var IN_WEBVIEW = (function () {
    var ua = navigator.userAgent || "";
    // ⚠️ 不可拿 window.webkit.messageHandlers 當判據：iOS/iPadOS 上的 Chrome／Edge／Firefox
    // 全是 WKWebView 殼、都會注入這個物件，2026-08-24 Tony 的 iPad Chrome 被誤判成 App 內建
    // 瀏覽器、整站登入不了（Google 登入在這些真瀏覽器是完全可用的）。
    return /\bwv\b/.test(ua) ||                                    // Android WebView
      (/iPhone|iPad|iPod/.test(ua) && !/Safari\//.test(ua)) ||     // iOS 內嵌 WKWebView（無 Safari token）
      /Line\/|FBAN|FBAV|Instagram|MicroMessenger|Telegram|LIFF/i.test(ua) ||
      !!window.TelegramWebviewProxy;                               // Telegram iOS（UA 無任何標記，只能認注入物件）
  })();

  // LINE 內建瀏覽器有官方逃生參數：網址帶 openExternalBrowser=1，LINE 會自動改用外部瀏覽器開。
  // 在 LINE 裡開站就自動重導一次，點了直接可用、不用手動「用 Safari 開啟」（Tony 2026-08-24）。
  // 真瀏覽器帶到這參數無害；重導前先檢查參數避免無限迴圈（舊版 LINE 不吃參數時會真的重載）。
  if (/Line\//i.test(navigator.userAgent || "") && !/[?&]openExternalBrowser=/.test(location.search)) {
    var q = location.search ? location.search + "&openExternalBrowser=1" : "?openExternalBrowser=1";
    location.replace(location.origin + location.pathname + q + location.hash);
  }
  var WEBVIEW_MSG = "Google 不允許在 App 內建瀏覽器（LINE／Telegram 等）裡登入，硬走只會看到空白頁。\n請點畫面角落的選單（⋯ 或分享鈕），選「用 Safari／Chrome 開啟」，再登入即可同步進度。";
  var GIS_RETRY_MSG = "連不上 Google 登入元件（accounts.google.com 沒有回應），可能是網路不穩、擋廣告套件或內容過濾在擋。要再試一次嗎？";

  // UIDialog 可能因混版快取（舊 HTML 沒載 dialog.js + 新 sync.js）不存在——退回原生框保底
  function dlgAlert(msg) { if (window.UIDialog) UIDialog.alert(msg); else alert(msg); }
  function dlgConfirm(msg, ok) { if (window.UIDialog) UIDialog.confirm(msg, ok); else if (confirm(msg)) ok(); }

  var TOKEN_KEY = "sync.token";
  // 長效 session（2026-08-22 Tony 回報「不要一直要求登入」）：Google ID token 只有 1 小時，
  // 又存在 sessionStorage，關掉分頁就沒了 → 手機幾乎每次開站都要重登（還被強制登入守門擋住）。
  // 改成登入後打 POST /api/session 換一顆後端簽的 30 天 token 存 localStorage，每次開頁再換新
  // （滾動續期，只要 30 天內有用過就不會過期）。後端 2026-08-12 就有這支，之前只有 seatsrooms 在用。
  // ⚠️ 這兩個 key 不能用 PREFIX 開頭：gatherKeys() 會把 PREFIX 開頭的 key 整包推上雲端，
  //    再同步到別台裝置 —— token 會跟著跑到別人的瀏覽器。
  var SESS_KEY = "sync.sess";
  var PROFILE_KEY = "sync.profile";
  var PREFIX = "chinese-review";        // 同步所有這個前綴的 key（目前只有 chinese-review-v1）
  var SYNC_TS_KEY = "chinese-review.sync_ts";
  var PUSH_INTERVAL_MS = 60000;
  var lastPushedHash = null;

  function ls(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function ss(k) { try { return sessionStorage.getItem(k) || ""; } catch (e) { return ""; } }
  // 長效 token 優先；剛登入還沒換到手時才用 sessionStorage 裡的 Google ID token
  function token() { return ls(SESS_KEY) || ss(TOKEN_KEY); }
  function setToken(t) { try { sessionStorage.setItem(TOKEN_KEY, t); } catch (e) {} }
  function setSess(t) {
    try { localStorage.setItem(SESS_KEY, t); sessionStorage.removeItem(TOKEN_KEY); } catch (e) {}
  }
  function clearToken() {
    try { sessionStorage.removeItem(TOKEN_KEY); } catch (e) {}
    try { localStorage.removeItem(SESS_KEY); localStorage.removeItem(PROFILE_KEY); } catch (e) {}
  }

  function b64Payload(seg) {
    try { return JSON.parse(atob(seg.replace(/-/g, "+").replace(/_/g, "/"))); }
    catch (e) { return null; }
  }
  function jwtPayload(t) { return t ? b64Payload(String(t).split(".")[1] || "") : null; }
  function profile() { try { return JSON.parse(ls(PROFILE_KEY) || "null"); } catch (e) { return null; } }
  // 回傳 {email, given_name/name（顯示用）, exp 秒}；兩種 token 格式都吃：
  // sess.<payload>.<sig>（後端 HMAC，payload {e:email, s:sub, x:到期毫秒}）與 Google ID token（JWT）
  function signedIn() {
    var t = token();
    if (!t) return null;
    if (t.indexOf("sess.") === 0) {
      var s = b64Payload(t.split(".")[1] || "");
      if (!s || !s.e || !(s.x > Date.now())) return null;
      var pr = profile() || {};
      return { email: s.e, sub: s.s, exp: Math.floor(s.x / 1000), name: pr.name, given_name: pr.given_name };
    }
    var p = jwtPayload(t);
    return p && p.exp * 1000 > Date.now() ? p : null;
  }

  function gatherKeys() {
    var out = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0 && k !== SYNC_TS_KEY) {
          out[k] = localStorage.getItem(k);
        }
      }
    } catch (e) {}
    return out;
  }
  function blobHash(obj) {
    var s = JSON.stringify(obj), h = 0;
    for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
    return h + ":" + s.length;
  }

  function api(method, body, cb) { req(method, "/api/progress?level=main&app=chinese", body, cb); }

  function req(method, path, body, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, API_BASE + path);
    xhr.setRequestHeader("Authorization", "Bearer " + token());
    if (body) xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 401) { clearToken(); renderUi(); cb("auth"); return; }
      if (xhr.status < 200 || xhr.status >= 300) { cb("http " + xhr.status); return; }
      var data = null;
      try { data = JSON.parse(xhr.responseText); } catch (e) {}
      cb(null, data);
    };
    xhr.onerror = function () { cb("network"); };
    xhr.send(body ? JSON.stringify(body) : null);
  }

  // 拿現有 token（Google ID token 或還沒過期的 sess）換一顆新的 30 天 token。
  // 登入當下呼叫一次，之後每次開頁再呼叫一次 → 只要 30 天內開過站就永遠不用重登。
  function refreshSession(done) {
    if (!token()) { if (done) done("no token"); return; }
    req("POST", "/api/session", {}, function (err, res) {
      if (!err && res && res.token) { setSess(res.token); renderUi(); }
      if (done) done(err || null);
    });
  }

  function syncTs() {
    try { return parseInt(localStorage.getItem(SYNC_TS_KEY) || "0", 10) || 0; } catch (e) { return 0; }
  }
  function setSyncTs(ts) {
    try { localStorage.setItem(SYNC_TS_KEY, String(ts)); } catch (e) {}
  }

  function pull(done) {
    api("GET", null, function (err, res) {
      if (err || !res || !res.blob) { if (done) done(err); return; }
      var serverTs = res.updatedAt || 0;
      if (serverTs > syncTs()) {
        try {
          Object.keys(res.blob).forEach(function (k) {
            if (k.indexOf(PREFIX) === 0) localStorage.setItem(k, res.blob[k]);
          });
        } catch (e) {}
        setSyncTs(serverTs);
        if (done) done(null, true);   // applied → caller should reload
        return;
      }
      if (done) done(null, false);
    });
  }

  function push(done) {
    var data = gatherKeys();
    var h = blobHash(data);
    if (h === lastPushedHash) { if (done) done(null, false); return; }
    // 防蓋舊（2026-08-08）：背景舊分頁的定時 push 會把另一台裝置的新進度整包蓋掉。
    // 推送前先看雲端時間戳：比本機 sync_ts 新代表別台寫過 → 改成套用雲端資料並重載，不推。
    api("GET", null, function (gerr, gres) {
      if (!gerr && gres && (gres.updatedAt || 0) > syncTs()) {
        if (gres.blob) {
          try {
            Object.keys(gres.blob).forEach(function (k) {
              if (k.indexOf(PREFIX) === 0) localStorage.setItem(k, gres.blob[k]);
            });
          } catch (e) {}
          setSyncTs(gres.updatedAt);
          location.reload();
          return;
        }
      }
      api("PUT", data, function (err, res) {
        if (err) { if (done) done(err); return; }
        lastPushedHash = h;
        if (res && res.updatedAt) setSyncTs(res.updatedAt);
        setStatus("✓ 已同步");
        if (done) done(null, true);
      });
    });
  }

  /* ---------------- UI ---------------- */
  var ui = null, statusEl = null, statusTimer = null;

  function setStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () { statusEl.textContent = ""; }, 3000);
  }

  function renderUi() {
    if (!ui) return;
    var p = signedIn();
    if (p) {
      ui.innerHTML = "";
      var chip = document.createElement("button");
      chip.className = "chip sync-chip";
      chip.title = (p.email || "") + " — 點擊登出";
      chip.textContent = (p.given_name || p.name || "?").charAt(0).toUpperCase();
      chip.addEventListener("click", function () {
        dlgConfirm("登出雲端同步？（本機進度會保留在此裝置）", function () {
          clearToken(); lastPushedHash = null; renderUi();
        });
      });
      statusEl = document.createElement("span");
      statusEl.className = "sync-status";
      ui.appendChild(statusEl);
      ui.appendChild(chip);
    } else {
      ui.innerHTML = "";
      statusEl = null;
      var wrap = document.createElement("div");
      wrap.className = "sync-login-wrap";
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "chip sync-login";
      pill.textContent = "登入";
      pill.title = "Google 登入，跨裝置同步進度";
      // GSI 載入後，透明的官方按鈕會蓋在 pill 上接走點擊；
      // 沒載入（App 內建瀏覽器常擋 accounts.google.com）時 pill 仍可點，給指引
      pill.addEventListener("click", function () {
        if (!IN_WEBVIEW && window.google && google.accounts && google.accounts.id) {
          google.accounts.id.prompt();
        } else if (IN_WEBVIEW) {
          dlgAlert(WEBVIEW_MSG);
        } else if (gisFailed) {
          dlgConfirm(GIS_RETRY_MSG, function () { gisFailed = false; gisAttempts = 0; loadGis(); });
        } else {
          dlgAlert("Google 登入元件還在載入，請稍候幾秒再點一次。");
        }
      });
      var slot = document.createElement("div");
      slot.className = "gsi-slot";
      // 空 slot 是蓋在 pill 上的透明層，會把點擊整個吃掉（2026-08-16 Tony 實測：
      // LINE webview 裡 GSI 不載入、slot 永遠是空的 → 登入鈕完全按不動）。
      // 預設關掉 pointer-events，等官方按鈕真的掛上去才打開；webview 乾脆不掛 slot。
      slot.style.pointerEvents = "none";
      wrap.appendChild(pill);
      if (!IN_WEBVIEW) wrap.appendChild(slot);
      ui.appendChild(wrap);
      // webview 裡不掛官方按鈕：它會蓋在 pill 上把點擊帶進空白登入頁
      if (!IN_WEBVIEW && window.google && google.accounts && google.accounts.id) {
        slot.style.pointerEvents = "";
        google.accounts.id.renderButton(slot, { type: "icon", shape: "circle", size: "large" });
      }
    }
  }

  function onCredential(resp) {
    if (!resp || !resp.credential) return;
    setToken(resp.credential);
    // sess token 裡只有 email，頭像字母要用的名字先留一份在本機
    var p = jwtPayload(resp.credential) || {};
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({
        email: p.email || "", name: p.name || "", given_name: p.given_name || "",
      }));
    } catch (e) {}
    renderUi();
    setStatus("同步中…");
    // 先換長效 token 再同步：換到手才算真的「登入一次就好」
    refreshSession(function () {
      pull(function (err, applied) {
        if (applied) { location.reload(); return; }
        push();
      });
    });
  }

  function initGis() {
    google.accounts.id.initialize({ client_id: CLIENT_ID, callback: onCredential, auto_select: true });
    renderUi();
  }

  /* gsi/client 載入改為自動重試（2026-08-23 poker 站教訓：Google 元件偶發載不進來時，
     只丟一句「換外部瀏覽器」會誤導真瀏覽器的使用者），最多 3 次、每次 8 秒 */
  var gisAttempts = 0, gisFailed = false;
  function loadGis() {
    gisAttempts++;
    var settled = false;
    var s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = function () { settled = true; gisFailed = false; initGis(); };
    s.onerror = function () { if (!settled) { settled = true; gisRetryOrFail(); } };
    setTimeout(function () {
      if (settled || (window.google && google.accounts && google.accounts.id)) return;
      settled = true;
      gisRetryOrFail();
    }, 8000);
    document.head.appendChild(s);
  }
  function gisRetryOrFail() {
    if (gisAttempts < 3) { loadGis(); return; }
    gisFailed = true;
  }

  function boot() {
    var controls = document.querySelector(".topbar-controls");
    if (!controls) return;
    ui = document.createElement("div");
    ui.className = "sync-ui";
    controls.appendChild(ui);
    renderUi(); // 先畫出登入鈕：GSI 被擋（App 內建瀏覽器）時入口也不能消失（2026-08-15 Tony 回報）

    if (!IN_WEBVIEW) loadGis();

    setInterval(function () { if (signedIn()) push(); }, PUSH_INTERVAL_MS);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden" && signedIn()) push();
      // 切回分頁時拉一次雲端（2026-08-08）：修「另一台做完、這台舊分頁看不到」——
      // 原本只有登入那一刻會 pull，掛在背景的分頁永遠不更新。
      if (document.visibilityState === "visible" && signedIn()) {
        pull(function (err, applied) { if (applied) location.reload(); });
      }
    });
    // 開頁時若已是登入狀態（30 天 sess token）：續期一次再拉雲端進度
    if (signedIn()) {
      refreshSession();
      pull(function (err, applied) { if (applied) location.reload(); });
    }
  }

  // 給家長儀表板用的最小介面（授權管理 grants API 走這裡拿 token）
  // 觸發 Google One Tap 登入提示（強制登入守門用，2026-08-09）
  function promptLogin() {
    try {
      if (window.google && google.accounts && google.accounts.id) google.accounts.id.prompt();
    } catch (e) {}
    var pill = document.querySelector(".sync-login-wrap, .sync-ui");
    if (pill) {
      pill.classList.add("sync-flash");
      setTimeout(function () { pill.classList.remove("sync-flash"); }, 2400);
    }
  }
  window.CloudSync = { signedIn: signedIn, token: token, apiBase: API_BASE, promptLogin: promptLogin };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
