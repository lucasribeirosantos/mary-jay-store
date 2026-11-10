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
  // Texto editável do 3º diferencial (não confirmado com a loja)
  diferencialEnvio: 'Envio para todo o Brasil',
  conteudo: 'conteudo.json',
};

/* ========================================================== */

document.documentElement.classList.add('js');

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const linkWhats = (numero, msg) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(msg || CONFIG.mensagemPadrao)}`;

/* ---------- Seletor de vendedora ---------- */
const seletor = $('[data-seletor]');
const opcoes = $('[data-seletor-opcoes]');

function abrirWhats(msg) {
  if (CONFIG.modoBotao === 'sortear' || !seletor || typeof seletor.showModal !== 'function') {
    const v = CONFIG.vendedoras[Math.floor(Math.random() * CONFIG.vendedoras.length)];
    window.open(linkWhats(v.numero, msg), '_blank', 'noopener');
    return;
  }
  opcoes.innerHTML = CONFIG.vendedoras.map((v) => `
    <a class="seletor__opcao" href="${linkWhats(v.numero, msg)}" target="_blank" rel="noopener">
      <span class="seletor__avatar" aria-hidden="true">${v.nome[0]}</span>
      <span><strong>Falar com ${v.nome}</strong><small>Vendedora Mary Jay</small></span>
      <svg aria-hidden="true"><use href="#i-whats"/></svg>
    </a>`).join('');
  seletor.showModal();
}

if (seletor) {
  seletor.addEventListener('click', (e) => {
    if (e.target === seletor) seletor.close();          // clique fora
    if (e.target.closest('.seletor__opcao')) setTimeout(() => seletor.close(), 150);
  });
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-whats]');
  if (!btn) return;
  e.preventDefault();
  fecharMenu();
  abrirWhats(btn.dataset.msg);
});

/* ---------- Menu mobile ---------- */
const menuBtn = $('.menu-btn');
const nav = $('#menu');

function fecharMenu() {
  if (!nav) return;
  nav.classList.remove('is-open');
  menuBtn?.setAttribute('aria-expanded', 'false');
  menuBtn?.setAttribute('aria-label', 'Abrir menu');
}
menuBtn?.addEventListener('click', () => {
  const aberto = nav.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(aberto));
  menuBtn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});
$$('#menu a').forEach((a) => a.addEventListener('click', fecharMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });

/* ---------- Header com borda ao rolar ---------- */
const header = $('.header');
const flutuante = $('.whats-float');
const marcarHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
  // no celular o botão flutuante aparece depois do hero, para não cobrir os botões principais
  const mostrar = window.innerWidth >= 1024 || window.scrollY > window.innerHeight * 0.6;
  flutuante?.classList.toggle('is-visivel', mostrar);
};
marcarHeader();
window.addEventListener('scroll', marcarHeader, { passive: true });
window.addEventListener('resize', marcarHeader);

/* ---------- Textos e links vindos da CONFIG ---------- */
$$('[data-envio]').forEach((el) => { el.textContent = CONFIG.diferencialEnvio; });
$$('[data-vip]').forEach((el) => { el.href = CONFIG.grupoVip; });
$$('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });
const rodapeV = $('[data-rodape-vendedoras]');
if (rodapeV) {
  rodapeV.innerHTML = CONFIG.vendedoras.map((v) => `
    <li><a href="${linkWhats(v.numero)}" target="_blank" rel="noopener">
      <svg aria-hidden="true"><use href="#i-whats"/></svg> Vendedora ${v.nome}</a></li>`).join('');
}

/* ---------- Formulário de atacado ---------- */
const form = $('[data-form-atacado]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(form));
  const campos = ['nome', 'cidade', 'loja'];
  let ok = true;
  campos.forEach((c) => {
    const vazio = !String(dados[c] || '').trim();
    form.elements[c].setAttribute('aria-invalid', String(vazio));
    if (vazio) ok = false;
  });
  $('[data-form-aviso]').hidden = ok;
  if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
  const msg = `Oi! Sou ${dados.nome.trim()}, da loja ${dados.loja.trim()}, em ${dados.cidade.trim()}. Quero saber como comprar no atacado da Mary Jay.`;
  abrirWhats(msg);
});

/* ---------- Animação de entrada ---------- */
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  : null;

function observar(els) {
  els.forEach((el, i) => {
    if (!io) { el.classList.add('is-in'); return; }
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
}

/* ---------- Conteúdo: vitrine, Elas usam, medidas ---------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function cardProduto(p, i) {
  const msg = `Oi! Vi o ${p.nome} no site e quero saber mais.`;
  return `
    <article class="card reveal">
      <div class="card__foto">
        <img src="${esc(p.foto)}" alt="${esc(p.alt)}" loading="${i < 2 ? 'eager' : 'lazy'}" width="775" height="960">
        ${i < 3 ? '<span class="card__tag">Novo</span>' : ''}
      </div>
      <div class="card__corpo">
        <h3 class="card__nome">${esc(p.nome)}</h3>
        <p class="card__tipo">${esc(p.tipo)}</p>
        <div class="card__meta">
          <div class="card__tamanhos" aria-label="Tamanhos disponíveis: ${esc(p.tamanhos.join(', '))}">
            ${p.tamanhos.map((t) => `<span>${esc(t)}</span>`).join('')}
          </div>
          <div class="card__cores" aria-label="Cores: ${esc(p.cores.map((c) => c.nome).join(', '))}">
            ${p.cores.map((c) => `<span style="background:${esc(c.hex)}" title="${esc(c.nome)}"></span>`).join('')}
          </div>
        </div>
        <p class="card__preco">Consulte valores</p>
        <button class="card__btn" type="button" data-whats data-msg="${esc(msg)}">
          <svg aria-hidden="true"><use href="#i-whats"/></svg> Pedir no WhatsApp
        </button>
      </div>
    </article>`;
}

async function carregarConteudo() {
  try {
    const r = await fetch(CONFIG.conteudo, { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    const dados = await r.json();

    const vitrine = $('[data-vitrine]');
    vitrine.innerHTML = dados.produtos.map(cardProduto).join('');
    observar($$('.card', vitrine));

    const elas = $('[data-elas]');
    elas.innerHTML = dados.elasUsam.map((f) => `
      <a class="elas__item reveal" href="${esc(f.post || CONFIG.instagram)}" target="_blank" rel="noopener" aria-label="Ver no Instagram: ${esc(f.alt)}">
        <img src="${esc(f.foto)}" alt="${esc(f.alt)}" loading="lazy" width="505" height="674">
        <svg aria-hidden="true"><use href="#i-insta"/></svg>
      </a>`).join('');
    observar($$('.elas__item', elas));

    const tbody = $('[data-medidas]');
    tbody.innerHTML = dados.medidas.linhas.map((l) => `
      <tr class="${l.real ? '' : 'is-exemplo'}">
        <td>${esc(l.tamanho)}</td><td>${esc(l.numeracao)}</td>
        <td>${l.busto}</td><td>${l.cintura}</td><td>${l.quadril}</td>
      </tr>`).join('');
  } catch (err) {
    console.warn('Não foi possível carregar conteudo.json', err);
    $('[data-vitrine-erro]').hidden = false;
  }
}

carregarConteudo();
observar($$('.reveal'));
