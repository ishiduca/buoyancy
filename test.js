var test = require('tape')
var yo = require('./html')
var buoyancy = require('./buoyancy')

function setup () {
  var app = buoyancy({count: 0}, {location: false})

  app.reduce({
    count (data, action, update) {
      return {count: data.count + action}
    }
  })

  app.use(emitter => {
    emitter.on('countup', e => {
      e.stopPropagation()
      emitter.emit('count', +1)
    })
    emitter.on('countdown', e => {
      e.stopPropagation()
      emitter.emit('count', -1)
    })
  })

  app.route('/', (data, params, u, actionsUp) => yo`
    <div>
      <button
        type="button"
        onclick=${e => actionsUp('countup', e)}
      >plus</button>
      <button
        type="button"
        onclick=${e => actionsUp('countdown', e)}
      >minus</button>
      <div id="result">${data.count}</div>
    </div>
  `)

  document.body.appendChild(app('/'))
}

setup()

test('count', t => {
  var $result = document.querySelector('#result')
  var $bs = document.querySelectorAll('button')
  var $up = $bs[0]
  var $down = $bs[1]

  t.ok($result, 'exists #result')
  t.ok($up, 'existss countup button')
  t.ok($down, 'existss countdown button')

  t.is($result.innerHTML, '0', '$result.innerHTML eq "0"')

  test('click up button', tt => {
    setTimeout(() => {
      tt.is($result.innerHTML, '1', '$result.innerHTML eq "1"')
      tt.end()
    }, 10)
    $up.click()
  })

  test('click down button - 1st', tt => {
    setTimeout(() => {
      tt.is($result.innerHTML, '0', '$result.innerHTML eq "0"')
      tt.end()
    }, 10)
    $down.click()
  })

  test('click down button - 2nd', tt => {
    setTimeout(() => {
      tt.is($result.innerHTML, '-1', '$result.innerHTML eq "-1"')
      tt.end()
    }, 10)
    $down.click()
  })

  test('click down button - 3rd # resume DOM update', tt => {
    setTimeout(() => {
      tt.is($result.innerHTML, '-2', '$result.innerHTML eq "-2"')
      tt.end()
    }, 10)
    $down.click()
  })

  t.end()
})
