let logger = require('winston')
let Promise = require('bluebird')

let ExtensionManager = require('./ExtensionManager')
let ChannelManager = require('./ChannelManager')
let DeviceManager = require('./DeviceManager')
let HookManager = require('./HookManager')

let Action = require('./Hooks/Action')
let Filter = require('./Hooks/Filter')

module.exports = class Supervisor {
  constructor (redis) {
    this.redis = redis
  }

  boot () {
    return new Promise((resolve, reject) => {
      // Generate a hook manager and receive its dispatcher function
      this.hooks = new HookManager(this)
      let dispatch = this.hooks.dispatcher()

      this.hooks.add(... this._channelHandlers())   // Add channel handler hooks
      this.hooks.add(... this._generalHooks())      // Add general hooks

      // Generate an extension manager and register it
      this.extensions = new ExtensionManager(dispatch)
      this.extensions.register()

      // Add extension hooks
      this.hooks.add(... this.extensions.hooks())

      // Generate a devices manager and boot it up
      this.devices = new DeviceManager(dispatch)
      this.devices.greet()

      // Generate a channel manager and open channels needed by our devices
      this.channels = new ChannelManager(dispatch)
      this.channels.open(this.devices.list())

      this.ready = true

      dispatch('iotame.supervisor.ready')
      resolve()
    })
  }

  stop () {
    // Tear down everything important
  }

  _channelHandlers () {
    return []
  }

  _generalHooks () {
    return [
      (new Filter()).on('devicemanager.greeting')
    ]
  }
}
