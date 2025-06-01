import React from 'react';

import styles from './NavMenu.module.css';

function NavItem({ children, itemsFunc, clickFunc }) {
    const {activeMenu, onSelect} = itemsFunc
    const isActive = activeMenu === children;

    return (
        <button
            className={isActive ? styles.active : ''}
            onClick={() => {
                onSelect(children)
                clickFunc()
            }}
        >
            {children}
        </button>
    );
}

export default NavItem;