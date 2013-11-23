var _ = require("underscore"),
    Backbone = require('./end-dash').Backbone;

/**
 * Function: GetSelector
 * Returns a unique selector from the root
 * to el (No memoizing selectors since no performance gain)
 **/
exports.getSelector = function(el, root) {
  var id = el.attr("id"),
      classNames = (el.attr("class") || "")
        .replace(/(^\s+|\s+$)/g, "")
        .replace(/#{.*?}/g, "").split(" "),
      name;

  if(el.is(root))
    return "";

  if(id && !id.match(/#{/g)) {
    return "#" + id;
  } else {
    classNames = _(classNames).reject(function(className) {
      return !className || className.match(/#{/g);
    });
    if(classNames.length) {
      name = "." + classNames.join(".");


      if($(el).parent().children(name).length !== 1) {
        name = el[0].tagName.toLowerCase();
      }
    } else {
      name = el[0].tagName.toLowerCase();
    }
  }

  var siblingsAndSelf = el.parent().children(name),
      baseOneIndex = (el.parent().children().index(el) + 1),
      selector = name;

  if(siblingsAndSelf.length > 1)
    selector += ":nth-child(" + baseOneIndex + ")";

  var recur = this.getSelector(el.parent(), root);

  if(recur)
    selector = recur + " > " + selector;

  return selector;
};

exports.trim = function(str) {
  return (str || "").replace(/^\s+|\s+$/g, "");
};

exports.findDescendantsAndSelf = function(element, selector) {
  if(!selector)
    return element;

  var matches = element.find(selector);
  if(!matches.length) {
    matches = matches.filter(selector);
  }
  return matches;
};

exports.get = function(obj, key) {
  var val;
  if(!obj) return;
  if(typeof obj.get === "function") {
    return obj.get(key);
  } else {
    return obj[key];
  }
};

var interpolatorRegex = /#\{([a-zA-Z0-9_\- ]+)(?:\?([a-zA-Z0-9_\- ]+))?(?:\:([a-zA-Z0-9_\- ]*))?}/g;

exports.hasInterpolations = function(str) {
  return !!str.match(interpolatorRegex)
}

exports.interpolate = function(str, data) {
  return str.replace(interpolatorRegex, function(match, key, valueIfTrue, valueIfFalse) {
    key = trim(key);
    var value = get(data, key);

    valueIfTrue = trim(valueIfTrue) || value;
    valueIfFalse = (typeof valueIfFalse == "undefined") ? "": trim(valueIfFalse);

    if(valueIfTrue === true) {
      valueIfTrue = key;
    }

    return value ? valueIfTrue : valueIfFalse;
  })
}

exports.toBackboneModel = function(model) {
  if (model instanceof Backbone.Model ||
    model instanceof Backbone.Collection) {
    return model;
  }

  if (typeof model !== 'object') {
    throw new Error('Tried to bind template to a '+typeof model+', but '+
                    'templates can only be bound to objects.');
  }

  if (_.isArray(model)) {
    return new Backbone.Collection(model);
  } else {
    return new Backbone.Model(model);
  }
};
