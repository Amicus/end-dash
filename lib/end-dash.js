var Parser = require("./parser")
  , CollectionReaction = require("./reactions/collection")
  , ModelReaction = require("./reactions/model")
  , VariableReaction = require("./reactions/variable")
  , ContentPartialReaction = require("./reactions/content_partials")

Parser.registerReaction(CollectionReaction)
Parser.registerReaction(ModelReaction)
Parser.registerReaction(VariableReaction)
Parser.registerReaction(ContentPartialReaction)

module.exports = Parser
