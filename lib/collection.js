var _ = require("underscore")

function Collection(name) {
  this.container = el
  this.container.html("")
  this.templates = []
}

Collection.prototype.template = function(template) {
  this.template = template
}

Collection.prototype.push = function(data) {
  if(_.isArray(data)) {
    return _(data).each(this.push, this)
  }

  this.templates.push(template)
  this.container.append(template.template)
  template.set(data)
}

module.exports = Collection
