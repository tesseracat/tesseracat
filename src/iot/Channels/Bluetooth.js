module.exports = class Bluetooth {
  open () {
    let noble = require('noble')

    noble.on('stateChange', (state) => {
      if (state == 'poweredOn') {
        console.log("scanning")
      } else {
        console.log("not powered on:", state)
      }
    })
  }
  
  send (protocol, data) {

  }
}