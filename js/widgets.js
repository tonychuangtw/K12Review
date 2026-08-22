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

  /* ══════════════════════════════════════════════════════════════════════
     以下是自然科用的元件（2026-08-22 起）。原則和數學科一樣：
     一個元件服務多個單元、只用 SVG 與原生事件、顏色走 CSS 變數。
     ══════════════════════════════════════════════════════════════════════ */

  /* ── 光的現象（optics）────────────────────────────────────────────────
     spec: { mode:'straight'|'mirror'|'refract'|'color', pick }           */
  REG.optics = function (host, spec) {
    var mode = spec.mode || 'straight';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function ray(x1, y1, x2, y2, color, dash) {
      svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2 },
        'stroke:var(--' + color + ');stroke-width:2.5' + (dash ? ';stroke-dasharray:5 4' : '')));
      var ang = Math.atan2(y2 - y1, x2 - x1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      svg.appendChild(el('polygon', { points:
        mx + ',' + my + ' ' + (mx - 9 * Math.cos(ang - 0.4)) + ',' + (my - 9 * Math.sin(ang - 0.4)) +
        ' ' + (mx - 9 * Math.cos(ang + 0.4)) + ',' + (my - 9 * Math.sin(ang + 0.4)) },
        'fill:var(--' + color + ')'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'mirror') {
        svg.appendChild(el('line', { x1: 30, y1: 110, x2: 290, y2: 110 },
          'stroke:var(--text);stroke-width:4'));
        svg.appendChild(txt(60, 124, '平面鏡', 'font-size:11px;fill:var(--dim)'));
        svg.appendChild(el('line', { x1: 160, y1: 110, x2: 160, y2: 30 },
          'stroke:var(--dim);stroke-width:1.5;stroke-dasharray:4 3'));
        svg.appendChild(txt(160, 22, '法線', 'font-size:10px;fill:var(--dim)'));
        ray(70, 40, 160, 110, 'accent');
        ray(160, 110, 250, 40, 'good');
        svg.appendChild(txt(140, 70, '入射角', 'font-size:10px;fill:var(--accent)'));
        svg.appendChild(txt(186, 70, '反射角', 'font-size:10px;fill:var(--good)'));
        svg.appendChild(el('circle', { cx: 250, cy: 150, r: 5 }, 'fill:var(--bad)'));
        svg.appendChild(txt(250, 166, '眼睛', 'font-size:10px;fill:var(--bad)'));
        main = '反射定律：入射角 ＝ 反射角';
        sub = '光碰到鏡面會「照原本的角度彈回去」。鏡中的像和物體到鏡面的距離相等、左右相反、' +
          '大小一樣——那是眼睛把反射光「延長回去」看到的虛像，鏡子後面其實沒有東西。';
      } else if (mode === 'refract') {
        svg.appendChild(el('rect', { x: 30, y: 100, width: 260, height: 66, rx: 4, 'fill-opacity': '.2' },
          'fill:var(--accent);stroke:var(--accent)'));
        svg.appendChild(txt(60, 130, '水', 'font-size:12px;fill:var(--accent)'));
        svg.appendChild(el('line', { x1: 160, y1: 100, x2: 160, y2: 30 },
          'stroke:var(--dim);stroke-width:1.5;stroke-dasharray:4 3'));
        ray(80, 30, 160, 100, 'good');
        ray(160, 100, 210, 166, 'good');
        ray(160, 100, 240, 166, 'dim', true);
        svg.appendChild(txt(258, 160, '原本的方向', 'font-size:10px;fill:var(--dim)'));
        main = '折射：光從空氣進入水中會轉彎';
        sub = '光在不同介質裡「跑的速度」不一樣，交界處就會偏折。' +
          '所以水中的筷子看起來斷掉、碗底的硬幣加了水又看得見、水池看起來比實際淺。' +
          '⚠ 折射改變的是方向，光本身沒有被吸收。';
      } else if (mode === 'color') {
        var COLS = ['bad', 'accent', 'good'];
        ['紅光', '綠光', '藍光'].forEach(function (n, i) {
          svg.appendChild(el('rect', { x: 24 + i * 98, y: 30, width: 84, height: 44, rx: 8,
            'fill-opacity': '.3' }, 'fill:var(--' + COLS[i] + ');stroke:var(--' + COLS[i] + ')'));
          svg.appendChild(txt(66 + i * 98, 52, n, 'font-size:12px'));
        });
        svg.appendChild(el('rect', { x: 110, y: 96, width: 100, height: 44, rx: 6 },
          'fill:#fff;stroke:var(--border);stroke-width:2'));
        svg.appendChild(txt(160, 118, '白紙', 'font-size:12px;fill:#111'));
        svg.appendChild(txt(160, 160, '白色物體會把照到它的光「全部反射」',
          'font-size:10px;fill:var(--dim)'));
        main = '物體的顏色 ＝ 它反射出來的光';
        sub = '白色物體反射所有色光，所以在紅光下看起來是紅的、在藍光下是藍的。' +
          '紅色物體只反射紅光、吸收其他色光，所以在只有綠光的房間裡會看起來是黑的。' +
          '黑色物體幾乎把光全吸收了，所以照什麼光都是黑的。';
      } else {
        ray(24, 40, 300, 40, 'accent');
        svg.appendChild(el('rect', { x: 150, y: 60, width: 20, height: 60, rx: 2 },
          'fill:var(--text)'));
        svg.appendChild(txt(160, 132, '不透明物體', 'font-size:10px;fill:var(--dim)'));
        ray(24, 90, 150, 90, 'accent');
        svg.appendChild(el('rect', { x: 170, y: 78, width: 130, height: 24, 'fill-opacity': '.35' },
          'fill:var(--dim)'));
        svg.appendChild(txt(240, 92, '影子', 'font-size:11px;fill:var(--dim)'));
        main = '光沿著直線前進';
        sub = '因為光走直線，被物體擋住的地方就形成影子——影子的形狀和物體輪廓一樣。' +
          '日食、月食、針孔成像、雷射筆的光束，都是「光走直線」最直接的證據。' +
          '光源越靠近物體，影子越大。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['straight', '直線前進'], ['mirror', '反射'], ['refract', '折射'], ['color', '色光']]
        .forEach(function (m) { row.appendChild(btn(m[1], function () { mode = m[0]; paint(); })); });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 月相（moonphase）─────────────────────────────────────────────────
     spec: { day }  農曆日（1～30）                                       */
  REG.moonphase = function (host, spec) {
    var day = spec.day == null ? 15 : spec.day;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var NAMES = [[1, '新月（朔）'], [4, '眉月'], [8, '上弦月'], [12, '盈凸月'],
                 [15, '滿月（望）'], [19, '虧凸月'], [23, '下弦月'], [27, '殘月']];
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var cx = 160, cy = 74, R = 50;
      // 相位 0=新月、0.5=滿月
      var ph = ((day - 1) % 29.5) / 29.5;
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: R },
        'fill:var(--panel2);stroke:var(--border);stroke-width:2'));
      // 亮面＝一段半圓弧 ＋ 一段半橢圓弧（分界線叫明暗界線 terminator）
      // k ＝ cos(2πph)：＋1 是新月（全暗）、0 是半月、−1 是滿月（全亮）
      var k = Math.cos(2 * Math.PI * ph);
      var rx = Math.abs(k) * R;
      var wax = ph < 0.5;                            // 上半月：亮面在右邊
      var d = 'M' + cx + ',' + (cy - R) +
        ' A ' + R + ' ' + R + ' 0 0 ' + (wax ? 1 : 0) + ' ' + cx + ',' + (cy + R) +
        ' A ' + rx + ' ' + R + ' 0 0 ' + (k > 0 ? (wax ? 0 : 1) : (wax ? 1 : 0)) + ' ' +
        cx + ',' + (cy - R) + ' Z';
      svg.appendChild(el('path', { d: d }, 'fill:#f5e9a9;stroke:none'));
      var name = NAMES.reduce(function (best, n) {
        return Math.abs(n[0] - day) < Math.abs(best[0] - day) ? n : best;
      }, NAMES[0]);
      svg.appendChild(txt(cx, 148, '農曆約 ' + day + ' 日', 'font-size:11px;fill:var(--dim)'));
      read.appendChild(div('wg-read-main', name[1]));
      read.appendChild(div('wg-read-sub',
        '月亮自己不會發光，我們看到的是它「被太陽照亮」的那一面。' +
        '月球繞地球轉，我們看到的亮面比例就跟著變，大約 29.5 天循環一次（農曆一個月）。' +
        '初一看不到（新月）、初七八半個（上弦）、十五最圓（滿月）、廿二三又剩半個（下弦）。' +
        '⚠ 月相不是地球的影子造成的——那是月食，一年只有幾次。'));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [1, 8, 15, 23].forEach(function (d) {
        row.appendChild(btn('初' + (d === 1 ? '一' : d === 8 ? '八' : d === 15 ? '十五' : '廿三'),
          function () { day = d; paint(); }));
      });
      box.appendChild(row);
      var r2 = div('wg-ctrl');
      r2.appendChild(slider(1, 29, day, 1, function (v) { day = v; paint(); }));
      box.appendChild(r2);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 地球、太陽與四季（earthsun）──────────────────────────────────────
     spec: { mode:'day'|'season'|'shadow', season:'summer'|'winter', pick } */
  REG.earthsun = function (host, spec) {
    var mode = spec.mode || 'day';
    var season = spec.season || 'summer';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'season') {
        svg.appendChild(el('ellipse', { cx: 160, cy: 96, rx: 130, ry: 58 },
          'fill:none;stroke:var(--border);stroke-width:1.5;stroke-dasharray:5 4'));
        svg.appendChild(el('circle', { cx: 160, cy: 96, r: 18 }, 'fill:#f5c451'));
        svg.appendChild(txt(160, 96, '太陽', 'font-size:10px;fill:#111'));
        [['夏至', 30, 96], ['冬至', 290, 96], ['春分', 160, 38], ['秋分', 160, 154]]
          .forEach(function (p) {
            svg.appendChild(el('circle', { cx: p[1], cy: p[2], r: 9 }, 'fill:var(--accent)'));
            svg.appendChild(txt(p[1], p[2] - 18, p[0], 'font-size:10px;fill:var(--dim)'));
          });
        main = '四季的成因：地軸傾斜，不是遠近';
        sub = '地球繞太陽公轉一圈約 365 天。地軸固定傾斜 23.5°，所以一年之中太陽直射的位置在南北移動：' +
          '直射北半球時我們是夏天（陽光角度直、日照時間長），直射南半球時是冬天。' +
          '⚠ 常見誤解：「夏天是因為離太陽比較近」——其實地球在 1 月離太陽最近，那時北半球是冬天。';
      } else if (mode === 'shadow') {
        svg.appendChild(el('line', { x1: 20, y1: 150, x2: 300, y2: 150 },
          'stroke:var(--text);stroke-width:2'));
        var sunX = season === 'summer' ? 160 : 90, sunY = season === 'summer' ? 34 : 74;
        svg.appendChild(el('circle', { cx: sunX, cy: sunY, r: 14 }, 'fill:#f5c451'));
        svg.appendChild(el('line', { x1: 200, y1: 150, x2: 200, y2: 96 },
          'stroke:var(--accent);stroke-width:4'));
        svg.appendChild(txt(212, 120, '竿', 'font-size:11px;fill:var(--accent)'));
        var shLen = season === 'summer' ? 26 : 86;
        svg.appendChild(el('rect', { x: 200, y: 146, width: shLen, height: 8, 'fill-opacity': '.5' },
          'fill:var(--dim)'));
        svg.appendChild(el('line', { x1: sunX, y1: sunY + 14, x2: 200, y2: 96 },
          'stroke:#f5c451;stroke-width:1.5;stroke-dasharray:4 3'));
        svg.appendChild(txt(200 + shLen + 22, 152, '影子', 'font-size:10px;fill:var(--dim)'));
        main = season === 'summer' ? '夏天：太陽角度高 → 影子短' : '冬天：太陽角度低 → 影子長';
        sub = '同一根竿子，正午的影子長度會隨季節變：夏至最短、冬至最長。' +
          '因為太陽的仰角不同——角度越高，影子越短。' +
          '一天之中也一樣：正午影子最短，早上和傍晚最長。' +
          '在臺灣（北半球），上午影子朝西北、正午朝北、下午朝東北。';
      } else {
        svg.appendChild(el('circle', { cx: 66, cy: 96, r: 24 }, 'fill:#f5c451'));
        svg.appendChild(txt(66, 96, '太陽', 'font-size:10px;fill:#111'));
        svg.appendChild(el('circle', { cx: 210, cy: 96, r: 40 },
          'fill:var(--panel2);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(el('path', { d: 'M210,56 A 40 40 0 0 0 210,136 Z' },
          'fill:var(--dim);fill-opacity:.55'));
        svg.appendChild(el('path', { d: 'M210,56 A 40 40 0 0 1 210,136 Z' },
          'fill:#f5e9a9;fill-opacity:.6'));
        svg.appendChild(txt(186, 96, '夜', 'font-size:11px;fill:var(--dim)'));
        svg.appendChild(txt(236, 96, '晝', 'font-size:11px;fill:#111'));
        svg.appendChild(el('path', { d: 'M210,42 A 46 46 0 0 1 256,88' },
          'fill:none;stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(262, 44, '自轉', 'font-size:10px;fill:var(--good)'));
        main = '自轉造成晝夜：一圈約 24 小時';
        sub = '地球自己轉一圈約 24 小時（自轉），面向太陽的那半邊是白天、背對的是黑夜。' +
          '⚠ 太陽並沒有繞著我們跑：太陽「東升西落」是地球由西向東自轉造成的相對運動。' +
          '另外，地球繞太陽公轉一圈約 365 天，那是「一年」而不是「一天」。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      row.appendChild(btn('自轉與晝夜', function () { mode = 'day'; paint(); }));
      row.appendChild(btn('公轉與四季', function () { mode = 'season'; paint(); }));
      row.appendChild(btn('夏天的竿影', function () { mode = 'shadow'; season = 'summer'; paint(); }));
      row.appendChild(btn('冬天的竿影', function () { mode = 'shadow'; season = 'winter'; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 聲音（soundwave）─────────────────────────────────────────────────
     振幅＝音量、頻率＝音高，兩個一起畫最好懂。
     spec: { amp, freq, edit }                                            */
  REG.soundwave = function (host, spec) {
    var amp = spec.amp == null ? 2 : spec.amp, freq = spec.freq == null ? 2 : spec.freq;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 168', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var MID = 74, L = 24, R = 300;
      svg.appendChild(el('line', { x1: L, y1: MID, x2: R, y2: MID },
        'stroke:var(--dim);stroke-width:1.5;stroke-dasharray:4 3'));
      var pts = [], i, x;
      for (i = 0; i <= 300; i++) {
        x = i / 300;
        pts.push((L + (R - L) * x).toFixed(1) + ',' +
          (MID - amp * 16 * Math.sin(freq * 2 * Math.PI * x)).toFixed(1));
      }
      svg.appendChild(el('polyline', { points: pts.join(' ') },
        'fill:none;stroke:var(--accent);stroke-width:3'));
      svg.appendChild(el('line', { x1: 40, y1: MID, x2: 40, y2: MID - amp * 16 },
        'stroke:var(--good);stroke-width:2'));
      svg.appendChild(txt(64, MID - amp * 8, '振幅', 'font-size:10px;fill:var(--good)'));
      svg.appendChild(txt(160, 158, '一秒內振動 ' + freq + ' 次（頻率）',
        'font-size:11px;fill:var(--dim)'));
      read.appendChild(div('wg-read-main',
        '振幅 ' + (amp >= 3 ? '大 → 聲音大' : amp <= 1 ? '小 → 聲音小' : '中等') +
        '　頻率 ' + (freq >= 3 ? '高 → 聲音尖（高音）' : freq <= 1 ? '低 → 聲音低沉' : '中等')));
      read.appendChild(div('wg-read-sub',
        '聲音是物體「振動」產生的，靠空氣（或水、固體）傳出去——真空中沒有介質，所以聽不到聲音。' +
        '振幅決定音量（振動幅度大＝大聲）、頻率決定音高（振動快＝高音）。' +
        '敲裝水的杯子：水越少越容易振動、頻率越高，聲音越尖。'));
    }
    if (spec.edit !== false) {
      var sa = stepper('振幅（音量）', function () { return amp; }, function (v) { amp = v; }, 1, 4,
        function () { sa.sync(); paint(); });
      var sf = stepper('頻率（音高）', function () { return freq; }, function (v) { freq = v; }, 1, 5,
        function () { sf.sync(); paint(); });
      box.appendChild(sa.el); box.appendChild(sf.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 對照實驗（compareexp）────────────────────────────────────────────
     只改一個變因、其他都一樣——這是自然科實驗設計的核心。
     spec: { title, factor, a:{label,note}, b:{label,note}, same:[..], result } */
  REG.compareexp = function (host, spec) {
    var A = spec.a || { label: '甲：有水有空氣', note: '會生鏽' };
    var B = spec.b || { label: '乙：有水沒空氣', note: '不生鏽' };
    var same = spec.same || ['鐵釘一樣', '水量一樣', '放同樣久'];
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 160', class: 'wg-svg' });
    [[16, A, 'accent'], [168, B, 'good']].forEach(function (col) {
      svg.appendChild(el('rect', { x: col[0], y: 18, width: 136, height: 96, rx: 10,
        'fill-opacity': '.16' }, 'fill:var(--' + col[2] + ');stroke:var(--' + col[2] + ');stroke-width:2'));
      svg.appendChild(txt(col[0] + 68, 44, col[1].label, 'font-size:11px;font-weight:700'));
      svg.appendChild(txt(col[0] + 68, 82, col[1].note, 'font-size:13px;fill:var(--' + col[2] + ')'));
    });
    svg.appendChild(txt(160, 134, '其他條件全部相同：' + same.join('、'),
      'font-size:10px;fill:var(--dim)'));
    box.appendChild(svg);
    box.appendChild(div('wg-read-main', '只改變一個條件：' + (spec.factor || '有沒有空氣')));
    box.appendChild(div('wg-read-sub',
      '這叫「對照實驗」：兩組只差一個條件（操作變因），其他通通一樣（控制變因）。' +
      '這樣結果不同時，才能斷定是那個條件造成的。' +
      '⚠ 如果一次改兩個條件（水量也不同、時間也不同），就不知道是誰造成的差別，實驗白做。'));
    host.appendChild(box);
  };

  /* ── 簡單電路（lamp）──────────────────────────────────────────────────
     spec: { mode:'closed'|'open'|'short'|'series'|'parallel', pick }     */
  REG.lamp = function (host, spec) {
    var mode = spec.mode || 'closed';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function battery(x, y) {
      svg.appendChild(el('rect', { x: x, y: y, width: 46, height: 24, rx: 4 },
        'fill:none;stroke:var(--text);stroke-width:2'));
      svg.appendChild(txt(x + 23, y + 12, '電池', 'font-size:10px'));
    }
    function bulb(cx, cy, on) {
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: 15, 'fill-opacity': on ? '.85' : '.15' },
        'fill:' + (on ? '#f5e08a' : 'var(--dim)') + ';stroke:var(--text);stroke-width:2'));
      if (on) {
        [0, 45, 90, 135].forEach(function (a) {
          var r = a * Math.PI / 180;
          svg.appendChild(el('line', { x1: cx + 19 * Math.cos(r), y1: cy + 19 * Math.sin(r),
            x2: cx + 26 * Math.cos(r), y2: cy + 26 * Math.sin(r) },
            'stroke:#f5c451;stroke-width:2'));
          svg.appendChild(el('line', { x1: cx - 19 * Math.cos(r), y1: cy - 19 * Math.sin(r),
            x2: cx - 26 * Math.cos(r), y2: cy - 26 * Math.sin(r) },
            'stroke:#f5c451;stroke-width:2'));
        });
      }
    }
    function wire(d, color) {
      svg.appendChild(el('path', { d: d },
        'fill:none;stroke:var(--' + (color || 'text') + ');stroke-width:2.5'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'open') {
        battery(28, 118);
        wire('M74,130 L150,130 M186,130 L268,130 L268,60 L150,60');
        wire('M74,130 L74,60 L120,60');
        bulb(135, 60, false);
        svg.appendChild(el('line', { x1: 152, y1: 122, x2: 176, y2: 112 },
          'stroke:var(--bad);stroke-width:3'));
        svg.appendChild(txt(168, 148, '開關斷開', 'font-size:10px;fill:var(--bad)'));
        main = '斷路：電流走不完一圈，燈不亮';
        sub = '電路只要有「任何一個地方斷掉」（開關關掉、燈絲燒斷、電線鬆脫、電池沒接好），' +
              '電流就無法流動，燈就不會亮。檢查燈不亮時，就是沿著這一圈找哪裡斷了。';
      } else if (mode === 'short') {
        battery(28, 118);
        wire('M74,130 L268,130 L268,60 L150,60', 'bad');
        wire('M74,130 L74,60 L120,60', 'bad');
        bulb(135, 60, false);
        wire('M74,130 L268,130', 'bad');
        svg.appendChild(txt(170, 152, '導線直接連接正負極', 'font-size:10px;fill:var(--bad)'));
        main = '短路：電流不經過燈泡，直接跑回電池';
        sub = '⚠ 用導線把電池的正負極直接連起來就是短路。' +
              '這時電流非常大，導線和電池會迅速發燙，可能燙傷、燒壞電池甚至起火。' +
              '做電路實驗時一定要讓電流「經過用電器（燈泡）」再回到電池。';
      } else if (mode === 'series') {
        battery(28, 118);
        wire('M74,130 L268,130 L268,60 L216,60 M186,60 L136,60 M106,60 L74,60 L74,130');
        bulb(121, 60, true); bulb(201, 60, true);
        svg.appendChild(txt(160, 152, '兩顆燈泡「接成一串」', 'font-size:10px;fill:var(--dim)'));
        main = '串聯：電流只有一條路可以走';
        sub = '兩顆燈泡接成一串時，電流依序流過每一顆。' +
              '⚠ 拿掉其中一顆（或它燒壞了），整條路就斷了，另一顆也會熄滅。' +
              '而且燈泡越多，每一顆分到的電越少，會比較暗。（舊式聖誕燈串就是這樣。）';
      } else if (mode === 'parallel') {
        battery(28, 118);
        wire('M74,130 L268,130 L268,44 L74,44 L74,130');
        wire('M130,44 L130,86 M130,86 L130,44');
        wire('M210,44 L210,86');
        wire('M130,86 L210,86');
        bulb(130, 100, true); bulb(210, 100, true);
        svg.appendChild(txt(160, 152, '兩顆燈泡各走各的路', 'font-size:10px;fill:var(--dim)'));
        main = '並聯：每顆燈泡各有一條路';
        sub = '並聯時每一顆燈泡都直接接到電池，各走各的路。' +
              '所以拿掉其中一顆，另一顆「還是會亮」，而且亮度和單獨接一顆時差不多。' +
              '家裡的電器就是並聯的——關掉電視，電燈還亮著。';
      } else {
        battery(28, 118);
        wire('M74,130 L268,130 L268,60 L150,60');
        wire('M74,130 L74,60 L120,60');
        bulb(135, 60, true);
        svg.appendChild(txt(170, 152, '電流繞完整一圈', 'font-size:10px;fill:var(--good)'));
        main = '通路：電流繞完一圈，燈泡亮';
        sub = '燈泡要亮，電路必須接成「完整的一圈」：電池 → 導線 → 燈泡 → 導線 → 回到電池。' +
              '電池提供電、導線帶著電走、燈泡把電能變成光和熱。' +
              '⚠ 三個都要接好，少一個環節就不亮。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['closed', '通路'], ['open', '斷路'], ['short', '短路'],
       ['series', '串聯'], ['parallel', '並聯']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 熱的傳播（heat）──────────────────────────────────────────────────
     spec: { mode:'conduct'|'convect'|'radiate', pick }                   */
  REG.heat = function (host, spec) {
    var mode = spec.mode || 'conduct';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub, i;
      if (mode === 'convect') {
        svg.appendChild(el('rect', { x: 60, y: 40, width: 200, height: 90, rx: 6, 'fill-opacity': '.18' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(el('rect', { x: 130, y: 132, width: 60, height: 12, rx: 3 }, 'fill:var(--bad)'));
        svg.appendChild(txt(160, 156, '加熱', 'font-size:10px;fill:var(--bad)'));
        svg.appendChild(el('path', { d: 'M160,124 C160,90 200,90 200,60' },
          'fill:none;stroke:var(--bad);stroke-width:2.5'));
        svg.appendChild(el('polygon', { points: '200,52 194,64 206,64' }, 'fill:var(--bad)'));
        svg.appendChild(el('path', { d: 'M220,58 C240,90 200,110 176,122' },
          'fill:none;stroke:var(--accent);stroke-width:2.5'));
        svg.appendChild(el('polygon', { points: '170,126 182,124 178,114' }, 'fill:var(--accent)'));
        svg.appendChild(txt(226, 40, '熱的往上', 'font-size:10px;fill:var(--bad)'));
        svg.appendChild(txt(88, 118, '冷的下沉', 'font-size:10px;fill:var(--accent)'));
        main = '對流：液體和氣體「自己流動」把熱帶走';
        sub = '受熱的部分變輕往上升、旁邊比較冷的流過來補位置，一圈一圈循環把熱帶到各處。' +
              '這是液體和氣體傳熱的主要方式（固體不會對流）。' +
              '例子：煮開水、冷氣裝高處（冷空氣下沉）、暖氣裝低處、天燈上升、海陸風。';
      } else if (mode === 'radiate') {
        svg.appendChild(el('circle', { cx: 76, cy: 84, r: 24 }, 'fill:#f5c451'));
        svg.appendChild(txt(76, 84, '熱源', 'font-size:10px;fill:#111'));
        for (i = 0; i < 4; i++) {
          var y = 50 + i * 24;
          svg.appendChild(el('line', { x1: 106, y1: y, x2: 214, y2: y },
            'stroke:#f5c451;stroke-width:2;stroke-dasharray:8 5'));
          svg.appendChild(el('polygon', { points: '222,' + y + ' 210,' + (y - 5) + ' 210,' + (y + 5) },
            'fill:#f5c451'));
        }
        svg.appendChild(el('rect', { x: 236, y: 46, width: 40, height: 76, rx: 4, 'fill-opacity': '.3' },
          'fill:var(--bad);stroke:var(--bad);stroke-width:2'));
        svg.appendChild(txt(256, 138, '被曬熱', 'font-size:10px;fill:var(--bad)'));
        main = '輻射：不需要介質，熱直接傳過來';
        sub = '太陽和地球之間是真空，沒有空氣可以傳熱，但我們還是曬得到太陽——' +
              '因為熱可以用「輻射」的方式直接傳過來。' +
              '例子：曬太陽、烤火時正面覺得熱、烤箱、暖爐。' +
              '深色物體吸收輻射熱的能力比較強，所以夏天穿淺色衣服比較涼。';
      } else {
        svg.appendChild(el('rect', { x: 40, y: 76, width: 220, height: 20, rx: 4 }, 'fill:var(--dim)'));
        svg.appendChild(el('rect', { x: 40, y: 76, width: 60, height: 20, rx: 4 }, 'fill:var(--bad)'));
        svg.appendChild(txt(70, 60, '加熱端（熱）', 'font-size:10px;fill:var(--bad)'));
        svg.appendChild(txt(232, 60, '另一端慢慢變熱', 'font-size:10px;fill:var(--dim)'));
        for (i = 0; i < 5; i++) {
          svg.appendChild(el('polygon', { points: (108 + i * 30) + ',86 ' + (98 + i * 30) +
            ',80 ' + (98 + i * 30) + ',92' }, 'fill:var(--bad);opacity:' + (1 - i * 0.15)));
        }
        svg.appendChild(txt(160, 130, '熱沿著物體「傳過去」，物體本身不移動',
          'font-size:10px;fill:var(--dim)'));
        main = '傳導：熱沿著固體從高溫傳到低溫';
        sub = '把湯匙放進熱湯，柄也會慢慢變熱——熱沿著金屬「傳」過去了。' +
              '金屬是熱的良導體（傳得快），木頭、塑膠、布、空氣是不良導體（傳得慢）。' +
              '所以鍋子用金屬做、鍋柄用塑膠或木頭做；冬天穿的衣服則是利用「空氣傳熱慢」來保暖。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['conduct', '傳導'], ['convect', '對流'], ['radiate', '輻射']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 浮力（buoyancy）──────────────────────────────────────────────────
     spec: { mode:'float'|'sink'|'boat', pick }                           */
  REG.buoyancy = function (host, spec) {
    var mode = spec.mode || 'float';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('rect', { x: 30, y: 60, width: 260, height: 84, rx: 4, 'fill-opacity': '.22' },
        'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
      svg.appendChild(el('line', { x1: 30, y1: 60, x2: 290, y2: 60 },
        'stroke:var(--accent);stroke-width:2.5'));
      var main, sub;
      if (mode === 'sink') {
        svg.appendChild(el('rect', { x: 140, y: 112, width: 40, height: 26, rx: 3 },
          'fill:var(--dim);stroke:var(--text);stroke-width:2'));
        svg.appendChild(txt(160, 125, '鐵塊', 'font-size:10px'));
        svg.appendChild(el('line', { x1: 160, y1: 112, x2: 160, y2: 88 },
          'stroke:var(--good);stroke-width:2.5'));
        svg.appendChild(el('polygon', { points: '160,80 154,92 166,92' }, 'fill:var(--good)'));
        svg.appendChild(txt(200, 84, '浮力（向上）', 'font-size:10px;fill:var(--good)'));
        svg.appendChild(el('line', { x1: 120, y1: 118, x2: 120, y2: 142 },
          'stroke:var(--bad);stroke-width:2.5'));
        svg.appendChild(el('polygon', { points: '120,150 114,138 126,138' }, 'fill:var(--bad)'));
        svg.appendChild(txt(86, 148, '重量', 'font-size:10px;fill:var(--bad)'));
        main = '下沉：重量大於浮力';
        sub = '放進水裡的東西同時受到「向下的重量」和「向上的浮力」。' +
              '重量比浮力大 → 往下沉（鐵塊、石頭）；浮力比重量大 → 浮起來（木塊、保麗龍）。' +
              '同樣大小的物體，比較重的那個（密度大）就會沉。';
      } else if (mode === 'boat') {
        svg.appendChild(el('path', { d: 'M116,74 L204,74 L188,104 L132,104 Z' },
          'fill:var(--panel2);stroke:var(--text);stroke-width:2'));
        svg.appendChild(txt(160, 90, '黏土做的船', 'font-size:10px'));
        svg.appendChild(el('line', { x1: 160, y1: 104, x2: 160, y2: 130 },
          'stroke:var(--good);stroke-width:2.5'));
        svg.appendChild(el('polygon', { points: '160,98 154,110 166,110' }, 'fill:var(--good)'));
        svg.appendChild(txt(226, 118, '排開更多水 → 浮力變大', 'font-size:10px;fill:var(--good)'));
        main = '同一團黏土，捏成船就浮起來了';
        sub = '浮力的大小取決於「排開多少水」。捏成一團時排開的水少、浮力小，所以沉下去；' +
              '捏成中空的船形，排開的水變多、浮力變大，就浮起來了。' +
              '鋼鐵做的大船能浮在海上，靠的就是這個道理——船身是空心的。';
      } else {
        svg.appendChild(el('rect', { x: 136, y: 44, width: 48, height: 30, rx: 3 },
          'fill:#c8a26a;stroke:var(--text);stroke-width:2'));
        svg.appendChild(txt(160, 59, '木塊', 'font-size:10px;fill:#111'));
        svg.appendChild(el('line', { x1: 160, y1: 74, x2: 160, y2: 100 },
          'stroke:var(--good);stroke-width:2.5'));
        svg.appendChild(el('polygon', { points: '160,68 154,80 166,80' }, 'fill:var(--good)'));
        svg.appendChild(txt(214, 96, '浮力 ≧ 重量', 'font-size:10px;fill:var(--good)'));
        main = '浮起來：浮力大於或等於重量';
        sub = '浮力的方向永遠「向上」，是水把物體往上托的力。' +
              '所以在水裡搬東西感覺比較輕（不是東西變輕，是浮力幫忙撐了一部分）。' +
              '會浮的東西：木頭、保麗龍、空瓶子；會沉的：鐵、石頭、實心黏土。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['float', '浮起來'], ['sink', '沉下去'], ['boat', '黏土船']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 簡單機械（lever）─────────────────────────────────────────────────
     spec: { mode:'lever'|'wheel'|'pulley', pick }                        */
  REG.lever = function (host, spec) {
    var mode = spec.mode || 'lever';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'wheel') {
        svg.appendChild(el('circle', { cx: 160, cy: 84, r: 52, 'fill-opacity': '.18' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2.5'));
        svg.appendChild(el('circle', { cx: 160, cy: 84, r: 18, 'fill-opacity': '.4' },
          'fill:var(--good);stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(160, 84, '軸', 'font-size:10px'));
        svg.appendChild(txt(160, 150, '輪（大）帶動 軸（小）', 'font-size:11px;fill:var(--dim)'));
        main = '輪軸：轉大的輪，帶動小的軸';
        sub = '輪軸是兩個大小不同、固定在一起轉的圓。施力在「大輪」上比較省力。' +
              '例子：門把、水龍頭、方向盤、螺絲起子（握柄粗 ＝ 輪，金屬桿細 ＝ 軸）、腳踏車的踏板。' +
              '⚠ 省了力氣，但手要轉的距離變長——這是簡單機械的通則。';
      } else if (mode === 'pulley') {
        svg.appendChild(el('circle', { cx: 160, cy: 42, r: 20 },
          'fill:none;stroke:var(--accent);stroke-width:3'));
        svg.appendChild(el('line', { x1: 140, y1: 42, x2: 140, y2: 130 },
          'stroke:var(--text);stroke-width:2'));
        svg.appendChild(el('line', { x1: 180, y1: 42, x2: 180, y2: 120 },
          'stroke:var(--text);stroke-width:2'));
        svg.appendChild(el('rect', { x: 124, y: 130, width: 32, height: 24, rx: 3 },
          'fill:var(--dim)'));
        svg.appendChild(txt(140, 142, '重物', 'font-size:9px'));
        svg.appendChild(el('polygon', { points: '180,128 174,116 186,116' }, 'fill:var(--good)'));
        svg.appendChild(txt(206, 128, '往下拉', 'font-size:10px;fill:var(--good)'));
        main = '定滑輪：改變施力的方向';
        sub = '定滑輪固定在上面不會移動，它「不能省力」，但可以把「往上拉」變成「往下拉」——' +
              '往下拉比較好使力（可以用體重），所以升旗和吊東西都用它。' +
              '動滑輪（會跟著重物一起移動的那種）才能省力，但要拉更長的繩子。';
      } else {
        svg.appendChild(el('line', { x1: 40, y1: 96, x2: 280, y2: 96 },
          'stroke:var(--accent);stroke-width:6'));
        svg.appendChild(el('polygon', { points: '200,100 184,130 216,130' }, 'fill:var(--dim)'));
        svg.appendChild(txt(200, 146, '支點', 'font-size:10px;fill:var(--dim)'));
        svg.appendChild(el('line', { x1: 60, y1: 76, x2: 60, y2: 92 },
          'stroke:var(--good);stroke-width:3'));
        svg.appendChild(el('polygon', { points: '60,96 54,84 66,84' }, 'fill:var(--good)'));
        svg.appendChild(txt(60, 66, '施力點', 'font-size:10px;fill:var(--good)'));
        svg.appendChild(el('rect', { x: 244, y: 68, width: 30, height: 24, rx: 3 }, 'fill:var(--bad)'));
        svg.appendChild(txt(259, 58, '抗力點', 'font-size:10px;fill:var(--bad)'));
        main = '槓桿：支點、施力點、抗力點';
        sub = '支點是「轉動的中心」、施力點是「我們出力的地方」、抗力點是「重物在的地方」。' +
              '省力的訣竅：施力點離支點「越遠」越省力（力臂越長）。' +
              '例子：撬棍、開瓶器、剪刀（支點在中間的軸）、指甲剪、掃把。' +
              '⚠ 省了力氣，手移動的距離就變長，沒辦法兩全其美。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['lever', '槓桿'], ['wheel', '輪軸'], ['pulley', '滑輪']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 磁鐵（magnet）────────────────────────────────────────────────────
     spec: { mode:'poles'|'attract'|'repel'|'compass', pick }             */
  REG.magnet = function (host, spec) {
    var mode = spec.mode || 'poles';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 160', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function bar(x, y, leftLabel, rightLabel) {
      svg.appendChild(el('rect', { x: x, y: y, width: 56, height: 28, rx: 3 }, 'fill:var(--bad)'));
      svg.appendChild(el('rect', { x: x + 56, y: y, width: 56, height: 28, rx: 3 }, 'fill:var(--accent)'));
      svg.appendChild(txt(x + 28, y + 14, leftLabel, 'font-size:14px;font-weight:700;fill:#fff'));
      svg.appendChild(txt(x + 84, y + 14, rightLabel, 'font-size:14px;font-weight:700;fill:#fff'));
    }
    function arrow(x1, y, x2) {
      svg.appendChild(el('line', { x1: x1, y1: y, x2: x2, y2: y }, 'stroke:var(--good);stroke-width:3'));
      var d = x2 > x1 ? 1 : -1;
      svg.appendChild(el('polygon', { points: x2 + ',' + y + ' ' + (x2 - d * 9) + ',' + (y - 5) +
        ' ' + (x2 - d * 9) + ',' + (y + 5) }, 'fill:var(--good)'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'attract') {
        bar(40, 66, 'N', 'S'); bar(168, 66, 'N', 'S');
        arrow(118, 48, 152); arrow(202, 48, 168);   // 箭頭畫在磁鐵上方，才不會被蓋住
        main = '異極相吸：S 極遇到 N 極會互相吸引';
        sub = '磁鐵有兩個磁極：N 極（指北）和 S 極（指南）。' +
              '同極（N 對 N、S 對 S）互相排斥，異極（N 對 S）互相吸引。' +
              '⚠ 把磁鐵切成兩半，不會得到「只有 N 極」的磁鐵——每一小塊都還是有 N 和 S 兩極。';
      } else if (mode === 'repel') {
        bar(40, 66, 'S', 'N'); bar(168, 66, 'N', 'S');
        arrow(140, 48, 106); arrow(180, 48, 214);
        main = '同極相斥：N 極遇到 N 極會互相推開';
        sub = '兩塊磁鐵靠近時，同極會推開、異極會吸引，而且距離越近作用力越大。' +
              '磁浮列車就是利用同極相斥把車廂浮起來，減少摩擦力。';
      } else if (mode === 'compass') {
        svg.appendChild(el('circle', { cx: 160, cy: 78, r: 46 },
          'fill:var(--panel2);stroke:var(--text);stroke-width:2'));
        svg.appendChild(el('polygon', { points: '160,38 168,78 152,78' }, 'fill:var(--bad)'));
        svg.appendChild(el('polygon', { points: '160,118 168,78 152,78' }, 'fill:var(--dim)'));
        svg.appendChild(txt(160, 24, '北', 'font-size:12px;fill:var(--dim)'));
        svg.appendChild(txt(160, 134, '南', 'font-size:12px;fill:var(--dim)'));
        main = '指南針：紅色（有箭頭）那端指向北方';
        sub = '地球本身像一塊大磁鐵，所以可以自由轉動的磁針會固定指向南北。' +
              '用法：把指南針放平、等指針停下來，再轉動盤面讓「北」對齊指針。' +
              '⚠ 旁邊有鐵器、磁鐵或手機時指針會被干擾，要拿開再量。';
      } else {
        bar(104, 60, 'N', 'S');
        svg.appendChild(txt(78, 74, '磁極', 'font-size:11px;fill:var(--dim)'));
        svg.appendChild(txt(160, 120, '兩端的磁力最強、中間最弱',
          'font-size:11px;fill:var(--dim)'));
        main = '磁鐵有 N、S 兩個磁極';
        sub = '磁鐵能吸引「鐵、鈷、鎳」做的東西（迴紋針、鐵釘、鐵罐）。' +
              '⚠ 銅、鋁、金、銀、塑膠、玻璃、木頭都不會被吸引——不是「金屬就會被吸」。' +
              '磁力兩端最強、中間最弱，而且隔著紙或玻璃仍然吸得到（磁力可以穿透非磁性材料）。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['poles', '磁極'], ['attract', '異極相吸'], ['repel', '同極相斥'], ['compass', '指南針']]
        .forEach(function (m) { row.appendChild(btn(m[1], function () { mode = m[0]; paint(); })); });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 力的效果與摩擦力（force）─────────────────────────────────────────
     spec: { mode:'effect'|'friction', pick }                             */
  REG.force = function (host, spec) {
    var mode = spec.mode || 'effect';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'friction') {
        svg.appendChild(el('line', { x1: 16, y1: 116, x2: 304, y2: 116 },
          'stroke:var(--text);stroke-width:2.5'));
        for (var i = 0; i < 14; i++) {
          svg.appendChild(el('line', { x1: 20 + i * 12, y1: 116, x2: 26 + i * 12, y2: 126 },
            'stroke:var(--dim);stroke-width:1.5'));
        }
        svg.appendChild(el('rect', { x: 110, y: 84, width: 60, height: 32, rx: 4, 'fill-opacity': '.3' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(el('line', { x1: 170, y1: 100, x2: 224, y2: 100 },
          'stroke:var(--good);stroke-width:3'));
        svg.appendChild(el('polygon', { points: '232,100 220,94 220,106' }, 'fill:var(--good)'));
        svg.appendChild(txt(250, 92, '施力方向', 'font-size:10px;fill:var(--good)'));
        svg.appendChild(el('line', { x1: 110, y1: 112, x2: 62, y2: 112 },
          'stroke:var(--bad);stroke-width:3'));
        svg.appendChild(el('polygon', { points: '54,112 66,106 66,118' }, 'fill:var(--bad)'));
        svg.appendChild(txt(52, 96, '摩擦力', 'font-size:10px;fill:var(--bad)'));
        main = '摩擦力：方向永遠和「物體移動的方向」相反';
        sub = '兩個物體接觸並要相對滑動時，接觸面之間會產生阻礙的力，就是摩擦力。' +
              '表面越粗糙、壓得越緊，摩擦力越大。' +
              '增加摩擦：止滑墊、輪胎紋路、球鞋顆粒、手濕了先擦乾再開瓶蓋。' +
              '減少摩擦：加潤滑油、裝滾輪、灑水（滑水道）、氣墊。';
      } else {
        [['推', 60], ['拉', 160], ['形狀改變', 260]].forEach(function (c, i) {
          svg.appendChild(el('rect', { x: c[1] - 26, y: 60, width: 52,
            height: i === 2 ? 22 : 34, rx: 4, 'fill-opacity': '.28' },
            'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
          svg.appendChild(txt(c[1], 108, c[0], 'font-size:11px;fill:var(--dim)'));
        });
        svg.appendChild(el('line', { x1: 14, y1: 76, x2: 30, y2: 76 }, 'stroke:var(--good);stroke-width:3'));
        svg.appendChild(el('polygon', { points: '34,76 24,71 24,81' }, 'fill:var(--good)'));
        svg.appendChild(el('line', { x1: 200, y1: 76, x2: 190, y2: 76 }, 'stroke:var(--good);stroke-width:3'));
        svg.appendChild(el('polygon', { points: '186,76 196,71 196,81' }, 'fill:var(--good)'));
        svg.appendChild(el('line', { x1: 260, y1: 44, x2: 260, y2: 56 }, 'stroke:var(--bad);stroke-width:3'));
        svg.appendChild(el('polygon', { points: '260,60 255,50 265,50' }, 'fill:var(--bad)'));
        main = '力的三種效果';
        sub = '① 讓靜止的物體開始運動（踢球）② 讓運動中的物體改變快慢或方向（接球、轉彎）' +
              '③ 讓物體改變形狀（壓海綿、捏黏土）。' +
              '力看不見，我們是「從這些效果」知道有力在作用的。' +
              '推和拉都是力，差別只在方向：推是往外、拉是往自己。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      row.appendChild(btn('力的效果', function () { mode = 'effect'; paint(); }));
      row.appendChild(btn('摩擦力', function () { mode = 'friction'; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 食物鏈與能量金字塔（foodweb）─────────────────────────────────────
     spec: { chain:[..], mode:'chain'|'pyramid' }                         */
  REG.foodweb = function (host, spec) {
    var chain = spec.chain || ['稻子', '蝗蟲', '青蛙', '蛇', '老鷹'];
    var mode = spec.mode || 'chain';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      if (mode === 'pyramid') {
        var n = chain.length;
        chain.forEach(function (c, i) {
          var w = 240 - i * (200 / n), y = 150 - i * (128 / n);
          svg.appendChild(el('rect', { x: 160 - w / 2, y: y - 24, width: w, height: 22, rx: 4,
            'fill-opacity': '.25' }, 'fill:var(--' + (i === 0 ? 'good' : 'accent') +
            ');stroke:var(--' + (i === 0 ? 'good' : 'accent') + ');stroke-width:1.5'));
          svg.appendChild(txt(160, y - 13, c, 'font-size:11px'));
        });
        svg.appendChild(txt(160, 172, '越上層數量越少、能量也越少',
          'font-size:10px;fill:var(--dim)'));
        read.appendChild(div('wg-read-main', '能量金字塔：往上一層只剩約十分之一'));
        read.appendChild(div('wg-read-sub',
          '能量沿食物鏈往上傳時會大量流失（生物自己活動、呼吸都要消耗），' +
          '大約只有 10% 傳到下一層。所以越上層的生物數量越少、體型再大也養不了幾隻。' +
          '這也是為什麼「吃素比吃肉省資源」——少經過一層轉換就少浪費一次。'));
      } else {
        var w2 = 300 / chain.length;
        chain.forEach(function (c, i) {
          var x = 10 + i * w2;
          svg.appendChild(el('rect', { x: x + 3, y: 62, width: w2 - 10, height: 44, rx: 8,
            'fill-opacity': '.2' }, 'fill:var(--' + (i === 0 ? 'good' : 'accent') +
            ');stroke:var(--' + (i === 0 ? 'good' : 'accent') + ');stroke-width:2'));
          svg.appendChild(txt(x + w2 / 2 - 2, 84, c, 'font-size:11px'));
          if (i) svg.appendChild(txt(x, 84, '→', 'font-size:13px;fill:var(--dim)'));
        });
        svg.appendChild(txt(160, 128, '箭頭方向 ＝ 能量流動的方向（被吃 → 吃）',
          'font-size:10px;fill:var(--dim)'));
        read.appendChild(div('wg-read-main',
          '生產者 → 初級消費者 → 次級消費者 → 高級消費者'));
        read.appendChild(div('wg-read-sub',
          '⚠ 箭頭指的是「能量流向」：稻子 → 蝗蟲 代表蝗蟲吃稻子，不是稻子吃蝗蟲。' +
          '第一個一定是生產者（植物）。生態系裡通常不只一條食物鏈，交織起來就是食物網——' +
          '所以拿掉任何一種生物，都可能影響到看似無關的其他物種。'));
      }
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      row.appendChild(btn('食物鏈', function () { mode = 'chain'; paint(); }));
      row.appendChild(btn('能量金字塔', function () { mode = 'pyramid'; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 地層與地質構造（strata）──────────────────────────────────────────
     spec: { mode:'layers'|'fold'|'fault', pick }                         */
  REG.strata = function (host, spec) {
    var mode = spec.mode || 'layers';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var COLS = ['#8a6a4a', '#a98a5a', '#c2a06a', '#d9bf8a'];
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub, i;
      if (mode === 'fold') {
        for (i = 0; i < 4; i++) {
          var y0 = 40 + i * 26;
          var d = 'M20,' + (y0 + 26) + ' Q90,' + (y0 - 22) + ' 160,' + (y0 + 26) +
            ' Q230,' + (y0 + 60) + ' 300,' + (y0 + 26) + ' L300,' + (y0 + 48) +
            ' Q230,' + (y0 + 82) + ' 160,' + (y0 + 48) + ' Q90,' + (y0) + ' 20,' + (y0 + 48) + ' Z';
          svg.appendChild(el('path', { d: d }, 'fill:' + COLS[i] + ';opacity:.85'));
        }
        main = '褶皺：地層被擠壓成波浪狀';
        sub = '岩層在長時間的水平擠壓下（板塊碰撞）會像地毯一樣拱起彎曲，這叫褶皺。' +
          '向上拱的叫背斜、向下凹的叫向斜。臺灣的山脈就是板塊擠壓褶皺加上抬升形成的。';
      } else if (mode === 'fault') {
        for (i = 0; i < 4; i++) {
          svg.appendChild(el('rect', { x: 20, y: 44 + i * 26, width: 130, height: 24 },
            'fill:' + COLS[i] + ';opacity:.85'));
          svg.appendChild(el('rect', { x: 170, y: 62 + i * 26, width: 130, height: 24 },
            'fill:' + COLS[i] + ';opacity:.85'));
        }
        svg.appendChild(el('line', { x1: 150, y1: 30, x2: 172, y2: 170 },
          'stroke:var(--bad);stroke-width:3'));
        svg.appendChild(txt(198, 34, '斷層面', 'font-size:11px;fill:var(--bad)'));
        main = '斷層：岩層斷裂並且錯開';
        sub = '岩層受力超過能承受的程度就會「斷掉並沿著破裂面滑動」，這叫斷層。' +
          '兩側的同一層岩層會錯開，一眼就看得出來。' +
          '地震大多發生在斷層活動時——累積的應力一次釋放出來。';
      } else {
        for (i = 0; i < 4; i++) {
          svg.appendChild(el('rect', { x: 20, y: 44 + i * 28, width: 280, height: 26 },
            'fill:' + COLS[i] + ';opacity:.85'));
          svg.appendChild(txt(286, 57 + i * 28, ['最新', '', '', '最早'][i],
            'font-size:10px;fill:#222'));
        }
        [[70, 100], [180, 128], [240, 156]].forEach(function (f, k) {
          svg.appendChild(el('ellipse', { cx: f[0], cy: f[1], rx: 10, ry: 6 },
            'fill:#f2f2f2;opacity:.9'));
          svg.appendChild(txt(f[0], f[1], '化石', 'font-size:7px;fill:#222'));
        });
        main = '水平地層：越下層形成得越早';
        sub = '沉積物一層一層堆上去，所以（沒有被翻轉的話）「越下面的越老、越上面的越新」，' +
          '這叫疊置定律。' +
          '化石夾在其中，比對不同地方的地層有沒有相同的化石，就能判斷它們是不是同時期形成的。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['layers', '水平地層'], ['fold', '褶皺'], ['fault', '斷層']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 板塊與地震（plates）──────────────────────────────────────────────
     spec: { mode:'collide'|'quake', pick }                               */
  REG.plates = function (host, spec) {
    var mode = spec.mode || 'collide';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'quake') {
        svg.appendChild(el('rect', { x: 14, y: 60, width: 292, height: 100, rx: 4, 'fill-opacity': '.25' },
          'fill:var(--dim);stroke:var(--dim)'));
        svg.appendChild(el('line', { x1: 14, y1: 60, x2: 306, y2: 60 },
          'stroke:var(--text);stroke-width:2.5'));
        svg.appendChild(el('circle', { cx: 150, cy: 128, r: 7 }, 'fill:var(--bad)'));
        svg.appendChild(txt(198, 132, '震源（地下）', 'font-size:10px;fill:var(--bad)'));
        svg.appendChild(el('circle', { cx: 150, cy: 60, r: 6 }, 'fill:var(--accent)'));
        svg.appendChild(txt(196, 48, '震央（正上方地表）', 'font-size:10px;fill:var(--accent)'));
        svg.appendChild(el('line', { x1: 150, y1: 60, x2: 150, y2: 128 },
          'stroke:var(--dim);stroke-width:1.5;stroke-dasharray:4 3'));
        [24, 40, 56].forEach(function (r) {
          svg.appendChild(el('path', { d: 'M' + (150 - r) + ',128 A ' + r + ' ' + r + ' 0 0 1 ' +
            (150 + r) + ',128' }, 'fill:none;stroke:var(--bad);stroke-width:1.5;opacity:.6'));
        });
        main = '震源在地下，震央在它正上方的地表';
        sub = '地震波從震源向四面八方傳出去，最先到達的地表位置就是震央，那裡通常災情最重。' +
          '⚠ 「規模」和「震度」不一樣：規模是這次地震「釋放多少能量」，一次地震只有一個數字；' +
          '震度是「某個地方搖得多厲害」，離震央越遠通常震度越小，所以各地震度不同。';
      } else {
        svg.appendChild(el('rect', { x: 10, y: 96, width: 150, height: 54, rx: 3, 'fill-opacity': '.3' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(el('rect', { x: 168, y: 96, width: 142, height: 54, rx: 3, 'fill-opacity': '.3' },
          'fill:var(--good);stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(70, 124, '板塊 A', 'font-size:11px'));
        svg.appendChild(txt(244, 124, '板塊 B', 'font-size:11px'));
        svg.appendChild(el('polygon', { points: '110,80 150,80 150,70 172,88 150,106 150,96 110,96' },
          'fill:var(--bad)'));
        svg.appendChild(el('polygon', { points: '210,80 170,80 170,70 148,88 170,106 170,96 210,96' },
          'fill:var(--bad)'));
        svg.appendChild(el('path', { d: 'M120,96 Q164,44 208,96' },
          'fill:none;stroke:var(--text);stroke-width:3'));
        svg.appendChild(txt(164, 38, '擠出山脈', 'font-size:11px;fill:var(--text)'));
        main = '板塊互相推擠，把地表推高成山脈';
        sub = '地球表層破裂成好幾塊板塊，浮在會緩慢流動的地函上，被地函的對流帶著移動（一年幾公分）。' +
          '板塊碰撞的地方會擠出高山、形成火山與地震帶。' +
          '臺灣正好位於歐亞板塊和菲律賓海板塊的交界，所以地震和溫泉都特別多，中央山脈也還在長高。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      row.appendChild(btn('板塊碰撞', function () { mode = 'collide'; paint(); }));
      row.appendChild(btn('震源與震央', function () { mode = 'quake'; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 天氣圖（weathermap）──────────────────────────────────────────────
     spec: { mode:'pressure'|'front'|'typhoon', pick }                    */
  REG.weathermap = function (host, spec) {
    var mode = spec.mode || 'pressure';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub, i;
      if (mode === 'front') {
        svg.appendChild(el('path', { d: 'M20,60 Q110,96 300,132' },
          'fill:none;stroke:var(--accent);stroke-width:3'));
        for (i = 0; i < 5; i++) {
          var t = i / 5, x = 20 + t * 280, y = 60 + t * 66;
          svg.appendChild(el('polygon', { points: x + ',' + y + ' ' + (x + 12) + ',' + (y - 3) +
            ' ' + (x + 6) + ',' + (y - 14) }, 'fill:var(--accent)'));
        }
        svg.appendChild(txt(70, 40, '冷氣團（推進）', 'font-size:11px;fill:var(--accent)'));
        svg.appendChild(txt(250, 96, '暖氣團', 'font-size:11px;fill:var(--bad)'));
        main = '冷鋒：冷空氣推向暖空氣的交界';
        sub = '冷空氣重、暖空氣輕，冷鋒推進時把暖空氣抬升 → 水氣凝結 → 短時間內下大雨、伴隨強風。' +
          '通過之後氣溫明顯下降、天氣轉晴變乾冷。' +
          '天氣圖上冷鋒畫成藍色三角形、暖鋒畫成紅色半圓形，三角形指的方向就是它前進的方向。';
      } else if (mode === 'typhoon') {
        for (i = 3; i >= 1; i--) {
          svg.appendChild(el('circle', { cx: 160, cy: 92, r: i * 26, 'fill-opacity': i === 3 ? '.12' : '.2' },
            'fill:var(--accent);stroke:var(--accent);stroke-width:1.5'));
        }
        svg.appendChild(el('circle', { cx: 160, cy: 92, r: 12 },
          'fill:var(--panel);stroke:var(--bad);stroke-width:2'));
        svg.appendChild(txt(160, 92, '颱風眼', 'font-size:9px;fill:var(--bad)'));
        svg.appendChild(txt(160, 168, '眼牆附近風雨最強', 'font-size:10px;fill:var(--dim)'));
        main = '颱風：中心是風雨最小的「颱風眼」';
        sub = '颱風是熱帶海面上發展出來的強烈低氣壓，空氣旋轉上升、水氣大量凝結，帶來狂風豪雨。' +
          '⚠ 颱風眼裡風雨反而很小甚至放晴——但那是「暫時的」，眼睛過去之後風向會反轉、風雨立刻再起，' +
          '這時候出門最危險。';
      } else {
        [[100, 78], [220, 96]].forEach(function (c, k) {
          for (i = 1; i <= 3; i++) {
            svg.appendChild(el('ellipse', { cx: c[0], cy: c[1], rx: i * 16, ry: i * 12 },
              'fill:none;stroke:var(--' + (k ? 'bad' : 'accent') + ');stroke-width:1.5;opacity:.8'));
          }
          svg.appendChild(txt(c[0], c[1] + 4, k ? 'H' : 'L',
            'font-size:18px;font-weight:700;fill:var(--' + (k ? 'bad' : 'accent') + ')'));
        });
        svg.appendChild(txt(100, 146, '低氣壓：多雲雨', 'font-size:10px;fill:var(--accent)'));
        svg.appendChild(txt(228, 146, '高氣壓：晴朗', 'font-size:10px;fill:var(--bad)'));
        main = '等壓線：把氣壓相同的地方連起來';
        sub = '天氣圖上一圈一圈的線叫等壓線。中心氣壓比周圍低的是低氣壓（L）：' +
          '空氣往中心聚集後上升、水氣凝結 → 多雲、下雨。' +
          '中心氣壓比周圍高的是高氣壓（H）：空氣下沉 → 天氣晴朗乾燥。' +
          '⚠ 等壓線越密集，代表氣壓差越大、風越強。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['pressure', '高低氣壓'], ['front', '鋒面'], ['typhoon', '颱風']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 顯微鏡（microscope）──────────────────────────────────────────────
     spec: { eye, obj }  目鏡倍率、物鏡倍率                                */
  REG.microscope = function (host, spec) {
    var eye = spec.eye == null ? 10 : spec.eye;
    var obj = spec.obj == null ? 40 : spec.obj;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var total = eye * obj;
      // 左：視野（倍率越大，看到的範圍越小、東西越大）
      var R = 46, cx = 76, cy = 76;
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: R },
        'fill:var(--panel2);stroke:var(--text);stroke-width:2'));
      // 倍率越高，細胞畫得越大（但要留在視野圓內，所以先裁切再限制大小）
      var cid = 'mscope' + (++clipSeq);
      var defs = el('defs'), cp = el('clipPath', { id: cid });
      cp.appendChild(el('circle', { cx: cx, cy: cy, r: R - 1 }));
      defs.appendChild(cp); svg.appendChild(defs);
      var g = el('g', { 'clip-path': 'url(#' + cid + ')' });
      svg.appendChild(g);
      var cell = 5 + Math.min(total, 400) / 400 * 22;
      [[0, 0], [-1, 1], [1, 1], [1, -1], [-1, -1]].forEach(function (d) {
        g.appendChild(el('ellipse', { cx: cx + d[0] * cell * 1.5, cy: cy + d[1] * cell * 1.5,
          rx: cell, ry: cell * 0.72, 'fill-opacity': '.5' },
          'fill:var(--good);stroke:var(--good);stroke-width:1.5'));
      });
      svg.appendChild(txt(cx, 138, '視野（放大 ' + total + ' 倍）', 'font-size:11px;fill:var(--dim)'));
      // 右：倍率算式
      svg.appendChild(txt(226, 50, '目鏡 ' + eye + ' 倍', 'font-size:13px'));
      svg.appendChild(txt(226, 76, '×', 'font-size:13px;fill:var(--dim)'));
      svg.appendChild(txt(226, 100, '物鏡 ' + obj + ' 倍', 'font-size:13px'));
      svg.appendChild(el('line', { x1: 176, y1: 112, x2: 288, y2: 112 },
        'stroke:var(--border);stroke-width:1.5'));
      svg.appendChild(txt(226, 132, '＝ ' + total + ' 倍',
        'font-size:15px;font-weight:700;fill:var(--accent)'));
      read.appendChild(div('wg-read-main', '總放大倍率 ＝ 目鏡倍率 × 物鏡倍率 ＝ ' + total + ' 倍'));
      read.appendChild(div('wg-read-sub',
        '操作順序：先用「低倍」物鏡找到標本並對焦，找到之後再轉到高倍微調。' +
        '⚠ 倍率越高，看到的「範圍越小、亮度越暗」，而且要用細調節輪，' +
        '否則物鏡容易壓破玻片。顯微鏡下看到的像是上下顛倒、左右相反的——' +
        '標本要往左移時，玻片其實要往右推。'));
    }
    if (spec.edit !== false) {
      var row = div('wg-ctrl');
      [4, 10, 40].forEach(function (o) {
        row.appendChild(btn('物鏡 ' + o + '×', function () { obj = o; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 人體系統（bodysystem）────────────────────────────────────────────
     spec: { mode:'digest'|'breath'|'blood', pick }                       */
  REG.bodysystem = function (host, spec) {
    var mode = spec.mode || 'digest';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 200', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function chain(items, color) {
      var w = 300 / items.length;
      items.forEach(function (it, i) {
        var x = 10 + i * w;
        svg.appendChild(el('rect', { x: x + 3, y: 60, width: w - 10, height: 48, rx: 8,
          'fill-opacity': '.18' }, 'fill:var(--' + color + ');stroke:var(--' + color + ');stroke-width:2'));
        svg.appendChild(txt(x + w / 2 - 2, 84, it, 'font-size:11px'));
        if (i) svg.appendChild(txt(x, 84, '→', 'font-size:13px;fill:var(--dim)'));
      });
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'breath') {
        chain(['鼻', '氣管', '支氣管', '肺泡'], 'accent');
        svg.appendChild(txt(160, 132, '肺泡：氧氣進血液、二氧化碳出來',
          'font-size:11px;fill:var(--good)'));
        main = '呼吸系統：氣體交換在「肺泡」';
        sub = '吸入的空氣經鼻、氣管、支氣管到達肺泡，在那裡把氧氣交給血液、' +
          '把血液帶來的二氧化碳換出去。' +
          '所以呼出的氣和吸入的相比：氧氣變少、二氧化碳變多、水氣也變多（呼氣會起霧）。' +
          '⚠ 呼出的氣仍然含有氧氣（所以 CPR 的人工呼吸才有用）。';
      } else if (mode === 'blood') {
        chain(['心臟', '動脈', '微血管', '靜脈'], 'bad');
        svg.appendChild(txt(160, 132, '心臟像幫浦，血液繞全身一圈再回來',
          'font-size:11px;fill:var(--dim)'));
        main = '循環系統：心臟推動血液運送物質';
        sub = '心臟是幫浦，把血液推出去（動脈）→ 到全身的微血管交換物質 → 再流回來（靜脈）。' +
          '血液負責運送氧氣、養分、二氧化碳和廢物。' +
          '運動時肌肉需要更多氧氣和養分，所以心跳和呼吸都會變快——這是身體在加快補給。';
      } else if (mode === 'excrete') {
        chain(['腎臟', '輸尿管', '膀胱', '尿道'], 'accent');
        svg.appendChild(txt(160, 132, '腎臟：把血液裡的含氮廢物過濾成尿',
          'font-size:11px;fill:var(--accent)'));
        main = '排泄系統：腎臟過濾血液';
        sub = '細胞代謝會產生含氮廢物（主要是尿素），由血液帶到腎臟過濾成尿，' +
          '經輸尿管暫存在膀胱，再排出體外。' +
          '⚠ 排泄和排遺不一樣：尿、汗、呼氣中的二氧化碳是「細胞代謝的廢物」，叫排泄；' +
          '糞便是沒被吸收的食物殘渣，根本沒進過細胞，叫排遺。' +
          '皮膚（流汗）和肺（呼出二氧化碳和水氣）也是排泄的管道。';
      } else {
        chain(['口', '食道', '胃', '小腸', '大腸'], 'good');
        svg.appendChild(txt(160, 132, '小腸：吸收養分的主角',
          'font-size:11px;fill:var(--good)'));
        main = '消化系統：小腸負責吸收養分';
        sub = '口（牙齒磨碎、唾液開始分解）→ 食道 → 胃（初步分解）→ 小腸（消化完成並吸收養分）→ ' +
          '大腸（吸收水分，形成糞便）。' +
          '細嚼慢嚥有用，是因為食物被磨得越碎，和消化液接觸的面積越大，消化越有效率。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['digest', '消化'], ['breath', '呼吸'], ['blood', '循環'], ['excrete', '排泄']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 電流的磁效應與電動機（circuit）───────────────────────────────────
     spec: { mode:'magnet'|'motor'|'generator', pick }                    */
  REG.circuit = function (host, spec) {
    var mode = spec.mode || 'magnet';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function battery(x, y) {
      svg.appendChild(el('rect', { x: x, y: y, width: 44, height: 24, rx: 4 },
        'fill:none;stroke:var(--text);stroke-width:2'));
      svg.appendChild(txt(x + 22, y + 12, '電池', 'font-size:10px'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'motor' || mode === 'generator') {
        svg.appendChild(el('circle', { cx: 160, cy: 82, r: 40, 'fill-opacity': '.15' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2.5'));
        svg.appendChild(txt(160, 82, mode === 'motor' ? '馬達' : '發電機', 'font-size:13px'));
        var left = mode === 'motor' ? '電能' : '動能';
        var right = mode === 'motor' ? '動能（轉動）' : '電能';
        svg.appendChild(txt(48, 82, left, 'font-size:11px;fill:var(--good)'));
        svg.appendChild(txt(272, 82, right, 'font-size:11px;fill:var(--bad)'));
        svg.appendChild(el('line', { x1: 84, y1: 82, x2: 116, y2: 82 },
          'stroke:var(--good);stroke-width:3'));
        svg.appendChild(el('polygon', { points: '120,82 110,77 110,87' }, 'fill:var(--good)'));
        svg.appendChild(el('line', { x1: 204, y1: 82, x2: 226, y2: 82 },
          'stroke:var(--bad);stroke-width:3'));
        svg.appendChild(el('polygon', { points: '232,82 222,77 222,87' }, 'fill:var(--bad)'));
        main = mode === 'motor' ? '馬達：電能 → 動能' : '發電機：動能 → 電能';
        sub = mode === 'motor'
          ? '通電的線圈放在磁場中會受力而轉動——電風扇、果汁機、電動車都靠馬達。' +
            '馬達和發電機的構造幾乎一樣，只是能量轉換的方向相反。'
          : '讓線圈在磁場中轉動就會產生電流。水力（水沖）、火力與核能（蒸汽推）、風力（風吹）' +
            '的差別只在「用什麼推動發電機」，最後一步都一樣。' +
            '再生能源：太陽能、風力、水力、地熱；非再生：煤、石油、天然氣、核能。';
      } else {
        battery(28, 118);
        svg.appendChild(el('path', { d: 'M72,130 L120,130 M200,130 L268,130 L268,60' },
          'fill:none;stroke:var(--text);stroke-width:2'));
        // 線圈
        for (var i = 0; i < 6; i++) {
          svg.appendChild(el('ellipse', { cx: 128 + i * 13, cy: 96, rx: 7, ry: 22 },
            'fill:none;stroke:var(--accent);stroke-width:2.5'));
        }
        svg.appendChild(el('rect', { x: 118, y: 86, width: 84, height: 20, rx: 3, 'fill-opacity': '.3' },
          'fill:var(--dim);stroke:var(--dim)'));
        svg.appendChild(txt(160, 96, '鐵釘', 'font-size:10px'));
        svg.appendChild(txt(160, 140, '線圈通電 → 變成磁鐵', 'font-size:11px;fill:var(--accent)'));
        svg.appendChild(el('circle', { cx: 268, cy: 46, r: 14 },
          'fill:none;stroke:var(--good);stroke-width:2'));
        svg.appendChild(el('line', { x1: 268, y1: 34, x2: 268, y2: 58 },
          'stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(268, 22, '指南針偏轉', 'font-size:10px;fill:var(--good)'));
        main = '電流的磁效應：通電的導線周圍會產生磁場';
        sub = '把指南針放在通電導線旁會偏轉，這證明「電流會產生磁場」。' +
          '把導線繞成線圈、中間插一根鐵釘，磁力會集中變強，這就是電磁鐵。' +
          '電磁鐵的三個特點：① 通電才有磁性、斷電就沒有（所以資源回收場用它吊廢鐵，' +
          '一斷電就放下）② 電池數量越多、線圈匝數越多，磁力越強 ③ 把電池正負極對調，南北極就相反。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['magnet', '電磁鐵'], ['motor', '馬達'], ['generator', '發電機']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 能量轉換（energyflow）────────────────────────────────────────────
     spec: { steps:['電能','光能'], note }                                */
  REG.energyflow = function (host, spec) {
    var steps = spec.steps || ['電能', '光能 ＋ 熱能'];
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 120', class: 'wg-svg' });
    var w = 300 / steps.length;
    steps.forEach(function (s, i) {
      var x = 10 + i * w;
      svg.appendChild(el('rect', { x: x + 4, y: 36, width: w - 14, height: 46, rx: 10,
        'fill-opacity': '.2' }, 'fill:var(--' + (i === 0 ? 'good' : i === steps.length - 1 ? 'bad' : 'accent') +
        ');stroke:var(--' + (i === 0 ? 'good' : i === steps.length - 1 ? 'bad' : 'accent') + ');stroke-width:2'));
      svg.appendChild(txt(x + w / 2 - 3, 59, s, 'font-size:11px'));
      if (i) svg.appendChild(txt(x, 59, '→', 'font-size:14px;fill:var(--dim)'));
    });
    svg.appendChild(txt(160, 104, spec.note || '能量會轉換形式，但總量不會憑空增減',
      'font-size:11px;fill:var(--dim)'));
    box.appendChild(svg);
    box.appendChild(div('wg-read-main', steps.join(' → ')));
    box.appendChild(div('wg-read-sub',
      '能量有很多形式：動能、位能、熱能、光能、電能、化學能、聲能。' +
      '它們可以互相轉換，但「總量守恆」——不會憑空產生也不會消失。' +
      '⚠ 轉換過程一定會有一部分變成用不到的熱能散掉（所以燈泡會燙、手機會發熱），' +
      '這就是為什麼沒有 100% 效率的機器。'));
    host.appendChild(box);
  };

  /* ── 植物的構造（plantparts）──────────────────────────────────────────
     spec: { mode:'parts'|'transport'|'photo', pick }                     */
  REG.plantparts = function (host, spec) {
    var mode = spec.mode || 'parts';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 210', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var G = 'stroke:var(--good);stroke-width:5', B = 'stroke:var(--bad);stroke-width:7';
      var hlStem = mode === 'transport';
      svg.appendChild(el('line', { x1: 160, y1: 152, x2: 160, y2: 54 }, hlStem ? B : G));
      [[-1, 96], [1, 78], [-1, 62]].forEach(function (lf) {
        var x = 160 + lf[0] * 34, y = lf[1];
        svg.appendChild(el('ellipse', { cx: x, cy: y, rx: 26, ry: 12,
          transform: 'rotate(' + (lf[0] * -18) + ' ' + x + ' ' + y + ')', 'fill-opacity': '.3' },
          'fill:var(--' + (mode === 'photo' ? 'bad' : 'good') + ');stroke:var(--' +
          (mode === 'photo' ? 'bad' : 'good') + ');stroke-width:2'));
        svg.appendChild(el('line', { x1: 160, y1: y + 4, x2: x, y2: y },
          'stroke:var(--good);stroke-width:2'));
      });
      svg.appendChild(el('line', { x1: 20, y1: 152, x2: 300, y2: 152 },
        'stroke:var(--dim);stroke-width:2'));
      [[-1, 0.9], [-1, 0.4], [1, 0.4], [1, 0.9], [0, 0]].forEach(function (r) {
        svg.appendChild(el('line', { x1: 160, y1: 152, x2: 160 + r[0] * 44 * r[1] + (r[0] === 0 ? 0 : 0),
          y2: 152 + 44 }, 'stroke:var(--' + (mode === 'parts' ? 'accent' : 'dim') + ');stroke-width:3'));
      });
      svg.appendChild(txt(70, 176, '根', 'font-size:12px;fill:var(--accent)'));
      svg.appendChild(txt(196, 120, '莖', 'font-size:12px;fill:var(--' + (hlStem ? 'bad' : 'dim') + ')'));
      svg.appendChild(txt(112, 44, '葉', 'font-size:12px;fill:var(--' + (mode === 'photo' ? 'bad' : 'dim') + ')'));
      if (mode === 'transport') {
        [186, 166, 146, 126, 106, 86].forEach(function (y) {
          svg.appendChild(el('polygon', { points: '166,' + y + ' 172,' + (y - 6) + ' 178,' + y },
            'fill:var(--bad)'));
        });
        svg.appendChild(txt(206, 80, '水往上', 'font-size:10px;fill:var(--bad)'));
      }
      if (mode === 'photo') {
        svg.appendChild(el('circle', { cx: 48, cy: 36, r: 16 }, 'fill:#f5c451'));
        svg.appendChild(txt(48, 60, '陽光', 'font-size:10px;fill:var(--dim)'));
        svg.appendChild(txt(268, 40, 'CO₂ 進', 'font-size:10px;fill:var(--dim)'));
        svg.appendChild(txt(268, 60, 'O₂ 出', 'font-size:10px;fill:var(--good)'));
      }
      var INFO = {
        parts: ['根：吸水、吸養分、固定植物',
          '根還能儲存養分（蘿蔔、地瓜就是這樣）。根系分兩種：胡蘿蔔那種一根主根很粗的叫「軸根」；' +
          '玉米、稻子那種一堆粗細差不多的細根叫「鬚根」。'],
        transport: ['莖：水分和養分的高速公路',
          '莖裡有兩種管道：木質部把「水和礦物質」從根往上送到葉；韌皮部把葉子製造的「養分」送到全身。' +
          '把芹菜插進紅墨水，切開會看到一條條紅色的線，那就是運水的管道。' +
          '莖也負責支撐植物、把葉子撐到有陽光的地方。'],
        photo: ['葉：進行光合作用的工廠',
          '葉子用「陽光 ＋ 水 ＋ 二氧化碳」製造養分（葡萄糖／澱粉），同時放出氧氣，這叫光合作用。' +
          '負責吸收陽光的是葉綠體裡的葉綠素（所以葉子是綠的）。' +
          '葉背的氣孔負責讓氣體進出，也讓水分蒸散出去（蒸散作用）。']
      }[mode];
      read.appendChild(div('wg-read-main', INFO[0]));
      read.appendChild(div('wg-read-sub', INFO[1]));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['parts', '根'], ['transport', '莖'], ['photo', '葉']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 水溶液（solution）────────────────────────────────────────────────
     spec: { solute, max, water, label }                                  */
  REG.solution = function (host, spec) {
    var solute = spec.solute == null ? 6 : spec.solute;
    var max = spec.max == null ? 10 : spec.max;
    var water = spec.water == null ? 100 : spec.water;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('path', { d: 'M110,26 L110,150 Q110,162 122,162 L198,162 Q210,162 210,150 L210,26' },
        'fill:none;stroke:var(--text);stroke-width:2.5'));
      svg.appendChild(el('rect', { x: 111, y: 60, width: 98, height: 101, 'fill-opacity': '.25' },
        'fill:var(--accent)'));
      var dissolved = Math.min(solute, max), extra = solute - dissolved, i;
      for (i = 0; i < dissolved; i++) {                       // 溶解的：散開的小點
        svg.appendChild(el('circle', { cx: 122 + (i % 5) * 19, cy: 78 + Math.floor(i / 5) * 22, r: 3 },
          'fill:var(--good)'));
      }
      for (i = 0; i < extra; i++) {                           // 溶不下的：沉在杯底
        svg.appendChild(el('rect', { x: 120 + (i % 6) * 15, y: 148, width: 11, height: 10, rx: 2 },
          'fill:var(--bad)'));
      }
      svg.appendChild(txt(56, 100, '水 ' + water + ' 公克', 'font-size:11px;fill:var(--dim)'));
      svg.appendChild(txt(266, 100, solute + ' 公克', 'font-size:11px;fill:var(--dim)'));
      read.appendChild(div('wg-read-main', extra > 0
        ? '已經飽和：多加的 ' + extra + ' 公克溶不下去，沉在杯底'
        : '全部溶解：溶液總重 ＝ ' + water + ' ＋ ' + solute + ' ＝ ' + (water + solute) + ' 公克'));
      read.appendChild(div('wg-read-sub',
        '溶質（糖、鹽）散進溶劑（水）裡就成了溶液，看起來澄清透明、放久也不會沉澱。' +
        '⚠ 溶解不是消失：溶液的重量 ＝ 水的重量 ＋ 溶質的重量。' +
        '同樣的水最多只溶得下一定的量，到達上限就叫「飽和」；' +
        '想再溶更多，可以加水或加溫（大多數固體在熱水中溶得更多）。'));
    }
    if (spec.edit !== false) {
      var ss = stepper('加入的量', function () { return solute; }, function (v) { solute = v; }, 1, 16,
        function () { ss.sync(); paint(); });
      box.appendChild(ss.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 酸鹼（phscale）───────────────────────────────────────────────────
     spec: { value, marks:[{v,label}] }                                   */
  REG.phscale = function (host, spec) {
    var v = spec.value == null ? 7 : spec.value;
    var marks = spec.marks || [{ v: 2, label: '檸檬汁' }, { v: 4, label: '醋' },
      { v: 7, label: '純水' }, { v: 9, label: '小蘇打水' }, { v: 12, label: '肥皂水' }];
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    var COLS = ['#e2453c', '#e2703c', '#e2a83c', '#d8d23c', '#a8cf4a',
                '#5ec46a', '#3cc4a8', '#3ca0d8', '#3c6fd8', '#5a3cd8'];
    function X(p) { return 18 + p / 14 * 284; }
    for (var i = 0; i < 14; i++) {
      svg.appendChild(el('rect', { x: X(i), y: 48, width: 284 / 14 + 0.5, height: 26 },
        'fill:' + COLS[Math.min(Math.floor(i / 14 * COLS.length), COLS.length - 1)]));
    }
    [0, 7, 14].forEach(function (p) {
      svg.appendChild(txt(X(p) + 10, 88, String(p), 'font-size:11px;fill:var(--dim)'));
    });
    svg.appendChild(txt(60, 36, '← 酸性', 'font-size:12px;fill:var(--bad)'));
    svg.appendChild(txt(160, 36, '中性', 'font-size:12px;fill:var(--dim)'));
    svg.appendChild(txt(266, 36, '鹼性 →', 'font-size:12px;fill:var(--accent)'));
    marks.forEach(function (m, i) {
      var x = X(m.v) + 10;
      svg.appendChild(el('line', { x1: x, y1: 74, x2: x, y2: 96 + (i % 2) * 14 },
        'stroke:var(--text);stroke-width:1.5'));
      svg.appendChild(txt(x, 108 + (i % 2) * 14, m.label, 'font-size:10px;fill:var(--text)'));
    });
    box.appendChild(svg);
    box.appendChild(div('wg-read-main',
      'pH < 7 酸性　pH ＝ 7 中性　pH > 7 鹼性'));
    box.appendChild(div('wg-read-sub',
      '檢驗方法：藍色石蕊試紙遇「酸」變紅、紅色石蕊試紙遇「鹼」變藍（口訣：酸紅鹼藍）。' +
      '紫色高麗菜汁也可以當指示劑：遇酸變紅、遇鹼變綠或黃。' +
      '⚠ 酸鹼中和：酸和鹼混在一起會互相抵消，所以蚊蟲叮咬（酸）擦鹼性藥水會止癢、' +
      '胃酸過多吃制酸劑（鹼性）會舒服。'));
    host.appendChild(box);
  };

  /* ── 溫度與物質三態（statechange）─────────────────────────────────────
     spec: { mode:'states'|'expand'|'boil', pick }                        */
  REG.statechange = function (host, spec) {
    var mode = spec.mode || 'states';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'expand') {
        [['冷', 40, 46, 'accent'], ['熱', 190, 66, 'bad']].forEach(function (c) {
          svg.appendChild(el('rect', { x: c[1], y: 100 - c[2] / 2, width: c[2], height: c[2], rx: 6,
            'fill-opacity': '.25' }, 'fill:var(--' + c[3] + ');stroke:var(--' + c[3] + ');stroke-width:2'));
          svg.appendChild(txt(c[1] + c[2] / 2, 100, c[0], 'font-size:13px'));
        });
        svg.appendChild(txt(160, 100, '→', 'font-size:20px;fill:var(--dim)'));
        svg.appendChild(txt(160, 168, '加熱 → 膨脹　　冷卻 → 收縮', 'font-size:11px;fill:var(--dim)'));
        main = '熱脹冷縮';
        sub = '大部分物體加熱時會膨脹、冷卻時收縮。' +
          '所以鐵軌之間要留縫隙（夏天膨脹才不會擠壞）、電線夏天鬆冬天緊、' +
          '癟掉的乒乓球泡熱水會鼓起來（裡面的空氣膨脹）。' +
          '⚠ 水是例外：4℃ 以下反而膨脹，所以結冰時體積會變大，寶特瓶裝滿水冷凍會爆開。';
      } else if (mode === 'boil') {
        svg.appendChild(el('polyline', { points: '24,150 90,110 150,66 230,66 300,66' },
          'fill:none;stroke:var(--accent);stroke-width:3'));
        svg.appendChild(el('line', { x1: 150, y1: 66, x2: 300, y2: 66 },
          'stroke:var(--bad);stroke-width:3'));
        svg.appendChild(txt(230, 54, '100℃ 不再上升', 'font-size:11px;fill:var(--bad)'));
        svg.appendChild(txt(60, 168, '時間 →', 'font-size:10px;fill:var(--dim)'));
        svg.appendChild(txt(16, 100, '溫度', 'font-size:10px;fill:var(--dim)'));
        main = '沸騰時溫度不再上升';
        sub = '水加熱到 100℃ 開始沸騰之後，就算繼續加熱，溫度也停在 100℃ 左右。' +
          '因為這時吸收的熱都拿去「把液體變成氣體」了（狀態改變需要能量），沒有拿去升溫。' +
          '同理，冰在融化的過程中也一直維持 0℃ 左右。';
      } else {
        [['固體（冰）', 40, '整齊排列、不會流動'], ['液體（水）', 130, '會流動、形狀隨容器'],
         ['氣體（水蒸氣）', 226, '到處亂跑、充滿空間']].forEach(function (c, i) {
          svg.appendChild(el('rect', { x: c[1] - 34, y: 42, width: 68, height: 56, rx: 6 },
            'fill:none;stroke:var(--border);stroke-width:2'));
          var n = i === 0 ? 9 : i === 1 ? 7 : 4;
          for (var k = 0; k < n; k++) {
            var px = i === 0 ? c[1] - 24 + (k % 3) * 18 : c[1] - 26 + ((k * 13) % 52);
            var py = i === 0 ? 54 + Math.floor(k / 3) * 18 : 52 + ((k * 17) % 40);
            svg.appendChild(el('circle', { cx: px, cy: py, r: 5 }, 'fill:var(--accent)'));
          }
          svg.appendChild(txt(c[1], 112, c[0], 'font-size:10px;fill:var(--dim)'));
        });
        svg.appendChild(txt(85, 140, '融化 →', 'font-size:10px;fill:var(--bad)'));
        svg.appendChild(txt(85, 158, '← 凝固', 'font-size:10px;fill:var(--good)'));
        svg.appendChild(txt(180, 140, '汽化 →', 'font-size:10px;fill:var(--bad)'));
        svg.appendChild(txt(180, 158, '← 凝結', 'font-size:10px;fill:var(--good)'));
        main = '三態變化：加熱往右、冷卻往左';
        sub = '固體 →（融化）→ 液體 →（汽化）→ 氣體，都要「吸熱」；' +
          '反過來（凝結、凝固）則會「放熱」。' +
          '生活例子：冬天呼出的白煙是水蒸氣遇冷凝結成的小水滴（不是水蒸氣本身，水蒸氣看不見）；' +
          '冰箱拿出來的杯子外面會冒水珠，也是空氣中的水蒸氣凝結。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['states', '三態變化'], ['expand', '熱脹冷縮'], ['boil', '沸騰時的溫度']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 分類（classify）──────────────────────────────────────────────────
     spec: { groups:[{label, items:[..], note}] }                         */
  REG.classify = function (host, spec) {
    var gs = spec.groups || [];
    var box = div('wg');
    var COLORS = ['accent', 'good', 'bad', 'dim'];
    gs.forEach(function (g, i) {
      var row = div('wg-ctrl');
      row.style.cssText = 'justify-content:flex-start;margin-top:.5rem;gap:.35rem';
      var tag = div('wg-chip on', g.label);
      tag.style.background = 'var(--' + COLORS[i % 4] + ')';
      tag.style.borderColor = 'var(--' + COLORS[i % 4] + ')';
      row.appendChild(tag);
      (g.items || []).forEach(function (it) { row.appendChild(div('wg-chip', it)); });
      box.appendChild(row);
      if (g.note) {
        var n = div('wg-read-sub', g.note);
        n.style.marginTop = '.15rem';
        box.appendChild(n);
      }
    });
    if (spec.caption) box.appendChild(div('wg-read-sub', spec.caption));
    host.appendChild(box);
  };

  /* ── 導數：割線變切線（deriv）─────────────────────────────────────────
     h 越小，割線越貼近切線；斜率的極限就是導數。
     spec: { x0, h }（畫的是 y ＝ x²）                                     */
  REG.deriv = function (host, spec) {
    var x0 = spec.x0 == null ? 1 : spec.x0;
    var h = spec.h == null ? 1 : spec.h;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 220', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var L = 24, B = 190, u = 46;
    function X(x) { return L + x * u; }
    function Y(y) { return B - y * u * 0.42; }
    function f(x) { return x * x; }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('line', { x1: L, y1: B, x2: 310, y2: B }, 'stroke:var(--text);stroke-width:2'));
      svg.appendChild(el('line', { x1: L, y1: B, x2: L, y2: 14 }, 'stroke:var(--text);stroke-width:2'));
      var pts = [], i, x;
      for (i = 0; i <= 120; i++) {
        x = 6 * i / 120;
        if (Y(f(x)) > 10) pts.push(X(x).toFixed(1) + ',' + Y(f(x)).toFixed(1));
      }
      svg.appendChild(el('polyline', { points: pts.join(' ') },
        'fill:none;stroke:var(--accent);stroke-width:3'));
      var x1 = x0 + h, m = (f(x1) - f(x0)) / h;
      // 割線畫長一點
      var ex = 2.2;
      svg.appendChild(el('line', { x1: X(x0 - ex), y1: Y(f(x0) - m * ex),
        x2: X(x1 + ex), y2: Y(f(x1) + m * ex) }, 'stroke:var(--bad);stroke-width:2.5'));
      [[x0, f(x0)], [x1, f(x1)]].forEach(function (p) {
        svg.appendChild(el('circle', { cx: X(p[0]), cy: Y(p[1]), r: 5 }, 'fill:var(--good)'));
      });
      svg.appendChild(txt(X(x0) - 16, Y(f(x0)) + 16, 'x', 'font-size:11px;fill:var(--good)'));
      svg.appendChild(txt(X(x1) + 20, Y(f(x1)) - 12, 'x＋h', 'font-size:11px;fill:var(--good)'));
      read.appendChild(div('wg-read-main',
        'h ＝ ' + h + ' 時，割線斜率 ＝ (f(' + (+x1.toFixed(2)) + ') − f(' + x0 + ')) ÷ ' + h +
        ' ＝ ' + (+m.toFixed(3)) + '　（切線斜率 ＝ ' + (2 * x0) + '）'));
      read.appendChild(div('wg-read-sub',
        '兩點連線叫割線，斜率就是「平均變化率」。把 h 越調越小，第二個點滑向第一個點，' +
        '割線就越來越貼近「切線」。這個極限值就是導數 f′(' + x0 + ') ＝ ' + (2 * x0) +
        '，代表那一瞬間的變化率（瞬時速度就是這樣定義的）。'));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [1, 0.5, 0.2, 0.05].forEach(function (v) {
        row.appendChild(btn('h ＝ ' + v, function () { h = v; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 函數圖形與導數（curveplot）───────────────────────────────────────
     spec: { fn:'cubic'|'quad'|'rational', pick }                         */
  REG.curveplot = function (host, spec) {
    var F = {
      cubic: {
        f: function (x) { return x * x * x - 3 * x; }, lo: -2.6, hi: 2.6, ylo: -5, yhi: 5,
        marks: [{ x: -1, label: '極大 (−1, 2)', c: 'bad' }, { x: 1, label: '極小 (1, −2)', c: 'bad' },
                { x: 0, label: '反曲點 (0, 0)', c: 'good' }],
        name: 'y ＝ x³ − 3x',
        desc: 'f′(x) ＝ 3x² − 3 ＝ 0 → x ＝ ±1，這兩點就是極值：x ＝ −1 由增轉減（極大）、' +
          'x ＝ 1 由減轉增（極小）。f″(x) ＝ 6x ＝ 0 → x ＝ 0 是反曲點（凹向在這裡翻轉）。'
      },
      quad: {
        f: function (x) { return x * x - 6 * x; }, lo: -1, hi: 7, ylo: -10, yhi: 8,
        marks: [{ x: 3, label: '頂點 (3, −9)', c: 'bad' }],
        name: 'y ＝ x² − 6x',
        desc: 'f′(x) ＝ 2x − 6：x < 3 時 f′ < 0（遞減）、x > 3 時 f′ > 0（遞增），' +
          '所以 x ＝ 3 是最低點。f″(x) ＝ 2 > 0 恆成立 → 整條曲線都凹向上。'
      },
      rational: {
        f: function (x) { return (2 * x + 1) / (x - 3); }, lo: -4, hi: 9, ylo: -8, yhi: 10,
        marks: [], name: 'y ＝ (2x ＋ 1)/(x − 3)',
        desc: 'x ＝ 3 會讓分母為 0 → 垂直漸近線；x 很大時分子分母都由最高次主導，' +
          'y 趨近 2/1 ＝ 2 → 水平漸近線 y ＝ 2。分式函數先找這兩條線，圖形就八九不離十了。'
      }
    };
    var kind = F[spec.fn] ? spec.fn : 'cubic';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 230', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var g = F[kind];
      function X(x) { return 20 + (x - g.lo) / (g.hi - g.lo) * 280; }
      function Y(y) { return 210 - (y - g.ylo) / (g.yhi - g.ylo) * 190; }
      svg.appendChild(el('line', { x1: 14, y1: Y(0), x2: 310, y2: Y(0) },
        'stroke:var(--dim);stroke-width:1.5'));
      if (g.lo < 0 && g.hi > 0) svg.appendChild(el('line', { x1: X(0), y1: 12, x2: X(0), y2: 216 },
        'stroke:var(--dim);stroke-width:1.5'));
      var run = [], i, x, y;
      for (i = 0; i <= 300; i++) {
        x = g.lo + (g.hi - g.lo) * i / 300; y = g.f(x);
        if (y > g.ylo && y < g.yhi && isFinite(y)) run.push(X(x).toFixed(1) + ',' + Y(y).toFixed(1));
        else { if (run.length > 1) svg.appendChild(el('polyline', { points: run.join(' ') },
          'fill:none;stroke:var(--accent);stroke-width:3')); run = []; }
      }
      if (run.length > 1) svg.appendChild(el('polyline', { points: run.join(' ') },
        'fill:none;stroke:var(--accent);stroke-width:3'));
      if (kind === 'rational') {
        svg.appendChild(el('line', { x1: X(3), y1: 12, x2: X(3), y2: 216 },
          'stroke:var(--bad);stroke-width:1.5;stroke-dasharray:5 4'));
        svg.appendChild(txt(X(3) + 24, 24, 'x ＝ 3', 'font-size:10px;fill:var(--bad)'));
        svg.appendChild(el('line', { x1: 14, y1: Y(2), x2: 310, y2: Y(2) },
          'stroke:var(--good);stroke-width:1.5;stroke-dasharray:5 4'));
        svg.appendChild(txt(280, Y(2) - 10, 'y ＝ 2', 'font-size:10px;fill:var(--good)'));
      }
      g.marks.forEach(function (m) {
        svg.appendChild(el('circle', { cx: X(m.x), cy: Y(g.f(m.x)), r: 5 },
          'fill:var(--' + m.c + ')'));
        svg.appendChild(txt(X(m.x) + 44, Y(g.f(m.x)) - 12, m.label,
          'font-size:10px;fill:var(--' + m.c + ')'));
      });
      read.appendChild(div('wg-read-main', g.name));
      read.appendChild(div('wg-read-sub', g.desc));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['cubic', '三次函數'], ['quad', '二次函數'], ['rational', '分式函數']].forEach(function (k) {
        row.appendChild(btn(k[1], function () { kind = k[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 定積分與黎曼和（integralarea）────────────────────────────────────
     spec: { n, a, b }（畫的是 y ＝ x²）                                   */
  REG.integralarea = function (host, spec) {
    var n = spec.n == null ? 4 : spec.n;
    var a = spec.a == null ? 0 : spec.a, b = spec.b == null ? 3 : spec.b;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 200', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function f(x) { return x * x; }
    var L = 26, B = 170, W = 268, H = 140, ymax = f(b) * 1.05;
    function X(x) { return L + (x - a) / (b - a) * W; }
    function Y(y) { return B - y / ymax * H; }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var dx = (b - a) / n, sum = 0, i, xm;
      for (i = 0; i < n; i++) {
        xm = a + (i + 0.5) * dx;                       // 中點法
        sum += f(xm) * dx;
        svg.appendChild(el('rect', { x: X(a + i * dx), y: Y(f(xm)),
          width: W / n - 1, height: B - Y(f(xm)), 'fill-opacity': '.3' },
          'fill:var(--good);stroke:var(--good);stroke-width:1'));
      }
      var pts = [];
      for (i = 0; i <= 120; i++) {
        var x = a + (b - a) * i / 120;
        pts.push(X(x).toFixed(1) + ',' + Y(f(x)).toFixed(1));
      }
      svg.appendChild(el('polyline', { points: pts.join(' ') },
        'fill:none;stroke:var(--accent);stroke-width:3'));
      svg.appendChild(el('line', { x1: L - 6, y1: B, x2: 310, y2: B }, 'stroke:var(--text);stroke-width:2'));
      svg.appendChild(el('line', { x1: L, y1: B + 6, x2: L, y2: 14 }, 'stroke:var(--text);stroke-width:2'));
      svg.appendChild(txt(X(b), B + 14, String(b), 'font-size:11px;fill:var(--dim)'));
      svg.appendChild(txt(X(a), B + 14, String(a), 'font-size:11px;fill:var(--dim)'));
      var exact = (b * b * b - a * a * a) / 3;
      read.appendChild(div('wg-read-main',
        n + ' 個長方形的總面積 ≈ ' + (+sum.toFixed(4)) + '　（精確值 ' + (+exact.toFixed(4)) + '）'));
      read.appendChild(div('wg-read-sub',
        '把曲線下方切成一條一條長方形，寬 ＝ (b − a) ÷ n、高 ＝ 該處的函數值，加起來就是近似面積。' +
        'n 越大越準——長方形無限多時的極限，就是定積分 ∫x² dx ＝ x³/3。' +
        '所以 ∫(0→3) x² dx ＝ 27/3 ＝ 9。'));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [2, 4, 8, 20].forEach(function (k) {
        row.appendChild(btn(k + ' 條', function () { n = k; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 複數平面（complexplane）──────────────────────────────────────────
     spec: { re, im, mode:'point'|'mult', re2, im2 }                      */
  REG.complexplane = function (host, spec) {
    var re = spec.re == null ? 3 : spec.re, im = spec.im == null ? 4 : spec.im;
    var re2 = spec.re2 == null ? 0 : spec.re2, im2 = spec.im2 == null ? 1 : spec.im2;
    var mode = spec.mode || 'point';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 230', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var cx = 130, cy = 150, u = 30;
    function X(x) { return cx + x * u; }
    function Y(y) { return cy - y * u; }
    function neg(v) { return v < 0 ? '−' + (-v) : String(v); }
    function cstr(a, b) {
      if (a === 0 && b !== 0) return (b === 1 ? 'i' : b === -1 ? '−i' : neg(b) + 'i');
      return neg(a) + (b >= 0 ? ' ＋ ' + (b === 1 ? '' : b) + 'i' : ' − ' + (b === -1 ? '' : -b) + 'i');
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('line', { x1: 14, y1: cy, x2: 310, y2: cy }, 'stroke:var(--dim);stroke-width:1.5'));
      svg.appendChild(el('line', { x1: cx, y1: 14, x2: cx, y2: 220 }, 'stroke:var(--dim);stroke-width:1.5'));
      svg.appendChild(txt(302, cy - 12, '實軸', 'font-size:10px;fill:var(--dim)'));
      svg.appendChild(txt(cx + 26, 20, '虛軸', 'font-size:10px;fill:var(--dim)'));
      function dot(a, b, color, label) {
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: X(a), y2: Y(b) },
          'stroke:var(--' + color + ');stroke-width:2.5'));
        svg.appendChild(el('circle', { cx: X(a), cy: Y(b), r: 5 }, 'fill:var(--' + color + ')'));
        svg.appendChild(txt(X(a) + 36, Y(b) - 12, label,
          'font-size:11px;font-weight:700;fill:var(--' + color + ')'));
      }
      if (mode === 'mult') {
        var pr = re * re2 - im * im2, pi = re * im2 + im * re2;
        dot(re, im, 'accent', cstr(re, im));
        dot(re2, im2, 'good', cstr(re2, im2));
        dot(pr, pi, 'bad', cstr(pr, pi));
        var r1 = Math.hypot(re, im), r2 = Math.hypot(re2, im2);
        var t1 = Math.atan2(im, re) * 180 / Math.PI, t2 = Math.atan2(im2, re2) * 180 / Math.PI;
        read.appendChild(div('wg-read-main',
          '(' + cstr(re, im) + ')(' + cstr(re2, im2) + ') ＝ ' + cstr(pr, pi)));
        read.appendChild(div('wg-read-sub',
          '複數相乘 ＝ 「模相乘、輻角相加」：' + (+r1.toFixed(2)) + ' × ' + (+r2.toFixed(2)) +
          ' ＝ ' + (+(r1 * r2).toFixed(2)) + '；' + (+t1.toFixed(1)) + '° ＋ ' + (+t2.toFixed(1)) +
          '° ＝ ' + (+(t1 + t2).toFixed(1)) + '°。所以乘以 i 就是「逆時針轉 90°」——' +
          '這也是為什麼 i² ＝ −1（轉兩次 90° 就指向負實軸）。'));
      } else {
        dot(re, im, 'accent', cstr(re, im));
        svg.appendChild(el('line', { x1: X(re), y1: Y(im), x2: X(re), y2: cy },
          'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
        var r = Math.hypot(re, im), th = Math.atan2(im, re) * 180 / Math.PI;
        read.appendChild(div('wg-read-main',
          cstr(re, im) + '　模 r ＝ ' + (+r.toFixed(3)) + '　輻角 θ ≈ ' + (+th.toFixed(1)) + '°'));
        read.appendChild(div('wg-read-sub',
          '複數 a ＋ bi 對應平面上的點 (a, b)：實部是橫坐標、虛部是縱坐標。' +
          '模 ＝ √(a² ＋ b²) 是它到原點的距離；輻角是和正實軸的夾角。' +
          '極式寫成 r(cos θ ＋ i sin θ)，乘除和次方用極式最好算（棣美弗定理）。'));
      }
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      row.appendChild(btn('點與極式', function () { mode = 'point'; paint(); }));
      row.appendChild(btn('相乘＝旋轉', function () { mode = 'mult'; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 線性變換（lintrans）──────────────────────────────────────────────
     矩陣乘上圖形＝把圖形旋轉／伸縮／鏡射。
     spec: { m:[[a,b],[c,d]], kind:'rot90'|'scale2'|'flipx'|'shear', pick } */
  REG.lintrans = function (host, spec) {
    var K = {
      rot90: { m: [[0, -1], [1, 0]], name: '逆時針旋轉 90°',
        desc: '(1, 0) 會被送到 (0, 1)、(0, 1) 會被送到 (−1, 0)。矩陣的兩行就是「兩個基本向量被送到哪裡」。' },
      scale2: { m: [[2, 0], [0, 2]], name: '放大 2 倍（伸縮）',
        desc: '對角線是 2、其餘是 0：x 和 y 都變成 2 倍，圖形等比例放大，面積變成 4 倍（行列式 ＝ 4）。' },
      flipx: { m: [[1, 0], [0, -1]], name: '對 x 軸鏡射',
        desc: 'y 坐標變號、x 不動，圖形上下翻。行列式是 −1：面積不變但方向反過來了。' },
      shear: { m: [[1, 1], [0, 1]], name: '推移（剪切）',
        desc: '正方形被推成平行四邊形：越上面推得越多。行列式仍是 1，所以面積沒變。' }
    };
    var kind = K[spec.kind] ? spec.kind : 'rot90';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 220', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var cx = 150, cy = 130, u = 34;
    function P(p) { return [cx + p[0] * u, cy - p[1] * u]; }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var m = K[kind].m;
      svg.appendChild(el('line', { x1: 20, y1: cy, x2: 300, y2: cy }, 'stroke:var(--dim);stroke-width:1.5'));
      svg.appendChild(el('line', { x1: cx, y1: 16, x2: cx, y2: 210 }, 'stroke:var(--dim);stroke-width:1.5'));
      var sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
      svg.appendChild(el('polygon', { points: sq.map(function (p) { return P(p).join(','); }).join(' ') },
        'fill:color-mix(in srgb, var(--dim) 25%, transparent);stroke:var(--dim);stroke-width:2;stroke-dasharray:4 3'));
      var img = sq.map(function (p) {
        return [m[0][0] * p[0] + m[0][1] * p[1], m[1][0] * p[0] + m[1][1] * p[1]];
      });
      svg.appendChild(el('polygon', { points: img.map(function (p) { return P(p).join(','); }).join(' ') },
        'fill:color-mix(in srgb, var(--accent) 25%, transparent);stroke:var(--accent);stroke-width:2.5'));
      svg.appendChild(txt(P([0.5, 0.5])[0], P([0.5, 0.5])[1], '原', 'font-size:11px;fill:var(--dim)'));
      var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      function mm(v) { return v < 0 ? '−' + (-v) : String(v); }
      read.appendChild(div('wg-read-main',
        K[kind].name + '　矩陣 [[' + m[0].map(mm).join(', ') + '], [' + m[1].map(mm).join(', ') +
        ']]，行列式 ＝ ' + mm(det)));
      read.appendChild(div('wg-read-sub', K[kind].desc +
        '　行列式的絕對值 ＝ 面積放大的倍數；負的代表圖形被翻面了。'));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['rot90', '旋轉 90°'], ['scale2', '放大 2 倍'], ['flipx', 'x 軸鏡射'], ['shear', '推移']]
        .forEach(function (k) { row.appendChild(btn(k[1], function () { kind = k[0]; paint(); })); });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 常態分布（normaldist）────────────────────────────────────────────
     spec: { mean, sd, mark, shade:1|2|3 }                                */
  REG.normaldist = function (host, spec) {
    var mu = spec.mean == null ? 75 : spec.mean, sd = spec.sd == null ? 5 : spec.sd;
    var shade = spec.shade == null ? 1 : spec.shade;
    var mark = spec.mark;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var L = 20, R = 300, B = 140;
    function X(z) { return (L + R) / 2 + z * 40; }
    function Yv(z) { return B - Math.exp(-z * z / 2) * 96; }
    var PCT = { 1: '68%', 2: '95%', 3: '99.7%' };
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var pts = [], i, z;
      for (i = 0; i <= 120; i++) {
        z = -3.4 + 6.8 * i / 120;
        pts.push(X(z).toFixed(1) + ',' + Yv(z).toFixed(1));
      }
      var area = [X(-shade) + ',' + B];
      for (i = 0; i <= 60; i++) {
        z = -shade + 2 * shade * i / 60;
        area.push(X(z).toFixed(1) + ',' + Yv(z).toFixed(1));
      }
      area.push(X(shade) + ',' + B);
      svg.appendChild(el('polygon', { points: area.join(' ') },
        'fill:color-mix(in srgb, var(--accent) 30%, transparent);stroke:none'));
      svg.appendChild(el('polyline', { points: pts.join(' ') },
        'fill:none;stroke:var(--accent);stroke-width:3'));
      svg.appendChild(el('line', { x1: L, y1: B, x2: R, y2: B }, 'stroke:var(--text);stroke-width:2'));
      [-3, -2, -1, 0, 1, 2, 3].forEach(function (k) {
        svg.appendChild(el('line', { x1: X(k), y1: B - 4, x2: X(k), y2: B + 4 },
          'stroke:var(--dim);stroke-width:1.5'));
        svg.appendChild(txt(X(k), B + 16, (k === 0 ? 'μ' : (k > 0 ? '＋' : '−') + Math.abs(k) + 'σ'),
          'font-size:10px;fill:var(--dim)'));
        svg.appendChild(txt(X(k), B + 30, String(mu + k * sd), 'font-size:10px;fill:var(--dim)'));
      });
      if (mark != null) {
        var zz = (mark - mu) / sd;
        svg.appendChild(el('line', { x1: X(zz), y1: 20, x2: X(zz), y2: B },
          'stroke:var(--bad);stroke-width:2'));
        svg.appendChild(txt(X(zz), 14, mark + '（Z ＝ ' + (+zz.toFixed(2)) + '）',
          'font-size:11px;font-weight:700;fill:var(--bad)'));
      }
      read.appendChild(div('wg-read-main',
        '平均 ' + mu + '、標準差 ' + sd + '：落在 μ ± ' + shade + 'σ 之間的資料約占 ' + PCT[shade]));
      read.appendChild(div('wg-read-sub',
        '常態分布是中間高、兩邊低的鐘形曲線，對稱於平均數。' +
        '68–95–99.7 法則：±1σ 約 68%、±2σ 約 95%、±3σ 約 99.7%。' +
        'Z 分數 ＝ (資料 − 平均) ÷ 標準差，代表「離平均幾個標準差」，可以拿來比較不同科目的成績。'));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [1, 2, 3].forEach(function (k) {
        row.appendChild(btn('±' + k + 'σ', function () { shade = k; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 散布圖與相關（scatter）───────────────────────────────────────────
     spec: { points:[[x,y],..], line:bool, r }                            */
  REG.scatter = function (host, spec) {
    var P = spec.points || [[1, 2], [2, 3.5], [3, 4], [4, 6], [5, 6.5], [6, 8]];
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    var xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; });
    var xlo = Math.min.apply(null, xs), xhi = Math.max.apply(null, xs);
    var ylo = Math.min.apply(null, ys), yhi = Math.max.apply(null, ys);
    function X(x) { return 34 + (x - xlo) / Math.max(xhi - xlo, 1) * 254; }
    function Y(y) { return 140 - (y - ylo) / Math.max(yhi - ylo, 1) * 108; }
    svg.appendChild(el('line', { x1: 28, y1: 146, x2: 300, y2: 146 }, 'stroke:var(--text);stroke-width:2'));
    svg.appendChild(el('line', { x1: 28, y1: 146, x2: 28, y2: 16 }, 'stroke:var(--text);stroke-width:2'));
    var n = P.length;
    var mx = xs.reduce(function (a, b) { return a + b; }, 0) / n;
    var my = ys.reduce(function (a, b) { return a + b; }, 0) / n;
    var sxy = 0, sxx = 0, syy = 0;
    P.forEach(function (p) {
      sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx);
      syy += (p[1] - my) * (p[1] - my);
    });
    var r = sxy / Math.sqrt(sxx * syy || 1), b1 = sxy / (sxx || 1), b0 = my - b1 * mx;
    if (spec.line !== false) {
      svg.appendChild(el('line', { x1: X(xlo), y1: Y(b0 + b1 * xlo), x2: X(xhi), y2: Y(b0 + b1 * xhi) },
        'stroke:var(--bad);stroke-width:2.5'));
    }
    P.forEach(function (p) {
      svg.appendChild(el('circle', { cx: X(p[0]), cy: Y(p[1]), r: 5 }, 'fill:var(--accent)'));
    });
    box.appendChild(svg);
    box.appendChild(div('wg-read-main',
      '相關係數 r ≈ ' + (+r.toFixed(3)) + '　迴歸直線 y ＝ ' + (+b1.toFixed(2)) + 'x ' +
      (b0 >= 0 ? '＋ ' + (+b0.toFixed(2)) : '− ' + (+Math.abs(b0).toFixed(2)))));
    box.appendChild(div('wg-read-sub',
      'r 介於 −1 和 1：接近 1 是強正相關（一起變大）、接近 −1 是強負相關（一個大另一個小）、' +
      '接近 0 表示看不出線性關係。迴歸直線用來「預測」：把 x 代進去得到 y 的估計值。' +
      '⚠ 相關不等於因果——冰淇淋銷量和溺水人數高度相關，但兇手是夏天。'));
    host.appendChild(box);
  };

  /* ── 條件機率（condprob）──────────────────────────────────────────────
     spec: { a, b, both, total, labelA, labelB }                          */
  REG.condprob = function (host, spec) {
    var total = spec.total == null ? 40 : spec.total;
    var both = spec.both == null ? 8 : spec.both;
    var a = spec.a == null ? 18 : spec.a, b = spec.b == null ? 20 : spec.b;
    var la = spec.labelA || 'A', lb = spec.labelB || 'B';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    svg.appendChild(el('rect', { x: 10, y: 12, width: 300, height: 130, rx: 10 },
      'fill:none;stroke:var(--dim);stroke-width:1.5'));
    svg.appendChild(txt(28, 24, '全體 ' + total, 'font-size:10px;fill:var(--dim)'));
    svg.appendChild(el('circle', { cx: 130, cy: 78, r: 56, 'fill-opacity': '.22' },
      'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
    svg.appendChild(el('circle', { cx: 196, cy: 78, r: 56, 'fill-opacity': '.22' },
      'fill:var(--good);stroke:var(--good);stroke-width:2'));
    svg.appendChild(txt(96, 78, String(a - both), 'font-size:14px;font-weight:700'));
    svg.appendChild(txt(163, 78, String(both), 'font-size:14px;font-weight:700'));
    svg.appendChild(txt(230, 78, String(b - both), 'font-size:14px;font-weight:700'));
    svg.appendChild(txt(90, 30, la, 'font-size:12px;fill:var(--accent)'));
    svg.appendChild(txt(238, 30, lb, 'font-size:12px;fill:var(--good)'));
    svg.appendChild(txt(163, 156, '兩個都不是的有 ' + (total - a - b + both) + ' 個',
      'font-size:10px;fill:var(--dim)'));
    box.appendChild(svg);
    box.appendChild(div('wg-read-main',
      'P(' + la + '|' + lb + ') ＝ ' + both + ' ÷ ' + b + ' ＝ ' + (+(both / b).toFixed(3)) +
      '　（而 P(' + la + ') ＝ ' + a + ' ÷ ' + total + ' ＝ ' + (+(a / total).toFixed(3)) + '）'));
    box.appendChild(div('wg-read-sub',
      '條件機率 P(A|B) 的意思是「已知 B 發生了，A 也發生的機率」——' +
      '重點是分母從「全體」縮小成「B 的範圍」。公式：P(A|B) ＝ P(A∩B) ÷ P(B)。' +
      '如果 P(A|B) ＝ P(A)（知道 B 沒有改變 A 的機率），就說兩事件獨立。'));
    host.appendChild(box);
  };

  /* ── 單位圓（unitcircle）──────────────────────────────────────────────
     用單位圓定義三角函數：x 坐標就是 cos、y 坐標就是 sin，角度可以超過 90°。
     spec: { deg, edit }                                                  */
  REG.unitcircle = function (host, spec) {
    var deg = spec.deg == null ? 30 : spec.deg;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 250', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var cx = 160, cy = 125, R = 92;
    function fmtN(v) { v = +v.toFixed(3); return v < 0 ? '−' + (-v) : String(v); }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var t = deg * Math.PI / 180;
      var px = cx + R * Math.cos(t), py = cy - R * Math.sin(t);
      svg.appendChild(el('line', { x1: cx - 120, y1: cy, x2: cx + 120, y2: cy },
        'stroke:var(--dim);stroke-width:1.5'));
      svg.appendChild(el('line', { x1: cx, y1: cy - 118, x2: cx, y2: cy + 118 },
        'stroke:var(--dim);stroke-width:1.5'));
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: R },
        'fill:none;stroke:var(--text);stroke-width:2'));
      svg.appendChild(el('path', { d: 'M' + (cx + 26) + ',' + cy + ' A 26 26 0 ' +
        (deg > 180 ? 1 : 0) + ' 0 ' + (cx + 26 * Math.cos(t)) + ',' + (cy - 26 * Math.sin(t)) },
        'fill:none;stroke:var(--bad);stroke-width:2'));
      svg.appendChild(el('line', { x1: cx, y1: cy, x2: px, y2: py },
        'stroke:var(--accent);stroke-width:2.5'));
      svg.appendChild(el('line', { x1: px, y1: py, x2: px, y2: cy },
        'stroke:var(--good);stroke-width:2;stroke-dasharray:4 3'));
      svg.appendChild(el('line', { x1: px, y1: cy, x2: cx, y2: cy },
        'stroke:var(--bad);stroke-width:2;stroke-dasharray:4 3'));
      svg.appendChild(el('circle', { cx: px, cy: py, r: 5 }, 'fill:var(--accent)'));
      svg.appendChild(txt(px + (px > cx ? 40 : -40), py - 14,
        '(cos, sin)', 'font-size:11px;fill:var(--accent)'));
      svg.appendChild(txt((px + cx) / 2, cy + 16, 'cos', 'font-size:11px;fill:var(--bad)'));
      svg.appendChild(txt(px + (px > cx ? 20 : -20), (py + cy) / 2, 'sin',
        'font-size:11px;fill:var(--good)'));
      var rad = deg / 180;
      var q = deg % 360;
      var quad = q === 0 || q === 90 || q === 180 || q === 270 ? '軸上'
        : q < 90 ? '第一象限' : q < 180 ? '第二象限' : q < 270 ? '第三象限' : '第四象限';
      read.appendChild(div('wg-read-main',
        deg + '° ＝ ' + (+rad.toFixed(3)) + 'π 弧度　cos ＝ ' + fmtN(Math.cos(t)) +
        '　sin ＝ ' + fmtN(Math.sin(t))));
      read.appendChild(div('wg-read-sub',
        '單位圓（半徑 1）上的點，x 坐標就是 cos θ、y 坐標就是 sin θ。' +
        '這樣定義的好處：角度可以超過 90°，甚至是負的。目前在' + quad +
        '，所以 cos ' + (Math.cos(t) >= 0 ? '為正' : '為負') + '、sin ' +
        (Math.sin(t) >= 0 ? '為正' : '為負') + '。' +
        '弧度換算：180° ＝ π 弧度，所以「度 × π ÷ 180」就是弧度。'));
    }
    if (spec.edit !== false) {
      var row = div('wg-ctrl');
      [30, 90, 150, 210, 300].forEach(function (d) {
        row.appendChild(btn(d + '°', function () { deg = d; paint(); }));
      });
      box.appendChild(row);
      var r2 = div('wg-ctrl');
      r2.appendChild(slider(0, 360, deg, 5, function (v) { deg = v; paint(); }));
      box.appendChild(r2);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 三角函數的圖形（trigwave）────────────────────────────────────────
     y = a·sin(bx) + c：a 管振幅、b 管週期、c 管上下平移。
     spec: { a, b, c, fn:'sin'|'cos', edit }                              */
  REG.trigwave = function (host, spec) {
    var a = spec.a == null ? 1 : spec.a, b = spec.b == null ? 1 : spec.b;
    var c = spec.c == null ? 0 : spec.c, fn = spec.fn || 'sin';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 200', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var L = 26, R = 306, MID = 100, AMP = 34;
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('line', { x1: L, y1: MID, x2: R, y2: MID },
        'stroke:var(--dim);stroke-width:1.5'));
      svg.appendChild(el('line', { x1: L, y1: 16, x2: L, y2: 184 },
        'stroke:var(--dim);stroke-width:1.5'));
      // 橫軸走兩個 2π
      var span = 4 * Math.PI, pts = [], i, x, y;
      for (i = 0; i <= 300; i++) {
        x = span * i / 300;
        y = a * (fn === 'cos' ? Math.cos(b * x) : Math.sin(b * x)) + c;
        pts.push((L + (R - L) * i / 300).toFixed(1) + ',' + (MID - y * AMP).toFixed(1));
      }
      svg.appendChild(el('polyline', { points: pts.join(' ') },
        'fill:none;stroke:var(--accent);stroke-width:3'));
      if (c !== 0) {
        svg.appendChild(el('line', { x1: L, y1: MID - c * AMP, x2: R, y2: MID - c * AMP },
          'stroke:var(--good);stroke-width:1.5;stroke-dasharray:5 4'));
        svg.appendChild(txt(R - 24, MID - c * AMP - 10, '中線 y ＝ ' + c,
          'font-size:10px;fill:var(--good)'));
      }
      [1, 2, 3, 4].forEach(function (k) {
        var xx = L + (R - L) * (k * Math.PI) / span;
        svg.appendChild(txt(xx, MID + 14, k === 1 ? 'π' : k + 'π', 'font-size:10px;fill:var(--dim)'));
      });
      var period = 2 / Math.abs(b);
      read.appendChild(div('wg-read-main',
        'y ＝ ' + (a === 1 ? '' : a) + fn + '(' + (b === 1 ? '' : b) + 'x)' +
        (c === 0 ? '' : c > 0 ? ' ＋ ' + c : ' − ' + (-c)) +
        '　振幅 ' + Math.abs(a) + '　週期 ' + (period === 1 ? '' : +period.toFixed(2)) + 'π'));
      read.appendChild(div('wg-read-sub',
        '振幅 |a| ＝ 上下擺動的幅度（最大值 ' + (Math.abs(a) + c) + '、最小值 ' + (c - Math.abs(a)) +
        '）；週期 ＝ 2π ÷ |b|，b 越大波越密；c 把整條線上下平移（中線變成 y ＝ ' + c + '）。' +
        'sin 從中線出發、cos 從最高點出發，兩者相差 π/2 的平移。'));
    }
    if (spec.edit !== false) {
      var sa = stepper('a 振幅', function () { return a; }, function (v) { a = v || 1; }, -3, 3,
        function () { sa.sync(); paint(); });
      var sb = stepper('b 週期', function () { return b; }, function (v) { b = v || 1; }, 1, 4,
        function () { sb.sync(); paint(); });
      var sc = stepper('c 平移', function () { return c; }, function (v) { c = v; }, -2, 2,
        function () { sc.sync(); paint(); });
      box.appendChild(sa.el); box.appendChild(sb.el); box.appendChild(sc.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 極限與無窮級數（limit）───────────────────────────────────────────
     spec: { values:[..], limit, mode:'terms'|'sum', a1, r, n, label }    */
  REG.limit = function (host, spec) {
    var mode = spec.mode || 'terms';
    var vals, lim, note;
    if (mode === 'sum') {
      var a1 = spec.a1 == null ? 4 : spec.a1, r = spec.r == null ? 0.5 : spec.r;
      var n = spec.n == null ? 8 : spec.n, s = 0;
      vals = [];
      for (var i = 0; i < n; i++) { s += a1 * Math.pow(r, i); vals.push(s); }
      lim = a1 / (1 - r);
      note = '無窮等比級數：只要公比 |r| < 1，一直加下去會越來越靠近 a₁ ÷ (1 − r) ＝ ' +
        a1 + ' ÷ (1 − ' + r + ') ＝ ' + (+lim.toFixed(3)) +
        '。每次加的量越來越小，所以總和不會爆掉——這就是「收斂」。' +
        '⚠ |r| ≥ 1 的話越加越大，沒有和（發散）。';
    } else {
      vals = spec.values || [2, 1.5, 1.33, 1.25, 1.2, 1.17, 1.14, 1.13];
      lim = spec.limit == null ? 1 : spec.limit;
      note = spec.note || '把 n 一直加大，數列的值會越來越靠近某一個數，那個數就是極限。' +
        '越靠近但不一定真的等於它——重點是「要多近就能多近」。';
    }
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 160', class: 'wg-svg' });
    var lo = Math.min.apply(null, vals.concat([lim])) - 0.3;
    var hi = Math.max.apply(null, vals.concat([lim])) + 0.3;
    function X(i) { return 30 + (i + 0.5) * (276 / vals.length); }
    function Y(v) { return 130 - (v - lo) / (hi - lo) * 100; }
    svg.appendChild(el('line', { x1: 24, y1: 130, x2: 306, y2: 130 }, 'stroke:var(--text);stroke-width:2'));
    svg.appendChild(el('line', { x1: 24, y1: 130, x2: 24, y2: 16 }, 'stroke:var(--text);stroke-width:2'));
    svg.appendChild(el('line', { x1: 24, y1: Y(lim), x2: 306, y2: Y(lim) },
      'stroke:var(--bad);stroke-width:2;stroke-dasharray:5 4'));
    svg.appendChild(txt(276, Y(lim) - 10, '極限 ' + (+lim.toFixed(3)),
      'font-size:11px;fill:var(--bad)'));
    vals.forEach(function (v, i) {
      svg.appendChild(el('circle', { cx: X(i), cy: Y(v), r: 4 }, 'fill:var(--accent)'));
      if (i < 6) svg.appendChild(txt(X(i), Y(v) - 12, String(+v.toFixed(2)),
        'font-size:9px;fill:var(--dim)'));
      svg.appendChild(txt(X(i), 144, String(i + 1), 'font-size:9px;fill:var(--dim)'));
    });
    box.appendChild(svg);
    box.appendChild(div('wg-read-main', mode === 'sum'
      ? '部分和越來越靠近 ' + (+lim.toFixed(3))
      : '數列越來越靠近 ' + (+lim.toFixed(3))));
    box.appendChild(div('wg-read-sub', note));
    host.appendChild(box);
  };

  /* ── 空間坐標與平面（space3d）─────────────────────────────────────────
     spec: { point:[x,y,z], mode:'point'|'plane', normal:[a,b,c] }        */
  REG.space3d = function (host, spec) {
    var P = spec.point || [2, 3, 2];
    var mode = spec.mode || 'point';
    var N = spec.normal || [2, 3, -1];
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 220', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var O = [120, 150], u = 26;
    function co(v) { return Math.abs(v) === 1 ? (v < 0 ? '−' : '') : String(v); }   // 係數 1 不寫出來
    // 等角投影：x 往左下、y 往右、z 往上
    function pt(x, y, z) {
      return [O[0] - x * u * 0.6 + y * u, O[1] + x * u * 0.34 - z * u];
    }
    function line(p, q, style) {
      svg.appendChild(el('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1] }, style));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var AX = 'stroke:var(--dim);stroke-width:2';
      line(pt(0, 0, 0), pt(4, 0, 0), AX); line(pt(0, 0, 0), pt(0, 5, 0), AX);
      line(pt(0, 0, 0), pt(0, 0, 4), AX);
      svg.appendChild(txt(pt(4.4, 0, 0)[0], pt(4.4, 0, 0)[1], 'x', 'font-size:11px;fill:var(--dim)'));
      svg.appendChild(txt(pt(0, 5.4, 0)[0], pt(0, 5.4, 0)[1], 'y', 'font-size:11px;fill:var(--dim)'));
      svg.appendChild(txt(pt(0, 0, 4.4)[0], pt(0, 0, 4.4)[1], 'z', 'font-size:11px;fill:var(--dim)'));
      if (mode === 'plane') {
        var quad = [pt(3, 0, 0), pt(0, 3, 0), pt(-1.4, 0, 2.4), pt(1.6, -3, 2.4)];
        svg.appendChild(el('polygon', { points: quad.map(function (q) { return q.join(','); }).join(' ') },
          'fill:color-mix(in srgb, var(--accent) 22%, transparent);stroke:var(--accent);stroke-width:2'));
        var c0 = pt(0.8, 0, 1.2), c1 = pt(0.8 + N[0] * 0.5, N[1] * 0.5, 1.2 + N[2] * 0.5);
        line(c0, c1, 'stroke:var(--bad);stroke-width:3');
        svg.appendChild(el('circle', { cx: c1[0], cy: c1[1], r: 4 }, 'fill:var(--bad)'));
        svg.appendChild(txt(c1[0] + 26, c1[1] - 8, '法向量', 'font-size:11px;fill:var(--bad)'));
        read.appendChild(div('wg-read-main',
          '平面 ' + co(N[0]) + 'x ＋ ' + co(N[1]) + 'y ' +
          (N[2] < 0 ? '− ' + co(-N[2]) : '＋ ' + co(N[2])) +
          'z ＋ d ＝ 0 的法向量 ＝ (' + N.join(', ') + ')'));
        read.appendChild(div('wg-read-sub',
          '平面方程式 ax ＋ by ＋ cz ＋ d ＝ 0 裡，x、y、z 的係數直接就是法向量（垂直於平面的方向）。' +
          '兩平面平行 ⟺ 法向量平行；兩平面垂直 ⟺ 法向量互相垂直（內積 0）。' +
          '點到平面的距離 ＝ |ax₀＋by₀＋cz₀＋d| ÷ √(a²＋b²＋c²)，和平面版的點到直線公式長得一樣。'));
      } else {
        line(pt(0, 0, 0), pt(P[0], P[1], 0), 'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3');
        line(pt(P[0], P[1], 0), pt(P[0], P[1], P[2]),
          'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3');
        line(pt(0, 0, 0), pt(P[0], P[1], P[2]), 'stroke:var(--accent);stroke-width:2.5');
        var q2 = pt(P[0], P[1], P[2]);
        svg.appendChild(el('circle', { cx: q2[0], cy: q2[1], r: 5 }, 'fill:var(--accent)'));
        svg.appendChild(txt(q2[0] + 34, q2[1] - 10, '(' + P.join(', ') + ')',
          'font-size:11px;font-weight:700;fill:var(--accent)'));
        var d = Math.sqrt(P[0] * P[0] + P[1] * P[1] + P[2] * P[2]);
        read.appendChild(div('wg-read-main',
          '到原點的距離 ＝ √(' + (P[0] * P[0]) + ' ＋ ' + (P[1] * P[1]) + ' ＋ ' + (P[2] * P[2]) +
          ') ＝ ' + (+d.toFixed(3))));
        read.appendChild(div('wg-read-sub',
          '空間坐標 (x, y, z)：先在地面走 x 和 y，再往上走 z（虛線就是這條路徑）。' +
          '距離公式只是平面版多加一項：√(x² ＋ y² ＋ z²)，一樣是畢氏定理用兩次。'));
      }
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      row.appendChild(btn('空間中的點', function () { mode = 'point'; paint(); }));
      row.appendChild(btn('平面與法向量', function () { mode = 'plane'; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 排列與組合（counting）────────────────────────────────────────────
     spec: { kind:'tree'|'perm'|'comb', groups:[{label,n}], n, r }        */
  REG.counting = function (host, spec) {
    var kind = spec.kind || 'perm';
    var box = div('wg');
    var read = div('wg-read');
    if (kind === 'tree') {
      var gs = spec.groups || [{ label: '上衣', n: 2 }, { label: '褲子', n: 3 }];
      var total = gs.reduce(function (a, g) { return a * g.n; }, 1);
      var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
      var xs = [[160]], y = 26;
      svg.appendChild(el('circle', { cx: 160, cy: y, r: 5 }, 'fill:var(--dim)'));
      gs.forEach(function (g, gi) {
        var prev = xs[gi], next = [], y2 = y + 44 * (gi + 1);
        var cnt = prev.length * g.n, i = 0;
        prev.forEach(function (px) {
          for (var k = 0; k < g.n; k++) {
            var nx = 20 + (280 / (cnt + 1)) * (++i);
            next.push(nx);
            svg.appendChild(el('line', { x1: px, y1: y2 - 44 + 6, x2: nx, y2: y2 - 6 },
              'stroke:var(--border);stroke-width:1.5'));
            svg.appendChild(el('circle', { cx: nx, cy: y2, r: 5 },
              'fill:var(--' + (gi === gs.length - 1 ? 'good' : 'accent') + ')'));
          }
        });
        svg.appendChild(txt(16, y2, g.label, 'font-size:10px;fill:var(--dim)'));
        xs.push(next);
      });
      box.appendChild(svg);
      read.appendChild(div('wg-read-main',
        gs.map(function (g) { return g.n; }).join(' × ') + ' ＝ ' + total + ' 種'));
      read.appendChild(div('wg-read-sub',
        '乘法原理：一件事分成幾個步驟完成，每個步驟的選擇數「相乘」。' +
        '⚠ 如果是「只能選其中一種」（例如買蛋糕『或』派），那要用加法原理相加，不是相乘。'));
    } else {
      var n = spec.n == null ? 4 : spec.n, r = spec.r == null ? 2 : spec.r;
      var LET = 'ABCDEFGH'.slice(0, n).split('');
      var list = [], i2, j2;
      for (i2 = 0; i2 < n; i2++) {
        for (j2 = 0; j2 < n; j2++) {
          if (i2 === j2) continue;
          if (kind === 'comb' && i2 > j2) continue;
          list.push(LET[i2] + LET[j2]);
        }
      }
      var wrap = div('wg-chips');
      list.forEach(function (s) { wrap.appendChild(div('wg-chip on', s)); });
      box.appendChild(wrap);
      function fact(k) { return k <= 1 ? 1 : k * fact(k - 1); }
      var P = fact(n) / fact(n - r), C = P / fact(r);
      read.appendChild(div('wg-read-main', kind === 'comb'
        ? 'C(' + n + ', ' + r + ') ＝ ' + C + ' 種（不管順序）'
        : 'P(' + n + ', ' + r + ') ＝ ' + P + ' 種（順序不同算不同）'));
      read.appendChild(div('wg-read-sub',
        '排列 P(n, r) ＝ n × (n−1) × … 連乘 r 個；組合 C(n, r) ＝ P(n, r) ÷ r!。' +
        '差別只有一件事：AB 和 BA 算不算同一種。選班長和副班長（有職位）→ 排列；' +
        '選兩個人去打掃（沒差別）→ 組合。所以組合數一定比排列數少。'));
    }
    box.appendChild(read);
    host.appendChild(box);
  };

  /* ── 平面向量（vector）────────────────────────────────────────────────
     spec: { a:[x,y], b:[x,y], mode:'add'|'sub'|'scale'|'dot', k, min, max } */
  REG.vector = function (host, spec) {
    var a = spec.a || [3, 1], b = spec.b || [1, 3];
    var mode = spec.mode || 'add', k = spec.k == null ? 2 : spec.k;
    var lo = spec.min == null ? -5 : spec.min, hi = spec.max == null ? 5 : spec.max;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 300', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function neg(v) { return v < 0 ? '−' + (-v) : String(v); }
    function arrow(g, from, to, color, label) {
      var x1 = g.X(from[0]), y1 = g.Y(from[1]), x2 = g.X(to[0]), y2 = g.Y(to[1]);
      var ang = Math.atan2(y2 - y1, x2 - x1), L = 10;
      svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2 },
        'stroke:var(--' + color + ');stroke-width:3'));
      svg.appendChild(el('polygon', { points:
        x2 + ',' + y2 + ' ' + (x2 - L * Math.cos(ang - 0.4)) + ',' + (y2 - L * Math.sin(ang - 0.4)) +
        ' ' + (x2 - L * Math.cos(ang + 0.4)) + ',' + (y2 - L * Math.sin(ang + 0.4)) },
        'fill:var(--' + color + ')'));
      if (label) svg.appendChild(txt((x1 + x2) / 2 + 14, (y1 + y2) / 2 - 10, label,
        'font-size:12px;font-weight:700;fill:var(--' + color + ')'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var g = drawPlane(svg, lo, hi, { quad: false });
      var O = [0, 0], sum = [a[0] + b[0], a[1] + b[1]], dif = [a[0] - b[0], a[1] - b[1]];
      if (mode === 'scale') {
        arrow(g, O, [a[0] * k, a[1] * k], 'good', String(k) + 'a');
        arrow(g, O, a, 'accent', 'a');
        read.appendChild(div('wg-read-main',
          k + ' × (' + a[0] + ', ' + a[1] + ') ＝ (' + (a[0] * k) + ', ' + (a[1] * k) + ')'));
        read.appendChild(div('wg-read-sub',
          '乘一個正數只改變「長度」不改變方向（' + k + ' 倍長）；乘負數會變成反方向。' +
          '兩個向量平行 ⟺ 其中一個是另一個的倍數。'));
      } else if (mode === 'sub') {
        arrow(g, O, a, 'accent', 'a');
        arrow(g, O, b, 'good', 'b');
        arrow(g, b, a, 'bad', 'a − b');
        read.appendChild(div('wg-read-main',
          '(' + a[0] + ', ' + a[1] + ') − (' + b[0] + ', ' + b[1] + ') ＝ (' + neg(dif[0]) + ', ' + neg(dif[1]) + ')'));
        read.appendChild(div('wg-read-sub',
          'a − b 就是「從 b 的箭頭指向 a 的箭頭」那一支。分量各自相減即可。' +
          '記法：終點減起點——向量 AB ＝ B 的坐標 − A 的坐標。'));
      } else if (mode === 'dot') {
        arrow(g, O, a, 'accent', 'a');
        arrow(g, O, b, 'good', 'b');
        var dot = a[0] * b[0] + a[1] * b[1];
        var la = Math.hypot(a[0], a[1]), lb = Math.hypot(b[0], b[1]);
        var th = Math.acos(clamp(dot / (la * lb), -1, 1)) * 180 / Math.PI;
        read.appendChild(div('wg-read-main',
          'a · b ＝ ' + a[0] + '×' + b[0] + ' ＋ ' + a[1] + '×' + b[1] + ' ＝ ' + dot +
          '　夾角約 ' + (+th.toFixed(1)) + '°'));
        read.appendChild(div('wg-read-sub',
          '內積 ＝ 對應分量相乘再相加，算出來是一個「數」不是向量。' +
          '也等於 |a||b|cos θ，所以內積 > 0 是銳角、＝ 0 是直角（互相垂直）、< 0 是鈍角。'));
      } else {
        arrow(g, O, a, 'accent', 'a');
        arrow(g, a, sum, 'good', 'b');
        arrow(g, O, sum, 'bad', 'a ＋ b');
        read.appendChild(div('wg-read-main',
          '(' + a[0] + ', ' + a[1] + ') ＋ (' + b[0] + ', ' + b[1] + ') ＝ (' + sum[0] + ', ' + sum[1] + ')'));
        read.appendChild(div('wg-read-sub',
          '三角形法則：把 b 的起點接到 a 的箭頭上，從原點到最後的箭頭就是 a ＋ b。' +
          '計算上就是分量各自相加。兩個力同時作用時，合力就是這樣算出來的。'));
      }
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['add', '加法'], ['sub', '減法'], ['scale', '係數倍'], ['dot', '內積']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 二次曲線（conic）─────────────────────────────────────────────────
     spec: { kind:'parabola'|'ellipse'|'hyperbola', a, b, pick }          */
  REG.conic = function (host, spec) {
    var kind = spec.kind || 'ellipse';
    var A = spec.a == null ? 5 : spec.a, B = spec.b == null ? 4 : spec.b;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 220', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var cx = 160, cy = 110, u = 20;
    function X(x) { return cx + x * u; }
    function Y(y) { return cy - y * u; }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('line', { x1: 12, y1: cy, x2: 308, y2: cy }, 'stroke:var(--dim);stroke-width:1.5'));
      svg.appendChild(el('line', { x1: cx, y1: 10, x2: cx, y2: 210 }, 'stroke:var(--dim);stroke-width:1.5'));
      var pts = [], i, t;
      if (kind === 'ellipse') {
        svg.appendChild(el('ellipse', { cx: cx, cy: cy, rx: A * u, ry: B * u },
          'fill:none;stroke:var(--accent);stroke-width:3'));
        var c1 = Math.sqrt(Math.abs(A * A - B * B));
        [c1, -c1].forEach(function (f) {
          svg.appendChild(el('circle', { cx: X(f), cy: cy, r: 5 }, 'fill:var(--bad)'));
        });
        svg.appendChild(txt(X(c1), cy + 18, '焦點', 'font-size:10px;fill:var(--bad)'));
        read.appendChild(div('wg-read-main',
          'x²/' + (A * A) + ' ＋ y²/' + (B * B) + ' ＝ 1　→　a ＝ ' + A + '、b ＝ ' + B +
          '、c ＝ ' + (+c1.toFixed(2)) + '（焦點 (±' + (+c1.toFixed(2)) + ', 0)）'));
        read.appendChild(div('wg-read-sub',
          '橢圓：到「兩個焦點」的距離和固定。關係式是 a² ＝ b² ＋ c²（長軸的一半最大）。' +
          '長軸長 ＝ 2a ＝ ' + (2 * A) + '、短軸長 ＝ 2b ＝ ' + (2 * B) +
          '。離心率 e ＝ c/a，介於 0 和 1 之間；e 越接近 0 越圓（e ＝ 0 就是圓）。'));
      } else if (kind === 'hyperbola') {
        [1, -1].forEach(function (s) {
          pts = [];
          for (i = 0; i <= 60; i++) {
            t = -1.6 + 3.2 * i / 60;
            var x = s * A * Math.cosh(t), y = B * Math.sinh(t);
            if (Math.abs(x) < 9 && Math.abs(y) < 5.5) pts.push(X(x).toFixed(1) + ',' + Y(y).toFixed(1));
          }
          if (pts.length > 1) svg.appendChild(el('polyline', { points: pts.join(' ') },
            'fill:none;stroke:var(--accent);stroke-width:3'));
        });
        [1, -1].forEach(function (s) {                    // 漸近線 y = ±(b/a)x
          svg.appendChild(el('line', { x1: X(-7), y1: Y(-s * B / A * 7), x2: X(7), y2: Y(s * B / A * 7) },
            'stroke:var(--good);stroke-width:1.5;stroke-dasharray:5 4'));
        });
        var c2 = Math.sqrt(A * A + B * B);
        [c2, -c2].forEach(function (f) {
          svg.appendChild(el('circle', { cx: X(f), cy: cy, r: 5 }, 'fill:var(--bad)'));
        });
        read.appendChild(div('wg-read-main',
          'x²/' + (A * A) + ' − y²/' + (B * B) + ' ＝ 1　漸近線 y ＝ ±(' + B + '/' + A + ')x'));
        read.appendChild(div('wg-read-sub',
          '雙曲線：到兩焦點的距離「差」固定。它有兩支，越往外越貼近綠色的漸近線但永遠碰不到。' +
          '⚠ 這裡的關係式是 c² ＝ a² ＋ b²（和橢圓不一樣，別記混）。'));
      } else {
        var p = A / 4;                                     // y² = 4px
        pts = [];
        for (i = -60; i <= 60; i++) {
          var yy = i * 0.09, xx = yy * yy / (4 * p);
          if (xx < 8) pts.push(X(xx).toFixed(1) + ',' + Y(yy).toFixed(1));
        }
        svg.appendChild(el('polyline', { points: pts.join(' ') },
          'fill:none;stroke:var(--accent);stroke-width:3'));
        svg.appendChild(el('circle', { cx: X(p), cy: cy, r: 5 }, 'fill:var(--bad)'));
        svg.appendChild(txt(X(p) + 6, cy - 14, '焦點', 'font-size:10px;fill:var(--bad)'));
        svg.appendChild(el('line', { x1: X(-p), y1: 14, x2: X(-p), y2: 206 },
          'stroke:var(--good);stroke-width:1.5;stroke-dasharray:5 4'));
        svg.appendChild(txt(X(-p) - 22, 26, '準線', 'font-size:10px;fill:var(--good)'));
        read.appendChild(div('wg-read-main',
          'y² ＝ ' + (4 * p) + 'x　→　焦點 (' + (+p.toFixed(2)) + ', 0)、準線 x ＝ −' + (+p.toFixed(2))));
        read.appendChild(div('wg-read-sub',
          '拋物線：到「焦點」和到「準線」的距離永遠相等。' +
          '從焦點射出的光碰到拋物面會全部平行射出——手電筒、探照燈、衛星天線都用這個性質。'));
      }
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['parabola', '拋物線'], ['ellipse', '橢圓'], ['hyperbola', '雙曲線']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { kind = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 矩陣（matrix）────────────────────────────────────────────────────
     spec: { A, B, op:'add'|'mul'|'det'|'show' }                          */
  REG.matrix = function (host, spec) {
    var A = spec.A || [[1, 2], [3, 4]], B = spec.B || [[5, 6], [7, 8]];
    var op = spec.op || 'add';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 130', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function drawM(m, x0, y0, color) {
      var rows = m.length, cols = m[0].length, w = 34, h = 28;
      var W = cols * w, H = rows * h;
      svg.appendChild(el('path', { d: 'M' + (x0 + 6) + ',' + y0 + ' L' + x0 + ',' + y0 +
        ' L' + x0 + ',' + (y0 + H) + ' L' + (x0 + 6) + ',' + (y0 + H) },
        'fill:none;stroke:var(--' + color + ');stroke-width:2'));
      svg.appendChild(el('path', { d: 'M' + (x0 + W - 6) + ',' + y0 + ' L' + (x0 + W) + ',' + y0 +
        ' L' + (x0 + W) + ',' + (y0 + H) + ' L' + (x0 + W - 6) + ',' + (y0 + H) },
        'fill:none;stroke:var(--' + color + ');stroke-width:2'));
      m.forEach(function (row, i) {
        row.forEach(function (v, j) {
          svg.appendChild(txt(x0 + j * w + w / 2, y0 + i * h + h / 2, String(v), 'font-size:13px'));
        });
      });
      return W;
    }
    var y0 = 34;
    if (op === 'det') {
      drawM(A, 40, y0, 'accent');
      var d = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      svg.appendChild(txt(190, y0 + 28, '行列式 ＝ ' + A[0][0] + '×' + A[1][1] + ' − ' +
        A[0][1] + '×' + A[1][0] + ' ＝ ' + d, 'font-size:12px;fill:var(--accent)'));
      read.appendChild(div('wg-read-main', 'det ＝ ad − bc ＝ ' + d));
      read.appendChild(div('wg-read-sub',
        '行列式是「主對角線相乘減去副對角線相乘」。它等於這個矩陣把單位正方形變成的平行四邊形面積。' +
        (d === 0 ? '行列式是 0 → 沒有反方陣（圖形被壓扁成一條線，回不去了）。'
                 : '行列式不是 0 → 存在反方陣（乘法反元素）。')));
    } else if (op === 'mul') {
      var C = A.map(function (row) {
        return B[0].map(function (_, j) {
          return row.reduce(function (s, v, k) { return s + v * B[k][j]; }, 0);
        });
      });
      var w1 = drawM(A, 12, y0, 'accent');
      svg.appendChild(txt(12 + w1 + 12, y0 + 28, '×', 'font-size:14px'));
      var w2 = drawM(B, 12 + w1 + 26, y0, 'good');
      svg.appendChild(txt(12 + w1 + w2 + 38, y0 + 28, '＝', 'font-size:14px'));
      drawM(C, 12 + w1 + w2 + 52, y0, 'bad');
      read.appendChild(div('wg-read-main', '第 i 列 × 第 j 行，對應相乘再相加'));
      read.appendChild(div('wg-read-sub',
        '左邊矩陣的「列」配右邊矩陣的「行」：' + A[0][0] + '×' + B[0][0] + ' ＋ ' +
        A[0][1] + '×' + B[1][0] + ' ＝ ' + C[0][0] + '（左上角）。' +
        '⚠ 相乘的條件是「左邊的行數 ＝ 右邊的列數」，而且 AB 通常不等於 BA。'));
    } else {
      var S = A.map(function (row, i) {
        return row.map(function (v, j) { return v + B[i][j]; });
      });
      var wa = drawM(A, 12, y0, 'accent');
      svg.appendChild(txt(12 + wa + 12, y0 + 28, '＋', 'font-size:14px'));
      var wb = drawM(B, 12 + wa + 26, y0, 'good');
      svg.appendChild(txt(12 + wa + wb + 38, y0 + 28, '＝', 'font-size:14px'));
      drawM(S, 12 + wa + wb + 52, y0, 'bad');
      read.appendChild(div('wg-read-main', '同位置的元素相加'));
      read.appendChild(div('wg-read-sub',
        '矩陣加法很單純：對應位置各自相加，大小必須完全一樣才能加。' +
        '（乘法就不是這樣了——那是「列配行」相乘再相加。）'));
    }
    host.appendChild(box);
  };

  /* ── 線性規劃（linprog）───────────────────────────────────────────────
     spec: { vertices:[[x,y],..], f:[p,q] }   目標函數 f ＝ px ＋ qy      */
  REG.linprog = function (host, spec) {
    var V = spec.vertices || [[0, 0], [4, 0], [2, 2], [0, 3]];
    var f = spec.f || [2, 3];
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 220', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var maxX = Math.max.apply(null, V.map(function (p) { return p[0]; })) + 1;
    var maxY = Math.max.apply(null, V.map(function (p) { return p[1]; })) + 1;
    var L = 34, B0 = 180, u = Math.min((296 - L) / maxX, (B0 - 20) / maxY);
    function X(x) { return L + x * u; }
    function Y(y) { return B0 - y * u; }
    svg.appendChild(el('line', { x1: L, y1: B0, x2: 306, y2: B0 }, 'stroke:var(--text);stroke-width:2'));
    svg.appendChild(el('line', { x1: L, y1: B0, x2: L, y2: 14 }, 'stroke:var(--text);stroke-width:2'));
    svg.appendChild(el('polygon', { points: V.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') },
      'fill:color-mix(in srgb, var(--accent) 20%, transparent);stroke:var(--accent);stroke-width:2'));
    var vals = V.map(function (p) { return f[0] * p[0] + f[1] * p[1]; });
    var best = vals.indexOf(Math.max.apply(null, vals));
    V.forEach(function (p, i) {
      svg.appendChild(el('circle', { cx: X(p[0]), cy: Y(p[1]), r: i === best ? 7 : 5 },
        'fill:var(--' + (i === best ? 'bad' : 'good') + ')'));
      svg.appendChild(txt(X(p[0]) + 22, Y(p[1]) - 12, '(' + p[0] + ',' + p[1] + ')→' + vals[i],
        'font-size:10px;fill:var(--' + (i === best ? 'bad' : 'dim') + ')'));
    });
    svg.appendChild(txt(300, B0 + 14, 'x', 'font-size:11px;fill:var(--dim)'));
    svg.appendChild(txt(L - 14, 20, 'y', 'font-size:11px;fill:var(--dim)'));
    box.appendChild(read);
    read.appendChild(div('wg-read-main',
      '目標函數 f ＝ ' + f[0] + 'x ＋ ' + f[1] + 'y　→　最大值 ' + vals[best] +
      '，在頂點 (' + V[best][0] + ', ' + V[best][1] + ')'));
    read.appendChild(div('wg-read-sub',
      '限制條件圍出來的區域叫可行解區域。目標函數的等值線是一組平行線，' +
      '把它往目標方向平移，最後離開可行域的地方一定是「頂點」——' +
      '所以只要把每個頂點代進去比大小就好，不用檢查區域裡的每一個點。'));
    host.appendChild(box);
  };

  /* ── 指數與對數互換（logexp）──────────────────────────────────────────
     log 只是「指數換一種問法」：a^x = b ⟺ log_a b = x。
     spec: { a, x, edit }                                                 */
  REG.logexp = function (host, spec) {
    var a = spec.a == null ? 2 : spec.a, x = spec.x == null ? 5 : spec.x;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var b = Math.pow(a, x);
      svg.appendChild(el('rect', { x: 14, y: 24, width: 136, height: 46, rx: 10, 'fill-opacity': '.18' },
        'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
      svg.appendChild(txt(82, 47, a + '^' + x + ' ＝ ' + b, 'font-size:15px;font-weight:700'));
      svg.appendChild(txt(82, 84, '指數式', 'font-size:11px;fill:var(--dim)'));
      svg.appendChild(el('rect', { x: 170, y: 24, width: 136, height: 46, rx: 10, 'fill-opacity': '.18' },
        'fill:var(--good);stroke:var(--good);stroke-width:2'));
      svg.appendChild(txt(238, 47, 'log' + a + ' ' + b + ' ＝ ' + x, 'font-size:15px;font-weight:700'));
      svg.appendChild(txt(238, 84, '對數式', 'font-size:11px;fill:var(--dim)'));
      svg.appendChild(txt(160, 47, '⟷', 'font-size:16px;fill:var(--dim)'));
      // 冪次表：看得出「指數變 1，數字就乘 a 倍」
      var n = 6, w = 46, x0 = 160 - n * w / 2;
      for (var i = 0; i < n; i++) {
        var on = i === x;
        svg.appendChild(el('rect', { x: x0 + i * w + 2, y: 108, width: w - 4, height: 40, rx: 6,
          'fill-opacity': on ? '.4' : '.12' },
          'fill:var(--' + (on ? 'accent' : 'dim') + ');stroke:var(--border)'));
        svg.appendChild(txt(x0 + i * w + w / 2, 122, a + '^' + i, 'font-size:11px;fill:var(--dim)'));
        svg.appendChild(txt(x0 + i * w + w / 2, 140, String(Math.pow(a, i)), 'font-size:13px;font-weight:700'));
      }
      read.appendChild(div('wg-read-main',
        '「' + a + ' 的幾次方會等於 ' + b + '？」答案 ' + x + '　→　log' + a + ' ' + b + ' ＝ ' + x));
      read.appendChild(div('wg-read-sub',
        'log 不是新東西，它問的就是「指數是多少」。所以 log' + a + ' 1 永遠是 0（任何數 0 次方都是 1）、' +
        'log' + a + ' ' + a + ' 永遠是 1。表格裡指數每加 1，數字就乘 ' + a +
        ' 倍——這也是為什麼「相乘」在對數裡會變成「相加」。'));
    }
    if (spec.edit !== false) {
      var sa = stepper('底數 a', function () { return a; }, function (v) { a = clamp(v, 2, 5); },
        2, 5, function () { sa.sync(); paint(); });
      var sx = stepper('指數 x', function () { return x; }, function (v) { x = v; }, 0, 5,
        function () { sx.sync(); paint(); });
      box.appendChild(sa.el); box.appendChild(sx.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 三角比（trig）────────────────────────────────────────────────────
     sin、cos、tan 就是直角三角形的三組邊長比值。
     spec: { deg, edit }                                                  */
  REG.trig = function (host, spec) {
    var deg = spec.deg == null ? 30 : spec.deg;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 175', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var EXACT = { 30: ['1/2', '√3/2', '1/√3'], 45: ['√2/2', '√2/2', '1'], 60: ['√3/2', '1/2', '√3'] };
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var t = deg * Math.PI / 180, L = 190;
      var A = [60, 140], B = [60 + L * Math.cos(t), 140], C = [B[0], 140 - L * Math.sin(t)];
      svg.appendChild(el('polygon', { points: A.join(',') + ' ' + B.join(',') + ' ' + C.join(',') },
        'fill:color-mix(in srgb, var(--accent) 14%, transparent);stroke:var(--accent);stroke-width:2.5'));
      svg.appendChild(el('rect', { x: B[0] - 12, y: B[1] - 12, width: 12, height: 12 },
        'fill:none;stroke:var(--dim);stroke-width:1.5'));
      svg.appendChild(el('path', { d: 'M' + (A[0] + 30) + ',140 A 30 30 0 0 0 ' +
        (A[0] + 30 * Math.cos(t)) + ',' + (140 - 30 * Math.sin(t)) },
        'fill:none;stroke:var(--bad);stroke-width:2'));
      svg.appendChild(txt(A[0] + 42, 128, deg + '°', 'font-size:12px;font-weight:700;fill:var(--bad)'));
      svg.appendChild(txt((A[0] + B[0]) / 2, 156, '鄰邊', 'font-size:11px;fill:var(--good)'));
      svg.appendChild(txt(B[0] + 24, (B[1] + C[1]) / 2, '對邊', 'font-size:11px;fill:var(--good)'));
      svg.appendChild(txt((A[0] + C[0]) / 2 - 16, (A[1] + C[1]) / 2 - 10, '斜邊',
        'font-size:11px;fill:var(--good)'));
      var s = Math.sin(t), c = Math.cos(t), tn = Math.tan(t);
      var ex = EXACT[deg];
      read.appendChild(div('wg-read-main',
        'sin ' + deg + '° ＝ ' + (+s.toFixed(4)) + '　cos ' + deg + '° ＝ ' + (+c.toFixed(4)) +
        '　tan ' + deg + '° ＝ ' + (+tn.toFixed(4))));
      read.appendChild(div('wg-read-sub',
        'sin ＝ 對邊 ÷ 斜邊、cos ＝ 鄰邊 ÷ 斜邊、tan ＝ 對邊 ÷ 鄰邊（記法：SOH-CAH-TOA）。' +
        (ex ? '這是特殊角，精確值是 sin ＝ ' + ex[0] + '、cos ＝ ' + ex[1] + '、tan ＝ ' + ex[2] + '。' : '') +
        '比值只跟「角度」有關，三角形放大縮小都不會變——因為那是相似三角形。'));
    }
    if (spec.edit !== false) {
      var row = div('wg-ctrl');
      [30, 45, 60].forEach(function (d) {
        row.appendChild(btn(d + '°', function () { deg = d; paint(); }));
      });
      box.appendChild(row);
      var sd = stepper('角度', function () { return deg; }, function (v) { deg = clamp(v, 5, 85); },
        5, 85, function () { sd.sync(); paint(); });
      box.appendChild(sd.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 正弦定理與餘弦定理（triglaw）─────────────────────────────────────
     spec: { mode:'cos'|'sin', b, c, A, B, a }
       cos：已知兩邊 b、c 與夾角 A → 求對邊 a
       sin：已知兩角 A、B 與一邊 a → 求 b                                 */
  REG.triglaw = function (host, spec) {
    var mode = spec.mode || 'cos';
    var b = spec.b == null ? 3 : spec.b, c = spec.c == null ? 5 : spec.c;
    var A = spec.A == null ? (mode === 'cos' ? 120 : 30) : spec.A;
    var B = spec.B == null ? 45 : spec.B, aa = spec.a == null ? 2 : spec.a;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var s1, s2, ang, third, main, sub;
      if (mode === 'cos') {
        s1 = b; s2 = c; ang = A;
        third = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A * Math.PI / 180));
        main = 'a² ＝ ' + b + '² ＋ ' + c + '² − 2×' + b + '×' + c + '×cos ' + A + '°　→　a ＝ ' +
          (+third.toFixed(3));
        sub = '餘弦定理是畢氏定理的加強版：夾角剛好 90° 時 cos 90° ＝ 0，最後一項消失，' +
          '就變回 a² ＝ b² ＋ c²。夾角是鈍角時 cos 為負，那一項變成「加」，所以對邊會更長。' +
          '用時機：已知「兩邊夾一角」求第三邊，或已知三邊求角。';
      } else {
        var C2 = 180 - A - B;
        s1 = aa; ang = A;
        var bb = aa * Math.sin(B * Math.PI / 180) / Math.sin(A * Math.PI / 180);
        s2 = bb; third = C2;
        main = 'a / sin A ＝ b / sin B　→　b ＝ ' + aa + ' × sin ' + B + '° ÷ sin ' + A + '° ＝ ' +
          (+bb.toFixed(3));
        sub = '正弦定理說：每一邊除以它對角的 sin，答案都一樣（而且都等於外接圓直徑 2R）。' +
          '用時機：已知「兩角一邊」或「兩邊與其中一邊的對角」。⚠ 邊要配「它對面的角」，配錯就全錯。';
      }
      // 依邊長比例畫出三角形（cos 模式用夾角 A；sin 模式用算出的兩邊與夾角 C）
      var u = 110 / Math.max(s1, s2, 3);
      var th = (mode === 'cos' ? A : 180 - A - B) * Math.PI / 180;
      var P0 = [80, 145];
      var P1 = [P0[0] + s2 * u, P0[1]];
      var P2 = [P0[0] + s1 * u * Math.cos(th), P0[1] - s1 * u * Math.sin(th)];
      svg.appendChild(el('polygon', { points: P0.join(',') + ' ' + P1.join(',') + ' ' + P2.join(',') },
        'fill:color-mix(in srgb, var(--accent) 14%, transparent);stroke:var(--accent);stroke-width:2.5'));
      svg.appendChild(txt((P0[0] + P1[0]) / 2, P0[1] + 16,
        mode === 'cos' ? 'c ＝ ' + c : 'b ＝ ' + (+s2.toFixed(2)), 'font-size:11px;fill:var(--good)'));
      svg.appendChild(txt((P0[0] + P2[0]) / 2 - 22, (P0[1] + P2[1]) / 2,
        mode === 'cos' ? 'b ＝ ' + b : 'a ＝ ' + aa, 'font-size:11px;fill:var(--good)'));
      svg.appendChild(txt((P1[0] + P2[0]) / 2 + 20, (P1[1] + P2[1]) / 2 - 8,
        mode === 'cos' ? 'a ＝ ?' : 'c', 'font-size:11px;fill:var(--bad)'));
      svg.appendChild(txt(P0[0] + 26, P0[1] - 12,
        (mode === 'cos' ? A : 180 - A - B) + '°', 'font-size:12px;font-weight:700;fill:var(--bad)'));
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      row.appendChild(btn('餘弦定理', function () { mode = 'cos'; paint(); }));
      row.appendChild(btn('正弦定理', function () { mode = 'sin'; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 立體圖形（solid）─────────────────────────────────────────────────
     圓錐、球、柱體、錐體的表面積與體積：圖上標出 r、h、母線，公式當場算給你看。
     spec: { kind:'cone'|'sphere'|'prism'|'pyramid', r, h, l }            */
  REG.solid = function (host, spec) {
    var kind = spec.kind || 'cone';
    var r = spec.r == null ? 3 : spec.r, h = spec.h == null ? 4 : spec.h;
    var l = spec.l == null ? Math.round(Math.sqrt(r * r + h * h) * 100) / 100 : spec.l;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var cx = 150, base = 155, rx = 54, ry = 16, H = 96;
    function ellipse(cy, dashTop) {
      svg.appendChild(el('ellipse', { cx: cx, cy: cy, rx: rx, ry: ry, 'fill-opacity': '.18' },
        'fill:var(--accent);stroke:var(--accent);stroke-width:2' + (dashTop ? ';stroke-dasharray:4 3' : '')));
    }
    function dim(x1, y1, x2, y2, label) {
      svg.appendChild(el('line', { x1: x1, y1: y1, x2: x2, y2: y2 },
        'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
      svg.appendChild(txt((x1 + x2) / 2 + 12, (y1 + y2) / 2, label, 'font-size:11px;fill:var(--good)'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (kind === 'sphere') {
        svg.appendChild(el('circle', { cx: cx, cy: 100, r: 62, 'fill-opacity': '.18' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(el('ellipse', { cx: cx, cy: 100, rx: 62, ry: 18 },
          'fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:4 3'));
        svg.appendChild(el('line', { x1: cx, y1: 100, x2: cx + 62, y2: 100 },
          'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
        svg.appendChild(txt(cx + 31, 88, 'r ＝ ' + r, 'font-size:11px;fill:var(--good)'));
        main = '表面積 ＝ 4πr² ＝ ' + (4 * r * r) + 'π　體積 ＝ (4/3)πr³ ＝ ' +
          (+(4 * r * r * r / 3).toFixed(2)) + 'π';
        sub = '球沒有底面也沒有邊，兩個公式只跟 r 有關。表面積是「4 個大圓面積」，很好記；' +
          '體積的 4/3 記不起來就想成「同半徑圓柱體積的三分之二」。';
      } else if (kind === 'prism') {
        var p = [[cx - 60, base], [cx + 60, base], [cx + 20, base - 34]];
        var top = p.map(function (q) { return [q[0], q[1] - H]; });
        [p, top].forEach(function (t) {
          svg.appendChild(el('polygon', { points: t.map(function (q) { return q.join(','); }).join(' ') },
            'fill:color-mix(in srgb, var(--accent) 16%, transparent);stroke:var(--accent);stroke-width:2'));
        });
        p.forEach(function (q, i) {
          svg.appendChild(el('line', { x1: q[0], y1: q[1], x2: top[i][0], y2: top[i][1] },
            'stroke:var(--accent);stroke-width:2'));
        });
        dim(cx + 66, base, cx + 66, base - H, 'h ＝ ' + h);
        main = '體積 ＝ 底面積 × 高';
        sub = '所有「柱體」都是同一個公式：把底面一層一層疊上去，疊 h 層。' +
          '三角柱、長方體、圓柱都適用，差別只在底面積怎麼算。';
      } else if (kind === 'pyramid') {
        var q0 = [[cx - 58, base], [cx + 58, base], [cx + 30, base - 30], [cx - 86, base - 30]];
        svg.appendChild(el('polygon', { points: q0.map(function (q) { return q.join(','); }).join(' ') },
          'fill:color-mix(in srgb, var(--accent) 16%, transparent);stroke:var(--accent);stroke-width:2'));
        var apex = [cx - 14, base - 30 - H];
        q0.forEach(function (q) {
          svg.appendChild(el('line', { x1: q[0], y1: q[1], x2: apex[0], y2: apex[1] },
            'stroke:var(--accent);stroke-width:2'));
        });
        svg.appendChild(el('line', { x1: apex[0], y1: apex[1], x2: apex[0], y2: base - 15 },
          'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
        svg.appendChild(txt(apex[0] - 22, (apex[1] + base - 15) / 2, 'h ＝ ' + h,
          'font-size:11px;fill:var(--good)'));
        main = '體積 ＝ 底面積 × 高 ÷ 3';
        sub = '所有「錐體」都要除以 3。把錐體裝滿水倒進同底同高的柱體，' +
          '剛好要倒三次才會滿——這就是 ÷ 3 的由來。';
      } else {
        ellipse(base);
        var apex2 = [cx, base - H];
        [-rx, rx].forEach(function (o) {
          svg.appendChild(el('line', { x1: cx + o, y1: base, x2: apex2[0], y2: apex2[1] },
            'stroke:var(--accent);stroke-width:2'));
        });
        // 三個標示各據一方：r 在底下、h 在軸的左邊、l 貼著斜邊，免得疊在一起
        svg.appendChild(el('line', { x1: cx, y1: base, x2: cx + rx, y2: base },
          'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
        svg.appendChild(txt(cx + rx / 2, base + 22, 'r ＝ ' + r, 'font-size:11px;fill:var(--good)'));
        svg.appendChild(el('line', { x1: cx, y1: base, x2: cx, y2: base - H },
          'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
        svg.appendChild(txt(cx - 22, base - H / 2, 'h ＝ ' + h, 'font-size:11px;fill:var(--good)'));
        svg.appendChild(txt(cx + rx / 2 + 26, base - H / 2, 'l ＝ ' + l,
          'font-size:11px;fill:var(--bad)'));
        main = '側面積 ＝ πrl ＝ ' + (r * l) + 'π　　體積 ＝ πr²h ÷ 3 ＝ ' +
          (+(r * r * h / 3).toFixed(2)) + 'π';
        sub = '圓錐的側面攤開來是一個「扇形」，弧長剛好等於底面圓周，所以側面積 ＝ πrl（l 是母線，' +
          '也就是斜邊）。⚠ 側面積用的是母線 l，體積用的是高 h，兩個不一樣，別代錯。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    host.appendChild(box);
    paint();
  };

  /* ── 機率（probtable）─────────────────────────────────────────────────
     把「所有可能」全部畫出來，再把符合條件的塗色——機率就是塗色的比例。
     spec: { kind:'dice2'|'dice1'|'coin'|'balls', cond, want, balls, pick, n } */
  REG.probtable = function (host, spec) {
    var kind = spec.kind || 'dice2';
    var box = div('wg');
    var read = div('wg-read');
    function frac(a, b) {
      if (a === 0) return '0';
      var g = (function (x, y) { while (y) { var t = x % y; x = y; y = t; } return x || 1; })(a, b);
      return (a / g) + '/' + (b / g);
    }
    if (kind === 'dice2') {
      var CONDS = {
        same: [function (i, j) { return i === j; }, '兩顆點數相同'],
        sum12: [function (i, j) { return i + j === 12; }, '點數和為 12'],
        sum7: [function (i, j) { return i + j === 7; }, '點數和為 7'],
        sumeven: [function (i, j) { return (i + j) % 2 === 0; }, '點數和為偶數'],
        sumge10: [function (i, j) { return i + j >= 10; }, '點數和 ≥ 10']
      };
      var cd = CONDS[spec.cond] || CONDS.same;
      var svg = el('svg', { viewBox: '0 0 320 230', class: 'wg-svg' });
      var S = 28, X0 = 40, Y0 = 34, hit = 0;
      for (var i = 1; i <= 6; i++) {
        svg.appendChild(txt(X0 + (i - 0.5) * S, Y0 - 12, String(i), 'font-size:11px;fill:var(--dim)'));
        svg.appendChild(txt(X0 - 14, Y0 + (i - 0.5) * S, String(i), 'font-size:11px;fill:var(--dim)'));
        for (var j = 1; j <= 6; j++) {
          var on = cd[0](i, j);
          if (on) hit++;
          svg.appendChild(el('rect',
            { x: X0 + (i - 1) * S, y: Y0 + (j - 1) * S, width: S - 2, height: S - 2, rx: 4,
              'fill-opacity': on ? '.55' : '.12' },
            'fill:var(--' + (on ? 'good' : 'dim') + ');stroke:var(--border)'));
          svg.appendChild(txt(X0 + (i - 0.5) * S - 1, Y0 + (j - 0.5) * S - 1, String(i + j),
            'font-size:10px;fill:var(--' + (on ? 'text' : 'dim') + ')'));
        }
      }
      svg.appendChild(txt(160, 218, '格子裡的數字是兩顆的點數和', 'font-size:11px;fill:var(--dim)'));
      box.appendChild(svg);
      read.appendChild(div('wg-read-main',
        cd[1] + '　→　' + hit + ' / 36 ＝ ' + frac(hit, 36)));
      read.appendChild(div('wg-read-sub',
        '兩顆骰子一共 6 × 6 ＝ 36 種結果（第一顆 6 種，每一種配第二顆 6 種）。' +
        '把符合條件的格子數一數，除以 36 就是機率。⚠ 「和為 7」和「和為 12」的機率差很多，' +
        '因為湊得出來的組合數不一樣，不能以為每個點數和都一樣容易出現。'));
    } else if (kind === 'coin') {
      var n = spec.n || 2, total = Math.pow(2, n), outs = [], k;
      for (k = 0; k < total; k++) {
        var s = '';
        for (var b = n - 1; b >= 0; b--) s += ((k >> b) & 1) ? '反' : '正';
        outs.push(s);
      }
      var COND = spec.cond || 'allheads';
      var ok2 = function (s2) {
        return COND === 'allheads' ? s2.indexOf('反') < 0 : s2.indexOf('正') >= 0;
      };
      var wrap = div('wg-chips');
      var hit2 = 0;
      outs.forEach(function (s3) {
        var on2 = ok2(s3);
        if (on2) hit2++;
        var c = div('wg-chip' + (on2 ? ' on' : ''), s3);
        wrap.appendChild(c);
      });
      box.appendChild(wrap);
      read.appendChild(div('wg-read-main',
        (COND === 'allheads' ? '全部都是正面' : '至少出現一個正面') +
        '　→　' + hit2 + ' / ' + total + ' ＝ ' + frac(hit2, total)));
      read.appendChild(div('wg-read-sub',
        n + ' 枚硬幣一共 2' + (n === 2 ? '²' : '³') + ' ＝ ' + total + ' 種結果，每一種機率都一樣。' +
        '⚠ 「正反」和「反正」是兩種不同的結果，不能只算一次——這是機率題最常見的錯。'));
    } else if (kind === 'balls') {
      var balls = spec.balls || [{ label: '紅', n: 2 }, { label: '綠', n: 3 }, { label: '藍', n: 5 }];
      var tot = balls.reduce(function (a, b2) { return a + b2.n; }, 0);
      var COLORS = ['bad', 'good', 'accent', 'dim'];
      var svg2 = el('svg', { viewBox: '0 0 320 110', class: 'wg-svg' });
      var idx = 0;
      balls.forEach(function (g2, gi) {
        for (var t = 0; t < g2.n; t++) {
          var col = idx % 10, row = Math.floor(idx / 10);
          svg2.appendChild(el('circle', { cx: 24 + col * 30, cy: 30 + row * 34, r: 12,
            'fill-opacity': (spec.pick && spec.pick !== g2.label) ? '.2' : '.8' },
            'fill:var(--' + COLORS[gi % 4] + ');stroke:var(--' + COLORS[gi % 4] + ');stroke-width:2'));
          svg2.appendChild(txt(24 + col * 30, 30 + row * 34, g2.label, 'font-size:11px'));
          idx++;
        }
      });
      box.appendChild(svg2);
      var want = spec.pick || balls[balls.length - 1].label;
      var cnt = balls.filter(function (g3) { return g3.label === want; })
        .reduce(function (a, b3) { return a + b3.n; }, 0);
      read.appendChild(div('wg-read-main',
        '取到「' + want + '」的機率 ＝ ' + cnt + ' / ' + tot + ' ＝ ' + frac(cnt, tot)));
      read.appendChild(div('wg-read-sub',
        '機率 ＝ 符合條件的個數 ÷ 全部的個數。分母是「全部的球」' + tot +
        ' 顆，不是其他顏色的球數——這是分母最容易寫錯的地方。'));
    } else {
      var want2 = spec.want || [5, 6];
      var svg3 = el('svg', { viewBox: '0 0 320 90', class: 'wg-svg' });
      for (var f = 1; f <= 6; f++) {
        var on3 = want2.indexOf(f) >= 0;
        svg3.appendChild(el('rect', { x: 14 + (f - 1) * 50, y: 24, width: 42, height: 42, rx: 8,
          'fill-opacity': on3 ? '.5' : '.12' },
          'fill:var(--' + (on3 ? 'good' : 'dim') + ');stroke:var(--border);stroke-width:2'));
        svg3.appendChild(txt(35 + (f - 1) * 50, 45, String(f), 'font-size:15px;font-weight:700'));
      }
      box.appendChild(svg3);
      read.appendChild(div('wg-read-main',
        '符合條件的有 ' + want2.length + ' 面　→　' + frac(want2.length, 6)));
      read.appendChild(div('wg-read-sub',
        '一顆公正骰子有 6 種結果、每一種機會均等。機率 ＝ 符合的面數 ÷ 6。' +
        '不可能發生的事（例如出現 7 點）機率是 0，一定發生的事機率是 1。'));
    }
    box.appendChild(read);
    host.appendChild(box);
  };

  /* ── 離散程度（spread）────────────────────────────────────────────────
     兩組平均一樣的資料擺在一起，看「散開的程度」差在哪。
     spec: { a:[..], b:[..], labelA, labelB }                             */
  REG.spread = function (host, spec) {
    var A = spec.a || [78, 79, 80, 81, 82], B = spec.b || [62, 71, 80, 89, 98];
    var la = spec.labelA || '甲', lb = spec.labelB || '乙';
    function mean(v) { return v.reduce(function (a, b) { return a + b; }, 0) / v.length; }
    function sd(v) {
      var m = mean(v);
      return Math.sqrt(v.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / v.length);
    }
    var all = A.concat(B), lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
    var span = Math.max(hi - lo, 1);
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    function X(v) { return 26 + (v - lo) / span * 268; }
    [[A, 46, la, 'accent'], [B, 106, lb, 'good']].forEach(function (row) {
      svg.appendChild(el('line', { x1: 20, y1: row[1] + 16, x2: 300, y2: row[1] + 16 },
        'stroke:var(--border);stroke-width:1.5'));
      svg.appendChild(txt(14, row[1], row[2], 'font-size:11px;fill:var(--dim)'));
      row[0].forEach(function (v) {
        svg.appendChild(el('circle', { cx: X(v), cy: row[1] + 16, r: 5 },
          'fill:var(--' + row[3] + ')'));
      });
      var m = mean(row[0]);
      svg.appendChild(el('line', { x1: X(m), y1: row[1] - 4, x2: X(m), y2: row[1] + 30 },
        'stroke:var(--bad);stroke-width:2;stroke-dasharray:4 3'));
      svg.appendChild(txt(X(m), row[1] - 12, '平均 ' + (+m.toFixed(1)),
        'font-size:10px;fill:var(--bad)'));
    });
    box.appendChild(svg);
    box.appendChild(div('wg-read-main',
      la + '：平均 ' + (+mean(A).toFixed(1)) + '、標準差 ' + (+sd(A).toFixed(2)) + '　　' +
      lb + '：平均 ' + (+mean(B).toFixed(1)) + '、標準差 ' + (+sd(B).toFixed(2))));
    box.appendChild(div('wg-read-sub',
      '兩組的平均可能一模一樣，但「散開的程度」差很多。標準差就是在量這件事：' +
      '每一筆離平均多遠，平方後平均再開根號。標準差小 ＝ 大家擠在平均附近（穩定）；' +
      '標準差大 ＝ 有高有低（起伏大）。全部一樣的資料標準差是 0。'));
    host.appendChild(box);
  };

  /* ── 相似三角形（similar）─────────────────────────────────────────────
     邊長變 k 倍時，周長也是 k 倍，但面積是 k² 倍——這是最常錯的地方。
     spec: { k, edit }                                                    */
  REG.similar = function (host, spec) {
    var k = spec.k == null ? 2 : spec.k;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var u = 26, big = Math.min(k, 3);
      function draw(ox, oy, s, color, name) {
        var p = [[ox, oy], [ox + 3 * u * s, oy], [ox + 0.9 * u * s, oy - 2 * u * s]];
        svg.appendChild(el('polygon', { points: p.map(function (q) { return q.join(','); }).join(' ') },
          'fill:color-mix(in srgb, var(--' + color + ') 16%, transparent);stroke:var(--' + color +
          ');stroke-width:2.5'));
        svg.appendChild(txt(ox + 1.5 * u * s, oy + 14, (3 * s).toFixed(s === 1 ? 0 : 1),
          'font-size:11px;fill:var(--dim)'));
        svg.appendChild(txt(ox - 14, oy - u * s, name, 'font-size:11px;fill:var(--dim)'));
      }
      draw(24, 150, 1, 'accent', '△ABC');
      draw(150, 150, big, 'good', '△DEF');
      read.appendChild(div('wg-read-main',
        '對應邊比 1 : ' + k + '　→　周長比 1 : ' + k + '　面積比 1 : ' + (k * k)));
      read.appendChild(div('wg-read-sub',
        '長度變 ' + k + ' 倍，「長 × 寬」就變 ' + k + ' × ' + k + ' ＝ ' + (k * k) +
        ' 倍，所以面積比是邊長比的平方。反過來：知道面積比是 ' + (k * k) +
        '，邊長比要開根號才是 ' + k + '。'));
    }
    if (spec.edit !== false) {
      var sk = stepper('放大倍數', function () { return k; }, function (v) { k = v; }, 2, 5,
        function () { sk.sync(); paint(); });
      box.appendChild(sk.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 圓周角（circleangles）────────────────────────────────────────────
     spec: { mode:'inscribed'|'semicircle'|'cyclicquad', deg, pick }      */
  REG.circleangles = function (host, spec) {
    var mode = spec.mode || 'inscribed';
    var deg = spec.deg == null ? 80 : spec.deg;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var cx = 160, cy = 95, R = 72;
    function P(t) { return [cx + R * Math.cos(t * Math.PI / 180), cy - R * Math.sin(t * Math.PI / 180)]; }
    function seg(p, q, style) {
      svg.appendChild(el('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1] }, style));
    }
    function dot(p, label, color) {
      svg.appendChild(el('circle', { cx: p[0], cy: p[1], r: 4 }, 'fill:var(--' + color + ')'));
      if (label) svg.appendChild(txt(p[0] + (p[0] > cx ? 14 : -14), p[1] + (p[1] > cy ? 12 : -12),
        label, 'font-size:11px;fill:var(--' + color + ')'));
    }
    function ang(p, a, b) {                       // ∠apb 的度數
      var v1 = [a[0] - p[0], a[1] - p[1]], v2 = [b[0] - p[0], b[1] - p[1]];
      var d = (v1[0] * v2[0] + v1[1] * v2[1]) /
        (Math.hypot(v1[0], v1[1]) * Math.hypot(v2[0], v2[1]));
      return Math.round(Math.acos(clamp(d, -1, 1)) * 180 / Math.PI);
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: R },
        'fill:none;stroke:var(--text);stroke-width:2'));
      var LINE = 'stroke:var(--accent);stroke-width:2';
      var THIN = 'stroke:var(--good);stroke-width:2';
      if (mode === 'semicircle') {
        var A = P(180), B = P(0), Q = P(64);
        seg(A, B, LINE); seg(A, Q, THIN); seg(B, Q, THIN);
        dot(A, 'A', 'accent'); dot(B, 'B', 'accent'); dot(Q, 'P', 'good');
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3 }, 'fill:var(--dim)'));
        svg.appendChild(txt(Q[0], Q[1] + 22, ang(Q, A, B) + '°',
          'font-size:13px;font-weight:700;fill:var(--good)'));
        read.appendChild(div('wg-read-main', '直徑所對的圓周角 ＝ 90°'));
        read.appendChild(div('wg-read-sub',
          'AB 是直徑，圓心角是 180°，圓周角是它的一半 → 90°。' +
          '不管 P 移到圓上哪裡（只要不和 A、B 重合），這個角永遠是直角，所以看到直徑就想到直角三角形。'));
      } else if (mode === 'cyclicquad') {
        var ts = [115, 195, 320, 35], p = ts.map(P);
        seg(p[0], p[1], LINE); seg(p[1], p[2], LINE); seg(p[2], p[3], LINE); seg(p[3], p[0], LINE);
        'ABCD'.split('').forEach(function (n, i) { dot(p[i], n, 'accent'); });
        var a0 = ang(p[0], p[3], p[1]), a2 = ang(p[2], p[1], p[3]);
        svg.appendChild(txt(p[0][0] + 18, p[0][1] + 18, a0 + '°',
          'font-size:12px;font-weight:700;fill:var(--good)'));
        svg.appendChild(txt(p[2][0] - 18, p[2][1] - 16, a2 + '°',
          'font-size:12px;font-weight:700;fill:var(--good)'));
        read.appendChild(div('wg-read-main',
          '對角相加：' + a0 + '° ＋ ' + a2 + '° ＝ ' + (a0 + a2) + '°'));
        read.appendChild(div('wg-read-sub',
          '四個頂點都在圓上的四邊形叫圓內接四邊形，它的兩組對角都互補（相加 180°）。' +
          '因為這兩個角分別對著圓的兩段弧，兩段合起來剛好是一整圈 360°，各取一半就是 180°。'));
      } else {
        var A2 = P(270 - deg / 2), B2 = P(270 + deg / 2), Q1 = P(90), Q2 = P(40);
        seg(A2, [cx, cy], LINE); seg(B2, [cx, cy], LINE);
        seg(A2, Q1, THIN); seg(B2, Q1, THIN);
        seg(A2, Q2, 'stroke:var(--bad);stroke-width:2');
        seg(B2, Q2, 'stroke:var(--bad);stroke-width:2');
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3 }, 'fill:var(--accent)'));
        svg.appendChild(txt(cx, cy - 14, deg + '°（圓心角）',
          'font-size:12px;font-weight:700;fill:var(--accent)'));
        dot(A2, 'A', 'dim'); dot(B2, 'B', 'dim');
        svg.appendChild(txt(Q1[0], Q1[1] + 20, ang(Q1, A2, B2) + '°',
          'font-size:12px;font-weight:700;fill:var(--good)'));
        svg.appendChild(txt(Q2[0] - 16, Q2[1] + 18, ang(Q2, A2, B2) + '°',
          'font-size:12px;font-weight:700;fill:var(--bad)'));
        read.appendChild(div('wg-read-main',
          '圓心角 ' + deg + '°　→　圓周角 ' + (deg / 2) + '°（一半）'));
        read.appendChild(div('wg-read-sub',
          '綠色和紅色的圓周角對的是同一段弧 AB，所以兩個角一樣大，都是圓心角的一半。' +
          '頂點在圓上哪裡都不影響——這就是「同弧上的圓周角相等」。'));
      }
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['inscribed', '圓心角與圓周角'], ['semicircle', '直徑對直角'], ['cyclicquad', '圓內接四邊形']]
        .forEach(function (m) { row.appendChild(btn(m[1], function () { mode = m[0]; paint(); })); });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 直線與圓（circleline）────────────────────────────────────────────
     spec: { mode:'apart'|'tangent'|'secant'|'twotangents', pick }        */
  REG.circleline = function (host, spec) {
    var mode = spec.mode || 'tangent';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var cx = 150, cy = 80, R = 58;
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: R },
        'fill:none;stroke:var(--text);stroke-width:2'));
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: 3 }, 'fill:var(--dim)'));
      svg.appendChild(txt(cx - 12, cy - 10, 'O', 'font-size:11px;fill:var(--dim)'));
      if (mode === 'twotangents') {
        var Px = 290, Py = 80;
        var d = Px - cx, L = Math.sqrt(d * d - R * R);
        var a = Math.asin(R / d);                       // 切線與 OP 的夾角
        [1, -1].forEach(function (s) {
          var t = Math.atan2(0, -1) + s * a;             // 從 P 指向切點的方向
          var tx = Px + L * Math.cos(t), ty = Py + L * Math.sin(t);
          svg.appendChild(el('line', { x1: Px, y1: Py, x2: tx, y2: ty },
            'stroke:var(--accent);stroke-width:2.5'));
          svg.appendChild(el('line', { x1: cx, y1: cy, x2: tx, y2: ty },
            'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
          svg.appendChild(el('circle', { cx: tx, cy: ty, r: 4 }, 'fill:var(--good)'));
        });
        svg.appendChild(el('circle', { cx: Px, cy: Py, r: 4 }, 'fill:var(--bad)'));
        svg.appendChild(txt(Px + 12, Py, 'P', 'font-size:11px;fill:var(--bad)'));
        read.appendChild(div('wg-read-main', '圓外一點可以畫出兩條切線，切線長相等'));
        read.appendChild(div('wg-read-sub',
          '兩條切線長 PA ＝ PB，因為兩個直角三角形（半徑⊥切線、共用 OP、半徑等長）RHS 全等。' +
          '虛線是半徑，它和切線在切點永遠垂直。'));
      } else {
        var d2 = mode === 'apart' ? R + 26 : mode === 'tangent' ? R : R - 30;
        var y = cy + d2;
        svg.appendChild(el('line', { x1: 20, y1: y, x2: 300, y2: y },
          'stroke:var(--accent);stroke-width:2.5'));
        svg.appendChild(el('line', { x1: cx, y1: cy, x2: cx, y2: y },
          'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
        svg.appendChild(txt(cx + 22, cy + d2 / 2, 'd', 'font-size:11px;fill:var(--good)'));
        if (mode !== 'apart') {
          var half = Math.sqrt(R * R - d2 * d2);
          [-half, half].forEach(function (o) {
            if (mode === 'tangent' && o < 0) return;
            svg.appendChild(el('circle', { cx: cx + o, cy: y, r: 4 }, 'fill:var(--bad)'));
          });
        }
        var INFO = {
          apart: ['相離：沒有交點（d > r）', '圓心到直線的距離比半徑大，直線整條在圓外面。'],
          tangent: ['相切：只有 1 個交點（d ＝ r）', '這條直線叫切線，碰到的那一點叫切點。半徑到切點的連線與切線垂直——這是切線最重要的性質。'],
          secant: ['相割：有 2 個交點（d < r）', '直線穿過圓，切出的那一段線段叫弦。從圓心對弦畫垂線，會剛好平分這條弦。']
        }[mode];
        read.appendChild(div('wg-read-main', INFO[0]));
        read.appendChild(div('wg-read-sub', INFO[1] +
          '　判斷方法一律是比較「圓心到直線的距離 d」和「半徑 r」誰大。'));
      }
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['apart', '相離'], ['tangent', '相切'], ['secant', '相割'], ['twotangents', '兩條切線']]
        .forEach(function (m) { row.appendChild(btn(m[1], function () { mode = m[0]; paint(); })); });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 三角形的四心（tricenters）────────────────────────────────────────
     spec: { kind:'circum'|'incenter'|'centroid'|'ortho', pick }          */
  REG.tricenters = function (host, spec) {
    var kind = spec.kind || 'centroid';
    var box = div('wg');
    // 畫布留高一點：鈍角三角形的外接圓半徑很大，太扁的三角形圓會被切掉
    var svg = el('svg', { viewBox: '0 0 320 210', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var A = [90, 145], B = [225, 145], C = [135, 55];
    function mid(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }
    function dist(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
    function foot(p, q, r) {                       // r 到直線 pq 的垂足
      var dx = q[0] - p[0], dy = q[1] - p[1];
      var t = ((r[0] - p[0]) * dx + (r[1] - p[1]) * dy) / (dx * dx + dy * dy);
      return [p[0] + t * dx, p[1] + t * dy];
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var a = dist(B, C), b = dist(A, C), c = dist(A, B);
      var P, extra = [], main, sub;
      if (kind === 'centroid') {
        P = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
        extra = [[A, mid(B, C)], [B, mid(A, C)], [C, mid(A, B)]];
        main = '重心＝三條「中線」的交點';
        sub = '中線是頂點連到對邊中點的線段。重心把每條中線分成 2 : 1（靠近頂點的那段是遠端的兩倍），' +
              '它也是三角形的平衡點，用手指頂在重心可以把紙片撐起來。';
      } else if (kind === 'incenter') {
        P = [(a * A[0] + b * B[0] + c * C[0]) / (a + b + c),
             (a * A[1] + b * B[1] + c * C[1]) / (a + b + c)];
        var s = (a + b + c) / 2;
        var area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
        svg.appendChild(el('circle', { cx: P[0], cy: P[1], r: area / s },
          'fill:none;stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
        extra = [[A, P], [B, P], [C, P]];
        main = '內心＝三條「角平分線」的交點';
        sub = '內心到三邊的距離都相等，所以能畫出一個剛好內切三角形的圓（內切圓）。' +
              '內心一定落在三角形內部，不管三角形長什麼樣。';
      } else if (kind === 'circum') {
        var d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
        var ux = ((A[0] * A[0] + A[1] * A[1]) * (B[1] - C[1]) +
                  (B[0] * B[0] + B[1] * B[1]) * (C[1] - A[1]) +
                  (C[0] * C[0] + C[1] * C[1]) * (A[1] - B[1])) / d;
        var uy = ((A[0] * A[0] + A[1] * A[1]) * (C[0] - B[0]) +
                  (B[0] * B[0] + B[1] * B[1]) * (A[0] - C[0]) +
                  (C[0] * C[0] + C[1] * C[1]) * (B[0] - A[0])) / d;
        P = [ux, uy];
        svg.appendChild(el('circle', { cx: P[0], cy: P[1], r: dist(P, A) },
          'fill:none;stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
        extra = [[mid(A, B), P], [mid(B, C), P], [mid(A, C), P]];
        main = '外心＝三邊「垂直平分線」的交點';
        sub = '外心到三個頂點的距離都相等，所以能畫出通過三頂點的圓（外接圓）。' +
              '銳角三角形的外心在內部、直角三角形在斜邊中點、鈍角三角形跑到外面。';
      } else {
        var fa = foot(B, C, A), fb = foot(A, C, B), fc = foot(A, B, C);
        // 兩條高的交點
        var d1 = [fa[0] - A[0], fa[1] - A[1]], d2b = [fb[0] - B[0], fb[1] - B[1]];
        var t = ((B[0] - A[0]) * d2b[1] - (B[1] - A[1]) * d2b[0]) / (d1[0] * d2b[1] - d1[1] * d2b[0]);
        P = [A[0] + t * d1[0], A[1] + t * d1[1]];
        extra = [[A, fa], [B, fb], [C, fc]];
        main = '垂心＝三條「高」的交點';
        sub = '高是從頂點垂直畫到對邊（或它的延長線）的線段。鈍角三角形的垂心會跑到三角形外面去。';
      }
      extra.forEach(function (e) {
        svg.appendChild(el('line', { x1: e[0][0], y1: e[0][1], x2: e[1][0], y2: e[1][1] },
          'stroke:var(--accent);stroke-width:1.5;stroke-dasharray:5 3'));
      });
      svg.appendChild(el('polygon', { points: [A, B, C].map(function (p) { return p.join(','); }).join(' ') },
        'fill:color-mix(in srgb, var(--accent) 12%, transparent);stroke:var(--accent);stroke-width:2.5'));
      svg.appendChild(el('circle', { cx: P[0], cy: P[1], r: 5 }, 'fill:var(--bad)'));
      svg.appendChild(txt(P[0] + 16, P[1] - 10, main.slice(0, 2),
        'font-size:12px;font-weight:700;fill:var(--bad)'));
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['circum', '外心'], ['incenter', '內心'], ['centroid', '重心'], ['ortho', '垂心']]
        .forEach(function (m) { row.appendChild(btn(m[1], function () { kind = m[0]; paint(); })); });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 拋物線（parabola）────────────────────────────────────────────────
     y = a(x − h)² + k：a 決定開口、(h, k) 就是頂點。
     spec: { a, h, k, edit, min, max }                                    */
  REG.parabola = function (host, spec) {
    var lo = spec.min == null ? -6 : spec.min, hi = spec.max == null ? 6 : spec.max;
    var a = spec.a == null ? 1 : spec.a, h = spec.h == null ? 0 : spec.h, k = spec.k == null ? 0 : spec.k;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 300', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var g = drawPlane(svg, lo, hi, { quad: false });
      var pts = [], i, x, y;
      for (i = 0; i <= 240; i++) {
        x = lo + (hi - lo) * i / 240; y = a * (x - h) * (x - h) + k;
        if (y >= lo && y <= hi) pts.push(g.X(x).toFixed(1) + ',' + g.Y(y).toFixed(1));
        else pts.push(null);
      }
      var run = [];
      pts.concat([null]).forEach(function (p) {
        if (p) { run.push(p); return; }
        if (run.length > 1) svg.appendChild(el('polyline', { points: run.join(' ') },
          'fill:none;stroke:var(--accent);stroke-width:3'));
        run = [];
      });
      svg.appendChild(el('line', { x1: g.X(h), y1: g.T, x2: g.X(h), y2: g.B },
        'stroke:var(--dim);stroke-width:1.5;stroke-dasharray:5 4'));
      svg.appendChild(txt(g.X(h) + 30, g.T + 12, 'x ＝ ' + h, 'font-size:11px;fill:var(--dim)'));
      if (k >= lo && k <= hi) {
        svg.appendChild(el('circle', { cx: g.X(h), cy: g.Y(k), r: 6 }, 'fill:var(--bad)'));
        svg.appendChild(txt(g.X(h) + 36, g.Y(k) + (a > 0 ? 16 : -16), '(' + h + ', ' + k + ')',
          'font-size:12px;font-weight:700;fill:var(--bad)'));
      }
      read.appendChild(div('wg-read-main',
        'y ＝ ' + (a === 1 ? '' : a === -1 ? '−' : a) + '(x ' + (h >= 0 ? '− ' + h : '＋ ' + (-h)) + ')²' +
        (k === 0 ? '' : k > 0 ? ' ＋ ' + k : ' − ' + (-k))));
      read.appendChild(div('wg-read-sub',
        (a > 0 ? 'a ＝ ' + a + ' > 0 → 開口向上，頂點是最低點，函數有「最小值」' + k
               : 'a ＝ ' + a + ' < 0 → 開口向下，頂點是最高點，函數有「最大值」' + k) +
        '。頂點 (' + h + ', ' + k + ')，對稱軸是直線 x ＝ ' + h +
        '。⚠ 括號裡是「x − h」，所以 (x − 3)² 的頂點在 x ＝ 3（往右），不是 −3。'));
    }
    if (spec.edit !== false) {
      var sa = stepper('a（開口）', function () { return a; }, function (v) { a = v || 1; }, -3, 3,
        function () { sa.sync(); paint(); });
      var sh = stepper('h（左右）', function () { return h; }, function (v) { h = v; }, -4, 4,
        function () { sh.sync(); paint(); });
      var sk = stepper('k（上下）', function () { return k; }, function (v) { k = v; }, -4, 4,
        function () { sk.sync(); paint(); });
      box.appendChild(sa.el); box.appendChild(sh.el); box.appendChild(sk.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 數列（seq）───────────────────────────────────────────────────────
     把每一項排出來，項與項之間標出「加多少」或「乘多少」，規律就看得見。
     spec: { a1, d, n, kind:'arith'|'geo'|'sq'|'fib', sum:bool, edit }     */
  REG.seq = function (host, spec) {
    var kind = spec.kind || 'arith';
    var a1 = spec.a1 == null ? 3 : spec.a1;
    var d = spec.d == null ? 4 : spec.d;
    var n = Math.min(spec.n == null ? 6 : spec.n, 8);
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 120', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function terms() {
      var t = [], i;
      if (kind === 'geo') { t.push(a1); for (i = 1; i < n; i++) t.push(t[i - 1] * d); }
      else if (kind === 'sq') { for (i = 1; i <= n; i++) t.push(i * i); }
      else if (kind === 'fib') { t = [1, 1]; for (i = 2; i < n; i++) t.push(t[i - 1] + t[i - 2]); }
      else { for (i = 0; i < n; i++) t.push(a1 + i * d); }
      return t.slice(0, n);
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var t = terms(), w = 300 / t.length, i;
      for (i = 0; i < t.length; i++) {
        var cx = 10 + w * (i + 0.5);
        svg.appendChild(el('rect', { x: cx - w / 2 + 4, y: 42, width: w - 8, height: 34, rx: 6,
          'fill-opacity': '.18' }, 'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(txt(cx, 59, String(t[i]), 'font-size:13px;font-weight:700'));
        svg.appendChild(txt(cx, 90, '第' + (i + 1) + '項', 'font-size:10px;fill:var(--dim)'));
        if (i) {
          var gap = kind === 'geo' ? '×' + d
            : kind === 'sq' || kind === 'fib' ? '＋' + (t[i] - t[i - 1])
            : (d >= 0 ? '＋' + d : '−' + (-d));
          svg.appendChild(txt(cx - w / 2, 26, gap, 'font-size:11px;fill:var(--good)'));
          svg.appendChild(el('path', { d: 'M' + (cx - w + 6) + ',34 Q' + (cx - w / 2) + ',14 ' +
            (cx - 6) + ',34' }, 'fill:none;stroke:var(--good);stroke-width:1.5'));
        }
      }
      if (spec.sum) {
        var s = t.reduce(function (p, q) { return p + q; }, 0);
        read.appendChild(div('wg-read-main',
          '前 ' + t.length + ' 項的和 ＝ (' + t[0] + ' ＋ ' + t[t.length - 1] + ') × ' +
          t.length + ' ÷ 2 ＝ ' + s));
        read.appendChild(div('wg-read-sub',
          '把數列頭尾配對：第 1 項＋最後一項、第 2 項＋倒數第 2 項…每一對的和都一樣是 ' +
          (t[0] + t[t.length - 1]) + '。共有「項數 ÷ 2」對，這就是等差級數求和公式的由來。'));
      } else if (kind === 'arith') {
        read.appendChild(div('wg-read-main',
          '首項 ' + a1 + '，公差 ' + d + '　→　第 n 項 ＝ ' + a1 + ' ＋ (n − 1) × ' + (d < 0 ? '(' + d + ')' : d)));
        read.appendChild(div('wg-read-sub',
          '每一項都比前一項多 ' + d + '（' + (d < 0 ? '公差是負的，所以越來越小' : '公差是正的，所以越來越大') +
          '）。要跳到第 n 項，是「加了 n − 1 次」不是 n 次——這是最常算錯的地方。'));
      } else if (kind === 'geo') {
        read.appendChild(div('wg-read-main', '每一項都是前一項的 ' + d + ' 倍（等比數列）'));
        read.appendChild(div('wg-read-sub',
          '等差是「一直加同一個數」，等比是「一直乘同一個數」。細菌分裂、對折紙張都是等比。'));
      } else if (kind === 'sq') {
        read.appendChild(div('wg-read-main', '第 n 項 ＝ n²（平方數列）'));
        read.appendChild(div('wg-read-sub',
          '相鄰兩項的差是 3、5、7、9…（差本身是等差），所以它不是等差數列。'));
      } else {
        read.appendChild(div('wg-read-main', '每一項 ＝ 前兩項相加（費氏數列）'));
        read.appendChild(div('wg-read-sub',
          '1、1、2、3、5、8、13…規律不在「差」而在「怎麼生出來的」。找規律時，差看不出來就換個角度想。'));
      }
    }
    if (spec.edit && kind === 'arith') {
      var sd = stepper('公差', function () { return d; }, function (v) { d = v; }, -9, 9,
        function () { sd.sync(); paint(); });
      box.appendChild(sd.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 平行線被截（cutangles）───────────────────────────────────────────
     同位角、內錯角、同側內角三種關係，按鈕切換高亮哪一組。
     spec: { deg, show:'co'|'alt'|'same', pick }                          */
  REG.cutangles = function (host, spec) {
    var deg = spec.deg == null ? 65 : spec.deg;
    var show = spec.show || 'co';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var NAMES = { co: '同位角', alt: '內錯角', same: '同側內角' };
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var y1 = 55, y2 = 130, ux = 130, dx = ux + (y2 - y1) / Math.tan(deg * Math.PI / 180);
      svg.appendChild(el('line', { x1: 16, y1: y1, x2: 304, y2: y1 },
        'stroke:var(--text);stroke-width:2.5'));
      svg.appendChild(el('line', { x1: 16, y1: y2, x2: 304, y2: y2 },
        'stroke:var(--text);stroke-width:2.5'));
      var ex = (y1 - 30) / Math.tan(deg * Math.PI / 180);
      svg.appendChild(el('line', { x1: ux - ex, y1: 30, x2: dx + ex, y2: y2 + (y1 - 30) },
        'stroke:var(--accent);stroke-width:2.5'));
      svg.appendChild(txt(300, y1 - 10, 'L1', 'font-size:11px;fill:var(--dim)'));
      svg.appendChild(txt(300, y2 - 10, 'L2', 'font-size:11px;fill:var(--dim)'));
      var a = deg, b = 180 - deg;
      // 每個交點的四個角：[右下, 左下, 右上, 左上]
      var spots = [
        [ux + 24, y1 + 16, a, 'U右下'], [ux - 26, y1 + 16, b, 'U左下'],
        [ux + 26, y1 - 14, b, 'U右上'], [ux - 24, y1 - 14, a, 'U左上'],
        [dx + 24, y2 + 16, a, 'L右下'], [dx - 26, y2 + 16, b, 'L左下'],
        [dx + 26, y2 - 14, b, 'L右上'], [dx - 24, y2 - 14, a, 'L左上']
      ];
      var hi = show === 'co' ? [0, 4] : show === 'alt' ? [0, 7] : [0, 6];
      spots.forEach(function (s, i) {
        var on = hi.indexOf(i) >= 0;
        if (on) svg.appendChild(el('circle', { cx: s[0], cy: s[1] - 4, r: 13, 'fill-opacity': '.25' },
          'fill:var(--good);stroke:var(--good);stroke-width:1.5'));
        svg.appendChild(txt(s[0], s[1] - 4, s[2] + '°',
          'font-size:11px;' + (on ? 'font-weight:700;fill:var(--good)' : 'fill:var(--dim)')));
      });
      var pair = [spots[hi[0]][2], spots[hi[1]][2]];
      read.appendChild(div('wg-read-main', NAMES[show] + '：' + pair[0] + '° 與 ' + pair[1] + '°　' +
        (show === 'same' ? '和 ＝ 180°（互補）' : '相等')));
      read.appendChild(div('wg-read-sub',
        show === 'co' ? '同位角＝在截線同一側、而且都在兩條平行線的同一邊（一個在上線的右下、一個在下線的右下）。兩線平行時同位角相等。'
        : show === 'alt' ? '內錯角＝都在兩條平行線「之間」，但分別在截線的兩側，長得像 Z 字。兩線平行時內錯角相等。'
        : '同側內角＝都在兩線之間、而且在截線的同一側，長得像 ㄈ 字。兩線平行時它們互補，加起來 180°。'));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      ['co', 'alt', 'same'].forEach(function (k) {
        row.appendChild(btn(NAMES[k], function () { show = k; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 三角形的角（triangleangles）──────────────────────────────────────
     內角和 180°，以及「外角＝不相鄰兩內角和」。
     spec: { a, b, edit, ext:bool }                                       */
  REG.triangleangles = function (host, spec) {
    var a = spec.a == null ? 50 : spec.a, b = spec.b == null ? 70 : spec.b;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      a = clamp(a, 20, 120); b = clamp(b, 20, 120);
      if (a + b > 150) b = 150 - a;
      var c = 180 - a - b;
      var x1 = 60, x2 = 230, y0 = 140;                    // 底邊兩端
      var ta = Math.tan(a * Math.PI / 180), tb = Math.tan(b * Math.PI / 180);
      var px = (x1 * ta + x2 * tb) / (ta + tb);
      var py = y0 - ta * (px - x1);
      svg.appendChild(el('line', { x1: x2, y1: y0, x2: 300, y2: y0 },
        'stroke:var(--dim);stroke-width:2;stroke-dasharray:5 4'));   // 底邊延長線
      svg.appendChild(el('polygon', { points: x1 + ',' + y0 + ' ' + x2 + ',' + y0 + ' ' + px + ',' + py },
        'fill:color-mix(in srgb, var(--accent) 16%, transparent);stroke:var(--accent);stroke-width:2.5'));
      svg.appendChild(txt(x1 + 26, y0 - 12, a + '°', 'font-size:12px;font-weight:700;fill:var(--accent)'));
      svg.appendChild(txt(x2 - 26, y0 - 12, b + '°', 'font-size:12px;font-weight:700;fill:var(--accent)'));
      svg.appendChild(txt(px, py + 22, c + '°', 'font-size:12px;font-weight:700;fill:var(--accent)'));
      if (spec.ext !== false) {
        svg.appendChild(txt(x2 + 30, y0 - 14, (180 - b) + '°',
          'font-size:12px;font-weight:700;fill:var(--bad)'));
        svg.appendChild(txt(x2 + 46, y0 + 14, '外角', 'font-size:10px;fill:var(--bad)'));
      }
      read.appendChild(div('wg-read-main',
        a + '° ＋ ' + b + '° ＋ ' + c + '° ＝ 180°' +
        (spec.ext !== false ? '　外角 ' + (180 - b) + '° ＝ ' + a + '° ＋ ' + c + '°' : '')));
      read.appendChild(div('wg-read-sub',
        '三角形內角和永遠是 180°，所以知道兩個角就能算出第三個。' +
        (spec.ext !== false ? '把底邊延長出去形成的「外角」，等於和它不相鄰的那兩個內角相加——因為外角＋相鄰內角＝180°，內角和也是 180°。' : '')));
    }
    if (spec.edit !== false) {
      var sa = stepper('左下角', function () { return a; }, function (v) { a = v; }, 20, 120,
        function () { sa.sync(); paint(); });
      var sb = stepper('右下角', function () { return b; }, function (v) { b = v; }, 20, 120,
        function () { sb.sync(); paint(); });
      box.appendChild(sa.el); box.appendChild(sb.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 全等判定（congruent）─────────────────────────────────────────────
     兩個三角形並排，把「已知相等」的邊與角標出來。
     spec: { kind:'SSS'|'SAS'|'ASA'|'AAS'|'RHS', pick }                   */
  REG.congruent = function (host, spec) {
    var K = {
      SSS: { s: [0, 1, 2], a: [], name: 'SSS（邊邊邊）', desc: '三組對應邊都相等 → 兩個三角形全等。三邊定了，形狀就只有一種。' },
      SAS: { s: [0, 1], a: [1], name: 'SAS（邊角邊）', desc: '兩組對應邊相等，而且「夾在中間的角」也相等。角一定要是兩邊夾住的那個。' },
      ASA: { s: [0], a: [0, 1], name: 'ASA（角邊角）', desc: '兩組對應角相等，而且「夾在中間的邊」也相等。' },
      AAS: { s: [1], a: [0, 1], name: 'AAS（角角邊）', desc: '兩組對應角相等，加上其中一個角的對邊相等。因為兩角定了第三角也定了，所以也成立。' },
      RHS: { s: [1, 0], a: [], name: 'RHS（直角、斜邊、一股）', desc: '直角三角形專用：直角 ＋ 斜邊 ＋ 一股對應相等。一般三角形的 SSA 不成立，只有直角三角形這種特例可以。' }
    };
    var kind = K[spec.kind] ? spec.kind : 'SSS';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 160', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function tri(ox, right) {
      // 頂點：0 左下、1 右下、2 上
      return right ? [[ox, 120], [ox + 90, 120], [ox, 45]]
                   : [[ox, 120], [ox + 100, 120], [ox + 30, 45]];
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var k = K[kind], isR = kind === 'RHS';
      [10, 180].forEach(function (ox, t) {
        var p = tri(ox, isR);
        svg.appendChild(el('polygon', { points: p.map(function (q) { return q.join(','); }).join(' ') },
          'fill:color-mix(in srgb, var(--accent) 14%, transparent);stroke:var(--accent);stroke-width:2'));
        // 邊：0 = 底邊(0-1)、1 = 右斜邊(1-2)、2 = 左邊(0-2)
        var EDGES = [[p[0], p[1]], [p[1], p[2]], [p[0], p[2]]];
        k.s.forEach(function (ei, idx) {
          var e = EDGES[ei];
          svg.appendChild(el('line', { x1: e[0][0], y1: e[0][1], x2: e[1][0], y2: e[1][1] },
            'stroke:var(--good);stroke-width:4'));
          svg.appendChild(txt((e[0][0] + e[1][0]) / 2 + (ei === 2 ? -12 : ei === 1 ? 12 : 0),
            (e[0][1] + e[1][1]) / 2 + (ei === 0 ? 14 : 0),
            '｜'.repeat(idx + 1), 'font-size:11px;fill:var(--good)'));
        });
        k.a.forEach(function (ai) {
          var v = p[ai];
          svg.appendChild(el('circle', { cx: v[0] + (ai === 0 ? 16 : ai === 1 ? -16 : 0),
            cy: v[1] + (ai === 2 ? 18 : -14), r: 9, 'fill-opacity': '.25' },
            'fill:var(--bad);stroke:var(--bad);stroke-width:1.5'));
        });
        if (isR) svg.appendChild(el('rect', { x: p[0][0], y: p[0][1] - 12, width: 12, height: 12 },
          'fill:none;stroke:var(--dim);stroke-width:1.5'));
        svg.appendChild(txt(ox + 50, 142, t ? '△DEF' : '△ABC', 'font-size:11px;fill:var(--dim)'));
      });
      svg.appendChild(txt(160, 80, '≅', 'font-size:20px;fill:var(--text)'));
      read.appendChild(div('wg-read-main', k.name));
      read.appendChild(div('wg-read-sub', k.desc));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      ['SSS', 'SAS', 'ASA', 'AAS', 'RHS'].forEach(function (t) {
        row.appendChild(btn(t, function () { kind = t; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 四邊形的對角線（quaddiag）────────────────────────────────────────
     平行四邊形家族的差別，看對角線最清楚：等不等長、垂不垂直、有沒有互相平分。
     spec: { kind:'parallelogram'|'rect'|'rhombus'|'square'|'isotrap', pick } */
  REG.quaddiag = function (host, spec) {
    var Q = {
      parallelogram: { pts: [[70, 40], [250, 40], [215, 130], [35, 130]], name: '平行四邊形',
        f: ['對角線互相平分 ✓', '對角線等長 ✗', '對角線垂直 ✗'] },
      rect: { pts: [[60, 40], [260, 40], [260, 130], [60, 130]], name: '矩形（長方形）',
        f: ['對角線互相平分 ✓', '對角線等長 ✓', '對角線垂直 ✗'] },
      rhombus: { pts: [[160, 30], [250, 85], [160, 140], [70, 85]], name: '菱形',
        f: ['對角線互相平分 ✓', '對角線等長 ✗', '對角線垂直 ✓'] },
      square: { pts: [[105, 30], [215, 30], [215, 140], [105, 140]], name: '正方形',
        f: ['對角線互相平分 ✓', '對角線等長 ✓', '對角線垂直 ✓'] },
      isotrap: { pts: [[110, 40], [210, 40], [265, 130], [55, 130]], name: '等腰梯形',
        f: ['對角線互相平分 ✗', '對角線等長 ✓', '對角線垂直 ✗'] }
    };
    var kind = Q[spec.kind] ? spec.kind : 'parallelogram';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 155', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var q = Q[kind], p = q.pts;
      svg.appendChild(el('polygon', { points: p.map(function (v) { return v.join(','); }).join(' ') },
        'fill:color-mix(in srgb, var(--good) 16%, transparent);stroke:var(--good);stroke-width:2.5'));
      [[0, 2], [1, 3]].forEach(function (dg) {
        svg.appendChild(el('line', { x1: p[dg[0]][0], y1: p[dg[0]][1], x2: p[dg[1]][0], y2: p[dg[1]][1] },
          'stroke:var(--accent);stroke-width:2;stroke-dasharray:6 4'));
      });
      read.appendChild(div('wg-read-main', q.name));
      read.appendChild(div('wg-read-sub', q.f.join('　') +
        '　（正方形是「矩形 ＋ 菱形」，所以三個性質全部都有。）'));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['parallelogram', '平行四邊形'], ['rect', '矩形'], ['rhombus', '菱形'],
       ['square', '正方形'], ['isotrap', '等腰梯形']].forEach(function (k) {
        row.appendChild(btn(k[1], function () { kind = k[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 面積模型（areamodel）─────────────────────────────────────────────
     乘法公式與配方法的「為什麼」：把式子畫成一塊一塊的面積就看得懂。
     spec: { mode:'square'|'rect'|'complete', a, b, c, d, edit }
       square   (a + b)² = a² + 2ab + b²
       rect     (a + b)(c + d) = ac + ad + bc + bd
       complete x² + bx 要補上 (b/2)² 才會變成完整的正方形                */
  REG.areamodel = function (host, spec) {
    var mode = spec.mode || 'square';
    var a = spec.a == null ? 3 : spec.a, b = spec.b == null ? 2 : spec.b;
    var c = spec.c == null ? 3 : spec.c, d = spec.d == null ? 4 : spec.d;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 230', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    // 格子太小就改用短標籤（只寫面積），不然字會凸出格子外
    function cell(x, y, w, h, label, color, dashed, shortLabel) {
      svg.appendChild(el('rect', { x: x, y: y, width: w, height: h, 'fill-opacity': '.18' },
        'fill:var(--' + color + ');stroke:var(--' + color + ');stroke-width:2' +
        (dashed ? ';stroke-dasharray:5 4' : '')));
      var show = (shortLabel && w < label.length * 9 + 8) ? shortLabel : label;
      svg.appendChild(txt(x + w / 2, y + h / 2, show,
        'font-size:' + (w < 40 ? 11 : 13) + 'px;font-weight:700'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var X = 46, Y = 24, S = 168;                       // 整塊的左上角與邊長
      if (mode === 'complete') {
        var half = b / 2;
        var w1 = S * 0.64, w2 = S * 0.36;
        cell(X, Y, w1, w1, 'x²', 'accent');
        cell(X + w1, Y, w2, w1, half + 'x', 'good');
        cell(X, Y + w1, w1, w2, half + 'x', 'good');
        cell(X + w1, Y + w1, w2, w2, half + '² ＝ ' + (half * half), 'bad', true,
          String(half * half));
        svg.appendChild(txt(X + w1 / 2, Y - 10, 'x', 'font-size:12px;fill:var(--dim)'));
        svg.appendChild(txt(X + w1 + w2 / 2, Y - 10, String(half), 'font-size:12px;fill:var(--dim)'));
        svg.appendChild(txt(X - 16, Y + w1 / 2, 'x', 'font-size:12px;fill:var(--dim)'));
        svg.appendChild(txt(X - 16, Y + w1 + w2 / 2, String(half), 'font-size:12px;fill:var(--dim)'));
        read.appendChild(div('wg-read-main',
          'x² ＋ ' + b + 'x ＋ ' + (half * half) + ' ＝ (x ＋ ' + half + ')²'));
        read.appendChild(div('wg-read-sub',
          '把 ' + b + 'x 拆成兩條 ' + half + 'x 貼在正方形的兩邊，右下角就缺一塊 ' +
          half + ' × ' + half + ' ＝ ' + (half * half) + '。補上它才湊成一個完整的正方形——' +
          '這就是配方法「加上一次項係數一半的平方」的由來。'));
      } else if (mode === 'rect') {
        var r1 = S * (a / (a + b)), r2 = S - r1;
        var c1 = S * (c / (c + d)), c2 = S - c1;
        cell(X, Y, c1, r1, String(a * c), 'accent');
        cell(X + c1, Y, c2, r1, String(a * d), 'good');
        cell(X, Y + r1, c1, r2, String(b * c), 'good');
        cell(X + c1, Y + r1, c2, r2, String(b * d), 'bad');
        svg.appendChild(txt(X + c1 / 2, Y - 10, String(c), 'font-size:12px;fill:var(--dim)'));
        svg.appendChild(txt(X + c1 + c2 / 2, Y - 10, String(d), 'font-size:12px;fill:var(--dim)'));
        svg.appendChild(txt(X - 16, Y + r1 / 2, String(a), 'font-size:12px;fill:var(--dim)'));
        svg.appendChild(txt(X - 16, Y + r1 + r2 / 2, String(b), 'font-size:12px;fill:var(--dim)'));
        read.appendChild(div('wg-read-main',
          '(' + a + ' ＋ ' + b + ')(' + c + ' ＋ ' + d + ') ＝ ' +
          (a * c) + ' ＋ ' + (a * d) + ' ＋ ' + (b * c) + ' ＋ ' + (b * d) +
          ' ＝ ' + ((a + b) * (c + d))));
        read.appendChild(div('wg-read-sub',
          '整塊長方形的面積，等於四小塊加起來。每一項都要乘到——漏掉一塊，面積就少一塊。'));
      } else {
        var s1 = S * (a / (a + b)), s2 = S - s1;
        cell(X, Y, s1, s1, a + '² ＝ ' + (a * a), 'accent', false, String(a * a));
        cell(X + s1, Y, s2, s1, String(a * b), 'good');
        cell(X, Y + s1, s1, s2, String(a * b), 'good');
        cell(X + s1, Y + s1, s2, s2, b + '² ＝ ' + (b * b), 'bad', false, String(b * b));
        svg.appendChild(txt(X + s1 / 2, Y - 10, String(a), 'font-size:12px;fill:var(--dim)'));
        svg.appendChild(txt(X + s1 + s2 / 2, Y - 10, String(b), 'font-size:12px;fill:var(--dim)'));
        svg.appendChild(txt(X - 16, Y + s1 / 2, String(a), 'font-size:12px;fill:var(--dim)'));
        svg.appendChild(txt(X - 16, Y + s1 + s2 / 2, String(b), 'font-size:12px;fill:var(--dim)'));
        read.appendChild(div('wg-read-main',
          '(' + a + ' ＋ ' + b + ')² ＝ ' + (a * a) + ' ＋ 2×' + (a * b) + ' ＋ ' + (b * b) +
          ' ＝ ' + ((a + b) * (a + b))));
        read.appendChild(div('wg-read-sub',
          '中間有「兩塊」' + a + ' × ' + b + ' 的長方形，這就是公式裡 2ab 的來源。' +
          '直接寫成 a² ＋ b²（' + (a * a + b * b) + '）會少掉這兩塊。'));
      }
    }
    if (spec.edit !== false && mode !== 'complete') {
      var sa = stepper('a', function () { return a; }, function (v) { a = v; }, 1, 8,
        function () { sa.sync(); paint(); });
      var sb = stepper('b', function () { return b; }, function (v) { b = v; }, 1, 8,
        function () { sb.sync(); paint(); });
      box.appendChild(sa.el); box.appendChild(sb.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 十字交乘（crossmult）─────────────────────────────────────────────
     (a1x + b1)(a2x + b2)：直的相乘得二次項與常數項，交叉相乘相加得一次項。
     spec: { a1, b1, a2, b2 }                                             */
  REG.crossmult = function (host, spec) {
    var a1 = spec.a1 == null ? 1 : spec.a1, b1 = spec.b1 == null ? 2 : spec.b1;
    var a2 = spec.a2 == null ? 1 : spec.a2, b2 = spec.b2 == null ? 3 : spec.b2;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    // 負數一律用數學減號並加括號，免得畫面出現「3 ＋ -5」這種讀不順的式子
    function num(v) { return v < 0 ? '−' + (-v) : String(v); }
    function par(v) { return v < 0 ? '(−' + (-v) + ')' : String(v); }
    var X1 = 70, X2 = 180, Y1 = 40, Y2 = 105;
    svg.appendChild(el('line', { x1: X1 + 16, y1: Y1 + 10, x2: X2 - 16, y2: Y2 - 10 },
      'stroke:var(--good);stroke-width:2'));
    svg.appendChild(el('line', { x1: X2 - 16, y1: Y1 + 10, x2: X1 + 16, y2: Y2 - 10 },
      'stroke:var(--good);stroke-width:2'));
    svg.appendChild(txt(X1, Y1, num(a1), 'font-size:17px;font-weight:700;fill:var(--accent)'));
    svg.appendChild(txt(X2, Y1, num(b1), 'font-size:17px;font-weight:700;fill:var(--accent)'));
    svg.appendChild(txt(X1, Y2, num(a2), 'font-size:17px;font-weight:700;fill:var(--accent)'));
    svg.appendChild(txt(X2, Y2, num(b2), 'font-size:17px;font-weight:700;fill:var(--accent)'));
    svg.appendChild(txt(X1, 16, '　x 的係數', 'font-size:11px;fill:var(--dim)'));
    svg.appendChild(txt(X2, 16, '常數項', 'font-size:11px;fill:var(--dim)'));
    svg.appendChild(txt(262, Y1, '→ ' + num(a1 * b2), 'font-size:13px;fill:var(--good)'));
    svg.appendChild(txt(262, Y2, '→ ' + num(a2 * b1), 'font-size:13px;fill:var(--good)'));
    svg.appendChild(txt(262, 138, '和 ＝ ' + num(a1 * b2 + a2 * b1),
      'font-size:13px;font-weight:700;fill:var(--good)'));
    box.appendChild(svg);
    function term(k, s) {
      if (k === 0) return '';
      return (k > 0 ? ' ＋ ' : ' − ') + (Math.abs(k) === 1 && s ? '' : Math.abs(k)) + s;
    }
    var A = a1 * a2, B = a1 * b2 + a2 * b1, C = b1 * b2;
    box.appendChild(div('wg-read-main',
      (A === 1 ? 'x²' : A + 'x²') + term(B, 'x') + term(C, '') + ' ＝ (' +
      (a1 === 1 ? '' : a1) + 'x' + term(b1, '') + ')(' + (a2 === 1 ? '' : a2) + 'x' + term(b2, '') + ')'));
    box.appendChild(div('wg-read-sub',
      '左邊兩個直的相乘 ' + par(a1) + ' × ' + par(a2) + ' ＝ ' + num(A) + '（二次項係數）；' +
      '右邊兩個直的相乘 ' + par(b1) + ' × ' + par(b2) + ' ＝ ' + num(C) + '（常數項）；' +
      '交叉相乘再相加 ' + par(a1 * b2) + ' ＋ ' + par(a2 * b1) + ' ＝ ' + num(B) +
      '（一次項係數）。三個都對上才算分解成功。'));
    host.appendChild(box);
  };

  /* ── 畢氏定理（pythagoras）────────────────────────────────────────────
     兩股上的正方形面積加起來，剛好等於斜邊上正方形的面積。
     spec: { a, b, edit }                                                 */
  REG.pythagoras = function (host, spec) {
    var a = spec.a == null ? 3 : spec.a, b = spec.b == null ? 4 : spec.b;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 240', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var c2 = a * a + b * b, c = Math.sqrt(c2);
      var u = 96 / Math.max(a, b);                        // 每一單位長多少像素
      var A = 138, B = 150;                               // 直角頂點
      var P = { x: A, y: B - a * u };                     // 上端點（垂直股 a）
      var Q = { x: A + b * u, y: B };                     // 右端點（水平股 b）
      // 兩股上的正方形
      svg.appendChild(el('rect', { x: A - a * u, y: B - a * u, width: a * u, height: a * u,
        'fill-opacity': '.18' }, 'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
      // 正方形太小就把面積標到外面，不然字會凸出方塊外被切掉
      svg.appendChild(txt(A - a * u / 2, a * u < 62 ? B - a * u - 10 : B - a * u / 2,
        a + '² ＝ ' + (a * a), 'font-size:12px;font-weight:700'));
      svg.appendChild(el('rect', { x: A, y: B, width: b * u, height: b * u, 'fill-opacity': '.18' },
        'fill:var(--good);stroke:var(--good);stroke-width:2'));
      svg.appendChild(txt(A + b * u / 2, b * u < 62 ? B + b * u + 12 : B + b * u / 2,
        b + '² ＝ ' + (b * b), 'font-size:12px;font-weight:700'));
      // 三角形本體
      svg.appendChild(el('polygon', { points: A + ',' + B + ' ' + P.x + ',' + P.y + ' ' + Q.x + ',' + Q.y },
        'fill:var(--panel2);stroke:var(--text);stroke-width:2'));
      svg.appendChild(el('rect', { x: A, y: B - 12, width: 12, height: 12 },
        'fill:none;stroke:var(--dim);stroke-width:1.5'));      // 直角記號
      // 股長標在三角形內側（標外面會壓到兩個正方形）
      svg.appendChild(txt(A + 14, B - a * u / 2, String(a), 'font-size:12px;fill:var(--dim)'));
      svg.appendChild(txt(A + b * u / 2, B - 12, String(b), 'font-size:12px;fill:var(--dim)'));
      svg.appendChild(txt((P.x + Q.x) / 2 + 16, (P.y + Q.y) / 2 - 10,
        'c ＝ ' + (+c.toFixed(3)), 'font-size:13px;font-weight:700;fill:var(--bad)'));
      read.appendChild(div('wg-read-main',
        a + '² ＋ ' + b + '² ＝ ' + (a * a) + ' ＋ ' + (b * b) + ' ＝ ' + c2 +
        '　→　c ＝ √' + c2 + ' ＝ ' + (+c.toFixed(3))));
      read.appendChild(div('wg-read-sub',
        '藍色和綠色兩個正方形的面積加起來，剛好等於斜邊上正方形的面積。' +
        '⚠ 斜邊是 c 不是 c²，最後別忘了開根號' +
        (Number.isInteger(c) ? '。這組剛好是整數，叫做畢氏三元數。' : '。這組開出來不是整數，保留根號比較準。')));
    }
    if (spec.edit !== false) {
      var sa = stepper('股 a', function () { return a; }, function (v) { a = v; }, 1, 12,
        function () { sa.sync(); paint(); });
      var sb = stepper('股 b', function () { return b; }, function (v) { b = v; }, 1, 12,
        function () { sb.sync(); paint(); });
      box.appendChild(sa.el); box.appendChild(sb.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 盒狀圖（boxplot）─────────────────────────────────────────────────
     五數綜合：最小值、Q1、中位數、Q3、最大值；盒子的長度就是四分位距。
     spec: { values: [..] }                                               */
  REG.boxplot = function (host, spec) {
    var v = (spec.values || [12, 15, 18, 22, 25, 28, 35]).slice()
      .sort(function (x, y) { return x - y; });
    function med(arr) {
      var n = arr.length;
      return n % 2 ? arr[(n - 1) / 2] : (arr[n / 2 - 1] + arr[n / 2]) / 2;
    }
    var n = v.length, half = Math.floor(n / 2);
    var q1 = med(v.slice(0, half));                     // 奇數筆時不含中位數本身
    var q2 = med(v);
    var q3 = med(v.slice(n - half));
    var lo = v[0], hi = v[n - 1], span = Math.max(hi - lo, 1);
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 140', class: 'wg-svg' });
    function X(t) { return 24 + (t - lo) / span * 272; }
    var Y = 58, H = 44;
    svg.appendChild(el('line', { x1: X(lo), y1: Y + H / 2, x2: X(q1), y2: Y + H / 2 },
      'stroke:var(--text);stroke-width:2'));                                   // 左鬚
    svg.appendChild(el('line', { x1: X(q3), y1: Y + H / 2, x2: X(hi), y2: Y + H / 2 },
      'stroke:var(--text);stroke-width:2'));                                   // 右鬚
    [lo, hi].forEach(function (t) {
      svg.appendChild(el('line', { x1: X(t), y1: Y + 8, x2: X(t), y2: Y + H - 8 },
        'stroke:var(--text);stroke-width:2'));
    });
    svg.appendChild(el('rect', { x: X(q1), y: Y, width: Math.max(X(q3) - X(q1), 2), height: H, rx: 4,
      'fill-opacity': '.2' }, 'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
    svg.appendChild(el('line', { x1: X(q2), y1: Y, x2: X(q2), y2: Y + H },
      'stroke:var(--bad);stroke-width:3'));
    [[lo, '最小'], [q1, 'Q1'], [q2, '中位數'], [q3, 'Q3'], [hi, '最大']].forEach(function (m, i) {
      svg.appendChild(txt(X(m[0]), i % 2 ? 26 : 40, m[1] + ' ' + m[0],
        'font-size:11px;fill:var(--dim)'));
    });
    svg.appendChild(el('line', { x1: X(q1), y1: Y + H + 14, x2: X(q3), y2: Y + H + 14 },
      'stroke:var(--good);stroke-width:2'));
    svg.appendChild(txt((X(q1) + X(q3)) / 2, Y + H + 28, 'IQR ＝ ' + (q3 - q1),
      'font-size:12px;font-weight:700;fill:var(--good)'));
    box.appendChild(svg);
    box.appendChild(div('wg-read-main',
      '最小 ' + lo + '　Q1 ' + q1 + '　中位數 ' + q2 + '　Q3 ' + q3 + '　最大 ' + hi));
    box.appendChild(div('wg-read-sub',
      '盒子裝的是「中間那一半」的資料（從 Q1 到 Q3），盒子越短代表中間這半群人越集中。' +
      '兩邊的鬚延伸到最小值與最大值，看得出資料整體散得多開。'));
    host.appendChild(box);
  };

  /* ── 折線圖（linechart）───────────────────────────────────────────────
     和 bargraph 用同一組資料就看得出差別：長條比多少、折線看「怎麼變」。
     spec: { data:[{label,value}], unit, zero:false }                      */
  REG.linechart = function (host, spec) {
    var data = spec.data || [];
    var unit = spec.unit || '';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    var vals = data.map(function (d) { return d.value; });
    var hi = Math.max.apply(null, vals.concat([1]));
    var lo = spec.zero === false ? Math.min.apply(null, vals) : 0;
    if (hi === lo) hi = lo + 1;
    var L = 34, R = 306, T = 20, B = 132;
    function X(i) { return data.length < 2 ? (L + R) / 2 : L + i / (data.length - 1) * (R - L); }
    function Y(v) { return B - (v - lo) / (hi - lo) * (B - T); }
    svg.appendChild(el('line', { x1: L, y1: B, x2: R, y2: B }, 'stroke:var(--text);stroke-width:2'));
    svg.appendChild(el('line', { x1: L, y1: B, x2: L, y2: T }, 'stroke:var(--text);stroke-width:2'));
    svg.appendChild(txt(L - 16, Y(hi), String(hi), 'font-size:10px;fill:var(--dim)'));
    svg.appendChild(txt(L - 16, Y(lo), String(lo), 'font-size:10px;fill:var(--dim)'));
    svg.appendChild(el('polyline',
      { points: data.map(function (d, i) { return X(i) + ',' + Y(d.value); }).join(' ') },
      'fill:none;stroke:var(--accent);stroke-width:3'));
    data.forEach(function (d, i) {
      svg.appendChild(el('circle', { cx: X(i), cy: Y(d.value), r: 4 }, 'fill:var(--accent)'));
      svg.appendChild(txt(X(i), Y(d.value) - 14, String(d.value), 'font-size:11px;fill:var(--accent)'));
      svg.appendChild(txt(X(i), B + 14, d.label, 'font-size:11px;fill:var(--dim)'));
    });
    box.appendChild(svg);
    var up = 0, down = 0, i2;
    for (i2 = 1; i2 < data.length; i2++) {
      if (data[i2].value > data[i2 - 1].value) up++; else if (data[i2].value < data[i2 - 1].value) down++;
    }
    box.appendChild(div('wg-read-sub',
      '折線圖看的是「變化」：線往上升代表增加（' + up + ' 段），往下降代表減少（' + down + ' 段）。' +
      (spec.zero === false ? '⚠ 這張圖的縱軸不是從 0 開始，起伏看起來會比實際誇張。'
                           : '縱軸從 0 開始，起伏才不會被放大。') +
      (unit ? '單位：' + unit + '。' : '')));
    host.appendChild(box);
  };

  /* ── 坐標平面的共用底圖 ────────────────────────────────────────────────
     coordplane 與 linegraph 共用：畫格線、兩軸、刻度、象限名稱，
     回傳 X()／Y() 兩個把數值換成畫布座標的函式。                          */
  function drawPlane(svg, lo, hi, opt) {
    var L = 30, R = 290, T = 20, B = 280;
    function X(v) { return L + (v - lo) / (hi - lo) * (R - L); }
    function Y(v) { return B - (v - lo) / (hi - lo) * (B - T); }
    var i;
    for (i = Math.ceil(lo); i <= hi; i++) {                 // 格線
      svg.appendChild(el('line', { x1: X(i), y1: T, x2: X(i), y2: B },
        'stroke:var(--border);stroke-width:1'));
      svg.appendChild(el('line', { x1: L, y1: Y(i), x2: R, y2: Y(i) },
        'stroke:var(--border);stroke-width:1'));
    }
    if (opt && opt.quad !== false) {                        // 象限名稱（淡淡的當背景）
      var qs = [['第一象限', hi * 0.55, hi * 0.8], ['第二象限', lo * 0.55, hi * 0.8],
                ['第三象限', lo * 0.55, lo * 0.8], ['第四象限', hi * 0.55, lo * 0.8]];
      qs.forEach(function (q) {
        svg.appendChild(txt(X(q[1]), Y(q[2]), q[0], 'font-size:12px;fill:var(--dim);opacity:.65'));
      });
    }
    svg.appendChild(el('line', { x1: L, y1: Y(0), x2: R, y2: Y(0) },      // x 軸
      'stroke:var(--text);stroke-width:2'));
    svg.appendChild(el('line', { x1: X(0), y1: B, x2: X(0), y2: T },      // y 軸
      'stroke:var(--text);stroke-width:2'));
    svg.appendChild(txt(R + 12, Y(0), 'x', 'font-size:13px;fill:var(--dim);font-style:italic'));
    svg.appendChild(txt(X(0), T - 10, 'y', 'font-size:13px;fill:var(--dim);font-style:italic'));
    svg.appendChild(txt(X(0) - 10, Y(0) + 12, '0', 'font-size:11px;fill:var(--dim)'));
    for (i = Math.ceil(lo); i <= hi; i++) {                 // 刻度數字
      if (i === 0) continue;
      svg.appendChild(txt(X(i), Y(0) + 12, String(i), 'font-size:10px;fill:var(--dim)'));
      svg.appendChild(txt(X(0) - 12, Y(i), String(i), 'font-size:10px;fill:var(--dim)'));
    }
    return { X: X, Y: Y, L: L, R: R, T: T, B: B };
  }
  function quadName(x, y) {
    if (x === 0 && y === 0) return '原點';
    if (x === 0) return 'y 軸上（不屬於任何象限）';
    if (y === 0) return 'x 軸上（不屬於任何象限）';
    return x > 0 ? (y > 0 ? '第一象限' : '第四象限') : (y > 0 ? '第二象限' : '第三象限');
  }

  /* ── 直角坐標平面（coordplane）────────────────────────────────────────
     點怎麼標、象限怎麼分、對稱點在哪。
     spec: { min, max, x, y, edit, points:[{x,y,label}], showSym:'x'|'y'|'o' } */
  REG.coordplane = function (host, spec) {
    var lo = spec.min == null ? -5 : spec.min, hi = spec.max == null ? 5 : spec.max;
    var px = spec.x == null ? 3 : spec.x, py = spec.y == null ? 2 : spec.y;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 300', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function dot(g, x, y, label, color) {
      svg.appendChild(el('circle', { cx: g.X(x), cy: g.Y(y), r: 6 }, 'fill:var(--' + color + ')'));
      // 標籤預設放右邊，靠近右緣時改放左邊，免得被畫布切掉
      var right = g.X(x) + 26 + 30 < 320;
      // 點在 x 軸下方時標籤改放下面，免得壓到軸上的刻度數字
      svg.appendChild(txt(g.X(x) + (right ? 30 : -30), g.Y(y) + (y < 0 ? 16 : -12),
        (label ? label + ' ' : '') + '(' + x + ', ' + y + ')',
        'font-size:12px;font-weight:700;fill:var(--' + color + ')'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var g = drawPlane(svg, lo, hi, { quad: spec.quad });
      (spec.points || []).forEach(function (p) { dot(g, p.x, p.y, p.label, 'good'); });
      if (spec.edit !== false) {
        // 從原點先走 x 再走 y：坐標怎麼「找到」的路徑畫出來
        svg.appendChild(el('line', { x1: g.X(0), y1: g.Y(0), x2: g.X(px), y2: g.Y(0) },
          'stroke:var(--accent);stroke-width:2;stroke-dasharray:4 3'));
        svg.appendChild(el('line', { x1: g.X(px), y1: g.Y(0), x2: g.X(px), y2: g.Y(py) },
          'stroke:var(--accent);stroke-width:2;stroke-dasharray:4 3'));
        dot(g, px, py, 'P', 'accent');
        if (spec.showSym) {
          var sx = spec.showSym === 'y' || spec.showSym === 'o' ? -px : px;
          var sy = spec.showSym === 'x' || spec.showSym === 'o' ? -py : py;
          dot(g, sx, sy, 'P′', 'bad');
        }
        read.innerHTML = '';
        read.appendChild(div('wg-read-main', 'P (' + px + ', ' + py + ')　→　' + quadName(px, py)));
        read.appendChild(div('wg-read-sub',
          '先看第一個數：往右走 ' + px + '（負的往左）；再看第二個數：往上走 ' + py +
          '（負的往下）。順序寫反就變成不同的點。'));
      } else { read.textContent = ''; }
    }
    if (spec.edit !== false) {
      var sx2 = stepper('x（左右）', function () { return px; }, function (v) { px = v; }, lo, hi,
        function () { sx2.sync(); paint(); });
      var sy2 = stepper('y（上下）', function () { return py; }, function (v) { py = v; }, lo, hi,
        function () { sy2.sync(); paint(); });
      box.appendChild(sx2.el); box.appendChild(sy2.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 線型函數圖形（linegraph）─────────────────────────────────────────
     y = ax + b 的 a 決定斜度與方向、b 決定和 y 軸交在哪，調一調就看得出來。
     spec: { a, b, min, max, edit }                                        */
  REG.linegraph = function (host, spec) {
    var lo = spec.min == null ? -5 : spec.min, hi = spec.max == null ? 5 : spec.max;
    var a = spec.a == null ? 2 : spec.a, b = spec.b == null ? 1 : spec.b;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 300', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function fmt(a2, b2) {
      return 'y ＝ ' + (a2 === 1 ? '' : a2 === -1 ? '−' : a2) + 'x' +
        (b2 === 0 ? '' : b2 > 0 ? ' ＋ ' + b2 : ' − ' + (-b2));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var g = drawPlane(svg, lo, hi, { quad: false });
      var pts = [], i, x, y;
      for (i = 0; i <= 200; i++) {                       // 只畫落在畫面內的那一段
        x = lo + (hi - lo) * i / 200; y = a * x + b;
        if (y >= lo && y <= hi) pts.push(g.X(x).toFixed(1) + ',' + g.Y(y).toFixed(1));
      }
      if (pts.length > 1) {
        svg.appendChild(el('polyline', { points: pts.join(' ') },
          'fill:none;stroke:var(--accent);stroke-width:3'));
      }
      if (b >= lo && b <= hi) {                           // 與 y 軸的交點
        svg.appendChild(el('circle', { cx: g.X(0), cy: g.Y(b), r: 6 }, 'fill:var(--good)'));
        svg.appendChild(txt(g.X(0) + 34, g.Y(b) - 12, '(0, ' + b + ')',
          'font-size:12px;font-weight:700;fill:var(--good)'));
      }
      var xi = a === 0 ? null : -b / a;                    // 與 x 軸的交點
      if (xi != null && xi >= lo && xi <= hi) {
        svg.appendChild(el('circle', { cx: g.X(xi), cy: g.Y(0), r: 6 }, 'fill:var(--bad)'));
        // 標在軸的下方（刻度數字再往下一點），才不會和 (0, b) 的標籤疊在一起
        svg.appendChild(txt(g.X(xi), g.Y(0) + 26, '(' + (+xi.toFixed(2)) + ', 0)',
          'font-size:12px;font-weight:700;fill:var(--bad)'));
      }
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', fmt(a, b)));
      read.appendChild(div('wg-read-sub',
        (a === 0 ? 'a ＝ 0：圖形是一條水平線（y 永遠是 ' + b + '）。'
          : a > 0 ? 'a ＝ ' + a + ' 是正的 → 由左下往右上；x 每加 1，y 就加 ' + a + '。'
                  : 'a ＝ ' + a + ' 是負的 → 由左上往右下；x 每加 1，y 就減 ' + (-a) + '。') +
        '　b ＝ ' + b + ' → 圖形和 y 軸交在 (0, ' + b + ')。'));
    }
    if (spec.edit !== false) {
      var sa2 = stepper('a（斜度）', function () { return a; }, function (v) { a = v; }, -5, 5,
        function () { sa2.sync(); paint(); });
      var sb2 = stepper('b（和 y 軸交點）', function () { return b; }, function (v) { b = v; }, lo, hi,
        function () { sb2.sync(); paint(); });
      box.appendChild(sa2.el); box.appendChild(sb2.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 不等式的解（ineqline）────────────────────────────────────────────
     解不是一個數而是一整段：端點實心／空心、箭頭往哪邊，看圖最清楚。
     spec: { op:'>'|'>='|'<'|'<=', value, min, max, label }                */
  REG.ineqline = function (host, spec) {
    var op = spec.op || '>';
    var v = spec.value == null ? 2 : spec.value;
    var lo = spec.min == null ? -5 : spec.min, hi = spec.max == null ? 8 : spec.max;
    var nm = spec.label || 'x';
    var right = op === '>' || op === '>=';
    var closed = op === '>=' || op === '<=';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 110', class: 'wg-svg' });
    box.appendChild(svg);
    function X(t) { return 20 + (t - lo) / (hi - lo) * 280; }
    svg.appendChild(el('line', { x1: 14, y1: 55, x2: 306, y2: 55 }, 'stroke:var(--text);stroke-width:2'));
    for (var i = Math.ceil(lo); i <= hi; i++) {
      svg.appendChild(el('line', { x1: X(i), y1: 48, x2: X(i), y2: 62 }, 'stroke:var(--text);stroke-width:1.5'));
      svg.appendChild(txt(X(i), 76, String(i), 'font-size:11px;fill:var(--dim)'));
    }
    svg.appendChild(el('line', { x1: X(v), y1: 55, x2: right ? 300 : 20, y2: 55 },   // 解的那一段
      'stroke:var(--accent);stroke-width:6;stroke-linecap:round;opacity:.85'));
    var tipX = right ? 306 : 14;                                                      // 箭頭
    svg.appendChild(el('polygon',
      { points: tipX + ',55 ' + (right ? 294 : 26) + ',48 ' + (right ? 294 : 26) + ',62' },
      'fill:var(--accent)'));
    svg.appendChild(el('circle', { cx: X(v), cy: 55, r: 8 },
      closed ? 'fill:var(--accent)' : 'fill:var(--bg);stroke:var(--accent);stroke-width:3'));
    svg.appendChild(txt(X(v), 26, nm + ' ' + (op === '>=' ? '≥' : op === '<=' ? '≤' : op) + ' ' + v,
      'font-size:14px;font-weight:700;fill:var(--accent)'));
    box.appendChild(svg);
    box.appendChild(div('wg-read-main',
      '解：所有比 ' + v + (right ? '大' : '小') + '的數' + (closed ? '，而且包含 ' + v + ' 本身' : '（' + v + ' 不算）')));
    box.appendChild(div('wg-read-sub',
      (closed ? '≥ 和 ≤ 的端點畫「實心」●，因為那個數本身也是解。'
              : '> 和 < 的端點畫「空心」○，因為剛好等於那個數不算解。') +
      '塗色（箭頭那一邊）就是解的範圍，代表有無限多個答案，不是只有一個。'));
    host.appendChild(box);
  };

  /* ── 正比與反比（proportion）──────────────────────────────────────────
     正比：y ÷ x 固定，圖形是通過原點的直線；
     反比：x × y 固定，圖形是往兩端彎過去的曲線。
     spec: { mode:'direct'|'inverse', k, xs:[..], labelX, labelY, edit }   */
  REG.proportion = function (host, spec) {
    var inv = spec.mode === 'inverse';
    var k = spec.k == null ? (inv ? 12 : 3) : spec.k;
    var xs = spec.xs || (inv ? [1, 2, 3, 4, 6] : [1, 2, 3, 4, 5]);
    var lx = spec.labelX || 'x', ly = spec.labelY || 'y';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 260', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function f(x) { return inv ? k / x : k * x; }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      // 上半：對照表
      var n = xs.length, cw = Math.min(46, 240 / n), x0 = 160 - n * cw / 2;
      svg.appendChild(txt(x0 - 26, 24, lx, 'font-size:12px;fill:var(--dim)'));
      svg.appendChild(txt(x0 - 26, 52, ly, 'font-size:12px;fill:var(--dim)'));
      xs.forEach(function (x, i) {
        var cx = x0 + i * cw + cw / 2;
        svg.appendChild(el('rect', { x: x0 + i * cw, y: 10, width: cw - 2, height: 28, rx: 4 },
          'fill:var(--panel2);stroke:var(--border)'));
        svg.appendChild(el('rect', { x: x0 + i * cw, y: 38, width: cw - 2, height: 28, rx: 4 },
          'fill:var(--accent);fill-opacity:.18;stroke:var(--border)'));
        svg.appendChild(txt(cx, 24, String(x), 'font-size:13px'));
        svg.appendChild(txt(cx, 52, String(+f(x).toFixed(2)), 'font-size:13px'));
      });
      // 下半：圖形
      var L = 40, R = 300, T = 90, B = 232;
      var xmax = Math.max.apply(null, xs) + 1;
      var ymax = Math.max.apply(null, xs.map(f)) * 1.15;
      function X(x) { return L + x / xmax * (R - L); }
      function Y(y) { return B - y / ymax * (B - T); }
      svg.appendChild(el('line', { x1: L, y1: B, x2: R, y2: B }, 'stroke:var(--text);stroke-width:2'));
      svg.appendChild(el('line', { x1: L, y1: B, x2: L, y2: T }, 'stroke:var(--text);stroke-width:2'));
      svg.appendChild(txt(R - 6, B + 14, lx, 'font-size:11px;fill:var(--dim)'));
      svg.appendChild(txt(L - 14, T + 4, ly, 'font-size:11px;fill:var(--dim)'));
      var pts = [], i, x;
      for (i = 0; i <= 120; i++) {
        x = (inv ? 0.4 : 0) + (xmax - (inv ? 0.4 : 0)) * i / 120;
        if (f(x) <= ymax) pts.push(X(x).toFixed(1) + ',' + Y(f(x)).toFixed(1));
      }
      svg.appendChild(el('polyline', { points: pts.join(' ') },
        'fill:none;stroke:var(--accent);stroke-width:3'));
      xs.forEach(function (x2) {
        svg.appendChild(el('circle', { cx: X(x2), cy: Y(f(x2)), r: 4 }, 'fill:var(--good)'));
      });
      read.innerHTML = '';
      read.appendChild(div('wg-read-main', inv
        ? lx + ' × ' + ly + ' 每一組都等於 ' + k + '（固定）→ 成反比'
        : ly + ' ÷ ' + lx + ' 每一組都等於 ' + k + '（固定）→ 成正比'));
      read.appendChild(div('wg-read-sub', inv
        ? '一個變 2 倍，另一個就變成一半，乘積不變；圖形是一條彎向兩軸的曲線，永遠碰不到軸。'
        : '一個變 2 倍，另一個也變 2 倍，相除的商不變；圖形是一條通過原點 (0, 0) 的直線。'));
    }
    if (spec.edit !== false) {
      var sk = stepper(inv ? '乘積固定為' : '每 1 個 x 對應的 y', function () { return k; },
        function (v) { k = v; }, 1, 24, function () { sk.sync(); paint(); });
      box.appendChild(sk.el);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 細胞的構造（cell）────────────────────────────────────────────────
     動物細胞和植物細胞放在一起看，差別（細胞壁、葉綠體、大液泡）才記得住。
     spec: { mode:'animal'|'plant'|'compare', pick }                      */
  REG.cell = function (host, spec) {
    var mode = spec.mode || 'compare';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function animal(cx, cy) {
      svg.appendChild(el('ellipse', { cx: cx, cy: cy, rx: 58, ry: 44, 'fill-opacity': '.12' },
        'fill:var(--accent);stroke:var(--accent);stroke-width:2.5'));
      svg.appendChild(el('circle', { cx: cx - 6, cy: cy - 4, r: 15, 'fill-opacity': '.5' },
        'fill:var(--bad);stroke:var(--bad);stroke-width:2'));
      svg.appendChild(txt(cx - 6, cy - 4, '核', 'font-size:10px'));
      svg.appendChild(txt(cx + 34, cy + 26, '細胞質', 'font-size:9px;fill:var(--dim)'));
      svg.appendChild(txt(cx, cy - 52, '動物細胞', 'font-size:12px;font-weight:700;fill:var(--accent)'));
      svg.appendChild(txt(cx, cy + 58, '細胞膜（沒有細胞壁）', 'font-size:9px;fill:var(--dim)'));
    }
    function plant(cx, cy) {
      svg.appendChild(el('rect', { x: cx - 60, y: cy - 46, width: 120, height: 92, rx: 6 },
        'fill:none;stroke:var(--good);stroke-width:4'));
      svg.appendChild(el('rect', { x: cx - 54, y: cy - 40, width: 108, height: 80, rx: 4,
        'fill-opacity': '.10' }, 'fill:var(--good);stroke:var(--good);stroke-width:1.5'));
      svg.appendChild(el('rect', { x: cx - 30, y: cy - 22, width: 56, height: 44, rx: 8,
        'fill-opacity': '.22' }, 'fill:var(--accent);stroke:var(--accent);stroke-width:1.5'));
      svg.appendChild(txt(cx - 2, cy, '大液泡', 'font-size:9px;fill:var(--accent)'));
      svg.appendChild(el('circle', { cx: cx - 40, cy: cy - 24, r: 11, 'fill-opacity': '.5' },
        'fill:var(--bad);stroke:var(--bad);stroke-width:2'));
      svg.appendChild(txt(cx - 40, cy - 24, '核', 'font-size:9px'));
      [[cx + 38, cy - 26], [cx + 40, cy + 4], [cx + 20, cy + 30]].forEach(function (q) {
        svg.appendChild(el('ellipse', { cx: q[0], cy: q[1], rx: 8, ry: 5 }, 'fill:var(--good)'));
      });
      svg.appendChild(txt(cx, cy - 56, '植物細胞', 'font-size:12px;font-weight:700;fill:var(--good)'));
      svg.appendChild(txt(cx, cy + 60, '細胞壁＋葉綠體＋大液泡', 'font-size:9px;fill:var(--dim)'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'animal') {
        animal(160, 92);
        main = '動物細胞：細胞膜、細胞質、細胞核';
        sub = '細胞膜包住細胞、控制什麼可以進出；細胞質是進行各種化學反應的場所；' +
          '細胞核裝著遺傳物質，是細胞的指揮中心。' +
          '⚠ 動物細胞「沒有」細胞壁，所以形狀比較圓、不固定。';
      } else if (mode === 'plant') {
        plant(160, 92);
        main = '植物細胞多了三樣東西';
        sub = '① 細胞壁：在細胞膜外面，纖維素構成，硬的，讓細胞有固定的方形外形並支撐植物。' +
          '② 葉綠體：進行光合作用的地方（只有綠色部位才有，根就沒有）。' +
          '③ 大液泡：儲存水分和養分，把細胞撐飽（缺水時液泡縮小，植物就萎凋了）。';
      } else {
        animal(82, 88); plant(228, 88);
        main = '比一比：動物細胞 vs 植物細胞';
        sub = '兩者「都有」的：細胞膜、細胞質、細胞核。' +
          '只有植物細胞有的：細胞壁、葉綠體、大液泡。' +
          '⚠ 常見錯誤：以為植物細胞沒有細胞膜——它有，細胞壁只是加在外面的一層。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['animal', '動物細胞'], ['plant', '植物細胞'], ['compare', '比一比']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 生物體的組成層次（levels）────────────────────────────────────────
     細胞 → 組織 → 器官 → 器官系統 → 個體，一層一層點開來看。
     spec: { kind:'animal'|'plant', step, pick }                          */
  REG.levels = function (host, spec) {
    var kind = spec.kind || 'animal';
    var idx = spec.step == null ? 0 : spec.step;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 150', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var A = [
      ['細胞', '肌肉細胞', '構造與功能的基本單位'],
      ['組織', '肌肉組織', '許多形狀功能相似的細胞聚在一起'],
      ['器官', '胃', '不同的組織合作完成一項工作'],
      ['器官系統', '消化系統', '幾個器官接力完成一整套功能'],
      ['個體', '一個人', '各系統分工合作組成完整的生物']
    ];
    var T = [
      ['界', '動物界', '最大的分類階層，範圍最廣'],
      ['門', '脊索動物', '往下一層，共同特徵更多'],
      ['綱', '哺乳綱', '哺乳、有毛、恆溫'],
      ['目', '食肉目', '再往下分'],
      ['科', '貓科', '親緣關係已經很近'],
      ['屬', '豹屬', '幾乎只差一點點'],
      ['種', '老虎', '最小的階層，同種才能繁殖出有生殖力的後代']
    ];
    var P = [
      ['細胞', '葉肉細胞', '構造與功能的基本單位'],
      ['組織', '葉肉組織', '許多形狀功能相似的細胞聚在一起'],
      ['器官', '葉', '不同的組織合作完成一項工作'],
      ['個體', '一株植物', '根莖葉花果實種子組成完整的植物'],
      ['—', '植物沒有「器官系統」這一層', '這是植物和動物組成層次最大的差別']
    ];
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var L = kind === 'taxon' ? T : kind === 'plant' ? P : A;
      var n = kind === 'taxon' ? 7 : kind === 'plant' ? 4 : 5;
      var w = 300 / n;
      for (var i = 0; i < n; i++) {
        var x = 10 + i * w, on = i <= idx;
        svg.appendChild(el('rect', { x: x + 3, y: 46, width: w - 10, height: 46, rx: 8,
          'fill-opacity': on ? '.22' : '.05' },
          'fill:var(--accent);stroke:var(--' + (on ? 'accent' : 'border') + ');stroke-width:2'));
        svg.appendChild(txt(x + w / 2, 62, L[i][0],
          'font-size:' + (n > 5 ? 10 : 11) + 'px;font-weight:700'));
        svg.appendChild(txt(x + w / 2, 80, L[i][1],
          'font-size:' + (n > 5 ? 7.5 : 9) + 'px;fill:var(--dim)'));
        if (i) svg.appendChild(txt(x, 70, n > 5 ? '›' : '→', 'font-size:13px;fill:var(--dim)'));
      }
      svg.appendChild(txt(160, 122, kind === 'taxon'
        ? '越往右範圍越小、親緣關係越近' : '越往右越複雜（小 → 大）',
        'font-size:10px;fill:var(--dim)'));
      var cur = L[Math.min(idx, n - 1)];
      read.appendChild(div('wg-read-main', cur[0] + '：' + cur[2]));
      read.appendChild(div('wg-read-sub', kind === 'taxon'
        ? '生物分類的七個階層：界、門、綱、目、科、屬、種。' +
          '越往下範圍越小、成員之間越像。學名採「二名法」，由屬名加種小名組成，用斜體書寫。' +
          '⚠ 「種」是最基本的單位：同種的個體交配才能產生具有生殖能力的後代' +
          '（馬和驢交配生出的騾沒有生殖能力，所以牠們不同種）。'
        : kind === 'plant'
        ? '植物：細胞 → 組織 → 器官 → 個體。⚠ 植物「沒有器官系統」這一層，' +
          '它的六大器官是根、莖、葉（營養器官）和花、果實、種子（生殖器官）。'
        : '動物：細胞 → 組織 → 器官 → 器官系統 → 個體。' +
          '例如：肌肉細胞 → 肌肉組織 → 胃 → 消化系統 → 一個人。' +
          '⚠ 單細胞生物（草履蟲、變形蟲）一個細胞就是一個個體，沒有這些層次。'));
    }
    var row = div('wg-ctrl');
    row.appendChild(btn(kind === 'taxon' ? '往下一層 ▶' : '往上一層 ▶', function () {
      idx = (idx + 1) % (kind === 'taxon' ? 7 : kind === 'plant' ? 4 : 5); paint();
    }));
    if (spec.pick !== false) {
      row.appendChild(btn('動物', function () { kind = 'animal'; idx = 0; paint(); }));
      row.appendChild(btn('植物', function () { kind = 'plant'; idx = 0; paint(); }));
    }
    box.appendChild(row);
    host.appendChild(box);
    paint();
  };

  /* ── 酵素（enzyme）────────────────────────────────────────────────────
     酵素像一把鑰匙只開一種鎖；溫度太高會讓它失去作用（變性）。
     spec: { mode:'lock'|'temp', temp }                                   */
  REG.enzyme = function (host, spec) {
    var mode = spec.mode || 'lock';
    var t = spec.temp == null ? 37 : spec.temp;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function rate(T) {
      if (T >= 60) return 0;
      if (T <= 0) return 0;
      return Math.max(0, 100 - Math.abs(T - 37) * (T > 37 ? 4.2 : 2.4));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'temp') {
        svg.appendChild(el('line', { x1: 24, y1: 130, x2: 300, y2: 130 }, 'stroke:var(--text);stroke-width:2'));
        svg.appendChild(el('line', { x1: 24, y1: 20, x2: 24, y2: 130 }, 'stroke:var(--text);stroke-width:2'));
        var pts = [];
        for (var T = 0; T <= 70; T += 2) {
          pts.push((24 + T / 70 * 272) + ',' + (130 - rate(T) / 100 * 96));
        }
        svg.appendChild(el('polyline', { points: pts.join(' ') },
          'fill:none;stroke:var(--accent);stroke-width:3'));
        var x = 24 + t / 70 * 272, y = 130 - rate(t) / 100 * 96;
        svg.appendChild(el('line', { x1: x, y1: 130, x2: x, y2: y },
          'stroke:var(--dim);stroke-width:1;stroke-dasharray:3 3'));
        svg.appendChild(el('circle', { cx: x, cy: y, r: 6 }, 'fill:var(--bad)'));
        svg.appendChild(txt(160, 148, '溫度（℃）→', 'font-size:10px;fill:var(--dim)'));
        svg.appendChild(txt(40, 16, '作用速率', 'font-size:10px;fill:var(--dim)'));
        main = t + '℃：作用速率約 ' + Math.round(rate(t)) + '％';
        sub = '酵素在體溫（約 37℃）附近作用最快。' +
          '溫度太低時分子動得慢，反應變慢——但只是「暫時變慢」，回溫就會恢復。' +
          '⚠ 溫度太高（約 60℃ 以上）酵素會被破壞（變性），' +
          '就算再降溫也救不回來，這是不可逆的。';
      } else {
        svg.appendChild(el('rect', { x: 24, y: 50, width: 84, height: 60, rx: 10,
          'fill-opacity': '.18' }, 'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(txt(66, 80, '酵素', 'font-size:12px;fill:var(--accent);font-weight:700'));
        svg.appendChild(el('rect', { x: 126, y: 62, width: 40, height: 36, rx: 6,
          'fill-opacity': '.3' }, 'fill:var(--good);stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(146, 80, '受質', 'font-size:10px'));
        svg.appendChild(txt(186, 80, '→', 'font-size:18px;fill:var(--dim)'));
        [[218, 66], [218, 96], [262, 66], [262, 96]].forEach(function (q) {
          svg.appendChild(el('rect', { x: q[0], y: q[1] - 12, width: 30, height: 24, rx: 5,
            'fill-opacity': '.3' }, 'fill:var(--bad);stroke:var(--bad);stroke-width:2'));
        });
        svg.appendChild(txt(244, 132, '分解後的小分子（產物）', 'font-size:10px;fill:var(--dim)'));
        svg.appendChild(txt(66, 128, '酵素本身不會被消耗', 'font-size:10px;fill:var(--accent)'));
        main = '酵素：一把鑰匙只開一種鎖';
        sub = '酵素是生物體製造的蛋白質，能加快化學反應的速率。' +
          '每一種酵素只對特定的受質作用（澱粉酶只分解澱粉、不會分解蛋白質），這叫「專一性」。' +
          '⚠ 酵素在反應中不會被消耗，可以重複使用；它只是讓反應變快，不會改變反應的結果。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    var row = div('wg-ctrl');
    if (spec.pick !== false) {
      row.appendChild(btn('專一性', function () { mode = 'lock'; paint(); }));
      row.appendChild(btn('溫度的影響', function () { mode = 'temp'; paint(); }));
    }
    row.appendChild(slider(0, 70, t, 1, function (v) { t = v; mode = 'temp'; paint(); }));
    box.appendChild(row);
    host.appendChild(box);
    paint();
  };

  /* ── 神經與反射（nerve）───────────────────────────────────────────────
     反射弧走脊髓、不經過大腦，所以「先縮手才覺得痛」。
     spec: { mode:'reflex'|'brain', pick }                                */
  REG.nerve = function (host, spec) {
    var mode = spec.mode || 'reflex';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'brain') {
        [['大腦', 60, '思考與感覺'],
         ['小腦', 160, '平衡與協調'],
         ['腦幹', 260, '心跳與呼吸']].forEach(function (c) {
          svg.appendChild(el('rect', { x: c[1] - 46, y: 46, width: 92, height: 44, rx: 10,
            'fill-opacity': '.18' }, 'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
          svg.appendChild(txt(c[1], 62, c[0], 'font-size:12px;font-weight:700'));
          svg.appendChild(txt(c[1], 80, c[2], 'font-size:9px;fill:var(--dim)'));
        });
        svg.appendChild(txt(160, 118, '腦 ＋ 脊髓 ＝ 中樞神經系統', 'font-size:11px;fill:var(--good)'));
        svg.appendChild(txt(160, 140, '腦幹受損最危險：心跳呼吸會停', 'font-size:10px;fill:var(--bad)'));
        main = '腦的三個部分各有分工';
        sub = '大腦：思考、記憶、語言、感覺，以及我們「想要做」的動作。' +
          '小腦：協調動作、維持平衡（喝醉的人走路不穩就是小腦受影響）。' +
          '腦幹：控制心跳、呼吸這些不用想就會做的事，所以腦幹受損最危險。';
      } else {
        var nodes = [['受器\n（皮膚）', 34], ['感覺神經', 100], ['脊髓', 164], ['運動神經', 228], ['動器\n（肌肉）', 290]];
        nodes.forEach(function (nd, i) {
          var c = i === 2 ? 'bad' : 'accent';
          svg.appendChild(el('circle', { cx: nd[1], cy: 74, r: 24, 'fill-opacity': '.18' },
            'fill:var(--' + c + ');stroke:var(--' + c + ');stroke-width:2'));
          nd[0].split('\n').forEach(function (ln, k) {
            svg.appendChild(txt(nd[1], 70 + k * 12, ln, 'font-size:9px'));
          });
          if (i) svg.appendChild(el('line', { x1: nodes[i - 1][1] + 25, y1: 74, x2: nd[1] - 25, y2: 74 },
            'stroke:var(--good);stroke-width:2.5'));
        });
        svg.appendChild(el('path', { d: 'M164,50 C164,20 240,18 258,40' },
          'fill:none;stroke:var(--dim);stroke-width:1.5;stroke-dasharray:4 4'));
        svg.appendChild(txt(238, 14, '之後才傳到大腦 → 覺得痛', 'font-size:9px;fill:var(--dim)'));
        svg.appendChild(txt(160, 122, '刺激 → 受器 → 感覺神經 → 脊髓 → 運動神經 → 動器',
          'font-size:10px;fill:var(--good)'));
        svg.appendChild(txt(160, 146, '⚠ 反射不經過大腦，所以特別快', 'font-size:11px;fill:var(--bad)'));
        main = '反射弧：反應快，因為不繞去大腦';
        sub = '手碰到燙的東西會「先縮手、後覺得痛」，就是因為訊息只走到脊髓就直接下令縮手，' +
          '同時才另外傳去大腦讓我們感覺到痛。' +
          '常見的反射：膝跳反射、眨眼、打噴嚏、瞳孔遇強光縮小。' +
          '⚠ 反射的中樞是脊髓（有些在腦幹），不是大腦——這是最常考的一句。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      row.appendChild(btn('反射弧', function () { mode = 'reflex'; paint(); }));
      row.appendChild(btn('腦的分工', function () { mode = 'brain'; paint(); }));
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 遺傳棋盤方格（punnett）───────────────────────────────────────────
     兩個親代的配子交叉配對，子代的比例是「數格子」數出來的，不是背的。
     spec: { a:'Aa', b:'Aa', trait:['高','矮'] }                          */
  REG.punnett = function (host, spec) {
    var A = (spec.a || 'Aa').split(''), B = (spec.b || 'Aa').split('');
    var trait = spec.trait || ['顯性性狀', '隱性性狀'];
    var big = A[0].toUpperCase();
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var x0 = 96, y0 = 46, c = 62;
      svg.appendChild(txt(x0 + c, 20, '父：' + A.join(''), 'font-size:12px;fill:var(--accent);font-weight:700'));
      var lab = el('text', { x: 40, y: 108, 'text-anchor': 'middle' },
        'font-size:12px;fill:var(--good);font-weight:700');
      lab.textContent = '母：' + B.join('');
      svg.appendChild(lab);
      var counts = { dom: 0, rec: 0 }, kinds = {};
      A.forEach(function (a, i) {
        svg.appendChild(txt(x0 + i * c + c / 2, 40, a, 'font-size:13px;fill:var(--accent);font-weight:700'));
      });
      B.forEach(function (b, j) {
        svg.appendChild(txt(x0 - 14, y0 + j * c + c / 2, b, 'font-size:13px;fill:var(--good);font-weight:700'));
      });
      B.forEach(function (b, j) {
        A.forEach(function (a, i) {
          var pair = [a, b].sort().join('');
          var dom = pair.indexOf(big) >= 0;
          if (dom) counts.dom++; else counts.rec++;
          kinds[pair] = (kinds[pair] || 0) + 1;
          svg.appendChild(el('rect', { x: x0 + i * c, y: y0 + j * c, width: c, height: c,
            'fill-opacity': '.16' },
            'fill:var(--' + (dom ? 'accent' : 'bad') + ');stroke:var(--border);stroke-width:1.5'));
          svg.appendChild(txt(x0 + i * c + c / 2, y0 + j * c + c / 2, pair,
            'font-size:15px;font-weight:700;fill:var(--' + (dom ? 'accent' : 'bad') + ')'));
        });
      });
      var ks = Object.keys(kinds).sort();
      read.appendChild(div('wg-read-main',
        '基因型比例　' + ks.map(function (k) { return k + ' ' + kinds[k]; }).join('：') +
        '　　外表型　' + trait[0] + ' ' + counts.dom + '：' + trait[1] + ' ' + counts.rec));
      read.appendChild(div('wg-read-sub',
        '把父方的兩種配子寫在上面、母方的寫在左邊，交叉填進格子就是所有可能的組合。' +
        '只要有一個大寫（顯性）基因，外表就表現顯性性狀（' + trait[0] + '）；' +
        '兩個都是小寫時才表現隱性性狀（' + trait[1] + '）。' +
        '⚠ 這是「機率」不是保證：4 個子代不一定剛好照這個比例分配，數量越多才越接近。'));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['Aa', 'Aa', 'Aa × Aa'], ['AA', 'aa', 'AA × aa'], ['Aa', 'aa', 'Aa × aa']].forEach(function (m) {
        row.appendChild(btn(m[2], function () { A = m[0].split(''); B = m[1].split(''); paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 染色體與基因（dna）───────────────────────────────────────────────
     spec: { mode:'levels'|'sex'|'mitosis', pick }                        */
  REG.dna = function (host, spec) {
    var mode = spec.mode || 'levels';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'sex') {
        [['父 XY', 60, ['X', 'Y']], ['母 XX', 240, ['X', 'X']]].forEach(function (p) {
          svg.appendChild(txt(p[1], 26, p[0], 'font-size:12px;font-weight:700;fill:var(--dim)'));
          p[2].forEach(function (g, i) {
            svg.appendChild(el('circle', { cx: p[1] - 26 + i * 52, cy: 54, r: 17, 'fill-opacity': '.2' },
              'fill:var(--' + (g === 'Y' ? 'bad' : 'accent') + ');stroke:var(--' +
              (g === 'Y' ? 'bad' : 'accent') + ');stroke-width:2'));
            svg.appendChild(txt(p[1] - 26 + i * 52, 54, g, 'font-size:13px;font-weight:700'));
          });
        });
        [['XX 女生', 96, 'accent'], ['XY 男生', 224, 'bad']].forEach(function (c) {
          svg.appendChild(el('rect', { x: c[1] - 52, y: 108, width: 104, height: 34, rx: 8,
            'fill-opacity': '.18' }, 'fill:var(--' + c[2] + ');stroke:var(--' + c[2] + ');stroke-width:2'));
          svg.appendChild(txt(c[1], 125, c[0], 'font-size:12px;font-weight:700'));
        });
        svg.appendChild(txt(160, 88, '各 50%', 'font-size:11px;fill:var(--good)'));
        svg.appendChild(txt(160, 162, '孩子的性別由父親給的是 X 還是 Y 決定',
          'font-size:11px;fill:var(--good)'));
        main = '性別決定：男女機率各一半';
        sub = '人有 23 對染色體，其中 22 對是體染色體，第 23 對是性染色體。' +
          '女生是 XX、男生是 XY。母親的卵一定帶 X；父親的精子有一半帶 X、一半帶 Y。' +
          '⚠ 所以孩子的性別是由父親決定的，而且生男生女的機率各是 50%，' +
          '前面生過幾個女兒都不會改變下一胎的機率。';
      } else if (mode === 'mitosis') {
        [['體細胞分裂', 82, '2n → 2n', '一樣多'], ['減數分裂', 238, '2n → n', '減半']].forEach(function (c, i) {
          svg.appendChild(el('rect', { x: c[1] - 66, y: 40, width: 132, height: 76, rx: 10,
            'fill-opacity': '.14' }, 'fill:var(--' + (i ? 'bad' : 'accent') + ');stroke:var(--' +
            (i ? 'bad' : 'accent') + ');stroke-width:2'));
          svg.appendChild(txt(c[1], 60, c[0], 'font-size:12px;font-weight:700'));
          svg.appendChild(txt(c[1], 82, c[2], 'font-size:13px;fill:var(--dim)'));
          svg.appendChild(txt(c[1], 102, '染色體數目' + c[3], 'font-size:10px;fill:var(--dim)'));
        });
        svg.appendChild(txt(82, 140, '用於生長與修補', 'font-size:10px;fill:var(--accent)'));
        svg.appendChild(txt(238, 140, '用於產生精子與卵', 'font-size:10px;fill:var(--bad)'));
        main = '兩種分裂：一種數目不變，一種減半';
        sub = '體細胞分裂：一個細胞分成兩個，染色體數目和母細胞一樣（人是 46 條），用於生長和修補。' +
          '減數分裂：染色體數目減半（人的精子和卵各 23 條），只發生在生殖細胞的形成過程。' +
          '⚠ 減半是必要的：受精時精卵結合，才會恢復成 46 條，' +
          '否則每一代的染色體數目都會加倍。';
      } else {
        [['細胞核', 46], ['染色體', 126], ['DNA', 202], ['基因', 274]].forEach(function (c, i) {
          svg.appendChild(el('rect', { x: c[1] - 34, y: 56, width: 68, height: 44, rx: 8,
            'fill-opacity': '.18' }, 'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
          svg.appendChild(txt(c[1], 78, c[0], 'font-size:11px;font-weight:700'));
          if (i) svg.appendChild(txt(c[1] - 40, 78, '›', 'font-size:16px;fill:var(--dim)'));
        });
        svg.appendChild(txt(160, 128, '一段一段的 DNA ＝ 一個一個的基因',
          'font-size:11px;fill:var(--good)'));
        svg.appendChild(txt(160, 152, '基因決定一個性狀（例如單雙眼皮）',
          'font-size:10px;fill:var(--dim)'));
        main = '細胞核 › 染色體 › DNA › 基因';
        sub = '細胞核裡有染色體，染色體主要由 DNA 和蛋白質組成，' +
          'DNA 上一段一段控制特定性狀的片段就是「基因」。' +
          '⚠ 大小關係要記牢：染色體最大，基因是 DNA 上的一小段。' +
          '同一種生物的染色體數目固定（人 46 條、豌豆 14 條），數目多寡和高不高等無關。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['levels', '基因在哪裡'], ['mitosis', '兩種分裂'], ['sex', '性別決定']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 物質循環（cycle）─────────────────────────────────────────────────
     spec: { mode:'carbon'|'water'|'nitrogen', pick }                     */
  REG.cycle = function (host, spec) {
    var mode = spec.mode || 'carbon';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var SETS = {
      carbon: { hub: '大氣中的二氧化碳',
        nodes: ['植物（光合作用）', '動物（攝食）', '分解者', '燃燒化石燃料'],
        main: '碳循環：進出大氣的兩條路',
        sub: '把二氧化碳「拿走」的：植物的光合作用。' +
          '把二氧化碳「放回去」的：生物的呼吸作用、分解者分解遺體、以及燃燒化石燃料。' +
          '⚠ 人類大量燃燒煤和石油，讓放回去的遠多於拿走的，' +
          '大氣中的二氧化碳濃度上升，造成溫室效應加劇。' },
      water: { hub: '海洋與水體',
        nodes: ['蒸發', '凝結成雲', '降水', '地表與地下逕流'],
        main: '水循環：太陽是動力來源',
        sub: '水受太陽照射蒸發（植物的蒸散也送出水氣）→ 上升遇冷凝結成雲 → ' +
          '降下雨雪 → 一部分滲入地下、一部分流回河海，再重新蒸發。' +
          '⚠ 地球上的水總量幾乎不變，只是不斷改變狀態和位置；' +
          '真正能用的淡水其實不到 1%，所以節約用水有意義。' },
      nitrogen: { hub: '大氣中的氮氣（約 78%）',
        nodes: ['固氮細菌', '植物吸收含氮鹽類', '動物攝食', '分解者與脫氮'],
        main: '氮循環：大氣裡有很多，卻不能直接用',
        sub: '氮氣占空氣的 78%，但大多數生物不能直接利用。' +
          '要靠根瘤菌等「固氮細菌」（或閃電、工業固氮）把它轉成含氮鹽類，植物才吸收得到。' +
          '⚠ 所以豆科植物的根瘤能讓土壤變肥沃，輪作時常安排種豆類。' +
          '動物由攝食取得含氮養分，遺體與排泄物再由分解者送回土壤。' }
    };
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var S = SETS[mode] || SETS.carbon;
      svg.appendChild(el('circle', { cx: 160, cy: 96, r: 42, 'fill-opacity': '.18' },
        'fill:var(--accent);stroke:var(--accent);stroke-width:2.5'));
      var hub = S.hub.length > 7 ? [S.hub.slice(0, 6), S.hub.slice(6)] : [S.hub];
      hub.forEach(function (ln, i) {
        svg.appendChild(txt(160, 90 + i * 14, ln, 'font-size:10px;font-weight:700'));
      });
      var pos = [[54, 34], [266, 34], [54, 158], [266, 158]];
      S.nodes.forEach(function (n, i) {
        var p = pos[i];
        svg.appendChild(el('rect', { x: p[0] - 50, y: p[1] - 15, width: 100, height: 30, rx: 8,
          'fill-opacity': '.14' }, 'fill:var(--good);stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(p[0], p[1], n, 'font-size:9px'));
        var dx = p[0] < 160 ? 1 : -1, dy = p[1] < 96 ? 1 : -1;
        svg.appendChild(el('line',
          { x1: p[0] + dx * 46, y1: p[1] + dy * 14, x2: 160 - dx * 34, y2: 96 - dy * 26 },
          'stroke:var(--dim);stroke-width:1.5'));
      });
      read.appendChild(div('wg-read-main', S.main));
      read.appendChild(div('wg-read-sub', S.sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['carbon', '碳循環'], ['water', '水循環'], ['nitrogen', '氮循環']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 密度（density）───────────────────────────────────────────────────
     同樣體積誰比較重？密度就是「每 1 立方公分有幾公克」。
     spec: { material, vol }                                              */
  REG.density = function (host, spec) {
    var MATS = [['木頭', 0.6], ['冰', 0.92], ['水', 1.0], ['鋁', 2.7], ['鐵', 7.9]];
    var mi = spec.material == null ? 0 : spec.material;
    var V = spec.vol == null ? 10 : spec.vol;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var d = MATS[mi][1], m = +(d * V).toFixed(2), sink = d > 1;
      svg.appendChild(el('rect', { x: 18, y: 36, width: 150, height: 116, rx: 6, 'fill-opacity': '.12' },
        'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
      svg.appendChild(el('line', { x1: 18, y1: 66, x2: 168, y2: 66 },
        'stroke:var(--accent);stroke-width:2'));
      svg.appendChild(txt(96, 28, '水', 'font-size:11px;fill:var(--accent)'));
      var side = Math.max(16, Math.min(52, Math.sqrt(V) * 12));
      var by = sink ? 152 - side : 66 - side / 2;
      svg.appendChild(el('rect', { x: 96 - side / 2, y: by, width: side, height: side, rx: 4,
        'fill-opacity': '.55' }, 'fill:var(--' + (sink ? 'bad' : 'good') + ');stroke:var(--' +
        (sink ? 'bad' : 'good') + ');stroke-width:2'));
      svg.appendChild(txt(96, 168, sink ? '沉下去（密度 > 1）' : '浮起來（密度 < 1）',
        'font-size:11px;fill:var(--' + (sink ? 'bad' : 'good') + ')'));
      [['體積 V', V + ' cm³', 60], ['密度 D', d + ' g/cm³', 92], ['質量 M', m + ' g', 124]]
        .forEach(function (r) {
          svg.appendChild(txt(240, r[2] - 10, r[0], 'font-size:11px;fill:var(--dim)'));
          svg.appendChild(txt(240, r[2] + 8, r[1], 'font-size:15px;font-weight:700;fill:var(--accent)'));
        });
      svg.appendChild(txt(240, 30, MATS[mi][0], 'font-size:14px;font-weight:700'));
      svg.appendChild(txt(240, 152, 'M ＝ D × V', 'font-size:12px;fill:var(--good)'));
      read.appendChild(div('wg-read-main',
        MATS[mi][0] + ' ' + V + ' cm³ 的質量 ＝ ' + d + ' × ' + V + ' ＝ ' + m + ' 公克'));
      read.appendChild(div('wg-read-sub',
        '密度 ＝ 質量 ÷ 體積，代表「每 1 立方公分有幾公克」，是物質的固有性質。' +
        '⚠ 把一塊鐵切成一半，質量和體積都變一半，密度「不會改變」——這是最常考的觀念。' +
        '密度比水（1 g/cm³）小的會浮、大的會沉。' +
        '水很特別：結成冰後密度變小（0.92），所以冰會浮在水面上。'));
    }
    var row = div('wg-ctrl');
    MATS.forEach(function (m, i) {
      row.appendChild(btn(m[0], function () { mi = i; paint(); }));
    });
    box.appendChild(row);
    var row2 = div('wg-ctrl');
    row2.appendChild(slider(1, 30, V, 1, function (v) { V = v; paint(); }));
    box.appendChild(row2);
    host.appendChild(box);
    paint();
  };

  /* ── 成像（imaging）───────────────────────────────────────────────────
     透鏡與面鏡的成像：拉動物距，看像跑到哪、是實是虛、是正是倒。
     spec: { mode:'lens'|'clens'|'cmirror'|'xmirror', u }                 */
  REG.imaging = function (host, spec) {
    var mode = spec.mode || 'lens';
    var u = spec.u == null ? 90 : spec.u;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var AY = 104, H = 34, F = 44;
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var mirror = mode === 'cmirror' || mode === 'xmirror';
      var f0 = (mode === 'clens' || mode === 'xmirror') ? -F : F;
      var X = mirror ? 244 : 178;
      var v0 = (u === f0) ? null : u * f0 / (u - f0);   // v>0：實像；v<0：虛像
      var real = v0 !== null && v0 > 0;
      // 像跑太遠或太大時整張圖一起縮小（比例不變，看起來像鏡頭拉遠）
      var k = 1;
      if (v0 !== null) {
        var ih0 = H * Math.abs(v0 / u);
        k = Math.min(1, 132 / Math.abs(v0), 56 / ih0, 150 / u);
      }
      var f = f0 * k, uu = u * k, hh = H * k;
      var v = v0 === null ? null : v0 * k;
      var ox = X - uu;
      var sgn = mirror ? -1 : 1;                        // 實像在鏡的哪一側
      var ix = v === null ? null : X + sgn * v;
      var ih = v === null ? 0 : hh * Math.abs(v / uu);
      svg.appendChild(el('line', { x1: 8, y1: AY, x2: 312, y2: AY }, 'stroke:var(--dim);stroke-width:1.5'));
      // 元件
      if (mirror) {
        var bend = mode === 'cmirror' ? 16 : -16;   // 凹面鏡：凹的那一面朝向物體
        svg.appendChild(el('path',
          { d: 'M' + (X - bend / 2) + ',' + (AY - 56) + ' Q' + (X + bend) + ',' + AY + ' ' +
               (X - bend / 2) + ',' + (AY + 56) },
          'fill:none;stroke:var(--text);stroke-width:4'));
        svg.appendChild(txt(X + 22, AY + 74, mode === 'cmirror' ? '凹面鏡' : '凸面鏡',
          'font-size:10px;fill:var(--dim)'));
      } else {
        svg.appendChild(el('ellipse', { cx: X, cy: AY, rx: mode === 'lens' ? 9 : 5, ry: 52,
          'fill-opacity': '.22' }, 'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(txt(X, AY + 70, mode === 'lens' ? '凸透鏡' : '凹透鏡',
          'font-size:10px;fill:var(--dim)'));
      }
      // 焦點：透鏡兩側都有；面鏡只有一個（凹面鏡在鏡前、凸面鏡是鏡後的虛焦點）
      var fpts = mirror
        ? [[mode === 'cmirror' ? -1 : 1, mode === 'cmirror' ? 'F' : '虛焦點']]
        : [[-1, 'F'], [1, "F'"]];
      fpts.forEach(function (p) {
        var fx = X + p[0] * F * k;
        svg.appendChild(el('circle', { cx: fx, cy: AY, r: 3 }, 'fill:var(--dim)'));
        svg.appendChild(txt(fx, AY - 7, p[1], 'font-size:10px;fill:var(--dim)'));
      });
      // 物體
      svg.appendChild(el('line', { x1: ox, y1: AY, x2: ox, y2: AY - hh },
        'stroke:var(--good);stroke-width:3'));
      svg.appendChild(el('polygon', { points: ox + ',' + (AY - hh - 8) + ' ' + (ox - 5) + ',' +
        (AY - hh) + ' ' + (ox + 5) + ',' + (AY - hh) }, 'fill:var(--good)'));
      svg.appendChild(txt(ox, AY + 16, '物', 'font-size:11px;fill:var(--good)'));
      var main, sub;
      if (v === null) {
        svg.appendChild(txt(160, 26, '物體剛好在焦點上：反射／折射後的光互相平行，不成像',
          'font-size:10px;fill:var(--bad)'));
        main = '物體放在焦點上 → 不成像';
        sub = '這時候射出去的光線彼此平行，永遠不會相交，也沒有反向延長線的交點，' +
          '所以既沒有實像也沒有虛像。這是成像規則裡唯一的「例外點」。';
      } else {
        var iy = real ? AY + ih : AY - ih;   // 實像倒立、虛像正立
        var dash = real ? '' : ';stroke-dasharray:5 4';
        svg.appendChild(el('line', { x1: ix, y1: AY, x2: ix, y2: iy },
          'stroke:var(--bad);stroke-width:3' + dash));
        svg.appendChild(el('polygon', { points: ix + ',' + (iy + (real ? 8 : -8)) + ' ' +
          (ix - 5) + ',' + iy + ' ' + (ix + 5) + ',' + iy }, 'fill:var(--bad)'));
        svg.appendChild(txt(ix, real ? AY - 12 : AY + 16, '像', 'font-size:11px;fill:var(--bad)'));
        // 光線：① 平行光 → 過焦點　② 過中心（透鏡）／到頂點反射（面鏡）
        var top = AY - hh;
        svg.appendChild(el('line', { x1: ox, y1: top, x2: X, y2: top },
          'stroke:var(--accent);stroke-width:2'));
        svg.appendChild(el('line', { x1: X, y1: top, x2: ix, y2: iy },
          'stroke:var(--accent);stroke-width:2' + dash));
        svg.appendChild(el('line', { x1: ox, y1: top, x2: X, y2: AY },
          'stroke:var(--good);stroke-width:2'));
        svg.appendChild(el('line', { x1: X, y1: AY, x2: ix, y2: iy },
          'stroke:var(--good);stroke-width:2' + dash));
        var mag = Math.abs(v0 / u);
        var size = mag > 1.05 ? '放大' : (mag < 0.95 ? '縮小' : '一樣大');
        main = (real ? '實像' : '虛像') + '　' + (real ? '倒立' : '正立') + '　' + size +
          '（放大率約 ' + mag.toFixed(2) + ' 倍）';
        sub = (mode === 'lens'
          ? '凸透鏡：物體在 2F 以外 → 縮小倒立實像（照相機）；在 F 和 2F 之間 → 放大倒立實像（投影機）；' +
            '在 F 以內 → 放大正立虛像（放大鏡）。'
          : mode === 'clens'
            ? '凹透鏡不管物體放哪裡，都成「縮小正立虛像」，用於近視眼鏡。'
            : mode === 'cmirror'
              ? '凹面鏡：物體在焦點以外成倒立實像（太陽灶、天文望遠鏡）；在焦點以內成放大正立虛像（化妝鏡）。'
              : '凸面鏡不管物體放哪裡，都成「縮小正立虛像」，視野範圍大，' +
                '所以用在轉彎鏡和汽車的後視鏡。') +
          '⚠ 實像可以用屏幕接到（光真的會合在那裡），虛像接不到，只能用眼睛看。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['lens', '凸透鏡'], ['clens', '凹透鏡'], ['cmirror', '凹面鏡'], ['xmirror', '凸面鏡']]
        .forEach(function (m) { row.appendChild(btn(m[1], function () { mode = m[0]; paint(); })); });
      box.appendChild(row);
    }
    var row2 = div('wg-ctrl');
    row2.appendChild(slider(20, 150, u, 2, function (val) { u = val; paint(); }));
    box.appendChild(row2);
    host.appendChild(box);
    paint();
  };

  /* ── 原子（atom）──────────────────────────────────────────────────────
     質子數決定是哪一種元素；電子跑掉或跑進來就變成離子。
     spec: { z, n, e, pick }                                              */
  REG.atom = function (host, spec) {
    var NAMES = { 1: ['氫', 'H'], 2: ['氦', 'He'], 3: ['鋰', 'Li'], 6: ['碳', 'C'],
      7: ['氮', 'N'], 8: ['氧', 'O'], 11: ['鈉', 'Na'], 12: ['鎂', 'Mg'],
      13: ['鋁', 'Al'], 17: ['氯', 'Cl'], 20: ['鈣', 'Ca'] };
    var z = spec.z == null ? 8 : spec.z;
    var extra = spec.e == null ? 0 : spec.e;          // 電子的增減
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function shells(e) {
      var caps = [2, 8, 8, 18], out = [], left = e;
      for (var i = 0; i < caps.length && left > 0; i++) {
        out.push(Math.min(caps[i], left)); left -= caps[i];
      }
      return out;
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var nm = NAMES[z] || ['？', '?'];
      var e = z + extra, n = z === 1 ? 0 : z;           // 中子數用最常見的同位素粗估
      svg.appendChild(el('circle', { cx: 108, cy: 90, r: 22, 'fill-opacity': '.35' },
        'fill:var(--bad);stroke:var(--bad);stroke-width:2'));
      svg.appendChild(txt(108, 86, '＋' + z, 'font-size:12px;font-weight:700'));
      svg.appendChild(txt(108, 100, 'p' + z + ' n' + n, 'font-size:8px;fill:var(--dim)'));
      shells(e).forEach(function (cnt, i) {
        var r = 34 + i * 20;
        svg.appendChild(el('circle', { cx: 108, cy: 90, r: r },
          'fill:none;stroke:var(--border);stroke-width:1;stroke-dasharray:3 3'));
        for (var k = 0; k < cnt; k++) {
          var a = (Math.PI * 2 / cnt) * k - Math.PI / 2;
          svg.appendChild(el('circle',
            { cx: 108 + r * Math.cos(a), cy: 90 + r * Math.sin(a), r: 3.5 }, 'fill:var(--accent)'));
        }
      });
      var charge = extra === 0 ? '中性原子' : (extra < 0 ? '陽離子（帶正電）' : '陰離子（帶負電）');
      svg.appendChild(txt(248, 34, nm[0] + '　' + nm[1], 'font-size:16px;font-weight:700'));
      [['質子數（原子序）', z, 62], ['電子數', e, 92], ['中子數（約）', n, 122]].forEach(function (r) {
        svg.appendChild(txt(248, r[2] - 9, r[0], 'font-size:9px;fill:var(--dim)'));
        svg.appendChild(txt(248, r[2] + 7, String(r[1]),
          'font-size:14px;font-weight:700;fill:var(--accent)'));
      });
      svg.appendChild(txt(248, 152, charge, 'font-size:11px;fill:var(--good)'));
      read.appendChild(div('wg-read-main', nm[0] + '：質子 ' + z + ' 個、電子 ' + e + ' 個 → ' + charge));
      read.appendChild(div('wg-read-sub',
        '原子由「質子＋中子」組成的原子核，和外圍的電子構成。' +
        '⚠ 決定是哪一種元素的是「質子數」（原子序），不是電子數也不是中子數。' +
        '中性原子的質子數 ＝ 電子數；失去電子帶正電成陽離子（如 Na⁺），' +
        '得到電子帶負電成陰離子（如 Cl⁻）。' +
        '質子數相同、中子數不同的原子互稱同位素，化學性質幾乎一樣。'));
    }
    var row = div('wg-ctrl');
    [1, 6, 8, 11, 17].forEach(function (k) {
      row.appendChild(btn(NAMES[k][0], function () { z = k; extra = 0; paint(); }));
    });
    box.appendChild(row);
    var row2 = div('wg-ctrl');
    row2.appendChild(btn('－ 1 個電子', function () { extra--; paint(); }));
    row2.appendChild(btn('＋ 1 個電子', function () { extra++; paint(); }));
    row2.appendChild(btn('回到中性', function () { extra = 0; paint(); }));
    box.appendChild(row2);
    host.appendChild(box);
    paint();
  };

  /* ── 週期表（ptable）──────────────────────────────────────────────────
     只放前 20 號元素，重點在「同族性質相似、同週期由左到右金屬性遞減」。
     spec: { pick, highlight:'metal'|'group'|'period' }                   */
  REG.ptable = function (host, spec) {
    var view = spec.highlight || 'metal';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    // [符號, 族(1..8), 週期(1..4), 是否金屬]
    var EL = [['H', 1, 1, 0], ['He', 8, 1, 0],
      ['Li', 1, 2, 1], ['Be', 2, 2, 1], ['B', 3, 2, 0], ['C', 4, 2, 0], ['N', 5, 2, 0],
      ['O', 6, 2, 0], ['F', 7, 2, 0], ['Ne', 8, 2, 0],
      ['Na', 1, 3, 1], ['Mg', 2, 3, 1], ['Al', 3, 3, 1], ['Si', 4, 3, 0], ['P', 5, 3, 0],
      ['S', 6, 3, 0], ['Cl', 7, 3, 0], ['Ar', 8, 3, 0],
      ['K', 1, 4, 1], ['Ca', 2, 4, 1]];
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var w = 34, h = 30, x0 = 24, y0 = 40;
      EL.forEach(function (e) {
        var on = view === 'metal' ? e[3] : (view === 'group' ? (e[1] === 1 || e[1] === 7 || e[1] === 8) : e[2] === 3);
        var col = view === 'metal' ? (e[3] ? 'accent' : 'good')
          : (on ? (e[1] === 8 ? 'dim' : (e[1] === 1 ? 'bad' : 'accent')) : 'border');
        svg.appendChild(el('rect', { x: x0 + (e[1] - 1) * w, y: y0 + (e[2] - 1) * h,
          width: w - 3, height: h - 3, rx: 4, 'fill-opacity': on ? '.3' : '.08' },
          'fill:var(--' + col + ');stroke:var(--' + col + ');stroke-width:1.5'));
        svg.appendChild(txt(x0 + (e[1] - 1) * w + (w - 3) / 2, y0 + (e[2] - 1) * h + (h - 3) / 2,
          e[0], 'font-size:11px;font-weight:700'));
      });
      for (var g = 1; g <= 8; g++) {
        svg.appendChild(txt(x0 + (g - 1) * w + 15, 32, String(g), 'font-size:9px;fill:var(--dim)'));
      }
      svg.appendChild(txt(14, 22, '族 →', 'font-size:9px;fill:var(--dim)'));
      svg.appendChild(txt(12, y0 + 44, '週期', 'font-size:9px;fill:var(--dim)'));
      var main, sub;
      if (view === 'metal') {
        main = '左邊是金屬、右邊是非金屬';
        sub = '金屬（藍）有光澤、能導電導熱、有延展性，容易「失去電子」變成陽離子；' +
          '非金屬（綠）大多不導電，容易得到電子變成陰離子。' +
          '⚠ 分界在週期表右上到左下的一條階梯線附近，' +
          '線上的硼、矽等叫類金屬，性質介於兩者之間。';
      } else if (view === 'group') {
        main = '同一族（直行）性質相似';
        sub = '第 1 族（鹼金屬：鋰、鈉、鉀）都非常活潑，會和水劇烈反應；' +
          '第 7 族（鹵素：氟、氯）也很活潑，容易得到一個電子；' +
          '第 8 族（惰性氣體：氦、氖、氬）最外層電子已滿，幾乎不與其他元素反應。' +
          '⚠ 性質相似是因為「最外層電子數相同」。';
      } else {
        main = '同一週期（橫列）由左到右金屬性遞減';
        sub = '同一週期的元素，電子層數相同，由左往右質子數增加、原子半徑變小，' +
          '越來越不容易失去電子，所以金屬性遞減、非金屬性遞增。' +
          '⚠ 第三週期從鈉（活潑金屬）一路到氯（活潑非金屬）再到氬（惰性氣體），變化很清楚。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['metal', '金屬與非金屬'], ['group', '同族'], ['period', '同週期']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { view = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 化學反應與質量守恆（chemeq）──────────────────────────────────────
     spec: { mode:'mass'|'balance'|'type', pick }                         */
  REG.chemeq = function (host, spec) {
    var mode = spec.mode || 'mass';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function molecule(cx, cy, atoms, label) {
      atoms.forEach(function (a, i) {
        svg.appendChild(el('circle', { cx: cx + a[0], cy: cy + a[1], r: a[2] || 9 },
          'fill:var(--' + a[3] + ');fill-opacity:.75;stroke:var(--' + a[3] + ');stroke-width:1.5'));
      });
      if (label) svg.appendChild(txt(cx, cy + 30, label, 'font-size:10px;fill:var(--dim)'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'balance') {
        svg.appendChild(txt(160, 40, '2 H₂ ＋ O₂ → 2 H₂O', 'font-size:18px;font-weight:700;fill:var(--accent)'));
        [['反應前', 90, ['H 4 個', 'O 2 個']], ['反應後', 130, ['H 4 個', 'O 2 個']]].forEach(function (r) {
          svg.appendChild(txt(72, r[1], r[0], 'font-size:12px;fill:var(--dim)'));
          r[2].forEach(function (t, i) {
            svg.appendChild(txt(170 + i * 90, r[1], t, 'font-size:12px;fill:var(--good)'));
          });
        });
        svg.appendChild(txt(160, 162, '兩邊每一種原子的個數都要相同，方程式才平衡',
          'font-size:11px;fill:var(--good)'));
        main = '配平：兩邊的原子個數要一樣';
        sub = '化學反應只是把原子「重新排列組合」，不會憑空生出原子，也不會消失。' +
          '所以配平時只能改前面的係數，⚠ 絕對不能改化學式裡的小數字（下標）——' +
          '把 H₂O 改成 H₂O₂ 就變成另一種物質（雙氧水）了。';
      } else if (mode === 'type') {
        [['化合', 'A ＋ B → AB', 46], ['分解', 'AB → A ＋ B', 82],
         ['取代', 'A ＋ BC → AC ＋ B', 118], ['複分解', 'AB ＋ CD → AD ＋ CB', 154]]
          .forEach(function (r) {
            svg.appendChild(txt(66, r[2], r[0], 'font-size:12px;font-weight:700;fill:var(--accent)'));
            svg.appendChild(txt(200, r[2], r[1], 'font-size:12px;fill:var(--dim)'));
          });
        main = '四種常見的反應類型';
        sub = '化合：兩種以上合成一種（鐵 ＋ 硫 → 硫化鐵）。分解：一種變成多種（水電解成氫和氧）。' +
          '取代：較活潑的元素把較不活潑的擠出來（鋅 ＋ 鹽酸 → 氯化鋅 ＋ 氫氣）。' +
          '複分解：兩種化合物交換成分（酸鹼中和就是這一類）。';
      } else {
        svg.appendChild(el('rect', { x: 20, y: 34, width: 128, height: 78, rx: 8, 'fill-opacity': '.12' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(el('rect', { x: 172, y: 34, width: 128, height: 78, rx: 8, 'fill-opacity': '.12' },
          'fill:var(--good);stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(160, 74, '→', 'font-size:20px;fill:var(--dim)'));
        molecule(56, 62, [[0, 0, 9, 'accent'], [16, 0, 9, 'accent']], '');
        molecule(112, 62, [[0, 0, 11, 'bad'], [18, 0, 11, 'bad']], '');
        molecule(210, 62, [[0, 0, 11, 'bad'], [-14, 8, 7, 'accent'], [14, 8, 7, 'accent']], '');
        molecule(266, 62, [[0, 0, 11, 'bad'], [-14, 8, 7, 'accent'], [14, 8, 7, 'accent']], '');
        svg.appendChild(txt(84, 124, '反應前：氫 4 ＋ 氧 2', 'font-size:11px;fill:var(--accent)'));
        svg.appendChild(txt(236, 124, '反應後：氫 4 ＋ 氧 2', 'font-size:11px;fill:var(--good)'));
        svg.appendChild(txt(160, 156, '原子種類與個數都沒變 → 總質量不變',
          'font-size:12px;font-weight:700;fill:var(--bad)'));
        main = '質量守恆定律';
        sub = '化學反應前後，物質的「總質量不變」，因為原子只是重新組合。' +
          '⚠ 常見的誤會：蠟燭燒完變輕、鐵生鏽變重，好像不守恆——' +
          '那是因為沒有把跑掉的氣體（二氧化碳、水蒸氣）或加進來的氧氣算進去。' +
          '在密閉容器中做實驗，秤起來就會前後一樣重。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['mass', '質量守恆'], ['balance', '配平'], ['type', '反應類型']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 運動圖形（motion）────────────────────────────────────────────────
     等速度和等加速度的 位移-時間／速度-時間 圖長什麼樣，兩張並排比才記得住。
     spec: { mode:'const'|'accel'|'rest', pick }                          */
  REG.motion = function (host, spec) {
    var mode = spec.mode || 'const';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function axes(x0, title) {
      svg.appendChild(el('line', { x1: x0, y1: 128, x2: x0 + 118, y2: 128 },
        'stroke:var(--text);stroke-width:2'));
      svg.appendChild(el('line', { x1: x0, y1: 128, x2: x0, y2: 34 },
        'stroke:var(--text);stroke-width:2'));
      svg.appendChild(txt(x0 + 60, 148, '時間 →', 'font-size:10px;fill:var(--dim)'));
      svg.appendChild(txt(x0 + 34, 26, title, 'font-size:11px;font-weight:700;fill:var(--dim)'));
    }
    function curve(x0, fn, color) {
      var pts = [];
      for (var t = 0; t <= 1.0001; t += 0.05) {
        pts.push((x0 + t * 112) + ',' + (128 - fn(t) * 84));
      }
      svg.appendChild(el('polyline', { points: pts.join(' ') },
        'fill:none;stroke:var(--' + color + ');stroke-width:3'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      axes(28, '位移 s'); axes(184, '速度 v');
      var main, sub;
      if (mode === 'accel') {
        curve(28, function (t) { return t * t; }, 'accent');
        curve(184, function (t) { return t; }, 'good');
        main = '等加速度運動：s-t 是曲線、v-t 是斜直線';
        sub = '速度每秒增加固定的量，所以 v-t 圖是一條往上斜的直線，斜率就是加速度。' +
          '位移越跑越快，所以 s-t 圖是一條越來越陡的曲線。' +
          '自由落體就是最典型的等加速度運動（加速度約 9.8 m/s²）。';
      } else if (mode === 'rest') {
        curve(28, function () { return 0.5; }, 'accent');
        curve(184, function () { return 0; }, 'good');
        main = '靜止：s-t 是水平線、v-t 貼在時間軸上';
        sub = '位置不變，所以 s-t 圖是水平線（斜率 0 代表速度 0）；速度是 0，v-t 圖就貼在橫軸上。' +
          '⚠ s-t 圖是水平線代表「靜止」，不是「等速前進」——這兩個最常被搞混。';
      } else {
        curve(28, function (t) { return t * 0.9; }, 'accent');
        curve(184, function () { return 0.6; }, 'good');
        main = '等速度運動：s-t 是斜直線、v-t 是水平線';
        sub = '速度不變，所以 v-t 圖是一條水平線；位移每秒增加固定的量，s-t 圖是一條斜直線，' +
          '⚠ 這條直線的「斜率」就是速度——斜率越大代表跑得越快。' +
          '另外，v-t 圖下方圍出來的面積等於位移。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['rest', '靜止'], ['const', '等速度'], ['accel', '等加速度']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 牛頓運動定律（newton）────────────────────────────────────────────
     spec: { mode:'first'|'second'|'third', f, m, pick }                  */
  REG.newton = function (host, spec) {
    var mode = spec.mode || 'first';
    var F = spec.f == null ? 6 : spec.f, M = spec.m == null ? 2 : spec.m;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function cart(x, y, w, label, color) {
      svg.appendChild(el('rect', { x: x, y: y, width: w, height: 34, rx: 5, 'fill-opacity': '.25' },
        'fill:var(--' + color + ');stroke:var(--' + color + ');stroke-width:2'));
      svg.appendChild(txt(x + w / 2, y + 17, label, 'font-size:11px'));
    }
    function arrow(x1, y, len, color, label) {
      var x2 = x1 + len;
      svg.appendChild(el('line', { x1: x1, y1: y, x2: x2, y2: y },
        'stroke:var(--' + color + ');stroke-width:3'));
      var d = len > 0 ? 1 : -1;
      svg.appendChild(el('polygon', { points: x2 + ',' + y + ' ' + (x2 - 9 * d) + ',' + (y - 5) +
        ' ' + (x2 - 9 * d) + ',' + (y + 5) }, 'fill:var(--' + color + ')'));
      if (label) svg.appendChild(txt((x1 + x2) / 2, y - 12, label,
        'font-size:11px;fill:var(--' + color + ')'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'second') {
        var a = +(F / M).toFixed(2);
        cart(60, 74, 44 + M * 12, M + ' kg', 'accent');
        arrow(60 + 44 + M * 12 + 6, 91, 20 + F * 8, 'bad', F + ' N');
        svg.appendChild(txt(160, 148, '加速度 a ＝ F ÷ m ＝ ' + F + ' ÷ ' + M + ' ＝ ' + a + ' m/s²',
          'font-size:13px;font-weight:700;fill:var(--good)'));
        main = 'F ＝ m × a：力越大加速度越大、質量越大加速度越小';
        sub = '同樣的力推腳踏車和推汽車，腳踏車加速快得多，因為質量小。' +
          '⚠ 力和加速度成正比、和質量成反比；力的方向就是加速度的方向。' +
          '注意「有力不一定會動得快，而是會『改變速度』」——用力推牆壁，牆不動是因為還有其他力平衡掉了。';
      } else if (mode === 'third') {
        cart(50, 62, 60, '人', 'accent');
        cart(200, 62, 60, '牆', 'good');
        arrow(114, 79, 78, 'bad', '人推牆 F');
        arrow(196, 116, -78, 'accent', '牆推人 F');
        svg.appendChild(txt(160, 152, '兩個力大小相等、方向相反，作用在「不同物體」上',
          'font-size:11px;fill:var(--dim)'));
        main = '作用力與反作用力：一定成對出現';
        sub = '你推牆的同時，牆也用同樣大的力推你——所以穿溜冰鞋推牆會把自己推開。' +
          '走路是腳往後蹬地、地面把人往前推；火箭噴出氣體、氣體把火箭往前推。' +
          '⚠ 這一對力作用在「不同物體」上，所以不會互相抵消，' +
          '這也是它和「平衡力」最大的差別。';
      } else {
        cart(46, 62, 70, '靜止', 'accent');
        cart(190, 62, 70, '等速', 'good');
        svg.appendChild(txt(160, 118, '不受外力（或合力為零）時', 'font-size:11px;fill:var(--dim)'));
        svg.appendChild(txt(160, 140, '本來靜止的維持靜止，本來運動的維持等速直線運動',
          'font-size:11px;fill:var(--good)'));
        main = '慣性定律：物體會「維持原本的運動狀態」';
        sub = '公車突然煞車時人會往前傾，是因為人保持原本前進的運動狀態；' +
          '突然起步時人往後倒，也是同樣的道理。' +
          '⚠ 慣性大小只和「質量」有關，質量越大慣性越大，和速度快慢無關。' +
          '所以安全帶和安全氣囊都是在對付慣性。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['first', '第一定律'], ['second', '第二定律'], ['third', '第三定律']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    var row2 = div('wg-ctrl');
    row2.appendChild(div('wg-ctrl-label', '施力 F'));
    row2.appendChild(slider(1, 20, F, 1, function (v) { F = v; mode = 'second'; paint(); }));
    box.appendChild(row2);
    var row3 = div('wg-ctrl');
    row3.appendChild(div('wg-ctrl-label', '質量 m'));
    row3.appendChild(slider(1, 10, M, 1, function (v) { M = v; mode = 'second'; paint(); }));
    box.appendChild(row3);
    host.appendChild(box);
    paint();
  };

  /* ── 位能與動能（energyball）──────────────────────────────────────────
     球從斜坡滑下，位能一格一格換成動能，總和不變。
     spec: { pos }  0（最高）～ 1（最低）                                 */
  REG.energyball = function (host, spec) {
    var t = spec.pos == null ? 0 : spec.pos;
    var TOTAL = 100;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var x = 40 + t * 150, y = 40 + t * t * 96;
      svg.appendChild(el('path', { d: 'M40,40 Q120,60 190,136 L280,136' },
        'fill:none;stroke:var(--dim);stroke-width:3'));
      svg.appendChild(el('circle', { cx: x, cy: y - 8, r: 9 }, 'fill:var(--accent)'));
      var pe = Math.round(TOTAL * (1 - t * t)), ke = TOTAL - pe;
      [['位能', pe, 'accent', 44], ['動能', ke, 'bad', 74]].forEach(function (r) {
        svg.appendChild(txt(232, r[3] - 12, r[0] + '　' + r[1], 'font-size:11px;fill:var(--' + r[2] + ')'));
        svg.appendChild(el('rect', { x: 200, y: r[3] - 8, width: 100, height: 12, rx: 4,
          'fill-opacity': '.12' }, 'fill:var(--' + r[2] + ')'));
        svg.appendChild(el('rect', { x: 200, y: r[3] - 8, width: r[1], height: 12, rx: 4 },
          'fill:var(--' + r[2] + ')'));
      });
      svg.appendChild(txt(250, 104, '位能 ＋ 動能 ＝ ' + TOTAL + '（固定）',
        'font-size:10px;fill:var(--good)'));
      svg.appendChild(txt(160, 176, '越低 → 位能越少、動能越多，總和不變',
        'font-size:11px;fill:var(--dim)'));
      read.appendChild(div('wg-read-main', '位能 ' + pe + '　動能 ' + ke + '　總力學能 ' + TOTAL));
      read.appendChild(div('wg-read-sub',
        '重力位能和高度有關（越高越大），動能和速度有關（越快越大）。' +
        '球往下滑時位能變小、動能變大，兩者的總和（力學能）維持不變——這就是能量守恆。' +
        '⚠ 實際上還有摩擦力，會把一部分力學能變成熱能，' +
        '所以真實的球不會盪回原本的高度，但「能量總量」仍然沒有減少。'));
    }
    var row = div('wg-ctrl');
    row.appendChild(slider(0, 1, t, 0.05, function (v) { t = v; paint(); }));
    box.appendChild(row);
    host.appendChild(box);
    paint();
  };

  /* ── 壓力（pressure）──────────────────────────────────────────────────
     spec: { mode:'area'|'liquid'|'air', f, a, pick }                     */
  REG.pressure = function (host, spec) {
    var mode = spec.mode || 'area';
    var F = spec.f == null ? 60 : spec.f, A = spec.a == null ? 6 : spec.a;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'liquid') {
        svg.appendChild(el('rect', { x: 60, y: 40, width: 130, height: 110, rx: 4, 'fill-opacity': '.15' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        [[62, 20], [100, 40], [138, 62]].forEach(function (h, i) {
          svg.appendChild(el('line', { x1: 190, y1: h[0], x2: 190 + h[1], y2: h[0] },
            'stroke:var(--bad);stroke-width:3'));
          svg.appendChild(el('polygon', { points: (190 + h[1]) + ',' + h[0] + ' ' +
            (190 + h[1] - 8) + ',' + (h[0] - 4) + ' ' + (190 + h[1] - 8) + ',' + (h[0] + 4) },
            'fill:var(--bad)'));
        });
        svg.appendChild(txt(258, 170, '越深 → 噴得越遠', 'font-size:11px;fill:var(--bad)'));
        svg.appendChild(txt(124, 166, '水的壓力', 'font-size:11px;fill:var(--accent)'));
        main = '液體壓力隨「深度」增加';
        sub = '同一深度處，液體對各個方向的壓力都相同；越深壓力越大（和容器形狀、水的總量無關）。' +
          '所以水壩下方要蓋得比上方厚、潛水越深耳朵越痛。' +
          '⚠ 壓力大小只看「深度」和「液體密度」，不是看水有多少。';
      } else if (mode === 'air') {
        svg.appendChild(el('circle', { cx: 160, cy: 92, r: 46, 'fill-opacity': '.15' },
          'fill:var(--good);stroke:var(--good);stroke-width:2'));
        svg.appendChild(txt(160, 92, '大氣', 'font-size:12px'));
        [0, 60, 120, 180, 240, 300].forEach(function (d) {
          var a = d * Math.PI / 180;
          svg.appendChild(el('line',
            { x1: 160 + 74 * Math.cos(a), y1: 92 + 74 * Math.sin(a),
              x2: 160 + 52 * Math.cos(a), y2: 92 + 52 * Math.sin(a) },
            'stroke:var(--accent);stroke-width:2.5'));
        });
        svg.appendChild(txt(160, 168, '1 大氣壓 ≈ 76 公分水銀柱 ≈ 10 公尺水柱',
          'font-size:11px;fill:var(--dim)'));
        main = '大氣壓力：空氣從四面八方壓過來';
        sub = '空氣有重量，所以會對地面上的所有東西產生壓力，方向是各個方向都有。' +
          '證據：吸盤能吸住牆、用吸管喝飲料（其實是大氣把飲料壓上來）、馬德堡半球拉不開。' +
          '⚠ 海拔越高空氣越稀薄，大氣壓越小，所以高山上水不到 100℃ 就沸騰了。';
      } else {
        var p = +(F / A).toFixed(1);
        var w = 20 + A * 14;
        svg.appendChild(el('rect', { x: 160 - w / 2, y: 56, width: w, height: 34, rx: 4,
          'fill-opacity': '.25' }, 'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(txt(160, 73, F + ' N', 'font-size:12px'));
        svg.appendChild(el('line', { x1: 40, y1: 106, x2: 280, y2: 106 },
          'stroke:var(--text);stroke-width:2'));
        for (var i = 0; i < 6; i++) {
          var x = 160 - w / 2 + (w / 5) * i;
          svg.appendChild(el('line', { x1: x, y1: 92, x2: x, y2: 104 },
            'stroke:var(--bad);stroke-width:2'));
        }
        svg.appendChild(txt(160, 132, '接觸面積 ' + A + ' cm²', 'font-size:11px;fill:var(--dim)'));
        svg.appendChild(txt(160, 158, '壓力 ＝ ' + F + ' ÷ ' + A + ' ＝ ' + p + ' N/cm²',
          'font-size:13px;font-weight:700;fill:var(--good)'));
        main = '壓力 ＝ 垂直作用力 ÷ 受力面積';
        sub = '同樣的力，接觸面積越小壓力越大。所以刀要磨利、圖釘的尖端很細；' +
            '相反地，坦克的履帶和雪鞋做得很寬，是為了減小壓力才不會陷下去。' +
            '⚠ 力沒有變，改變的是「分攤到每一平方公分」的量。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['area', '壓力與面積'], ['liquid', '液體壓力'], ['air', '大氣壓力']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    var row2 = div('wg-ctrl');
    row2.appendChild(div('wg-ctrl-label', '作用力 N'));
    row2.appendChild(slider(10, 200, F, 10, function (v) { F = v; mode = 'area'; paint(); }));
    box.appendChild(row2);
    var row3 = div('wg-ctrl');
    row3.appendChild(div('wg-ctrl-label', '面積 cm²'));
    row3.appendChild(slider(1, 16, A, 1, function (v) { A = v; mode = 'area'; paint(); }));
    box.appendChild(row3);
    host.appendChild(box);
    paint();
  };

  /* ── 靜電（static）────────────────────────────────────────────────────
     spec: { mode:'charge'|'force'|'ground', pick }                       */
  REG['static'] = function (host, spec) {
    var mode = spec.mode || 'charge';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function ball(cx, cy, r, sign, label) {
      var col = sign > 0 ? 'bad' : (sign < 0 ? 'accent' : 'dim');
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: r, 'fill-opacity': '.2' },
        'fill:var(--' + col + ');stroke:var(--' + col + ');stroke-width:2'));
      svg.appendChild(txt(cx, cy, sign > 0 ? '＋' : (sign < 0 ? '－' : '0'),
        'font-size:14px;font-weight:700;fill:var(--' + col + ')'));
      if (label) svg.appendChild(txt(cx, cy + r + 14, label, 'font-size:10px;fill:var(--dim)'));
    }
    function arrow(x1, y, x2, color) {
      svg.appendChild(el('line', { x1: x1, y1: y, x2: x2, y2: y },
        'stroke:var(--' + color + ');stroke-width:3'));
      var d = x2 > x1 ? 1 : -1;
      svg.appendChild(el('polygon', { points: x2 + ',' + y + ' ' + (x2 - 8 * d) + ',' + (y - 4) +
        ' ' + (x2 - 8 * d) + ',' + (y + 4) }, 'fill:var(--' + color + ')'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'force') {
        ball(84, 58, 20, -1, ''); ball(164, 58, 20, -1, '');
        arrow(58, 58, 24, 'accent'); arrow(190, 58, 224, 'accent');
        svg.appendChild(txt(272, 58, '同性相斥', 'font-size:12px;fill:var(--accent)'));
        ball(84, 128, 20, -1, ''); ball(164, 128, 20, 1, '');
        arrow(24, 128, 58, 'bad'); arrow(224, 128, 190, 'bad');
        svg.appendChild(txt(272, 128, '異性相吸', 'font-size:12px;fill:var(--bad)'));
        main = '同性相斥、異性相吸';
        sub = '兩個帶同種電荷的物體會互相排斥，帶異種電荷的會互相吸引。' +
          '⚠ 帶電體也能吸引「不帶電」的輕小物體（如碎紙屑），' +
          '因為它會使紙屑靠近的一側感應出異性電荷，這叫靜電感應。';
      } else if (mode === 'ground') {
        svg.appendChild(el('rect', { x: 120, y: 44, width: 80, height: 70, rx: 6, 'fill-opacity': '.15' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(txt(160, 78, '帶電體', 'font-size:11px'));
        svg.appendChild(el('line', { x1: 160, y1: 114, x2: 160, y2: 142 },
          'stroke:var(--good);stroke-width:3'));
        [0, 1, 2].forEach(function (i) {
          svg.appendChild(el('line', { x1: 140 + i * 6, y1: 142 + i * 8, x2: 180 - i * 6, y2: 142 + i * 8 },
            'stroke:var(--good);stroke-width:3'));
        });
        svg.appendChild(txt(232, 132, '電荷流入大地', 'font-size:11px;fill:var(--good)'));
        main = '接地：把多餘的電荷導走';
        sub = '大地可以接受或提供大量電荷而幾乎不改變自身狀態，' +
          '所以把帶電體接地就能把靜電導走。' +
          '避雷針、油罐車拖在地上的鐵鍊、電器的接地線都是同一個道理。' +
          '⚠ 避雷針的作用是把電流安全導入地下，不是「避開」雷。';
      } else {
        svg.appendChild(el('rect', { x: 40, y: 50, width: 90, height: 46, rx: 6, 'fill-opacity': '.15' },
          'fill:var(--accent);stroke:var(--accent);stroke-width:2'));
        svg.appendChild(txt(85, 73, '塑膠棒', 'font-size:11px'));
        svg.appendChild(el('rect', { x: 190, y: 50, width: 90, height: 46, rx: 6, 'fill-opacity': '.15' },
          'fill:var(--bad);stroke:var(--bad);stroke-width:2'));
        svg.appendChild(txt(235, 73, '毛皮', 'font-size:11px'));
        arrow(184, 73, 136, 'good');
        svg.appendChild(txt(160, 40, '電子搬家', 'font-size:10px;fill:var(--good)'));
        svg.appendChild(txt(85, 118, '得到電子 → 帶負電', 'font-size:10px;fill:var(--accent)'));
        svg.appendChild(txt(235, 118, '失去電子 → 帶正電', 'font-size:10px;fill:var(--bad)'));
        svg.appendChild(txt(160, 156, '摩擦沒有「創造」電荷，只是把電子從一邊搬到另一邊',
          'font-size:10px;fill:var(--dim)'));
        main = '摩擦起電：電子從一個物體轉移到另一個';
        sub = '摩擦時束縛較鬆的電子會轉移。得到電子的帶負電、失去電子的帶正電，' +
          '兩者帶的電量相等、電性相反。' +
          '⚠ 電荷總量守恆——摩擦不會創造出電荷。' +
          '乾燥的冬天容易被電到，是因為濕度低時電荷不易散失而累積起來。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['charge', '摩擦起電'], ['force', '相吸相斥'], ['ground', '接地與避雷']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 歐姆定律與電功率（ohm）───────────────────────────────────────────
     spec: { v, r, mode:'law'|'series'|'parallel'|'power', pick }         */
  REG.ohm = function (host, spec) {
    var V = spec.v == null ? 6 : spec.v, R = spec.r == null ? 3 : spec.r;
    var mode = spec.mode || 'law';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function wire(pts) {
      svg.appendChild(el('polyline', { points: pts }, 'fill:none;stroke:var(--text);stroke-width:2'));
    }
    function resistor(x, y, label) {
      svg.appendChild(el('rect', { x: x - 20, y: y - 9, width: 40, height: 18, rx: 3,
        'fill-opacity': '.2' }, 'fill:var(--bad);stroke:var(--bad);stroke-width:2'));
      svg.appendChild(txt(x, y, label, 'font-size:10px'));
    }
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'series') {
        wire('40,88 40,40 280,40 280,88 40,88');
        resistor(120, 40, R + 'Ω'); resistor(210, 40, R + 'Ω');
        svg.appendChild(txt(46, 104, '電池 ' + V + 'V', 'font-size:10px;fill:var(--dim)'));
        var rs = R * 2, is = +(V / rs).toFixed(2);
        svg.appendChild(txt(178, 126, '總電阻 ＝ ' + R + ' ＋ ' + R + ' ＝ ' + rs + ' Ω',
          'font-size:12px;fill:var(--good)'));
        svg.appendChild(txt(178, 148, '電流 ＝ ' + V + ' ÷ ' + rs + ' ＝ ' + is + ' A（處處相同）',
          'font-size:12px;fill:var(--accent)'));
        main = '串聯：電阻相加、電流處處相同';
        sub = '串聯時只有一條路徑，所以電流到處一樣大；總電阻是各電阻相加，' +
          '電壓則按電阻比例分配。⚠ 缺點是「其中一個斷掉，整條路就不通」——' +
          '舊式聖誕燈串就是這樣，一顆壞掉全部不亮。';
      } else if (mode === 'parallel') {
        wire('40,112 40,36 280,36 280,112 40,112');
        wire('120,36 120,112'); wire('210,36 210,112');
        resistor(120, 74, R + 'Ω'); resistor(210, 74, R + 'Ω');
        var rp = +(R / 2).toFixed(2), ip = +(V / rp).toFixed(2);
        svg.appendChild(txt(180, 152, '總電阻 ＝ ' + rp + ' Ω　總電流 ＝ ' + ip + ' A',
          'font-size:12px;fill:var(--good)'));
        svg.appendChild(txt(50, 128, '電池 ' + V + 'V', 'font-size:10px;fill:var(--dim)'));
        main = '並聯：電壓相同、總電阻變小';
        sub = '並聯時每條支路兩端的電壓都等於電源電壓；路徑變多，總電阻反而變小、總電流變大。' +
          '⚠ 家裡的電器都是並聯：一個關掉不影響其他的，而且每個都拿到 110V。' +
          '但同時開太多大功率電器會使總電流過大，可能跳電或引起電線走火。';
      } else if (mode === 'power') {
        var i2 = +(V / R).toFixed(2), p = +(V * i2).toFixed(1);
        wire('40,74 40,36 280,36 280,74 40,74');
        resistor(160, 36, R + 'Ω');
        [['電壓 V', V + ' V', 100], ['電流 I', i2 + ' A', 124], ['功率 P ＝ V × I', p + ' W', 150]]
          .forEach(function (r) {
            svg.appendChild(txt(110, r[2], r[0], 'font-size:11px;fill:var(--dim)'));
            svg.appendChild(txt(215, r[2], r[1], 'font-size:13px;font-weight:700;fill:var(--accent)'));
          });
        main = '電功率 P ＝ V × I（單位：瓦特）';
        sub = '電功率代表「每秒消耗多少電能」。電能 ＝ 功率 × 時間，' +
          '電費算的「1 度」＝ 1 千瓦的電器用 1 小時。' +
          '⚠ 所以 1000 瓦的電熱器用 2 小時就是 2 度電。' +
          '電器上標示的瓦數越大，越耗電。';
      } else {
        var i = +(V / R).toFixed(2);
        wire('40,84 40,36 280,36 280,84 40,84');
        resistor(160, 36, R + ' Ω');
        svg.appendChild(el('rect', { x: 26, y: 48, width: 28, height: 24, rx: 3 },
          'fill:none;stroke:var(--text);stroke-width:2'));
        svg.appendChild(txt(40, 60, V + 'V', 'font-size:10px'));
        svg.appendChild(txt(160, 116, 'I ＝ V ÷ R ＝ ' + V + ' ÷ ' + R + ' ＝ ' + i + ' A',
          'font-size:15px;font-weight:700;fill:var(--good)'));
        svg.appendChild(txt(160, 146, '電壓越大電流越大；電阻越大電流越小',
          'font-size:11px;fill:var(--dim)'));
        main = '歐姆定律：I ＝ V ÷ R';
        sub = '電流（安培 A）和電壓（伏特 V）成正比、和電阻（歐姆 Ω）成反比。' +
          '可以想成水管：電壓像水壓、電流像水流量、電阻像水管的細窄程度。' +
          '⚠ 電阻和導體的材質、長度（越長越大）、截面積（越粗越小）以及溫度有關，' +
          '不是由電壓或電流決定的。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['law', '歐姆定律'], ['series', '串聯'], ['parallel', '並聯'], ['power', '電功率']]
        .forEach(function (m) { row.appendChild(btn(m[1], function () { mode = m[0]; paint(); })); });
      box.appendChild(row);
    }
    var row2 = div('wg-ctrl');
    row2.appendChild(div('wg-ctrl-label', '電壓 V'));
    row2.appendChild(slider(1, 24, V, 1, function (v) { V = v; paint(); }));
    box.appendChild(row2);
    var row3 = div('wg-ctrl');
    row3.appendChild(div('wg-ctrl-label', '電阻 Ω'));
    row3.appendChild(slider(1, 12, R, 1, function (v) { R = v; paint(); }));
    box.appendChild(row3);
    host.appendChild(box);
    paint();
  };

  /* ── 太陽系（solarsys）────────────────────────────────────────────────
     spec: { pick, mode:'order'|'inner'|'size' }                          */
  REG.solarsys = function (host, spec) {
    var mode = spec.mode || 'order';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var P = [['水星', 3, 1], ['金星', 5, 1], ['地球', 5, 1], ['火星', 4, 1],
             ['木星', 14, 0], ['土星', 12, 0], ['天王星', 8, 0], ['海王星', 8, 0]];
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('circle', { cx: 10, cy: 86, r: 26 }, 'fill:var(--bad);fill-opacity:.6'));
      svg.appendChild(txt(16, 86, '日', 'font-size:11px'));
      P.forEach(function (p, i) {
        var x = 52 + i * 33;
        var on = mode === 'inner' ? p[2] === 1 : (mode === 'size' ? p[1] >= 8 : true);
        var col = p[2] ? 'accent' : 'good';
        svg.appendChild(el('circle', { cx: x, cy: 86, r: mode === 'size' ? p[1] : 8,
          'fill-opacity': on ? '.85' : '.2' }, 'fill:var(--' + col + ')'));
        svg.appendChild(txt(x, 122, p[0], 'font-size:9px;fill:var(--' + (on ? 'text' : 'dim') + ')'));
        svg.appendChild(txt(x, 136, String(i + 1), 'font-size:8px;fill:var(--dim)'));
      });
      var main, sub;
      if (mode === 'inner') {
        main = '類地行星（藍）vs 類木行星（綠）';
        sub = '水星、金星、地球、火星叫「類地行星」：體積小、密度大、以岩石為主、衛星少。' +
          '木星、土星、天王星、海王星叫「類木行星」：體積大、密度小、以氣體為主、衛星多且有行星環。' +
          '⚠ 火星和木星之間有小行星帶。';
      } else if (mode === 'size') {
        main = '大小差很多：木星最大、水星最小';
        sub = '木星的直徑約是地球的 11 倍，土星次之。' +
          '⚠ 太陽比所有行星加起來都大得多（直徑約是地球的 109 倍），' +
          '它占了太陽系總質量的 99% 以上。' +
          '這張圖的距離沒有按比例畫——真實的行星之間距離非常遙遠。';
      } else {
        main = '八大行星由內而外：水金地火木土天海';
        sub = '所有行星都以「逆時針（由北極上方看）」的方向繞太陽公轉，軌道接近圓形且幾乎在同一平面上。' +
          '⚠ 冥王星在 2006 年被重新分類為「矮行星」，所以現在是八大行星，不是九大。' +
          '離太陽越遠的行星，公轉一圈所需的時間越長。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['order', '排列順序'], ['inner', '兩大類'], ['size', '大小比較']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 時間軸（timeline）────────────────────────────────────────────────
     歷史事件按順序排開，點一個看說明。社會科最常用的元件。
     spec: { title, events:[{y:'1895', t:'馬關條約', d:'說明'}] }         */
  REG.timeline = function (host, spec) {
    var EV = spec.events || [];
    var idx = 0;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 130', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('line', { x1: 14, y1: 66, x2: 306, y2: 66 },
        'stroke:var(--dim);stroke-width:3'));
      svg.appendChild(el('polygon', { points: '306,66 296,61 296,71' }, 'fill:var(--dim)'));
      var n = Math.max(EV.length, 1), gap = 280 / n;
      EV.forEach(function (e, i) {
        var x = 22 + gap * i + gap / 2 - gap / 2 + 8;
        x = 24 + i * (272 / Math.max(n - 1, 1));
        var on = i === idx;
        svg.appendChild(el('circle', { cx: x, cy: 66, r: on ? 8 : 5 },
          'fill:var(--' + (on ? 'accent' : 'dim') + ')'));
        svg.appendChild(txt(x, i % 2 ? 96 : 40, e.y,
          'font-size:10px;font-weight:700;fill:var(--' + (on ? 'accent' : 'dim') + ')'));
        svg.appendChild(txt(x, i % 2 ? 110 : 26, e.t.slice(0, 6),
          'font-size:9px;fill:var(--' + (on ? 'text' : 'dim') + ')'));
      });
      var cur = EV[idx] || { y: '', t: '', d: '' };
      read.appendChild(div('wg-read-main', cur.y + '　' + cur.t));
      read.appendChild(div('wg-read-sub', cur.d || ''));
    }
    var row = div('wg-ctrl');
    row.appendChild(btn('◀ 上一個', function () {
      idx = (idx - 1 + EV.length) % EV.length; paint();
    }));
    row.appendChild(btn('下一個 ▶', function () { idx = (idx + 1) % EV.length; paint(); }));
    box.appendChild(row);
    host.appendChild(box);
    paint();
  };

  /* ── 地圖與方位（mapdir）──────────────────────────────────────────────
     spec: { mode:'compass'|'scale'|'legend', pick }                      */
  REG.mapdir = function (host, spec) {
    var mode = spec.mode || 'compass';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var main, sub;
      if (mode === 'scale') {
        svg.appendChild(el('line', { x1: 50, y1: 70, x2: 250, y2: 70 },
          'stroke:var(--text);stroke-width:3'));
        [0, 1, 2, 3, 4].forEach(function (i) {
          var x = 50 + i * 50;
          svg.appendChild(el('line', { x1: x, y1: 62, x2: x, y2: 78 },
            'stroke:var(--text);stroke-width:2'));
          svg.appendChild(txt(x, 92, (i) + ' 公里', 'font-size:9px;fill:var(--dim)'));
        });
        svg.appendChild(txt(160, 40, '比例尺　1：100000', 'font-size:13px;font-weight:700;fill:var(--accent)'));
        svg.appendChild(txt(160, 124, '圖上 1 公分 ＝ 實際 100000 公分 ＝ 1 公里',
          'font-size:11px;fill:var(--good)'));
        svg.appendChild(txt(160, 150, '分母越大 → 範圍越大、越不詳細',
          'font-size:11px;fill:var(--dim)'));
        main = '比例尺：把真實世界縮小的倍數';
        sub = '1：100000 代表圖上量到 1 公分，實際上是 100000 公分（也就是 1 公里）。' +
          '⚠ 分母越「大」，縮得越小 → 涵蓋範圍大、但畫得粗略（例如世界地圖）；' +
          '分母越小 → 範圍小但很詳細（例如校園平面圖）。' +
          '算實際距離：圖上距離 × 分母，記得換算單位。';
      } else if (mode === 'legend') {
        [['🏫 學校', 70], ['🏥 醫院', 100], ['🚉 車站', 130]].forEach(function (r, i) {
          svg.appendChild(el('rect', { x: 60, y: r[1] - 14, width: 200, height: 24, rx: 5,
            'fill-opacity': '.1' }, 'fill:var(--accent);stroke:var(--border);stroke-width:1'));
          svg.appendChild(txt(160, r[1] - 2, r[0], 'font-size:12px'));
        });
        svg.appendChild(txt(160, 40, '圖例：地圖的「說明書」', 'font-size:13px;font-weight:700;fill:var(--accent)'));
        main = '圖例：告訴你符號代表什麼';
        sub = '地圖上用簡單的符號代表建築、道路、河流等，圖例就是符號的對照表。' +
          '看地圖的順序：① 先看標題（這是什麼地圖）② 看方位 ③ 看圖例 ④ 看比例尺。' +
          '⚠ 不同地圖的符號可能不同，一定要看該張地圖自己的圖例。';
      } else {
        var R = 52, cx = 100, cy = 88;
        svg.appendChild(el('circle', { cx: cx, cy: cy, r: R },
          'fill:none;stroke:var(--border);stroke-width:2'));
        var DIRS = [['北', 0], ['東北', 45], ['東', 90], ['東南', 135],
                    ['南', 180], ['西南', 225], ['西', 270], ['西北', 315]];
        DIRS.forEach(function (d) {
          var a = (d[1] - 90) * Math.PI / 180;
          var x = cx + (R + 14) * Math.cos(a), y = cy + (R + 14) * Math.sin(a);
          svg.appendChild(el('line', { x1: cx, y1: cy, x2: cx + R * Math.cos(a), y2: cy + R * Math.sin(a) },
            'stroke:var(--' + (d[1] % 90 === 0 ? 'accent' : 'dim') + ');stroke-width:' +
            (d[1] % 90 === 0 ? 2.5 : 1)));
          svg.appendChild(txt(x, y, d[0], 'font-size:' + (d[1] % 90 === 0 ? 12 : 9) + 'px'));
        });
        svg.appendChild(txt(240, 60, '地圖預設', 'font-size:11px;fill:var(--dim)'));
        svg.appendChild(txt(240, 80, '上北 下南', 'font-size:12px;fill:var(--accent)'));
        svg.appendChild(txt(240, 100, '左西 右東', 'font-size:12px;fill:var(--accent)'));
        main = '八個方位：北、東北、東、東南、南、西南、西、西北';
        sub = '一般地圖若沒有特別標示，就是「上北、下南、左西、右東」。' +
          '⚠ 判斷方位一定要先找指北針或方位標，不要直接假設。' +
          '實地判斷方位的方法：指南針、太陽（清晨在東、傍晚在西）、' +
          '有些建築的坐向也可以參考。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['compass', '方位'], ['scale', '比例尺'], ['legend', '圖例']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 臺灣簡圖（taiwan）────────────────────────────────────────────────
     spec: { mode:'region'|'terrain'|'river', pick }                      */
  REG.taiwan = function (host, spec) {
    var mode = spec.mode || 'region';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 210', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    // 簡化的台灣輪廓（示意用）：北端窄、中段最寬、南端收成尖角
    var OUT = 'M152,16 C172,24 186,46 194,74 C202,102 202,130 192,156 ' +
      'C182,180 168,196 158,200 C150,196 140,178 132,154 C122,122 118,84 128,52 ' +
      'C134,30 142,18 152,16 Z';
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('path', { d: OUT, 'fill-opacity': '.12' },
        'fill:var(--good);stroke:var(--good);stroke-width:2'));
      svg.appendChild(txt(286, 202, '（示意圖）', 'font-size:9px;fill:var(--dim)'));
      var main, sub;
      if (mode === 'terrain') {
        svg.appendChild(el('path',
          { d: 'M172,40 C186,72 190,124 176,178 C170,186 162,184 160,174 C154,124 158,70 172,40 Z',
            'fill-opacity': '.4' }, 'fill:var(--bad);stroke:var(--bad);stroke-width:1.5'));
        svg.appendChild(txt(238, 96, '中央山脈', 'font-size:11px;fill:var(--bad)'));
        svg.appendChild(txt(76, 120, '西部平原', 'font-size:11px;fill:var(--accent)'));
        svg.appendChild(txt(238, 150, '東部狹窄', 'font-size:10px;fill:var(--dim)'));
        main = '地形：東高西低，山脈偏東';
        sub = '五大地形都有：山地（約占三分之一）、丘陵、台地、盆地、平原。' +
          '中央山脈縱貫南北、偏東側，所以「東部山高谷深、西部平原寬廣」，' +
          '人口和都市多集中在西部平原。' +
          '⚠ 玉山是東北亞最高峰（3952 公尺）。';
      } else if (mode === 'river') {
        svg.appendChild(el('path', { d: 'M162,70 C140,80 120,86 108,92' },
          'fill:none;stroke:var(--accent);stroke-width:2.5'));
        svg.appendChild(el('path', { d: 'M164,118 C142,126 122,132 110,136' },
          'fill:none;stroke:var(--accent);stroke-width:2.5'));
        svg.appendChild(el('path', { d: 'M170,150 C186,156 194,160 200,164' },
          'fill:none;stroke:var(--accent);stroke-width:2'));
        svg.appendChild(txt(66, 92, '河短流急', 'font-size:10px;fill:var(--accent)'));
        svg.appendChild(txt(250, 168, '東岸更短', 'font-size:10px;fill:var(--dim)'));
        main = '河川：短、急、豐枯差異大';
        sub = '因為島嶼狹長、山脈偏東，河川大多「向西流入台灣海峽」，長度短、坡度陡、流速快。' +
          '⚠ 雨季集中在夏季，所以河水暴漲暴落，難以儲存 → 台灣其實是缺水地區。' +
          '最長的河是濁水溪，流域最大的是高屏溪。';
      } else {
        [['北部', 158, 44], ['中部', 150, 96], ['南部', 148, 150], ['東部', 196, 120]]
          .forEach(function (r) {
            svg.appendChild(el('circle', { cx: r[1], cy: r[2], r: 14, 'fill-opacity': '.25' },
              'fill:var(--accent);stroke:var(--accent);stroke-width:1.5'));
            svg.appendChild(txt(r[1], r[2], r[0], 'font-size:9px'));
          });
        svg.appendChild(txt(60, 40, '北回歸線', 'font-size:10px;fill:var(--bad)'));
        svg.appendChild(el('line', { x1: 46, y1: 118, x2: 300, y2: 118 },
          'stroke:var(--bad);stroke-width:1.5;stroke-dasharray:5 4'));
        svg.appendChild(txt(60, 132, '約北緯 23.5 度', 'font-size:9px;fill:var(--bad)'));
        main = '位置：北回歸線通過台灣中南部';
        sub = '台灣位於亞洲大陸東南方、太平洋西側，是東亞島弧的一部分，' +
          '西隔台灣海峽與中國大陸相望。' +
          '⚠ 北回歸線（約北緯 23.5 度）通過嘉義、花蓮一帶，' +
          '以北屬亞熱帶氣候、以南屬熱帶氣候。' +
          '位居海運與航空要道，區位條件優越。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['region', '位置與分區'], ['terrain', '地形'], ['river', '河川']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 組織架構圖（orgchart）────────────────────────────────────────────
     spec: { title, root, nodes:[{t, d}] }                                */
  REG.orgchart = function (host, spec) {
    var root = spec.root || '總統';
    var N = spec.nodes || [];
    var idx = -1;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 160', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('rect', { x: 110, y: 16, width: 100, height: 32, rx: 8, 'fill-opacity': '.25' },
        'fill:var(--bad);stroke:var(--bad);stroke-width:2'));
      svg.appendChild(txt(160, 32, root, 'font-size:12px;font-weight:700'));
      var n = Math.max(N.length, 1), w = Math.min(300 / n, 74);
      var x0 = 160 - n * w / 2;
      N.forEach(function (nd, i) {
        var x = x0 + i * w, on = i === idx;
        svg.appendChild(el('line', { x1: 160, y1: 48, x2: x + w / 2, y2: 80 },
          'stroke:var(--dim);stroke-width:1.5'));
        svg.appendChild(el('rect', { x: x + 3, y: 80, width: w - 6, height: 34, rx: 6,
          'fill-opacity': on ? '.3' : '.12' },
          'fill:var(--accent);stroke:var(--' + (on ? 'accent' : 'border') + ');stroke-width:2'));
        svg.appendChild(txt(x + w / 2, 97, nd.t, 'font-size:' + (w < 60 ? 9 : 11) + 'px'));
      });
      svg.appendChild(txt(160, 140, idx < 0 ? '按下面的按鈕看每一個的職掌' : '',
        'font-size:10px;fill:var(--dim)'));
      if (idx >= 0 && N[idx]) {
        read.appendChild(div('wg-read-main', N[idx].t));
        read.appendChild(div('wg-read-sub', N[idx].d || ''));
      } else {
        read.appendChild(div('wg-read-main', spec.title || root + '的組織'));
        read.appendChild(div('wg-read-sub', spec.intro || ''));
      }
    }
    var row = div('wg-ctrl');
    N.forEach(function (nd, i) {
      row.appendChild(btn(nd.t, function () { idx = i; paint(); }));
    });
    box.appendChild(row);
    host.appendChild(box);
    paint();
  };

  /* ── 人口金字塔（poppyramid）──────────────────────────────────────────
     spec: { mode:'young'|'aging'|'compare' }                             */
  REG.poppyramid = function (host, spec) {
    var mode = spec.mode || 'aging';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var AGES = ['80+', '60-79', '40-59', '20-39', '0-19'];
    var SET = {
      young: [8, 18, 30, 42, 52],
      aging: [26, 44, 48, 34, 22]
    };
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var data = SET[mode === 'young' ? 'young' : 'aging'];
      AGES.forEach(function (a, i) {
        var y = 30 + i * 26, w = data[i] * 2.1;
        svg.appendChild(el('rect', { x: 134 - w, y: y, width: w, height: 20, rx: 3,
          'fill-opacity': '.5' }, 'fill:var(--accent);stroke:var(--accent)'));
        svg.appendChild(el('rect', { x: 186, y: y, width: w * 0.96, height: 20, rx: 3,
          'fill-opacity': '.5' }, 'fill:var(--bad);stroke:var(--bad)'));
        svg.appendChild(txt(160, y + 12, a, 'font-size:10px;fill:var(--dim)'));
      });
      svg.appendChild(txt(70, 22, '男', 'font-size:11px;fill:var(--accent)'));
      svg.appendChild(txt(250, 22, '女', 'font-size:11px;fill:var(--bad)'));
      svg.appendChild(txt(160, 172, mode === 'young' ? '年輕型：底部寬（三角形）'
        : '高齡型：中上層寬、底部窄（倒三角）', 'font-size:11px;fill:var(--good)'));
      var main, sub;
      if (mode === 'young') {
        main = '年輕型人口：出生率高、底部寬';
        sub = '圖形像正三角形，代表幼年人口多、老年人口少。' +
          '常見於出生率高的開發中國家。' +
          '⚠ 這種結構未來的勞動力充足，但教育與就業的壓力大。';
      } else {
        main = '高齡型人口：少子化 ＋ 高齡化';
        sub = '底部（幼年）窄、上層（老年）寬，代表出生率下降、平均壽命延長。' +
          '台灣已進入高齡社會，65 歲以上人口超過總人口的 14%。' +
          '⚠ 影響：勞動力減少、扶養負擔加重、長照與年金壓力大。' +
          '因應方式：鼓勵生育、延後退休、引進移工、發展照護產業。';
      }
      read.appendChild(div('wg-read-main', main));
      read.appendChild(div('wg-read-sub', sub));
    }
    if (spec.pick !== false) {
      var row = div('wg-ctrl');
      [['young', '年輕型'], ['aging', '高齡型']].forEach(function (m) {
        row.appendChild(btn(m[1], function () { mode = m[0]; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 供給與需求（supply）──────────────────────────────────────────────
     spec: { price }                                                      */
  REG.supply = function (host, spec) {
    var p = spec.price == null ? 5 : spec.price;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 180', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var X = function (q) { return 40 + q * 24; };
      var Y = function (pr) { return 140 - pr * 12; };
      svg.appendChild(el('line', { x1: 40, y1: 20, x2: 40, y2: 140 }, 'stroke:var(--text);stroke-width:2'));
      svg.appendChild(el('line', { x1: 40, y1: 140, x2: 296, y2: 140 }, 'stroke:var(--text);stroke-width:2'));
      svg.appendChild(txt(24, 26, '價格', 'font-size:10px;fill:var(--dim)'));
      svg.appendChild(txt(280, 156, '數量', 'font-size:10px;fill:var(--dim)'));
      svg.appendChild(el('line', { x1: X(1), y1: Y(9), x2: X(9), y2: Y(1) },
        'stroke:var(--accent);stroke-width:3'));
      svg.appendChild(txt(X(9) + 14, Y(1), '需求', 'font-size:10px;fill:var(--accent)'));
      svg.appendChild(el('line', { x1: X(1), y1: Y(1), x2: X(9), y2: Y(9) },
        'stroke:var(--bad);stroke-width:3'));
      svg.appendChild(txt(X(9) + 14, Y(9), '供給', 'font-size:10px;fill:var(--bad)'));
      var qd = 10 - p, qs = p;
      svg.appendChild(el('line', { x1: 40, y1: Y(p), x2: 296, y2: Y(p) },
        'stroke:var(--good);stroke-width:1.5;stroke-dasharray:4 3'));
      svg.appendChild(txt(20, Y(p), String(p), 'font-size:10px;fill:var(--good)'));
      svg.appendChild(el('circle', { cx: X(qd), cy: Y(p), r: 5 }, 'fill:var(--accent)'));
      svg.appendChild(el('circle', { cx: X(qs), cy: Y(p), r: 5 }, 'fill:var(--bad)'));
      var state = qd > qs ? '供不應求（短缺）→ 價格會被推高'
        : (qd < qs ? '供過於求（過剩）→ 價格會下跌' : '供需平衡：這就是均衡價格');
      read.appendChild(div('wg-read-main', '價格 ' + p + '　需求量 ' + qd + '　供給量 ' + qs + '　' + state));
      read.appendChild(div('wg-read-sub',
        '需求法則：價格越高，想買的人越少（需求線由左上往右下）。' +
        '供給法則：價格越高，生產者越想賣（供給線由左下往右上）。' +
        '兩條線交叉的地方就是「均衡價格」，市場會自動往這裡靠近。' +
        '⚠ 短缺時價格上漲、過剩時價格下跌，這就是市場機制在調節。'));
    }
    var row = div('wg-ctrl');
    row.appendChild(div('wg-ctrl-label', '價格'));
    row.appendChild(slider(1, 9, p, 1, function (v) { p = v; paint(); }));
    box.appendChild(row);
    host.appendChild(box);
    paint();
  };

  /* ── 區域示意圖（regionmap）───────────────────────────────────────────
     用簡單的方框＋標點來認識一個區域的組成，點一個看說明。
     spec: { title, shape:'wide'|'tall', items:[{t, x, y, d}] }
     x, y 用 0～100 的相對座標。                                          */
  REG.regionmap = function (host, spec) {
    var items = spec.items || [];
    var idx = 0;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 190', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      svg.appendChild(el('rect', { x: 14, y: 22, width: 292, height: 150, rx: 10,
        'fill-opacity': '.07' }, 'fill:var(--good);stroke:var(--border);stroke-width:1.5'));
      if (spec.title) {
        svg.appendChild(txt(160, 14, spec.title, 'font-size:11px;fill:var(--dim)'));
      }
      items.forEach(function (it, i) {
        var x = 26 + (it.x == null ? 50 : it.x) / 100 * 268;
        var y = 34 + (it.y == null ? 50 : it.y) / 100 * 126;
        var on = i === idx;
        svg.appendChild(el('circle', { cx: x, cy: y, r: on ? 8 : 5 },
          'fill:var(--' + (on ? 'accent' : 'dim') + ')'));
        svg.appendChild(txt(x, y - (on ? 16 : 13), it.t,
          'font-size:' + (on ? 11 : 10) + 'px;fill:var(--' + (on ? 'accent' : 'dim') +
          ');font-weight:' + (on ? 700 : 400)));
      });
      var cur = items[idx] || { t: '', d: '' };
      read.appendChild(div('wg-read-main', cur.t));
      read.appendChild(div('wg-read-sub', cur.d || ''));
    }
    var row = div('wg-ctrl');
    items.forEach(function (it, i) {
      row.appendChild(btn(it.t, function () { idx = i; paint(); }));
    });
    box.appendChild(row);
    host.appendChild(box);
    paint();
  };

  /* ── 句型結構（sentence）─────────────────────────────────────────────
     把一個句子拆成一格一格，下面標出每一格的角色。
     spec: { items:[{t:'I', r:'主詞'}], note, alt:[{label, items, note}] } */
  REG.sentence = function (host, spec) {
    var sets = [{ label: spec.label || '例句', items: spec.items || [], note: spec.note || '' }]
      .concat(spec.alt || []);
    var idx = 0;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 140', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    var COLS = ['accent', 'bad', 'good', 'dim', 'accent', 'bad', 'good'];
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var cur = sets[idx], its = cur.items || [];
      var n = Math.max(its.length, 1);
      var w = Math.min(300 / n, 96), x0 = 160 - n * w / 2;
      its.forEach(function (it, i) {
        var x = x0 + i * w, col = COLS[i % COLS.length];
        svg.appendChild(el('rect', { x: x + 3, y: 40, width: w - 6, height: 40, rx: 8,
          'fill-opacity': '.18' }, 'fill:var(--' + col + ');stroke:var(--' + col + ');stroke-width:2'));
        var fs = it.t.length > 10 ? 10 : (it.t.length > 6 ? 12 : 14);
        svg.appendChild(txt(x + w / 2, 60, it.t, 'font-size:' + fs + 'px;font-weight:700'));
        svg.appendChild(txt(x + w / 2, 96, it.r, 'font-size:10px;fill:var(--' + col + ')'));
      });
      svg.appendChild(txt(160, 22, cur.label, 'font-size:11px;fill:var(--dim)'));
      read.appendChild(div('wg-read-main', its.map(function (i) { return i.t; }).join(' ')));
      read.appendChild(div('wg-read-sub', cur.note || ''));
    }
    if (sets.length > 1) {
      var row = div('wg-ctrl');
      sets.forEach(function (st, i) {
        row.appendChild(btn(st.label, function () { idx = i; paint(); }));
      });
      box.appendChild(row);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 時態表（tense）──────────────────────────────────────────────────
     spec: { verb:'eat', highlight:'現在簡單式' }                         */
  REG.tense = function (host, spec) {
    var V = spec.verb || 'eat';
    var FORMS = {
      eat: { base: 'eat', s: 'eats', ing: 'eating', ed: 'ate', pp: 'eaten' },
      go: { base: 'go', s: 'goes', ing: 'going', ed: 'went', pp: 'gone' },
      play: { base: 'play', s: 'plays', ing: 'playing', ed: 'played', pp: 'played' },
      write: { base: 'write', s: 'writes', ing: 'writing', ed: 'wrote', pp: 'written' }
    };
    var pick = spec.highlight || '現在簡單式';
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 170', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var f = FORMS[V] || FORMS.eat;
      var ROWS = [
        ['現在簡單式', 'I ' + f.base + ' / He ' + f.s, '習慣、事實與不變的道理'],
        ['現在進行式', 'I am ' + f.ing, '此刻正在做的事'],
        ['過去簡單式', 'I ' + f.ed, '過去發生、已經結束'],
        ['未來式', 'I will ' + f.base, '未來要做的事'],
        ['現在完成式', 'I have ' + f.pp, '從過去延續到現在，或到目前為止的經驗']
      ];
      ROWS.forEach(function (r, i) {
        var on = r[0] === pick, y = 26 + i * 27;
        svg.appendChild(el('rect', { x: 12, y: y, width: 296, height: 24, rx: 5,
          'fill-opacity': on ? '.25' : '.06' },
          'fill:var(--accent);stroke:var(--' + (on ? 'accent' : 'border') + ');stroke-width:1.5'));
        svg.appendChild(txt(58, y + 12, r[0], 'font-size:11px;font-weight:' + (on ? 700 : 400)));
        svg.appendChild(txt(210, y + 12, r[1], 'font-size:12px;fill:var(--' + (on ? 'text' : 'dim') + ')'));
      });
      var cur = ROWS.filter(function (r) { return r[0] === pick; })[0] || ROWS[0];
      read.appendChild(div('wg-read-main', cur[0] + '　' + cur[1]));
      read.appendChild(div('wg-read-sub', cur[2] +
        '。⚠ 動詞的形式會隨主詞與時間改變，這是英文和中文最大的差別之一：' +
        '中文用「了、正在、會」等詞表達時間，英文則直接改動詞本身。'));
    }
    var row = div('wg-ctrl');
    ['現在簡單式', '現在進行式', '過去簡單式', '未來式', '現在完成式'].forEach(function (t) {
      row.appendChild(btn(t.replace('簡單式', '式'), function () { pick = t; paint(); }));
    });
    box.appendChild(row);
    if (spec.pick !== false) {
      var row2 = div('wg-ctrl');
      ['eat', 'go', 'play', 'write'].forEach(function (v) {
        row2.appendChild(btn(v, function () { V = v; paint(); }));
      });
      box.appendChild(row2);
    }
    host.appendChild(box);
    paint();
  };

  /* ── 自然發音（phonics）──────────────────────────────────────────────
     把單字拆成一塊一塊，標出目標的字母與發音。
     spec: { words:[{w:'cat', parts:['c','a','t'], hit:1, s:'/æ/'}], note } */
  REG.phonics = function (host, spec) {
    var words = spec.words || [];
    var idx = 0;
    var box = div('wg');
    var svg = el('svg', { viewBox: '0 0 320 130', class: 'wg-svg' });
    box.appendChild(svg);
    var read = div('wg-read');
    box.appendChild(read);
    function paint() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      read.innerHTML = '';
      var cur = words[idx] || { w: '', parts: [], hit: -1, s: '' };
      var ps = cur.parts || [];
      var n = Math.max(ps.length, 1), w = Math.min(240 / n, 64), x0 = 160 - n * w / 2;
      ps.forEach(function (p, i) {
        var on = i === cur.hit, x = x0 + i * w;
        svg.appendChild(el('rect', { x: x + 3, y: 34, width: w - 6, height: 46, rx: 8,
          'fill-opacity': on ? '.3' : '.08' },
          'fill:var(--' + (on ? 'bad' : 'accent') + ');stroke:var(--' +
          (on ? 'bad' : 'border') + ');stroke-width:2'));
        svg.appendChild(txt(x + w / 2, 58, p,
          'font-size:20px;font-weight:700;fill:var(--' + (on ? 'bad' : 'text') + ')'));
      });
      if (cur.s) svg.appendChild(txt(160, 100, '目標音：' + cur.s,
        'font-size:12px;fill:var(--bad);font-weight:700'));
      svg.appendChild(txt(160, 22, cur.w, 'font-size:12px;fill:var(--dim)'));
      read.appendChild(div('wg-read-main', cur.w + (cur.mean ? '　' + cur.mean : '')));
      read.appendChild(div('wg-read-sub', cur.note || spec.note || ''));
    }
    if (words.length > 1) {
      var row = div('wg-ctrl');
      words.forEach(function (wd, i) {
        row.appendChild(btn(wd.w, function () { idx = i; paint(); }));
      });
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
