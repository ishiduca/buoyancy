'use strict'
var yo = require('yo-yo')
var xtend = require('xtend')
var em = require('namespace-emitter')
var nanohref = require('nanohref')
var Router = require('routes')
var urlParse = require('url-parse')

module.exports = function buoyancy (defaultData) {
  var data = xtend(defaultData)
  var emitter = em()
  var router = new Router()
  var el
  var render

  function help (route) {
    var match = router.match(route)
    if (match) match.fn.apply(null, [match.params, match])
  }

  function renderer (route) {
    if (route) help(route)
    if (!render) help('/404')
    return (el = yo `
      <section id="buoyancy-app-root">
        ${render(xtend(data), actionsUp)}
      </section>
    `)
  }

  emitter.on('update', function (p) {
    data = xtend(data, p)
    el = yo.update(el, renderer())
  })

  nanohref(function (loc) {
    var u = urlParse(loc.href, true)
    if (window.location.href === u.href) return
    help(u.pathname)
    update()
  })

  window.onpopstate = function onpopstate (e) {
    emitter.emit('window.onpopstate', e.state)
    help(e.state[2])
    update()
  }

  route('/404', notFound)

  renderer.use = register
  renderer.reduce = reduce
  renderer.route = route

  return renderer

  function route (route, handler) {
    router.addRoute(route, function (params, match) {
      render = function _render (data, actionsUp) {
        window.history.pushState([data, params, route], null, route)
        return handler(data, params, route, actionsUp)
      }
    })
  }

  function reduce (reducers) {
    Object.keys(reducers).forEach(function (name) {
      emitter.on(name, function (action) {
        try {
          reducers[name](getData(), action, update)
        } catch (err) {
          emitter.emit('error', err)
        }
      })
    })
  }

  function register (f) {
    f(emitter, getData)
  }

  function getData () {
    return xtend(data)
  }

  function update (p) {
    emitter.emit('update', p)
  }

  function actionsUp () {
    emitter.emit.apply(emitter, arguments)
  }
}

function notFound (data, _params, route, actionsUp) {
  return yo `<div>
    <h1>not found. :(</h1>
    <p>url: "${route}"</p>
  </div>`
}

module.exports.notFound = notFound
