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

TemplateStore.getLoaded= function(templatePath) {
  return RAW_TEMPLATES[pathToName(templatePath)];
};

TemplateStore.templateNameForPath = function(templatePath){
  return pathToName(templatePath);
}

TemplateStore.raw_templates = function() {
  return RAW_TEMPLATES;
}

_.bindAll(TemplateStore, 'isLoaded',
                         'isParsed',
                         'load',
                         'loadParsed',
                         'getParsed',
                         'getLoaded',
                         'templateNameForPath',
                         'raw_templates');

module.exports = TemplateStore;
