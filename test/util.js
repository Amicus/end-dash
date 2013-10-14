var EndDash = require('../lib/end-dash'),
    testTemplateCount = 0;

  require('./helper')

exports.generateTemplate = function(model, markupOrPath) {
  var Template, templatePath;

  if (markupOrPath.charAt(0) === '/') {
    templatePath = markupOrPath;
    Template = EndDash.getTemplateClass(templatePath);
  } else {
    templatePath = generateTestTemplatePath();
    Template = EndDash.RegisterTemplate(templatePath, markupOrPath);
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
