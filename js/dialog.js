/* 站內風格對話框：取代原生 alert/confirm（2026-08-15 Tony 全站指示——原生彈窗與站內 UI 不搭）
   UIDialog.alert(msg[, cb])：單鈕訊息框
   UIDialog.confirm(msg, onOk[, onCancel])：確定／取消兩段式
   Enter＝主鈕、Esc＝取消；訊息用 textContent 塞入，\n 會換行 */
(function () {
  if (typeof document === 'undefined') return;
  var overlay = null, primaryCb = null, cancelCb = null;

  function close() {
    if (!overlay) return;
    document.removeEventListener('keydown', onKey, true);
    overlay.parentNode && overlay.parentNode.removeChild(overlay);
    overlay = null; primaryCb = null; cancelCb = null;
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); var c = cancelCb; close(); if (c) c(); }
    else if (e.key === 'Enter') { e.preventDefault(); var p = primaryCb; close(); if (p) p(); }
  }
  function open(msg, btns) {
    close();
    overlay = document.createElement('div');
    overlay.className = 'dlg-overlay';
    var card = document.createElement('div');
    card.className = 'dlg-card';
    var body = document.createElement('div');
    body.className = 'dlg-msg';
    body.textContent = msg;
    card.appendChild(body);
    var row = document.createElement('div');
    row.className = 'dlg-btns';
    btns.forEach(function (b) {
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'chip' + (b.primary ? ' dlg-primary' : '');
      el.textContent = b.label;
      el.addEventListener('click', function () { close(); if (b.cb) b.cb(); });
      row.appendChild(el);
      if (b.primary) primaryCb = b.cb || null;
      if (b.cancel) cancelCb = b.cb || null;
    });
    card.appendChild(row);
    overlay.appendChild(card);
    // 點背景＝取消（confirm）／關閉（alert）
    overlay.addEventListener('click', function (e) {
      if (e.target !== overlay) return;
      var c = cancelCb; close(); if (c) c();
    });
    document.body.appendChild(overlay);
    document.addEventListener('keydown', onKey, true);
    var pb = card.querySelector('.dlg-primary');
    if (pb) pb.focus();
  }

  window.UIDialog = {
    alert: function (msg, cb) {
      open(msg, [{ label: '知道了', primary: true, cancel: true, cb: cb }]);
    },
    confirm: function (msg, onOk, onCancel) {
      open(msg, [
        { label: '取消', cancel: true, cb: onCancel },
        { label: '確定', primary: true, cb: onOk }
      ]);
    }
  };
})();
