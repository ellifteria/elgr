type KeyState = {
    value: boolean;
    ifKeydown: Function;
}

class KeyStates {
    public keyStateMap: Map<string, KeyState>;

	constructor() {
        this.keyStateMap = new Map<string, KeyState>();
    }

    initKeyStates(keys: {name: string, ifDown: Function}[]) {
        console.log(this.keyStateMap);
        for(const key of keys) {
            this.keyStateMap.set(key.name, {value: false, ifKeydown: key.ifDown});
        }

        console.log(this.keyStateMap);
    }

    static onKeydown(ev: KeyboardEvent, keyStateMap) {
        if (!keyStateMap.keyStateMap.has(ev.code)) {return;}

        let keyFunction = keyStateMap.keyStateMap.get(ev.code).ifKeydown;

        keyStateMap.keyStateMap.set(ev.code, {value: true, ifKeydown: keyFunction});
    }

    static onKeyup(ev: KeyboardEvent, keyStateMap) {
        if (!keyStateMap.keyStateMap.has(ev.code)) {return;}

        let keyFunction = keyStateMap.keyStateMap.get(ev.code).ifKeydown;

        keyStateMap.keyStateMap.set(ev.code, {value: false, ifKeydown: keyFunction});
    }

    static callFunctions(keyStateMap) {
        let callerFunction = function(value: KeyState, key: string, map: Map<string, KeyState>) {
            if (value.value) {
                value.ifKeydown();
            }
        }

        keyStateMap.keyStateMap.forEach(callerFunction);
    }
}