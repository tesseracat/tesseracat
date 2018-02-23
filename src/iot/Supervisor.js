const Promise = require('bluebird')

const ExtensionManager = require('./ExtensionManager')
const ChannelManager = require('./ChannelManager')
const DeviceManager = require('./DeviceManager')
const HookManager = require('./HookManager')
const logger = require('../Logger')
const Koa = require('../koa')

const { Mutator, Filter } = require('@iotame/api')

module.exports = class Supervisor {
  constructor (logger, redis) {
    this.redis = redis
  }

  async boot () {
    // Generate a hook manager and receive its dispatcher function
    this.hooks = new HookManager(this)
    let dispatch = this.hooks.dispatcher()

    this.hooks.add(... this._channelHandlers())   // Add channel handler hooks
    this.hooks.add(... this._generalHooks())      // Add general hooks

    // Generate an extension manager and register it
    this.extensions = new ExtensionManager(this, dispatch)
    this.extensions.register()

    // Add extension hooks
    this.hooks.add(... this.extensions.hooks())

    // Generate a devices manager and boot it up
    this.devices = new DeviceManager(this, dispatch)
    this.devices.greet()

    // Generate a channel manager and open channels needed by our devices
    this.channels = new ChannelManager(this, dispatch)
    this.channels.open(this.devices.list())

    const port = 3030
    this.http = Koa.listen(port)
    logger.info('Koa application started on http://localhost:%d', port)
    // TODO: Pass down dispatch function to Koa

    this.ready = true

    return dispatch('iotame.supervisor.ready', { add: false })
  }

  stop () {
    // Tear down everything important
  }

  resolve (name) {
    return this.extensions.resolve(name)
  }

  _channelHandlers () {
    return []
  }

  _generalHooks () {
    return [
      (new Mutator()).on('iotame.supervisor.ready').do((e, o) => {
        console.log(e, o)
        o.sub = true
        return o
      })
    ]
  }
}
