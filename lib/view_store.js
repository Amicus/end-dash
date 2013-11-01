function ViewStore() {
  this.views = {};
}

ViewStore.prototype.load = function(name, View) {
  this.views[name] = View;
};

ViewStore.prototype.getView = function(name) {
  if (this.views[name]) {
    return this.views[name];
  } else {
    throw new Error('Could not find view named "'+name+'". Please use '+
                    'EndDash.registerView(name, MyView) to register views.');
  }
};

ViewStore.prototype.setCustomGetView = function(fn) {
  this.getView = fn;
};


module.exports = ViewStore

