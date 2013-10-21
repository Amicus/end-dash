var _ = require('underscore'),
    Parser = require('./parser'),
    TemplateStore = require('./template_store'),
    PageHelper = require('./page_helper'),
    reactions = [
      // The load order matters here...
      require('./reactions/partial'),
      require('./reactions/scope'),
      require('./reactions/collection'),
      require('./reactions/model'),
      require('./reactions/attribute'),
      require('./reactions/variable'),
      require('./reactions/conditional'),
      require('./reactions/view'),
      require('./reactions/debugger')
    ],
    viewReaction = require('./reactions/view'); //required a second time to use directly

_.each(reactions, Parser.registerReaction);

module.exports = EndDash = {};

EndDash.loadTemplatesFromPage = PageHelper.loadFromPage;
EndDash.registerTemplate = TemplateStore.load;
EndDash.getTemplateClass = TemplateStore.getTemplateClass;
EndDash.setGetViewFn = viewReaction.setGetView

EndDash.getTemplate = function(templatePath, model) {
  var Template = this.getTemplateClass(templatePath);
  return new Template(model);
}

// This is a hack to make requiring a file that ends in .js.ed to return a
// EndDash compiled version of that file. We need to expose it publicly,
// because we have code that relies on it, but it's deprecated and not
// officially a part of the public API.
EndDash.compile = function(module, filename) {
  var fs = require('fs'),
      markup = fs.readFileSync(filename, 'utf8'),
      templateName = filename.replace(/\.js\.ed(\.erb)?$/, '');

  module.exports = TemplateStore.loadAndParse(templateName, markup);
};

if (require.extensions && !require.extensions['.ed']) {
  require.extensions['.ed'] = require.extensions['.js.ed'] = exports.compile;
}
