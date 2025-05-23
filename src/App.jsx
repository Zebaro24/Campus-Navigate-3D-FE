import MainLogo from "./components/navigation/MainLogo.jsx";
import NavMenu from "./components/navigation/NavMenu.jsx";
import Overlay from "./components/Overlay.jsx";

import './App.css'
import {useEffect, useRef, useState} from "react";
import MainScene from "./canvas/MainScene.js";

function App() {
    const containerRef = useRef(null);
    const [mainScene] = useState(() => new MainScene());

    useEffect(() => {
        containerRef.current.appendChild(mainScene.getCanvas());
    }, [mainScene]);

    return (
        <>
            <MainLogo/>
            <NavMenu/>
            <Overlay/>
            <div ref={containerRef}/>
        </>
    )
}

export default App
