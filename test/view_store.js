require('./support/helper');

var ViewStore = require('../lib/view_store'),
    viewStore = new ViewStore();

describe('viewStore', function() {
  it('loads views using .load', function() {
    var MyView = {};
    viewStore.load('my view', MyView);
    expect(viewStore.getView('my view')).to.be(MyView);
  });

  it('falls back to a getView function if one is provided', function(done) {
    viewStore.setCustomGetView(function(name) {
      expect(name).to.be('my custom view');
      done();
    });

    viewStore.getView('my custom view');
    viewStore.setCustomGetView(null);
  });

  it('prefers `.load`ed functions to getView if both are specified', function() {
    viewStore.setCustomGetView(function(name) {
      return {};
    });

    var LoadedView = {};
    viewStore.load('my loaded view', LoadedView);
    expect(viewStore.getView('my loaded view')).to.be(LoadedView);
    viewStore.setCustomGetView(null);
  });

  it('errors when template isn\'t found', function() {
    expect(function() {
      viewStore.getView('not loaded');
    }).to.throwError(/Could not find view/);
  });
});
