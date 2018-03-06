const Promise = require('bluebird')
const chalk = require('chalk')
const fs = require('fs')

const Migrator = require('./Migrator')
const supervisor = require('../app')
const logger = supervisor.logger

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
        // Continue if already deamonized
        if (process.env.__daemon) {
          this.daemonized = true

          logger.info('Successfully daemonized with PID %s.', process.pid)
          fs.writeFileSync('daemon.pid', process.pid)

          process.on('exit', () => { this.tearDown() })
          process.on('SIGTERM', () => {
            logger.info('Received SIGTERM')
            this.tearDown()
          })

          return
        }

        // Daemonize the process
        let args = [].concat(process.argv)
        args.shift()
        let script = args.shift()

        let opt = { cwd: process.cwd() }
        let env = opt.env || process.env

        env.__daemon = true

        const daemon = require('daemon').daemon(script, args, opt)
        if (daemon) {
          logger.info(chalk.green('Daemonized with PID %s'), daemon.pid)
        }

        return process.exit()
      })
  }

  _onlyRunOnce() {
    return new Promise((resolve, reject) => {
      fs.readFile('daemon.pid', (err, data) => {
        // Keep in mind that we're doing it the other way around.
        // If daemon.pid can't be read, we continue, otherwise we reject.

        err ? resolve() : reject([
          chalk.red('iotame is already running with PID ' + data + '.'),
          chalk.yellow('Try stopping it first with "iotame stop".')
        ])
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
    this.supervisor = supervisor
    this.supervisor.redis = this.redis

    return this.supervisor.boot()
  }

  tearDown (errors) {
    if (this.supervisor) this.supervisor.stop()

    // Convert errors to array
    if (!Array.isArray(errors)) {
      errors = [errors]
    }

    for (let err of errors) {
      logger.error(err)
    }

    if (this.daemonized) fs.unlinkSync('daemon.pid')
  }
}
