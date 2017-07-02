module.exports = function timerApi (emitter, getData) {
  emitter.on('app:toggle', () => {
    var data = getData()
    if (data.count < 0) return
    if (data.count === 0) return end(data.countState.timerID)

    var countState = data.countState

    if (countState.timerID == null) resume()
    else stop(countState.timerID)
  })

  function resume () {
    var id = setInterval(() => {
      var data = getData()
      var count = data.count - 1

      if (count <= 0) return end(data.countState.timerID)

      emitter.emit('app:resume', {count: count})
    }, 1000)

    emitter.emit('app:resume', {countState: {timerID: id}})
  }

  function stop (timerID) {
    if (timerID) clearInterval(timerID)
    emitter.emit('app:stop')
  }

  function end (timerID) {
    if (timerID) clearInterval(timerID)
    emitter.emit('app:ended')
  }
}
