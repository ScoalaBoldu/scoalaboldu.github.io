/* Școala Gimnazială Boldu – afișează conținutul din folderul /date.
   Conținutul se editează din Pages CMS (app.pagescms.org), nu din acest fișier. */
(function () {
  'use strict';

  var LUNI = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie',
    'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
  var CATEGORII = [
    ['anunturi', 'Anunțuri și angajări'],
    ['manageriale', 'Documente manageriale'],
    ['evaluare', 'Evaluarea Națională'],
    ['admitere', 'Admitere și înscrieri'],
    ['achizitii', 'Achiziții'],
    ['erasmus', 'Erasmus+'],
    ['pnras', 'PNRAS'],
    ['alte', 'Alte documente']
  ];

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function load(name) {
    return fetch('/date/' + name + '.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(name);
      return r.json();
    });
  }
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || '');
    return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
  }
  function fmtDate(s) {
    var d = parseDate(s);
    if (!d) return '';
    return ('0' + d.d).slice(-2) + '.' + ('0' + d.m).slice(-2) + '.' + d.y;
  }
  function byDateDesc(a, b) { return String(b.data || '').localeCompare(String(a.data || '')); }
  function isExternal(u) { return /^https?:\/\//.test(u) || /\.(pdf|docx?|xlsx?|pptx?)$/i.test(u); }
  function linkAttrs(u) {
    return 'href="' + esc(u) + '"' + (isExternal(u) ? ' target="_blank" rel="noopener"' : '');
  }
  function fileType(u) {
    var m = /\.([a-z0-9]+)(?:$|\?)/i.exec(u || '');
    return m ? m[1].toUpperCase() : 'LINK';
  }
  function tagClass(x) { return x === 'PDF' ? 'pdf' : (x === 'LINK' ? 'act' : 'doc'); }
  function fail(el) {
    if (el) el.innerHTML = '<p class="note">Conținutul nu s-a putut încărca. Reîncărcați pagina.</p>';
  }

  /* Date generale: telefon, e-mail, adresă (antet, subsol, contact) */
  function renderSchool(s) {
    document.querySelectorAll('[data-s]').forEach(function (el) {
      var k = el.getAttribute('data-s');
      if (s[k] == null) return;
      if (k === 'email') el.innerHTML = '<a href="mailto:' + esc(s.email) + '">' + esc(s.email) + '</a>';
      else if (k === 'telefon') el.innerHTML = '<a href="tel:' + esc(s.telefon.replace(/\s/g, '')) + '">' + esc(s.telefon) + '</a>';
      else el.textContent = s[k];
    });
    document.querySelectorAll('[data-href]').forEach(function (el) {
      var k = el.getAttribute('data-href');
      if (s[k]) el.href = s[k];
    });
    var hero = $('hero-img');
    if (hero && s.poza_principala) hero.src = s.poza_principala;
    var chips = $('chips');
    if (chips) chips.innerHTML = (s.distinctii || []).map(function (c) {
      return '<span class="chip">' + esc(c) + '</span>';
    }).join('');
  }

  function renderAnunturi(list) {
    var el = $('ann');
    if (!el) return;
    list = (list || []).slice().sort(byDateDesc).slice(0, 8);
    el.innerHTML = list.map(function (a) {
      var u = a.fisier || a.link || '#';
      var tip = a.tip === 'document' ? ['pdf', 'Document'] : a.tip === 'activitate' ? ['act', 'Activitate'] : ['doc', 'Anunț'];
      return '<li><time datetime="' + esc(a.data) + '">' + esc(a.data_afisata || fmtDate(a.data)) + '</time>' +
        '<a ' + linkAttrs(u) + '>' + esc(a.titlu) + '</a><span class="tag ' + tip[0] + '">' + tip[1] + '</span></li>';
    }).join('') || '<li class="note">Nu sunt anunțuri.</li>';
  }

  function renderActivitati(list) {
    var el = $('activitati');
    if (!el) return;
    list = (list || []).slice().sort(byDateDesc);
    var years = {};
    var order = [];
    list.forEach(function (a) {
      var d = parseDate(a.data);
      var y = d ? d.y : 'Fără dată';
      if (!years[y]) { years[y] = []; order.push(y); }
      years[y].push(a);
    });
    el.innerHTML = order.map(function (y) {
      return '<div class="year"><h3>' + y + '</h3><ol class="timeline">' + years[y].map(function (a) {
        var d = parseDate(a.data);
        var when = a.perioada || (d ? LUNI[d.m - 1] : '');
        var img = a.poza ? '<img src="' + esc(a.poza) + '" alt="' + esc(a.titlu) + '" loading="lazy">' : '';
        return '<li' + (img ? ' class="has-img"' : '') + '>' + img + '<span class="when">' + esc(when) + '</span>' +
          '<strong>' + esc(a.titlu) + '</strong>' + (a.descriere ? '<p>' + esc(a.descriere) + '</p>' : '') + '</li>';
      }).join('') + '</ol></div>';
    }).join('') || '<p class="note">Nu sunt activități.</p>';
  }

  function linkList(items) {
    items = (items || []).filter(function (l) { return l && (l.fisier || l.link); });
    if (!items.length) return '';
    return '<div class="links">' + items.map(function (l) {
      return '<a ' + linkAttrs(l.fisier || l.link) + '>' + esc(l.text || 'Document') + '</a>';
    }).join('') + '</div>';
  }

  function renderProiecte(list) {
    var el = $('proiecte');
    if (!el) return;
    el.innerHTML = (list || []).map(function (p) {
      return '<article class="proj"><aside>' +
        (p.poza ? '<img src="' + esc(p.poza) + '" alt="' + esc(p.titlu) + '" loading="lazy">' : '') +
        (p.perioada ? '<span class="code">' + esc(p.perioada) + '</span>' : '') +
        '</aside><div class="content">' +
        (p.eticheta ? '<span class="eyebrow">' + esc(p.eticheta) + '</span>' : '') +
        '<h3>' + esc(p.titlu) + '</h3><div class="rich">' + (p.continut || '') + '</div>' +
        linkList(p.documente) + '</div></article>';
    }).join('') || '<p class="note">Nu sunt proiecte.</p>';
  }

  var DOCS = [];
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function renderDocumente(q) {
    var el = $('docs');
    if (!el) return;
    var n = norm((q || '').trim());
    var labels = {};
    CATEGORII.forEach(function (c) { labels[c[0]] = c[1]; });
    var cats = CATEGORII.map(function (c) { return c[0]; });
    DOCS.forEach(function (d) { if (cats.indexOf(d.categorie) < 0) cats.push(d.categorie); });
    var html = cats.map(function (c) {
      var items = DOCS.filter(function (d) {
        return d.categorie === c && (!n || norm(d.titlu + ' ' + (labels[c] || c)).indexOf(n) >= 0);
      }).sort(byDateDesc);
      if (!items.length) return '';
      return '<div class="panel"><h3>' + esc(labels[c] || c || 'Alte documente') + '</h3><ul class="doclist">' +
        items.map(function (d) {
          var u = d.fisier || d.link;
          var x = fileType(u);
          return '<li><a ' + linkAttrs(u) + '>' + esc(d.titlu) + '</a><span class="meta">' +
            (d.data ? '<span>' + fmtDate(d.data) + '</span>' : '') +
            '<span class="tag ' + tagClass(x) + '">' + x + '</span></span></li>';
        }).join('') + '</ul></div>';
    }).join('');
    el.innerHTML = html || '<p class="note">Niciun document nu se potrivește căutării. Încercați alt cuvânt.</p>';
  }

  function renderDespre(d) {
    var map = { 'despre-titlu': d.titlu, 'despre-rezumat': d.rezumat };
    Object.keys(map).forEach(function (k) { if ($(k) && map[k]) $(k).textContent = map[k]; });
    if ($('despre-text')) $('despre-text').innerHTML = d.text || '';
    if ($('despre-poza') && d.poza) $('despre-poza').src = d.poza;
    if ($('misiune')) $('misiune').innerHTML = (d.misiune || []).map(function (m) {
      return '<div><h3>' + esc(m.titlu) + '</h3><p>' + esc(m.text) + '</p></div>';
    }).join('');
  }

  var page = document.body.getAttribute('data-page');
  load('scoala').then(renderSchool).catch(function () {});
  if (page === 'acasa') load('anunturi').then(function (d) { renderAnunturi(d.anunturi); }).catch(function () { fail($('ann')); });
  if (page === 'activitati') load('activitati').then(function (d) { renderActivitati(d.activitati); }).catch(function () { fail($('activitati')); });
  if (page === 'proiecte') load('proiecte').then(function (d) { renderProiecte(d.proiecte); }).catch(function () { fail($('proiecte')); });
  if (page === 'despre') load('despre').then(renderDespre).catch(function () {});
  if (page === 'documente') {
    load('documente').then(function (d) { DOCS = d.documente || []; renderDocumente(); }).catch(function () { fail($('docs')); });
    var q = $('q');
    if (q) q.addEventListener('input', function (e) { renderDocumente(e.target.value); });
  }
})();
