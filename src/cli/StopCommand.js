const logger = require('winston')
const chalk = require('chalk')
const fs = require('fs')

exports.command = 'stop'

exports.describe = 'Stop a daemonized instance of iotame'

exports.handler = function (argv) {
  let pid = fs.readFile('daemon.pid', 'utf8', (err, pid) => {
    if (err) {
      logger.info(chalk.red('iotame doesn\'t appear to be running.'))
      return
    }

    pid = parseInt(pid.trim())

    try {
      logger.info(`Trying to stop iotame with PID ${pid}.`)
      process.kill(pid, 'SIGTERM')
      logger.info(chalk.green('Sent SIGTERM to iotame.'))
    } catch (ex) {
      logger.error(chalk.red('Could not send SIGTERM.'))
    }

    try {
      process.kill(pid, 0)
      logger.info(chalk.green('iotame successfully stopped.'))
    } catch (ex) {
      logger.info(chalk.red('iotame was not stopped. Please try to stop it manually.'))
    }
  })
}
