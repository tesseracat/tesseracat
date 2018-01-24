let logger = require('winston')
let Promise = require('bluebird')

let Migrator = require('./iot/Migrator')
let Feathers = require('./web/app')
let Supervisor = require('./iot/Supervisor')

module.exports = class Bootstrapper {
  boot () {
    this.migrate()
      .then(() => this.redis())
      .then(() => this.manager())
      .then(() => this.feather())
      .catch((err) => this.tearDown(err))
  }

  migrate () {
    let migrator = new Migrator()
    return migrator.migrate()
  }

  manager () {
    this.manager = new Supervisor(this.redis)
    return this.manager.boot()
  }

  feather () {
    return new Promise((resolve, reject) => {
      let host = Feathers.get('host')
      let port = Feathers.get('port')
      this.http = Feathers.listen(port)

      this.http.on('listening', () => {
        logger.info('Feathers application started on http://%s:%d', host, port)
        resolve()
      })
    })
  }

  redis () {
    return new Promise((resolve, reject) => {
      this.redis = ''
      resolve()
    })
  }

  tearDown (error) {
    if (this.manager) this.manager.stop()
    if (this.http) this.http.close()

    if (error) logger.error(error)
  }
}
