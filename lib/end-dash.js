var _ = require('underscore'),
    Parser = require('./parser'),
    TemplateStore = require('./template_store'),
    PageHelper = require('./page_helper'),
    ViewStore = require('./view_store');

var templateStore = new TemplateStore(),
    viewStore = new ViewStore();

exports.templateStore = templateStore;

exports.registerTemplate = _.bind(templateStore.load, templateStore);

exports.getTemplateClass = _.bind(templateStore.getTemplateClass, templateStore); //Deprecated

exports.viewStore = viewStore;

exports.registerView = _.bind(viewStore.load, viewStore);

exports.setCustomGetView = _.bind(viewStore.setCustomGetView, viewStore);

exports.bootstrap = PageHelper.loadFromPage;

exports.getTemplate = function(templatePath, model) {
  var Template = this.getTemplateClass(templatePath);
  return new Template(model);
};

exports.compile = function(module, filename) {
  // This is a hack to make requiring a file that ends in .js.ed to return a
  // EndDash compiled version of that file. We need to expose it publicly,
  // because we have code that relies on it, but it's deprecated and not
  // officially a part of the public API.
  var fs = require('fs'),
      markup = fs.readFileSync(filename, 'utf8'),
      templateName = filename.replace(/\.js\.ed(\.erb)?$/, '');

  module.exports = templateStore.loadAndParse(templateName, markup);
};

var reactions = [
    // The load order matters here...
    require('./reactions/partial'),
    require('./reactions/scope'),
    require('./reactions/looping'),
    require('./reactions/deprecated_collection'),
    require('./reactions/model'),
    require('./reactions/attribute'),
    require('./reactions/variable'),
    require('./reactions/conditional'),
    require('./reactions/view'),
    require('./reactions/debugger')
  ];

_.each(reactions, Parser.registerReaction);

EndDash = module.exports


