import React, {useCallback, useEffect, useRef, useState} from 'react';

import axios from "../../../utils/axiosInstance";
import DropdownNavItem from './DropdownNavItem';
import NavItem from './NavItem';

import styles from './NavMenu.module.css';

function NavMenu({mainScene, setOverlayInformation, isOnTeamInfo, setIsOnTeamInfo}) {
    const [activeMenu, setActiveMenu] = useState('Головна');

    const itemsFunc = {activeMenu, onSelect: setActiveMenu};

    const [mainLocationFunc, setMainLocationFunc] = useState(() => {
    });
    const [importantLocationItems, setImportantLocationItems] = useState(() => {
    });
    const [cabinetLocationItems, setCabinetLocationItems] = useState(() => {
    });

    const currentHandlerLockRef = useRef(() => {
    });

    const startAnimationLocation = useCallback((id) => {
        document.removeEventListener('pointerlockchange', currentHandlerLockRef.current);

        axios.get(`/locations/${id}`).then(res => {
            const newHandler = () => {
                if (document.pointerLockElement !== null) return;
                setOverlayInformation({
                    title: res.data.title,
                    image: res.data.image,
                    description: res.data.description,
                });
                mainScene.setAnimation(res.data);
            };

            newHandler();
            document.addEventListener('pointerlockchange', newHandler);
            currentHandlerLockRef.current = newHandler;
        });
    }, [mainScene, setOverlayInformation]);

    const clickTeamInfo = () => {
        setOverlayInformation(null);
        setIsOnTeamInfo(true);
    };

    if (isOnTeamInfo && activeMenu !== "Про нас") {
        setIsOnTeamInfo(false);
    }

    useEffect(() => {
        axios.get('/locations/category/main/').then((res => {
            setMainLocationFunc(() => () => startAnimationLocation(res.data[0].id));
            startAnimationLocation(res.data[0].id);
        }));

        axios.get('/locations/category/important/').then((res => {
            res.data.forEach(item => {
                item.clickFunc = () => startAnimationLocation(item.id);
            });
            setImportantLocationItems(() => res.data);
        }));

        axios.get('/locations/category/cabinet/').then((res => {
            res.data.forEach(item => {
                item.clickFunc = () => startAnimationLocation(item.id);
            });
            setCabinetLocationItems(() => res.data);
        }));
    }, [setMainLocationFunc, setImportantLocationItems, setCabinetLocationItems, startAnimationLocation]);


    return (
        <div className={styles.containerMenu}>
            <div className={styles.gradientRight}></div>
            <div className={styles.boxMenu}>
                <nav className={styles.menu}>
                    <NavItem itemsFunc={itemsFunc} clickFunc={mainLocationFunc}>Головна</NavItem>
                    <DropdownNavItem items={importantLocationItems} itemsFunc={itemsFunc}>Важливі
                        місця</DropdownNavItem>
                    <DropdownNavItem items={cabinetLocationItems} itemsFunc={itemsFunc}>Кабінети</DropdownNavItem>
                    <NavItem itemsFunc={itemsFunc} clickFunc={clickTeamInfo}>Про нас</NavItem>
                </nav>
            </div>
        </div>
    );
}

export default NavMenu;