let Promise = require('bluebird')
let logger = require('winston')
const fs = require('fs')

let Migrator = require('./iot/Migrator')
let Feathers = require('./web/app')
let Supervisor = require('./iot/Supervisor')

module.exports = class Bootstrapper {
  constructor () {
    this.daemonized = false
  }

  boot () {
    this.daemonize()
      .then(() => this.migrate())
      .then(() => this.bootRedis())
      .then(() => this.bootSupervisor())
      .then(() => this.bootFeathers())
      .catch((err) => { this.tearDown(err) })
  }

  daemonize () {
    return this._onlyRunOnce()
      .then(() => {
        logger.info('Daemonizing iotame now.')

        require('daemon')({ cwd: process.cwd() });
        // Everything from now on only happens in a daemonized instance.

        this.daemonized = true
        logger.info('Successfully daemonized with PID %s.', process.pid)
        fs.writeFileSync('daemon.pid', process.pid)

        process.on('exit', () => { this.tearDown() })
        process.on('SIGTERM', () => { this.tearDown() })
      })
  }

  _onlyRunOnce() {
    return new Promise((resolve, reject) => {
      fs.readFile('daemon.pid', (err, data) => {
        // Keep in mind that we're doing it the other way around.
        // If daemon.pid can't be read, we continue, otherwise we reject.

        err ? resolve() : reject(['iotame is already running with PID %s.', data])
      })
    })
  }

  migrate () {
    let migrator = new Migrator()
    return migrator.migrate()
  }

  bootRedis () {
    return new Promise((resolve, reject) => {
      this.redis = ''
      resolve()
    })
  }

  bootSupervisor () {
    this.supervisor = new Supervisor(this.redis)
    return this.supervisor.boot()
  }

  bootFeathers () {
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

  tearDown (error) {
    if (this.supervisor) this.supervisor.stop()
    if (this.http) this.http.close()

    if (error) logger.error(... error)

    if (this.daemonized) fs.unlinkSync('daemon.pid')
  }
}
