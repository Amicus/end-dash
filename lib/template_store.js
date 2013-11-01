// This class is responsible for storing raw HTML templates when they're loaded
// and then returning template objects (lazily).
var _ = require('underscore'),
    path = require('path'),
    Parser = require('./parser');

var pathToName = function(templatePath) {
  return path.normalize(templatePath);
};

function TemplateStore() {
  this.RAW_TEMPLATES = {};
  this.TEMPLATES = {};
};

TemplateStore.prototype._parseTemplate = function(templatePath) {
  var name = pathToName(templatePath);

  if (!this.isLoaded(name)) {
    throw new Error('Could not find template: '+name);
  }

  var markup = this.RAW_TEMPLATES[name];

  return (new Parser(markup, {
    templateName: name,
    templates: this.RAW_TEMPLATES
  })).generate();
};

TemplateStore.prototype.isLoaded = function(templatePath) {
  return !!this.RAW_TEMPLATES[templatePath];
};

TemplateStore.prototype.isParsed = function(templatePath) {
  return !!this.TEMPLATES[templatePath];
};

TemplateStore.prototype.load = function(templatePath, markup) {
  var name = pathToName(templatePath);

  this.RAW_TEMPLATES[name] = markup;

  if (this.isParsed(name)) {
    delete this.TEMPLATES[name];
  }
};

TemplateStore.prototype.loadAndParse = function(templatePath, markup) {
  this.load(templatePath, markup);
  return this.getTemplateClass(templatePath);
};

TemplateStore.prototype.getTemplateClass = function(templatePath) {
  var name = pathToName(templatePath);

  if (!this.isParsed(name)) {
    this.TEMPLATES[name] = this._parseTemplate(name);
  }
  return this.TEMPLATES[name];
};

module.exports = TemplateStore;
