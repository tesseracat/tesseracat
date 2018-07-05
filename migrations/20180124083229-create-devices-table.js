let Promise = require('bluebird')

module.exports = {
  up: (query, DataTypes) => {
    return query.createTable('devices', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      type: DataTypes.STRING,
      protocol: DataTypes.STRING,
      name: DataTypes.STRING,
      room: DataTypes.INTEGER,
      configuration: DataTypes.BLOB

      // Timestamps
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })
  },

  down: (query, DataTypes) => {
    return query.dropTable('devices')
  }
}
