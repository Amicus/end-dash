var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")

describe("An embedded model", function() {

  it("should set all the values in the html", function () {
    var TemplateGenerator = window.require("/lib/end-dash")
      , Template = new TemplateGenerator(fs.readFileSync(__dirname + "/support/embedded_models.html").toString()).generate()
      , template = new Template({ survey: { name: "A Survey", person: { name: "Zach" } } })

    $("body").append(template.template)

    expect($("#surveyName").html()).to.be("A Survey")

    expect($(".person- .name-").html()).to.be("Zach")
  })
})
