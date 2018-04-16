module.exports = {
  'xhr:onResponse' (data, action) {
    var sentence = action.text.split(/\n\n/).map(s => s.split(/\n/))
    return {text: sentence}
  },

  'xhr:error' (data, action) {
    console.error(action)
    return {text: [['no data :(']]}
  }
}
