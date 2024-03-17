class MovableCamera{
    public eyeX: number;
    public eyeY: number;
    public eyeZ: number;
    
    public lookAtDistance: number;

    public theta: number;
    public phi: number;

    public movementSpeed: number;
    public facingSpeed: number;

    public lookAtX: number;
    public lookAtY: number;
    public lookAtZ: number;

    constructor(eyeX: number = 0, eyeY: number = 0, eyeZ: number = 0, lookAtDistance: number = 1, theta: number = 0, phi: number = 0, movementSpeed: number = 1, facingSpeed: number = 1) {
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
        this.lookAtY = this.eyeY +this.lookAtDistance * Math.sin(this.theta * Math.PI / 180) * this.lookAtDistance * Math.cos(this.phi * Math.PI / 180);
        this.lookAtZ = this.eyeZ + Math.sin(this.phi * Math.PI / 180)
    }

    updatePosition(x: number, y: number, z: number, absolute: boolean = false) {
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

    updateFacing(theta: number, phi: number, absolute: boolean = false) {
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