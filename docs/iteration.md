Iterating through a Collection
==============================

Given a populated Backbone Collection.

```javascript
var user1 = new Backbone.Model({firstName: 'Brian', lastName: 'Newman', permission: 'basic'});
var user2 = new Backbone.Model({firstName: 'Sarah', lastName: 'Berlow', permission: 'admin'});
var user3 = new Backbone.Model({firstName: 'Sam', lastName: 'Jenkins', permission: 'basic'});

var usersCollection = new Backbone.Collection([user1, user2, user3]);
```

Iterate through the collection using data-each.
(You must be in scope of the collection)

```html
<div data-each>
  <div>
    <div class='firstName-'></div>
  </div>
</div>
```

Inside data-each there must be a single root with a set of dom elements.
This set will be bound once to each model.

On the resulting page you would see:

```
Brian
Sarah
Sam
```

Polymorphic Iteration
=====================

To iterate over a collection, passing each model to a
different template, based on a model attribute, add '<modelAttribute>Polymorphic-'

```html
<div class='permissionPolymorphic-' data-each>
  <div class='whenAdmin-'>
    // Models with Model.get('permission') == 'admin' will bind to HTML here.
    See, <div class='firstName-'></div> is here for support.
  </div>
  <div class='whenBasic-'>
    // Models with Model.get('permission') == 'basic' will bind to HTML here.
    See, <div class='firstName-'></div> is here as a user.
  </div>
</div>
```

On the resulting page you will see:

```
See, Brian is here as a user.
See, Sarah is here for support.
See, Sam is here as a user.
```

Collection Attributes
=====================

Backbone.Collection does not support attributes natively, but there are a number of
options for extending collections to do so.  EndDash supports collection attributes
as long as they are implemented as they are on Backbone.Model via the `get` method
(which Backbone.Collection natively uses only for getting a model by id, not an
attribute by name).  Typically collection attributes are used for metadata about
the collection, such as total size (if the collection is paginated and this is
different than length), as in the example below:

```html
<div class='users-' >
  <p>There are <span class='totalCount-'></span> people registered for the service.
  Here is their information:</p>
  <div data-each>
    <div class='userData'>
      <div class='firstName-'></div>
      <div class='lastName-'></div>
      <div class='email-'></div>
    </div>
  </div>
</div>
```
