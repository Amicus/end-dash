function ViewStore() {

  var VIEWS = {},
      getView;

  this.load = function(name, View) {
    VIEWS[name] = View;
  };

  this.getView = function(name) {
    if (VIEWS[name]) {
      return VIEWS[name];

    } else if (typeof getView === 'function') {
      return getView(name);

    } else {
      throw new Error('Could not find view named "'+name+'". Please use '+
                      'EndDash.registerView(name, MyView) to register views.');
    }
  };

  this.setCustomGetView = function(fn) {
    getView = fn;
  };

}

module.exports = ViewStore

