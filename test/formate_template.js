var formate_templates = require('../lib/formate_templates')
  , fs = require('fs')
  , expect = require('expect.js')

    require('./support/helper')

describe('With a templates directory with two EndDash templates', function(){
    beforeEach(function(done){
      formate_templates(__dirname + "/support/small_template_directory/", __dirname, done)
    })
    afterEach(function(){
      fs.unlinkSync(__dirname + '/end_dash_templates.js')
    })

    it("should find both files ending in .js.ed and output a single script tag separated file", function(){
      expect(fs.existsSync(__dirname + "/end_dash_templates.js")).to.be(true)
      var endDash_templates = fs.readFileSync(__dirname + "/end_dash_templates.js", 'utf8').split("</script>")
      if (endDash_templates[endDash_templates.length -1] == '\n') { // Template creation finishes with an extra \n
        endDash_templates.pop()
      }
      expect(endDash_templates.length).to.be(2)
    })
})

describe('With a large templates directory ', function(){
  beforeEach(function(done){
    formate_templates(__dirname + "/support", __dirname, done)
  })
  afterEach(function(){
    fs.unlinkSync(__dirname + "/end_dash_templates.js")
  })

  it("should recursively aggregate all files ending in .html or .js.ed into a single templates file", function(){
    expect(fs.existsSync(__dirname + "/end_dash_templates.js")).to.be(true)
    var endDash_templates = fs.readFileSync(__dirname + "/end_dash_templates.js", 'utf8').split("</script>")
    if (endDash_templates[endDash_templates.length -1] == '\n') { // Template creation finishes with an extra \n
      endDash_templates.pop()
    }
    expect(endDash_templates.length).to.be(15)
  })
})

