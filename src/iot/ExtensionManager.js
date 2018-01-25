let path = require('path')
let _ = require('lodash')

module.exports = class ExtensionManager {
  constructor (supervisor, dispatch) {
    this.dispatch = dispatch

    this.loaded = {}

    this.devices = {}
    this.channels = {}
    this.protocols = {}
  }

  register () {
    let extensions = require(path.resolve('config/extensions.json'))

    _.each(extensions.loaded, (name) => {
      let extension = new (require(name))()

      this.devices[name] = extension.devices()
      this.channels[name] = extension.channels()
      this.protocols[name] = extension.protocols()
    })
  }

  hooks () {
    return []
  }

  resolve (name) {
    let [pack, type, resolving] = name.split('.')

    return _.get(this[type], pack + '.' + resolving)
  }
}
