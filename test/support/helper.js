var createBrowser = require('./create_browser');

before(function(done) {
  require('../../lib/end-dash');

  createBrowser({
    scripts: [__dirname + '/../../vendor/jquery.js']
  }, function(errors, _context) {
    global.window = _context;
    global.$ = window.$;
    done();
  });
});

afterEach(function(){
  this.template && this.template.cleanup()
})
