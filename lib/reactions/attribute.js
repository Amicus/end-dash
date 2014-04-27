var Reaction = require("../reaction"),
    util = require("../util"),
    rules = require("../rules"),
    _ = require("underscore"),
    trim = util.trim,
    interpolatorRegex = /#\{([\w\- ]+)(?:\?([\w\- ]+))?(?:\:([\w\- ]*))?}/g;

var AttributeReaction = Reaction.extend({

  init: function(next) {
    this.updateAttributes(this.attributes);
    next();
  },

  updateAttributes: function(attributes) {
    var that = this;
    _(attributes).each(function(value, key) {
      that.el.attr(key, value.replace(interpolatorRegex, function(match, key, valueIfTrue, valueIfFalse) {
        var value = that.get(key = trim(key));

        valueIfTrue = trim(valueIfTrue) || value;
        valueIfFalse = (typeof valueIfFalse == "undefined") ? "": trim(valueIfFalse);

        if(valueIfTrue === true) {
          valueIfTrue = key;
        }

        return value ? valueIfTrue : valueIfFalse;
      }));
    });
  },
  /**
   * TODO, ensure we never set blank src attributes
   **/
  observe: function() {
    var modelPropertyNames = " ";
    _.values(this.attributes)
      .join(" ")
      .replace(/(?:#{)([^}?]*)/g, function(p1, match){ modelPropertyNames = modelPropertyNames + " " + match; return ""})
    this.change(modelPropertyNames, function() {
      this.updateAttributes(this.attributes);
    }, this);
    this.change(function() {
      this.updateAttributes(this.attributes);
    }, this);
  }
}, {
  selector: "*",

  reactIf: function(el) {
    return _(el[0].attributes || []).any(function(attribute) {
      return attribute.value.match(/#\{/);
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
