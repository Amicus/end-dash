// This class is responsible for storing raw HTML templates when they're loaded
// and then returning template objects (lazily).
var _ = require('underscore'),
    path = require('path'),
    Parser = require('./parser'),
    TemplateStore = {};

var pathToName = function(templatePath) {
  return path.normalize(templatePath);
};

var _parseTemplate = function(templateStore, templatePath) {
  var name = pathToName(templatePath);

  if (!templateStore.isLoaded(name)) {
    throw new Error('Could not find template: '+name);
  }

  var markup = templateStore._RAW_TEMPLATES[name];

  return (new Parser(markup, {
    templateName: name,
    templates: templateStore._RAW_TEMPLATES
  })).generate();
};

TemplateStore.isLoaded = function(templatePath) {
  return !!this._RAW_TEMPLATES[templatePath];
};

TemplateStore.isParsed = function(templatePath) {
  return !!this._TEMPLATES[templatePath];
};

TemplateStore.load = function(templatePath, markup) {
  var name = pathToName(templatePath);

  this._RAW_TEMPLATES[name] = markup;

  if (this.isParsed(name)) {
    delete this._TEMPLATES[name];
  }
};

TemplateStore.loadAndParse = function(templatePath, markup) {
  this.load(templatePath, markup);
  return this.getTemplate(templatePath);
};

TemplateStore.getTemplate = function(templatePath) {
  var name = pathToName(templatePath);

  if (!this.isParsed(name)) {
    this._TEMPLATES[name] = _parseTemplate(this, name);
  }

  return this._TEMPLATES[name];
};

exports.create = function() {
  return {
    _RAW_TEMPLATES: {},
    _TEMPLATES: {},
    isLoaded: TemplateStore.isLoaded,
    isParsed: TemplateStore.isParsed,
    load: TemplateStore.load,
    loadAndParse: TemplateStore.loadAndParse,
    getTemplate: TemplateStore.getTemplate
  };
};
