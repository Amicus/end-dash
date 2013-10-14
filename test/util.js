var TemplateStore = require('../lib/template_store'),
    testTemplateCount = 0;

exports.generateTemplate = function(model, markupOrPath) {
  var Template, templatePath;

  if (markupOrPath.charAt(0) === '/') {
    templatePath = markupOrPath;
    Template = TemplateStore.getTemplate(templatePath);
  } else {
    templatePath = generateTestTemplatePath();
    Template = TemplateStore.loadAndParse(templatePath, markupOrPath);
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
