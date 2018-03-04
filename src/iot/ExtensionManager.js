const { homedir } = require('os')
const path = require('path')
const _ = require('lodash')

module.exports = class ExtensionManager {
  constructor (supervisor, dispatch) {
    this.dispatch = dispatch

    this._devices = {}
    this._channels = {}
    this._protocols = {}
    this._hooks = []
  }

  register () {
    let extensions = require(path.resolve('config/extensions.json'))

    _.each(extensions.loaded, (name) => {
      let extension = this.require(name)

      this._devices[name] = extension.devices()
      this._channels[name] = extension.channels()
      this._protocols[name] = extension.protocols()
      _.merge(this._hooks, extension.hooks())
    })
  }

  hooks () {
    return this._hooks
  }

  resolve (name) {
    let [pack, type, resolving] = name.split('.')

    return _.get(this['_' + type], pack + '.' + resolving)
  }

  require(extension) {
    let extensionPath = path.resolve(homedir(), '.iotame_extensions/node_modules', extension)
    return new (require(extensionPath))(this.dispatch)
  }
}
