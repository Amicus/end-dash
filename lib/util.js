var _ = require("underscore"),
    Backbone = require('./backbone');

exports.serializeElement = function(el) {
  var oldId = el.attr("id")
    , id = oldId

  if(oldId && oldId.match(/#{/))
    id = ''

  if(!id) {
    id = _.uniqueId("end-dash-id-") 
    el.attr('id', id)
  }
  return {
    id: id,
    oldId: oldId || null //null so that when we set it, it removes the attribute
  }
};

exports.trim = function(str) {
  return (str || "").replace(/^\s+|\s+$/g, "");
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
