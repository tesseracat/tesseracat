const context = require('../../Storage')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const secret = require('../jwtSecret')

module.exports = async (ctx, next) => {
  let body = ctx.request.body

  if (!body.user || !body.password) {
    return ctx.throw(400, 'Bad Request')
  }

  let user = await context.user.findOne({ where: { login: body.user }, raw: true })
  if (!user) return ctx.throw(401, 'Unauthorized')

  let verified = await argon2.verify(user.password, body.password)
  if (!verified) return ctx.throw(401, 'Unauthorized')

  // Attach a JWT with a lifespan of 60 minutes
  ctx.set('Set-Authorization', jwt.sign({ user: user.name, login: user.login, jti: '123' }, secret, { expiresIn: 60 * 60 }))
  ctx.body = JSON.stringify({ loggedin: true })
}
