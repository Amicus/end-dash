// Open up a debugger in development mode to inspect the context of the
// template.
//
// Open a context in the highest template scope:
//
// <body>
//   <div debugger />
// </body>
//
// In a child model scope:
//
// <body>
//   <div class="questions-">
//     <!-- Open a debugger in the scope of get('questions') -->
//     <div debugger />
//   </div>
// </body>
var Reaction = require('../reaction');

var DebuggerReaction = Reaction.extend({
  init: function() {
    this.listenTo(this.model, 'sync', this.startDebugger);
  },

  startDebugger: function() {
    var customDebugger = this.constructor.customDebugger;

    if (customDebugger) {
      customDebugger.apply(this);
    } else {
      /* jshint ignore:start */
      debugger;
      /* jshint ignore:end */
    }
  }
}, {
  selector: '[debugger]'
});

module.exports = DebuggerReaction;
