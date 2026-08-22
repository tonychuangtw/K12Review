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
