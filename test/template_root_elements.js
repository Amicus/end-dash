var expect = require("expect.js"),
    Parser = require('../lib/parser'),
    Template = require('../lib/template'),
    TemplateStore = require('../lib/template_store'),

    // easier to read..
    isLoaded = TemplateStore.isLoaded,
    isParsed = TemplateStore.isParsed,
    load = TemplateStore.load,
    loadAndParse = TemplateStore.loadAndParse,
    getTemplateClass = TemplateStore.getTemplateClass,
    rootElements = TemplateStore.rootElements;

describe('rootElements', function() {
  it('parses the markup and returns each root element as a separate string', function() {
    describe('with a single root element', function() {
      load('singleRoot', '<div id="user"></div>');
      expect(rootElements('singleRoot').length).to.be(1);
    });
    describe('array response of a single root element', function() {
      load('singleRoot', '<div id="user"></div>');
      expect(rootElements('singleRoot')[0]).to.be('<div id="user"></div>');
    });
    describe('with multiple root elements', function() {
      load('singleRoot', '<div id="user"></div><div id="membership"></div>');
      expect(rootElements('singleRoot').length).to.be(2);
    });
    describe('array response of a multiple root element', function() {
      load('singleRoot', '<div id="user"></div><div id="membership"></div>');
      expect(rootElements('singleRoot')[0]).to.be('<div id="user"></div>');
      expect(rootElements('singleRoot')[1]).to.be('<div id="membership"></div>');
    });
  });
});
