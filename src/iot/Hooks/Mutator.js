let Hook = require('./Hook')

module.exports = class Mutator extends Hook {
  constructor () {
    super()

    this.type = 'mutator'
  }
}
