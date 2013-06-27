var Parser = require("./parser")
  , AttributeReaction = require("./reactions/attribute")
  , CollectionReaction = require("./reactions/collection")
  , ModelReaction = require("./reactions/model")
  , VariableReaction = require("./reactions/variable")
  , ConditionalReaction = require("./reactions/conditional")
  , PartialReaction = require("./reactions/partial")
  , ViewReaction = require("./reactions/view")
  , ScopeReaction = require("./reactions/scope")

module.exports = Parser


Parser.registerReaction(PartialReaction)
Parser.registerReaction(ScopeReaction)
Parser.registerReaction(CollectionReaction)
Parser.registerReaction(ModelReaction)
Parser.registerReaction(AttributeReaction)
Parser.registerReaction(VariableReaction)
Parser.registerReaction(ConditionalReaction)
Parser.registerReaction(ViewReaction)

require('./compile')
