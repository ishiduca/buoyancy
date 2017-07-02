module.exports = {
  'app:resume' (data, action, update) {
    var count = action.count == null ? data.count : action.count
    var countState = action.countState == null
      ? data.countState
      : action.countState

    countState.text = 'timer resume now :)'

    update({
      count: count,
      countState: countState
    })
  },

  'app:stop' (data, action, update) {
    update({
      countState: {
        text: 'timer stop now :o',
        timerID: null
      }
    })
  },

  'app:ended' (data, action, update) {
    update({
      count: 0,
      countState: {
        text: 'timer ended !!',
        timerID: null
      },
      toggleButtonDisabled: 'disabled'
    })
  }
}
