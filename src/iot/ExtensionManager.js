const path = require('path')
const _ = require('lodash')

module.exports = class ExtensionManager {
  constructor (supervisor) {
    this.dispatch = supervisor.dispatch

    this._devices = {}
    this._channels = {}
    this._protocols = {}
    this._hooks = []
  }

  register () {
    let extensions = require(path.resolve('config/extensions.json'))

    _.each(extensions.loaded, this.addExtension.bind(this))
  }

  addExtension (name) {
    let extension = this.require(name)

    this._devices[name] = extension.devices()
    this._channels[name] = extension.channels()
    this._protocols[name] = extension.protocols()

    _.merge(this._hooks, extension.hooks())
  }

  hooks () {
    return this._hooks
  }

  resolve (name) {
    let [irrelevant, pack, type, resolving] = name.match(/^((?:@.+\/).+?):(.+?)\.(.+)$/)

    let selection = _.get(this['_' + type], pack)
    if (typeof selection === 'undefined') return null

    return selection[resolving]
  }

  require(extension) {
    let extensionPath = path.resolve(process.cwd(), 'extensions/node_modules', extension)
    return new (require(extensionPath))(this.dispatch)
  }
}
