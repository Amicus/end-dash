var Parser = require("./parser")
  , CollectionReaction = require("./reactions/collection")
  , ModelReaction = require("./reactions/model")
  , VariableReaction = require("./reactions/variable")

Parser.registerReaction(CollectionReaction)
Parser.registerReaction(ModelReaction)
Parser.registerReaction(VariableReaction)

module.exports = Parser
