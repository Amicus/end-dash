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

  function Collection() {
    this.Template = that.TemplateFactory.generate()
    this.templates = []
    this.container = parent.find(that.selector)
    if(this.container.length == 0) {
      if(parent.is(that.selector)) {
        this.container = parent
      } else {
        throw new Error("collection element disappeared")
      }
    }
  }
   
  Collection.prototype.push = function(data) {
    if(_.isArray(data)) {
      return _(data).each(this.push, this)
    }
    var template = new this.Template()

    this.templates.push(template)
    this.container.append(template.template)
    template.set(data)
  }
   
  return Collection
}

module.exports = CollectionFactory
