Variable Interpolation
======================

## Variables

EndDash variables are rendered into HTML elements when for display to the user:

```html
<div class="user-">
  My name is <span class="firstName-"></span> <span class="lastName-"></span>.
</div>
```
But they may also be used to interpolate class names, id's or other attributes as below:

```html
<div class="user-" id="#{alias}">
  My name is <span class="firstName-"></span> <span class="lastName-"></span>.
</div>
```

Conditionals
============

And a ternary operator is available for presence handling via 'truthiness' for attributes
that may be present, with or without a false condition:

```html
<div class="user- #{availability ? available : unavailable}">
  <p>
    My schedule is very full. <span class="isAvailable-">I just have a few openings</span>
  </p>
</div>
```

The same truthiness controls conditional visibility EndDash class elements that start with `is` or `has`,
and their boolean opposites `isNot` and `hasNot`, as above with `isAvailable-`.  EndDash will hide (via a
`display:none` style attribute) any such element when it's named attribute is falsy (or hide when truthy in
the case of `isNot` and `hasNot`.)


```js
template.bind({
  user: new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark',
    alias: 'IronMan'
    availability: ['10am', '2pm']
  });
});
```