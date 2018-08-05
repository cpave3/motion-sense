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
}

module.exports = CoreSensor;
