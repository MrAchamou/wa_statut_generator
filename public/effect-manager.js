
// Effect Manager pour Social Content Masterclass
class EffectManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas ? canvas.getContext('2d') : null;
        this.effects = [];
        this.animationId = null;
        this.isRunning = false;
    }

    addEffect(effect) {
        this.effects.push(effect);
        if (!this.isRunning) {
            this.startAnimation();
        }
    }

    removeEffect(effectId) {
        this.effects = this.effects.filter(effect => effect.id !== effectId);
        if (this.effects.length === 0) {
            this.stopAnimation();
        }
    }

    clearEffects() {
        this.effects = [];
        this.stopAnimation();
    }

    startAnimation() {
        if (!this.canvas || !this.ctx) return;
        
        this.isRunning = true;
        const animate = () => {
            if (!this.isRunning) return;
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and render effects
            this.effects.forEach(effect => {
                if (effect.update) effect.update();
                if (effect.render) effect.render(this.ctx);
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    stopAnimation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    // Créer un effet de particules simple
    createParticleEffect(x, y, color = '#00ffff') {
        const particles = [];
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                decay: 0.02,
                color: color
            });
        }

        return {
            id: Date.now() + Math.random(),
            particles: particles,
            update: function() {
                this.particles = this.particles.filter(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life -= p.decay;
                    return p.life > 0;
                });
            },
            render: function(ctx) {
                this.particles.forEach(p => {
                    ctx.save();
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
            }
        };
    }

    // Créer un effet de pulsation
    createPulseEffect(element) {
        let pulseScale = 1;
        let pulseDirection = 1;
        
        const originalTransform = element.style.transform;
        
        return {
            id: Date.now() + Math.random(),
            element: element,
            update: function() {
                pulseScale += pulseDirection * 0.01;
                if (pulseScale >= 1.1) pulseDirection = -1;
                if (pulseScale <= 0.9) pulseDirection = 1;
                
                this.element.style.transform = `${originalTransform} scale(${pulseScale})`;
            },
            render: function() {
                // Rendu géré par CSS
            }
        };
    }

    // Appliquer un effet CSS à un élément
    applyCSSEffect(elementId, effectName) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Retirer les effets existants
        element.className = element.className.replace(/effect-\w+/g, '');
        
        // Ajouter le nouvel effet
        if (effectName) {
            element.classList.add(`effect-${effectName}`);
        }
    }

    // Créer un effet de brillance
    createGlowEffect(x, y, radius = 30, color = '#00ffff') {
        let glowIntensity = 0;
        let glowDirection = 1;

        return {
            id: Date.now() + Math.random(),
            x: x,
            y: y,
            radius: radius,
            color: color,
            update: function() {
                glowIntensity += glowDirection * 0.02;
                if (glowIntensity >= 1) glowDirection = -1;
                if (glowIntensity <= 0) glowDirection = 1;
            },
            render: function(ctx) {
                ctx.save();
                ctx.globalAlpha = glowIntensity * 0.5;
                
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.radius
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        };
    }
}

// Fonction utilitaire pour créer des effets
function createEffect(type, element, options = {}) {
    const effectManager = window.effectManager;
    if (!effectManager) return;

    switch (type) {
        case 'pulse':
            return effectManager.createPulseEffect(element);
        case 'glow':
            const rect = element.getBoundingClientRect();
            return effectManager.createGlowEffect(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                options.radius,
                options.color
            );
        case 'particles':
            const bounds = element.getBoundingClientRect();
            return effectManager.createParticleEffect(
                bounds.left + bounds.width / 2,
                bounds.top + bounds.height / 2,
                options.color
            );
        default:
            return null;
    }
}
