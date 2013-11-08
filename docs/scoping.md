What is Scoping?
================

Scope in EndDash refers to the model that is on top of the EndDash stack.
Every template and partial has its own scope. The `root` scope is always the object passed
to EndDash's `bind` or `getTemplate`.

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

The root object is the literal object with the property `user`.

Scope can change in two ways:

## Scoping Down With A Dash

```html
<div class='user-'>
  //Internal HTML
</div>
```

Scopes down into the Backbone Model with properties: `firstName`, `lastName`, and `hobby`.
Notice this only allows scopping down.


## Scoping Relatively (UNIX style)

```html
<div class='user-'>
  <div data-scope='/'>
    //Iternal HTML
  </div>
</div>
```

We scope down into user and then, via the data-scope property, scope back to the root level object
(the literal array with propery `user`).

Normal UNIX path shorthand apply: `..` to move back up a scope level, `/` to seperate scope levels.


```html
<div class='user-'>
  //User scope
  <div class='hobby-'>
  //Hobby scope
    <div class='../'>
    //Back in User Scope
      <div class='/user/hobby'>
      //Back in Hobby scope
      </div>
    </div>
  </div>
</div>
```


