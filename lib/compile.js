// We're just keeping this around because base-backbone expects it to be here.
// In the long run, we should probably not expose lib/compile.
var EndDash = require('./end-dash'),
    Compiler = EndDash.compile;

Compiler.registerTemplate = EndDash.registerTemplate;
module.exports = Compiler;
