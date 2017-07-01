var buoyancy = require('buoyancy')
var yo = require('buoyancy/html')
var jsonist = require('jsonist')
var domCss = require('dom-css')

var loc = window.location
var uri = loc.protocol + '//' + loc.host + '/test.json'

var app = buoyancy({
  uri: uri,
  text: [['no data ;(']]
})

app.reduce({
  'xhr:onResponse' (data, action, update) {
    var sentence = action.text.split(/\n\n/).map(s => s.split(/\n/))
    update({text: sentence})
  }
})

app.use((emitter, getData) => {
  emitter.on('*', function logger (p) {
    console.log(this.event)
    console.log(p)
  })
  emitter.on('error', err => console.error(err))
})

app.use((emitter, getData) => {
  emitter.on('xhr:get', uri => {
    jsonist.get(uri, (err, data, response) => {
      if (err) emitter.emit('error', err)
      else emitter.emit('xhr:onResponse', data)
    })
  })
})

app.route('/', mainView)

document.body.appendChild(app('/'))

function mainView (data, params, route, actionsUp) {
  return yo `
    <div role="application">
      ${header()}
      <div>
        <button onclick=${onclick}>load "${data.uri}"</button>
      </div>
      <div>
        ${data.text.map(sentence => blockquote(sentence))}
      </div>
    </div>
  `

  function onclick (e) {
    actionsUp('xhr:get', data.uri)
  }

  function header () {
    return css(yo `<header>
      <div><a href='/404'>/404</a>
    </header>`, {
      display: 'flex',
      'justify-content': 'flex-end',
      padding: '12px'
    })
  }

  function blockquote (sentence) {
    return css(yo `<blockquote>
      ${sentence.map(s => yo `<p>${s}</p>`)}
    </blockquote>`, {
      padding: '6px',
      margin: '6px'
    })
  }
}

function css (dom, style) {
  domCss(dom, style)
  return dom
}
