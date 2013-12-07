require('../support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    _ = require("underscore"),
    EndDash = require("../../lib/end-dash"),
    Backbone = EndDash.Backbone,
    generateTemplate = require("../support/generate_template");

describe("A template with partials", function() {
  it("should do collections", function() {
    var model = {
      items: new Backbone.Collection([{ variable: "wat1" }, { variable: "wat2" }]),
      thing: new Backbone.Model({ name: "Zach" })
    };

    EndDash.templateStore.load("/templates/partials.html", fs.readFileSync(__dirname + "/templates/partials.html").toString());
    EndDash.templateStore.load("/templates/embedded_partial.html", fs.readFileSync(__dirname + "/templates/embedded_partial.html").toString());
    EndDash.templateStore.load("/templates/list_item.html", fs.readFileSync(__dirname + "/templates/list_item.html").toString());

    var template = generateTemplate(model, '/templates/partials.html');

    expect($(".items- .item-:nth-child(1) .variable-").html()).to.be("wat1");
    expect($(".items- .item-:nth-child(2) .variable-").html()).to.be("wat2");
    expect($(".thing- .name-").html()).to.be("Zach");
    expect($("embed").length).to.be(0);
  });
});
