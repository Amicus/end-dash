var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , generateTemplate = require("./util").generateTemplate

describe("An embedded model", function() {
  it("should set all the values in the html", function () {
    var template = generateTemplate({ survey: { name: "A Survey", person: { name: "Zach" } } }, fs.readFileSync(__dirname + "/support/embedded_models.html").toString())

    expect($("#surveyName").html()).to.be("A Survey")
    expect($(".person- .name-").html()).to.be("Zach")
  })
})
