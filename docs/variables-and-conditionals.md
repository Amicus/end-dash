Variable Interpolation
======================

## Variables

EndDash variables are rendered into the body of HTML elements, displaying their values as ordinary text:

```html
<div class="user-">
  My name is <span class="firstName-"></span> <span class="lastName-"></span>.
</div>
```

```js
template.bind({
  user: new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark',
  });
});
```

Outputs:

```html
<div class="user-">
  My name is <span class="firstName-">Tony</span> <span class="lastName-">Stark</span>.
</div>
```

Conditionals
============

## Ternary Operator

A ternary operator is available for presence handling via 'truthiness' for attributes
interpolation:

```html
<div class="user- #{availability ? available : unavailable}">
</div>
```

## Visibility Conditionals

EndDash has truthiness controls for conditional visibility. EndDash class elements that begin with `is` or `has`,
(as well as their boolean opposites `isNot` and `hasNot`) will hide (via a `display:none` style attribute)
the element when its named attribute, with its boolean evaluation prefix, is falsy ('isNotAvailable-' will return
true if `!!model.get('available') === false`).

```html
<div class="user-">
  <p>
    My schedule is very full. <span class="isAvailable-">I just have a few openings</span>
  </p>
</div>
```

```js
template.bind({
  user: new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark',
    alias: 'IronMan',
    available: false
  });
});
```

Outputs:

```html
<div class="user-">
  <p>
    My schedule is very full.
  </p>
</div>
```