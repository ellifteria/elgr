class KeyStates {
    constructor() {
        this.keyStateMap = new Map();
    }
    initKeyStates(keys) {
        console.log(this.keyStateMap);
        for (const key of keys) {
            this.keyStateMap.set(key.name, { value: false, ifKeydown: key.ifDown });
        }
        console.log(this.keyStateMap);
    }
    static onKeydown(ev, keyStateMap) {
        if (!keyStateMap.keyStateMap.has(ev.code)) {
            return;
        }
        let keyFunction = keyStateMap.keyStateMap.get(ev.code).ifKeydown;
        keyStateMap.keyStateMap.set(ev.code, { value: true, ifKeydown: keyFunction });
    }
    static onKeyup(ev, keyStateMap) {
        if (!keyStateMap.keyStateMap.has(ev.code)) {
            return;
        }
        let keyFunction = keyStateMap.keyStateMap.get(ev.code).ifKeydown;
        keyStateMap.keyStateMap.set(ev.code, { value: false, ifKeydown: keyFunction });
    }
    static callFunctions(keyStateMap) {
        let callerFunction = function (value, key, map) {
            if (value.value) {
                value.ifKeydown();
            }
        };
        keyStateMap.keyStateMap.forEach(callerFunction);
    }
}
