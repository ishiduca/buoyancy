var jsonist = require('jsonist')

module.exports = function (emitter, getData) {
  emitter.on('xhr:get', uri => {
    jsonist.get(uri, (err, data, response) => {
      if (err) emitter.emit('error', err)
      else emitter.emit('xhr:onResponse', data)
    })
  })
}
