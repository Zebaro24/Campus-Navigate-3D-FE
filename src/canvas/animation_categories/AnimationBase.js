class AnimationBase {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;

        if (!this.scene || !this.camera) {
            throw new Error(`Клас ${this.constructor.name} должен содержать сцену и анимацию`);
        }
    }

    getDirectionVector() {
    }

    animate() {
    }

    setFlightLocation(flightLocation) {
        if (!flightLocation) console.log("Метод должен содержать 'flightLocation'")
        throw new Error("Вызван не переопределенный метод 'setFlightLocation'");
    }

    getFirstPoint() {
        throw new Error("Вызван не переопределенный метод 'getFirstPoint'");
    }

    getFirstDirectionVector() {
        return this.getDirectionVector();
    }

    getAnimationFunc() {
        return this.animate.bind(this);
    }
}

export default AnimationBase;