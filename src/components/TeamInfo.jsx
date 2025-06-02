import React from 'react';

import styles from './TeamInfo.module.css';

const people = [
    {
        name: 'Денис Щербатий',
        role: 'Fullstack Developer',
        description: 'Відповідав за розробку веб-додатку з використанням React та Three.js, створення API на Django для управління контентом, реалізацію навігаційної системи та інтеграцію всіх компонентів системи.',
        image: '/denys.jpg',
    },
    {
        name: 'Максим Сидоренко',
        role: '3D Modeler',
        description: 'Створив деталізовану 3D-модель університетського комплексу, оптимізував геометрію та текстури для веб-середовища, розробив систему орієнтирів для навігації.',
        image: '/maxim.jpg',
    },
];

const infoProject = `Проект створює інтерактивну 3D-карту університету для віртуальних турів. Користувачі можуть здійснювати автоматичний обліт ключових локацій з інформаційним супроводом або вільно переміщуватися кампусом. Система призначена для ознайомлення з інфраструктурою закладу та отримання детальної інформації про будівлі та аудиторії.`

function TeamInfo() {
    return (
        <div className={styles.teamInfo}>
            <h1 className={styles.title}>Про нас</h1>

            <div className={styles.members}>
                {people.map((person, index) => (
                    <div className={styles.memberCard} key={index}>
                        <img src={person.image} alt={person.name} className={styles.memberImage}/>
                        <h3 className={styles.memberName}>{person.name}</h3>
                        <p className={styles.memberRole}>{person.role}</p>
                        <p className={styles.memberDesc}>{person.description}</p>
                    </div>
                ))}
            </div>

            <div className={styles.projectInfo}>
                <h2>Про проект</h2>
                <p>{infoProject}</p>
            </div>
        </div>
    );
}

export default TeamInfo;
