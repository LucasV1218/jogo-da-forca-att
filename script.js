/* JOGO DA FORCA - estado em "state"; toda ação altera o state e chama render(). */
/* IDEIA CENTRAL: o jogo guarda tudo numa variável (state). Quando algo acontece
   (clique, tecla), o código atualiza o state e depois chama render(), que redesenha
   a tela a partir do state. Assim a tela sempre reflete os dados. */
   (function () {
    /* Esta função se executa sozinha (IIFE: "Immediately Invoked Function Expression").
       Tudo o que for declarado aqui dentro fica PRIVADO: não "vaza" para o resto da página. */
    'use strict';
    /* Modo estrito: o JS avisa de erros comuns (como usar variável sem declarar). */
    var MAX_ERRORS = 6;
    /* Número máximo de erros permitidos (cabeça, corpo, 2 braços, 2 pernas = 6 partes). */
  
    /* Banco de palavras por categoria: [palavra, dica 1 (vaga), dica 2 (clara)].
       Para criar uma categoria nova, basta adicionar um bloco aqui. */
    var CATS = [
      /* CATS é uma lista (array) de categorias. Cada categoria é um objeto com:
         id = identificador interno, n = nome exibido, i = emoji, w = lista de palavras.
         Cada palavra é outra lista: [PALAVRA, dica vaga, dica clara]. */
      { id: 'animais', n: 'Animais', i: '🐘', w: [
        ['ELEFANTE', 'É o maior mamífero que anda em terra firme', 'Tem presas de marfim e uma tromba longa'],
        ['BORBOLETA', 'Antes de ser assim, passou por um casulo', 'Inseto de asas coloridas que visita flores'],
        ['GIRAFA', 'Tem o pescoço mais longo do reino animal', 'Vive na savana e come folhas de árvores altas'],
        ['TARTARUGA', 'Carrega a própria casa nas costas', 'Réptil de casco duro e passos lentos'],
        ['GOLFINHO', 'Mamífero marinho muito inteligente', 'Salta sobre as ondas e se comunica por assobios'] ] },
      /* Fim da categoria Animais. Observe: a palavra vem em MAIÚSCULAS e pode ter acento. */
      { id: 'comidas', n: 'Comidas', i: '🍫', w: [
        ['ABACAXI', 'Usa uma coroa de folhas pontiagudas', 'Casca áspera, polpa amarela e ácida'],
        ['CHOCOLATE', 'Nasce de uma semente tropical', 'Doce que derrete na boca, feito de cacau'],
        ['MORANGO', 'Pequena fruta vermelha cheia de sementinhas por fora', 'Combina com creme e chantilly'],
        ['MACARRÃO', 'Prato favorito de domingo na casa de muita gente', 'Massa de trigo servida com molho'],
        ['PIPOCA', 'Estoura quando esquenta', 'Petisco de cinema feito de milho'] ] },
      /* Categoria Comidas. */
      { id: 'lugares', n: 'Lugares', i: '🗺️', w: [
        ['BIBLIOTECA', 'O silêncio é a regra da casa', 'Estantes cheias de livros para ler e emprestar'],
        ['FAROL', 'Fica à beira-mar', 'Torre de luz giratória que orienta os navios'],
        ['PIRÂMIDE', 'Faraós descansavam dentro de uma', 'Monumento egípcio de base quadrada e quatro faces triangulares'],
        ['AEROPORTO', 'Lugar de despedidas e reencontros', 'Onde os aviões pousam e decolam'],
        ['PRAIA', 'Combina com sol, areia e protetor', 'Faixa de areia na beira do mar'] ] },
      /* Categoria Lugares. */
      { id: 'objetos', n: 'Objetos', i: '🔑', w: [
        ['GUARDA-CHUVA', 'Aparece quando o tempo fecha', 'Abre-se sobre a cabeça para proteger da água'],
        ['RELÓGIO', 'Anda sem parar, mas nunca sai do lugar', 'Seus ponteiros marcam as horas'],
        ['ESPELHO', 'Mostra tudo, mas só o que está à frente', 'Superfície que reflete a sua imagem'],
        ['TESOURA', 'Tem duas lâminas que trabalham juntas', 'Serve para cortar papel e tecido'] ] },
      /* Categoria Objetos. "GUARDA-CHUVA" tem hífen: o código trata como caractere que não é letra. */
      { id: 'tecnologia', n: 'Tecnologia', i: '💻', w: [
        ['TECLADO', 'Tem mais de uma centena de teclas', 'Periférico em que se digita'],
        ['JAVASCRIPT', 'Roda dentro do navegador', 'Linguagem que dá comportamento às páginas web'],
        ['COMPUTADOR', 'Processa dados em silêncio', 'Máquina com tela, teclado e processador'],
        ['CELULAR', 'Cabe no bolso e vive na mão', 'Aparelho de ligações, mensagens e aplicativos'] ] },
      /* Categoria Tecnologia. */
      { id: 'natureza', n: 'Natureza', i: '🌋', w: [
        ['MONTANHA', 'Quanto mais alta, mais fria', 'Grande elevação natural, às vezes com neve no topo'],
        ['VULCÃO', 'Quando acorda, faz muito barulho', 'Montanha que expele lava e cinzas'],
        ['CACHOEIRA', 'A água cai e não se machuca', 'Queda d’água em um rio'],
        ['ARCO-ÍRIS', 'Aparece depois da chuva com sol', 'Faixa de sete cores no céu'] ] },
      /* Categoria Natureza. */
      { id: 'musica', n: 'Música', i: '🎸', w: [
        ['VIOLÃO', 'Tem seis cordas', 'Instrumento de madeira, presença certa em rodas de samba'],
        ['BATERIA', 'Quem toca precisa de braços e pernas coordenados', 'Conjunto de tambores e pratos tocado com baquetas'],
        ['SANFONA', 'Respira enquanto toca', 'Instrumento de fole, marca das festas juninas'] ] },
      /* Categoria Música. */
      { id: 'profissoes', n: 'Profissões', i: '👷', w: [
        ['ARQUITETURA', 'Une beleza e engenharia', 'Arte e técnica de projetar edifícios'],
        ['BOMBEIRO', 'Corre em direção ao perigo', 'Combate incêndios e faz resgates'],
        ['PROFESSORA', 'Ensina quase todas as outras profissões', 'Dá aulas na escola'],
        ['MÉDICO', 'Usa jaleco branco e estetoscópio', 'Cuida da saúde das pessoas'] ] }
      /* Última categoria (sem vírgula depois, pois é o último item da lista). */
    ];
    var ALL = [];
    /* ALL será uma lista "achatada" com TODAS as palavras de TODAS as categorias (usada no modo Surpresa). */
    CATS.forEach(function (c) { c.w.forEach(function (x) { ALL.push({ w: x[0], h: [x[1], x[2]], c: c }); }); });
    /* Para cada categoria (c), percorre suas palavras (x) e coloca em ALL um objeto:
       w = a palavra (x[0]), h = lista das duas dicas (x[1] e x[2]), c = a categoria a que pertence. */
  
    var $ = function (id) { return document.getElementById(id); };
    /* Atalho: $('word') equivale a document.getElementById('word'). Encurta o código abaixo. */
    var el = {
      /* "el" guarda referências a todos os elementos da página que o JS vai usar.
         Buscar uma vez só e guardar é mais eficiente do que buscar toda hora. */
      word: $('word'), used: $('used'), counter: $('counter'), msg: $('msg'), kb: $('kb'),
      /* Palavra, letras usadas, contador de erros, mensagem e teclado virtual. */
      parts: document.querySelectorAll('.part'), hintList: $('hintList'), hintBtn: $('hintBtn'),
      /* parts = TODAS as partes do boneco (querySelectorAll devolve uma lista); lista e botão de dicas. */
      newBtn: $('new'), changeBtn: $('change'), confetti: $('confetti'), setup: $('setup'),
      /* Botões Nova partida e Trocar categoria, camada de confete e tela de configuração. */
      name: $('name'), levels: $('levels'), hintChoices: $('hintChoices'), setupNote: $('setupNote'),
      /* Campo do nome, grupos de botões de dificuldade e de dicas, e a nota explicativa. */
      startBtn: $('startBtn'), player: $('player'), cats: $('cats'), topic: $('topic'),
      /* Botão Começar, texto do jogador, carrossel de categorias e barra de categoria do topo. */
      tIco: $('tIco'), tName: $('tName'), lives: $('lives'), stats: $('stats'),
      /* Emoji e nome da categoria na barra, área dos corações e placar. */
      stage: document.querySelector('.stage')
      /* querySelector devolve só o PRIMEIRO elemento com a classe .stage: o palco do desenho. */
    };
  
    var LEVELS = {
      /* Configuração de cada dificuldade: nome, tamanho máximo da palavra, dicas padrão e nota. */
      easy:   { label: 'Fácil',   max: 7,        hints: 2, note: 'Palavras de até 7 letras.' },
      /* Fácil: palavras de até 7 letras, 2 dicas. */
      medium: { label: 'Médio',   max: 9,        hints: 2, note: 'Palavras de 8 a 9 letras.' },
      /* Médio: até 9 letras (e mais de 7, porque o fácil pega antes), 2 dicas. */
      hard:   { label: 'Difícil', max: Infinity, hints: 1, note: 'Palavras de 10 letras ou mais.' }
      /* Difícil: sem limite (Infinity = infinito), só 1 dica. */
    };
    var settings = { name: '', level: 'medium', hints: 2, cat: 'all' };
    /* Escolhas do jogador. Valores iniciais: sem nome, nível médio, 2 dicas, categoria 'all' (Surpresa). */
    var stats = { wins: 0, losses: 0, streak: 0, best: 0 };
    /* Placar: vitórias, derrotas, sequência atual de vitórias e melhor sequência (recorde). */
    var state, last = '', confettiTimer;
    /* state = dados da partida atual (criado em newGame); last = última palavra sorteada
       (para não repetir seguida); confettiTimer = temporizador que limpa os confetes. */
  
    function norm(c) { return c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(); }
    /* Normaliza o texto: 'NFD' separa a letra do acento (É vira E + ´); o replace remove os acentos
       (\u0300-\u036f é a faixa dos acentos); toUpperCase deixa maiúsculo. Assim, digitar E acerta É. */
    function isLetter(c) { return /^[A-Z]$/.test(c); }
    /* Retorna true se c é uma única letra de A a Z. (/^...$/ é uma expressão regular: início e fim do texto.) */
    function levelOf(word) {
      /* Descobre a dificuldade de uma palavra pelo número de letras. */
      var n = norm(word).replace(/[^A-Z]/g, '').length;
      /* Normaliza, remove tudo que não é A-Z (hífens, por exemplo) e conta o tamanho. */
      return n <= LEVELS.easy.max ? 'easy' : n <= LEVELS.medium.max ? 'medium' : 'hard';
      /* Operador ternário (condição ? se sim : se não), encadeado: até 7 = easy; até 9 = medium; senão hard. */
    }
    function say(text, cls) { el.msg.textContent = text; el.msg.className = cls || ''; }
    /* Mostra uma mensagem e define sua classe CSS (warn/win/lose) para mudar a cor. Sem cls, fica sem classe. */
    function replay(node, cls) { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); }
    /* Reinicia uma animação CSS: remove a classe, força o navegador a recalcular o layout
       (ler offsetWidth faz isso; "void" descarta o valor) e recoloca a classe. Sem isso, a animação não repetiria. */
  
    /* ---------- INICIAR PARTIDA ---------- */
    function newGame() {
      // Sorteia dentro da categoria escolhida (ou de todas); prefere a dificuldade, se houver palavras dela.
      var pool = ALL.filter(function (x) { return settings.cat === 'all' || x.c.id === settings.cat; });
      /* pool = "sacola" de palavras candidatas: todas (modo Surpresa) ou só as da categoria escolhida. */
      var byLevel = pool.filter(function (x) { return levelOf(x.w) === settings.level; });
      /* Dentre as candidatas, as que têm a dificuldade escolhida. */
      if (byLevel.length) pool = byLevel;
      /* Se existir alguma dessa dificuldade, usa só essas. Senão, mantém todas (evita sortear de uma lista vazia). */
      var entry;
      /* entry = a palavra sorteada. */
      do { entry = pool[Math.floor(Math.random() * pool.length)]; } while (entry.w === last && pool.length > 1);
      /* Sorteia um índice aleatório (Math.random dá 0 a 0,999...; multiplicar pelo tamanho e arredondar para
         baixo com Math.floor dá um índice válido). Repete enquanto sair a mesma palavra da rodada anterior,
         desde que haja mais de uma opção. */
      last = entry.w;
      /* Guarda a palavra sorteada para comparar na próxima partida. */
  
      state = {
        /* Cria o estado de uma partida nova. */
        word: entry.w, key: norm(entry.w), cat: entry.c,
        /* word = palavra como exibida (com acento); key = versão sem acento, usada para comparar letras; cat = categoria. */
        hints: entry.h.slice(0, settings.hints), hintsShown: 0,
        /* hints = só as primeiras N dicas (N escolhido pelo jogador; slice recorta a lista); hintsShown = quantas já foram reveladas. */
        hits: [], misses: [], over: false, lost: false
        /* hits = letras acertadas; misses = letras erradas; over = partida acabou?; lost = foi derrota? */
      };
  
      // Categoria SEMPRE visível no topo (mostra a categoria real da palavra sorteada).
      el.tIco.textContent = entry.c.i;
      /* Coloca o emoji da categoria na barra do topo. */
      el.tName.textContent = entry.c.n;
      /* Coloca o nome da categoria. */
      replay(el.topic, 'flash');
      /* Faz a barra piscar (animação "flash") para chamar atenção ao tema novo. */
  
      clearTimeout(confettiTimer);
      /* Cancela o temporizador de confete da partida anterior, se ainda estiver pendente. */
      el.confetti.innerHTML = '';
      /* Remove confetes que ainda estejam na tela. */
      el.kb.classList.remove('locked');
      /* Destrava o teclado (tira o visual apagado). */
      el.kb.querySelectorAll('button').forEach(function (b) { b.className = ''; });
      /* Limpa as classes hit/miss de todas as teclas, deixando-as "novas". */
      say('Tema: ' + entry.c.n + '. Escolha uma letra.', 'warn');
      /* Mensagem inicial, em cinza (classe warn). O + junta textos. */
      render();
      /* Desenha a tela com o estado novo. */
    }
  
    /* ---------- DESENHAR A TELA ---------- */
    function render() {
      /* Redesenha a tela inteira a partir de "state". É chamada após qualquer mudança. */
      el.word.innerHTML = '';
      /* Esvazia a área da palavra para recriar as células do zero. */
      state.word.split('').forEach(function (ch, i) {
        /* split('') quebra a palavra em letras. Para cada letra (ch) e posição (i): */
        var k = state.key[i], span = document.createElement('span');
        /* k = a mesma letra sem acento; span = novo elemento <span> que será a célula. */
        span.className = 'cell';
        /* Dá a classe "cell" (a lacuna com traço embaixo). */
        if (!isLetter(k)) { span.className += ' gap'; span.textContent = ch; }
        /* Se não é letra (hífen), marca como "gap" (sem traço) e já mostra o caractere. */
        else if (state.hits.indexOf(k) > -1) {
          /* Se a letra já foi acertada (indexOf devolve -1 quando não acha): */
          span.textContent = ch;
          /* Mostra a letra (com o acento original). */
          if (state.over && !state.lost) { span.className += ' win'; span.style.setProperty('--i', i); }
          /* Se o jogo acabou em vitória, adiciona a classe "win" (salto) e passa a posição i
             para o CSS por meio da variável --i, que cria o efeito de onda. */
        } else if (state.lost) { span.className += ' reveal'; span.textContent = ch; }
        /* Se não foi acertada e o jogador perdeu, revela a letra em vinho ("reveal"). */
        el.word.appendChild(span);
        /* Coloca a célula pronta na tela. */
      });
  
      var all = state.hits.map(function (l) { return '<span class="hit">' + l + '</span>'; })
        .concat(state.misses.map(function (l) { return '<span class="miss">' + l + '</span>'; }));
      /* Monta uma lista de pedaços de HTML: cada acerto em <span class="hit"> e, depois (concat junta listas),
         cada erro em <span class="miss"> (o CSS risca os erros). */
      el.used.innerHTML = all.join(' ') || '<span style="color:var(--muted)">—</span>';
      /* join(' ') une tudo separado por espaço. Se a lista estiver vazia (texto vazio = falso para o ||),
         mostra um traço cinza "—". */
  
      el.counter.textContent = state.misses.length + ' / ' + MAX_ERRORS;
      /* Atualiza o contador: ex. "2 / 6". */
      el.parts.forEach(function (p, i) { p.classList.toggle('show', i < state.misses.length); });
      /* Para cada parte do boneco (índice i): toggle liga a classe "show" se i < nº de erros, senão desliga.
         Com 2 erros, as partes 0 e 1 (cabeça e corpo) aparecem. */
  
      // Vidas (corações) na barra do topo
      el.lives.innerHTML = '';
      /* Esvazia os corações para recriá-los. */
      for (var h = 0; h < MAX_ERRORS; h++) {
        /* Laço que repete 6 vezes (h = 0 a 5): um coração por vida. */
        var heart = document.createElement('i');
        /* Cria um elemento <i> para o coração. */
        heart.textContent = '♥';
        /* Define o símbolo do coração. */
        if (h >= MAX_ERRORS - state.misses.length) heart.className = 'off';
        /* Os corações do final ficam "off" (apagados), na quantidade igual aos erros.
           Ex.: 2 erros → h >= 4 → os dois últimos apagam. */
        el.lives.appendChild(heart);
        /* Insere o coração na barra. */
      }
  
      el.hintList.innerHTML = '';
      /* Esvazia a lista de dicas para recriá-la. */
      for (var n = 0; n < state.hintsShown; n++) {
        /* Repete uma vez para cada dica já revelada. */
        var li = document.createElement('li');
        /* Cria um item de lista (<li>) dentro da lista numerada. */
        li.textContent = state.hints[n];
        /* Coloca o texto da dica de número n. */
        el.hintList.appendChild(li);
        /* Insere o item na lista. */
      }
      var left = state.hints.length - state.hintsShown;
      /* Quantas dicas ainda restam: total da partida menos as já mostradas. */
      el.hintBtn.disabled = state.over || left === 0;
      /* Desativa o botão se o jogo acabou ou se não há mais dicas. (=== compara valor e tipo.) */
      el.hintBtn.textContent = state.hints.length === 0 ? 'Sem dicas nesta partida'
        : left === 0 ? 'Sem mais dicas' : 'Pedir dica (' + left + ')';
      /* Texto do botão (ternário encadeado): sem dicas na partida; dicas esgotadas; ou "Pedir dica (restantes)". */
  
      el.stats.textContent = 'Vitórias ' + stats.wins + ' · Derrotas ' + stats.losses +
        ' · Sequência ' + stats.streak + ' · Recorde ' + stats.best;
      /* Atualiza o placar no rodapé. */
    }
  
    /* ---------- VITÓRIA E DERROTA ---------- */
    function hasWon() {
      /* Verifica se o jogador descobriu todas as letras. */
      return state.key.split('').every(function (k) { return !isLetter(k) || state.hits.indexOf(k) > -1; });
      /* every = "todos os itens passam no teste?". Cada caractere precisa: não ser letra (hífen conta como ok)
         OU já estar entre os acertos. Se todos passarem, é vitória. */
    }
  
    function celebrate() {
      /* Cria a chuva de confetes. */
      var colors = ['#7a2e2e', '#b08d57', '#1c1b19', '#c9a9a6', '#d9c7a0'];
      /* Paleta dos confetes, combinando com o tema (vinho, dourado, preto...). */
      for (var n = 0; n < 80; n++) {
        /* Repete 80 vezes: um confete por volta. */
        var p = document.createElement('div');
        /* Cria uma <div> para o confete. */
        p.className = 'confetto';
        /* Aplica a classe que dá forma e a animação de queda. */
        p.style.left = Math.random() * 100 + 'vw';
        /* Posição horizontal aleatória, de 0 a 100% da largura da tela (vw = % da largura). */
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        /* Cor sorteada da paleta. */
        p.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
        /* Duração da queda aleatória, entre 2,5 e 5 segundos: uns caem mais rápido que outros. */
        p.style.animationDelay = (Math.random() * 0.8) + 's';
        /* Atraso aleatório de até 0,8s para não caírem todos juntos. */
        p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
        /* Variável CSS --dx: deslize lateral entre -80px e +80px (usada no @keyframes fall). */
        p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
        /* Variável CSS --rot: giro entre -360° e +360°. */
        el.confetti.appendChild(p);
        /* Coloca o confete na camada da tela. */
      }
      confettiTimer = setTimeout(function () { el.confetti.innerHTML = ''; }, 6000);
      /* Depois de 6 segundos (6000 ms), remove todos os confetes do HTML para não acumular elementos. */
    }
  
    function finish(lost) {
      /* Encerra a partida. O parâmetro "lost" é true se perdeu, false se ganhou. */
      state.over = true; state.lost = lost;
      /* Marca que acabou e se foi derrota. */
      el.kb.classList.add('locked');
      /* Apaga o teclado virtual. */
      if (lost) {
        /* Caminho da derrota: */
        stats.losses++; stats.streak = 0;
        /* Soma uma derrota (++ aumenta em 1) e zera a sequência de vitórias. */
        say('Fim de jogo, ' + settings.name + '. A palavra era ' + state.word + '.', 'lose');
        /* Mensagem em vinho revelando a palavra. */
      } else {
        /* Caminho da vitória: */
        stats.wins++; stats.streak++; stats.best = Math.max(stats.best, stats.streak);
        /* Soma vitória e sequência; o recorde passa a ser o maior entre o recorde antigo e a sequência atual. */
        say('Vitória, ' + settings.name + '! Você descobriu a palavra.', 'win');
        /* Mensagem de vitória. */
        celebrate();
        /* Solta os confetes. */
      }
    }
  
    /* ---------- TENTATIVA ---------- */
    function guess(raw) {
      /* Processa uma tentativa de letra. "raw" é o texto como veio (do teclado físico ou virtual). */
      if (!state || state.over) return;
      /* Se não há partida ou ela já acabou, ignora (return sai da função). */
      var c = norm(raw);
      /* Normaliza: tira acento e deixa maiúsculo. */
      if (raw.length !== 1 || !isLetter(c)) { say('Digite apenas letras de A a Z.', 'warn'); return; }
      /* Valida: precisa ser exatamente 1 caractere e uma letra A–Z. Senão avisa e sai. */
      if (state.hits.indexOf(c) > -1 || state.misses.indexOf(c) > -1) { say('A letra ' + c + ' já foi usada.', 'warn'); return; }
      /* Se a letra já foi tentada (acerto ou erro), avisa e sai, sem punir o jogador. */
  
      var btn = el.kb.querySelector('[data-k="' + c + '"]');
      /* Encontra a tecla virtual dessa letra pelo atributo data-k (ex.: [data-k="A"]). */
      if (state.key.indexOf(c) > -1) {
        /* Se a letra existe na palavra (versão sem acento): */
        state.hits.push(c); btn.className = 'hit';
        /* Registra o acerto (push adiciona ao fim da lista) e pinta a tecla de verde. */
        say('A letra ' + c + ' está na palavra.', '');
        /* Mensagem neutra (sem classe). */
      } else {
        /* Senão, é um erro: */
        state.misses.push(c); btn.className = 'miss';
        /* Registra o erro e risca a tecla. */
        say('A letra ' + c + ' não está em ' + state.cat.n.toLowerCase() + '. Pense no tema!', '');
        /* Mensagem lembrando o tema (toLowerCase deixa o nome da categoria em minúsculas). */
        replay(el.stage, 'shake'); // balança o boneco a cada erro
        /* Dispara a animação de tremor no desenho. */
      }
      if (hasWon()) finish(false);
      /* Se completou a palavra, encerra com vitória. */
      else if (state.misses.length >= MAX_ERRORS) finish(true);
      /* Senão, se chegou a 6 erros, encerra com derrota. */
      render();
      /* Redesenha a tela com tudo atualizado. */
    }
  
    /* ---------- EVENTOS ---------- */
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (l) {
      /* Quebra o alfabeto em letras e, para cada uma (l), cria uma tecla virtual: */
      var b = document.createElement('button');
      /* Cria um <button>. */
      b.type = 'button'; b.textContent = l; b.setAttribute('data-k', l);
      /* Define o tipo, o texto da tecla e o atributo data-k (que o guess usa para achar o botão). */
      b.addEventListener('click', function () { guess(l); });
      /* Ao clicar, chama guess com essa letra. */
      el.kb.appendChild(b);
      /* Insere a tecla no teclado da tela. */
    });
  
    document.addEventListener('keydown', function (e) {
      /* Escuta qualquer tecla pressionada no teclado físico. "e" descreve o evento. */
      if (!el.setup.hidden) return;
      /* Se a tela de configuração está aberta, não joga (assim digitar o nome não gasta letras). */
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      /* Ignora atalhos (Ctrl+C, Cmd+R, Alt+...), para não atrapalhar o navegador. */
      if (e.key.length !== 1 || e.key === ' ') return;
      /* Ignora teclas especiais (Enter, Shift, setas têm nome com mais de 1 caractere) e o espaço. */
      guess(e.key);
      /* Tenta a letra digitada. */
    });
  
    el.hintBtn.addEventListener('click', function () {
      /* Ao clicar em "Pedir dica": */
      if (state.over || state.hintsShown >= state.hints.length) return;
      /* Se acabou o jogo ou todas as dicas já foram reveladas, não faz nada. */
      state.hintsShown++; render();
      /* Revela mais uma dica (aumenta o contador) e redesenha. */
    });
    el.newBtn.addEventListener('click', newGame);
    /* Clicar em "Nova partida" chama newGame diretamente (sem parênteses: passamos a função, não a executamos). */
  
    /* ---------- CONFIGURAÇÃO ---------- */
    function mark(group, attr, value) {
      /* Marca visualmente qual botão de um grupo está selecionado.
         group = o grupo; attr = nome do atributo (ex.: 'data-level'); value = valor escolhido. */
      group.querySelectorAll('button').forEach(function (b) {
        /* Para cada botão do grupo: */
        b.setAttribute('aria-checked', String(b.getAttribute(attr) === String(value)));
        /* aria-checked fica "true" só no botão cujo atributo é igual ao valor escolhido, e "false" nos demais.
           String(...) converte para texto, pois atributos HTML são sempre texto. O CSS usa esse atributo para pintar. */
      });
    }
  
    // Monta o seletor de categorias (carrossel com scroll): "Surpresa" + uma carta por categoria.
    [{ id: 'all', n: 'Surpresa', i: '🎲', c: ALL.length }].concat(CATS.map(function (c) {
      /* Começa com uma lista de 1 item (a carta "Surpresa", com o total de palavras em c) e concatena
         a lista gerada por CATS.map, que transforma cada categoria num objeto simplificado: */
      return { id: c.id, n: c.n, i: c.i, c: c.w.length };
      /* id, nome, emoji e quantidade de palavras da categoria. */
    })).forEach(function (c) {
      /* Para cada carta da lista final (Surpresa + categorias), cria um botão: */
      var b = document.createElement('button');
      /* Novo botão. */
      b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('data-cat', c.id);
      /* Tipo botão, papel de "radio" (acessibilidade) e data-cat guardando o id da categoria. */
      b.innerHTML = '<span class="ci">' + c.i + '</span><b>' + c.n + '</b><small>' + c.c + ' palavras</small>';
      /* Conteúdo da carta: emoji, nome em negrito e contagem de palavras. */
      el.cats.appendChild(b);
      /* Adiciona a carta ao carrossel. */
    });
    el.cats.addEventListener('click', function (e) {
      /* Um único "ouvinte" no carrossel inteiro (delegação de eventos): funciona para qualquer carta clicada. */
      var b = e.target.closest('button'); if (!b) return;
      /* e.target = onde se clicou (pode ser o emoji dentro da carta); closest sobe até o botão.
         Se o clique não foi em botão, sai. */
      settings.cat = b.getAttribute('data-cat');
      /* Guarda a categoria escolhida. */
      refreshSetup();
      /* Atualiza a tela de configuração (marca a carta selecionada). */
      b.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      /* Rola o carrossel suavemente para centralizar a carta clicada. */
    });
    // Roda do mouse rola o carrossel na horizontal.
    el.cats.addEventListener('wheel', function (e) {
      /* Escuta a roda do mouse sobre o carrossel. */
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.cats.scrollWidth > el.cats.clientWidth) {
        /* Se o movimento da roda é mais vertical que horizontal E o conteúdo é mais largo que a área visível
           (ou seja, há o que rolar): */
        el.cats.scrollLeft += e.deltaY; e.preventDefault();
        /* converte a rolagem vertical em horizontal e impede a página de rolar para baixo. */
      }
    }, { passive: false });
    /* passive:false avisa ao navegador que podemos chamar preventDefault (necessário para bloquear a rolagem). */
  
    function refreshSetup() {
      /* Atualiza a tela de configuração conforme as escolhas atuais. */
      mark(el.cats, 'data-cat', settings.cat);
      /* Marca a categoria escolhida. */
      mark(el.levels, 'data-level', settings.level);
      /* Marca a dificuldade escolhida. */
      mark(el.hintChoices, 'data-n', settings.hints);
      /* Marca a quantidade de dicas escolhida. */
      el.setupNote.textContent = LEVELS[settings.level].note;
      /* Mostra a nota da dificuldade (ex.: "Palavras de até 7 letras."). */
      el.startBtn.disabled = el.name.value.trim() === '';
      /* Desativa o botão Começar se o nome estiver vazio (trim remove espaços das pontas). */
    }
    function openSetup() {
      /* Abre a tela de configuração. */
      el.name.value = settings.name;
      /* Preenche o campo com o nome já usado (ou vazio na primeira vez). */
      el.setup.hidden = false;
      /* Mostra a tela (tira o atributo hidden). */
      refreshSetup();
      /* Atualiza as marcações e o botão. */
      el.name.focus();
      /* Coloca o cursor no campo de nome, pronto para digitar. */
    }
    el.levels.addEventListener('click', function (e) {
      /* Clique em algum botão de dificuldade: */
      var b = e.target.closest('button'); if (!b) return;
      /* Descobre o botão clicado; se não foi botão, sai. */
      settings.level = b.getAttribute('data-level');
      /* Guarda o nível escolhido (easy, medium ou hard). */
      settings.hints = LEVELS[settings.level].hints;
      /* Ajusta as dicas para o padrão desse nível (o jogador ainda pode mudar depois). */
      refreshSetup();
      /* Atualiza a tela. */
    });
    el.hintChoices.addEventListener('click', function (e) {
      /* Clique em algum botão de quantidade de dicas: */
      var b = e.target.closest('button'); if (!b) return;
      /* Descobre o botão clicado. */
      settings.hints = Number(b.getAttribute('data-n'));
      /* Lê o número (vem como texto) e converte com Number. */
      refreshSetup();
      /* Atualiza a tela. */
    });
    el.name.addEventListener('input', refreshSetup);
    /* A cada letra digitada no nome ("input"), reavalia se o botão Começar deve ficar ativo. */
  
    function start() {
      /* Fecha a configuração e começa a jogar. */
      var n = el.name.value.trim();
      /* Nome digitado, sem espaços nas pontas. */
      if (!n) { el.name.focus(); return; }
      /* Se estiver vazio, devolve o foco ao campo e não inicia. */
      settings.name = n;
      /* Guarda o nome. */
      el.setup.hidden = true;
      /* Esconde a tela de configuração. */
      el.player.textContent = n + ' · ' + LEVELS[settings.level].label;
      /* Mostra "Nome · Dificuldade" no cabeçalho. */
      newGame();
      /* Inicia a primeira partida. */
    }
    el.startBtn.addEventListener('click', start);
    /* Clique em "Começar partida" chama start. */
    el.name.addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });
    /* Apertar Enter no campo do nome também começa o jogo. */
    el.changeBtn.addEventListener('click', openSetup);
    /* "Trocar categoria" reabre a configuração. */
  
    openSetup();
    /* Última linha: ao carregar a página, abre a tela de configuração. É o ponto de partida de tudo. */
  })();
  /* Os parênteses finais "()" executam imediatamente a função que abrimos lá em cima. */