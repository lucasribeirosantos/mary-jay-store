# Mary Jay | prévia do catálogo online

Página inicial de catálogo para a loja **Mary Jay** (@maryjaystore_), Divinópolis-MG.
HTML, CSS e JavaScript puro, sem framework e sem build.

## Como rodar

A vitrine é montada a partir de `conteudo.json`, então abra por um servidor local
(abrir o `index.html` direto com duplo clique não carrega o JSON):

```bash
python -m http.server 5173
```

Depois acesse http://localhost:5173. Também funciona direto no GitHub Pages.

## Estrutura

```
index.html        página
style.css         estilos (mobile first)
script.js         CONFIG do WhatsApp no topo + vitrine, formulário, animações
conteudo.json     peças, galeria "Elas usam!" e tabela de medidas
assets/img/       fotos
assets/favicon.svg
prints/           prints para enviar no Direct
```

## Onde trocar números e links

No topo do `script.js`, objeto `CONFIG`:

- `vendedoras`: nome e número de Luiza e Daiane (formato `55 + DDD + número`)
- `modoBotao`: `'seletor'` (mini seletor Luiza/Daiane) ou `'sortear'`
- `grupoVip`: link de convite do Grupo VIP
- `diferencialEnvio`: texto do 3º diferencial ("Envio para todo o Brasil")

## O que ainda é placeholder (confirmar com a loja)

| Item | Situação |
| --- | --- |
| Números de WhatsApp da Luiza e da Daiane | Fictícios (`5537900000000` e `5537900000001`) |
| Link do Grupo VIP | Fictício |
| Preços | Não exibidos, os cards mostram "Consulte valores" |
| "Envio para todo o Brasil" | Não confirmado, texto editável |
| Depoimentos | 3 textos de exemplo, marcados como "texto de exemplo" |
| Nomes das peças | Só **Conjunto Patrícia** e **Macacão Simone** vêm das legendas. Os outros 6 nomes são sugestões descritivas (`nomeConfirmado: false` no JSON) |
| Tamanhos por peça | Todas com PP, P, M (grade do destaque Medida). Confirmar disponibilidade |
| Cores por peça | Tiradas das fotos e da legenda do Macacão Simone (coral e amarelo). Confirmar |
| Tabela de medidas | PP, P e M são **reais** (destaque "Medida"). G e GG são exemplo. Na arte original o M aparece como 40/42, igual ao início do P; vale conferir |
| Horário | Tirado do destaque "Endereço" (seg a sex 8h às 18h, sáb 8h às 13h). O story tem cerca de 2 anos, confirmar |
| Galeria "Elas usam!" | Usa fotos do feed da loja (modelo da marca), não de clientes. Fotos de clientes só com autorização delas |

## Origem das fotos

Todas as fotos de peças, do hero e da galeria são do Instagram da própria loja
(@maryjaystore_), usadas com autorização para esta prévia. Como o Instagram não
libera o arquivo original, as imagens foram capturadas da tela em alta resolução
e recortadas. Para a versão final, pedir os arquivos originais à loja.

| Arquivo | Peça | Post |
| --- | --- | --- |
| hero.jpg | Conjunto azul com botões | instagram.com/p/DfRyRohAvzD |
| produto-1.jpg | Conjunto Patrícia | instagram.com/p/DfHuMKclX6Y |
| produto-2.jpg | Conjunto Botões (azul) | instagram.com/p/DfW5XxIAEcI |
| produto-3.jpg | Macacão Branco Renda | instagram.com/p/DfhM75EFVM_ |
| produto-4.jpg | Vestido Midi Renda | instagram.com/p/DfkpMiHGWEu |
| produto-5.jpg | Vestido Babados (rosa) | instagram.com/p/DfCrvUXkRMs |
| produto-6.jpg | Macacão Simone | instagram.com/p/DetrSiRkfBS |
| produto-7.jpg | Vestido Noite (preto) | instagram.com/p/DejaY9PDflp |
| produto-8.jpg | Conjunto Zíper (amarelo) | instagram.com/p/DecCLL1Dpgl |
| elas-usam-1 a 6.jpg | Looks do feed | links no `conteudo.json` |
| extra-conjunto-coral.jpg | Conjunto coral (reserva) | instagram.com/p/DeoiTMejbZZ |

Nenhuma imagem de banco de imagens foi usada. Não faltou nenhuma foto.

## Prints

Gerados com Playwright (Chrome):

- `prints/celular-primeira-dobra-390x844.png` (390x844, 3x)
- `prints/desktop-pagina-inteira-1440.png` (1440px, página inteira)
- `prints/desktop-primeira-dobra-1440.png` (bônus)

---

Site desenvolvido por Lucas Ribeiro.
