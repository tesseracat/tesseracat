// Post install script.
// It creates the directories ~/.iotame_extensions, ~/.iotame_extensions/local
// and writes ~/.iotame_extensions/package.json if they do not exist.

// TODO: Run yarn to install @iotame/builtins

const { resolve } = require('path')
const { homedir } = require('os')
const mkdirp = require('mkdirp')
const fs = require('fs')

let pkg = {
  name: 'iotame-extensions',
  description: 'Auto-generated by iotame',
  private: true,
  version: '1.0.0',
  repository: 'iotame/iotame',
  license: 'CC-BY-4.0',
  homepage: 'https://iotame.cloud',
  dependencies: {
    '@iotame/builtins': '>=0.0.1-b'
  }
}

const path = resolve(homedir(), '.iotame_extensions', 'local')
mkdirp(path, (err, made) => {
  if (err) return console.err('Could not create ~/.iotame_extensions')

  let pkgPath = resolve(path, '..', 'package.json')
  if (!fs.existsSync(pkgPath)) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  }
})
