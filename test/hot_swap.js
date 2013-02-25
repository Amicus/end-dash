var expect = require("expect.js")
  , generateTemplate = require("./util").generateTemplate
  , Parser = require("../lib/end-dash")

  , startMarkup = '<div class="model-">' +
                    '<span class="name-"></span>' + 
                    '<div class="thing-">' +
                      '<span class="title-"></span>' + 
                    '</div>' +
                  '</div>'

  , endMarkup = '<div class="model-">' +
                   '<div class="extra">asdf</div><div class="name-"></div>' + 
                   '<section class="thing-">' +
                     '<div class="other-"></div>' + 
                   '</section>' +
                 '</div>' 
       

describe("When I hot swap a template", function() {
  it("should use the new markup", function () {
    var model = { name: "dude", thing: { title: "I'm a thing", other: "another" } }
      
      , template = generateTemplate({ model: model }, startMarkup)
      , opts = (new Parser(endMarkup, { templateName: "/test/hotswapping" })).value()

    expect($(".model- span.name-").html()).to.be("dude")
    expect($(".model- div.thing- .title-").html()).to.be("I'm a thing")

    template.hotSwap(opts.structure, opts.markup)

    expect($(".model- .extra").html()).to.be("asdf")
    expect($(".model- div.name-").html()).to.be("dude")
    expect($(".model- section.thing- .other-").html()).to.be("another")
  })
})
