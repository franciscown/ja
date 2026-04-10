/**
 * Sistema de Detección de Colisiones
 * Gestiona colisiones entre ataques y personajes
 */

class CollisionDetector {
    /**
     * Detecta si un área de ataque golpea a un personaje
     */
    static checkAttackHit(attackArea, target) {
        if (!attackArea) return false;

        const targetLeft = target.x - target.width / 2;
        const targetRight = target.x + target.width / 2;
        const targetTop = target.y - target.height / 2;
        const targetBottom = target.y + target.height / 2;

        const attackLeft = attackArea.x - attackArea.width / 2;
        const attackRight = attackArea.x + attackArea.width / 2;
        const attackTop = attackArea.y - attackArea.height / 2;
        const attackBottom = attackArea.y + attackArea.height / 2;

        return !(
            attackRight < targetLeft ||
            attackLeft > targetRight ||
            attackBottom < targetTop ||
            attackTop > targetBottom
        );
    }

    /**
     * Detección AABB (Axis-Aligned Bounding Box)
     */
    static aabbCollision(rect1, rect2) {
        return !(
            rect1.x + rect1.width < rect2.x ||
            rect1.x > rect2.x + rect2.width ||
            rect1.y + rect1.height < rect2.y ||
            rect1.y > rect2.y + rect2.height
        );
    }

    /**
     * Detección circular (para áreas de impacto)
     */
    static circleCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < r1 + r2;
    }

    /**
     * Calcula vector de knockback
     */
    static getKnockbackVector(attacker, defender, knockbackForce) {
        const direction = defender.x > attacker.x ? 1 : -1;
        return {
            x: knockbackForce * direction,
            y: -5 // Pequeño impulso hacia arriba
        };
    }
}