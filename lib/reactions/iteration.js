var EndDash = require('../end-dash'),
    Reaction = require("../reaction"),
    _ = require("underscore"),
    get = require("../util").get,
    rules = require("../rules");

var IterationReaction = Reaction.extend({

  addAll: function(models, index) {
    index = index || 0;
    if(_.isArray(models)) {
      models = _(models);
    };
    models.each(function(item, index) {
      this.add(item, index);
    }, this);
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

    template.template.data("model", model);

    if(typeof index === "undefined") {
      this.templates.push(template);
      this.el.append(template.template);
    } else if(index === 0) {
      this.templates.unshift(template);
      this.el.prepend(template.template);
    } else {
      this.templates.splice(index, 0, template);
      children = this.el.children();
      template.template.insertAfter(children[index - 1]);
    }
  },

  remove: function(model) {
    var templateToRemove = _(this.templates).find(function(template) {
      return template.template.data('model') === model;
    });
      templateToRemove.template.remove();
      this.templates.splice(_(this.templates).indexOf(templateToRemove), 1);
  },

  init: function(next) {
    this.collection = this.get(this.collectionName);
    this.collectionPresenter = this.getPresenter(this.collection);

    if(!this.collection)
      throw new Error("could not find collection " + this.collectionaName);

    this.stack.push(this.collection);

    this.templates = [];
    this.el.html("");
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
    var collectionName = rules.collection(el),
        polymorphicKey = rules.polymorphicKey(el),
        templates = {},
        children = el.children();

    children.each(function(i, element) {
      var child = $(element),
          whenValue = rules.polymorphicValue(child),
          templateName = _.last(state.pathStack) + whenValue;

      EndDash.registerTemplate(templateName, child);
      templates[whenValue] = EndDash.getTemplateClass(templateName);
      child.remove();
    })

    return {
      collectionName: collectionName,
      itemTemplates: templates,
      polymorphicKey: polymorphicKey
    };
  }
});
module.exports = IterationReaction;
