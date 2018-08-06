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
    }

    isReady() {
        return !!window.deviceMotionEvent;
    };

    /**
     * Start emitting data from the sensor
     */
    start() {
       if(this.isReady()) {
           const { frequency } = this.config;
           // We should be able to get sensor data from the device
           const interval = Math.round(1000 / frequency, 0);
           this.intervalTicker = setInterval(() => {
               this.readyToEmit = true;
           }, interval);

           window.addEventListener('devicemotion', (event) => {
               /**
                * Each time we get data from the sensor, we need to check if it
                * is time to emit a new event yet. This is based on the user-defined
                * frequency passed to the constructor
                */
               if (this.readyToEmit) {
                   this.dispatchEvent(new CustomEvent('read', {detail: {data: event.rotationRate}}));
                   this.readyToEmit = false;
               }
           });            
           this.dispatchEvent(new Event('started'));
       } else {
            // We cannot access the device motion event, so this won't work
            this.dispatchEvent(new CustomEvent('error', { message: 'Could not find window.deviceMotionEvent' }));
            console.error('Could not find window.deviceMotionEvent');
       }
    };

    stop = () => {
        window.removeEventListener('devicemotion');
        this.dispatchEvent(new Event('stopped'));
        clearInterval(this.intervalTicker);
    };
}

module.exports = Gyroscope;
