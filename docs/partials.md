Partials
========

Small, reusable components of HTML can be templated in EndDash as partials.
One common use for partials is iterating through a collection.


```javascript
var person1 = new Backbone.Model({firstName: 'Tony', lastName: 'Stark', alias: 'IronMan'});
var person2 = new Backbone.Model({firstName: 'James', lastName: 'Rhodes', alias: 'WarMachine'});
var person3 = new Backbone.Model({firstName: 'Pepper', lastName: 'Potts', alias: 'none' });

var people = new Backbone.Collection([person1, person2, person3]);
```

Iterate through the collection using data-each.


```html
<h2>Characters</h2>
<h3>Cast of characters include:</h3>
<table id="members_list">
  <thead>
    <tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Alias</th>
    </tr>
  </thead>
  <tbody class="people-">
    <div data-each>
      <div src='./partials/person' data-replace></div>
    </div>
  </tbody>
</table>
```

and in your partials folder another EndDash template such as:

```html
<tr class="userRow">
  <td class="firstName-"></td>
  <td class="lastName-"></td>
  <td class="alias-"></td>
</tr>
```

The data-replace attribute tells EndDash to substitute the partial's root element for this element.
Without data-replace, EndDash will embed the root element beneat the partial's element and leave it.