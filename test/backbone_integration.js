var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")

function jqts(element) {
  return $("<div>").append(element.clone()).html()
}

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

describe("when integrating with backbone", function() {
  it("it should bind to a preloaded collection")
  it("it should bind to a collection that has not yet loaded")
  it("it should bind to a model that has not yet loaded")
  it("it should bind to a preloaded model")
  it("it should drill down and find associated models")
  it("it should throw an error when a model or collection is not found")
  it("it should populate a collection within a module", function(done) {
    var questions = new Backbone.Collection([
      new Backbone.Model({ name: "q1", answer: new Backbone.Model({ name: "a1" }) }), 
      new Backbone.Model({ name: "q2", answer: new Backbone.Model({ name: "a2" }) }), 
      new Backbone.Model({ name: "q3", answer: new Backbone.Model({ name: "a3" }) })
    ])
    var script = new Backbone.Model({ name: "the name", questions: questions })
      , markup = fs.readFileSync(__dirname + "/support/complex_nested.html").toString()
      , TemplateGenerator = window.require("/lib/end-dash")
      , Template = new TemplateGenerator(markup).generate()
      , template = new Template({ script: script }) 

    $("body").html(template.template)
    expect($(".script- .name-:nth-child(1)").html()).to.be("the name")

    expect($(".script- .question-:nth-child(1) > .arb > .name-").html()).to.be("q1")
    expect($(".script- .question-:nth-child(2) > .arb > .name-").html()).to.be("q2")
    expect($(".script- .question-:nth-child(3) > .arb > .name-").html()).to.be("q3")

    expect($(".script- .question-:nth-child(1) > .answer- > .name-").html()).to.be("a1")
    expect($(".script- .question-:nth-child(2) > .answer- > .name-").html()).to.be("a2")
    expect($(".script- .question-:nth-child(3) > .answer- > .name-").html()).to.be("a3")
    done()
  })

  it("it should update the collection after reset", function(done) {
    var models = [
      new Backbone.Model({ name: "q1", answer: new Backbone.Model({ name: "a1" }) }), 
      new Backbone.Model({ name: "q2", answer: new Backbone.Model({ name: "a2" }) }), 
      new Backbone.Model({ name: "q3", answer: new Backbone.Model({ name: "a3" }) })
    ]
    var questions = new Backbone.Collection()
    var script = new Backbone.Model({ name: "the name", questions: questions })
      , markup = fs.readFileSync(__dirname + "/support/complex_nested.html").toString()
      , TemplateGenerator = window.require("/lib/end-dash")
      , Template = new TemplateGenerator(markup).generate()
      , template = new Template({ script: script }) 

    $("body").html(template.template)

    questions.reset(models)
    expect($(".script- .name-:nth-child(1)").html()).to.be("the name")

    expect($(".script- .question-:nth-child(1) > .arb > .name-").html()).to.be("q1")
    expect($(".script- .question-:nth-child(2) > .arb > .name-").html()).to.be("q2")
    expect($(".script- .question-:nth-child(3) > .arb > .name-").html()).to.be("q3")

    expect($(".script- .question-:nth-child(1) > .answer- > .name-").html()).to.be("a1")
    expect($(".script- .question-:nth-child(2) > .answer- > .name-").html()).to.be("a2")
    expect($(".script- .question-:nth-child(3) > .answer- > .name-").html()).to.be("a3")
    done()
  }) 

/*
 * <div class = "isThing- script-"> this will try to build the selector for isThing- 
 * from within the contents of script-, which it will never find!
 **/
})

