require('./support/helper');

var expect = require("expect.js"),
    fs = require("fs"),
    Backbone = require('../lib/end-dash').Backbone,
    generateTemplate = require("./support/generate_template");


describe("new looping", function () {
    beforeEach(function () {
        this.markup = '<div>' +
          '<div>' +
            'Some text:' +
            '<div class="users-">' +
              '<ul>' +
                '<li data-each></li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
        '</div>';
        this.users = new Backbone.Collection([
            new Backbone.Model({ name: "bob" }),
            new Backbone.Model({ name: "jones" })
        ]);
        this.template = generateTemplate({ users: this.users }, this.markup);
    });

    it("should work", function () {
        expect($(".users- li").length).to.equal(2)
    });
});
