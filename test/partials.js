require('./support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    _ = require("underscore"),
    EndDash = require("../lib/end-dash"),
    Backbone = EndDash.Backbone,
    generateTemplate = require("./support/generate_template");

describe("A template with partials", function() {
  it("should do collections", function() {
    var templates = [
      "/support/templates/partials.html",
      "/support/templates/embedded_partial.html",
      "/support/templates/list_item.html"
    ];

    var model = {
      items: new Backbone.Collection([{ variable: "wat1" }, { variable: "wat2" }]),
      thing: new Backbone.Model({ name: "Zach" })
    };

    _(templates).each(function(template) {
      EndDash.registerTemplate(template, fs.readFileSync(__dirname + template).toString());
    });

    var template = generateTemplate(model, '/support/templates/partials.html');

    expect($(".items- li div div:nth-child(1)").html()).to.be("wat1");
    expect($(".items- li div div:nth-child(2)").html()).to.be("wat2");
    expect($(".thing- .name-").html()).to.be("Zach");
    expect($("embed").length).to.be(0);
  });
});
