var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })
script(path.join(__dirname, "..", "lib", "parser.js"), { module: true })
script(path.join(__dirname, "..", "lib", "util.js"), { module: true })

describe("A template", function() {
  it("should have a method to get subtemplates", function() {
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

    var script = template.get("script")
      , questions = script.get("questions")
      , firstQuestion = questions.at(0)

    expect(script.container.is(".script-")).to.be(true)
    expect(questions.container.is(".questions-")).to.be(true)
    expect(firstQuestion.template.is(".question-")).to.be(true)
  })
})
 
function jqts(element) {
  return $("<div>").append(element.clone()).html()
}
   
