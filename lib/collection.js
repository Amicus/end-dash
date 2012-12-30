var _ = require("underscore")
  , inflection = require("./inflection")
  , util       = require("./util")
  , findDescendantsAndSelf = util.findDescendantsAndSelf


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

CollectionFactory.prototype.generate = function(container, parentView) {
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
      this.bind(models, opts.parentView)
    }
  }

  Collection.prototype.bind = function(collection, parentView) {
    if(this.View && !this.view) {
      opts = { parent: parentView, el: this.container, template: this, collection: collection }
      this.view = new this.View(opts)
    }
    if(_.isArray(collection)) {
      this.push(collection)
    } else {
      this.push(collection.models)
      collection.off(null, null, this)

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
      return _(template).each(this.remove, this)
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
    opts.at = opts.at || this.templates.length
    if(!_.isArray(models)) {
      models = [models]
    }
    var templates = _.map(models, function(model) {
      var polymorphicValue = (this.polymorphicKey) ? getValue(this.polymorphicKey, model) : "default"
      if(!this.Templates[polymorphicValue]) {
        throw new Error("No template for when " + this.polymorphicKey + " is " + polymorphicValue)
      }
      var template = new this.Templates[polymorphicValue](model, { parentView: this.view })

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
    if(children.length) {
      $(doms).insertAfter(children[opts.at - 1])
    } else {
      this.container.append($(doms))
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
     , template = new this.Templates[getValue(this.polymorphicKey, data)](data, { parentView: this.view })

    this.container.children().eq(index).replaceWith(template.template)
    this.templates.splice(index, 1, template)
  }
   
  Collection.prototype.push = function(data) {
    return this.add(data)
  }
   
  return Collection
}

module.exports = CollectionFactory
