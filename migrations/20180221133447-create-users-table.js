let Promise = require('bluebird')

module.exports = {
  up: (query, DataTypes) => {
    return query.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      login: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },

      // Timestamps
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })
  },

  down: (query, DataTypes) => {
    return query.dropTable('users')
  }
}
