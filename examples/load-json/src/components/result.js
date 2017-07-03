var yo = require('buoyancy/html')
var onload = require('on-load')
var domCss = require('dom-css')

module.exports = function loadJSON (data, params, route, actionsUp) {
  var html = yo `
     <div role="application">
      <div>
        ${data.text.map(sentence => blockquote(sentence))}
      </div>
    </div>
  `

  function blockquote (sentence) {
    return css(yo `
      <blockquote>
        ${sentence.map(s => yo `<p>${s}</p>`)}
      </blockquote>
    `, {
      padding: '6px',
      margin: '6px'
    })
  }

  onload(html, () => {
    actionsUp('xhr:get', getURI())
  })

  return html

  function getURI () {
    var loc = window.location
    return loc.protocol + '//' + loc.host + '/' + params.json
  }
}

function css (dom, style) {
  domCss(dom, style)
  return dom
}
