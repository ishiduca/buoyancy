var buoyancy = require('buoyancy')
var reducer = require('./reducer/xhr')
var setupApi = require('./api/xhr')
var mainView = require('./components/main')
var resultView = require('./components/result')

var app = buoyancy({
  text: [['no data ;(']]
})

app.reduce(reducer)
app.use((emitter, getData) => {
  emitter.on('*', function logger (p) {
    console.log(this.event)
    console.log(p)
  })
  emitter.on('error', err => console.error(err))
})
app.use(setupApi)
app.route('/', mainView)
app.route('/load/:json', resultView)

document.body.appendChild(app('/'))
