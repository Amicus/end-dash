require('./support/helper');

var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , generateTemplate = require("./support/generate_template")

describe("A polymporhic template", function() {

  it("should display the correct item based on type", function() {
    var model = { things: [{ type: "awesome" }, { type: "cool" }] } 
      , markup = fs.readFileSync(__dirname + "/support/templates/polymorphic.html").toString()
      , template = generateTemplate(model, markup)

    expect($(".things- .thing-:nth-child(1)").html()).to.be("awesome")
    expect($(".things- .thing-:nth-child(2)").html()).to.be("cool")

    expect($(".things- .thing-:nth-child(1)").hasClass("whenAwesome-")).to.be(true)
    expect($(".things- .thing-:nth-child(2)").hasClass("whenCool-")).to.be(true)
  })

  describe("when I bind to the collection", function() {
    it("should change the item when the type changes", function() {
      var things = new Backbone.Collection([ new Backbone.Model({ type: "awesome" }), new Backbone.Model({ type: "cool" }) ])
        , markup = fs.readFileSync(__dirname + "/support/templates/polymorphic.html").toString()
        , template = generateTemplate({ things: things }, markup)

      expect($(".things- .thing-:nth-child(1)").html()).to.be("awesome")
      expect($(".things- .thing-:nth-child(2)").html()).to.be("cool")

      expect($(".things- .thing-:nth-child(1)").hasClass("whenAwesome-")).to.be(true)
      expect($(".things- .thing-:nth-child(2)").hasClass("whenCool-")).to.be(true)

      things.at(0).set("type", "cool")
      things.at(1).set("type", "awesome")

      expect($(".things- .thing-:nth-child(1)").html()).to.be("cool")
      expect($(".things- .thing-:nth-child(2)").html()).to.be("awesome")

      expect($(".things- .thing-:nth-child(1)").hasClass("whenCool-")).to.be(true)
      expect($(".things- .thing-:nth-child(2)").hasClass("whenAwesome-")).to.be(true)
    })
  }) 
})
