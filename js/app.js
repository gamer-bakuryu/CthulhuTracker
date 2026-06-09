/**
 * CthulhuTracker — Módulo Principal da Aplicação
 */

var App = (function() {
    var screens = {
        home: 'screen-home',
        'new-init': 'screen-new-init',
        'existing-init': 'screen-existing-init',
        combat: 'screen-combat'
    };

    function showScreen(name) {
        Object.keys(screens).forEach(function(key) {
            document.getElementById(screens[key]).classList.remove('active');
        });
        document.getElementById(screens[name]).classList.add('active');
        window.scrollTo(0, 0);
    }

    function openConfirmModal() {
        document.getElementById('confirm-overlay').classList.add('active');
    }

    function closeConfirmModal() {
        document.getElementById('confirm-overlay').classList.remove('active');
    }

    function openSupportModal() {
        document.getElementById('support-overlay').classList.add('active');
    }

    function closeSupportModal() {
        document.getElementById('support-overlay').classList.remove('active');
    }

    function init() {
        // ===== Navegação Home =====
        document.getElementById('btn-new-initiative').addEventListener('click', function() {
            showScreen('new-init');
        });

        document.getElementById('btn-existing-initiative').addEventListener('click', function() {
            showScreen('existing-init');
        });

        // ===== Botões Voltar =====
        document.querySelectorAll('.btn-back').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var target = this.dataset.target;
                if (target === 'home') showScreen('home');
            });
        });

        // ===== Nova Iniciativa =====
        document.getElementById('btn-add-char-new').addEventListener('click', function() {
            Initiative.addNewChar();
        });

        document.getElementById('btn-start-combat-new').addEventListener('click', function() {
            var results = Initiative.rollInitiative();
            if (results.length < 2) {
                alert('Adicione pelo menos 2 personagens com nome e DES preenchidos.');
                return;
            }

            var combatOrder = results.map(function(r) {
                return {
                    name: r.name,
                    dex: r.dex,
                    successLevel: r.successLevel,
                    successLabel: r.successLabel,
                    roll: r.roll
                };
            });

            Combat.start(combatOrder, 'new', results);
        });

        // ===== Iniciativa Existente =====
        document.getElementById('btn-add-char-existing').addEventListener('click', function() {
            Initiative.addExistingChar();
        });

        document.getElementById('btn-start-combat-existing').addEventListener('click', function() {
            var order = Initiative.getExistingOrder();
            if (order.length < 2) {
                alert('Adicione pelo menos 2 personagens com nome preenchido.');
                return;
            }

            var combatOrder = order.map(function(o) {
                return {
                    name: o.name,
                    successLevel: o.successLevel,
                    successLabel: o.successLabel
                };
            });

            Combat.start(combatOrder, 'existing', null);
        });

        // ===== Combate =====
        document.getElementById('btn-next-turn').addEventListener('click', function() {
            Combat.nextTurn();
        });

        // Finalizar Combate — abre confirmação
        document.getElementById('btn-end-combat').addEventListener('click', function() {
            openConfirmModal();
        });

        // Confirmar finalização
        document.getElementById('confirm-end').addEventListener('click', function() {
            closeConfirmModal();
            Combat.endCombat();
        });

        document.getElementById('confirm-cancel').addEventListener('click', function() {
            closeConfirmModal();
        });

        document.getElementById('confirm-close').addEventListener('click', function() {
            closeConfirmModal();
        });

        document.getElementById('confirm-overlay').addEventListener('click', function(e) {
            if (e.target === this) closeConfirmModal();
        });

        // ===== Apoio / Pix =====
        document.getElementById('btn-support-home').addEventListener('click', function() {
            openSupportModal();
        });

        document.querySelectorAll('.btn-support-top').forEach(function(btn) {
            btn.addEventListener('click', function() {
                openSupportModal();
            });
        });

        document.getElementById('support-close').addEventListener('click', function() {
            closeSupportModal();
        });

        document.getElementById('support-overlay').addEventListener('click', function(e) {
            if (e.target === this) closeSupportModal();
        });

        // ===== ESC fecha modais =====
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                var confirmOverlay = document.getElementById('confirm-overlay');
                if (confirmOverlay.classList.contains('active')) {
                    closeConfirmModal();
                    return;
                }
                var supportOverlay = document.getElementById('support-overlay');
                if (supportOverlay.classList.contains('active')) {
                    closeSupportModal();
                    return;
                }
            }
        });

        // ===== Instruções =====
        Instructions.init();
        Instructions.showIfFirstTime();

        // ===== Renderizar listas vazias =====
        Initiative.renderNewList();
        Initiative.renderExistingList();
    }

    document.addEventListener('DOMContentLoaded', init);

    return { showScreen: showScreen };
})();
