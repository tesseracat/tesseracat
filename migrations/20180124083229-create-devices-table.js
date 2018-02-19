let Promise = require('bluebird')

module.exports = {
  up: (query, DataTypes) => {
    return query.createTable('devices', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      device: {
        type: DataTypes.STRING
      },
      protocol: {
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING
      },
      room: {
        type: DataTypes.INTEGER
      },
      configuration: {
        type: DataTypes.BLOB
      }
    })
  },

  down: (query, DataTypes) => {
    return query.dropTable('devices')
  }
}
