type AnimationState = {
    value: number;
    rate: number;
    variables: any;
    update: (currentTime: number, scaledTimeDelta: number, animation: AnimationState) => AnimationState;
}

function clamp(value: number, min: number, max: number): [number, number] {
	if (max < min) {
	    console.log("exception in clamp: max cannot be less than min");
	    return [value, 0];
	}

    let direction: number;

	if (value <= min){
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
    public startTime: number;
    public lastTime: number;
    public animations: Map<string, AnimationState>;

    constructor() {
        this.startTime = Date.now();
        this.lastTime = this.startTime;
        this.animations = new Map<string, AnimationState>();
    }

    addAnimation(animationName: string, animationState: AnimationState) {
        this.animations.set(animationName, animationState);
    }

    animate() {
        let currentTime = Date.now();
        let timeDelta = currentTime - this.lastTime;

        let animatorFunction = (value: AnimationState, key: string, map: Map<string, AnimationState>) => {
            let newAnimationState = value.update(currentTime, timeDelta / 1000, value);

            map.set(key, newAnimationState);
        }

        this.animations.forEach(animatorFunction);

        this.lastTime = currentTime;
    }

    getValue(animationName: string): number {
        return this.animations.get(animationName).value;
    }
}