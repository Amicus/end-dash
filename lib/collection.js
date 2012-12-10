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
  var that

  function Collection() {
    this.Template = that.TemplateFactory.generate()
    this.templates = []
    this.container = parent.find(that.selector)
  }
   
  Collection.prototype.push = function(data) {
    if(_.isArray(data)) {
      return _(data).each(this.push, this)
    }
    var template = new this.Template(this.el)

    this.templates.push(template)
    this.container.append(template.template)
    template.set(data)
  }
   
  return Collection
}

module.exports = CollectionFactory
