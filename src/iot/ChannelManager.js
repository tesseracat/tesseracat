let Bluetooth = require('./Channels/Bluetooth')

module.exports = class ChannelManager {
  constructor (dispatch) {
    this.dispatch = dispatch

    this.channels = []
  }

  open () {
    let bluetooth = new Bluetooth()
    bluetooth.open()

    this.channels.push(bluetooth)
  }
}
