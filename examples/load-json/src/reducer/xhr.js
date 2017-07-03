module.exports = {
  'xhr:onResponse' (data, action, update) {
    var sentence = action.text.split(/\n\n/).map(s => s.split(/\n/))
    update({text: sentence})
  }
}
