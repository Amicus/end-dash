var createBrowser = require('./create_browser');

global.Backbone = require('backbone');
var EndDash = require('../../lib/end-dash');

before(function(done) {
  createBrowser({
    scripts: [
      __dirname + '/../../vendor/jquery.js',
    ]
  }, function(errors, _context) {
    global.window = _context;
    global.$ = window.$;
    done();
  });
});
