const path = require('path')

const Koa = require('koa')
const koaBody = require('koa-bodyparser')
const KoaRouter = require('koa-router')
const serve = require('koa-static')
const koaJwt = require('koa-jwt')
const cors = require('@koa/cors')

const { makeExecutableSchema } = require('graphql-tools')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')

const router = new KoaRouter()
const port = 3030;
const app = new Koa()

// Generate a context and GraphQL schema
const context = require('../Storage')
let schema = makeExecutableSchema({ typeDefs: require('./schema'), resolvers: require('./resolver') })

// Serve GraphQL queries, migrations and graphiql debugger
router.post('/graphql', graphqlKoa({ schema, context }))
router.get('/graphql', graphqlKoa({ schema, context }))
if (process.env.NODE_ENV !== 'production') {
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
}

// Login route
router.post('/login', require('./middleware/login'))

// Add new JWT token to response if close to expiry
app.use(require('./middleware/refreshJWT'))

// Parse JSON body
app.use(koaBody())

// Verify JWT tokens on requests
app.use(koaJwt({ passthrough: true }))

// Serve static files from @iotame/web
app.use(serve(path.resolve(__dirname, '../../node_modules/@iotame/web/dist'), {
  defer: true,
  gzip: true
}))

// Register the router
app.use(router.routes())
app.use(router.allowedMethods())
app.use(cors({ exposeHeaders: ['Set-Authorization'] }))

module.exports = app
