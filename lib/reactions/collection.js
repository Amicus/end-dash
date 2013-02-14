var Parser = require("../parser")
  , Reaction = require("../reaction")
  , inflection = require("inflection")
  , _ = require("underscore")
  , get = require("../util").get
  , rules = require("../rules")
  , ModelReaction = require("../reactions/model")

var CollectionReaction = Reaction.extend({
  selector: "[class]",

  reactIf: function(el) {
    return rules.collection(el)
  },

  getPresenter: ModelReaction.prototype.getPresenter,

  parse: function(el, state) {
    this.collectionName = rules.collection(el)
    this.polymorphicKey = rules.polymorphicKey(el)

    var templates = this.itemTemplates = {}
    var children = el.children()
    children.each(function(i, element) {
      var child = $(element)
        , whenValue = rules.polymorphicValue(child)
        , template = (new Parser(child, { templateName: _.last(state.pathStack) }))
      child.remove()
      templates[whenValue] = template.generate()
    })

    el.append($("<div>").attr("class", inflection.singularize(this.collectionName) + "-"))
  },

  setupScope: function(el, model, state) {
    var collection = get(model, this.collectionName)
    state.modelStack.push(collection || [])
  },

  addAll: function(models, index) {
    index = index || 0
    if(_.isArray(models)) {
      models = _(models)
    }
    models.each(function(item, index) {
      this.add(item, index)
    }, this)
  },

  getTemplate: function(model) {
    if(this.polymorphicKey) {
      var value = get(model, this.polymorphicKey)
      return this.itemTemplates[value]
    } else {
      return this.itemTemplates["default"]
    }
  },

  add: function(model, index) {
    var Template = this.getTemplate(model)
      , template = new Template(model, { stack: this.stack })
      , children

    if(typeof index === "undefined") {
      this.templates.push(template)
      return this.container.append(template.template)
    } else if(index === 0) {
      this.templates.unshift(template)
      this.container.prepend(template.template)
    } else {
      this.templates.splice(index, 0, template)
      children = this.container.children() 
      template.template.insertAfter(children[index - 1])
    }
  },

  remove: function(index) {
    this.container.children().eq(index).remove()
    this.templates.splice(index, 1)
  },
  
  init: function(container, collection, state) {
    this.templates = []
    this.container = container
    this.stack = state.modelStack.slice(0)
    this.container.data("collection", collection).html("")
    this.addAll(collection)
  },

  observe: function(container, collection, state) {
    this.container = container

    if(this.polymorphicKey) {
      collection.on("change:" + this.polymorphicKey, function(model) {
        var index = collection.indexOf(model)
        this.remove(index)
        this.add(model, index)
      }, this)
    }
    collection.on("sort reset", function(collection) {
      this.container.html("")
      this.addAll(collection)
    }, this)

    collection.on("add", function(model, collection) {
      this.add(model, collection.indexOf(model))
    }, this)

    collection.on("remove", function(model, collection, opts) {
      this.remove(opts.index)
    }, this) 
  }
})
module.exports = CollectionReaction
