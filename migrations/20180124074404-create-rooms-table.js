let Promise = require('bluebird')

module.exports = {
  up: (query, DataTypes) => {
    return query.createTable('rooms', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: DataTypes.STRING,

      // Timestamps
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })
  },

  down: (query, DataTypes) => {
    return query.dropTable('rooms')
  }
}
