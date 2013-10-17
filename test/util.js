var EndDash = require('../lib/end-dash'),
    TemplateStore = require('../lib/template_store'),
    PageHelper = require('../lib/page_helper'),
    whichTemplateLoad = 0
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
  } else {
    templatePath = generateTestTemplatePath();
    EndDash.registerTemplate(templatePath, markupOrPath);
  }

  if (whichTemplateLoad == 0) { // Alternate how template is created
    var TemplateClass = EndDash.getTemplateClass(templatePath)
    var template = new TemplateClass(model, {
      templateName: templatePath+'.html'
    });
    whichTemplateLoad++
  } else {
    var template = EndDash.getTemplate(templatePath, model)
    whichTemplateLoad--
  }

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
