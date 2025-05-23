import styles from './NavMenu.module.css'

function NavMenu() {
    return (
        <div className={styles.containerMenu}>
            <div className={styles.gradientRight}></div>
            <div className={styles.boxMenu}>
                <nav className={styles.menu}>
                    <button className={styles.active}>Политех</button>
                    <button>Кабинеты</button>
                    <button>Важные места</button>
                    <button>О нас</button>
                </nav>
            </div>
        </div>
    )
}

export default NavMenu