import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import FreeFlyControls from './FreeFlyControls.js';

import PathFollower from "./PathFollower.js";

class MainScene {
    groundSize = 500;  // Размеры земли, которые будут повторяться
    numRepeats = 5;  // Количество повторений земли
    pathModel = '/api/active-model-file/'

    constructor() {
        this.scene = new THREE.Scene();

        this.camera = null
        this.renderer = null

        this.createRender()
        this.createCamera()
        this.createGround(this.groundSize, this.numRepeats)
        this.createLight()
        this.loadModel(this.pathModel)


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
        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    loadModel(pathModel) {
        // Настройка загрузчика DRACO
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // Путь к декодеру Draco
        loader.setDRACOLoader(dracoLoader);

        // Загрузка модели
        loader.load(pathModel, (gltf) => {
            console.log('Модель успешно загружена!');
            const model = gltf.scene;
            this.scene.add(model);
            model.position.set(0, 0, 0);
        }, (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }, (error) => {
            console.error('Ошибка загрузки модели:', error);
        });
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
}

export default MainScene;