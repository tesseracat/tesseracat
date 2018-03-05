module.exports = class DeviceManager {
  constructor (supervisor) {
    this.app = supervisor
    this.dispatch = supervisor.dispatch
  }

  greet () {
    this.dispatch('devicemanager.greeting', { add: true })
  }

  list () {
    return []
  }
}
