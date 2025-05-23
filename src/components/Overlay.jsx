import styles from "./Overley.module.css"

function Overlay() {
    return (
        <div className={styles.overlay}>
            <button className={styles.toggleBtn}>Переключить блок</button>
            <p>Матовый блок</p>
        </div>
    )
}

export default Overlay