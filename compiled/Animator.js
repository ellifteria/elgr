function clamp(value, min, max) {
    if (max < min) {
        console.log("exception in clamp: max cannot be less than min");
        return [value, 0];
    }
    let direction;
    if (value <= min) {
        value = min;
        direction = 1;
    }
    if (value >= max) {
        value = max;
        direction = -1;
    }
    return [value, direction];
}
class Animator {
    constructor() {
        this.startTime = Date.now();
        this.lastTime = this.startTime;
        this.animations = new Map();
    }
    addAnimation(animationName, animationState) {
        this.animations.set(animationName, animationState);
    }
    animate() {
        let currentTime = Date.now();
        let timeDelta = currentTime - this.lastTime;
        let animatorFunction = (value, key, map) => {
            let newAnimationState = value.update(currentTime, timeDelta / 1000, value);
            map.set(key, newAnimationState);
        };
        this.animations.forEach(animatorFunction);
        this.lastTime = currentTime;
    }
    getValue(animationName) {
        return this.animations.get(animationName).value;
    }
}
