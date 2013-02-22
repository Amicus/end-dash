var Parser = require("../parser")
  , Reaction = require("../reaction")
  , inflection = require("inflection")
  , _ = require("underscore")
  , get = require("../util").get
  , rules = require("../rules")
  , ModelReaction = require("../reactions/model")

var CollectionReaction = Reaction.extend({

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

  //Weird condition where you can't get the polymorphic template until
  //you get the presenter and you can't get the presenter until you know
  //which polymorphic template to use.
  add: function(model, index) {
    var Template = this.getTemplate(model)
      , template = new Template(model, { stack: this.stack.slice(0) })
      , children

    template.template.data("presenter", model)
    template.template.data("model", model.model)

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
  
  init: function(container, model, stack, next) {
    var collection = get(model, this.collectionName) || []

    stack.push(collection) 

    this.templates = []
    this.container = container.html("")
    this.stack = stack
    this.container.data("collection", collection).html("")
    this.addAll(collection)
    next(stack)
  },

  observe: function(container, collection, stack, next) {
    var parentStack = stack.slice(0, -1)
      , parentModel = _.last(parentStack)

    if(typeof parentModel.on === "function") {
      parentModel.on("change:" + this.collectionName, function(model) {
        this.init(container, model, parentStack, next, true)
      }, this)
    }

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
      this.container = container
      this.remove(opts.index)
    }, this) 
  }
}, {
  selector: "[class]",

  reactIf: function(el) {
    return rules.collection(el)
  },
 
  parse: function(el, state) {
    var collectionName = rules.collection(el)
      , polymorphicKey = rules.polymorphicKey(el)
      , templates = {}
      , children = el.children()

    children.each(function(i, element) {
      var child = $(element)
        , whenValue = rules.polymorphicValue(child)
        , template = (new Parser(child, { templateName: _.last(state.pathStack) }))
      templates[whenValue] = template.generate()
      child.remove()
    })

    el.append($("<div><div></div></div>").attr("class", inflection.singularize(collectionName) + "-"))

    return {
      collectionName: collectionName,
      itemTemplates: templates,
      polymorphicKey: polymorphicKey
    }
  }
  
})
module.exports = CollectionReaction
