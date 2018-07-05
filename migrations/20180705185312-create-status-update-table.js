let Promise = require('bluebird')

module.exports = {
  up: (query, DataTypes) => {
    return query.createTable('status_update', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      deviceID: DataTypes.INTEGER,
      state: DataTypes.BLOB,

      createdAt: DataTypes.DATE
    })
  },

  down: (query, DataTypes) => {
    return query.dropTable('status_update')
  }
}
