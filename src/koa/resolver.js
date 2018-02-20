const path = require('path')
const { fileLoader, mergeResolvers } = require('merge-graphql-schemas')

let resolvers = fileLoader(path.join(__dirname, './resolvers'))

module.exports = mergeResolvers(resolvers)
