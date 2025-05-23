import * as THREE from "three";

class PathFollower {
    constructor(scene, camera, pathPoints, speed = 0.01, height = 5, lookFromOutside = true, tilt = 0) {
        this.scene = scene;
        this.camera = camera;
        this.speed = speed;
        this.height = height;
        this.t = 0;
        this.orbitVisible = true;
        this.orbit = null;
        this.pathPoints = pathPoints;
        this.lookFromOutside = lookFromOutside; // true = look inward
        this.tilt = tilt; // angle in radians (e.g., Math.PI/8 to look slightly up)
        this.createPath();
    }

    createPath() {
        this.curve = new THREE.CatmullRomCurve3(this.pathPoints);
        this.curve.curveType = 'catmullrom';
        this.curve.tension = 0.5;

        const points = this.curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        this.orbit = new THREE.Line(geometry, material);
        this.orbit.position.y = this.height;
        this.scene.add(this.orbit);
    }

    updateOrbitVisibility(visible) {
        this.orbitVisible = visible;
        this.orbit.visible = visible;
    }

    setLookDirection(outside) {
        this.lookFromOutside = outside;
    }

    setTilt(radians) {
        this.tilt = radians;
    }

    animate() {
        this.t += this.speed;
        if (this.t > 1) this.t = 0;

        const point = this.curve.getPoint(this.t);
        const tangent = this.curve.getTangent(this.t).normalize();

        // Calculate perpendicular direction in XZ plane
        const perp = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        if (!this.lookFromOutside) perp.negate();

        const cameraOffset = perp.clone().multiplyScalar(10); // Distance from path
        cameraOffset.y = this.height;

        this.camera.position.copy(point.clone().add(cameraOffset));

        // Create tilt direction (based on desired vertical angle)
        const lookTarget = point.clone().add(tangent.clone().multiplyScalar(1));
        lookTarget.y += Math.tan(this.tilt) * 10;

        this.camera.lookAt(lookTarget);
    }
}

export default PathFollower;