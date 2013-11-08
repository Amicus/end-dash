Attribute Interpolation
=======================

Model properties can be interpolated into html tag attributes.

```html
<a href='/person/#{firstName}'> Home Page </a>
```

```js
template.bind(new Backbone.Model({firstName: 'Derrick'}));
```

Resulting tag:

```html
<a href='/person/Derrick'> Home Page </a>
```