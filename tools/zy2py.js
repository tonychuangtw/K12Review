/* 注音 → 漢語拼音（帶聲調符號）。
   康軒版單元式練習的手寫題要同時給注音與拼音（全站兩種標音可切換），
   但教育部的開放資料只有注音，所以在這裡做確定性的轉換。
   ⚠️ 正確性由 tools/zy2py-check.js 驗證：拿 js/data/chars.js 裡
      660 筆「人工寫好的注音＋拼音」逐筆比對，全中才算過。 */
'use strict';

// 聲母
const INITIAL = {
  'ㄅ': 'b', 'ㄆ': 'p', 'ㄇ': 'm', 'ㄈ': 'f',
  'ㄉ': 'd', 'ㄊ': 't', 'ㄋ': 'n', 'ㄌ': 'l',
  'ㄍ': 'g', 'ㄎ': 'k', 'ㄏ': 'h',
  'ㄐ': 'j', 'ㄑ': 'q', 'ㄒ': 'x',
  'ㄓ': 'zh', 'ㄔ': 'ch', 'ㄕ': 'sh', 'ㄖ': 'r',
  'ㄗ': 'z', 'ㄘ': 'c', 'ㄙ': 's'
};
// 介音
const MEDIAL = { 'ㄧ': 'i', 'ㄨ': 'u', 'ㄩ': 'v' };     // v 代表 ü，最後再處理
// 韻母
const FINAL = {
  'ㄚ': 'a', 'ㄛ': 'o', 'ㄜ': 'e', 'ㄝ': 'ê',
  'ㄞ': 'ai', 'ㄟ': 'ei', 'ㄠ': 'ao', 'ㄡ': 'ou',
  'ㄢ': 'an', 'ㄣ': 'en', 'ㄤ': 'ang', 'ㄥ': 'eng',
  'ㄦ': 'er'
};
// 空韻：ㄓㄔㄕㄖㄗㄘㄙ 單獨出現時拼 -i
const EMPTY_RHYME = ['ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ'];
// 聲調符號
const TONE = { 1: '', 2: 'ˊ', 3: 'ˇ', 4: 'ˋ', 5: '˙' };
const MARKS = {
  a: ['ā', 'á', 'ǎ', 'à', 'a'], o: ['ō', 'ó', 'ǒ', 'ò', 'o'],
  e: ['ē', 'é', 'ě', 'è', 'e'], i: ['ī', 'í', 'ǐ', 'ì', 'i'],
  u: ['ū', 'ú', 'ǔ', 'ù', 'u'], 'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
  'ê': ['ê̄', 'ế', 'ê̌', 'ề', 'ê']
};

function syllable(zy) {
  let tone = 1;
  let s = zy;
  if (s.indexOf('˙') === 0) { tone = 5; s = s.slice(1); }      // 輕聲標在前
  const last = s.slice(-1);
  if (last === 'ˊ') { tone = 2; s = s.slice(0, -1); }
  else if (last === 'ˇ') { tone = 3; s = s.slice(0, -1); }
  else if (last === 'ˋ') { tone = 4; s = s.slice(0, -1); }
  else if (last === '˙') { tone = 5; s = s.slice(0, -1); }

  const chars = Array.from(s);
  let ini = '', med = '', fin = '';
  let i = 0;
  if (INITIAL[chars[i]] !== undefined) { ini = chars[i]; i++; }
  if (MEDIAL[chars[i]] !== undefined) { med = chars[i]; i++; }
  if (FINAL[chars[i]] !== undefined) { fin = chars[i]; i++; }
  if (i !== chars.length) return null;                          // 有沒認得的符號

  let py;
  if (!med && !fin) {                                           // 空韻：ㄓ→zhi、ㄗ→zi
    if (!ini || EMPTY_RHYME.indexOf(ini) < 0) return null;
    py = INITIAL[ini] + 'i';
    return mark(py, tone);
  }
  const I = ini ? INITIAL[ini] : '';
  const M = med ? MEDIAL[med] : '';
  const F = fin ? FINAL[fin] : '';
  let rime = M + F;

  // 韻母縮寫規則
  if (M === 'i') {
    if (F === 'ou') rime = 'iu';                                // ㄧㄡ → iu
    else if (F === 'en') rime = 'in';                           // ㄧㄣ → in
    else if (F === 'eng') rime = 'ing';                         // ㄧㄥ → ing
    else if (F === 'ê') rime = 'ie';                            // ㄧㄝ → ie
  } else if (M === 'u') {
    if (F === 'ei') rime = 'ui';                                // ㄨㄟ → ui
    else if (F === 'en') rime = 'un';                           // ㄨㄣ → un
    else if (F === 'eng') rime = 'ong';                         // ㄨㄥ → ong（有聲母時）
  } else if (M === 'v') {
    if (F === 'ê') rime = 've';                                 // ㄩㄝ → üe
    else if (F === 'en') rime = 'vn';                           // ㄩㄣ → ün
    else if (F === 'eng') rime = 'iong';                        // ㄩㄥ → iong
  }

  if (!I) {                                                     // 零聲母的寫法
    if (M === 'i') {
      if (!F) py = 'yi';
      else if (rime === 'in' || rime === 'ing') py = 'y' + rime;
      else py = 'y' + rime.slice(1);                            // ia→ya、iu→you…
      if (rime === 'iu') py = 'you';
    } else if (M === 'u') {
      if (!F) py = 'wu';
      else if (rime === 'ui') py = 'wei';
      else if (rime === 'un') py = 'wen';
      else if (rime === 'ong') py = 'weng';
      else py = 'w' + rime.slice(1);                            // ua→wa、uo→wo…
    } else if (M === 'v') {
      py = 'yu' + (rime === 'v' ? '' : rime.slice(1));          // ü→yu、üe→yue、ün→yun
      if (rime === 'iong') py = 'yong';
    } else {
      py = F;                                                   // ㄚ→a、ㄦ→er…
    }
  } else {
    if (M === 'v' && 'jqx'.indexOf(I) >= 0) rime = rime.replace('v', 'u');  // ju/qu/xu
    if (rime === 'ong' && !M) rime = 'ong';
    py = I + rime;
  }
  py = py.replace(/v/g, 'ü');
  return mark(py, tone);
}

// 聲調符號標在哪個母音：a > o > e > 最後一個母音（iu/ui 標在後面那個）
// 本站的拼音一聲要標長音符號（ā），輕聲才不標 —— 跟 chars.js 既有的 660 筆一致
function mark(py, tone) {
  if (tone === 5) return py;
  const idx = pickVowel(py);
  if (idx < 0) return py;
  const v = py[idx];
  const table = MARKS[v];
  if (!table) return py;
  return py.slice(0, idx) + table[tone - 1] + py.slice(idx + 1);
}
function pickVowel(py) {
  for (const v of ['a', 'o', 'e', 'ê']) { const i = py.indexOf(v); if (i >= 0) return i; }
  const m = /[iuü](?![iuü])/g;                      // 最後一個 i/u/ü
  let last = -1, r;
  while ((r = m.exec(py))) last = r.index;
  return last;
}

/* 一整串注音（詞）→ 拼音，音節之間用空白分隔 */
function zy2py(zy) {
  const parts = String(zy || '').trim().split(/\s+/).filter(Boolean);
  const out = [];
  for (const p of parts) {
    const s = syllable(p);
    if (s === null) return null;
    out.push(s);
  }
  return out.join(' ');
}

module.exports = { zy2py, syllable };
