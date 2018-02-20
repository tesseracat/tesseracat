let Koa = require('koa')
let KoaRouter = require('koa-router')
let koaBody = require('koa-bodyparser')
let { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')

let schema = require('./schemas/demo')

const app = new Koa();
const router = new KoaRouter();
const port = 3030;

router.post('/graphql', koaBody(), graphqlKoa({ schema }))
router.get('/graphql', graphqlKoa({ schema }))

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))

router.get('/', (ctx, next) => {
  ctx.body = 'h'
})

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
