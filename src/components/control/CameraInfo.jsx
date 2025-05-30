import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import styles from './CameraInfo.module.css';

function CameraInfo({ mainScene }) {
    const [cameraData, setCameraData] = useState({
        pitch: 0,
        yaw: 0,
        position: { x: 0, y: 0, z: 0 },
        fps: 0
    });

    // По умолчанию компонент скрыт
    const [isActive, setIsActive] = useState(false);
    const frameCount = useRef(0);
    const lastUpdateTime = useRef(0);
    const requestRef = useRef();

    const toDegrees = useCallback(radians =>
            Math.round(radians * (180 / Math.PI) * 10) / 10
        , []);

    const update = useCallback(() => {
        if (!mainScene?.camera) {
            requestRef.current = requestAnimationFrame(update);
            return;
        }

        frameCount.current++;
        const now = performance.now();
        const delta = now - lastUpdateTime.current;

        if (delta >= 100) {
            const { camera } = mainScene;

            const euler = new THREE.Euler().setFromQuaternion(
                camera.quaternion,
                'YXZ'
            );

            setCameraData({
                pitch: toDegrees(euler.x),
                yaw: toDegrees(euler.y),
                position: {
                    x: Math.round(camera.position.x * 10) / 10,
                    y: Math.round(camera.position.y * 10) / 10,
                    z: Math.round(camera.position.z * 10) / 10
                },
                fps: Math.round((frameCount.current * 1000) / delta)
            });

            frameCount.current = 0;
            lastUpdateTime.current = now;
        }

        requestRef.current = requestAnimationFrame(update);
    }, [mainScene, toDegrees]);

    // Обработчик клавиши I - переключение видимости
    const handleKeyPress = useCallback((e) => {
        if (e.code === 'KeyI') {
            setIsActive(prev => !prev);
        }
    }, []);

    useEffect(() => {
        // Всегда слушаем нажатия клавиши I, даже когда компонент скрыт
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    useEffect(() => {
        if (!isActive) return;

        lastUpdateTime.current = performance.now();
        requestRef.current = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(requestRef.current);
        };
    }, [isActive, update]);

    if (!isActive) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Камера</h3>
                <div className={styles.fpsBadge}>{cameraData.fps} FPS</div>
            </div>

            {/* Секция позиции */}
            <div className={styles.infoSection}>
                <h4 className={styles.sectionTitle}>Позиция</h4>
                <div className={styles.infoGrid}>
                    <span className={styles.label}>X:</span>
                    <span className={`${styles.value} ${styles.axisX}`}>{cameraData.position.x}</span>

                    <span className={styles.label}>Y:</span>
                    <span className={`${styles.value} ${styles.axisY}`}>{cameraData.position.y}</span>

                    <span className={styles.label}>Z:</span>
                    <span className={`${styles.value} ${styles.axisZ}`}>{cameraData.position.z}</span>
                </div>
            </div>

            {/* Секция ориентации */}
            <div className={styles.infoSection}>
                <h4 className={styles.sectionTitle}>Ориентация</h4>
                <div className={styles.infoGrid}>
                    <span className={styles.label}>Наклон:</span>
                    <span className={styles.value}>{cameraData.pitch}°</span>

                    <span className={styles.label}>Поворот:</span>
                    <span className={styles.value}>{cameraData.yaw}°</span>
                </div>
            </div>

            <p className={styles.hint}>
                Нажмите <span className={styles.hintKey}>I</span> чтобы скрыть/показать
            </p>
        </div>
    );
}

export default CameraInfo;