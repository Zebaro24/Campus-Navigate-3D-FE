import MainLogo from "./components/navigation/MainLogo.jsx";
import NavMenu from "./components/navigation/NavMenu.jsx";
import Overlay from "./components/Overlay.jsx";

import './App.css'
import {useEffect, useRef, useState} from "react";
import MainScene from "./canvas/MainScene.js";
import CameraInfo from "./components/control/CameraInfo.jsx";
import PointerLockHint from "./components/control/PointerLockHint.jsx";

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
            {/*<Overlay/>*/}
            <CameraInfo mainScene={mainScene}/>
            <div ref={containerRef}/>
            <PointerLockHint />
        </>
    )
}

export default App
