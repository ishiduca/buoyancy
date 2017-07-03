'use strict'
var yo = require('yo-yo')
var xtend = require('xtend')
var em = require('namespace-emitter')
var nanohref = require('nanohref')
var Router = require('routes')
var url = require('url')

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
    window.onpopstate = function onpopstate (e) {
      emitter.emit('window.onpopstate', e.state)
      var u = url.parse(window.location.href, true)
      var match = mountRender(u.pathname, u)
      if (!match) return

      update()
    }

    if (enableHref) {
      nanohref(function (loc) {
        var u = url.parse(loc.href, true)
        if (window.location.href === u.href) return

        var match = mountRender(u.pathname, u)
        if (!match) return

        var pathname = u.pathname
        var obj = xtend(u, {params: match.params, splats: match.splats})
        window.history.pushState(obj, null, pathname + (u.search || ''))
        emitter.emit('window.history.pushState', pathname, obj)
        update()
      })
    }
  }

  route('/404', notFound)

  renderer.use = register
  renderer.reduce = reduce
  renderer.route = route

  return renderer

  function mountRender (pathname, urlObj) {
    var match = router.match(pathname)
    if (!match) return

    var params = xtend(match.params, (urlObj || {}).query)
    match.fn.apply(null, [params, pathname])
    return match
  }

  function route (route, handler) {
    router.addRoute(route, function (params, pathname) {
      render = function _render (data, actionsUp) {
        return handler(data, params, pathname, actionsUp)
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
