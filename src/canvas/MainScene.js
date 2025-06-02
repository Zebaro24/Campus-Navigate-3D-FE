import * as THREE from 'three';

import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import AnimationHandler from "./AnimationHandler.js";
import FreeFlyControls from './FreeFlyControls.js';

class MainScene {
    pathModel = import.meta.env.VITE_MODEL_URL;
    groundSize = 500;  // Розміри землі, які будуть повторюватися
    numRepeats = 5;  // Кількість повторень землі

    constructor() {
        this.scene = new THREE.Scene();

        this.renderer = null;
        this.camera = null;
        this.animationHandler = null;
        this.animationFunc = null;
        this.componentLoadFunc = null;

        this.createRender();
        this.createCamera();
        this.createAnimation();
        this.createGround(this.groundSize, this.numRepeats);
        this.createLight();
        this.loadModel(this.pathModel);
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

        // Оновлення розміру екрана
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createAnimation() {
        this.animationHandler = new AnimationHandler(this.scene, this.camera);
        this.animationFunc = this.animationHandler.getAnimationFunc();
    }

    createGround(groundSize, numRepeats) {
        this.scene.background = new THREE.Color(0x87CEEB);
        // Створення землі
        const geometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const material = new THREE.MeshBasicMaterial({color: 0x333333, side: THREE.DoubleSide});
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = Math.PI / -2;

        // Створення декількох "майданчиків" навколо камери
        for (let i = -numRepeats; i <= numRepeats; i++) {
            for (let j = -numRepeats; j <= numRepeats; j++) {
                let newGround = ground.clone();
                newGround.position.set(i * groundSize, 0, j * groundSize);
                this.scene.add(newGround);
            }
        }
    }

    createLight() {
        // Основне оточення
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
        this.scene.add(ambientLight);

        // Основне спрямоване світло (сонце)
        const sunLight = new THREE.DirectionalLight(0xfff4e6, 1.2);
        sunLight.position.set(10, 15, 10);

        // Налаштування тіней для реалістичності
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

        // Заповнювальне світло для пом'якшення тіней
        const fillLight = new THREE.DirectionalLight(0xccf0ff, 0.3);
        fillLight.position.set(-5, 10, -5);
        this.scene.add(fillLight);

        // Світло із заднього боку для контурів будівель
        const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
        backLight.position.set(-10, 5, -10);
        this.scene.add(backLight);

        // Тепле світло від землі (відбите світло)
        const groundLight = new THREE.HemisphereLight(0xfff1cf, 0x2a2a40, 0.3);
        this.scene.add(groundLight);
    }

    loadModel(pathModel) {
        // Налаштування навантажувача DRACO
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // Шлях до декодера Draco
        loader.setDRACOLoader(dracoLoader);

        loader.load(pathModel, (gltf) => {
            console.log('✅ Модель успішно завантажено!');
            const model = gltf.scene;
            model.position.set(0, 0, 0);
            this.scene.add(model);
            this.animate();
            this.componentLoadFunc && this.componentLoadFunc(101);
        }, (xhr) => {
            const percent = Math.floor((xhr.loaded / xhr.total) * 100);

            this.componentLoadFunc && this.componentLoadFunc(percent);
        }, (error) => {
            console.error('⛔ Помилка завантаження моделі:', error);
        });
    }

    animate() {
        const loop = () => {
            requestAnimationFrame(loop);

            if (this.freeFlyControls) {
                this.freeFlyControls.update();
            }

            if (!this.freeFlyControls.isLocked() && this.animationFunc) {
                this.animationFunc();
            }

            this.renderer.render(this.scene, this.camera);
        };
        loop();
    }

    setComponentLoadFunc(func) {
        this.componentLoadFunc = func;
    }

    setAnimation(flightLocation) {
        this.animationHandler && this.animationHandler.setAnimation(flightLocation);
    }

    getCanvas() {
        return this.renderer.domElement;
    }
}

export default MainScene;