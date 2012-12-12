var _ = require("underscore")

function CollectionFactory(name, selector) {
  this.name = name
  this.selector = selector
}


CollectionFactory.prototype.setTemplateFactory = function(TemplateFactory) {
  this.TemplateFactory = TemplateFactory
  return TemplateFactory
}

CollectionFactory.prototype.generate = function(parent) {
  var that = this

  function Collection(models) {
    this.length = 0
    this.Template = that.TemplateFactory.generate()
    this.templates = []
    this.container = parent.contents().andSelf().filter(that.selector)
    if(models) {
      this.bind(models)
    }
  }

  Collection.prototype.bind = function(collection) {
    if(_.isArray(collection)) {
      this.push(collection)
    } else {
      this.push(collection.models)
      collection.on("add", function(model, collection, opts) {
        this.insert(model, index)
      }, this)
    }
  }

  Collection.prototype.add = function(models, opts) {
    opts = opts || {}
    opts.at = opts.at || this.length
    if(!_.isArray(models)) {
      models = [models]
    }
    var templates = _.map(models, function(model) {
       return new this.Template(model)
    })

    var template = new this.Template()
    ;[].splice.apply(this.templates, [opts.at, 0].concat(templates))

    var doms = _.each(templates, function(template) {
       return template.template[0]
    })
    var children = this.container.children()
    if(children.length)
      this.container.insertAfter(children.index(opts.at - 1), $(doms))
    else
      this.container.append($(doms))

    this.length += models.length
  }
   
  Collection.prototype.push = function(data) {
    if(_.isArray(data)) {
      return _(data).each(this.push, this)
    }
    var template = new this.Template(data)

    this.templates.push(template)
    this.container.append(template.template)
    this.length += 1
  }
   
  return Collection
}

module.exports = CollectionFactory
