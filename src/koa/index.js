const path = require('path')

const Koa = require('koa')
const koaBody = require('koa-bodyparser')
const KoaRouter = require('koa-router')
const serve = require('koa-static')
const koaJwt = require('koa-jwt')
const jwt = require('jsonwebtoken')
const cors = require('@koa/cors')

const { makeExecutableSchema } = require('graphql-tools')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')

const router = new KoaRouter();
const port = 3030;
const app = new Koa();

let secret = 'generated-secret'

// Generate a context and GraphQL schema
const context = require('../Storage')
let schema = makeExecutableSchema({ typeDefs: require('./schema'), resolvers: require('./resolver') })

// Serve GraphQL queries, migrations and graphiql debugger
router.post('/graphql', koaBody(), graphqlKoa({ schema, context }))
router.get('/graphql', graphqlKoa({ schema, context }))
if (process.env.NODE_ENV !== 'production') {
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
}

// For testing: Add static JWT token
app.use(async (ctx, next) => {
  await next()
  ctx.set('Set-Authorization', jwt.sign({ data: 'user', hi: '123' }, secret, { expiresIn: 60 * 60 }))
})

// Add new JWT token to response if close to expiry
app.use(async (ctx, next) => {
  ctx.state.secret = secret
  await next()

  // Only continue if token is set
  if (ctx.state.user) {
    let {iat, exp, ...claims } = ctx.state.user
    let lifespan = exp - iat
    let now = Math.floor(Date.now() / 1000)

    // Re-issue a token, if half its lifetime is over
    if (now > ctx.state.user.iat + (lifespan / 2)) {
      ctx.set('Set-Authorization', jwt.sign(claims, secret, { expiresIn: lifespan }))
    }
  }
})

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
