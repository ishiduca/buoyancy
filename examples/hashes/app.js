var html = require('buoyancy/html')
var buoyancy = require('buoyancy')

var app = buoyancy(null, {location: 'hash'})

app.route('/foo', (data, params, route, actionsUp) => html `
   <ul>
    <li><a href="/">/</a></li>
    <li><a href="/fbar">/bar</a> (not found)</li>
  </ul>
`)

app.route('/', (data, params, route, actionsUp) => html `
  <ul>
    <li><a href="/foo">/foo</a></li>
    <li><a href="/fbar">/bar</a> (not found)</li>
  </ul>
`)

document.body.appendChild(app('/'))
