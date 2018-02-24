#!/usr/bin/env node

const fs = require('fs')
const logger = require('winston')
const chalk = require('chalk')

// Make sure we always use the project directory as the working directory.
process.chdir(__dirname + '/..')

require('yargs')
  .command('start', 'Start up iotame', (yargs) => {
    yargs.option('d', {
      alias: 'develop',
      default: false,
      describe: 'Runs iotame in development mode',
      type: 'boolean'
    })
  }, (argv) => {
    const Bootstrapper = require('./Bootstrapper')

    let bootstrapper = new Bootstrapper(argv.develop)
    bootstrapper.boot()
  })
  .command('token', 'Create a registration token', (argv) => {
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

      logger.info(chalk.green(`Your registration token is ${chalk.bold(token)}.\n`))
    })
  })
  .command('stop', 'Stop iotame if it is running', (yargs) => {

  }, (argv) => {
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
  })
  .help()
  .argv
