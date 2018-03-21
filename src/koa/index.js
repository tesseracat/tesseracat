const path = require('path')

const Koa = require('koa')
const koaBody = require('koa-bodyparser')
const KoaRouter = require('koa-router')
const serve = require('koa-static')
const koaJwt = require('koa-jwt')
const cors = require('@koa/cors')
const { getInstalledPathSync } = require('get-installed-path')

const { makeExecutableSchema } = require('graphql-tools')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')

const router = new KoaRouter()
const app = new Koa()

// Generate a context and GraphQL schema
const context = require('../Storage')
const schema = makeExecutableSchema({ typeDefs: require('./schema'), resolvers: require('./resolver') })

const formatError = (error) => ({
  message: error.message,
  state: error.originalError && error.originalError.state,
  locations: error.locations,
  path: error.path
})

// Serve GraphQL queries, migrations and graphiql debugger
router.post('/graphql', graphqlKoa({ schema, context, formatError }))
router.get('/graphql', graphqlKoa({ schema, context, formatError }))
if (process.env.NODE_ENV !== 'production') {
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
}

// Add new JWT token to response if close to expiry
app.use(require('./middleware/refreshJWT'))

// Parse JSON body
app.use(koaBody())

// Verify JWT tokens on requests
app.use(koaJwt({ passthrough: true }))

// Serve static files from @iotame/web
app.use(serve(path.resolve(getInstalledPathSync('@iotame/web', { paths: process.mainModule.paths }), 'dist'), {
  defer: true,
  gzip: true
}))

// Register the router
app.use(router.routes())
app.use(router.allowedMethods())
app.use(cors({ exposeHeaders: ['Set-Authorization'] }))

module.exports = { app, router }
