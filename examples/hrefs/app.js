const d = require('global/document')
const onload = require('on-load')
const sheetRouter = require('sheet-router')
const href = require('sheet-router/href')
const xtend = require('xtend')

const buoyancy = require('../../buoyancy')
const yo = buoyancy.html
const root = yo `<main></main>`

// mainHandler
const mainModel = {
  update (state, action) {
    return xtend(state, {username: action})
  }
}
const mainReducer = (type, state, action) => mainModel[type] ? mainModel[type](state, action) : state
const mainApp = buoyancy(root, {username: ''}, mainReducer)
const mainHandler = (params) => mainApp((state, dispatcher) => yo `
  <main>
    <h1>${state.username}</h1>
    <input
      type="text"
      placeholder="user name"
      oninput=${ev => dispatcher('update', ev.target.value)}
    />
    <div><a href=${'/' + state.username}>to sub</a></div>
  </main>
`)

// subHandler
const subModel = {
  toUpperCase (state, action) {
    return dispatcher => setTimeout(() => {
      dispatcher('onToUpperCase', (action || '').toUpperCase())
    }, 1000)
  },
  onToUpperCase (state, action) {
    return xtend(state, {username: (action || '').toUpperCase()})
  }
}
const subReducer = (type, state, action) => subModel[type] ? subModel[type](state, action) : state
const subApp = buoyancy(root, {username: ''}, subReducer)
const subHandler = params => subApp((state, dispatcher) => yo `
  <main>
    <h1>params.username - ${params.username}</h1>
    <h2>state.username - ${state.username || params.username}</h2>
    <button
      onclick=${ev => dispatcher('toUpperCase', params.username)}
    >toUpperCase</button>
    <div><a href="/404">to room 404</a></div>
  </main>
`)

// notFoundHandler
const notFoundHandler = () => yo `
  <main>
    <h1>not founds such a path.</h1>
    <div><a href="/">to main</a></div>
  </main>
`

// routing
const router = sheetRouter([
  ['/', mainHandler],
  ['/:username', subHandler],
  ['/404', notFoundHandler]
])

href(h => yo.update(root, router(h.pathname)))
onload(root, rt => yo.update(rt, router('/')))

d.body.appendChild(root)
