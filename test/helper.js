var jsdom = require("jsdom")
  , fs = require("fs")
  , _ = require("underscore")
  , path = require("path")

;(function(global) {
  var scripts = [ "http://code.jquery.com/jquery.js"
                , __dirname + "/../lib/browser-require.js" ]
    , scriptModules = {}
    , window

  /* 
   * these scripts get loaded by each test automatically, 
   * since we have not yet loaded a jsdom instance we
   * store the scripts to load once jsdom starts
   */
  global.script = function (script) {
    scripts.push(script)
  }

  var projectRoot = path.resolve(__dirname + "/..")

  global.scriptModule = function (script) {
    var requirePath = path.resolve(script).replace(projectRoot, "")
    scriptModules[requirePath] = script
  }

  beforeEach(function(done) {
    console.log(scripts)
    jsdom.env({
      html: "<html><head></head><body></body></html>",
      scripts: scripts,
      src: _(scriptModules).map(function(script, module) {
        var contents = fs.readFileSync(script)

        return 'require.register("' + module + '", ' 
             + 'function(module, exports, require, global) {\n' 
             + contents + '})\n'
      }),
      done: jsDomLoaded
    })

    function jsDomLoaded(errors, ctx) {
      window = global.window = ctx
      if(window.$) {
        global.$ = window.$
      }
      done()

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
    }
  })

}(global))
