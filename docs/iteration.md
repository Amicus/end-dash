Iterating through a Collection
==============================

Given a populated Backbone Collection.

```javascript
var person1 = new Backbone.Model({firstName: 'Tony', lastName: 'Stark', characterType: 'hero'});
var person2 = new Backbone.Model({firstName: 'James', lastName: 'Rhodes', characterType: 'hero'});
var person3 = new Backbone.Model({firstName: 'Pepper', lastName: 'Potts', characterType: 'civilian' });

var peopleCollection = new Backbone.Collection([person1, person2, person3]);
```

Iterate through the collection using data-each.
(You must be in scope of the collection)

```html
<ul data-each>
  <li>#{firstName} #{lastName}</li>
</ul>
```

Inside data-each there must be a single root with a set of dom elements.
This set will be bound once to each model.

On the resulting page you would see:

```
<ul data-each>
  <li>Tony Stark</li>
  <li>James Rhodes</li>
  <li>Pepper Potts</li>
</ul>
```

Polymorphic Iteration
=====================

To iterate over a collection, passing each model to a
different template, based on a model attribute, add '<modelAttribute>Polymorphic-'

```html
<div class='characterTypePolymorphic-' data-each>
  <div class='whenHero-'>
    // Models with Model.get('characterType') == 'hero' will bind to HTML here.
    #{firstName} says: Don't worry.  I'll probably save you.
  </div>
  <div class='whenVillain-'>
    // Models with Model.get('characterType') == 'villain' will bind to HTML here.
    #{firstName} says: I'm going to kill Iron Man!
  </div>
  <div class='whenCivilian-'>
    // Models with Model.get('characterType') == 'civilian' will bind to HTML here.
    #{firstName} says: I'm just a civilian!
  </div>
</div>
```

The resulting HTML will be:

```
<div class='characterTypePolymorphic-' data-each>
  <div class='whenHero-'>
    Tony says: Don't worry.  I'll probably save you.
  </div>
  <div class='whenHero-'>
    James says: Don't worry.  I'll probably save you.
  </div>
  <div class='whenCivilian-'>
    Piper says: I'm just a civilian!
  </div>
</div>
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
