/* eslint-disable no-console */
const logger = require('winston')
const fs = require('fs')

const Application = require('./Application')

fs.readFile('daemon.pid', (err, data) => {
  if (!err) {
    logger.error('iotame is already running with PID %s.', data)
    process.exit(1)
  }

  logger.info('Daemonizing iotame now.')

  // Daemonize now.
  // require('daemon')();

  logger.info('Successfully daemonized with PID %s.', process.pid)

  fs.writeFileSync('daemon.pid', process.pid)
  process.on('exit', killApplication)
  process.on('SIGTERM', killApplication)

  let application = new Application()
  application.boot()
});

function killApplication () {
  fs.unlinkSync('daemon.pid')
}
