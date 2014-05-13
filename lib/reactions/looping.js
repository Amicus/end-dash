var EndDash = require('../end-dash'),
    Reaction = require("../reaction"),
    _ = require("underscore"),
    get = require("../util").get,
    rules = require("../rules");

var LoopingReaction = Reaction.extend({
  addAll: function(models, index) {
    index = index || 0;
    models.each(this.add, this);
  },

  getTemplateClass: function(model) {
    var template;
    if (this.polymorphicKey) {
      template = this.itemTemplates[get(model, this.polymorphicKey)];
    }
    if (!template) {
      template = this.itemTemplates["default"];
    }
    return template;
  },

  add: function(model, index) {
    var Template = this.getTemplateClass(model),
        template = new Template(model, { stack: this.stack.slice(0) }),
        children;

    template.el.data("model", model);

    if(typeof index === "undefined") {
      this.templates.push(template);
      this.el.append(template.el);
    } else if(index === 0) {
      this.templates.unshift(template);
      this.el.prepend(template.el);
    } else {
      this.templates.splice(index, 0, template);
      children = this.el.children();
      template.el.insertAfter(children[index - 1]);
    }
  },

  remove: function(model) {
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
    this.collection = this.model;
    this.collectionPresenter = this._presenter;

    if(!this.collection)
      throw new Error("could not find collection " + this.collectionaName);

    this.templates = [];
    this.el.html("");
    this.el.data("collection", this.collection);
    this.addAll(this.collection);
    next();
  },

  observe: function(next) {
    if(typeof this.collectionPresenter.on === "function") {

      if(this.polymorphicKey) {
        this.listenTo(this.collectionPresenter, "change:" + this.polymorphicKey, function(model) {
          var index = this.collectionPresenter.indexOf(model);
          this.remove(model);
          this.add(model, index);
        }, this);
      }

      this.listenTo(this.collectionPresenter, "sort reset", function() {
        this.el.html("");
        this.addAll(this.collectionPresenter);
      }, this);

      this.listenTo(this.collectionPresenter, "add", function(model) {
        this.add(model, this.collectionPresenter.indexOf(model));
      }, this);

      this.listenTo(this.collectionPresenter,"remove", function(model, collection, opts) {
        this.remove(model);
      }, this);
    }
  }
}, {
  selector: "[data-each]",
    parse: function(el, state) {
      var polymorphicKey = rules.polymorphicKeyClass(el),
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

    return {
      itemTemplates: templates,
      polymorphicKey: polymorphicKey
    };
  }
});

module.exports = LoopingReaction;
