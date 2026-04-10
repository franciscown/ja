/**
 * Sistema de Física Simple para Stickman Fight
 * Maneja gravedad, velocidad y movimiento
 */

class Physics {
    constructor() {
        this.gravity = 0.6;
        this.friction = 0.85;
        this.maxFallSpeed = 15;
    }

    /**
     * Aplica gravedad a un objeto
     */
    applyGravity(character) {
        if (!character.isGrounded) {
            character.velocityY += this.gravity;
            
            // Limitar velocidad de caída
            if (character.velocityY > this.maxFallSpeed) {
                character.velocityY = this.maxFallSpeed;
            }
        }
    }

    /**
     * Aplica fricción al movimiento horizontal
     */
    applyFriction(character) {
        character.velocityX *= this.friction;
    }

    /**
     * Actualiza posición basada en velocidad
     */
    updatePosition(character, canvas) {
        character.x += character.velocityX;
        character.y += character.velocityY;

        // Colisión con bordes del canvas
        if (character.x - character.width / 2 < 0) {
            character.x = character.width / 2;
            character.velocityX = 0;
        }
        if (character.x + character.width / 2 > canvas.width) {
            character.x = canvas.width - character.width / 2;
            character.velocityX = 0;
        }

        // Detección de piso
        if (character.y + character.height / 2 >= canvas.height - 30) {
            character.y = canvas.height - 30 - character.height / 2;
            character.isGrounded = true;
            character.velocityY = 0;
        } else {
            character.isGrounded = false;
        }
    }

    /**
     * Simula knockback (retroceso) después de ser golpeado
     */
    applyKnockback(character, knockbackX, knockbackY = -5) {
        character.velocityX = knockbackX;
        character.velocityY = knockbackY;
        character.isGrounded = false;
    }
}