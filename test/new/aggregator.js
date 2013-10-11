var Aggregator = require('../../lib/server_side_dash/aggregator')
  , fs = require('fs')
  , expect = require('expect.js')

    require('../helper')

describe('Using the Javascript aggregator', function(){
  describe('With a templates directory', function(){
    beforeEach(function(done){
      var aggregator = new Aggregator({templateDir: __dirname + "/../support/templates/", serveRoot: __dirname})
      aggregator.loadFiles()
      done()
    })

    afterEach(function(){
      fs.unlinkSync(__dirname + '/EndDashTemplates.js')
    })

    it("should find the EndDash templates, and combine them into a single file", function(){
      expect(fs.existsSync(__dirname + "/EndDashTemplates.js")).to.be(true)
    })

    it("each template in the directory should be wrapped in script of type EndDash with a name" +
      "that includes their path from the root template directory", function(){
      var aggregate_file = fs.readFileSync(__dirname + "/EndDashTemplates.js", 'utf8')
      var templates = aggregate_file.split("</script>")
      expect(templates.length).to.be(4)
      expect(templates[templates.length-1]).to.be('\n') //Account for extra \n in templates
    })
  })
})