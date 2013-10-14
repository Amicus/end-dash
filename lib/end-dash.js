var _ = require('underscore'),
    Parser = require('./parser'),
    TemplateStore = require('./template_store'),
    AttributeReaction = require('./reactions/attribute'),
    CollectionReaction = require('./reactions/collection'),
    ModelReaction = require('./reactions/model'),
    VariableReaction = require('./reactions/variable'),
    ConditionalReaction = require('./reactions/conditional'),
    PartialReaction = require('./reactions/partial'),
    ViewReaction = require('./reactions/view'),
    ScopeReaction = require('./reactions/scope'),
    DebuggerReaction = require('./reactions/debugger');

  Parser.registerReaction(PartialReaction);
  Parser.registerReaction(ScopeReaction);
  Parser.registerReaction(CollectionReaction);
  Parser.registerReaction(ModelReaction);
  Parser.registerReaction(AttributeReaction);
  Parser.registerReaction(VariableReaction);
  Parser.registerReaction(ConditionalReaction);
  Parser.registerReaction(ViewReaction);
  Parser.registerReaction(DebuggerReaction);

EndDash = {}

EndDash.bindTemplate = function (templateName, model) {
  var TemplateClass = TemplateStore.getTemplate(templateName)
  return new TemplateClass(model)
}

EndDash.registerTemplate = function(templatePath, markup) {
  return TemplateStore.load(templatePath, markup)
}

EndDash.getTemplate = function(templatePath){
  return TemplateStore.getTemplate(templatePath)
}

EndDash.loadFromPage = function() {
  TemplateStore.lazyLoadFromPage()
}

EndDash.reloadPage = function() {
  TemplateStore.lazyLoadFromPage()
}

EndDash.clearAndReload = function() {
  TemplateStore.clear()
  this.reloadPage()
}

EndDash.isLoaded = function(templatePath) { //Here for testing
  return TemplateStore.isLoaded(templatePath)
}

// This is a hack to make requiring a file that ends in .js.ed
// to return a EndDash compiled version of that file
EndDash.compile = function(module, filename) {
  var fs = require('fs'),
      markup = fs.readFileSync(filename, 'utf8'),
      templateName = filename.replace(/\.js\.ed(\.erb)?$/, '');

  module.exports = TemplateStore.loadAndParse(templateName, markup);
};

// Necessary to magically override the require extensions.
if (require.extensions && !require.extensions['.ed']) {
  require.extensions['.ed'] = require.extensions['.js.ed'] = EndDash.compile;
}

module.exports = EndDash
