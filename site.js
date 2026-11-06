/* WAVE Digital: menu, cabeçalho ao rolar, revelação discreta e formulário de contato (mesma planilha do site antigo) */
(function () {
  var d = document, de = d.documentElement, IO = 'IntersectionObserver' in window;

  var b = d.querySelector('.burg');
  function menu(on) { de.classList.toggle('menu-on', on); if (b) { b.setAttribute('aria-expanded', on); b.setAttribute('aria-label', on ? 'Fechar menu' : 'Abrir menu'); } }
  if (b) b.addEventListener('click', function () { menu(!de.classList.contains('menu-on')); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });
  var m = d.getElementById('menu'); if (m) m.addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });

  // cabeçalho: linha ao rolar; some enquanto o vídeo de case cobre a tela (só quando o vídeo é grande, ou seja, fora do celular)
  var tk = 0, vf = d.querySelector('.video-full video');
  function sc() {
    tk = 0; de.classList.toggle('sc', scrollY > 40);
    if (vf) { var r = vf.getBoundingClientRect(), h = innerHeight; de.classList.toggle('imerso', !de.classList.contains('menu-on') && r.height >= h * .8 && r.top < h * .3 && r.bottom > h * .7); }
  }
  function pede() { if (!tk) { tk = 1; requestAnimationFrame(sc); } }
  addEventListener('scroll', pede, { passive: true }); addEventListener('resize', pede); sc();

  // revelação: blocos de primeiro nível das seções, uma vez só
  var alvos = d.querySelectorAll('.sec .w > *, .faixa-cli .w > *');
  if (IO) {
    var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('v'); o.unobserve(e.target); } }); }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });
    alvos.forEach(function (x) { x.classList.add('rv'); o.observe(x); });
  }

  // vídeos de case: param fora da tela; com "reduzir movimento" ficam parados e com controles
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.querySelectorAll('.video-case video').forEach(function (v) {
    if (RM) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; return; }
    if (IO) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: .2 }).observe(v);
  });

  // WhatsApp flutuante: o botão abre e fecha o cartão de atalhos; fecha com Esc, no X ou clicando fora
  var zb = d.querySelector('.zap-bt'), zp = d.getElementById('zap-pop');
  if (zb && zp) {
    var zap = function (on, foco) { zp.hidden = !on; zb.setAttribute('aria-expanded', on); if (foco) (on ? zp.querySelector('.zap-op a') : zb).focus(); };
    zb.addEventListener('click', function () { zap(zp.hidden, false); });
    zp.querySelector('.zap-fecha').addEventListener('click', function () { zap(false, true); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !zp.hidden) zap(false, true); });
    d.addEventListener('click', function (e) { if (!zp.hidden && !e.target.closest('.zap-flut')) zap(false, false); });
  }

  // formulários de contato (página Contato e meio da home): enviam ao Google Apps Script por um iframe oculto,
  // o mesmo endpoint e os mesmos campos do site anterior
  d.querySelectorAll('form.form-lead').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      var ok = true;
      f.querySelectorAll('[required]').forEach(function (c) {
        var bom = c.value.trim() && (c.type !== 'email' || /\S+@\S+\.\S+/.test(c.value));
        c.closest('.campo').classList.toggle('erro', !bom); if (!bom) ok = false;
      });
      if (!ok) { e.preventDefault(); var p = f.querySelector('.erro input'); if (p) p.focus(); return; }
      f.querySelector('input[name=data]').value = new Date().toLocaleString('pt-BR');
      var bt = f.querySelector('button[type=submit]'); bt.disabled = true;
      setTimeout(function () { f.querySelector('.form-ok').hidden = false; f.reset(); bt.disabled = false; }, 600);
    });
  });
})();
