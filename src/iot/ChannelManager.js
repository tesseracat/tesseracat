let _ = require('lodash')

module.exports = class ChannelManager {
  constructor (supervisor, dispatch) {
    this.supervisor = supervisor
    this.dispatch = dispatch

    this.channels = []
  }

  open (devices) {
    // console.log(this.supervisor.resolve('@iotame/builtins.channels.bluetooth'))
  }
}
