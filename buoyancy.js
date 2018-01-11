var url = require('url')
var w = require('global/window')
var d = require('global/document')
var yo = require('yo-yo')
var href = require('nanohref')
var ready = require('document-ready')
var xtend = require('xtend')
var nsEmitter = require('namespace-emitter')
var routington = require('routington')

var BUOYANCY = require('./package').name
var MOUNT_ROUTE = `${BUOYANCY}:mountRoute`
var UPDATE_DATA = `${BUOYANCY}:updateData`
var UPDATE = `${BUOYANCY}:update`

module.exports = buoyancy
module.exports.notFound = notFound

function buoyancy (defaultData, _opt) {
  var opt = xtend(_opt)
  var data = xtend(defaultData)
  var router = routington()
  var emitter = nsEmitter()
  var pause = false
  var render
  var el

  function app (u) {
    mountRoute(u)
    el = render()
    return yo`<section id="${BUOYANCY}-app-root">${el}</section>`
  }

  app.use = registerApi
  app.route = registerRoute
  app.reduce = reduce

  emitter.on(UPDATE_DATA, update)
  ready(emitter.emit.bind(emitter, 'DOMContentLoaded'))

  if (opt.location !== false) init(opt.location)

  return app

  function update () {
    if (pause) return
    el = yo.update(el, render())
    emitter.emit(UPDATE)
  }

  function updateData (part, _pause) {
    if (!part) return
    data = xtend(data, part)

    pause = !!_pause

    emitter.emit(UPDATE_DATA, xtend(data), part)
  }

  function reduce (reducer) {
    Object.keys(reducer).forEach(function (method) {
      emitter.on(method, function (action) {
        try {
          reducer[method](xtend(data), action, updateData)
        } catch (err) {
          emitter.emit('error', err)
        }
      })
    })
  }

  function registerApi (api, opt) {
    api(emitter, function () { return xtend(data) }, opt)
  }

  function registerRoute (pattern, model) {
    var node = router.define(pattern)[0]
    node.model = model
  }

  function mountRoute (u) {
    var uri = url.parse(u, true)
    var match = router.match(uri.pathname)
    if (match == null) {
      render = function renderNotFound () {
        return module.exports.notFound(xtend(data), uri.query, u, actionsUp)
      }
    } else {
      render = function () {
        return match.node.model(
          xtend(data),
          xtend(uri.query, match.param),
          u,
          actionsUp
        )
      }
    }

    emitter.emit(MOUNT_ROUTE, u)
  }

  function actionsUp () {
    return emitter.emit.apply(emitter, arguments)
  }

  function init (which) {
    if (!d.location) return

    var preventOnMount = false
    var usePush = !!(w && w.history && w.history.pushState)

    if (which === 'history') usePush = true
    else if (which === 'hash') usePush = false

    if (usePush) {
      w.onpopstate = function windowOnPopstate (e) {
        preventOnMount = true
        mountRoute(cURL(d.location.href))
        update()
      }
      emitter.on(MOUNT_ROUTE, function (uri) {
        if (!preventOnMount) w.history.pushState({}, uri, uri)
        preventOnMount = false
      })
    } else {
      w.addEventListener('hashchange', function (e) {
        preventOnMount = true
        mountRoute(d.location.hash.slice(1))
        update()
      })
      emitter.on(MOUNT_ROUTE, function (uri) {
        if (!preventOnMount) d.location.href = (uri.slice(0, 1) === '#') ? uri : '#' + uri
        preventOnMount = false
      })
    }

    href(function (node) {
      mountRoute(cURL(node.href))
      update()
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

function notFound (data, param, uri, actionsUp) {
  return yo`
    <div>
      <h1>404 not found</h1>
      <p>not found "${uri}".</p>
    </div>
  `
}
