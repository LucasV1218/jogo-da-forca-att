/* JOGO DA FORCA - estado em "state"; toda ação altera o state e chama render(). */
(function () {
  'use strict';
  var MAX_ERRORS = 6;

  /* Banco de palavras por categoria: [palavra, dica 1 (vaga), dica 2 (clara)].
     Para criar uma categoria nova, basta adicionar um bloco aqui. */
  var CATS = [
    { id: 'animais', n: 'Animais', i: '🐘', w: [
      ['ELEFANTE', 'É o maior mamífero que anda em terra firme', 'Tem presas de marfim e uma tromba longa'],
      ['BORBOLETA', 'Antes de ser assim, passou por um casulo', 'Inseto de asas coloridas que visita flores'],
      ['GIRAFA', 'Tem o pescoço mais longo do reino animal', 'Vive na savana e come folhas de árvores altas'],
      ['TARTARUGA', 'Carrega a própria casa nas costas', 'Réptil de casco duro e passos lentos'],
      ['GOLFINHO', 'Mamífero marinho muito inteligente', 'Salta sobre as ondas e se comunica por assobios'] ] },
    { id: 'comidas', n: 'Comidas', i: '🍫', w: [
      ['ABACAXI', 'Usa uma coroa de folhas pontiagudas', 'Casca áspera, polpa amarela e ácida'],
      ['CHOCOLATE', 'Nasce de uma semente tropical', 'Doce que derrete na boca, feito de cacau'],
      ['MORANGO', 'Pequena fruta vermelha cheia de sementinhas por fora', 'Combina com creme e chantilly'],
      ['MACARRÃO', 'Prato favorito de domingo na casa de muita gente', 'Massa de trigo servida com molho'],
      ['PIPOCA', 'Estoura quando esquenta', 'Petisco de cinema feito de milho'] ] },
    { id: 'lugares', n: 'Lugares', i: '🗺️', w: [
      ['BIBLIOTECA', 'O silêncio é a regra da casa', 'Estantes cheias de livros para ler e emprestar'],
      ['FAROL', 'Fica à beira-mar', 'Torre de luz giratória que orienta os navios'],
      ['PIRÂMIDE', 'Faraós descansavam dentro de uma', 'Monumento egípcio de base quadrada e quatro faces triangulares'],
      ['AEROPORTO', 'Lugar de despedidas e reencontros', 'Onde os aviões pousam e decolam'],
      ['PRAIA', 'Combina com sol, areia e protetor', 'Faixa de areia na beira do mar'] ] },
    { id: 'objetos', n: 'Objetos', i: '🔑', w: [
      ['GUARDA-CHUVA', 'Aparece quando o tempo fecha', 'Abre-se sobre a cabeça para proteger da água'],
      ['RELÓGIO', 'Anda sem parar, mas nunca sai do lugar', 'Seus ponteiros marcam as horas'],
      ['ESPELHO', 'Mostra tudo, mas só o que está à frente', 'Superfície que reflete a sua imagem'],
      ['TESOURA', 'Tem duas lâminas que trabalham juntas', 'Serve para cortar papel e tecido'] ] },
    { id: 'tecnologia', n: 'Tecnologia', i: '💻', w: [
      ['TECLADO', 'Tem mais de uma centena de teclas', 'Periférico em que se digita'],
      ['JAVASCRIPT', 'Roda dentro do navegador', 'Linguagem que dá comportamento às páginas web'],
      ['COMPUTADOR', 'Processa dados em silêncio', 'Máquina com tela, teclado e processador'],
      ['CELULAR', 'Cabe no bolso e vive na mão', 'Aparelho de ligações, mensagens e aplicativos'] ] },
    { id: 'natureza', n: 'Natureza', i: '🌋', w: [
      ['MONTANHA', 'Quanto mais alta, mais fria', 'Grande elevação natural, às vezes com neve no topo'],
      ['VULCÃO', 'Quando acorda, faz muito barulho', 'Montanha que expele lava e cinzas'],
      ['CACHOEIRA', 'A água cai e não se machuca', 'Queda d’água em um rio'],
      ['ARCO-ÍRIS', 'Aparece depois da chuva com sol', 'Faixa de sete cores no céu'] ] },
    { id: 'musica', n: 'Música', i: '🎸', w: [
      ['VIOLÃO', 'Tem seis cordas', 'Instrumento de madeira, presença certa em rodas de samba'],
      ['BATERIA', 'Quem toca precisa de braços e pernas coordenados', 'Conjunto de tambores e pratos tocado com baquetas'],
      ['SANFONA', 'Respira enquanto toca', 'Instrumento de fole, marca das festas juninas'] ] },
    { id: 'profissoes', n: 'Profissões', i: '👷', w: [
      ['ARQUITETURA', 'Une beleza e engenharia', 'Arte e técnica de projetar edifícios'],
      ['BOMBEIRO', 'Corre em direção ao perigo', 'Combate incêndios e faz resgates'],
      ['PROFESSORA', 'Ensina quase todas as outras profissões', 'Dá aulas na escola'],
      ['MÉDICO', 'Usa jaleco branco e estetoscópio', 'Cuida da saúde das pessoas'] ] }
  ];
  var ALL = [];
  CATS.forEach(function (c) { c.w.forEach(function (x) { ALL.push({ w: x[0], h: [x[1], x[2]], c: c }); }); });

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    word: $('word'), used: $('used'), counter: $('counter'), msg: $('msg'), kb: $('kb'),
    parts: document.querySelectorAll('.part'), hintList: $('hintList'), hintBtn: $('hintBtn'),
    newBtn: $('new'), changeBtn: $('change'), confetti: $('confetti'), setup: $('setup'),
    name: $('name'), levels: $('levels'), hintChoices: $('hintChoices'), setupNote: $('setupNote'),
    startBtn: $('startBtn'), player: $('player'), cats: $('cats'), topic: $('topic'),
    tIco: $('tIco'), tName: $('tName'), lives: $('lives'), stats: $('stats'),
    stage: document.querySelector('.stage')
  };

  var LEVELS = {
    easy:   { label: 'Fácil',   max: 7,        hints: 2, note: 'Palavras de até 7 letras.' },
    medium: { label: 'Médio',   max: 9,        hints: 2, note: 'Palavras de 8 a 9 letras.' },
    hard:   { label: 'Difícil', max: Infinity, hints: 1, note: 'Palavras de 10 letras ou mais.' }
  };
  var settings = { name: '', level: 'medium', hints: 2, cat: 'all' };
  var stats = { wins: 0, losses: 0, streak: 0, best: 0 };
  var state, last = '', confettiTimer;

  function norm(c) { return c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(); }
  function isLetter(c) { return /^[A-Z]$/.test(c); }
  function levelOf(word) {
    var n = norm(word).replace(/[^A-Z]/g, '').length;
    return n <= LEVELS.easy.max ? 'easy' : n <= LEVELS.medium.max ? 'medium' : 'hard';
  }
  function say(text, cls) { el.msg.textContent = text; el.msg.className = cls || ''; }
  function replay(node, cls) { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); }

  /* ---------- INICIAR PARTIDA ---------- */
  function newGame() {
    // Sorteia dentro da categoria escolhida (ou de todas); prefere a dificuldade, se houver palavras dela.
    var pool = ALL.filter(function (x) { return settings.cat === 'all' || x.c.id === settings.cat; });
    var byLevel = pool.filter(function (x) { return levelOf(x.w) === settings.level; });
    if (byLevel.length) pool = byLevel;
    var entry;
    do { entry = pool[Math.floor(Math.random() * pool.length)]; } while (entry.w === last && pool.length > 1);
    last = entry.w;

    state = {
      word: entry.w, key: norm(entry.w), cat: entry.c,
      hints: entry.h.slice(0, settings.hints), hintsShown: 0,
      hits: [], misses: [], over: false, lost: false
    };

    // Categoria SEMPRE visível no topo (mostra a categoria real da palavra sorteada).
    el.tIco.textContent = entry.c.i;
    el.tName.textContent = entry.c.n;
    replay(el.topic, 'flash');

    clearTimeout(confettiTimer);
    el.confetti.innerHTML = '';
    el.kb.classList.remove('locked');
    el.kb.querySelectorAll('button').forEach(function (b) { b.className = ''; });
    say('Tema: ' + entry.c.n + '. Escolha uma letra.', 'warn');
    render();
  }

  /* ---------- DESENHAR A TELA ---------- */
  function render() {
    el.word.innerHTML = '';
    state.word.split('').forEach(function (ch, i) {
      var k = state.key[i], span = document.createElement('span');
      span.className = 'cell';
      if (!isLetter(k)) { span.className += ' gap'; span.textContent = ch; }
      else if (state.hits.indexOf(k) > -1) {
        span.textContent = ch;
        if (state.over && !state.lost) { span.className += ' win'; span.style.setProperty('--i', i); }
      } else if (state.lost) { span.className += ' reveal'; span.textContent = ch; }
      el.word.appendChild(span);
    });

    var all = state.hits.map(function (l) { return '<span class="hit">' + l + '</span>'; })
      .concat(state.misses.map(function (l) { return '<span class="miss">' + l + '</span>'; }));
    el.used.innerHTML = all.join(' ') || '<span style="color:var(--muted)">—</span>';

    el.counter.textContent = state.misses.length + ' / ' + MAX_ERRORS;
    el.parts.forEach(function (p, i) { p.classList.toggle('show', i < state.misses.length); });

    // Vidas (corações) na barra do topo
    el.lives.innerHTML = '';
    for (var h = 0; h < MAX_ERRORS; h++) {
      var heart = document.createElement('i');
      heart.textContent = '♥';
      if (h >= MAX_ERRORS - state.misses.length) heart.className = 'off';
      el.lives.appendChild(heart);
    }

    el.hintList.innerHTML = '';
    for (var n = 0; n < state.hintsShown; n++) {
      var li = document.createElement('li');
      li.textContent = state.hints[n];
      el.hintList.appendChild(li);
    }
    var left = state.hints.length - state.hintsShown;
    el.hintBtn.disabled = state.over || left === 0;
    el.hintBtn.textContent = state.hints.length === 0 ? 'Sem dicas nesta partida'
      : left === 0 ? 'Sem mais dicas' : 'Pedir dica (' + left + ')';

    el.stats.textContent = 'Vitórias ' + stats.wins + ' · Derrotas ' + stats.losses +
      ' · Sequência ' + stats.streak + ' · Recorde ' + stats.best;
  }

  /* ---------- VITÓRIA E DERROTA ---------- */
  function hasWon() {
    return state.key.split('').every(function (k) { return !isLetter(k) || state.hits.indexOf(k) > -1; });
  }

  function celebrate() {
    var colors = ['#7a2e2e', '#b08d57', '#1c1b19', '#c9a9a6', '#d9c7a0'];
    for (var n = 0; n < 80; n++) {
      var p = document.createElement('div');
      p.className = 'confetto';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
      p.style.animationDelay = (Math.random() * 0.8) + 's';
      p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
      p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      el.confetti.appendChild(p);
    }
    confettiTimer = setTimeout(function () { el.confetti.innerHTML = ''; }, 6000);
  }

  function finish(lost) {
    state.over = true; state.lost = lost;
    el.kb.classList.add('locked');
    if (lost) {
      stats.losses++; stats.streak = 0;
      say('Fim de jogo, ' + settings.name + '. A palavra era ' + state.word + '.', 'lose');
    } else {
      stats.wins++; stats.streak++; stats.best = Math.max(stats.best, stats.streak);
      say('Vitória, ' + settings.name + '! Você descobriu a palavra.', 'win');
      celebrate();
    }
  }

  /* ---------- TENTATIVA ---------- */
  function guess(raw) {
    if (!state || state.over) return;
    var c = norm(raw);
    if (raw.length !== 1 || !isLetter(c)) { say('Digite apenas letras de A a Z.', 'warn'); return; }
    if (state.hits.indexOf(c) > -1 || state.misses.indexOf(c) > -1) { say('A letra ' + c + ' já foi usada.', 'warn'); return; }

    var btn = el.kb.querySelector('[data-k="' + c + '"]');
    if (state.key.indexOf(c) > -1) {
      state.hits.push(c); btn.className = 'hit';
      say('A letra ' + c + ' está na palavra.', '');
    } else {
      state.misses.push(c); btn.className = 'miss';
      say('A letra ' + c + ' não está em ' + state.cat.n.toLowerCase() + '. Pense no tema!', '');
      replay(el.stage, 'shake'); // balança o boneco a cada erro
    }
    if (hasWon()) finish(false);
    else if (state.misses.length >= MAX_ERRORS) finish(true);
    render();
  }

  /* ---------- EVENTOS ---------- */
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (l) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = l; b.setAttribute('data-k', l);
    b.addEventListener('click', function () { guess(l); });
    el.kb.appendChild(b);
  });

  document.addEventListener('keydown', function (e) {
    if (!el.setup.hidden) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length !== 1 || e.key === ' ') return;
    guess(e.key);
  });

  el.hintBtn.addEventListener('click', function () {
    if (state.over || state.hintsShown >= state.hints.length) return;
    state.hintsShown++; render();
  });
  el.newBtn.addEventListener('click', newGame);

  /* ---------- CONFIGURAÇÃO ---------- */
  function mark(group, attr, value) {
    group.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.getAttribute(attr) === String(value)));
    });
  }

  // Monta o seletor de categorias (carrossel com scroll): "Surpresa" + uma carta por categoria.
  [{ id: 'all', n: 'Surpresa', i: '🎲', c: ALL.length }].concat(CATS.map(function (c) {
    return { id: c.id, n: c.n, i: c.i, c: c.w.length };
  })).forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('data-cat', c.id);
    b.innerHTML = '<span class="ci">' + c.i + '</span><b>' + c.n + '</b><small>' + c.c + ' palavras</small>';
    el.cats.appendChild(b);
  });
  el.cats.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    settings.cat = b.getAttribute('data-cat');
    refreshSetup();
    b.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });
  // Roda do mouse rola o carrossel na horizontal.
  el.cats.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.cats.scrollWidth > el.cats.clientWidth) {
      el.cats.scrollLeft += e.deltaY; e.preventDefault();
    }
  }, { passive: false });

  function refreshSetup() {
    mark(el.cats, 'data-cat', settings.cat);
    mark(el.levels, 'data-level', settings.level);
    mark(el.hintChoices, 'data-n', settings.hints);
    el.setupNote.textContent = LEVELS[settings.level].note;
    el.startBtn.disabled = el.name.value.trim() === '';
  }
  function openSetup() {
    el.name.value = settings.name;
    el.setup.hidden = false;
    refreshSetup();
    el.name.focus();
  }
  el.levels.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    settings.level = b.getAttribute('data-level');
    settings.hints = LEVELS[settings.level].hints;
    refreshSetup();
  });
  el.hintChoices.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    settings.hints = Number(b.getAttribute('data-n'));
    refreshSetup();
  });
  el.name.addEventListener('input', refreshSetup);

  function start() {
    var n = el.name.value.trim();
    if (!n) { el.name.focus(); return; }
    settings.name = n;
    el.setup.hidden = true;
    el.player.textContent = n + ' · ' + LEVELS[settings.level].label;
    newGame();
  }
  el.startBtn.addEventListener('click', start);
  el.name.addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });
  el.changeBtn.addEventListener('click', openSetup);

  openSetup();
})();
