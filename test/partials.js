require('./support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    _ = require("underscore"),
    EndDash = require("../lib/end-dash"),
    Backbone = EndDash.Backbone,
    generateTemplate = require("./support/generate_template");

describe("A template with partials", function() {
  it("should do collections", function() {

    var model = {
      items: new Backbone.Collection([{ variable: "wat1" }, { variable: "wat2" }]),
      thing: new Backbone.Model({ name: "Zach" })
    };

    EndDash.templateStore.load("/support/templates/partials.html", fs.readFileSync(__dirname + "/support/templates/partials.html").toString());
    EndDash.templateStore.load("/support/templates/embedded_partial.html", fs.readFileSync(__dirname + "/support/templates/embedded_partial.html").toString());
    EndDash.templateStore.load("/support/templates/list_item.html", fs.readFileSync(__dirname + "/support/templates/list_item.html").toString());

    var template = generateTemplate(model, '/support/templates/partials.html');

    expect($(".items- li div div:nth-child(1)").html()).to.be("wat1");
    expect($(".items- li div div:nth-child(2)").html()).to.be("wat2");
    expect($(".thing- .name-").html()).to.be("Zach");
    expect($("embed").length).to.be(0);
  });
});
