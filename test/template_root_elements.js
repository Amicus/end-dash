var expect = require("expect.js"),
    Parser = require('../lib/parser'),
    singleElementMarkup = '<div id="user"></div>',
    secondElementMarkup  = '<div id="membership"></div>',
    multiElementMarkup  = singleElementMarkup + secondElementMarkup;

describe('multiple rootElements', function() {
  it('errors if multiple root elements are present by default', function() {
    multiRootParse = function() {
      new Parser(multiElementMarkup, {templateName: 'test',templates: {}});
    }
    expect(multiRootParse).to.throwError(/invalid/);
  });
});
