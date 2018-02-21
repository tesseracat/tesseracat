const argon2 = require('argon2')

module.exports = (sequelize, DataTypes) => {
  let hashPasswordHook = async (instance) => {
    if (!instance.changed('password')) return

    try {
      let hash = await argon2.hash(instance.get('password'), { type: argon2.argon2id })
      instance.set('password', hash)
    } catch (e) {
      throw e
    }
  }

  return sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING },
    login: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCreate: hashPasswordHook,
      beforeUpdate: hashPasswordHook
    }
  })
}
