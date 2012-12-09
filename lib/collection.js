var _ = require("underscore")

function Collection(name, el) {
  this.container = el
  this.container.html("")
  this.templates = []
}

Collection.prototype.template = function(Template) {
  this.Template = Template
}

Collection.prototype.push = function(data) {
  if(_.isArray(data)) {
    return _(data).each(this.push, this)
  }
  var template = new this.Template

  this.templates.push(template)
  this.container.append(template.template)
  template.set(data)
}

module.exports = Collection
