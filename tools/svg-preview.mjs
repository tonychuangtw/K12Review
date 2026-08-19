/* 把 SVG（或任何本機頁面）用 chrome-headless-shell 截圖成 PNG，方便自己檢查畫出來對不對。
 * 用法：node tools/svg-preview.mjs img/sci/sun-seasons.svg /tmp/out.png [寬 高]
 * 需要和 test/browser-smoke.mjs 同一支 chrome-headless-shell（找不到就直接結束）。
 */
import { spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SHELL = process.env.CHROME_SHELL ||
  process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell';
if (!existsSync(SHELL)) { console.log('找不到 chrome-headless-shell，跳過'); process.exit(0); }

const [, , src, out = '/tmp/svg-preview.png', W = '800', H = '470'] = process.argv;
if (!src) { console.error('用法: node tools/svg-preview.mjs <檔案或路徑> <輸出.png> [寬 高]'); process.exit(2); }

const PORT = 8791, CDP = 9391;
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
const chrome = spawn(SHELL, [`--remote-debugging-port=${CDP}`, '--no-sandbox', '--disable-gpu',
  `--window-size=${W},${H}`, 'about:blank'], { stdio: 'ignore' });
try {
  await sleep(1500);
  const list = await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json();
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
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride',
    { width: +W, height: +H, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/${src.replace(/^\.?\//, '')}` });
  await sleep(1200);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
  console.log('已寫出', out);
  ws.close();
} finally {
  chrome.kill();
  server.kill();
}
