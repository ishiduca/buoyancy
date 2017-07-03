var yo = require('buoyancy/html')

module.exports = function mainView (data, params, route, actionsUp) {
  return yo `
    <div role="application">
      <div>
        <a href="/load/test.json">load "test.json"</a>
      </div>
    </div>
  `
}
