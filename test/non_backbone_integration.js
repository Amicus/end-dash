require('./support/helper');

var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , generateTemplate = require("./support/generate_template")
  , Backbone = require('Backbone');

delete require.cache[require.resolve('Backbone')];
var BackboneClone = require('Backbone');// Internally we use !(model instanceof Backbone.Model || ... instanceof Backbone.Collection)
                                        // If the Backbone for EndDash is different then the clients, we want to handle this case.
                                        // See lib/reactions/model.js for fix.
describe("With a set of models, collections, and a template", function(){
  beforeEach(function(){
    this.literalModel1 = {persisted: "Chelsa Piers", hook: '1'}
    this.literalModel2 = {persisted: "Columbus circle", hook: '2'}
    this.literalModel3 = {persisted: "Soho", hook: '3'};
    this.cloneModel1 = new BackboneClone.Model({persisted: "Chelsa Piers", hook: '1'})
    this.cloneModel2 = new BackboneClone.Model({persisted: "Columbus circle", hook: '2'})
    this.cloneModel3 = new BackboneClone.Model({persisted: "Soho", hook: '3'});
    this.backboneModel1 = new Backbone.Model({persisted: "Chelsa Piers", hook: '1'})
    this.backboneModel2 = new Backbone.Model({persisted: "Columbus circle", hook: '2'})
    this.backboneModel3 = new Backbone.Model({persisted: "Soho", hook: '3'});
    this.modelHTMLTemplate = "<div class='user-'>" +
                                "<div class='persisted-'>" +
                                "</div>" +
                              "</div>";
    this.collectionHTMLTemplate = "<div class='users-'>" +
                                    "<div class ='user-'>" +
                                      "<div class=' #{hook} persisted-'>" +
                                      "</div>" +
                                    "</div>" +
                                  "</div>";
  })

  describe("binding a backbone model from a different backbone object", function(){
    beforeEach(function(){
      this.template = generateTemplate({user: this.cloneModel1}, this.modelHTMLTemplate)
    })
    it("should interpolate the model's attribute into the html", function(){
      expect($('.persisted-').html()).to.be('Chelsa Piers');
    })
    it("should update the corrosponding attribute", function(){
      this.cloneModel1.set('persisted', 'Changed');
      expect($('.persisted-').html()).to.be('Changed');
    })
  })

  describe("With a backbone model", function(){
    it("binding it to a template should work normally", function(){
      var template = generateTemplate({user: this.backboneModel1}, this.modelHTMLTemplate);
      expect($('.persisted-').html()).to.be('Chelsa Piers');
      this.backboneModel1.set('persisted', 'Changed');
      expect($('.persisted-').html()).to.be('Changed');
    })
  })

  describe("With a backbone collection from a different backbone object", function(){
    beforeEach(function(){
      this.collection = new BackboneClone.Collection();
    })
    describe("With models from a different backbone object", function(){
      it("binding the collection and models to a template should work normally", function(){
        this.collection.add([this.cloneModel1, this.cloneModel2, this.cloneModel3]);
        var template = generateTemplate({users: this.collection}, this.collectionHTMLTemplate);
        expect($('.1').html()).to.be(this.cloneModel1.get('persisted'));
        expect($('.2').html()).to.be(this.cloneModel2.get('persisted'));
        expect($('.3').html()).to.be(this.cloneModel3.get('persisted'));
        this.cloneModel1.set('persisted', 'Changed1');
        this.cloneModel2.set('persisted', 'Changed2');
        this.cloneModel3.set('persisted', 'Changed3');
        expect($('.1').html()).to.be(this.cloneModel1.get('persisted'));
        expect($('.2').html()).to.be(this.cloneModel2.get('persisted'));
        expect($('.3').html()).to.be(this.cloneModel3.get('persisted'));
      })
    })

    describe("With anonymous models, binding the collection and models to a template ", function(){
      it("should interpolate values but not update on model changes", function(){
        this.collection.add([this.literalModel1, this.literalModel2, this.literalModel3]);
        var template = generateTemplate({users: this.collection}, this.collectionHTMLTemplate);
        expect($('.1').html()).to.be(this.literalModel1.persisted);
        expect($('.2').html()).to.be(this.literalModel2.persisted);
        expect($('.3').html()).to.be(this.literalModel3.persisted);
        this.literalModel1.persisted = 'Changed1';
        this.literalModel2.persisted = 'Changed2';
        this.literalModel3.persisted = 'Changed3';
        expect($('.1').html()).to.be("Chelsa Piers");
        expect($('.2').html()).to.be("Columbus circle");
        expect($('.3').html()).to.be("Soho");
      })
    })

    describe("With a mix of different model kinds", function(){
      it("binding them to a template should still work for each as expected", function(){
        this.collection.add([this.cloneModel1, this.literalModel2, this.backboneModel3]);
        var template = generateTemplate({users: this.collection}, this.collectionHTMLTemplate);
        expect($('.1').html()).to.be(this.cloneModel1.get('persisted'));
        expect($('.2').html()).to.be(this.literalModel2.persisted);
        expect($('.3').html()).to.be(undefined);
        this.cloneModel1.set('persisted', 'Changed1');
        this.literalModel2.persisted = 'Changed2';
        this.backboneModel3.set('persisted', 'Changed3');
        expect($('.1').html()).to.be(this.cloneModel1.get('persisted'));
        expect($('.2').html()).to.be("Columbus circle");
        expect($('.3').html()).to.be(undefined);
      })
    })
  })


  describe("With a backbone collection from the same backbone object", function(){
    beforeEach(function(){
      this.collection = new Backbone.Collection();
    })

    describe("With models from a different backbone object", function(){
      it("Binding them to a template should not work properly", function(){
        this.collection.add([this.cloneModel1, this.cloneModel2, this.cloneModel3]);
        var template = generateTemplate({users: this.collection}, this.collectionHTMLTemplate);
        expect($('.1').html()).to.be(undefined);
        expect($('.2').html()).to.be(undefined);
        expect($('.3').html()).to.be(undefined);
        this.cloneModel1.set('persisted', 'Changed1');
        this.cloneModel2.set('persisted', 'Changed2');
        this.cloneModel3.set('persisted', 'Changed3');
        expect($('.1').html()).to.be(undefined);
        expect($('.2').html()).to.be(undefined);
        expect($('.3').html()).to.be(undefined);
      })
    })

    describe("With models from the same backbone object", function(){
      it("binding them to a template should work normally", function(){
        this.collection.add([this.backboneModel1, this.backboneModel2, this.backboneModel3]);
        var template = generateTemplate({users: this.collection}, this.collectionHTMLTemplate);
        expect($('.1').html()).to.be(this.backboneModel1.get('persisted'));
        expect($('.2').html()).to.be(this.backboneModel2.get('persisted'));
        expect($('.3').html()).to.be(this.backboneModel3.get('persisted'));
        this.backboneModel1.set('persisted', 'Changed1');
        this.backboneModel2.set('persisted', 'Changed2');
        this.backboneModel3.set('persisted', 'Changed3');
        expect($('.1').html()).to.be(this.backboneModel1.get('persisted'));
        expect($('.2').html()).to.be(this.backboneModel2.get('persisted'));
        expect($('.3').html()).to.be(this.backboneModel3.get('persisted'));
      })
    })

    describe("With anonymous models binding the collection/models to a template ", function(){
      it("should still interpolate values but changes will not be updated", function(){
        this.collection.add([this.literalModel1, this.literalModel2, this.literalModel3]);
        var template = generateTemplate({users: this.collection}, this.collectionHTMLTemplate);
        expect($('.1').html()).to.be(this.literalModel1.persisted);
        expect($('.2').html()).to.be(this.literalModel2.persisted);
        expect($('.3').html()).to.be(this.literalModel3.persisted);
        this.literalModel1.persisted = 'Changed1';
        this.literalModel2.persisted = 'Changed2';
        this.literalModel3.persisted = 'Changed3';
        expect($('.1').html()).to.be("Chelsa Piers");
        expect($('.2').html()).to.be("Columbus circle");
        expect($('.3').html()).to.be("Soho");
      })
    })

    describe("With a mix of different model kinds", function(){
      it("binding them to a template should still work for each type as expected", function(){
        this.collection.add([this.backboneModel1, this.literalModel2, this.cloneModel3]);
        var template = generateTemplate({users: this.collection}, this.collectionHTMLTemplate);
        expect($('.1').html()).to.be(this.backboneModel1.get('persisted'));
        expect($('.2').html()).to.be(this.literalModel2.persisted);
        expect($('.3').html()).to.be(undefined);
        this.backboneModel1.set('persisted', 'Changed1');
        this.literalModel2.persisted = 'Changed2';
        this.cloneModel3.set('persisted', 'Changed3');
        expect($('.1').html()).to.be(this.backboneModel1.get('persisted'));
        expect($('.2').html()).to.be("Columbus circle");
        expect($('.3').html()).to.be(undefined);
      })
    })
  })
})









