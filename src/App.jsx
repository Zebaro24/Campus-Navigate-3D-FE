import {useEffect, useRef, useState} from "react";

import MainLogo from "./components/navigation/MainLogo.jsx";
import NavMenu from "./components/navigation/menu/NavMenu.jsx";
import Overlay from "./components/Overlay.jsx";

import PointerLockHint from "./components/control/PointerLockHint.jsx";
import CameraInfo from "./components/control/CameraInfo.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";

import MainScene from "./canvas/MainScene.js";

import './App.css';
import TeamInfo from "./components/TeamInfo.jsx";

function App() {
    const containerRef = useRef(null);
    const [mainScene] = useState(() => new MainScene());

    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [overlayInformation, setOverlayInformation] = useState(null);
    const [isOnTeamInfo, setIsOnTeamInfo] = useState(false);

    const novMenuAddFunc = {setOverlayInformation, isOnTeamInfo, setIsOnTeamInfo};

    useEffect(() => {
        containerRef.current.appendChild(mainScene.getCanvas());
    }, [mainScene]);

    return (
        <>
            {!isModelLoaded && (
                <LoadingScreen mainScene={mainScene} setIsModelLoaded={setIsModelLoaded}/>
            )}

            <MainLogo/>

            {isModelLoaded && (
                <>
                    <NavMenu mainScene={mainScene} {...novMenuAddFunc}/>
                    <Overlay information={overlayInformation} setInformation={setOverlayInformation}/>
                    <CameraInfo mainScene={mainScene}/>
                    <PointerLockHint/>
                    {isOnTeamInfo && <TeamInfo/>}
                </>
            )}
            <div id="main-scene" ref={containerRef}/>
        </>
    );
}

export default App;
