exports.command = 'start'

exports.describe = 'Starts up iotame'

exports.builder = function (yargs) {
  yargs.option('d', {
    alias: 'develop',
    default: false,
    describe: 'Runs iotame in development mode',
    type: 'boolean'
  })

  return yargs
}

exports.handler = function (argv) {
  const Bootstrapper = require('../iot/Bootstrapper')

  let bootstrapper = new Bootstrapper(argv.develop)
  bootstrapper.boot()
}
