import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';

class FreeFlyControls {
    normalSpeed = 10; // Стандартна швидкість руху
    boostSpeed = 25; // Пришвидшена швидкість руху

    constructor(camera, domElement) {
        this.camera = camera;
        this.controls = new PointerLockControls(camera, domElement);

        // Стани переміщення
        this.movementState = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false,
            boost: false,
        };

        // Параметри керування
        this.velocity = new THREE.Vector3();
        this.clock = new THREE.Clock();

        this.initEventListeners();
    }

    initEventListeners() {
        // Блокування при натисканні
        setTimeout(() => {
            document.getElementById('main-scene').addEventListener('click', this.lock.bind(this));
        }, 0);

        // Клавіатурні процесори
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    lock() {
        this.controls.lock();
    }

    isLocked() {
        return this.controls.isLocked;
    }

    handleKeyDown(event) {
        if (event.altKey) event.preventDefault();

        switch (event.code) {
            case 'KeyW':
                this.movementState.forward = true;
                break;
            case 'KeyS':
                this.movementState.backward = true;
                break;
            case 'KeyA':
                this.movementState.left = true;
                break;
            case 'KeyD':
                this.movementState.right = true;
                break;
            case 'Space':
                this.movementState.up = true;
                break;
            case 'AltLeft':
            case 'AltRight':
                this.movementState.down = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.movementState.boost = true;
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                this.movementState.forward = false;
                break;
            case 'KeyS':
                this.movementState.backward = false;
                break;
            case 'KeyA':
                this.movementState.left = false;
                break;
            case 'KeyD':
                this.movementState.right = false;
                break;
            case 'Space':
                this.movementState.up = false;
                break;
            case 'AltLeft':
            case 'AltRight':
                this.movementState.down = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.movementState.boost = false;
                break;
        }
    }

    updateMovementVector() {
        this.velocity.set(0, 0, 0);

        // Горизонтальний рух
        if (this.movementState.forward) this.velocity.z += 1;
        if (this.movementState.backward) this.velocity.z -= 1;
        if (this.movementState.left) this.velocity.x -= 1;
        if (this.movementState.right) this.velocity.x += 1;

        // Вертикальний рух
        this.velocity.y = Number(this.movementState.up) - Number(this.movementState.down);
    }

    applyMovement(delta) {
        // Визначаємо поточну швидкість (звичайна або прискорена)
        const currentSpeed = this.movementState.boost ? this.boostSpeed : this.normalSpeed;

        // Нормалізація та масштабування швидкості
        if (this.velocity.lengthSq() > 0) {
            this.velocity.normalize().multiplyScalar(currentSpeed * delta);
        }

        // Застосування переміщення
        this.controls.moveRight(this.velocity.x);
        this.controls.moveForward(this.velocity.z);
        this.camera.position.y += this.velocity.y;
    }

    update() {
        if (!this.isLocked()) return;

        const delta = this.clock.getDelta();

        // Оновлення вектора руху
        this.updateMovementVector();

        // Застосування переміщення
        this.applyMovement(delta);
    }

    getObject() {
        return this.controls.object;
    }
}

export default FreeFlyControls;