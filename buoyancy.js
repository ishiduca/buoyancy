'use strict'
var yo = require('yo-yo')
var xtend = require('xtend')
var em = require('namespace-emitter')
var nanohref = require('nanohref')
var Router = require('routes')
var urlParse = require('url-parse')

module.exports = function buoyancy (defaultData, _opt) {
  var opt = xtend({
    history: true,
    href: true,
  }, _opt)

  var enableHistory = !! opt.history
  var enableHref = !! opt.href

  var emitter = em()
  var router = new Router()
  var data = xtend(defaultData)
  var el
  var render

  function renderer (route) {
    if (route) mountRender(route)
    if (!render) mountRender('/404')

    return (el = yo `
      <section id="buoyancy-app-root">
        ${render(xtend(data), actionsUp)}
      </section>
    `)
  }

  if (enableHistory) {
    emitter.on('window.history.pushState', function (data, params, route) {
      window.history.pushState([data, params, route], null, route)
    })

    window.onpopstate = function onpopstate (e) {
      emitter.emit('window.onpopstate', e.state)
//      mountRender(e.state[2])
      var u = urlParse(document.location)
      mountRender(u.pathname)
      update()
    }

    if (enableHref) {
      nanohref(function (loc) {
        var u = urlParse(loc.href, true)
        if (window.location.href === u.href) return
        mountRender(u.pathname)
        update()
      })
    }
  }

  route('/404', notFound)

  renderer.use = register
  renderer.reduce = reduce
  renderer.route = route

  return renderer

  function mountRender (route) {
    var match = router.match(route)
    if (match) match.fn.apply(null, [match.params, match])
  }

  function route (route, handler) {
    router.addRoute(route, function (params, match) {
      render = function _render (data, actionsUp) {
// look
        emitter.emit('window.history.pushState', data, params, route)
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
    data = xtend(data, p)
    emitter.emit('update', {partial: p, data: xtend(data)})
    el = yo.update(el, renderer())
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
