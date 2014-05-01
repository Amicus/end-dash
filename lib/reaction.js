var Backbone = require('./end-dash').Backbone,
    get = require("./util").get,
    _ = require("underscore"),
    extend = Backbone.Model.extend,
    getPresenter;

getPresenter = function(model) {
  return model;
};

function Reaction(properties) {
  this.cid = _.uniqueId("Reaction");
  _.extend(this, properties);
}

Reaction.reactIf = function() {
  return true;
};

Reaction.prototype.getPresenter = function(model) {
  return getPresenter(model);
};

Reaction.prototype.start = function(el, stack, next) {
  var that = this;

  this.el = el;
  this.stack = stack.slice(0);
  this.model = _.last(this.stack);
  this._presenter = getPresenter(this.model);
  this.relevantModels = [this._presenter]

  this.init(function() {
    that.observe(function() {
      next(that.stack, true);
    });
    next(that.stack);
  });
};

Reaction.prototype.end = function() {};

Reaction.prototype.afterAll = function(next) {
  this.afterDOMConstruction(next);
};

Reaction.startParse = function(el, state) {
  this._previousPaths = state.pathStack.slice(0);
  return this.parse(el, state);
};

Reaction.endParse = function(el, state) {
  state.pathStack = this._previousPaths;
  this.afterParse(el, state);
};

Reaction.prototype.init = function(next) {
  next();
};

Reaction.prototype.get = function(key) {
  return get(this._presenter, key);
};

Reaction.prototype.set = function(key, value) {
  return this._presenter.set(key, value);
};

Reaction.prototype.clearUiEvent = function(events) {
  var namespace = ".endDash" + this.cid + " ";
  events = events.replace(/($| )/g, namespace).slice(0, -1);
  this.el.off(events);
};

Reaction.prototype.uiEvent = function(events, callback, context) {
  var namespace = ".endDash" + this.cid + " ";
  events = events.replace(/($| )/g, namespace).slice(0, -1);
  this.el.on(events, function() {
    callback.apply(context, arguments);
  });
};

Reaction.prototype.change = function(property, callback, context) {
  if(typeof property === "string") {
    if(this._presenter.on) {
      var events = property.replace(/(^| )/g, " change:").slice(1);
      this.listenTo(this._presenter, events, callback, context);
    }
  } else {
    callback = property;
    if(this._presenter.on) {
      this.listenTo(this._presenter, "change", callback, context);
    }
  }
};

Reaction.prototype.stopObserving = function() {
  this.el.off(".endDash" + this.cid);
  this.stopListening(this._presenter);
};

Reaction.prototype.off = function() {
  this.stopListening(this._presenter);
  _(this.relevantModels).each(function(relevantModel){
    relevantModel.off(null, null, this)
  })
}

Reaction.parse = function() {};
Reaction.afterParse = function() {};

Reaction.setGetPresenter = function(getPresenterFn) {
  getPresenter = getPresenterFn;
};

Reaction.prototype.setupScope = function() {};
Reaction.prototype.observe = function() {};

_.extend(Reaction.prototype, Backbone.Events);
Reaction.extend = extend;

module.exports = Reaction;

