/**
 * CthulhuTracker — Módulo de Instruções
 */

var Instructions = (function() {
    var SEEN_KEY = 'cthulhutracker_instructions_seen';
    var currentPage = 0;
    var pages = [];

    function buildPages() {
        pages = [
            {
                title: 'Bem-vindo ao CthulhuTracker!',
                content:
                    '<p>Este é o seu <strong>rastreador de iniciativa</strong> para ' +
                    '<strong>Chamado de Cthulhu 7ª Edição</strong>.</p>' +
                    '<p>Com ele você pode gerenciar a ordem de combate dos seus investigadores e ' +
                    'NPCs de forma rápida e organizada, com rolagem automática de dados seguindo ' +
                    'todas as regras do sistema.</p>' +
                    '<div class="highlight-box">' +
                    'Você pode escolher entre <strong>Nova Iniciativa</strong> (com rolagem automática) ' +
                    'ou <strong>Iniciativa Existente</strong> (inserindo a ordem manualmente).' +
                    '</div>'
            },
            {
                title: 'Como Funciona o Sistema de Sucessos',
                content:
                    '<p>No Chamado de Cthulhu 7ed, as rolagens são feitas com um <strong>dado de 100 lados (d100)</strong>. ' +
                    'O resultado é comparado com o valor da perícia ou atributo do personagem:</p>' +
                    '<h3>Níveis de Sucesso</h3>' +
                    '<div class="highlight-box">' +
                    '<strong>Sucesso Normal:</strong> Resultado ≤ valor da perícia/atributo<br>' +
                    '<strong>Sucesso Bom:</strong> Resultado ≤ metade da perícia/atributo<br>' +
                    '<strong>Sucesso Extremo:</strong> Resultado ≤ um quinto da perícia/atributo<br>' +
                    '<strong>Sucesso Crítico:</strong> Resultado = 1 (sempre sucesso)<br>' +
                    '<strong>Falha Crítica:</strong> Resultado = 100 (sempre falha)' +
                    '</div>' +
                    '<h3>Hierarquia</h3>' +
                    '<p><strong>Crítico</strong> > <strong>Extremo</strong> > <strong>Bom</strong> > ' +
                    '<strong>Normal</strong> > <strong>Fracasso</strong></p>' +
                    '<p>Em caso de <strong>empate</strong> no nível de sucesso, o personagem com a ' +
                    'perícia/atributo mais alta vence. A <strong>Falha Crítica</strong> (100) só pode ' +
                    'ser superada por um <strong>Sucesso Crítico</strong> (1).</p>'
            },
            {
                title: 'Vantagem e Desvantagem',
                content:
                    '<h3>Vantagem</h3>' +
                    '<p>Quando um personagem possui <strong>Vantagem</strong>, ele rola <strong>dois dados</strong> ' +
                    'e utiliza o <strong>melhor resultado</strong> (o menor valor, já que valores baixos são melhores).</p>' +
                    '<h3>Desvantagem</h3>' +
                    '<p>Quando um personagem possui <strong>Desvantagem</strong>, ele rola <strong>dois dados</strong> ' +
                    'e utiliza o <strong>pior resultado</strong> (o maior valor).</p>' +
                    '<div class="highlight-box gold">' +
                    '<strong>Nota:</strong> No modo "Nova Iniciativa", você pode marcar Vantagem ou Desvantagem ' +
                    'para cada personagem antes de rolar. O sistema fará os cálculos automaticamente.' +
                    '</div>'
            },
            {
                title: 'Usando o CthulhuTracker',
                content:
                    '<h3>🎲 Nova Iniciativa</h3>' +
                    '<p>Adicione os personagens com seus nomes e valores de <strong>DES (Destreza)</strong>. ' +
                    'Marque Vantagem ou Desvantagem se aplicável. Clique em <strong>"Rolar Iniciativa"</strong> ' +
                    'e o sistema rolará os dados, determinará os níveis de sucesso e organizará a ordem automaticamente.</p>' +
                    '<h3>📋 Iniciativa Existente</h3>' +
                    '<p>Adicione os personagens com seus nomes e suas posições na iniciativa já definida. ' +
                    'Clique em <strong>"Iniciar Combate"</strong> para gerenciar as rodadas.</p>' +
                    '<h3>⚔️ Tela de Combate</h3>' +
                    '<div class="highlight-box">' +
                    '<strong>Próximo Personagem:</strong> Avança para o próximo na ordem<br>' +
                    '<strong>↑ ↓ Mover:</strong> Reorganiza a posição de um personagem<br>' +
                    '<strong>Rodadas:</strong> O contador avança automaticamente quando todos agiram<br>' +
                    '<strong>Finalizar Combate:</strong> Encerra e reinicia o rastreador' +
                    '</div>' +
                    '<p><em>Boa sessão, Guardião. Que seus investigadores sobrevivam... por enquanto.</em></p>'
            }
        ];
    }

    function open() {
        buildPages();
        currentPage = 0;
        renderCurrentPage();
        document.getElementById('instructions-overlay').classList.add('active');
    }

    function close() {
        document.getElementById('instructions-overlay').classList.remove('active');
    }

    function renderCurrentPage() {
        var page = pages[currentPage];
        document.getElementById('modal-title').textContent = page.title;
        document.getElementById('modal-body').innerHTML = page.content;
        document.getElementById('modal-body').scrollTop = 0;

        var dotsContainer = document.getElementById('modal-dots');
        dotsContainer.innerHTML = '';
        for (var i = 0; i < pages.length; i++) {
            var dot = document.createElement('span');
            dot.className = 'modal-dot' + (i === currentPage ? ' active' : '');
            dot.dataset.page = i;
            dot.addEventListener('click', function() {
                currentPage = parseInt(this.dataset.page);
                renderCurrentPage();
            });
            dotsContainer.appendChild(dot);
        }

        var prevBtn = document.getElementById('modal-prev');
        var nextBtn = document.getElementById('modal-next');
        prevBtn.style.display = currentPage === 0 ? 'none' : 'inline-flex';
        nextBtn.textContent = currentPage === pages.length - 1 ? 'Concluir ✓' : 'Próximo →';
    }

    function nextPage() {
        if (currentPage < pages.length - 1) {
            currentPage++;
            renderCurrentPage();
        } else {
            close();
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage--;
            renderCurrentPage();
        }
    }

    function showIfFirstTime() {
        if (localStorage.getItem(SEEN_KEY) !== 'true') {
            localStorage.setItem(SEEN_KEY, 'true');
            setTimeout(function() { open(); }, 400);
        }
    }

    function init() {
        document.getElementById('modal-close').addEventListener('click', close);
        document.getElementById('modal-next').addEventListener('click', nextPage);
        document.getElementById('modal-prev').addEventListener('click', prevPage);

        document.getElementById('instructions-overlay').addEventListener('click', function(e) {
            if (e.target === this) close();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                var overlay = document.getElementById('instructions-overlay');
                if (overlay.classList.contains('active')) close();
            }
        });

        // Todos os botões de instrução
        document.getElementById('btn-instructions-home').addEventListener('click', open);
        document.querySelectorAll('.btn-instructions-top').forEach(function(btn) {
            btn.addEventListener('click', open);
        });
    }

    return { init: init, open: open, showIfFirstTime: showIfFirstTime };
})();
