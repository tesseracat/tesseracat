module.exports = class DeviceManager {
  constructor (supervisor) {
    this.app = supervisor
    this.dispatch = supervisor.dispatch
    this.devices = []
  }

  reload () {
    console.log('Loading devices')
    this.devices = []
  }

  list () {
    return []
  }
}
