var EndDash = require('../end-dash'),
    Reaction = require("../reaction"),
    inflection = require("inflection"),
    _ = require("underscore"),
    get = require("../util").get,
    rules = require("../rules");

var DeprecatedLoopingReaction = Reaction.extend({
  addAll: function(models, index) {
    index = (index || 0);
    if(_.isArray(models)) {
      models = _(models);
    }
    models.each(this.add, this);
  },

  getTemplateClass: function(model) {
    if (this.polymorphicKey) {
      var value = get(model, this.polymorphicKey);
      return this.itemTemplates[value];
    } else {
      return this.itemTemplates["default"];
    }
  },

  add: function(model, index) {
    var Template = this.getTemplateClass(model),
        template = new Template(model, { stack: this.stack.slice(0) }),
        children;

    template.el.data("model", model);

    if(typeof index === "undefined") {
      this.templates.push(template);
      return this.el.append(template.el);
    } else if(index === 0) {
      this.templates.unshift(template);
      this.el.prepend(template.el);
    } else {
      this.templates.splice(index, 0, template);
      children = this.el.children();
      template.el.insertAfter(children[index - 1]);
    }
  },

  remove: function(model, index) {
    var indexToRemove,
        templateToRemove = _(this.templates).find(function(template, index) {
          indexToRemove = index;
          return template.el.data('model') === model;
      });
      templateToRemove.el.remove();
      this.templates.splice(indexToRemove, 1);
  },

  stopObserving: function() {
    this.el.off(".endDash" + this.cid);
    this.stopListening();
    _(this.templates).each(function(template){
      template.cleanup();
    });
  },

  init: function(next) {
    this.collection = (this.get(this.collectionName) || []);
    this._presenter = this.collectionPresenter = this.getPresenter(this.collection);

    this.stack.push(this.collection);

    this.templates = [];
    this.el.empty();
    this.el.data("collection", this.collection);
    this.addAll(this.collection);
    next();
  },

  observe: function(next) {
    this.change(this.collectionName, function(model, newCollection) {
      if(this.collection != newCollection) {
        this.init(next, true);
      }
    }, this);

    if(typeof this.collectionPresenter.on === "function") {

      if(this.polymorphicKey) {
        this.listenTo(this.collectionPresenter, "change:" + this.polymorphicKey, function(model) {
          var index = this.collectionPresenter.indexOf(model);
          this.remove(model, index);
          this.add(model, index);
        }, this);
      }

      this.listenTo(this.collectionPresenter, "sort reset", function() {
        this.el.empty();
        this.addAll(this.collectionPresenter);
      }, this);

      this.listenTo(this.collectionPresenter, "add", function(model) {
        this.add(model, this.collectionPresenter.indexOf(model));
      }, this);

      this.listenTo(this.collectionPresenter, "remove", function(model, collection, opts) {
        this.remove(model, opts.index);
      }, this);
    }
  }
}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.deprecatedLooping(el);
  },

  parse: function(el, state) {
    var collectionName = rules.deprecatedLooping(el),
        polymorphicKey = rules.polymorphicKeyClass(el),
        templates = {},
        children = el.children();

    children.each(function(i, element) {
      var child = $(element),
          whenValue = rules.polymorphicValueClass(child) || 'default',
          templateName = _.last(state.pathStack) + whenValue;

      EndDash.registerTemplate(templateName, child);
      templates[whenValue] = EndDash.getTemplateClass(templateName);
      child.remove();
    });

    el.append($("<div><div></div></div>").attr("class", inflection.singularize(collectionName) + "-"));

    return {
      collectionName: collectionName,
      itemTemplates: templates,
      polymorphicKey: polymorphicKey
    };
  }
});

module.exports = DeprecatedLoopingReaction;
