var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")

scriptModule(path.join(__dirname, "..", "lib", "end-dash.js"))

describe("An enumerable template", function() {

  it("should set all the values in the html", function () {
    var EndDash = window.require("/lib/end-dash") 
      , template = new EndDash(fs.readFileSync(__dirname + "/support/enumerable.html").toString())

    template.set("people", [{name: "Zach"}, {name: "Dog"}])

    $("body").append(template.template)
    expect($(".people- .person-:nth-child(1) .name-").html()).to.be("Zach")
    expect($(".people- .person-:nth-child(2) .name-").html()).to.be("Dog")
  })

}) 
