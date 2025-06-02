import {useEffect, useRef, useState} from 'react';

import styles from './LoadingScreen.module.css';

function LoadingScreen({setIsModelLoaded, mainScene}) {
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef(null);

    useEffect(() => {
        mainScene.setComponentLoadFunc(setProgress);
    }, [mainScene]);

    useEffect(() => {
        if (progress === 101) setTimeout(() => setIsModelLoaded(true), 400);
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Фон
            ctx.fillStyle = '#121212';
            ctx.fillRect(0, 0, width, height);

            // Прогресс бар
            const barWidth = width * 0.6;
            const barHeight = 20;
            const barX = (width - barWidth) / 2;
            const barY = height * 0.6;

            // Зовнішній контур
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 2;
            ctx.strokeRect(barX, barY, barWidth, barHeight);

            // Наповнення
            const fillWidth = (barWidth * progress) / 100;
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(barX, barY, fillWidth, barHeight);

            // Текст
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Завантаження моделі', width / 2, height * 0.4);

            // Відсотки
            ctx.font = 'bold 28px Arial';
            ctx.fillText(`${Math.round(progress)}%`, width / 2, barY + barHeight + 40);

            // Завантажити анімацію
            requestAnimationFrame(animate);
        };

        animate();
    }, [progress, setIsModelLoaded]);

    return (
        <div className={`${styles.container} ${progress === 101 ? styles.hidden : ''}`}>
            <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className={styles.canvas}
            />
        </div>
    );
}

export default LoadingScreen;