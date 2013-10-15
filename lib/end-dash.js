var _ = require('underscore'),
    Parser = require('./parser'),
    templateStore = require('./template_store').create(),
    AttributeReaction = require('./reactions/attribute'),
    CollectionReaction = require('./reactions/collection'),
    ModelReaction = require('./reactions/model'),
    VariableReaction = require('./reactions/variable'),
    ConditionalReaction = require('./reactions/conditional'),
    PartialReaction = require('./reactions/partial'),
    ViewReaction = require('./reactions/view'),
    ScopeReaction = require('./reactions/scope'),
    DebuggerReaction = require('./reactions/debugger');

exports.templateStore = templateStore;

// These two methods are exported simply because base-backbone expects them.
// We should probably rework this interface at some point.
exports.compile = function(module, filename) {
  var fs = require('fs'),
      markup = fs.readFileSync(filename, 'utf8'),
      templateName = filename.replace(/\.js\.ed(\.erb)?$/, '');

  module.exports = templateStore.loadAndParse(templateName, markup);
};

exports.registerTemplate = _.bind(templateStore.load, templateStore);

Parser.registerReaction(PartialReaction);
Parser.registerReaction(ScopeReaction);
Parser.registerReaction(CollectionReaction);
Parser.registerReaction(ModelReaction);
Parser.registerReaction(AttributeReaction);
Parser.registerReaction(VariableReaction);
Parser.registerReaction(ConditionalReaction);
Parser.registerReaction(ViewReaction);
Parser.registerReaction(DebuggerReaction);

// Necessary to magically override the require extensions.
if (require.extensions && !require.extensions['.ed']) {
  require.extensions['.ed'] = require.extensions['.js.ed'] = exports.compile;
}
