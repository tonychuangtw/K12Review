#!/usr/bin/env node
/* 成語配圖批次生成 —— 走共用生圖工具 claude-shared/tools/gen-image.sh（$0）
 *
 * 用法：node tools/gen-idiom-images.js [--grades 1-6] [--limit 50] [--yes] [--gpt]
 *   不加 --yes 只列出缺哪幾張（dry-run，不會產圖）；
 *   已存在的 img/idioms/<id>.webp 一律跳過；
 *   --gpt 走 ChatGPT（構圖要求精準時用，較慢），預設走 Gemini。
 *   每張由 gen-image.sh 產出 PNG，再用 cwebp 壓成 512px webp，進度寫 tools/gen-images.log。
 *
 * ⚠️ 2026-08-27 改寫（Tony 指正）：這支原本直接打 Gemini 的 generateContent API、
 *    金鑰讀 ~/.gemini/.env。那違反 shared.md §13 ——「AI 生成圖片一律用
 *    claude-shared/tools/gen-image.sh，⛔ 不要自己打圖像 API」。直接打 API 吃的是
 *    預付額度，2026-08-02 的 880 張成語圖就是這樣把額度燒完的；gen-image.sh 走的是
 *    Tony 的 Gemini AI Pro／ChatGPT Plus 訂閱網頁介面（實際跑在 scout），$0。
 *    目前 1200 條成語都已經有圖，這支只在之後補新成語時才會用到。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'img', 'idioms');
const LOG = path.join(__dirname, 'gen-images.log');
const GEN_IMAGE = path.join(os.homedir(), 'TelegramClaude', 'claude-shared', 'tools', 'gen-image.sh');

function log(msg) {
  const line = new Date().toISOString() + ' ' + msg;
  console.log(line);
  fs.appendFileSync(LOG, line + '\n');
}

global.window = {};
eval(fs.readFileSync(path.join(ROOT, 'js/data/idioms.js'), 'utf8'));
let idioms = window.APP_DATA.idioms;

const args = process.argv.slice(2);
const gi = args.indexOf('--grades');
if (gi >= 0) {
  const [lo, hi] = args[gi + 1].split('-').map(Number);
  idioms = idioms.filter(i => i.grade >= lo && i.grade <= (hi || lo));
}
const li = args.indexOf('--limit');
const limit = li >= 0 ? Number(args[li + 1]) : Infinity;
const engine = args.includes('--gpt') ? 'gpt' : 'gemini';

// 共用工具成功時最後一行印出 IMAGE=<本機絕對路徑>，接手拿那個檔去壓 webp。
// 一張圖 Gemini 約 25-40 秒、ChatGPT 約 100 秒，中間 scout 要開實體瀏覽器，所以不併發。
function genOne(it) {
  const prompt =
    `A warm, friendly cartoon illustration for the Chinese idiom "${it.term}" ` +
    `(meaning: ${it.meaning}). Depict the idiom's imagery or story as a memorable scene. ` +
    `Children's textbook style, soft flat colors, simple shapes, single scene, ` +
    `absolutely no text, letters or Chinese characters anywhere in the image.`;
  const argv = [GEN_IMAGE, prompt, '--out', 'idiom-' + it.id, '--to', os.tmpdir()];
  if (engine === 'gpt') argv.push('--gpt');
  const out = execFileSync('bash', argv, { encoding: 'utf8', maxBuffer: 1 << 24 });
  const m = out.match(/^IMAGE=(.+)$/m);
  if (!m) throw new Error('gen-image.sh 沒回傳圖檔路徑：' + out.trim().split('\n').slice(-2).join(' | '));
  return m[1].trim();
}

(function main() {
  if (!fs.existsSync(GEN_IMAGE)) {
    console.error('找不到共用生圖工具：' + GEN_IMAGE);
    console.error('shared.md §13：AI 生成圖片一律走這支，不要自己打圖像 API。');
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const todo = idioms.filter(it => !fs.existsSync(path.join(OUT_DIR, it.id + '.webp'))).slice(0, limit);

  if (!todo.length) { log('沒有缺圖，什麼都不用做'); return; }
  // 不是錢的問題（走訂閱是 $0），是時間與 scout 佔用：一張要 25-100 秒，
  // 而且期間 scout 的實體桌面被 camofox 佔著。所以預設 dry-run，要跑得自己說。
  if (!args.includes('--yes')) {
    log(`dry-run：缺 ${todo.length} 張（前 5 筆：${todo.slice(0, 5).map(i => i.id + ' ' + i.term).join('、')}）`);
    log(`要真的產圖請加 --yes；引擎 ${engine}，估計約 ${Math.round(todo.length * (engine === 'gpt' ? 100 : 35) / 60)} 分鐘，期間 scout 會被佔用`);
    return;
  }

  log(`start: ${todo.length} images（engine=${engine}, via gen-image.sh）`);
  let okN = 0, failN = 0;
  for (const it of todo) {
    const out = path.join(OUT_DIR, it.id + '.webp');
    let png = null;
    try {
      png = genOne(it);
      execFileSync('cwebp', ['-q', '75', '-resize', '512', '0', png, '-o', out], { stdio: 'ignore' });
      okN++;
      log(`ok ${it.id} ${it.term} (${Math.round(fs.statSync(out).size / 1024)}KB) [${okN}/${todo.length}]`);
    } catch (e) {
      failN++;
      log(`FAIL ${it.id} ${it.term}: ${String(e.message).slice(0, 200)}`);
    } finally {
      if (png) { try { fs.unlinkSync(png); } catch (e) { /* 暫存檔清不掉不影響 */ } }
    }
  }
  log(`done: ${okN} ok, ${failN} failed`);
})();
