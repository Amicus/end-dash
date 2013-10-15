var EndDash = require('../lib/end-dash'),
    TemplateStore = require('../lib/template_store'),
    PageHelper = require('../lib/page_helper'),
    testTemplateCount = 0;

  require('./helper')

EndDash.isTemplateLoaded = function(templatePath) {
  return TemplateStore.isLoaded(templatePath)
}

EndDash.clearAndReload = function() {
  TemplateStore.clear()
  this.loadTemplatesFromPage()
}

exports.generateTemplate = function(model, markupOrPath) {
  var Template, templatePath;

  if (markupOrPath.charAt(0) === '/') {
    templatePath = markupOrPath;
    Template = EndDash.getTemplate(templatePath);
  } else {
    templatePath = generateTestTemplatePath();
    EndDash.registerTemplate(templatePath, markupOrPath);
    Template = EndDash.getTemplate(templatePath);
  }

  var template = new Template(model, {
    templateName: templatePath+'.html'
  });

  $('body').html(template.template);
  return template;
}

exports.outerHTML = function(el) {
  return $('<div>').append(el.clone()).html()
}

// We need to generate random, unique names for templates so we don't
// accidentally overwrite stuff.
var generateTestTemplatePath = function() {
  var templatePath = '/test/support/template'+testTemplateCount;
  testTemplateCount++;
  return templatePath;
};
