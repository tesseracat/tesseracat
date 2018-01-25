let _ = require('lodash')
let logger = require('../Logger')

let Mutator = require('@iotame/api').Mutator
let Action = require('@iotame/api').Action
let Filter = require('@iotame/api').Filter
let Hook = require('@iotame/api').Hook

module.exports = class HookManager {
  constructor () {
    this.hooks = {};
  }

  dispatcher () {
    return (event, caller, options) => {
      return this._dispatch(event, caller, options)
    }
  }

  add (...elements) {
    _.each(elements, hook => {
      if (!(hook instanceof Hook)) {
        // logger.error('HookManager received something other than a Hook')
        return
      }

      let event = hook.event
      if (!this.hooks[event]) this.hooks[event] = []

      this.hooks[event].push(hook)
    })
  }

  _dispatch (event, caller, options) {
    let hooks = this._getHooks(event)

    let filtered = _.some(hooks.filter, filter => {
      filter.apply(filter, [event, caller, options])
    })

    // Return if event was filtered
    if (filtered) return { filtered: true, options }

    // Mutate options
    if (options) {
      _.each(hooks.mutator, mutator => {
        options = mutator.apply(mutator, [event, caller, options])
      })
    }

    // Perform actions
    if (hooks.action.length > 0) {
      // Try to make this asynchronous / non-blocking!
      _.each(hooks.action, action => {
        action.apply(action, [event, caller, options])
      })
    }

    return { filtered: false, options }
  }

  _getHooks (event, type) {
    let hooks = _(this.hooks)
      .filter((hook, name) => {
        if (name.endsWith('*')) return event.startsWith(name.replace('*', ''))
        return event == name
      })
      .flatten()
      .value()

    let types = { filter: [], action: [], mutator: [] }
    return _.mapValues(types, (a, type) => {
      return hooks.filter(hook => type == hook.type)
        .map(hook => hook.method())
    })
  }
}
