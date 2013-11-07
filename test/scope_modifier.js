require('./support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    generateTemplate = require("./support/generate_template");

describe("An template", function() {
  describe("which has data-scope attributes", function() {
    before(function() {
      var root = {
        name: "root",
        boot: {
          name: "boot",
          sock: {
            name: "sock"
          }
        },
        model: {
          name: "model",
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
      };
      var template = generateTemplate(root, fs.readFileSync(__dirname + "/support/templates/scopes.html").toString());
    });

    it("should be able to access the root scope", function() {
      expect($("#rootName").html()).to.be("root");
    });

    it("should be able to access child models of the root scope", function() {
      expect($("#modelName").html()).to.be("model");
    });

    it("should be able to access a relative scope", function() {
      expect($("#thingName").html()).to.be("thing");
    });

    it("should be able to access a model after relative scope", function() {
      expect($("#itemName").html()).to.be("item");
    });

    it("should be able to modify the scope of a model", function() {
      expect($("#sockName").html()).to.be("sock");
    });
  });
});
