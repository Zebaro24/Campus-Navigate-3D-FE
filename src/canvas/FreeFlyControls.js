import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

class FreeFlyControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.controls = new PointerLockControls(camera, domElement);

        // Состояния перемещения
        this.movementState = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false
        };

        // Векторы для расчета движения
        this.velocity = new THREE.Vector3();
        this.speed = 20;
        this.clock = new THREE.Clock();

        this.initEventListeners();
    }

    getObject() {
        return this.controls.getObject();
    }

    lock() {
        this.controls.lock();
    }

    isLocked() {
        return this.controls.isLocked;
    }

    initEventListeners() {
        // Блокировка при клике
        document.addEventListener('click', this.lock.bind(this));

        // Обработчики клавиш
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        switch (event.code) {
            case 'KeyW': this.movementState.forward = true; break;
            case 'KeyS': this.movementState.backward = true; break;
            case 'KeyA': this.movementState.left = true; break;
            case 'KeyD': this.movementState.right = true; break;
            case 'Space': this.movementState.up = true; break;
            case 'ShiftLeft': this.movementState.down = true; break;
        }
    }

    handleKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.movementState.forward = false; break;
            case 'KeyS': this.movementState.backward = false; break;
            case 'KeyA': this.movementState.left = false; break;
            case 'KeyD': this.movementState.right = false; break;
            case 'Space': this.movementState.up = false; break;
            case 'ShiftLeft': this.movementState.down = false; break;
        }
    }

    updateMovementVector() {
        this.velocity.set(0, 0, 0);

        // Горизонтальное движение
        if (this.movementState.forward) this.velocity.z += 1;
        if (this.movementState.backward) this.velocity.z -= 1;
        if (this.movementState.left) this.velocity.x -= 1;
        if (this.movementState.right) this.velocity.x += 1;

        // Вертикальное движение
        this.velocity.y = Number(this.movementState.up) - Number(this.movementState.down);
    }

    applyMovement(delta) {
        // Нормализация и масштабирование скорости
        if (this.velocity.lengthSq() > 0) {
            this.velocity.normalize().multiplyScalar(this.speed * delta);
        }

        // Применение перемещения
        this.controls.moveRight(this.velocity.x);
        this.controls.moveForward(this.velocity.z);
        this.camera.position.y += this.velocity.y;
    }

    update() {
        if (!this.isLocked()) return;

        const delta = this.clock.getDelta();

        // Обновление вектора движения
        this.updateMovementVector();

        // Применение перемещения
        this.applyMovement(delta);
    }
}

export default FreeFlyControls;