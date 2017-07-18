var buoyancy = require('buoyancy')
var reducer = require('./app/reducer/timer')
var logger = require('./app/api/logger')
var setupApi = require('./app/api/timer')
var rootRender = require('./app/components/root')

var app = buoyancy({
  count: 10,
  countState: {
    text: 'will not start yet :(',
    timerID: null
  },
  toggleButtonDisabled: null
}, {
  location: false
})

app.reduce(reducer)
app.use(logger)
app.use(setupApi)
app.route('/', rootRender)

document.body.appendChild(app('/'))
