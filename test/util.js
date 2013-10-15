var EndDash = require('../lib/end-dash'),
    TemplateStore = require('../lib/template_store'),
    testTemplateCount = 0,
    _ = require('underscore');

exports.resetStore = function() {
  EndDash.templateStore = TemplateStore.create();
};

exports.generateTemplate = function(model, markupOrPath, options) {
  options = _.extend({
    shouldResetStore: true
  }, options);

  if (options.shouldResetStore) {
    exports.resetStore();
  };

  var templateStore = EndDash.templateStore,
      Template, templatePath;

  if (markupOrPath.charAt(0) === '/') {
    templatePath = markupOrPath;
    Template = templateStore.getTemplate(templatePath);

  } else {
    templatePath = generateTestTemplatePath();
    Template = templateStore.loadAndParse(templatePath, markupOrPath);
  }

  var template = new Template(model, {
    templateName: templatePath+'.html'
  });

  $('body').html(template.template);
  return template;
}

// We need to generate random, unique names for templates so we don't
// accidentally overwrite stuff.
var generateTestTemplatePath = function() {
  var templatePath = '/test/support/template'+testTemplateCount;
  testTemplateCount++;
  return templatePath;
};
