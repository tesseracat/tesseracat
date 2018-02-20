const Koa = require('koa')
const KoaRouter = require('koa-router')
const koaBody = require('koa-bodyparser')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')
const { makeExecutableSchema } = require('graphql-tools')
const context = require('../Storage')

const app = new Koa();
const router = new KoaRouter();
const port = 3030;

let schema = makeExecutableSchema({ typeDefs: require('./schema'), resolvers: require('./resolver') })

router.post('/graphql', koaBody(), graphqlKoa({ schema, context }))
router.get('/graphql', graphqlKoa({ schema, context }))
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))

router.get('/', (ctx, next) => {
  ctx.body = 'h'
})

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
