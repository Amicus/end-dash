EndDash
-------

  EndDash is a box full of useful things!

  * *Compilable* on the server.
  * *Live reloadable* of templates, and even things bound to them! †
  *  Easily *Extensible*.
  * *Prepopulatable* with data on the server.
  *  One & two way *bindable*.

† assuming you're not shitty, and make sure all application state is stored in
either a presenter or a model.  If you're storing state in the DOM, or
somewhere else, you're going to have a bad time. (don't be shitty) 

Usage
=====

```
<div class="cause-">
  <div class="title-"></div>
  <img src="/photos/#{supporterPhotos}" />
  <ul class="supporters-">
    <li class="supporter-">
      <span class="name-"></span> has been supporting 
      <span class="title-" data-scope=".."></span> since
      <span class="startDate-"></span>
    </li>
  </ul>
</div>
```

```
var Template = require("./templates/causes/show")
  , template = new Template({ cause: cause })

template.attachTo($("body"))
```

Any changes that occur on the cause model will automatically update in the dom

Variables
---------

  To define a simple variable you just do this.

  Template

```
<div class="name-"></div>
```

  JavaScript

```
var template = new SimpleTemplate({ name: "Zach" })
```

  Output

```
<div class="name-">Zach</div>
```

  In the same vein, if you want to bind it to 
a backbone model.

  Javascript with backbone

```
var person = new Model({ name: "Zach" })
  , template = new SimpleTemplate(person)
```

This has the same output as the original. However, if I
change the `person`

```
person.set("name", "Topper")
```                 

I get the following. 

```
<div class="name-">Topper</div>
```                 

Attributes
----------

  End-dash provides a convenient syntax for binding to attributes.  given the
attribute you want to set.  Prepend data- to the attribute name and use
`#{variableName}` in the value to interpolate the attribute.

```
<div class="user-">
  <a data-href="/users/#{id}">Profile</a>
</div>
```

  If the user in this case were to have an id of 1234, this would result in.

```
<div class="user-">
  <a data-href="/users/1234">Profile</a>
</div>
```

  And, like all other properties, if the id property on user were to change
this would be automatically updated.

Conditionals
------------

  If you want to be able to hide or show an element based on a variable,
you can use a conditional. It's the variables name, prefixed with
is, has, isnt, or hasNo.

`isnt` and `hasNo` are the negation of the variable.

For example:

```
<div class="user-">
  <div class="isntConfirmed-">
    Your account has not yet been confirmed. 
  </div>
  <div class="isConfirmed-">
    <div class="hasMoney-">
      You have <div class="money-"></div> monies.
    </div>
    <div class="hasNoMoney-">
      No monies :-(
    </div>
  </div>
</div>
```

  If a variable is truthy (by the javascript definition of truthy) it will be
displayed, if it isn't truthy it won't be.

Model Blocks
------------

  Model blocks bind an element and all child elements to a new model.

```
<div class="user-">
  <div class="name-"></div>
  <div class="profile-">
    <div class="hobby-"></div>
  </div>
</div>
```

```
var user = new Model({ 
  name: "Zach",
  profile: new Model({
    hobby: "running"
  })
})

var template = new ScopeTemplate({ user: user })
```

And blam, you get:
```
<div class="user-">
  <div class="name-">Zach</div>
  <div class="profile-">
    <div class="hobby-">running</div>
  </div>
</div>
```

# ViewBinding

  When you put data-view on an element, the view will automatically be
bound to the element.  The view will get the element and model or collection 
passed in.

```
<div class="user-" data-view="users/show">
  <div class="name-">Zach</div>
</div>
```

  This will create a new view with the user- div as the `el` property and the
user model as the `model` property into a view constructor.  

  You can bind a view to any element, if you bind it to an element that does
not itself have a model, it will find the nearest ancestor element with a model
bound and pass in that.  In this case, the magic_button view, will get the
button as it's `el` and it will get the thing model as it's model.

```
<div class="thing-">
  <button data-view="magic_button_view">Magic</button>
</div>
``` 
 
# Debugging EndDash templates.

  Shit doesn't always work.  EndDash provides some useful tools to
help debug.  

  For example, maybe you have a variable, and you can't figure out why
it's not getting the right value.  From the console you can do:

```
var model = EndDash.getModel(".myElement-") 
```

To get the element's model.  Then you can interact with it and see
what's up.
