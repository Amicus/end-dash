require('./support/helper');

var ViewStore = require('../lib/view_store'),
    expect = require("expect.js");

describe('ViewStore', function() {
  it('loads views using .load', function() {
    var MyView = {};
    ViewStore.load('my view', MyView);
    expect(ViewStore.getView('my view')).to.be(MyView);
  });

  it('falls back to a getView function if one is provided', function(done) {
    ViewStore.setCustomGetView(function(name) {
      expect(name).to.be('my custom view');
      done();
    });

    ViewStore.getView('my custom view');
    ViewStore.setCustomGetView(null);
  });

  it('prefers `.load`ed functions to getView if both are specified', function() {
    ViewStore.setCustomGetView(function(name) {
      return {};
    });

    var LoadedView = {};
    ViewStore.load('my loaded view', LoadedView);
    expect(ViewStore.getView('my loaded view')).to.be(LoadedView);
    ViewStore.setCustomGetView(null);
  });

  it('errors when template isn\'t found', function() {
    expect(function() {
      ViewStore.getView('not loaded');
    }).to.throwError(/Could not find view/);
  });
});
