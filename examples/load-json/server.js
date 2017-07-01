var http = require('http')
var path = require('path')
var ecstatic = require('ecstatic')(path.join(__dirname, 'static'))
var app = http.createServer(ecstatic)

start(process.env.PORT || 8888)

function start (port) {
  var mes = 'server start to listen on port "%s"'
  app.listen(port, () => console.log(mes, port))
}
