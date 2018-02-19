const _ = require('lodash')

class DevicesService {
  constructor () {
    this.devices = [
      {id: 1, name: 'Schnittlauch', uuid: '1234-1234-1234'}
    ]
  }

  // setup (app, path) { }

  async find (params) {
    return this.devices
  }

  async get (id, params) {
    return _.find(this.devices, d => d.id == id)
  }

  async create (data, params) { }
  async update (id, data, params) { }
  async patch (id, data, params) { }
  async remove (id, params) { }
}

module.exports = DevicesService
