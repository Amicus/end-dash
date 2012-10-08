var path = require("path")


describe("Setting a single variable", function() {
  it("should be set in the html", function (done) {
    script(path.join(__dirname, "herp.js"))
  })
})
