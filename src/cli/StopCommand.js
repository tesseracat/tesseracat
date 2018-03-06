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

    pid = pid.trim()

    try {
      logger.info(`Trying to stop iotame with PID ${pid}.`)
      process.kill(pid, 'SIGTERM')
      logger.info(chalk.green('Successfully stopped iotame.'))
    } catch (ex) {
      logger.error(chalk.red('Could not kill the process.'))
    }
  })
}
