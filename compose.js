var xtend = require('xtend')
var hasOwnProperty = Object.prototype.hasOwnProperty
module.exports = compose

function compose () {
  var o = {}
  for (var i = 0; i < arguments.length; i++) {
    var a = arguments[i]
    for (var p in a) {
      if (hasOwnProperty.call(a, p)) {
        o[p] = o[p] == null ? a[p] : combine(o[p], a[p])
      }
    }
  }
  return o
}

function combine (a, b) {
  return function () {
    return xtend(a.apply(null, arguments), b.apply(null, arguments))
  }
}
