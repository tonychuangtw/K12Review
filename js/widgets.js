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
    var NAMES = ['個', '十', '百', '千', '萬', '十萬', '百萬', '千萬', '億'];
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
        svg.appendChild(txt(cx, 122, NAMES[idx] || '',
          'fill:var(--dim);font-size:' + ((NAMES[idx] || '').length > 1 ? 10 : 13) + 'px'));
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

  /* ── 方格圖形：周長與面積（areagrid）───────────────────────────────────
     同一張圖同時顯示「繞一圈的長度」與「鋪滿幾個方格」，
     這兩個最常被搞混的量放在一起看才分得清。
     spec: { w, h, edit, show:'both'|'perimeter'|'area' }                  */
  REG.areagrid = function (host, spec) {
    var w = spec.w || 5, h = spec.h || 4;
    var show = spec.show || 'both';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      w = clamp(w, 1, 12); h = clamp(h, 1, 8);
      var cell = Math.min(260 / w, 110 / h, 26);
      var x0 = 160 - w * cell / 2, y0 = 20;
      for (var r = 0; r < h; r++) {
        for (var c = 0; c < w; c++) {
          svg.appendChild(el('rect',
            { x: x0 + c * cell, y: y0 + r * cell, width: cell, height: cell },
            'fill:' + (show === 'perimeter' ? 'var(--panel2)' : 'color-mix(in srgb, var(--accent) 35%, transparent)') +
            ';stroke:var(--border);stroke-width:1'));
        }
      }
      if (show !== 'area') {                            // 周長：外框描粗
        svg.appendChild(el('rect', { x: x0, y: y0, width: w * cell, height: h * cell },
          'fill:none;stroke:var(--bad);stroke-width:4'));
      }
      svg.appendChild(txt(x0 + w * cell / 2, y0 + h * cell + 16, '長 ' + w + ' 公分', 'font-size:13px;fill:var(--dim)'));
      svg.appendChild(txt(x0 - 26, y0 + h * cell / 2, '寬' + h, 'font-size:13px;fill:var(--dim)'));
      read.innerHTML = '';
      if (show !== 'area') {
        read.appendChild(div('wg-read-main', '周長（紅線繞一圈）＝ (' + w + '＋' + h + ') × 2 ＝ ' + ((w + h) * 2) + ' 公分'));
      }
      if (show !== 'perimeter') {
        read.appendChild(div('wg-read-main', '面積（藍格子有幾個）＝ ' + w + ' × ' + h + ' ＝ ' + (w * h) + ' 平方公分'));
      }
      if (show === 'both') {
        read.appendChild(div('wg-read-sub', '周長算的是「邊」的長度，單位是公分；面積算的是「裡面」的格子數，單位是平方公分。'));
      }
    }
    if (spec.edit !== false) {
      var sw = stepper('長', function () { return w; }, function (v) { w = v; }, 1, 12, function () { sw.sync(); paint(); });
      var sh = stepper('寬', function () { return h; }, function (v) { h = v; }, 1, 8, function () { sh.sync(); paint(); });
      box.appendChild(sw.el); box.appendChild(sh.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 小數方格（decimalgrid）───────────────────────────────────────────
     0.1 是「把 1 平分成 10 份的 1 份」——和分數接得起來。
     spec: { cells: 10|100, filled, edit }                                 */
  REG.decimalgrid = function (host, spec) {
    var cells = spec.cells === 100 ? 100 : 10;
    var filled = spec.filled == null ? 3 : spec.filled;
    var box = div('wg');
    var svg = el('svg', { viewBox: cells === 100 ? '0 0 320 180' : '0 0 320 90', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      filled = clamp(filled, 0, cells);
      var cols = cells === 100 ? 10 : 10, rows = cells / cols;
      var cw = cells === 100 ? 15 : 28, ch = cells === 100 ? 15 : 46;
      var x0 = 160 - cols * cw / 2, y0 = 14;
      for (var i = 0; i < cells; i++) {
        var r = Math.floor(i / cols), c = i % cols;
        var rect = el('rect', { x: x0 + c * cw, y: y0 + r * ch, width: cw, height: ch },
          'fill:' + (i < filled ? 'var(--accent)' : 'var(--panel2)') +
          ';stroke:var(--border);stroke-width:1;cursor:' + (spec.edit ? 'pointer' : 'default'));
        if (spec.edit) (function (idx) {
          rect.addEventListener('click', function () { filled = (filled === idx + 1) ? idx : idx + 1; paint(); });
        })(i);
        svg.appendChild(rect);
      }
      var dec = cells === 10 ? (filled / 10).toFixed(1) : (filled / 100).toFixed(2);
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', '塗了 ' + filled + '/' + cells + '　寫成小數是 ' + dec));
      read.appendChild(div('wg-read-sub', cells === 10
        ? '把 1 平分成 10 份，取 ' + filled + ' 份 ＝ ' + filled + '/10 ＝ ' + dec
        : '把 1 平分成 100 份，取 ' + filled + ' 份 ＝ ' + filled + '/100 ＝ ' + dec));
    }
    if (spec.edit) box.appendChild(div('wg-hint', '👆 點格子塗色，看小數怎麼變'));
    host.appendChild(box);
    paint();
  };

  /* ── 長條圖（bargraph）────────────────────────────────────────────────
     統計圖表單元用；也可給自然／社會的資料判讀題。
     spec: { data:[{label,value}], unit }                                  */
  REG.bargraph = function (host, spec) {
    var data = spec.data || [];
    var unit = spec.unit || '';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    var maxV = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    var n = data.length, bw = Math.min(240 / Math.max(n, 1), 46);
    var x0 = 160 - n * bw / 2, base = 130;
    svg.appendChild(el('line', { x1: 20, y1: base, x2: 300, y2: base }, 'stroke:var(--text);stroke-width:2'));
    data.forEach(function (d, i) {
      var hgt = d.value / maxV * 100;
      svg.appendChild(el('rect',
        { x: x0 + i * bw + 5, y: base - hgt, width: bw - 10, height: hgt, rx: 3 },
        'fill:var(--accent)'));
      svg.appendChild(txt(x0 + i * bw + bw / 2, base - hgt - 10, String(d.value),
        'font-size:13px;font-weight:700;fill:var(--accent)'));
      svg.appendChild(txt(x0 + i * bw + bw / 2, base + 16, d.label, 'font-size:13px;fill:var(--dim)'));
    });
    if (unit) svg.appendChild(txt(30, 16, '單位：' + unit, 'font-size:12px;fill:var(--dim)'));
    box.appendChild(svg);
    var top = data.slice().sort(function (a, b) { return b.value - a.value; });
    if (top.length >= 2) {
      box.appendChild(div('wg-read-sub',
        '最多的是「' + top[0].label + '」' + top[0].value + unit +
        '，最少的是「' + top[top.length - 1].label + '」' + top[top.length - 1].value + unit +
        '，相差 ' + (top[0].value - top[top.length - 1].value) + unit + '。'));
    }
    host.appendChild(box);
  };

  /* ── 量角器（protractor）──────────────────────────────────────────────
     角度的「測量」和角度的「分類」是兩件事：這個元件重點在刻度怎麼讀。
     spec: { deg, edit }                                                   */
  REG.protractor = function (host, spec) {
    var deg = spec.deg == null ? 60 : spec.deg;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var cx = 160, cy = 155, R = 120;
      // 半圓量角器
      svg.appendChild(el('path', { d: 'M' + (cx - R) + ',' + cy + ' A' + R + ',' + R + ' 0 0,1 ' + (cx + R) + ',' + cy + ' Z' },
        'fill:color-mix(in srgb, var(--panel2) 80%, transparent);stroke:var(--border);stroke-width:2'));
      for (var d = 0; d <= 180; d += 10) {
        var a = (180 - d) * Math.PI / 180;
        var big = d % 30 === 0;
        svg.appendChild(el('line', {
          x1: cx + (R - (big ? 14 : 7)) * Math.cos(a), y1: cy - (R - (big ? 14 : 7)) * Math.sin(a),
          x2: cx + R * Math.cos(a), y2: cy - R * Math.sin(a)
        }, 'stroke:var(--dim);stroke-width:1'));
        if (big) svg.appendChild(txt(cx + (R - 26) * Math.cos(a), cy - (R - 26) * Math.sin(a),
          String(d), 'font-size:10px;fill:var(--dim)'));
      }
      // 被量的角：一邊貼齊底線（0 度），另一邊轉到 deg
      svg.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R, y2: cy }, 'stroke:var(--text);stroke-width:3'));
      var a2 = (180 - (180 - deg)) * Math.PI / 180;
      svg.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R * Math.cos(a2), y2: cy - R * Math.sin(a2) },
        'stroke:var(--accent);stroke-width:3'));
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: 4 }, 'fill:var(--bad)'));
      svg.appendChild(txt(cx, cy + 20, '中心點對準頂點', 'font-size:11px;fill:var(--bad)'));
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', '這個角是 ' + deg + '°'));
      read.appendChild(div('wg-read-sub', '量角器中心對準頂點、其中一邊對準 0，再讀另一邊指到的刻度。'));
    }
    if (spec.edit !== false) {
      var row = div('wg-ctrl');
      row.appendChild(slider(0, 180, deg, 5, function (v) { deg = v; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 兩直線的關係（lines）─────────────────────────────────────────────
     spec: { kind: 'perpendicular'|'parallel'|'intersect', pick }          */
  REG.lines = function (host, spec) {
    var KINDS = [
      ['perpendicular', '垂直', '相交成 90°，用小方框標記'],
      ['parallel', '平行', '永遠不會相交，距離處處相等'],
      ['intersect', '相交（不垂直）', '交於一點，但夾角不是 90°']
    ];
    var kind = spec.kind || 'perpendicular';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var st = 'stroke:var(--accent);stroke-width:3';
      if (kind === 'parallel') {
        svg.appendChild(el('line', { x1: 30, y1: 50, x2: 290, y2: 50 }, st));
        svg.appendChild(el('line', { x1: 30, y1: 105, x2: 290, y2: 105 }, st));
        [70, 160, 250].forEach(function (x) {
          svg.appendChild(el('line', { x1: x, y1: 50, x2: x, y2: 105 },
            'stroke:var(--dim);stroke-width:1;stroke-dasharray:3 3'));
          svg.appendChild(txt(x + 14, 78, '同寬', 'font-size:10px;fill:var(--dim)'));
        });
      } else if (kind === 'perpendicular') {
        svg.appendChild(el('line', { x1: 30, y1: 100, x2: 290, y2: 100 }, st));
        svg.appendChild(el('line', { x1: 160, y1: 20, x2: 160, y2: 140 }, st));
        svg.appendChild(el('path', { d: 'M160,78 L182,78 L182,100' },
          'fill:none;stroke:var(--bad);stroke-width:2'));
        svg.appendChild(txt(196, 88, '90°', 'font-size:13px;fill:var(--bad);font-weight:700'));
      } else {
        svg.appendChild(el('line', { x1: 30, y1: 110, x2: 290, y2: 110 }, st));
        svg.appendChild(el('line', { x1: 70, y1: 20, x2: 250, y2: 140 }, st));
        svg.appendChild(txt(196, 96, '不是 90°', 'font-size:12px;fill:var(--dim)'));
      }
      var k = KINDS.filter(function (x) { return x[0] === kind; })[0];
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', k[1]));
      read.appendChild(div('wg-read-sub', k[2]));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      KINDS.forEach(function (k) {
        row.appendChild(btn(k[1], function () { kind = k[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 三角形分類（triangle）────────────────────────────────────────────
     spec: { kind, pick }   kind: equilateral|isosceles|scalene|right|obtuse */
  REG.triangle = function (host, spec) {
    var T = {
      equilateral: { pts: [[160, 30], [90, 130], [230, 130]], name: '正三角形（等邊三角形）', desc: '三邊都一樣長，三個角也都是 60°' },
      isosceles: { pts: [[160, 25], [105, 130], [215, 130]], name: '等腰三角形', desc: '有兩邊一樣長，兩個底角也相等' },
      scalene: { pts: [[120, 30], [70, 130], [240, 130]], name: '不等邊三角形', desc: '三邊都不一樣長' },
      right: { pts: [[80, 30], [80, 130], [230, 130]], name: '直角三角形', desc: '有一個角是 90°（用小方框標記）' },
      obtuse: { pts: [[110, 40], [60, 130], [260, 130]], name: '鈍角三角形', desc: '有一個角比 90° 大' }
    };
    var kind = spec.kind || 'equilateral';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 160', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var t = T[kind];
      svg.appendChild(el('polygon', { points: t.pts.map(function (p) { return p.join(','); }).join(' ') },
        'fill:color-mix(in srgb, var(--accent) 25%, transparent);stroke:var(--accent);stroke-width:3'));
      if (kind === 'right') {
        svg.appendChild(el('path', { d: 'M80,112 L98,112 L98,130' }, 'fill:none;stroke:var(--bad);stroke-width:2'));
      }
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', t.name));
      read.appendChild(div('wg-read-sub', t.desc + '　（任何三角形的三個角加起來都是 180°）'));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['equilateral', '正三角形'], ['isosceles', '等腰'], ['scalene', '不等邊'],
       ['right', '直角'], ['obtuse', '鈍角']].forEach(function (k) {
        row.appendChild(btn(k[1], function () { kind = k[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 四邊形分類（quad）───────────────────────────────────────────────
     spec: { kind, pick }   kind: square|rect|parallelogram|trapezoid|rhombus */
  REG.quad = function (host, spec) {
    var Q = {
      square: { pts: [[110, 30], [210, 30], [210, 130], [110, 130]], name: '正方形', desc: '四邊等長、四個角都是直角' },
      rect: { pts: [[70, 45], [250, 45], [250, 125], [70, 125]], name: '長方形', desc: '對邊等長、四個角都是直角' },
      parallelogram: { pts: [[100, 40], [260, 40], [220, 130], [60, 130]], name: '平行四邊形', desc: '兩組對邊分別平行且等長，但角不一定是直角' },
      trapezoid: { pts: [[120, 40], [220, 40], [265, 130], [55, 130]], name: '梯形', desc: '只有一組對邊平行' },
      rhombus: { pts: [[160, 30], [235, 80], [160, 130], [85, 80]], name: '菱形', desc: '四邊等長，但角不一定是直角' }
    };
    // 打錯 kind 不要整張卡沒圖，退回正方形（symmetry 也是同樣的守則）
    var kind = Q[spec.kind] ? spec.kind : 'square';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 155', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var q = Q[kind];
      svg.appendChild(el('polygon', { points: q.pts.map(function (p) { return p.join(','); }).join(' ') },
        'fill:color-mix(in srgb, var(--good) 22%, transparent);stroke:var(--good);stroke-width:3'));
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', q.name));
      read.appendChild(div('wg-read-sub', q.desc));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['square', '正方形'], ['rect', '長方形'], ['parallelogram', '平行四邊形'],
       ['trapezoid', '梯形'], ['rhombus', '菱形']].forEach(function (k) {
        row.appendChild(btn(k[1], function () { kind = k[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 四則運算順序（exprsteps）─────────────────────────────────────────
     一步一步標出「這一步先算哪裡」，先乘除後加減、有括號先算括號。
     spec: { steps: [{ expr, hint }] }   最後一步就是答案                   */
  REG.exprsteps = function (host, spec) {
    var steps = spec.steps || [];
    var i = 0;
    var box = div('wg');
    var line = div('wg-expr');
    var note = div('wg-note');
    box.appendChild(line); box.appendChild(note);
    function paint() {
      line.textContent = steps[i] ? steps[i].expr : '';
      note.textContent = steps[i] ? steps[i].hint : '';
      note.className = 'wg-note' + (i === steps.length - 1 ? ' ok' : '');
    }
    var ctrl = div('wg-ctrl');
    ctrl.appendChild(btn('下一步 ▶', function () { i = clamp(i + 1, 0, steps.length - 1); paint(); }));
    ctrl.appendChild(btn('重來', function () { i = 0; paint(); }));
    box.appendChild(ctrl);
    host.appendChild(box);
    paint();
  };

  /* ── 四捨五入（rounding）──────────────────────────────────────────────
     在數線上看「離哪一個整十／整百比較近」，比背口訣好懂。
     spec: { value, unit }   unit = 10 | 100 | 1000                        */
  REG.rounding = function (host, spec) {
    var v = spec.value == null ? 368 : spec.value;
    var unit = spec.unit || 100;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 110', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var lo = Math.floor(v / unit) * unit, hi = lo + unit, mid = lo + unit / 2;
      function X(x) { return 30 + (x - lo) / unit * 260; }
      svg.appendChild(el('line', { x1: 20, y1: 60, x2: 300, y2: 60 }, 'stroke:var(--text);stroke-width:2'));
      [[lo, String(lo)], [mid, String(mid)], [hi, String(hi)]].forEach(function (m, k) {
        svg.appendChild(el('line', { x1: X(m[0]), y1: 52, x2: X(m[0]), y2: 68 },
          'stroke:var(--' + (k === 1 ? 'dim' : 'text') + ');stroke-width:2'));
        svg.appendChild(txt(X(m[0]), 82, m[1], 'font-size:12px;fill:var(--dim)'));
      });
      svg.appendChild(txt(X(mid), 34, '中間點', 'font-size:11px;fill:var(--dim)'));
      var near = (v - lo) >= unit / 2 ? hi : lo;
      svg.appendChild(el('circle', { cx: X(v), cy: 60, r: 7 }, 'fill:var(--accent)'));
      svg.appendChild(txt(X(v), 22, String(v), 'font-size:14px;fill:var(--accent);font-weight:700'));
      svg.appendChild(el('line', { x1: X(v), y1: 60, x2: X(near), y2: 60 },
        'stroke:var(--good);stroke-width:5;stroke-linecap:round'));
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', v + ' 四捨五入到最接近的 ' + unit + ' ＝ ' + near));
      read.appendChild(div('wg-read-sub', (v - lo) >= unit / 2
        ? '過了中間點（' + mid + '），所以進到 ' + hi + '（五入）'
        : '還沒到中間點（' + mid + '），所以退回 ' + lo + '（四捨）'));
    }
    if (spec.edit !== false) {
      var lo0 = Math.floor(v / unit) * unit;
      var row = div('wg-ctrl');
      row.appendChild(slider(lo0, lo0 + unit, v, Math.max(1, unit / 100), function (x) { v = x; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 因數（factors）───────────────────────────────────────────────────
     「12 能排成幾種完整的長方形」＝ 12 有哪些因數。因數配對一目了然。
     spec: { n, edit }                                                     */
  REG.factors = function (host, spec) {
    var n = spec.n || 12;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      n = clamp(n, 1, 36);
      var fs = [];
      for (var i = 1; i <= n; i++) if (n % i === 0) fs.push(i);
      // 畫出所有「幾排 × 每排幾個」的排法（因數配對）
      var pairs = fs.filter(function (f) { return f * f <= n; });
      var x = 8, y = 12, maxH = 0;
      pairs.forEach(function (r) {
        var c = n / r, cell = Math.min(9, 70 / c);
        var w = c * cell, h = r * cell;
        if (x + w + 12 > 312) { x = 8; y += maxH + 24; maxH = 0; }
        for (var a = 0; a < r; a++) for (var b = 0; b < c; b++) {
          svg.appendChild(el('rect', { x: x + b * cell, y: y + a * cell, width: cell - 1, height: cell - 1 },
            'fill:var(--accent)'));
        }
        svg.appendChild(txt(x + w / 2, y + h + 10, r + '×' + c, 'font-size:11px;fill:var(--dim)'));
        maxH = Math.max(maxH, h);
        x += w + 16;
      });
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', n + ' 的因數：' + fs.join('、') + '（共 ' + fs.length + ' 個）'));
      read.appendChild(div('wg-read-sub', fs.length === 2
        ? n + ' 只有 1 和自己兩個因數，是「質數」。'
        : '每一種長方形排法就是一組因數配對，例如 ' + pairs[pairs.length - 1] + '×' + (n / pairs[pairs.length - 1]) + '。'));
    }
    if (spec.edit !== false) {
      var st = stepper('數字', function () { return n; }, function (v) { n = v; }, 1, 36, function () { st.sync(); paint(); });
      box.appendChild(st.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 多邊形（polygon）─────────────────────────────────────────────────
     邊數 → 可以切成幾個三角形 → 內角和。切三角形的線會畫出來。
     spec: { sides, edit }                                                 */
  REG.polygon = function (host, spec) {
    var n = spec.sides || 5;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var NAMES = { 3: '三角形', 4: '四邊形', 5: '五邊形', 6: '六邊形', 7: '七邊形', 8: '八邊形' };
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      n = clamp(n, 3, 8);
      var cx = 160, cy = 85, R = 68, pts = [];
      for (var i = 0; i < n; i++) {
        var a = (i * 360 / n - 90) * Math.PI / 180;
        pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
      }
      svg.appendChild(el('polygon', { points: pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') },
        'fill:color-mix(in srgb, var(--accent) 20%, transparent);stroke:var(--accent);stroke-width:3'));
      // 從第一個頂點拉對角線，切成 n-2 個三角形
      for (var k = 2; k < n - 1; k++) {
        svg.appendChild(el('line', { x1: pts[0][0], y1: pts[0][1], x2: pts[k][0], y2: pts[k][1] },
          'stroke:var(--bad);stroke-width:1.5;stroke-dasharray:4 3'));
      }
      read.innerHTML = '';
      read.appendChild(div('wg-read-main',
        (NAMES[n] || n + ' 邊形') + '：可以切成 ' + (n - 2) + ' 個三角形'));
      read.appendChild(div('wg-read-sub',
        '內角和 ＝ 180° × ' + (n - 2) + ' ＝ ' + (180 * (n - 2)) + '°'));
    }
    if (spec.edit !== false) {
      var st = stepper('幾個邊', function () { return n; }, function (v) { n = v; }, 3, 8, function () { st.sync(); paint(); });
      box.appendChild(st.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 面積公式的由來（areaformula）─────────────────────────────────────
     平行四邊形剪一刀就變長方形、三角形是平行四邊形的一半——公式不是背來的。
     spec: { shape: 'parallelogram'|'triangle'|'trapezoid' }               */
  REG.areaformula = function (host, spec) {
    var shape = spec.shape || 'parallelogram';
    var stage = 0;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    box.appendChild(svg);
    var note = div('wg-note');
    box.appendChild(note);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var fill = 'fill:color-mix(in srgb, var(--accent) 25%, transparent);stroke:var(--accent);stroke-width:2.5';
      if (shape === 'parallelogram') {
        if (stage === 0) {
          svg.appendChild(el('polygon', { points: '80,30 260,30 220,110 40,110' }, fill));
          note.textContent = '平行四邊形。底 × 高 是怎麼來的？';
        } else if (stage === 1) {
          svg.appendChild(el('polygon', { points: '80,30 260,30 220,110 40,110' }, fill));
          svg.appendChild(el('line', { x1: 80, y1: 30, x2: 80, y2: 110 },
            'stroke:var(--bad);stroke-width:2;stroke-dasharray:5 3'));
          note.textContent = '沿著高剪一刀，左邊會出現一個三角形。';
        } else {
          svg.appendChild(el('polygon', { points: '80,30 260,30 260,110 80,110' }, fill));
          svg.appendChild(el('line', { x1: 80, y1: 30, x2: 80, y2: 110 }, 'stroke:var(--bad);stroke-width:2'));
          note.textContent = '把那個三角形搬到右邊，就變成長方形了 → 面積 ＝ 底 × 高';
        }
      } else if (shape === 'triangle') {
        if (stage === 0) {
          svg.appendChild(el('polygon', { points: '60,110 260,110 150,30' }, fill));
          note.textContent = '三角形。為什麼公式要「÷ 2」？';
        } else if (stage === 1) {
          svg.appendChild(el('polygon', { points: '60,110 260,110 150,30' }, fill));
          svg.appendChild(el('polygon', { points: '60,110 150,30 350,30' },
            'fill:color-mix(in srgb, var(--good) 25%, transparent);stroke:var(--good);stroke-width:2.5;stroke-dasharray:5 3'));
          note.textContent = '複製一個一模一樣的，倒過來拼上去。';
        } else {
          svg.appendChild(el('polygon', { points: '60,110 260,110 350,30 150,30' },
            'fill:color-mix(in srgb, var(--good) 22%, transparent);stroke:var(--good);stroke-width:2.5'));
          svg.appendChild(el('polygon', { points: '60,110 260,110 150,30' }, fill));
          note.textContent = '兩個拼成一個平行四邊形 → 三角形是它的一半 ＝ 底 × 高 ÷ 2';
        }
      } else {
        if (stage === 0) {
          svg.appendChild(el('polygon', { points: '110,30 210,30 260,110 60,110' }, fill));
          note.textContent = '梯形。(上底＋下底) × 高 ÷ 2 是怎麼來的？';
        } else if (stage === 1) {
          svg.appendChild(el('polygon', { points: '110,30 210,30 260,110 60,110' }, fill));
          svg.appendChild(el('polygon', { points: '210,30 110,30 60,110 260,110' },
            'fill:color-mix(in srgb, var(--good) 20%, transparent);stroke:var(--good);stroke-width:2;stroke-dasharray:5 3'));
          note.textContent = '一樣複製一個倒過來拼。';
        } else {
          svg.appendChild(el('polygon', { points: '60,110 260,110 310,30 110,30' },
            'fill:color-mix(in srgb, var(--good) 22%, transparent);stroke:var(--good);stroke-width:2.5'));
          note.textContent = '拼成平行四邊形，它的底是「上底＋下底」→ 梯形面積要再 ÷ 2';
        }
      }
      note.className = 'wg-note' + (stage === 2 ? ' ok' : '');
    }
    var ctrl = div('wg-ctrl');
    ctrl.appendChild(btn('下一步 ▶', function () { stage = clamp(stage + 1, 0, 2); paint(); }));
    ctrl.appendChild(btn('重來', function () { stage = 0; paint(); }));
    box.appendChild(ctrl);
    host.appendChild(box);
    paint();
  };

  /* ── 長方體（cuboid）──────────────────────────────────────────────────
     體積＝長×寬×高，用堆積木的方式看「一層幾個 × 幾層」。
     spec: { l, w, h, edit }                                               */
  REG.cuboid = function (host, spec) {
    var L = spec.l || 4, W = spec.w || 3, H = spec.h || 2;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      L = clamp(L, 1, 6); W = clamp(W, 1, 5); H = clamp(H, 1, 5);
      var u = Math.min(26, 150 / (L + W * 0.5), 110 / (H + W * 0.5));
      var ox = 160 - (L * u + W * u * 0.5) / 2, oy = 140;
      // 等角投影：由後往前、由下往上畫，前面的方塊蓋住後面的
      for (var y = W - 1; y >= 0; y--) {
        for (var z = 0; z < H; z++) {
          for (var x = 0; x < L; x++) {
            var px = ox + x * u + y * u * 0.5, py = oy - z * u - y * u * 0.4;
            svg.appendChild(el('polygon', {
              points: [px, py, px + u, py, px + u, py - u, px, py - u].join(',')
            }, 'fill:color-mix(in srgb, var(--accent) 55%, transparent);stroke:var(--border);stroke-width:1'));
            svg.appendChild(el('polygon', {
              points: [px, py - u, px + u, py - u, px + u * 1.5, py - u * 1.4, px + u * 0.5, py - u * 1.4].join(',')
            }, 'fill:color-mix(in srgb, var(--accent) 80%, transparent);stroke:var(--border);stroke-width:1'));
            svg.appendChild(el('polygon', {
              points: [px + u, py, px + u * 1.5, py - u * 0.4, px + u * 1.5, py - u * 1.4, px + u, py - u].join(',')
            }, 'fill:color-mix(in srgb, var(--accent) 35%, transparent);stroke:var(--border);stroke-width:1'));
          }
        }
      }
      read.innerHTML = '';
      read.appendChild(div('wg-read-main',
        '體積 ＝ ' + L + ' × ' + W + ' × ' + H + ' ＝ ' + (L * W * H) + ' 立方公分'));
      read.appendChild(div('wg-read-sub',
        '一層有 ' + L + '×' + W + ' ＝ ' + (L * W) + ' 個小方塊，疊了 ' + H + ' 層。'));
    }
    if (spec.edit !== false) {
      var sl = stepper('長', function () { return L; }, function (v) { L = v; }, 1, 6, function () { sl.sync(); paint(); });
      var sw = stepper('寬', function () { return W; }, function (v) { W = v; }, 1, 5, function () { sw.sync(); paint(); });
      var sh = stepper('高', function () { return H; }, function (v) { H = v; }, 1, 5, function () { sh.sync(); paint(); });
      box.appendChild(sl.el); box.appendChild(sw.el); box.appendChild(sh.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 線對稱（symmetry）────────────────────────────────────────────────
     spec: { shape: 'heart'|'butterfly'|'tree'|'none', axis }              */
  REG.symmetry = function (host, spec) {
    var SHAPES = {
      heart: { d: 'M0,20 C0,0 -30,0 -30,-18 C-30,-38 0,-42 0,-20 C0,-42 30,-38 30,-18 C30,0 0,0 0,20 Z', name: '愛心', sym: true },
      tree: { d: 'M0,40 L0,10 M-32,10 L32,10 L0,-40 Z', name: '樹', sym: true },
      flag: { d: 'M-30,-35 L30,-20 L-30,-5 Z M-30,-35 L-30,40', name: '旗子', sym: false },
      butterfly: { d: 'M0,-25 L0,25 M0,-10 C-40,-45 -55,-5 -22,12 C-10,18 -4,6 0,-2 C4,6 10,18 22,12 C55,-5 40,-45 0,-10 Z',
                   name: '蝴蝶', sym: true }
    };
    var kind = SHAPES[spec.shape] ? spec.shape : 'heart';   // 打錯字時回退，不要整張卡沒圖
    var folded = false;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 160', class: 'wg-svg' });
    box.appendChild(svg);
    var note = div('wg-note');
    box.appendChild(note);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var sh = SHAPES[kind];
      var g = el('g', { transform: 'translate(160,85)' });
      g.appendChild(el('path', { d: sh.d },
        'fill:color-mix(in srgb, var(--accent) 30%, transparent);stroke:var(--accent);stroke-width:2.5'));
      if (folded) {                                   // 對摺：右半邊蓋一層半透明，看左右合不合
        g.appendChild(el('rect', { x: 0, y: -60, width: 70, height: 120 },
          'fill:color-mix(in srgb, var(--good) 30%, transparent)'));
      }
      svg.appendChild(g);
      svg.appendChild(el('line', { x1: 160, y1: 15, x2: 160, y2: 155 },
        'stroke:var(--bad);stroke-width:2;stroke-dasharray:6 4'));
      svg.appendChild(txt(196, 24, '對稱軸', 'font-size:11px;fill:var(--bad)'));
      note.textContent = sh.sym
        ? '沿著紅線對摺，左右兩邊完全重疊 → ' + sh.name + '是線對稱圖形 ✅'
        : sh.name + '沿著這條線對摺，左右不會重疊 → 這條不是它的對稱軸 ❌';
      note.className = 'wg-note ' + (sh.sym ? 'ok' : 'ng');
    }
    var ctrl = div('wg-ctrl');
    ctrl.appendChild(btn('對摺看看', function () { folded = !folded; paint(); }));
    Object.keys(SHAPES).forEach(function (k) {
      ctrl.appendChild(btn(SHAPES[k].name, function () { kind = k; folded = false; paint(); }));
    });
    box.appendChild(ctrl);
    host.appendChild(box);
    paint();
  };

  /* ── 長方體展開圖（netbox）────────────────────────────────────────────
     6 個面攤平之後，哪一面對到哪一面？表面積 ＝ 三組面各兩個。
     spec: { l, w, h, edit }                                              */
  REG.netbox = function (host, spec) {
    var L = spec.l || 4, W = spec.w || 3, H = spec.h || 2;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      L = clamp(L, 1, 6); W = clamp(W, 1, 5); H = clamp(H, 1, 5);
      var u = Math.min(22, 250 / (L * 2 + W * 2), 150 / (H * 2 + W));
      var ox = 160 - (L * 2 + W * 2) * u / 2, oy = 20;
      // 十字形展開：上W / 左H 前L 右H 後L（中列）/ 下W
      function face(x, y, w, h, color, label) {
        svg.appendChild(el('rect', { x: x, y: y, width: w * u, height: h * u },
          'fill:color-mix(in srgb, var(--' + color + ') 30%, transparent);stroke:var(--' + color + ');stroke-width:2'));
        if (w * u > 26 && h * u > 16) {
          svg.appendChild(txt(x + w * u / 2, y + h * u / 2, label, 'font-size:10px;fill:var(--dim)'));
        }
      }
      var midY = oy + W * u;
      face(ox + H * u, oy, L, W, 'good', '上');                       // 上
      face(ox, midY, H, H, 'accent', '左');                            // 左
      face(ox + H * u, midY, L, H, 'accent', '前');                    // 前
      face(ox + (H + L) * u, midY, H, H, 'accent', '右');              // 右
      face(ox + (H + L + H) * u, midY, L, H, 'accent', '後');          // 後
      face(ox + H * u, midY + H * u, L, W, 'good', '下');              // 下
      var area = 2 * (L * W + L * H + W * H);
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', '表面積 ＝ 2 × (' + L + '×' + W + ' ＋ ' + L + '×' + H + ' ＋ ' + W + '×' + H + ') ＝ ' + area + ' 平方公分'));
      read.appendChild(div('wg-read-sub', '長方體有三組面，每組兩個一樣大（上下、前後、左右）。'));
    }
    if (spec.edit !== false) {
      var sl = stepper('長', function () { return L; }, function (v) { L = v; }, 1, 6, function () { sl.sync(); paint(); });
      var sw = stepper('寬', function () { return W; }, function (v) { W = v; }, 1, 5, function () { sw.sync(); paint(); });
      var sh = stepper('高', function () { return H; }, function (v) { H = v; }, 1, 5, function () { sh.sync(); paint(); });
      box.appendChild(sl.el); box.appendChild(sw.el); box.appendChild(sh.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 圓周長與圓面積（circlearea）───────────────────────────────────────
     圓面積公式的由來：把圓切成很多扇形，交錯排開會逼近一個長方形
     （長 ＝ 半個圓周 ＝ πr、寬 ＝ r）→ 面積 ＝ πr²。
     spec: { r, mode: 'circumference'|'area' }                            */
  REG.circlearea = function (host, spec) {
    var r = spec.r || 5;
    var mode = spec.mode || 'area';
    var stage = 0;                                     // area 模式的推導步驟
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      r = clamp(r, 1, 12);
      var R = 60, cx = 160, cy = 80;
      if (mode === 'circumference' || stage === 0) {
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: R },
          'fill:color-mix(in srgb, var(--accent) 18%, transparent);stroke:var(--accent);stroke-width:3'));
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R, y2: cy }, 'stroke:var(--bad);stroke-width:2.5'));
        svg.appendChild(txt(cx + R / 2, cy - 12, '半徑 ' + r, 'font-size:12px;fill:var(--bad)'));
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3 }, 'fill:var(--text)'));
      } else if (stage === 1) {
        // 切成 12 個扇形
        for (var i = 0; i < 12; i++) {
          var a0 = i * Math.PI / 6, a1 = a0 + Math.PI / 6;
          svg.appendChild(el('path', { d: pieSlice(cx, cy, R, a0, a1) },
            'fill:color-mix(in srgb, var(--accent) ' + (i % 2 ? 30 : 18) + '%, transparent);stroke:var(--accent);stroke-width:1.5'));
        }
      } else {
        // 交錯排成近似長方形
        var w = 22, n = 12;
        for (var k = 0; k < n; k++) {
          var up = k % 2 === 0;
          var x = 40 + k * w;
          svg.appendChild(el('path', {
            d: up ? 'M' + x + ',120 L' + (x + w) + ',120 L' + (x + w / 2) + ',45 Z'
                  : 'M' + x + ',45 L' + (x + w) + ',45 L' + (x + w / 2) + ',120 Z'
          }, 'fill:color-mix(in srgb, var(--accent) ' + (up ? 30 : 18) + '%, transparent);stroke:var(--accent);stroke-width:1.2'));
        }
        svg.appendChild(el('line', { x1: 40, y1: 135, x2: 40 + n * w, y2: 135 },
          'stroke:var(--bad);stroke-width:2'));
        svg.appendChild(txt(160, 148, '長 ≈ 半個圓周 ＝ π × 半徑', 'font-size:11px;fill:var(--bad)'));
        svg.appendChild(el('line', { x1: 30, y1: 45, x2: 30, y2: 120 }, 'stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(16, 82, '寬', 'font-size:11px;fill:var(--good)'));
      }
      var C = (2 * 3.14 * r).toFixed(2), A = (3.14 * r * r).toFixed(2);
      read.innerHTML = '';
      if (mode === 'circumference') {
        read.appendChild(div('wg-read-main', '圓周長 ＝ 直徑 × π ＝ ' + (r * 2) + ' × 3.14 ＝ ' + C));
        read.appendChild(div('wg-read-sub', '也可以寫成 2 × 半徑 × π。π（圓周率）約等於 3.14。'));
      } else {
        read.appendChild(div('wg-read-main', '圓面積 ＝ 半徑 × 半徑 × π ＝ ' + r + '×' + r + '×3.14 ＝ ' + A));
        read.appendChild(div('wg-read-sub',
          stage === 0 ? '按「下一步」看公式怎麼推出來的。'
          : stage === 1 ? '把圓切成很多個小扇形…'
          : '交錯排開就接近一個長方形：長 ＝ πr、寬 ＝ r → 面積 ＝ πr²'));
      }
    }
    var ctrl = div('wg-ctrl');
    if (mode === 'area') {
      ctrl.appendChild(btn('下一步 ▶', function () { stage = clamp(stage + 1, 0, 2); paint(); }));
      ctrl.appendChild(btn('重來', function () { stage = 0; paint(); }));
    }
    if (spec.edit !== false) {
      var st = stepper('半徑', function () { return r; }, function (v) { r = v; }, 1, 12, function () { st.sync(); paint(); });
      box.appendChild(st.el);
    }
    if (ctrl.childNodes.length) box.appendChild(ctrl);
    host.appendChild(box);
    paint();
  };

  /* ── 比與比值（ratiobar）──────────────────────────────────────────────
     spec: { a, b, labelA, labelB, edit }                                  */
  REG.ratiobar = function (host, spec) {
    var a = spec.a || 3, b = spec.b || 4;
    var la = spec.labelA || '甲', lb = spec.labelB || '乙';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 110', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      a = clamp(a, 1, 10); b = clamp(b, 1, 10);
      var u = Math.min(26, 260 / Math.max(a, b));
      [[a, 15, 'accent', la], [b, 60, 'good', lb]].forEach(function (row) {
        for (var i = 0; i < row[0]; i++) {
          svg.appendChild(el('rect', { x: 40 + i * u, y: row[1], width: u - 2, height: 32, rx: 3 },
            'fill:var(--' + row[2] + ')'));
        }
        svg.appendChild(txt(22, row[1] + 16, row[3], 'font-size:13px;fill:var(--dim)'));
      });
      var g = (function (x, y) { while (y) { var t = x % y; x = y; y = t; } return x; })(a, b);
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', la + ' : ' + lb + ' ＝ ' + a + ' : ' + b +
        (g > 1 ? '（最簡 ' + (a / g) + ' : ' + (b / g) + '）' : '')));
      read.appendChild(div('wg-read-sub',
        '比值 ＝ ' + a + ' ÷ ' + b + ' ＝ ' + (a / b).toFixed(2) + '　（比值是一個數，比是兩個量的關係）'));
    }
    if (spec.edit !== false) {
      var sa = stepper(la, function () { return a; }, function (v) { a = v; }, 1, 10, function () { sa.sync(); paint(); });
      var sb = stepper(lb, function () { return b; }, function (v) { b = v; }, 1, 10, function () { sb.sync(); paint(); });
      box.appendChild(sa.el); box.appendChild(sb.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 圓形圖（piechart）────────────────────────────────────────────────
     spec: { data: [{label, value}] }                                      */
  REG.piechart = function (host, spec) {
    var data = spec.data || [];
    var total = data.reduce(function (s2, d) { return s2 + d.value; }, 0) || 1;
    var COLORS = ['var(--accent)', 'var(--good)', 'var(--bad)', 'var(--dim)', 'var(--panel2)'];
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    var cx = 100, cy = 90, R = 72, a = -Math.PI / 2;
    data.forEach(function (d, i) {
      var a2 = a + d.value / total * Math.PI * 2;
      svg.appendChild(el('path', { d: pieSlice(cx, cy, R, a, a2) },
        'fill:' + COLORS[i % COLORS.length] + ';stroke:var(--bg);stroke-width:2'));
      a = a2;
    });
    data.forEach(function (d, i) {
      var y = 30 + i * 24;
      svg.appendChild(el('rect', { x: 200, y: y - 8, width: 14, height: 14, rx: 3 },
        'fill:' + COLORS[i % COLORS.length]));
      svg.appendChild(el('text', { x: 220, y: y + 4 }, 'font-size:12px;fill:var(--text)'))
        .appendChild(document.createTextNode(
          d.label + ' ' + Math.round(d.value / total * 100) + '%'));
    });
    box.appendChild(svg);
    box.appendChild(div('wg-read-sub', '圓形圖看的是「各部分佔整體的比例」，全部加起來一定是 100%。'));
    host.appendChild(box);
  };

  /* ── 資料點圖：平均數／中位數／眾數（dotplot）─────────────────────────
     spec: { values: [..] }                                                */
  REG.dotplot = function (host, spec) {
    var vals = (spec.values || [2, 3, 3, 4, 8]).slice().sort(function (x, y) { return x - y; });
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 130', class: 'wg-svg' });
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    var span = Math.max(hi - lo, 1);
    function X(v) { return 30 + (v - lo) / span * 260; }
    svg.appendChild(el('line', { x1: 20, y1: 95, x2: 305, y2: 95 }, 'stroke:var(--text);stroke-width:2'));
    var seen = {};
    vals.forEach(function (v) {
      seen[v] = (seen[v] || 0) + 1;
      svg.appendChild(el('circle', { cx: X(v), cy: 88 - (seen[v] - 1) * 15, r: 6 }, 'fill:var(--accent)'));
    });
    [lo, hi].concat(vals).filter(function (v, i, arr) { return arr.indexOf(v) === i; }).forEach(function (v) {
      svg.appendChild(txt(X(v), 110, String(v), 'font-size:11px;fill:var(--dim)'));
    });
    var sum = vals.reduce(function (s2, v) { return s2 + v; }, 0);
    var mean = sum / vals.length;
    var mid = vals.length % 2 ? vals[(vals.length - 1) / 2]
                              : (vals[vals.length / 2 - 1] + vals[vals.length / 2]) / 2;
    var best = null, bestN = 0;
    Object.keys(seen).forEach(function (k) { if (seen[k] > bestN) { bestN = seen[k]; best = k; } });
    svg.appendChild(el('line', { x1: X(mean), y1: 20, x2: X(mean), y2: 95 },
      'stroke:var(--bad);stroke-width:2;stroke-dasharray:4 3'));
    svg.appendChild(txt(X(mean), 14, '平均 ' + (+mean.toFixed(2)), 'font-size:11px;fill:var(--bad)'));
    box.appendChild(svg);
    box.appendChild(div('wg-read-main', '平均數 ' + (+mean.toFixed(2)) +
      '　中位數 ' + mid + '　眾數 ' + best));
    box.appendChild(div('wg-read-sub',
      '平均數會被極端值拉走；中位數是排序後正中間的那個；眾數是出現最多次的。'));
    host.appendChild(box);
  };

  /* ── 天平解方程式（balance）───────────────────────────────────────────
     「兩邊同加同減」為什麼可以？因為天平要保持平衡。
     spec: { a, b, c }  代表 ax + b = c                                    */
  REG.balance = function (host, spec) {
    var A = spec.a || 3, B = spec.b || 5, C = spec.c || 26;
    var step = 0;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    box.appendChild(svg);
    var note = div('wg-note');
    box.appendChild(note);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var left, right, lbl;
      if (step === 0) { left = A + 'x ＋ ' + B; right = String(C); lbl = '天平兩邊一樣重。目標：讓左邊只剩 x。'; }
      else if (step === 1) { left = A + 'x'; right = String(C - B); lbl = '兩邊同時拿掉 ' + B + '（同減），天平還是平的。'; }
      else { left = 'x'; right = String((C - B) / A); lbl = '兩邊同時除以 ' + A + '（同除），得到 x ＝ ' + ((C - B) / A) + '。'; }
      // 天平
      svg.appendChild(el('line', { x1: 30, y1: 60, x2: 290, y2: 60 }, 'stroke:var(--text);stroke-width:4'));
      svg.appendChild(el('path', { d: 'M160,60 L145,120 L175,120 Z' }, 'fill:var(--dim)'));
      [[90, left, 'accent'], [230, right, 'good']].forEach(function (p) {
        svg.appendChild(el('line', { x1: p[0], y1: 60, x2: p[0], y2: 80 }, 'stroke:var(--text);stroke-width:2'));
        svg.appendChild(el('rect', { x: p[0] - 52, y: 80, width: 104, height: 34, rx: 8 },
          'fill:color-mix(in srgb, var(--' + p[2] + ') 25%, transparent);stroke:var(--' + p[2] + ');stroke-width:2'));
        svg.appendChild(txt(p[0], 97, p[1], 'font-size:17px;font-weight:700'));
      });
      note.textContent = lbl;
      note.className = 'wg-note' + (step === 2 ? ' ok' : '');
    }
    var ctrl = div('wg-ctrl');
    ctrl.appendChild(btn('下一步 ▶', function () { step = clamp(step + 1, 0, 2); paint(); }));
    ctrl.appendChild(btn('重來', function () { step = 0; paint(); }));
    box.appendChild(ctrl);
    host.appendChild(box);
    paint();
  };

  /* ── 圓柱（cylinder）──────────────────────────────────────────────────
     spec: { r, h, mode:'volume'|'surface' }                               */
  REG.cylinder = function (host, spec) {
    var r = spec.r || 3, h = spec.h || 5;
    var mode = spec.mode || 'volume';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      r = clamp(r, 1, 8); h = clamp(h, 1, 10);
      var rx = 12 + r * 5, ry = rx * 0.34, H = 20 + h * 9;
      var cx = mode === 'surface' ? 90 : 160, cy = 145 - H;
      svg.appendChild(el('path', { d: 'M' + (cx - rx) + ',' + cy + ' L' + (cx - rx) + ',' + (cy + H) +
        ' A' + rx + ',' + ry + ' 0 0,0 ' + (cx + rx) + ',' + (cy + H) + ' L' + (cx + rx) + ',' + cy + ' Z' },
        'fill:color-mix(in srgb, var(--accent) 25%, transparent);stroke:var(--accent);stroke-width:2'));
      svg.appendChild(el('ellipse', { cx: cx, cy: cy, rx: rx, ry: ry },
        'fill:color-mix(in srgb, var(--accent) 45%, transparent);stroke:var(--accent);stroke-width:2'));
      if (mode === 'surface') {                        // 側面展開成長方形
        svg.appendChild(el('rect', { x: 175, y: cy, width: 120, height: H },
          'fill:color-mix(in srgb, var(--good) 22%, transparent);stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(235, cy + H / 2, '側面攤平', 'font-size:12px;fill:var(--good)'));
        svg.appendChild(txt(235, cy - 10, '長 ＝ 圓周長', 'font-size:11px;fill:var(--good)'));
      }
      var base = (3.14 * r * r).toFixed(2);
      read.innerHTML = '';
      if (mode === 'volume') {
        read.appendChild(div('wg-read-main', '體積 ＝ 底面積 × 高 ＝ ' + base + ' × ' + h + ' ＝ ' + (base * h).toFixed(2)));
        read.appendChild(div('wg-read-sub', '所有柱體都一樣：底面積 × 高。底面是什麼形狀都不影響這個規則。'));
      } else {
        var side = (2 * 3.14 * r * h).toFixed(2);
        read.appendChild(div('wg-read-main', '表面積 ＝ 兩個底 ＋ 側面 ＝ ' + (base * 2).toFixed(2) + ' ＋ ' + side));
        read.appendChild(div('wg-read-sub', '側面攤平是長方形：長＝底面圓周長、寬＝高。'));
      }
    }
    if (spec.edit !== false) {
      var sr = stepper('半徑', function () { return r; }, function (v) { r = v; }, 1, 8, function () { sr.sync(); paint(); });
      var sh = stepper('高', function () { return h; }, function (v) { h = v; }, 1, 10, function () { sh.sync(); paint(); });
      box.appendChild(sr.el); box.appendChild(sh.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 十格框（tenframe）─────────────────────────────────────────────────
     低年級數感的基本教具：一排 5 格、兩排共 10 格。點格子加減，
     一眼看出「幾就是 5 和幾」「離 10 還差幾」。
     spec: { n, frames（1 或 2，預設看 n 決定）, edit }                     */
  REG.tenframe = function (host, spec) {
    var frames = spec.frames || ((spec.n || 0) > 10 ? 2 : 1);
    var cap = frames * 10;
    var n = clamp(spec.n == null ? 7 : spec.n, 0, cap);
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 ' + (frames * 70 + 10), class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var cw = 30, x0 = 25;
      for (var f = 0; f < frames; f++) {
        var y0 = 10 + f * 70;
        for (var i = 0; i < 10; i++) {
          var cx = x0 + (i % 5) * cw, cy = y0 + Math.floor(i / 5) * cw;
          var idx = f * 10 + i;
          svg.appendChild(el('rect', { x: cx, y: cy, width: cw, height: cw },
            'fill:var(--panel2);stroke:var(--border);stroke-width:1.5'));
          if (idx < n) {
            svg.appendChild(el('circle', { cx: cx + cw / 2, cy: cy + cw / 2, r: 10 },
              'fill:' + (idx < 5 || (f === 1 && idx < 15) ? 'var(--accent)' : 'var(--good)')));
          }
        }
        svg.appendChild(el('rect', { x: x0, y: y0, width: cw * 5, height: cw * 2 },
          'fill:none;stroke:var(--text);stroke-width:2.5'));
      }
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', '目前 ' + n + ' 個'));
      var sub;
      if (n <= 10) {
        sub = n >= 5 ? n + ' ＝ 5 ＋ ' + (n - 5) + '，離 10 還差 ' + (10 - n) + ' 個'
                     : n + ' 個，離 5 還差 ' + (5 - n) + '、離 10 還差 ' + (10 - n) + ' 個';
      } else {
        sub = n + ' ＝ 10 ＋ ' + (n - 10) + '（一個滿的十格框加 ' + (n - 10) + ' 個）';
      }
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.edit !== false) {
      var st = stepper('幾個', function () { return n; }, function (v) { n = v; }, 0, cap,
        function () { st.sync(); paint(); });
      box.appendChild(st.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 數的合成分解（numbond）───────────────────────────────────────────
     上面一個總數，下面兩個部分。拉滑桿改變其中一部分，另一部分自動配。
     看得出「10 可以拆成 1和9、2和8…」，也就是加減互逆的起點。
     spec: { whole, part, edit }                                           */
  REG.numbond = function (host, spec) {
    var whole = spec.whole || 10;
    var part = clamp(spec.part == null ? 4 : spec.part, 0, whole);
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function bubble(cx, cy, r, text, color) {
      // ⚠️ 不要寫 'fill:var(--x)22' 這種帶透明度後綴的寫法——CSS 變數不能這樣接 alpha，
      // 整條宣告會失效變成黑色，淺色主題就看不到字了。要淡色就用 fill-opacity。
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, 'fill-opacity': '.15' },
        'fill:' + color + ';stroke:' + color + ';stroke-width:2.5'));
      svg.appendChild(txt(cx, cy + 7, String(text), 'fill:' + color + ';font-size:22px;font-weight:700;text-anchor:middle'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var other = whole - part;
      svg.appendChild(el('line', { x1: 160, y1: 55, x2: 90, y2: 105 }, 'stroke:var(--border);stroke-width:3'));
      svg.appendChild(el('line', { x1: 160, y1: 55, x2: 230, y2: 105 }, 'stroke:var(--border);stroke-width:3'));
      bubble(160, 40, 30, whole, 'var(--text)');
      bubble(90, 125, 28, part, 'var(--accent)');
      bubble(230, 125, 28, other, 'var(--good)');
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', whole + ' ＝ ' + part + ' ＋ ' + other));
      read.appendChild(div('wg-read-sub',
        '反過來也成立：' + whole + ' − ' + part + ' ＝ ' + other + '、' +
        whole + ' − ' + other + ' ＝ ' + part + '（加法和減法是一體兩面）'));
    }
    if (spec.edit !== false) {
      var sp = stepper('左邊幾個', function () { return part; }, function (v) { part = v; }, 0, whole,
        function () { sp.sync(); paint(); });
      box.appendChild(sp.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 數個數（counters）────────────────────────────────────────────────
     一堆東西，可以選擇「幾個一數」把它們框起來，看出跳著數比一個一個數快。
     spec: { n, group, edit }                                              */
  REG.counters = function (host, spec) {
    var n = clamp(spec.n == null ? 12 : spec.n, 1, 40);
    var group = clamp(spec.group == null ? 5 : spec.group, 1, 10);
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var per = 10, r = 9;
      for (var i = 0; i < n; i++) {
        var cx = 20 + (i % per) * 29, cy = 24 + Math.floor(i / per) * 30;
        var full = Math.floor(i / group) % 2 === 0;
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: r },
          'fill:' + (full ? 'var(--accent)' : 'var(--good)')));
        if ((i + 1) % group === 0 || i === n - 1) {
          svg.appendChild(txt(cx, cy + 24, String(i + 1),
            'fill:var(--dim);font-size:11px;text-anchor:middle'));
        }
      }
      var q = Math.floor(n / group), rem = n % group;
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', '總共 ' + n + ' 個'));
      read.appendChild(div('wg-read-sub', group === 1
        ? '一個一個數：1、2、3…' + n + '，慢但不會錯'
        : group + ' 個一數：' + Array.from({ length: q }, function (_, k) { return (k + 1) * group; }).join('、') +
          (rem ? '，再加 ' + rem + ' 個 → ' + n : ' → ' + n) + '（跳著數比較快）'));
    }
    if (spec.edit !== false) {
      var sn = stepper('總共幾個', function () { return n; }, function (v) { n = v; }, 1, 40,
        function () { sn.sync(); paint(); });
      var sg = stepper('幾個一數', function () { return group; }, function (v) { group = v; }, 1, 10,
        function () { sg.sync(); paint(); });
      box.appendChild(sn.el); box.appendChild(sg.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 比長短／比高矮（compare）─────────────────────────────────────────
     兩條（或三條）長度不同的東西並排，對齊同一個起點才能比。
     spec: { items: [{label, len}], vertical, align（false = 故意不對齊）}  */
  REG.compare = function (host, spec) {
    var items = spec.items || [{ label: '甲', len: 6 }, { label: '乙', len: 9 }];
    var align = spec.align !== false;
    var vertical = !!spec.vertical;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var max = 0;
      items.forEach(function (it) { if (it.len > max) max = it.len; });
      var cols = ['var(--accent)', 'var(--good)', 'var(--bad)'];
      if (vertical) {
        items.forEach(function (it, i) {
          var h = it.len / max * 100;
          var x = 50 + i * 80, base = align ? 125 : 125 - i * 12;
          svg.appendChild(el('rect', { x: x, y: base - h, width: 40, height: h, rx: 4 },
            'fill:' + cols[i % 3] + ';opacity:.85'));
          svg.appendChild(txt(x + 20, base + 16, it.label, 'fill:var(--dim);font-size:13px;text-anchor:middle'));
        });
        svg.appendChild(el('line', { x1: 20, y1: 125, x2: 300, y2: 125 },
          'stroke:var(--border);stroke-width:2' + (align ? '' : ';stroke-dasharray:5 4')));
      } else {
        items.forEach(function (it, i) {
          var w = it.len / max * 220;
          var y = 30 + i * 42, x = align ? 60 : 60 + i * 20;
          svg.appendChild(el('rect', { x: x, y: y, width: w, height: 24, rx: 4 },
            'fill:' + cols[i % 3] + ';opacity:.85'));
          svg.appendChild(txt(x - 8, y + 17, it.label, 'fill:var(--dim);font-size:13px;text-anchor:end'));
        });
        svg.appendChild(el('line', { x1: 60, y1: 18, x2: 60, y2: 30 + items.length * 42 },
          'stroke:var(--border);stroke-width:2' + (align ? '' : ';stroke-dasharray:5 4')));
      }
      var sorted = items.slice().sort(function (a, b) { return b.len - a.len; });
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', sorted[0].label + ' 最' + (vertical ? '高' : '長')));
      read.appendChild(div('wg-read-sub', align
        ? '起點對齊了，直接看誰伸得比較遠就知道'
        : '⚠️ 起點沒有對齊，這樣比會看錯——比長短一定要從同一條線開始'));
    }
    host.appendChild(box);
    paint();
  };

  /* ── 正負籌碼（intchips）─────────────────────────────────────────────
     正 1 和負 1 配成一對就互相抵消，剩下的就是答案。
     整數加減最直觀的模型：(-5) + 3 為什麼是 -2，看得到。
     spec: { a, b, edit }                                                  */
  REG.intchips = function (host, spec) {
    var a = spec.a == null ? -5 : spec.a, b = spec.b == null ? 3 : spec.b;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 160', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function chip(cx, cy, pos, dim) {
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: 11, 'fill-opacity': dim ? '.18' : '.85' },
        'fill:' + (pos ? 'var(--good)' : 'var(--bad)') +
        ';stroke:' + (pos ? 'var(--good)' : 'var(--bad)') + ';stroke-width:2'));
      svg.appendChild(txt(cx, cy + 5, pos ? '＋' : '−',
        'fill:' + (dim ? 'var(--dim)' : 'var(--text)') + ';font-size:13px;font-weight:700;text-anchor:middle'));
    }
    function row(vals, y, label) {
      svg.appendChild(txt(20, y + 5, label, 'fill:var(--dim);font-size:12px'));
      var n = Math.abs(vals), pos = vals >= 0;
      for (var i = 0; i < n && i < 10; i++) chip(72 + i * 24, y, pos, false);
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      a = clamp(a, -9, 9); b = clamp(b, -9, 9);
      row(a, 26, (a < 0 ? '(' + a + ')' : '＋' + a));
      row(b, 62, (b < 0 ? '(' + b + ')' : '＋' + b));
      // 抵消後剩下的
      var sum = a + b, cancel = Math.min(Math.abs(a), Math.abs(b));
      var mixed = (a < 0) !== (b < 0);
      svg.appendChild(el('line', { x1: 12, y1: 84, x2: 308, y2: 84 }, 'stroke:var(--border);stroke-width:1.5'));
      svg.appendChild(txt(20, 115, '結果', 'fill:var(--dim);font-size:12px'));
      var n2 = Math.abs(sum);
      for (var j = 0; j < n2 && j < 10; j++) chip(72 + j * 24, 110, sum >= 0, false);
      if (!n2) svg.appendChild(txt(72, 115, '0（全部抵消）', 'fill:var(--dim);font-size:13px'));
      read.innerHTML = '';
      read.appendChild(div('wg-read-main',
        '(' + a + ') ＋ (' + b + ') ＝ ' + sum));
      read.appendChild(div('wg-read-sub', mixed && cancel
        ? '一正一負配成 ' + cancel + ' 對，互相抵消變成 0，剩下 ' + (sum === 0 ? '0' : sum) + '（誰的絕對值大就跟誰同號）'
        : '同號相加，個數直接相加，符號不變'));
    }
    if (spec.edit !== false) {
      var sa = stepper('第一個數', function () { return a; }, function (v) { a = v; }, -9, 9,
        function () { sa.sync(); paint(); });
      var sb = stepper('第二個數', function () { return b; }, function (v) { b = v; }, -9, 9,
        function () { sb.sync(); paint(); });
      box.appendChild(sa.el); box.appendChild(sb.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 質因數分解與公因倍數（primefac）─────────────────────────────────
     一個數 → 質因數連乘；兩個數 → 共同的部分是最大公因數，
     全部湊起來是最小公倍數。
     spec: { n, m, edit }（只給 n 就只做分解）                              */
  REG.primefac = function (host, spec) {
    var n = clamp(spec.n == null ? 12 : spec.n, 2, 200);
    var m = spec.m == null ? 0 : clamp(spec.m, 0, 200);
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 140', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function fac(x) {
      var r = [], d = 2;
      while (d * d <= x) { while (x % d === 0) { r.push(d); x /= d; } d++; }
      if (x > 1) r.push(x);
      return r;
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var fn = fac(n), fm = m >= 2 ? fac(m) : null;
      function drawRow(label, arr, y, common) {
        // 右對齊：三位數的標籤才不會被畫布左邊切掉
        svg.appendChild(txt(60, y + 5, label, 'fill:var(--dim);font-size:12px;text-anchor:end'));
        var x = 66;
        // ⚠️ 逐「個」配對，不是逐「值」：12 = 2×2×3 和 18 = 2×3×3 的共同部分是
        // 一個 2 和一個 3，多出來的那個 2、那個 3 不能也標綠（否則 GCD 會被看成 36）
        var pool = common ? common.slice() : null;
        arr.forEach(function (p, i) {
          var isC = false;
          if (pool) { var pi = pool.indexOf(p); if (pi >= 0) { pool.splice(pi, 1); isC = true; } }
          var w = String(p).length > 1 ? 32 : 26;
          svg.appendChild(el('rect', { x: x, y: y - 14, width: w, height: 28, rx: 6, 'fill-opacity': '.18' },
            'fill:' + (isC ? 'var(--good)' : 'var(--accent)') +
            ';stroke:' + (isC ? 'var(--good)' : 'var(--accent)') + ';stroke-width:2'));
          svg.appendChild(txt(x + w / 2, y + 5, String(p),
            'fill:var(--text);font-size:14px;font-weight:700;text-anchor:middle'));
          x += w + 6;
          if (i < arr.length - 1) { svg.appendChild(txt(x - 3, y + 5, '×', 'fill:var(--dim);font-size:12px;text-anchor:middle')); x += 6; }
        });
      }
      if (!fm) {
        drawRow(n + ' ＝', fn, 50, null);
        read.innerHTML = '';
        read.appendChild(div('wg-read-main', n + ' ＝ ' + fn.join(' × ')));
        read.appendChild(div('wg-read-sub',
          '把一個數一直拆到只剩質數為止，這叫質因數分解。每個數的分解結果是唯一的。'));
        return;
      }
      // 共同質因數（取次數較少的那個）
      var ca = fn.slice(), common = [], lcm = fn.slice();
      fm.forEach(function (p) {
        var i = ca.indexOf(p);
        if (i >= 0) { common.push(p); ca.splice(i, 1); }
        else lcm.push(p);
      });
      drawRow(n + ' ＝', fn, 34, common);
      drawRow(m + ' ＝', fm, 78, common);
      var g = common.reduce(function (x, y) { return x * y; }, 1);
      var l = lcm.reduce(function (x, y) { return x * y; }, 1);
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', '最大公因數 ' + g + '　最小公倍數 ' + l));
      read.appendChild(div('wg-read-sub',
        '綠色是兩邊「共同」的質因數，乘起來就是最大公因數（' +
        (common.length ? common.join(' × ') + ' ＝ ' + g : '沒有共同質因數，所以是 1') +
        '）；把兩邊的質因數不重複地全湊起來，就是最小公倍數 ' + l + '。'));
    }
    if (spec.edit !== false) {
      var lo = 2, hi = 100;
      var sn = stepper('第一個數', function () { return n; }, function (v) { n = v; }, lo, hi,
        function () { sn.sync(); paint(); });
      box.appendChild(sn.el);
      if (m >= 2) {
        var sm = stepper('第二個數', function () { return m; }, function (v) { m = v; }, lo, hi,
          function () { sm.sync(); paint(); });
        box.appendChild(sm.el);
      }
    }
    host.appendChild(box);
    paint();
  };

  /* ── 代數磚（algetile）───────────────────────────────────────────────
     長條＝x、小方塊＝1。同一種才能合併，這就是「同類項」。
     spec: { x, c, x2, c2, mode: 'collect' | 'distribute', k }             */
  REG.algetile = function (host, spec) {
    var mode = spec.mode === 'distribute' ? 'distribute' : 'collect';
    var x1 = spec.x == null ? 2 : spec.x, c1 = spec.c == null ? 3 : spec.c;
    var x2 = spec.x2 == null ? 1 : spec.x2, c2 = spec.c2 == null ? 2 : spec.c2;
    var k = spec.k == null ? 3 : spec.k;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 160', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    // 磚的寬度依數量自動縮放，展開成 6x+3 時才不會衝出畫布右邊
    function tiles(nx, nc, y, label) {
      svg.appendChild(txt(20, y + 5, label, 'fill:var(--dim);font-size:12px'));
      var x0 = 70, right = 314, avail = right - x0;
      var need = nx * 39 + (nx ? 8 : 0) + nc * 24;
      var k = need > avail ? avail / need : 1;
      var xw = 34 * k, xg = 39 * k, cw = 20 * k, cg = 24 * k;
      var x = x0;
      for (var i = 0; i < nx; i++) {
        svg.appendChild(el('rect', { x: x, y: y - 12, width: xw, height: 24, rx: 4, 'fill-opacity': '.2' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(txt(x + xw / 2, y + 5, 'x',
          'fill:var(--text);font-size:13px;font-style:italic;text-anchor:middle'));
        x += xg;
      }
      x += nx ? 8 * k : 0;
      for (var j = 0; j < nc; j++) {
        svg.appendChild(el('rect', { x: x, y: y - 10, width: cw, height: 20, rx: 4, 'fill-opacity': '.2' },
          'fill:var(--good);stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(x + cw / 2, y + 5, '1', 'fill:var(--text);font-size:12px;text-anchor:middle'));
        x += cg;
      }
    }
    function term(nx, nc) {
      var s = [];
      if (nx) s.push((nx === 1 ? '' : nx) + 'x');
      if (nc) s.push(String(nc));
      return s.join(' ＋ ') || '0';
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      if (mode === 'collect') {
        tiles(x1, c1, 30, term(x1, c1));
        tiles(x2, c2, 72, term(x2, c2));
        svg.appendChild(el('line', { x1: 12, y1: 96, x2: 308, y2: 96 }, 'stroke:var(--border);stroke-width:1.5'));
        tiles(x1 + x2, c1 + c2, 124, '合併');
        read.appendChild(div('wg-read-main',
          '(' + term(x1, c1) + ') ＋ (' + term(x2, c2) + ') ＝ ' + term(x1 + x2, c1 + c2)));
        read.appendChild(div('wg-read-sub',
          '長條只能和長條合併、小方塊只能和小方塊合併——這就是「同類項才能合併」。' +
          'x 和 1 是不同的東西，' + (x1 + x2) + 'x 和 ' + (c1 + c2) + ' 不能再併成一項。'));
      } else {
        tiles(x1, c1, 34, term(x1, c1));
        svg.appendChild(txt(20, 76, '×' + k, 'fill:var(--dim);font-size:12px'));
        svg.appendChild(el('line', { x1: 12, y1: 92, x2: 308, y2: 92 }, 'stroke:var(--border);stroke-width:1.5'));
        tiles(x1 * k, c1 * k, 124, '展開');
        read.appendChild(div('wg-read-main',
          k + '(' + term(x1, c1) + ') ＝ ' + term(x1 * k, c1 * k)));
        read.appendChild(div('wg-read-sub',
          '括號外的 ' + k + ' 要乘進去給「每一項」——' + k + ' 組相同的磚，長條變 ' +
          (x1 * k) + ' 條、小方塊變 ' + (c1 * k) + ' 個。只乘第一項是最常見的錯。'));
      }
    }
    if (spec.edit !== false) {
      var sx = stepper('x 的個數', function () { return x1; }, function (v) { x1 = v; }, 0, 5,
        function () { sx.sync(); paint(); });
      var sc = stepper('1 的個數', function () { return c1; }, function (v) { c1 = v; }, 0, 6,
        function () { sc.sync(); paint(); });
      box.appendChild(sx.el); box.appendChild(sc.el);
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
