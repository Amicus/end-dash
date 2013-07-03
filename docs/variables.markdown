##Variables in end-dash

  Every word ending with a dash is an attribute of some model. The top level variables reference the highest level model, so that any variable not nested inside another variable references the top level model.

[](root)
```coffeescript
require("../test/helper")
Model = require("Backbone").Model
EndDash = require("../lib/end-dash").generateTemplate
```
The above code just imports test/helper and the backbone default model.

[](beforeEach)
```coffeescript
SimpleVarTemplate = require("./templates/simple_variable")
model1 = new Model({var1:1})
simpleVar = new SimpleVarTemplate(model1)
$("body").html(simpleVar.template)
```
By passing in the model instance into SimplevarTemplate, we establish "model1" as the top level model in our enddash template. Thus, since it has the var1 attribute, when we call "<div class="var1">", 1 should get rendered in that div.

[](it "should populate a simple variable")
```coffeescript
console.log($('body').html())
expect($('.var1-').html()).to.be("1")
```


