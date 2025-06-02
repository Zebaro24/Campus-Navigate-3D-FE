import {Group, Tween, Easing} from "@tweenjs/tween.js";
import {Vector3} from "three";

import PointsFlight from "./animation_categories/PointsFlight.js";
import StaticFrame from "./animation_categories/StaticFrame.js";
import Panorama from "./animation_categories/Panorama.js";

class AnimationHandler {
    duration_load = 2000; // Час анімації підльоту до позиції

    constructor(scene, camera) {

        this.scene = scene;
        this.camera = camera;

        this.activeAnimation = this.noop;

        this.staticFrame = new StaticFrame(this.scene, this.camera);
        this.pointsFlight = new PointsFlight(this.scene, this.camera);
        this.panorama = new Panorama(this.scene, this.camera);
    }

    noop() {
    }

    animationFunc() {
        this.activeAnimation();
    }

    getAnimationFunc() {
        return this.animationFunc.bind(this);
    }

    setAnimation(flightLocation) {
        console.log(flightLocation);

        const animationsMap = {
            static_frame: this.staticFrame,
            points_flight: this.pointsFlight,
            panorama: this.panorama,
        };

        const animationCategory = animationsMap[flightLocation['flight_type']];
        if (!animationCategory) {
            this.activeAnimation = this.noop;
            return;
        }

        animationCategory.setFlightLocation(flightLocation);

        const pos = this.camera.position.clone();
        const dir = pos.clone().add(this.camera.getWorldDirection(new Vector3()));
        const current = {pos, dir};

        const target = {
            pos: animationCategory.getFirstPoint(),
            dir: animationCategory.getFirstDirectionVector(),
        };

        const group = new Group();
        const tween = new Tween(current)
            .to(target, this.duration_load)
            .easing(Easing.Quadratic.Out)
            .onUpdate(() => {
                this.camera.position.copy(current.pos);
                this.camera.lookAt(current.dir);
            })
            .onComplete(() => {
                this.activeAnimation = animationCategory.getAnimationFunc();
            });

        group.add(tween);
        tween.start();
        this.activeAnimation = () => group.update();
    }
}

export default AnimationHandler;