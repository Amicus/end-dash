function ViewStore() {

  this.VIEWS = {};
}

ViewStore.prototype.load = function(name, View) {
  this.VIEWS[name] = View;
};

ViewStore.prototype.getView = function(name) {
  if (this.VIEWS[name]) {
    return this.VIEWS[name];
  } else {
    throw new Error('Could not find view named "'+name+'". Please use '+
                    'EndDash.registerView(name, MyView) to register views.');
  }
};

ViewStore.prototype.setCustomGetView = function(fn) {
  this.getView = fn;
};


module.exports = ViewStore

