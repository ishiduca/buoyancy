var url = require('url')
var w = require('global/window')
var d = require('global/document')
var yo = require('yo-yo')
var xtend = require('xtend')
var href = require('nanohref')
var nsemitter = require('namespace-emitter')
var routington = require('routington')

module.exports = function buoyancy (defaultData, _opt) {
  var data = xtend(defaultData)
  var opt = xtend(_opt)
  var el
  var uri
  var render
  var emitter = nsemitter()
  var router = routington()

  function app (route) {
    mount(route)
    return yo `<section id="buoyancy-app-root">${el}</section>`
  }

  app.route = addRoute
  app.use = register
  app.reduce = reduce

  if (opt.location !== false) init(opt.location)
  addRoute('/404', notFound)

  return app

  function mount (route) {
    if (route) uri = route
    if (!uri) return emitter.emit('error', new Error('mount error uri not found'))

    emitter.emit('mount', uri)

    var u = url.parse(uri, true)
    var m = router.match(u.pathname)
    if (m == null) return onNotFound()

    render = m.node.model(xtend(m.param, u.query), uri)
    el = (!el) ? r() : yo.update(el, r())

    function r () {
      return render(xtend(data), actionsUp)
    }

    function rr () {
      return notFound(xtend(data), u.query, uri, actionsUp)
    }

    function onNotFound () {
      el = (!el) ? rr() : yo.update(el, rr())
    }
  }

  function addRoute (route, model) {
    var node = router.define(route)[0]
    node.label = route
    node.model = function nodeModel (params, uri) {
      return (render = function nodeRender (data, actionsUp) {
        return model(data, params, uri, actionsUp)
      })
    }
  }

  function register (f) {
    f(emitter, getData)
  }

  function reduce (reducers) {
    Object.keys(reducers).forEach(function (name) {
      emitter.on(name, function (action) {
        try {
          reducers[name](xtend(data), action, update)
        } catch (err) {
          emitter.emit('error', err)
        }
      })
    })
  }

  function update (p) {
    _update(p)
    el = yo.update(el, render(xtend(data), actionsUp))
  }
  function _update (p) {
    if (!p) return
    data = xtend(data, p)
    emitter.emit('update', xtend(data), p)
  }
  function getData () { return xtend(data) }
  function actionsUp () { emitter.emit.apply(emitter, arguments) }

  function init (which) {
    if (!d.location) return

    var preventOnMount = false

    var usePush = !!(w && w.history && w.history.pushState)
    if (which === 'history') usePush = true
    else if (which === 'hash') usePush = false

    if (usePush) {
      w.onpopstate = function windowOnPopstate (e) {
        preventOnMount = true
        mount(cURL(d.location.href))
      }
      emitter.on('mount', function (uri) {
        if (!preventOnMount) w.history.pushState({}, uri, uri)
        preventOnMount = false
      })
    } else {
      w.addEventListner('hashchange', function (e) {
        preventOnMount = true
        mount(d.location.hash.slice(1))
      })
      emitter.on('mount', function (uri) {
        if (!preventOnMount) d.location.href = (uri.slice(0, 1) === '#') ? uri : '#' + uri
        preventOnMount = false
      })
    }

    href(function (node) {
      mount(cURL(node.href))
    })

    function cURL (uri) {
      var u = url.parse(uri)
      var h = u.pathname
      if (u.query) h += (u.query.slice(0, 1) === '?') ? u.query : '?' + u.query
      if (u.hash) h += u.hash
      return h
    }
  }
}

function notFound (data, params, uri, actionsUp) {
  return yo `
    <section>
      <h1>404 not found.</h1>
      <p>uri - "${uri}"</p>
    </section>
  `
}
