var _ = require("underscore")
  , inflection = require("./inflection")

var config = {}
CollectionFactory.configure = function(conf) {
  config = conf
}

function CollectionFactory(name, selector, polymorphicKey) {
  this.name = name
  this.selector = selector
  this.polymorphicKey = polymorphicKey
  this.TemplateFactories = {}
}


CollectionFactory.prototype.setTemplateFactory = function(polymorphicValue, TemplateFactory) {
  this.TemplateFactories[polymorphicValue] = TemplateFactory
  return TemplateFactory
}

CollectionFactory.prototype.mapView = function(key) {
  this.viewClassName = key
}

CollectionFactory.prototype.generate = function(parent, parentView) {
  var that = this

  function Collection(models, opts) {
    opts = opts || {}
    this.polymorphicKey = that.polymorphicKey
    this.length = 0
    this.Templates = _.reduce(that.TemplateFactories, function(memo, TemplateFactory, key) {
      memo[key] = TemplateFactory.generate()
      return memo
    }, {})
    this.templates = []
    this.container = parent.contents().andSelf().filter(that.selector)

    if(that.viewClassName) {
      this.View = require(config.viewDirectory + "/" + inflection.underscore(that.viewClassName))
    }

    if(models) {
      this.bind(models, opts.parentView)
    }
  }

  Collection.prototype.bind = function(collection, parentView) {
    if(this.View) {
      opts = { parent: parentView, el: this.container, template: this, collection: collection }
      this.view = new this.View(opts)
    }
    if(_.isArray(collection)) {
      this.push(collection)
    } else {
      this.push(collection.models)

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
      polymorphicValue = (this.polymorphicKey) ? getValue(this.polymorphicKey, data) : "default"
      return new this.Templates[polymorphicValue](model, { parentView: this.view })
    }, this)

    ;[].splice.apply(this.templates, [opts.at, 0].concat(templates))

    var doms = _.map(templates, function(template) {
       return template.template[0]
    })
    var children = this.container.children()
    if(children.length)
      $(doms).insertAfter(children[opts.at - 1])
    else
      this.container.append($(doms))

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
    if(_.isArray(data)) {
      return _(data).each(this.push, this)
    }
    var polymorphicValue = (this.polymorphicKey) ? getValue(this.polymorphicKey, data) : "default"
    var template = new this.Templates[polymorphicValue](data, { parentView: this.view })
    if(typeof data.on === "function" && this.polymorphicKey) {
      data.on("change:" + this.polymorphicKey, function() {
        this.polymorphicValueChange(template, data)
      }, this)
    }

    this.templates.push(template)
    this.container.append(template.template)
    this.length = this.templates.length
  }
   
  return Collection
}

module.exports = CollectionFactory
