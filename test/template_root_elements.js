var expect = require("expect.js"),
    TemplateStore = require('../lib/template_store'),

    // easier to read..
    load = TemplateStore.load,
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
