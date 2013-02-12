var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , generateTemplate = require("./util").generateTemplate
  , Factory = require("test-things").Factory



describe("when integrating with backbone", function() {
  beforeEach(function() {
    this.answerFactory = new Factory(Backbone.Model, { 
      name: "a{{sequence(1)}}" 
    })
    this.questionFactory = new Factory(Backbone.Model, { 
      name: "q{{sequence(1)}}", 
      answer: this.answerFactory 
    })
    this.questionCollectionFactory = this.questionFactory.collectionFactory(Backbone.Collection, 3)
    this.scriptFactory = new Factory(Backbone.Model, { 
      name: "the name", 
      questions: this.questionCollectionFactory
    }) 
  })
  describe("I pass a backbone model to set", function() {
    it("should set it's attributes", function() {
      var model = new Backbone.Model({ name: "q1", title: "herp" })
        , markup = '<div><div class = "name-"></div><div class = "title-"></div></div>'
        , template = generateTemplate(model, markup)

      $("body").html(template.template)

      expect($(".name-").html()).to.be("q1")
      expect($(".title-").html()).to.be("herp")
    })
  })

  it("it should populate a collection within a model", function(done) {
    var script = this.scriptFactory.generate()
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
    var script = this.scriptFactory.generate({ questions: this.questionCollectionFactory.generate(0) })
      , markup = fs.readFileSync(__dirname + "/support/complex_nested.html").toString()
      , template = generateTemplate({ script: script }, markup) 

    script.get("questions").reset(this.questionCollectionFactory.generate().models)

    expect($(".script- .name-:nth-child(1)").html()).to.be("the name")

    expect($(".script- .question-:nth-child(1) > .arb > .name-").html()).to.be("q1")
    expect($(".script- .question-:nth-child(2) > .arb > .name-").html()).to.be("q2")
    expect($(".script- .question-:nth-child(3) > .arb > .name-").html()).to.be("q3")

    expect($(".script- .question-:nth-child(1) > .answer- > .name-").html()).to.be("a1")
    expect($(".script- .question-:nth-child(2) > .answer- > .name-").html()).to.be("a2")
    expect($(".script- .question-:nth-child(3) > .answer- > .name-").html()).to.be("a3")
    done()
  }) 
})

