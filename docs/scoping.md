What is Scoping?
================

Scope in EndDash refers to the model on the top of the EndDash stack.
Each template and partial is given its own scope. The 'root' scope is always the object passed
to EndDash's 'bind' or 'getTemplate' function.

```js
template.bind({
  user: new Backbone.Model({
    firstName: 'Tony',
    lastName: 'Stark',
    hobby: {
      description: 'Building all the cool technology'
    }
  })
});
```

The root object is the object literal with the property 'user'.

Scope can change in two ways:

## Scoping Down With A Dash

```html
<div class='user-'>
  //Internal HTML
</div>
```

Scopes into the Backbone Model with properties: 'firstName', 'lastName', and 'hobby'.
This syntax only allows scopping down.

## Scoping With Paths (UNIX style)

```html
<div class='user-'>
  <div data-scope='/'>
    //Iternal HTML
  </div>
</div>
```

Scopes down into the user object and then, via the data-scope property, scopes back to the root object
(the object literal with propery 'user').

Normal UNIX path shorthands apply: `..` to move back up a scope level, `/` to seperate scope levels,
`.` for the current scope'.


```html
<div class='user-'>
  //User scope
  <div class='hobby-'>
  //Hobby scope
    <div data-scope='..'>
    //Back in User Scope
      <div data-scope='/user/hobby'>
      //Back in Hobby scope
      </div>
    </div>
  </div>
</div>
```

'`class='user-'` is actually syntatic sugar for `data-scope='./user-'`.


