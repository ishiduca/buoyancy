# buoyancy

front-end framework. based [yo-yo](https://www.npmjs.com/package/yo-yo) and [simple observer](https://www.npmjs.com/package/namespace-emitter).

# still in **v2 beta**

## features

* data flows one-way. "data down, actions up".
* functional and observer effect.

## example

```js
var buoyancy = require('buoyancy')
var html = require('buoyancy/html')

var app = buoyancy({
  count: 0
})

app.reduce({
  'app:count' (data, action, update) {
    if (typeof action !== 'number') {
      throw TypeError('action must be "number"')
    }
    update({count: data.count + action})
  }
})

app.use((emitter, getData) => {
   emitter.on('*', function logger (params) {
    console.log('evnet - "%s"', this.event)
    console.dir(params)
  })

  emitter.on('error', err => {
    console.error(err)
  })
})

app.route('/', (data, params, route, actionsUp) => {
  return html `
    <main role="application">
      <div>
        <button onclick=${inc}>increment</button>
        <button onclick=${dec}>decrement</button>
        <button onclick=${err}>error</button>
      </div>
      <div>
        result "${data.count}"
      </div>
    </main>
  `

  function inc () { actionsUp('app:count', +1) }
  function dec () { actionsUp('app:count', -1) }
  function err () { actionsUp('app:count', 'hoge') }
})

document.body.appendChild(app('/'))

```

## api

### var app = buoyancy(defaultData)

`app` is function. take an argument - `route`.returns a `HTML Elemnt`.

```js
var app = buoyancy({defaultData})
app.route('/', renderFunc)
var htmlElement = app('/')
```

### app.use(function)
### app.reduce(object)
### app.route(routePattern, function)

## see also

* [yo-yo](https://www.npmjs.com/package/yo-yo)
* [namespace-emitter](https://www.npmjs.com/package/namespace-emitter)
