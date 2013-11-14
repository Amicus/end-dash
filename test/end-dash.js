require('./support/helper');

var expect = require('expect.js'),
    EndDash = require('../lib/end-dash'),
    Backbone = EndDash.Backbone,
    templateStore = EndDash.templateStore,
    viewStore = EndDash.viewStore,
    Template = require('../lib/template');

describe('EndDash', function(){
  describe('.registerTemplate', function() {
    it('loads templates to the store', function(){
      EndDash.registerTemplate('partials', '<div></div>');
      expect(templateStore.isLoaded('partials')).to.be(true);
    });
  });

  describe('.registerView', function() {
    it('loads views to the store', function(){
      var EndDashTestView = {};
      EndDash.registerView('test view', EndDashTestView);
      expect(viewStore.getView('test view')).to.be(EndDashTestView);
    });
  });

  describe('.getTemplate', function() {
    it('retrieves loaded templates', function() {
      EndDash.registerTemplate('dog', '<div name="unbound-"></div>');
      var template = EndDash.getTemplate('dog');
      expect(template instanceof Template).to.be(true);
      expect(template.el.text()).to.be('');
    });

    it('binds values from the model to the template', function() {
      EndDash.registerTemplate('cat', '<div class="catName-"></div>');

      var model = new Backbone.Model({catName: 'Alabama'}),
          template = EndDash.getTemplate('cat', model);

      expect(template.el.text()).to.be('Alabama');
    });

    it('tracks changes on the model after binding', function() {
      EndDash.registerTemplate('goose', '<div class="gooseName-"></div>');

      var model = new Backbone.Model({gooseName: 'Snowy'}),
          template = EndDash.getTemplate('goose', model);

      expect(template.el.text()).to.be('Snowy');
      model.set('gooseName', 'Goosematix');
      expect(template.el.text()).to.be('Goosematix');
    });
  });

  describe('bootstrap', function() {
    describe('when loaded correctly', function() {
      before(function() {
        var fs = require('fs');
        window.document.body.innerHTML = fs.readFileSync(__dirname+'/support/templates/script_tags.js.ed');
        EndDash.bootstrap();
      });

      it('loads templates from script tags', function() {
        expect(templateStore.isLoaded('crow')).to.be(true);
      });

      it('does not load non-EndDash script tags', function() {
        expect(templateStore.isLoaded('non-end-dash')).to.be(false);
      });

      describe('when retrieved with getTemplate', function() {
        var template;

        before(function() {
          var model = new Backbone.Model({crowName: 'Caw'});
          template = EndDash.getTemplate('crow', model);
        });

        it('returns a valid template', function() {
          expect(template instanceof Template).to.be(true);
        });

        it('binds to a model correctly', function() {
          expect(template.el.text()).to.be('Caw');
        });
      });
    });

    describe('when loaded without a name', function() {
      before(function() {
        var fs = require('fs');
        window.document.body.innerHTML = fs.readFileSync(__dirname+'/support/templates/script_tags_without_name.js.ed');
      });

      it('errors if a name isn\'t provided', function() {
        expect(EndDash.bootstrap).to.throwError(/must have a 'name' attribute/);
      });
    });
  });
});
