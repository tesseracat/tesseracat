#!/usr/bin/env node

const path = require('path')
const os = require('os')

// Make sure we always use $IOTAME_HOME or ~/.iotame as the working directory.
const home = process.env.IOTAME_HOME || path.resolve(os.homedir(), '.iotame')
process.chdir(home)

require('yargs')
  .commandDir('cli')
  .help()
  .argv
