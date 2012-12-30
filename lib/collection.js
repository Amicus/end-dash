var _ = require("underscore")
  , inflection = require("./inflection")
  , util       = require("./util")
  , findDescendantsAndSelf = util.findDescendantsAndSelf
  , jqts = util.jqts


var viewRegistry
CollectionFactory.setViewRegistry = function(conf) {
  viewRegistry = conf
}

function CollectionFactory(name, selector, polymorphicKey) {
  this.name = name
  this.selector = selector
  this.polymorphicKey = polymorphicKey
  this.templateFactories = {}
}


CollectionFactory.prototype.setTemplateFactory = function(polymorphicValue, templateFactory) {
  this.templateFactories[polymorphicValue] = templateFactory
  return templateFactory
}

CollectionFactory.prototype.mapView = function(key) {
  this.viewClassName = key
}

CollectionFactory.prototype.generate = function(container) {
  var that = this

  function Collection(models, opts) {
    opts = opts || {}
    this.polymorphicKey = that.polymorphicKey
    this.length = 0
    this.name = that.name
    this.Templates = _.reduce(that.templateFactories, function(memo, templateFactory, key) {
      memo[key] = templateFactory.generate()
      return memo
    }, {}, this)

    this.templates = []
    this.container = container

    if(that.viewClassName) {
      this.View = viewRegistry[inflection.capitalize(that.viewClassName)]
      if(!this.View) {
        throw new Error("Could not find view class " + inflection.capitalize(that.viewClassName))
      }
    }

    if(models) {
      this.bind(models)
    }
  }

  Collection.prototype.bind = function(collection) {
    if(this.View && !this.view) {
      //TODO we could probably move this out into the end-dash bind method
      opts = { el: this.container, template: this, collection: collection }
      this.view = new this.View(opts)
      this.container.data("view", this.view)
    }
    if(_.isArray(collection)) {
      this.remove(this.templates)
      this.push(collection)
    } else {
      if(this.collectionModel) {
        this.collectionModel.off(null, null, this)
      }
      this.collectionModel = collection
      this.remove(this.templates)
      this.add(collection.models)

      collection.on("reset", function(collection, opts) {
        this.remove(this.templates)
        this.add(collection.models)
      }, this)

      collection.on("add", function(model, collection) {
        var index = collection.indexOf(model)
        this.add(model, { at: index })
      }, this)

      collection.on("remove", function(model, collection, opts) {
        var index = opts.index
        this.remove(this.at(index))
      }, this)
    }
  }

  Collection.prototype.remove = function(template) {
    if(_.isArray(template)) {
      //iterate backwards, otherwise only half get removed
      //due to index shifting
      return _(template.slice(0).reverse()).each(this.remove, this)
    }
    var index = _(this.templates).indexOf(template)
    if(index < 0) {
      throw new Error("Cannot remove a template that's not in collection")
    }
    this.templates.splice(index, 1)
    this.container.children().eq(index).remove()

    this.length = this.templates.length
  }

  Collection.prototype.at = function(index) {
    return this.templates[index]
  }

  Collection.prototype.add = function(models, opts) {
    opts = opts || {}
    if(typeof opts.at === "undefined") {
      opts.at = this.templates.length
    }
    if(!_.isArray(models)) {
      models = [models]
    }
    var templates = _.map(models, function(model) {
      var polymorphicValue = (this.polymorphicKey) ? getValue(this.polymorphicKey, model) : "default"
      if(!this.Templates[polymorphicValue]) {
        throw new Error("No template for when " + this.polymorphicKey + " is " + polymorphicValue)
      }
      var template = new this.Templates[polymorphicValue](model)
      template.template.data("model", model)

      if(typeof model.on === "function" && this.polymorphicKey) {
        model.on("change:" + this.polymorphicKey, function() {
          this.polymorphicValueChange(template, model)
        }, this)
      }

      return template
    }, this)

    ;[].splice.apply(this.templates, [opts.at, 0].concat(templates))

    var doms = _.map(templates, function(template) {
      return template.template[0]
    }, this)
    
    var children = this.container.children()
    if(opts.at === 0) {
      this.container.prepend($(doms))
    } else {
      if(!children[opts.at - 1]) {
        throw new Error("Unable to insert element at index: " + opts.at)
      }
      $(doms).insertAfter(children[opts.at - 1])
    }

    this.length = templates.length
  }

  function getValue(key, object) {
    if(typeof object.get === "function") {
      return object.get(key)
    } else {
      return object[key]
    }
  }

  Collection.prototype.polymorphicValueChange = function(template, data) {
    var index = _(this.templates).indexOf(template)
     , template = new this.Templates[getValue(this.polymorphicKey, data)](data)

    this.container.children().eq(index).replaceWith(template.template)
    this.templates.splice(index, 1, template)
  }
   
  Collection.prototype.push = function(data) {
    return this.add(data)
  }
   
  return Collection
}

module.exports = CollectionFactory
