module.exports = class DeviceManager {
  constructor (dispatch) {
    this.dispatch = dispatch
  }

  greet () {
    this.dispatch('devicemanager.greeting')
  }

  list () {
    return []
  }
}
