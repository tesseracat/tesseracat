const logger = require('winston')
const chalk = require('chalk')
const fs = require('fs')

exports.command = 'token'

exports.describe = 'Creates a registration token'

exports.handler = function (argv) {
  const token = (() => {
    let text = ""
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    for (let i = 0; i < 5; i ++)
      text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
  })()

  fs.writeFile('register.token', token, (err) => {
    if (err) {
      logger.error(chalk.red('Could not write register.token file.'))
      process.exit(1)
    }

    logger.info(chalk.green(`Your registration token is ${chalk.bold(token)}.`))
  })
}
