/* eslint-disable no-console */
const logger = require('winston');
const fs = require('fs');

fs.readFile('daemon.pid', (err, data) => {
  if (!err) {
    logger.error('iotame is already running with PID %s.', data);
    process.exit(1);
  }

  logger.info('Daemonizing iotame now.');

  // Daemonize now.
  // require('daemon')();

  logger.info('Successfully daemonized with PID %s.', process.pid);

  fs.writeFileSync('daemon.pid', process.pid);
  process.on('exit', killApplication);
  process.on('SIGTERM', killApplication);

  startApplication();
});

function startApplication() {
  const app = require('./web/app');
  const port = app.get('port');
  const server = app.listen(port);

  let Migrator = require('./iot/Migrator')
  let migrator = new Migrator()
  
  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
  );
  
  server.on('listening', () =>
    logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
  );
}

function killApplication() {
  fs.unlinkSync('daemon.pid');
}
