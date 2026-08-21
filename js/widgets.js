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

  /* ══════════════════════════════════════════════════════════════════════
     以下是數與計算類元件（2026-08-21 加）。共用原則同上：
     一個元件服務多個單元、只用 SVG 與原生事件、顏色走 CSS 變數。
     ══════════════════════════════════════════════════════════════════════ */

  function txt(x, y, s, style) {
    var t = el('text', { x: x, y: y, 'text-anchor': 'middle', 'dominant-baseline': 'middle' },
      'font-size:14px;fill:var(--text);' + (style || ''));
    t.textContent = s;
    return t;
  }
  // 連續調整用滑桿（比 +/− 適合角度、數線這種要「滑過去看變化」的量）
  function slider(min, max, val, step, onInput) {
    var r = document.createElement('input');
    r.type = 'range'; r.min = min; r.max = max; r.value = val; r.step = step || 1;
    r.className = 'wg-range';
    r.addEventListener('input', function () { onInput(Number(r.value)); });
    return r;
  }
  function stepper(label, get, set, lo, hi, onChange) {
    var wrap = div('wg-ctrl');
    if (label) wrap.appendChild(div('wg-ctrl-label', label));
    wrap.appendChild(btn('−', function () { set(clamp(get() - 1, lo, hi)); onChange(); }));
    var v = div('wg-val', String(get()));
    wrap.appendChild(v);
    wrap.appendChild(btn('＋', function () { set(clamp(get() + 1, lo, hi)); onChange(); }));
    return { el: wrap, sync: function () { v.textContent = String(get()); } };
  }

  /* ── 位值積木（placevalue）─────────────────────────────────────────────
     一萬以內的數 / 大數 / 進位借位都靠這個「看得見的位值」。
     spec: { value, max, edit }                                            */
  REG.placevalue = function (host, spec) {
    var max = spec.max || 9999;
    var digits = String(max).length;                  // 3 位或 4 位
    var val = clamp(spec.value == null ? 0 : spec.value, 0, max);
    var NAMES = ['個', '十', '百', '千', '萬'];
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);

    function digitsOf(v) {
      var a = [];
      for (var i = 0; i < digits; i++) { a.push(Math.floor(v / Math.pow(10, i)) % 10); }
      return a;                                        // a[0]=個位
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var ds = digitsOf(val);
      var colW = 300 / digits;
      for (var i = 0; i < digits; i++) {
        var idx = digits - 1 - i;                      // 由左到右：高位在左
        var d = ds[idx];
        var cx = 10 + colW * i + colW / 2;
        svg.appendChild(el('rect', { x: 10 + colW * i + 4, y: 10, width: colW - 8, height: 100, rx: 6 },
          'fill:var(--panel2);stroke:var(--border);stroke-width:1'));
        // 積木由下往上疊，一個代表 1 個該位單位
        for (var k = 0; k < d; k++) {
          var bw = colW - 22, bh = 8;
          svg.appendChild(el('rect',
            { x: 10 + colW * i + 11, y: 104 - (k + 1) * (bh + 2), width: bw, height: bh, rx: 2 },
            'fill:var(--accent)'));
        }
        svg.appendChild(txt(cx, 122, NAMES[idx], 'fill:var(--dim);font-size:13px'));
        svg.appendChild(txt(cx, 140, String(d), 'font-weight:700;font-size:18px'));
      }
      read.textContent = val.toLocaleString('en-US') + '　讀作：' + zhNum(val);
    }
    // 中文讀法（三上只到一萬，夠用；含「零」的唸法是這個單元的考點）
    function zhNum(v) {
      if (v === 0) return '零';
      var C = '零一二三四五六七八九'.split('');
      var U = ['', '十', '百', '千', '萬'];
      var s2 = String(v), n = s2.length, out = '', zero = false;
      for (var i = 0; i < n; i++) {
        var d = +s2[i], u = n - 1 - i;
        if (d === 0) { zero = true; continue; }
        if (zero && out) out += '零';
        zero = false;
        out += (d === 1 && u === 1 && !out ? '' : C[d]) + U[u];
      }
      return out;
    }
    if (spec.edit !== false) {
      var row = div('wg-ctrl');
      row.appendChild(div('wg-ctrl-label', '調調看'));
      [1000, 100, 10, 1].forEach(function (unit) {
        if (unit > max) return;
        row.appendChild(btn('+' + unit, function () { val = clamp(val + unit, 0, max); paint(); }));
      });
      box.appendChild(row);
      var row2 = div('wg-ctrl');
      [1000, 100, 10, 1].forEach(function (unit) {
        if (unit > max) return;
        row2.appendChild(btn('−' + unit, function () { val = clamp(val - unit, 0, max); paint(); }));
      });
      box.appendChild(row2);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 直式計算（column）─────────────────────────────────────────────────
     一步一步看進位／借位怎麼來的。加法與減法共用。
     spec: { a, b, op: '+'|'-' }                                           */
  REG.column = function (host, spec) {
    var a = spec.a, b = spec.b, op = spec.op === '-' ? '-' : '+';
    var A = String(a).split('').map(Number).reverse();
    var B = String(b).split('').map(Number).reverse();
    var n = Math.max(A.length, B.length) + (op === '+' ? 1 : 0);
    var step = 0;                                     // 已算到第幾位（由個位起）
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var note = div('wg-note');
    box.appendChild(note);

    function calc() {                                  // 算到 step 位為止的過程
      var res = [], carry = 0, marks = [];
      for (var i = 0; i < step; i++) {
        var x = A[i] || 0, y = B[i] || 0, v;
        if (op === '+') {
          v = x + y + carry;
          marks.push(v >= 10 ? 1 : 0);
          res.push(v % 10);
          carry = v >= 10 ? 1 : 0;
        } else {
          v = x - y - carry;
          marks.push(v < 0 ? 1 : 0);
          res.push((v + 10) % 10);
          carry = v < 0 ? 1 : 0;
        }
      }
      return { res: res, carry: carry, marks: marks };
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var st = calc();
      var W = 34, right = 300, top = 30;
      function col(i) { return right - i * W - W / 2; }   // i=0 是個位（最右）
      for (var i = 0; i < n; i++) {
        if (A[i] != null) svg.appendChild(txt(col(i), top, String(A[i]), 'font-size:22px;font-weight:700'));
        if (B[i] != null) svg.appendChild(txt(col(i), top + 34, String(B[i]), 'font-size:22px;font-weight:700'));
        // 進位／借位的小記號
        if (st.marks[i]) {
          svg.appendChild(txt(col(i + 1), top - 20, op === '+' ? '1' : '借',
            'font-size:13px;fill:var(--bad);font-weight:700'));
        }
        if (i < st.res.length) {
          svg.appendChild(txt(col(i), top + 78, String(st.res[i]), 'font-size:22px;font-weight:700;fill:var(--accent)'));
        }
      }
      if (op === '+' && step >= n - 1 && st.carry) {
        svg.appendChild(txt(col(st.res.length), top + 78, '1', 'font-size:22px;font-weight:700;fill:var(--accent)'));
      }
      svg.appendChild(txt(right - n * W - 6, top + 34, op, 'font-size:22px;font-weight:700'));
      svg.appendChild(el('line', { x1: right - n * W - 16, y1: top + 54, x2: right, y2: top + 54 },
        'stroke:var(--text);stroke-width:2'));
      var done = step >= (op === '+' ? Math.max(A.length, B.length) : A.length);
      if (!step) note.textContent = '從最右邊的「個位」開始算。';
      else if (!done) {
        note.textContent = '第 ' + step + ' 位算好了' +
          (st.marks[step - 1] ? (op === '+' ? '，滿十要進位到左邊一格 ⬅️' : '，不夠減要跟左邊借 1 ⬅️') : '。');
      } else {
        note.textContent = '算完了：' + a + ' ' + op + ' ' + b + ' = ' + (op === '+' ? a + b : a - b);
      }
      note.className = 'wg-note' + (done ? ' ok' : '');
    }
    var ctrl = div('wg-ctrl');
    ctrl.appendChild(btn('下一步 ▶', function () {
      step = clamp(step + 1, 0, op === '+' ? Math.max(A.length, B.length) : A.length);
      paint();
    }));
    ctrl.appendChild(btn('重來', function () { step = 0; paint(); }));
    box.appendChild(ctrl);
    host.appendChild(box);
    paint();
  };

  /* ── 乘法陣列（array）─────────────────────────────────────────────────
     23×4 拆成 20×4 + 3×4，這是二位數乘一位數的核心。
     spec: { rows, cols, split }                                           */
  REG.array = function (host, spec) {
    var rows = spec.rows || 4, cols = spec.cols || 12;
    var split = spec.split !== false && cols > 10;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 130', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var maxC = Math.max(cols, 1), maxR = Math.max(rows, 1);
      var cw = Math.min(280 / maxC, 18), ch = Math.min(90 / maxR, 18);
      var x0 = 160 - (cw * maxC) / 2, y0 = 15;
      var tens = split ? Math.floor(cols / 10) * 10 : 0;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          svg.appendChild(el('circle',
            { cx: x0 + c * cw + cw / 2, cy: y0 + r * ch + ch / 2, r: Math.min(cw, ch) / 2 - 1.5 },
            'fill:' + (split && c < tens ? 'var(--accent)' : 'var(--good)')));
        }
      }
      if (split && tens) {
        var sx = x0 + tens * cw;
        svg.appendChild(el('line', { x1: sx, y1: y0 - 4, x2: sx, y2: y0 + rows * ch + 4 },
          'stroke:var(--bad);stroke-width:2;stroke-dasharray:4 3'));
      }
      read.innerHTML = '';
      var main = div('wg-read-main', rows + ' 排 × 每排 ' + cols + ' 個 ＝ ' + (rows * cols) + ' 個');
      read.appendChild(main);
      if (split && tens) {
        read.appendChild(div('wg-read-sub',
          '拆開算：' + tens + '×' + rows + ' ＝ ' + (tens * rows) + '，' +
          (cols - tens) + '×' + rows + ' ＝ ' + ((cols - tens) * rows) + '，' +
          '合起來 ' + (tens * rows) + ' ＋ ' + ((cols - tens) * rows) + ' ＝ ' + (rows * cols)));
      }
    }
    if (spec.edit) {
      var sr = stepper('幾排', function () { return rows; }, function (v) { rows = v; }, 1, 9, function () { sr.sync(); paint(); });
      var sc = stepper('每排幾個', function () { return cols; }, function (v) { cols = v; }, 1, 30, function () { sc.sync(); paint(); });
      box.appendChild(sr.el); box.appendChild(sc.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 分堆除法（grouping）───────────────────────────────────────────────
     「17 顆糖每 5 顆一包」看得見商與餘數。第5、第6單元共用。
     spec: { total, per, edit }                                            */
  REG.grouping = function (host, spec) {
    var total = spec.total || 17, per = spec.per || 5;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 140', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      per = clamp(per, 1, 12); total = clamp(total, 1, 40);
      var q = Math.floor(total / per), rem = total % per;
      var perRow = Math.min(per, 6);
      var gw = perRow * 17 + 12, gh = Math.ceil(per / 6) * 17 + 12;
      var x = 8, y = 10, drawn = 0;
      for (var g = 0; g < q; g++) {
        if (x + gw > 312) { x = 8; y += gh + 8; }
        svg.appendChild(el('rect', { x: x, y: y, width: gw, height: gh, rx: 7 },
          'fill:none;stroke:var(--good);stroke-width:2'));
        for (var k = 0; k < per; k++) {
          svg.appendChild(el('circle',
            { cx: x + 6 + (k % perRow) * 17 + 8, cy: y + 6 + Math.floor(k / perRow) * 17 + 8, r: 6 },
            'fill:var(--good)'));
          drawn++;
        }
        x += gw + 8;
      }
      if (rem) {
        if (x + rem * 17 + 12 > 312) { x = 8; y += gh + 8; }
        svg.appendChild(el('rect', { x: x, y: y, width: rem * 17 + 12, height: 28, rx: 7 },
          'fill:none;stroke:var(--bad);stroke-width:2;stroke-dasharray:4 3'));
        for (var j = 0; j < rem; j++) {
          svg.appendChild(el('circle', { cx: x + 6 + j * 17 + 8, cy: y + 14, r: 6 }, 'fill:var(--bad)'));
        }
      }
      read.innerHTML = '';
      read.appendChild(div('wg-read-main',
        total + ' ÷ ' + per + ' ＝ ' + q + (rem ? '　餘 ' + rem : '')));
      read.appendChild(div('wg-read-sub', rem
        ? '每 ' + per + ' 個一堆，分成 ' + q + ' 堆，剩下 ' + rem + ' 個不夠再分一堆（餘數一定比除數小）'
        : '每 ' + per + ' 個一堆，剛好分成 ' + q + ' 堆，沒有剩下'));
    }
    if (spec.edit !== false) {
      var st = stepper('總共幾個', function () { return total; }, function (v) { total = v; }, 1, 40, function () { st.sync(); paint(); });
      var sp = stepper('每堆幾個', function () { return per; }, function (v) { per = v; }, 1, 12, function () { sp.sync(); paint(); });
      box.appendChild(st.el); box.appendChild(sp.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 角（angle）───────────────────────────────────────────────────────
     滑桿轉角度，即時看銳角／直角／鈍角／平角。
     spec: { deg, edit }                                                   */
  REG.angle = function (host, spec) {
    var deg = spec.deg == null ? 45 : spec.deg;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function kind(d) {
      if (d === 90) return ['直角', 'var(--accent)'];
      if (d === 180) return ['平角', 'var(--accent)'];
      if (d < 90) return ['銳角（比直角小）', 'var(--good)'];
      return ['鈍角（比直角大、比平角小）', 'var(--bad)'];
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var cx = 160, cy = 130, R = 105;
      var a = -deg * Math.PI / 180;
      svg.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R, y2: cy }, 'stroke:var(--dim);stroke-width:3'));
      svg.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R * Math.cos(a), y2: cy + R * Math.sin(a) },
        'stroke:var(--accent);stroke-width:3'));
      // 角度弧（直角畫成小方框，跟課本一樣）
      if (deg === 90) {
        svg.appendChild(el('path', { d: 'M' + (cx + 22) + ',' + cy + ' L' + (cx + 22) + ',' + (cy - 22) + ' L' + cx + ',' + (cy - 22) },
          'fill:none;stroke:var(--accent);stroke-width:2'));
      } else {
        var r2 = 34, big = deg > 180 ? 1 : 0;
        svg.appendChild(el('path', {
          d: 'M' + (cx + r2) + ',' + cy + ' A' + r2 + ',' + r2 + ' 0 ' + big + ',0 ' +
             (cx + r2 * Math.cos(a)) + ',' + (cy + r2 * Math.sin(a))
        }, 'fill:none;stroke:var(--accent);stroke-width:2'));
      }
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: 4 }, 'fill:var(--text)'));
      var k = kind(deg);
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', deg + '°　' + k[0]));
    }
    if (spec.edit !== false) {
      var row = div('wg-ctrl');
      row.appendChild(slider(0, 180, deg, 5, function (v) { deg = v; paint(); }));
      box.appendChild(row);
      var quick = div('wg-ctrl');
      [30, 90, 120, 180].forEach(function (d) {
        quick.appendChild(btn(d + '°', function () { deg = d; paint(); }));
      });
      box.appendChild(quick);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 圓的各部位（circleparts）──────────────────────────────────────────
     spec: { show: ['radius','diameter'] , r }                             */
  REG.circleparts = function (host, spec) {
    var show = spec.show || ['radius', 'diameter'];
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    var cx = 160, cy = 90, R = 70;
    svg.appendChild(el('circle', { cx: cx, cy: cy, r: R },
      'fill:none;stroke:var(--text);stroke-width:2.5'));
    svg.appendChild(el('circle', { cx: cx, cy: cy, r: 4 }, 'fill:var(--bad)'));
    svg.appendChild(txt(cx - 22, cy + 14, '圓心', 'fill:var(--bad);font-size:13px'));
    if (show.indexOf('diameter') >= 0) {
      svg.appendChild(el('line', { x1: cx - R, y1: cy, x2: cx + R, y2: cy },
        'stroke:var(--good);stroke-width:3'));
      svg.appendChild(txt(cx, cy - 12, '直徑', 'fill:var(--good);font-size:13px'));
    }
    if (show.indexOf('radius') >= 0) {
      var a = -Math.PI / 3;
      svg.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R * Math.cos(a), y2: cy + R * Math.sin(a) },
        'stroke:var(--accent);stroke-width:3'));
      svg.appendChild(txt(cx + 46, cy - 44, '半徑', 'fill:var(--accent);font-size:13px'));
    }
    box.appendChild(svg);
    box.appendChild(div('wg-read-sub', '直徑 ＝ 半徑 × 2　（直徑一定通過圓心）'));
    host.appendChild(box);
  };

  /* ── 時鐘（clock）─────────────────────────────────────────────────────
     spec: { h, m, edit }  或  { h, m, addMin }（顯示「經過多久」的兩個時鐘） */
  REG.clock = function (host, spec) {
    var h = spec.h == null ? 3 : spec.h, m = spec.m == null ? 0 : spec.m;
    var addMin = spec.addMin || 0;
    var box = div('wg');
    var wrap = div('wg-clocks');
    var svg1 = el('svg', { viewBox: '0 0 160 160', class: 'wg-svg wg-svg-pie' });
    wrap.appendChild(svg1);
    var svg2 = null;
    if (addMin) {
      wrap.appendChild(div('wg-arrow', '➜'));
      svg2 = el('svg', { viewBox: '0 0 160 160', class: 'wg-svg wg-svg-pie' });
      wrap.appendChild(svg2);
    }
    box.appendChild(wrap);
    var read = div('wg-read');
    box.appendChild(read);

    function face(svg, hh, mm) {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var cx = 80, cy = 80, R = 70;
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: R },
        'fill:var(--panel2);stroke:var(--border);stroke-width:2'));
      for (var i = 0; i < 12; i++) {
        var a = (i * 30 - 90) * Math.PI / 180;
        svg.appendChild(txt(cx + (R - 14) * Math.cos(a), cy + (R - 14) * Math.sin(a),
          String(i === 0 ? 12 : i), 'font-size:13px;fill:var(--dim)'));
      }
      var ma = (mm * 6 - 90) * Math.PI / 180;
      var ha = ((hh % 12) * 30 + mm * 0.5 - 90) * Math.PI / 180;
      svg.appendChild(el('line', { x1: cx, y1: cy, x2: cx + 38 * Math.cos(ha), y2: cy + 38 * Math.sin(ha) },
        'stroke:var(--text);stroke-width:5;stroke-linecap:round'));
      svg.appendChild(el('line', { x1: cx, y1: cy, x2: cx + 56 * Math.cos(ma), y2: cy + 56 * Math.sin(ma) },
        'stroke:var(--accent);stroke-width:3;stroke-linecap:round'));
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: 4 }, 'fill:var(--text)'));
    }
    function fmt(hh, mm) { return hh + ' 點 ' + (mm < 10 ? '0' : '') + mm + ' 分'; }
    function paint() {
      face(svg1, h, m);
      read.innerHTML = '';
      if (addMin) {
        var t = h * 60 + m + addMin, h2 = Math.floor(t / 60) % 24, m2 = t % 60;
        face(svg2, h2, m2);
        read.appendChild(div('wg-read-main', fmt(h, m) + '　經過 ' + addMin + ' 分鐘　➜　' + fmt(h2, m2)));
        if (m + addMin >= 60) {
          read.appendChild(div('wg-read-sub', '分鐘加起來超過 60，要進位成 1 小時（' + (m + addMin) + ' 分 ＝ 1 小時 ' + (m + addMin - 60) + ' 分）'));
        }
      } else {
        read.appendChild(div('wg-read-main', fmt(h, m)));
      }
    }
    if (spec.edit) {
      var row = div('wg-ctrl');
      row.appendChild(div('wg-ctrl-label', '時'));
      row.appendChild(btn('−', function () { h = (h + 11) % 12 || 12; paint(); }));
      row.appendChild(btn('＋', function () { h = (h % 12) + 1; paint(); }));
      row.appendChild(div('wg-ctrl-label', '分'));
      row.appendChild(btn('−5', function () { m = (m + 55) % 60; paint(); }));
      row.appendChild(btn('+5', function () { m = (m + 5) % 60; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 數線（numberline）────────────────────────────────────────────────
     從小一認數、小三分數、小六負數到高一絕對值都用得到。
     spec: { min, max, step, value, edit, marks:[{v,label}] }              */
  REG.numberline = function (host, spec) {
    var min = spec.min == null ? 0 : spec.min, max = spec.max == null ? 10 : spec.max;
    var stepV = spec.step || 1;
    var val = spec.value == null ? min : spec.value;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 90', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function X(v) { return 20 + (v - min) / (max - min) * 280; }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.appendChild(el('line', { x1: 14, y1: 45, x2: 306, y2: 45 }, 'stroke:var(--text);stroke-width:2'));
      var ticks = Math.round((max - min) / stepV);
      var skip = ticks > 20 ? Math.ceil(ticks / 20) : 1;
      for (var i = 0; i <= ticks; i++) {
        var v = min + i * stepV, x = X(v);
        var major = i % skip === 0;
        svg.appendChild(el('line', { x1: x, y1: 45 - (major ? 7 : 4), x2: x, y2: 45 + (major ? 7 : 4) },
          'stroke:var(--' + (major ? 'text' : 'dim') + ');stroke-width:' + (major ? 2 : 1)));
        if (major) svg.appendChild(txt(x, 64, String(+v.toFixed(2)), 'font-size:12px;fill:var(--dim)'));
      }
      (spec.marks || []).forEach(function (mk) {
        svg.appendChild(el('circle', { cx: X(mk.v), cy: 45, r: 5 }, 'fill:var(--good)'));
        if (mk.label) svg.appendChild(txt(X(mk.v), 24, mk.label, 'font-size:13px;fill:var(--good);font-weight:700'));
      });
      if (spec.edit !== false) {
        svg.appendChild(el('circle', { cx: X(val), cy: 45, r: 8 }, 'fill:var(--accent)'));
        svg.appendChild(txt(X(val), 22, String(+val.toFixed(2)), 'font-size:14px;fill:var(--accent);font-weight:700'));
        read.textContent = '目前指著：' + (+val.toFixed(2));
      } else { read.textContent = ''; }
    }
    if (spec.edit !== false) {
      var row = div('wg-ctrl');
      row.appendChild(slider(min, max, val, stepV, function (v) { val = v; paint(); }));
      box.appendChild(row);
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
