const path = require('path')
const mergeGraphqlSchemas = require('merge-graphql-schemas')
const fileLoader = mergeGraphqlSchemas.fileLoader
const mergeTypes = mergeGraphqlSchemas.mergeTypes

let types = fileLoader(path.join(__dirname, '/schemas'), { recursive: true })

// TODO: Allow extensions to add GraphQL schemas.

module.exports = mergeTypes(types)
