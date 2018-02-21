const jwt = require('jsonwebtoken')
const secret = require('../jwtSecret')

module.exports = async (ctx, next) => {
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
}
