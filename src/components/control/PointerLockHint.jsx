import { useEffect, useState } from 'react';
import styles from './PointerLockHint.module.css';

function PointerLockHint() {
    const [isLocked, setIsLocked] = useState(false);
    const [showHint, setShowHint] = useState(true);

    useEffect(() => {
        const handleLockChange = () => {
            const locked = document.pointerLockElement !== null;
            setIsLocked(locked);

            if (locked && showHint) {
                const timer = setTimeout(() => {
                    setShowHint(false);
                }, 5000);
                return () => clearTimeout(timer);
            }
        };

        document.addEventListener('pointerlockchange', handleLockChange);
        return () => {
            document.removeEventListener('pointerlockchange', handleLockChange);
        };
    }, [showHint]);

    useEffect(() => {
        if (!isLocked) {
            setShowHint(true);
        }
    }, [isLocked]);

    if (!isLocked || !showHint) return null;

    return (
        <div className={styles.container}>
            <div className={styles.hintCard}>
                <div className={styles.hintContent}>
                    <div className={styles.controlsGrid}>
                        <div className={styles.controlGroup}>
                            <div className={styles.keysRow}>
                                <kbd className={styles.key}>W</kbd>
                                <kbd className={styles.key}>A</kbd>
                                <kbd className={styles.key}>S</kbd>
                                <kbd className={styles.key}>D</kbd>
                            </div>
                            <span className={styles.keyLabel}>Движение</span>
                        </div>

                        <div className={styles.controlGroup}>
                            <div className={styles.keysRow}>
                                <kbd className={styles.key}>Space</kbd>
                                <kbd className={styles.key}>Shift</kbd>
                            </div>
                            <span className={styles.keyLabel}>Вверх/Вниз</span>
                        </div>

                        <div className={styles.controlGroup}>
                            <div className={styles.keysRow}>
                                <kbd className={styles.key}>I</kbd>
                            </div>
                            <span className={styles.keyLabel}>Инфо</span>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <kbd className={styles.escapeKey}>ESC</kbd>
                        <span className={styles.footerText}>Выход</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PointerLockHint;