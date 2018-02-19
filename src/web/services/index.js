const DevicesService = require('./Devices')
const sequelizeService = require('feathers-sequelize')

module.exports = function (app) {
  // app.use('/api/devices', sequelizeService({ Model:  }))
  app.use('/api/devices', new DevicesService())
}
