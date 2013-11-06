var EndDash = require('../end-dash'),
    Reaction = require("../reaction"),
    _ = require("underscore"),
    get = require("../util").get,
    rules = require("../rules");

var CollectionReaction = Reaction.extend({

  addAll: function(models, index) {
    index = index || 0;
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
      this.el.append(template.el);
    } else if(index === 0) {
      this.templates.unshift(template);
      this.el.prepend(template.el);
    } else {
      this.templates.splice(index, 0, template);
      children = this.el.children();
      template.el.insertAfter(children[index - 1]);
    };
  },

  remove: function(model) {
    var templateToRemove = _(this.templates).find(function(template) {
      return template.el.data('model') === model;
    });
      templateToRemove.template.remove();
      this.templates.splice(_(this.templates).indexOf(templateToRemove), 1);
  },

  init: function(next) {
    this.collection = this.model
    this.collectionPresenter = this._presenter

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
        this.collectionPresenter.on("change:" + this.polymorphicKey, function(model) {
          var index = this.collectionPresenter.indexOf(model);
          this.remove(model);
          this.add(model, index);
        }, this);
      }
      this.collectionPresenter.on("sort reset", function() {
        this.el.html("");
        this.addAll(this.collectionPresenter);
      }, this);

      this.collectionPresenter.on("add", function(model) {
        this.add(model, this.collectionPresenter.indexOf(model));
      }, this);

      this.collectionPresenter.on("remove", function(model, collection, opts) {
        this.remove(model);
      }, this);
    }
  }
}, {
  selector: "[data-each]",

  parse: function(el, state) {
    var key = rules.polymorphicKeyClass(el);
    this.templates = {};
    that = this;
    el.children().each(function(i, element) {
      var wrappedChild = $(element);
      if (key) {
        that.parsePolymorphic(wrappedChild, state, key);
      } else {
        that.parseDefault(wrappedChild, state);
      }
    })
    return {
      itemTemplates: this.templates,
      polymorphicKey: key
    };
  },

  parsePolymorphic: function(wrappedChild, state, key) {
    var condition = rules.polymorphicValueClass(wrappedChild) || 'default',
        name = _.last(state.pathStack) + condition;
    this.registerAndRemoveChild(name, wrappedChild, condition);
  },

  parseDefault: function(wrappedChild, state) {
    var condition = 'default',
        name = _.last(state.pathStack) + condition;
    this.registerAndRemoveChild(name, wrappedChild, condition);
  },

  registerAndRemoveChild: function(name, wrappedChild, condition) {
    EndDash.registerTemplate(name, wrappedChild);
    this.templates[condition] = EndDash.getTemplateClass(name);
    wrappedChild.remove();
  }
});

module.exports = CollectionReaction;
