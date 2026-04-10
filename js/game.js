/**
 * Controlador Principal del Juego - Stickman Fight
 * Coordina todos los sistemas: física, renderizado, lógica y UI
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Configurar canvas
        this.canvas.width = 800;
        this.canvas.height = 400;

        // Instanciar sistemas
        this.physics = new Physics();
        this.collisionDetector = CollisionDetector;

        // Crear personajes
        this.player = new Stickman(200, 300, true);
        this.ai = new Stickman(600, 300, false);
        this.aiController = new AIController(this.ai);

        // Estado del juego
        this.gameRunning = true;
        this.gameOverMessage = '';
        this.frameCount = 0;
        this.lastHitData = null;

        // Input
        this.keys = {};
        this.setupControls();

        // UI
        this.updateUI();

        // Loop del juego
        this.gameLoop();
    }

    /**
     * Configura el sistema de entrada
     */
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    /**
     * Loop principal del juego
     */
    gameLoop = () => {
        this.update();
        this.render();
        requestAnimationFrame(this.gameLoop);
    };

    /**
     * Actualiza lógica del juego
     */
    update() {
        if (!this.gameRunning) return;

        this.frameCount++;

        // Entrada del jugador
        this.player.handleInput(this.keys);

        // Actualizar física
        this.physics.applyGravity(this.player);
        this.physics.applyGravity(this.ai);
        this.physics.applyFriction(this.player);
        this.physics.applyFriction(this.ai);

        // Actualizar posiciones
        this.physics.updatePosition(this.player, this.canvas);
        this.physics.updatePosition(this.ai, this.canvas);

        // Actualizar IA
        this.aiController.update(this.player, this.canvas);

        // Actualizar personajes
        this.player.update(this.canvas);
        this.ai.update(this.canvas);

        // Detectar colisiones de ataque
        this.checkCombat();

        // Verificar fin del juego
        this.checkGameOver();

        // Actualizar UI
        if (this.frameCount % 5 === 0) {
            this.updateUI();
        }
    }

    /**
     * Detecta colisiones de combate
     */
    checkCombat() {
        // Ataque del jugador
        const playerAttackArea = this.player.getAttackArea();
        if (playerAttackArea && this.collisionDetector.checkAttackHit(playerAttackArea, this.ai)) {
            if (this.ai.hitCooldown <= 0) {
                const damage = playerAttackArea.damage;
                this.ai.takeDamage(damage);
                this.player.damageDealt += damage;
                this.player.attacksHit++;

                // Knockback
                const kb = this.collisionDetector.getKnockbackVector(
                    this.player,
                    this.ai,
                    playerAttackArea.knockback
                );
                this.physics.applyKnockback(this.ai, kb.x, kb.y);

                this.lastHitData = {
                    type: playerAttackArea.type,
                    damage: damage,
                    combo: this.player.comboCounter
                };
            }
        }

        // Ataque de la IA
        const aiAttackArea = this.ai.getAttackArea();
        if (aiAttackArea && this.collisionDetector.checkAttackHit(aiAttackArea, this.player)) {
            if (this.player.hitCooldown <= 0) {
                const damage = aiAttackArea.damage;
                this.player.takeDamage(damage);
                this.ai.damageDealt += damage;
                this.ai.attacksHit++;

                // Knockback
                const kb = this.collisionDetector.getKnockbackVector(
                    this.ai,
                    this.player,
                    aiAttackArea.knockback
                );
                this.physics.applyKnockback(this.player, kb.x, kb.y);
            }
        }
    }

    /**
     * Verifica si la partida ha terminado
     */
    checkGameOver() {
        if (this.player.health <= 0) {
            this.gameRunning = false;
            this.gameOverMessage = '¡GAME OVER! La IA Ganó 🤖';
        } else if (this.ai.health <= 0) {
            this.gameRunning = false;
            this.gameOverMessage = '¡VICTORIA! ¡Ganaste! 🎉';
        }

        if (!this.gameRunning) {
            const statusEl = document.getElementById('gameStatus');
            statusEl.textContent = this.gameOverMessage + ' [Recarga la página para jugar de nuevo]';
            statusEl.classList.add('game-over');
        }
    }

    /**
     * Renderiza el juego
     */
    render() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar línea del piso
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 30);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - 30);
        this.ctx.stroke();

        // Dibujar personajes
        this.player.draw(this.ctx);
        this.ai.draw(this.ctx);

        // Dibujar áreas de ataque (debug mode)
        if (false) {
            this.drawAttackAreas();
        }
    }

    /**
     * Dibuja áreas de ataque (para debugging)
     */
    drawAttackAreas() {
        const playerAttack = this.player.getAttackArea();
        const aiAttack = this.ai.getAttackArea();

        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.lineWidth = 2;

        if (playerAttack) {
            this.ctx.strokeRect(
                playerAttack.x - playerAttack.width / 2,
                playerAttack.y - playerAttack.height / 2,
                playerAttack.width,
                playerAttack.height
            );
        }

        if (aiAttack) {
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            this.ctx.strokeRect(
                aiAttack.x - aiAttack.width / 2,
                aiAttack.y - aiAttack.height / 2,
                aiAttack.width,
                aiAttack.height
            );
        }
    }

    /**
     * Actualiza la interfaz de usuario
     */
    updateUI() {
        // Barra de vida del jugador
        const playerHealthPercent = this.player.getHealthPercent();
        const playerHealthBar = document.querySelector('.player-health');
        playerHealthBar.style.width = playerHealthPercent + '%';
        playerHealthBar.textContent = Math.ceil(this.player.health) + ' HP';

        // Barra de vida de la IA
        const aiHealthPercent = this.ai.getHealthPercent();
        const aiHealthBar = document.querySelector('.ai-health');
        aiHealthBar.style.width = aiHealthPercent + '%';
        aiHealthBar.textContent = Math.ceil(this.ai.health) + ' HP';
    }
}

// Iniciar juego cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});