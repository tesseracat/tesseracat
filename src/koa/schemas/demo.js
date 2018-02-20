let { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type Query {
    postTitle: String,
    blogTitle: String
  }
`)
