/* ==========================================================
   CONFIGURAÇÃO: troque aqui os números e links reais.
   Formato do número: 55 + DDD + número, só dígitos.
   ========================================================== */
const CONFIG = {
  vendedoras: [
    { nome: 'Luiza', numero: '5537900000000' },   // PLACEHOLDER
    { nome: 'Daiane', numero: '5537900000001' },  // PLACEHOLDER
  ],
  // 'seletor' abre o mini seletor "Falar com Luiza / Falar com Daiane"
  // 'sortear' escolhe uma vendedora aleatória e abre o WhatsApp direto
  modoBotao: 'seletor',
  mensagemPadrao: 'Oi! Vim pelo site da Mary Jay e quero saber mais sobre as peças.',
  grupoVip: 'https://chat.whatsapp.com/SEU-LINK-AQUI',  // PLACEHOLDER
  instagram: 'https://www.instagram.com/maryjaystore_/',
  conteudo: 'conteudo.json',
};

/* ========================================================== */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const html = document.documentElement;
const desktop = () => matchMedia('(min-width: 1024px)').matches;
const temMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const linkWhats = (numero, msg) => `https://wa.me/${numero}?text=${encodeURIComponent(msg || CONFIG.mensagemPadrao)}`;
let lenis = null;
let PRODUTOS = [];

/* ---------- WhatsApp: seletor de vendedora ---------- */
const seletor = $('[data-seletor]');
function abrirWhats(msg) {
  if (CONFIG.modoBotao === 'sortear' || !seletor?.showModal) {
    const v = CONFIG.vendedoras[Math.floor(Math.random() * CONFIG.vendedoras.length)];
    window.open(linkWhats(v.numero, msg), '_blank', 'noopener');
    return;
  }
  $('[data-seletor-opcoes]').innerHTML = CONFIG.vendedoras.map((v) => `
    <a class="seletor__opcao" href="${linkWhats(v.numero, msg)}" target="_blank" rel="noopener">
      <span class="seletor__avatar" aria-hidden="true">${esc(v.nome[0])}</span>
      <span><strong>Falar com ${esc(v.nome)}</strong><small>Vendedora Mary Jay</small></span>
      <svg aria-hidden="true"><use href="#i-whats"/></svg>
    </a>`).join('');
  seletor.showModal();
}
seletor?.addEventListener('click', (e) => {
  if (e.target === seletor) seletor.close();
  if (e.target.closest('.seletor__opcao')) setTimeout(() => seletor.close(), 150);
});

/* ---------- Janela da peça ---------- */
const modal = $('[data-modal]');
function abrirPeca(slug) {
  const i = PRODUTOS.findIndex((p) => p.id === slug);
  if (i < 0 || !modal) return;
  const p = PRODUTOS[i];
  const img = $('[data-modal-img]');
  img.src = p.foto; img.alt = p.alt;
  $('[data-modal-num]').textContent = `Peça ${String(i + 1).padStart(2, '0')} de ${PRODUTOS.length}`;
  $('[data-modal-nome]').textContent = p.nome;
  $('[data-modal-tipo]').textContent = p.tipo;
  $('[data-modal-legenda]').textContent = p.legenda || '';
  $('[data-modal-tam]').textContent = p.tamanhos.join(' · ');
  $('[data-modal-cores]').innerHTML = p.cores.map((c) => `<i style="background:${esc(c.hex)}"></i>${esc(c.nome)}`).join(' ');
  $('[data-modal-whats]').dataset.msg = `Oi! Vi o ${p.nome} no site e quero saber mais.`;
  $('[data-modal-post]').href = p.post || CONFIG.instagram;
  modal.showModal();
  lenis?.stop();
}
function fecharPeca() {
  if (!modal?.open) return;
  modal.classList.add('is-fechando');
  setTimeout(() => { modal.classList.remove('is-fechando'); modal.close(); }, 320);
}
modal?.addEventListener('close', () => lenis?.start());
modal?.addEventListener('cancel', (e) => { e.preventDefault(); fecharPeca(); });
modal?.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-fechar]')) fecharPeca(); });

/* ---------- Cliques globais ---------- */
document.addEventListener('click', (e) => {
  const w = e.target.closest('[data-whats]');
  if (w) { e.preventDefault(); fecharMenu(); abrirWhats(w.dataset.msg); return; }
  const o = e.target.closest('[data-open]');
  if (o) { e.preventDefault(); abrirPeca(o.dataset.open); return; }
  const a = e.target.closest('a[href^="#"]');
  if (a && a.getAttribute('href').length > 1) {
    const alvo = $(a.getAttribute('href'));
    if (!alvo) return;
    e.preventDefault();
    fecharMenu();
    if (lenis) lenis.scrollTo(a.getAttribute('href') === '#topo' ? 0 : alvo, { duration: 1.6 });
    else alvo.scrollIntoView({ behavior: 'smooth' });
  }
});

/* ---------- Menu mobile ---------- */
const burger = $('.burger');
const menu = $('#menu-mobile');
function fecharMenu() {
  if (!menu?.classList.contains('is-aberto')) return;
  menu.classList.remove('is-aberto');
  menu.setAttribute('aria-hidden', 'true');
  html.classList.remove('menu-aberto');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Abrir menu');
  lenis?.start();
}
burger?.addEventListener('click', () => {
  if (menu.classList.contains('is-aberto')) return fecharMenu();
  menu.classList.add('is-aberto');
  menu.setAttribute('aria-hidden', 'false');
  html.classList.add('menu-aberto');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Fechar menu');
  lenis?.stop();
});
addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });

/* ---------- Header e botão flutuante ---------- */
const header = $('.header');
const fab = $('.fab');
let ultimoY = 0;
function aoRolar() {
  const y = scrollY;
  header.classList.toggle('is-solido', y > 40);
  header.classList.toggle('is-escondido', y > 700 && y > ultimoY && !html.classList.contains('menu-aberto'));
  fab.classList.toggle('is-on', y > innerHeight * 0.7);
  ultimoY = y;
}
addEventListener('scroll', aoRolar, { passive: true });
aoRolar();

/* ---------- Links da CONFIG ---------- */
$$('[data-vip]').forEach((el) => { el.href = CONFIG.grupoVip; });
$$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });
const rodapeV = $('[data-rodape-vendedoras]');
if (rodapeV) {
  rodapeV.innerHTML = CONFIG.vendedoras.map((v) => `
    <li><a href="${linkWhats(v.numero)}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-whats"/></svg> Vendedora ${esc(v.nome)}</a></li>`).join('');
}

/* ---------- Formulário de atacado ---------- */
const form = $('[data-form-atacado]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  let ok = true;
  ['nome', 'cidade', 'loja'].forEach((c) => {
    const vazio = !String(d[c] || '').trim();
    form.elements[c].setAttribute('aria-invalid', String(vazio));
    if (vazio) ok = false;
  });
  $('[data-form-aviso]').hidden = ok;
  if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
  abrirWhats(`Oi! Sou ${d.nome.trim()}, da loja ${d.loja.trim()}, em ${d.cidade.trim()}. Quero saber como comprar no atacado da Mary Jay.`);
});

/* ---------- Depoimentos ---------- */
(() => {
  const itens = $$('.depo__item');
  const pontos = $$('[data-depo-pontos] button');
  if (!itens.length) return;
  let atual = 0; let timer;
  const ir = (i) => {
    atual = (i + itens.length) % itens.length;
    itens.forEach((it, j) => it.classList.toggle('is-ativo', j === atual));
    pontos.forEach((p, j) => p.setAttribute('aria-selected', String(j === atual)));
  };
  const auto = () => { clearInterval(timer); if (!html.classList.contains('estatico')) timer = setInterval(() => ir(atual + 1), 6500); };
  pontos.forEach((p, j) => p.addEventListener('click', () => { ir(j); auto(); }));
  $('[data-depo]').addEventListener('pointerenter', () => clearInterval(timer));
  $('[data-depo]').addEventListener('pointerleave', auto);
  auto();
})();

/* ---------- Pontos de detalhe sobre as fotos em tela cheia ---------- */
function posicionarPontos() {
  $$('[data-cap]').forEach((cap) => {
    const img = $('[data-cap-img]', cap);
    const box = $('.cap__fixo', cap);
    const nw = img.naturalWidth || +img.getAttribute('width');
    const nh = img.naturalHeight || +img.getAttribute('height');
    const [px, py] = (img.dataset.pos || '50 50').split(' ').map((n) => +n / 100);
    img.style.objectPosition = `${px * 100}% ${py * 100}%`;
    const W = box.clientWidth; const H = box.clientHeight;
    const s = Math.max(W / nw, H / nh);
    const dx = (W - nw * s) * px; const dy = (H - nh * s) * py;
    // a área do texto fica livre de etiquetas (no desktop o texto ocupa a esquerda)
    const texto = $('[data-cap-texto]', cap);
    const limiteY = desktop() ? H : texto.offsetTop - 28;
    const limiteX = desktop() ? texto.offsetLeft + texto.offsetWidth + 40 : 0;
    $$('.ponto', cap).forEach((pt) => {
      const x = dx + (+pt.dataset.fx) * nw * s;
      const y = dy + (+pt.dataset.fy) * nh * s;
      pt.style.left = `${x}px`; pt.style.top = `${y}px`;
      pt.classList.toggle('ponto--esq', x > W * 0.56);
      const sobreTexto = desktop() && x < limiteX && y > texto.offsetTop - 30;
      pt.hidden = x < 16 || x > W - 16 || y < 70 || y > H - 20 || y > limiteY || sobreTexto;
    });
  });
}
addEventListener('resize', posicionarPontos);
$$('[data-cap-img]').forEach((img) => img.addEventListener('load', posicionarPontos));

/* ---------- Conteúdo: coleção, Elas usam, medidas ---------- */
function cardPeca(p, i) {
  const n = String(i + 1).padStart(2, '0');
  return `
    <article class="peca">
      <button class="peca__foto" type="button" data-open="${esc(p.id)}" data-cursor="Ver peça" aria-label="Ver detalhes: ${esc(p.nome)}">
        <img src="${esc(p.foto)}" alt="${esc(p.alt)}" loading="${i < 3 ? 'eager' : 'lazy'}" width="656" height="880">
        <span class="peca__num">${n}</span>
      </button>
      <div class="peca__info">
        <div class="peca__topo">
          <h3 class="peca__nome">${esc(p.nome)}</h3>
          <span class="peca__cores" aria-label="Cores: ${esc(p.cores.map((c) => c.nome).join(', '))}">
            ${p.cores.map((c) => `<span style="background:${esc(c.hex)}" title="${esc(c.nome)}"></span>`).join('')}
          </span>
        </div>
        <p class="peca__tipo">${esc(p.tipo)}</p>
        <p class="peca__meta"><span>${esc(p.tamanhos.join(' · '))}</span><span>Consulte valores</span></p>
        <button class="peca__cta" type="button" data-whats data-msg="${esc(`Oi! Vi o ${p.nome} no site e quero saber mais.`)}">
          Pedir no WhatsApp <svg aria-hidden="true"><use href="#i-seta"/></svg>
        </button>
      </div>
    </article>`;
}

async function carregarConteudo() {
  try {
    const r = await fetch(CONFIG.conteudo, { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    PRODUTOS = d.produtos;
    $('[data-vitrine]').innerHTML = d.produtos.map(cardPeca).join('');

    // cópias usadas só para o loop infinito ficam fora do teclado e do leitor de tela
    const item = (f, copia) => `
      <a class="elas__item" href="${esc(f.post || CONFIG.instagram)}" target="_blank" rel="noopener" ${copia ? 'tabindex="-1" aria-hidden="true"' : `aria-label="Ver no Instagram: ${esc(f.alt)}"`}>
        <img src="${esc(f.foto)}" alt="${copia ? '' : esc(f.alt)}" loading="lazy" width="505" height="674">
        <svg aria-hidden="true"><use href="#i-insta"/></svg>
      </a>`;
    const extras = d.produtos.slice(0, 6).map((p) => ({ foto: p.foto, alt: p.nome, post: p.post }));
    $('[data-elas]').innerHTML = `
      <div class="elas__linha">${d.elasUsam.map((f) => item(f)).join('')}${d.elasUsam.map((f) => item(f, true)).join('')}</div>
      <div class="elas__linha elas__linha--volta" aria-hidden="true">${extras.map((f) => item(f, true)).join('')}${extras.map((f) => item(f, true)).join('')}</div>`;

    $('[data-medidas]').innerHTML = d.medidas.linhas.map((l) => `
      <tr class="${l.real ? '' : 'is-exemplo'}">
        <td>${esc(l.tamanho)}</td><td>${esc(l.numeracao)}</td><td>${l.busto}</td><td>${l.cintura}</td><td>${l.quadril}</td>
      </tr>`).join('');
  } catch (err) {
    console.warn('Não foi possível carregar conteudo.json', err);
    $('[data-vitrine-erro]').hidden = false;
  }
}

/* progresso do carrossel no celular */
function progressoCarrossel() {
  const trilho = $('[data-vitrine]');
  const barra = $('[data-progresso]');
  if (!trilho || !barra) return;
  const atualizar = () => {
    if (html.classList.contains('anim') && desktop()) return;
    const p = (trilho.scrollLeft + trilho.clientWidth) / trilho.scrollWidth;
    barra.style.transform = `scaleX(${Math.min(1, p)})`;
  };
  trilho.addEventListener('scroll', atualizar, { passive: true });
  atualizar();
}

/* ==========================================================
   MOVIMENTO (GSAP + ScrollTrigger + Lenis)
   ========================================================== */
function dividirPalavras(el, classe = 'p') {
  if (el.dataset.dividido) return;
  el.dataset.dividido = '1';
  const andar = (no) => {
    [...no.childNodes].forEach((filho) => {
      if (filho.nodeType === 3) {
        const partes = filho.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        partes.forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.append(document.createTextNode(' ')); return; }
          const outer = document.createElement('span'); outer.className = classe;
          if (classe === 'p') { const inner = document.createElement('span'); inner.textContent = t; outer.append(inner); }
          else outer.textContent = t;
          frag.append(outer);
        });
        filho.replaceWith(frag);
      } else if (filho.nodeType === 1) andar(filho);
    });
  };
  andar(el);
}

function semMovimento() {
  html.classList.remove('anim');
  html.classList.add('estatico');
}

async function iniciarMovimento() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) { semMovimento(); return; }
  window.__mjMotion = true;
  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);

  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  $$('[data-split]').forEach((el) => dividirPalavras(el));
  const mm = gsap.matchMedia();

  /* ----- abertura ----- */
  const loader = $('.loader');
  const conta = { v: 0 };
  const tl = gsap.timeline();
  tl.to('.loader__traco', { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: 0.15 }, 0)
    .from('.loader__nome span', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0.2)
    .from('.loader__sub', { opacity: 0, y: 10, duration: 0.8 }, 0.6)
    .to(conta, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { $('[data-loader-conta]').textContent = Math.round(conta.v); } }, 0);

  const heroImg = $('[data-hero-img]');
  const pronto = Promise.race([
    Promise.all([document.fonts?.ready, heroImg.decode?.().catch(() => {})]),
    new Promise((r) => setTimeout(r, 2600)),
  ]);
  await Promise.all([pronto, new Promise((r) => setTimeout(r, 1700))]);

  const saida = gsap.timeline({ onComplete: () => { loader.remove(); lenis?.start(); ScrollTrigger.refresh(); } });
  saida.to('.loader__centro', { yPercent: -30, opacity: 0, duration: 0.7, ease: 'power3.in' })
    .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, 0.35);

  /* ----- hero ----- */
  const arco = $('[data-hero-arco]');
  const intro = gsap.timeline({ delay: 0.55 });
  mm.add({ d: '(min-width: 1024px)', m: '(max-width: 1023px)' }, (ctx) => {
    const { d } = ctx.conditions;
    intro.fromTo(arco, { clipPath: d ? 'inset(100% 0% 0% 0% round 999px 999px 2px 2px)' : 'inset(100% 0% 0% 0%)' },
      { clipPath: d ? 'inset(0% 0% 0% 0% round 999px 999px 2px 2px)' : 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.out' }, 0)
      .from(heroImg, { scale: 1.3, duration: 2.4, ease: 'expo.out' }, 0)
      .from('#hero-titulo .p > span', { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.06 }, 0.25)
      .from('[data-hero-fade]', { y: 26, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12 }, 0.7)
      .from('[data-hero-selo]', { scale: 0.3, rotation: -90, opacity: 0, duration: 1.2, ease: 'back.out(1.6)' }, 0.9)
      .from('.header__inner', { y: -30, opacity: 0, duration: 1, ease: 'expo.out' }, 0.5);
    if (d) {
      intro.from('[data-hero-cartao]', { y: 90, rotation: -18, opacity: 0, duration: 1.3, ease: 'expo.out' }, 1);
      const traco = $('[data-traco]');
      const len = traco.getTotalLength();
      gsap.set(traco, { strokeDasharray: len, strokeDashoffset: len });
      intro.to(traco, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut' }, 0.6);
    }
    // rolagem: a foto desce mais devagar e o texto sobe
    gsap.to(arco, { yPercent: d ? 10 : 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__texto', { y: d ? -90 : -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    // parallax com o mouse
    if (d && temMouse) {
      const camadas = [['[data-hero-cartao]', 22], ['[data-hero-selo]', -14], ['[data-hero-img]', -10]].map(([s, k]) => {
        const el = $(s); return [gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }), gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }), k];
      });
      const mover = (e) => {
        const x = e.clientX / innerWidth - 0.5; const y = e.clientY / innerHeight - 0.5;
        camadas.forEach(([qx, qy, k]) => { qx(x * k); qy(y * k); });
      };
      $('.hero').addEventListener('pointermove', mover);
      return () => $('.hero').removeEventListener('pointermove', mover);
    }
  });

  /* ----- faixa de palavras: acelera e inverte com a rolagem ----- */
  const faixa = $('[data-faixa]');
  let fx = 0; let vel = 0; let dir = 1;
  ScrollTrigger.create({ onUpdate: (s) => { vel = s.getVelocity(); dir = s.direction; } });
  gsap.ticker.add(() => {
    const metade = faixa.scrollWidth / 2;
    const extra = Math.min(Math.abs(vel) / 120, 14);
    fx -= (0.55 + extra) * dir;
    if (fx <= -metade) fx += metade;
    if (fx > 0) fx -= metade;
    gsap.set(faixa, { x: fx, skewX: gsap.utils.clamp(-6, 6, -vel / 900) });
    vel *= 0.92;
  });

  /* ----- manifesto: palavras se acendem com a rolagem ----- */
  const manifesto = $('[data-preencher]');
  dividirPalavras(manifesto, 'w');
  gsap.fromTo($$('.w', manifesto), { opacity: 0.14 }, {
    opacity: 1, ease: 'none', stagger: 0.05,
    scrollTrigger: { trigger: manifesto, start: 'top 78%', end: 'bottom 42%', scrub: true },
  });
  $$('[data-conta]').forEach((el) => {
    const fim = +el.dataset.conta; const ini = +(el.dataset.de || 0); const o = { v: ini };
    el.textContent = ini;
    gsap.to(o, { v: fim, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v); } });
  });
  $$('[data-traco-scroll]').forEach((p) => {
    const len = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: p, start: 'top 85%', end: 'bottom 30%', scrub: true } });
  });

  /* ----- títulos e entradas ----- */
  $$('[data-split]').forEach((el) => {
    if (el.id === 'hero-titulo') return;
    gsap.from($$('.p > span', el), { yPercent: 115, duration: 1.25, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
  });
  const entradas = $$('.rotulo, .texto-suave, .texto-claro, .numeros li, .colecao__fim > *, .form, .tabela-wrap, .loja__botoes, .depo__palco, .depo__pontos, .vip .btn, .vip .selo-giro, [data-surgir]')
    .filter((el) => !el.closest('.hero') && !el.closest('.cap') && !(desktop() && el.closest('.colecao__trilho')));
  gsap.set(entradas, { opacity: 0, y: 34 });
  ScrollTrigger.batch(entradas, { start: 'top 90%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }) });

  $$('[data-revelar-img]').forEach((box) => {
    gsap.fromTo(box, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: box, start: 'top 85%', once: true } });
  });
  $$('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.tabela tbody tr').forEach((tr, i) => gsap.from(tr, { opacity: 0, x: -20, duration: 0.9, delay: i * 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.tabela', start: 'top 85%', once: true } }));

  /* ----- coleção: trilho horizontal no desktop ----- */
  mm.add('(min-width: 1024px)', () => {
    const secao = $('.colecao'); const trilho = $('[data-trilho]');
    const dist = () => trilho.scrollWidth - innerWidth;
    const altura = () => { secao.style.height = `${dist() + innerHeight}px`; };
    altura();
    ScrollTrigger.addEventListener('refreshInit', altura);
    const barra = $('[data-progresso]');
    const tween = gsap.to(trilho, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: secao, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true, onUpdate: (s) => gsap.set(barra, { scaleX: 0.04 + s.progress * 0.96 }) },
    });
    $$('.peca', trilho).forEach((card) => {
      const img = $('img', card);
      gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.fromTo($('.peca__foto', card), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', once: true } });
      gsap.from($('.peca__info', card), { opacity: 0, y: 24, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 85%', once: true } });
    });
    gsap.from('.colecao__intro .rotulo, .colecao__intro .texto-suave, .colecao__dica', { opacity: 0, y: 30, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: secao, start: 'top 70%', once: true } });
    return () => { ScrollTrigger.removeEventListener('refreshInit', altura); secao.style.height = ''; };
  });
  mm.add('(max-width: 1023px)', () => {
    $$('.peca').forEach((card, i) => {
      if (i > 2) return;
      gsap.from(card, { opacity: 0, x: 60, duration: 1.2, delay: i * 0.1, ease: 'expo.out', scrollTrigger: { trigger: '[data-vitrine]', start: 'top 85%', once: true } });
    });
  });

  /* ----- detalhes: foto cresce até a tela cheia ----- */
  mm.add({ d: '(min-width: 1024px)', m: '(max-width: 1023px)' }, (ctx) => {
    const { d } = ctx.conditions;
    $$('[data-cap]').forEach((cap) => {
      const media = $('[data-cap-media]', cap);
      const img = $('[data-cap-img]', cap);
      const texto = $('[data-cap-texto]', cap);
      const t = gsap.timeline({ scrollTrigger: { trigger: cap, start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
      t.fromTo(media, { clipPath: d ? 'inset(16% 26% 16% 26% round 260px 260px 6px 6px)' : 'inset(14% 9% 24% 9% round 200px 200px 6px 6px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo(img, { scale: 1.35 }, { scale: 1, ease: 'power2.out', duration: 1.15 }, 0)
        .from(texto.children, { y: 70, opacity: 0, stagger: 0.07, duration: 0.45, ease: 'power3.out' }, 0.72)
        .from($$('.ponto i', cap), { scale: 0, duration: 0.25, stagger: 0.12, ease: 'back.out(2)' }, 0.95)
        .from($$('.ponto b', cap), { opacity: 0, x: (i, el) => (el.parentElement.classList.contains('ponto--esq') ? 14 : -14), duration: 0.3, stagger: 0.12 }, 1.0)
        .to({}, { duration: 0.55 });
    });
  });

  /* ----- rodapé: letras sobem ----- */
  const marca = $('[data-marca]');
  marca.innerHTML = [...marca.textContent].map((c) => (c === ' ' ? ' ' : `<span class="l">${c}</span>`)).join('');
  gsap.from($$('.l', marca), { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: marca, start: 'top 98%', once: true } });

  /* ----- cursor e botões magnéticos (só com mouse) ----- */
  if (temMouse) {
    const cursor = $('.cursor');
    const texto = $('[data-cursor-texto]');
    const cx = gsap.quickTo(cursor, 'x', { duration: 0.5, ease: 'power3' });
    const cy = gsap.quickTo(cursor, 'y', { duration: 0.5, ease: 'power3' });
    addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); });
    document.addEventListener('pointerover', (e) => {
      const alvo = e.target.closest('[data-cursor]');
      cursor.classList.toggle('is-on', !!alvo);
      if (alvo) texto.textContent = alvo.dataset.cursor;
    });
    $$('[data-magnetic]').forEach((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.28); my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/* ---------- início ---------- */
(async () => {
  posicionarPontos();
  const conteudo = carregarConteudo();
  if (html.classList.contains('anim')) {
    if (!window.gsap) semMovimento();
    else { await conteudo; posicionarPontos(); await iniciarMovimento(); }
  }
  await conteudo;
  posicionarPontos();
  progressoCarrossel();
})();
