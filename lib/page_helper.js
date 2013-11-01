var _ = require('underscore'),
    EndDash = require('./end-dash');

// Only load HTML do not parse until template is requested
// If this is changed be aware, order matters. If templates with
// partials are parsed before their partials raw HTML are parser.js will error
exports.loadFromPage = function () {
  $('script[type="text/enddash"]').each(function() {
    var $el = $(this),
        // Need to trim whitespace or else jQuery will complain.
        markup = $.trim($el.html()),
        name = $el.attr('name');

    if (!name) {
      throw new Error("Script tags of type text/enddash must have a 'name' attribute");
    }

    EndDash.templateStore.load($el.attr('name'), markup);
  });
};
