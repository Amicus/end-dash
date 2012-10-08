var jsdom = require("jsdom")
var fs = require("fs")
var _ = require("underscore")

;(function(global) {
  var window
    , scripts = []

  beforeEach(function(done) {
    jsdom.env({
      html: "<html><head></head><body></body></html>",
      done: function (errors, ctx) {
        window = ctx
        done()
      }
    })
  })

  global.html = function(file) {
    window.document.body.innerHTML = file
  }

  global.script = function(file) {
    var features = JSON.parse(JSON.stringify(window.document.implementation._features))

    window.document.implementation.addFeature('FetchExternalResources', ['script'])
    window.document.implementation.addFeature('ProcessExternalResources', ['script'])
    window.document.implementation.addFeature('MutationEvents', ['1.0'])

    script = window.document.createElement("script")
    script.onload = function(argument) {
      window.document.implementation._features = features
    }

    script.text = fs.readFileSync(file)
    window.document.documentElement.appendChild(script)
  }

}(global))
