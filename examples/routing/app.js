var buoyancy = require('buoyancy')
var html = require('buoyancy/html')

var app = buoyancy()

app.use(emitter => {
  emitter.on('*', function (p) {
    console.log(this.event)
    console.log(arguments)
  })
})

app.route('/test', (data, p, r, actionsUp) => html `
  <ul>
    <li>document.location.href "${document.location.href}"</li>
    <li>window.location.href "${window.location.href}"</li>
    <li>params: ${JSON.stringify(p)}</li>
    <li>r: ${JSON.stringify(r)}</li>
    <li><a href="/">/</a></li>
    <li><a href="/404">404</a></li>
    <li><a href="/test/01">test 01</a></li>
    <li><a href="/test/01?hoge=HOGE&bar=BAR">test 01 and qs</a></li>
  </ul>
`)

app.route('/test/:v', (data, p, r, actionsUp) => html `
  <ul>
    <li>document.location.href "${document.location.href}"</li>
    <li>window.location.href "${window.location.href}"</li>
    <li>params: ${JSON.stringify(p)}</li>
    <li>r: ${JSON.stringify(r)}</li>
    <li><a href="/">/</a></li>
    <li><a href="/404">404</a></li>
    <li><a href="/test/01">test 01</a></li>
    <li><a href="/test/01?hoge=HOGE&bar=BAR">test 01 and qs</a></li>
  </ul>
`)

app.route('/', (data, p, r, actionsUp) => html `
  <ul>
    <li>document.location.href "${document.location.href}"</li>
    <li>window.location.href "${window.location.href}"</li>
    <li>params: ${JSON.stringify(p)}</li>
    <li>r: ${JSON.stringify(r)}</li>
    <li><a href="/404">404</a></li>
    <li><a href="/test">test</a></li>
    <li><a href="/test/01">test 01</a></li>
    <li><a href="/test/01?hoge=HOGE&bar=BAR">test 01 and qs</a></li>
  </ul>
`)

document.body.appendChild(app('/'))
