var Template = require("./template"),
    path = require('path'),
    util = require("./util"),
    _ = require("./underscore"),
    reactions = [],
    reactionMap = {};

var Parser = module.exports = function(markup, opts) {
  opts = opts || {};

  this.markup = $(markup);

  if (this.markup.length !== 1) {
    throw new Error('Template '+opts.templateName+' invalid: a template must have exactly one root node.');
  }

  this.absolutePath = opts.templateName;
  this.reactions = reactions;
  this.structure = { children: [] };
  this.structureStack = [this.structure];

  this._state = {
    pathStack: [this.absolutePath],
    currentDir: function() {
      return path.dirname(_.last(this.pathStack));
    }
  };

  this.parse(this.markup);
};

Parser.registerReaction = function(reaction) {
  reactions.push(reaction);
  reactionMap[reaction.prototype.name] = reaction
};

Parser.prototype.traverse = function(el, callback) {
  var that = this;
  el.each(function(i, el) {
    callback.call(that, $(el), function() {
      that.traverse($(el).children(), callback);
    });
  });
};

Parser.prototype.parse = function(root) {
  this.traverse(root, function(el, next) {
    var toClose = this.startReactions(el);
    next();
    for(var i = 0 ; i < toClose ; i++) {
      this.closeNode();
    }
  });
};

Parser.prototype.export = function() {
  return {
    structure: this.structure,
    markup: this.markup
  }
}

Parser.prototype.serialize = function() {
  var out = this.export()
  var str = JSON.stringify(out, function(key, val) {
    if(key === 'markup') 
      return val[0].outerHTML;
    if(key === 'Reaction')
      return val.prototype.name;
    return val;
  });
  console.log(str.length, out.markup[0].outerHTML.length)
  return str
};

Parser.prototype.deserialize = function(str) {
  var obj = JSON.parse(str, function(key, val) {
    if(key === 'markup') 
      return $(val);
    if(key === 'Reaction')
      return reactionMap[val];
    return val;
  })
  obj.markup = $(obj.markup)
  return obj
};

Parser.prototype.generate = function() {
  var Generated = Template.extend(this.deserialize(this.serialize()));
  return Generated;
};

Parser.prototype.startReactions = function(el) {
  var toClose = 0,
      properties;

  _(this.reactions).each(function(Reaction) {
    if(el.is(Reaction.selector) && Reaction.reactIf(el)) {
      properties = Reaction.startParse(el, this._state);
      this.openNode(el, Reaction, properties);
      toClose++;
    }
  }, this);
  return toClose;
};

Parser.prototype.openNode = function(el, Reaction, properties) {
  var structure = _(this.structureStack).last();

  structure.children.push({
    id: _.uniqueId("struct"),
    selector: util.getSelector(el, this.markup),
    Reaction: Reaction,
    properties: properties,
    children: []
  });
  this.structureStack.push(_(structure.children).last());
};

Parser.prototype.closeNode = function() {
  this.structureStack.pop();
};
