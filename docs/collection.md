Iterating through a Collection
==============================

Given a populated Backbone Collection.

```javascript
var user1 = new Backbone.Model({firstName: 'Brian', lastName: 'Newman', type: 'basic'});
var user2 = new Backbone.Model({firstName: 'Sarah', lastName: 'Berlow', type: 'admin'});
var user3 = new Backbone.Model({firstName: 'Sam', lastName: 'Jenkins', type: 'basic'});

var usersCollection = new Backbone.Collection([user1, user2, user3]);
```

Iterate through this collection using a DOM element with a plural
class name ending in a dash.

```html
<div class='users-'>
</div>
```

Add a child element with the singular version of its parent's class name.

```html
<div class='users-'>
	<div class='user-'>
	</div>
</div>
```

Add any HTML into this child you would like.

```html
<div class='users-'>
	<div class='user-'>
		<div class='firstName-'></div>
	</div>
</div>
```

Each child model in the collection will bind to the HTML in
this child element.

```
Brian
Sarah
Sam
```

EndDash needs to scope into this collection, so add it to a
a higher level object as a property. You can use a simple anonymous 
model.

```javascript
var template = EndDash.getTemplate(theTemplateName, {users: yourCollection});
```

## Iterating with more then one template

To iterate over a collection, binding each model 
to an object based on its attribute, add a polymorphic
key to your plural, collection, class name.

```html
<div class='users- typePolymorphic-'>
</div>
```

The above makes EndDash bind models based on their
'type' property.

Next create a relationship between values of the 'type'
property and HTML elements. Use the EndDash 'when' clause.

```html
<div class='users-'>
	<div class='user'->
		<div class='whenAdmin-'>
			Models with Model.get('type') == 'admin' will bind to HTML here.
			See, <div class='firstName-'></div> is here.
		</div>
		<div class='whenBasic-'>
			Models with Model.get('type') == 'basic' will bind to HTML here. 
			See, <div class='firstName-'></div> is here.
		</div>
	</div>
</div>
```

Now you get.

```
Models with Model.get('type') == 'basic' will bind to HTML here. 
See, Brian is here.
Models with Model.get('type') == 'admin' will bind to HTML here.
See, Sarah is here.
Models with Model.get('type') == 'basic' will bind to HTML here. 
See, Sam is here.
```
