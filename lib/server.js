var io = require('socket.io').listen(8080)
  , fs = require('fs')

var change = function(file) {
    fs.readFile(file.replace(/~$/, ""), 'utf8', function(err, data) {
      console.log(err)
      if(err) return
      io.sockets.emit('update', { 
        file: file.replace(process.cwd(), ""), 
        contents: data.toString() 
      })
    })
  }

require('watchr').watch({
  path: process.cwd() + "/new/templates",
  duplicateDelay: 1,
  listeners: {
    change: function(changeType, filePath) {
      change(filePath)
    }, 
    error: function() {}
  } 
})

