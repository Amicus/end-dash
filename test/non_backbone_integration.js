require('./support/helper');

var path = require("path")
  , expect = require("expect.js")
  , fs = require("fs")
  , generateTemplate = require("./support/generate_template")
  , Backbone = require('Backbone')
  , modelReaction = require('../lib/reactions/model')


describe("When dealing with models that are not Backbone models but support the functionality we need", function(){
  beforeEach(function(){
    var backModel = new Backbone.Model()
    this.supportedModel = function(){
      this.name = "supportedModel"
      this.get = function(key){return this.key}
      this.set = function(key, value ){this.key = value}
      this.on = function(){}
      this.once = function(){}
    }
  })
  it("Should not force my model to be a Backbone model", function(){
    var model = new this.supportedModel()
    var template = generateTemplate({user: model}, "<div class='user-'><div class='name-'></div></div>")
  })
})

describe("When dealing with models that are not Backbone models and do not support the functionality we need", function(){
  beforeEach(function(){
    var backModel = new Backbone.Model()
    this.unSupportedModel = function(){
      this.name = "unsupportedModel"
    }
  })
  it("Should force my model to be a Backbone model", function(){
    var model = new this.unSupportedModel()
    var template = generateTemplate({user: model}, "<div class='user-'><div class='name-'></div></div>")
  })
})