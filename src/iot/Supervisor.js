let logger = require('winston')
let Promise = require('bluebird')

let ExtensionManager = require('./Extensions/ExtensionManager')
let ChannelManager = require('./Channels/ChannelManager')
let DeviceManager = require('./Devices/DeviceManager')
let HookManager = require('./Hooks/HookManager')

let Action = require('./Hooks/Action')
let Filter = require('./Hooks/Filter')

module.exports = class Supervisor {
  boot () {
    return new Promise((r, j) => this._start(r, j))
  }

  stop () {
    // Tear down everything important
  }

  _start (resolve, reject) {
    // Generate a hook manager and receive its dispatcher function
    this.hooks = new HookManager(this)
    let dispatcher = this.hooks.dispatcher()

    this.hooks.add(... this._channelHandlers())   // Add channel handler hooks
    this.hooks.add(... this._generalHooks())      // Add general hooks

    // Generate an extension manager and register it
    this.extensions = new ExtensionManager(dispatcher)
    this.extensions.register()

    this.hooks.add(... this.extensions.hooks())   // Add extension hooks

    // Generate a devices manager and boot it up
    this.devices = new DeviceManager(dispatcher)
    this.devices.greet()

    // Generate a channel manager and open channels needed by our devices
    this.channels = new ChannelManager(dispatcher)
    this.channels.open(this.devices.list())

    this.ready = true
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
