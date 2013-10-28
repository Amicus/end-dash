Collection Iteration
====================


To iterate over a collection in EndDash, add a DOM element with a plural
class that has a single direct child with a class that is the singluar of its
parent's. 


```html
<div class='objects-'>
	<div class='object-'>
		<div class='firstName-'></div>
	</div>
</div>
```

Any HTML inside the child div ($('.object-')) will be copied and bound once to each model in
the collection. Normal EndDash variable/attribute interpolation for each model, and corresponding 
html, will apply.

For this to work, EndDash must be able to scope into the collection you wish to iterate over.
You can use a simple anonymous model to acomplish this.

```javascript
var template = EndDash.getTemplate(theTemplateName, {objects: yourCollection});
```




Polymorphic Collections Iteration
=================================



To iterate over a collection, and bind models to a different set of DOM elements based on a single attribute 
of the model. Follow the normal EndDash collection iteration rules (see above) and add a class 
' attributeKeyPolymorphic- ' to the top level element.


```html
<div class='objects- typePolymorphic-'>
	//innerHTML
</div>
```

Add your desired HTML element sets as single-root children elements of the top level element, with one class that is 
the singular of the root element and another that is a 'when' clause class.


```html
<div class='objects- typePolymoprhic-'>
	<div class='object- whenA-'>
		Models with Model.get('type') == 'A' will be bound to HTML elements here
	</div>
	<div class='object- whenB-'>
		Models with Model.get('type') == 'B' will be bound to HTML elements here
	</div>
	<div class='object- whenC-'>
		Models with Model.get('type') == 'C' will be bound to HTML elements here
	</div>
</div>
```

