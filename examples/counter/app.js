var buoyancy = require('buoyancy')
var html = require('buoyancy/html')

var app = buoyancy({
  count: 0
}, {
  history: false   
})

app.reduce({
  'app:count' (data, action, update) {
    if (typeof action !== 'number') throw TypeError('action must be "number"')
    update({count: data.count + action})
  }
})

app.use((emitter, getData) => {
  emitter.on('*', function logger (params) {
    console.log('evnet - "%s"', this.event)
    console.log(params)
  })

  emitter.on('error', err => {
    console.error(err)
  })
})

app.route('/', (data, params, route, actionsUp) => {
  return html `
    <main role="application">
      <div>
        <button onclick=${inc}>increment</button>
        <button onclick=${dec}>decrement</button>
        <button onclick=${err}>error</button>
      </div>
      <div>
        result "${data.count}"
      </div>
    </main>
  `

  function inc () { actionsUp('app:count', +1) }
  function dec () { actionsUp('app:count', -1) }
  function err () { actionsUp('app:count', 'hoge') }
})

document.body.appendChild(app('/'))
