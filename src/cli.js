#!/usr/bin/env node

let fs = require('fs')
let logger = require('winston')
let chalk = require('chalk')

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
        logger.error(chalk.red(`Could not kill the process.`))
      }
    })
  })
  .help()
  .argv
