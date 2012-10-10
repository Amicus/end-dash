var _ = require("underscore")

function Collection(el, name) {
  this.container = el
  this.template = $("<div></div>").append(el.children("." + name + "-")[0]).html()
  this.container.html("")
  this.templates = []
}

Collection.prototype.push = function(data) {
  if(_.isArray(data)) {
    return _(data).each(this.push, this)
  }
  var Template = require("./end-dash")

  var template = new Template(this.template)
  this.templates.push(template)
  this.container.append(template.template)
  template.set(data)
}

module.exports = Collection
