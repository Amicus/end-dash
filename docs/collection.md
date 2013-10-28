Collections
===========

How do I use them?
===================

EndDash will allow you to render a single template
once for each item in your collection!

In your HTML
============

```html
<div class='characters-'>
	<div class='character-'>
		The name is
		<div class='firstName-'></div>
		, <div class='lastName-'></div>
		<div class='firstName-'></div>
	</div>
</div>
```

In your Javscript
=================

(note: Check desired templates & views are loaded
in EndDash)

```javascript
var bond = new Backbone.Model({firstName: 'James', lastName: 'Bond'});
var drax = new Backbone.Model({firstName: 'Hugo', lastName: 'Drax'});
var lynd = new Backbone.Model({firstname: 'Vesper', lastName: 'Lynd'});

var bondCharacters = New Backbone.Collection([bond, drax, lynd]);
var template = EndDash.getTemplate('whatBondSays', {characters: bondCharacters});
$('body').html(template.el);
```javascript

Volia!

In your page:

```
The name is Bond, James Bond
The name is Drax, Hugo Drax
The name is Lynd, Vesper Lynd
```

Does this HTML also  update on model changes?
=============================================

Yep!


```javascript
drax.set('lastName', 'Jaws');
```
In the browser now:

```
The name is Bond, James Bond
The name is Jaws, Hugo Jaws
The name is Lynd, Vesper Lynd
```

Or:

```javascript
bondCharacters.remove(bond);
```

In the browser now:

```
The name is Drax, Hugo Drax
The name is Lynd, Vesper Lynd
```

Polymorphic Collections
=======================

