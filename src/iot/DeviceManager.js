module.exports = class DeviceManager {
  constructor (supervisor, dispatch) {
    this.dispatch = dispatch
  }

  greet () {
    // this.dispatch('devicemanager.greeting')
  }

  list () {
    return []
  }
}
