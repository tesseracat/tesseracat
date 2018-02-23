const Promise = require('bluebird')
const logger = require('./Logger')
const fs = require('fs')

const Migrator = require('./iot/Migrator')
const Supervisor = require('./iot/Supervisor')

module.exports = class Bootstrapper {
  constructor (development = false) {
    this.daemonized = false
    this.development = development
  }

  boot () {
    this.daemonize()
      .then(() => this.migrate())
      .then(() => this.bootRedis())
      .then(() => this.bootSupervisor())
      .catch((err) => { this.tearDown(err) })
  }

  daemonize () {
    if (this.development) {
      logger.info('Running iotame in development mode. Not daemonizing.')
      return new Promise(resolve => { resolve() })
    }

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
    this.supervisor = new Supervisor(logger, this.redis)
    return this.supervisor.boot()
  }

  tearDown (error) {
    if (this.supervisor) this.supervisor.stop()

    if (error) logger.error(error)

    if (this.daemonized) fs.unlinkSync('daemon.pid')
  }
}
