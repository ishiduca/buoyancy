var yo = require('buoyancy/html')
var buoyancy = require('buoyancy')

var app = buoyancy({count: 0}, {location: false})

app.reduce({
  count (data, action, update) {
    update({count: data.count + action})
  }
})

app.use(emitter => {
  emitter.on('countup', e => {
    e.stopPropagation()
    emitter.emit('count', +1)
  })
  emitter.on('countdown', e => {
    e.stopPropagation()
    emitter.emit('count', -1)
  })
})

app.route('/', (data, params, u, actionsUp) => yo`
  <div>
    <button
      type="button"
      onclick=${e => actionsUp('countup', e)}
    >plus</button>
    <button
      type="button"
      onclick=${e => actionsUp('countdown', e)}
    >minus</button>
    <div id="result">${data.count}</div>
  </div>
`)

document.body.appendChild(app('/'))
