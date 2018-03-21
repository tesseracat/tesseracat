const path = require('path')
const { fileLoader, mergeResolvers } = require('merge-graphql-schemas')

let resolvers = fileLoader(path.join(__dirname, './resolvers'))

// TODO: Allow extensions to load resolvers.

module.exports = mergeResolvers(resolvers)
