var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , ed = require("../lib/end-dash")
  , jqts = require("../lib/util").jqts
  , Reaction = require("../lib/reaction")

describe("EndDash.reactTo", function() {
  describe("when I setup a reactor", function() {
    it("should parse and initialize it", function(done) {
      var EndDash = window.require("/lib/end-dash")
        , $ = window.$
        , parsed = false

      var TestReaction = Reaction.extend({
        selector: "[data-test]",
        parse: function(el) {
          parsed = true
                
          expect($(el).hasClass("test")).to.be(true)
        },

        init: function(el, model) {
          expect(parsed).to.be(true)

          expect(model).to.be(data.thing)
          expect($(el).hasClass("test")).to.be(true)
          done()
        }
      })
      EndDash.registerReaction(TestReaction)

      var Template = new EndDash('<div class="thing-"><div class="test" data-test="testValue"><span class="val-"></span></div></div>').generate()
        , data = { thing: { val: "yay" } }

      var template = new Template(data)
    })
  })
  it("should work with multiple reactions of the same type")
})
