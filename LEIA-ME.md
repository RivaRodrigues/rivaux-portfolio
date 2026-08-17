# RivaUX — site

## Estrutura

```
raiz/
├── index.html
├── projetos.html          case CEDESP
├── trail-bikers.html      case Trail Bikers
├── curriculo.html         página interna (noindex)
├── vercel.json · robots.txt · sitemap.xml
├── css/
│   └── style.css              stylesheet único de todas as páginas
├── js/
│   ├── home.js
│   ├── case.js                usado pelas duas páginas de case (eram idênticos)
│   └── curriculo.js
├── docs/                      PDFs do currículo
└── assets/
    └── image/                 todas as imagens
```

Nenhum HTML tem mais `<style>`, `<script>` embutido ou atributo `style=""`. Foi isso
que permitiu remover o `'unsafe-inline'` do Content-Security-Policy no `vercel.json`.

**CSS unificado:** todas as páginas carregam apenas `css/style.css`. Os blocos foram
isolados por classes no elemento `<html>` (`page-home`, `page-case`,
`page-trail-bikers` e `page-curriculo`) para evitar sobrescritas entre telas.

## Renomeie ao mover (a nomenclatura foi padronizada)

| Arquivo atual (na raiz)       | Novo caminho e nome                          |
| ----------------------------- | -------------------------------------------- |
| `Logo-RivaUX-Branco-Azul.png` | `assets/image/logo-rivaux.png`               |
| `hero-section-img.png`        | `assets/image/rivelino-hero.png`             |
| `curriculo-criativo.png`      | `assets/image/curriculo-preview.png`         |
| `fav-black.png`               | `assets/image/favicon.png`                   |
| `Currículo-UX-Design.pdf`     | `docs/curriculo-rivelino-criativo.pdf`       |
| `curriculo-texto.pdf`         | `docs/curriculo-rivelino-texto.pdf`          |

Tudo em minúsculas, sem acento e sem espaço. O `Currículo-UX-Design.pdf` era o mais
arriscado: acento em nome de arquivo vira código na URL (`Curr%C3%ADculo-...`) e alguns
servidores tratam isso de forma inconsistente.

As três telas do Trail Bikers já vêm em `assets/image/`, otimizadas.

## Ainda falta criar

- `assets/image/cedesp-matricula.webp`
- `assets/image/cedesp-turmas.webp`
- `assets/image/cedesp-painel.webp`
- `assets/image/trailbikers-capa.webp` — tela de capa, no mesmo padrão das outras
- `assets/image/og-rivaux.jpg` — 1200x630, imagem de compartilhamento

## Publicação

**DNS na Cloudflare, não no Registro.br.** No Vercel, Settings → Domains, adicione
`rivaux.com.br` e `www`. Copie os valores que aparecerem no card (o IP do A e o alvo
do CNAME são específicos do seu projeto — não use valores de tutorial).

Na Cloudflare, em DNS → Records:

- `A` no `@` com o IP do card — **nuvem cinza (DNS only)**, não laranja
- `CNAME` no `www` com o alvo do card — também cinza
- apague AAAA e A antigos do apex
- **não toque nos MX nem no TXT de SPF**: são eles que entregam o contato@rivaux.com.br

## Formulário

O `vercel.json` já libera o Web3Forms no Content-Security-Policy
(`connect-src https://api.web3forms.com`). Se o formulário falhar no ar com erro de
CSP no console, é sinal de que subiu um `vercel.json` antigo.

## Convenções do código

**Ícones** — Material Symbols Rounded por fonte. Ao usar um ícone novo, acrescente o
nome ao `icon_names` no `<link>` do `<head>` daquela página, senão o navegador imprime
o nome escrito por extenso.

**Botões no mobile** — largura 100% com teto de 300px, centralizados.

**Animações** — `scroll-reveal cascade` revela os filhos em sequência; `stack-cards`
empilha cartões no mobile via `position: sticky` (por isso o `body` usa
`overflow-x: clip`). Nos cases a cascata é `reveal-cascade` com IntersectionObserver.

**Acordeões** — `<details>` com abertura animada por GSAP; abrir um fecha os irmãos.
O `+` que vira `X` é desenhado em CSS (duas barras que giram), não é ícone de fonte.

**Cases** — a ordem é resumo (problema, solução, resultado) primeiro, processo depois,
aprofundamento dentro de `<details>`. Ao acrescentar conteúdo: se não muda a decisão
de quem avalia, vai recolhido.

**Telas de celular** — as imagens já trazem a moldura do aparelho, então `.phone-frame`
é só limitador de largura e o `object-fit: contain` mostra a tela inteira.

## O que ainda daria para melhorar

O CSS agora está centralizado em `css/style.css`, mas ainda existem regras semelhantes
em blocos diferentes porque a prioridade desta etapa foi preservar exatamente o visual
de cada página. Em uma próxima refatoração, dá para transformar tokens, navbar, rodapé
e botões em uma camada compartilhada para reduzir repetição sem alterar a interface.
