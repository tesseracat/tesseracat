const Sequelize = require('sequelize')
const path = require('path')
const fs = require('fs')

let database = new Sequelize('iotame', '', '', {
  dialect: 'sqlite',
  storage: 'iotame.sqlite',

  logging: false,
  // logging: console.log,

  operatorsAliases: false
})

let sequelize = { db: database }

fs.readdirSync(path.resolve(__dirname, '../migrations/models')).forEach((filename) => {
  let name = filename.replace(/\.[^/.]+$/, '')
  let model = database.import(path.join(__dirname, '../migrations/models', filename))

  sequelize[name] = model
})

module.exports = sequelize
