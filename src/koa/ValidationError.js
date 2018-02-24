const { GraphQLError } = require('graphql')

module.exports = class extends GraphQLError {
  constructor(errors) {
    super('The request is invalid.')

    if (!Array.isArray(errors)) {
      errors = [errors]
    }
    
    this.state = errors.reduce((result, error) => {
      if (Object.prototype.hasOwnProperty.call(result, error.key)) {
        result[error.key].push(error.message)
      } else {
        result[error.key] = [error.message]
      }

      return result
    }, {})
  }
}
