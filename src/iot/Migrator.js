let dbmigrate = require('db-migrate')
let log = require('db-migrate-shared').log
let logger = require('../Logger')

module.exports = class Migrator {
  constructor () {
    this.dbm = dbmigrate.getInstance(true, {
      config: 'config/database.json'
    })

    // Silence the default db-migrate log
    log.silence(true)
  }

  migrate () {
    logger.info('Making sure the database is migrated.')
    return this.dbm.up()
  }
}
