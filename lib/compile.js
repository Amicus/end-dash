// We're just keeping this around because base-backbone expects it to be here.
// In the long run, we should probably not expose lib/compile.
var TemplateStore = require('./template_store'),
    EndDash = require('./end-dash'),
    _ = require('underscore');

var Compiler = EndDash.compile;
Compiler.registerTemplate = TemplateStore.load;
module.exports = Compiler;
