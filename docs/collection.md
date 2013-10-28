Collections
===========


What if I have a colletion of models that each need
to use the same template?

Great! EndDash lets you render a single template
once for every model in a collection with almost no
extra work!


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

There you go!

On your page:

```
The name is Bond, James Bond
The name is Drax, Hugo Drax
The name is Lynd, Vesper Lynd
```


## Does this HTML update on model changes?


Yes!

```javascript
drax.set('lastName', 'Jaws');
```

Your page changes to:

```
The name is Bond, James Bond
The name is Jaws, Hugo Jaws
The name is Lynd, Vesper Lynd
```

It also updates correctly if you add or remove a model
and preserves the correct ordering if the collection's
models on the page.

```javascript
bondCharacters.remove(bond);
```

Now on your page:

```
The name is Drax, Hugo Drax
The name is Lynd, Vesper Lynd
```


Polymorphic Collections
=======================

What if I want to render a collection with different templates
for some models?


No problem! In your HTML just add ' yourKeyPolymorphic- ' to the top level DOM element
of the collection. Where ' yourKey ' is the attribute which determines the template to
render.

```html
<div class='characters- bondPolymorphic-'>

//all of your templates

</div>
```

Then for each template add a 'when' clause:

```html
<div class='character- whenBond-'>
	//Your template HTML for when the model is Bond
</div>
```

## All together then

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

Now update that JS so that it knows which
character is Bond!

## In your Javascript

```javascript
var bond = new Backbone.Model({firstName: 'James', lastName: 'Bond', type: 'Bond'});
var drax = new Backbone.Model({firstName: 'Hugo', lastName: 'Drax', type: 'notBond'});
var lynd = new Backbone.Model({firstName: 'Vesper', lastName: 'Lynd', type: 'notBond'});

var bondCharacters = New Backbone.Collection([bond, drax, lynd]);
var template = EndDash.getTemplate('whatBondSays', {characters: bondCharacters});
$('body').html(template.el);
```

Now you have that classic catch phrase properly scoped to just him!

```
The name is Bond, James Bond
My name is Hugo Drax 
My name is Vesper Lynd
```

There you go! Now EndDashify some collections!

