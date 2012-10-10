function EndDash() {

}                               
var EndDash = module.exports = 

EndDash.prototype.set = function() {
  console.log(arguments)
}

if(module && module.exports) {
  module.exports = EndDash
} else if(window) {
  window.EndDash = EndDash
}
