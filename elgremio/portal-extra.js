/* El Gremio · extras de la zona de agremiados. Todo el contenido editable está en CONFIG. */
(() => {
const CONFIG = {
  video: '',      // Enlace embed, ej: https://www.youtube.com/embed/XXXX o https://player.vimeo.com/video/XXXX
  whatsapp: '',   // Solo números con indicativo, ej: 573001234567
  correo: '',     // ej: contacto@elgremio.co
  eventos: [      // img: ruta de foto, ej: 'img/evento1.jpg' (vacío = espacio reservado)
    { fecha: 'Fecha por confirmar', titulo: 'Encuentro de agremiados', desc: 'Espacio para conocernos, compartir proyectos y crear alianzas.', img: '' },
    { fecha: 'Fecha por confirmar', titulo: 'Taller de educación empresarial', desc: 'Sesión práctica para fortalecer tu negocio.', img: '' },
    { fecha: 'Fecha por confirmar', titulo: 'Jornada de labor social', desc: 'Actividad comunitaria organizada por el gremio.', img: '' }
  ],
  galeria: ['', '', '', '', '', ''], // rutas: 'img/galeria-1.jpg', ...
  beneficios: [
    ['🎓', 'Formación', 'Acceso a contenido y talleres de educación empresarial.'],
    ['🤝', 'Networking', 'Conexión directa con otros agremiados y aliados.'],
    ['🏢', 'Creación de empresa', 'Acompañamiento para dar forma a tu idea de negocio.'],
    ['💛', 'Labor social', 'Participa en iniciativas que impactan la comunidad.']
  ],
  anuncio: '', // Mensaje destacado arriba del portal (vacío = oculto)
  recursos: [['Guía del agremiado', 'Documento con información esencial.', ''], ['Formato de inscripción', 'Plantilla descargable.', ''], ['Presentación del gremio', 'Material institucional.', '']], // [título, descripción, enlace]
  proximo: { fecha: '', titulo: 'Próximo encuentro' }, // fecha ISO, ej: '2026-12-15T18:00:00' (vacío = oculto)
  hitos: [['Fundación', 'Cuenta aquí cómo nació el gremio.'], ['Primeros programas', 'Los primeros pasos en formación y networking.'], ['Hoy', 'Una comunidad que crece en Tuluá.']],
  aliados: ['', '', '', '', ''], // logos: 'img/aliado1.png', ...
  testimonios: [['Nombre del agremiado', 'Aquí va el testimonio de un miembro sobre su experiencia en el gremio.'], ['Otro agremiado', 'Otra historia real, con foto si el cliente la envía.']],
  faq: [
    ['¿Cómo recibo mi contraseña?', 'El administrador del gremio crea tu acceso y te entrega tu código y contraseña.'],
    ['¿Dónde veo el contenido nuevo?', 'En el listado de contenido de esta página; usa los filtros para ubicarlo rápido.'],
    ['¿Olvidé mi contraseña, qué hago?', 'Comunícate con el gremio para que te asignen una nueva.'],
    ['¿Cuándo se publican los eventos?', 'Aquí en la agenda; se actualiza cuando hay nuevas fechas.']
  ]
};
const PIL = { educacion: ['Educación empresarial', 'Formación para crecer con bases sólidas.'], empresa: ['Creación de empresa', 'De la idea a un negocio formal.'], networking: ['Networking', 'Relaciones que abren puertas.'], social: ['Labor social', 'Compromiso con nuestra comunidad.'] };
const h = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
const sec = (titulo, lead) => { const s = h('section', 'xs rv'); s.id = 'x-' + titulo.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-'); s.appendChild(h('h2', '', titulo)); if (lead) s.appendChild(h('p', 'lead', lead)); return s; };
const ph = (src, txt) => { const d = h('div', 'ph'); if (src) { const i = h('img'); i.src = src; i.alt = ''; i.loading = 'lazy'; d.appendChild(i); } else d.appendChild(h('span', '', txt || 'Espacio para imagen')); return d; };

function contar(el) {
  const n = +el.dataset.n, t0 = performance.now();
  const paso = (t) => { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
}
function revelar(raiz) {
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); e.target.querySelectorAll('[data-n]').forEach(contar); io.unobserve(e.target); } }), { threshold: .12 }) : null;
  raiz.querySelectorAll('.rv').forEach((e) => io ? io.observe(e) : e.classList.add('in'));
}

function construir(d) {
  const portal = document.getElementById('portal'), lista = document.getElementById('lista');
  portal.querySelectorAll('[data-x]').forEach((e) => e.remove());
  const antes = [], despues = [];
  const marca = (e) => { e.dataset.x = '1'; return e; };

  // Bienvenida: video + carnet
  const hero = marca(h('section', 'xhero rv'));
  const v = h('div', 'xvideo');
  if (CONFIG.video) { const f = h('iframe'); f.src = CONFIG.video; f.title = 'Video de bienvenida'; f.allowFullscreen = true; f.loading = 'lazy'; v.appendChild(f); }
  else { const p = h('div', 'play'); p.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="#111"/></svg>'; v.append(p, h('span', '', 'Video de bienvenida · próximamente')); }
  const c = h('div', 'carnet');
  c.append(h('div', 'lg', 'EL GREMIO'), h('div', 'nm', d.miembro.nombre), (() => { const m = h('div', 'mt'); m.append(h('span', '', 'Código ' + d.miembro.codigo), h('span', '', 'Desde ' + d.miembro.ingreso)); return m; })());
  c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); c.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 12 + 'deg'); c.style.setProperty('--rx', (.5 - (e.clientY - r.top) / r.height) * 12 + 'deg'); });
  c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
  hero.append(v, c); antes.push(hero);

  // Estadísticas con datos reales
  const dias = Math.max(0, Math.floor((Date.now() - new Date(d.miembro.ingreso)) / 864e5)) || 0;
  const st = marca(h('div', 'stats rv'));
  [[d.contenido.length, 'contenidos publicados'], [Object.keys(PIL).length, 'pilares del gremio'], [dias, 'días como agremiado']].forEach(([n, l]) => { const s = h('div', 'stat'); const b = h('b', '', '0'); b.dataset.n = n; s.append(b, h('span', '', l)); st.appendChild(s); });
  antes.push(st);

  // Filtros y buscador sobre las tarjetas existentes
  const fs = marca(sec('Contenido para ti', 'Filtra por pilar o busca por título.'));
  const ch = h('div', 'chips'), vacio = h('p', 'xempty', 'No hay contenido que coincida.');
  let sel = '', q = '';
  const aplicar = () => { let n = 0; Array.from(lista.children).forEach((k) => { const t = k.querySelector('small'); if (!t) return; const ok = (!sel || t.textContent === sel) && k.textContent.toLowerCase().includes(q); k.style.display = ok ? '' : 'none'; if (ok) n++; }); vacio.style.display = n ? 'none' : 'block'; };
  [['Todos', '']].concat(Object.values(PIL).map((p) => [p[0], p[0]])).forEach(([l, val], i) => { const b = h('button', 'chip' + (i ? '' : ' on'), l); b.type = 'button'; b.onclick = () => { sel = val; ch.querySelectorAll('.chip').forEach((x) => x.classList.toggle('on', x === b)); aplicar(); }; ch.appendChild(b); });
  const bus = h('input'); bus.type = 'search'; bus.placeholder = 'Buscar…'; bus.setAttribute('aria-label', 'Buscar contenido'); bus.oninput = () => { q = bus.value.toLowerCase(); aplicar(); };
  ch.appendChild(bus); fs.append(ch); antes.push(fs); despues.push(marca(vacio));

  // Pilares
  const pl = marca(sec('Nuestros pilares')); const pg = h('div', 'pil');
  Object.entries(PIL).forEach(([k, [t, x]]) => { const a = h('div', 'pc'); const i = h('img'); i.src = 'img/' + k + '.jpg'; i.alt = ''; i.loading = 'lazy'; const b = h('div'); b.append(h('h3', '', t), h('p', '', x)); a.append(i, b); pg.appendChild(a); });
  pl.appendChild(pg); despues.push(pl);

  // Agenda
  const ag = marca(sec('Agenda', 'Próximas actividades del gremio.')); const el = h('div', 'evs');
  CONFIG.eventos.forEach((e) => { const r = h('div', 'ev'); const t = h('div', 'tx'); t.append(h('small', '', e.fecha), h('h3', '', e.titulo), h('p', '', e.desc)); r.append(ph(e.img, 'Imagen del evento'), t); el.appendChild(r); });
  ag.appendChild(el); despues.push(ag);

  // Galería
  const ga = marca(sec('Galería', 'Momentos de nuestra comunidad.')); const gg = h('div', 'gal');
  CONFIG.galeria.forEach((s) => gg.appendChild(ph(s, 'Foto'))); ga.appendChild(gg); despues.push(ga);

  // Beneficios
  const be = marca(sec('Beneficios de ser agremiado')); const bg = h('div', 'bens');
  CONFIG.beneficios.forEach(([i, t, x]) => { const b = h('div', 'bn'); b.append(h('i', '', i), h('h3', '', t), h('p', '', x)); bg.appendChild(b); });
  be.appendChild(bg); despues.push(be);

  // Anuncio
  if (CONFIG.anuncio) { const an = marca(h('div', 'anu rv')); an.append(h('span', 'dot'), h('p', '', CONFIG.anuncio)); antes.push(an); }
  // Recursos
  const re = marca(sec('Recursos', 'Material para descargar y consultar.')); const rg = h('div', 'bens');
  CONFIG.recursos.forEach(([t, x, u]) => { const b = h('div', 'bn'); b.append(h('i', '', '📄'), h('h3', '', t), h('p', '', x)); if (u) { const a = h('a', '', 'Abrir'); a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.style.cssText = 'display:inline-block;margin-top:12px;text-decoration:underline'; b.appendChild(a); } else b.appendChild(h('small', '', 'Próximamente')); rg.appendChild(b); });
  re.appendChild(rg); despues.push(re);
  // Cuenta regresiva
  if (CONFIG.proximo.fecha) {
    const cd = marca(h('section', 'cd rv')); cd.appendChild(h('h2', '', CONFIG.proximo.titulo)); const bx = h('div', 'cdb'); cd.appendChild(bx);
    const pintar = () => { if (!cd.isConnected) return clearInterval(iv); let r = Math.max(0, new Date(CONFIG.proximo.fecha) - Date.now()) / 1e3; bx.textContent = ''; [['días', 86400], ['horas', 3600], ['min', 60], ['seg', 1]].forEach(([l, m]) => { const n = Math.floor(r / m); r -= n * m; const b = h('div'); b.append(h('b', '', String(n).padStart(2, '0')), h('span', '', l)); bx.appendChild(b); }); };
    const iv = setInterval(pintar, 1000); pintar(); antes.push(cd);
  }
  // Historia
  const hi = marca(sec('Nuestra historia')); const tl = h('div', 'tl');
  CONFIG.hitos.forEach(([t, x]) => { const i = h('div', 'ti'); i.append(h('h3', '', t), h('p', '', x)); tl.appendChild(i); }); hi.appendChild(tl); despues.push(hi);
  // Aliados
  const al = marca(sec('Aliados')); const ag2 = h('div', 'ali'); CONFIG.aliados.forEach((s) => ag2.appendChild(ph(s, 'Logo'))); al.appendChild(ag2); despues.push(al);
  // Testimonios
  const te = marca(sec('Voces del gremio')); const tg = h('div', 'bens');
  CONFIG.testimonios.forEach(([n, x]) => { const b = h('div', 'bn'); b.append(h('p', '', '“' + x + '”'), h('h3', '', n)); b.lastChild.style.cssText = 'margin-top:14px;font-size:16px'; tg.appendChild(b); }); te.appendChild(tg); despues.push(te);
  // Ampliar fotos de la galería
  gg.addEventListener('click', (e) => { const im = e.target.closest('.ph')?.querySelector('img'); if (!im) return; const o = h('div', 'lbx'); const g = h('img'); g.src = im.src; g.alt = ''; o.appendChild(g); o.onclick = () => o.remove(); document.body.appendChild(o); });

  // Preguntas frecuentes
  const fq = marca(sec('Preguntas frecuentes')); const fw = h('div', 'faq');
  CONFIG.faq.forEach(([q2, a]) => { const dt = h('details'); const s = h('summary', '', q2); dt.append(s, h('p', '', a)); fw.appendChild(dt); });
  fq.appendChild(fw); despues.push(fq);

  // Contacto
  const ct = marca(h('section', 'cta rv')); const tx = h('div'); tx.append(h('h2', '', '¿Necesitas ayuda?'), h('p', '', 'Escríbenos y te respondemos.'));
  const a = h('a', '', 'Contactar'); if (CONFIG.whatsapp) { a.href = 'https://wa.me/' + CONFIG.whatsapp; a.target = '_blank'; a.rel = 'noopener'; } else if (CONFIG.correo) a.href = 'mailto:' + CONFIG.correo; else { a.className = 'off'; a.textContent = 'Próximamente'; }
  ct.append(tx, a); despues.push(ct);

  // Navegación rápida entre secciones
  const nv = marca(h('nav', 'snav')); nv.setAttribute('aria-label', 'Secciones');
  [['Contenido', 'x-contenido-para-ti'], ['Pilares', 'x-nuestros-pilares'], ['Agenda', 'x-agenda'], ['Galería', 'x-galeria'], ['Recursos', 'x-recursos'], ['Historia', 'x-nuestra-historia'], ['Preguntas', 'x-preguntas-frecuentes']].forEach(([l, id]) => { const a = h('a', '', l); a.href = '#' + id; a.onclick = (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; nv.appendChild(a); });
  antes.splice(1, 0, nv);
  const top = portal.querySelector('.top');
  antes.reverse().forEach((e) => { marca(e); top.after(e); });
  let ref = lista; despues.forEach((e) => { marca(e); ref.after(e); ref = e; });
  revelar(portal);
}

async function iniciar() {
  try { const r = await fetch('/api/me', { credentials: 'same-origin' }); if (r.ok) construir(await r.json()); } catch (_) {}
}
const pg = h('div', 'prog'), up = h('button', 'up', '↑'); up.type = 'button'; up.setAttribute('aria-label', 'Volver arriba'); up.onclick = () => scrollTo({ top: 0, behavior: 'smooth' }); document.body.append(pg, up);
addEventListener('scroll', () => { const m = document.documentElement.scrollHeight - innerHeight; pg.style.width = (m > 0 ? scrollY / m * 100 : 0) + '%'; up.classList.toggle('on', scrollY > 600); }, { passive: true });
const hola = document.getElementById('hola');
if (hola) new MutationObserver(() => { if (hola.textContent) iniciar(); }).observe(hola, { childList: true });
})();
