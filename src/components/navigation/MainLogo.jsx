import styles from "./MainLogo.module.css";

function MainLogo() {
    return (
        <div className={styles.containerLogo}>
            <div className={styles.boxLogo}>
                <img src="/logo.svg" draggable="false" alt="Національний університет «Чернігівська Політехніка»"/>
            </div>
            <div className={styles.gradientLeft}></div>
        </div>
    );
}

export default MainLogo;