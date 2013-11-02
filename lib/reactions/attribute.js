var Reaction = require("../reaction"),
    util = require("../util"),
    rules = require("../rules"),
    _ = require("underscore"),
    get = util.get,
    trim = util.trim,
    interpolatorRegex = /#\{([a-zA-Z0-9_\- ]+)(?:\?([a-zA-Z0-9_\- ]+))?(?:\:([a-zA-Z0-9_\- ]*))?}/g;

var AttributeReaction = Reaction.extend({

  init: function(next) {
    this.updateAttributes(this.attributes);
    next();
  },

  updateAttributes: function(attributes) {
    var that = this;

    _(attributes).each(function(value, key) {
      var newValue = util.interpolate(value, that._presenter)
      this.el.attr(key, newValue)
    })
  },
  /**
   * TODO, ensure we never set blank src attributes
   **/
  observe: function() {
    this.change(function() {
      this.updateAttributes(this.attributes);
    }, this);
  }

}, {
  selector: "*",

  reactIf: function(el) {
    return _(el[0].attributes || []).any(function(attribute) {
      return util.hasInterpolations(attribute.value)
    }, this);
  },

  parse: function(el) {
    var attributes = {};

    _(el[0].attributes || []).each(function(attribute) {
      if(attribute.value.match(/#\{/)) {
        attributes[attribute.name] = attribute.value;
      }
    }, this);
    attributes.src = el.attr("data-src") || attributes.src;

    if(!attributes.src) {
      delete attributes.src;
    }
    return { attributes: attributes };
  }
});

module.exports = AttributeReaction;

