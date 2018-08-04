const defaultOptions = {
    frequency: 60
};

class Gyro extends EventTarget {
    constructor(options = {}) {
        super();
        this.config = {};
        Object.keys(defaultOptions).forEach(option => {
            this.config[option] = options[option] || defaultOptions[option];
        });
        this.running = false;
        this.readyToPoll = true;
    }

    _motionReady() {
        return !!window.deviceMotionEvent;
    };

    /**
     * Start emitting data from the sensor
     */
    start() {
       if(!this._motionReady()) {
           // We should be able to get sensor data from the device
           const interval = Math.round(1000 / (30), 0);
           this.intervalTicker = setInterval(() => {
               this.readyToPoll = true;
           }, interval);

           window.addEventListener('devicemotion', (event) => {
               if (this.readyToPoll) {
                   this.dispatchEvent(new CustomEvent('sensorData', {detail: {data: event.rotationRate}}));
                   this.readyToPoll = false;
               }
           });            
       } else {
            // We cannot access the device motion event, so this won't work
            this.dispatchEvent(new CustomEvent('error', { message: 'Could not find window.deviceMotionEvent' }));
            console.error('Could not find window.deviceMotionEvent');
       }
    };
}