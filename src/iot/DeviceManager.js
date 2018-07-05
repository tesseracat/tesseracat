module.exports = class DeviceManager {
  constructor (supervisor) {
    this.app = supervisor
    this.dispatch = supervisor.dispatch
    this.devices = []
  }

  reload () {
    this.devices = []
  }

  list () {
    return []
  }
}
