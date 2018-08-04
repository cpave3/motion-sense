const defaultOptions = {
    frequency: 60
};

class Gyroscope extends EventTarget() {
    constructor(options = {}) {
        this.config = {};
        Object.keys(defaultOptions).forEarch(option => {
            this.config[option] = options[option] || defaultOptions[option];
        });
    }
}
