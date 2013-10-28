Collections
===========



In EndDash it is easy to render a single template
once for every model in a collection.


## In your HTML


```html
<div class='characters-'>
	<div class='character-'>
		The name is <span class='firstName-'></span>
		, <span class='lastName-'></span>
		<span class='firstName-'></span>
	</div>
</div>
```


## In your Javscript



(note: Load desired templates & views in EndDash first)

```javascript
var bond = new Backbone.Model({firstName: 'James', lastName: 'Bond'});
var drax = new Backbone.Model({firstName: 'Hugo', lastName: 'Drax'});
var lynd = new Backbone.Model({firstName: 'Vesper', lastName: 'Lynd'});

var bondCharacters = New Backbone.Collection([bond, drax, lynd]);
var template = EndDash.getTemplate('whatBondSays', {characters: bondCharacters});
$('body').html(template.el);
```

There you go.

Displayed on your page will be:

```
The name is Bond, James Bond
The name is Drax, Hugo Drax
The name is Lynd, Vesper Lynd
```


## Does this HTML update on model changes?



Yes it will. Doing:

```javascript
drax.set('lastName', 'Jaws');
```

Will cause the page to change to:

```
The name is Bond, James Bond
The name is Jaws, Hugo Jaws
The name is Lynd, Vesper Lynd
```

Your HTML will also update automatically when you add
or remove models.

```javascript
bondCharacters.remove(bond);
```

After the above line is run, your page will look like this:

```
The name is Drax, Hugo Drax
The name is Lynd, Vesper Lynd
```


Polymorphic Collections
=======================

If you want to render a collection with different templates
based on on the model's attributes, first add ' yourKeyPolymorphic- ' to the top level DOM element
of the collection. Where ' yourKey ' is a attribute that determines which template to
render.

```html
<div class='characters- bondPolymorphic-'>

//all of your templates

</div>
```

Then for each nested template add a 'when' clause:

```html
<div class='character- whenBond-'>

	//Your template HTML for when the model is Bond

</div>
```

Finally, define this attribute on your models as desired.

```javascript
var bond = new Backbone.Model({firstName: 'James', lastName: 'Bond', type: 'Bond'});
var drax = new Backbone.Model({firstName: 'Hugo', lastName: 'Drax', type: 'notBond'});
var lynd = new Backbone.Model({firstName: 'Vesper', lastName: 'Lynd', type: 'notBond'});
```


All together:


## In your HTML

```html
<div class='characters- typePolymorphic-'>
	<div class='character- whenBond-'>
		The name is <span class='firstName-'></span>
		, <span class='lastName-'></span>
		<span class='firstName-'></span>
	</div>
	<div class='character- whenNotBond-'>
		My name is
		<span class='firstName-'></span>
		<span class='lastName-'></span>
	</div>
</div>
```


## In your Javascript

```javascript
var bond = new Backbone.Model({firstName: 'James', lastName: 'Bond', type: 'Bond'});
var drax = new Backbone.Model({firstName: 'Hugo', lastName: 'Drax', type: 'notBond'});
var lynd = new Backbone.Model({firstName: 'Vesper', lastName: 'Lynd', type: 'notBond'});

var bondCharacters = New Backbone.Collection([bond, drax, lynd]);
var template = EndDash.getTemplate('whatBondSays', {characters: bondCharacters});
$('body').html(template.el);
```

Now our HTML displays Bond's catch phrase in a cinematically accurate way.

```
The name is Bond, James Bond
My name is Hugo Drax 
My name is Vesper Lynd
```


Attributes on Collections
=========================



If you extend Collections to have an attributes interface identical
to Backbone Models, EndDash will correctly render and update these attributes
as if they were properties on a Model.

## In your Javascript


```javascript

var bond = new Backbone.Model({firstName: 'James', lastName: 'Bond'});
var drax = new Backbone.Model({firstName: 'Hugo', lastName: 'Drax'});
var lynd = new Backbone.Model({firstName: 'Vesper', lastName: 'Lynd'});

var bondCharacters = New Backbone.ExtendCollection([bond, drax, lynd]);
bondCharacters.set('description', 'There once were a great set of characters:');
var template = EndDash.getTemplate('whatBondSays', {characters: bondCharacters});
$('body').html(template.el);
```

## In your HTML


```html
<div>
	<div class='characters-'>
		<div class='description-'></div>
	</div>
	<div class='characters-'>
		<div class='character-'>
		The name is <span class='firstName-'></span>
		, <span class='lastName-'></span>
		<span class='firstName-'></span>
	</div>
</div>
```

Your page now display:

```
There once was a great set of characters:
The name is Bond, James Bond
The name is Drax, Hugo Drax
The name is Lynd, Vesper Lynd
```


note: This assumes you extended Collections with getters, setters, and 
events as described earlier.

