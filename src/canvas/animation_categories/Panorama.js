import {Vector3} from "three";

import AnimationBase from "./AnimationBase.js";

class Panorama extends AnimationBase {
    constructor(scene, camera) {
        super(scene, camera);

        this.coords = null;
        this.pitch = null;
        this.speed = null;

        this.t = 0;
    }

    getDirectionVector() {
        const lookAtX = this.coords.x + Math.sin(this.t);
        const lookAtY = this.coords.y + Math.tan(this.pitch);
        const lookAtZ = this.coords.z + Math.cos(this.t);
        return new Vector3(lookAtX, lookAtY, lookAtZ);
    }

    animate() {
        if (!this.coords) return;
        this.camera.position.set(this.coords.x, this.coords.y, this.coords.z);

        this.t += this.speed;
        if (this.t > Math.PI * 2) this.t -= Math.PI * 2;

        this.camera.lookAt(this.getDirectionVector());
    }

    getFirstPoint() {
        return new Vector3(this.coords.x, this.coords.y, this.coords.z);
    }

    setFlightLocation(flightLocation) {
        this.coords = {
            x: flightLocation.x,
            y: flightLocation.y,
            z: flightLocation.z
        };

        this.pitch = flightLocation['camera_pitch'];
        this.speed = flightLocation.speed * 0.001;
        this.t = 0;
    }
}

export default Panorama;