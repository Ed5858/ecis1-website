// Home-page business picker -> quote page (remembers the choice for the quote form)
function pickGo(ev) {
  ev.preventDefault();
  var c = document.querySelector('.picker input[name=biz]:checked');
  try { sessionStorage.setItem('ecisBiz', c ? c.value : ''); } catch (e) {}
  location.href = '/get-a-quote';
  return false;
}

// 3-step quote form
var qCur = 1;
function qShow(n) {
  qCur = n;
  document.querySelectorAll('.qpane').forEach(function (p) { p.classList.toggle('on', +p.dataset.step === n); });
  var bar = document.getElementById('qbar'), st = document.getElementById('qstep'), nav = document.getElementById('qnav'), nx = document.getElementById('qnext');
  if (!bar) return;
  bar.style.width = Math.min(100, Math.round(n / 3 * 100)) + '%';
  st.textContent = n > 3 ? 'Done' : 'Step ' + n + ' of 3';
  nav.style.display = n > 3 ? 'none' : 'flex';
  nav.firstElementChild.style.visibility = n === 1 ? 'hidden' : 'visible';
  nx.textContent = n === 3 ? 'Send my quote request' : 'Continue';
  document.getElementById('qerr').textContent = '';
  var top = document.querySelector('.qcard'); if (top && n > 1) top.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function qMove(d) { qShow(Math.max(1, Math.min(4, qCur + d))); }
function qSubmit(ev) {
  ev.preventDefault();
  if (qCur === 3) {
    var f = document.getElementById('quote'), bad = null;
    ['name', 'phone', 'email'].forEach(function (k) { if (!bad && !f.elements[k].value.trim()) bad = f.elements[k]; });
    if (bad) { document.getElementById('qerr').textContent = 'Please add your ' + bad.name + ' so we can send your quote.'; bad.focus(); return false; }
    // Collect the choices from steps 1-2 into readable fields, then send.
    var biz = f.querySelector('input[name=business]:checked');
    var cov = [].map.call(f.querySelectorAll('input[name=coverage]:checked'), function (c) { return c.value; }).join(', ');
    var h = document.createElement('input'); h.type = 'hidden'; h.name = 'coverage_requested'; h.value = cov; f.appendChild(h);
    f.querySelectorAll('input[name=coverage]').forEach(function (c) { c.disabled = true; });
    document.getElementById('qnext').textContent = 'Sending...';
    f.submit();
    return false;
  }
  qMove(1);
  return false;
}
function simpleSubmit(ev, form) {
  ev.preventDefault();
  var ok = form.querySelector('.formok');
  if (ok) ok.textContent = 'Thank you — we received your request and will reply the same business day.';
  return false;
}
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('quote')) {
    qShow(1);
    try {
      var b = sessionStorage.getItem('ecisBiz');
      if (b) document.querySelectorAll('input[name=business]').forEach(function (i) { if (i.value.indexOf(b.split(' ')[0]) === 0) i.checked = true; });
    } catch (e) {}
  }
  // close the mobile menu after picking a link
  document.querySelectorAll('.mnav a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('menu'); }); });
});
