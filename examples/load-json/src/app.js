var buoyancy = require('buoyancy')
var yo = require('buoyancy/html')
var onload = require('on-load')
var jsonist = require('jsonist')
var domCss = require('dom-css')

var app = buoyancy({
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
app.route('/load/:json', loadJSON)

document.body.appendChild(app('/'))

function mainView (data, params, route, actionsUp) {
  return yo `
    <div role="application">
      <div>
        <a href="/load/test.json">load</a>
      </div>
    </div>
  `
}

function loadJSON (data, params, route, actionsUp) {
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
