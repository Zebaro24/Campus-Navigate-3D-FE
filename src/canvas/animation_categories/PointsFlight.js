import {CatmullRomCurve3, BufferGeometry, LineBasicMaterial, Line, Vector3} from "three";
import AnimationBase from "./AnimationBase.js";

class PointsFlight extends AnimationBase{
    constructor(scene, camera) {
        super(scene, camera);

        this.speed = null;
        this.pitch = null;
        this.lookDirection = null;

        this.t = 0;
    }

    createPath(pathPoints) {
        this.curve = new CatmullRomCurve3(pathPoints, true);
        this.curve.curveType = 'catmullrom';
        this.curve.tension = 0.5;
    }

    createOrbitVisibility() {
        const points = this.curve.getPoints(200);
        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new LineBasicMaterial({color: 0xff0000});
        const orbit = new Line(geometry, material);
        this.scene.add(orbit);
    }

    getDirectionVector(point){
        if (!point) {
            point = this.curve.getPoint(this.t);
        }

        let tangent = this.curve.getTangent(this.t).normalize().multiplyScalar(1);

        if (this.lookDirection === 'outside' || this.lookDirection === 'inside') {
            tangent = new Vector3(-tangent.z, 0, tangent.x).normalize();
        }
        if (this.lookDirection === 'inside') {
            tangent.negate();
        } // direction

        const lookTarget = point.add(tangent);

        lookTarget.y += Math.tan(this.pitch);
        return lookTarget;
    }

    animate() {
        this.t += this.speed;
        if (this.t > 1) this.t = 0;

        const point = this.curve.getPoint(this.t);

        this.camera.position.copy(point);
        this.camera.lookAt(this.getDirectionVector(point));
    }

    setFlightLocation(flightLocation) {
        const pathPoints = flightLocation['flight_points'].map(point => new Vector3(point.x, point.y, point.z))

        this.createPath(pathPoints);
        this.lookDirection = flightLocation['camera_view_direction']
        this.pitch = flightLocation['camera_pitch']
        this.speed = flightLocation['speed'] * 0.0001;
        this.t = 0;

        // this.createOrbitVisibility();
    }

    getFirstPoint() {
        return this.curve.getPoint(0);
    }

    getFirstDirectionVector() {
        return this.getDirectionVector();
    }
}

export default PointsFlight;