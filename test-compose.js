var test = require('tape')
var compose = require('./compose')

test('extend object', t => {
  var mix = compose({a: 1}, {b: 2}, {c: -1})
  t.is(mix.a, 1)
  t.is(mix.b, 2)
  t.is(mix.c, -1)
  t.end()
})

test('compose function', t => {
  var mix = compose({
    test (arg) { return {a: arg} }
  }, {
    test (arg) { return {aa: arg + 1} }
  }, {
    test (arg) { return {aaa: arg * 2} }
  }, {
    test () {}   
  })

  t.deepEqual(mix.test(2), {
    a: 2, aa: 3, aaa: 4
  })
  t.end()
})
