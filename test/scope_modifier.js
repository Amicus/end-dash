var expect = require("expect.js")
  , fs = require("fs")
  , generateTemplate = require("./util").generateTemplate
  , markup = ''

describe("An embedded model", function() {
  it("should be able to step out of a scope", function() {
    var model = { 
      name: "slash",
      boot: { 
        name: "boot",
        item: {
          name: "boot-item" 
        }
      },
      root: {
        name: "root", 
        thing: { 
          name: "thing",
          dude: {
            name: "dude" 
          },
          item: {
            name: "item" 
          }
        } 
      }
    }
    var template = generateTemplate(model, fs.readFileSync(__dirname + "/support/scopes.html").toString())
    console.log($("body").html())
  })
})
