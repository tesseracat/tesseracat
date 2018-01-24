const logger = require('winston')
const fs = require('fs')

const Application = require('./Application')

new Promise((resolve, reject) => {
  fs.readFile('daemon.pid', (err, data) => {
    // Keep in mind that we're doing it the other way around.
    // If daemon.pid can't be read, we continue, otherwise we reject.

    err ? resolve() : reject(data)
  })
}).then(() => {

  logger.info('Daemonizing iotame now.')

  // require('daemon')();
  // Everything from now on only happens in a daemonized instance.

  logger.info('Successfully daemonized with PID %s.', process.pid)

  fs.writeFileSync('daemon.pid', process.pid)

  let killApplication = () => {
    fs.unlinkSync('daemon.pid')
  }

  process.on('exit', killApplication)
  process.on('SIGTERM', killApplication)

  let application = new Application()
  application.boot()

}).catch(data => { logger.error('iotame is already running with PID %s.', data) })
