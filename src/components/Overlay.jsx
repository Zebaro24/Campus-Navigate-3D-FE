import styles from "./Overley.module.css"
import {useEffect} from "react";

function Overlay({information, setInformation}) {
    useEffect(() => {
        const closeOverlay = () => {
            setInformation(() => null)
        }

        document.addEventListener('pointerlockchange', closeOverlay);
        return () => {
            document.removeEventListener('pointerlockchange', closeOverlay);
        };
    }, [setInformation]);

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