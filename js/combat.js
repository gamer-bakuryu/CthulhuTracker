/**
 * CthulhuTracker — Módulo de Combate
 * Gerencia rodadas, turnos e ordem de iniciativa durante o combate.
 */

var Combat = (function() {
    var order = [];          // Lista ordenada de combatentes
    var currentTurn = 0;     // Índice do combatente atual
    var round = 1;           // Rodada atual
    var mode = 'new';        // 'new' ou 'existing'
    var rollResults = null;  // Resultados da rolagem (só para 'new')

    /**
     * Inicia o combate.
     * @param {Array} combatOrder - Lista ordenada de combatentes
     * @param {string} combatMode - 'new' ou 'existing'
     * @param {Array|null} results - Resultados da rolagem (para 'new')
     */
    function start(combatOrder, combatMode, results) {
        order = combatOrder;
        mode = combatMode;
        rollResults = results || null;
        currentTurn = 0;
        round = 1;

        renderCombat();
        App.showScreen('combat');
    }

    /**
     * Renderiza toda a tela de combate.
     */
    function renderCombat() {
        // Badge de modo
        var badge = document.getElementById('combat-mode-badge');
        if (mode === 'new') {
            badge.textContent = 'Nova Iniciativa';
            badge.className = 'mode-badge new-badge';
        } else {
            badge.textContent = 'Iniciativa Existente';
            badge.className = 'mode-badge existing-badge';
        }

        // Rodada
        document.getElementById('round-number').textContent = round;

        // Turno atual
        if (order.length > 0) {
            document.getElementById('current-turn-name').textContent = order[currentTurn].name;
        } else {
            document.getElementById('current-turn-name').textContent = '—';
        }

        // Resultados de rolagem
        var rollSection = document.getElementById('roll-results-section');
        if (mode === 'new' && rollResults && rollResults.length > 0) {
            rollSection.style.display = 'block';
            renderRollResults();
        } else {
            rollSection.style.display = 'none';
        }

        // Ordem de combate
        renderOrderList();
    }

    /**
     * Renderiza os resultados da rolagem de dados.
     */
    function renderRollResults() {
        var container = document.getElementById('roll-results-list');
        container.innerHTML = '';

        rollResults.forEach(function(r) {
            var badgeClass = getBadgeClass(r.successLevel);
            var modText = '';
            if (r.modifier === 'advantage') modText = ' [Vantagem]';
            else if (r.modifier === 'disadvantage') modText = ' [Desvantagem]';

            var diceText = r.allRolls.length > 1
                ? 'Dados: ' + r.allRolls.join(', ') + ' → Usado: ' + r.roll
                : 'Dado: ' + r.roll;

            var div = document.createElement('div');
            div.className = 'roll-result-entry';
            div.innerHTML =
                '<span class="roll-name">' + escapeHtml(r.name) + '</span>' +
                '<span class="roll-detail">DES: ' + r.dex + modText + '</span>' +
                '<span class="roll-dice-values">' + diceText + '</span>' +
                '<span class="roll-result-badge ' + badgeClass + '">' + r.successLabel + '</span>';
            container.appendChild(div);
        });
    }

    /**
     * Renderiza a lista de ordem de combate.
     */
    function renderOrderList() {
        var container = document.getElementById('combat-order-list');
        container.innerHTML = '';

        order.forEach(function(char, index) {
            var isActive = index === currentTurn;
            var hasActed = index < currentTurn;
            var classes = 'combat-entry';
            if (isActive) classes += ' active-turn';
            if (hasActed) classes += ' acted';

            var badgeHtml = '';
            if (char.successLabel && mode === 'new') {
                var badgeClass = getBadgeClass(char.successLevel);
                badgeHtml = '<span class="combat-result-badge ' + badgeClass + '">' + char.successLabel + '</span>';
            }

            var div = document.createElement('div');
            div.className = classes;
            div.innerHTML =
                '<span class="combat-position">' + (index + 1) + '</span>' +
                '<span class="combat-name">' + escapeHtml(char.name) + '</span>' +
                badgeHtml +
                '<div class="combat-move-btns">' +
                    '<button class="btn-move-up" data-index="' + index + '" title="Subir">▲</button>' +
                    '<button class="btn-move-down" data-index="' + index + '" title="Descer">▼</button>' +
                '</div>';
            container.appendChild(div);
        });

        // Bind dos botões de mover
        container.querySelectorAll('.btn-move-up').forEach(function(btn) {
            btn.addEventListener('click', function() {
                moveChar(parseInt(this.dataset.index), -1);
            });
        });

        container.querySelectorAll('.btn-move-down').forEach(function(btn) {
            btn.addEventListener('click', function() {
                moveChar(parseInt(this.dataset.index), 1);
            });
        });
    }

    /**
     * Avança para o próximo personagem.
     */
    function nextTurn() {
        if (order.length === 0) return;

        currentTurn++;

        // Se passou do último, nova rodada
        if (currentTurn >= order.length) {
            currentTurn = 0;
            round++;
        }

        renderCombat();
    }

    /**
     * Move um personagem na ordem.
     * @param {number} index - Índice atual
     * @param {number} direction - -1 para subir, +1 para descer
     */
    function moveChar(index, direction) {
        var newIndex = index + direction;
        if (newIndex < 0 || newIndex >= order.length) return;

        // Trocar posições
        var temp = order[index];
        order[index] = order[newIndex];
        order[newIndex] = temp;

        // Ajustar currentTurn se necessário
        if (currentTurn === index) {
            currentTurn = newIndex;
        } else if (currentTurn === newIndex) {
            currentTurn = index;
        }

        renderCombat();
    }

    /**
     * Finaliza o combate e reseta tudo.
     */
    function endCombat() {
        order = [];
        currentTurn = 0;
        round = 1;
        rollResults = null;
        mode = 'new';

        Initiative.resetNew();
        Initiative.resetExisting();
        App.showScreen('home');
    }

    /**
     * Retorna a classe CSS do badge de sucesso.
     */
    function getBadgeClass(level) {
        switch (level) {
            case 5: return 'badge-critical-success';
            case 4: return 'badge-extreme';
            case 3: return 'badge-hard';
            case 2: return 'badge-normal';
            case 1: return 'badge-fail';
            case 0: return 'badge-critical-fail';
            default: return '';
        }
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    return {
        start: start,
        nextTurn: nextTurn,
        endCombat: endCombat,
        renderCombat: renderCombat
    };
})();
