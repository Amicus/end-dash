var expect = require('expect.js'),
    createBrowser = require('./support/create_browser');

describe('With an existing backbone', function() {
  var context;

  before(function(done) {
    createBrowser({
      scripts: [
        __dirname + '/../vendor/jquery.js',
        __dirname + '/../vendor/underscore.js',
        __dirname + '/../vendor/backbone.js',
        __dirname + '/../build/end-dash.js'
      ]
    }, function(errors, _context) {
        context = _context;
        done(errors);
    });
  });

  it('defers to window.Backbone', function() {
    expect(context.EndDash.Backbone).to.be(context.Backbone);
  });
});

describe('Without an existing backbone', function() {
  var context;

  before(function(done) {
    createBrowser({
      scripts: [
        __dirname + '/../vendor/jquery.js',
        __dirname + '/../vendor/underscore.js',
        __dirname + '/../build/end-dash.js'
      ]
    }, function(errors, _context) {
        context = _context;
        done(errors);
    });
  });

  it('loads its own Backbone', function() {
    expect(context.Backbone).to.not.be.ok();
    expect(context.EndDash.Backbone).to.be.ok();
  });
});
