import {Vector3, LineCurve3} from "three";

import AnimationBase from "./AnimationBase.js";

class StaticFrame extends AnimationBase {
    constructor(scene, camera) {
        super(scene, camera);

        this.lookDirectionVector = null;
        this.backPoint = null;
        this.point = null;
        this.curve = null;

        this.t = 0
    }

    getLookDirectionVector(yaw, pitch) {
        const x = Math.cos(pitch) * Math.sin(yaw);
        const y = -Math.sin(pitch);
        const z = Math.cos(pitch) * Math.cos(yaw);
        return new Vector3(x, y, z).normalize();
    }

    createPath() {
        this.backPoint = this.point.clone().add(this.lookDirectionVector.multiplyScalar(1));

        this.curve = new LineCurve3(this.backPoint, this.point);
    }

    easeOutQuad(t) {
        return 1 - (1 - t) * (1 - t);
    }

    getDirectionVector() {
        let tangent = this.curve.getTangent(this.t).normalize();
        const point = this.curve.getPoint(this.t);
        return point.add(tangent);
    }

    animate() {
        if (this.t <= 1) {
            this.t += 0.001;
            const pos = this.curve.getPoint(this.easeOutQuad(this.t));
            this.camera.position.copy(pos);

            this.camera.lookAt(this.getDirectionVector());
        }
    }

    getFirstPoint() {
        return this.backPoint;
    }

    setFlightLocation(flightLocation) {
        this.point = new Vector3(flightLocation.x, flightLocation.y, flightLocation.z)
        this.lookDirectionVector = this.getLookDirectionVector(flightLocation.yaw, flightLocation.pitch)
        this.createPath();
        this.t = 0;
    }
}

export default StaticFrame;