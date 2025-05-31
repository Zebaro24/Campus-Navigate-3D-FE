import React, {useEffect, useState} from 'react';
import styles from './NavMenu.module.css';
import NavItem from './NavItem';
import DropdownNavItem from './DropdownNavItem';
import axios from "axios";

function NavMenu({mainScene, setOverlayInformation}) {
    const [activeMenu, setActiveMenu] = useState('Головна');

    const itemsFunc = {activeMenu, onSelect:setActiveMenu};

    const [mainLocationFunc, setMainLocationFunc] = useState(() => {})
    const [importantLocationItems, setImportantLocationItems] = useState(() => {})
    const [cabinetLocationItems, setCabinetLocationItems] = useState(() => {})

    useEffect(() => {
        const startAnimationLocation = (id) => {
            axios.get(`/api/locations/${id}`).then(res => {
                setOverlayInformation({
                    title: res.data.title,
                    image: res.data.image,
                    description: res.data.description,
                })
                mainScene.setAnimation(res.data)
            })
        }

        axios.get('/api/locations/category/main/').then((res => {
            setMainLocationFunc(() => () => startAnimationLocation(res.data[0].id))
            startAnimationLocation(res.data[0].id)
        }))

        axios.get('/api/locations/category/important/').then((res => {
            res.data.forEach(item => {
                item.clickFunc = () => startAnimationLocation(item.id)
            })
            setImportantLocationItems(() => res.data)
        }))

        axios.get('/api/locations/category/cabinet/').then((res => {
            res.data.forEach(item => {
                item.clickFunc = () => startAnimationLocation(item.id)
            })
            setCabinetLocationItems(() => res.data)
        }))
    }, [setMainLocationFunc, setImportantLocationItems, setCabinetLocationItems, setOverlayInformation, mainScene]);


    return (
        <div className={styles.containerMenu}>
            <div className={styles.gradientRight}></div>
            <div className={styles.boxMenu}>
                <nav className={styles.menu}>
                    <NavItem itemsFunc={itemsFunc} clickFunc={mainLocationFunc}>Головна</NavItem>
                    <DropdownNavItem items={importantLocationItems} itemsFunc={itemsFunc}>Важливі місця</DropdownNavItem>
                    <DropdownNavItem items={cabinetLocationItems} itemsFunc={itemsFunc}>Кабінети</DropdownNavItem>
                    <NavItem itemsFunc={itemsFunc}  clickFunc={() => {}}>Про нас</NavItem>
                </nav>
            </div>
        </div>
    );
}

export default NavMenu;