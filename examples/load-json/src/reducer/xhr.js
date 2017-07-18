module.exports = {
  'xhr:onResponse' (data, action, update) {
    var sentence = action.text.split(/\n\n/).map(s => s.split(/\n/))
    update({text: sentence})
  },

  'xhr:error' (data, action, update) {
    console.error(action)
    update({text: [['no data :(']]})
  }
}
