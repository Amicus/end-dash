Attribute Interpolation
=======================

Model properties can also be interpolated into any html tag attribute.

```html
<a href='/person/#{firstName}'> Home Page </a>
```

```js
template.bind(new Backbone.Model({firstName: 'Derrick'}));
```

Resulting Tag:

```html
<a href='/person/Derrick'> Home Page </a>
```