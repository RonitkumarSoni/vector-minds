import { useEffect, useRef } from 'react';

export default function Background3D() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animId;
        let W = window.innerWidth;
        let H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        const STAR_COUNT = 300;
        const stars = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.3,
            speed: Math.random() * 0.3 + 0.05,
            opacity: Math.random() * 0.7 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinkleDir: Math.random() > 0.5 ? 1 : -1,
        }));

        const shootingStars = [];
        const addShootingStar = () => {
            if (shootingStars.length < 3) {
                shootingStars.push({
                    x: Math.random() * W,
                    y: Math.random() * H * 0.5,
                    len: Math.random() * 80 + 40,
                    speed: Math.random() * 6 + 4,
                    opacity: 1,
                    angle: Math.PI / 5,
                });
            }
        };
        setInterval(addShootingStar, 2500);

        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            for (const s of stars) {
                s.opacity += s.twinkleSpeed * s.twinkleDir;
                if (s.opacity > 0.9 || s.opacity < 0.1) s.twinkleDir *= -1;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 150, 255, ${s.opacity})`;
                ctx.fill();

                s.y += s.speed * 0.1;
                if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const ss = shootingStars[i];
                const grad = ctx.createLinearGradient(
                    ss.x, ss.y,
                    ss.x - Math.cos(ss.angle) * ss.len,
                    ss.y - Math.sin(ss.angle) * ss.len
                );
                grad.addColorStop(0, `rgba(200, 170, 255, ${ss.opacity})`);
                grad.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.moveTo(ss.x, ss.y);
                ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ss.x += Math.cos(ss.angle) * ss.speed;
                ss.y += Math.sin(ss.angle) * ss.speed;
                ss.opacity -= 0.015;
                if (ss.opacity <= 0) shootingStars.splice(i, 1);
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        const onResize = () => {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        };
        window.addEventListener('resize', onResize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100vw', height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 30% 20%, #1a0a2e 0%, #09090b 50%, #020209 100%)',
            }}
        />
    );
}
