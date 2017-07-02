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
}, {
  history: false
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

## data flow

```
  +<---------------------------------------------------------------------------------+
  |                                                                                  ^
 data                               copied data                       copied data    |
  |                                     |                                    |       |
  v                                     v                                    v       |
Components -action-> emitter -action-> (API -action"-> emitter -action"->) Reducer --+
```

* __data__ for rendering. within the application, `data` that you can access is __only for reference__. It can not be changed directly. (ex "data.count + = 1" can not be done). to change, you only have to use "update function" passed to Reducer
* __action__ `type` and `value`. (ex "countup", +1)
* __emitter__ event emitter (observer). it's a glue that connects Components and API and Reducer. pass `action` and `data` through emitter, or receive them.
* __Components__ ref. [yo-yo](https://www.npmjs.com/package/yo-yo)
* __Reducer__ Reducer takes 3 arguments - `data`, `actions value` and `update function`. it create `partial data to be updated` from `data` and `actions value`, and pass it to `update function`. and then `partial data` is merged with `original data` and reflected in Components
* __API__ primarily we use `Reducer` to __update data__, but `Reducer` is difficult to work with asynchronous processing. to do asynchronous processing, you need to write an API with an interface that can talk to emitter. as a process, API receives `action` from `Components` via `emitter`, and passes `new action` - generated through processed inside API - to `Reducer` via `emitter`.

## api

### var app = buoyancy(defaultData[, opts)]

* __opts.history__ default true. listens for url changes through the history API.
* __opts.href__ default true. when clicking on <a> element, it swaps rendering function and updates data and re-renders.

### app.reduce({Reducers})

registers `Reducer`.

```js
app.reduce({
  increment: function incrementReducer (data, action, update) {
    if (typeof action !== 'number') {
      throw new TypeError('"increment" action must be "number"')
    }
    var c = data.count + action
    update({count: c})
  }
})
```

### app.use(function(emitter, getData))

when using `emitter` -primarily asynchronous processing and external API -, will pass the emitter as a function argument. 2nd argument `getData` function returns `copied data`.

```js
app.reduce({
  'timer:emit' (data, action, update) {
    update({count: action})
  }
})

app.use(function (emitter, getData) {
  var id
  emitter.on('timer:start', function () {
    if (id != null) return
    id = setInterval(countdwon, 1000)
    countdwon()
  })

  function countdwon () {
    var data = getData()
    var count = data.count
    emitter.emit('timer.emit', count -1)
  }
})
```

### app.route(routePattern, renderFunction(data, params, route, actionsUp))

register `render function`

* __routePattern__ see [routes](https://www.npmjs.com/package/routes)
* __renderFunction__ returns `HTML Element`. takes 4 arguments - `data`, `params`, `route`, `actionsUp`.

** __actionsUp__ `function`. take 2 arguments - `type` and `value`. pass `value` to `emitter` or `Reducer`(via emitter). `type` is "event name" received `emitter.on`.

```js
app.route('/', function mainViewRender (data, params, route, actionsUp) {
  return html `
    <div>
      <button onclick=${e => actionsUp('timer:start')}>timer start</button>
      <div>${data.count}</div>
    </div>
  `
})
```

### HTMLElement = app(routePath)

`app` is function. returns a `HTML Element`. take an argument - `routePath`

* __routePath__ `urlObject.path`

```js
document.body.appendChild(app('/'))
```

## see also

* [yo-yo](https://www.npmjs.com/package/yo-yo)
* [namespace-emitter](https://www.npmjs.com/package/namespace-emitter)
* [routes](https://www.npmjs.com/package/routes)
