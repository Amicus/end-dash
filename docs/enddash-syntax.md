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
    lastName: 'Stark',
    alias: 'IronMan'
  });
});
```

## Changing scope

```html
<div class="user">
  <p>Hello, <span class="resident-"></span>! You live at:</p>

  <address data-scope="/addresses" class="home-">
    <p class="homeName-"></p>
    <p class="areaName-"></p>
    <p class="cityName-"></p>
    <p class="state-"></p>
  </address>
</div>
```

```js
var mansion = new Backbone.Model({
  resident: 'Tony',
  addresses: {
    home: {
      homeName: 'Mansion',
      areaName: 'Point Dume',
      cityName: 'Malibu',
      state: 'CA'
    }
  }
});

template.bind(mansion);
```
