let Sequelize = require('sequelize')
let logger = require('../Logger')
let Umzug = require('umzug')
let path = require('path')

module.exports = class Migrator {
  constructor () {
    let sequelize = new Sequelize('sequelize', '', '', {
      dialect: 'sqlite',
      storage: path.join(__dirname, '../..', 'iotame.sqlite'),
      logging: false
    })

    this.umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize
      },

      migrations: {
        params: [
          sequelize.getQueryInterface(),
          sequelize.constructor,
          () => { throw new Error('Migration tried to use "done" callbacks. Return promises instead.')}
        ],
        path: './migrations',
        pattern: /\.js$/
      }
    })
  }

  migrate () {
    logger.info('Making sure the database is migrated.')
    return this.umzug.up()
  }
}
