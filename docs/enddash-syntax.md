# EndDash Syntax Documentation

## Variables

```html
<div class="user-">
  My name is <span class="firstName-"></span> <span class="lastName-"></span>.
</div>
```

```js
template.bind({
  user: new Backbone.Model({
    firstName: 'Michael',
    lastName: 'Jackson'
  });
});
```

## Changing scope

```html
<div class="user">
  <p>Hello, <span class="nickname-"></span>! You live at:</p>

  <address data-scope="/addresses" class="home-">
    <p class="nickname-"></p>
    <p class="line1-"></p>
    <p class="line2-"></p>
  </address>
</div>
```

```js
var elvis = new Backbone.Model({
  nickname: 'Elvis',
  addresses: {
    home: {
      nickname: 'Graceland',
      line1: '3717 Elvis Presley Blvd.',
      line2: 'Memphis, TN 38116'
    }
  }
});

template.bind(elvis);
```
