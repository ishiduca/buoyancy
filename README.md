# buoyancy

a helper function to create [yo-yo](https://www.npmjs.com/package/yo-yo) with [sheet-router](https://www.npmjs.com/package/sheet-routersheet).

## example

```js
const onload = require('on-load')
const d = require('global/document')
const sheetRouter = require('sheet-router')
const href = require('sheet-router/href')
const xtend= require('xtend')
const buoyancy = require('buoyancy')
const html = buoyancy.html

// start
const root = html `<main></main>`

// notFoundView
const notFoundView = html `
  <main>
    <p>not found such a path.</p>
    <div><a href="/">to main</a></div>
  </main>
`
// mainView
const mainReduce = (type, state, action) => {
  if (type === 'update') {
    return xtend(state, {username: action})
  }
  return state
}
const app = buoyancy(root, {username: 'John Smith'}, mainReduce)
const mainView = params => app((state, dispatcher) => html `
  <main>
    <h1>Hello ${state.username}</h1>
    <input
      type="text"
      oninput=${ev => dispatcher('update', ev.target.value)}
    />
    <div><a href="/foo/bar">to somewhere...</a></div>
  </main>
`)

// routing
const router = sheetRouter([
  ['/', mainView]
  ['/404', notFoundView]
])

// setup
href(h => html.update(root, router(h.pathname))
onload(root, rt => html.update(rt, router('/')))

// mount
d.body.appendChild(root)
```

## api

### buoyancy = require('buoyancy')

`buoyancy` is a function. take 3 arguments. reutrns function.

```js
const app = buoyancy(dom, state, reducer)
```

* `dom` is DOM to be the root node.
* `state`
* `reducer` is a function. take 3 arguments `type`, `state`, `action`. returns `new state` or `middleware`.

#### app

`app` is a function. take 1 argument, `function`. return DOM, updated.

```js
sheetRouter([
  ['/:username', function (params) {
    return app(function middleware (state, dispatcher) {
      return html `
        <main>
          <h1>username is "${params.username}"</h1>
          <button onclick=${ev => dispatcher('changeUpperCase', params.userename)}>
            change uppercase
          </button>
          <p>${state.username}</p>
        </main>
      `
    })
  }]
])
```

#### reducer

```js
const reducer = (type, state, action) {
  if (type === 'update') {
    return xtend(state, {username: action})
  }
  return state
}
```

* `type` is sended string by dispatcher.
* `state`
* `action` is sended value by dispatcher.

async

```js
const reducer = (type, state, action) {
  if (type === 'lazyUpdate') {
    return (dispatcher) => {
      setTimeout(() => dispatcher('update', aciton.toUpperCase()))
    }
  }

  if (type === 'update') {
    return xtend(state, {username: action})
  }

  return state
}
```

## see also

* [yo-yo](https://www.npmjs.com/package/yo-yo)
* [sheet-router](https://www.npmjs.com/package/sheet-routersheet)
