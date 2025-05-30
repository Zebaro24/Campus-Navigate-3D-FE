import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import FreeFlyControls from './FreeFlyControls.js';

import PathFollower from "./PathFollower.js";

class MainScene {
    groundSize = 500;  // Размеры земли, которые будут повторяться
    numRepeats = 5;  // Количество повторений земли
    pathModel = import.meta.env.VITE_MODEL_URL

    constructor() {
        this.scene = new THREE.Scene();

        this.camera = null
        this.renderer = null

        this.createRender()
        this.createCamera()
        this.createGround(this.groundSize, this.numRepeats)
        this.createLight()
        this.loadModel(this.pathModel)

        this.componentLoadFunc = null


        // Example usage (in your main_canvas.js):
        // Define some path points
        const pathPoints = [
            new THREE.Vector3(-20, 0, 25),
            new THREE.Vector3(35, 0, 35),
            new THREE.Vector3(80, 0, -5),
            new THREE.Vector3(40, 0, -45),
            new THREE.Vector3(0, 0, -90),
            new THREE.Vector3(-35, 0, -65),
            new THREE.Vector3(-95, 0, -65),
            new THREE.Vector3(-100, 0, -10),
            new THREE.Vector3(-70, 0, 30),
            new THREE.Vector3(-20, 0, 25),
        ];

        // Create the PathFollower
        const pathFollower = new PathFollower(this.scene, this.camera, pathPoints, 0.0005, 15);
        pathFollower.updateOrbitVisibility(false);
        pathFollower.setTilt(Math.PI / 4);


        this.animate(/*() => pathFollower.animate()*/)
    }

    getCanvas() {
        return this.renderer.domElement
    }

    createGround(groundSize, numRepeats) {
        this.scene.background = new THREE.Color(0x87CEEB); // Цвет неба (SkyBlue)
        // Создание земли
        const geometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const material = new THREE.MeshBasicMaterial({color: 0x333333, side: THREE.DoubleSide});
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = Math.PI / -2;  // Поворот для горизонтального расположения

        // Создание нескольких "площадок" вокруг камеры
        for (let i = -numRepeats; i <= numRepeats; i++) {
            for (let j = -numRepeats; j <= numRepeats; j++) {
                let newGround = ground.clone();
                newGround.position.set(i * groundSize, 0, j * groundSize);
                this.scene.add(newGround);
            }
        }
    }

    createLight() {
        // Основное окружение
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
        this.scene.add(ambientLight);

        // Основной направленный свет (солнце)
        const sunLight = new THREE.DirectionalLight(0xfff4e6, 1.2);
        sunLight.position.set(10, 15, 10);
        sunLight.castShadow = true;

        // Настройки теней для реалистичности
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -20;
        sunLight.shadow.camera.right = 20;
        sunLight.shadow.camera.top = 20;
        sunLight.shadow.camera.bottom = -20;
        sunLight.shadow.bias = -0.001;
        this.scene.add(sunLight);

        // Заполняющий свет для смягчения теней
        const fillLight = new THREE.DirectionalLight(0xccf0ff, 0.3);
        fillLight.position.set(-5, 10, -5);
        this.scene.add(fillLight);

        // Свет с задней стороны для контуров зданий
        const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
        backLight.position.set(-10, 5, -10);
        this.scene.add(backLight);

        // Теплый свет от земли (отраженный свет)
        const groundLight = new THREE.HemisphereLight(0xfff1cf, 0x2a2a40, 0.3);
        this.scene.add(groundLight);
    }

    loadModel(pathModel) {
        // Настройка загрузчика DRACO
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // Путь к декодеру Draco
        loader.setDRACOLoader(dracoLoader);

        loader.load(pathModel, (gltf) => {
            console.log('Модель успешно загружена!');
            const model = gltf.scene;
            model.position.set(0, 0, 0);
            this.scene.add(model);
            this.componentLoadFunc && this.componentLoadFunc(101)
        }, (xhr) => {
            const percent = Math.floor((xhr.loaded / xhr.total) * 100);

            this.componentLoadFunc && this.componentLoadFunc(percent)
        }, (error) => {
            console.error('Ошибка загрузки модели:', error);
        });
    }

    setComponentLoadFunc(func) {
        this.componentLoadFunc = func
    }

    animate(animateFunc) {
        const loop = () => {
            requestAnimationFrame(loop);

            if (this.freeFlyControls) {
                this.freeFlyControls.update();
            }

            if (animateFunc) {
                animateFunc();
            }

            this.renderer.render(this.scene, this.camera);
        };
        loop();
    }

    createRender() {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 150);
        this.camera.position.set(0, 30, 30);

        this.freeFlyControls = new FreeFlyControls(this.camera, document.body);
        this.scene.add(this.freeFlyControls.getObject());

        // Обновление размера экрана
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setAnimation (flightLocation) {
        console.log("ms", flightLocation)
    }
}

export default MainScene;