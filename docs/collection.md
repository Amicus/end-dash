Collections
===========


To bind a collection's model to a set of DOM elements, add a DOM element
with a plural class and a direct child whose class is the singluar version of
this class.


```html
<div class='objects-'>
	<div class='object-'>
		<div class='firstName-'></div>
	</div>
</div>
```

The html inside the 'character-' div will then be copied and bound once to each model inside
the collection. Normal EndDash variable/attribute interpolation for each model, and corresponding 
html, will apply.

For this to work, EndDash must be able to scope into the collection you wish to iterate over.
For exmaple, using a simple anonymous model:

```javascript
var template = EndDash.getTemplate(yourTemplatesName, {characters: yourCollection});
```




Polymorphic Collections
=======================



Each model may be bound to different DOM elmenets based on a single attribute of that model. 
To do this follow the normal EndDash collection pattern (see above) and add ' attributeKeyPolymorphic- ' 
as a class to the parent element with the plural class.

```html
<div class='objects- typePolymorphic-'>
	//innerHTML
</div>
```

Then create a series of single-root child elements that have a class that is the singular of their parent 
and also a 'when' clause.

```html
<div class='objects- typePolymoprhic-'>
	<div class='object- whenA-'>
		Models with Model.get('type') == 'A' will be bound to any HTML elements here
	</div>
	<div class='object- whenB-'>
		Models with Model.get('type') == 'B' will be bound to any HTML elements here
	</div>
	<div class='object- whenC-'>
		Models with Model.get('type') == 'C' will be bound to any HTML elements here
	</div>
</div>
```

