var Parser = require("../parser")
  , Reaction = require("../reaction")
  , inflection = require("inflection")
  , _ = require("underscore")
  , get = require("../util").get
  , rules = require("../rules")

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

    if(typeof index === "undefined") {
      this.templates.push(template)
      return this.el.append(template.template)
    } else if(index === 0) {
      this.templates.unshift(template)
      this.el.prepend(template.template)
    } else {
      this.templates.splice(index, 0, template)
      children = this.el.children() 
      template.template.insertAfter(children[index - 1])
    }
  },

  remove: function(index) {
    this.el.children().eq(index).remove()
    this.templates.splice(index, 1)
  },
  
  init: function(next) {
    this.collection = get(this.presenter, this.collectionName) || []

    this.stack.push(this.collection) 

    this.templates = []
    this.el.html("")
    this.el.data("collection", this.collection)
    this.addAll(this.collection)
    next()
  },

  observe: function(next) {
    if(typeof this.presenter.on === "function") {
      this.presenter.on("change:" + this.collectionName, function() {
        this.init(next, true)
      }, this)
    }

    if(this.polymorphicKey) {
      this.collection.on("change:" + this.polymorphicKey, function(model) {
        var index = this.collection.indexOf(model)
        this.remove(index)
        this.add(model, index)
      }, this)
    }
    if(typeof this.collection.on === "function") {
      this.collection.on("sort reset", function(collection) {
        this.el.html("")
        this.addAll(collection)
      }, this)

      this.collection.on("add", function(model, collection) {
        this.add(model, collection.indexOf(model))
      }, this)

      this.collection.on("remove", function(model, collection, opts) {
        this.remove(opts.index)
      }, this) 
    }
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
