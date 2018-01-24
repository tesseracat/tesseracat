module.exports = class Hook {
  constructor () {
    if (new.target === Hook) {
      throw new TypeError('Cannot construct abstract Hook instances directly')
    }

    this.inheriting = false
  }

  method () {
    return () => { console.log(this.event, 'handled by a', this.type) }
  }

  on (event) {
    this.event = event

    return this
  }

  inheriting () {
    this.inheriting = true

    return this
  }
}
