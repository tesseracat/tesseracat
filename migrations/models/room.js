module.exports = (sequelize, DataTypes) => {
  return sequelize.define('room', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING }
  })
}
