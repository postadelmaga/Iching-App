import React, { useRef, useEffect } from 'react';

const TaoCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resolution = 600;
        canvas.width = resolution;
        canvas.height = resolution;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = (Math.min(canvas.width, canvas.height) / 2) * 0.55;

        let rotation = 0;
        let time = 0;
        let animationFrameId: number;

        class Particle {
            x: number = 0;
            y: number = 0;
            vx: number = 0;
            vy: number = 0;
            life: number = 0;
            decay: number = 0;
            size: number = 0;

            constructor() {
                this.reset();
            }

            reset() {
                const angle = Math.random() * Math.PI * 2;
                const distance = radius + Math.random() * 40;
                this.x = centerX + Math.cos(angle) * distance;
                this.y = centerY + Math.sin(angle) * distance;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.life = 1;
                this.decay = 0.01 + Math.random() * 0.02;
                this.size = Math.random() * 2 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= this.decay;
                if (this.life <= 0) this.reset();
            }

            draw(context: CanvasRenderingContext2D) {
                context.save();
                context.globalAlpha = this.life * 0.6;
                context.fillStyle = '#ffffff';
                context.shadowBlur = 10;
                context.shadowColor = '#88ccff';
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                context.fill();
                context.restore();
            }
        }

        const particles = Array.from({ length: 40 }, () => new Particle());

        function drawTao() {
            if(!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw(ctx);
            });

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            const pulse = Math.sin(time * 0.05) * 0.1 + 0.9;

            // Outer energy ring
            ctx.save();
            ctx.globalAlpha = 0.3 * pulse;
            ctx.strokeStyle = '#88ccff';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#88ccff';
            ctx.beginPath();
            ctx.arc(0, 0, radius + 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Inner glow
            const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
            glowGradient.addColorStop(0, 'rgba(136, 204, 255, 0.2)');
            glowGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(0, 0, radius + 10, 0, Math.PI * 2);
            ctx.fill();

            // Main Tao symbol - White background circle
            const whiteGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
            whiteGradient.addColorStop(0, '#ffffff');
            whiteGradient.addColorStop(1, '#e0e0e0');

            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fillStyle = whiteGradient;
            ctx.fill();

            // Black half with gradient
            const blackGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
            blackGradient.addColorStop(0, '#1a1a1a');
            blackGradient.addColorStop(1, '#000000');

            ctx.beginPath();
            ctx.arc(0, 0, radius, -Math.PI / 2, Math.PI / 2, false);
            ctx.arc(0, radius / 2, radius / 2, Math.PI / 2, -Math.PI / 2, true);
            ctx.arc(0, -radius / 2, radius / 2, Math.PI / 2, -Math.PI / 2, false);
            ctx.closePath();
            ctx.fillStyle = blackGradient;
            ctx.fill();

            // White dot
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffffff';
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, -radius / 2, radius / 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Black dot
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#000000';
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(0, radius / 2, radius / 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Dividing line glow
            ctx.save();
            ctx.globalAlpha = 0.3 * pulse;
            ctx.strokeStyle = '#88ccff';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#88ccff';
            ctx.beginPath();
            ctx.arc(0, 0, radius, -Math.PI / 2, Math.PI / 2, false);
            ctx.arc(0, radius / 2, radius / 2, Math.PI / 2, -Math.PI / 2, true);
            ctx.arc(0, -radius / 2, radius / 2, Math.PI / 2, -Math.PI / 2, false);
            ctx.stroke();
            ctx.restore();

            // Outer border
            ctx.save();
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#88ccff';
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            ctx.restore();
        }

        function animate() {
            rotation += 0.005;
            time++;
            drawTao();
            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="w-full h-full object-contain filter contrast-110 drop-shadow-[0_0_15px_rgba(115,17,212,0.5)]"
        />
    );
};

export default TaoCanvas;