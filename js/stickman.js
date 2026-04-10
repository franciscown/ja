/**
 * Clase Stickman - Define la estructura y comportamiento de un personaje
 */

class Stickman {
    constructor(x, y, isPlayer = true) {
        // Posición
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 80;

        // Movimiento
        this.velocityX = 0;
        this.velocityY = 0;
        this.isGrounded = false;
        this.moveSpeed = 4;
        this.jumpPower = -12;

        // Estado
        this.health = 100;
        this.maxHealth = 100;
        this.isPlayer = isPlayer;
        this.direction = 1; // 1 = derecha, -1 = izquierda
        this.isHit = false;
        this.hitCooldown = 0;
        this.color = isPlayer ? '#FF6B6B' : '#4ECDC4';

        // Combate
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackType = null; // 'punch', 'kick'
        this.comboCounter = 0;
        this.lastAttackTime = 0;
        this.comboCooldown = 500; // ms

        // Estadísticas
        this.damageDealt = 0;
        this.attacksHit = 0;
    }

    /**
     * Dibuja el stickman en el canvas
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Aplicar efecto de daño (parpadeo)
        if (this.isHit && this.hitCooldown % 10 < 5) {
            ctx.globalAlpha = 0.5;
        }

        // Color del stickman
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 2;

        // Cabeza
        ctx.beginPath();
        ctx.arc(0, -30, 8, 0, Math.PI * 2);
        ctx.fill();

        // Cuerpo
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(0, 5);
        ctx.stroke();

        // Brazos
        const armOffsetX = 10;
        const armOffsetY = -15;

        // Brazo izquierdo
        ctx.beginPath();
        ctx.moveTo(0, armOffsetY);
        ctx.lineTo(-armOffsetX, armOffsetY - 5);
        ctx.stroke();

        // Brazo derecho
        ctx.beginPath();
        ctx.moveTo(0, armOffsetY);
        ctx.lineTo(armOffsetX, armOffsetY - 5);
        ctx.stroke();

        // Piernas
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(-5, 20);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(5, 20);
        ctx.stroke();

        // Indicador de ataque
        if (this.isAttacking) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    /**
     * Maneja entrada del teclado
     */
    handleInput(keys) {
        // Movimiento horizontal
        if (keys['a'] || keys['A']) {
            this.velocityX = -this.moveSpeed;
            this.direction = -1;
        } else if (keys['d'] || keys['D']) {
            this.velocityX = this.moveSpeed;
            this.direction = 1;
        } else {
            this.velocityX *= 0.8; // Fricción natural
        }

        // Salto
        if ((keys[' '] || keys['ArrowUp']) && this.isGrounded) {
            this.velocityY = this.jumpPower;
            this.isGrounded = false;
        }

        // Ataque: Puño
        if (keys['j'] || keys['J']) {
            this.attack('punch');
        }

        // Ataque: Patada
        if (keys['k'] || keys['K']) {
            this.attack('kick');
        }
    }

    /**
     * Sistema de ataque con combo
     */
    attack(type) {
        const now = Date.now();

        // Verificar si está en cooldown
        if (this.attackCooldown > 0) return;

        // Verificar combo
        if (now - this.lastAttackTime > this.comboCooldown) {
            this.comboCounter = 0;
        }

        this.isAttacking = true;
        this.attackType = type;
        this.attackCooldown = 30; // frames
        this.comboCounter++;
        this.lastAttackTime = now;
    }

    /**
     * Recibe daño
     */
    takeDamage(damage) {
        this.health -= damage;
        this.health = Math.max(0, this.health);
        this.isHit = true;
        this.hitCooldown = 15; // frames
    }

    /**
     * Obtiene el área de ataque actual
     */
    getAttackArea() {
        if (!this.isAttacking) return null;

        const baseRange = this.attackType === 'kick' ? 35 : 25;
        const offsetX = this.direction * baseRange;
        
        return {
            x: this.x + offsetX,
            y: this.y - 10,
            width: 20,
            height: 30,
            damage: this.attackType === 'kick' ? 12 : 8,
            knockback: this.attackType === 'kick' ? 6 : 4,
            type: this.attackType
        };
    }

    /**
     * Actualiza el estado del personaje
     */
    update(canvas) {
        // Reducir cooldowns
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.hitCooldown > 0) this.hitCooldown--;
        if (this.isAttacking && this.attackCooldown === 0) {
            this.isAttacking = false;
        }

        this.isHit = this.hitCooldown > 0;
    }

    /**
     * Retorna información de salud para UI
     */
    getHealthPercent() {
        return (this.health / this.maxHealth) * 100;
    }

    /**
     * Reinicia el personaje
     */
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = this.maxHealth;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.comboCounter = 0;
        this.damageDealt = 0;
        this.attacksHit = 0;
    }
}