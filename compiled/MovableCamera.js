class MovableCamera {
    constructor(eyeX = 0, eyeY = 0, eyeZ = 0, lookAtDistance = 1, theta = 0, phi = 0, movementSpeed = 1, facingSpeed = 1) {
        this.eyeX = eyeX;
        this.eyeY = eyeY;
        this.eyeZ = eyeZ;
        this.lookAtDistance = lookAtDistance;
        this.theta = theta;
        this.phi = phi;
        this.movementSpeed = movementSpeed;
        this.facingSpeed = facingSpeed;
        this.computeLookAt();
    }
    computeLookAt() {
        this.lookAtX = this.eyeX + this.lookAtDistance * Math.cos(this.theta * Math.PI / 180) * Math.cos(this.phi * Math.PI / 180);
        this.lookAtY = this.eyeY + this.lookAtDistance * Math.sin(this.theta * Math.PI / 180) * this.lookAtDistance * Math.cos(this.phi * Math.PI / 180);
        this.lookAtZ = this.eyeZ + Math.sin(this.phi * Math.PI / 180);
    }
    updatePosition(x, y, z, absolute = false) {
        if (absolute) {
            this.eyeX += x;
            this.eyeY += y;
            this.eyeZ += z;
            this.computeLookAt();
            return;
        }
        let dCos = this.movementSpeed * Math.cos(this.theta * Math.PI / 180) * Math.cos(this.phi * Math.PI / 180);
        let dSin = Math.sin(this.theta * Math.PI / 180) * Math.cos(this.phi * Math.PI / 180);
        this.eyeX += this.movementSpeed * (x * dCos - y * dSin);
        this.eyeY += this.movementSpeed * (x * dSin + y * dCos);
        this.eyeZ += this.movementSpeed * x * Math.sin(this.phi * Math.PI / 180);
        this.computeLookAt();
    }
    updateFacing(theta, phi, absolute = false) {
        if (absolute) {
            this.theta += theta;
            this.phi += phi;
            this.computeLookAt();
            return;
        }
        this.theta += theta * this.facingSpeed;
        this.phi += phi * this.facingSpeed;
        this.computeLookAt();
    }
}
