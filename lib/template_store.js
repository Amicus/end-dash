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

TemplateStore.isLoaded = function(templatePath) {
  return !!RAW_TEMPLATES[pathToName(templatePath)];
};

TemplateStore.isParsed = function(templatePath) {
  return !!TEMPLATES[pathToName(templatePath)];
};

TemplateStore.load = function(templatePath, markup) {
  RAW_TEMPLATES[pathToName(templatePath)] = markup;
};

TemplateStore.loadParsed = function(templatePath, template) {
  TEMPLATES[pathToName(templatePath)] = template;
};

TemplateStore.getParsed = function(templatePath) {
  return TEMPLATES[pathToName(templatePath)];
};



// var _parseTemplate = function(templatePath) {
//   var name = pathToName(templatePath);

//   if (!TemplateStore.isLoaded(name)) {
//     throw new Error('Could not find template: '+name);
//   }

//   var markup = RAW_TEMPLATES[name];

//   return (new Parser(markup, {
//     templateName: name,
//     templates: RAW_TEMPLATES
//   })).generate();
// };

// TemplateStore.loadAndParse = function(templatePath, markup) {
//   this.load(templatePath, markup);
//   return this.getTemplateClass(templatePath);
// };

// TemplateStore.getTemplateClass = function(templatePath) {
//   var name = pathToName(templatePath);

//   if (!this.isParsed(name)) {
//     TEMPLATES[name] = _parseTemplate(name);
//   }
//   return TEMPLATES[name];
// };

_.bindAll(TemplateStore, 'isLoaded',
                         'isParsed',
                         'load',
                         'loadParsed');

module.exports = TemplateStore;
