var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")

script(path.join(__dirname, "..", "lib", "end-dash.js"), { module: true })
script(path.join(__dirname, "..", "lib", "collection.js"), { module: true })

describe("A bound template", function() {

  it("should set all the values in the html", function () { 
    var Template = window.require("/lib/end-dash") 
      , template = new Template('<div class = "singleVariable-"></div>')
      , boundCallback
      , i = 0
      , bindable = {
      get: function(field) {
        expect(field).to.be("singleVariable")
        return "value " + i++
      },
      on: function(eventName, callback) {
        expect(eventName).to.be("change:singleVariable")
        boundCallback = callback
      }
    }

    template.bind(["singleVariable"], bindable)
    $("body").append(template.template)

    expect($(".singleVariable-").html()).to.be("value 0")
    boundCallback.call(bindable)
    expect($(".singleVariable-").html()).to.be("value 1")
  })
})
