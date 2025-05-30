import React, { useState } from 'react';
import styles from './NavMenu.module.css';

function DropdownNavItem({ children, items, itemsFunc }) {
    const {activeMenu, onSelect} = itemsFunc
    const [showDropdown, setShowDropdown] = useState(false);
    const isActive = activeMenu.startsWith(children);

    const handleSelect = (item) => {
        onSelect(`${children}: ${item.title}`);
        setShowDropdown(false);
    };

    return (
        <div
            className={styles.dropdown}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
        >
            <button className={isActive ? styles.active : ''}>
                {children}
            </button>

            {showDropdown && (
                <div className={styles.dropdownContent}>
                    {items.map((item) => (
                        <button
                            key={item.id}
                            className={activeMenu === `${children}: ${item.title}` ? styles.activeItem : ''}
                            onClick={() => {
                                handleSelect(item)
                                item.clickFunc && item.clickFunc()
                            }}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropdownNavItem;