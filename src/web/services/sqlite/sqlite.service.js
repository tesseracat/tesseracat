// Initializes the `sqlite` service on path `/sqlite`
const createService = require('feathers-sequelize')
const createModel = require('../../models/sqlite.model')
const hooks = require('./sqlite.hooks')
const filters = require('./sqlite.filters')

module.exports = function () {
  const app = this
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'sqlite',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/sqlite', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('sqlite')

  service.hooks(hooks)

  if (service.filter) {
    service.filter(filters)
  }
}
