import styles from "./Overley.module.css"


function Overlay({information, setInformation}) {
    if (!information) return null;

    const toggleBtn = () => setInformation(() => null)

    return (
        <div className={styles.overlay}>
            <button className={styles.toggleBtn} onClick={toggleBtn}>Сховати</button>
            <h1>{information.title}</h1>
            {information.image && <img alt={information.image}/>}
            <p>{information.description}</p>
        </div>
    )
}

export default Overlay