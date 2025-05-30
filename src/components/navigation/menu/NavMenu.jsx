import React, {useEffect, useState} from 'react';
import styles from './NavMenu.module.css';
import NavItem from './NavItem';
import DropdownNavItem from './DropdownNavItem';
import axios from "axios";

function NavMenu({mainScene}) {
    const [activeMenu, setActiveMenu] = useState('Головна');

    const itemsFunc = {activeMenu, onSelect:setActiveMenu};

    const [mainLocationFunc, setMainLocationFunc] = useState(() => {})
    const [importantLocationItems, setImportantLocationItems] = useState(() => {})
    const [cabinetLocationItems, setCabinetLocationItems] = useState(() => {})

    const startAnimationLocation = (id) => {
        axios.get(`/api/locations/${id}`).then(res => {
            mainScene.setAnimation(res.data)
        })
    }

    useEffect(() => {
        axios.get('/api/locations/category/main/').then((res => {
            setMainLocationFunc(() => () => startAnimationLocation(res.data[0].id))
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
    }, []);


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