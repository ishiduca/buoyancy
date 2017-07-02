var html = require('buoyancy/html')
var domcss = require('dom-css')

module.exports = function rootRender (data, params, route, actionsUp) {
  return html `
    <div role="application">
      ${header(data, actionsUp)}
      ${counter(data)}
    </div>
  `
}

function counter (data) {
  var style = {
    'text-align': 'center',
    margin: '12px',
    padding: '12px',
    'font-size': '120px'
  }

  return css(html `<div>${data.count}</div>`, style)
}

function header (data, actionsUp) {
  var style = {
    display: 'flex',
    'justify-content': 'space-around'
  }

  return css(html `
    <header>
      <div><p>${data.countState.text}</p></div>
      <div>${button()}</div>
    </header>
  `, style)

  function button () {
    if (data.toggleButtonDisabled) return disabledButton()
    return html `<button onclick=${toggle}>toggle</button>`
  }

  function disabledButton () {
    return html `<button disabled>timer ended</button>`
  }

  function toggle () {
    actionsUp('app:toggle')
  }
}

function css (dom, style) {
  domcss(dom, style)
  return dom
}
