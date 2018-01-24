let logger = require('winston')
let Promise = require('bluebird')

let Migrator = require('./iot/Migrator')
let Feather  = require('./web/app')
let Manager  = require('./index') // Change to iot/Manager

module.exports = class Application {
  boot () {
    this.migrate()
      .then(() => this.manager())
      .then(() => this.feather())
      .then(() => this.redis())
      .catch(this.handler)
  }

  migrate () {
    let migrator = new Migrator()

    return migrator.migrate()
  }

  manager () {
    return new Promise((resolve, reject) => {
      logger.info("Manager started.")
      resolve()
    })
  }

  feather () {
    return new Promise((resolve, reject) => {
      let host = Feather.get('host')
      let port = Feather.get('port')
      let server = Feather.listen(port)

      server.on('listening', () => {
        logger.info('Feathers application started on http://%s:%d', host, port)
        resolve()
      })
    })
  }

  redis () {
    return new Promise((resolve, reject) => {
      logger.info("Redis started.")
      resolve()
    })
  }

  handler (error) {
    logger.error(error)
  }
}
