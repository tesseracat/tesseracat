let dbmigrate = require('db-migrate')

module.exports = class Migrator {
  constructor () {
    this.dbm = dbmigrate.getInstance(true, {
      config: 'config/database.json'
    })
  }

  migrate () {
    return this.dbm.up(12)
  }
}
