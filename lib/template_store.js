// This class is responsible for storing raw HTML templates when they're loaded
// and then returning template objects (lazily).
var _ = require('underscore'),
    path = require('path'),
    Parser = require('./parser'),
    TemplateStore = {},
    RAW_TEMPLATES = {},
    TEMPLATES = {};

var pathToName = function(templatePath) {
  return path.normalize(templatePath);
};

var _parseTemplate = function(templatePath) {
  var name = pathToName(templatePath);

  if (!TemplateStore.isLoaded(name)) {
    throw new Error('Could not find template: '+name);
  }

  var markup = RAW_TEMPLATES[name];

  return (new Parser(markup, {
    templateName: name,
    templates: RAW_TEMPLATES
  })).generate();
};

var getTemplatesOnPage = function() {
  var _document = window.document
  var scriptTags = _document.getElementsByTagName("SCRIPT")
  return _.filter(scriptTags, function(scriptElem) {
    return scriptElem.type == "EndDash"
  })
}

//Trims leading and ending whitespace, necessary for JQuery create
var normalizeTemplate = function(template) {
  return template.textContent.replace(/^\s*/, "").replace(/\s*$/, "")
}

TemplateStore.isLoaded = function(templatePath) {
  return !!RAW_TEMPLATES[templatePath];
};

TemplateStore.isParsed = function(templatePath) {
  return !!TEMPLATES[templatePath];
};

TemplateStore.load = function(templatePath, markup) {
  var name = pathToName(templatePath);

  RAW_TEMPLATES[name] = markup;

  if (this.isParsed(name)) {
    delete TEMPLATES[name];
  }
};

TemplateStore.loadAndParse = function(templatePath, markup) {
  this.load(templatePath, markup);
  return this.getTemplate(templatePath);
};

TemplateStore.getTemplate = function(templatePath) {
  var name = pathToName(templatePath);

  if (!this.isParsed(name)) {
    TEMPLATES[name] = _parseTemplate(name);
  }
  return TEMPLATES[name];
};

TemplateStore.lazyLoadFromPage = function (){
  var that = this
  _(getTemplatesOnPage()).each(function(template){
    that.load(template.getAttribute('name'), normalizeTemplate(template))
  })
}

// Lazily load for now, if we change this need to be careful of order
// That is, first we need to load raw HTML and then parse otherwise it will
// Error in the parser

TemplateStore.clear = function() {
    RAW_TEMPLATES = {}
    TEMPLATES = {}
}

_.bindAll(TemplateStore, 'isLoaded',
                         'isParsed',
                         'load',
                         'loadAndParse',
                         'getTemplate',
                         'lazyLoadFromPage',
                         'clear');

module.exports = TemplateStore;
