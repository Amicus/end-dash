var expect = require("expect.js"),
    Parser = require('../lib/parser'),
    Template = require('../lib/template'),
    TemplateStore = require('../lib/template_store'),

    // easier to read..
    isLoaded = TemplateStore.isLoaded,
    isParsed = TemplateStore.isParsed,
    load = TemplateStore.load,
    loadAndParse = TemplateStore.loadAndParse,
    getTemplate = TemplateStore.getTemplate;

describe('TemplateStore', function() {
  describe('.load', function() {
    it('loads markup without parsing', function() {
      load('user', '<div id="user"></div>');
      expect(isLoaded('user')).to.be(true);
      expect(isParsed('user')).to.be(false);
    });
  });

  describe('.getTemplate', function() {
    it('retrieves loaded templates', function() {
      load('user', '<div id="user"></div>');
      var UserTemplate = getTemplate('user');
      expect(UserTemplate).to.be.a(Template.constructor);
    });

    it('returns the same Template object when called repeatedly', function() {
      load('user', '<div id="user"></div>');
      var UserTemplate = getTemplate('user'),
          UserTemplate2 = getTemplate('user');

      expect(UserTemplate2).to.equal(UserTemplate);
    });

    it('retrieves templates using a normalized path', function() {
      var BarTemplate = loadAndParse('/foo/bar', '<div id="bar"></div>');

      expect(getTemplate('/foo/bar')).to.equal(BarTemplate);
      expect(getTemplate('/foo/bar/baz/..')).to.equal(BarTemplate);
      expect(getTemplate('/foo/baz/../bar')).to.equal(BarTemplate);
    });

    it('errors when it can\'t find a template', function() {
      expect(function() {
        getTemplate('notLoaded')
      }).to.throwError(/Could not find template/);
    });

    it('parses templates that haven\'t been parsed', function() {
      load('user', '<div id="user"></div>');

      expect(isParsed('user')).to.be(false);
      getTemplate('user');
      expect(isParsed('user')).to.be(true);
    });
  });

  describe('.loadAndParse', function() {
    it('loads and parses', function() {
      loadAndParse('user', '<div id="user"></div>');

      expect(isLoaded('user')).to.be(true);
      expect(isParsed('user')).to.be(true);
    });

    it('returns a Template object', function() {
      var UserTemplate = loadAndParse('user', '<div id="user"></div>');
      expect(UserTemplate).to.be.a(Template.constructor);
    });

    it('overwrites loaded templates', function() {
      var UserTemplate = loadAndParse('user', '<div id="user"></div>'),
          UserTemplate2 = loadAndParse('user', '<div id="user"></div>');

      expect(UserTemplate2).to.not.equal(UserTemplate);
    });
  });
});
