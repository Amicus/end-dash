var EndDash = require('../../lib/end-dash'),
    PageHelper = require('../../lib/page_helper'),
    testTemplateCount = 0;

module.exports = function(model, markupOrPath) {
  var Template, templatePath;

  if (markupOrPath.charAt(0) === '/') {
    templatePath = markupOrPath;

  } else {
    templatePath = generateTestTemplatePath();
    EndDash.registerTemplate(templatePath, markupOrPath);
  }

  var template = EndDash.getTemplate(templatePath, model);
  $('body').html(template.el);

  return template;
};

// We need to generate random, unique names for templates so we don't
// accidentally overwrite stuff.
var generateTestTemplatePath = function() {
  var templatePath = '/test/support/template'+testTemplateCount;
  testTemplateCount++;
  return templatePath;
};
