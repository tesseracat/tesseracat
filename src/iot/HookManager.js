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
    let filtered = _.some(this._filters(event), filter => {
      filter.apply(filter, [event, caller, options])
    })

    // Return if event was filtered
    if (filtered) return { filtered: true, options }

    // Mutate options
    if (options) {
      _.each(this._mutators(event), mutator => {
        options = mutator.apply(mutator, [event, caller, options])
      })
    }

    // Perform actions
    let actions = this._actions(event)
    if (actions.length > 0) {
      // Try to make this asynchronous / non-blocking!
      _.each(actions, action => {
        action.apply(action, [event, caller, options])
      })
    }

    return { filtered: false, options }
  }

  _getHook (event, type) {
    return _(this.hooks)
      .filter((hook, name) => {
        if (name.endsWith('*')) return event.startsWith(name.replace('*', ''))
        return event == name
      })
      .flatten()
      .filter(hook => hook.type == type)
      .map(hook => hook.method())
      .value()
  }

  _filters (event) {
    return this._getHook(event, 'filter')
  }

  _mutators (event) {
    return this._getHook(event, 'mutator')
  }

  _actions (event) {
    return this._getHook(event, 'action')
  }
}
