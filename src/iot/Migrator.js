const { db: sequelize } = require('../Storage')
const logger = require('../Logger')
const Umzug = require('umzug')
const path = require('path')

module.exports = class Migrator {
  constructor () {
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
