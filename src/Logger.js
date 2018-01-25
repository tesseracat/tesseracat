let winston = require('winston')

winston.configure({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})

module.exports = winston
