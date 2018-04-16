module.exports = {
  'app:resume' (data, action) {
    var count = action.count == null ? data.count : action.count
    var countState = action.countState == null
      ? data.countState
      : action.countState

    countState.text = 'timer resume now :)'

    return {
      count: count,
      countState: countState
    }
  },
  'app:stop' (data, action) {
    return {
      countState: {
        text: 'timer stop now :o',
        timerID: null
      }
    }
  },
  'app:ended' (data, action) {
    return {
      count: 0,
      countState: {
        text: 'timer ended !!',
        timerID: null
      },
      toggleButtonDisabled: 'disabled'
    }
  }
}
