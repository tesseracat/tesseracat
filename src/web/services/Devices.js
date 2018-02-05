module.exports = class DevicesService {
  find (params) {
    return Promise.resolve([{id: 1, name: 'Schnittlauch'}])
  }

  get (id, params) {}
  create (data, params) {}
  update (id, data, params) {}
  patch (id, data, params) {}
  remove (id, params) {}

  setup (app, path) {
  }
}
