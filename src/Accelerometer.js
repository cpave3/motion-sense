const defaultOptions = {
    frequency: 60
};

const CoreSensor = require('./CoreSensor.js');

class Accelerometer extends CoreSensor {
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
            this.dispatchEvent(new CustomEvent('reading', {detail: {
                acceleration: event.acceleration,
                accelerationIncludingGravity: event.accelerationIncludingGravity
            }}));
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

    
}

module.exports = Accelerometer;
