module.exports = function logger (emitter) {
  emitter.on('*', function (p) {
    console.log('event "%s"', this.event)
    console.log(p)
  })

  emitter.on('error', err => {
    console.error(err)
  })
}
