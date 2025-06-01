import PointsFlight from "./animation_categories/PointsFlight.js";
import StaticFrame from "./animation_categories/StaticFrame.js";
import Panorama from "./animation_categories/Panorama.js";
import {Vector3} from "three";
import {Group, Tween, Easing} from "@tweenjs/tween.js";

class AnimationHandler {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.activeAnimation = () => {};
        this.animationFunc = () => { this.activeAnimation() };

        this.staticFrame = new StaticFrame(this.scene, this.camera);
        this.pointsFlight = new PointsFlight(this.scene, this.camera);
        this.panorama = new Panorama(this.scene, this.camera);
    }

    getAnimationFunc() {
        return this.animationFunc;
    }

    setAnimation(flightLocation) {
        console.log(flightLocation)

        /** @type {AnimationBase} **/
        let animationCategory = null;
        switch (flightLocation['flight_type']) {
            case 'static_frame':
                animationCategory = this.staticFrame;
                break;
            case 'points_flight':
                animationCategory = this.pointsFlight;
                break;
            case 'panorama':
                animationCategory = this.panorama;
                break;
            default:
                this.animationFunc = () => {}
                return
        }

        animationCategory.setFlightLocation(flightLocation)

        const currentPosition = this.camera.position.clone();
        let currentDirection = new Vector3();
        this.camera.getWorldDirection(currentDirection);
        currentDirection = currentPosition.clone().add(currentDirection);

        const group = new Group();
        const tweenPosition = new Tween(currentPosition)
            .to(animationCategory.getFirstPoint(), 2000) // 2 секунды
            .easing(Easing.Quadratic.Out)
            .onUpdate(() => {
                this.camera.position.copy(currentPosition);
            })
            .onComplete(() => {
                this.activeAnimation = animationCategory.getAnimationFunc()
            })

        const tweenDirection = new Tween(currentDirection)
            .to(animationCategory.getFirstDirectionVector(), 2000) // 2 секунды
            .easing(Easing.Quadratic.Out)
            .onUpdate(() => {
                this.camera.lookAt(currentDirection);
            })
            .onComplete(() => {})


        group.add(tweenPosition);
        group.add(tweenDirection);
        tweenPosition.start();
        tweenDirection.start();
        this.activeAnimation = () => group.update()
    }
}

export default AnimationHandler;