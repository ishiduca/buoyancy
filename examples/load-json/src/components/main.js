var yo = require('buoyancy/html')

module.exports = function mainView (data, params, route, actionsUp) {
  return yo `
    <div role="application">
      <ul>
        <li><a href="/load/test.json">load "test.json"</a></li>
        <li><a href="/load/no-exists.json">load "no-exists.json"</a></li>
      </div>
    </div>
  `
}
