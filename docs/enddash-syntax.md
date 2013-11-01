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
  <p>Hello, <span class="resident-"></span>! Your home is listed as:</p>

  <p data-scope="/placeList" class="home-">
    <span class="home-"></span>,
    which is in
    <span class="areaNickname-"></span>,
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
      areaNickname: 'Point Dume',
      city: 'Malibu',
      state: 'CA'
    }
  }
});

template.bind(mansion);
```
For this template and this model, `template.template` will output:

```
Hello, Tony! Your home is listed as:
Stark Mansion, which is in Point Dume, a neighborhood in Malibu, CA
```