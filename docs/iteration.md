Iterating through a Collection
==============================

Given a populated Backbone Collection.

```javascript
var person1 = new Backbone.Model({firstName: 'Tony', lastName: 'Stark', alias: 'IronMan'});
var person2 = new Backbone.Model({firstName: 'James', lastName: 'Rhodes', alias: 'WarMachine'});
var person3 = new Backbone.Model({firstName: 'Pepper', lastName: 'Potts', alias: 'none' });

var peopleCollection = new Backbone.Collection([person1, person2, person3]);
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
Tony
James
Pepper
```

Polymorphic Iteration
=====================

To iterate over a collection, passing each model to a
different template, based on a model attribute, add '<modelAttribute>Polymorphic-'

```html
<div class='aliasPolymorphic-' data-each>
  <div class='whenIronMan-'>
    // Models with Model.get('alias') == 'IronMan' will bind to HTML here.
    <span class='firstName-'></span> says: The truth is...  I am Iron Man.
  </div>
  <div class='whenWarMachine-'>
    // Models with Model.get('alias') == 'WarMachine' will bind to HTML here.
    <span class='firstName-'></span> says: Lt. Col. <span class='firstName-'></span>
    <span class='lastName-'></span> reporting for duty.
  </div>
  <div class='whenNone-'>
    // Models with Model.get('alias') == 'none' will bind to HTML here.
    <span class='firstName-'></span> says: I'm just a civillian!
  </div>
</div>
```

On the resulting page you will see:

```
Tony says: The truth is...  I am Iron Man.
James says: Lt. Col. James Rhodes reporting for duty.
Piper says: I'm just a civillian!
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
<div class='people-' >
  <p>
    There are <span class='totalCount-'></span> people allowed in Tony's basement.
    Here are their names:
  </p>
  <div data-each>
    <div class='authorizedPerson'>
      <div class='firstName-'></div>
      <div class='lastName-'></div>
      <div class='alias-'></div>
    </div>
  </div>
</div>
```
