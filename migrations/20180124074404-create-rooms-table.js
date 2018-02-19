let Promise = require('bluebird')

module.exports = {
  up: (query, DataTypes) => {
    return query.createTable('rooms', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING
      }
    })
  },

  down: (query, DataTypes) => {
    return query.dropTable('rooms')
  }
}
