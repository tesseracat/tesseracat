const DevicesService = require('./Devices');

module.exports = function (app) { // eslint-disable-line no-unused-vars
  app.use('/api/devices', new DevicesService())
}
