const defaultOptions = {
    frequency: 60
};

const CoreSensor = require('./CoreSensor.js');

class Gyroscope extends CoreSensor {
    constructor(options = {}) {
        super();
        this.config = {};
        Object.keys(defaultOptions).forEach(option => {
            this.config[option] = options[option] || defaultOptions[option];
        });
        this.readyToEmit = true;
        this.running = false;
        this.internals();
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
     * This method handles the data coming from the DeviceMotionEvent
     * @param {DeviceMotionEvent} event 
     */
    handleDeviceMotion(event) {
        /**
         * Each time we get data from the sensor, we need to check if it
         * is time to emit a new event yet. This is based on the user-defined
         * frequency passed to the constructor
         */
        if (this.readyToEmit) {
            this.dispatchEvent(new CustomEvent('reading', {detail: {rotationRate: event.rotationRate}}));
            this.readyToEmit = false;
        }
    };   

    /**
     * This method checks if the device is ready and starts reading data at the requested frequency
     */
    start() {
       if(this.isReady()) {
           this.initClock();
           window.addEventListener('devicemotion', event => this.handleDeviceMotion(event));         
           this.dispatchEvent(new Event('started'));
       } else {
            // We cannot access the device motion event, so this won't work
            this.dispatchEvent(new CustomEvent('error', { message: 'Could not find window.deviceMotionEvent' }));
            console.error('Could not find window.deviceMotionEvent');
       }
    };

    /**
     * This method removes the event listener and stops the flow of data from the sensor
     */
    stop() {
        window.removeEventListener('devicemotion', event => this.handleDeviceMotion(event));
        this.dispatchEvent(new Event('stopped'));
        clearInterval(this.intervalTicker);
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

module.exports = Gyroscope;
