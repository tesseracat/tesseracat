const _ = require('lodash')

module.exports = class ChannelManager {
  constructor (supervisor) {
    this.supervisor = supervisor
    this.dispatch = supervisor.dispatch

    this.channels = []
  }

  open (devices) {
    let channels = [
      '@iotame/builtins:channels.bluetooth'
    ]

    for (let channel of channels) {
      let constructor = this.supervisor.resolve(channel)
      let constructed = new constructor()
      this.channels.push(constructed)

      constructed.open()
    }
  }
}
