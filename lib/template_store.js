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

TemplateStore.loadFromPage = function (){
  var that = this
  _(this.EndDashTemplatesOnPage()).each(function(template){
    that.loadAndParse(template.getAttribute('name'), that.normalizeTemplate(template))
  })
}

TemplateStore.getTemplatesOnPage = function() {
  var _document = window.document
  var scriptTags = _document.getElementsByTagName("SCRIPT")
  return _.filter(scriptTags, function(scriptElem) {
    return scriptElem.type == "EndDash"
  })
}

TemplateStore.clear = function() {
    TemplateStore = {}
    RAW_TEMPLATES = {}
    TEMPLATES = {}
}

//Trims leading and ending whitespace, necessary for JQuery create
TemplateStore.normalizeTemplate = function(template) {
  return template.textContent.replace(/^\s*/, "").replace(/\s*$/, "")
}

_.bindAll(TemplateStore, 'isLoaded',
                         'isParsed',
                         'load',
                         'loadAndParse',
                         'getTemplate');

module.exports = TemplateStore;
