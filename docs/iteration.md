Collections
===========

EndDash lets you display properties of objects in a collection.

```javascript
var characters = new Backbone.Collection([
  new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark',
    role: 'hero'
  }),

  new Backbone.Model({
    firstName: 'Pepper',
    lastName: 'Potts',
    role: 'civilian'
  },

  new Backbone.Model({
    firstName: 'Iron',
    lastName: 'Monger',
    role: 'villain'
  }),

  new Backbone.Model({
    firstName: 'James',
    lastName: 'Rhodes',
    role: 'hero'
  })
)
]);
```

```html
<div class="characters-">
  <div class="character-">
    <div class="firstName-"></div>
  </div>
</div>
```

## Polymorphic attributes

If your objects have an enum (or [Enumerated type](http://en.wikipedia.org/wiki/Enumerated_type)) field, you can specify handling based on which type it is. This is best explained with an example.

In this case, `role` is behaving as a polymorphic attribute.

```html
<div class="rolePolymorphic-" data-each>
  <p><span class="firstName-"></span> says:</p>

  <div class="whenHero-"><span class="firstName-"></span> says: Don't worry. I'll probably save you.</div>
  <div class="whenVillain-"><span class="firstName-"></span> <span class="lastName-"></span> says: Worry.</div>
  <div class="whenCivilian-"><span class="firstName-"></span> says: Get me outta here!</div>
</div>
```
The resulting HTML will be:

```
<div class="characterTypePolymorphic-" data-each>
  <div class="whenHero-">
    <span class="firstName-">Tony</span> says: Don't worry.  I'll probably save you.
  </div>
  <div class="whenCivilian-">
    <span class="firstName-">Piper</span> says: Get me outta here!
  </div>
  <div class="whenVillain-"><span class="firstName-">Iron</span> <span class="lastName-">Monger</span> says: Worry.</div>
  <div class="whenHero-">
    <span class="firstName-">James</span> says: Don't worry.  I'll probably save you.
  </div>
</div>
```

Collection Attributes
=====================

*Please note:* Backbone.Collection does *not* support attributes natively for its collections,
but there are a number of options for extending collections to do so.  EndDash supports
collection attributes as long as they are implemented according to Backbone.Model API, via
the `get` method (which Backbone.Collection natively uses only for getting a model by id,
not an attribute by name).  Typically collection attributes are used for metadata about
the collection, such as total size (if the collection is paginated and this is
different than length), as in the example below:

```html
<div class="authorizedPeople-" >
  <p>
    There are <span class="totalCount-"></span> people allowed in Tony's basement.
  </p>
</div>
```