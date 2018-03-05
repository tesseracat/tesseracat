const _ = require('lodash')

module.exports = class ChannelManager {
  constructor (supervisor) {
    this.supervisor = supervisor
    this.dispatch = supervisor.dispatch

    this.channels = []
  }

  open (devices) {
    // console.log(this.supervisor.resolve('@iotame/builtins.channels.bluetooth'))
  }
}
