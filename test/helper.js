var jsdom = require("jsdom")
  , fs = require("fs")
  , _ = require("underscore")
  , path = require("path")

;(function(global) {

  var scripts = [ __dirname + "/../vendor/jquery.js"
                , __dirname + "/../lib/browser-require.js" ]

    , scriptModules = { "/node_modules/underscore.js": path.resolve(__dirname + "/../node_modules/underscore/underscore.js")
                      , "/node_modules/inflection.js": path.resolve(__dirname + "/../lib/inflection.js") }
    , window
    , projectRoot = path.resolve(__dirname + "/..")

  /* 
   * these scripts get loaded by each test automatically, 
   * since we have not yet loaded a jsdom instance we
   * store the scripts to load once jsdom starts
   */
  global.script = function () {
    var opts = _.last(arguments) 
      , paths

    if(typeof opts === "object") {
      paths = _.initial(arguments)
    } else {
      paths = _.toArray(arguments)
      opts = { module: false }
    }

    if(opts.module) {
      loadModuleScript(paths)
    } else {
      loadScript(paths)
    }
  }

  function loadScript() {
    scripts.push.apply(scripts, arguments)
  }

  function loadModuleScript() {
    _.each(arguments, function(script) {
      var requirePath = path.resolve(script)
      scriptModules[requirePath] = script
    })
  }


  function wrapWithModule(module, contents) {
    return 'require.register("' + module.replace(projectRoot, "") + '", ' 
         + 'function(module, exports, require, global) {\n' 
         + contents + '})\n'
  }

  beforeEach(function(done) {
    jsdom.env({
      html: "<html><head></head><body></body></html>",
      scripts: scripts,
      src: _(scriptModules).map(function(script, module) {
        console.log(script)
        var contents = fs.readFileSync(script)

        return wrapWithModule(module, contents)
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

      global.script = function() {
        var opts
          , paths

        if(typeof opts === "object") {
          paths = _.initial(arguments)
          opts =  _.last(arguments) 
        } else {
          paths = _.toArray(arguments)
          opts = { module: false }
        }
 
        _(paths).each(function(file) {
          var features = JSON.parse(JSON.stringify(window.document.implementation._features))

          window.document.implementation.addFeature('FetchExternalResources', ['script'])
          window.document.implementation.addFeature('ProcessExternalResources', ['script'])
          window.document.implementation.addFeature('MutationEvents', ['1.0'])

          script = window.document.createElement("script")
          script.onload = function(argument) {
            window.document.implementation._features = features
          }

          if(opts.module) {
            script.text = wrapWithModule(file, fs.readFileSync(file))
          } else {
            script.text = fs.readFileSync(file)
          }
          window.document.documentElement.appendChild(script)
        })
      }
    }
  })

}(global))
