/* js/sync.js 長效登入（30 天 session token）行為測試。
 *
 * 為什麼要有這支：2026-08-22 Tony 回報「不要一直要求登入」。原因是前端把 Google ID token
 * （只有 1 小時）存在 sessionStorage，關掉分頁就沒了，加上首頁有「未登入不能開始練習」的守門，
 * 等於每次開站都被擋。修法是登入後打 POST /api/session 換一顆後端簽的 30 天 token 存 localStorage。
 * 這支把 sync.js 放進假的瀏覽器環境跑，確認：token 認得、會過期、壞掉不會爆、而且不會被同步外流。
 *
 * 跑法：node test/sync-session.js
 * token 格式對齊 claude-shared/projects/LanExamMock/backend/auth.js 的 issueSessionToken()
 * （sess.<base64url payload>.<HMAC 簽章>，payload = {e:email, s:sub, x:到期毫秒}）。
 * 前端只解析不驗簽（驗簽是後端的事），所以這裡的簽章欄位隨便填即可。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SYNC_JS = path.join(__dirname, '..', 'js', 'sync.js');

function sessToken(email, ms) {
  const payload = Buffer.from(JSON.stringify({ e: email, s: 'sub-1', x: ms })).toString('base64url');
  return `sess.${payload}.signature-not-checked-by-frontend`;
}
function jwtToken(claims) {
  return 'header.' + Buffer.from(JSON.stringify(claims)).toString('base64url') + '.sig';
}

function store() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    key: (i) => Array.from(m.keys())[i],
    get length() { return m.size; },
  };
}

// sync.js 是 IIFE，載進一個最小的假瀏覽器環境；沒有 .topbar-controls 時 boot() 會自己收手，
// 但 window.CloudSync 在那之前就掛好了，正好拿來測純邏輯。
// 可控制的假瀏覽器：routes 決定每一支 API 回什麼，reloads 記錄重載了幾次。
// 給同步測試用（pull / push / 409 衝突），單純的登入測試不必傳 opts。
function loadSync(opts) {
  opts = opts || {};
  const localStorage = opts.localStorage || store(), sessionStorage = store();
  const el = () => ({
    style: {}, classList: { add() {}, remove() {} }, appendChild() {}, addEventListener() {},
    innerHTML: '', textContent: '',
  });
  const ctx = {
    document: {
      readyState: 'complete', querySelector: () => null, createElement: el,
      addEventListener: () => {}, head: { appendChild: () => {} },
      // busyNow() 靠這個判斷「使用者正在做題」：回傳一個沒有 hidden 的作答畫面就是忙碌中
      getElementById: (id) => (opts.busy && opts.busy() && id === 'view-quiz'
        ? { classList: { contains: () => false } } : null),
    },
    navigator: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/605.1.15' },
    localStorage, sessionStorage,
    XMLHttpRequest: class {
      open(method, url) { this._m = method; this._u = url; }
      setRequestHeader() {}
      send(body) {
        const r = (opts.route || (() => ({ status: 200, body: {} })))(this._m, this._u, body);
        this.status = r.status;
        this.responseText = JSON.stringify(r.body === undefined ? {} : r.body);
        if (this.onload) this.onload();
      }
    },
    setInterval: (fn) => { (opts.timers || []).push(fn); return 1; }, clearInterval: () => {},
    setTimeout: () => {}, clearTimeout: () => {},
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    location: { reload: () => { (opts.reloads || []).push(1); } },
  };
  ctx.window = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(SYNC_JS, 'utf8'), ctx);
  return { CS: ctx.window.CloudSync, localStorage, sessionStorage, win: ctx.window };
}

// 已登入、且本機有一份進度的環境（同步測試的共同起點）
// 與 js/sync.js 的 blobHash 同一套算法：用來偽造「上次成功上傳的內容雜湊」
function blobHashOf(obj) {
  const str = JSON.stringify(obj);
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h + ':' + str.length;
}

function signedInEnv(opts) {
  opts = opts || {};
  const localStorage = store();
  localStorage.setItem('sync.sess', sessToken('kid@example.com', Date.now() + 30 * 86400000));
  localStorage.setItem('chinese-review-v1', JSON.stringify({ score: 'local' }));
  localStorage.setItem('chinese-review.sync_ts', '1000');
  // 預設情境＝「本機內容和上次成功上傳的一模一樣」（沒有未上傳的新進度），
  // 這時雲端較新就該被套用。要模擬「剛做完還沒上傳」的情境，傳 unpushed: true。
  if (!opts.unpushed) {
    localStorage.setItem('sync.pushed.chinese', JSON.stringify(['chinese-review-v1']));
    localStorage.setItem('sync.pushedhash.chinese',
      blobHashOf({ 'chinese-review-v1': JSON.stringify({ score: 'local' }) }));
  }
  const reloads = [], timers = [];
  const env = loadSync(Object.assign({ localStorage, reloads, timers }, opts || {}));
  return Object.assign(env, { reloads, timers });
}
const CLOUD = { 'chinese-review-v1': JSON.stringify({ score: 'cloud' }) };
function localBlob(ls) { return ls.getItem('chinese-review-v1'); }

let fail = 0;
function ok(cond, msg) {
  console.log((cond ? '  ✓ ' : '  ✗ ') + msg);
  if (!cond) fail++;
}

console.log('sync.js 長效登入');

{
  const { CS } = loadSync();
  ok(!!CS, 'CloudSync 介面有掛上 window');
  ok(CS.signedIn() === null, '沒有 token → 未登入');
}

{
  const { CS, localStorage } = loadSync();
  const exp = Date.now() + 30 * 86400000;
  localStorage.setItem('sync.sess', sessToken('kid@example.com', exp));
  localStorage.setItem('sync.profile', JSON.stringify({ email: 'kid@example.com', name: 'Wang Xiaoming', given_name: 'Xiaoming' }));
  const p = CS.signedIn();
  ok(!!p, '有 30 天 sess token → 已登入（關掉分頁再開也還在）');
  ok(p && p.email === 'kid@example.com', 'email 解析正確');
  ok(p && p.given_name === 'Xiaoming', '頭像字母用的名字取得到');
  const days = p ? (p.exp * 1000 - Date.now()) / 86400000 : 0;
  ok(days > 29.9 && days <= 30, '有效期約 30 天（' + days.toFixed(2) + '）');
}

{
  const { CS, localStorage } = loadSync();
  localStorage.setItem('sync.sess', sessToken('kid@example.com', Date.now() - 1000));
  ok(CS.signedIn() === null, '過期的 sess token → 未登入');
}

{
  const { CS, localStorage } = loadSync();
  localStorage.setItem('sync.sess', 'sess.@@@not-base64@@@.zzz');
  ok(CS.signedIn() === null, '壞掉的 token → 未登入，且不丟例外');
}

{
  // 過渡期：舊版使用者手機裡還是 sessionStorage 的 Google ID token，不能把人鎖在門外
  const { CS, sessionStorage } = loadSync();
  sessionStorage.setItem('sync.token', jwtToken({ email: 'a@b.c', given_name: 'A', exp: Math.floor(Date.now() / 1000) + 3600 }));
  ok(!!CS.signedIn(), '舊的 Google ID token 仍相容');
  ok(CS.signedIn().email === 'a@b.c', '舊 token 的 email 也讀得到');
}

{
  // 最要緊的一條：token 存 localStorage 之後，不能被進度同步整包推上雲端、再同步到別台裝置。
  // gatherKeys() 收的是 PREFIX（chinese-review）開頭的 key，所以 token 一律不能用那個前綴命名。
  const src = fs.readFileSync(SYNC_JS, 'utf8');
  const keys = [];
  const re = /var (SESS_KEY|PROFILE_KEY) = "([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) keys.push(m[2]);
  ok(keys.length === 2, '找得到 SESS_KEY / PROFILE_KEY 兩個常數');
  ok(keys.every((k) => k.indexOf('chinese-review') !== 0),
    'token/profile 的 key 不是 chinese-review 開頭 → 不會被推上雲端外流到別台裝置');
}

{
  // 登入後要真的去換長效 token，否則一小時後又打回原形
  const src = fs.readFileSync(SYNC_JS, 'utf8');
  ok(/\/api\/session/.test(src), '有呼叫 POST /api/session 換長效 token');
  ok(/function refreshSession/.test(src) && /refreshSession\(\);/.test(src),
    '每次開頁會續期（滾動 30 天，常用的人等於不用再登入）');
}

console.log('\n同步不會把進度弄不見（2026-09-14 codex 體檢後補）');

{
  // pull 拿到較新的雲端資料時，不可以當場寫進 localStorage：
  // 寫了卻還沒重載的那段空窗，pagehide 的 save() 會把記憶體舊 state 存回去、整包蓋掉雲端進度
  const { CS, localStorage, reloads } = signedInEnv({
    route: () => ({ status: 200, body: { updatedAt: 2000, blob: CLOUD } }),
  });
  let applied = null;
  CS._test.pull((err, ap) => { applied = ap; });
  ok(applied === true, 'pull 看到較新的雲端版本 → 回報 applied');
  ok(localBlob(localStorage) === JSON.stringify({ score: 'local' }), '此時本機還是舊資料（還沒寫下去）');
  ok(CS._test.syncTs() === 1000, '同步時間戳也還沒前進');
  CS._test.safeReload();
  ok(localBlob(localStorage) === CLOUD['chinese-review-v1'], 'safeReload 才把雲端資料寫進本機');
  ok(CS._test.syncTs() === 2000, '寫入成功後時間戳才前進');
  ok(reloads.length === 1, '而且立刻重載，沒有空窗');
}

{
  // 寫不進去（隱私模式、容量滿）時，時間戳不可以前進，否則本機停在舊資料卻以為已經更新
  const { CS, localStorage, reloads } = signedInEnv({
    route: () => ({ status: 200, body: { updatedAt: 2000, blob: CLOUD } }),
  });
  CS._test.pull(() => {});
  localStorage.setItem = () => { throw new Error('QuotaExceeded'); };
  CS._test.safeReload();
  ok(CS._test.syncTs() === 1000, '本機寫入失敗 → 同步時間戳保持原樣（下次還會再拉一次）');
  ok(reloads.length === 0, '寫入失敗就不重載');
}

{
  // 409：後端說「雲端被別台寫過了」。舊版先寫進 localStorage 才比對，於是永遠相等 →
  // 不重載、畫面留著舊資料，下一輪 push 又把舊的推上去蓋掉別台的進度
  // GET 第一次回「和本機同版本」，PUT 回 409（別台剛寫過），
  // 之後的 GET 回別台寫進去的新版本——套用前會重抓，拿到的就是這一份
  let gets = 0;
  const { CS, localStorage, reloads } = signedInEnv({
    route: (m) => {
      if (m !== 'GET') return { status: 409, body: { updatedAt: 3000, blob: CLOUD } };
      gets++;
      return gets === 1
        ? { status: 200, body: { updatedAt: 1000, blob: { 'chinese-review-v1': JSON.stringify({ score: 'local' }) } } }
        : { status: 200, body: { updatedAt: 3000, blob: CLOUD } };
    },
  });
  CS._test.push(() => {});
  ok(localBlob(localStorage) === CLOUD['chinese-review-v1'], '409 後本機換成雲端版本');
  ok(CS._test.syncTs() === 3000, '同步時間戳跟著雲端版本');
  ok(reloads.length === 1, '而且有重載（舊版這裡不會重載，這條就是那個 bug 的守門）');
}

{
  // 正在做題時重載會被延後（2026-09-04 Tony 回報「做到一半會閃退」）。
  // 那段等待期間：本機不可以先被雲端資料蓋掉（做題中的進度還要存），
  // 也不可以把本機舊資料推上雲端（會蓋掉別台的新進度）。
  const seen = [];
  let busy = true;
  const { CS, localStorage, reloads, timers } = signedInEnv({
    busy: () => busy,
    route: (m) => {
      seen.push(m);
      return m === 'GET'
        ? { status: 200, body: { updatedAt: 2000, blob: CLOUD } }
        : { status: 200, body: { updatedAt: 4000 } };
    },
  });
  CS._test.pull((err, ap) => { if (ap) CS._test.safeReload(); });
  ok(!!CS._test.pending(), '做題中 → 雲端資料先收在記憶體裡，等離開這頁再套用');
  ok(localBlob(localStorage) === JSON.stringify({ score: 'local' }), '等待期間本機仍是自己的進度');
  ok(reloads.length === 0, '等待期間不重載（不會做到一半被踢回首頁）');
  seen.length = 0;
  CS._test.push(() => {});
  ok(seen.indexOf('PUT') < 0, '等待期間不推上雲端（不會蓋掉別台的新進度）');
  busy = false;
  timers.forEach((fn) => fn());
  ok(localBlob(localStorage) === CLOUD['chinese-review-v1'], '離開作答畫面後才套用雲端資料');
  ok(reloads.length === 1, '套用後才重載');
}

{
  // 別台按「清除」之後，這台套用雲端資料時要把「別台確實刪掉」的項目一併刪掉，
  // 否則下一次 push 會把殘留紀錄推回雲端，剛清掉的東西整個復活。
  // 判斷依據是「上次成功上傳時伺服器有這一項」——存在 sync.pushed.chinese。
  const { CS, localStorage, reloads } = signedInEnv({
    route: () => ({ status: 200, body: { updatedAt: 2000, blob: { 'chinese-review-v1': JSON.stringify({ score: 'cloud' }) } } }),
  });
  localStorage.setItem('chinese-review-daily', '{"2026-09-14":"做過"}');
  localStorage.setItem('sync.pushed.chinese', JSON.stringify(['chinese-review-v1', 'chinese-review-daily']));
  // 這兩項都是上次已經成功上傳的內容 → 本機沒有未上傳的新進度
  localStorage.setItem('sync.pushedhash.chinese', blobHashOf({
    'chinese-review-v1': JSON.stringify({ score: 'local' }),
    'chinese-review-daily': '{"2026-09-14":"做過"}',
  }));
  CS._test.pull(() => {});
  CS._test.safeReload();
  ok(localStorage.getItem('chinese-review-daily') === null, '別台刪掉的項目會被刪掉（不會變成幽靈資料）');
  ok(localStorage.getItem('chinese-review.sync_ts') === '2000', '同步時間戳不會被誤刪');
  ok(reloads.length === 1, '刪完照樣重載');
}

{
  // 2026-09-14 Tony 回報（LanExamMock，同一份程式邏輯）：孩子做完今天的每日任務，
  // 套用一份比較舊的雲端資料之後，今天的紀錄不見了。原因是當時「本機有、雲端沒有」就刪，
  // 而剛做完還沒上傳的紀錄正好符合。現在只刪「上次上傳時伺服器確實有」的項目。
  const { CS, localStorage, reloads } = signedInEnv({
    unpushed: true,
    route: () => ({ status: 200, body: { updatedAt: 2000, blob: { 'chinese-review-v1': JSON.stringify({ score: 'cloud' }) } } }),
  });
  localStorage.setItem('chinese-review-daily', '{"2026-09-14":"剛做完還沒上傳"}');
  CS._test.pull(() => {});
  CS._test.safeReload();
  ok(localStorage.getItem('chinese-review-daily') !== null,
    '剛做完、還沒上傳的紀錄不會被較舊的雲端資料刪掉');
  ok(localStorage.getItem('chinese-review-v1') === JSON.stringify({ score: 'local' }),
    '本機有未上傳的進度時，以本機為準（不被雲端覆蓋）');
  ok(localStorage.getItem('chinese-review.sync_ts') === '2000',
    '但版本會對齊，下一輪把本機進度推上去');
  ok(reloads.length === 0, '這種情形不重載，不會打斷使用者');
}

{
  // 從來沒有成功上傳過（沒有 sync.pushed 紀錄）時，一律不刪，寧可留著也不要弄丟
  const { CS, localStorage } = signedInEnv({
    route: () => ({ status: 200, body: { updatedAt: 2000, blob: { 'chinese-review-v1': JSON.stringify({ score: 'cloud' }) } } }),
  });
  localStorage.setItem('chinese-review-daily', '{"2026-09-14":"沒有上傳紀錄"}');
  CS._test.pull(() => {});
  CS._test.safeReload();
  ok(localStorage.getItem('chinese-review-daily') !== null, '沒有上傳紀錄時不刪任何東西');
}

{
  // 雲端版本較新、但內容跟本機一樣（多半是上一次 PUT 的回應沒收到）：對齊版本就好，不要再 PUT 一次
  const seen = [];
  const { CS } = signedInEnv({
    route: (m) => {
      seen.push(m);
      return m === 'GET'
        ? { status: 200, body: { updatedAt: 5000, blob: { 'chinese-review-v1': JSON.stringify({ score: 'local' }) } } }
        : { status: 200, body: { updatedAt: 6000 } };
    },
  });
  CS._test.push(() => {});
  ok(seen.filter((m) => m === 'PUT').length === 0, '內容一樣就不重複 PUT');
  ok(CS._test.syncTs() === 5000, '但版本有對齊，下一輪不會又被判成落後');
}

{
  // save() 的煞車：套用雲端資料前會把 window.SYNC_FROZEN 打開，app.js 看到就不回寫
  const src = fs.readFileSync(SYNC_JS, 'utf8');
  ok(/SYNC_FROZEN\s*=\s*true/.test(src), 'sync.js 會在套用雲端資料前凍結本機回寫');
  const appSrc = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  ok(/function save\(\)[\s\S]{0,400}SYNC_FROZEN/.test(appSrc), 'app.js 的 save() 有認這個旗標');
  ok(/wipeLocalProgress\(\);[\s\S]{0,300}freezeLocalWrites\(\)/.test(src),
    '換帳號清掉本機進度後也會凍結（記憶體裡還是前一個人的 state）');
  ok(/finishSignIn\(resp\.credential, p, true\)/.test(src), '換帳號一定重載，不讓舊 state 留在記憶體');
}

console.log(fail ? `\n✗ ${fail} 項失敗` : '\n全部通過');
process.exit(fail ? 1 : 0);
