/* 互動教學元件庫（單元學習「概念卡」用）
   - 純 SVG + 原生事件，無框架、無 build；顏色一律走 CSS 變數，四種主題都對
   - 設計原則：一個元件服務多個單元 —— fracbar 從小三「分數的初步認識」一路用到
     小四同分母加減、小五通分、小六比例，不必一單元做一個動畫
   - 用法：Widgets.render(hostEl, spec)      spec.type 決定畫什麼
   - 新增元件：Widgets.register('型別', function (host, spec) {...}) 即可           */
(function () {
  if (typeof document === 'undefined') return;   // node 測試環境不執行

  var REG = {};
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, style) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    if (style) n.setAttribute('style', style);
    return n;
  }
  function div(cls, text) {
    var d = document.createElement('div');
    if (cls) d.className = cls;
    if (text != null) d.textContent = text;
    return d;
  }
  function btn(label, onClick, cls) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = cls || 'wg-btn';
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // 分數符號（分子在上、分母在下，中間一條線）—— 用 HTML 排版比 SVG 好對齊
  function fracLabel() {
    var wrap = div('wg-frac');
    var num = div('wg-frac-n'), den = div('wg-frac-d');
    wrap.appendChild(num); wrap.appendChild(den);
    return { el: wrap, set: function (a, b) { num.textContent = a; den.textContent = b; } };
  }

  // 沒平分時的切法：固定比例（不用亂數，每次畫出來一樣，學生比較得起來）
  var UNEVEN = {
    2: [0.62, 0.38], 3: [0.5, 0.28, 0.22], 4: [0.4, 0.25, 0.2, 0.15],
    5: [0.34, 0.22, 0.18, 0.14, 0.12], 6: [0.3, 0.2, 0.16, 0.14, 0.11, 0.09]
  };
  function widths(n, equal) {
    var a = [], i;
    if (equal) { for (i = 0; i < n; i++) a.push(1 / n); return a; }
    if (UNEVEN[n]) return UNEVEN[n];
    // 沒預先列的份數：用固定遞減比例生一組（不用亂數，每次畫出來一樣）
    var w = [], sum = 0;
    for (i = 0; i < n; i++) { w.push(n + 2 - i); sum += w[i]; }
    return w.map(function (v) { return v / sum; });
  }

  /* ── 長條分數（fracbar）────────────────────────────────────────────────
     spec: { parts, shade, editParts:[min,max], editShade:bool, equal:bool,
             toggleEqual:bool, label:bool, caption:string }                  */
  var clipSeq = 0;
  function drawBar(svg, parts, shade, equal, onPick) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var X = 10, Y = 12, W = 300, H = 56;
    var ws = widths(parts, equal), x = X;
    // 色塊是方角、底是圓角，不裁切的話頭尾會凸出圓角外
    var cid = 'wgclip' + (++clipSeq);
    var defs = el('defs'), cp = el('clipPath', { id: cid });
    cp.appendChild(el('rect', { x: X, y: Y, width: W, height: H, rx: 8 }));
    defs.appendChild(cp);
    svg.appendChild(defs);
    var g = el('g', { 'clip-path': 'url(#' + cid + ')' });
    svg.appendChild(g);
    var host = svg; svg = g;                       // 以下色塊都畫進被裁切的群組
    svg.appendChild(el('rect', { x: X, y: Y, width: W, height: H, rx: 8 },
      'fill:var(--panel2);stroke:var(--border);stroke-width:2'));
    for (var i = 0; i < parts; i++) {
      var w = ws[i] * W;
      var on = i < shade;
      var r = el('rect', { x: x, y: Y, width: w, height: H },
        'fill:' + (on ? 'var(--accent)' : 'transparent') + ';cursor:' + (onPick ? 'pointer' : 'default'));
      if (onPick) (function (idx) {
        r.addEventListener('click', function () { onPick(idx); });
      })(i);
      svg.appendChild(r);
      if (i > 0) svg.appendChild(el('line', { x1: x, y1: Y, x2: x, y2: Y + H },
        'stroke:var(--border);stroke-width:2'));
      x += w;
    }
    // 外框畫在裁切群組外面，線條才不會被切掉一半
    host.appendChild(el('rect', { x: X, y: Y, width: W, height: H, rx: 8 },
      'fill:none;stroke:var(--border);stroke-width:2;pointer-events:none'));
  }

  function pieSlice(cx, cy, r, a0, a1) {
    var p0x = cx + r * Math.cos(a0), p0y = cy + r * Math.sin(a0);
    var p1x = cx + r * Math.cos(a1), p1y = cy + r * Math.sin(a1);
    var big = (a1 - a0) > Math.PI ? 1 : 0;
    return 'M' + cx + ',' + cy + ' L' + p0x + ',' + p0y +
           ' A' + r + ',' + r + ' 0 ' + big + ',1 ' + p1x + ',' + p1y + ' Z';
  }
  function drawPie(svg, parts, shade, equal, onPick) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var cx = 80, cy = 80, r = 66;
    var ws = widths(parts, equal), a = -Math.PI / 2;
    for (var i = 0; i < parts; i++) {
      var a2 = a + ws[i] * Math.PI * 2;
      var on = i < shade;
      var p = el('path', { d: pieSlice(cx, cy, r, a, a2) },
        'fill:' + (on ? 'var(--accent)' : 'var(--panel2)') +
        ';stroke:var(--border);stroke-width:2;cursor:' + (onPick ? 'pointer' : 'default'));
      if (onPick) (function (idx) {
        p.addEventListener('click', function () { onPick(idx); });
      })(i);
      svg.appendChild(p);
      a = a2;
    }
  }

  function shapeWidget(shape) {
    return function (host, spec) {
      var parts = spec.parts || 4;
      var shade = spec.shade == null ? 1 : spec.shade;
      var equal = spec.equal !== false;
      var editParts = spec.editParts || null;          // [min, max]
      var box = div('wg');
      var svg = el('svg', shape === 'pie'
        ? { viewBox: '0 0 160 160', class: 'wg-svg wg-svg-pie' }
        : { viewBox: '0 0 320 80', class: 'wg-svg' });
      box.appendChild(svg);

      var lab = spec.label === false ? null : fracLabel();
      var note = div('wg-note');
      if (lab) {
        var labRow = div('wg-labrow');
        labRow.appendChild(div('wg-labtext', '塗色的部分是'));
        labRow.appendChild(lab.el);
        box.appendChild(labRow);
      }

      function pick(i) {
        shade = (shade === i + 1) ? i : i + 1;         // 再點一次可以取消
        paint();
      }
      function paint() {
        shade = clamp(shade, 0, parts);
        var onPick = spec.editShade ? pick : null;
        if (shape === 'pie') drawPie(svg, parts, shade, equal, onPick);
        else drawBar(svg, parts, shade, equal, onPick);
        if (lab) lab.set(shade, parts);
        if (spec.toggleEqual) {
          note.textContent = equal ? '✅ 每一份都一樣大 —— 這才叫平分，可以用分數表示'
                                   : '❌ 每一份不一樣大 —— 沒有平分，不能說是 ' + (shade || 1) + '/' + parts;
          note.className = 'wg-note ' + (equal ? 'ok' : 'ng');
        }
      }

      var ctrl = div('wg-ctrl');
      if (editParts) {
        ctrl.appendChild(div('wg-ctrl-label', '平分成幾份'));
        ctrl.appendChild(btn('−', function () {
          parts = clamp(parts - 1, editParts[0], editParts[1]);
          if (shade > parts) shade = parts;
          paint();
        }));
        var pv = div('wg-val', String(parts));
        ctrl.appendChild(pv);
        ctrl.appendChild(btn('＋', function () {
          parts = clamp(parts + 1, editParts[0], editParts[1]);
          paint();
        }));
        var origPaint = paint;
        paint = function () { origPaint(); pv.textContent = String(parts); };
      }
      if (spec.toggleEqual) {
        ctrl.appendChild(btn('切切看：平分／隨便切', function () { equal = !equal; paint(); }));
      }
      if (ctrl.childNodes.length) box.appendChild(ctrl);
      if (spec.toggleEqual) box.appendChild(note);
      if (spec.editShade) box.appendChild(div('wg-hint', '👆 點格子塗色，看看分子怎麼變'));
      if (spec.caption) box.appendChild(div('wg-hint', spec.caption));

      host.appendChild(box);
      paint();
    };
  }
  REG.fracbar = shapeWidget('bar');
  REG.fraccircle = shapeWidget('pie');

  /* ── 兩個分數比大小（fraccompare）──────────────────────────────────────
     spec: { a:{parts,shade}, b:{parts,shade}, edit:bool, shape:'bar'|'pie' }
     單位分數比大小（1/4 vs 1/8）是小三最大的迷思，畫出來一秒解決              */
  REG.fraccompare = function (host, spec) {
    var A = { parts: (spec.a && spec.a.parts) || 4, shade: (spec.a && spec.a.shade) || 1 };
    var B = { parts: (spec.b && spec.b.parts) || 8, shade: (spec.b && spec.b.shade) || 1 };
    var box = div('wg');

    function row(S) {
      var r = div('wg-row');
      var tag = fracLabel();
      var svg = el('svg', { viewBox: '0 0 320 80', class: 'wg-svg wg-svg-sm' });
      r.appendChild(tag.el);
      r.appendChild(svg);
      var ctrl = null;
      if (spec.edit) {
        ctrl = div('wg-ctrl wg-ctrl-sm');
        ctrl.appendChild(btn('−', function () {
          S.parts = clamp(S.parts - 1, 1, 12); if (S.shade > S.parts) S.shade = S.parts; paint();
        }));
        ctrl.appendChild(btn('＋', function () { S.parts = clamp(S.parts + 1, 1, 12); paint(); }));
        r.appendChild(ctrl);
      }
      box.appendChild(r);
      return { svg: svg, tag: tag };
    }
    var ra = row(A), rb = row(B);
    var verdict = div('wg-verdict');
    box.appendChild(verdict);

    function paint() {
      drawBar(ra.svg, A.parts, A.shade, true, null);
      drawBar(rb.svg, B.parts, B.shade, true, null);
      ra.tag.set(A.shade, A.parts);
      rb.tag.set(B.shade, B.parts);
      var va = A.shade / A.parts, vb = B.shade / B.parts;
      var sym = Math.abs(va - vb) < 1e-9 ? '＝' : (va > vb ? '＞' : '＜');
      verdict.textContent = A.shade + '/' + A.parts + ' ' + sym + ' ' + B.shade + '/' + B.parts +
        (sym === '＝' ? '（一樣多）' : '（塗色比較長的那個大）');
    }
    host.appendChild(box);
    paint();
  };

  window.Widgets = {
    register: function (type, fn) { REG[type] = fn; },
    has: function (type) { return !!REG[type]; },
    render: function (host, spec) {
      if (!host) return false;
      host.innerHTML = '';
      if (!spec || !REG[spec.type]) return false;
      try { REG[spec.type](host, spec); return true; }
      catch (e) { host.textContent = ''; return false; }   // 元件壞掉不能拖垮整張卡
    }
  };
})();
