var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

function createCollection(numberOfElements, modelPropertiesCallback) {
  var models = []
  for(var i = 0; i < numberOfElements ; i++) {
    models.push(new Backbone.Model(modelPropertiesCallback()))
  }
  return new Backbone.Collection(models)
}

function jqts(element) {
  return $("<div>").append(element.clone()).html()
}

describe("A nested collection", function() {
  it("should support collections in collections in collections", function() {
    var markup = fs.readFileSync(__dirname + "/support/collectionception.html").toString()
      , TemplateGenerator = window.require("/lib/end-dash")
      , Template = new TemplateGenerator(markup).generate()

    var i = 0
    var things = createCollection(2, function() {
      return { items: createCollection(2, function() {
          return { objects: createCollection(2, function() {
              return { name: "hey" + (i++) }
            }) 
          }
        }) 
      }
    })
    var template = new Template()
    template.set({things: things})

    $("body").html(template.template)
  })
})

