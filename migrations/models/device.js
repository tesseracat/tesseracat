module.exports = (sequelize, DataTypes) => {
  return sequelize.define('device', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING }
  })
}
