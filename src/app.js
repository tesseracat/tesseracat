const Promise = require('bluebird')

const ExtensionManager = require('./iot/ExtensionManager')
const ChannelManager = require('./iot/ChannelManager')
const DeviceManager = require('./iot/DeviceManager')
const HookDispatcher = require('./iot/HookDispatcher')
const logger = require('./Logger')
const { app: Koa, router: Router } = require('./koa')

const { Mutator, Filter, Action } = require('@iotame/api')

class Container {
  constructor (logger) {
    this.logger = logger
    this.state = {}
  }

  async boot () {
    // Generate a hook manager and receive its dispatcher function
    this.hooks = new HookDispatcher()
    this.dispatch = this.hooks.dispatcher()

    this.hooks.add(... this._channelHandlers())   // Add channel handler hooks
    this.hooks.add(... this._generalHooks())      // Add general hooks

    // Generate an extension manager and register it
    this.extensions = new ExtensionManager(this)
    this.extensions.register()

    // Add extension hooks
    this.hooks.add(... this.extensions.hooks())

    // Generate a devices manager and boot it up
    this.devices = new DeviceManager(this)
    this.devices.reload()

    // Generate a channel manager and open channels needed by our devices
    this.channels = new ChannelManager(this)

    Router.get('/extensions.js', this.extensions.extensionsScript)

    const port = 3030
    this.http = Koa.listen(port)
    logger.info('Koa application started on http://localhost:%d', port)
    // TODO: Pass down dispatch function to Koa

    this.ready = true

    // console.log(this.resolve('@iotame/builtins:devices.thermostat'))

    return this.dispatch('iotame.supervisor.ready')
  }

  stop () {
    this.http.close()
  }

  resolve (name) {
    return this.extensions.resolve(name)
  }

  _channelHandlers () {
    return []
  }

  _generalHooks () {
    return [
      // Reload devices in device manager when a new device was registered
      (new Action()).on('device.registered').do(() => { this.devices.reload() }),

      // ...
    ]
  }
}

const container = new Container(logger)
module.exports = container
