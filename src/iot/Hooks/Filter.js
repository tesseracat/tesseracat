let Hook = require('./Hook')

module.exports = class Filter extends Hook {
  constructor () {
    super()

    this.type = 'filter'
  }
}
