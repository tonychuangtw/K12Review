/* 解析確認題：解析文字的形狀判斷與自動出題（app.js 與 tools/ 的 node 腳本共用一份）
 *
 * 為什麼獨立成一支：批次出題的待辦清單（tools/chk-todo.js）必須跟前端用同一套判斷，
 * 否則「前端說這題有確認題、清單說沒有」兩邊會走鐘。
 *
 * 三種型態（Tony 2026-08-27 定案）：
 *   Ａ 字義列舉（捲＝把東西彎轉裹起；摸＝用手輕觸…）→ 問某個字解析說是什麼意思
 *   Ｂ 逐選項標註（(Ａ)片→遍 (Ｃ)慌→荒）→ 問某個選項解析說了什麼
 *   Ｃ 其餘 → 目前是句子辨識，但 Tony 已否決（「只確認有沒有看，不確認有沒有懂」），
 *      要逐題改成人工撰寫的 CHECKS。Ｃ 型在被換掉之前先留著當閘門。
 * 解析太短（<12 字）或只寫「見各選項說明」＝沒有東西可以確認，回 null 退回解析鎖倒數。
 */
(function (root) {
  var MIN_LEN = 12;

  /* 各科自編原創題的解析是「✅ 正解：… ❌ 其他選項：… 📚 課綱重點：…」三段式。
     這些記號是排版用的，不該被當成句子的一部分丟進選項裡
     （2026-08-29 Tony 回報：自然科的確認題選項最前面出現 ✅❌📚，而且「✅ 正解：」等於直接標出答案）。 */
  function body(exp) {
    return String(exp || '')
      .replace(/[✅❌📚]\s*/g, ' ')
      .replace(/(正解|其他選項|課綱重點)[：:]\s*/g, '')
      .replace(/\s+/g, ' ').trim().replace(/^解析[：:]\s*/, '');
  }
  function usable(exp) {
    var t = body(exp);
    return t.length >= MIN_LEN && !/^見各選項說明[。.]?$/.test(t);
  }
  function pairs(t) {                 // 「字＝定義」對
    var out = [], re = /([一-鿿])[ㄅ-ㄩˇˊˋ˙\s]*＝([^；;。\n]{2,40})/g, m;
    while ((m = re.exec(t))) out.push({ k: m[1], v: m[2].trim().replace(/，最符合文意$/, '') });
    return out;
  }
  function labels(t) {                // 「(Ａ)說明」逐選項標註
    var out = [], re = /[（(]([Ａ-ＪA-J])[）)]\s*([^（()）。；;\n]{2,30})/g, m;
    while ((m = re.exec(t))) {
      var v = m[2].trim();
      if (v && !/^見/.test(v)) out.push({ k: m[1], v: v });
    }
    return out;
  }
  function sents(t) {                 // 可以當選項的句子
    return t.split(/[。；;\n]+/).map(function (x) { return x.trim(); })
      .filter(function (x) { return x.length >= 12 && x.length <= 60 && !/^見各選項/.test(x); });
  }
  function uniqBy(arr, keyOf) {
    var seen = {}, out = [];
    arr.forEach(function (x) {
      var k = keyOf(x);
      if (k && !seen[k]) { seen[k] = 1; out.push(x); }
    });
    return out;
  }
  /* 這一題目前能走哪一種：'A' / 'B' / 'C' / 'none'
     —— 待辦清單用它挑出「要人工重寫」的題（Ｃ 與 none），前端用它決定怎麼出題。 */
  function shapeOf(exp) {
    if (!usable(exp)) return 'none';
    var t = body(exp);
    if (uniqBy(pairs(t), function (x) { return x.k; }).length >= 4) return 'A';
    if (uniqBy(labels(t), function (x) { return x.k; }).length >= 3) return 'B';
    return sents(t).length ? 'C' : 'none';
  }

  root.ChkGen = {
    MIN_LEN: MIN_LEN,
    body: body, usable: usable, pairs: pairs, labels: labels, sents: sents,
    uniqBy: uniqBy, shapeOf: shapeOf
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

if (typeof module !== 'undefined' && module.exports) {
  module.exports = (typeof window !== 'undefined' ? window : globalThis).ChkGen;
}
