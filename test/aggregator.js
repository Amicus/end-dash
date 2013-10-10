var Aggregator = require('../lib/server_side_dash/aggregator')
    fs = require('fs')

describe('With a set of nested templates', function(){
  it("should correctly find them, and combine them to a single file", function(){
    var aggregator = new Aggregator({templateDir: __dirname + "/support/templates/", serveRoot: __dirname})
  })


})