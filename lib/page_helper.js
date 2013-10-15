
var _ = require('underscore')
  , templateStore = require('./template_store')

// Only load HTML do not parse until template is requested
// If this is changed be aware, order matters. If templates with
// partials are parsed before their partials raw HTML are parser.js will error
module.exports.lazyLoadFromPage = function (){
  var that = this
  _(getTemplatesOnPage()).each(function(template){
    templateStore.load(template.getAttribute('name'), normalizeTemplate(template))
  })
}

//Trims leading and ending whitespace, necessary for JQuery creation of DOM elements
var normalizeTemplate = function(template) {
  return template.textContent.replace(/^\s*/, "").replace(/\s*$/, "")
}

var getTemplatesOnPage = function() {
  var scriptTags = window.document.getElementsByTagName("SCRIPT")
  return _.filter(scriptTags, function(scriptElem) {
    return scriptElem.type == "EndDash"
  })
}
