require('./support/helper');

var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , Backbone = require("backbone")
  , generateTemplate = require("./support/generate_template")

describe("A collection template", function() {
  describe("when I bind to a Backbone collection", function() {
    beforeEach(function () {
      this.things = new Backbone.Collection([
        new Backbone.Model({ type: "awesome" }),
        new Backbone.Model({ type: "cool" })
      ]);

      this.markup = fs.readFileSync(__dirname + "/support/templates/polymorphic.html").toString()
      this.template = generateTemplate({ things: this.things }, this.markup)
    })
 
    it("should change the item when the type changes", function() {
      expect($(".things- li div:nth-child(1)").html()).to.be("awesome")
      expect($(".things- li div:nth-child(2)").html()).to.be("cool")

      expect($(".things- li div:nth-child(1)").hasClass("whenAwesome-")).to.be(true)
      expect($(".things- li div:nth-child(2)").hasClass("whenCool-")).to.be(true)

      this.things.at(0).set("type", "cool")
      this.things.at(1).set("type", "awesome")

      expect($(".things- li div:nth-child(1)").html()).to.be("cool")
      expect($(".things- li div:nth-child(2)").html()).to.be("awesome")

      expect($(".things- li div:nth-child(1)").hasClass("whenCool-")).to.be(true)
      expect($(".things- li div:nth-child(2)").hasClass("whenAwesome-")).to.be(true)
    })

    it("should remove the correct element on remove even if the element has moved", function() {
      var model = this.things.last()
      expect($(".things- li div:nth-child(2)").html()).to.be("cool")
      var el = $(".things- li div:nth-child(2)")
      // move cool from second position to the first position (outside of endDash)
      el.insertBefore($('.things- li div:nth-child(1)'))
      //we expect the first one to be cool now
      expect($('.things- li div:nth-child(1)').html()).to.be('cool')
      // then we remove cool
      this.things.remove(model)
      // and expect the first one to be awesome
      expect($(".things- li div:nth-child(1)").html()).to.be("awesome")
    })

    it("should support iterating on a collection multiple times in a single template", function() {
      var name1 = "Zach"
        , name2 = "Dog"
        , age1  = "26"
        , age2  = "6"
        , model = { people: [{name: name1, age: age1}, {name: name2, age: age2}] }
        , template = generateTemplate(model, fs.readFileSync(__dirname + "/support/templates/multiple_iteration.html").toString())
      expect($(".people- ul.names li div:nth-child(1)").html()).to.be(name1)
      expect($(".people- ul.names li div:nth-child(2)").html()).to.be(name2)

      expect($(".people- ul.ages li div:nth-child(1)").html()).to.be(age1)
      expect($(".people- ul.ages li div:nth-child(2)").html()).to.be(age2)
    })

    it("should support collection attributes if model's attribute interface is extended to collections", function() {
      var name1 = "Zach"
        , name2 = "Dog"
        , age1  = "26"
        , age2  = "6"
        , totalCount = 2
        , model = { people: new Backbone.Collection([{name: name1, age: age1}, {name: name2, age: age2}]) }
        , template = generateTemplate(model, fs.readFileSync(__dirname + "/support/templates/multiple_iteration.html").toString())
      model['people'].get = function(attribute) {  console.log('get called'); return totalCount.toString() }
      expect($(".people- span.totalCount-").html()).to.be(totalCount.toString())
      expect($(".people- ul.names li div:nth-child(1)").html()).to.be(name1)
      expect($(".people- ul.names li div:nth-child(2)").html()).to.be(name2)

      expect($(".people- ul.ages li div:nth-child(1)").html()).to.be(age1)
      expect($(".people- ul.ages li div:nth-child(2)").html()).to.be(age2)
    })
  })

  describe("when I bind to an array literal", function() {
    beforeEach(function () {
      this.things = [
        new Backbone.Model({ type: "awesome" }),
        new Backbone.Model({ type: "cool" })
      ];

      this.markup = fs.readFileSync(__dirname + "/support/templates/polymorphic.html").toString()
      this.template = generateTemplate({ things: this.things }, this.markup)
    })

    it("should change the item when the type changes", function() {
      expect($(".things- li div:nth-child(1)").html()).to.be("awesome")
      expect($(".things- li div:nth-child(2)").html()).to.be("cool")

      expect($(".things- li div:nth-child(1)").hasClass("whenAwesome-")).to.be(true)
      expect($(".things- li div:nth-child(2)").hasClass("whenCool-")).to.be(true)

      this.things[0].set("type", "cool")
      this.things[1].set("type", "awesome")

      expect($(".things- li div:nth-child(1)").html()).to.be("cool")
      expect($(".things- li div:nth-child(2)").html()).to.be("awesome")

      expect($(".things- li div:nth-child(1)").hasClass("whenCool-")).to.be(true)
      expect($(".things- li div:nth-child(2)").hasClass("whenAwesome-")).to.be(true)
    })

    it("should not support updating when array elements are removed", function() {
      var model = this.things[1]
      expect($(".things- li div:nth-child(2)").html()).to.be("cool")
      var el = $(".things- li div:nth-child(2)")
      // move cool from second position to the first position (outside of endDash)
      el.insertBefore($('.things- li div:nth-child(1)'))
      //we expect the first one to be cool now
      expect($('.things- li div:nth-child(1)').html()).to.be('cool')
      // then we remove cool
      this.things.pop()
      // and expect the first one to be awesome
      expect($(".things- li div:nth-child(1)").html()).to.be("cool")
    })
  })
})

describe("With a nested collection template", function(){
  describe("Binding to a Backbone Model with a literal array as a property", function(){
    beforeEach(function(){
        this.things = [
          new Backbone.Model({ type: "awesome" }),
          new Backbone.Model({ type: "cool" })
        ];
        this.topLevelObject = new Backbone.Model({ things: this.things })
        this.markup = "<div class='things-'>" +
                          "<div data-each>" +
                            "<div>" +
                              "<div class=type-'>" +
                              "</div>" +
                            "</div>" +
                          "</div>" +
                      "</div>"
        this.template = generateTemplate(this.topLevelObject, this.markup)
    })
    it("should change when the types change", function(){
      expect($(".things- div div:nth-child(1) div").html()).to.be("awesome")
      expect($(".things- div div:nth-child(2) div").html()).to.be("cool")

      this.things[0].set("type", "cool")
      this.things[1].set("type", "awesome")

      expect($(".things- div div:nth-child(1) div").html()).to.be("cool")
      expect($(".things- div div:nth-child(2) div").html()).to.be("awesome")
    })
    it("should not support updates when objects are removed from the array", function(){
      this.things.pop()
      expect($(".things- div div:nth-child(1) div").html()).to.be("awesome")
    })
    it("should not support updates when moving the objects within the array literal", function(){
      var model1 = this.things[0]
      this.things[0] = this.things[1]
      this.things[1] = model1
      expect($(".things- div div:nth-child(1) div").html()).to.be("awesome")
      expect($(".things- div div:nth-child(2) div").html()).to.be("cool")
    })
  })
})


