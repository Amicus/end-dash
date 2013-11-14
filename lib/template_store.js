// This class is responsible for storing raw HTML templates when they're loaded
// and then returning template objects (lazily). It also parses templates.
var path = require('path'),
    Parser = require('./parser');

var pathToName = function(templatePath) {
  return path.normalize(templatePath);
};

function TemplateStore() {
  this.raw_templates = {};
  this.templates = {};
}

TemplateStore.prototype.parseTemplate = function(templatePath) {
  var name = pathToName(templatePath);

  if (!this.isLoaded(name)) {
    throw new Error('Could not find template: '+name);
  }

  var markup = this.raw_templates[name];

  return (new Parser(markup, {
    templateName: name,
    templates: this.raw_templates
  })).generate();
};

TemplateStore.prototype.isLoaded = function(templatePath) {
  return !!this.raw_templates[templatePath];
};

TemplateStore.prototype.isParsed = function(templatePath) {
  return !!this.templates[templatePath];
};

TemplateStore.prototype.load = function(templatePath, markup) {
  var name = pathToName(templatePath);

  this.raw_templates[name] = markup;

  if (this.isParsed(name)) {
    delete this.templates[name];
  }
};

TemplateStore.prototype.loadAndParse = function(templatePath, markup) {
  this.load(templatePath, markup);
  return this.getTemplateClass(templatePath);
};

TemplateStore.prototype.getTemplateClass = function(templatePath) {
  var name = pathToName(templatePath);

  if (!this.isParsed(name)) {
    this.templates[name] = this.parseTemplate(name);
  }
  return this.templates[name];
};

module.exports = TemplateStore;
