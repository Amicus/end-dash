Syntax Overview
===============

## Variables

```html
<div class="user-">
  My name is <span class="firstName-"></span> <span class="lastName-"></span>.
</div>
```

```js
template.bind({
  user: new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark'
  });
});
```

## Changing scope

```html
<div class="user">
  <p>Hello, <span class="resident-"></span>! Your home is listed as:</p>

  <p data-scope="/placeList" class="home-">
    <span class="home-"></span>,
    which is in
    <span class="area-"></span>,
    a neighborhood in <span class="city-"></span>, <span class="state-"></span>
  </p>
</div>
```

```js
var mansion = new Backbone.Model({
  resident: 'Tony',
  placeList: {
    home: {
      home: 'Stark Mansion',
      area: 'Point Dume',
      city: 'Malibu',
      state: 'CA'
    }
  }
});

template.bind(mansion);
```
##Usage

For the above example template and model, `template.el` will output:

```html
<div class="user">
  <p>Hello, <span class="resident-">Tony</span>! Your home is listed as:</p>

  <p data-scope="/placeList" class="home-">
    <span class="home-">Stark Mansion</span>,
    which is in
    <span class="area-">Point Dume</span>,
    a neighborhood in <span class="city-">Malibu</span>, <span class="state-">CA</span>
  </p>
</div>
```