const d = require('global/document')
const yo = require('yo-yo')

module.exports = function buoyancy (el, state, reducer) {
  if (typeof reducer !== 'function') reducer = noop

  return function (handler) {
    yo.update(el, handler(state, dispatcher))
    return el

    function dispatcher (type, action) {
      var whats = reducer(type, state, action)
      if (whats == null) return
      if (typeof whats === 'function') return whats(dispatcher)
      yo.update(el, handler((state = whats), dispatcher))
    }
  }

  function noop () {}
}

module.exports.createRoot = createRoot
module.exports.html = yo

function createRoot (name) {
  return typeof name === 'string' ? d.createElement(name) : name
}
