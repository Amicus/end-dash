var Backbone               = require('./backbone'),
    util                   = require("./util"),
    _                      = require("underscore")

function Template(model, opts) {
  var stack;

  opts = opts || {};
  model = model || {};

  this.bound = false;
  this.stack = opts.stack || [];

  this.reactions = {};

  if (!this.markup) {
    throw new Error("Created template without markup");
  }

  this.el = this.template = this.markup.clone(); // template is deprecated but used in some outside systems

  this.unserializedElements = {}
  if (model) {
    this.bind(model);
  }
}

Template.prototype.cleanup = function() {
  this.traverse(this.structure, this.stack, function(el, reaction, stack, next) {
    reaction.stopObserving();
    next(stack);
  });
};
 
Template.prototype.getElement = function(serialized) {
  if(!serialized) return this.el

  var unserialized = this.unserializedElements[serialized.id];
  if(unserialized) return unserialized;

  if(this.el.is('#' + serialized.id))
    unserialized = this.el;
  else 
    unserialized = this.el.find('#' + serialized.id);

  unserialized.attr('id', serialized.oldId)
  return this.unserializedElements[serialized.id] = unserialized;
};

Template.prototype.bind = function(model) {
  if (this.bound) {
    throw new Error('Template already bound to a model.');
  }

  this.stack.push(util.toBackboneModel(model));
  this.traverse(this.structure, this.stack, function(el, reaction, stack, next) {
    reaction.start(el, stack, next);
  });

  this.bound = true;
};

Template.prototype.traverse = function(structure, stack, callback, reload) {
  var el = this.getElement(structure.selector),
      that = this,
      reaction;

  function next(stack, doReload) {
    _(structure.children).each(function(child) {
      that.traverse(child, stack, callback, reload || doReload);
    });
  }

  if(!structure.Reaction) {
    return next(stack, reload);
  }

  if(reload) {
    delete this.reactions[structure.id];
  }

  reaction = (this.reactions[structure.id]) ? this.reactions[structure.id] : new structure.Reaction(structure.properties);
  this.reactions[structure.id] = reaction;

  callback.call(this, el, reaction, stack, next);
};

Template.extend = Backbone.Model.extend;

module.exports = Template;
