var VIEWS = {},
    getView;

exports.load = function(name, View) {
  VIEWS[name] = View;
};

exports.getView = function(name) {
  if (VIEWS[name]) {
    return VIEWS[name];

  } else if (typeof getView === 'function') {
    return getView(name);

  } else {
    throw new Error('Could not find view named "'+name+'". Please use '+
                    'EndDash.registerView(name, MyView) to register views.');
  }
};

exports.setCustomGetView = function(fn) {
  getView = fn;
};
