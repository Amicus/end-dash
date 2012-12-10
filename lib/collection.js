var _ = require("underscore")

function Collection(name, el) {
  this.container = el
}

Collection.prototype.template = function(Template, el) {
  this.Template = Template
  this.el = el
  return Template
}

Collection.prototype.initialize = function() {
  this.templates = []
  this.container.html("")
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

module.exports = Collection
