var expect = require("expect.js"),
    Parser = require('../lib/parser')

    // easier to read..
    rootElements = Parser.rootElements,
    singleElemenetMarkup = '<div id="user"></div>',
    secondElementMarkup  = '<div id="membership"></div>'
    multiElementMarkup  = singleElemenetMarkup + secondElementMarkup;


describe('rootElements', function() {
  it('parses the markup and returns each root element as a separate string', function() {
    describe('with a single root element', function() {
      expect(rootElements(singleElemenetMarkup).length).to.be(1);
    });
    describe('array response of a single root element', function() {
      expect(rootElements(singleElemenetMarkup)[0]).to.be(singleElemenetMarkup);
    });
    describe('with multiple root elements', function() {
      expect(rootElements(multiElementMarkup).length).to.be(2);
    });
    describe('array response of a multiple root element', function() {
      expect(rootElements(multiElementMarkup)[0]).to.be(singleElemenetMarkup);
      expect(rootElements(multiElementMarkup)[1]).to.be(secondElementMarkup);
    });
  });
  it('errors if multiple root elements are present by default', function() {
    RAW_TEMPLATES = {}
    multiRootParse = function() {new Parser(multiElementMarkup, {templateName: 'test',templates: RAW_TEMPLATES}) }
    expect(multiRootParse).to.throwError(/multiple root elements/);
  });
});
