[](root)
```coffeescript
require("../test/support/helper")
Model = require("backbone").Model
EndDash = require("../lib/end-dash")
```
##Attribute Interpolation

### Example 1:

Attribute interpolation allows attributes on a backbone model to get inserted into some tags attribute. We do this using #{} syntax, as shown below

[](beforeEach)
```coffeescript
AttributesTemplate = require("./templates/attributes")
john = new Model({name:'John'})
attributesTemplate = new AttributesTemplate(john)
$("body").html(attributesTemplate.template)
```
The generation of a template instance on line 17 populates the #{name} attribute with 'John'. Then we insert this instance into the DOM.

[](it "should populate correctly")
```coffeescript
  expect($(".div1").attr('value')).to.be("John")
```

By default the insertion into the AttributesTemplate creates an anonymous model, which has the attribute name = 'John'. Notice that the following, however, would not populate #{name}:

[](it "should not populate correctly")
```coffeescript
  expect($(".user-").attr('class')).to.not.be("user- John")
```
However, if we pass an object with a user value equal to john into the template, only the second div will populate. Note that the class is parsed as a model because there is a "p" element inside of it.

### Example 2:
[](it "should populate only the second #{name}")
```coffeescript
  AttributesTemplate = require("./templates/attributes")
  aaron = new Model({name:'Aaron'})
  attributesTemplate = new AttributesTemplate({user:aaron})
  $("body").html(attributesTemplate.template)
  # expect($(".div1").attr('value')).to.be("")
  expect($(".user-").attr('class')).to.be("user- Aaron")
```

Notice that we could also populate the name as an attribute of a named 
