/**
 * CthulhuTracker — Módulo de Iniciativa
 * Gerencia personagens e rolagem de dados.
 */

var Initiative = (function() {
    var newChars = [];
    var existingChars = [];

    // ========== NOVA INICIATIVA ==========

    function renderNewList() {
        var container = document.getElementById('char-list-new');
        var emptyMsg = document.getElementById('no-chars-new');
        var startBtn = document.getElementById('btn-start-combat-new');

        container.innerHTML = '';

        if (newChars.length === 0) {
            emptyMsg.style.display = 'block';
            startBtn.disabled = true;
            return;
        }

        emptyMsg.style.display = 'none';
        startBtn.disabled = newChars.length < 2;

        newChars.forEach(function(char, index) {
            var div = document.createElement('div');
            div.className = 'char-entry';
            div.innerHTML =
                '<div class="form-group">' +
                    '<label>Nome</label>' +
                    '<input type="text" data-index="' + index + '" data-field="name" value="' + escapeHtml(char.name) + '" placeholder="Nome do personagem">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>DES</label>' +
                    '<input type="number" data-index="' + index + '" data-field="dex" value="' + (char.dex || '') + '" min="1" max="999" placeholder="DES">' +
                '</div>' +
                '<div class="char-modifier-group">' +
                    '<label>Modificador</label>' +
                    '<select data-index="' + index + '" data-field="modifier">' +
                        '<option value="normal"' + (char.modifier === 'normal' ? ' selected' : '') + '>Normal</option>' +
                        '<option value="advantage"' + (char.modifier === 'advantage' ? ' selected' : '') + '>Vantagem</option>' +
                        '<option value="disadvantage"' + (char.modifier === 'disadvantage' ? ' selected' : '') + '>Desvantagem</option>' +
                    '</select>' +
                '</div>' +
                '<button class="btn-remove-char" data-index="' + index + '">✕</button>';
            container.appendChild(div);
        });

        bindNewListEvents(container);
    }

    function bindNewListEvents(container) {
        container.querySelectorAll('input, select').forEach(function(el) {
            el.addEventListener('input', function() {
                var idx = parseInt(this.dataset.index);
                var field = this.dataset.field;
                if (field === 'name') newChars[idx].name = this.value;
                else if (field === 'dex') newChars[idx].dex = parseInt(this.value) || 0;
                else if (field === 'modifier') newChars[idx].modifier = this.value;
            });
            el.addEventListener('change', function() {
                var idx = parseInt(this.dataset.index);
                var field = this.dataset.field;
                if (field === 'modifier') newChars[idx].modifier = this.value;
            });
        });

        container.querySelectorAll('.btn-remove-char').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.dataset.index);
                newChars.splice(idx, 1);
                renderNewList();
            });
        });
    }

    function addNewChar() {
        newChars.push({ name: '', dex: 0, modifier: 'normal' });
        renderNewList();
        // Focar no último campo de nome
        var inputs = document.querySelectorAll('#char-list-new input[data-field="name"]');
        if (inputs.length > 0) inputs[inputs.length - 1].focus();
    }

    // ========== INICIATIVA EXISTENTE ==========

    function renderExistingList() {
        var container = document.getElementById('char-list-existing');
        var emptyMsg = document.getElementById('no-chars-existing');
        var startBtn = document.getElementById('btn-start-combat-existing');

        container.innerHTML = '';

        if (existingChars.length === 0) {
            emptyMsg.style.display = 'block';
            startBtn.disabled = true;
            return;
        }

        emptyMsg.style.display = 'none';
        startBtn.disabled = existingChars.length < 2;

        existingChars.forEach(function(char, index) {
            var div = document.createElement('div');
            div.className = 'char-entry';
            div.innerHTML =
                '<div class="form-group">' +
                    '<label>Nome</label>' +
                    '<input type="text" data-index="' + index + '" data-field="name" value="' + escapeHtml(char.name) + '" placeholder="Nome do personagem">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>Posição</label>' +
                    '<input type="number" data-index="' + index + '" data-field="position" value="' + (char.position || '') + '" min="1" max="99" placeholder="#">' +
                '</div>' +
                '<button class="btn-remove-char" data-index="' + index + '">✕</button>';
            container.appendChild(div);
        });

        bindExistingListEvents(container);
    }

    function bindExistingListEvents(container) {
        container.querySelectorAll('input').forEach(function(el) {
            el.addEventListener('input', function() {
                var idx = parseInt(this.dataset.index);
                var field = this.dataset.field;
                if (field === 'name') existingChars[idx].name = this.value;
                else if (field === 'position') existingChars[idx].position = parseInt(this.value) || 0;
            });
        });

        container.querySelectorAll('.btn-remove-char').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.dataset.index);
                existingChars.splice(idx, 1);
                renderExistingList();
            });
        });
    }

    function addExistingChar() {
        existingChars.push({ name: '', position: existingChars.length + 1 });
        renderExistingList();
        var inputs = document.querySelectorAll('#char-list-existing input[data-field="name"]');
        if (inputs.length > 0) inputs[inputs.length - 1].focus();
    }

    // ========== ROLAGEM DE DADOS ==========

    /**
     * Rola um d100 (1-100).
     */
    function rollD100() {
        return Math.floor(Math.random() * 100) + 1;
    }

    /**
     * Determina o nível de sucesso de uma rolagem.
     * Retorna: { level: number, label: string }
     * level: 5=Crítico, 4=Extremo, 3=Bom, 2=Normal, 1=Fracasso, 0=FalhaCrítica
     */
    function getSuccessLevel(roll, skill) {
        // Falha Crítica
        if (roll === 100) {
            return { level: 0, label: 'Falha Crítica' };
        }
        // Sucesso Crítico
        if (roll === 1) {
            return { level: 5, label: 'Crítico' };
        }
        // Extremo: ≤ 1/5
        var fifth = Math.floor(skill / 5);
        if (roll <= fifth) {
            return { level: 4, label: 'Extremo' };
        }
        // Bom: ≤ 1/2
        var half = Math.floor(skill / 2);
        if (roll <= half) {
            return { level: 3, label: 'Bom' };
        }
        // Normal: ≤ skill
        if (roll <= skill) {
            return { level: 2, label: 'Normal' };
        }
        // Fracasso
        return { level: 1, label: 'Fracasso' };
    }

    /**
     * Processa a rolagem de iniciativa para todos os personagens.
     * Retorna array ordenado de resultados.
     */
    function rollInitiative() {
        var results = [];

        newChars.forEach(function(char) {
            if (!char.name.trim()) return;

            var roll1 = rollD100();
            var roll2 = rollD100();
            var finalRoll;
            var allRolls;
            var dex = char.dex || 0;

            if (char.modifier === 'advantage') {
                // Menor é melhor
                finalRoll = Math.min(roll1, roll2);
                allRolls = [roll1, roll2];
            } else if (char.modifier === 'disadvantage') {
                // Maior é pior
                finalRoll = Math.max(roll1, roll2);
                allRolls = [roll1, roll2];
            } else {
                finalRoll = roll1;
                allRolls = [roll1];
            }

            var success = getSuccessLevel(finalRoll, dex);

            results.push({
                name: char.name.trim(),
                dex: dex,
                roll: finalRoll,
                allRolls: allRolls,
                modifier: char.modifier,
                successLevel: success.level,
                successLabel: success.label
            });
        });

        // Ordenar: maior nível de sucesso primeiro; empate: maior DES primeiro
        results.sort(function(a, b) {
            if (b.successLevel !== a.successLevel) {
                return b.successLevel - a.successLevel;
            }
            return b.dex - a.dex;
        });

        return results;
    }

    /**
     * Gera a lista de combate a partir da Iniciativa Existente.
     * Ordena por posição.
     */
    function getExistingOrder() {
        var order = [];
        existingChars.forEach(function(char) {
            if (!char.name.trim()) return;
            order.push({
                name: char.name.trim(),
                position: char.position || 999,
                successLevel: -1,
                successLabel: ''
            });
        });

        order.sort(function(a, b) {
            return a.position - b.position;
        });

        return order;
    }

    function resetNew() {
        newChars = [];
        renderNewList();
    }

    function resetExisting() {
        existingChars = [];
        renderExistingList();
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    return {
        renderNewList: renderNewList,
        addNewChar: addNewChar,
        renderExistingList: renderExistingList,
        addExistingChar: addExistingChar,
        rollInitiative: rollInitiative,
        getExistingOrder: getExistingOrder,
        resetNew: resetNew,
        resetExisting: resetExisting
    };
})();
