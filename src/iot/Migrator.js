let dbmigrate = require('db-migrate')

module.exports = class Migrator {
  constructor () {
    this.dbm = dbmigrate.getInstance(true, {
      config: 'config/database.json'
      // Set migrations dir
    })

    this.dbm.up(12).then(() => { console.log('updated') })
  }
}