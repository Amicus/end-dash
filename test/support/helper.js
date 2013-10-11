var jsdom = require("jsdom");

before(function(done) {
  require('../../lib/end-dash');

  jsdom.env({
    html: "<html><head></head><body></body></html>",
    scripts: [__dirname + "/../../vendor/jquery.js"],
    done: jsDomLoaded
  })

  function jsDomLoaded(errors, ctx) {
    global.window = ctx
    global.$ = window.$
    var features = JSON.parse(JSON.stringify(window.document.implementation._features))

    window.document.implementation.addFeature('FetchExternalResources', ['script'])
    window.document.implementation.addFeature('ProcessExternalResources', ['script'])
    window.document.implementation.addFeature('MutationEvents', ['1.0'])
    done()
  }
})
