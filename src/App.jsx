import MainLogo from "./components/navigation/MainLogo.jsx";
import NavMenu from "./components/navigation/menu/NavMenu.jsx";
import Overlay from "./components/Overlay.jsx";

import './App.css'
import {useEffect, useRef, useState} from "react";
import MainScene from "./canvas/MainScene.js";
import CameraInfo from "./components/control/CameraInfo.jsx";
import PointerLockHint from "./components/control/PointerLockHint.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";

function App() {
    const containerRef = useRef(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [mainScene] = useState(() => new MainScene());

    useEffect(() => {
        containerRef.current.appendChild(mainScene.getCanvas());
    }, [mainScene]);

    return (
        <>
            {!isModelLoaded && (
                <LoadingScreen mainScene={mainScene} setIsModelLoaded={setIsModelLoaded} />
            )}

            <MainLogo/>

            {isModelLoaded && (
                <>
                    <NavMenu mainScene={mainScene}/>
                    <CameraInfo mainScene={mainScene}/>
                    <PointerLockHint />
                </>
            )}
            <div id="main-scene" ref={containerRef}/>
        </>
    )
}

export default App
