# Jogo da Forca

Um jogo da forca em Português, desenvolvido com HTML, CSS e JavaScript puro. O projeto oferece uma experiência de jogo completa com seleção de categoria, dificuldade, dicas, teclado virtual, contador de vitórias/derrotas e uma interface responsiva.

## 🧩 Visão geral

Este repositório contém uma implementação de jogo da forca com:

- seleção de nome do jogador;
- categorias temáticas com várias palavras;
- níveis de dificuldade;
- sistema de dicas por partida;
- quadros visuais do boneco da forca;
- teclado virtual e suporte de teclado físico;
- contagem de vitórias, derrotas e sequência;
- feedback visual com animações e confetes na vitória;
- design responsivo para desktop e mobile.

## 🚀 Funcionalidades

- Cadastro do nome do jogador antes de iniciar;
- Escolha da categoria entre temas como animais, comidas, lugares, tecnologia, natureza, música e profissões;
- Opção de dificuldade: fácil, médio e difícil;
- Limite de dicas configurável por partida;
- Palavra oculta representada por letras e espaços;
- Letras usadas exibidas em destaque;
- Contador de erros e vidas em barra fixa no topo;
- Mensagens interativas de vitória/derrota;
- Acessibilidade com uso de `aria-live`, foco visível e suporte a teclado;
- Layout elegante com tema em tons quentes e tipografia editorial.

## 🏗️ Stack tecnológica

- HTML5
- CSS3
- JavaScript (ES5/ES6 em estilo moderno, sem frameworks)

## 📁 Estrutura do projeto

```text
jogo-da-forca-att/
├── .vscode/
│   └── settings.json
├── index.html
├── style.css
├── script.js
└── README.md
```

### Arquivos principais

- `index.html` — estrutura da interface do jogo.
- `style.css` — visual, responsividade, animações e temas.
- `script.js` — lógica do jogo, categorias, regras, estado e eventos.

## ▶️ Como executar

Como é um projeto estático, basta abrir o arquivo `index.html` no navegador.

### Opção 1: abrir diretamente

1. Acesse a pasta do projeto.
2. Abra `index.html` em qualquer navegador moderno.

### Opção 2: servidor local

Você também pode rodar um servidor simples para evitar questões de segurança em alguns navegadores:

```bash
cd jogo-da-forca-att
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## 🎮 Como jogar

1. Digite seu nome.
2. Escolha a categoria desejada ou a opção "Surpresa".
3. Selecione a dificuldade.
4. Defina quantas dicas deseja receber por partida.
5. Clique em "Começar partida".
6. Tente adivinhar a palavra digitando letras no teclado ou clicando no teclado virtual.
7. Acumule acertos para vencer antes de atingir 6 erros.

## 🧠 Regras do jogo

- A palavra é sorteada de acordo com a categoria e dificuldade escolhidas.
- Cada erro aumenta o número de tentativas falhas.
- O jogo termina quando:
  - o jogador completa a palavra corretamente, ou
  - atinge 6 erros.
- Dicas podem ser usadas durante a partida e o número disponível depende da configuração.

## ✏️ Personalização

A base de palavras fica no arquivo `script.js`, na constante `CATS`.

Exemplo:

```javascript
{ id: 'animais', n: 'Animais', i: '🐘', w: [
  ['ELEFANTE', 'É o maior mamífero que anda em terra firme', 'Tem presas de marfim e uma tromba longa'],
  ['BORBOLETA', 'Antes de ser assim, passou por um casulo', 'Inseto de asas coloridas que visita flores']
] }
```

Para adicionar novas categorias ou palavras:

1. localize a variável `CATS`;
2. adicione um novo objeto com `id`, `n`, `i` e `w`;
3. cada item dentro de `w` deve seguir a estrutura:
   - palavra em maiúsculas;
   - dica 1;
   - dica 2.

## 🎨 Identidade visual

O projeto possui um visual editorial e elegante, inspirando um jogo clássico com tema em tons terrosos, como:

- fundo marfim;
- destaque em vinho/acento profundo;
- letras e símbolos com tipografia serifada;
- detalhes de interação suave e botões com foco visível.

## ♿ Acessibilidade

O projeto considera boa experiência para usuários com teclado e leitura assistiva:

- uso de `aria-live` para mensagens;
- foco visível em botões;
- contraste adequado;
- suporte de teclado físico;
- suporte a redução de movimento (`prefers-reduced-motion`).

## 📊 Status do projeto

Este repositório está funcional e pronto para uso como um jogo simples e completo em navegador.

## 📝 Licença

Este projeto não informa uma licença específica no repositório. Se desejar, pode ser adicionada uma licença open source, como MIT ou GPL, conforme a intenção do autor.

## 👤 Autor

- LucasV1218

## 💡 Observações

O projeto é totalmente front-end, sem dependências externas e sem banco de dados. Isso o torna fácil de estudar, adaptar e publicar em páginas estáticas, GitHub Pages ou qualquer ambiente com suporte a arquivos HTML.

Se quiser, posso também criar uma versão em inglês, uma versão com mais categorias, ou uma versão com ranking local usando `localStorage`.
