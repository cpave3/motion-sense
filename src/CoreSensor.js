class CoreSensor {
    constructor() {
        const delegate = document.createDocumentFragment();
        [
          'addEventListener',
          'dispatchEvent',
          'removeEventListener'
        ].forEach(f =>
          this[f] = (...xs) => delegate[f](...xs)
        )
  }
    /**
     * These closures will fire when their keyed event happens
     */
    internals() {
        const events = {
            started: event => {
                this.running = true;
            },
            stopped: event => {
                this.running = false;
            }
        };

        Object.keys(events).forEach(eventName => {
            this.addEventListener(eventName, events[eventName]);
        });
    };

    isReady() {
        return !!window.DeviceMotionEvent;
    };

    /**
     * This method sets the desired number of sensor reads per second
     * @param {number} newFrequency 
     */
    setFrequency(newFrequency) {
        this.config.frequency = newFrequency;
        if (this.running) {
            this.initClock();
        }
    }

    /**
     * This method is used to start the internal timer upon which the sensor readings depend
     */
    initClock() {
        const { frequency } = this.config;
        if (this.intervalTicker) {
            clearInterval(this.intervalTicker);
        }
        this.readyToEmit = false;
        // We should be able to get sensor data from the device
        const interval = Math.round(1000 / frequency);
        this.intervalTicker = setInterval(() => {
            this.readyToEmit = true;
        }, interval);
    }
}

module.exports = CoreSensor;
