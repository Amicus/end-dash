var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , Model = Backbone.Model
  , Collection = Backbone.Collection
  , ed = require("../lib/end-dash")

function doneTimes(n, done) {
  return function(err) {
    if(err) { 
      return done(err) 
    }
    if(--n == 0) {
      return done()
    }
  }
}

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })
 
describe("When I initialize a template with a view bound to it", function() {
  it("it should deinitialize the view when I remove the model")
  it("it should deinitialize the view when I change the model", function(done) {
    done = doneTimes(2, done)
    var firstModel = new Model({ name: "Hello" })
      , secondModel = new Model({ name: "Goodbye" })
      , TemplateGenerator = window.require("/lib/end-dash")
      , $ = window.$
      , Template
      , template

    function MockView(opts) {
      this.opts = opts
    }

    MockView.prototype.stopListening = function() {
      expect(this.opts.model).to.be(firstModel)
      done()
    }

    MockView.prototype.undelegateEvents = function() {
      expect(this.opts.model).to.be(firstModel)
      done()
    }

    TemplateGenerator.registerView("TestView", MockView)

    Template = new TemplateGenerator('<div class = "thing- testView-"><span class="name"></span></div>').generate()
    template = new Template({ thing: firstModel })
    template.set("thing", secondModel)
  })
}) 
