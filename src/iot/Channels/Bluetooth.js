module.exports = class Bluetooth {
  open () {
    let noble = require('noble')

    noble.on('stateChange', (state) => {
      if (state == 'poweredOn') {
        noble.startScanning()
      } else {
        console.log("not powered on:", state)
      }
    })
  }
  
  send (protocol, data) {

  }
}