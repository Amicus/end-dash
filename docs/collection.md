Collections
===========


To bind a collection's model to a set of DOM elements, add a DOM element
with a plural class and a direct child elment that has a class name that
is the singluar of that class name.


```html
<div class='characters-'>
	<div class='character-'>
		<div class='firstName-'></div>
	</div>
</div>
```

The html within the 'character-' div will then be copied and bound n-times, where
n is the number of models in the 'characters' collection. Normal EndDash
variable/attribute interpolation for each model, and corresponding html, apply.

For this to work, the top-level collection must be referenced as a property of another
model. This can be done with a simple anonymous model:

```javascript
var template = EndDash.getTemplate(yourTemplatesName, {characters: yourCollection});
```




Polymorphic Collections
=======================



Instead of binding each model in a collection to a copy of the same
DOM elements, it is possible to bind each model to a different set of DOM elements
based on a single attribute of that model.

To do this add ' keyNamePolymorphic- ' to the top level collection scoping.

```html
<div class='objects- typePolymorphic-'>
	//innerHTML
</div>
```

And add a 'when' clause to the root of each set of DOM elements.

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

