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
function loadSync() {
  const localStorage = store(), sessionStorage = store();
  const el = () => ({
    style: {}, classList: { add() {}, remove() {} }, appendChild() {}, addEventListener() {},
    innerHTML: '', textContent: '',
  });
  const ctx = {
    document: {
      readyState: 'complete', querySelector: () => null, createElement: el,
      addEventListener: () => {}, head: { appendChild: () => {} },
    },
    navigator: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/605.1.15' },
    localStorage, sessionStorage,
    XMLHttpRequest: class { open() {} setRequestHeader() {} send() {} },
    setInterval: () => {}, setTimeout: () => {}, clearTimeout: () => {},
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    location: { reload: () => {} },
  };
  ctx.window = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(SYNC_JS, 'utf8'), ctx);
  return { CS: ctx.window.CloudSync, localStorage, sessionStorage };
}

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

console.log(fail ? `\n✗ ${fail} 項失敗` : '\n全部通過');
process.exit(fail ? 1 : 0);
