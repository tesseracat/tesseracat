const path = require('path')
const compress = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('../Logger')
const rest = require('@feathersjs/express/rest');

const feathers = require('@feathersjs/feathers')
const authentication = require('@feathersjs/authentication')
const jwt = require('@feathersjs/authentication-jwt')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')
const channels = require('./channels')
const sequelize = require('./sequelize')

const app = express(feathers())

// Load app configuration
app.configure(configuration())
// app.configure(authentication({ secret: '123' })) // Pass settings
// app.configure(jwt())

// Enable CORS, security, compression and body parsing
app.use(cors())
app.use(helmet())
app.use(compress())

// Enable REST and JSON body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.configure(rest())

// Enable socket.io integration
app.configure(socketio())

// Host the public folder from @iotame/web
app.use('/', express.static(path.resolve(process.cwd(), 'node_modules/@iotame/web/dist')))

// Set up middleware, services and channels
app.configure(middleware)
app.configure(services)
app.configure(channels)

app.configure(sequelize)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

module.exports = app
