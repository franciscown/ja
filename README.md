# 🎮 Stickman Fight - Juego de Peleas en HTML5

Un juego de lucha estilo **Stickman** desarrollado con **JavaScript** y **HTML5 Canvas**. ¡Desafía a la IA en combates épicos de puro instinto y tácticas!

## 🎯 Características

### ✅ Implementadas
- **Controles Intuitivos**: Movimiento fluido, saltos y ataques precisos
- **Sistema de Combate Intermedio**:
  - Puñetazos y patadas con daño diferenciado
  - Sistema de combo simple
  - Knockback dinámico después de golpes
  - Detección de colisiones pixel-perfect
  
- **Física Realista**:
  - Gravedad y caída natural
  - Fricción en movimientos
  - Límites del canvas
  - Inercia al saltar

- **Modo Single-Player vs IA**:
  - IA con sistema de estados (Idle → Chase → Attack → Runaway)
  - Comportamiento dinámico basado en salud y distancia
  - Decisiones tácticas (cuándo atacar, cuándo huir)
  - Combos aleatorios

- **Interfaz de Usuario**:
  - Barras de salud en tiempo real
  - Indicadores visuales de ataque
  - Mensaje de victoria/derrota
  - Información de controles

## 🕹️ Controles

| Tecla | Acción |
|-------|--------|
| **A** / **D** | Mover izquierda/derecha |
| **ESPACIO** | Saltar |
| **J** | Puñetazo |
| **K** | Patada |

## 📁 Estructura del Proyecto

```
ja/
├── index.html           # Página principal
├── styles.css           # Estilos y animaciones
├── js/
│   ├── physics.js       # Sistema de física (gravedad, movimiento)
│   ├── stickman.js      # Definición de personajes
│   ├── ai.js            # Controlador de IA
│   ├── collision.js     # Detección de colisiones
│   └── game.js          # Loop principal y lógica del juego
└── README.md            # Este archivo
```

## 🏗️ Arquitectura Técnica

### Physics Engine
- Gravedad realista (0.6 px/frame²)
- Velocidad máxima de caída
- Fricción en movimientos horizontales
- Colisiones con límites del canvas

### Combat System
- **Punch**: 8 daño + knockback moderado
- **Kick**: 12 daño + knockback fuerte
- Sistema de combos (hasta 2 ataques consecutivos)
- Cooldown de ataque (30 frames)

### AI States
```
┌─────────┐
│  IDLE   │ (Esperando)
├─────────┤
  ↓   ↑
┌─────────────┐
│   CHASE     │ (Perseguir al jugador)
├─────────────┤
  ↓   ↑
┌─────────────┐
│   ATTACK    │ (Atacar cuando está cerca)
├─────────────┤
  ↓   ↑
┌─────────────┐
│   RUNAWAY   │ (Huir cuando salud < 30%)
└─────────────┘
```

## 📊 Estadísticas de Juego

Cada personaje rastrea:
- **Salud**: 0-100 HP
- **Daño Infligido**: Total de daño causado
- **Ataques Conectados**: Número de golpes que impactaron
- **Combo Counter**: Ataques consecutivos

## 🎨 Visual

- **Stickman Rojo** (#FF6B6B): Eres tú
- **Stickman Azul** (#4ECDC4): La IA
- **Cielo Gradiente**: Fondo dinámico
- **Efectos**: Parpadeo al recibir daño, aura de ataque

## 🚀 Cómo Empezar

### Opción 1: Clonar el Repositorio
```bash
git clone https://github.com/franciscown/ja.git
cd ja
# Abre index.html en tu navegador
```

### Opción 2: Abrir Directamente
Simplemente descarga los archivos y abre `index.html` en cualquier navegador moderno.

## 📈 Roadmap - Próximas Características

### v1.1 - Enhanced Combat
- [ ] Sistema de bloqueo
- [ ] Ataques cargados
- [ ] Habilidades especiales por combo
- [ ] Knockdown system

### v1.2 - Contenido
- [ ] Múltiples personajes con estadísticas únicas
- [ ] Modos de juego (Arcade, Survival, etc.)
- [ ] Sonidos y efectos de audio
- [ ] Música de fondo

### v1.3 - Multijugador
- [ ] Modo 2 Jugadores (teclado compartido)
- [ ] Multiplayer en línea (WebSocket)
- [ ] Ranking global

### v2.0 - AAA
- [ ] Gráficos mejorados
- [ ] Animaciones fluidas
- [ ] Partículas de impacto
- [ ] Cinemáticas

## 🐛 Debugging

Para habilitar modo debug (mostrar áreas de ataque):
1. Abre `js/game.js`
2. En la función `render()`, cambia `if (false)` a `if (true)` en la línea de `drawAttackAreas()`
3. Recarga el navegador

## 💡 Consejos de Juego

### Para Ganar Contra la IA:
1. **Combos**: Presiona J dos veces para hacer un combo de puños
2. **Distancia**: Mantente a distancia media para atacar sin recibir represalias
3. **Saltos**: Usa saltos para esquivar ataques de la IA
4. **Patadas**: Las patadas hacen más daño pero son más lentas
5. **Estrategia**: Observa los patrones de la IA y contraataca

## 🛠️ Tecnologías

- **HTML5 Canvas API** - Renderizado 2D
- **JavaScript Vanilla** - Sin dependencias
- **CSS3** - Estilos y animaciones
- **RequestAnimationFrame** - Loop de juego optimizado

## 📝 Notas de Desarrollo

- **Performance**: Renderizado a 60 FPS (depende del navegador)
- **Compatibilidad**: Chrome, Firefox, Safari, Edge (versiones recientes)
- **Tamaño**: ~15KB total (minificado)
- **Mobile**: Controles en progreso

## 👨‍💻 Autor

**Franciscown** - [GitHub](https://github.com/franciscown)

## 📄 Licencia

MIT License - Libre para usar, modificar y distribuir

---

**¿Sugerencias o bugs?** Abre un issue en GitHub o contacta directamente.

**¡A luchar!** 🥊
