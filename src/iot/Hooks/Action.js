let Hook = require('./Hook')

module.exports = class Action extends Hook {
  constructor () {
    super()

    this.type = 'action'
  }
}
