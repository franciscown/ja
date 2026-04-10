/**
 * Sistema de IA para el oponente
 * Implementa comportamiento inteligente y decisiones dinámicas
 */

class AIController {
    constructor(stickman) {
        this.stickman = stickman;
        this.state = 'idle'; // idle, chase, attack, runaway
        this.stateTimer = 0;
        this.stateChangeInterval = 60; // frames
        this.actionQueue = [];
    }

    /**
     * Actualiza el comportamiento de la IA
     */
    update(player, canvas) {
        const distance = Math.abs(player.x - this.stickman.x);
        const healthPercent = this.stickman.getHealthPercent();

        // Cambiar estado según situación
        this.stateTimer--;
        if (this.stateTimer <= 0) {
            this.updateState(player, distance, healthPercent);
            this.stateTimer = this.stateChangeInterval;
        }

        // Ejecutar acciones según estado
        this.executeState(player, distance, canvas);
    }

    /**
     * Determina el siguiente estado de la IA
     */
    updateState(player, distance, healthPercent) {
        if (healthPercent < 30) {
            this.state = 'runaway';
        } else if (distance < 80) {
            this.state = 'attack';
        } else if (distance < 200) {
            this.state = 'chase';
        } else {
            this.state = 'idle';
        }
    }

    /**
     * Ejecuta las acciones según el estado actual
     */
    executeState(player, distance, canvas) {
        switch (this.state) {
            case 'idle':
                this.doIdle();
                break;
            case 'chase':
                this.doChase(player);
                break;
            case 'attack':
                this.doAttack(player, distance);
                break;
            case 'runaway':
                this.doRunaway(player, canvas);
                break;
        }
    }

    /**
     * Estado: Inactivo
     */
    doIdle() {
        // Mantener velocidad baja
        this.stickman.velocityX *= 0.9;
    }

    /**
     * Estado: Perseguir al jugador
     */
    doChase(player) {
        const direction = player.x > this.stickman.x ? 1 : -1;
        this.stickman.velocityX = direction * this.stickman.moveSpeed;
        this.stickman.direction = direction;

        // Ocasionalmente saltar para esquivar
        if (Math.random() < 0.02 && this.stickman.isGrounded) {
            this.stickman.velocityY = this.stickman.jumpPower;
        }
    }

    /**
     * Estado: Atacar al jugador
     */
    doAttack(player, distance) {
        // Mantener distancia óptima
        if (distance > 50) {
            const direction = player.x > this.stickman.x ? 1 : -1;
            this.stickman.velocityX = direction * (this.stickman.moveSpeed * 0.7);
        } else {
            this.stickman.velocityX = 0;
        }

        // Atacar con probabilidad
        const attackChance = this.stickman.comboCounter < 2 ? 0.08 : 0.04;
        if (Math.random() < attackChance) {
            const attackType = Math.random() < 0.6 ? 'punch' : 'kick';
            this.stickman.attack(attackType);
        }

        // Saltar ocasionalmente para esquivar
        if (Math.random() < 0.03 && this.stickman.isGrounded) {
            this.stickman.velocityY = this.stickman.jumpPower;
        }

        // Girar para estar orientado al jugador
        if (player.x > this.stickman.x) {
            this.stickman.direction = 1;
        } else {
            this.stickman.direction = -1;
        }
    }

    /**
     * Estado: Huir cuando está en peligro
     */
    doRunaway(player, canvas) {
        const direction = player.x > this.stickman.x ? -1 : 1;
        this.stickman.velocityX = direction * this.stickman.moveSpeed;
        this.stickman.direction = direction;

        // Saltar más frecuentemente
        if (Math.random() < 0.05 && this.stickman.isGrounded) {
            this.stickman.velocityY = this.stickman.jumpPower;
        }

        // Contraatacar ocasionalmente cuando se siente seguro
        if (Math.random() < 0.01) {
            this.stickman.attack('punch');
        }
    }

    /**
     * Reinicia la IA
     */
    reset() {
        this.state = 'idle';
        this.stateTimer = 0;
        this.actionQueue = [];
    }
}